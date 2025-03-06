export interface Tab {
  id?: number;
  title: string;
  url: string;
  favIconUrl?: string;
  windowId?: number;
  active?: boolean;
  pinned?: boolean;
  index?: number;
}

export interface TabGroup {
  id: string;
  name: string;
  tabs: Tab[];
  summary?: string;
  windowId?: number;
  color?: string;
  collapsed?: boolean;
}

export interface Window {
  id: number;
  focused: boolean;
  tabs: Tab[];
  state?: 'normal' | 'minimized' | 'maximized';
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}

export interface TabAction {
  type: 'CLOSE' | 'PIN' | 'UNPIN' | 'MOVE' | 'REORDER';
  tabId: number;
  windowId?: number;
  targetWindowId?: number;
  targetIndex?: number;
}

export interface WindowAction {
  type: 'ARRANGE' | 'CASCADE' | 'TILE' | 'MINIMIZE' | 'MAXIMIZE' | 'RESTORE';
  windowId?: number;
}

export interface GroupAction {
  type: 'RENAME' | 'COLLAPSE' | 'EXPAND' | 'SET_COLOR' | 'MERGE' | 'SPLIT';
  groupId: string;
  targetGroupId?: string;
  value?: string;
} 