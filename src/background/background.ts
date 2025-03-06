// Initialize TensorFlow.js
async function initTensorFlow() {
  try {
    const tf = await import('@tensorflow/tfjs');
    const { load } = await import('@tensorflow-models/universal-sentence-encoder');
    return { tf, load };
  } catch (error: any) {
    console.error('Error initializing TensorFlow:', error);
    throw new Error(error.message || 'Failed to initialize TensorFlow');
  }
}

let model: any = null;
let isModelLoading = false;

// Initialize the Universal Sentence Encoder model
async function initModel() {
  if (isModelLoading) {
    // Wait for the existing load to complete
    while (isModelLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return model;
  }

  if (model) {
    return model;
  }

  try {
    isModelLoading = true;
    const { load } = await initTensorFlow();
    model = await load();
    console.log('TensorFlow model loaded successfully');
    return model;
  } catch (error: any) {
    console.error('Error loading TensorFlow model:', error);
    throw new Error(error.message || 'Failed to load TensorFlow model');
  } finally {
    isModelLoading = false;
  }
}

interface Tab {
  id?: number;
  title?: string;
  url?: string;
  favIconUrl?: string;
  windowId?: number;
}

// Simple text similarity function using Levenshtein distance
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) {
    return 1.0;
  }
  
  const costs: number[] = [];
  for (let i = 0; i <= shorter.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= longer.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (shorter[i - 1] !== longer[j - 1]) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) {
      costs[longer.length] = lastValue;
    }
  }
  return (longer.length - costs[longer.length - 1]) / longer.length;
}

// Process tabs and group them
function processTabGroups(tabs: chrome.tabs.Tab[]) {
  const groups: { [key: string]: number[] } = {};
  const threshold = 0.3; // Similarity threshold

  for (let i = 0; i < tabs.length; i++) {
    let assigned = false;
    const tabText = (tabs[i].title || '') + ' ' + (tabs[i].url || '');
    
    for (const groupId in groups) {
      const groupTabs = groups[groupId].map(idx => tabs[idx]);
      const groupText = (groupTabs[0].title || '') + ' ' + (groupTabs[0].url || '');
      const sim = similarity(tabText.toLowerCase(), groupText.toLowerCase());
      
      if (sim > threshold) {
        groups[groupId].push(i);
        assigned = true;
        break;
      }
    }
    
    if (!assigned) {
      groups[`group_${Object.keys(groups).length + 1}`] = [i];
    }
  }

  return groups;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ANALYZE_TABS') {
    try {
      // Use the filtered tabs from the request if available
      if (request.tabs) {
        const groups = processTabGroups(request.tabs);
        sendResponse({ success: true, groups });
      } else {
        // Fallback to querying tabs if not provided
        const queryOptions: chrome.tabs.QueryInfo = request.windowId 
          ? { windowId: request.windowId }
          : {};

        chrome.tabs.query(queryOptions, (tabs) => {
          const groups = processTabGroups(tabs);
          sendResponse({ success: true, groups });
        });
      }
    } catch (error: any) {
      console.error('Error in tab analysis:', error);
      sendResponse({ success: false, error: error.message || 'Unknown error occurred' });
    }
    return true; // Will respond asynchronously
  }
}); 