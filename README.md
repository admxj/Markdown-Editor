# Markdown Editor

一个现代化的 Markdown 编辑器，基于 Tauri、React 和 CodeMirror 构建。

## 功能特性

- 实时 Markdown 预览
- CodeMirror 6 语法高亮
- 代码块高亮支持
- 跨平台桌面应用
- 文件打开/保存对话框

## 下载

从 [GitHub Releases](https://github.com/admxj/Markdown-Editor/releases) 下载最新版本。

### 支持的平台
- **macOS**: 通用 DMG（Intel 和 Apple Silicon 均支持）
- **Linux**: .deb, .rpm
- **Windows**: .msi, .exe (NSIS)

## 开发

### 环境要求

- Node.js 20+
- Rust
- npm

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run tauri dev
```

### 构建

```bash
npm run tauri build
```

## 技术栈

- **前端**: React 19, TypeScript, Vite
- **编辑器**: CodeMirror 6
- **后端**: Tauri 2 (Rust)
- **Markdown**: marked, highlight.js

## 许可证

MIT
