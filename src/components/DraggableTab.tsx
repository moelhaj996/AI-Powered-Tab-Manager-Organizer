import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd/dist/hooks';
import type { DragSourceMonitor, DropTargetMonitor, Identifier } from 'react-dnd';
import { Tab } from '../types';

interface DraggableTabProps {
  tab: Tab;
  index: number;
  groupId: string;
  windows: { id: number; focused: boolean }[];
  onTabClick: (tabId: number) => void;
  onTabAction: (action: any) => void;
  onTabMove: (dragIndex: number, hoverIndex: number, groupId: string) => void;
}

interface DragItem {
  type: string;
  id: number;
  groupId: string;
  index: number;
  windowId: number;
  tabId?: number;
}

const WindowsList: React.FC<{
  windows: { id: number; focused: boolean }[];
  currentWindowId: number;
  onDrop: (windowId: number) => void;
  isOver: boolean;
}> = ({ windows, currentWindowId, onDrop, isOver }) => {
  return (
    <div className={`
      fixed right-0 top-0 h-full w-48 bg-white shadow-lg border-l border-gray-200
      transform transition-transform duration-200
      ${isOver ? 'translate-x-0' : 'translate-x-full'}
    `}>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Drop to Window:</h3>
        <div className="space-y-2">
          {windows.map((window, index) => (
            window.id !== currentWindowId && (
              <div
                key={window.id}
                className="p-3 border-2 border-dashed rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:border-blue-400 cursor-move"
                onMouseUp={() => onDrop(window.id)}
              >
                Window {index + 1}
                {window.focused ? ' (Current)' : ''}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export const DraggableTab: React.FC<DraggableTabProps> = ({
  tab,
  index,
  groupId,
  windows,
  onTabClick,
  onTabAction,
  onTabMove,
}) => {
  const [showWindowDropdown, setShowWindowDropdown] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: 'TAB',
    item: { 
      type: 'TAB', 
      id: tab.id!, 
      groupId, 
      index, 
      windowId: tab.windowId!,
      tabId: tab.id 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: 'TAB',
    drop: (item) => {
      if (item.windowId !== tab.windowId) {
        onTabAction({
          type: 'MOVE',
          tabId: item.id,
          targetWindowId: tab.windowId,
          targetIndex: index
        });
      } else if (item.index !== index) {
        onTabMove(item.index, index, groupId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setIsDraggingOver(e.clientX > window.innerWidth - 200);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) {
      setIsDraggingOver(false);
    }
  }, [isDragging]);

  return (
    <>
      <div
        ref={(node) => drag(drop(node))}
        className={`
          group px-4 py-3 bg-white hover:bg-gray-50
          ${isDragging ? 'opacity-50 bg-blue-50' : ''}
          ${isOver ? 'border-t-2 border-blue-500' : ''}
        `}
      >
        <div className="flex items-center space-x-3">
          {/* Drag Handle */}
          <div 
            className="relative flex-shrink-0 cursor-move text-gray-400 hover:text-gray-600"
            onMouseEnter={() => !isDragging && setShowWindowDropdown(true)}
            onMouseLeave={() => setShowWindowDropdown(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
            
            {showWindowDropdown && !isDragging && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-30 border border-gray-100">
                {windows.map((window, index) => (
                  window.id !== tab.windowId && (
                    <button
                      key={window.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTabAction({
                          type: 'MOVE',
                          tabId: tab.id,
                          targetWindowId: window.id,
                          targetIndex: -1
                        });
                        setShowWindowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Move to Window {index + 1}
                      {window.focused ? ' (Current)' : ''}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Favicon */}
          <div className="flex-shrink-0 w-5 h-5">
            {tab.favIconUrl ? (
              <img
                src={tab.favIconUrl}
                alt=""
                className="w-full h-full object-contain rounded-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            )}
          </div>

          {/* Tab Title */}
          <div className="flex-1 min-w-0">
            <button
              className="text-left w-full truncate text-gray-900 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                tab.id && onTabClick(tab.id);
              }}
              title={tab.title}
            >
              {tab.title}
            </button>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100">
            {/* Pin/Unpin Button */}
            <button
              onClick={() => tab.id && onTabAction({ type: tab.pinned ? 'UNPIN' : 'PIN', tabId: tab.id })}
              className={`p-1.5 rounded-full ${
                tab.pinned
                  ? 'text-blue-600 hover:bg-blue-50'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title={tab.pinned ? "Unpin tab" : "Pin tab"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>

            {/* Close Button */}
            <button
              onClick={() => tab.id && onTabAction({ type: 'CLOSE', tabId: tab.id })}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
              title="Close tab"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isDragging && (
        <WindowsList
          windows={windows}
          currentWindowId={tab.windowId!}
          onDrop={(windowId) => {
            onTabAction({
              type: 'MOVE',
              tabId: tab.id,
              targetWindowId: windowId,
              targetIndex: -1
            });
          }}
          isOver={isDraggingOver}
        />
      )}
    </>
  );
}; 