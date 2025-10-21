# Maker OS Web Interface

A beautiful, Figma-inspired web interface for Maker OS that provides visual workflow orchestration and real-time monitoring.

## Features

- **Figma-Inspired Design**: Dark theme with Figma's signature colors and interactions
- **Real-Time Workflow Visualization**: Watch your automation execute phase by phase
- **Interactive Dashboard**: Configure and monitor workflows from a beautiful UI
- **Multi-Agent Monitoring**: Track agent activity and execution status
- **Live Logs**: Real-time execution logs with color-coded severity levels
- **Responsive Layout**: Professional toolbar, sidebar, canvas, and panels

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling with custom Figma theme
- **Framer Motion**: Smooth animations and transitions
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library

## Getting Started

### Installation

```bash
cd packages/web
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the interface.

### Build

```bash
npm run build
npm start
```

## UI Components

### Toolbar
- Maker OS branding with Zap icon
- Primary action button (Run Workflow)
- Settings and help icons

### Sidebar
- Workflow configuration inputs
- MCP server status indicators
- Real-time connection monitoring

### Canvas (Main Area)
- 4-phase workflow visualization
- Phase status indicators (pending/running/completed/error)
- Tool badges for each phase
- Animated progress bars
- Results display panel

### Right Panel
- Tabs: Logs, Activity, Output
- Real-time log streaming
- Agent status monitoring
- Session information

## Design System

### Colors

```css
figma-bg: #1E1E1E           /* Background */
figma-surface: #2C2C2C      /* Panels */
figma-border: #3C3C3C       /* Borders */
figma-hover: #383838        /* Hover states */
figma-text: #FFFFFF         /* Primary text */
figma-text-secondary: #B3B3B3  /* Secondary text */
figma-accent: #0D99FF       /* Accent/Actions */
figma-success: #14AE5C      /* Success states */
figma-warning: #F24822      /* Errors/Warnings */
figma-purple: #7B61FF       /* Highlights */
```

### Typography

- Font Family: Inter (Google Fonts)
- Monospace: SF Mono, Monaco, Consolas

### Component Classes

- `figma-panel`: Panel/card styling
- `figma-button-primary`: Primary action button
- `figma-button-secondary`: Secondary button
- `figma-input`: Form input styling
- `figma-toolbar`: Top toolbar
- `figma-sidebar`: Left sidebar
- `status-dot`: Status indicator
- `status-success`: Success indicator
- `status-running`: Running indicator (animated pulse)
- `status-error`: Error indicator

## Workflow States

### Phase Status

- `pending`: Not started (gray circle)
- `running`: Currently executing (blue pulsing circle)
- `completed`: Successfully finished (green check)
- `error`: Failed (red alert icon)

### Log Levels

- `info`: Standard log (gray)
- `success`: Success message (green)
- `error`: Error message (red)

## Integration

The web interface connects to the Maker OS orchestrator backend through WebSocket or REST API (to be implemented).

### Future Enhancements

- WebSocket connection to orchestrator
- Real-time workflow execution from UI
- Configuration persistence
- Workflow history
- Export/import workflows
- Dark/Light theme toggle
- Keyboard shortcuts (Figma-style)

## File Structure

```
web/
├── src/
│   ├── components/
│   │   ├── Toolbar.tsx       # Top toolbar
│   │   ├── Sidebar.tsx       # Left configuration panel
│   │   ├── Canvas.tsx        # Main workflow visualization
│   │   └── RightPanel.tsx    # Logs & monitoring
│   ├── lib/
│   │   └── workflow-context.tsx  # State management
│   ├── pages/
│   │   ├── _app.tsx          # Next.js app wrapper
│   │   ├── _document.tsx     # HTML document
│   │   └── index.tsx         # Main page
│   └── styles/
│       └── globals.css       # Global styles & theme
├── public/                   # Static assets
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind theme
└── tsconfig.json            # TypeScript config
```

## Screenshots

The interface features:
- Professional dark theme matching Figma's aesthetic
- Smooth animations and transitions
- Clear visual hierarchy
- Intuitive workflow visualization
- Real-time status updates

## License

MIT
