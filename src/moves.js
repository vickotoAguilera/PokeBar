// Pokemon Moves Database & Learnsets for PokeTokenBar Windows
// Official Move Data (Name, Type, Power, PP, Description)

const MOVES_DATABASE = {
    // Normal
    'Placaje': { name: 'Placaje', type: 'Normal', power: 40, maxPP: 35, desc: 'Una embestida física con todo el cuerpo.' },
    'Arañazo': { name: 'Arañazo', type: 'Normal', power: 40, maxPP: 35, desc: 'Duro arañazo con afiladas garras.' },
    'Ataque Rápido': { name: 'Ataque Rápido', type: 'Normal', power: 40, maxPP: 30, desc: 'Ataque veloz que siempre impacta primero.' },
    'Golpe Cuerpo': { name: 'Golpe Cuerpo', type: 'Normal', power: 85, maxPP: 15, desc: 'Cae sobre el enemigo con todo el peso.' },
    'Doble Filo': { name: 'Doble Filo', type: 'Normal', power: 120, maxPP: 15, desc: 'Carga destructiva con daño masivo.' },
    'Rapidez': { name: 'Rapidez', type: 'Normal', power: 60, maxPP: 20, desc: 'Lanza estrellas mágicas ineludibles.' },
    'Hiperrayo': { name: 'Hiperrayo', type: 'Normal', power: 150, maxPP: 5, desc: 'Poderoso rayo destructivo.' },

    // Fuego
    'Ascuas': { name: 'Ascuas', type: 'Fuego', power: 40, maxPP: 25, desc: 'Lanza pequeñas llamas al oponente.' },
    'Giro Fuego': { name: 'Giro Fuego', type: 'Fuego', power: 35, maxPP: 15, desc: 'Atrapa al enemigo en un vórtice ardiente.' },
    'Colmillo Ígneo': { name: 'Colmillo Ígneo', type: 'Fuego', power: 65, maxPP: 15, desc: 'Mordisco abrasador que puede quemar.' },
    'Puño Fuego': { name: 'Puño Fuego', type: 'Fuego', power: 75, maxPP: 15, desc: 'Puñetazo envuelto en intensas llamas.' },
    'Lanzallamas': { name: 'Lanzallamas', type: 'Fuego', power: 90, maxPP: 15, desc: 'Chorro abrasador de fuego continuo.' },
    'Llamarada': { name: 'Llamarada', type: 'Fuego', power: 110, maxPP: 5, desc: 'Impresionante explosión de fuego en cruz.' },

    // Agua
    'Pistola Agua': { name: 'Pistola Agua', type: 'Agua', power: 40, maxPP: 25, desc: 'Dispara un potente chorro de agua.' },
    'Burbuja': { name: 'Burbuja', type: 'Agua', power: 40, maxPP: 30, desc: 'Disparo de burbujas que ralentiza.' },
    'Hidropulso': { name: 'Hidropulso', type: 'Agua', power: 60, maxPP: 20, desc: 'Onda ultrasónica de agua pulsante.' },
    'Cascada': { name: 'Cascada', type: 'Agua', power: 80, maxPP: 15, desc: 'Carga veloz con la fuerza de una catarata.' },
    'Surf': { name: 'Surf', type: 'Agua', power: 90, maxPP: 15, desc: 'Crea una gigantesca ola que azota al rival.' },
    'Hidrobomba': { name: 'Hidrobomba', type: 'Agua', power: 110, maxPP: 5, desc: 'Lanza un descomunal cañón de agua a presión.' },

    // Planta
    'Látigo Cepa': { name: 'Látigo Cepa', type: 'Planta', power: 45, maxPP: 25, desc: 'Azota al rival con fuertes lianas.' },
    'Hoja Afilada': { name: 'Hoja Afilada', type: 'Planta', power: 55, maxPP: 25, desc: 'Corta con hojas tan afiladas como navajas.' },
    'Gigadrenado': { name: 'Gigadrenado', type: 'Planta', power: 75, maxPP: 10, desc: 'Drena la energía del rival para curarse.' },
    'Bomba Germen': { name: 'Bomba Germen', type: 'Planta', power: 80, maxPP: 15, desc: 'Lanza semillas explosivas desde arriba.' },
    'Rayo Solar': { name: 'Rayo Solar', type: 'Planta', power: 120, maxPP: 10, desc: 'Haz condensado de luz solar pura.' },

    // Eléctrico
    'Impactrueno': { name: 'Impactrueno', type: 'Eléctrico', power: 40, maxPP: 30, desc: 'Descarga eléctrica que sacude al rival.' },
    'Chispa': { name: 'Chispa', type: 'Eléctrico', power: 65, maxPP: 20, desc: 'Carga electrizante que puede paralizar.' },
    'Puño Trueno': { name: 'Puño Trueno', type: 'Eléctrico', power: 75, maxPP: 15, desc: 'Puñetazo cargado con alta tensión.' },
    'Rayo': { name: 'Rayo', type: 'Eléctrico', power: 90, maxPP: 15, desc: 'Potente rayo eléctrico que fulmina al rival.' },
    'Trueno': { name: 'Trueno', type: 'Eléctrico', power: 110, maxPP: 10, desc: 'Un trueno descomunal cae del cielo.' },

    // Fantasma / Siniestro
    'Lengüetazo': { name: 'Lengüetazo', type: 'Fantasma', power: 30, maxPP: 30, desc: 'Lame al enemigo con una lengua fría espectral.' },
    'Tinieblas': { name: 'Tinieblas', type: 'Fantasma', power: 50, maxPP: 20, desc: 'Espejismo oscuro que asusta al rival.' },
    'Bola Sombra': { name: 'Bola Sombra', type: 'Fantasma', power: 80, maxPP: 15, desc: 'Proyectil de energía oscura concentrada.' },
    'Mordisco': { name: 'Mordisco', type: 'Siniestro', power: 60, maxPP: 25, desc: 'Mordisco con dientes afilados y siniestros.' },
    'Triturar': { name: 'Triturar', type: 'Siniestro', power: 80, maxPP: 15, desc: 'Desgarra con colmillos devastadores.' },
    'Pulso Umbrío': { name: 'Pulso Umbrío', type: 'Siniestro', power: 80, maxPP: 15, desc: 'Onda expansiva de aura maligna.' },

    // Dragón / Tierra / Roca
    'Furia Dragón': { name: 'Furia Dragón', type: 'Dragón', power: 40, maxPP: 10, desc: 'Onda de choque que siempre inflige 40 de daño.' },
    'Dragoaliento': { name: 'Dragoaliento', type: 'Dragón', power: 60, maxPP: 20, desc: 'Aliento ardiente de dragón.' },
    'Garra Dragón': { name: 'Garra Dragón', type: 'Dragón', power: 80, maxPP: 15, desc: 'Desgarra al oponente con garras dragontinas.' },
    'Cometa Draco': { name: 'Cometa Draco', type: 'Dragón', power: 130, maxPP: 5, desc: 'Meteoritos incandescentes caen del cielo.' },
    'Disparo Lodo': { name: 'Disparo Lodo', type: 'Tierra', power: 55, maxPP: 15, desc: 'Lanza lodo que reduce la velocidad.' },
    'Bucle Arena': { name: 'Bucle Arena', type: 'Tierra', power: 35, maxPP: 15, desc: 'Atrapa al rival en arenas movedizas.' },
    'Terremoto': { name: 'Terremoto', type: 'Tierra', power: 100, maxPP: 10, desc: 'Sacudida sísmica colosal.' },
    'Avalancha': { name: 'Avalancha', type: 'Roca', power: 75, maxPP: 10, desc: 'Deja caer grandes rocas sobre el enemigo.' },

    // Psíquico / Lucha / Hada / Hielo
    'Confusión': { name: 'Confusión', type: 'Psíquico', power: 50, maxPP: 25, desc: 'Ataque telequinético que puede confundir.' },
    'Psicorrayo': { name: 'Psicorrayo', type: 'Psíquico', power: 65, maxPP: 20, desc: 'Rayo místico de energía mental.' },
    'Psíquico': { name: 'Psíquico', type: 'Psíquico', power: 90, maxPP: 10, desc: 'Desata una devastadora fuerza mental.' },
    'Onda Certera': { name: 'Onda Certera', type: 'Lucha', power: 120, maxPP: 5, desc: 'Concentra energía y la dispara con fuerza.' },
    'Esfera Aural': { name: 'Esfera Aural', type: 'Lucha', power: 80, maxPP: 20, desc: 'Esfera de aura que nunca falla.' },
    'A bocajarro': { name: 'A bocajarro', type: 'Lucha', power: 120, maxPP: 5, desc: 'Ataque cuerpo a cuerpo feroz sin defensa.' },
    'Brillo Mágico': { name: 'Brillo Mágico', type: 'Hada', power: 80, maxPP: 10, desc: 'Destello cegador de luz feérica.' },
    'Fuerza Lunar': { name: 'Fuerza Lunar', type: 'Hada', power: 95, maxPP: 15, desc: 'Usa el poder de la luna contra el rival.' },
    'Rayo Hielo': { name: 'Rayo Hielo', type: 'Hielo', power: 90, maxPP: 10, desc: 'Rayo gélido que congela al oponente.' }
};

// Species-specific learnsets by level
const SPECIES_LEARNSETS = {
    // Charmander line (4, 5, 6)
    4: [
        { level: 1, move: 'Arañazo' },
        { level: 4, move: 'Ascuas' },
        { level: 12, move: 'Giro Fuego' },
        { level: 19, move: 'Colmillo Ígneo' },
        { level: 28, move: 'Lanzallamas' }
    ],
    5: [
        { level: 1, move: 'Arañazo' },
        { level: 1, move: 'Ascuas' },
        { level: 19, move: 'Colmillo Ígneo' },
        { level: 25, move: 'Puño Fuego' },
        { level: 33, move: 'Lanzallamas' }
    ],
    6: [
        { level: 1, move: 'Lanzallamas' },
        { level: 36, move: 'Garra Dragón' },
        { level: 45, move: 'Llamarada' },
        { level: 55, move: 'Hiperrayo' }
    ],

    // Bulbasaur line (1, 2, 3)
    1: [
        { level: 1, move: 'Placaje' },
        { level: 7, move: 'Látigo Cepa' },
        { level: 15, move: 'Hoja Afilada' },
        { level: 25, move: 'Bomba Germen' }
    ],
    2: [
        { level: 1, move: 'Placaje' },
        { level: 1, move: 'Látigo Cepa' },
        { level: 18, move: 'Hoja Afilada' },
        { level: 30, move: 'Gigadrenado' }
    ],
    3: [
        { level: 1, move: 'Hoja Afilada' },
        { level: 32, move: 'Gigadrenado' },
        { level: 45, move: 'Rayo Solar' },
        { level: 55, move: 'Terremoto' }
    ],

    // Squirtle line (7, 8, 9)
    7: [
        { level: 1, move: 'Placaje' },
        { level: 6, move: 'Pistola Agua' },
        { level: 13, move: 'Burbuja' },
        { level: 22, move: 'Hidropulso' }
    ],
    8: [
        { level: 1, move: 'Pistola Agua' },
        { level: 16, move: 'Hidropulso' },
        { level: 25, move: 'Cascada' },
        { level: 33, move: 'Surf' }
    ],
    9: [
        { level: 1, move: 'Surf' },
        { level: 36, move: 'Cascada' },
        { level: 45, move: 'Hidrobomba' },
        { level: 55, move: 'Rayo Hielo' }
    ],

    // Pikachu line (172, 25, 26)
    172: [
        { level: 1, move: 'Impactrueno' },
        { level: 5, move: 'Ataque Rápido' },
        { level: 10, move: 'Chispa' }
    ],
    25: [
        { level: 1, move: 'Impactrueno' },
        { level: 5, move: 'Ataque Rápido' },
        { level: 13, move: 'Chispa' },
        { level: 21, move: 'Rayo' },
        { level: 32, move: 'Trueno' }
    ],
    26: [
        { level: 1, move: 'Ataque Rápido' },
        { level: 1, move: 'Rayo' },
        { level: 36, move: 'Puño Trueno' },
        { level: 48, move: 'Trueno' },
        { level: 55, move: 'Hiperrayo' }
    ],

    // Gastly line (92, 93, 94)
    92: [
        { level: 1, move: 'Lengüetazo' },
        { level: 8, move: 'Tinieblas' },
        { level: 18, move: 'Bola Sombra' },
        { level: 26, move: 'Pulso Umbrío' }
    ],
    93: [
        { level: 1, move: 'Lengüetazo' },
        { level: 1, move: 'Tinieblas' },
        { level: 20, move: 'Bola Sombra' },
        { level: 30, move: 'Pulso Umbrío' }
    ],
    94: [
        { level: 1, move: 'Bola Sombra' },
        { level: 35, move: 'Pulso Umbrío' },
        { level: 45, move: 'Psíquico' },
        { level: 55, move: 'Rayo' }
    ],

    // Gible line (443, 444, 445)
    443: [
        { level: 1, move: 'Placaje' },
        { level: 6, move: 'Bucle Arena' },
        { level: 13, move: 'Disparo Lodo' },
        { level: 19, move: 'Garra Dragón' }
    ],
    444: [
        { level: 1, move: 'Disparo Lodo' },
        { level: 24, move: 'Garra Dragón' },
        { level: 32, move: 'Triturar' },
        { level: 40, move: 'Terremoto' }
    ],
    445: [
        { level: 1, move: 'Garra Dragón' },
        { level: 48, move: 'Terremoto' },
        { level: 55, move: 'Triturar' },
        { level: 65, move: 'Cometa Draco' }
    ],

    // Eevee (#133) & Eeveelutions
    133: [
        { level: 1, move: 'Placaje' },
        { level: 5, move: 'Ataque Rápido' },
        { level: 14, move: 'Mordisco' },
        { level: 25, move: 'Doble Filo' }
    ],
    134: [ // Vaporeon
        { level: 1, move: 'Pistola Agua' },
        { level: 15, move: 'Hidropulso' },
        { level: 30, move: 'Surf' },
        { level: 45, move: 'Hidrobomba' }
    ],
    135: [ // Jolteon
        { level: 1, move: 'Impactrueno' },
        { level: 15, move: 'Chispa' },
        { level: 30, move: 'Rayo' },
        { level: 45, move: 'Trueno' }
    ],
    136: [ // Flareon
        { level: 1, move: 'Ascuas' },
        { level: 15, move: 'Colmillo Ígneo' },
        { level: 30, move: 'Lanzallamas' },
        { level: 45, move: 'Llamarada' }
    ],
    196: [ // Espeon
        { level: 1, move: 'Confusión' },
        { level: 15, move: 'Psicorrayo' },
        { level: 30, move: 'Psíquico' },
        { level: 45, move: 'Brillo Mágico' }
    ],
    197: [ // Umbreon
        { level: 1, move: 'Mordisco' },
        { level: 15, move: 'Tinieblas' },
        { level: 30, move: 'Triturar' },
        { level: 45, move: 'Pulso Umbrío' }
    ],
    470: [ // Leafeon
        { level: 1, move: 'Látigo Cepa' },
        { level: 15, move: 'Hoja Afilada' },
        { level: 30, move: 'Bomba Germen' },
        { level: 45, move: 'Rayo Solar' }
    ],
    471: [ // Glaceon
        { level: 1, move: 'Ataque Rápido' },
        { level: 15, move: 'Mordisco' },
        { level: 30, move: 'Rayo Hielo' },
        { level: 45, move: 'Rayo Hielo' }
    ],
    700: [ // Sylveon
        { level: 1, move: 'Ataque Rápido' },
        { level: 15, move: 'Rapidez' },
        { level: 30, move: 'Brillo Mágico' },
        { level: 45, move: 'Fuerza Lunar' }
    ],

    // Ralts line (280, 281, 282, 475)
    280: [
        { level: 1, move: 'Confusión' },
        { level: 10, move: 'Psicorrayo' },
        { level: 18, move: 'Brillo Mágico' }
    ],
    281: [
        { level: 1, move: 'Confusión' },
        { level: 20, move: 'Psicorrayo' },
        { level: 28, move: 'Psíquico' }
    ],
    282: [ // Gardevoir
        { level: 1, move: 'Psíquico' },
        { level: 35, move: 'Brillo Mágico' },
        { level: 48, move: 'Fuerza Lunar' },
        { level: 60, move: 'Bola Sombra' }
    ],
    475: [ // Gallade
        { level: 1, move: 'Psicorrayo' },
        { level: 35, move: 'A bocajarro' },
        { level: 48, move: 'Garra Dragón' },
        { level: 60, move: 'Psíquico' }
    ],

    // Riolu & Lucario (447, 448)
    447: [
        { level: 1, move: 'Ataque Rápido' },
        { level: 12, move: 'Mordisco' },
        { level: 20, move: 'Esfera Aural' }
    ],
    448: [
        { level: 1, move: 'Esfera Aural' },
        { level: 32, move: 'Puño Trueno' },
        { level: 45, move: 'A bocajarro' },
        { level: 55, move: 'Pulso Umbrío' }
    ],

    // Dratini, Dragonair, Dragonite (147, 148, 149)
    147: [
        { level: 1, move: 'Placaje' },
        { level: 10, move: 'Furia Dragón' },
        { level: 20, move: 'Dragoaliento' }
    ],
    148: [
        { level: 1, move: 'Dragoaliento' },
        { level: 25, move: 'Surf' },
        { level: 35, move: 'Garra Dragón' }
    ],
    149: [
        { level: 1, move: 'Garra Dragón' },
        { level: 45, move: 'Lanzallamas' },
        { level: 55, move: 'Cometa Draco' },
        { level: 65, move: 'Hiperrayo' }
    ],

    // Larvitar, Pupitar, Tyranitar (246, 247, 248)
    246: [
        { level: 1, move: 'Mordisco' },
        { level: 10, move: 'Bucle Arena' },
        { level: 20, move: 'Avalancha' }
    ],
    247: [
        { level: 1, move: 'Mordisco' },
        { level: 25, move: 'Avalancha' },
        { level: 35, move: 'Triturar' }
    ],
    248: [
        { level: 1, move: 'Triturar' },
        { level: 45, move: 'Avalancha' },
        { level: 55, move: 'Terremoto' },
        { level: 65, move: 'Hiperrayo' }
    ],

    // Cyndaquil line (155, 156, 157)
    155: [
        { level: 1, move: 'Placaje' },
        { level: 6, move: 'Ascuas' },
        { level: 18, move: 'Ataque Rápido' },
        { level: 24, move: 'Lanzallamas' }
    ],
    156: [
        { level: 1, move: 'Ascuas' },
        { level: 19, move: 'Ataque Rápido' },
        { level: 28, move: 'Puño Fuego' },
        { level: 35, move: 'Lanzallamas' }
    ],
    157: [
        { level: 1, move: 'Lanzallamas' },
        { level: 40, move: 'Puño Trueno' },
        { level: 48, move: 'Llamarada' },
        { level: 60, move: 'Terremoto' }
    ],

    // Torchic line (255, 256, 257)
    255: [
        { level: 1, move: 'Arañazo' },
        { level: 6, move: 'Ascuas' },
        { level: 16, move: 'Ataque Rápido' },
        { level: 25, move: 'Giro Fuego' }
    ],
    256: [
        { level: 1, move: 'Ascuas' },
        { level: 18, move: 'Doble Filo' },
        { level: 28, move: 'Puño Fuego' },
        { level: 36, move: 'Lanzallamas' }
    ],
    257: [
        { level: 1, move: 'Lanzallamas' },
        { level: 40, move: 'A bocajarro' },
        { level: 50, move: 'Llamarada' },
        { level: 60, move: 'Terremoto' }
    ],

    // Mudkip line (258, 259, 260)
    258: [
        { level: 1, move: 'Placaje' },
        { level: 6, move: 'Pistola Agua' },
        { level: 15, move: 'Disparo Lodo' },
        { level: 24, move: 'Hidropulso' }
    ],
    259: [
        { level: 1, move: 'Pistola Agua' },
        { level: 18, move: 'Disparo Lodo' },
        { level: 28, move: 'Cascada' },
        { level: 36, move: 'Terremoto' }
    ],
    260: [
        { level: 1, move: 'Cascada' },
        { level: 38, move: 'Terremoto' },
        { level: 50, move: 'Hidrobomba' },
        { level: 60, move: 'Rayo Hielo' }
    ],

    // Mewtwo (#150)
    150: [
        { level: 1, move: 'Psíquico' },
        { level: 20, move: 'Bola Sombra' },
        { level: 40, move: 'Esfera Aural' },
        { level: 60, move: 'Rayo Hielo' },
        { level: 80, move: 'Hiperrayo' }
    ]
};

// Type Effectiveness Matrix (Attacker Type -> Defender Type -> Multiplier)
const TYPE_CHART = {
    'Normal': { 'Roca': 0.5, 'Fantasma': 0, 'Acero': 0.5 },
    'Fuego': { 'Fuego': 0.5, 'Agua': 0.5, 'Planta': 2.0, 'Hielo': 2.0, 'Bicho': 2.0, 'Roca': 0.5, 'Dragón': 0.5, 'Acero': 2.0 },
    'Agua': { 'Fuego': 2.0, 'Agua': 0.5, 'Planta': 0.5, 'Tierra': 2.0, 'Roca': 2.0, 'Dragón': 0.5 },
    'Planta': { 'Fuego': 0.5, 'Agua': 2.0, 'Planta': 0.5, 'Veneno': 0.5, 'Tierra': 2.0, 'Volador': 0.5, 'Bicho': 0.5, 'Roca': 2.0, 'Dragón': 0.5, 'Acero': 0.5 },
    'Eléctrico': { 'Agua': 2.0, 'Eléctrico': 0.5, 'Planta': 0.5, 'Tierra': 0, 'Volador': 2.0, 'Dragón': 0.5 },
    'Hielo': { 'Fuego': 0.5, 'Agua': 0.5, 'Planta': 2.0, 'Hielo': 0.5, 'Tierra': 2.0, 'Volador': 2.0, 'Dragón': 2.0, 'Acero': 0.5 },
    'Lucha': { 'Normal': 2.0, 'Hielo': 2.0, 'Veneno': 0.5, 'Volador': 0.5, 'Psíquico': 0.5, 'Bicho': 0.5, 'Roca': 2.0, 'Fantasma': 0, 'Siniestro': 2.0, 'Acero': 2.0, 'Hada': 0.5 },
    'Veneno': { 'Planta': 2.0, 'Veneno': 0.5, 'Tierra': 0.5, 'Roca': 0.5, 'Fantasma': 0.5, 'Acero': 0, 'Hada': 2.0 },
    'Tierra': { 'Fuego': 2.0, 'Eléctrico': 2.0, 'Planta': 0.5, 'Veneno': 2.0, 'Volador': 0, 'Bicho': 0.5, 'Roca': 2.0, 'Acero': 2.0 },
    'Volador': { 'Eléctrico': 0.5, 'Planta': 2.0, 'Lucha': 2.0, 'Bicho': 2.0, 'Roca': 0.5, 'Acero': 0.5 },
    'Psíquico': { 'Lucha': 2.0, 'Veneno': 2.0, 'Psíquico': 0.5, 'Siniestro': 0, 'Acero': 0.5 },
    'Bicho': { 'Fuego': 0.5, 'Planta': 2.0, 'Lucha': 0.5, 'Veneno': 0.5, 'Volador': 0.5, 'Fantasma': 0.5, 'Acero': 0.5, 'Hada': 0.5, 'Psíquico': 2.0, 'Siniestro': 2.0 },
    'Roca': { 'Fuego': 2.0, 'Hielo': 2.0, 'Lucha': 0.5, 'Tierra': 0.5, 'Volador': 2.0, 'Bicho': 2.0, 'Acero': 0.5 },
    'Fantasma': { 'Normal': 0, 'Psíquico': 2.0, 'Fantasma': 2.0, 'Siniestro': 0.5 },
    'Dragón': { 'Dragón': 2.0, 'Acero': 0.5, 'Hada': 0 },
    'Siniestro': { 'Lucha': 0.5, 'Psíquico': 2.0, 'Fantasma': 2.0, 'Siniestro': 0.5, 'Hada': 0.5 },
    'Acero': { 'Fuego': 0.5, 'Agua': 0.5, 'Eléctrico': 0.5, 'Hielo': 2.0, 'Roca': 2.0, 'Acero': 0.5, 'Hada': 2.0 },
    'Hada': { 'Fuego': 0.5, 'Lucha': 2.0, 'Veneno': 0.5, 'Dragón': 2.0, 'Siniestro': 2.0, 'Acero': 0.5 }
};

// Helper: Get multiplier for attack type vs defender type
function getTypeMultiplier(attackType, defenderType) {
    if (!TYPE_CHART[attackType]) return 1.0;
    const mult = TYPE_CHART[attackType][defenderType];
    return mult !== undefined ? mult : 1.0;
}

// Helper: Get moves that a species unlocks up to a given level
function getUnlockedMovesForSpecies(speciesId, currentLevel) {
    const list = SPECIES_LEARNSETS[speciesId] || SPECIES_LEARNSETS[4] || [];
    return list
        .filter(item => item.level <= currentLevel)
        .map(item => item.move);
}

// Helper: Instantiate full move object with fresh currentPP
function createMoveInstance(moveName) {
    const base = MOVES_DATABASE[moveName] || MOVES_DATABASE['Placaje'];
    return {
        name: base.name,
        type: base.type,
        power: base.power,
        maxPP: base.maxPP,
        currentPP: base.maxPP,
        desc: base.desc
    };
}

module.exports = {
    MOVES_DATABASE,
    MOVES_CATALOG: MOVES_DATABASE,
    SPECIES_LEARNSETS,
    TYPE_CHART,
    getTypeMultiplier,
    getUnlockedMovesForSpecies,
    createMoveInstance
};
