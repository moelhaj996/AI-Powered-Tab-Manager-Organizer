import React from 'react';
import { useDrag, useDrop, DragSourceMonitor, DropTargetMonitor } from 'react-dnd';
import { Tab } from '../types';

interface DraggableTabProps {
  tab: Tab;
  index: number;
  groupId: string;
  onTabClick: (tabId: number) => void;
  onTabAction: (action: any) => void;
  onTabMove: (dragIndex: number, hoverIndex: number, groupId: string) => void;
}

interface DragItem {
  type: string;
  id: number;
  groupId: string;
  index: number;
}

export const DraggableTab: React.FC<DraggableTabProps> = ({
  tab,
  index,
  groupId,
  onTabClick,
  onTabAction,
  onTabMove,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TAB',
    item: { type: 'TAB', id: tab.id, groupId, index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: 'TAB',
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!tab.id) return;
      if (item.id === tab.id) return;

      onTabMove(item.index, index, groupId);
      item.index = index;
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        group px-4 py-3 bg-white hover:bg-gray-50 transition-colors
        ${isDragging ? 'opacity-50 bg-blue-50' : ''}
        ${isOver ? 'border-t-2 border-blue-500' : ''}
      `}
    >
      <div className="flex items-center space-x-3">
        {/* Drag Handle */}
        <div className="flex-shrink-0 cursor-move text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>

        {/* Favicon */}
        <div className="flex-shrink-0 w-5 h-5">
          {tab.favIconUrl ? (
            <img
              src={tab.favIconUrl}
              alt=""
              className="w-full h-full object-contain"
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
        <div className="flex-shrink-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Pin/Unpin Button */}
          <button
            onClick={() => tab.id && onTabAction({ type: tab.pinned ? 'UNPIN' : 'PIN', tabId: tab.id })}
            className={`p-1.5 rounded-full transition-colors ${
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
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Close tab"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}; 