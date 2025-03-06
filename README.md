# AI-Powered Tab Manager & Organizer

A Chrome extension that uses AI to intelligently organize and manage your browser tabs.

## Project Architecture

```mermaid
graph TD
    subgraph Chrome Extension
        P[Popup] --> |User Interface| R[React Components]
        R --> |State Management| S[Tab State]
        R --> |User Actions| M[Message Bus]
        
        subgraph Background Service
            B[Background Script] --> |Tab Analysis| T[TensorFlow.js]
            B --> |Group Management| G[Tab Groups]
            B --> |Message Handling| M
        end
        
        subgraph Content Scripts
            C[Content Script] --> |Page Analysis| E[Content Extractor]
            C --> |Message Bus| M
        end
        
        M --> |Tab Data| B
        M --> |Group Updates| P
    end
    
    style Chrome Extension fill:#f9f9f9,stroke:#333,stroke-width:2px
    style Background Service fill:#e6f3ff,stroke:#333,stroke-width:2px
    style Content Scripts fill:#fff2e6,stroke:#333,stroke-width:2px
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

## Project Structure

```mermaid
graph LR
    subgraph Project Files
        M[manifest.json] --> |Configuration| W[webpack.config.js]
        W --> |Builds| D[dist/]
        
        subgraph Source Code
            S[src/] --> P[popup/]
            S --> B[background/]
            S --> C[content/]
            S --> T[types/]
            
            P --> |React| UI[UI Components]
            B --> |Service Worker| BG[Background Process]
            C --> |Page Analysis| CS[Content Scripts]
            T --> |TypeScript| TD[Type Definitions]
        end
        
        subgraph Assets
            A[assets/] --> I[Icons]
            A --> S[Styles]
        end
    end
    
    style Project Files fill:#f9f9f9,stroke:#333,stroke-width:2px
    style Source Code fill:#e6f3ff,stroke:#333,stroke-width:2px
    style Assets fill:#fff2e6,stroke:#333,stroke-width:2px
```

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