export interface Tab {
  id?: number;
  title?: string;
  url?: string;
  favIconUrl?: string;
  windowId?: number;
  pinned?: boolean;
  index?: number;
}

export interface TabGroup {
  id: string;
  windowId: number;
  tabs: Tab[];
  color?: string;
  collapsed?: boolean;
  title?: string;
}

export interface Window {
  id: number;
  focused?: boolean;
  tabs: Tab[];
  state?: 'normal' | 'minimized' | 'maximized' | 'fullscreen';
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}

export type TabAction = {
  type: 'PIN' | 'UNPIN' | 'CLOSE' | 'REORDER' | 'MOVE';
  tabId: number;
  targetIndex?: number;
  windowId?: number;
  targetWindowId?: number;
}

export type WindowAction = {
  type: 'ARRANGE' | 'CASCADE' | 'TILE' | 'MINIMIZE' | 'MAXIMIZE' | 'RESTORE';
  windowId: number;
}

export type GroupAction = {
  type: 'RENAME' | 'COLLAPSE' | 'EXPAND' | 'SET_COLOR' | 'MERGE' | 'SPLIT';
  groupId: string;
  targetGroupId?: string;
  color?: string;
  title?: string;
} 