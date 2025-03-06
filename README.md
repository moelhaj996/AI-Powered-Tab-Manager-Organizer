# Mohaj AI - Smart Tab Management System

## Main Process Flow

```mermaid
flowchart TD
    %% Initialization Process
    Start([Mohaj AI]) --> Init[Initialize Extension]
    Init --> LoadWindows[Load Chrome Windows]
    LoadWindows --> LoadTabs[Fetch All Tabs]
    
    %% User Interface Layer
    subgraph User_Interface[" User Interface "]
        direction TB
        LoadTabs --> |Initialize| UI[Window Manager]
        UI --> |"1"| WindowView["Display Tabs"]
        UI --> |"2"| DragOp["Drag Operation"]
        UI --> |"3"| TabOp["Tab Actions"]
    end

    %% Tab Operations
    subgraph Tab_Operations[" Tab Management "]
        direction TB
        DragOp --> |"Drop"| MoveTab["Move Window"]
        DragOp --> |"Sort"| ReorderTab["Reposition"]
        TabOp --> |"Toggle"| PinTab["Pin/Unpin"]
        TabOp --> |"Close"| CloseTab["Remove"]
    end

    %% State Management
    subgraph State_Updates[" State Updates "]
        direction TB
        MoveTab & ReorderTab & PinTab & CloseTab --> UpdateState["Update"]
        UpdateState --> RefreshUI["Refresh"]
        RefreshUI --> |"Sync"| UI
    end

    %% Styling
    classDef default fill:white,stroke:#333,stroke-width:1px
    classDef start fill:white,stroke:#000,stroke-width:2px
    
    class Start start
    
    %% Subgraph styling
    style User_Interface fill:white,stroke:#000,stroke-width:1px
    style Tab_Operations fill:white,stroke:#000,stroke-width:1px
    style State_Updates fill:white,stroke:#000,stroke-width:1px
    
    %% Node styling - all nodes white with black borders
    style UI,WindowView,DragOp,TabOp fill:white,stroke:#000,stroke-width:1px
    style MoveTab,ReorderTab,PinTab,CloseTab fill:white,stroke:#000,stroke-width:1px
    style UpdateState,RefreshUI fill:white,stroke:#000,stroke-width:1px
    style Init,LoadWindows,LoadTabs fill:white,stroke:#000,stroke-width:1px
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