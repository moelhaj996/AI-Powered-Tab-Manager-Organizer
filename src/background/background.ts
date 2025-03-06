import * as tf from '@tensorflow/tfjs';
import { load } from '@tensorflow-models/universal-sentence-encoder';

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

// Process tabs and group them using the AI model
async function processTabGroups(tabs: chrome.tabs.Tab[]) {
  try {
    const currentModel = await initModel();
    
    if (!currentModel) {
      throw new Error('Failed to initialize AI model');
    }

    const tabTexts = tabs.map(tab => tab.title + ' ' + (tab.url || ''));
    const embeddings = await currentModel.embed(tabTexts);
    
    // Convert embeddings to array for clustering
    const vectors = await embeddings.array();
    
    // Simple clustering based on cosine similarity
    const groups: { [key: string]: number[] } = {};
    const threshold = 0.7;

    for (let i = 0; i < vectors.length; i++) {
      let assigned = false;
      for (const groupId in groups) {
        const groupVectors = groups[groupId].map(idx => vectors[idx]);
        const similarity = cosineSimilarity(vectors[i], groupVectors[0]);
        if (similarity > threshold) {
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
  } catch (error: any) {
    console.error('Error processing tab groups:', error);
    throw new Error(error.message || 'Failed to process tab groups');
  }
}

// Helper function to calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ANALYZE_TABS') {
    chrome.tabs.query({ currentWindow: true }, async (tabs) => {
      try {
        const groups = await processTabGroups(tabs);
        sendResponse({ success: true, groups });
      } catch (error: any) {
        console.error('Error in tab analysis:', error);
        sendResponse({ success: false, error: error.message || 'Unknown error occurred' });
      }
    });
    return true; // Will respond asynchronously
  }
}); 