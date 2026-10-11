const fs = require('fs');
const path = require('path');
const { MOVES_DATABASE, MOVES_CATALOG, getUnlockedMovesForSpecies, createMoveInstance } = require('./moves');
const POKEDEX_ALL = require('./pokedex_all.json');

// Rank & Potential Ladder (Pokemon GO style Essence & IV Rank Progression)
const RANK_LADDER = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
const RANK_COSTS = { 'F': 1, 'E': 2, 'D': 4, 'C': 8, 'B': 15, 'A': 25, 'S': 40, 'SS': 60, 'SSS': null };
const RANK_BONUS = { 'F': 0, 'E': 3, 'D': 6, 'C': 10, 'B': 15, 'A': 22, 'S': 30, 'SS': 40, 'SSS': 50 };

// Official Gen 1-5 Evolution lines with real PokeAPI IDs & branching evolutions
const EVOLUTION_LINES = [
    {
        id: 'charmander',
        name: 'Línea Charmander',
        rarity: 'common',
        stages: [
            { id: 4, name: 'Charmander' },
            { id: 5, name: 'Charmeleon' },
            { id: 6, name: 'Charizard' }
        ]
    },
    {
        id: 'bulbasaur',
        name: 'Línea Bulbasaur',
        rarity: 'common',
        stages: [
            { id: 1, name: 'Bulbasaur' },
            { id: 2, name: 'Ivysaur' },
            { id: 3, name: 'Venusaur' }
        ]
    },
    {
        id: 'squirtle',
        name: 'Línea Squirtle',
        rarity: 'common',
        stages: [
            { id: 7, name: 'Squirtle' },
            { id: 8, name: 'Wartortle' },
            { id: 9, name: 'Blastoise' }
        ]
    },
    {
        id: 'pikachu',
        name: 'Línea Pikachu',
        rarity: 'common',
        stages: [
            { id: 172, name: 'Pichu' },
            { id: 25, name: 'Pikachu' },
            { id: 26, name: 'Raichu' }
        ]
    },
    {
        id: 'gengar',
        name: 'Línea Gengar',
        rarity: 'uncommon',
        stages: [
            { id: 92, name: 'Gastly' },
            { id: 93, name: 'Haunter' },
            { id: 94, name: 'Gengar' }
        ]
    },
    {
        id: 'eevee',
        name: 'Línea Eevee',
        rarity: 'common',
        stages: [
            { id: 133, name: 'Eevee' }
        ],
        branches: [
            { id: 134, name: 'Vaporeon', type: 'Agua' },
            { id: 135, name: 'Jolteon', type: 'Eléctrico' },
            { id: 136, name: 'Flareon', type: 'Fuego' },
            { id: 196, name: 'Espeon', type: 'Psíquico' },
            { id: 197, name: 'Umbreon', type: 'Siniestro' },
            { id: 470, name: 'Leafeon', type: 'Planta' },
            { id: 471, name: 'Glaceon', type: 'Hielo' },
            { id: 700, name: 'Sylveon', type: 'Hada' }
        ]
    },
    {
        id: 'lucario',
        name: 'Línea Lucario',
        rarity: 'uncommon',
        stages: [
            { id: 447, name: 'Riolu' },
            { id: 448, name: 'Lucario' }
        ]
    },
    {
        id: 'dragonite',
        name: 'Línea Dragonite',
        rarity: 'rare',
        stages: [
            { id: 147, name: 'Dratini' },
            { id: 148, name: 'Dragonair' },
            { id: 149, name: 'Dragonite' }
        ]
    },
    {
        id: 'tyranitar',
        name: 'Línea Tyranitar',
        rarity: 'rare',
        stages: [
            { id: 246, name: 'Larvitar' },
            { id: 247, name: 'Pupitar' },
            { id: 248, name: 'Tyranitar' }
        ]
    },
    {
        id: 'gardevoir',
        name: 'Línea Gardevoir & Gallade',
        rarity: 'uncommon',
        stages: [
            { id: 280, name: 'Ralts' },
            { id: 281, name: 'Kirlia' }
        ],
        branches: [
            { id: 282, name: 'Gardevoir', type: 'Psíquico/Hada' },
            { id: 475, name: 'Gallade', type: 'Lucha/Psíquico' }
        ]
    },
    {
        id: 'garchomp',
        name: 'Línea Garchomp',
        rarity: 'rare',
        stages: [
            { id: 443, name: 'Gible' },
            { id: 444, name: 'Gabite' },
            { id: 445, name: 'Garchomp' }
        ]
    },
    {
        id: 'cyndaquil',
        name: 'Línea Cyndaquil',
        rarity: 'common',
        stages: [
            { id: 155, name: 'Cyndaquil' },
            { id: 156, name: 'Quilava' },
            { id: 157, name: 'Typhlosion' }
        ]
    },
    {
        id: 'torchic',
        name: 'Línea Torchic',
        rarity: 'common',
        stages: [
            { id: 255, name: 'Torchic' },
            { id: 256, name: 'Combusken' },
            { id: 257, name: 'Blaziken' }
        ]
    },
    {
        id: 'mudkip',
        name: 'Línea Mudkip',
        rarity: 'common',
        stages: [
            { id: 258, name: 'Mudkip' },
            { id: 259, name: 'Marshtomp' },
            { id: 260, name: 'Swampert' }
        ]
    },
    {
        id: 'mewtwo',
        name: 'Mewtwo',
        rarity: 'legendary',
        stages: [
            { id: 150, name: 'Mewtwo' }
        ]
    }
];

const NATURES = [
    'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
    'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
    'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
    'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
    'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'
];

// Difficulty thresholds
const DIFFICULTY_SETTINGS = {
    fast: {
        eggHatchThreshold: 500000, // 500k tokens
        graduationTotals: {
            common:    50000000,   // 50M
            uncommon:  100000000,  // 100M
            rare:      200000000,  // 200M
            legendary: 400000000   // 400M
        }
    },
    standard: {
        eggHatchThreshold: 5000000, // 5M tokens
        graduationTotals: {
            common:    750000000,   // 750M
            uncommon:  1875000000,  // 1.875B
            rare:      3000000000,  // 3.0B
            legendary: 6000000000   // 6.0B
        }
    }
};

// Official Evolution Level Targets
const EVOLUTION_TARGETS = {
    // Kanto Starters
    1: { nextLevel: 16, nextName: 'Ivysaur', nextId: 2 },
    2: { nextLevel: 32, nextName: 'Venusaur', nextId: 3 },
    3: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    4: { nextLevel: 16, nextName: 'Charmeleon', nextId: 5 },
    5: { nextLevel: 36, nextName: 'Charizard', nextId: 6 },
    6: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    7: { nextLevel: 16, nextName: 'Wartortle', nextId: 8 },
    8: { nextLevel: 36, nextName: 'Blastoise', nextId: 9 },
    9: { nextLevel: null, nextName: 'Forma Final', nextId: null },

    // Pikachu line
    172: { nextLevel: 15, nextName: 'Pikachu', nextId: 25 },
    25:  { nextLevel: 30, nextName: 'Raichu', nextId: 26 },
    26:  { nextLevel: null, nextName: 'Forma Final', nextId: null },

    // Gengar line
    92: { nextLevel: 25, nextName: 'Haunter', nextId: 93 },
    93: { nextLevel: 36, nextName: 'Gengar', nextId: 94 },
    94: { nextLevel: null, nextName: 'Forma Final', nextId: null },

    // Eevee line
    133: { nextLevel: 25, nextName: 'Múltiples Evoluciones', nextId: null, isBranch: true },
    134: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    135: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    136: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    196: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    197: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    470: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    471: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    700: { nextLevel: null, nextName: 'Forma Final', nextId: null },

    // Lucario line
    447: { nextLevel: 25, nextName: 'Lucario', nextId: 448 },
    448: { nextLevel: null, nextName: 'Forma Final', nextId: null },

    // Dragonite line
    147: { nextLevel: 30, nextName: 'Dragonair', nextId: 148 },
    148: { nextLevel: 55, nextName: 'Dragonite', nextId: 149 },
    149: { nextLevel: null, nextName: 'Forma Final', nextId: null },

    // Tyranitar line
    246: { nextLevel: 30, nextName: 'Pupitar', nextId: 247 },
    247: { nextLevel: 55, nextName: 'Tyranitar', nextId: 248 },
    248: { nextLevel: null, nextName: 'Forma Final', nextId: null },

    // Gardevoir & Gallade line
    280: { nextLevel: 20, nextName: 'Kirlia', nextId: 281 },
    281: { nextLevel: 30, nextName: 'Gardevoir o Gallade', nextId: null, isBranch: true },
    282: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    475: { nextLevel: null, nextName: 'Forma Final', nextId: null },

    // Garchomp line
    443: { nextLevel: 24, nextName: 'Gabite', nextId: 444 },
    444: { nextLevel: 48, nextName: 'Garchomp', nextId: 445 },
    445: { nextLevel: null, nextName: 'Forma Final', nextId: null },

    // Johto Starters - Cyndaquil
    155: { nextLevel: 14, nextName: 'Quilava', nextId: 156 },
    156: { nextLevel: 36, nextName: 'Typhlosion', nextId: 157 },
    157: { nextLevel: null, nextName: 'Forma Final', nextId: null },

    // Hoenn Starters - Torchic & Mudkip
    255: { nextLevel: 16, nextName: 'Combusken', nextId: 256 },
    256: { nextLevel: 36, nextName: 'Blaziken', nextId: 257 },
    257: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    258: { nextLevel: 16, nextName: 'Marshtomp', nextId: 259 },
    259: { nextLevel: 36, nextName: 'Swampert', nextId: 260 },
    260: { nextLevel: null, nextName: 'Forma Final', nextId: null },

    // Legendary
    150: { nextLevel: null, nextName: 'Forma Única', nextId: null },

    // Gen 1 Classics & Popular Evolutions (Slowpoke, Caterpie, Pidgey, etc.)
    10:  { nextLevel: 7,   nextName: 'Metapod',    nextId: 11 },
    11:  { nextLevel: 10,  nextName: 'Butterfree', nextId: 12 },
    12:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    13:  { nextLevel: 7,   nextName: 'Kakuna',     nextId: 14 },
    14:  { nextLevel: 10,  nextName: 'Beedrill',   nextId: 15 },
    15:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    16:  { nextLevel: 18,  nextName: 'Pidgeotto',  nextId: 17 },
    17:  { nextLevel: 36,  nextName: 'Pidgeot',    nextId: 18 },
    18:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    19:  { nextLevel: 20,  nextName: 'Raticate',   nextId: 20 },
    20:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    21:  { nextLevel: 20,  nextName: 'Fearow',     nextId: 22 },
    22:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    23:  { nextLevel: 22,  nextName: 'Arbok',      nextId: 24 },
    24:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    27:  { nextLevel: 22,  nextName: 'Sandslash',  nextId: 28 },
    28:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    29:  { nextLevel: 16,  nextName: 'Nidorina',   nextId: 30 },
    30:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    31:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    32:  { nextLevel: 16,  nextName: 'Nidorino',   nextId: 33 },
    33:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    34:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    41:  { nextLevel: 22,  nextName: 'Golbat',     nextId: 42 },
    42:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    43:  { nextLevel: 21,  nextName: 'Gloom',      nextId: 44 },
    44:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    46:  { nextLevel: 24,  nextName: 'Parasect',   nextId: 47 },
    47:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    48:  { nextLevel: 31,  nextName: 'Venomoth',   nextId: 49 },
    49:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    50:  { nextLevel: 26,  nextName: 'Dugtrio',    nextId: 51 },
    51:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    52:  { nextLevel: 28,  nextName: 'Persian',    nextId: 53 },
    53:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    54:  { nextLevel: 33,  nextName: 'Golduck',    nextId: 55 },
    55:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    56:  { nextLevel: 28,  nextName: 'Primeape',   nextId: 57 },
    57:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    60:  { nextLevel: 25,  nextName: 'Poliwhirl',  nextId: 61 },
    61:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    63:  { nextLevel: 16,  nextName: 'Kadabra',    nextId: 64 },
    64:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    66:  { nextLevel: 28,  nextName: 'Machoke',    nextId: 67 },
    67:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    69:  { nextLevel: 21,  nextName: 'Weepinbell', nextId: 70 },
    70:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    72:  { nextLevel: 30,  nextName: 'Tentacruel', nextId: 73 },
    73:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    74:  { nextLevel: 25,  nextName: 'Graveler',   nextId: 75 },
    75:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    77:  { nextLevel: 40,  nextName: 'Rapidash',   nextId: 78 },
    78:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    79:  { nextLevel: 37,  nextName: 'Slowbro',    nextId: 80 },
    80:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    81:  { nextLevel: 30,  nextName: 'Magneton',   nextId: 82 },
    82:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    84:  { nextLevel: 31,  nextName: 'Dodrio',     nextId: 85 },
    85:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    86:  { nextLevel: 34,  nextName: 'Dewgong',    nextId: 87 },
    87:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    88:  { nextLevel: 38,  nextName: 'Muk',        nextId: 89 },
    89:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    96:  { nextLevel: 26,  nextName: 'Hypno',      nextId: 97 },
    97:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    98:  { nextLevel: 28,  nextName: 'Kingler',    nextId: 99 },
    99:  { nextLevel: null, nextName: 'Forma Final', nextId: null },
    100: { nextLevel: 30,  nextName: 'Electrode',  nextId: 101 },
    101: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    104: { nextLevel: 28,  nextName: 'Marowak',    nextId: 105 },
    105: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    109: { nextLevel: 35,  nextName: 'Weezing',    nextId: 110 },
    110: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    111: { nextLevel: 42,  nextName: 'Rhydon',     nextId: 112 },
    112: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    116: { nextLevel: 32,  nextName: 'Seadra',     nextId: 117 },
    117: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    118: { nextLevel: 33,  nextName: 'Seaking',    nextId: 119 },
    119: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    129: { nextLevel: 20,  nextName: 'Gyarados',   nextId: 130 },
    130: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    138: { nextLevel: 40,  nextName: 'Omastar',    nextId: 139 },
    139: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    140: { nextLevel: 40,  nextName: 'Kabutops',   nextId: 141 },
    141: { nextLevel: null, nextName: 'Forma Final', nextId: null },

    // Gen 2-9 Popular
    161: { nextLevel: 15,  nextName: 'Furret',     nextId: 162 },
    162: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    163: { nextLevel: 20,  nextName: 'Noctowl',    nextId: 164 },
    164: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    179: { nextLevel: 15,  nextName: 'Flaaffy',    nextId: 180 },
    180: { nextLevel: 30,  nextName: 'Ampharos',   nextId: 181 },
    181: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    183: { nextLevel: 18,  nextName: 'Azumarill',  nextId: 184 },
    184: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    194: { nextLevel: 20,  nextName: 'Quagsire',   nextId: 195 },
    195: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    261: { nextLevel: 18,  nextName: 'Mightyena',  nextId: 262 },
    262: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    263: { nextLevel: 20,  nextName: 'Linoone',    nextId: 264 },
    264: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    276: { nextLevel: 22,  nextName: 'Swellow',    nextId: 277 },
    277: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    285: { nextLevel: 23,  nextName: 'Breloom',    nextId: 286 },
    286: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    304: { nextLevel: 32,  nextName: 'Lairon',     nextId: 305 },
    305: { nextLevel: 42,  nextName: 'Aggron',     nextId: 306 },
    306: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    328: { nextLevel: 35,  nextName: 'Vibrava',    nextId: 329 },
    329: { nextLevel: 45,  nextName: 'Flygon',     nextId: 330 },
    330: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    333: { nextLevel: 35,  nextName: 'Altaria',    nextId: 334 },
    334: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    371: { nextLevel: 30,  nextName: 'Shelgon',    nextId: 372 },
    372: { nextLevel: 50,  nextName: 'Salamence',  nextId: 373 },
    373: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    374: { nextLevel: 20,  nextName: 'Metang',     nextId: 375 },
    375: { nextLevel: 45,  nextName: 'Metagross',  nextId: 376 },
    376: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    396: { nextLevel: 14,  nextName: 'Staravia',   nextId: 397 },
    397: { nextLevel: 34,  nextName: 'Staraptor',  nextId: 398 },
    398: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    403: { nextLevel: 15,  nextName: 'Luxio',      nextId: 404 },
    404: { nextLevel: 30,  nextName: 'Luxray',     nextId: 405 },
    405: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    495: { nextLevel: 17,  nextName: 'Servine',    nextId: 496 },
    496: { nextLevel: 36,  nextName: 'Serperior',  nextId: 497 },
    497: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    498: { nextLevel: 17,  nextName: 'Pignite',    nextId: 499 },
    499: { nextLevel: 36,  nextName: 'Emboar',     nextId: 500 },
    500: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    501: { nextLevel: 17,  nextName: 'Dewott',     nextId: 502 },
    502: { nextLevel: 36,  nextName: 'Samurott',   nextId: 503 },
    503: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    633: { nextLevel: 50,  nextName: 'Zweilous',   nextId: 634 },
    634: { nextLevel: 64,  nextName: 'Hydreigon',  nextId: 635 },
    635: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    656: { nextLevel: 16,  nextName: 'Frogadier',  nextId: 657 },
    657: { nextLevel: 36,  nextName: 'Greninja',   nextId: 658 },
    658: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    704: { nextLevel: 40,  nextName: 'Sliggoo',    nextId: 705 },
    705: { nextLevel: 50,  nextName: 'Goodra',     nextId: 706 },
    706: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    722: { nextLevel: 17,  nextName: 'Dartrix',    nextId: 723 },
    723: { nextLevel: 34,  nextName: 'Decidueye',  nextId: 724 },
    724: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    725: { nextLevel: 17,  nextName: 'Torracat',   nextId: 726 },
    726: { nextLevel: 34,  nextName: 'Incineroar', nextId: 727 },
    727: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    728: { nextLevel: 17,  nextName: 'Brionne',    nextId: 729 },
    729: { nextLevel: 34,  nextName: 'Primarina',  nextId: 730 },
    730: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    885: { nextLevel: 50,  nextName: 'Drakloak',   nextId: 886 },
    886: { nextLevel: 60,  nextName: 'Dragapult',  nextId: 887 },
    887: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    906: { nextLevel: 16,  nextName: 'Floragato',  nextId: 907 },
    907: { nextLevel: 36,  nextName: 'Meowscarada', nextId: 908 },
    908: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    909: { nextLevel: 16,  nextName: 'Crocalor',   nextId: 910 },
    910: { nextLevel: 36,  nextName: 'Skeledirge', nextId: 911 },
    911: { nextLevel: null, nextName: 'Forma Final', nextId: null },
    912: { nextLevel: 16,  nextName: 'Quaxwell',   nextId: 913 },
    913: { nextLevel: 36,  nextName: 'Quaquaval',  nextId: 914 },
    914: { nextLevel: null, nextName: 'Forma Final', nextId: null }
};

function getEvolutionTarget(speciesId, stageIndex = 0, line = null) {
    if (speciesId && EVOLUTION_TARGETS[speciesId]) {
        return EVOLUTION_TARGETS[speciesId];
    }
    if (line && Array.isArray(line.stages)) {
        if (stageIndex < line.stages.length - 1) {
            const nextStage = line.stages[stageIndex + 1];
            const defLvl = stageIndex === 0 ? 16 : 36;
            return { nextLevel: defLvl, nextName: nextStage.name, nextId: nextStage.id, isBranch: false };
        }
    }
    return { nextLevel: null, nextName: 'Forma Final', nextId: null, isBranch: false };
}

// EXP formula for levels 1 to 100: determines EXP needed to reach next level
function getExpForLevel(level) {
    if (!level || level >= 100) return 0;
    return Math.round(50 * Math.pow(level, 1.6) + 100);
}

function addExpToMember(member, expGain, companionRef, slotIndex) {
    if (!member || member.isEgg || !expGain || expGain <= 0) return null;
    let eventOccurred = null;
    let remainingGain = expGain;
    const line = (member.lineIndex !== undefined && member.lineIndex >= 0 && EVOLUTION_LINES[member.lineIndex])
        ? EVOLUTION_LINES[member.lineIndex]
        : null;

    member.level = Math.max(1, Math.min(100, member.level || 1));
    member.exp = member.exp || 0;

    while (remainingGain > 0 && member.level < 100) {
        const needed = getExpForLevel(member.level) - member.exp;
        if (remainingGain >= needed) {
            remainingGain -= needed;
            member.level++;
            member.exp = 0;
            member.maxHP = Math.round(25 + member.level * 6);
            if (companionRef) companionRef.checkMoveLearn(slotIndex, member, member.level);

            const evo = getEvolutionTarget(member.speciesId, member.stageIndex, line);
            if (evo && evo.nextLevel && member.level >= evo.nextLevel) {
                if (evo.isBranch && line && line.branches) {
                    if (companionRef) {
                        companionRef.state.pendingBranchEvolution = {
                            slotIndex,
                            pokemonName: member.name,
                            lineIndex: member.lineIndex,
                            branches: line.branches.map(b => ({
                                id: b.id,
                                name: b.name,
                                type: b.type,
                                spriteUrl: member.isShiny
                                    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${b.id}.png`
                                    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${b.id}.png`
                            }))
                        };
                        companionRef.state.celebration = 'branch_ready';
                    }
                    eventOccurred = 'branch_ready';
                } else if (line && Array.isArray(line.stages) && member.stageIndex < line.stages.length - 1) {
                    member.stageIndex++;
                    const nextStage = line.stages[member.stageIndex];
                    member.name = nextStage.name;
                    member.speciesId = nextStage.id;
                    ensureMemberMoves(member, member.level);
                    if (companionRef) {
                        companionRef.registerToDex(nextStage, line, member.isShiny, member.nature);
                        companionRef.state.celebration = 'evolve';
                    }
                    eventOccurred = 'evolve';
                } else if (evo.nextId && evo.nextName) {
                    // Canon evolution for Pokédex species outside starter lines (e.g. Slowpoke -> Slowbro Nv. 37)
                    member.speciesId = evo.nextId;
                    member.name = evo.nextName;
                    ensureMemberMoves(member, member.level);
                    if (companionRef) {
                        companionRef.registerToDex({ id: evo.nextId, name: evo.nextName }, null, member.isShiny, member.nature);
                        companionRef.state.celebration = 'evolve';
                    }
                    eventOccurred = 'evolve';
                } else {
                    if (companionRef) {
                        const finalStage = resolveStage(line, member);
                        companionRef.registerToDex(finalStage, line, member.isShiny, member.nature);
                    }
                }
            } else if (member.level >= 100) {
                if (companionRef) {
                    const finalStage = resolveStage(line, member);
                    companionRef.registerToDex(finalStage, line, member.isShiny, member.nature);
                    companionRef.recordLevel100Mastery(member);
                    companionRef.state.celebration = 'max_level';
                }
                eventOccurred = 'max_level';
            }
        } else {
            member.exp += remainingGain;
            remainingGain = 0;
        }
    }
    return eventOccurred;
}

function getStageLevelBounds(speciesId, stageIndex, line) {
    const evo = getEvolutionTarget(speciesId, stageIndex, line);
    let startLevel = 1;
    if (stageIndex > 0 && line && Array.isArray(line.stages) && line.stages[stageIndex - 1]) {
        const prevId = line.stages[stageIndex - 1].id;
        const prevEvo = EVOLUTION_TARGETS[prevId];
        if (prevEvo && prevEvo.nextLevel) {
            startLevel = prevEvo.nextLevel;
        } else {
            startLevel = stageIndex * 30;
        }
    }
    const targetLevel = evo.nextLevel || 100;
    return {
        startLevel,
        targetLevel,
        nextName: evo.nextName,
        nextLevel: evo.nextLevel,
        isBranch: !!evo.isBranch
    };
}

function calculatePhaseThreshold(rarity, totalForms, stageIndex, difficultyMode = 'fast') {
    const k = Math.max(1, totalForms);
    const i = stageIndex + 1;
    const settings = DIFFICULTY_SETTINGS[difficultyMode] || DIFFICULTY_SETTINGS.fast;
    const total = settings.graduationTotals[rarity] || settings.graduationTotals.common;
    const denom = (k * (k + 1)) / 2.0;
    return Math.round((total * i) / denom);
}

// Helper to resolve stage object even for branch-evolved Pokemon
function resolveStage(line, member) {
    if (!line) {
        if (member && member.speciesId) {
            return { id: member.speciesId, name: member.name || 'Pokémon' };
        }
        return { id: 1, name: 'Pokémon' };
    }
    if (member && member.speciesId) {
        const found = line.stages.find(s => s.id === member.speciesId);
        if (found) return found;
        if (line.branches) {
            const foundBranch = line.branches.find(b => b.id === member.speciesId);
            if (foundBranch) return foundBranch;
        }
    }
    return line.stages[member.stageIndex] || line.stages[0];
}

// Helper to ensure member has active and learned moves without duplicates
function ensureMemberMoves(member, level = 5) {
    if (!member || member.isEgg) return;
    if (!Array.isArray(member.learnedMoves)) {
        member.learnedMoves = [];
    }
    const unlocked = getUnlockedMovesForSpecies(member.speciesId, level);
    unlocked.forEach(mv => {
        if (!member.learnedMoves.includes(mv)) {
            member.learnedMoves.push(mv);
        }
    });

    if (!Array.isArray(member.moves) || member.moves.length === 0) {
        const unique = Array.from(new Set(member.learnedMoves)).slice(-4);
        member.moves = unique.map(m => createMoveInstance(m));
        if (member.moves.length === 0) {
            member.moves = [createMoveInstance('Placaje')];
        }
    } else {
        const seen = new Set();
        const deduped = [];
        member.moves.forEach(m => {
            if (m && m.name && !seen.has(m.name)) {
                seen.add(m.name);
                const base = MOVES_CATALOG[m.name] || MOVES_CATALOG['Placaje'];
                m.type = m.type || base.type;
                m.power = m.power !== undefined ? m.power : base.power;
                m.maxPP = m.maxPP || base.maxPP || 35;
                if (m.currentPP === undefined || m.currentPP === null || m.currentPP <= 0) {
                    m.currentPP = m.maxPP;
                }
                deduped.push(m);
            }
        });
        if (deduped.length < 4) {
            for (const lm of member.learnedMoves) {
                if (deduped.length >= 4) break;
                if (!seen.has(lm)) {
                    seen.add(lm);
                    deduped.push(createMoveInstance(lm));
                }
            }
        }
        member.moves = deduped.length > 0 ? deduped : [createMoveInstance('Placaje')];
    }
}

function sanitizeMember(m) {
    if (!m || m.isEgg) return;
    
    // Check if member belongs to an official starter line in EVOLUTION_LINES
    let line = (m.lineIndex !== undefined && m.lineIndex >= 0 && EVOLUTION_LINES[m.lineIndex]) ? EVOLUTION_LINES[m.lineIndex] : null;
    if (!line || !line.stages.some(s => s.id === m.speciesId)) {
        line = EVOLUTION_LINES.find(l => l.stages.some(s => s.id === m.speciesId));
        if (line) {
            m.lineIndex = EVOLUTION_LINES.indexOf(line);
        } else {
            // Species is from the wider 1,025 Pokédex outside the 11 starter lines!
            m.lineIndex = -1;
            if (!m.name || m.name === 'Pokémon') {
                const foundDex = POKEDEX_ALL.find(p => p.id === m.speciesId);
                if (foundDex) m.name = foundDex.name;
            }
        }
    }

    const lvl = Math.max(1, m.level || 1);
    m.level = lvl;

    // Only apply starter evolution targets if this member actually belongs to a starter line!
    if (line && Array.isArray(line.stages)) {
        const currentStageIndex = line.stages.findIndex(s => s.id === m.speciesId);
        let targetStageIndex = Math.max(m.stageIndex !== undefined ? m.stageIndex : 0, currentStageIndex >= 0 ? currentStageIndex : 0);
        for (let sIdx = targetStageIndex; sIdx < line.stages.length; sIdx++) {
            const stageInfo = line.stages[sIdx];
            const evo = EVOLUTION_TARGETS[stageInfo.id];
            if (evo && evo.nextLevel && lvl >= evo.nextLevel) {
                if (sIdx + 1 < line.stages.length) {
                    targetStageIndex = Math.max(targetStageIndex, sIdx + 1);
                }
            }
        }

        if (targetStageIndex !== m.stageIndex && line.stages[targetStageIndex]) {
            m.stageIndex = targetStageIndex;
            m.speciesId = line.stages[targetStageIndex].id;
            m.name = line.stages[targetStageIndex].name;
        }
    }

    ensureMemberMoves(m, m.level);
}

class CompanionManager {
    constructor(stateDir) {
        let baseDir = stateDir;
        if (!baseDir) {
            try {
                const { app } = require('electron');
                baseDir = (app && typeof app.getPath === 'function') ? app.getPath('userData') : path.join(__dirname, '..');
            } catch (e) {
                baseDir = path.join(__dirname, '..');
            }
        }
        this.stateFile = path.join(baseDir, 'companion-state.json');
        this.state = this.loadState();
        this.deduplicateBox();
        this.syncDexFromTeam();
    }

    recordLevel100Mastery(member) {
        if (!member || member.isEgg || (member.level || 1) < 100) return;
        if (!this.state.mastery) this.state.mastery = {};
        const spId = member.speciesId;
        if (!spId) return;

        // If this specimen has not been registered as mastered yet:
        if (!member.masteryCounted) {
            member.masteryCounted = true;
            this.state.mastery[spId] = (this.state.mastery[spId] || 0) + 1;
            this.saveState();
        }
    }

    syncDexFromTeam() {
        if (!Array.isArray(this.state.dex)) this.state.dex = [];
        let modified = false;

        const allMembers = [
            ...(Array.isArray(this.state.team) ? this.state.team : []),
            ...(Array.isArray(this.state.box) ? this.state.box : [])
        ];

        allMembers.forEach(member => {
            if (member && !member.isEgg) {
                const line = (member.lineIndex !== undefined && member.lineIndex >= 0 && EVOLUTION_LINES[member.lineIndex])
                    ? EVOLUTION_LINES[member.lineIndex]
                    : null;
                const stage = resolveStage(line, member);
                const exists = this.state.dex.some(d => d.dexNumber === stage.id);
                if (!exists) {
                    this.state.dex.push({
                        dexNumber: stage.id,
                        name: stage.name,
                        lineName: line ? line.name : 'Pokémon',
                        rarity: line ? line.rarity : 'common',
                        isShiny: !!member.isShiny,
                        nature: member.nature || 'Hardy',
                        registeredAt: new Date().toISOString()
                    });
                    modified = true;
                }
            }
        });

        if (modified) {
            this.saveState();
        }
    }

    loadState() {
        try {
            if (fs.existsSync(this.stateFile)) {
                const loaded = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
                if (loaded && typeof loaded === 'object' && Array.isArray(loaded.team)) {
                    if (!Array.isArray(loaded.eggBag)) loaded.eggBag = [];
                    if (!Array.isArray(loaded.dex)) loaded.dex = [];
                    if (!Array.isArray(loaded.box)) loaded.box = [];
                    if (!loaded.inventory) loaded.inventory = {};
                    if (loaded.inventory.greatballs === undefined) loaded.inventory.greatballs = 0;
                    if (loaded.inventory.ultraballs === undefined) loaded.inventory.ultraballs = 0;
                    if (loaded.inventory.masterballs === undefined) loaded.inventory.masterballs = 0;
                    if (!loaded.settings) loaded.settings = {};
                    if (loaded.settings.encountersEnabled === undefined) loaded.settings.encountersEnabled = true;
                    if (loaded.settings.autoBattle === undefined) loaded.settings.autoBattle = false;
                    if (loaded.settings.battleSpeed === undefined) loaded.settings.battleSpeed = 1;
                    if (loaded.settings.skipVsDialog === undefined) loaded.settings.skipVsDialog = false;
                    if (loaded.settings.useSpecialBalls === undefined) loaded.settings.useSpecialBalls = false;
                    if (loaded.settings.soundEnabled === undefined) loaded.settings.soundEnabled = true;
                    if (!loaded.mastery || typeof loaded.mastery !== 'object') loaded.mastery = {};

                    // Never allow a blocking modal to hijack the startup card
                    loaded.pendingMoveLearn = null;

                    // Sanitize team & box members
                    loaded.team.forEach(m => sanitizeMember(m));
                    loaded.box.forEach(m => sanitizeMember(m));

                    return loaded;
                }
            }
        } catch (e) {
            console.error('[LOAD_STATE_EXCEPTION]:', e);
        }

        return this.createInitialState();
    }

    createInitialState() {
        return {
            baselineTokens: null,
            lastSeenTotalTokens: 0,
            spentTokens: 0,
            bonusMoney: 0,
            difficulty: 'fast',
            leadIndex: 0,
            team: [
                {
                    isEgg: true,
                    eggUsage: 0,
                    eggTier: 'common',
                    lineIndex: -1,
                    stageIndex: 0,
                    usedAtStage: 0,
                    isShiny: false,
                    nature: 'Docile',
                    name: 'Huevo Pokémon (Misterioso)'
                }
            ],
            eggBag: [],
            box: [], // Persistent PC Box Storage!
            mastery: {}, // Track Level 100 Mastery stars per speciesId
            inventory: {
                rareCandy: 3,
                mint: 2,
                shinyCharm: false,
                pokeballs: 10,
                greatballs: 0,
                ultraballs: 0,
                masterballs: 0,
                potions: 3
            },
            settings: {
                encountersEnabled: true,
                autoBattle: false,
                battleSpeed: 1,
                skipVsDialog: false,
                useSpecialBalls: false,
                soundEnabled: true
            },
            dex: [],
            pendingBranchEvolution: null,
            pendingMoveLearn: null,
            celebration: null
        };
    }

    saveState() {
        try {
            fs.mkdirSync(path.dirname(this.stateFile), { recursive: true });
            fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2), 'utf8');
        } catch (e) {}
    }

    setLead(index) {
        if (index >= 0 && index < this.state.team.length) {
            this.state.leadIndex = index;
            this.saveState();
            return true;
        }
        return false;
    }

    setDifficulty(mode) {
        if (DIFFICULTY_SETTINGS[mode]) {
            this.state.difficulty = mode;
            this.saveState();
        }
    }

    registerToDex(stage, line, isShiny = false, nature = 'Hardy') {
        if (!Array.isArray(this.state.dex)) this.state.dex = [];
        const existing = this.state.dex.find(d => d.dexNumber === stage.id);
        if (existing) {
            if (isShiny && !existing.isShiny) {
                existing.isShiny = true;
                this.saveState();
            }
            return;
        }

        this.state.dex.push({
            dexNumber: stage.id,
            name: stage.name,
            lineName: line ? line.name : 'Pokémon',
            rarity: line ? line.rarity : 'common',
            isShiny: !!isShiny,
            nature: nature || 'Hardy',
            registeredAt: new Date().toISOString()
        });
        this.saveState();
    }

    // Token tick: EXP Share across team (100% Leader/Eggs, 50% Teammates)
    updateWithTokens(todayTokens, totalTokens) {
        if (this.state.baselineTokens === null) {
            this.state.baselineTokens = totalTokens;
            this.state.lastSeenTotalTokens = totalTokens;
            this.saveState();
        }

        // Auto-resync if scanner tokens are lower than last seen (heals token freeze)
        if (this.state.lastSeenTotalTokens !== null && totalTokens < this.state.lastSeenTotalTokens) {
            this.state.lastSeenTotalTokens = totalTokens;
        }

        let delta = 0;
        if (totalTokens > this.state.lastSeenTotalTokens) {
            delta = totalTokens - this.state.lastSeenTotalTokens;
            this.state.lastSeenTotalTokens = totalTokens;
        }

        let eventOccurred = null;
        const currentDiff = this.state.difficulty || 'fast';
        const hatchThreshold = DIFFICULTY_SETTINGS[currentDiff].eggHatchThreshold;

        if (this.state.leadIndex >= this.state.team.length) {
            this.state.leadIndex = 0;
        }

        if (delta > 0) {
            const tokenExpGain = Math.max(1, Math.round(delta / (currentDiff === 'fast' ? 150 : 1000)));
            for (let i = 0; i < this.state.team.length; i++) {
                const member = this.state.team[i];
                if (!member) continue;

                const isLead = (i === this.state.leadIndex);

                if (member.isEgg) {
                    member.eggUsage = (member.eggUsage || 0) + delta;
                    if (member.eggUsage >= hatchThreshold) {
                        this.hatchSlot(i);
                        eventOccurred = 'hatch';
                    }
                } else {
                    const gain = isLead ? tokenExpGain : Math.round(tokenExpGain * 0.5);
                    const ev = addExpToMember(member, gain, this, i);
                    if (ev && !eventOccurred) eventOccurred = ev;
                }
            }
        }

        this.saveState();
        return this.getPublicView(todayTokens, totalTokens, eventOccurred);
    }

    // Direct battle EXP award: Does NOT inflate token scanning baseline or lastSeenTotalTokens!
    awardBattleExp(expAmount, winningSlotIndex = null) {
        if (!expAmount || expAmount <= 0) return null;
        const targetLead = (winningSlotIndex !== null && winningSlotIndex !== undefined) ? winningSlotIndex : this.state.leadIndex;
        let eventOccurred = null;

        for (let i = 0; i < this.state.team.length; i++) {
            const member = this.state.team[i];
            if (!member || member.isEgg) continue;

            const isWinner = (i === targetLead);
            const expGain = isWinner ? expAmount : Math.round(expAmount * 0.5);
            const ev = addExpToMember(member, expGain, this, i);
            if (ev && !eventOccurred) eventOccurred = ev;
        }

        this.saveState();
        return eventOccurred;
    }

    // Passive EXP awarded while walking on desktop (+25 XP per cycle, egg incubation, 50% EXP share)
    awardWalkerExp(expAmount = 25) {
        if (!expAmount || expAmount <= 0) return null;
        let eventOccurred = null;
        const currentDiff = this.state.difficulty || 'fast';
        const hatchThreshold = DIFFICULTY_SETTINGS[currentDiff].eggHatchThreshold;

        for (let i = 0; i < this.state.team.length; i++) {
            const member = this.state.team[i];
            if (!member) continue;

            const isLead = (i === this.state.leadIndex);

            if (member.isEgg) {
                member.eggUsage = (member.eggUsage || 0) + expAmount;
                if (member.eggUsage >= hatchThreshold) {
                    this.hatchSlot(i);
                    eventOccurred = 'hatch';
                }
            } else {
                const expGain = isLead ? expAmount : Math.round(expAmount * 0.5);
                const ev = addExpToMember(member, expGain, this, i);
                if (ev && !eventOccurred) eventOccurred = ev;
            }
        }

        this.saveState();
        return eventOccurred;
    }

    // Item Pickup mechanic while walking: Pokémon discovers items on your desktop!
    checkWalkerPickup() {
        if (!this.state.inventory) this.state.inventory = {};

        const roll = Math.random();
        let result = null;

        if (roll < 0.28) {
            // Potion (28%)
            this.state.inventory.potions = (this.state.inventory.potions || 0) + 1;
            result = { item: 'Poción', icon: '🧪', count: 1, desc: '+30 PS en combate' };
        } else if (roll < 0.52) {
            // Poké Ball (24%)
            this.state.inventory.pokeballs = (this.state.inventory.pokeballs || 0) + 1;
            result = { item: 'Poké Ball', icon: '🔴', count: 1, desc: 'Captura básica' };
        } else if (roll < 0.67) {
            // Super Ball (15%)
            this.state.inventory.greatballs = (this.state.inventory.greatballs || 0) + 1;
            result = { item: 'Super Ball', icon: '🔵', count: 1, desc: '+45% éxito de captura' };
        } else if (roll < 0.77) {
            // Pepita de Oro (10% - Bonus de Saldo de Tienda)
            const bonus = 25000000;
            this.state.spentTokens = Math.max(0, (this.state.spentTokens || 0) - bonus);
            result = { item: 'Pepita de Oro', icon: '🪙', count: 1, desc: '+25M Saldo en Tienda' };
        } else if (roll < 0.86) {
            // Ultra Ball (9%)
            this.state.inventory.ultraballs = (this.state.inventory.ultraballs || 0) + 1;
            result = { item: 'Ultra Ball', icon: '🟡', count: 1, desc: '+115% éxito de captura' };
        } else if (roll < 0.92) {
            // Caramelo Raro (6%)
            this.state.inventory.rareCandy = (this.state.inventory.rareCandy || 0) + 1;
            result = { item: 'Caramelo Raro', icon: '🍬', count: 1, desc: '+100M XP instantánea' };
        } else if (roll < 0.97) {
            // Menta (5%)
            this.state.inventory.mint = (this.state.inventory.mint || 0) + 1;
            result = { item: 'Menta', icon: '🍃', count: 1, desc: 'Cambia rasgo de naturaleza' };
        } else if (roll < 0.995 && this.state.team.length < 6) {
            // Huevo Misterioso (2.5%)
            this.addNewMember('uncommon');
            result = { item: 'Huevo Misterioso', icon: '🥚', count: 1, desc: '¡Nuevo compañero en camino!' };
        } else {
            // Master Ball! (0.5% - Mítica!)
            this.state.inventory.masterballs = (this.state.inventory.masterballs || 0) + 1;
            result = { item: 'Master Ball', icon: '🟣', count: 1, desc: '¡100% Captura Garantizada!' };
        }

        this.saveState();
        return result;
    }

    // Guarantees at least 5 basic Poké Balls when entering catch phase
    ensureRescuePokeballs() {
        if (!this.state.inventory) this.state.inventory = {};
        if ((this.state.inventory.pokeballs || 0) < 5) {
            this.state.inventory.pokeballs = 5;
            this.saveState();
            return true;
        }
        return false;
    }

    checkMoveLearn(slotIndex, member, level) {
        if (!member || member.isEgg) return;
        if (!Array.isArray(member.learnedMoves)) member.learnedMoves = [];

        const unlocked = getUnlockedMovesForSpecies(member.speciesId, level);
        for (const mv of unlocked) {
            if (!member.learnedMoves.includes(mv)) {
                member.learnedMoves.push(mv);
                if (!Array.isArray(member.moves)) member.moves = [];
                // If fewer than 4 active moves, auto-equip
                if (member.moves.length < 4 && !member.moves.some(m => m.name === mv)) {
                    member.moves.push(createMoveInstance(mv));
                }
                // Newly learned moves are added to learnedMoves repertoire so the user
                // can equip or swap them freely at any time from "Equipo & Info" tab!
            }
        }
    }

    hatchSlot(slotIndex, forcedLineIndex = null) {
        const slot = this.state.team[slotIndex];
        if (!slot) return;

        let candidates = EVOLUTION_LINES;
        if (slot.eggTier === 'uncommon') {
            candidates = EVOLUTION_LINES.filter(l => l.rarity === 'uncommon' || l.rarity === 'rare');
        } else if (slot.eggTier === 'rare') {
            candidates = EVOLUTION_LINES.filter(l => l.rarity === 'rare' || l.rarity === 'legendary');
        }

        let chosenLineIndex;
        if (forcedLineIndex !== null && EVOLUTION_LINES[forcedLineIndex]) {
            chosenLineIndex = forcedLineIndex;
        } else {
            const chosen = candidates[Math.floor(Math.random() * candidates.length)];
            chosenLineIndex = EVOLUTION_LINES.findIndex(l => l.id === chosen.id);
            if (chosenLineIndex === -1) chosenLineIndex = 0;
        }

        const line = EVOLUTION_LINES[chosenLineIndex];
        const shinyDenominator = this.state.inventory.shinyCharm ? 48 : 64;
        const isShiny = Math.floor(Math.random() * shinyDenominator) === 0;
        const nature = NATURES[Math.floor(Math.random() * NATURES.length)];

        slot.isEgg = false;
        slot.eggUsage = 0;
        slot.lineIndex = chosenLineIndex;
        slot.stageIndex = 0;
        slot.usedAtStage = 0;
        slot.speciesId = line.stages[0].id;
        slot.name = line.stages[0].name;
        slot.isShiny = isShiny;
        slot.nature = nature;
        slot.level = 5;
        slot.hatchedAt = new Date().toISOString();

        ensureMemberMoves(slot, 5);

        this.registerToDex(line.stages[0], line, isShiny, nature);
        this.state.celebration = 'hatch';
        this.saveState();
    }

    graduateSlot(slotIndex, line) {
        const slot = this.state.team[slotIndex];
        if (!slot) return;

        const finalStage = resolveStage(line, slot);
        this.registerToDex(finalStage, line, slot.isShiny, slot.nature);

        // Bring egg from eggBag if available
        if (Array.isArray(this.state.eggBag) && this.state.eggBag.length > 0) {
            const nextEgg = this.state.eggBag.shift();
            this.state.team[slotIndex] = nextEgg;
        } else {
            slot.isEgg = true;
            slot.eggUsage = 0;
            slot.eggTier = 'common';
            slot.name = 'Huevo (Común)';
            slot.usedAtStage = 0;
            slot.stageIndex = 0;
        }

        this.saveState();
    }

    // Branch Evolution Selection (Eevee, Ralts, etc.)
    chooseBranchEvolution(slotIndex, branchId) {
        const member = this.state.team[slotIndex];
        if (!member || member.isEgg) return { success: false, msg: 'Pokémon inválido' };

        const line = EVOLUTION_LINES[member.lineIndex];
        if (!line || !line.branches) return { success: false, msg: 'No tiene ramificaciones' };

        const chosenBranch = line.branches.find(b => b.id === branchId);
        if (!chosenBranch) return { success: false, msg: 'Rama no válida' };

        member.stageIndex = line.stages.length; // Advances to branched stage
        member.speciesId = chosenBranch.id;
        member.name = chosenBranch.name;
        member.usedAtStage = 0;

        ensureMemberMoves(member, 35);
        this.registerToDex({ id: chosenBranch.id, name: chosenBranch.name }, line, member.isShiny, member.nature);

        this.state.pendingBranchEvolution = null;
        this.state.celebration = 'evolve';
        this.saveState();
        return { success: true, evolvedName: chosenBranch.name };
    }

    // Move Learning & Repertoire Management (No HMs restriction)
    learnOrReplaceMove(slotIndex, newMoveName, slotToReplaceIndex) {
        const member = this.state.team[slotIndex];
        if (!member || member.isEgg) return { success: false, msg: 'Pokémon inválido' };

        if (!Array.isArray(member.learnedMoves)) member.learnedMoves = [];
        if (!member.learnedMoves.includes(newMoveName)) member.learnedMoves.push(newMoveName);

        if (slotToReplaceIndex !== null && slotToReplaceIndex >= 0 && slotToReplaceIndex < 4) {
            member.moves[slotToReplaceIndex] = createMoveInstance(newMoveName);
        } else if (member.moves.length < 4) {
            member.moves.push(createMoveInstance(newMoveName));
        }

        this.state.pendingMoveLearn = null;
        this.saveState();
        return { success: true };
    }

    dismissPendingMoveLearn() {
        this.state.pendingMoveLearn = null;
        this.saveState();
        return { success: true };
    }

    changeActiveMove(slotIndex, activeSlotIdx, moveNameToEquip) {
        const member = this.state.team[slotIndex];
        if (!member || member.isEgg) return { success: false, msg: 'Pokémon inválido' };
        if (!member.learnedMoves || !member.learnedMoves.includes(moveNameToEquip)) {
            return { success: false, msg: 'Movimiento no aprendido aún' };
        }

        member.moves[activeSlotIdx] = createMoveInstance(moveNameToEquip);
        this.saveState();
        return { success: true };
    }

    // SWAP TEAM SLOTS: Drag & Drop Reordering of active team
    swapTeamSlots(fromIdx, toIdx) {
        if (!Array.isArray(this.state.team)) return { success: false, msg: 'Equipo inválido' };
        if (fromIdx < 0 || fromIdx >= this.state.team.length || toIdx < 0 || toIdx >= this.state.team.length) {
            return { success: false, msg: 'Índices fuera de rango' };
        }
        if (fromIdx === toIdx) return { success: true };

        const temp = this.state.team[fromIdx];
        this.state.team[fromIdx] = this.state.team[toIdx];
        this.state.team[toIdx] = temp;

        // Keep lead pointer attached to the right Pokémon
        if (this.state.leadIndex === fromIdx) {
            this.state.leadIndex = toIdx;
        } else if (this.state.leadIndex === toIdx) {
            this.state.leadIndex = fromIdx;
        }

        this.saveState();
        return { success: true, team: this.state.team };
    }

    // SWAP BOX WITH TEAM: Drag & Drop between GBA PC Box and active team
    swapBoxWithTeam(boxIndex, targetSlotIndex = null) {
        if (!Array.isArray(this.state.box) || !this.state.box[boxIndex]) {
            return { success: false, msg: 'Pokémon no encontrado en la Caja' };
        }

        const boxMember = this.state.box[boxIndex];
        const targetSlot = (targetSlotIndex !== null && targetSlotIndex >= 0 && targetSlotIndex < 6)
            ? targetSlotIndex
            : this.state.leadIndex;

        const currentTeamMember = this.state.team[targetSlot];

        if (currentTeamMember) {
            // Swap directly
            this.state.box[boxIndex] = currentTeamMember;
            this.state.team[targetSlot] = boxMember;
        } else {
            // Team slot is empty: withdraw from box into team
            this.state.box.splice(boxIndex, 1);
            this.state.team[targetSlot] = boxMember;
        }

        this.deduplicateBox();
        this.saveState();
        return { success: true, memberName: boxMember.name };
    }

    // DEDUPLICATE PC BOX: Strictly 1 instance of each Pokémon species!
    deduplicateBox() {
        if (!Array.isArray(this.state.box) || this.state.box.length === 0) return 0;
        const seen = new Map();
        let prunedCount = 0;
        const uniqueBox = [];

        // Sort so that highest level and shiny come first
        const sortedBox = [...this.state.box].sort((a, b) => {
            if (a.isShiny && !b.isShiny) return -1;
            if (!a.isShiny && b.isShiny) return 1;
            return (b.level || 0) - (a.level || 0);
        });

        sortedBox.forEach(member => {
            if (!member || member.isEgg) return;
            const spId = member.speciesId || member.id;
            if (!spId) return;
            if (!seen.has(spId)) {
                seen.set(spId, true);
                uniqueBox.push(member);
            } else {
                prunedCount++;
                // Award essence to species for duplicate recycling!
                if (!this.state.speciesEssence) this.state.speciesEssence = {};
                this.state.speciesEssence[spId] = (this.state.speciesEssence[spId] || 0) + 1;
            }
        });

        this.state.box = uniqueBox;
        if (prunedCount > 0) {
            // Refund bonus shop tokens for pruned clones (e.g. duplicate Charmanders)
            const refund = prunedCount * 500000;
            this.state.bonusMoney = (this.state.bonusMoney || 0) + refund;
            this.saveState();
        }
        return prunedCount;
    }

    // PC BOX STORAGE: Deposit from active team (Unique collection check)
    depositToBox(slotIndex) {
        if (!Array.isArray(this.state.box)) this.state.box = [];
        const member = this.state.team[slotIndex];
        if (!member) return { success: false, msg: 'Ranura vacía' };
        if (member.isEgg) return { success: false, msg: 'No puedes guardar un huevo en el PC (usa la Bolsa de Huevos)' };

        // Check if species already exists in PC Box (prevent duplicates)
        const existingIdx = this.state.box.findIndex(m => m.speciesId === member.speciesId);
        if (existingIdx !== -1) {
            const existing = this.state.box[existingIdx];
            // If new is better, swap it in; otherwise keep the better one
            if ((member.isShiny && !existing.isShiny) || member.level > (existing.level || 1)) {
                this.state.box[existingIdx] = member;
            }
            // Award essence for duplicate deposit
            if (!this.state.speciesEssence) this.state.speciesEssence = {};
            this.state.speciesEssence[member.speciesId] = (this.state.speciesEssence[member.speciesId] || 0) + 1;
        } else {
            this.state.box.push(member);
        }

        if (this.state.team.length <= 1) {
            this.state.team = [{
                isEgg: true,
                eggUsage: 0,
                eggTier: 'common',
                lineIndex: 0,
                stageIndex: 0,
                usedAtStage: 0,
                isShiny: false,
                nature: 'Adamant',
                name: 'Huevo (Común)'
            }];
            this.state.leadIndex = 0;
        } else {
            this.state.team.splice(slotIndex, 1);
            if (this.state.leadIndex >= this.state.team.length) {
                this.state.leadIndex = 0;
            }
        }

        this.saveState();
        return { success: true, memberName: member.name };
    }

    // PC BOX STORAGE: Withdraw to active team
    withdrawFromBox(boxIndex, targetSlotIndex = null) {
        if (!Array.isArray(this.state.box) || !this.state.box[boxIndex]) {
            return { success: false, msg: 'Pokémon no encontrado en la Caja' };
        }

        const member = this.state.box[boxIndex];

        // Prevent duplicate species in active team!
        const alreadyInTeam = this.state.team.some(m => !m.isEgg && m.speciesId === member.speciesId);
        if (alreadyInTeam) {
            return { success: false, msg: `¡${member.name} ya está en tu equipo activo!` };
        }

        this.state.box.splice(boxIndex, 1);

        // If team only has a single fresh placeholder egg, replace it!
        if (this.state.team.length === 1 && this.state.team[0].isEgg && (this.state.team[0].eggUsage || 0) === 0 && targetSlotIndex === null) {
            this.state.team[0] = member;
            this.state.leadIndex = 0;
        } else if (this.state.team.length < 6 && targetSlotIndex === null) {
            this.state.team.push(member);
        } else {
            const target = (targetSlotIndex !== null && targetSlotIndex >= 0 && targetSlotIndex < 6)
                ? targetSlotIndex
                : this.state.leadIndex;
            const currentInSlot = this.state.team[target];
            if (currentInSlot) {
                if (currentInSlot.isEgg) {
                    if (!Array.isArray(this.state.eggBag)) this.state.eggBag = [];
                    this.state.eggBag.push(currentInSlot);
                } else {
                    this.state.box.push(currentInSlot);
                }
            }
            this.state.team[target] = member;
        }

        this.saveState();
        return { success: true, memberName: member.name };
    }

    // SPECIES POTENTIAL / RANK & ESSENCE SYSTEM (F -> SSS)
    getSpeciesRank(speciesId) {
        if (!this.state.speciesRanks) this.state.speciesRanks = {};
        return this.state.speciesRanks[speciesId] || 'F';
    }

    getSpeciesEssence(speciesId) {
        if (!this.state.speciesEssence) this.state.speciesEssence = {};
        return this.state.speciesEssence[speciesId] || 0;
    }

    upgradeSpeciesRank(speciesId) {
        if (!this.state.speciesRanks) this.state.speciesRanks = {};
        if (!this.state.speciesEssence) this.state.speciesEssence = {};
        const currentRank = this.state.speciesRanks[speciesId] || 'F';
        const currentIdx = RANK_LADDER.indexOf(currentRank);
        if (currentIdx === -1 || currentIdx >= RANK_LADDER.length - 1) {
            return { success: false, msg: '¡Rango Máximo alcanzado (👑 SSS)!' };
        }
        const cost = RANK_COSTS[currentRank];
        const available = this.state.speciesEssence[speciesId] || 0;
        if (available < cost) {
            return { success: false, msg: `Esencia insuficiente. Necesitas ${cost} y tienes ${available}.` };
        }
        this.state.speciesEssence[speciesId] -= cost;
        const nextRank = RANK_LADDER[currentIdx + 1];
        this.state.speciesRanks[speciesId] = nextRank;
        this.saveState();
        return {
            success: true,
            speciesId,
            newRank: nextRank,
            remainingEssence: this.state.speciesEssence[speciesId],
            statBonusPercent: RANK_BONUS[nextRank]
        };
    }

    // RECRUIT FROM POKÉDEX: Transfer or deploy discovered Pokémon into party
    recruitFromDex(speciesId, targetSlotIndex = null) {
        if (!Array.isArray(this.state.dex) || !this.state.dex.includes(speciesId)) {
            return { success: false, msg: 'Pokémon no descubierto en la Pokédex' };
        }
        const dexEntry = POKEDEX_ALL.find(p => p.id === speciesId) || { id: speciesId, name: 'Pokémon' };
        const foundLineIndex = EVOLUTION_LINES.findIndex(l => l.stages.some(s => s.id === speciesId));
        const line = foundLineIndex >= 0 ? EVOLUTION_LINES[foundLineIndex] : null;
        const stageIndex = line ? line.stages.findIndex(s => s.id === speciesId) : 0;

        // Prevent duplicate species in active team!
        const existingTeamIdx = this.state.team.findIndex(m => !m.isEgg && m.speciesId === speciesId);
        if (existingTeamIdx !== -1) {
            return { success: false, msg: `¡${dexEntry.name} ya está en tu equipo activo!` };
        }

        const newMember = {
            isEgg: false,
            eggUsage: 0,
            eggTier: line ? line.rarity : 'common',
            lineIndex: foundLineIndex,
            stageIndex: Math.max(0, stageIndex),
            usedAtStage: 0,
            isShiny: false,
            nature: 'Docile',
            name: dexEntry.name,
            speciesId: dexEntry.id,
            level: 5,
            moves: [],
            learnedMoves: [],
            hatchedAt: new Date().toISOString()
        };
        sanitizeMember(newMember);

        if (targetSlotIndex !== null && targetSlotIndex >= 0 && targetSlotIndex < this.state.team.length) {
            const currentInSlot = this.state.team[targetSlotIndex];
            if (currentInSlot && !currentInSlot.isEgg) {
                if (!Array.isArray(this.state.box)) this.state.box = [];
                this.state.box.push(currentInSlot);
            }
            this.state.team[targetSlotIndex] = newMember;
        } else if (this.state.team.length === 1 && this.state.team[0].isEgg && (this.state.team[0].eggUsage || 0) === 0) {
            this.state.team[0] = newMember;
            this.state.leadIndex = 0;
        } else if (this.state.team.length < 6) {
            this.state.team.push(newMember);
        } else {
            // Team is 6/6: deposit slot 5 to box and place new member
            const replaced = this.state.team[5];
            if (replaced && !replaced.isEgg) {
                if (!Array.isArray(this.state.box)) this.state.box = [];
                this.state.box.push(replaced);
            }
            this.state.team[5] = newMember;
        }

        this.deduplicateBox();
        this.saveState();
        return { success: true, member: newMember };
    }

    // ARCHIVE TO POKÉDEX: Retire / Free slot (especially for Lv. 100 Pokemon)
    archiveToDex(targetIndex, isFromBox = true) {
        let member = null;
        if (isFromBox) {
            if (!Array.isArray(this.state.box) || !this.state.box[targetIndex]) {
                return { success: false, msg: 'Pokémon no encontrado en la Caja PC' };
            }
            member = this.state.box.splice(targetIndex, 1)[0];
        } else {
            if (!Array.isArray(this.state.team) || !this.state.team[targetIndex]) {
                return { success: false, msg: 'Pokémon no encontrado en el equipo' };
            }
            member = this.state.team[targetIndex];
            if (member.isEgg) return { success: false, msg: 'No puedes archivar un huevo en la Pokédex' };
            if (this.state.team.length <= 1) {
                this.state.team = [{
                    isEgg: true,
                    eggUsage: 0,
                    eggTier: 'common',
                    lineIndex: 0,
                    stageIndex: 0,
                    usedAtStage: 0,
                    isShiny: false,
                    nature: 'Adamant',
                    name: 'Huevo (Común)'
                }];
                this.state.leadIndex = 0;
            } else {
                this.state.team.splice(targetIndex, 1);
                if (this.state.leadIndex >= this.state.team.length) this.state.leadIndex = 0;
            }
        }

        if (member) {
            this.registerToDex({ id: member.speciesId, name: member.name }, null, member.isShiny, member.nature);
            if ((member.level || 1) >= 100) {
                this.recordLevel100Mastery(member);
            }
            // Reward bonus essence when archiving a trained Pokémon!
            const extraEssence = Math.max(1, Math.floor((member.level || 5) / 20));
            if (!this.state.speciesEssence) this.state.speciesEssence = {};
            this.state.speciesEssence[member.speciesId] = (this.state.speciesEssence[member.speciesId] || 0) + extraEssence;
        }

        this.saveState();
        return { success: true, memberName: member ? member.name : 'Pokémon', achievedMastery: !!(member && (member.level || 1) >= 100) };
    }

    addNewMember(tier = 'common') {
        const newEgg = {
            isEgg: true,
            eggUsage: 0,
            eggTier: tier,
            lineIndex: 0,
            stageIndex: 0,
            usedAtStage: 0,
            isShiny: false,
            nature: 'Adamant',
            name: `Huevo (${tier === 'rare' ? 'Raro' : tier === 'uncommon' ? 'Poco Común' : 'Común'})`
        };

        if (this.state.team.length < 6) {
            this.state.team.push(newEgg);
            this.saveState();
            return { success: true, destination: 'team', msg: '¡Huevo añadido a tu equipo!' };
        } else {
            if (!Array.isArray(this.state.eggBag)) this.state.eggBag = [];
            this.state.eggBag.push(newEgg);
            this.saveState();
            return { success: true, destination: 'eggBag', msg: '¡Equipo lleno! Huevo guardado en tu Bolsa de Huevos.' };
        }
    }

    moveEggToTeam(eggBagIndex, targetSlotIndex = null) {
        if (!Array.isArray(this.state.eggBag) || !this.state.eggBag[eggBagIndex]) {
            return { success: false, msg: 'Huevo no encontrado en la bolsa' };
        }

        const egg = this.state.eggBag.splice(eggBagIndex, 1)[0];

        if (this.state.team.length < 6) {
            this.state.team.push(egg);
        } else {
            const target = (targetSlotIndex !== null && targetSlotIndex >= 0 && targetSlotIndex < 6)
                ? targetSlotIndex
                : this.state.leadIndex;
            const currentMember = this.state.team[target];
            if (currentMember && currentMember.isEgg) {
                this.state.eggBag.push(currentMember);
            }
            this.state.team[target] = egg;
        }

        this.saveState();
        return { success: true };
    }

    deployFromDex(dexNumber, targetSlotIndex = null) {
        if (!Array.isArray(this.state.dex)) return { success: false, msg: 'Pokédex vacía' };
        const dexEntry = this.state.dex.find(d => d.dexNumber === dexNumber);
        if (!dexEntry) return { success: false, msg: 'Pokémon no encontrado en Pokédex' };

        // 1. Prevent clones in active team!
        const inTeam = this.state.team.some(m => !m.isEgg && m.speciesId === dexNumber);
        if (inTeam) {
            return { success: false, msg: '¡Este Pokémon ya está en tu equipo!' };
        }

        // 2. If stored in PC Box, withdraw keeping exact stats!
        if (Array.isArray(this.state.box)) {
            const boxIdx = this.state.box.findIndex(m => m.speciesId === dexNumber);
            if (boxIdx !== -1) {
                return this.withdrawFromBox(boxIdx, targetSlotIndex);
            }
        }

        // 3. Otherwise deploy fresh registered instance
        let foundLineIndex = -1;
        let foundStageIndex = -1;
        for (let lIdx = 0; lIdx < EVOLUTION_LINES.length; lIdx++) {
            const line = EVOLUTION_LINES[lIdx];
            for (let sIdx = 0; sIdx < line.stages.length; sIdx++) {
                if (line.stages[sIdx].id === dexNumber) {
                    foundLineIndex = lIdx;
                    foundStageIndex = sIdx;
                    break;
                }
            }
            if (foundLineIndex !== -1) break;
            if (line.branches) {
                const b = line.branches.find(br => br.id === dexNumber);
                if (b) {
                    foundLineIndex = lIdx;
                    foundStageIndex = line.stages.length;
                    break;
                }
            }
        }

        if (foundLineIndex === -1) return { success: false, msg: 'Línea no encontrada' };

        const line = EVOLUTION_LINES[foundLineIndex];
        const stage = resolveStage(line, { speciesId: dexNumber, stageIndex: foundStageIndex });
        const bounds = getStageLevelBounds(stage.id, foundStageIndex, line);

        const newMember = {
            isEgg: false,
            eggUsage: 0,
            eggTier: line.rarity,
            lineIndex: foundLineIndex,
            stageIndex: foundStageIndex,
            usedAtStage: 0,
            isShiny: !!dexEntry.isShiny,
            nature: dexEntry.nature || 'Hardy',
            name: stage.name,
            speciesId: stage.id,
            level: bounds.startLevel
        };
        ensureMemberMoves(newMember, newMember.level);

        if (this.state.team.length < 6 && targetSlotIndex === null) {
            this.state.team.push(newMember);
        } else {
            const target = (targetSlotIndex !== null && targetSlotIndex >= 0 && targetSlotIndex < 6)
                ? targetSlotIndex
                : this.state.leadIndex;
            this.state.team[target] = newMember;
        }

        this.saveState();
        return { success: true, memberName: stage.name };
    }

    cycleLeadPokemon() {
        if (!this.state.team || this.state.team.length <= 1) return;
        this.state.leadIndex = (this.state.leadIndex + 1) % this.state.team.length;
        this.saveState();
    }

    getPublicView(todayTokens, totalTokens, eventOccurred = null) {
        const currentDiff = this.state.difficulty || 'fast';
        const hatchThreshold = DIFFICULTY_SETTINGS[currentDiff].eggHatchThreshold;

        // Active Team of 6
        const teamSummary = this.state.team.map((slot, idx) => {
            if (slot.isEgg) {
                return {
                    slotIndex: idx,
                    isLead: idx === this.state.leadIndex,
                    isEgg: true,
                    name: slot.name,
                    iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
                    progressPercent: Math.min(100, Math.round(((slot.eggUsage || 0) / hatchThreshold) * 100))
                };
            }
            const line = (slot.lineIndex !== undefined && slot.lineIndex >= 0 && EVOLUTION_LINES[slot.lineIndex])
                ? EVOLUTION_LINES[slot.lineIndex]
                : EVOLUTION_LINES.find(l => l.stages.some(s => s.id === slot.speciesId));
            const currentStage = line ? resolveStage(line, slot) : { id: slot.speciesId, name: slot.name };
            const iconUrl = slot.isShiny
                ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${currentStage.id}.png`
                : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentStage.id}.png`;

            const evoTarget = EVOLUTION_TARGETS[currentStage.id] || { nextLevel: null, nextName: 'Forma Final', nextId: null };
            let evoInfoText = 'Forma Final';
            if (evoTarget.isBranch) {
                evoInfoText = `Evoluciona al Nv. ${evoTarget.nextLevel}`;
            } else if (evoTarget.nextLevel) {
                evoInfoText = `Evoluciona al Nv. ${evoTarget.nextLevel} (${evoTarget.nextName})`;
            }

            const rank = this.getSpeciesRank(currentStage.id);
            const essence = this.getSpeciesEssence(currentStage.id);

            return {
                slotIndex: idx,
                isLead: idx === this.state.leadIndex,
                isEgg: false,
                speciesId: currentStage.id,
                name: currentStage.name,
                isShiny: slot.isShiny,
                nature: slot.nature,
                iconUrl,
                level: slot.level || 5,
                rank,
                essence,
                nextRankCost: RANK_COSTS[rank] || null,
                rankBonusPercent: RANK_BONUS[rank] || 0,
                nextEvoLevel: evoTarget.nextLevel,
                nextEvoName: evoTarget.nextName,
                evoInfoText,
                moves: (slot.moves || []).map(m => ({ name: m.name, type: m.type, power: m.power, pp: `${m.currentPP}/${m.maxPP}` })),
                learnedMoves: slot.learnedMoves || []
            };
        });

        while (teamSummary.length < 6) {
            teamSummary.push({
                slotIndex: teamSummary.length,
                isEmpty: true,
                isLead: false,
                name: 'Vacío',
                iconUrl: null
            });
        }

        // Leader view
        const leader = this.state.team[this.state.leadIndex] || this.state.team[0];
        let leaderView = {};

        if (!leader || leader.isEgg) {
            const eggUsage = leader ? (leader.eggUsage || 0) : 0;
            const remaining = Math.max(0, hatchThreshold - eggUsage);
            const progressPercent = Math.min(100, Math.round((eggUsage / hatchThreshold) * 100));

            leaderView = {
                isEgg: true,
                pokemonName: leader ? leader.name : 'Huevo Pokémon',
                speciesId: null,
                nature: 'Incubando...',
                level: 1,
                isShiny: false,
                lineName: 'Equipo Pokémon',
                spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
                fallbackUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
                cryUrl: null,
                nextEvoLevel: null,
                nextEvoName: null,
                evoInfoText: 'Incubando huevo...',
                progressLabel: 'Para Eclosionar',
                progressPercent,
                tokensRemaining: remaining,
                stageLabel: 'Fase: Huevo',
                moves: [],
                rank: 'F',
                essence: 0,
                nextRankCost: 2
            };
        } else {
            const line = (leader.lineIndex !== undefined && leader.lineIndex >= 0 && EVOLUTION_LINES[leader.lineIndex])
                ? EVOLUTION_LINES[leader.lineIndex]
                : EVOLUTION_LINES.find(l => l.stages.some(s => s.id === leader.speciesId));
            const currentStage = line ? resolveStage(line, leader) : { id: leader.speciesId, name: leader.name };
            const totalForms = line ? (line.branches ? line.stages.length + 1 : line.stages.length) : 1;

            const level = Math.max(1, Math.min(100, leader.level || 1));
            const expNeeded = getExpForLevel(level);
            const currentExp = leader.exp || 0;
            const remaining = expNeeded > 0 ? Math.max(0, expNeeded - currentExp) : 0;
            const progressPercent = expNeeded > 0 ? Math.min(100, Math.round((currentExp / expNeeded) * 100)) : 100;

            const shinyPrefix = leader.isShiny ? 'shiny/' : '';
            const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${shinyPrefix}${currentStage.id}.gif`;
            const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPrefix}${currentStage.id}.png`;

            const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${currentStage.id}.ogg`;

            const evoTarget = getEvolutionTarget(currentStage.id, leader.stageIndex, line);
            let evoInfoText = 'Forma Final (Nivel 100)';
            if (evoTarget.isBranch) {
                evoInfoText = `Elige Evolución al Nv. ${evoTarget.nextLevel} (${evoTarget.nextName})`;
            } else if (evoTarget.nextLevel) {
                evoInfoText = `Evoluciona a ${evoTarget.nextName} al Nv. ${evoTarget.nextLevel}`;
            }

            let progressLabel = `Para Nv. ${level + 1}`;
            if (level >= 100) {
                progressLabel = '¡Nivel Máximo (Nv. 100)!';
            } else if (evoTarget.nextLevel) {
                progressLabel = `Para Nv. ${level + 1} (Evoluciona al ${evoTarget.nextLevel})`;
            }

            const rank = this.getSpeciesRank(currentStage.id);
            const essence = this.getSpeciesEssence(currentStage.id);

            leaderView = {
                isEgg: false,
                pokemonName: currentStage.name,
                speciesId: currentStage.id,
                nature: leader.nature,
                level,
                exp: currentExp,
                expNeeded,
                isShiny: leader.isShiny,
                lineName: line ? line.name : 'Especie Descubierta',
                spriteUrl,
                fallbackUrl,
                cryUrl,
                nextEvoLevel: evoTarget.nextLevel,
                nextEvoName: evoTarget.nextName,
                isBranchEvo: !!evoTarget.isBranch,
                isFinalEvo: !evoTarget.nextLevel && !evoTarget.isBranch,
                evoInfoText,
                progressLabel,
                progressPercent,
                tokensRemaining: remaining,
                stageLabel: `Forma ${leader.stageIndex + 1}/${totalForms}`,
                rank,
                essence,
                nextRankCost: RANK_COSTS[rank] || null,
                rankBonusPercent: RANK_BONUS[rank] || 0,
                moves: (leader.moves || []).map(m => ({ name: m.name, type: m.type, power: m.power, pp: `${m.currentPP}/${m.maxPP}` })),
                learnedMoves: leader.learnedMoves || []
            };
        }

        // Formatted PC Box Summary (Rich data for GBA PC Inspector Card)
        const boxSummary = (this.state.box || []).map((m, idx) => {
            const line = (m.lineIndex !== undefined && m.lineIndex >= 0 && EVOLUTION_LINES[m.lineIndex])
                ? EVOLUTION_LINES[m.lineIndex]
                : EVOLUTION_LINES.find(l => l.stages.some(s => s.id === m.speciesId));
            const stage = line ? resolveStage(line, m) : { id: m.speciesId, name: m.name };
            const rank = this.getSpeciesRank(stage.id);
            const essence = this.getSpeciesEssence(stage.id);
            const rankBonus = RANK_BONUS[rank] || 0;
            const maxHP = m.maxHP || Math.round((25 + (m.level || 5) * 6) * (1 + rankBonus / 100));
            return {
                boxIndex: idx,
                speciesId: stage.id,
                name: stage.name,
                level: m.level || 5,
                nature: m.nature,
                isShiny: !!m.isShiny,
                rank,
                essence,
                nextRankCost: RANK_COSTS[rank] || null,
                rankBonusPercent: rankBonus,
                iconUrl: m.isShiny
                    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${stage.id}.png`
                    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`,
                spriteUrl: m.isShiny
                    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${stage.id}.gif`
                    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${stage.id}.gif`,
                fallbackUrl: m.isShiny
                    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${stage.id}.png`
                    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`,
                moves: (m.moves || []).map(mv => ({ name: mv.name, type: mv.type, power: mv.power, pp: `${mv.currentPP !== undefined ? mv.currentPP : mv.maxPP}/${mv.maxPP || 35}` })),
                maxHP,
                currentHP: m.currentHP !== undefined ? m.currentHP : maxHP
            };
        });

        const spendableTokens = Math.max(0, totalTokens + (this.state.bonusMoney || 0) - (this.state.spentTokens || 0));

        return {
            ...leaderView,
            leadIndex: this.state.leadIndex,
            team: teamSummary,
            box: boxSummary,
            boxCount: boxSummary.length,
            eggBagCount: (this.state.eggBag || []).length,
            eggBag: (this.state.eggBag || []).map((egg, idx) => ({
                index: idx,
                tier: egg.eggTier,
                name: egg.name,
                iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
            })),
            difficulty: this.state.difficulty,
            inventory: this.state.inventory,
            settings: this.state.settings || { encountersEnabled: true, autoBattle: false, battleSpeed: 1, hideOnFullscreen: false },
            spendableTokens,
            todayTokens,
            totalTokens,
            mastery: this.state.mastery || {},
            speciesEssence: this.state.speciesEssence || {},
            speciesRanks: this.state.speciesRanks || {},
            dexCount: this.state.dex.length,
            dex: this.state.dex,
            pendingBranchEvolution: this.state.pendingBranchEvolution,
            pendingMoveLearn: this.state.pendingMoveLearn,
            eventOccurred: eventOccurred || this.state.celebration
        };
    }

    rewardCaptureMoney(wildLevel = 5) {
        const moneyReward = Math.round(Math.max(1, wildLevel) * 250000 + 1000000);
        this.state.bonusMoney = (this.state.bonusMoney || 0) + moneyReward;
        this.saveState();
        return moneyReward;
    }

    reviveTeam() {
        if (!Array.isArray(this.state.team)) return;
        this.state.team.forEach(member => {
            if (member && !member.isEgg) {
                const lvl = Math.max(1, member.level || 5);
                member.maxHP = Math.round(25 + lvl * 6);
                member.currentHP = member.maxHP;
                if (Array.isArray(member.moves)) {
                    member.moves.forEach(m => {
                        const base = MOVES_CATALOG[m.name] || MOVES_CATALOG['Placaje'];
                        m.maxPP = m.maxPP || base.maxPP || 35;
                        m.currentPP = m.maxPP;
                    });
                }
            }
        });
        this.saveState();
    }

    useRareCandy(targetSlotIndex = null) {
        if (!this.state.inventory || this.state.inventory.rareCandy <= 0) {
            return { success: false, msg: 'No tienes Caramelos Raros' };
        }

        const slotIndex = (targetSlotIndex !== null && targetSlotIndex >= 0 && targetSlotIndex < this.state.team.length)
            ? targetSlotIndex
            : this.state.leadIndex;
        const member = this.state.team[slotIndex];
        if (!member) return { success: false, msg: 'Ranura vacía' };

        this.state.inventory.rareCandy--;

        if (member.isEgg) {
            const currentDiff = this.state.difficulty || 'fast';
            const hatchThreshold = DIFFICULTY_SETTINGS[currentDiff].eggHatchThreshold;
            member.eggUsage = (member.eggUsage || 0) + Math.round(hatchThreshold / 2);
            if (member.eggUsage >= hatchThreshold) {
                this.hatchSlot(slotIndex);
                this.saveState();
                return { success: true, msg: '¡El huevo ha eclosionado!' };
            }
            this.saveState();
            return { success: true, msg: '¡Incubación acelerada con Caramelo Raro!' };
        }

        // Pokémon Level Up: BYPASSES EXP! Strictly +1 level, 0 EXP given!
        if (member.level >= 100) {
            return { success: false, msg: `¡${member.name} ya está en su nivel máximo (Nv. 100)!` };
        }

        member.level = Math.min(100, (member.level || 1) + 1);
        member.exp = 0; // resets exp towards next level, NO EXP GIVEN
        member.maxHP = Math.round(25 + member.level * 6);
        member.currentHP = member.maxHP; // heals to full!
        this.checkMoveLearn(slotIndex, member, member.level);

        const line = (member.lineIndex !== undefined && member.lineIndex >= 0 && EVOLUTION_LINES[member.lineIndex])
            ? EVOLUTION_LINES[member.lineIndex]
            : null;
        const evoTarget = getEvolutionTarget(member.speciesId, member.stageIndex, line);

        let eventOccurred = 'levelup';

        // Check evolution trigger on this level!
        if (evoTarget && evoTarget.nextLevel && member.level >= evoTarget.nextLevel) {
            if (evoTarget.isBranch && line && line.branches) {
                this.state.pendingBranchEvolution = {
                    slotIndex,
                    pokemonName: member.name,
                    lineIndex: member.lineIndex,
                    branches: line.branches.map(b => ({
                        id: b.id,
                        name: b.name,
                        type: b.type,
                        spriteUrl: member.isShiny
                            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${b.id}.png`
                            : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${b.id}.png`
                    }))
                };
                this.state.celebration = 'branch_ready';
                eventOccurred = 'branch_ready';
            } else if (line && Array.isArray(line.stages) && member.stageIndex < line.stages.length - 1) {
                member.stageIndex++;
                const nextStage = line.stages[member.stageIndex];
                member.name = nextStage.name;
                member.speciesId = nextStage.id;
                ensureMemberMoves(member, member.level);
                this.registerToDex(nextStage, line, member.isShiny, member.nature);
                this.state.celebration = 'evolve';
                eventOccurred = 'evolve';
            } else if (evoTarget.nextId && evoTarget.nextName) {
                // Canon evolution for Pokédex species outside starter lines (e.g. Slowpoke -> Slowbro Nv. 37)
                member.speciesId = evoTarget.nextId;
                member.name = evoTarget.nextName;
                ensureMemberMoves(member, member.level);
                this.registerToDex({ id: evoTarget.nextId, name: evoTarget.nextName }, null, member.isShiny, member.nature);
                this.state.celebration = 'evolve';
                eventOccurred = 'evolve';
            } else {
                const finalStage = resolveStage(line, member);
                this.registerToDex(finalStage, line, member.isShiny, member.nature);
            }
        }
        
        if (member.level >= 100) {
            const finalStage = resolveStage(line, member);
            this.registerToDex(finalStage, line, member.isShiny, member.nature);
            this.recordLevel100Mastery(member);
            this.state.celebration = 'max_level';
            eventOccurred = 'max_level';
        }

        this.saveState();
        return { success: true, level: member.level, memberName: member.name, event: eventOccurred };
    }

    useMint() {
        if (this.state.inventory.mint <= 0) return { success: false, msg: 'No tienes Mentas' };
        const leader = this.state.team[this.state.leadIndex];
        if (!leader || leader.isEgg) return { success: false, msg: 'Solo aplicable a Pokémon eclosionados' };

        this.state.inventory.mint--;
        const current = leader.nature;
        const available = NATURES.filter(n => n !== current);
        leader.nature = available[Math.floor(Math.random() * available.length)];
        this.saveState();
        return { success: true, newNature: leader.nature };
    }

    buyItem(itemKey, totalTokens) {
        const spendable = Math.max(0, totalTokens - this.state.spentTokens);

        const PRICES = {
            rareCandy:    500000000,
            mint:         100000000,
            shinyCharm:   3000000000,
            pokeballs:    200000000,
            greatballs:   400000000,
            ultraballs:   800000000,
            masterballs:  5000000000,
            potions:      150000000,
            eggCommon:    1000000000,
            eggUncommon:  2500000000,
            eggRare:      4000000000
        };

        const price = PRICES[itemKey];
        if (!price) return { success: false, msg: 'Artículo no encontrado' };

        if (spendable < price) {
            return { success: false, msg: `Tokens insuficientes.` };
        }

        this.state.spentTokens += price;

        if (itemKey === 'rareCandy') {
            this.state.inventory.rareCandy = (this.state.inventory.rareCandy || 0) + 1;
        } else if (itemKey === 'mint') {
            this.state.inventory.mint = (this.state.inventory.mint || 0) + 1;
        } else if (itemKey === 'shinyCharm') {
            this.state.inventory.shinyCharm = true;
        } else if (itemKey === 'pokeballs') {
            this.state.inventory.pokeballs = (this.state.inventory.pokeballs || 0) + 5;
        } else if (itemKey === 'greatballs') {
            this.state.inventory.greatballs = (this.state.inventory.greatballs || 0) + 3;
        } else if (itemKey === 'ultraballs') {
            this.state.inventory.ultraballs = (this.state.inventory.ultraballs || 0) + 2;
        } else if (itemKey === 'masterballs') {
            this.state.inventory.masterballs = (this.state.inventory.masterballs || 0) + 1;
        } else if (itemKey === 'potions') {
            this.state.inventory.potions = (this.state.inventory.potions || 0) + 3;
        } else if (itemKey === 'eggCommon' || itemKey === 'eggUncommon' || itemKey === 'eggRare') {
            const tier = itemKey === 'eggRare' ? 'rare' : itemKey === 'eggUncommon' ? 'uncommon' : 'common';
            this.addNewMember(tier);
        }

        this.saveState();
        return { success: true };
    }

    addCapturedPokemon(capturedData) {
        if (!capturedData) return { success: false };
        const speciesId = capturedData.speciesId || capturedData.id;
        const name = capturedData.name || `Pokémon #${speciesId}`;
        const isShiny = !!capturedData.isShiny;
        const nature = capturedData.nature || 'Docile';
        const moves = Array.isArray(capturedData.moves) ? capturedData.moves : [];

        // Find evolution line and stage index
        let foundLineIndex = -1;
        let foundStageIndex = 0;
        for (let lIdx = 0; lIdx < EVOLUTION_LINES.length; lIdx++) {
            const line = EVOLUTION_LINES[lIdx];
            for (let sIdx = 0; sIdx < line.stages.length; sIdx++) {
                if (line.stages[sIdx].id === speciesId) {
                    foundLineIndex = lIdx;
                    foundStageIndex = sIdx;
                    break;
                }
            }
            if (foundLineIndex !== -1) break;
            if (line.branches) {
                const b = line.branches.find(br => br.id === speciesId);
                if (b) {
                    foundLineIndex = lIdx;
                    foundStageIndex = line.stages.length;
                    break;
                }
            }
        }

        const line = foundLineIndex >= 0 ? EVOLUTION_LINES[foundLineIndex] : null;
        const lineIdx = foundLineIndex >= 0 ? foundLineIndex : -1;
        const bounds = getStageLevelBounds(speciesId, foundStageIndex, line);

        // Core Rule:
        // - Base Pokémon (stageIndex === 0) ALWAYS enters bag at Level 1!
        // - Evolved Stage 1 (e.g. Charmeleon) starts at min evolution level (e.g. 16)
        // - Evolved Stage 2 (e.g. Charizard) starts at min evo level (e.g. 36) or lower captured level if caught lower (e.g. Charizard Lv. 20)
        let finalLevel = 1;
        if (foundStageIndex === 0) {
            finalLevel = 1;
        } else if (foundStageIndex === 1) {
            const minLevel = bounds.startLevel || 16;
            finalLevel = Math.max(minLevel, capturedData.level || minLevel);
        } else {
            const wildLvl = capturedData.level || bounds.startLevel || 36;
            finalLevel = Math.max(1, wildLvl);
        }

        const member = {
            isEgg: false,
            eggUsage: 0,
            eggTier: foundLineIndex >= 0 ? EVOLUTION_LINES[foundLineIndex].rarity : 'common',
            lineIndex: lineIdx,
            stageIndex: foundStageIndex,
            usedAtStage: 0,
            isShiny,
            nature,
            name,
            speciesId,
            level: finalLevel,
            moves,
            learnedMoves: moves.map(m => m.name),
            hatchedAt: new Date().toISOString()
        };
        ensureMemberMoves(member, finalLevel);

        // Award species essence for every catch!
        const essenceGained = isShiny ? 3 : 1;
        if (!this.state.speciesEssence) this.state.speciesEssence = {};
        this.state.speciesEssence[speciesId] = (this.state.speciesEssence[speciesId] || 0) + essenceGained;

        // Register into Pokédex
        this.registerToDex({ id: speciesId, name }, foundLineIndex >= 0 ? EVOLUTION_LINES[foundLineIndex] : null, isShiny, nature);

        // Check if species is already owned in team or box
        const inTeamIdx = this.state.team.findIndex(m => !m.isEgg && m.speciesId === speciesId);
        const inBoxIdx = (this.state.box || []).findIndex(m => !m.isEgg && m.speciesId === speciesId);

        let destination = 'essence';
        if (inTeamIdx === -1 && this.state.team.length < 6) {
            this.state.team.push(member);
            destination = 'team';
        } else if (inTeamIdx === -1 && inBoxIdx === -1) {
            if (!Array.isArray(this.state.box)) this.state.box = [];
            this.state.box.push(member);
            destination = 'box';
        } else {
            // Already owned! Convert duplicate cleanly to essence + shop tokens bonus
            destination = 'essence';
            this.state.bonusMoney = (this.state.bonusMoney || 0) + 50000;
            if (inBoxIdx !== -1) {
                const existing = this.state.box[inBoxIdx];
                if ((isShiny && !existing.isShiny) || member.level > (existing.level || 1)) {
                    this.state.box[inBoxIdx] = member;
                }
            }
        }

        this.saveState();
        return { 
            success: true, 
            member, 
            destination, 
            essenceGained, 
            totalEssence: this.state.speciesEssence[speciesId],
            rank: this.getSpeciesRank(speciesId)
        };
    }

    updateSetting(key, val) {
        if (!this.state.settings) this.state.settings = {};
        this.state.settings[key] = val;
        this.saveState();
        return this.state.settings;
    }

    repairTeam() {
        if (Array.isArray(this.state.team)) this.state.team.forEach(m => sanitizeMember(m));
        if (Array.isArray(this.state.box)) this.state.box.forEach(m => sanitizeMember(m));
        this.deduplicateBox();
        this.syncDexFromTeam();
        this.saveState();
        return { success: true };
    }

    toggleEncounters() {
        if (!this.state.settings) this.state.settings = { encountersEnabled: true, autoBattle: false, battleSpeed: 1 };
        this.state.settings.encountersEnabled = !this.state.settings.encountersEnabled;
        this.saveState();
        return this.state.settings.encountersEnabled;
    }

    toggleSkipVsDialog() {
        if (!this.state.settings) this.state.settings = {};
        this.state.settings.skipVsDialog = !this.state.settings.skipVsDialog;
        this.saveState();
        return this.state.settings.skipVsDialog;
    }

    toggleUseSpecialBalls() {
        if (!this.state.settings) this.state.settings = {};
        this.state.settings.useSpecialBalls = !this.state.settings.useSpecialBalls;
        this.saveState();
        return this.state.settings.useSpecialBalls;
    }

    toggleAudio() {
        if (!this.state.settings) this.state.settings = {};
        this.state.settings.soundEnabled = !this.state.settings.soundEnabled;
        this.saveState();
        return this.state.settings.soundEnabled;
    }

    toggleAutoBattle() {
        if (!this.state.settings) this.state.settings = { encountersEnabled: true, autoBattle: false, battleSpeed: 1 };
        this.state.settings.autoBattle = !this.state.settings.autoBattle;
        this.saveState();
        return this.state.settings.autoBattle;
    }

    toggleBattleSpeed() {
        if (!this.state.settings) this.state.settings = { encountersEnabled: true, autoBattle: false, battleSpeed: 1 };
        this.state.settings.battleSpeed = (this.state.settings.battleSpeed === 1) ? 2 : 1;
        this.saveState();
        return this.state.settings.battleSpeed;
    }

    resetToEgg() {
        const leader = this.state.team[this.state.leadIndex];
        if (leader) {
            leader.isEgg = true;
            leader.eggUsage = 0;
            leader.name = 'Huevo (Común)';
            leader.usedAtStage = 0;
            leader.stageIndex = 0;
            this.saveState();
        }
    }

    forceHatch(forcedIndex = null) {
        this.hatchSlot(this.state.leadIndex, forcedIndex);
    }

    toggleShiny() {
        const leader = this.state.team[this.state.leadIndex];
        if (leader && !leader.isEgg) {
            leader.isShiny = !leader.isShiny;
            this.saveState();
        }
    }

    nextPokemonLine() {
        this.cycleLeadPokemon();
    }
}

module.exports = {
    CompanionManager,
    EVOLUTION_LINES,
    EVOLUTION_TARGETS,
    getEvolutionTarget,
    NATURES,
    DIFFICULTY_SETTINGS
};
