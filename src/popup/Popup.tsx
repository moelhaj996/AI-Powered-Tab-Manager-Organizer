import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Tab, TabGroup, Window, TabAction } from '../types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableTab } from '../components/DraggableTab';

interface Group {
  id: string;
  tabs: Tab[];
  summary: string;
}

const Popup: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [windows, setWindows] = useState<Window[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<string>('all');
  const [showMoveMenu, setShowMoveMenu] = useState<string | null>(null);

  const refreshTabs = useCallback(() => {
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
      const allTabs = formattedWindows.flatMap(w => w.tabs);
      setTabs(allTabs);
    });
  }, []);

  useEffect(() => {
    refreshTabs();
  }, [refreshTabs]);

  // Filter tabs based on selected window
  const filteredTabs = useMemo(() => {
    if (selectedWindow === 'all') {
      return tabs;
    }
    const windowId = parseInt(selectedWindow, 10);
    return tabs.filter(tab => tab.windowId === windowId);
  }, [tabs, selectedWindow]);

  const handleCreateWindow = async (groupId: string) => {
    try {
      const groupTabs = groups.find(g => g.id === groupId)?.tabs || [];
      const firstTab = groupTabs[0];
      
      if (!firstTab || !firstTab.id) {
        console.error('No valid tabs in group');
        return;
      }

      const newWindow = await chrome.windows.create({ tabId: firstTab.id });
      if (!newWindow || !newWindow.id) {
        console.error('Failed to create new window');
        return;
      }

      const remainingTabs = groupTabs.slice(1);
      for (const tab of remainingTabs) {
        if (tab.id) {
          await handleTabAction({
            type: 'MOVE',
            tabId: tab.id,
            targetWindowId: newWindow.id,
            targetIndex: -1
          });
        }
      }

      refreshTabs();
      setGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
      setShowMoveMenu(null);
    } catch (err) {
      console.error('Error creating new window:', err);
    }
  };

  const handleMoveTab = async (tabId: number, targetWindowId: number) => {
    try {
      await chrome.tabs.move(tabId, { windowId: targetWindowId, index: -1 });
      setShowMoveMenu(null);
      refreshTabs();
    } catch (err) {
      console.error('Error moving tab:', err);
      setError('Failed to move tab. Please try again.');
    }
  };

  const handleMoveGroup = async (groupId: string, targetWindowId: number) => {
    try {
      const groupTabs = groups.find(g => g.id === groupId)?.tabs || [];
      for (const tab of groupTabs) {
        if (tab.id) {
          await handleTabAction({
            type: 'MOVE',
            tabId: tab.id,
            targetWindowId,
            targetIndex: -1
          });
        }
      }
      refreshTabs();
      setGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
      setShowMoveMenu(null);
    } catch (err) {
      console.error('Error moving group:', err);
    }
  };

  const handleTabAction = async (action: TabAction) => {
    try {
      switch (action.type) {
        case 'PIN':
        case 'UNPIN':
          await chrome.tabs.update(action.tabId, { pinned: action.type === 'PIN' });
          break;
        case 'CLOSE':
          await chrome.tabs.remove(action.tabId);
          setTabs(prevTabs => prevTabs.filter(tab => tab.id !== action.tabId));
          setGroups(prevGroups => prevGroups.map(g => ({
            ...g,
            tabs: g.tabs.filter(tab => tab.id !== action.tabId)
          })));
          break;
        case 'MOVE':
          if (action.targetWindowId) {
            await chrome.tabs.move(action.tabId, { 
              windowId: action.targetWindowId,
              index: action.targetIndex ?? -1 
            });
          }
          break;
        case 'REORDER':
          if (action.targetIndex !== undefined) {
            await chrome.tabs.move(action.tabId, { index: action.targetIndex });
          }
          break;
      }
      refreshTabs();
    } catch (err) {
      console.error('Error handling tab action:', err);
    }
  };

  const handleAnalyzeTabs = async () => {
    setIsAnalyzing(true);
    setError(null);
    setGroups([]); // Clear existing groups

    try {
      const response = await new Promise<{ groups: { [key: string]: number[] } }>((resolve) => {
        chrome.runtime.sendMessage({ 
          type: 'ANALYZE_TABS',
          windowId: selectedWindow === 'all' ? undefined : selectedWindow,
          tabs: filteredTabs // Pass filtered tabs to background script
        }, resolve);
      });

      if (!response || !response.groups) {
        throw new Error('Invalid response from tab analysis');
      }

      const tabGroups = Object.entries(response.groups).reduce((acc, [groupId, indices]) => {
        acc.push({
          id: groupId,
          tabs: indices.map(index => filteredTabs[index]).filter(tab => tab),
          summary: groupId
        });
        return acc;
      }, [] as Group[]);

      setGroups(tabGroups);
    } catch (err) {
      setError('Failed to analyze tabs. Please try again.');
      console.error('Error analyzing tabs:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCloseGroup = async (groupId: string) => {
    const groupTabs = groups.find(g => g.id === groupId)?.tabs || [];
    const tabIds = groupTabs.map(tab => tab.id).filter((id): id is number => id !== undefined);
    
    if (tabIds.length === 0) {
      console.warn('No valid tab IDs found in group:', groupId);
      return;
    }

    try {
      await chrome.tabs.remove(tabIds);
      setGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
      setTabs(prevTabs => prevTabs.filter(tab => !tabIds.includes(tab.id!)));
    } catch (err) {
      console.error('Error closing group:', err);
      setError('Failed to close tab group. Please try again.');
      refreshTabs();
    }
  };

  const handleTabClick = useCallback(async (tabId: number) => {
    try {
      await chrome.tabs.update(tabId, { active: true });
      const tab = tabs.find(t => t.id === tabId);
      if (tab?.windowId) {
        await chrome.windows.update(tab.windowId, { focused: true });
      }
    } catch (err) {
      console.error('Error activating tab:', err);
      setError('Failed to switch to tab. Please try again.');
    }
  }, [tabs]);

  const handleWindowChange = (windowId: string) => {
    setSelectedWindow(windowId);
    setGroups([]); // Clear groups when window selection changes
  };

  const handleTabMove = (dragIndex: number, hoverIndex: number, groupId: string) => {
    const updatedGroups = groups.map((group: Group) => {
      if (group.id === groupId) {
        const newTabs = [...group.tabs];
        const [draggedTab] = newTabs.splice(dragIndex, 1);
        newTabs.splice(hoverIndex, 0, draggedTab);
        return { ...group, tabs: newTabs };
      }
      return group;
    });
    setGroups(updatedGroups);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-96 p-4 bg-white">
        <h1 className="text-2xl font-bold mb-4">AI Tab Manager</h1>
        
        {/* Window Management */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <select
              className="flex-1 p-2 border rounded mr-2"
              value={selectedWindow}
              onChange={(e) => handleWindowChange(e.target.value)}
            >
              <option value="all">All Windows ({tabs.length} tabs)</option>
              {windows.map((window, index) => (
                <option key={window.id} value={window.id.toString()}>
                  Window {index + 1} ({window.tabs.length} tabs)
                  {window.focused ? ' (Current)' : ''}
                </option>
              ))}
            </select>
            <button
              className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => chrome.windows.create({})}
              title="Create new window"
            >
              + New
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mt-4 space-y-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow p-2 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{group.summary}</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowMoveMenu(prev => prev === group.id ? null : group.id)}
                      className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
                      title="Move group to window"
                    >
                      📦
                    </button>
                    {showMoveMenu === group.id && (
                      <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20 border">
                        <button
                          onClick={() => handleCreateWindow(group.id)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Create New Window
                        </button>
                        <div className="border-t my-1"></div>
                        {windows.map(window => {
                          const isCurrentWindow = window.id.toString() === selectedWindow;
                          return (
                            <button
                              key={window.id}
                              onClick={() => handleMoveGroup(group.id, window.id)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              disabled={isCurrentWindow}
                            >
                              Window {windows.indexOf(window) + 1}
                              {window.focused ? ' (Current)' : ''}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleCloseGroup(group.id)}
                    className="text-red-600 hover:text-red-800 px-2 py-1 rounded"
                    title="Close all tabs in this group"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                {group.tabs.map((tab, index) => (
                  <DraggableTab
                    key={tab.id}
                    tab={tab}
                    index={index}
                    groupId={group.id}
                    onTabClick={handleTabClick}
                    onTabAction={handleTabAction}
                    onTabMove={handleTabMove}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

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
            {isAnalyzing ? 'Analyzing...' : `Analyze ${selectedWindow === 'all' ? 'All' : 'Window'} Tabs`}
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default Popup; 