# Markdown Editor

A modern Markdown editor built with Tauri, React, and CodeMirror.

## Features

- Real-time Markdown preview
- Syntax highlighting with CodeMirror 6
- Support for code block highlighting
- Cross-platform desktop application
- File open/save dialogs

## Download

Download the latest version from [GitHub Releases](https://github.com/admxj/Markdown-Editor/releases).

### Supported Platforms
- **macOS**: Universal DMG (Intel & Apple Silicon)
- **Linux**: .deb, .rpm
- **Windows**: .msi, .exe (NSIS)

## Development

### Prerequisites

- Node.js 20+
- Rust
- npm

### Setup

```bash
npm install
```

### Run Development Server

```bash
npm run tauri dev
```

### Build

```bash
npm run tauri build
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Editor**: CodeMirror 6
- **Backend**: Tauri 2 (Rust)
- **Markdown**: marked, highlight.js

## License

MIT
