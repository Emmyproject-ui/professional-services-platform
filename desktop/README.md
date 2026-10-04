# Professional Services Platform — Desktop App

This folder contains the **Electron desktop wrapper** for the Professional Services Platform.

## 🚀 Quick Start

```bash
cd desktop
npm install
npm start
```

## 📦 Build Windows Installer (.exe)

```bash
cd desktop
npm install
npm run build
```

The installer will be in `desktop/dist-electron/`.

## 📁 Files

| File | Purpose |
|---|---|
| `main.js` | Electron main process — creates windows, menus |
| `preload.js` | Secure bridge between Node and browser |
| `splash.html` | Animated loading screen |
| `package.json` | Dependencies and build config |
| `assets/icon.ico` | App icon (replace with your own) |

## ⚙️ App Features

- 🖥️ Native desktop window (min 900×600)
- 🎨 Animated splash screen on startup
- 💾 Remembers window size/position
- 🔄 Back/Forward navigation
- 🌐 Opens external links in browser
- ⚠️ Offline error page with retry button
- 🔍 Zoom in/out support
- ⌨️ Keyboard shortcuts
