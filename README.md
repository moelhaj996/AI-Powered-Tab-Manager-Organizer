# Mohaj AI - Smart Tab Management System

## System Architecture

```mermaid
graph TD
    subgraph Mohaj_AI[Mohaj AI]
        A[Chrome Extension] --> B[Popup Interface]
        
        subgraph Core_Components[Core Components]
            B --> C[Window Manager]
            B --> D[Tab Manager]
            B --> E[Drag & Drop System]
        end

        subgraph State_Management[State Management]
            F[Window State] --> B
            G[Tab State] --> B
        end

        subgraph User_Actions[User Interactions]
            H[Window Selection]
            I[Tab Operations]
            J[Drag & Drop]
        end

        C --> K[Chrome Windows API]
        D --> L[Chrome Tabs API]
        E --> M[React DnD]

        H --> B
        I --> B
        J --> B
    end

    style Mohaj_AI fill:#f0f8ff,stroke:#333,stroke-width:2px
    style Core_Components fill:#e6ffe6,stroke:#333,stroke-width:1px
    style State_Management fill:#ffe6e6,stroke:#333,stroke-width:1px
    style User_Actions fill:#fff0e6,stroke:#333,stroke-width:1px
```

## Main Features

1. **Window Management**
   - Create new windows
   - Switch between windows
   - View all windows simultaneously

2. **Tab Management**
   - View tabs in current window
   - Pin/Unpin tabs
   - Close tabs
   - Reorder tabs

3. **Drag & Drop System**
   - Move tabs between windows
   - Reorder tabs within windows
   - Visual feedback during drag operations

## Process Flow

1. **Initialization**
   - Load extension
   - Fetch current windows and tabs
   - Initialize drag & drop system

2. **User Interaction**
   - Select window from dropdown
   - Perform tab operations
   - Drag and drop tabs

3. **State Updates**
   - Update window state
   - Update tab state
   - Refresh UI

4. **Chrome API Integration**
   - Window operations
   - Tab operations
   - State synchronization

## Project Structure

```mermaid
graph TD
    subgraph Mohaj_AI_Structure[Mohaj AI Structure]
        M[manifest.json] --> |Configures| EXT[Chrome Extension]
        
        subgraph Source_Code[Source Code]
            SRC[src/] --> POP[popup/]
            SRC --> BG[background/]
            SRC --> CON[content/]
            SRC --> TYP[types/]

            POP --> |React Entry| IDX[index.tsx]
            POP --> |Main Component| PC[Popup.tsx]
            POP --> |Styles| CSS[index.css]
            
            BG --> |Service Worker| BS[background.ts]
            
            CON --> |Page Analysis| CS[content.ts]
            
            TYP --> |Interfaces| TI[index.ts]
            TYP --> |Chrome Types| CT[chrome.d.ts]
        end

        subgraph Build_System[Build System]
            WP[webpack.config.js] --> |Builds| DIST[dist/]
            PC[postcss.config.js] --> |Processes| CSS
            TC[tailwind.config.js] --> |Styles| CSS
        end

        subgraph Assets[Assets]
            AST[assets/] --> IC16[icon16.png]
            AST --> IC48[icon48.png]
            AST --> IC128[icon128.png]
        end

        PKG[package.json] --> |Manages| DEP[Dependencies]
        DEP --> |UI| REACT[React]
        DEP --> |Styling| TWC[Tailwind CSS]

        PC <--> |Messages| BS
        CS <--> |Content Info| BS
    end

    style Mohaj_AI_Structure fill:#f9f9f9,stroke:#333,stroke-width:2px
    style Source_Code fill:#e6f3ff,stroke:#333,stroke-width:2px
    style Build_System fill:#fff2e6,stroke:#333,stroke-width:2px
    style Assets fill:#e6ffe6,stroke:#333,stroke-width:2px
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