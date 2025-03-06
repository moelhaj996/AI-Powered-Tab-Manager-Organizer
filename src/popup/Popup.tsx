import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Tab, Window, TabAction } from '../types';
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
  const [error, setError] = useState<string | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<string>('all');

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
  };

  const handleTabMove = (dragIndex: number, hoverIndex: number) => {
    // Handle tab reordering within the same window
    if (dragIndex !== hoverIndex) {
      handleTabAction({
        type: 'REORDER',
        tabId: filteredTabs[dragIndex].id!,
        targetIndex: hoverIndex
      });
    }
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
              <h1 className="text-2xl font-bold">Tab Manager</h1>
              <p className="text-blue-100 text-sm mt-1">
                Organize your tabs efficiently
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

          {/* Window Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">
                {selectedWindow === 'all' ? 'All Tabs' : 'Window Tabs'} ({filteredTabs.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredTabs.map((tab, index) => (
                <DraggableTab
                  key={tab.id}
                  tab={tab}
                  index={index}
                  groupId="window"
                  windows={windowsForDraggable}
                  onTabClick={handleTabClick}
                  onTabAction={handleTabAction}
                  onTabMove={handleTabMove}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Popup; 