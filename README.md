# AI - Smart Tab Management System

## Main Process Flow

```mermaid
%%{init: { 
    'theme': 'dark',
    'themeVariables': {
        'background': '#0D1117',
        'primaryColor': '#ffffff',
        'primaryTextColor': '#ffffff',
        'primaryBorderColor': '#ffffff',
        'lineColor': '#ffffff',
        'secondaryColor': '#1f2937',
        'tertiaryColor': '#374151'
    }
}}%%
flowchart LR
    %% Main Process Container
    subgraph Process[" AI Process "]
        direction TB
        
        %% Core Flow
        Start((Start)) --> Init["Initialize"]
        Init --> Windows["Load Windows"]
        Windows --> Tabs["Load Tabs"]
        
        %% Interface Layer
        subgraph UI[" Interface "]
            direction LR
            Manager["Window Manager"] --> Actions
            subgraph Actions
                direction TB
                Select["Select Window"] 
                Drag["Drag & Drop"]
                Operate["Tab Actions"]
            end
        end
        
        %% Operations Layer
        subgraph Ops[" Operations "]
            direction TB
            Move["Move Tabs"]
            Order["Reorder"]
            Pin["Pin/Unpin"]
            Close["Close"]
        end
        
       
        %% Connections
        Tabs --> Manager
        Actions --> Ops
        Ops --> Update
        Refresh --> Manager
    end
    
    %% Styling
    classDef default fill:#1f2937,stroke:#ffffff,stroke-width:1px,color:#ffffff
    classDef container fill:#0D1117,stroke:#ffffff,stroke-width:1px,color:#ffffff
    classDef start fill:none,stroke:#ffffff,stroke-width:2px,stroke-dasharray:5 5,color:#ffffff
    
    %% Apply styles
    class Start start
    class Process,UI,Ops,State container
    
    %% Node styles - Dark theme with high contrast
    style Manager fill:#1f2937,stroke:#ffffff,stroke-width:1px,color:#ffffff
    style Actions fill:none,stroke:none,color:#ffffff
    style Select,Drag,Operate fill:#1f2937,stroke:#ffffff,stroke-width:1px,color:#ffffff
    style Move,Order,Pin,Close fill:#1f2937,stroke:#ffffff,stroke-width:1px,color:#ffffff
    style Update,Refresh fill:#1f2937,stroke:#ffffff,stroke-width:1px,color:#ffffff
    style Init,Windows,Tabs fill:#1f2937,stroke:#ffffff,stroke-width:1px,color:#ffffff

    %% Link styles
    linkStyle default stroke:#ffffff,stroke-width:1px
```

## Features

- Efficient window and tab management
- Drag and drop tab organization
- Multi-window support
- Tab pinning and reordering
- Visual tab organization
- Intuitive user interface

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smart-tab-manager.git
cd smart-tab-manager
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