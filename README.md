# Mohaj AI - Smart Tab Management System

## Main Process Flow

```mermaid
flowchart TD
    %% Initialization Process
    Start([Mohaj AI]) --> Init[Initialize Extension]
    Init --> LoadWindows[Load Chrome Windows]
    LoadWindows --> LoadTabs[Fetch All Tabs]
    
    %% User Interface Layer with rounded edges
    subgraph User_Interface[" User Interface Layer "]
        direction TB
        LoadTabs --> |Initialize| UI[Window Manager]
        UI --> |"1. Select"| WindowView["Display Window Tabs"]
        UI --> |"2. Drag"| DragOp["Drag Operation"]
        UI --> |"3. Click"| TabOp["Tab Actions"]
    end

    %% Tab Operations with clear actions
    subgraph Tab_Operations[" Tab Management "]
        direction TB
        DragOp --> |"Drop"| MoveTab["Move to Window"]
        DragOp --> |"Reorder"| ReorderTab["Change Position"]
        TabOp --> |"Toggle"| PinTab["Pin/Unpin"]
        TabOp --> |"Remove"| CloseTab["Close Tab"]
    end

    %% State Management with feedback loop
    subgraph State_Updates[" State Management "]
        direction TB
        MoveTab & ReorderTab & PinTab & CloseTab --> UpdateState["Update State"]
        UpdateState --> RefreshUI["Refresh UI"]
        RefreshUI --> |"Update"| UI
    end

    %% Styling
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:1px
    classDef start fill:#f0f8ff,stroke:#2563eb,stroke-width:3px
    classDef process fill:#ffffff,stroke:#333,stroke-width:1px
    
    class Start start
    class Init,LoadWindows,LoadTabs process
    
    %% Subgraph styling
    style User_Interface fill:#e6f3ff,stroke:#2563eb,stroke-width:2px
    style Tab_Operations fill:#ffe6e6,stroke:#dc2626,stroke-width:2px
    style State_Updates fill:#e6ffe6,stroke:#16a34a,stroke-width:2px
    
    %% Node styling
    style UI fill:#ffffff,stroke:#2563eb,stroke-width:2px
    style WindowView,DragOp,TabOp fill:#ffffff,stroke:#2563eb,stroke-width:1px
    
    style MoveTab,ReorderTab,PinTab,CloseTab fill:#ffffff,stroke:#dc2626,stroke-width:1px
    
    style UpdateState,RefreshUI fill:#ffffff,stroke:#16a34a,stroke-width:1px
```

## Features

- Efficient window and tab management
- Drag and drop tab organization
- Multi-window support
- Tab pinning and reordering
- Visual tab organization
- Intuitive user interface

## Installation

1. Clone the Mohaj AI repository:
```bash
git clone https://github.com/yourusername/mohaj-ai.git
cd mohaj-ai
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory from this project

## Development

- Run the development build with watch mode:
```bash
npm run watch
```

- The extension will automatically rebuild when you make changes
- Refresh the extension in Chrome to see your changes

## Usage

1. Click the Mohaj AI icon in your Chrome toolbar
2. Select a window from the dropdown to view its tabs
3. Drag and drop tabs between windows using the drop zones
4. Use the pin/unpin and close buttons to manage tabs
5. Create new windows as needed

## Technologies Used

- React
- TypeScript
- Chrome Extensions API
- React DnD
- Tailwind CSS

## License

MIT