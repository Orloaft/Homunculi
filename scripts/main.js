const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');

// Enable hardware acceleration and WebGL
app.commandLine.appendSwitch('enable-webgl');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-accelerated-2d-canvas');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('enable-native-gpu-memory-buffers');
// Disable V-Sync for higher FPS but cap at reasonable rate
app.commandLine.appendSwitch('disable-gpu-vsync');
// Don't completely disable frame rate limit - that causes 700+ FPS
// app.commandLine.appendSwitch('disable-frame-rate-limit');

let mainWindow;
const isSmokeRun = process.env.HOMUNCULI_SMOKE === '1';
const isProgressionSmokeRun = process.env.HOMUNCULI_PROGRESSION_SMOKE === '1';
let smokeFailed = false;

function finishSmoke(exitCode, reason) {
  if ((!isSmokeRun && !isProgressionSmokeRun) || app.isQuitting) return;
  app.isQuitting = true;
  console.log(`[smoke] ${reason}`);
  app.exit(exitCode);
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      // Enable WebGL and hardware acceleration
      experimentalFeatures: true,
      webgl: true,
      experimentalCanvasFeatures: true,
      accelerated2dCanvas: true,
      offscreen: false,
      // Disable V-Sync and throttling for higher FPS
      backgroundThrottling: false,
      disableBlinkFeatures: 'RenderingPipelineThrottling'
    },
    icon: path.join(__dirname, '..', 'assets', 'images', 'zodiac.png'),
    backgroundColor: '#11130d',
    show: false // Don't show until ready
  });

  // Load the game
  mainWindow.loadFile(path.join(__dirname, '..', 'index.html'));

  if (isSmokeRun || isProgressionSmokeRun) {
    mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
      smokeFailed = true;
      finishSmoke(1, `load failed ${errorCode}: ${errorDescription} (${validatedURL})`);
    });

    mainWindow.webContents.on('render-process-gone', (_event, details) => {
      smokeFailed = true;
      finishSmoke(1, `renderer exited: ${details.reason}`);
    });

    mainWindow.webContents.on('unresponsive', () => {
      smokeFailed = true;
      finishSmoke(1, 'renderer became unresponsive');
    });

    mainWindow.webContents.on('console-message', (_event, _level, message) => {
      if (!isProgressionSmokeRun && /Uncaught|Failed to initialize Phaser|Script error/i.test(message)) {
        smokeFailed = true;
        finishSmoke(1, `renderer console error: ${message}`);
      }
    });

    mainWindow.webContents.once('did-finish-load', () => {
      setTimeout(async () => {
        if (!smokeFailed) {
          if (isProgressionSmokeRun) {
            try {
              const result = await mainWindow.webContents.executeJavaScript(`
                (async () => {
                  if (!document.querySelector("canvas")) {
                    throw new Error("Phaser canvas missing");
                  }
                  if (typeof window.runHomunculiProgressionSmoke !== "function") {
                    throw new Error("progression smoke helper missing");
                  }
                  return await window.runHomunculiProgressionSmoke();
                })()
              `);
              finishSmoke(result && result.ok ? 0 : 1, result && result.ok ? `progression verified ${JSON.stringify(result)}` : 'progression verification failed');
            } catch (error) {
              smokeFailed = true;
              finishSmoke(1, `progression verification error: ${error && error.message ? error.message : error}`);
            }
          } else {
            const hasCanvas = await mainWindow.webContents.executeJavaScript(
              'Boolean(document.querySelector("canvas"))'
            );
            finishSmoke(hasCanvas ? 0 : 1, hasCanvas ? 'renderer loaded with Phaser canvas' : 'renderer loaded without Phaser canvas');
          }
        }
      }, Number(process.env.HOMUNCULI_SMOKE_HOLD_MS || 5000));
    });
  }

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

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event listeners
app.whenReady().then(() => {
  createWindow();
  createMenu();

  // Register global shortcuts
  globalShortcut.register('F11', () => {
    if (mainWindow) {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Unregister shortcuts when app is about to quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});
