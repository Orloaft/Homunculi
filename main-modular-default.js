const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');

// Disable V-Sync for higher FPS but cap at reasonable rate
app.commandLine.appendSwitch('disable-gpu-vsync');
// Don't completely disable frame rate limit - that causes 700+ FPS
// app.commandLine.appendSwitch('disable-frame-rate-limit');

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      // Disable V-Sync and throttling for higher FPS
      backgroundThrottling: false,
      webgl: true,
      disableBlinkFeatures: 'RenderingPipelineThrottling'
    },
    icon: path.join(__dirname, 'zodiac.png'),
    backgroundColor: '#11130d',
    show: false // Don't show until ready
  });

  // CHANGED: Default to modular version, use original only if explicitly requested
  const indexFile = process.env.USE_ORIGINAL === 'true' ? 'index.html' : 'index-modular.html';
  console.log(`Loading ${indexFile} (modular version by default)`);
  mainWindow.loadFile(indexFile);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevent navigation away from the game
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) {
      event.preventDefault();
    }
  });
}

// Create app menu
function createMenu() {
  const template = [
    {
      label: 'Game',
      submenu: [
        {
          label: 'New Game',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.executeJavaScript('location.reload()');
          }
        },
        {
          label: 'Toggle Fullscreen',
          accelerator: 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Cmd+Option+I' : 'Ctrl+Shift+I',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          }
        },
        { type: 'separator' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { role: 'resetzoom' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createMenu();

  // Register global shortcuts
  globalShortcut.register('F11', () => {
    if (mainWindow) {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});