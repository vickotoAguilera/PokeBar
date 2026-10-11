const { contextBridge, ipcRenderer } = require('electron');

let cachedPokedexAll = [];
try {
    cachedPokedexAll = require('./pokedex_all.json');
} catch (e) {
    try {
        const fs = require('fs');
        const path = require('path');
        cachedPokedexAll = JSON.parse(fs.readFileSync(path.join(__dirname, 'pokedex_all.json'), 'utf8'));
    } catch (_err) {
        cachedPokedexAll = [];
    }
}


contextBridge.exposeInMainWorld('api', {
    // Listeners
    onUpdate: (callback) => ipcRenderer.on('companion-update', (_event, data) => callback(data)),
    onWalkerModeChange: (callback) => ipcRenderer.on('walker-mode-change', (_event, data) => callback(data)),
    onWalkerRest: (callback) => ipcRenderer.on('walker-rest', (_event, isResting) => callback(isResting)),
    onWalkerFlip: (callback) => ipcRenderer.on('walker-flip', (_event, dir) => callback(dir)),
    onWalkerExpGain: (callback) => ipcRenderer.on('walker-exp-gain', (_event, data) => callback(data)),
    onWalkerItemPickup: (callback) => ipcRenderer.on('walker-item-pickup', (_event, data) => callback(data)),
    onBattleUpdate: (callback) => ipcRenderer.on('battle-update', (_event, data) => callback(data)),
    onWildEncounterAlert: (callback) => ipcRenderer.on('wild-encounter-alert', (_event, data) => callback(data)),
    onWalkerEncounterStart: (callback) => ipcRenderer.on('walker-encounter-start', (_event, data) => callback(data)),
    onWalkerEncounterEnd: (callback) => ipcRenderer.on('walker-encounter-end', (_event) => callback()),
    onOpenBattleTab: (callback) => ipcRenderer.on('open-battle-tab', (_event) => callback()),
    onOpenEmbeddedBattle: (callback) => ipcRenderer.on('open-embedded-battle', (_event, data) => callback(data)),

    // Pokédex All Data Access
    getAllPokedex: () => cachedPokedexAll,

    // General App / Companion Actions
    requestStats: () => ipcRenderer.send('request-stats'),
    setLead: (slotIndex) => ipcRenderer.send('action-set-lead', slotIndex),
    setDifficulty: (mode) => ipcRenderer.send('action-set-difficulty', mode),
    toggleWalker: (enabled) => ipcRenderer.send('action-toggle-walker', enabled),
    toggleEncounters: () => ipcRenderer.send('action-toggle-encounters'),
    toggleSkipVsDialog: () => ipcRenderer.send('action-toggle-skip-vs-dialog'),
    toggleUseSpecialBalls: () => ipcRenderer.send('action-toggle-use-special-balls'),
    toggleAudioSetting: () => ipcRenderer.send('action-toggle-audio-setting'),
    repairTeam: () => ipcRenderer.send('action-repair-team'),
    updateSetting: (key, val) => ipcRenderer.send('action-update-setting', { key, val }),
    toggleAutoBattle: () => ipcRenderer.send('action-toggle-auto-battle'),
    toggleBattleSpeed: () => ipcRenderer.send('action-toggle-battle-speed'),
    toggleBattleWindow: () => ipcRenderer.send('action-toggle-battle-window'),
    walkerFight: (wildId) => ipcRenderer.send('action-walker-fight', wildId),
    walkerFlee: () => ipcRenderer.send('action-walker-flee'),
    triggerWalkerEncounter: (forcedSpeciesId) => ipcRenderer.send('action-trigger-walker-encounter', forcedSpeciesId),
    useCandy: () => ipcRenderer.send('action-use-candy'),
    useMint: () => ipcRenderer.send('action-use-mint'),
    buyItem: (itemKey) => ipcRenderer.send('action-buy-item', itemKey),
    resetToEgg: () => ipcRenderer.send('action-reset-egg'),
    forceHatch: () => ipcRenderer.send('action-force-hatch'),
    toggleShiny: () => ipcRenderer.send('action-toggle-shiny'),
    nextPokemon: () => ipcRenderer.send('action-next-pokemon'),
    deployFromDex: (dexNumber, targetSlotIndex) => ipcRenderer.send('action-deploy-from-dex', dexNumber, targetSlotIndex),
    moveEggToTeam: (eggBagIndex, targetSlotIndex) => ipcRenderer.send('action-move-egg-to-team', eggBagIndex, targetSlotIndex),
    toggleExpand: (expanded) => ipcRenderer.send('action-toggle-expand', expanded),
    minimizeWindow: () => ipcRenderer.send('action-window-minimize'),
    toggleMaximize: () => ipcRenderer.send('action-window-maximize'),
    closeToWalk: () => ipcRenderer.send('action-close-to-walk'),
    onMaximizeChange: (callback) => ipcRenderer.on('window-maximize-changed', (_event, isMax) => callback(isMax)),
    closeApp: () => ipcRenderer.send('action-close-app'),

    // PC Box Storage Actions & Drag and Drop Reordering
    depositToPC: (slotIndex) => ipcRenderer.send('action-deposit-to-pc', slotIndex),
    depositToBox: (slotIndex) => ipcRenderer.send('action-deposit-to-pc', slotIndex),
    withdrawFromPC: (boxIndex, targetSlotIndex) => ipcRenderer.send('action-withdraw-from-pc', boxIndex, targetSlotIndex),
    swapTeamSlots: (fromIndex, toIndex) => ipcRenderer.send('action-swap-team-slots', { fromIndex, toIndex }),
    swapBoxWithTeam: (boxIndex, targetSlotIndex) => ipcRenderer.send('action-swap-box-with-team', { boxIndex, targetSlotIndex }),
    deduplicateBox: () => ipcRenderer.send('action-deduplicate-box'),
    recruitFromDex: (speciesId, targetSlotIndex) => ipcRenderer.send('action-recruit-from-dex', { speciesId, targetSlotIndex }),
    archiveToDex: (targetIndex, isFromBox) => ipcRenderer.send('action-archive-to-dex', { targetIndex, isFromBox }),
    upgradeSpeciesRank: (speciesId) => ipcRenderer.send('action-upgrade-species-rank', speciesId),
    toggleHideOnFullscreen: (enabled) => ipcRenderer.send('action-toggle-hide-on-fullscreen', enabled),

    // Branching Evolution & Moves (No HMs)
    chooseBranchEvolution: (slotIndex, branchId) => ipcRenderer.send('action-choose-branch-evolution', slotIndex, branchId),
    learnOrReplaceMove: (slotIndex, newMove, replaceIdx) => ipcRenderer.send('action-replace-move', slotIndex, newMove, replaceIdx),
    changeActiveMove: (slotIndex, activeSlotIdx, newMove) => ipcRenderer.send('action-swap-active-move', slotIndex, activeSlotIdx, newMove),
    dismissMoveLearn: () => ipcRenderer.send('action-dismiss-move-learn'),

    // Turn-Based Battle Engine Actions
    startBattle: (slotIndex, forcedSpeciesId) => ipcRenderer.send('action-start-battle', slotIndex, forcedSpeciesId),
    battleMove: (moveIndex) => ipcRenderer.send('action-battle-move', moveIndex),
    battleAutoMove: () => ipcRenderer.send('action-battle-auto-move'),
    battleItem: (itemType) => ipcRenderer.send('action-battle-item', itemType),
    battleCatch: (ballType) => ipcRenderer.send('action-battle-catch', ballType),
    battleFinishCatch: () => ipcRenderer.send('action-battle-finish-catch'),
    battleSwitch: (slotIndex) => ipcRenderer.send('action-battle-switch', slotIndex),
    battleRun: () => ipcRenderer.send('action-battle-run'),

    // In-App Updates & External URLs
    checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
    openExternalUrl: (url) => ipcRenderer.send('action-open-external-url', url)
});
