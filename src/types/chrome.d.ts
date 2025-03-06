/// <reference types="chrome"/>

declare namespace chrome {
  export namespace runtime {
    export interface Message {
      type: string;
      [key: string]: any;
    }
  }

  export namespace tabs {
    export interface Tab {
      id?: number;
      title?: string;
      url?: string;
      favIconUrl?: string;
      windowId?: number;
      active?: boolean;
      index?: number;
    }

    export interface QueryInfo {
      active?: boolean;
      currentWindow?: boolean;
      [key: string]: any;
    }
  }
} 