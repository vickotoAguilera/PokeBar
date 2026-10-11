// Renderer script for PokeTokenBar Windows
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Status Header
    const levelBadge = document.getElementById('levelBadge');
    const shinyBadge = document.getElementById('shinyBadge');
    const btnAudioToggle = document.getElementById('btnAudioToggle');
    const btnToggleEncounters = document.getElementById('btnToggleEncounters');
    const btnWalkerMode = document.getElementById('btnWalkerMode');
    const btnSettings = document.getElementById('btnSettings');
    const toggleDetailsBtn = document.getElementById('toggleDetailsBtn');
    const btnWinMinimize = document.getElementById('btnWinMinimize');
    const btnWinMaximize = document.getElementById('btnWinMaximize');
    const btnWinClose = document.getElementById('btnWinClose');
    const partyBar = document.getElementById('partyBar');

    // Settings Modal Elements
    const settingsModalOverlay = document.getElementById('settingsModalOverlay');
    const btnCloseSettings = document.getElementById('btnCloseSettings');
    const btnCloseSettingsX = document.getElementById('btnCloseSettingsX');
    const settingEncountersSwitch = document.getElementById('settingEncountersSwitch');
    const settingSkipVsSwitch = document.getElementById('settingSkipVsSwitch');
    const settingSpecialBallsSwitch = document.getElementById('settingSpecialBallsSwitch');
    const settingAudioSwitch = document.getElementById('settingAudioSwitch');
    const settingHideOnFullscreenSwitch = document.getElementById('settingHideOnFullscreenSwitch');
    const btnRepairTeam = document.getElementById('btnRepairTeam');

    // Pokédex PokeAPI Details Modal Elements
    const dexDetailsModal = document.getElementById('dexDetailsModal');
    const btnCloseDexModal = document.getElementById('btnCloseDexModal');
    const btnCloseDexModalX = document.getElementById('btnCloseDexModalX');
    const modalDexNumber = document.getElementById('modalDexNumber');
    const modalDexName = document.getElementById('modalDexName');
    const modalDexRankBadge = document.getElementById('modalDexRankBadge');
    const modalDexSprite = document.getElementById('modalDexSprite');
    const modalDexTypes = document.getElementById('modalDexTypes');
    const modalDexHeight = document.getElementById('modalDexHeight');
    const modalDexWeight = document.getElementById('modalDexWeight');
    const modalDexAbility = document.getElementById('modalDexAbility');
    const modalDexStatTotal = document.getElementById('modalDexStatTotal');
    const barDexHp = document.getElementById('barDexHp');
    const valDexHp = document.getElementById('valDexHp');
    const barDexAtk = document.getElementById('barDexAtk');
    const valDexAtk = document.getElementById('valDexAtk');
    const barDexDef = document.getElementById('barDexDef');
    const valDexDef = document.getElementById('valDexDef');
    const barDexSpd = document.getElementById('barDexSpd');
    const valDexSpd = document.getElementById('valDexSpd');
    const modalDexFlavor = document.getElementById('modalDexFlavor');
    const modalDexEssenceCount = document.getElementById('modalDexEssenceCount');
    const modalDexEssenceBar = document.getElementById('modalDexEssenceBar');
    const modalDexBonusDesc = document.getElementById('modalDexBonusDesc');
    const btnUpgradeRankModal = document.getElementById('btnUpgradeRankModal');
    const btnDeployFromModal = document.getElementById('btnDeployFromModal');
    const leadRankBadge = document.getElementById('leadRankBadge');
    const leadPokemonNameText = document.getElementById('leadPokemonNameText');

    // Sprite Stage & Details
    const spriteStage = document.getElementById('spriteStage');
    const pokemonSprite = document.getElementById('pokemonSprite');
    const pokemonName = document.getElementById('pokemonName');
    const natureTag = document.getElementById('natureTag');
    const todayTokensDisplay = document.getElementById('todayTokensDisplay');
    const spendableTokensDisplay = document.getElementById('spendableTokensDisplay');
    const progressLabel = document.getElementById('progressLabel');
    const progressPercent = document.getElementById('progressPercent');
    const progressFill = document.getElementById('progressFill');
    const walkerFloatingBubble = document.getElementById('walkerFloatingBubble');

    // Quick Actions & Card
    const petCard = document.getElementById('petCard');
    const btnWalkShortcut = document.getElementById('btnWalkShortcut');
    const btnBattleShortcut = document.getElementById('btnBattleShortcut');
    const btnCryShortcut = document.getElementById('btnCryShortcut');
    const walkerAlert = document.getElementById('walkerAlert');

    // Modals
    const swapModalOverlay = document.getElementById('swapModalOverlay');
    const swapSlotsList = document.getElementById('swapSlotsList');
    const btnCancelSwap = document.getElementById('btnCancelSwap');

    const branchModalOverlay = document.getElementById('branchModalOverlay');
    const branchCardsContainer = document.getElementById('branchCardsContainer');
    const btnCancelBranch = document.getElementById('btnCancelBranch');

    const moveLearnModalOverlay = document.getElementById('moveLearnModalOverlay');
    const newMoveInfo = document.getElementById('newMoveInfo');
    const currentMovesToReplaceList = document.getElementById('currentMovesToReplaceList');
    const btnCancelMoveLearn = document.getElementById('btnCancelMoveLearn');

    // Bag Tab
    const bagCandiesCount = document.getElementById('bagCandiesCount');
    const btnUseCandy = document.getElementById('btnUseCandy');
    const bagMintsCount = document.getElementById('bagMintsCount');
    const btnUseMint = document.getElementById('btnUseMint');
    const bagPokeballsCount = document.getElementById('bagPokeballsCount');
    const bagGreatballsCount = document.getElementById('bagGreatballsCount');
    const bagUltraballsCount = document.getElementById('bagUltraballsCount');
    const bagMasterballsCount = document.getElementById('bagMasterballsCount');
    const bagPotionsCount = document.getElementById('bagPotionsCount');
    const bagCharmStatus = document.getElementById('bagCharmStatus');
    const bagCharmLabel = document.getElementById('bagCharmLabel');
    const eggBagCountDisplay = document.getElementById('eggBagCountDisplay');
    const eggBagList = document.getElementById('eggBagList');

    // Shop Tab
    const btnBuyCandy = document.getElementById('btnBuyCandy');
    const btnBuyMint = document.getElementById('btnBuyMint');
    const btnBuyPokeballs = document.getElementById('btnBuyPokeballs');
    const btnBuyGreatballs = document.getElementById('btnBuyGreatballs');
    const btnBuyUltraballs = document.getElementById('btnBuyUltraballs');
    const btnBuyMasterball = document.getElementById('btnBuyMasterball');
    const btnBuyPotions = document.getElementById('btnBuyPotions');
    const btnBuyCharm = document.getElementById('btnBuyCharm');
    const btnBuyEggCommon = document.getElementById('btnBuyEggCommon');
    const btnBuyEggUncommon = document.getElementById('btnBuyEggUncommon');
    const btnBuyEggRare = document.getElementById('btnBuyEggRare');
    const shopEggCommonDesc = document.getElementById('shopEggCommonDesc');
    const shopEggUncommonDesc = document.getElementById('shopEggUncommonDesc');
    const shopEggRareDesc = document.getElementById('shopEggRareDesc');

    // Pokédex & PC Box Tabs (GBA Style)
    const pcBoxContainer = document.getElementById('pcBoxContainer');
    const boxTotalCount = document.getElementById('boxTotalCount');
    const dexContainer = document.getElementById('dexContainer');
    const dexTotalCount = document.getElementById('dexTotalCount');
    const dexRegionNav = document.getElementById('dexRegionNav');

    // GBA PC Box Elements
    const gbaFiltersBar = document.getElementById('gbaFiltersBar');
    const gbaBoxGrid = document.getElementById('gbaBoxGrid');
    const gbaBoxTitle = document.getElementById('gbaBoxTitle');
    const btnGbaBoxPrev = document.getElementById('btnGbaBoxPrev');
    const btnGbaBoxNext = document.getElementById('btnGbaBoxNext');
    const gbaInspSprite = document.getElementById('gbaInspSprite');
    const gbaInspName = document.getElementById('gbaInspName');
    const gbaInspLevel = document.getElementById('gbaInspLevel');
    const gbaInspTypes = document.getElementById('gbaInspTypes');
    const gbaInspNature = document.getElementById('gbaInspNature');
    const gbaInspHp = document.getElementById('gbaInspHp');
    const gbaInspMove1 = document.getElementById('gbaInspMove1');
    const btnGbaMoveToTeam = document.getElementById('btnGbaMoveToTeam');
    const btnGbaArchiveToDex = document.getElementById('btnGbaArchiveToDex');
    const btnGbaCleanDuplicates = document.getElementById('btnGbaCleanDuplicates');

    // Battle Tab Elements (Embedded Arena & Lobby)
    const battleInactiveView = document.getElementById('battleInactiveView');
    const battleActiveView = document.getElementById('battleActiveView');
    const btnStartWildBattle = document.getElementById('btnStartWildBattle');
    const embRivalName = document.getElementById('embRivalName');
    const embRivalLevel = document.getElementById('embRivalLevel');
    const embRivalHpBar = document.getElementById('embRivalHpBar');
    const embRivalHpText = document.getElementById('embRivalHpText');
    const embRivalSprite = document.getElementById('embRivalSprite');
    const embPlayerName = document.getElementById('embPlayerName');
    const embPlayerLevel = document.getElementById('embPlayerLevel');
    const embPlayerHpBar = document.getElementById('embPlayerHpBar');
    const embPlayerHpText = document.getElementById('embPlayerHpText');
    const embPlayerSprite = document.getElementById('embPlayerSprite');
    const embBattleLogTicker = document.getElementById('embBattleLogTicker');
    const embMovesGrid = document.getElementById('embMovesGrid');
    const btnEmbThrowBall = document.getElementById('btnEmbThrowBall');
    const btnEmbRun = document.getElementById('btnEmbRun');
    const btnPopoutBattleWindow = document.getElementById('btnPopoutBattleWindow');
    const embeddedTurnIndicator = document.getElementById('embeddedTurnIndicator');

    // Controls
    const btnBattleSpeedToggle = document.getElementById('btnBattleSpeedToggle');
    const btnBattleAutoToggle = document.getElementById('btnBattleAutoToggle');
    const btnBattlePopoutToggle = document.getElementById('btnBattlePopoutToggle');
    const battleTurnIndicator = document.getElementById('battleTurnIndicator');

    // Wild Rival (Top-Right)
    const battleWildSprite = document.getElementById('battleWildSprite');
    const battleWildName = document.getElementById('battleWildName');
    const battleWildLevel = document.getElementById('battleWildLevel');
    const battleWildHpBar = document.getElementById('battleWildHpBar');
    const battleWildHpText = document.getElementById('battleWildHpText');

    // Player Battler (Bottom-Left)
    const battlePlayerSprite = document.getElementById('battlePlayerSprite');
    const battlePlayerName = document.getElementById('battlePlayerName');
    const battlePlayerLevel = document.getElementById('battlePlayerLevel');
    const battlePlayerHpBar = document.getElementById('battlePlayerHpBar');
    const battlePlayerHpText = document.getElementById('battlePlayerHpText');

    // Action Box (Bottom-Right: 2x2 Moves Grid or Catch Console)
    const battleMovesSection = document.getElementById('battleMovesSection');
    const battleMovesGrid = document.getElementById('battleMovesGrid');
    const btnBattleUsePotion = document.getElementById('btnBattleUsePotion');
    const btnBattleSwitchMember = document.getElementById('btnBattleSwitchMember');
    const btnBattleRun = document.getElementById('btnBattleRun');

    // Catch Section
    const battleCatchSection = document.getElementById('battleCatchSection');
    const btnCatchPokeBall = document.getElementById('btnCatchPokeBall');
    const btnCatchGreatBall = document.getElementById('btnCatchGreatBall');
    const btnCatchUltraBall = document.getElementById('btnCatchUltraBall');
    const btnCatchMasterBall = document.getElementById('btnCatchMasterBall');
    const catchPokeCount = document.getElementById('catchPokeCount');
    const catchGreatCount = document.getElementById('catchGreatCount');
    const catchUltraCount = document.getElementById('catchUltraCount');
    const catchMasterCount = document.getElementById('catchMasterCount');
    const catchPokeRate = document.getElementById('catchPokeRate');
    const catchGreatRate = document.getElementById('catchGreatRate');
    const catchUltraRate = document.getElementById('catchUltraRate');
    const btnFinishCatch = document.getElementById('btnFinishCatch');

    // Switch Submenu & Combat Log
    const battleSwitchSubmenu = document.getElementById('battleSwitchSubmenu');
    const battleSwitchList = document.getElementById('battleSwitchList');
    const btnBackFromSwitch = document.getElementById('btnBackFromSwitch');
    const battleCombatLog = document.getElementById('battleCombatLog');

    // Team & Stats Tab
    const infoLeadName = document.getElementById('infoLeadName');
    const infoStageLabel = document.getElementById('infoStageLabel');
    const btnDepositLeadToPC = document.getElementById('btnDepositLeadToPC');
    const statsMovesGrid = document.getElementById('statsMovesGrid');
    const learnedMovesList = document.getElementById('learnedMovesList');
    const infoLineName = document.getElementById('infoLineName');
    const infoRemaining = document.getElementById('infoRemaining');
    const infoTotalTokens = document.getElementById('infoTotalTokens');
    const btnDiffFast = document.getElementById('btnDiffFast');
    const btnDiffStandard = document.getElementById('btnDiffStandard');

    // Tools
    const btnResetEgg = document.getElementById('btnResetEgg');
    const btnForceHatch = document.getElementById('btnForceHatch');
    const btnNextLine = document.getElementById('btnNextLine');
    const btnToggleShiny = document.getElementById('btnToggleShiny');

    // State flags
    let isExpanded = false;
    let isWalkerActive = false;
    let isAudioEnabled = true;
    let isFacingRight = true;
    let currentFallback = null;
    let currentCryUrl = null;
    let currentTeamData = [];
    let currentLeadIndex = 0;
    let currentActiveMoves = [];
    let pendingSwapAction = null;
    let latestCompanionData = null;
    let lastBattleState = null;
    let autoBattleTimer = null;
    let currentDexRegion = 'kanto';
    let currentGbaFilter = 'all';
    let currentFilteredBoxItems = [];
    let allPokedexList = [];
    let latestUnlockedDex = [];
    const REGION_RANGES = {
        'kanto': [1, 151],
        'johto': [152, 251],
        'hoenn': [252, 386],
        'sinnoh': [387, 493],
        'unova': [494, 649],
        'kalos': [650, 721],
        'alola': [722, 809],
        'galar': [810, 898],
        'paldea': [899, 1025]
    };

    const RANK_LADDER = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
    const RANK_COSTS = { 'F': 1, 'E': 2, 'D': 4, 'C': 8, 'B': 15, 'A': 25, 'S': 40, 'SS': 60, 'SSS': 0 };
    const RANK_BONUS = { 'F': 0, 'E': 3, 'D': 6, 'C': 10, 'B': 15, 'A': 22, 'S': 30, 'SS': 40, 'SSS': 50 };
    let currentModalSpeciesId = 1;

    if (window.api?.getAllPokedex) {
        try {
            allPokedexList = window.api.getAllPokedex() || [];
        } catch (e) {
            console.error('Error cargando lista Pokédex nacional:', e);
        }
    }

    function formatNumber(num) {
        if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return (num || 0).toLocaleString();
    }

    // Audio Player for PokeAPI Cries
    function playCry(cryUrl) {
        if (!isAudioEnabled || !cryUrl) return;
        try {
            const audio = new Audio(cryUrl);
            audio.volume = 0.35;
            audio.play().catch(() => {});
        } catch (e) {}
    }

    // Toggle Sound
    if (btnAudioToggle) {
        btnAudioToggle.addEventListener('click', () => {
            isAudioEnabled = !isAudioEnabled;
            btnAudioToggle.innerText = isAudioEnabled ? '🔊' : '🔇';
            btnAudioToggle.title = isAudioEnabled ? 'Sonido: Activado' : 'Sonido: Silenciado';
        });
    }

    // Exit walker mode on double click and show full card
    function exitWalkerAndShowCard() {
        if (isWalkerActive) {
            isWalkerActive = false;
            window.api.toggleWalker(false);
            document.body.classList.remove('walker-active');
            document.body.classList.remove('in-encounter');
            document.body.classList.remove('is-resting');
            if (walkerAlert) walkerAlert.style.display = 'none';
            document.documentElement.style.setProperty('--sprite-flip', 'scaleX(1)');
            if (pokemonSprite) {
                pokemonSprite.style.setProperty('--sprite-flip', 'scaleX(1)');
                pokemonSprite.style.transform = 'scale(1)';
            }
        }
    }

    // Sprite Interaction / Cry trigger & Double click to view card
    let lastWalkerClick = 0;
    function handleWalkerInteractiveClick(e) {
        if (!isWalkerActive) return;
        const now = Date.now();
        if (now - lastWalkerClick < 500) {
            if (e && e.stopPropagation) e.stopPropagation();
            exitWalkerAndShowCard();
            lastWalkerClick = 0;
            return;
        }
        lastWalkerClick = now;
    }

    if (spriteStage) {
        spriteStage.addEventListener('pointerdown', handleWalkerInteractiveClick);
        spriteStage.addEventListener('click', (e) => {
            if (isWalkerActive) {
                handleWalkerInteractiveClick(e);
                return;
            }
            pokemonSprite.style.transition = 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            pokemonSprite.style.transform = 'scale(1.22) translateY(-5px)';
            setTimeout(() => {
                pokemonSprite.style.transform = 'scale(1)';
            }, 200);
            if (currentCryUrl) playCry(currentCryUrl);
        });

        spriteStage.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            exitWalkerAndShowCard();
        });
    }

    if (pokemonSprite) {
        pokemonSprite.addEventListener('pointerdown', handleWalkerInteractiveClick);
        pokemonSprite.addEventListener('click', handleWalkerInteractiveClick);
        pokemonSprite.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            exitWalkerAndShowCard();
        });
    }

    if (petCard) {
        petCard.addEventListener('pointerdown', handleWalkerInteractiveClick);
        petCard.addEventListener('click', handleWalkerInteractiveClick);
        petCard.addEventListener('dblclick', (e) => {
            if (isWalkerActive) {
                e.stopPropagation();
                exitWalkerAndShowCard();
            }
        });
    }

    document.body.addEventListener('pointerdown', handleWalkerInteractiveClick);
    document.body.addEventListener('dblclick', (e) => {
        if (isWalkerActive) {
            exitWalkerAndShowCard();
        }
    });

    if (btnCryShortcut) {
        btnCryShortcut.addEventListener('click', () => {
            if (currentCryUrl) playCry(currentCryUrl);
        });
    }

    // Walker Mode toggles
    function toggleWalker() {
        isWalkerActive = !isWalkerActive;
        window.api.toggleWalker(isWalkerActive);
        if (isWalkerActive) {
            document.body.classList.add('walker-active');
            // When walker starts moving right, flip left-facing PokeAPI sprite to face right!
            document.documentElement.style.setProperty('--sprite-flip', 'scaleX(-1)');
            if (pokemonSprite) {
                pokemonSprite.style.transform = '';
                pokemonSprite.style.setProperty('--sprite-flip', 'scaleX(-1)');
            }
            if (isExpanded) {
                isExpanded = false;
                petCard.classList.remove('expanded');
                toggleDetailsBtn.innerText = '▼';
            }
        } else {
            document.body.classList.remove('walker-active');
            document.body.classList.remove('in-encounter');
            document.body.classList.remove('is-resting');
            if (walkerAlert) walkerAlert.style.display = 'none';
            document.documentElement.style.setProperty('--sprite-flip', 'scaleX(1)');
            if (pokemonSprite) {
                pokemonSprite.style.setProperty('--sprite-flip', 'scaleX(1)');
                pokemonSprite.style.transform = '';
            }
        }
    }

    if (btnWalkerMode) btnWalkerMode.addEventListener('click', toggleWalker);
    if (btnWalkShortcut) btnWalkShortcut.addEventListener('click', toggleWalker);

    // Window Controls (— Minimizar, 🗖 Maximizar / Restaurar, ✕ Ocultar a Bandeja y Modo Paseo)
    if (btnWinMinimize) {
        btnWinMinimize.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.api?.minimizeWindow) window.api.minimizeWindow();
        });
    }

    if (btnWinMaximize) {
        btnWinMaximize.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.api?.toggleMaximize) window.api.toggleMaximize();
        });
    }

    if (btnWinClose) {
        btnWinClose.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.api?.closeToWalk) {
                window.api.closeToWalk();
            } else if (window.api?.toggleWalker) {
                window.api.toggleWalker(true);
            }
        });
    }

    if (window.api?.onMaximizeChange) {
        window.api.onMaximizeChange((isMax) => {
            if (btnWinMaximize) {
                btnWinMaximize.innerText = isMax ? '🗗' : '🗖';
                btnWinMaximize.title = isMax ? 'Restaurar Ventana' : 'Maximizar / Pantalla Completa';
            }
            document.body.classList.toggle('window-maximized', !!isMax);
            if (isMax) {
                isExpanded = true;
                petCard.classList.add('expanded');
                if (toggleDetailsBtn) toggleDetailsBtn.innerText = '▲';
            }
        });
    }

    // Listen to main process walker events
    if (window.api.onWalkerModeChange) {
        window.api.onWalkerModeChange((data) => {
            isWalkerActive = !!data.active;
            if (isWalkerActive) {
                document.body.classList.add('walker-active');
                document.documentElement.style.setProperty('--sprite-flip', 'scaleX(-1)');
                if (pokemonSprite) {
                    pokemonSprite.style.transform = '';
                    pokemonSprite.style.setProperty('--sprite-flip', 'scaleX(-1)');
                }
            } else {
                document.body.classList.remove('walker-active');
                document.body.classList.remove('in-encounter');
                document.body.classList.remove('is-resting');
                if (walkerAlert) walkerAlert.style.display = 'none';
                document.documentElement.style.setProperty('--sprite-flip', 'scaleX(1)');
                if (pokemonSprite) {
                    pokemonSprite.style.setProperty('--sprite-flip', 'scaleX(1)');
                    pokemonSprite.style.transform = '';
                }
            }
        });
    }

    if (window.api.onWalkerRest) {
        window.api.onWalkerRest((isResting) => {
            if (isResting) {
                document.body.classList.add('is-resting');
            } else {
                document.body.classList.remove('is-resting');
            }
        });
    }

    // Floating Walker Notifications (+XP and Item Discoveries)
    function showFloatingBubble(text, icon = '✨', isExp = false) {
        if (!walkerFloatingBubble) return;
        walkerFloatingBubble.innerText = `${icon} ${text}`;
        if (isExp) {
            walkerFloatingBubble.classList.add('exp-bubble');
        } else {
            walkerFloatingBubble.classList.remove('exp-bubble');
        }
        walkerFloatingBubble.style.display = 'block';
        walkerFloatingBubble.style.animation = 'none';
        void walkerFloatingBubble.offsetWidth;
        walkerFloatingBubble.style.animation = 'float-bubble-up 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
        setTimeout(() => {
            if (walkerFloatingBubble) walkerFloatingBubble.style.display = 'none';
        }, 2200);
    }

    if (window.api.onWalkerExpGain) {
        window.api.onWalkerExpGain((data) => {
            if (isWalkerActive) {
                showFloatingBubble(`+${data.amount || 25} EXP`, '🌱', true);
            }
        });
    }

    if (window.api.onWalkerItemPickup) {
        window.api.onWalkerItemPickup((pickup) => {
            if (isWalkerActive && pickup) {
                showFloatingBubble(`¡${pickup.item}!`, pickup.icon || '🎁', false);
            }
        });
    }

    // Walker Direction Flip
    // PokeAPI front sprites naturally face LEFT.
    // Moving RIGHT (direction >= 0) => flip horizontally with scaleX(-1) so it looks right!
    // Moving LEFT (direction < 0) => use natural scaleX(1) so it looks left!
    if (window.api.onWalkerFlip) {
        window.api.onWalkerFlip((direction) => {
            isFacingRight = direction >= 0;
            const flipVal = isFacingRight ? 'scaleX(-1)' : 'scaleX(1)';
            document.documentElement.style.setProperty('--sprite-flip', flipVal);
            if (pokemonSprite) {
                pokemonSprite.style.transform = '';
                pokemonSprite.style.setProperty('--sprite-flip', flipVal);
            }
        });
    }

    // Wild Encounter Arena during Walker Mode (Desktop Face-off)
    let currentEncounterWild = null;

    if (window.api.onWalkerEncounterStart) {
        window.api.onWalkerEncounterStart((data) => {
            currentEncounterWild = data.wild;
            document.body.classList.add('in-encounter');

            const arenaEl = document.getElementById('walkerEncounterArena');
            if (arenaEl) {
                arenaEl.classList.remove('face-off');
                arenaEl.classList.add('approaching');
            }

            const titleEl = document.getElementById('walkerEncounterTitle');
            if (titleEl) {
                titleEl.innerText = `⚔️ ¡${data.wild.name} Salvaje! (Nv. ${data.wild.level})`;
            }

            const shinyEl = document.getElementById('walkerEncounterShiny');
            if (shinyEl) {
                shinyEl.style.display = data.wild.isShiny ? 'inline-block' : 'none';
            }

            const encPlayer = document.getElementById('encounterPlayerSprite');
            if (encPlayer && pokemonSprite) {
                encPlayer.src = pokemonSprite.src;
                encPlayer.style.transform = '';
            }

            const encRival = document.getElementById('walkerRivalSprite');
            if (encRival) {
                encRival.src = data.wild.spriteUrl;
                encRival.style.transform = '';
            }

            // After 1.1s of walking towards each other, stop face-to-face and confront!
            setTimeout(() => {
                if (arenaEl) {
                    arenaEl.classList.remove('approaching');
                    arenaEl.classList.add('face-off');
                }
                const excl = document.getElementById('encounterExclamation');
                if (excl) {
                    excl.style.animation = 'none';
                    void excl.offsetWidth;
                    excl.style.animation = 'jump-exclamation 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                }
                if (data.wild.cryUrl) {
                    playCry(data.wild.cryUrl);
                }
            }, 1100);
        });
    }

    if (window.api.onWalkerEncounterEnd) {
        window.api.onWalkerEncounterEnd(() => {
            document.body.classList.remove('in-encounter');
            currentEncounterWild = null;
        });
    }

    if (window.api.onOpenBattleTab) {
        window.api.onOpenBattleTab(() => {
            document.body.classList.remove('walker-active');
            document.body.classList.remove('in-encounter');
            window.api.toggleBattleWindow();
        });
    }

    const btnWalkerFight = document.getElementById('btnWalkerFight');
    if (btnWalkerFight) {
        btnWalkerFight.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentEncounterWild && window.api.walkerFight) {
                window.api.walkerFight(currentEncounterWild.id);
            }
        });
    }

    const encounterRivalBox = document.getElementById('encounterRivalBox');
    if (encounterRivalBox) {
        encounterRivalBox.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentEncounterWild && window.api.walkerFight) {
                window.api.walkerFight(currentEncounterWild.id);
            }
        });
    }

    const btnWalkerFlee = document.getElementById('btnWalkerFlee');
    if (btnWalkerFlee) {
        btnWalkerFlee.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.api.walkerFlee) {
                window.api.walkerFlee();
            }
        });
    }

    const encounterPlayerBox = document.getElementById('encounterPlayerBox');
    if (encounterPlayerBox) {
        encounterPlayerBox.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            exitWalkerAndShowCard();
        });
    }

    // Legacy wild encounter alert pill
    if (window.api.onWildEncounterAlert) {
        window.api.onWildEncounterAlert((data) => {
            if (walkerAlert) {
                walkerAlert.style.display = data.active ? 'block' : 'none';
            }
        });
    }

    if (walkerAlert) {
        walkerAlert.addEventListener('click', () => {
            if (isWalkerActive) toggleWalker();
            if (!isExpanded) {
                isExpanded = true;
                petCard.classList.add('expanded');
                toggleDetailsBtn.innerText = '▲';
                window.api.toggleExpand(true);
            }
            switchTab('tab-battle');
        });
    }

    // Expand / collapse drawer
    toggleDetailsBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        if (isExpanded) {
            petCard.classList.add('expanded');
            toggleDetailsBtn.innerText = '▲';
        } else {
            petCard.classList.remove('expanded');
            toggleDetailsBtn.innerText = '▼';
            closeModals();
        }
        window.api.toggleExpand(isExpanded);
    });

    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    function switchTab(targetId) {
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        const activeBtn = document.querySelector(`.tab-btn[data-tab="${targetId}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        const activePane = document.getElementById(targetId);
        if (activePane) activePane.classList.add('active');

        if (targetId === 'tab-dex') {
            renderRegionalDex(latestUnlockedDex);
        } else if (targetId === 'tab-battle' && lastBattleState && !lastBattleState.isOver) {
            updateEmbeddedBattleView(lastBattleState);
        }
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            switchTab(targetId);
        });
    });

    if (btnBattleShortcut) {
        btnBattleShortcut.addEventListener('click', (e) => {
            e.stopPropagation();
            window.api.toggleBattleWindow();
        });
    }

    const btnLaunchBattleWindow = document.getElementById('btnLaunchBattleWindow');
    if (btnLaunchBattleWindow) {
        btnLaunchBattleWindow.addEventListener('click', (e) => {
            e.stopPropagation();
            window.api.toggleBattleWindow();
        });
    }

    if (btnPopoutBattleWindow) {
        btnPopoutBattleWindow.addEventListener('click', (e) => {
            e.stopPropagation();
            window.api.toggleBattleWindow();
        });
    }

    if (btnEmbThrowBall) {
        btnEmbThrowBall.addEventListener('click', (e) => {
            e.stopPropagation();
            window.api.battleCatch('poke-ball');
        });
    }

    if (btnEmbRun) {
        btnEmbRun.addEventListener('click', (e) => {
            e.stopPropagation();
            window.api.battleRun();
        });
    }

    // Dex Regional Filter Pills
    if (dexRegionNav) {
        dexRegionNav.querySelectorAll('.region-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.stopPropagation();
                dexRegionNav.querySelectorAll('.region-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentDexRegion = pill.getAttribute('data-region') || 'kanto';
                renderRegionalDex(latestUnlockedDex);
            });
        });
    }

    // When floating arena is minimized or closed with [X], transfer fight into embedded tab-battle!
    if (window.api.onOpenEmbeddedBattle) {
        window.api.onOpenEmbeddedBattle((battle) => {
            if (!isExpanded) {
                isExpanded = true;
                petCard.classList.add('expanded');
                toggleDetailsBtn.innerText = '▲';
                window.api.toggleExpand(true);
            }
            switchTab('tab-battle');
            if (battle) {
                updateEmbeddedBattleView(battle);
            }
        });
    }

    function closeModals() {
        if (swapModalOverlay) swapModalOverlay.style.display = 'none';
        if (branchModalOverlay) branchModalOverlay.style.display = 'none';
        if (moveLearnModalOverlay) moveLearnModalOverlay.style.display = 'none';
        if (settingsModalOverlay) settingsModalOverlay.style.display = 'none';
        if (dexDetailsModal) dexDetailsModal.style.display = 'none';
        pendingSwapAction = null;
    }

    // Settings Modal Controls
    if (btnSettings) {
        btnSettings.addEventListener('click', (e) => {
            e.stopPropagation();
            if (settingsModalOverlay) settingsModalOverlay.style.display = 'flex';
        });
    }

    if (btnCloseSettings) {
        btnCloseSettings.addEventListener('click', () => {
            if (settingsModalOverlay) settingsModalOverlay.style.display = 'none';
        });
    }

    if (btnCloseSettingsX) {
        btnCloseSettingsX.addEventListener('click', () => {
            if (settingsModalOverlay) settingsModalOverlay.style.display = 'none';
        });
    }

    let lastSettingInteraction = 0;

    function wireSettingRow(rowId, inputId, key, toggleAction) {
        const row = document.getElementById(rowId);
        const input = document.getElementById(inputId);
        if (!input) return;

        function doToggle(e) {
            if (e) {
                e.stopPropagation();
            }
            lastSettingInteraction = Date.now();
            const newVal = input.checked;
            window.api.updateSetting(key, newVal);
            if (toggleAction) toggleAction();
        }

        input.addEventListener('change', (e) => {
            doToggle(e);
        });

        if (row) {
            row.addEventListener('click', (e) => {
                if (e.target === input) return;
                e.stopPropagation();
                input.checked = !input.checked;
                doToggle(e);
            });
        }
    }

    wireSettingRow('rowSettingEncounters', 'settingEncountersSwitch', 'encountersEnabled', () => window.api.toggleEncounters());
    wireSettingRow('rowSettingSkipVs', 'settingSkipVsSwitch', 'skipVsDialog', () => window.api.toggleSkipVsDialog());
    wireSettingRow('rowSettingSpecialBalls', 'settingSpecialBallsSwitch', 'useSpecialBalls', () => window.api.toggleUseSpecialBalls());
    wireSettingRow('rowSettingAudio', 'settingAudioSwitch', 'soundEnabled', () => window.api.toggleAudioSetting());
    wireSettingRow('rowSettingHideOnFullscreen', 'settingHideOnFullscreenSwitch', 'hideOnFullscreen', () => {
        if (window.api.toggleHideOnFullscreen) window.api.toggleHideOnFullscreen();
    });

    if (btnRepairTeam) {
        btnRepairTeam.addEventListener('click', () => {
            window.api.repairTeam();
            btnRepairTeam.innerText = '✓ ¡Sincronizado!';
            setTimeout(() => {
                if (btnRepairTeam) btnRepairTeam.innerText = '🔧 Sincronizar / Reparar Equipo';
            }, 1800);
        });
    }

    // Swap Modal Controls (Party 6/6 replacement)
    function openSwapModal(actionType, actionId) {
        pendingSwapAction = { type: actionType, id: actionId };
        swapSlotsList.innerHTML = '';

        currentTeamData.forEach((member, idx) => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.justifyContent = 'space-between';
            item.style.background = 'rgba(15,23,42,0.6)';
            item.style.padding = '4px 6px';
            item.style.borderRadius = '6px';
            item.style.fontSize = '8.5px';
            item.style.cursor = 'pointer';

            const iconSrc = member.iconUrl || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
            const memberText = member.isEgg 
                ? `Ranura ${idx + 1}: ${member.name} (Huevo)` 
                : `Ranura ${idx + 1}: ${member.name} (Lv. ${member.level || 1}) ${member.isShiny ? '★' : ''}`;

            item.innerHTML = `
                <div style="display:flex; align-items:center; gap:5px;">
                    <img src="${iconSrc}" style="width:18px; height:18px; image-rendering:pixelated;">
                    <span style="font-weight:700; color:#f1f5f9;">${memberText}</span>
                </div>
                <button class="action-btn" style="padding:2px 6px; font-size:7.5px;">Reemplazar</button>
            `;

            item.addEventListener('click', () => {
                executeSwap(idx);
            });

            swapSlotsList.appendChild(item);
        });

        swapModalOverlay.style.display = 'flex';
    }

    if (btnCancelSwap) btnCancelSwap.addEventListener('click', closeModals);

    function executeSwap(slotIndex) {
        if (!pendingSwapAction) return;

        if (pendingSwapAction.type === 'dex') {
            window.api.deployFromDex(pendingSwapAction.id, slotIndex);
        } else if (pendingSwapAction.type === 'egg') {
            window.api.moveEggToTeam(pendingSwapAction.id, slotIndex);
        } else if (pendingSwapAction.type === 'box') {
            window.api.withdrawFromPC(pendingSwapAction.id, slotIndex);
        }

        closeModals();
    }

    // Branching Evolution Modal
    function showBranchModal(pending) {
        if (!branchModalOverlay || !branchCardsContainer) return;
        branchCardsContainer.innerHTML = '';

        document.getElementById('branchModalTitle').innerText = `¡${pending.pokemonName} puede evolucionar!`;

        pending.branches.forEach(branch => {
            const card = document.createElement('div');
            card.className = 'branch-item';
            card.innerHTML = `
                <img src="${branch.spriteUrl}" style="width:36px; height:36px; image-rendering:pixelated;">
                <div style="font-size:8.5px; font-weight:800; color:#fbbf24; margin-top:2px;">${branch.name}</div>
                <div style="font-size:7px; color:#38bdf8;">${branch.type}</div>
                <button class="action-btn" style="margin-top:3px; font-size:7px; padding:2px 5px; width:100%;">Elegir</button>
            `;

            card.addEventListener('click', () => {
                window.api.chooseBranchEvolution(pending.slotIndex, branch.id);
                branchModalOverlay.style.display = 'none';
            });

            branchCardsContainer.appendChild(card);
        });

        branchModalOverlay.style.display = 'flex';
    }

    if (btnCancelBranch) {
        btnCancelBranch.addEventListener('click', () => {
            branchModalOverlay.style.display = 'none';
        });
    }

    // Move Learn / Replace Modal (Pool of 4)
    function showMoveLearnModal(pending) {
        if (!moveLearnModalOverlay || !currentMovesToReplaceList) return;
        currentMovesToReplaceList.innerHTML = '';

        newMoveInfo.innerText = `Aprender: ${pending.newMove}`;

        pending.currentMoves.forEach((moveName, idx) => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.justifyContent = 'space-between';
            row.style.background = 'rgba(15,23,42,0.6)';
            row.style.padding = '3px 6px';
            row.style.borderRadius = '5px';
            row.style.fontSize = '8px';

            row.innerHTML = `
                <span style="color:#cbd5e1; font-weight:700;">${idx + 1}. ${moveName}</span>
                <button class="action-btn" style="padding:2px 5px; font-size:7px; background:rgba(239,68,68,0.5);">Olvidar</button>
            `;

            row.querySelector('button').addEventListener('click', () => {
                window.api.learnOrReplaceMove(pending.slotIndex, pending.newMove, idx);
                moveLearnModalOverlay.style.display = 'none';
            });

            currentMovesToReplaceList.appendChild(row);
        });

        moveLearnModalOverlay.style.display = 'flex';
    }

    if (btnCancelMoveLearn) {
        btnCancelMoveLearn.addEventListener('click', () => {
            moveLearnModalOverlay.style.display = 'none';
            if (window.api.dismissMoveLearn) {
                window.api.dismissMoveLearn();
            }
        });
    }

    // Bag actions
    btnUseCandy.addEventListener('click', () => window.api.useCandy());
    btnUseMint.addEventListener('click', () => window.api.useMint());

    // Shop actions
    btnBuyCandy.addEventListener('click', () => window.api.buyItem('rareCandy'));
    btnBuyMint.addEventListener('click', () => window.api.buyItem('mint'));
    btnBuyPokeballs.addEventListener('click', () => window.api.buyItem('pokeballs'));
    if (btnBuyGreatballs) btnBuyGreatballs.addEventListener('click', () => window.api.buyItem('greatballs'));
    if (btnBuyUltraballs) btnBuyUltraballs.addEventListener('click', () => window.api.buyItem('ultraballs'));
    if (btnBuyMasterball) btnBuyMasterball.addEventListener('click', () => window.api.buyItem('masterballs'));
    btnBuyPotions.addEventListener('click', () => window.api.buyItem('potions'));
    btnBuyCharm.addEventListener('click', () => window.api.buyItem('shinyCharm'));
    btnBuyEggCommon.addEventListener('click', () => window.api.buyItem('eggCommon'));
    btnBuyEggUncommon.addEventListener('click', () => window.api.buyItem('eggUncommon'));
    btnBuyEggRare.addEventListener('click', () => window.api.buyItem('eggRare'));

    // Toggle Encounters (Safe / Free Roam Walking)
    if (btnToggleEncounters) {
        btnToggleEncounters.addEventListener('click', () => {
            window.api.toggleEncounters();
        });
    }

    // PC Box Leader Deposit Action
    if (btnDepositLeadToPC) {
        btnDepositLeadToPC.addEventListener('click', () => {
            window.api.depositToPC(currentLeadIndex);
        });
    }

    // Tool actions
    btnResetEgg.addEventListener('click', () => window.api.resetToEgg());
    btnForceHatch.addEventListener('click', () => window.api.forceHatch());
    btnNextLine.addEventListener('click', () => window.api.nextPokemon());
    btnToggleShiny.addEventListener('click', () => window.api.toggleShiny());
    const btnSpawnWild = document.getElementById('btnSpawnWild');
    if (btnSpawnWild) {
        btnSpawnWild.addEventListener('click', () => {
            if (window.api.triggerWalkerEncounter) {
                window.api.triggerWalkerEncounter();
            }
        });
    }

    // Difficulty buttons
    if (btnDiffFast) {
        btnDiffFast.addEventListener('click', () => window.api.setDifficulty('fast'));
    }
    if (btnDiffStandard) {
        btnDiffStandard.addEventListener('click', () => window.api.setDifficulty('standard'));
    }

    // Party HUD (6 Poké Balls) with HTML5 Drag & Drop Reordering
    function renderParty(team, leadIndex) {
        if (!partyBar) return;
        partyBar.innerHTML = '';
        currentTeamData = team || [];
        currentLeadIndex = leadIndex || 0;

        for (let i = 0; i < 6; i++) {
            const member = currentTeamData[i] || { isEmpty: true, slotIndex: i };
            const slot = document.createElement('div');
            slot.className = 'party-slot';
            slot.setAttribute('data-slot-idx', i);

            if (member.isEmpty) {
                slot.classList.add('empty');
                slot.title = `Ranura ${i + 1}: Vacía (Arrastra un Pokémon aquí)`;
                slot.innerHTML = `<span style="font-size:10px; color:#475569;">+</span>`;
            } else {
                if (i === leadIndex) {
                    slot.classList.add('active-lead');
                }

                const titleText = member.isEgg 
                    ? `Ranura ${i + 1}: ${member.name} (Incubando 100% EXP - Arrastra para reordenar)` 
                    : `Ranura ${i + 1}: ${member.name} (Lv. ${member.level || 1}) ${i === leadIndex ? '(Líder 100% EXP)' : '(Compañero 50% EXP)'} ${member.isShiny ? '★' : ''} - Arrastra para reordenar`;
                slot.title = titleText;

                const iconSrc = member.iconUrl || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                slot.innerHTML = `
                    <img src="${iconSrc}" alt="${member.name}">
                    <span class="lead-star">★</span>
                `;

                slot.addEventListener('click', () => {
                    window.api.setLead(i);
                });

                // HTML5 Drag & Drop: Dragging this active team member
                slot.draggable = true;
                slot.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'team', slotIndex: i }));
                    e.dataTransfer.effectAllowed = 'move';
                    slot.classList.add('dragging');
                });
                slot.addEventListener('dragend', () => {
                    slot.classList.remove('dragging');
                });
            }

            // HTML5 Drag & Drop: Drop target (both empty and occupied slots)
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                slot.classList.add('drag-over');
            });

            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });

            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                const raw = e.dataTransfer.getData('text/plain');
                if (!raw) return;
                try {
                    const data = JSON.parse(raw);
                    if (data.type === 'team') {
                        if (data.slotIndex !== i) {
                            window.api.swapTeamSlots(data.slotIndex, i);
                        }
                    } else if (data.type === 'box') {
                        window.api.swapBoxWithTeam(data.boxIndex, i);
                    } else if (data.type === 'dex') {
                        if (window.api.recruitFromDex) {
                            window.api.recruitFromDex(data.speciesId, i);
                        } else {
                            window.api.deployFromDex(data.speciesId, i);
                        }
                    }
                } catch (err) {
                    console.error('Error on party drop:', err);
                }
            });

            partyBar.appendChild(slot);
        }
    }

    // Render Egg Bag
    function renderEggBag(eggBag, eggBagCount) {
        if (!eggBagList) return;
        if (eggBagCountDisplay) eggBagCountDisplay.innerText = `${eggBagCount || 0} en reserva`;
        eggBagList.innerHTML = '';

        if (!eggBag || eggBag.length === 0) {
            eggBagList.innerHTML = '<div style="font-size: 8px; color: #64748b; text-align: center; padding: 4px;">Sin huevos en reserva</div>';
            return;
        }

        eggBag.forEach(egg => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.justifyContent = 'space-between';
            row.style.background = 'rgba(15, 23, 42, 0.6)';
            row.style.padding = '3px 6px';
            row.style.borderRadius = '5px';
            row.style.fontSize = '8px';

            const tierColor = egg.tier === 'rare' ? '#fbbf24' : egg.tier === 'uncommon' ? '#38bdf8' : '#cbd5e1';

            row.innerHTML = `
                <div style="display:flex; align-items:center; gap:4px;">
                    <img src="${egg.iconUrl}" style="width:16px; height:16px; image-rendering:pixelated;">
                    <span style="font-weight:700; color:${tierColor};">${egg.name}</span>
                </div>
                <button class="action-btn" style="padding:2px 5px; font-size:7px;">🥚 Al Equipo</button>
            `;

            row.querySelector('button').addEventListener('click', () => {
                const filledMembers = currentTeamData.filter(m => !m.isEmpty).length;
                if (filledMembers < 6) {
                    window.api.moveEggToTeam(egg.index, null);
                } else {
                    openSwapModal('egg', egg.index);
                }
            });

            eggBagList.appendChild(row);
        });
    }

    // 1. Authentic GBA-Style PC Box Renderer (30-Slot Grid + Retro Inspector Card)
    let currentGbaBoxPage = 0;
    let currentGbaSelectedMember = null;
    let currentBoxList = [];

    const GBA_TYPE_COLORS = {
        'Normal': '#94a3b8', 'Fuego': '#f97316', 'Agua': '#38bdf8', 'Planta': '#22c55e',
        'Eléctrico': '#eab308', 'Hielo': '#06b6d4', 'Lucha': '#dc2626', 'Veneno': '#a855f7',
        'Tierra': '#d97706', 'Volador': '#818cf8', 'Psíquico': '#ec4899', 'Bicho': '#84cc16',
        'Roca': '#b45309', 'Fantasma': '#7c3aed', 'Dragón': '#6366f1', 'Siniestro': '#475569',
        'Acero': '#64748b', 'Hada': '#f472b6'
    };

    const KNOWN_POKEMON_TYPES = {
        1: ['Planta', 'Veneno'], 2: ['Planta', 'Veneno'], 3: ['Planta', 'Veneno'],
        4: ['Fuego'], 5: ['Fuego'], 6: ['Fuego', 'Volador'],
        7: ['Agua'], 8: ['Agua'], 9: ['Agua'],
        25: ['Eléctrico'], 26: ['Eléctrico'], 172: ['Eléctrico'],
        92: ['Fantasma', 'Veneno'], 93: ['Fantasma', 'Veneno'], 94: ['Fantasma', 'Veneno'],
        133: ['Normal'], 134: ['Agua'], 135: ['Eléctrico'], 136: ['Fuego'],
        196: ['Psíquico'], 197: ['Siniestro'], 470: ['Planta'], 471: ['Hielo'], 700: ['Hada'],
        147: ['Dragón'], 148: ['Dragón'], 149: ['Dragón', 'Volador'],
        150: ['Psíquico'], 151: ['Psíquico'],
        155: ['Fuego'], 156: ['Fuego'], 157: ['Fuego'],
        246: ['Roca', 'Tierra'], 247: ['Roca', 'Tierra'], 248: ['Roca', 'Siniestro'],
        255: ['Fuego'], 256: ['Fuego', 'Lucha'], 257: ['Fuego', 'Lucha'],
        258: ['Agua'], 259: ['Agua', 'Tierra'], 260: ['Agua', 'Tierra'],
        280: ['Psíquico', 'Hada'], 281: ['Psíquico', 'Hada'], 282: ['Psíquico', 'Hada'], 475: ['Psíquico', 'Lucha'],
        443: ['Dragón', 'Tierra'], 444: ['Dragón', 'Tierra'], 445: ['Dragón', 'Tierra'],
        447: ['Lucha'], 448: ['Lucha', 'Acero']
    };

    function updateGbaInspector(member) {
        if (!gbaInspName) return;
        if (!member) {
            if (gbaInspSprite) gbaInspSprite.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
            gbaInspName.innerText = 'Selecciona';
            if (gbaInspLevel) gbaInspLevel.innerText = 'Nv. --';
            if (gbaInspTypes) gbaInspTypes.innerHTML = '';
            if (gbaInspNature) gbaInspNature.innerText = '--';
            if (gbaInspHp) gbaInspHp.innerText = '--/--';
            if (gbaInspMove1) gbaInspMove1.innerText = '--';
            if (btnGbaMoveToTeam) btnGbaMoveToTeam.disabled = true;
            if (btnGbaArchiveToDex) btnGbaArchiveToDex.disabled = true;
            return;
        }

        currentGbaSelectedMember = member;
        if (btnGbaMoveToTeam) btnGbaMoveToTeam.disabled = false;
        if (btnGbaArchiveToDex) {
            btnGbaArchiveToDex.disabled = false;
            if ((member.level || 1) >= 100) {
                btnGbaArchiveToDex.innerText = '⭐ Archivar (Nv 100)';
                btnGbaArchiveToDex.title = 'Archiva a la Pokédex permanente otorgando la Estrella de Maestría ⭐ y libera la casilla';
            } else {
                btnGbaArchiveToDex.innerText = '🏛️ Archivar a Dex';
                btnGbaArchiveToDex.title = 'Libera la casilla en la Caja PC y convierte el Pokémon en Esencia de Especie';
            }
        }

        if (gbaInspSprite) {
            const staticFallback = member.iconUrl || member.fallbackUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.isShiny ? 'shiny/' : ''}${member.speciesId}.png`;
            const primarySrc = member.spriteUrl || staticFallback;
            gbaInspSprite.onerror = function() {
                if (this.src !== staticFallback) {
                    this.src = staticFallback;
                } else {
                    this.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                }
            };
            gbaInspSprite.src = primarySrc;
        }
        if (gbaInspName) {
            gbaInspName.innerText = `${member.name} ${member.isShiny ? '★' : ''}`;
        }
        if (gbaInspLevel) {
            gbaInspLevel.innerText = `Nv. ${member.level || 1}`;
        }

        // Dual Type Badges
        if (gbaInspTypes) {
            gbaInspTypes.innerHTML = '';
            const types = KNOWN_POKEMON_TYPES[member.speciesId] || (member.moves && member.moves[0] ? [member.moves[0].type] : ['Normal']);
            types.forEach(t => {
                const pill = document.createElement('span');
                pill.className = 'gba-type-pill';
                pill.style.background = GBA_TYPE_COLORS[t] || '#6366f1';
                pill.innerText = t;
                gbaInspTypes.appendChild(pill);
            });
        }

        if (gbaInspNature) {
            gbaInspNature.innerText = member.nature || 'Fuerte';
        }
        if (gbaInspHp) {
            const maxHp = member.maxHP || (20 + (member.level || 5) * 5);
            const curHp = member.currentHP !== undefined ? member.currentHP : maxHp;
            gbaInspHp.innerText = `${curHp}/${maxHp}`;
        }
        if (gbaInspMove1) {
            const mv = (member.moves && member.moves[0]) ? member.moves[0].name : 'Placaje';
            gbaInspMove1.innerText = mv;
        }

        if (btnGbaMoveToTeam) {
            btnGbaMoveToTeam.onclick = () => {
                const filledMembers = currentTeamData.filter(m => !m.isEmpty).length;
                if (filledMembers < 6) {
                    window.api.withdrawFromPC(member.boxIndex, null);
                } else {
                    openSwapModal('box', member.boxIndex);
                }
            };
        }
    }

    function renderPCBox(box) {
        currentBoxList = box || [];
        if (!gbaBoxGrid) return;

        // Filter currentBoxList according to currentGbaFilter
        currentFilteredBoxItems = currentBoxList.map((m, originalIdx) => ({
            member: m,
            originalIndex: originalIdx
        })).filter(item => {
            if (!item.member) return false;
            if (currentGbaFilter === 'all') return true;
            if (currentGbaFilter === 'shiny') return !!item.member.isShiny;
            const range = REGION_RANGES[currentGbaFilter];
            if (range) {
                const sid = item.member.speciesId;
                return sid >= range[0] && sid <= range[1];
            }
            return true;
        });

        if (boxTotalCount) {
            if (currentGbaFilter === 'all') {
                boxTotalCount.innerText = `${currentBoxList.length} Guardados`;
            } else if (currentGbaFilter === 'shiny') {
                boxTotalCount.innerText = `${currentFilteredBoxItems.length} Shinies`;
            } else {
                const regLabel = currentGbaFilter.charAt(0).toUpperCase() + currentGbaFilter.slice(1);
                boxTotalCount.innerText = `${currentFilteredBoxItems.length} en ${regLabel}`;
            }
        }

        const maxPage = Math.max(0, Math.ceil(currentFilteredBoxItems.length / 30) - 1);
        if (currentGbaBoxPage > maxPage) currentGbaBoxPage = maxPage;

        if (gbaBoxTitle) {
            if (currentGbaFilter === 'shiny') {
                gbaBoxTitle.innerText = `✨ Caja Shiny (${currentFilteredBoxItems.length})`;
            } else if (currentGbaFilter !== 'all') {
                const regLabel = currentGbaFilter.charAt(0).toUpperCase() + currentGbaFilter.slice(1);
                gbaBoxTitle.innerText = `${regLabel} (${currentGbaBoxPage + 1}/${maxPage + 1})`;
            } else {
                gbaBoxTitle.innerText = `Caja ${currentGbaBoxPage + 1}`;
            }
        }

        if (currentGbaFilter === 'shiny') {
            gbaBoxGrid.classList.add('shiny-box-active');
        } else {
            gbaBoxGrid.classList.remove('shiny-box-active');
        }

        gbaBoxGrid.innerHTML = '';
        const pageStart = currentGbaBoxPage * 30;

        let activeFound = false;

        for (let i = 0; i < 30; i++) {
            const itemIdx = pageStart + i;
            const item = currentFilteredBoxItems[itemIdx];
            const member = item ? item.member : null;
            const origBoxIdx = item ? item.originalIndex : null;

            const slot = document.createElement('div');
            slot.className = 'gba-box-slot';
            if (origBoxIdx !== null) slot.setAttribute('data-box-idx', origBoxIdx);

            if (member && origBoxIdx !== null) {
                member.boxIndex = origBoxIdx;
                const isSelected = currentGbaSelectedMember && (currentGbaSelectedMember.boxIndex === origBoxIdx || (currentGbaSelectedMember.speciesId === member.speciesId && currentGbaSelectedMember.isShiny === member.isShiny));
                if (isSelected || (!currentGbaSelectedMember && !activeFound)) {
                    slot.classList.add('selected');
                    updateGbaInspector(member);
                    activeFound = true;
                }

                const sUrl = member.iconUrl || member.spriteUrl || (member.isShiny
                    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${member.speciesId}.png`
                    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.speciesId}.png`);
                slot.innerHTML = `<img src="${sUrl}" alt="${member.name}" title="${member.name}${member.isShiny ? ' ★' : ''} (Lv. ${member.level || 1})" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';">`;

                // Drag & Drop: Drag from PC Box to Team!
                slot.draggable = true;
                slot.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'box', boxIndex: member.boxIndex }));
                    e.dataTransfer.effectAllowed = 'move';
                    slot.classList.add('dragging');
                });
                slot.addEventListener('dragend', () => slot.classList.remove('dragging'));

                // Select on click
                slot.addEventListener('click', () => {
                    gbaBoxGrid.querySelectorAll('.gba-box-slot').forEach(s => s.classList.remove('selected'));
                    slot.classList.add('selected');
                    updateGbaInspector(member);
                });
            } else {
                slot.classList.add('empty');
            }

            // Drop zone on box slots (allows dropping team member into box to deposit or swap)
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                slot.classList.add('drag-over');
            });
            slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                const raw = e.dataTransfer.getData('text/plain');
                if (!raw) return;
                try {
                    const data = JSON.parse(raw);
                    if (data.type === 'team') {
                        if (member && origBoxIdx !== null) {
                            window.api.swapBoxWithTeam(origBoxIdx, data.slotIndex);
                        } else {
                            window.api.depositToPC(data.slotIndex);
                        }
                    }
                } catch (err) {
                    console.error('Error on box drop:', err);
                }
            });

            gbaBoxGrid.appendChild(slot);
        }

        if (!activeFound && currentFilteredBoxItems.length === 0) {
            updateGbaInspector(null);
        }
    }

    // Pagination & Duplicate Cleaning Controls
    if (btnGbaBoxPrev) {
        btnGbaBoxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentGbaBoxPage > 0) {
                currentGbaBoxPage--;
                renderPCBox(currentBoxList);
            }
        });
    }

    if (btnGbaBoxNext) {
        btnGbaBoxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            const maxPage = Math.max(0, Math.ceil((currentFilteredBoxItems.length || 0) / 30) - 1);
            if (currentGbaBoxPage < maxPage) {
                currentGbaBoxPage++;
                renderPCBox(currentBoxList);
            }
        });
    }

    if (btnGbaCleanDuplicates) {
        btnGbaCleanDuplicates.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.api.deduplicateBox) {
                window.api.deduplicateBox();
                btnGbaCleanDuplicates.innerText = '✓ ¡Limpio!';
                setTimeout(() => {
                    if (btnGbaCleanDuplicates) btnGbaCleanDuplicates.innerText = '🧹 Limpiar Duplicados';
                }, 1800);
            }
        });
    }

    if (btnGbaArchiveToDex) {
        btnGbaArchiveToDex.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!currentGbaSelectedMember) return;
            if (window.api.archiveToDex) {
                window.api.archiveToDex(currentGbaSelectedMember.boxIndex, true);
                btnGbaArchiveToDex.innerText = '✓ ¡Archivado!';
                setTimeout(() => {
                    if (btnGbaArchiveToDex) btnGbaArchiveToDex.innerText = '🏛️ Archivar a Dex';
                }, 1800);
            }
        });
    }

    // GBA PC Box Regional & Shiny Filter Bar Listeners
    if (gbaFiltersBar) {
        gbaFiltersBar.querySelectorAll('.gba-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                gbaFiltersBar.querySelectorAll('.gba-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentGbaFilter = btn.getAttribute('data-filter') || 'all';
                currentGbaBoxPage = 0;
                renderPCBox(currentBoxList);
            });
        });
    }

    // 2. Pokédex Regional con Siluetas y Estrellas de Maestría (Nv. 100 ⭐)
    function renderRegionalDex(dex) {
        latestUnlockedDex = dex || [];
        if (!dexContainer) return;

        const [startId, endId] = REGION_RANGES[currentDexRegion] || [1, 151];
        const regionalList = allPokedexList.filter(p => p.id >= startId && p.id <= endId);

        const unlockedMap = new Map();
        latestUnlockedDex.forEach(entry => {
            unlockedMap.set(entry.dexNumber, entry);
        });

        if (dexTotalCount) {
            dexTotalCount.innerText = `${latestUnlockedDex.length} / ${allPokedexList.length || 1025} Registrados`;
        }

        dexContainer.innerHTML = '';
        if (regionalList.length === 0) {
            dexContainer.innerHTML = '<div class="dex-empty">Cargando región...</div>';
            return;
        }

        const masteryMap = (latestCompanionData && latestCompanionData.pokemon && latestCompanionData.pokemon.mastery) || {};

        regionalList.forEach(entry => {
            const captured = unlockedMap.get(entry.id);
            const cell = document.createElement('div');
            cell.className = 'dex-cell';

            const numLabel = `#${String(entry.id).padStart(3, '0')}`;
            const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry.id}.png`;

            if (captured) {
                const inTeam = currentTeamData.some(m => !m.isEmpty && !m.isEgg && m.speciesId === entry.id);
                const sUrl = captured.isShiny
                    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${entry.id}.png`
                    : spriteUrl;

                const masteryCount = masteryMap[entry.id] || 0;
                const masteryBadgeHtml = masteryCount > 0
                    ? `<span class="dex-mastery-badge" title="¡${masteryCount} Pokémon de esta especie alcanzaron el Nv. 100!">⭐${masteryCount > 1 ? ' x' + masteryCount : ''}</span>`
                    : '';

                cell.classList.add('discovered');
                cell.title = `Haz clic para ver detalles y rango de ${entry.name} • Arrastra al equipo`;
                cell.innerHTML = `
                    ${masteryBadgeHtml}
                    <span class="dex-cell-num">${numLabel}</span>
                    <img class="dex-cell-sprite" src="${sUrl}" alt="${entry.name}">
                    <span class="dex-cell-name" title="${entry.name}">${entry.name}</span>
                    ${inTeam
                        ? `<span style="font-size:6px; color:#10b981; font-weight:700; margin-top:2px;">En Equipo</span>`
                        : `<button class="btn-dex-add">+ Equipo</button>`
                    }
                `;

                // HTML5 Drag & Drop from Dex to Team
                cell.draggable = true;
                cell.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'dex', speciesId: entry.id }));
                    e.dataTransfer.effectAllowed = 'copyMove';
                    cell.classList.add('dragging');
                });
                cell.addEventListener('dragend', () => cell.classList.remove('dragging'));

                // Click to view PokeAPI Details & Rank Potential Modal
                cell.addEventListener('click', () => {
                    openDexDetailsModal(entry.id, entry.name, captured);
                });

                const addBtn = cell.querySelector('.btn-dex-add');
                if (addBtn) {
                    addBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const filledMembers = currentTeamData.filter(m => !m.isEmpty).length;
                        if (filledMembers < 6) {
                            if (window.api.recruitFromDex) {
                                window.api.recruitFromDex(entry.id, null);
                            } else {
                                window.api.deployFromDex(entry.id, null);
                            }
                        } else {
                            openSwapModal('dex', entry.id);
                        }
                    });
                }
            } else {
                // No capturado: Silueta negra sombreada y ???
                cell.innerHTML = `
                    <span class="dex-cell-num">${numLabel}</span>
                    <img class="dex-cell-sprite silhouette" src="${spriteUrl}" alt="???">
                    <span class="dex-cell-name" style="color:#64748b;">???</span>
                `;
            }

            dexContainer.appendChild(cell);
        });
    }

    // Modal de Detalles de Pokédex con PokeAPI y Modo Offline First
    async function openDexDetailsModal(speciesId, speciesName, capturedData) {
        if (!dexDetailsModal) return;
        currentModalSpeciesId = speciesId;

        const ranks = (latestCompanionData?.pokemon?.speciesRank) || {};
        const rank = ranks[speciesId] || 'F';
        const essences = (latestCompanionData?.pokemon?.speciesEssence) || {};
        const essence = essences[speciesId] || 0;
        const nextCost = RANK_COSTS[rank] || 0;
        const bonus = RANK_BONUS[rank] || 0;

        if (modalDexNumber) modalDexNumber.innerText = '#' + String(speciesId).padStart(3, '0');
        if (modalDexName) modalDexName.innerText = speciesName;
        if (modalDexRankBadge) {
            modalDexRankBadge.className = `rank-badge rank-${rank.toLowerCase()}`;
            modalDexRankBadge.innerText = rank;
        }

        const isShiny = capturedData && capturedData.isShiny;
        const shinyPrefix = isShiny ? 'shiny/' : '';
        const defaultSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPrefix}${speciesId}.png`;
        if (modalDexSprite) {
            modalDexSprite.onerror = function() {
                this.onerror = null;
                this.src = defaultSprite;
            };
            modalDexSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${shinyPrefix}${speciesId}.gif`;
        }

        if (modalDexEssenceCount) {
            modalDexEssenceCount.innerText = rank === 'SSS' ? `${essence} (MAX)` : `${essence} / ${nextCost}`;
        }
        if (modalDexEssenceBar) {
            const pct = rank === 'SSS' ? 100 : Math.min(100, Math.round((essence / Math.max(1, nextCost)) * 100));
            modalDexEssenceBar.style.width = `${pct}%`;
        }
        if (modalDexBonusDesc) {
            modalDexBonusDesc.innerText = `Bonus actual: +${bonus}% a todas las estadísticas`;
        }
        if (btnUpgradeRankModal) {
            btnUpgradeRankModal.disabled = rank === 'SSS' || essence < nextCost;
            btnUpgradeRankModal.innerText = rank === 'SSS' ? 'RANGO MÁX' : `⭐ Subir a ${RANK_LADDER[RANK_LADDER.indexOf(rank) + 1] || 'MAX'} (${nextCost})`;
        }

        // Offline first with LocalStorage Cache
        const cacheKey = `pokeapi_cache_species_${speciesId}`;
        const cached = localStorage.getItem(cacheKey);

        function applyDexDetails(data) {
            if (modalDexTypes) {
                modalDexTypes.innerHTML = '';
                (data.types || ['Normal']).forEach(t => {
                    const pill = document.createElement('span');
                    pill.className = 'gba-type-pill';
                    pill.style.background = GBA_TYPE_COLORS[t] || '#6366f1';
                    pill.innerText = t;
                    modalDexTypes.appendChild(pill);
                });
            }
            if (modalDexHeight) modalDexHeight.innerText = data.height || '--';
            if (modalDexWeight) modalDexWeight.innerText = data.weight || '--';
            if (modalDexAbility) modalDexAbility.innerText = data.ability || 'Adaptabilidad';

            if (barDexHp) barDexHp.style.width = `${Math.min(100, Math.round(((data.stats?.hp || 60) / 160) * 100))}%`;
            if (valDexHp) valDexHp.innerText = data.stats?.hp || 60;
            if (barDexAtk) barDexAtk.style.width = `${Math.min(100, Math.round(((data.stats?.atk || 65) / 160) * 100))}%`;
            if (valDexAtk) valDexAtk.innerText = data.stats?.atk || 65;
            if (barDexDef) barDexDef.style.width = `${Math.min(100, Math.round(((data.stats?.def || 60) / 160) * 100))}%`;
            if (valDexDef) valDexDef.innerText = data.stats?.def || 60;
            if (barDexSpd) barDexSpd.style.width = `${Math.min(100, Math.round(((data.stats?.spd || 60) / 160) * 100))}%`;
            if (valDexSpd) valDexSpd.innerText = data.stats?.spd || 60;
            if (modalDexStatTotal) {
                const bst = (data.stats?.hp || 60) + (data.stats?.atk || 65) + (data.stats?.def || 60) + (data.stats?.spd || 60);
                modalDexStatTotal.innerText = `BST: ${bst}`;
            }

            if (modalDexFlavor) modalDexFlavor.innerText = data.flavor || 'Espécimen registrado en la Pokédex Nacional.';
        }

        const fallbackTypes = KNOWN_POKEMON_TYPES[speciesId] || ['Normal'];
        const fallbackData = {
            types: fallbackTypes,
            height: '1.0 m',
            weight: '25.0 kg',
            ability: 'Adaptabilidad',
            stats: { hp: 60, atk: 65, def: 60, spd: 60 },
            flavor: 'Espécimen registrado en la Pokédex Nacional. Los datos completos se sincronizan desde PokeAPI cuando hay conexión.'
        };

        if (cached) {
            try {
                applyDexDetails(JSON.parse(cached));
            } catch (e) {
                applyDexDetails(fallbackData);
            }
        } else {
            applyDexDetails(fallbackData);
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2500);
                const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesId}`, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (resp.ok) {
                    const apiData = await resp.json();
                    const translatedTypes = (apiData.types || []).map(t => {
                        const nameEn = t.type.name;
                        const map = {
                            'normal': 'Normal', 'fire': 'Fuego', 'water': 'Agua', 'grass': 'Planta',
                            'electric': 'Eléctrico', 'ice': 'Hielo', 'fighting': 'Lucha', 'poison': 'Veneno',
                            'ground': 'Tierra', 'flying': 'Volador', 'psychic': 'Psíquico', 'bug': 'Bicho',
                            'rock': 'Roca', 'ghost': 'Fantasma', 'dragon': 'Dragón', 'steel': 'Acero',
                            'fairy': 'Hada', 'dark': 'Siniestro'
                        };
                        return map[nameEn] || nameEn.toUpperCase();
                    });

                    const statsMap = {};
                    (apiData.stats || []).forEach(s => {
                        if (s.stat.name === 'hp') statsMap.hp = s.base_stat;
                        if (s.stat.name === 'attack') statsMap.atk = s.base_stat;
                        if (s.stat.name === 'defense') statsMap.def = s.base_stat;
                        if (s.stat.name === 'speed') statsMap.spd = s.base_stat;
                    });

                    let flavorText = fallbackData.flavor;
                    try {
                        const sResp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesId}`);
                        if (sResp.ok) {
                            const sData = await sResp.json();
                            const esEntry = (sData.flavor_text_entries || []).find(e => e.language.name === 'es')
                                || (sData.flavor_text_entries || []).find(e => e.language.name === 'en');
                            if (esEntry) {
                                flavorText = esEntry.flavor_text.replace(/[\n\f]/g, ' ');
                            }
                        }
                    } catch (e) {}

                    const fullData = {
                        types: translatedTypes.length ? translatedTypes : fallbackTypes,
                        height: `${(apiData.height / 10).toFixed(1)} m`,
                        weight: `${(apiData.weight / 10).toFixed(1)} kg`,
                        ability: apiData.abilities?.[0]?.ability?.name ? apiData.abilities[0].ability.name.toUpperCase() : 'Adaptabilidad',
                        stats: statsMap,
                        flavor: flavorText
                    };

                    localStorage.setItem(cacheKey, JSON.stringify(fullData));
                    if (currentModalSpeciesId === speciesId) {
                        applyDexDetails(fullData);
                    }
                }
            } catch (err) {
                // Offline fallback remains active, no crash!
            }
        }

        dexDetailsModal.style.display = 'flex';
    }

    if (btnCloseDexModal) btnCloseDexModal.addEventListener('click', () => { if (dexDetailsModal) dexDetailsModal.style.display = 'none'; });
    if (btnCloseDexModalX) btnCloseDexModalX.addEventListener('click', () => { if (dexDetailsModal) dexDetailsModal.style.display = 'none'; });

    if (btnUpgradeRankModal) {
        btnUpgradeRankModal.addEventListener('click', () => {
            if (window.api.upgradeSpeciesRank) {
                window.api.upgradeSpeciesRank(currentModalSpeciesId);
                setTimeout(() => {
                    const sp = allPokedexList.find(p => p.id === currentModalSpeciesId) || { name: 'Pokémon' };
                    const captured = latestUnlockedDex.find(e => e.dexNumber === currentModalSpeciesId);
                    openDexDetailsModal(currentModalSpeciesId, sp.name, captured);
                }, 150);
            }
        });
    }

    if (btnDeployFromModal) {
        btnDeployFromModal.addEventListener('click', () => {
            const filledMembers = currentTeamData.filter(m => !m.isEmpty).length;
            if (filledMembers < 6) {
                if (window.api.recruitFromDex) {
                    window.api.recruitFromDex(currentModalSpeciesId, null);
                } else {
                    window.api.deployFromDex(currentModalSpeciesId, null);
                }
            } else {
                openSwapModal('dex', currentModalSpeciesId);
            }
            if (dexDetailsModal) dexDetailsModal.style.display = 'none';
        });
    }

    function renderPCBoxAndDex(box, dex) {
        renderPCBox(box);
        renderRegionalDex(dex);
    }

    // 3. Embedded Live Battle Arena Updater (Para combate dentro de la tarjeta al minimizar)
    function updateEmbeddedBattleView(battle) {
        if (!battle || battle.isOver) {
            if (battleActiveView) battleActiveView.style.display = 'none';
            if (battleInactiveView) battleInactiveView.style.display = 'flex';
            return;
        }

        if (battleInactiveView) battleInactiveView.style.display = 'none';
        if (battleActiveView) battleActiveView.style.display = 'flex';

        if (embeddedTurnIndicator) {
            embeddedTurnIndicator.innerText = `⚔️ Turno ${battle.turn || 1}`;
        }

        // Rival en arena incrustada
        if (embRivalName && battle.wild) embRivalName.innerText = `${battle.wild.name} ${battle.wild.isShiny ? '★' : ''}`;
        if (embRivalLevel && battle.wild) embRivalLevel.innerText = `Lv. ${battle.wild.level}`;
        if (embRivalSprite && battle.wild) embRivalSprite.src = battle.wild.spriteUrl;
        if (embRivalHpBar && battle.wild) {
            const rHp = Math.max(0, Math.min(100, Math.round((battle.wild.currentHP / battle.wild.maxHP) * 100)));
            embRivalHpBar.style.width = `${rHp}%`;
            embRivalHpBar.style.background = rHp > 50 ? '#10b981' : rHp > 20 ? '#fbbf24' : '#ef4444';
            if (embRivalHpText) embRivalHpText.innerText = `${battle.wild.currentHP}/${battle.wild.maxHP}`;
        }

        // Player en arena incrustada
        if (embPlayerName && battle.player) embPlayerName.innerText = `${battle.player.name} ${battle.player.isShiny ? '★' : ''}`;
        if (embPlayerLevel && battle.player) embPlayerLevel.innerText = `Lv. ${battle.player.level}`;
        if (embPlayerSprite && battle.player) embPlayerSprite.src = battle.player.spriteUrl;
        if (embPlayerHpBar && battle.player) {
            const pHp = Math.max(0, Math.min(100, Math.round((battle.player.currentHP / battle.player.maxHP) * 100)));
            embPlayerHpBar.style.width = `${pHp}%`;
            embPlayerHpBar.style.background = pHp > 50 ? '#10b981' : pHp > 20 ? '#fbbf24' : '#ef4444';
            if (embPlayerHpText) embPlayerHpText.innerText = `${battle.player.currentHP}/${battle.player.maxHP}`;
        }

        // Log ticker incrustado
        if (embBattleLogTicker) {
            const lastMsg = battle.recentLog && battle.recentLog.length ? battle.recentLog[battle.recentLog.length - 1] : '¡En combate!';
            embBattleLogTicker.innerText = lastMsg;
            embBattleLogTicker.title = (battle.recentLog || []).join('\n');
        }

        // Movimientos incrustados
        if (embMovesGrid && battle.player && battle.player.moves) {
            embMovesGrid.innerHTML = '';
            battle.player.moves.forEach((m, idx) => {
                const btn = document.createElement('button');
                btn.className = 'action-btn';
                btn.style.fontSize = '7.5px';
                btn.style.padding = '3px 4px';
                btn.style.display = 'flex';
                btn.style.justifyContent = 'space-between';
                btn.style.alignItems = 'center';
                btn.style.background = 'rgba(30, 41, 59, 0.9)';
                btn.style.border = '1px solid rgba(255,255,255,0.12)';
                const typeCol = TYPE_COLORS[m.type] || '#6366f1';
                btn.innerHTML = `<span style="font-weight:800; color:#f8fafc;">${m.name}</span><span style="font-size:6.5px; color:${typeCol}; font-weight:700;">${m.type}</span>`;
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.api.battleMove(idx);
                });
                embMovesGrid.appendChild(btn);
            });
        }
    }

    // Render Active & Learned Moves (No HMs restriction)
    function renderMoves(moves, learnedMoves) {
        currentActiveMoves = moves || [];

        // 1. Stats Active Moves
        if (statsMovesGrid) {
            statsMovesGrid.innerHTML = '';
            for (let i = 0; i < 4; i++) {
                const mv = currentActiveMoves[i];
                const pill = document.createElement('div');
                pill.className = 'move-pill';
                if (mv) {
                    pill.innerHTML = `<span>${mv.name}</span><span style="font-size:6.5px; color:#38bdf8;">${mv.type} (${mv.pp})</span>`;
                } else {
                    pill.innerHTML = `<span style="color:#64748b;">(Vacío)</span>`;
                }
                statsMovesGrid.appendChild(pill);
            }
        }

        // 2. Repertoire of Learned Moves
        if (learnedMovesList) {
            learnedMovesList.innerHTML = '';
            if (!learnedMoves || learnedMoves.length === 0) {
                learnedMovesList.innerHTML = '<div style="font-size:7px; color:#64748b; text-align:center;">Sin movimientos adicionales</div>';
            } else {
                learnedMoves.forEach(mName => {
                    const row = document.createElement('div');
                    row.style.display = 'flex';
                    row.style.alignItems = 'center';
                    row.style.justifyContent = 'space-between';
                    row.style.background = 'rgba(15,23,42,0.6)';
                    row.style.padding = '2px 5px';
                    row.style.borderRadius = '4px';
                    row.style.fontSize = '7.5px';

                    const isEquipped = currentActiveMoves.some(m => m && m.name === mName);

                    row.innerHTML = `
                        <span style="color:${isEquipped ? '#fbbf24' : '#cbd5e1'}; font-weight:700;">${mName} ${isEquipped ? '★' : ''}</span>
                        <div style="display:flex; gap:2px;">
                            <button class="tool-btn" data-slot="0" style="padding:1px 3px; font-size:6.5px;">R1</button>
                            <button class="tool-btn" data-slot="1" style="padding:1px 3px; font-size:6.5px;">R2</button>
                            <button class="tool-btn" data-slot="2" style="padding:1px 3px; font-size:6.5px;">R3</button>
                            <button class="tool-btn" data-slot="3" style="padding:1px 3px; font-size:6.5px;">R4</button>
                        </div>
                    `;

                    row.querySelectorAll('button').forEach(b => {
                        b.addEventListener('click', () => {
                            const targetActiveIdx = parseInt(b.getAttribute('data-slot'));
                            window.api.changeActiveMove(currentLeadIndex, targetActiveIdx, mName);
                        });
                    });

                    learnedMovesList.appendChild(row);
                });
            }
        }
    }

    // Type Colors Map for Move Buttons
    const TYPE_COLORS = {
        'Normal': '#94a3b8', 'Fuego': '#f97316', 'Agua': '#38bdf8', 'Planta': '#22c55e',
        'Eléctrico': '#eab308', 'Hielo': '#06b6d4', 'Lucha': '#dc2626', 'Veneno': '#a855f7',
        'Tierra': '#d97706', 'Volador': '#818cf8', 'Psíquico': '#ec4899', 'Bicho': '#84cc16',
        'Roca': '#b45309', 'Fantasma': '#7c3aed', 'Dragón': '#6366f1', 'Siniestro': '#475569',
        'Acero': '#64748b', 'Hada': '#f472b6'
    };

    // Battle View Controller
    if (btnStartWildBattle) {
        btnStartWildBattle.addEventListener('click', () => {
            window.api.startBattle(currentLeadIndex);
        });
    }

    function scheduleEmbeddedAutoBattle() {
        clearTimeout(autoBattleTimer);
        const isAuto = (latestCompanionData && latestCompanionData.pokemon && latestCompanionData.pokemon.settings && latestCompanionData.pokemon.settings.autoBattle) || (btnBattleAutoToggle && btnBattleAutoToggle.classList.contains('active'));
        if (!isAuto) return;
        if (!lastBattleState || lastBattleState.isOver || lastBattleState.inCatchPhase) return;

        const speed = (latestCompanionData && latestCompanionData.pokemon && latestCompanionData.pokemon.settings && latestCompanionData.pokemon.settings.battleSpeed) || (btnBattleSpeedToggle && btnBattleSpeedToggle.innerText.includes('x2') ? 2 : 1);
        const delay = speed === 2 ? 350 : 750;
        autoBattleTimer = setTimeout(() => {
            if (lastBattleState && !lastBattleState.isOver && !lastBattleState.inCatchPhase) {
                window.api.battleAutoMove();
            }
        }, delay);
    }

    if (btnBattleSpeedToggle) {
        btnBattleSpeedToggle.addEventListener('click', () => {
            const currentSpeed = btnBattleSpeedToggle.innerText.includes('x2') ? 2 : 1;
            const newSpeed = currentSpeed === 2 ? 1 : 2;
            btnBattleSpeedToggle.innerText = `⚡ x${newSpeed}`;
            if (newSpeed === 2) btnBattleSpeedToggle.classList.add('active');
            else btnBattleSpeedToggle.classList.remove('active');
            if (latestCompanionData && latestCompanionData.pokemon && latestCompanionData.pokemon.settings) {
                latestCompanionData.pokemon.settings.battleSpeed = newSpeed;
            }
            window.api.toggleBattleSpeed();
            scheduleEmbeddedAutoBattle();
        });
    }

    if (btnBattleAutoToggle) {
        btnBattleAutoToggle.addEventListener('click', () => {
            const wasAuto = btnBattleAutoToggle.classList.contains('active') || btnBattleAutoToggle.innerText.includes('ON');
            const nowAuto = !wasAuto;
            btnBattleAutoToggle.innerText = nowAuto ? '🤖 Auto: ON' : '🤖 Auto: OFF';
            if (nowAuto) btnBattleAutoToggle.classList.add('active');
            else btnBattleAutoToggle.classList.remove('active');
            if (latestCompanionData && latestCompanionData.pokemon && latestCompanionData.pokemon.settings) {
                latestCompanionData.pokemon.settings.autoBattle = nowAuto;
            }
            window.api.toggleAutoBattle();
            scheduleEmbeddedAutoBattle();
        });
    }

    if (btnBattlePopoutToggle) {
        btnBattlePopoutToggle.addEventListener('click', () => {
            window.api.toggleBattleWindow();
        });
    }

    if (btnBattleUsePotion) {
        btnBattleUsePotion.addEventListener('click', () => {
            window.api.battleItem('potion');
        });
    }

    if (btnBattleSwitchMember) {
        btnBattleSwitchMember.addEventListener('click', () => {
            if (battleSwitchSubmenu) {
                battleSwitchSubmenu.style.display = 'flex';
                renderBattleSwitchList();
            }
        });
    }

    if (btnBackFromSwitch) {
        btnBackFromSwitch.addEventListener('click', () => {
            if (battleSwitchSubmenu) {
                battleSwitchSubmenu.style.display = 'none';
            }
        });
    }

    if (btnBattleRun) {
        btnBattleRun.addEventListener('click', () => {
            window.api.battleRun();
        });
    }

    // Catch Buttons Listeners
    if (btnCatchPokeBall) btnCatchPokeBall.addEventListener('click', () => window.api.battleCatch('poke-ball'));
    if (btnCatchGreatBall) btnCatchGreatBall.addEventListener('click', () => window.api.battleCatch('great-ball'));
    if (btnCatchUltraBall) btnCatchUltraBall.addEventListener('click', () => window.api.battleCatch('ultra-ball'));
    if (btnCatchMasterBall) btnCatchMasterBall.addEventListener('click', () => window.api.battleCatch('master-ball'));
    if (btnFinishCatch) btnFinishCatch.addEventListener('click', () => window.api.battleFinishCatch());

    function renderBattleSwitchList() {
        if (!battleSwitchList) return;
        battleSwitchList.innerHTML = '';

        currentTeamData.forEach((member, idx) => {
            if (!member.isEmpty && !member.isEgg) {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.alignItems = 'center';
                row.style.justifyContent = 'space-between';
                row.style.background = 'rgba(15,23,42,0.85)';
                row.style.border = '1px solid rgba(255,255,255,0.08)';
                row.style.padding = '3px 6px';
                row.style.borderRadius = '5px';
                row.style.fontSize = '7.5px';
                row.style.cursor = 'pointer';

                row.innerHTML = `
                    <div style="display:flex; align-items:center; gap:5px;">
                        <img src="${member.iconUrl}" style="width:18px; height:18px; image-rendering:pixelated; object-fit:contain;">
                        <span style="font-weight:700; color:#f1f5f9;">${member.name} (Lv. ${member.level})</span>
                    </div>
                    <button class="action-btn" style="padding:1px 5px; font-size:6.5px;">Elegir</button>
                `;

                row.addEventListener('click', () => {
                    window.api.battleSwitch(idx);
                    if (battleSwitchSubmenu) battleSwitchSubmenu.style.display = 'none';
                });

                battleSwitchList.appendChild(row);
            }
        });
    }

    // Live Battle State Updates
    if (window.api.onBattleUpdate) {
        window.api.onBattleUpdate((battle) => {
            lastBattleState = battle;
            updateEmbeddedBattleView(battle);

            const cardBattleStatusAlert = document.getElementById('cardBattleStatusAlert');
            if (!battle || battle.isOver) {
                clearTimeout(autoBattleTimer);
                if (cardBattleStatusAlert) cardBattleStatusAlert.style.display = 'none';
                if (battleActiveView) battleActiveView.style.display = 'none';
                if (battleInactiveView) battleInactiveView.style.display = 'flex';
                return;
            }

            if (cardBattleStatusAlert) {
                cardBattleStatusAlert.style.display = 'block';
                cardBattleStatusAlert.innerText = `⚔️ ¡En combate contra ${battle.wild ? battle.wild.name : 'Rival'}!`;
            }

            if (battleInactiveView) battleInactiveView.style.display = 'none';
            if (battleActiveView) battleActiveView.style.display = 'flex';

            if (battleTurnIndicator) {
                battleTurnIndicator.innerText = `Turno ${battle.turn || 1}`;
            }

            // Wild entity (Top-Right)
            if (battleWildName) battleWildName.innerText = `${battle.wild.name} ${battle.wild.isShiny ? '★' : ''}`;
            if (battleWildLevel) battleWildLevel.innerText = `Lv. ${battle.wild.level} (${battle.wild.type})`;
            if (battleWildSprite) battleWildSprite.src = battle.wild.spriteUrl;
            const wildHpPercent = Math.max(0, Math.min(100, Math.round((battle.wild.currentHP / battle.wild.maxHP) * 100)));
            if (battleWildHpBar) {
                battleWildHpBar.style.width = `${wildHpPercent}%`;
                battleWildHpBar.style.background = wildHpPercent > 50 ? '#10b981' : wildHpPercent > 20 ? '#fbbf24' : '#ef4444';
            }
            if (battleWildHpText) battleWildHpText.innerText = `HP ${battle.wild.currentHP}/${battle.wild.maxHP}`;

            // Player entity (Bottom-Left)
            if (battlePlayerName) battlePlayerName.innerText = `${battle.player.name} ${battle.player.isShiny ? '★' : ''}`;
            if (battlePlayerLevel) battlePlayerLevel.innerText = `Lv. ${battle.player.level} (${battle.player.type})`;
            if (battlePlayerSprite) battlePlayerSprite.src = battle.player.spriteUrl;
            const playerHpPercent = Math.max(0, Math.min(100, Math.round((battle.player.currentHP / battle.player.maxHP) * 100)));
            if (battlePlayerHpBar) {
                battlePlayerHpBar.style.width = `${playerHpPercent}%`;
                battlePlayerHpBar.style.background = playerHpPercent > 50 ? '#10b981' : playerHpPercent > 20 ? '#fbbf24' : '#ef4444';
            }
            if (battlePlayerHpText) battlePlayerHpText.innerText = `HP ${battle.player.currentHP}/${battle.player.maxHP}`;

            // Live Log Ticker
            if (battleCombatLog) {
                const lastMsg = battle.recentLog && battle.recentLog.length ? battle.recentLog[battle.recentLog.length - 1] : '¡En combate!';
                battleCombatLog.innerText = lastMsg;
                battleCombatLog.title = (battle.recentLog || []).join('\n');
            }

            // Catch Phase vs Attack Moves Mode
            const inv = (latestCompanionData && latestCompanionData.pokemon && latestCompanionData.pokemon.inventory) || {};

            if (battle.inCatchPhase) {
                clearTimeout(autoBattleTimer);
                if (battleMovesSection) battleMovesSection.style.display = 'none';
                if (battleCatchSection) battleCatchSection.style.display = 'block';

                const pCount = inv.pokeballs || 0;
                const gCount = inv.greatballs || 0;
                const uCount = inv.ultraballs || 0;
                const mCount = inv.masterballs || 0;

                const pRate = (battle.catchRates && battle.catchRates.pokeball) || 65;
                const gRate = (battle.catchRates && battle.catchRates.greatball) || 94;
                const uRate = (battle.catchRates && battle.catchRates.ultraball) || 99;

                if (catchPokeCount) catchPokeCount.innerText = '∞';
                if (catchGreatCount) catchGreatCount.innerText = `x${gCount}`;
                if (catchUltraCount) catchUltraCount.innerText = `x${uCount}`;
                if (catchMasterCount) catchMasterCount.innerText = `x${mCount}`;

                if (catchPokeRate) catchPokeRate.innerText = `${pRate}%`;
                if (catchGreatRate) catchGreatRate.innerText = `${gRate}%`;
                if (catchUltraRate) catchUltraRate.innerText = `${uRate}%`;

                if (btnCatchPokeBall) {
                    btnCatchPokeBall.disabled = false;
                    btnCatchPokeBall.title = `Poké Ball: ${pRate}% probabilidad. (Ilimitadas: 5 por combate)`;
                }
                if (btnCatchGreatBall) {
                    btnCatchGreatBall.disabled = gCount <= 0;
                    btnCatchGreatBall.title = `Super Ball: ${gRate}% probabilidad de captura. (Tienes ${gCount})`;
                }
                if (btnCatchUltraBall) {
                    btnCatchUltraBall.disabled = uCount <= 0;
                    btnCatchUltraBall.title = `Ultra Ball: ${uRate}% probabilidad de captura. (Tienes ${uCount})`;
                }
                if (btnCatchMasterBall) {
                    btnCatchMasterBall.disabled = mCount <= 0;
                    btnCatchMasterBall.title = `Master Ball: 100% captura infalible. (Tienes ${mCount})`;
                }
            } else {
                if (battleMovesSection) battleMovesSection.style.display = 'block';
                if (battleCatchSection) battleCatchSection.style.display = 'none';

                // Populate 4 Moves in 2x2 Grid (Action Box)
                if (battleMovesGrid) {
                    battleMovesGrid.innerHTML = '';
                    (battle.player.moves || []).slice(0, 4).forEach((mv, idx) => {
                        const btn = document.createElement('button');
                        btn.className = 'sketch-move-btn';
                        const typeColor = TYPE_COLORS[mv.type] || '#6366f1';
                        btn.innerHTML = `
                            <div class="sketch-move-header">
                                <span class="sketch-move-name">${mv.name}</span>
                                <span class="sketch-move-type" style="background:${typeColor};">${mv.type}</span>
                            </div>
                            <div class="sketch-move-footer">
                                <span class="sketch-move-pp">PP ${mv.currentPP}/${mv.maxPP}</span>
                                <span class="sketch-move-pwr">POT ${mv.power || '-'}</span>
                            </div>
                        `;
                        btn.disabled = mv.currentPP <= 0;
                        btn.addEventListener('click', () => {
                            window.api.battleMove(idx);
                        });
                        battleMovesGrid.appendChild(btn);
                    });
                }

                // Auto Battle Trigger
                scheduleEmbeddedAutoBattle();
            }
        });
    }

    // Main Update Listener
    if (window.api?.onUpdate) {
        window.api.onUpdate((data) => {
        const { tokens, pokemon } = data;
        latestCompanionData = data;

        // Top badges
        todayTokensDisplay.innerText = formatNumber(tokens.todayTokens);
        spendableTokensDisplay.innerText = formatNumber(pokemon.spendableTokens);

        if (leadPokemonNameText) {
            leadPokemonNameText.innerText = pokemon.pokemonName;
        } else {
            pokemonName.innerText = pokemon.pokemonName;
        }

        const leadMember = (pokemon.team && pokemon.team[pokemon.leadIndex]) || pokemon;
        const leadSpeciesId = leadMember.speciesId || (leadMember.isEgg ? 0 : 4);
        const leadRank = (pokemon.speciesRank && pokemon.speciesRank[leadSpeciesId]) || 'F';
        if (leadRankBadge) {
            leadRankBadge.className = `rank-badge rank-${leadRank.toLowerCase()}`;
            leadRankBadge.innerText = leadRank;
            leadRankBadge.title = `Rango de Potencial: ${leadRank} (+${RANK_BONUS[leadRank] || 0}% Stats)`;
            leadRankBadge.style.display = leadMember.isEgg ? 'none' : 'inline-flex';
        }
        natureTag.innerText = `Naturaleza: ${pokemon.nature}`;
        levelBadge.innerText = `Lv. ${pokemon.level}`;

        const evoTag = document.getElementById('evoTargetTag');
        if (evoTag) {
            evoTag.innerText = pokemon.evoInfoText || '';
        }

        // Toggle Encounters Button Icon & Tooltip
        const encEnabled = !pokemon.settings || pokemon.settings.encountersEnabled !== false;
        if (btnToggleEncounters) {
            btnToggleEncounters.innerText = encEnabled ? '⚔️' : '🛡️';
            btnToggleEncounters.title = encEnabled 
                ? '🐾 Encuentros Salvajes: ACTIVADOS (Haz clic para desactivar y pasear en paz)' 
                : '🛡️ Modo Seguro: Encuentros DESACTIVADOS (Haz clic para activar)';
        }

        // Synchronize Settings Modal Switches (Guard against race conditions with user clicks)
        if (Date.now() - lastSettingInteraction > 1500) {
            if (settingEncountersSwitch) {
                settingEncountersSwitch.checked = encEnabled;
            }
            if (settingSkipVsSwitch) {
                settingSkipVsSwitch.checked = !!(pokemon.settings && pokemon.settings.skipVsDialog);
            }
            if (settingSpecialBallsSwitch) {
                settingSpecialBallsSwitch.checked = !!(pokemon.settings && pokemon.settings.useSpecialBalls);
            }
            if (settingAudioSwitch) {
                settingAudioSwitch.checked = !(pokemon.settings && pokemon.settings.soundEnabled === false);
            }
            if (settingHideOnFullscreenSwitch) {
                settingHideOnFullscreenSwitch.checked = !!(pokemon.settings && pokemon.settings.hideOnFullscreen);
            }
        }

        // Battle speed and auto controls
        const isAuto = pokemon.settings && pokemon.settings.autoBattle;
        const speed = (pokemon.settings && pokemon.settings.battleSpeed) || 1;
        if (btnBattleAutoToggle) {
            btnBattleAutoToggle.innerText = isAuto ? '🤖 Auto: ON' : '🤖 Auto: OFF';
            if (isAuto) btnBattleAutoToggle.classList.add('active');
            else btnBattleAutoToggle.classList.remove('active');
        }
        if (btnBattleSpeedToggle) {
            btnBattleSpeedToggle.innerText = `⚡ x${speed}`;
            if (speed === 2) btnBattleSpeedToggle.classList.add('active');
            else btnBattleSpeedToggle.classList.remove('active');
        }

        // Update Battle Preparation Lobby (when no battle active)
        const lobbySprite = document.getElementById('lobbyFighterSprite');
        const lobbyName = document.getElementById('lobbyFighterName');
        const lobbyLevel = document.getElementById('lobbyFighterLevel');
        const lobbyMoves = document.getElementById('lobbyFighterMoves');

        if (lobbySprite) lobbySprite.src = pokemon.fallbackUrl || pokemon.spriteUrl;
        if (lobbyName) lobbyName.innerText = `${pokemon.pokemonName} ${pokemon.isShiny ? '★' : ''}`;
        if (lobbyLevel) lobbyLevel.innerText = `Lv. ${pokemon.level} • ${pokemon.nature}`;
        if (lobbyMoves) {
            lobbyMoves.innerHTML = '';
            (pokemon.moves || []).forEach(m => {
                const moveBadge = document.createElement('div');
                moveBadge.style.background = 'rgba(30,41,59,0.7)';
                moveBadge.style.border = '1px solid rgba(255,255,255,0.08)';
                moveBadge.style.borderRadius = '4px';
                moveBadge.style.padding = '2px 4px';
                moveBadge.style.fontSize = '6.5px';
                moveBadge.style.display = 'flex';
                moveBadge.style.justifyContent = 'space-between';
                moveBadge.innerHTML = `<span style="font-weight:700; color:#f1f5f9;">${m.name}</span><span style="color:#38bdf8;">${m.type}</span>`;
                lobbyMoves.appendChild(moveBadge);
            });
        }

        if (pokemon.isShiny) {
            shinyBadge.style.display = 'inline-block';
        } else {
            shinyBadge.style.display = 'none';
        }

        // Sprite
        currentFallback = pokemon.fallbackUrl;
        currentCryUrl = pokemon.cryUrl || null;
        if (pokemonSprite) {
            pokemonSprite.onerror = () => {
                if (currentFallback && pokemonSprite.src !== currentFallback) {
                    pokemonSprite.src = currentFallback;
                }
            };
            if (pokemonSprite.src !== pokemon.spriteUrl) {
                pokemonSprite.src = pokemon.spriteUrl;
            }
        }

        // Progress
        progressLabel.innerText = pokemon.progressLabel;
        progressPercent.innerText = `${pokemon.progressPercent}%`;
        progressFill.style.width = `${pokemon.progressPercent}%`;

        // Party of 6
        if (pokemon.team) {
            renderParty(pokemon.team, pokemon.leadIndex);
        }

        // Bag tab counts
        const inv = pokemon.inventory || {};
        bagCandiesCount.innerText = `${inv.rareCandy || 0} disponibles (+1 Nivel)`;
        btnUseCandy.disabled = (inv.rareCandy || 0) <= 0;

        bagMintsCount.innerText = `${inv.mint || 0} disponibles (Cambia rasgo)`;
        btnUseMint.disabled = (inv.mint || 0) <= 0 || pokemon.isEgg;

        if (bagPokeballsCount) bagPokeballsCount.innerText = `${inv.pokeballs || 0} disponibles (Básica)`;
        if (bagGreatballsCount) bagGreatballsCount.innerText = `${inv.greatballs || 0} disponibles (+45% captura)`;
        if (bagUltraballsCount) bagUltraballsCount.innerText = `${inv.ultraballs || 0} disponibles (+115% captura)`;
        if (bagMasterballsCount) bagMasterballsCount.innerText = `${inv.masterballs || 0} disponibles (100% infalible)`;
        if (bagPotionsCount) bagPotionsCount.innerText = `${inv.potions || 0} disponibles (+30 PS)`;

        // Refresh catch phase console if active right now
        if (lastBattleState && lastBattleState.inCatchPhase) {
            const gCount = inv.greatballs || 0;
            const uCount = inv.ultraballs || 0;
            const mCount = inv.masterballs || 0;
            if (catchPokeCount) catchPokeCount.innerText = '∞';
            if (catchGreatCount) catchGreatCount.innerText = `x${gCount}`;
            if (catchUltraCount) catchUltraCount.innerText = `x${uCount}`;
            if (catchMasterCount) catchMasterCount.innerText = `x${mCount}`;
            if (btnCatchPokeBall) btnCatchPokeBall.disabled = false;
            if (btnCatchGreatBall) btnCatchGreatBall.disabled = gCount <= 0;
            if (btnCatchUltraBall) btnCatchUltraBall.disabled = uCount <= 0;
            if (btnCatchMasterBall) btnCatchMasterBall.disabled = mCount <= 0;
        }

        if (inv.shinyCharm) {
            bagCharmStatus.innerText = 'Probabilidad 1/48 (+33% Activo)';
            bagCharmLabel.innerText = 'Activo ★';
            bagCharmLabel.style.color = '#38bdf8';
            btnBuyCharm.disabled = true;
            btnBuyCharm.innerText = 'Comprado';
        } else {
            bagCharmStatus.innerText = 'Probabilidad normal 1/64';
            bagCharmLabel.innerText = 'Inactivo';
            bagCharmLabel.style.color = '#94a3b8';
            btnBuyCharm.disabled = false;
            btnBuyCharm.innerText = 'Comprar';
        }

        // Egg bag
        renderEggBag(pokemon.eggBag, pokemon.eggBagCount);

        // PC Box and Dex
        renderPCBoxAndDex(pokemon.box, pokemon.dex);

        // Moves
        renderMoves(pokemon.moves, pokemon.learnedMoves);

        // Shop subtitles
        const teamFull = currentTeamData.filter(m => !m.isEmpty).length >= 6;
        if (shopEggCommonDesc) shopEggCommonDesc.innerText = `Precio: 1.0B tokens ${teamFull ? '(Irá a Bolsa)' : '(Al Equipo)'}`;
        if (shopEggUncommonDesc) shopEggUncommonDesc.innerText = `Precio: 2.5B tokens ${teamFull ? '(Irá a Bolsa)' : '(Al Equipo)'}`;
        if (shopEggRareDesc) shopEggRareDesc.innerText = `Precio: 4.0B tokens ${teamFull ? '(Irá a Bolsa)' : '(Al Equipo)'}`;

        // Info tab
        if (infoLeadName) infoLeadName.innerText = `Ranura ${(pokemon.leadIndex || 0) + 1}: ${pokemon.pokemonName}`;
        infoLineName.innerText = pokemon.lineName;
        infoStageLabel.innerText = pokemon.stageLabel;
        infoRemaining.innerText = `${formatNumber(pokemon.tokensRemaining)} tokens`;
        infoTotalTokens.innerText = formatNumber(tokens.totalTokens);

        // Branching Evolution Pending Alert
        if (pokemon.pendingBranchEvolution) {
            showBranchModal(pokemon.pendingBranchEvolution);
        }

        // Move Learn Pending Alert
        if (pokemon.pendingMoveLearn) {
            showMoveLearnModal(pokemon.pendingMoveLearn);
        } else if (moveLearnModalOverlay) {
            moveLearnModalOverlay.style.display = 'none';
        }

        // Celebration
        if (pokemon.eventOccurred) {
            if (currentCryUrl) playCry(currentCryUrl);
        }
    });
}

    // Request initial data immediately
    if (window.api?.requestStats) {
        window.api.requestStats();
    }
});

