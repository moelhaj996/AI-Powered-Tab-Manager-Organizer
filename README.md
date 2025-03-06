# Mohaj AI - Smart Tab Management System

## Main Process Flow

```mermaid
flowchart TD
    Start([Start]) --> Init[Initialize Extension]
    Init --> LoadWindows[Load Chrome Windows]
    LoadWindows --> LoadTabs[Fetch All Tabs]
    
    subgraph User_Interface[User Interface Layer]
        LoadTabs --> UI[Show Window Manager]
        UI --> |Select Window| WindowView[Display Window Tabs]
        UI --> |Drag Tab| DragOp[Drag Operation]
        UI --> |Click Actions| TabOp[Tab Operations]
    end

    subgraph Tab_Operations[Tab Management]
        DragOp --> |Drop on Window| MoveTab[Move Tab to Window]
        DragOp --> |Drop in List| ReorderTab[Reorder Tab Position]
        TabOp --> |Pin| PinTab[Toggle Pin State]
        TabOp --> |Close| CloseTab[Close Tab]
    end

    subgraph State_Updates[State Management]
        MoveTab --> UpdateState[Update State]
        ReorderTab --> UpdateState
        PinTab --> UpdateState
        CloseTab --> UpdateState
        UpdateState --> RefreshUI[Refresh UI]
        RefreshUI --> UI
    end

    style Start fill:#f9f9f9,stroke:#333,stroke-width:2px
    style User_Interface fill:#e6f3ff,stroke:#333,stroke-width:2px
    style Tab_Operations fill:#ffe6e6,stroke:#333,stroke-width:2px
    style State_Updates fill:#e6ffe6,stroke:#333,stroke-width:2px
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