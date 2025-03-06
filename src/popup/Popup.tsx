import React, { useEffect, useState } from 'react';
import { Tab, TabGroup } from '../types';

const Popup: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [groups, setGroups] = useState<{ [key: string]: Tab[] }>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load current tabs when popup opens
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      setTabs(tabs.map(tab => ({
        id: tab.id,
        title: tab.title || '',
        url: tab.url || '',
        favIconUrl: tab.favIconUrl
      })));
    });
  }, []);

  const handleAnalyzeTabs = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await new Promise<{ groups: { [key: string]: number[] } }>((resolve) => {
        chrome.runtime.sendMessage({ type: 'ANALYZE_TABS' }, resolve);
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

  return (
    <div className="w-96 p-4">
      <h1 className="text-2xl font-bold mb-4">AI Tab Manager</h1>
      <div className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {Object.entries(groups).map(([groupId, groupTabs]) => (
          <div key={groupId} className="border rounded p-4">
            <h2 className="font-semibold mb-2">Group {groupId}</h2>
            <ul className="space-y-2">
              {groupTabs.map((tab) => (
                <li key={tab.id} className="flex items-center space-x-2">
                  {tab.favIconUrl && (
                    <img src={tab.favIconUrl} alt="" className="w-4 h-4" />
                  )}
                  <span className="truncate">{tab.title}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex justify-end">
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
    </div>
  );
};

export default Popup; 