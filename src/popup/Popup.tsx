import React, { useEffect, useState } from 'react';
import { Tab, TabGroup, Window, TabAction } from '../types';

const Popup: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [windows, setWindows] = useState<Window[]>([]);
  const [groups, setGroups] = useState<{ [key: string]: Tab[] }>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<number | 'all'>('all');

  useEffect(() => {
    // Load all windows and their tabs
    chrome.windows.getAll({ populate: true }, (chromeWindows) => {
      const formattedWindows = chromeWindows.map(window => ({
        id: window.id!,
        focused: window.focused,
        tabs: window.tabs?.map(tab => ({
          id: tab.id,
          title: tab.title || '',
          url: tab.url || '',
          favIconUrl: tab.favIconUrl,
          windowId: tab.windowId,
          active: tab.active,
          pinned: tab.pinned
        })) || []
      }));
      setWindows(formattedWindows);

      // Combine all tabs from all windows
      const allTabs = formattedWindows.flatMap(w => w.tabs);
      setTabs(allTabs);
    });
  }, []);

  const handleTabAction = async (action: TabAction) => {
    try {
      switch (action.type) {
        case 'CLOSE':
          await chrome.tabs.remove(action.tabId);
          setTabs(tabs.filter(tab => tab.id !== action.tabId));
          break;
        case 'PIN':
          await chrome.tabs.update(action.tabId, { pinned: true });
          setTabs(tabs.map(tab => 
            tab.id === action.tabId ? { ...tab, pinned: true } : tab
          ));
          break;
        case 'UNPIN':
          await chrome.tabs.update(action.tabId, { pinned: false });
          setTabs(tabs.map(tab => 
            tab.id === action.tabId ? { ...tab, pinned: false } : tab
          ));
          break;
        case 'MOVE':
          if (action.targetWindowId) {
            await chrome.tabs.move(action.tabId, { windowId: action.targetWindowId, index: -1 });
            // Refresh windows after move
            chrome.windows.getAll({ populate: true }, (chromeWindows) => {
              setWindows(chromeWindows.map(window => ({
                id: window.id!,
                focused: window.focused,
                tabs: window.tabs?.map(tab => ({
                  id: tab.id,
                  title: tab.title || '',
                  url: tab.url || '',
                  favIconUrl: tab.favIconUrl,
                  windowId: tab.windowId,
                  active: tab.active,
                  pinned: tab.pinned
                })) || []
              })));
            });
          }
          break;
      }
    } catch (err) {
      console.error('Error performing tab action:', err);
      setError('Failed to perform tab action. Please try again.');
    }
  };

  const handleAnalyzeTabs = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await new Promise<{ groups: { [key: string]: number[] } }>((resolve) => {
        chrome.runtime.sendMessage({ 
          type: 'ANALYZE_TABS',
          windowId: selectedWindow === 'all' ? undefined : selectedWindow
        }, resolve);
      });

      // Convert group indices to actual tab objects
      const tabGroups = Object.entries(response.groups).reduce((acc, [groupId, indices]) => {
        acc[groupId] = indices.map(index => tabs[index]);
        return acc;
      }, {} as { [key: string]: Tab[] });

      setGroups(tabGroups);
    } catch (err) {
      setError('Failed to analyze tabs. Please try again.');
      console.error('Error analyzing tabs:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCloseGroup = async (groupId: string) => {
    const tabsToClose = groups[groupId];
    const tabIds = tabsToClose.map(tab => tab.id).filter((id): id is number => id !== undefined);
    
    try {
      await chrome.tabs.remove(tabIds);
      const newGroups = { ...groups };
      delete newGroups[groupId];
      setGroups(newGroups);
      setTabs(tabs.filter(tab => !tabIds.includes(tab.id!)));
    } catch (err) {
      console.error('Error closing group:', err);
      setError('Failed to close tab group. Please try again.');
    }
  };

  return (
    <div className="w-96 p-4">
      <h1 className="text-2xl font-bold mb-4">AI Tab Manager</h1>
      
      {/* Window Selection */}
      <div className="mb-4">
        <select
          className="w-full p-2 border rounded"
          value={selectedWindow}
          onChange={(e) => setSelectedWindow(e.target.value === 'all' ? 'all' : Number(e.target.value))}
        >
          <option value="all">All Windows</option>
          {windows.map((window, index) => (
            <option key={window.id} value={window.id}>
              Window {index + 1} ({window.tabs.length} tabs)
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {Object.entries(groups).map(([groupId, groupTabs]) => (
        <div key={groupId} className="border rounded p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Group {groupId}</h2>
            <div className="space-x-2">
              <button
                onClick={() => handleCloseGroup(groupId)}
                className="text-red-600 hover:text-red-800 px-2 py-1 rounded"
                title="Close all tabs in this group"
              >
                Close Group
              </button>
            </div>
          </div>
          <ul className="space-y-2">
            {groupTabs.map((tab) => (
              <li key={tab.id} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded">
                <div className="flex items-center space-x-2 flex-1">
                  {tab.favIconUrl && (
                    <img src={tab.favIconUrl} alt="" className="w-4 h-4" />
                  )}
                  <span className="truncate flex-1" onClick={() => tab.id && chrome.tabs.update(tab.id, { active: true })}>
                    {tab.title}
                  </span>
                </div>
                <div className="space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => tab.id && handleTabAction({ type: tab.pinned ? 'UNPIN' : 'PIN', tabId: tab.id })}
                    className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded"
                    title={tab.pinned ? "Unpin tab" : "Pin tab"}
                  >
                    📌
                  </button>
                  <button
                    onClick={() => tab.id && handleTabAction({ type: 'CLOSE', tabId: tab.id })}
                    className="text-red-600 hover:text-red-800 px-2 py-1 rounded"
                    title="Close tab"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="flex justify-end mt-4">
        <button
          className={`px-4 py-2 rounded text-white ${
            isAnalyzing
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={handleAnalyzeTabs}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Tabs'}
        </button>
      </div>
    </div>
  );
};

export default Popup; 