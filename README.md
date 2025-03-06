# Mohaj AI - Intelligent Tab Management System

## System Architecture

```mermaid
graph TD
    subgraph Mohaj_AI[Mohaj AI Tab Manager]
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
    subgraph Extension Structure
        M[manifest.json] --> |Configures| EXT[Chrome Extension]
        
        subgraph Source Code
            SRC[src/] --> POP[popup/]
            SRC --> BG[background/]
            SRC --> CON[content/]
            SRC --> TYP[types/]

            %% Popup Details
            POP --> |React Entry| IDX[index.tsx]
            POP --> |Main Component| PC[Popup.tsx]
            POP --> |Styles| CSS[index.css]
            
            %% Background Service
            BG --> |Service Worker| BS[background.ts]
            BS --> |Uses| TF[TensorFlow.js]
            BS --> |Handles| TG[Tab Grouping]
            
            %% Content Scripts
            CON --> |Page Analysis| CS[content.ts]
            
            %% Types
            TYP --> |Interfaces| TI[index.ts]
            TYP --> |Chrome Types| CT[chrome.d.ts]
        end

        subgraph Build System
            WP[webpack.config.js] --> |Builds| DIST[dist/]
            PC[postcss.config.js] --> |Processes| CSS
            TC[tailwind.config.js] --> |Styles| CSS
        end

        subgraph Assets
            AST[assets/] --> IC16[icon16.png]
            AST --> IC48[icon48.png]
            AST --> IC128[icon128.png]
        end

        %% Dependencies
        PKG[package.json] --> |Manages| DEP[Dependencies]
        DEP --> |UI| REACT[React]
        DEP --> |AI| TFJS[TensorFlow.js]
        DEP --> |Styling| TWC[Tailwind CSS]

        %% Communication Flow
        PC <--> |Messages| BS
        CS <--> |Content Info| BS
        BS --> |Groups| PC
    end

    style Extension Structure fill:#f9f9f9,stroke:#333,stroke-width:2px
    style Source Code fill:#e6f3ff,stroke:#333,stroke-width:2px
    style Build System fill:#fff2e6,stroke:#333,stroke-width:2px
    style Assets fill:#e6ffe6,stroke:#333,stroke-width:2px
```

## Features

- Automatic tab grouping using AI/NLP
- Content summarization for tab groups
- Session management
- Customizable grouping options
- Visual tab organization

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/ai-tab-manager.git
cd ai-tab-manager
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

1. Click the extension icon in your Chrome toolbar
2. Click "Analyze Tabs" to automatically group your open tabs
3. View and manage your tab groups
4. Save sessions for later use
5. Customize grouping settings as needed

## Technologies Used

- React
- TypeScript
- TensorFlow.js
- Chrome Extensions API
- Tailwind CSS

## License

MIT