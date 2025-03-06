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
      className={`flex items-center justify-between group hover:bg-gray-50 p-2 rounded cursor-move
        ${isDragging ? 'opacity-50' : ''}
        ${isOver ? 'border-t-2 border-blue-500' : ''}`}
    >
      <div className="flex items-center space-x-2 flex-1">
        <div className="cursor-move px-2">⋮⋮</div>
        {tab.favIconUrl && (
          <img src={tab.favIconUrl} alt="" className="w-4 h-4" />
        )}
        <span 
          className="truncate flex-1 cursor-pointer hover:text-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            tab.id && onTabClick(tab.id);
          }}
        >
          {tab.title}
        </span>
      </div>
      <div className="space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => tab.id && onTabAction({ type: tab.pinned ? 'UNPIN' : 'PIN', tabId: tab.id })}
          className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded"
          title={tab.pinned ? "Unpin tab" : "Pin tab"}
        >
          📌
        </button>
        <button
          onClick={() => tab.id && onTabAction({ type: 'CLOSE', tabId: tab.id })}
          className="text-red-600 hover:text-red-800 px-2 py-1 rounded"
          title="Close tab"
        >
          ✕
        </button>
      </div>
    </div>
  );
}; 