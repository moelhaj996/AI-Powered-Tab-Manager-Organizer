import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Tab, TabGroup, Window, TabAction } from '../types';
import { DndProvider } from 'react-dnd/dist/core';
import { useDrop } from 'react-dnd/dist/hooks';
import type { DropTargetMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableTab } from '../components/DraggableTab';
import icon48 from '../assets/icon48.png';

interface DragItem {
  type: string;
  id: number;
  groupId: string;
  index: number;
  windowId: number;
}

interface Group {
  id: string;
  tabs: Tab[];
  summary: string;
}

const WindowDropZone: React.FC<{ window: Window; index: number; onDrop: (tabId: number) => void }> = ({ window, index, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>(() => ({
    accept: 'TAB',
    canDrop: (item: DragItem) => item.windowId !== window.id,
    drop: (item: DragItem) => {
      if (item.id && item.windowId !== window.id) {
        onDrop(item.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [window.id]);

  return (
    <div
      ref={drop}
      className={`
        p-2 border-2 border-dashed rounded-lg text-center text-sm
        ${isOver && canDrop ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}
        ${canDrop ? 'cursor-copy hover:border-blue-300 hover:bg-blue-50' : 'cursor-no-drop opacity-50'}
      `}
    >
      Drop to Window {index + 1}
      {window.focused ? ' (Current)' : ''}
    </div>
  );
};

const Popup: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [windows, setWindows] = useState<Window[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<string>('all');
  const [showMoveMenu, setShowMoveMenu] = useState<string | null>(null);
  const [isDraggingTab, setIsDraggingTab] = useState(false);

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

  // Filter tabs based on selected window and get current window tabs
  const currentWindowTabs = useMemo(() => {
    const currentWindow = windows.find(w => w.focused);
    return currentWindow ? tabs.filter(tab => tab.windowId === currentWindow.id) : [];
  }, [tabs, windows]);

  // Filter tabs based on selected window (for groups)
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

  // Map windows to the format expected by DraggableTab
  const windowsForDraggable = useMemo(() => windows.map(window => ({
    id: window.id,
    focused: window.focused || false
  })), [windows]);

  const handleWindowDrop = useCallback((windowId: number, tabId: number) => {
    handleTabAction({
      type: 'MOVE',
      tabId,
      targetWindowId: windowId,
      targetIndex: -1
    });
  }, [handleTabAction]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-96 min-h-[600px] bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <img 
              src={icon48} 
              alt="AI Tab Manager" 
              className="w-8 h-8" 
            />
            <div>
              <h1 className="text-2xl font-bold">AI Tab Manager</h1>
              <p className="text-blue-100 text-sm mt-1">
                Intelligent tab organization
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-4 space-y-4">
          {/* Window Selection */}
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-2">
            <div className="flex items-center justify-between">
              <select
                className="flex-1 p-2 border border-gray-200 rounded-lg mr-2 bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => chrome.windows.create({})}
                title="Create new window"
              >
                <span>+</span>
                <span>New</span>
              </button>
            </div>

            {/* Window Drop Zones */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {windows.map((window, index) => (
                <WindowDropZone
                  key={window.id}
                  window={window}
                  index={index}
                  onDrop={(tabId) => handleWindowDrop(window.id, tabId)}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Current Window Tabs - Always shown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">
                Current Window Tabs ({currentWindowTabs.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {currentWindowTabs.map((tab, index) => (
                <DraggableTab
                  key={tab.id}
                  tab={tab}
                  index={index}
                  groupId="current"
                  windows={windowsForDraggable}
                  onTabClick={handleTabClick}
                  onTabAction={handleTabAction}
                  onTabMove={handleTabMove}
                />
              ))}
            </div>
          </div>

          {/* Tab Groups */}
          <div className="space-y-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                      <span>{group.summary}</span>
                      <span className="text-sm text-gray-500">
                        ({group.tabs.length} tabs)
                      </span>
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <button
                          onClick={() => setShowMoveMenu(prev => prev === group.id ? null : group.id)}
                          className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50"
                          title="Move group to window"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </button>
                        {showMoveMenu === group.id && (
                          <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20 border border-gray-100">
                            <button
                              onClick={() => handleCreateWindow(group.id)}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span>Create New Window</span>
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            {windows.map(window => {
                              const isCurrentWindow = window.id.toString() === selectedWindow;
                              return (
                                <button
                                  key={window.id}
                                  onClick={() => handleMoveGroup(group.id, window.id)}
                                  className={`w-full px-4 py-2 text-sm text-left ${
                                    isCurrentWindow
                                      ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                  }`}
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
                        className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-red-50"
                        title="Close all tabs in this group"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {group.tabs.map((tab, index) => (
                    <DraggableTab
                      key={tab.id}
                      tab={tab}
                      index={index}
                      groupId={group.id}
                      windows={windowsForDraggable}
                      onTabClick={handleTabClick}
                      onTabAction={handleTabAction}
                      onTabMove={handleTabMove}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Analyze Button */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 mt-auto">
            <button
              className={`w-full px-6 py-3 rounded-lg text-white font-medium shadow-sm ${
                isAnalyzing
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg'
              }`}
              onClick={handleAnalyzeTabs}
              disabled={isAnalyzing}
            >
              <div className="flex items-center justify-center space-x-2">
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>
                      Analyze {selectedWindow === 'all' ? 'All' : 'Window'} Tabs
                    </span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Popup; 