const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, screen, globalShortcut, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const logPath = app.isPackaged
    ? path.join(app.getPath('logs'), 'main.log')
    : path.join(__dirname, '..', 'app.log');

function log(msg) {
    const entry = `[${new Date().toISOString()}] ${msg}\n`;
    try {
        fs.mkdirSync(path.dirname(logPath), { recursive: true });
        fs.appendFileSync(logPath, entry);
    } catch (e) {}
    console.log(msg);
}

let processPidFile = null;

function writeProcessPid(userDataPath) {
    try {
        processPidFile = path.join(userDataPath, 'poketokenbar.pid');
        fs.mkdirSync(path.dirname(processPidFile), { recursive: true });
        fs.writeFileSync(processPidFile, String(process.pid), 'utf8');
    } catch (e) {
        log(`[PID FILE ERROR] ${e.message}`);
    }
}

function removeProcessPid() {
    try {
        if (!processPidFile || !fs.existsSync(processPidFile)) return;
        if (fs.readFileSync(processPidFile, 'utf8').trim() === String(process.pid)) {
            fs.unlinkSync(processPidFile);
        }
    } catch (e) {}
}

const icoPath = path.join(__dirname, 'icon.ico');
const pngPath = path.join(__dirname, 'icon.png');
const appIconPath = fs.existsSync(icoPath) ? icoPath : (fs.existsSync(pngPath) ? pngPath : undefined);

process.on('uncaughtException', (err) => {
    log(`[UNCAUGHT EXCEPTION] ${err.stack || err}`);
});
process.on('unhandledRejection', (reason) => {
    log(`[UNHANDLED REJECTION] ${reason}`);
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    log('Instancia secundaria detectada: cediendo control a la instancia activa y saliendo.');
    app.quit();
} else {
    app.on('second-instance', (_event, _commandLine, _workingDirectory) => {
        log('Segunda instancia ejecutada (click en .bat): restaurando, enfocando ventana y sincronizando estado');
        if (petWindow && !petWindow.isDestroyed()) {
            if (petWindow.isMinimized()) petWindow.restore();
            petWindow.show();
            petWindow.focus();
            updateAll();
        } else {
            createPetWindow();
        }
    });
}

log('Top-level main.js loaded');

const { TokenScanner } = require('./tokens');
const { CompanionManager } = require('./pokemon');
const { BattleEngine, POKEDEX_ALL, generateWildBattler, simulateBackgroundBattle } = require('./battle');

let tray = null;
let petWindow = null;
let battleWindow = null;
let rivalWalkerWindow = null;
let vsPromptWindow = null;
let scanner = null;
let companion = null;
let latestStats = null;
let lastScannerErrorSignature = null;
let battleEngine = new BattleEngine();
let isWalkerEncounterActive = false;
let currentWalkerWild = null;
let encounterCooldown = 120;
let rivalWalkerX = 0;
let rivalWalkerDir = -1;
let isCollided = false;
let autoBattleTimer = null;

function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return (num || 0).toLocaleString();
}

function clearAutoBattleTimer() {
    if (autoBattleTimer !== null) {
        clearTimeout(autoBattleTimer);
        autoBattleTimer = null;
    }
}

function isAutoBattleReady() {
    return !!(
        companion &&
        battleEngine &&
        companion.state.settings &&
        companion.state.settings.autoBattle &&
        battleEngine.isInBattle() &&
        battleEngine.activeBattle &&
        !battleEngine.activeBattle.inCatchPhase
    );
}

function applyBattleActionResult(res, slotIdx) {
    if (!companion || !res) return;

    if (res.inCatchPhase) {
        companion.ensureRescuePokeballs();
    } else if (res.expReward) {
        companion.awardBattleExp(res.expReward, slotIdx);
    }

    if (battleEngine.activeBattle && battleEngine.activeBattle.isOver) {
        companion.reviveTeam();
        encounterCooldown = 120;
    }
}

function executeAutoBattleTurn() {
    if (!isAutoBattleReady()) return;

    const slotIdx = battleEngine.activeBattle.player ? battleEngine.activeBattle.player.slotIndex : null;
    const res = battleEngine.executeAutoMove();
    applyBattleActionResult(res, slotIdx);
    broadcastBattleUpdate(battleEngine.getBattleState());
    updateAll();
    scheduleAutoBattleMove();
}

function scheduleAutoBattleMove() {
    clearAutoBattleTimer();
    if (!isAutoBattleReady()) return;

    const delay = companion.state.settings.battleSpeed === 2 ? 350 : 750;
    autoBattleTimer = setTimeout(() => {
        autoBattleTimer = null;
        executeAutoBattleTurn();
    }, delay);
}

function createPetWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workArea;

    // Position pet at bottom-right corner
    const winWidth = 230;
    const winHeight = 310;
    const initialX = Math.max(20, screenWidth - winWidth - 30);
    const initialY = Math.max(20, screenHeight - winHeight - 30);

    log(`Creating pet window at (${initialX}, ${initialY}), size ${winWidth}x${winHeight}`);

    petWindow = new BrowserWindow({
        width: winWidth,
        height: winHeight,
        minWidth: 210,
        minHeight: 280,
        x: initialX,
        y: initialY,
        title: 'PokeTokenBar Windows',
        icon: appIconPath,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: true,
        skipTaskbar: true,
        hasShadow: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false
        }
    });

    petWindow.loadFile(path.join(__dirname, 'index.html'));

    petWindow.webContents.on('did-finish-load', () => {
        log('Pet window did-finish-load');
        if (petWindow && !petWindow.isDestroyed()) {
            petWindow.show();
            petWindow.focus();
        }
        updateAll();
    });

    petWindow.on('maximize', () => {
        if (petWindow && !petWindow.isDestroyed()) {
            petWindow.webContents.send('window-maximize-changed', true);
        }
    });
    petWindow.on('unmaximize', () => {
        if (petWindow && !petWindow.isDestroyed()) {
            petWindow.webContents.send('window-maximize-changed', false);
        }
    });

    petWindow.on('closed', () => {
        petWindow = null;
    });
}

function initTray() {
    const icoPath = path.join(__dirname, 'icon.ico');
    const pngPath = path.join(__dirname, 'icon.png');
    let trayIcon;

    if (fs.existsSync(icoPath)) {
        trayIcon = nativeImage.createFromPath(icoPath);
    } else if (fs.existsSync(pngPath)) {
        trayIcon = nativeImage.createFromPath(pngPath).resize({ width: 24, height: 24 });
    } else {
        trayIcon = nativeImage.createEmpty();
    }

    try {
        tray = new Tray(trayIcon);
        tray.setToolTip('PokeTokenBar Windows - Cargando...');
        
        tray.on('click', () => {
            if (petWindow && !petWindow.isDestroyed()) {
                if (petWindow.isVisible()) {
                    petWindow.focus();
                } else {
                    petWindow.show();
                    petWindow.focus();
                }
            } else {
                createPetWindow();
            }
        });

        tray.on('double-click', () => {
            if (petWindow && !petWindow.isDestroyed()) {
                if (petWindow.isVisible()) petWindow.hide();
                else {
                    petWindow.show();
                    petWindow.focus();
                }
            } else {
                createPetWindow();
            }
        });

        updateTrayMenu();
        log('System Tray successfully initialized');
    } catch (e) {
        log(`System Tray error: ${e.message}`);
    }
}

let walkerInterval = null;
let savedBounds = null;
let walkerDirection = 1;

function startWalkerMode() {
    if (!petWindow || petWindow.isDestroyed() || walkerInterval) return;
    savedBounds = petWindow.getBounds();
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workArea;

    const walkerSize = 90;
    let currentX = Math.min(Math.max(10, savedBounds.x), screenWidth - walkerSize - 20);
    const walkerY = Math.max(10, screenHeight - walkerSize - 8);

    petWindow.setMinimumSize(30, 30);
    petWindow.setBounds({
        x: Math.round(currentX),
        y: Math.round(walkerY),
        width: walkerSize,
        height: walkerSize
    });
    petWindow.setAlwaysOnTop(true, 'screen-saver');

    walkerDirection = 1;
    isWalkerEncounterActive = false;
    currentWalkerWild = null;
    encounterCooldown = 120; // ~6s before first encounter

    petWindow.webContents.send('walker-mode-change', { active: true });
    petWindow.webContents.send('walker-flip', 1);

    let restCountdown = 0;
    let expCycleCounter = 0;
    let pickupCooldown = 150; // ~7.5s before first item check

    walkerInterval = setInterval(() => {
        if (!petWindow || petWindow.isDestroyed()) {
            clearInterval(walkerInterval);
            walkerInterval = null;
            return;
        }

        // When encounter is active, handle dual-walking and collision!
        if (isWalkerEncounterActive) {
            if (!isCollided) {
                // Move player's Pokémon
                currentX += walkerDirection * 2;
                petWindow.setPosition(Math.round(currentX), Math.round(walkerY));

                // Move rival's Pokémon towards player
                rivalWalkerX += rivalWalkerDir * 2;
                if (rivalWalkerWindow && !rivalWalkerWindow.isDestroyed()) {
                    rivalWalkerWindow.setPosition(Math.round(rivalWalkerX), Math.round(walkerY));
                }

                // Check distance for screen collision
                const dist = Math.abs(currentX - rivalWalkerX);
                if (dist <= 85) {
                    isCollided = true;
                    handleEncounterCollision(currentX, rivalWalkerX, walkerY);
                }
            }
            return;
        }

        // 1. Passive Walker EXP Cycle (+25 EXP every ~5s = 100 ticks)
        expCycleCounter++;
        if (expCycleCounter >= 100) {
            expCycleCounter = 0;
            if (companion) {
                const ev = companion.awardWalkerExp(25);
                petWindow.webContents.send('walker-exp-gain', { amount: 25, event: ev });
                if (ev) updateAll();
            }
        }

        // 2. Walker Item Discovery Pickup (Random chance every ~10-15s)
        if (pickupCooldown > 0) {
            pickupCooldown--;
        } else if (Math.random() < 0.04) {
            pickupCooldown = 220; // ~11s cooldown
            if (companion) {
                const pickup = companion.checkWalkerPickup();
                if (pickup) {
                    petWindow.webContents.send('walker-item-pickup', pickup);
                    updateAll();
                }
            }
        }

        if (encounterCooldown > 0) {
            encounterCooldown--;
        }

        if (restCountdown > 0) {
            restCountdown--;
            return;
        }

        // Wild rival encounter check while walking (Check if encounters are ON in settings)
        const encountersAllowed = !companion || !companion.state.settings || companion.state.settings.encountersEnabled !== false;
        if (encounterCooldown <= 0 && !battleEngine.isInBattle() && !isWalkerEncounterActive && encountersAllowed && Math.random() < 0.02) {
            const leader = companion ? companion.state.team[companion.state.leadIndex] : null;
            if (leader && !leader.isEgg) {
                triggerWalkerEncounter(null, currentX, walkerY, screenWidth);
                return;
            }
        }

        if (Math.random() < 0.02) {
            restCountdown = 50; // rest for ~2.5s
            petWindow.webContents.send('walker-rest', true);
            return;
        }
        petWindow.webContents.send('walker-rest', false);

        currentX += walkerDirection * 2;
        if (currentX >= screenWidth - walkerSize - 10) {
            walkerDirection = -1;
            petWindow.webContents.send('walker-flip', -1);
        } else if (currentX <= 10) {
            walkerDirection = 1;
            petWindow.webContents.send('walker-flip', 1);
        }

        petWindow.setPosition(Math.round(currentX), Math.round(walkerY));
    }, 50);
}

function triggerWalkerEncounter(forcedSpeciesId = null, atX = null, atY = null, screenWidth = null) {
    if (!petWindow || petWindow.isDestroyed() || !companion) return;
    if (isWalkerEncounterActive || battleEngine.isInBattle()) return;

    const leader = companion.state.team[companion.state.leadIndex];
    if (!leader || leader.isEgg) return;

    // Use unified wild generator respecting playerLevel ± 5 and evolution thresholds!
    const wildBattler = generateWildBattler(leader.level, forcedSpeciesId);
    isWalkerEncounterActive = true;
    currentWalkerWild = wildBattler;
    isCollided = false;

    const primaryDisplay = screen.getPrimaryDisplay();
    const sWidth = screenWidth || primaryDisplay.workArea.width;
    const { height: screenHeight } = primaryDisplay.workArea;
    const walkerSize = 90;
    const walkerY = Math.max(10, screenHeight - walkerSize - 8);

    // Spawn rival on the opposite screen edge
    if (walkerDirection === 1) {
        rivalWalkerX = sWidth - walkerSize - 15;
        rivalWalkerDir = -1;
    } else {
        rivalWalkerX = 15;
        rivalWalkerDir = 1;
    }

    if (rivalWalkerWindow && !rivalWalkerWindow.isDestroyed()) {
        rivalWalkerWindow.destroy();
    }

    rivalWalkerWindow = new BrowserWindow({
        width: walkerSize,
        height: walkerSize,
        x: Math.round(rivalWalkerX),
        y: Math.round(walkerY),
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        hasShadow: false,
        show: false,
        focusable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    const rivalUrl = `file://${path.join(__dirname, 'rival-walker.html')}?speciesId=${wildBattler.id}&level=${wildBattler.level}&shiny=${wildBattler.isShiny}&dir=${rivalWalkerDir}&name=${encodeURIComponent(wildBattler.name)}`;
    rivalWalkerWindow.loadURL(rivalUrl);
    rivalWalkerWindow.setAlwaysOnTop(true, 'screen-saver');
    rivalWalkerWindow.showInactive();

    if (petWindow && !petWindow.isDestroyed()) {
        petWindow.setAlwaysOnTop(true, 'screen-saver');
    }

    log(`Encounter dual walker spawned: ${wildBattler.name} (Lv. ${wildBattler.level})`);
}

function handleEncounterCollision(playerX, rivalX, walkerY) {
    if (!companion || !currentWalkerWild) return;

    // If "Skip VS Dialog" is enabled in settings, fight immediately in background!
    if (companion.state.settings && companion.state.settings.skipVsDialog) {
        executeBackgroundBattleSequence();
        return;
    }

    // Open mini VS prompt floating between the two Pokémon (NO FOCUS STEAL)
    if (vsPromptWindow && !vsPromptWindow.isDestroyed()) {
        vsPromptWindow.destroy();
    }

    const midX = Math.round((playerX + rivalX) / 2) - 40;
    const promptY = Math.max(10, Math.round(walkerY) - 55);

    vsPromptWindow = new BrowserWindow({
        width: 170,
        height: 60,
        x: Math.round(midX),
        y: Math.round(promptY),
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        hasShadow: false,
        show: false,
        focusable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload-vs.js')
        }
    });

    vsPromptWindow.loadFile(path.join(__dirname, 'vs-prompt.html'));
    vsPromptWindow.setAlwaysOnTop(true, 'screen-saver');
    vsPromptWindow.showInactive();
}

function executeBackgroundBattleSequence() {
    if (vsPromptWindow && !vsPromptWindow.isDestroyed()) {
        vsPromptWindow.destroy();
        vsPromptWindow = null;
    }

    if (!companion || !currentWalkerWild) {
        dismissRivalWalker(false);
        return;
    }

    const leadSlot = companion.state.leadIndex;
    const playerMember = companion.state.team[leadSlot];
    const settings = companion.state.settings || {};
    const inventory = companion.state.inventory || {};

    const battleRes = simulateBackgroundBattle(playerMember, currentWalkerWild, settings, inventory);

    if (battleRes.caught && battleRes.capturedPokemon) {
        companion.addCapturedPokemon(battleRes.capturedPokemon);
        const moneyReward = companion.rewardCaptureMoney(battleRes.capturedPokemon.level || 5);
        companion.reviveTeam();
        encounterCooldown = 120; // ~6s cooldown before seeking new encounters
        if (rivalWalkerWindow && !rivalWalkerWindow.isDestroyed()) {
            rivalWalkerWindow.webContents.executeJavaScript('if (window.setAnimation) window.setAnimation("capture");').catch(() => {});
        }
        if (petWindow && !petWindow.isDestroyed()) {
            petWindow.webContents.send('walker-item-pickup', {
                name: `✨ ¡${battleRes.capturedPokemon.name} capturado! (Lv. ${battleRes.capturedPokemon.level}) +$${moneyReward.toLocaleString()} Saldo Tienda`,
                category: 'special'
            });
        }
    } else if (battleRes.victory) {
        // Escaped / defeated wild
        if (battleRes.expReward) {
            companion.awardBattleExp(battleRes.expReward, leadSlot);
        }
        companion.reviveTeam();
        encounterCooldown = 120;
        if (rivalWalkerWindow && !rivalWalkerWindow.isDestroyed()) {
            rivalWalkerWindow.webContents.executeJavaScript('if (window.setAnimation) window.setAnimation("flee");').catch(() => {});
        }
        if (petWindow && !petWindow.isDestroyed()) {
            petWindow.webContents.send('walker-item-pickup', {
                name: `💨 ¡${currentWalkerWild.name} escapó! +${battleRes.expReward} EXP`,
                category: 'battle'
            });
        }
    } else {
        // Defeat: all fainted Pokémon revive with full HP
        companion.reviveTeam();
        encounterCooldown = 120;
        if (petWindow && !petWindow.isDestroyed()) {
            petWindow.webContents.send('walker-item-pickup', {
                name: `⚠️ ¡Combate terminado! Equipo revivido al 100% PS.`,
                category: 'battle'
            });
        }
    }

    companion.saveState();
    updateAll();

    // After animation, close rival window and reset encounter steps
    setTimeout(() => {
        dismissRivalWalker(true);
    }, 750);
}

function dismissRivalWalker(resetEncounterSteps = true) {
    if (vsPromptWindow && !vsPromptWindow.isDestroyed()) {
        vsPromptWindow.destroy();
        vsPromptWindow = null;
    }
    if (rivalWalkerWindow && !rivalWalkerWindow.isDestroyed()) {
        rivalWalkerWindow.destroy();
        rivalWalkerWindow = null;
    }
    isWalkerEncounterActive = false;
    currentWalkerWild = null;
    isCollided = false;
    if (resetEncounterSteps) {
        encounterCooldown = 250; // Steps towards next encounter only start ticking NOW!
    }
}

function stopWalkerMode() {
    isWalkerEncounterActive = false;
    currentWalkerWild = null;
    isCollided = false;
    if (vsPromptWindow && !vsPromptWindow.isDestroyed()) {
        vsPromptWindow.destroy();
        vsPromptWindow = null;
    }
    if (rivalWalkerWindow && !rivalWalkerWindow.isDestroyed()) {
        rivalWalkerWindow.destroy();
        rivalWalkerWindow = null;
    }
    if (walkerInterval) {
        clearInterval(walkerInterval);
        walkerInterval = null;
    }
    if (!petWindow || petWindow.isDestroyed()) return;

    petWindow.setMinimumSize(210, 280);
    if (savedBounds && savedBounds.width > 120 && savedBounds.height > 120) {
        petWindow.setBounds(savedBounds);
    } else {
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primaryDisplay.workArea;
        petWindow.setBounds({
            x: screenWidth - 250,
            y: screenHeight - 330,
            width: 230,
            height: 310
        });
    }
    petWindow.setAlwaysOnTop(true);
    petWindow.webContents.send('walker-mode-change', { active: false });
    petWindow.webContents.send('walker-encounter-end');
}

function updateTrayMenu() {
    if (!tray) return;

    const pokemonInfo = latestStats ? latestStats.pokemon : { pokemonName: 'Pokémon', level: 1, isEgg: true };
    const tokensInfo = latestStats ? latestStats.tokens : { todayTokens: 0, totalTokens: 0 };
    const spendable = latestStats ? latestStats.pokemon.spendableTokens : 0;

    const title = pokemonInfo.isEgg ? '🥚 Incubando Huevo' : `${pokemonInfo.pokemonName} (Lv. ${pokemonInfo.level})`;

    const contextMenu = Menu.buildFromTemplate([
        { label: `PokeTokenBar: ${title}`, enabled: false },
        { label: `Tokens Hoy: ${formatNumber(tokensInfo.todayTokens)}`, enabled: false },
        { label: `Saldo Gastable: ${formatNumber(spendable)}`, enabled: false },
        { label: `Pokédex: ${pokemonInfo.dexCount || 0} Graduados`, enabled: false },
        { type: 'separator' },
        {
            label: '🐾 Alternar Modo Paseo Libre',
            click: () => {
                if (walkerInterval) stopWalkerMode();
                else startWalkerMode();
            }
        },
        {
            label: '⚔️ Arena de Combate (Ventana)',
            click: () => {
                ensureBattleWindow();
            }
        },
        {
            label: '🎮 Modo Juego (Ocultar / Mostrar - Ctrl+Shift+H)',
            click: () => {
                toggleGameMode();
            }
        },
        {
            label: 'Mostrar / Ocultar Ventana',
            click: () => {
                if (petWindow) {
                    if (petWindow.isVisible()) petWindow.hide();
                    else petWindow.show();
                } else {
                    createPetWindow();
                }
            }
        },
        {
            label: '🍬 Usar Caramelo Raro (+1 Nivel)',
            click: () => {
                if (companion) {
                    companion.useRareCandy();
                    updateAll();
                }
            }
        },
        {
            label: '🥚 Comenzar Nuevo Huevo',
            click: () => {
                if (companion) {
                    companion.resetToEgg();
                    updateAll();
                }
            }
        },
        {
            label: '✨ Alternar Shiny',
            click: () => {
                if (companion) {
                    companion.toggleShiny();
                    updateAll();
                }
            }
        },
        {
            label: '🔄 Siguiente Línea Pokémon',
            click: () => {
                if (companion) {
                    companion.nextPokemonLine();
                    updateAll();
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Salir',
            click: () => {
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);
    tray.setToolTip(`PokeTokenBar - ${title} | Hoy: ${formatNumber(tokensInfo.todayTokens)}`);
}

function updateAll() {
    try {
        const tokens = scanner.scan();
        if (tokens.scannerError) {
            const errorSignature = `${tokens.error || 'lectura no disponible'}:${tokens.errorCount || 1}`;
            if (errorSignature !== lastScannerErrorSignature) {
                log(`[TOKEN SCANNER ERROR] ${tokens.error || 'lectura no disponible'} (${tokens.errorCount || 1}); conservando el último estado válido`);
                lastScannerErrorSignature = errorSignature;
            }
            return;
        }
        lastScannerErrorSignature = null;
        const pokemon = companion.updateWithTokens(tokens.todayTokens, tokens.totalTokens);
        latestStats = { tokens, pokemon };

        log(`updateAll: Today=${formatNumber(tokens.todayTokens)}, Total=${formatNumber(tokens.totalTokens)}, State=${pokemon.pokemonName}`);

        if (petWindow && !petWindow.isDestroyed()) {
            petWindow.webContents.send('companion-update', latestStats);
        }
        if (battleWindow && !battleWindow.isDestroyed()) {
            battleWindow.webContents.send('companion-update', latestStats);
        }
        updateTrayMenu();
    } catch (err) {
        log(`Error in updateAll: ${err.message}`);
    }
}

// IPC Handlers
ipcMain.on('request-stats', () => {
    if (latestStats && petWindow && !petWindow.isDestroyed()) {
        petWindow.webContents.send('companion-update', latestStats);
    } else {
        updateAll();
    }
});

ipcMain.on('action-set-lead', (_event, slotIndex) => {
    if (companion) {
        companion.setLead(slotIndex);
        updateAll();
    }
});

ipcMain.on('action-set-difficulty', (_event, mode) => {
    if (companion) {
        companion.setDifficulty(mode);
        updateAll();
    }
});

ipcMain.on('action-toggle-walker', (_event, enabled) => {
    if (enabled) {
        startWalkerMode();
    } else {
        stopWalkerMode();
    }
});

ipcMain.on('action-use-candy', (_event, targetSlotIndex = null) => {
    if (companion) {
        companion.useRareCandy(targetSlotIndex);
        updateAll();
    }
});

ipcMain.on('action-use-mint', () => {
    if (companion) {
        companion.useMint();
        updateAll();
    }
});

ipcMain.on('action-buy-item', (_event, itemKey) => {
    if (companion && latestStats) {
        companion.buyItem(itemKey, latestStats.tokens.totalTokens);
        updateAll();
    }
});

ipcMain.on('action-reset-egg', () => {
    if (companion) {
        companion.resetToEgg();
        updateAll();
    }
});

ipcMain.on('action-force-hatch', () => {
    if (companion) {
        companion.forceHatch();
        updateAll();
    }
});

ipcMain.on('action-next-pokemon', () => {
    if (companion) {
        companion.nextPokemonLine();
        updateAll();
    }
});

ipcMain.on('action-toggle-shiny', () => {
    if (companion) {
        companion.toggleShiny();
        updateAll();
    }
});

ipcMain.on('action-deploy-from-dex', (_event, dexNumber, targetSlotIndex) => {
    if (companion) {
        companion.deployFromDex(dexNumber, targetSlotIndex);
        updateAll();
    }
});

ipcMain.on('action-move-egg-to-team', (_event, eggBagIndex, targetSlotIndex) => {
    if (companion) {
        companion.moveEggToTeam(eggBagIndex, targetSlotIndex);
        updateAll();
    }
});

ipcMain.on('action-toggle-expand', (_event, expanded) => {
    if (petWindow && !petWindow.isDestroyed() && !walkerInterval) {
        const primaryDisplay = screen.getPrimaryDisplay();
        const { height: screenHeight, width: screenWidth } = primaryDisplay.workArea;
        const currentBounds = petWindow.getBounds();
        const newHeight = expanded ? 560 : 310;
        const newWidth = expanded ? 290 : 230;

        const targetY = currentBounds.y - (newHeight - currentBounds.height);
        const safeY = Math.max(10, Math.min(targetY, screenHeight - newHeight - 10));
        const targetX = currentBounds.x - (newWidth - currentBounds.width);
        const safeX = Math.max(10, Math.min(targetX, screenWidth - newWidth - 10));

        petWindow.setBounds({
            x: Math.round(safeX),
            y: Math.round(safeY),
            width: newWidth,
            height: newHeight
        });
    }
});

ipcMain.on('action-window-minimize', () => {
    if (petWindow && !petWindow.isDestroyed()) {
        petWindow.minimize();
    }
});

ipcMain.on('action-window-maximize', () => {
    if (petWindow && !petWindow.isDestroyed()) {
        if (petWindow.isMaximized()) {
            petWindow.unmaximize();
        } else {
            petWindow.maximize();
        }
    }
});

ipcMain.on('action-close-to-walk', () => {
    if (petWindow && !petWindow.isDestroyed()) {
        if (!walkerInterval) {
            startWalkerMode();
        }
    }
});

ipcMain.on('action-close-app', () => {
    app.quit();
});

// PC Box Storage
ipcMain.on('action-deposit-to-pc', (_event, slotIndex) => {
    if (companion) {
        companion.depositToBox(slotIndex);
        updateAll();
    }
});

ipcMain.on('action-withdraw-from-pc', (_event, boxIndex, targetSlotIndex) => {
    if (companion) {
        companion.withdrawFromBox(boxIndex, targetSlotIndex);
        updateAll();
    }
});

ipcMain.on('action-swap-team-slots', (_event, { fromIndex, toIndex }) => {
    if (companion) {
        companion.swapTeamSlots(fromIndex, toIndex);
        updateAll();
    }
});

ipcMain.on('action-swap-box-with-team', (_event, { boxIndex, targetSlotIndex }) => {
    if (companion) {
        companion.swapBoxWithTeam(boxIndex, targetSlotIndex);
        updateAll();
    }
});

ipcMain.on('action-deduplicate-box', () => {
    if (companion) {
        companion.deduplicateBox();
        updateAll();
    }
});

ipcMain.on('action-recruit-from-dex', (_event, { speciesId, targetSlotIndex }) => {
    if (companion) {
        companion.recruitFromDex(speciesId, targetSlotIndex);
        updateAll();
    }
});

ipcMain.on('action-archive-to-dex', (_event, { targetIndex, isFromBox }) => {
    if (companion) {
        companion.archiveToDex(targetIndex, isFromBox);
        updateAll();
    }
});

ipcMain.on('action-upgrade-species-rank', (_event, speciesId) => {
    if (companion) {
        companion.upgradeSpeciesRank(speciesId);
        updateAll();
    }
});

ipcMain.on('action-toggle-hide-on-fullscreen', (_event, enabled) => {
    if (companion) {
        companion.updateSetting('hideOnFullscreen', !!enabled);
        updateAll();
    }
});

// Branch Evolution & Moves (No HMs)
ipcMain.on('action-choose-branch-evolution', (_event, slotIndex, branchId) => {
    if (companion) {
        companion.chooseBranchEvolution(slotIndex, branchId);
        updateAll();
    }
});

ipcMain.on('action-replace-move', (_event, slotIndex, newMove, replaceIdx) => {
    if (companion) {
        companion.learnOrReplaceMove(slotIndex, newMove, replaceIdx);
        updateAll();
    }
});

ipcMain.on('action-swap-active-move', (_event, slotIndex, activeSlotIdx, newMove) => {
    if (companion) {
        companion.changeActiveMove(slotIndex, activeSlotIdx, newMove);
        updateAll();
    }
});

ipcMain.on('action-dismiss-move-learn', () => {
    if (companion) {
        companion.dismissPendingMoveLearn();
        updateAll();
    }
});

// Turn-Based Battle Engine
ipcMain.on('action-start-battle', (_event, slotIndex = null, forcedSpeciesId = null) => {
    if (companion && battleEngine) {
        const leadSlot = (slotIndex !== null && slotIndex !== undefined) ? slotIndex : companion.state.leadIndex;
        const leader = companion.state.team[leadSlot];
        if (!leader || leader.isEgg) return;

        battleEngine.startBattle(leader, leadSlot, forcedSpeciesId, companion.state.team);
        ensureBattleWindow();
        broadcastBattleUpdate(battleEngine.getBattleState());
        updateAll();
    }
});

ipcMain.on('action-walker-fight', (_event, wildId) => {
    fightWalkerEncounter(wildId);
});

ipcMain.on('action-walker-flee', () => {
    fleeWalkerEncounter();
});

ipcMain.on('action-trigger-walker-encounter', (_event, forcedSpeciesId) => {
    if (walkerInterval) {
        triggerWalkerEncounter(forcedSpeciesId);
    } else {
        if (petWindow && !petWindow.isDestroyed()) {
            petWindow.webContents.send('open-battle-tab');
        }
    }
});

ipcMain.on('action-battle-move', (_event, moveIndex) => {
    if (battleEngine && companion) {
        clearAutoBattleTimer();
        const slotIdx = (battleEngine.activeBattle && battleEngine.activeBattle.player) ? battleEngine.activeBattle.player.slotIndex : null;
        const res = battleEngine.executePlayerMove(moveIndex);
        applyBattleActionResult(res, slotIdx);
        broadcastBattleUpdate(battleEngine.getBattleState());
        updateAll();
        scheduleAutoBattleMove();
    }
});

ipcMain.on('action-battle-auto-move', () => {
    if (battleEngine && companion) {
        clearAutoBattleTimer();
        executeAutoBattleTurn();
    }
});

ipcMain.on('action-battle-item', (_event, itemType) => {
    if (battleEngine && companion) {
        if (itemType === 'potion') {
            if (companion.state.inventory.potions > 0) {
                companion.state.inventory.potions--;
                battleEngine.usePotion(30);
                companion.saveState();
            }
        }
        broadcastBattleUpdate(battleEngine.getBattleState());
        updateAll();
    }
});

ipcMain.on('action-battle-catch', (_event, ballType = 'poke-ball') => {
    if (battleEngine && companion) {
        clearAutoBattleTimer();
        if (!battleEngine.isInBattle() || !battleEngine.activeBattle.inCatchPhase) {
            broadcastBattleUpdate(battleEngine.getBattleState());
            return;
        }

        let hasBall = false;

        const bLower = (ballType || '').toLowerCase();
        if (bLower.includes('master')) {
            if ((companion.state.inventory.masterballs || 0) > 0) {
                companion.state.inventory.masterballs--;
                hasBall = true;
            }
        } else if (bLower.includes('ultra')) {
            if ((companion.state.inventory.ultraballs || 0) > 0) {
                companion.state.inventory.ultraballs--;
                hasBall = true;
            }
        } else if (bLower.includes('great') || bLower.includes('super')) {
            if ((companion.state.inventory.greatballs || 0) > 0) {
                companion.state.inventory.greatballs--;
                hasBall = true;
            }
        } else {
            // Standard Poké Ball is INFINITE!
            hasBall = true;
        }

        if (hasBall) {
            const res = battleEngine.throwPokeball(ballType);
            if (res && res.caught && res.capturedPokemon) {
                companion.addCapturedPokemon(res.capturedPokemon);
                if (res.moneyReward) {
                    companion.rewardCaptureMoney(res.capturedPokemon.level || 5);
                }
                companion.reviveTeam();
                encounterCooldown = 120;
            }
            companion.saveState();
        }

        broadcastBattleUpdate(battleEngine.getBattleState());
        updateAll();
    }
});

ipcMain.on('action-battle-finish-catch', () => {
    if (battleEngine && companion) {
        clearAutoBattleTimer();
        const slotIdx = (battleEngine.activeBattle && battleEngine.activeBattle.player) ? battleEngine.activeBattle.player.slotIndex : null;
        const res = battleEngine.finishCatchPhase();
        if (!res || !res.success) {
            broadcastBattleUpdate(battleEngine.getBattleState());
            return;
        }
        if (res.expReward) {
            companion.awardBattleExp(res.expReward, slotIdx);
        }
        companion.reviveTeam();
        encounterCooldown = 120;
        broadcastBattleUpdate(battleEngine.getBattleState());
        updateAll();
    }
});


// Walker VS & Collision IPC Handlers
ipcMain.on('action-walker-vs-fight', () => {
    if (!companion || !currentWalkerWild) {
        dismissRivalWalker(false);
        return;
    }
    const leadSlot = companion.state.leadIndex;
    const playerMember = companion.state.team[leadSlot];
    const wildSpeciesId = currentWalkerWild.id;

    dismissRivalWalker(false);

    battleEngine.startBattle(playerMember, leadSlot, wildSpeciesId, companion.state.team);
    ensureBattleWindow();
    broadcastBattleUpdate(battleEngine.getBattleState());
});

ipcMain.on('action-walker-vs-timeout', () => {
    executeBackgroundBattleSequence();
});

ipcMain.on('action-walker-vs-confirm', () => {
    executeBackgroundBattleSequence();
});

ipcMain.on('action-walker-vs-flee', () => {
    dismissRivalWalker(true);
});

// Settings Modal IPC Handlers
ipcMain.on('action-toggle-skip-vs-dialog', () => {
    if (companion) {
        companion.toggleSkipVsDialog();
        updateAll();
    }
});

ipcMain.on('action-toggle-use-special-balls', () => {
    if (companion) {
        companion.toggleUseSpecialBalls();
        updateAll();
    }
});

ipcMain.on('action-toggle-audio-setting', () => {
    if (companion) {
        companion.toggleAudio();
        updateAll();
    }
});

ipcMain.on('action-repair-team', () => {
    if (companion) {
        companion.repairTeam();
        companion.reviveTeam();
        updateAll();
        if (battleEngine && battleEngine.isInBattle()) {
            broadcastBattleUpdate(battleEngine.getBattleState());
        }
    }
});

ipcMain.on('action-update-setting', (_event, { key, val }) => {
    if (companion) {
        companion.updateSetting(key, val);
        updateAll();
    }
});

// GitHub Releases Updater
function compareVersions(v1, v2) {
    const p1 = String(v1).replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
    const p2 = String(v2).replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
        const a = p1[i] || 0;
        const b = p2[i] || 0;
        if (a > b) return 1;
        if (a < b) return -1;
    }
    return 0;
}

async function fetchLatestRelease() {
    let currentVersion = '1.0.0';
    try {
        currentVersion = app.getVersion() || '1.0.0';
    } catch (_e) {}

    const repoUrl = 'https://api.github.com/repos/vickotoAguilera/PokeBar/releases/latest';
    try {
        const response = await fetch(repoUrl, {
            headers: { 'User-Agent': 'PokeBar-Desktop-App' }
        });
        if (!response.ok) {
            return { success: false, error: `GitHub API HTTP ${response.status}`, currentVersion };
        }
        const data = await response.json();
        const remoteTag = data.tag_name || '';
        const hasUpdate = compareVersions(remoteTag, currentVersion) > 0;

        let downloadUrl = data.html_url;
        if (Array.isArray(data.assets)) {
            const exeAsset = data.assets.find(a => a.name && a.name.toLowerCase().endsWith('.exe'));
            if (exeAsset && exeAsset.browser_download_url) {
                downloadUrl = exeAsset.browser_download_url;
            }
        }

        return {
            success: true,
            hasUpdate,
            currentVersion,
            remoteVersion: remoteTag,
            name: data.name || remoteTag,
            notes: data.body || '',
            releaseUrl: data.html_url,
            downloadUrl
        };
    } catch (err) {
        log(`[UPDATER ERROR] ${err.message}`);
        return { success: false, error: err.message, currentVersion };
    }
}

ipcMain.handle('check-for-updates', async () => {
    return await fetchLatestRelease();
});

ipcMain.on('action-open-external-url', (_event, url) => {
    if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
        shell.openExternal(url);
    }
});

ipcMain.on('action-battle-switch', (_event, slotIndex) => {
    if (battleEngine && companion) {
        clearAutoBattleTimer();
        const newMember = companion.state.team[slotIndex];
        battleEngine.switchPlayerBattler(newMember, slotIndex);
        broadcastBattleUpdate(battleEngine.getBattleState());
        scheduleAutoBattleMove();
    }
});

ipcMain.on('action-battle-run', () => {
    if (battleEngine && companion) {
        clearAutoBattleTimer();
        battleEngine.run();
        companion.reviveTeam();
        encounterCooldown = 120;
        broadcastBattleUpdate(battleEngine.getBattleState());
        updateAll();
    }
});

ipcMain.on('action-toggle-encounters', () => {
    if (companion) {
        companion.toggleEncounters();
        updateAll();
    }
});

ipcMain.on('action-toggle-auto-battle', () => {
    if (companion) {
        const isAuto = companion.toggleAutoBattle();
        if (isAuto) scheduleAutoBattleMove();
        else clearAutoBattleTimer();
        updateAll();
    }
});

ipcMain.on('action-toggle-battle-speed', () => {
    if (companion) {
        companion.toggleBattleSpeed();
        scheduleAutoBattleMove();
        updateAll();
    }
});

ipcMain.on('action-toggle-battle-window', () => {
    toggleBattleWindow();
});

function broadcastBattleUpdate(state) {
    if (petWindow && !petWindow.isDestroyed()) {
        petWindow.webContents.send('battle-update', state);
    }
    if (battleWindow && !battleWindow.isDestroyed()) {
        battleWindow.webContents.send('battle-update', state);
    }
}

function ensureBattleWindow() {
    // If no battle is active, start a wild encounter automatically with the lead Pokémon!
    if (companion && !battleEngine.isInBattle()) {
        const leadSlot = companion.state.leadIndex;
        const leader = companion.state.team[leadSlot];
        if (leader && !leader.isEgg) {
            battleEngine.startBattle(leader, leadSlot, null, companion.state.team);
        }
    }
    scheduleAutoBattleMove();

    if (battleWindow && !battleWindow.isDestroyed()) {
        if (battleWindow.isMinimized()) battleWindow.restore();
        battleWindow.show();
        battleWindow.focus();
        battleWindow.webContents.send('battle-update', battleEngine.getBattleState());
        if (latestStats) {
            battleWindow.webContents.send('companion-update', latestStats);
        }
        return battleWindow;
    }

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workArea;
    const bWidth = 520;
    const bHeight = 350;

    let bX = screenWidth - bWidth - 260;
    let bY = screenHeight - bHeight - 30;

    if (petWindow && !petWindow.isDestroyed()) {
        const bounds = petWindow.getBounds();
        bX = bounds.x - bWidth - 15;
        bY = bounds.y;
    }

    if (bX < 15) bX = 15;
    if (bY + bHeight > screenHeight) bY = Math.max(15, screenHeight - bHeight - 20);

    battleWindow = new BrowserWindow({
        width: bWidth,
        height: bHeight,
        minWidth: 440,
        minHeight: 290,
        x: Math.round(bX),
        y: Math.round(bY),
        title: 'PokeTokenBar Arena de Combate',
        icon: appIconPath,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: true,
        skipTaskbar: true,
        hasShadow: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false
        }
    });

    battleWindow.loadFile(path.join(__dirname, 'battle.html'));

    battleWindow.webContents.on('did-finish-load', () => {
        if (battleWindow && !battleWindow.isDestroyed()) {
            battleWindow.webContents.send('battle-update', battleEngine.getBattleState());
            if (latestStats) {
                battleWindow.webContents.send('companion-update', latestStats);
            }
            battleWindow.show();
            battleWindow.focus();
        }
    });

    // When minimized or closed, transfer active battle seamlessly to the embedded petWindow card!
    battleWindow.on('minimize', () => {
        if (battleEngine.isInBattle() && petWindow && !petWindow.isDestroyed()) {
            petWindow.webContents.send('open-embedded-battle', battleEngine.getBattleState());
            petWindow.show();
            petWindow.focus();
        }
    });

    battleWindow.on('close', () => {
        if (battleEngine.isInBattle() && petWindow && !petWindow.isDestroyed()) {
            petWindow.webContents.send('open-embedded-battle', battleEngine.getBattleState());
            petWindow.show();
            petWindow.focus();
        }
    });

    battleWindow.on('closed', () => {
        battleWindow = null;
    });

    return battleWindow;
}

function toggleBattleWindow() {
    if (battleWindow && !battleWindow.isDestroyed()) {
        battleWindow.close();
        battleWindow = null;
        return;
    }
    ensureBattleWindow();
}

function toggleGameMode() {
    if (petWindow && !petWindow.isDestroyed()) {
        if (petWindow.isVisible()) {
            petWindow.hide();
            if (battleWindow && !battleWindow.isDestroyed()) battleWindow.hide();
            if (rivalWalkerWindow && !rivalWalkerWindow.isDestroyed()) rivalWalkerWindow.hide();
            log('🎮 Modo Juego: Ventanas ocultas (Segundo plano activo acumulando Tokens y EXP)');
        } else {
            petWindow.show();
            petWindow.focus();
            log('🎮 Modo Juego: Ventanas visibles');
        }
    }
}

// App Lifecycle
app.whenReady().then(() => {
    log('Electron app is ready');
    const userDataPath = app.getPath('userData');
    log(`User data path: ${userDataPath}`);
    writeProcessPid(userDataPath);

    scanner = new TokenScanner();
    companion = new CompanionManager(userDataPath);

    initTray();
    createPetWindow();

    try {
        globalShortcut.register('CommandOrControl+Shift+H', () => {
            toggleGameMode();
        });
    } catch (e) {
        log(`Error al registrar atajo global: ${e.message}`);
    }

    // Poll tokens every 3 seconds
    setInterval(updateAll, 3000);
});

app.on('will-quit', () => {
    clearAutoBattleTimer();
    removeProcessPid();
    try {
        globalShortcut.unregisterAll();
    } catch (e) {}
});

app.on('window-all-closed', () => {
    // Keep running in tray unless explicit quit
});
