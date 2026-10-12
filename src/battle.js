const { MOVES_DATABASE, MOVES_CATALOG, getTypeMultiplier, createMoveInstance, getUnlockedMovesForSpecies } = require('./moves');
const { EVOLUTION_LINES, EVOLUTION_TARGETS } = require('./pokemon');
const fs = require('fs');
const path = require('path');

// Primary type mapping for known species; fallback provided for all others
const SPECIES_TYPES = {
    4: 'Fuego', 5: 'Fuego', 6: 'Fuego',
    1: 'Planta', 2: 'Planta', 3: 'Planta',
    7: 'Agua', 8: 'Agua', 9: 'Agua',
    172: 'Eléctrico', 25: 'Eléctrico', 26: 'Eléctrico',
    92: 'Fantasma', 93: 'Fantasma', 94: 'Fantasma',
    443: 'Dragón', 444: 'Dragón', 445: 'Dragón',
    133: 'Normal',
    134: 'Agua', 135: 'Eléctrico', 136: 'Fuego',
    196: 'Psíquico', 197: 'Siniestro',
    470: 'Planta', 471: 'Hielo', 700: 'Hada',
    280: 'Psíquico', 281: 'Psíquico', 282: 'Hada', 475: 'Lucha',
    447: 'Lucha', 448: 'Lucha',
    147: 'Dragón', 148: 'Dragón', 149: 'Dragón',
    246: 'Roca', 247: 'Roca', 248: 'Siniestro',
    155: 'Fuego', 156: 'Fuego', 157: 'Fuego',
    255: 'Fuego', 256: 'Fuego', 257: 'Fuego',
    258: 'Agua', 259: 'Agua', 260: 'Agua',
    150: 'Psíquico'
};

// Load full 1,025 Pokémon Pokédex
let POKEDEX_ALL = [];
try {
    const rawDex = fs.readFileSync(path.join(__dirname, 'pokedex_all.json'), 'utf8');
    POKEDEX_ALL = JSON.parse(rawDex);
} catch (e) {
    POKEDEX_ALL = [
        { id: 4, name: 'Charmander' },
        { id: 1, name: 'Bulbasaur' },
        { id: 7, name: 'Squirtle' },
        { id: 25, name: 'Pikachu' },
        { id: 92, name: 'Gastly' },
        { id: 133, name: 'Eevee' },
        { id: 443, name: 'Gible' },
        { id: 280, name: 'Ralts' },
        { id: 447, name: 'Riolu' },
        { id: 147, name: 'Dratini' },
        { id: 246, name: 'Larvitar' },
        { id: 155, name: 'Cyndaquil' },
        { id: 255, name: 'Torchic' },
        { id: 258, name: 'Mudkip' }
    ];
}

const LEGENDARY_IDS = new Set([
    144, 145, 146, 150, 151,
    243, 244, 245, 249, 250, 251,
    377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
    480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,
    494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
    716, 717, 718, 719, 720, 721,
    785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809,
    888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 905,
    1001, 1002, 1003, 1004, 1007, 1008, 1010, 1014, 1015, 1016, 1017, 1024, 1025
]);

const RARE_IDS = new Set([
    147, 148, 149, 246, 247, 248, 371, 372, 373, 374, 375, 376,
    443, 444, 445, 633, 634, 635, 704, 705, 706, 782, 783, 784,
    885, 886, 887, 996, 997, 998,
    // Starters
    1, 2, 3, 4, 5, 6, 7, 8, 9,
    152, 153, 154, 155, 156, 157, 158, 159, 160,
    252, 253, 254, 255, 256, 257, 258, 259, 260,
    387, 388, 389, 390, 391, 392, 393, 394, 395,
    495, 496, 497, 498, 499, 500, 501, 502, 503,
    650, 651, 652, 653, 654, 655, 656, 657, 658,
    722, 723, 724, 725, 726, 727, 728, 729, 730,
    810, 811, 812, 813, 814, 815, 816, 817, 818,
    906, 907, 908, 909, 910, 911, 912, 913, 914
]);

function getSpeciesBaseCatchRate(id) {
    if (LEGENDARY_IDS.has(id)) return 0.22;
    if (RARE_IDS.has(id)) return 0.42;
    return 0.65;
}

function calculateCatchRatePercent(speciesId, ballType) {
    const base = getSpeciesBaseCatchRate(speciesId);
    let mult = 1.0;
    const bLower = (ballType || '').toLowerCase();
    if (bLower.includes('great') || bLower.includes('super')) mult = 1.45;
    else if (bLower.includes('ultra')) mult = 2.15;
    else if (bLower.includes('master')) return 100;

    return Math.min(99, Math.round(base * mult * 100));
}

function promoteWildPokemonByLevel(speciesId, level) {
    let currentId = speciesId;
    let currentName = null;

    if (Array.isArray(EVOLUTION_LINES)) {
        for (const line of EVOLUTION_LINES) {
            const stageIdx = line.stages.findIndex(s => s.id === speciesId);
            if (stageIdx !== -1) {
                let bestIdx = stageIdx;
                for (let s = stageIdx; s < line.stages.length - 1; s++) {
                    const stage = line.stages[s];
                    const evo = (EVOLUTION_TARGETS && EVOLUTION_TARGETS[stage.id]) || null;
                    if (evo && evo.nextLevel && level >= evo.nextLevel) {
                        bestIdx = s + 1;
                    } else {
                        break;
                    }
                }
                currentId = line.stages[bestIdx].id;
                currentName = line.stages[bestIdx].name;
                return { id: currentId, name: currentName };
            }
        }
    }

    const found = POKEDEX_ALL.find(p => p.id === speciesId);
    return found ? { id: found.id, name: found.name } : { id: speciesId, name: `Pokémon #${speciesId}` };
}

function generateWildBattler(playerLevel, forcedWildSpeciesId = null) {
    const pLevel = Math.max(1, playerLevel || 5);
    // Strict rule: wild encounter level is strictly within [playerLevel - 5, playerLevel + 5]
    const levelDelta = Math.floor(Math.random() * 11) - 5; // -5 to +5
    const wildLevel = Math.max(1, Math.min(100, pLevel + levelDelta));

    let candidateSpeciesId = forcedWildSpeciesId;
    if (!candidateSpeciesId) {
        const randomEntry = POKEDEX_ALL[Math.floor(Math.random() * POKEDEX_ALL.length)];
        candidateSpeciesId = randomEntry.id;
    }

    // Strict rule: unevolved Pokémon can NEVER appear above its evolution level!
    // e.g. Charmander at Lv. 17 is promoted to Charmeleon, but Charizard at Lv. 20 can exist.
    const resolved = promoteWildPokemonByLevel(candidateSpeciesId, wildLevel);
    const wildId = resolved.id;
    const wildName = resolved.name;

    const wildType = SPECIES_TYPES[wildId] || 'Normal';
    const wildMaxHP = Math.round(20 + wildLevel * 5);
    const unlocked = getUnlockedMovesForSpecies(wildId, wildLevel);
    const wildMoveNames = unlocked.slice(-4);
    if (wildMoveNames.length === 0) wildMoveNames.push('Placaje');
    const wildMoves = wildMoveNames.map(m => createMoveInstance(m));

    const isShinyWild = Math.floor(Math.random() * 64) === 0;
    const wildSprite = isShinyWild
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${wildId}.png`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${wildId}.png`;
    const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${wildId}.ogg`;

    return {
        id: wildId,
        speciesId: wildId,
        name: wildName,
        level: wildLevel,
        type: wildType,
        maxHP: wildMaxHP,
        currentHP: wildMaxHP,
        isShiny: isShinyWild,
        spriteUrl: wildSprite,
        cryUrl,
        moves: wildMoves
    };
}

function simulateBackgroundBattle(playerMember, wildBattler, settings = {}, inventory = {}) {
    if (!playerMember || playerMember.isEgg) {
        return { success: false, msg: 'No se puede combatir con un huevo' };
    }

    const playerLevel = Math.max(1, playerMember.level || 5);
    const playerType = SPECIES_TYPES[playerMember.speciesId] || 'Normal';
    let playerHP = Math.round(25 + playerLevel * 6);
    let wildHP = wildBattler.maxHP || Math.round(20 + wildBattler.level * 5);

    const playerMoves = Array.isArray(playerMember.moves) && playerMember.moves.length > 0
        ? playerMember.moves
        : [createMoveInstance('Placaje')];
    const wildMoves = Array.isArray(wildBattler.moves) && wildBattler.moves.length > 0
        ? wildBattler.moves
        : [createMoveInstance('Placaje')];

    const logs = [];
    logs.push(`¡Encuentro en segundo plano con ${wildBattler.name} salvaje (Lv. ${wildBattler.level})!`);

    let turn = 0;
    const maxTurns = 20;

    while (playerHP > 0 && wildHP > 0 && turn < maxTurns) {
        turn++;
        const pMove = playerMoves[Math.floor(Math.random() * playerMoves.length)] || createMoveInstance('Placaje');
        const mult = getTypeMultiplier(pMove.type, wildBattler.type);
        const baseDmg = Math.round(((2 * playerLevel / 5 + 2) * pMove.power * (playerLevel / wildBattler.level) / 50) + 2);
        const pDmg = Math.max(1, Math.round(baseDmg * mult * (0.85 + Math.random() * 0.15)));
        wildHP = Math.max(0, wildHP - pDmg);

        if (wildHP <= 0) break;

        const wMove = wildMoves[Math.floor(Math.random() * wildMoves.length)] || createMoveInstance('Placaje');
        const wMult = getTypeMultiplier(wMove.type, playerType);
        const wBaseDmg = Math.round(((2 * wildBattler.level / 5 + 2) * wMove.power * (wildBattler.level / playerLevel) / 50) + 2);
        const wDmg = Math.max(1, Math.round(wBaseDmg * wMult * (0.85 + Math.random() * 0.15)));
        playerHP = Math.max(0, playerHP - wDmg);
    }

    if (playerHP <= 0) {
        logs.push(`Tu ${playerMember.name} no pudo continuar el combate.`);
        return {
            success: true,
            victory: false,
            caught: false,
            fled: true,
            expReward: 40,
            ballsUsed: [],
            logs
        };
    }

    // Wild defeated or weakened! 5 guaranteed Poké Ball throw opportunities
    logs.push(`¡${wildBattler.name} fue debilitado! Lanzando Poké Balls automáticas...`);
    const ballsUsed = [];
    let caught = false;
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        let ballType = 'poke-ball';

        // Check if settings allow special balls and player has stock
        if (settings.useSpecialBalls) {
            if ((inventory.masterballs || 0) > 0) {
                ballType = 'master-ball';
                inventory.masterballs--;
            } else if ((inventory.ultraballs || 0) > 0) {
                ballType = 'ultra-ball';
                inventory.ultraballs--;
            } else if ((inventory.greatballs || 0) > 0) {
                ballType = 'great-ball';
                inventory.greatballs--;
            }
        }

        ballsUsed.push(ballType);
        const catchRate = calculateCatchRatePercent(wildBattler.id, ballType);
        const roll = Math.random() * 100;

        if (roll < catchRate) {
            caught = true;
            logs.push(`¡Intento ${attempt}: ${wildBattler.name} capturado con éxito!`);
            break;
        } else {
            logs.push(`Intento ${attempt}: Se liberó de la ${ballType}.`);
        }
    }

    let moneyReward = 0;
    let expReward = 0;
    if (caught) {
        moneyReward = Math.round(wildBattler.level * 250000 + 1000000);
        expReward = 0; // Capture rewards shop money, no exp!
        logs.push(`¡Captura exitosa! Recompensa: +$${moneyReward.toLocaleString()} Saldo de Tienda.`);
    } else {
        expReward = Math.round(wildBattler.level * 180 + 150);
    }

    return {
        success: true,
        victory: true,
        caught,
        capturedPokemon: caught ? {
            speciesId: wildBattler.id,
            name: wildBattler.name,
            level: wildBattler.level,
            isShiny: !!wildBattler.isShiny,
            nature: 'Docile',
            moves: wildBattler.moves
        } : null,
        moneyReward,
        expReward,
        ballsUsed,
        logs
    };
}

class BattleEngine {
    constructor() {
        this.activeBattle = null;
    }

    isInBattle() {
        return !!this.activeBattle && !this.activeBattle.isOver;
    }

    startBattle(playerMember, slotIndex, forcedWildSpeciesId = null, fullTeam = null) {
        if (!playerMember || playerMember.isEgg) {
            return { success: false, msg: '¡No puedes combatir con un huevo!' };
        }

        const playerLevel = Math.max(1, playerMember.level || 5);
        const playerType = SPECIES_TYPES[playerMember.speciesId] || 'Normal';
        const playerMaxHP = Math.round(25 + playerLevel * 6);
        const playerCurrentHP = playerMember.currentHP !== undefined ? playerMember.currentHP : playerMaxHP;

        // Ensure player moves have valid data and full PP
        let playerMoves = Array.isArray(playerMember.moves) && playerMember.moves.length > 0
            ? playerMember.moves
            : [createMoveInstance('Placaje')];

        playerMoves.forEach(m => {
            const base = MOVES_CATALOG[m.name] || MOVES_CATALOG['Placaje'];
            m.type = m.type || base.type;
            m.power = m.power !== undefined ? m.power : base.power;
            m.maxPP = m.maxPP || base.maxPP || 35;
            if (m.currentPP === undefined || m.currentPP === null || m.currentPP <= 0) {
                m.currentPP = m.maxPP;
            }
        });

        // Use unified wild battler generator
        const wildBattler = generateWildBattler(playerLevel, forcedWildSpeciesId);

        const playerSprite = playerMember.isShiny
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${playerMember.speciesId}.png`
            : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${playerMember.speciesId}.png`;

        this.activeBattle = {
            turn: 1,
            isOver: false,
            inCatchPhase: false, // Set to true when wild reaches 0 HP!
            result: null, // 'victory', 'defeat', 'caught', 'escaped'
            capturedPokemon: null,
            team: fullTeam || [playerMember],
            moneyReward: 0,
            expReward: Math.round(wildBattler.level * 250 + 200),
            log: [
                `¡Un ${wildBattler.name} salvaje (Lv. ${wildBattler.level}) apareció!`,
                `¡Adelante, ${playerMember.name}!`
            ],
            player: {
                slotIndex,
                name: playerMember.name,
                speciesId: playerMember.speciesId,
                level: playerLevel,
                type: playerType,
                maxHP: playerMaxHP,
                currentHP: playerCurrentHP,
                isShiny: !!playerMember.isShiny,
                spriteUrl: playerSprite,
                moves: playerMoves
            },
            wild: wildBattler
        };

        return { success: true, battleState: this.getBattleState() };
    }

    executePlayerMove(moveIndex) {
        if (!this.isInBattle()) return { success: false, msg: 'No hay combate activo' };
        const b = this.activeBattle;

        // If wild is already down and in catch phase, player cannot attack again
        if (b.inCatchPhase) {
            return { success: false, msg: '¡El rival ya está debilitado! Lanza una Poké Ball o déjalo ir.' };
        }

        const move = b.player.moves[moveIndex];
        if (!move) return { success: false, msg: 'Movimiento inválido' };
        if (move.currentPP <= 0) return { success: false, msg: `¡No quedan PP para ${move.name}!` };

        move.currentPP--;
        b.turn++;

        // 1. Calculate Player Damage
        const mult = getTypeMultiplier(move.type, b.wild.type);
        const isCrit = Math.random() < 0.12;
        const critMult = isCrit ? 1.5 : 1.0;

        const baseDmg = Math.round(((2 * b.player.level / 5 + 2) * move.power * (b.player.level / b.wild.level) / 50) + 2);
        const randomFactor = 0.85 + (Math.random() * 0.15);
        const totalDamage = Math.max(1, Math.round(baseDmg * mult * critMult * randomFactor));

        b.wild.currentHP = Math.max(0, b.wild.currentHP - totalDamage);

        let effectMsg = '';
        if (mult > 1.0) effectMsg = ' ¡Es muy eficaz!';
        else if (mult < 1.0 && mult > 0) effectMsg = ' No es muy eficaz...';
        else if (mult === 0) effectMsg = ' ¡No afecta al rival!';
        if (isCrit) effectMsg += ' ¡Un golpe crítico!';

        b.log.push(`¡${b.player.name} usó ${move.name}! Infligió ${totalDamage} de daño.${effectMsg}`);

        // Check if Wild was knocked down -> Trigger CATCH PHASE!
        if (b.wild.currentHP <= 0) {
            b.wild.currentHP = 0;
            b.inCatchPhase = true;
            b.log.push(`¡El ${b.wild.name} salvaje cayó debilitado!`);
            b.log.push(`¡Está indefenso! ¡Lanza una Poké Ball para capturarlo o déjalo ir!`);
            return {
                success: true,
                inCatchPhase: true,
                battleState: this.getBattleState()
            };
        }

        // 2. Wild Pokemon Counter-Attack!
        this.wildCounterAttack();

        return { success: true, battleState: this.getBattleState() };
    }

    wildCounterAttack() {
        const b = this.activeBattle;
        if (!b || b.isOver || b.inCatchPhase) return;

        const wildMove = b.wild.moves[Math.floor(Math.random() * b.wild.moves.length)] || createMoveInstance('Placaje');
        const mult = getTypeMultiplier(wildMove.type, b.player.type);
        const isCrit = Math.random() < 0.08;
        const critMult = isCrit ? 1.5 : 1.0;

        const baseDmg = Math.round(((2 * b.wild.level / 5 + 2) * wildMove.power * (b.wild.level / b.player.level) / 50) + 2);
        const randomFactor = 0.85 + (Math.random() * 0.15);
        const totalDamage = Math.max(1, Math.round(baseDmg * mult * critMult * randomFactor));

        b.player.currentHP = Math.max(0, b.player.currentHP - totalDamage);

        let effectMsg = '';
        if (mult > 1.0) effectMsg = ' ¡Es súper eficaz!';
        else if (mult < 1.0 && mult > 0) effectMsg = ' No es muy eficaz...';
        else if (mult === 0) effectMsg = ' ¡No surtió efecto!';
        if (isCrit) effectMsg += ' ¡Fue un golpe crítico!';

        b.log.push(`¡El ${b.wild.name} salvaje usó ${wildMove.name}! Recibiste ${totalDamage} de daño.${effectMsg}`);

        if (b.player.currentHP <= 0) {
            b.player.currentHP = 0;
            // Auto-switch to next alive member in the team!
            const nextAlive = (Array.isArray(b.team) ? b.team : []).find((m, idx) => {
                if (!m || m.isEgg || idx === b.player.slotIndex) return false;
                const hp = (m.currentHP !== undefined) ? m.currentHP : Math.round(25 + (m.level || 5) * 6);
                return hp > 0;
            });

            if (nextAlive) {
                const nextIdx = b.team.indexOf(nextAlive);
                b.log.push(`¡${b.player.name} cayó debilitado!`);
                this.switchPlayerBattler(nextAlive, nextIdx);
                b.log.push(`¡Adelante, ${nextAlive.name}!`);
            } else {
                b.isOver = true;
                b.result = 'defeat';
                b.log.push(`¡Todos los Pokémon de tu equipo cayeron debilitados! Fin del combate.`);
            }
        }
    }

    throwPokeball(ballType = 'poke-ball') {
        if (!this.isInBattle()) return { success: false, msg: 'No hay combate activo' };
        const b = this.activeBattle;
        if (!b.inCatchPhase) {
            return { success: false, msg: 'No estás en fase de captura' };
        }

        const normalizedBallType = String(ballType || 'poke-ball').toLowerCase();
        const ballName = normalizedBallType.includes('master') ? 'Master Ball'
            : normalizedBallType.includes('ultra') ? 'Ultra Ball'
            : normalizedBallType.includes('great') || normalizedBallType.includes('super') ? 'Super Ball'
            : 'Poké Ball';

        b.turn++;
        b.log.push(`¡Lanzaste una ${ballName}!`);

        const percentChance = calculateCatchRatePercent(b.wild.id, normalizedBallType);
        const catchChance = percentChance / 100;
        const roll = Math.random();

        if (roll < catchChance) {
            // CAUGHT!
            b.isOver = true;
            b.inCatchPhase = false;
            b.result = 'caught';
            b.capturedPokemon = {
                speciesId: b.wild.id,
                name: b.wild.name,
                level: b.wild.level,
                isShiny: b.wild.isShiny,
                nature: 'Docile',
                moves: b.wild.moves
            };
            const moneyReward = Math.round(b.wild.level * 250000 + 1000000);
            b.moneyReward = moneyReward;
            b.expReward = 0; // Capturing grants shop money, NO exp!
            b.log.push(`¡Gotcha! ¡${b.wild.name} fue capturado exitosamente!`);
            b.log.push(`¡Recompensa de captura: +$${moneyReward.toLocaleString()} Saldo para la Tienda!`);
            return {
                success: true,
                caught: true,
                capturedPokemon: b.capturedPokemon,
                moneyReward,
                expReward: 0,
                battleState: this.getBattleState()
            };
        } else {
            // Escaped from ball!
            b.log.push(`¡Oh no! ¡El ${b.wild.name} se liberó de la ${ballName}!`);
            if (!b.inCatchPhase) {
                this.wildCounterAttack();
            } else {
                b.log.push(`¡Sigue debilitado! Puedes lanzar otra bola o pulsar Dejar ir.`);
            }
            return {
                success: true,
                caught: false,
                battleState: this.getBattleState()
            };
        }
    }

    finishCatchPhase() {
        if (!this.isInBattle()) return { success: false, msg: 'No hay combate activo' };
        const b = this.activeBattle;
        if (!b.inCatchPhase) {
            return { success: false, msg: 'El combate aún no está en fase de captura' };
        }
        b.isOver = true;
        b.inCatchPhase = false;
        b.result = 'victory';
        b.log.push(`¡Dejaste ir a ${b.wild.name}! Combate finalizado con victoria.`);
        b.log.push(`¡Ganaste +${b.expReward.toLocaleString()} Tokens de EXP!`);
        return { success: true, expReward: b.expReward, battleState: this.getBattleState() };
    }

    executeAutoMove() {
        if (!this.isInBattle()) return { success: false, msg: 'No hay combate activo' };
        const b = this.activeBattle;
        if (b.inCatchPhase) {
            // In catch phase, auto move throws default pokeball or leaves
            return { success: false, inCatchPhase: true, msg: 'En fase de captura' };
        }
        let usableMoves = b.player.moves
            .map((m, idx) => ({ m, idx }))
            .filter(item => item.m.currentPP > 0);

        if (usableMoves.length === 0) {
            // Restore PP if depleted so battle never freezes
            b.player.moves.forEach(m => {
                const base = MOVES_CATALOG[m.name] || MOVES_CATALOG['Placaje'];
                m.maxPP = m.maxPP || base.maxPP || 35;
                m.currentPP = m.maxPP;
            });
            usableMoves = b.player.moves.map((m, idx) => ({ m, idx }));
        }

        const chosen = usableMoves.length > 0
            ? usableMoves[Math.floor(Math.random() * usableMoves.length)].idx
            : 0;

        return this.executePlayerMove(chosen);
    }

    usePotion(amount = 30) {
        if (!this.isInBattle()) return { success: false, msg: 'No hay combate activo' };
        const b = this.activeBattle;

        const healed = Math.min(amount, b.player.maxHP - b.player.currentHP);
        b.player.currentHP = Math.min(b.player.maxHP, b.player.currentHP + amount);
        b.turn++;
        b.log.push(`¡Usaste una Poción! ${b.player.name} recuperó ${healed} PS.`);

        // Wild counter attack if not in catch phase
        if (!b.inCatchPhase) {
            this.wildCounterAttack();
        }
        return { success: true, battleState: this.getBattleState() };
    }

    switchPlayerBattler(newMember, newSlotIndex) {
        if (!this.isInBattle()) return { success: false, msg: 'No hay combate activo' };
        if (!newMember || newMember.isEgg) return { success: false, msg: 'No puedes cambiar a un huevo' };

        const b = this.activeBattle;
        const newLevel = Math.max(1, newMember.level || 5);
        const newMaxHP = Math.round(25 + newLevel * 6);
        const newCurrentHP = newMember.currentHP !== undefined ? newMember.currentHP : newMaxHP;

        let moves = Array.isArray(newMember.moves) && newMember.moves.length > 0
            ? newMember.moves
            : [createMoveInstance('Placaje')];

        moves.forEach(m => {
            const base = MOVES_CATALOG[m.name] || MOVES_CATALOG['Placaje'];
            m.maxPP = m.maxPP || base.maxPP || 35;
            if (m.currentPP === undefined || m.currentPP === null || m.currentPP <= 0) {
                m.currentPP = m.maxPP;
            }
        });

        b.player = {
            slotIndex: newSlotIndex,
            name: newMember.name,
            speciesId: newMember.speciesId,
            level: newLevel,
            type: SPECIES_TYPES[newMember.speciesId] || 'Normal',
            maxHP: newMaxHP,
            currentHP: newCurrentHP,
            isShiny: !!newMember.isShiny,
            spriteUrl: newMember.isShiny
                ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${newMember.speciesId}.png`
                : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${newMember.speciesId}.png`,
            moves
        };

        b.log.push(`¡Regresa! ¡Adelante, ${newMember.name}!`);
        if (!b.inCatchPhase) {
            this.wildCounterAttack();
        }

        return { success: true, battleState: this.getBattleState() };
    }

    run() {
        if (!this.isInBattle()) return { success: false, msg: 'No hay combate activo' };
        const b = this.activeBattle;
        b.isOver = true;
        b.inCatchPhase = false;
        b.result = 'escaped';
        b.log.push(`¡Escapaste sano y salvo del combate!`);
        return { success: true, battleState: this.getBattleState() };
    }

    getBattleState() {
        if (!this.activeBattle) return null;
        const wildId = this.activeBattle.wild ? this.activeBattle.wild.id : 4;
        return {
            ...this.activeBattle,
            inCatchPhase: !!this.activeBattle.inCatchPhase,
            catchRates: {
                pokeball: calculateCatchRatePercent(wildId, 'poke-ball'),
                greatball: calculateCatchRatePercent(wildId, 'great-ball'),
                ultraball: calculateCatchRatePercent(wildId, 'ultra-ball'),
                masterball: 100
            },
            recentLog: this.activeBattle.log.slice(-4)
        };
    }
}

module.exports = {
    BattleEngine,
    SPECIES_TYPES,
    WILD_POOL: POKEDEX_ALL,
    POKEDEX_ALL,
    calculateCatchRatePercent,
    promoteWildPokemonByLevel,
    generateWildBattler,
    simulateBackgroundBattle
};

