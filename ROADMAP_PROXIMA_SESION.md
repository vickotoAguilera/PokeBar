# 📋 Roadmap & Plan de Trabajo — Próxima Sesión
## Proyecto: PokeTokenBar Windows 2.2

Este documento contiene la planificación técnica detallada de las tres características acordadas para desarrollar en la siguiente sesión de trabajo:

---

## 🎯 1. Sistema de Caja del PC Real (PC Storage Persistente)

### A. Diagnóstico de la Sesión Actual:
- Al transferir un Pokémon desde la Pokédex se creaba una instancia genérica en nivel 1 con 0 EXP en lugar de mover a tu compañero real.
- Era posible clonar Pokémon iguales si se presionaba repetidas veces "Al Equipo".
- No existía un botón para "Guardar en PC" que permitiera retirar un Pokémon del equipo y dejar la ranura libre para incubar o entrenar a otro.

### B. Especificación para la Próxima Sesión:
1. **Persistencia Completa de Estadísticas:**
   - Cada Pokémon almacenado en la Caja del PC conservará su objeto completo:
     - `name`: Nombre (Gible, Gastly, etc.)
     - `speciesId`: ID oficial de PokéAPI
     - `level`: Nivel exacto (ej. Lv. 15, Lv. 19)
     - `usedAtStage`: Experiencia acumulada exacta
     - `stageIndex`: Fase evolutiva alcanzada
     - `nature`: Naturaleza
     - `isShiny`: Condición variocolor
2. **Prevención de Duplicados / Clones:**
   - En la interfaz de la Pokédex / Caja, si un Pokémon ya está presente en tu equipo de 6, su botón cambiará a **`✓ En el Equipo`** (deshabilitado o para seleccionarlo como líder), impidiendo la creación de clones repetidos.
3. **Botón de Guardado en el PC:**
   - En la ranura del Pokémon y en la pestaña **Equipo & Info**, se añadirá el botón **`📥 Guardar en Caja PC`**.
   - Al presionarlo, el Pokémon se traslada a la Caja con todo su progreso congelado y la ranura del equipo queda disponible (`+`) para poner otro Pokémon o incubar un huevo nuevo.

---

## 🐾 2. Corrección del Giro de Vista en Modo Caminar (Sprite Flip)

### A. Diagnóstico Técnico:
- En `main.js` se emite correctamente el evento `walker-flip (-1 / 1)` cuando el Pokémon rebota en los bordes de la pantalla.
- Sin embargo, en `renderer.js` se intentaba aplicar `pokemonSprite.style.transform = 'scaleX(-1)'`, el cual entra en conflicto con la animación CSS `@keyframes walk-bob` (que redefine `transform: translateY(...)` en cada fotograma del ciclo de caminata y sobreescribe el giro).
- Esto provocaba que al volver hacia el lado contrario caminara de espaldas (*moonwalking*).

### B. Solución para la Próxima Sesión:
- **Separación de capas de transformación:**
  - Aplicar el giro horizontal en el contenedor padre: `#spriteStage.style.transform = 'scaleX(-1)'` o `#spriteStage.classList.add('facing-left')`.
  - O integrar el giro directamente en la variable CSS de la animación:
    ```css
    @keyframes walk-bob {
        0%, 100% { transform: var(--sprite-flip, scaleX(1)) translateY(0); }
        50% { transform: var(--sprite-flip, scaleX(1)) translateY(-5px); }
    }
    ```
- De este modo, al tocar el borde derecho o izquierdo, el Pokémon se volteará de forma instantánea y natural mirando siempre hacia la dirección a la que avanza.

---

## ⚔️ 3. Motor de Batallas por Turnos & Encuentros Salvajes (Fase 2)

### A. Especificación del Sistema de Combate:
1. **Pool de 4 Movimientos Oficiales (PokéAPI):**
   - Cada especie consultará sus ataques aprendidos por nivel en PokéAPI:
     - Nombre del ataque (Placaje, Ascuas, Pistola Agua, Rayo Confuso, Garra Dragón, etc.).
     - Tipo elemental (Fuego, Agua, Fantasma, Dragón, etc.).
     - Potencia de daño (Power).
     - Puntos de Poder (PP máximos y actuales).
2. **Encuentros y Rivales en el Escritorio (Implementado y Verificado):**
   - Durante el Modo Paseo Libre, tu Pokémon camina por la pantalla y puede encontrarse con Pokémon rivales del pool salvaje.
   - **¡El Pokémon se detiene automáticamente al encontrarse con el rival!**
   - Se abre el Face-Off en el escritorio mostrando a tu Pokémon mirando al rival, el rival mirándolo de frente, la alerta `⚔️ ¡[Rival] Salvaje! (Nv. [X])`, el signo `❗` sobre tu Pokémon, y los botones interactivos `[⚔️ ¡Luchar!]` y `[🏃 Huir]`.
   - Al pulsar `[⚔️ ¡Luchar!]` o hacer clic directamente sobre el rival, se inicia el combate por turnos contra ese rival exacto.
   - Al pulsar `[🏃 Huir]`, el rival desaparece y tu Pokémon reanuda su caminata.
   - También es posible forzar un encuentro en cualquier momento con el botón `⚔️ Generar Rival Salvaje` en las herramientas del HUD o en el menú contextual de la barra de tareas.
3. **Interfaz de Batalla por Turnos:**
   - Panel emergente de combate clásico estilo GBA/Nintendo DS:
     - Barra de vida (HP) de tu líder y del rival.
     - 4 botones de acción: **Luchar**, **Mochila (Poké Balls/Pociones)**, **Cambiar Pokémon**, **Huir**.
   - Si debilitas al Pokémon rival, todo tu equipo gana una bonificación masiva de EXP.
   - Posibilidad de lanzarle una Poké Ball para capturarlo y enviarlo directamente a tu equipo o a tu Caja del PC.

---

## 🥊 4. Lógica de Gestión de Ataques (Aprender, Cambiar y Olvidar)

### A. Reglas de Diseño de Movimientos:
1. **Sin Restricciones de MOs (Máquinas Ocultas):**
   - En este juego **no existen las limitaciones de MOs (HMs)** como Corte, Surf o Vuelo que bloqueaban el olvido de ataques.
   - Cualquier movimiento que el Pokémon pueda usar se podrá equipar, cambiar o desequipar libremente en cualquier momento sin objetos ni penalizaciones.
2. **Pool Activo de 4 Ataques:**
   - Cada Pokémon podrá tener un máximo de 4 ataques activos simultáneamente para el combate.
3. **Aprendizaje y Reemplazo al Subir de Nivel:**
   - Al alcanzar un nivel que desbloquea un nuevo ataque según PokéAPI:
     - Si tiene menos de 4 movimientos: se equipa automáticamente.
     - Si ya tiene 4 movimientos llenos: aparecerá un aviso modal que preguntará:
       > *"¡Tu Pokémon quiere aprender [Nuevo Ataque]! ¿Deseas olvidar un movimiento actual para hacerle espacio?"*
     - El usuario podrá seleccionar con un clic cuál de los 4 ataques reemplazar o decidir no aprenderlo.
4. **Selector de Movimientos Desbloqueados:**
   - En la pestaña de información del Pokémon habrá una lista con todos los ataques que ha aprendido a lo largo de sus niveles, permitiendo intercambiar entre ellos libremente en el pool de 4.

---

## 🧬 5. Evolución por Niveles & Selector de Ramificaciones (Ejemplo: Eevee)

### A. Adiós a Piedras y Requisitos Raros:
- **Todo evoluciona por nivel:** Se eliminan los requerimientos de piedras evolutivas (Piedra Hoja, Piedra Fuego, Piedra Trueno, etc.) o condiciones oscuras de intercambio.
- Al acumular la EXP requerida por tokens y llegar al nivel evolutivo, el Pokémon podrá evolucionar de manera 100% natural.

### B. Ramificaciones Evolutivas (Elección de Rama):
1. **Selector de Evoluciones Múltiples:**
   - Si una especie tiene múltiples posibles evoluciones (como **Eevee** que puede ser *Vaporeon*, *Jolteon*, *Flareon*, *Espeon*, *Umbreon*, *Leafeon*, *Glaceon* o *Sylveon*, o especies como Tyrogue, Poliwhirl, Gloom, etc.):
   - Al alcanzar el nivel de evolución, se desplegará una ventana interactiva mostrando:
     - Tarjetas visuales de **todas las ramas evolutivas disponibles**.
     - El sprite oficial de cada evolución y su tipo elemental.
     - Botón para **"Elegir esta Evolución"**.
2. **Permanencia y Crianza Coleccionable:**
   - La evolución elegida para ese ejemplar en específico es permanente (si evolucionas tu Eevee a Vaporeon, ese compañero se queda como Vaporeon).
   - Para conseguir las demás evoluciones (ej. Flareon o Jolteon), el jugador simplemente cría o incuba un nuevo huevo de Eevee desde la Bolsa de Huevos, lo entrena hasta el nivel evolutivo y selecciona la rama siguiente para completar la Pokédex.

## 🚀 6. Mejoras Implementadas y Resueltas (Sesión 2.3)

### ✅ A. Rebalanceo de Experiencia en Batalla (Poca EXP Proporcional):
- Se corrigió la fórmula en `src/battle.js`: antes daba `wildLevel * 350,000` (millones de EXP que inflaban y rompían la progresión).
- Ahora otorga una recompensa moderada y equilibrada: `Math.round(wildLevel * 250 + 200)` (de 450 a ~3,000 EXP según nivel), ideal para complementar el progreso sin regalar evoluciones inmediatas.

### ✅ B. Desacople de EXP de Batalla & Corrección de Congelamiento de Tokens:
- **Causa Raíz Resuelta:** El motor de batalla sumaba la EXP directamente a `lastSeenTotalTokens` del escáner de tokens. Como el escáner leía un número menor, `delta` quedaba en 0 para siempre y los Pokémon (incluyendo Cyndaquil) nunca volvían a ganar experiencia de código.
- **Solución:**
  1. Se creó el método independiente `companion.awardBattleExp(expAmount, winningSlot)` en `src/pokemon.js`, que suma experiencia a `usedAtStage` y activa el Repartir Experiencia (50% al equipo) **sin tocar** los tokens del escáner.
  2. En `updateWithTokens`, se añadió protección de auto-resincronización: si los tokens del escáner son menores a los guardados, se sincroniza automáticamente en el siguiente tick, garantizando que el usuario siempre gane EXP por cada token programado.

### ✅ C. Arena de Preparación de Combate (Sin Batallas Aleatorias Forzadas):
- Al pulsar **`⚔️ Combate`** o abrir la pestaña, ya no se lanza un combate aleatorio de inmediato sin previo aviso.
- Ahora se abre la **Arena de Combate (Lobby de Preparación)** mostrando:
  - Miniatura de tu Pokémon líder listo para luchar.
  - Nivel, naturaleza y condición.
  - Sus 4 ataques activos equipados.
  - Botón prominente **`⚔️ ¡Buscar Rival Salvaje!`**, que inicia el encuentro únicamente cuando el jugador lo decide.

### ✅ D. Encuentros Caminantes con Animación de Aproximación:
- En el Modo Paseo Libre (`🐾`), al surgir un encuentro salvaje:
  1. El Pokémon rival aparece en el extremo opuesto caminando hacia el nuestro con animación fluida de pasos.
  2. Nuestro Pokémon da un paso al frente para interceptarlo.
  3. **Al cruzarse frente a frente, ambos se detienen.**
  4. Salta el signo `❗` sobre nuestro compañero, aparece el emblema `VS`, se reproduce el grito del rival y se muestran los botones `[⚔️ ¡Luchar!]` y `[🏃 Huir]`.

### ✅ E. Niveles Oficiales de Evolución & Indicador en la Interfaz:
- Se implementó la tabla completa `EVOLUTION_TARGETS`:
  - **Cyndaquil:** Nv. 14 (Quilava) $\to$ Nv. 36 (Typhlosion)
  - **Charmander:** Nv. 16 (Charmeleon) $\to$ Nv. 36 (Charizard)
  - **Bulbasaur:** Nv. 16 (Ivysaur) $\to$ Nv. 32 (Venusaur)
  - **Squirtle:** Nv. 16 (Wartortle) $\to$ Nv. 36 (Blastoise)
  - **Gastly:** Nv. 25 (Haunter) $\to$ Nv. 36 (Gengar)
  - **Gible:** Nv. 24 (Gabite) $\to$ Nv. 48 (Garchomp)
  - **Pikachu:** Nv. 15 (Pikachu) $\to$ Nv. 30 (Raichu)
  - **Eevee:** Nv. 25 (Selector de Ramificaciones)
  - **Torchic / Mudkip:** Nv. 16 $\to$ Nv. 36
  - **Dratini / Larvitar:** Nv. 30 $\to$ Nv. 55
- En la tarjeta del HUD ahora se muestra claramente debajo del nombre:
  `Evoluciona a Quilava al Nv. 14`, `Evoluciona a Typhlosion al Nv. 36`, o `Forma Final (Graduación al Nv. 100)`.
- El progreso del nivel avanza de forma canónica y progresiva entre los niveles de cada fase evolutiva.
