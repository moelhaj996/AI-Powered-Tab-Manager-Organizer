export interface Tab {
  id?: number;
  title: string;
  url: string;
  favIconUrl?: string;
  windowId?: number;
  active?: boolean;
  pinned?: boolean;
}

export interface TabGroup {
  id: string;
  name: string;
  tabs: Tab[];
  summary?: string;
  windowId?: number;
}

export interface Window {
  id: number;
  focused: boolean;
  tabs: Tab[];
}

export interface TabAction {
  type: 'CLOSE' | 'PIN' | 'UNPIN' | 'MOVE';
  tabId: number;
  windowId?: number;
  targetWindowId?: number;
} 