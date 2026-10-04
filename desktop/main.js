const { app, BrowserWindow, Menu, shell, ipcMain, nativeTheme } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

// ── App URL ────────────────────────────────────────────────────────────────────
const APP_URL = 'https://professional-services-platform.onrender.com';
const APP_NAME = 'Professional Services Platform';

let mainWindow = null;
let splashWindow = null;

// ── Splash Screen ──────────────────────────────────────────────────────────────
function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 520,
    height: 340,
    frame: false,
    transparent: true,
    resizable: false,
    center: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
  splashWindow.show();
}

// ── Main Window ────────────────────────────────────────────────────────────────
function createMainWindow() {
  const windowBounds = store.get('windowBounds', {
    width: 1280,
    height: 800,
    x: undefined,
    y: undefined
  });

  mainWindow = new BrowserWindow({
    width: windowBounds.width,
    height: windowBounds.height,
    x: windowBounds.x,
    y: windowBounds.y,
    minWidth: 900,
    minHeight: 600,
    show: false,
    center: true,
    title: APP_NAME,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    },
    backgroundColor: '#0f0f1a'
  });

  // ── Load the live website ──
  mainWindow.loadURL(APP_URL);

  // ── Show window once page is ready ──
  mainWindow.webContents.on('did-finish-load', () => {
    // Close splash, show main
    if (splashWindow && !splashWindow.isDestroyed()) {
      setTimeout(() => {
        splashWindow.close();
        mainWindow.show();
        mainWindow.focus();
        if (store.get('wasMaximized', false)) {
          mainWindow.maximize();
        }
      }, 800);
    } else {
      mainWindow.show();
    }
  });

  // ── Handle load failures (offline / server down) ──
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDesc) => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
    }
    mainWindow.show();
    mainWindow.loadURL(`data:text/html,
      <html style="background:#0f0f1a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
      <div style="text-align:center;padding:40px">
        <div style="font-size:64px">📡</div>
        <h2 style="color:#a78bfa;margin:16px 0 8px">Connection Error</h2>
        <p style="color:#888;margin:0 0 24px">Could not connect to the server.<br>Please check your internet connection and try again.</p>
        <button onclick="location.href='${APP_URL}'"
          style="background:#7c3aed;color:#fff;border:none;padding:12px 28px;border-radius:8px;font-size:16px;cursor:pointer">
          🔄 Retry
        </button>
      </div></html>
    `);
  });

  // ── Open external links in browser, not in app ──
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(APP_URL)) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // ── Save window position/size on close ──
  mainWindow.on('close', () => {
    if (!mainWindow.isMaximized()) {
      store.set('windowBounds', mainWindow.getBounds());
    }
    store.set('wasMaximized', mainWindow.isMaximized());
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // ── Build application menu ──
  buildMenu();
}

// ── Application Menu ───────────────────────────────────────────────────────────
function buildMenu() {
  const template = [
    {
      label: '&App',
      submenu: [
        {
          label: '🏠 Home',
          accelerator: 'CmdOrCtrl+H',
          click: () => mainWindow.loadURL(APP_URL)
        },
        {
          label: '🔄 Refresh',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow.webContents.reload()
        },
        { type: 'separator' },
        {
          label: '🌐 Open in Browser',
          accelerator: 'CmdOrCtrl+Shift+B',
          click: () => shell.openExternal(APP_URL)
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'Alt+F4',
          click: () => app.quit()
        }
      ]
    },
    {
      label: '&View',
      submenu: [
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            const zoom = mainWindow.webContents.getZoomFactor();
            mainWindow.webContents.setZoomFactor(Math.min(zoom + 0.1, 2.0));
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const zoom = mainWindow.webContents.getZoomFactor();
            mainWindow.webContents.setZoomFactor(Math.max(zoom - 0.1, 0.5));
          }
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => mainWindow.webContents.setZoomFactor(1.0)
        },
        { type: 'separator' },
        {
          label: 'Toggle Fullscreen',
          accelerator: 'F11',
          click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen())
        }
      ]
    },
    {
      label: '&Navigate',
      submenu: [
        {
          label: '⬅ Back',
          accelerator: 'Alt+Left',
          click: () => {
            if (mainWindow.webContents.canGoBack()) mainWindow.webContents.goBack();
          }
        },
        {
          label: '➡ Forward',
          accelerator: 'Alt+Right',
          click: () => {
            if (mainWindow.webContents.canGoForward()) mainWindow.webContents.goForward();
          }
        }
      ]
    },
    {
      label: '&Help',
      submenu: [
        {
          label: 'About Professional Services Platform',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About',
              message: 'Professional Services Platform',
              detail: `Version: ${app.getVersion()}\nElectron: ${process.versions.electron}\nNode: ${process.versions.node}\n\nYour all-in-one professional services management system.`,
              buttons: ['OK'],
              icon: path.join(__dirname, 'assets', 'icon.ico')
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// ── App Lifecycle ──────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createSplashWindow();
  // Small delay so splash renders before we start loading the heavy page
  setTimeout(createMainWindow, 400);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── Security: restrict new windows ────────────────────────────────────────────
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const allowedHosts = [
      'professional-services-platform.onrender.com'
    ];
    if (!allowedHosts.includes(parsedUrl.hostname)) {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });
});
