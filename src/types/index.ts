export interface Tab {
  id?: number;
  title: string;
  url: string;
  favIconUrl?: string;
}

export interface TabGroup {
  id: string;
  name: string;
  tabs: Tab[];
  summary?: string;
} 