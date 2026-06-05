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
const isFirstRunSmokeRun = process.env.HOMUNCULI_FIRST_RUN_SMOKE === '1';
const isProgressionSmokeRun = process.env.HOMUNCULI_PROGRESSION_SMOKE === '1';
const isFeelSmokeRun = process.env.HOMUNCULI_FEEL_SMOKE === '1';
const isForestLiveSmokeRun = process.env.HOMUNCULI_FOREST_LIVE_SMOKE === '1';
const isSwampLiveSmokeRun = process.env.HOMUNCULI_SWAMP_LIVE_SMOKE === '1';
const isOceanLiveSmokeRun = process.env.HOMUNCULI_OCEAN_LIVE_SMOKE === '1';
const isStageLiveSmokeRun = process.env.HOMUNCULI_STAGE_LIVE_SMOKE === '1' || isForestLiveSmokeRun || isSwampLiveSmokeRun || isOceanLiveSmokeRun;
const isSwampBossSmokeRun = process.env.HOMUNCULI_SWAMP_BOSS_SMOKE === '1';
const isSnowBossSmokeRun = process.env.HOMUNCULI_SNOW_BOSS_SMOKE === '1';
const isOceanBossSmokeRun = process.env.HOMUNCULI_OCEAN_BOSS_SMOKE === '1';
const isLavaBossSmokeRun = process.env.HOMUNCULI_LAVA_BOSS_SMOKE === '1';
const isGraveBossSmokeRun = process.env.HOMUNCULI_GRAVE_BOSS_SMOKE === '1';
const isCastleBossSmokeRun = process.env.HOMUNCULI_CASTLE_BOSS_SMOKE === '1';
let smokeFailed = false;

function finishSmoke(exitCode, reason) {
  if ((!isSmokeRun && !isFirstRunSmokeRun && !isProgressionSmokeRun && !isFeelSmokeRun && !isStageLiveSmokeRun && !isSwampBossSmokeRun && !isSnowBossSmokeRun && !isOceanBossSmokeRun && !isLavaBossSmokeRun && !isGraveBossSmokeRun && !isCastleBossSmokeRun) || app.isQuitting) return;
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

  if (isSmokeRun || isFirstRunSmokeRun || isProgressionSmokeRun || isFeelSmokeRun || isStageLiveSmokeRun || isSwampBossSmokeRun || isSnowBossSmokeRun || isOceanBossSmokeRun || isLavaBossSmokeRun || isGraveBossSmokeRun || isCastleBossSmokeRun) {
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

    mainWindow.webContents.on('console-message', (_event, _level, message, line, sourceId) => {
      if (!isProgressionSmokeRun && /Uncaught|Failed to initialize Phaser|Script error/i.test(message)) {
        smokeFailed = true;
        finishSmoke(1, `renderer console error: ${message}${sourceId ? ` (${sourceId}:${line})` : ''}`);
      }
    });

    mainWindow.webContents.once('did-finish-load', () => {
      setTimeout(async () => {
        if (!smokeFailed) {
          if (isFirstRunSmokeRun || isProgressionSmokeRun || isFeelSmokeRun || isStageLiveSmokeRun || isSwampBossSmokeRun || isSnowBossSmokeRun || isOceanBossSmokeRun || isLavaBossSmokeRun || isGraveBossSmokeRun || isCastleBossSmokeRun) {
            try {
              const liveStage = isSwampLiveSmokeRun
                ? 'swamp'
                : isForestLiveSmokeRun
                  ? 'forest'
                  : isOceanLiveSmokeRun
                    ? 'ocean'
                  : process.env.HOMUNCULI_LIVE_SMOKE_STAGE || 'forest';
              const liveStartElement = isSwampLiveSmokeRun
                ? 'fire'
                : isOceanLiveSmokeRun
                  ? 'water'
                : process.env.HOMUNCULI_LIVE_SMOKE_ELEMENT || 'fire';
              const liveDesiredEnemyDistance = Number(process.env.HOMUNCULI_LIVE_SMOKE_ENEMY_DISTANCE || (
                isSwampLiveSmokeRun ? 120 : isOceanLiveSmokeRun ? 160 : isForestLiveSmokeRun ? 80 : 110
              ));
              const liveSmokeOptions = {
                stage: liveStage,
                label: `${liveStage} live`,
                startElement: liveStartElement,
                desiredEnemyDistance: liveDesiredEnemyDistance
              };
              if (isOceanLiveSmokeRun) {
                liveSmokeOptions.requiredEnemyTypes = ['jellyfish', 'crabby', 'waterslime', 'squid', 'shark', 'crablore'];
                liveSmokeOptions.allowedEnemyTypes = liveSmokeOptions.requiredEnemyTypes;
                liveSmokeOptions.movementStep = 60;
              } else if (liveStage === 'lava') {
                liveSmokeOptions.requiredEnemyTypes = ['fireslime', 'clubimp', 'axeimp'];
                liveSmokeOptions.allowedEnemyTypes = ['fireslime', 'clubimp', 'axeimp', 'fireworm', 'flyingdemon', 'orangegolem', 'summoner', 'giant-fireslime'];
              } else if (liveStage === 'grave') {
                liveSmokeOptions.requiredEnemyTypes = ['yellowskeleton', 'soul', 'skeletonseeker'];
                liveSmokeOptions.allowedEnemyTypes = ['yellowskeleton', 'soul', 'skeletonseeker', 'skullhound', 'clubimp', 'axeimp', 'giant-yellowskeleton'];
              } else if (liveStage === 'castle') {
                liveSmokeOptions.requiredEnemyTypes = ['castle-squire', 'castle-soldier', 'castle-rogue'];
                liveSmokeOptions.allowedEnemyTypes = ['castle-squire', 'castle-soldier', 'castle-rogue', 'castle-knight', 'castle-bladekeeper', 'giant-castle-knight'];
              }
              const smokeHelperName = isFirstRunSmokeRun
                ? 'runHomunculiFirstRunSmoke'
                : isSwampBossSmokeRun
                ? 'runHomunculiSwampBossSmoke'
                : isSnowBossSmokeRun
                ? 'runHomunculiSnowBossSmoke'
                : isOceanBossSmokeRun
                ? 'runHomunculiOceanBossSmoke'
                : isLavaBossSmokeRun
                ? 'runHomunculiLavaBossSmoke'
                : isGraveBossSmokeRun
                ? 'runHomunculiGraveBossSmoke'
                : isCastleBossSmokeRun
                ? 'runHomunculiCastleBossSmoke'
                : isStageLiveSmokeRun
                ? 'runHomunculiForestLiveSmoke'
                : isFeelSmokeRun
                  ? 'runHomunculiFeelSmoke'
                  : 'runHomunculiProgressionSmoke';
              const smokeLabel = isFirstRunSmokeRun ? 'first-run' : isSwampBossSmokeRun ? 'swamp boss' : isSnowBossSmokeRun ? 'snow boss' : isOceanBossSmokeRun ? 'ocean boss' : isLavaBossSmokeRun ? 'lava boss' : isGraveBossSmokeRun ? 'grave boss' : isCastleBossSmokeRun ? 'castle boss' : isStageLiveSmokeRun ? `${liveStage} live` : isFeelSmokeRun ? 'feel' : 'progression';
              const result = await mainWindow.webContents.executeJavaScript(`
                (async () => {
                  if (!document.querySelector("canvas")) {
                    throw new Error("Phaser canvas missing");
                  }
                  const helper = ${isStageLiveSmokeRun ? 'window.runHomunculiStageLiveSmoke' : `window.${smokeHelperName}`};
                  if (typeof helper !== "function") {
                    throw new Error("${smokeLabel} smoke helper missing");
                  }
                  return await helper(${isStageLiveSmokeRun ? JSON.stringify(liveSmokeOptions) : ''});
                })()
              `);
              finishSmoke(result && result.ok ? 0 : 1, result && result.ok ? `${smokeLabel} verified ${JSON.stringify(result)}` : `${smokeLabel} verification failed`);
            } catch (error) {
              smokeFailed = true;
              const errorDetails = error && error.stack ? error.stack : error && error.message ? error.message : error;
              finishSmoke(1, `${isFirstRunSmokeRun ? 'first-run' : isSwampBossSmokeRun ? 'swamp boss' : isSnowBossSmokeRun ? 'snow boss' : isOceanBossSmokeRun ? 'ocean boss' : isLavaBossSmokeRun ? 'lava boss' : isGraveBossSmokeRun ? 'grave boss' : isCastleBossSmokeRun ? 'castle boss' : isStageLiveSmokeRun ? 'stage live' : isFeelSmokeRun ? 'feel' : 'progression'} verification error: ${errorDetails}`);
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
