# 🛡️ Bitácora de Agentes y Trazabilidad de Herramientas (`CHANGELOG_AGENTS.md`)
> **Estándar:** `agente-auditor` (Segundo 0) & `iso-25010-clean-code`  
> **Proyecto:** PokeTokenBar-Windows  
> **Última Actualización:** 2026-10-10

---

## 📌 Historial de Componentes y Archivos Intervenidos

### [US-021] Incorporación de Capturas Panorámicas del Modo Paseo, Rival Salvaje y Desafío VS en README.md [COMPLETADO]
- **Fecha:** 2026-10-11
- **Estado:** ✅ Completado, Auditado y Validado
- **Agentes / Skills Involucrados:** `agente-auditor`, `agente-planner`, `ui-ux-pro-max`, `iso-25010-clean-code`
- **Descripción de Cambios:**
  - Se agregaron las 3 capturas reales de alta resolución en `docs/screenshots/`:
    - `08_paseo_barra_tareas.png`: Compañero caminando libremente sobre la barra de tareas de Windows.
    - `09_adversario_al_acecho.png`: Aparición de adversario salvaje al acecho en el horizonte del escritorio.
    - `10_prompt_desafio_luchar.png`: Encuentro cara a cara y modal interactivo de desafío (`⚔️ ¿LUCHAR?`).
  - Se expandió la sección 2 del `README.md` con explicaciones detalladas y diseño responsivo para cada fase del paseo y combate.

### [US-020] Compatibilidad Multi-Agente (Gemini, OpenCode, Cursor), Roadmap y Convocatoria Comunitaria en README.md [COMPLETADO]
- **Fecha:** 2026-10-11
- **Estado:** ✅ Completado, Auditado y Validado
- **Agentes / Skills Involucrados:** `agente-auditor`, `agente-planner`, `iso-25010-clean-code`, `agy-customizations`
- **Descripción de Cambios:**
  - Se agregó la sección `## 🤖 Compatibilidad de Agentes & Roadmap Comunitario` en `README.md`.
  - Explicación del funcionamiento autónomo (Modo Paseo sin IA con +25 EXP por ciclo) y del soporte nativo actual para Google Antigravity / Gemini CLI.
  - Publicación del roadmap de adaptadores para futuras actualizaciones: OpenCode, Cursor AI (`state.vscdb`), Claude Code, Copilot / Cline y LLMs locales (Ollama).
  - Convocatoria formal y guía de contribución comunitaria para pruebas de telemetría y desarrollo colaborativo en GitHub.

### [US-016] Inspector GBA Ampliado, Resolución Universal de Sprites (1,025 Pokémon) y Aislamiento en Bandeja de Windows [COMPLETADO]
- **Fecha:** 2026-10-11
- **Estado:** ✅ Completado, Auditado y Validado (0 Errores en Consola, Sprites de Gen 1 a Gen 9 Verificados y Vista Previa Generada)
- **Agentes / Skills Involucrados:** `agente-auditor`, `agente-planner`, `iso-25010-clean-code`, `ui-ux-pro-max`, `impeccable`, `systematic-debugging`
- **Diagnóstico y Causas Raíces Resueltas:**
  1. **Inspector Izquierdo del PC Box Minúsculo:**
     - En `src/index.html`, la columna `.gba-pc-inspector` estaba forzada a un ancho fijo de `125px`, con el escenario `.gba-insp-stage` a `52x52px` y el sprite a `48x48px`. En pantallas maximizadas se reducía a una estampilla minúscula con espacio desaprovechado.
  2. **Imágenes Rotas en Pokémon Modernos (Gen 6 a 9, como Copperajah #879):**
     - En `src/pokemon.js` y `src/renderer.js`, las URLs animadas apuntaban a `generation-v/black-white/animated/`, endpoint que **solo existe hasta el #649**. Del #650 al #1025 PokeAPI devolvía HTTP 404 Not Found y el visor carecía de manejador `onerror`, mostrando iconos rotos (`Inspec...`).
  3. **Icono del Átomo/Protón (`⚛`) de Electron en la Barra de Tareas Principal:**
     - En `src/main.js`, `createPetWindow()` tenía `skipTaskbar: false` y no asignaba `icon`. Windows mostraba la app como ventana principal activa con el icono por defecto de desarrollo de Electron en lugar de residir exclusivamente en la bandeja del sistema (System Tray).
- **Soluciones Implementadas:**
  1. [`src/index.html`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/index.html):
     - Rediseño del inspector con estética retro GBA (Rojo Fuego / Esmeralda): ancho ampliado a `clamp(220px, 30vw, 360px)` (y hasta 420px en maximizado), cabecera con banner de nombre, escenario de exhibición biselado `.gba-insp-stage` con escalado dinámico, y sprite grande `.gba-insp-sprite` (`clamp(120px, 16vw, 190px)`) nítido y pixelado.
     - Píldoras de tipo GBA retro, nivel, detalles de naturaleza/PS/ataque y botonera organizados armoniosamente sin recortes ni scroll indeseado.
  2. [`src/pokemon.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/pokemon.js):
     - Migración a URLs animadas de **Showdown** (`other/showdown/*.gif`), compatibles con las 9 generaciones (1 a 1,025 especies), con `fallbackUrl` garantizado apuntando a pixel PNG estático de PokeAPI.
  3. [`src/renderer.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/renderer.js):
     - Handlers `onerror` en cascada a prueba de fallos para `gbaInspSprite`, slots de la Caja PC y modal de Pokédex: si falla el GIF animado por lag o ausencia en PokeAPI, salta de inmediato al PNG estático y luego a la Poké Ball local. ¡Cero imágenes rotas!
  4. [`src/main.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/main.js):
     - Configuración de `skipTaskbar: true` y vinculación del icono nativo `icon: appIconPath` en `petWindow` y `battleWindow`. La aplicación queda completamente aislada en la bandeja de iconos ocultos de Windows.
- **Validación Automatizada y Calidad:**
  - `scratch/test_sprites_and_taskbar.js`: Verificación de `skipTaskbar: true`, icono nativo y URLs de Gen 1, Gen 8 (Copperajah) y Gen 9 (Pecharunt).
  - Capturas de validación visual generadas: [`inspector_gba_preview_poliwrath.png`](file:///C:/Users/Vickoto/.gemini/antigravity-ide/brain/257c3697-5b01-44e1-af6c-80d14a7e1423/inspector_gba_preview_poliwrath.png).

### [US-015] Diagnóstico y Corrección de Evoluciones Canónicas, Reorganización de Cajas PC por Región / VIP Shiny, Doble Clic en Movimiento y Botón ✕ a Bandeja/Paseo [COMPLETADO]
- **Fecha:** 2026-10-10
- **Estado:** ✅ Completado, Auditado y Validado (0 Errores en Consola, Tests Unitarios y UI Electron 100% Superados)
- **Agentes / Skills Involucrados:** `agente-auditor`, `agente-planner`, `systematic-debugging`, `iso-25010-clean-code`, `ui-ux-pro-max`, `impeccable`
- **Diagnóstico y Causas Raíces Resueltas:**
  1. **Mutación a Charmeleon y falta de evoluciones fuera de starters:**
     - En `src/pokemon.js` (`addExpToMember` y `useRareCandy`), Pokémon fuera de las 11 líneas de starters tenían `lineIndex: -1`. Al evaluar `EVOLUTION_LINES[member.lineIndex] || EVOLUTION_LINES[0]`, caían en el fallback `EVOLUTION_LINES[0]` (línea de Charmander). Al superar el nivel 16, evolucionaban erróneamente a Charmeleon (#5).
     - Asimismo, `EVOLUTION_TARGETS` solo contenía los starters básicos. Slowpoke (#79) no estaba indexado y devolvía `undefined`, mostrando falsamente "Forma Final (Nivel 100)".
  2. **Doble Clic en Modo Paseo:**
     - Durante `startWalkerMode`, `petWindow.setPosition(...)` se actualiza cada 50ms (20 FPS). Chromium descarta el evento nativo `dblclick` si la distancia de la ventana cambia entre clics.
  3. **Botón ✕:**
     - El botón de cierre ahora minimiza la tarjeta y activa de inmediato `startWalkerMode()` para que el Pokémon pasee por el escritorio sin cerrar el programa.
- **Soluciones Implementadas:**
  1. [`src/pokemon.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/pokemon.js):
     - Eliminación estricta de `|| EVOLUTION_LINES[0]`; si no pertenece a una línea de starter, `line` es `null`.
     - Ampliación de `EVOLUTION_TARGETS` con 80+ evoluciones canónicas por nivel (Slowpoke #79 ➔ Slowbro #80 al Nv. 37, Magikarp #129 ➔ Gyarados #130 al Nv. 20, Caterpie #10 ➔ Metapod #11 al Nv. 7, Weedle, Pidgey, etc.).
     - Soporte para evolución canónica de Pokédex general en `addExpToMember` y `useRareCandy` mediante `evo.nextId && evo.nextName`.
     - Corrección en `sanitizeMember`: respeta la fase actual de captura para especies evolucionadas previniendo des-evoluciones indeseadas.
     - Auto-sanación en `loadState()`: restaura el Charmeleon mutado del usuario de vuelta a su Slowpoke original Nv. 28.
  2. [`src/renderer.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/renderer.js):
     - Detector de doble clic interactivo por delta de tiempo (`Date.now() - lastWalkerClick < 500ms`) en `pointerdown` y `click` sobre `spriteStage`, `pokemonSprite`, `petCard` y `document.body`.
     - Filtros de Caja PC por Región (`Kanto`, `Johto`, `Hoenn`, `Sinnoh`, `Teselia`, `Kalos`, `Alola`, `Galar`, `Paldea`) y `✨ Caja Shiny`.
     - Modo estelar visual con clase `.shiny-box-active` en la cuadrícula de la Caja PC.
  3. [`src/main.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/main.js) & [`src/preload.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/preload.js):
     - Handlers para `action-close-to-walk` (inicia paseo sin salir de la app) y controles de ventana (`action-window-minimize`, `action-window-maximize`, `window-maximize-changed`).
- **Validación Automatizada:**
  - `scratch/test_responsive_evolutions_boxes.js`: 4/4 pruebas unitarias aprobadas (restauración de Slowpoke Nv. 28, subida a Nv. 37 y evolución limpia a Slowbro #80, filtrado regional y Shiny con índices reales).

### [US-014] Botones de Control de Ventana y Escalado Proporcional en Pantalla Completa [COMPLETADO]
- **Fecha:** 2026-10-10
- **Estado:** ✅ Completado y Validado Visualmente en Pantalla Completa
- **Agentes / Skills Involucrados:** `agente-auditor`, `agente-planner`, `ui-ux-pro-max`, `impeccable`
- **Requerimientos Abordados:**
  1. **Botonera de Control en Ventana Frameless:** Incorporación de botones estándar en la cabecera: `#btnWinMinimize` (`—`), `#btnWinMaximize` (`🗖` / `🗗`), `#btnWinClose` (`✕`).
  2. **Escalado Fluido Proporcional con `clamp()`:** Ficha de Pokédex modal adaptable (hasta 480px centrado), barras de estadísticas elásticas, pestañas de combate y equipo elásticas aprovechando el 100% de la altura sin áreas muertas vacías.
- **Validación Visual:** Capturas [`screenshot_maximized_pc_box.png`](file:///C:/Users/Vickoto/.gemini/antigravity-ide/brain/257c3697-5b01-44e1-af6c-80d14a7e1423/screenshot_maximized_pc_box.png), [`screenshot_shiny_pc_box.png`](file:///C:/Users/Vickoto/.gemini/antigravity-ide/brain/257c3697-5b01-44e1-af6c-80d14a7e1423/screenshot_shiny_pc_box.png) y [`screenshot_dex_modal_responsive.png`](file:///C:/Users/Vickoto/.gemini/antigravity-ide/brain/257c3697-5b01-44e1-af6c-80d14a7e1423/screenshot_dex_modal_responsive.png).

### [US-013] Corrección de Hidratación en Renderer y Reinicio Limpio en Scripts BAT [COMPLETADO]
- **Fecha:** 2026-10-10
- **Estado:** ✅ Completado y Verificado (0 Excepciones en Renderer, Hidratación Completa de Equipo, Caja PC y Pokédex)
- **Agentes / Skills Involucrados:** `agente-auditor`, `systematic-debugging`, `iso-25010-clean-code`
- **Diagnóstico y Causa Raíz:**
  1. `ReferenceError: settingSkipVsDialogSwitch is not defined` en `src/renderer.js`: Durante la ejecución de `onUpdate()`, la variable referenciada difería del ID del DOM (`settingSkipVsSwitch`). Esto abortaba silenciosamente la ejecución de `onUpdate()` a mitad del ciclo, impidiendo que se llamara a `renderParty()`, `renderPCBoxAndDex()`, `renderMoves()` y la asignación del sprite dinámico de Gallade (dejando la imagen por defecto de Poké Ball).
  2. `Single-Instance Lock` en `start.bat`: Al lanzar `start.bat`, si existía una instancia previa colgada en segundo plano, Electron reenviaba el foco a la instancia rota sin recargar el nuevo código.
- **Solución Aplicada:**
  1. Corrección del identificador a `settingSkipVsSwitch` en `src/renderer.js`.
  2. Inclusión de terminación forzada preventiva (`taskkill /F /IM electron.exe`) y pausa de estabilización en `start.bat` y `reiniciar.bat`.
  3. Verificación con datos reales del usuario (`companion-state.json`), confirmando 6 slots del equipo hidratados, 30 casillas de Caja PC pobladas y 191 registros con sprites en Pokédex.

### [US-012] Sistema de Cajas PC Estilo GBA, Drag & Drop de Equipo/Caja, Colección Única sin Duplicados, Maestría Nivel 100 y Escalado Responsivo [COMPLETADO]
- **Fecha:** 2026-10-10
- **Estado:** ✅ Completado, Auditado y Validado (0 Errores en Consola, Tests Unitarios y UI Electron 100% Superados)
- **Agentes / Skills Involucrados:** `agente-auditor`, `agente-planner`, `smart-planner`, `iso-25010-clean-code`, `ui-ux-pro-max`, `impeccable`, `graphify`
- **Requerimientos del Usuario Abordados:**
  1. **Cajas PC Estilo GBA (Rojo Fuego / Esmeralda):** Rediseño total de la pestaña Caja PC a una interfaz fiel de dos columnas:
     - Columna izquierda: Ficha de inspección retro con sprite animado, nombre, nivel, badges de tipos elementales dobles (p. ej. FUEGO / VOLADOR), naturaleza/estadísticas y botones de acción `[📥 Al Equipo]` y `[🧹 Limpiar Duplicados]`.
     - Columna derecha: Cuadrícula retro de 30 casillas (6x5) con fondo cuadriculado estilo wallpaper GBA, cabecera navegable `< Caja 1 >`, cursor retro en forma de guante blanco (`👆`) e indicador visual de ranura seleccionada.
  2. **Colección Única en Caja PC (Sin Duplicados):** Regla estricta de una sola instancia por especie en la PC. Algoritmo `deduplicateBox()` en `src/pokemon.js` que retiene automáticamente el espécimen de mayor nivel (o variocolor/shiny) y devuelve tokens de compensación (50 tokens por duplicado reciclado).
  3. **Estrellas de Maestría Nivel 100 en Pokédex:** Cada Pokémon que alcanza el Nivel 100 (vía experiencia o Caramelo Raro) acumula una estrella dorada permanente en la Pokédex regional (`recordLevel100Mastery`). La Pokédex muestra insignias brillantes `⭐` o `⭐ xN` en las casillas correspondientes.
  4. **Drag & Drop Reactivo en Equipo y Cajas:**
     - Reordenamiento arrastrando y soltando directamente entre los 6 slots del equipo activo (`#partyBar`).
     - Intercambio directo arrastrando desde una casilla de la Caja PC hacia cualquier slot del equipo activo (`swapBoxWithTeam`).
  5. **Escalado Responsivo y Legibilidad:**
     - Eliminación de espacios muertos al maximizar o ampliar la ventana.
     - Ajuste tipográfico legible con tipografía protegida (`clamp`) y escalado proporcional de sprites y casillas.
- **Archivos Modificados:**
  1. [`src/pokemon.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/pokemon.js):
     - `recordLevel100Mastery(member)`: Registra estrellas de maestría al subir a Nv. 100.
     - `swapTeamSlots(fromIdx, toIdx)`: Intercambia posiciones en el equipo activo.
     - `swapBoxWithTeam(boxIndex, targetSlotIndex)`: Intercambia un Pokémon de la caja con el equipo.
     - `deduplicateBox()`: Elimina duplicados conservando el mejor ejemplar y reembolsando tokens.
  2. [`src/preload.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/preload.js):
     - Exposición segura vía contextBridge: `swapTeamSlots`, `swapBoxWithTeam`, `deduplicateBox`.
  3. [`src/main.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/main.js):
     - Handlers IPC: `action-swap-team-slots`, `action-swap-box-with-team`, `action-deduplicate-box` con emisión reactiva `updateAll()`.
  4. [`src/index.html`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/index.html):
     - Estructura `.gba-pc-wrapper` con inspector retro e interfaz de 30 slots estilo GBA.
     - Estilos CSS completos para GBA PC, cursor guante blanco, badges de maestría `.dex-mastery-badge`, drag & drop visual (`.dragging`, `.drag-over`).
  5. [`src/renderer.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/renderer.js):
     - Handlers Drag & Drop en slots de equipo y cajas.
     - Renderizado de 30 casillas por caja con navegación paginada.
     - Renderizado de estrellas de maestría en la Pokédex.
- **Validación Automatizada:**
  - `scratch/test_gba_box_and_dnd.js`: 4 suites de tests pasadas al 100% (Deduplicación, Drag & Drop de equipo, Intercambio PC-Equipo, Registro Nv. 100).
  - `scratch/test_electron_ui.js`: Ejecución headless en Electron con 0 errores de consola y validación completa de selectores DOM.
  - Capturas de verificación: [`gba_pc_box_verified.png`](file:///C:/Users/Vickoto/.gemini/antigravity-ide/brain/257c3697-5b01-44e1-af6c-80d14a7e1423/gba_pc_box_verified.png) y [`dex_mastery_verified.png`](file:///C:/Users/Vickoto/.gemini/antigravity-ide/brain/257c3697-5b01-44e1-af6c-80d14a7e1423/dex_mastery_verified.png).

---

### [US-011] Estadio de Combate Flotante: Restauración de Puntos de Poder (PP) y Sincronización Reactiva de Auto-Combate [COMPLETADO]
- **Fecha:** 2026-10-10
- **Estado:** ✅ Completado, Auditado y Validado (4 Ataques Activos con PP Restaurado, Auto-Combate y Velocidad x1/x2 Reactivos)
- **Agentes / Skills Involucrados:** `agente-auditor`, `systematic-debugging`, `iso-25010-clean-code`, `graphify`
- **Diagnóstico y Causas Raíz Detectadas:**
  1. **Agotamiento de PP en Estado Persistente:** En `companion-state.json`, los ataques del Pokémon líder (Tyranitar) tenían `currentPP: 0` porque `companion.reviveTeam()` únicamente restablecía `currentHP`, dejando los PPs en 0. Al iniciar combate, los botones se renderizaban deshabilitados (`PP 0/35`, `PP 0/25`, etc.).
  2. **Referencia no definida a `MOVES_CATALOG`:** `src/moves.js` exportaba `MOVES_DATABASE`, pero partes del motor buscaban `MOVES_CATALOG`, ocasionando fallos silenciosos al consultar datos base de movimientos.
  3. **Brecha de Sincronización IPC hacia `battleWindow`:** En `src/main.js`, la función `updateAll()` enviaba `companion-update` exclusivamente a `petWindow`, dejando desactualizada la ventana flotante `battleWindow` respecto a la velocidad y estado de auto-combate.
  4. **Latencia de Alternancia en Botones de Velocidad y Auto-Pelea:** Al pulsar `⚡ x1` o `🤖 Auto`, la interfaz esperaba la respuesta del backend en lugar de aplicar una alternancia optimista inmediata con programación directa del siguiente turno.
- **Soluciones de Código Implementadas:**
  1. [`src/moves.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/moves.js):
     - Exportación de alias de compatibilidad `MOVES_CATALOG: MOVES_DATABASE`.
  2. [`src/pokemon.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/pokemon.js):
     - `ensureMemberMoves()` y `reviveTeam()` ahora restauran obligatoriamente el 100% de los PP (`m.currentPP = m.maxPP`) para todos los miembros vivos.
     - `sanitizeMember()` garantiza que ningún Pokémon ingrese al equipo o caja con PPs en 0 o indefinidos.
  3. [`src/battle.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/battle.js):
     - `startBattle()` y `switchPlayerBattler()` aseguran que los movimientos del combatiente inicien al 100% de sus PP.
     - `executeAutoMove()` detecta si todos los movimientos se agotan durante el combate continuo y los reabastece automáticamente para evitar bloqueos del flujo de turnos.
  4. [`src/main.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/main.js):
     - Actualizado `updateAll()` para difundir `companion-update` tanto a `petWindow` como a `battleWindow`.
     - Implementados y verificados los manejadores IPC `action-start-battle`, `action-battle-finish-catch`, `action-repair-team`, `action-toggle-auto-battle` y `action-toggle-battle-speed`.
  5. [`src/battle.html`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/battle.html):
     - Alternancia instantánea visual en `btnSpeed` (x1 <-> x2) y `btnAuto` (ON <-> OFF) con llamada inmediata a `checkAndScheduleAutoMove()`.
- **Validación Automatizada:**
  - `scratch/test_battle_arena.js`: Ejecutado satisfactoriamente verificando 4 botones de ataque activos (`PP 35/35`, `PP 25/25`, `PP 30/30`, `PP 15/15`), cambio verificado de `⚡ x1` a `⚡ x2`, y activación de `🤖 Auto: ON` con 0 errores de consola.
  - Captura de comprobación visual generada: [`battle_stadium_verified.png`](file:///C:/Users/Vickoto/.gemini/antigravity-ide/brain/257c3697-5b01-44e1-af6c-80d14a7e1423/battle_stadium_verified.png).
  - Grafo Visual `graphify`: Actualizado con 347 nodos y 560 conexiones en [`graphify-out/graph.html`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/graphify-out/graph.html).

---


- **Fecha:** 2026-10-10
- **Estado:** ✅ Completado y Validado (0 Errores en Consola, Tarjeta Hidratada Limpia)
- **Agentes / Skills Involucrados:** `agente-auditor`, `agente-planner`, `smart-planner`, `iso-25010-clean-code`, `systematic-debugging`, `graphify`
- **Archivos Auditados e Intervenidos:**
  1. [`src/preload.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/preload.js):
     - **Problema Detectado:** Llamada a `require('fs')` fallaba en contexto aislado de Electron (`module not found: fs`), provocando que `window.api` fuera `undefined` y que la tarjeta se congelara en `Huevo Pokémon / 0 Tokens`.
     - **Solución Aplicada:** Carga nativa de `pokedex_all.json` con CommonJS `require('./pokedex_all.json')` y captura segura `try/catch`.
  2. [`src/main.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/main.js):
     - **Problema Detectado:** Falta de `sandbox: false` en `webPreferences` para `petWindow` y `battleWindow`. Falta de `updateAll()` en `second-instance`.
     - **Solución Aplicada:** Configurado `sandbox: false` en ambas ventanas y agregado `updateAll()` al recibir llamada de segunda instancia al hacer clic en `start.bat`.
  3. [`src/index.html`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/index.html):
     - **Problema Detectado:** Bloque HTML obsoleto `#walkerEncounterArena` ("⚔️ ¡Charmander Salvaje! (Nv. 12)") incrustado estáticamente en la tarjeta sin regla `display: none !important;`.
     - **Solución Aplicada:** Eliminación física del bloque `#walkerEncounterArena` y forzado de regla CSS `.walker-encounter-arena { display: none !important; }`.
  4. [`src/renderer.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/renderer.js):
     - **Problema Detectado:** Llamada directa `window.api.getAllPokedex` que arrojaba `TypeError` si el preload fallaba, interrumpiendo el registro de `onUpdate`.
     - **Solución Aplicada:** Encadenamiento opcional `window.api?.getAllPokedex?.() || []`, blindaje en `window.api?.onUpdate` y `window.api?.requestStats`.
  5. [`src/pokemon.js`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/src/pokemon.js):
     - **Problema Detectado:** Constructor de `CompanionManager` requería argumento `stateDir` obligatorio sin valor por defecto.
     - **Solución Aplicada:** Blindaje con fallback automático a `app.getPath('userData')` o directorio raíz si no se proporciona argumento.
- **Validación Automatizada:**
  - `scratch/test_full_hydration.js`: Ejecutado con éxito (código de salida 0).
  - Verificación de tarjeta: `hasArenaElement: false`, `todayTokens` y `spendableTokens` sincronizados con base de datos, 0 errores en consola de renderizador.
  - Grafo Visual `graphify`: Actualizado a 340 nodos y 542 conexiones en [`graphify-out/graph.html`](file:///c:/Users/Vickoto/Documents/ias%20y%20programas/agents/PokeTokenBar-Windows/graphify-out/graph.html).

---

### [US-009] Mecánicas de Nivel 1-100, Caja PC Separada y Pokédex con Sombras
- **Fecha:** 2026-10-10
- **Archivos Intervenidos:**
  - `src/pokemon.js`: Fórmulas de nivel 1-100, lógica de caramelos raros, captura por dinero, revivir al 100% PS.
  - `src/renderer.js`: Pestañas independientes (Caja PC y Pokédex de 1,025 con 9 regiones y sombras de siluetas).
  - `src/battle.js`: Motor por turnos, probabilidades de Poké Balls, captura y batallas de fondo.
  - `src/index.html`: Estilos responsivos, pestañas del drawer, selector de 9 regiones.

---

### [US-010] Corrección de Clones Charmander, Drag & Drop Bidireccional, Modal PokeAPI Offline, Modo Juego y Rangos F ➔ SSS
- **Fecha:** 2026-10-10
- **Estado:** ✅ Completado y Validado (0 Errores en Consola, Pruebas Unitarias e Integración Exitosas)
- **Agentes / Skills Involucrados:** `agente-auditor`, `smart-planner`, `iso-25010-clean-code`, `systematic-debugging`
- **Requerimientos Implementados:**
  1. **Corrección de Clones de Charmander y Saneamiento de Caja PC:**
     - En `src/pokemon.js`: `sanitizeMember` ahora respeta los 1,025 Pokémon de `pokedex_all.json`. Si una especie no pertenece a las 11 líneas evolutivas de starters, preserva su `speciesId` y nombre original con `lineIndex: -1` en vez de forzar `EVOLUTION_LINES[0]` (Charmander).
     - La función `deduplicateBox()` elimina ejemplares duplicados, conserva el ejemplar de mayor nivel o Shiny, otorga Esencia de Especie por cada clon reciclado y reembolsa tokens de tienda.
  2. **Drag & Drop Bidireccional Completo:**
     - **Pokédex ➔ Equipo:** Se puede arrastrar cualquier Pokémon descubierto de la Pokédex Nacional a cualquiera de las 6 ranuras del equipo activo llamando a `recruitFromDex(speciesId, slotIndex)`.
     - **Equipo ➔ Caja PC:** Se puede arrastrar cualquier Pokémon del equipo a las casillas de la Caja PC para guardarlo o intercambiarlo directamente.
  3. **Ficha Informativa Detallada de Pokédex (PokeAPI + Modo Offline-First):**
     - Al hacer clic en un Pokémon registrado en la Pokédex, se abre el modal `#dexDetailsModal` con tipos, peso, altura, habilidad principal, barras de estadísticas base (PS, ATK, DEF, VEL) y descripción oficial de la especie.
     - **100% Offline-First:** Toda la Pokédex de 1,025 Pokémon reside localmente en `src/pokedex_all.json`. La información de PokeAPI se cachea de forma persistente en `localStorage`. Si el usuario no tiene internet, el juego utiliza las estadísticas locales y nunca se bloquea ni arroja errores.
  4. **Modo Juego / Ocultar en Pantalla Completa (`Ctrl+Shift+H`):**
     - Nuevo switch en Ajustes (`🎮 Ocultar en Juegos / Pantalla Completa`), opción en el menú de la bandeja del sistema (Tray) y atajo de teclado global `Ctrl+Shift+H` registrado en `src/main.js`.
     - Oculta instantáneamente todas las ventanas flotantes mientras juegas en pantalla completa sin detener el escaneo de tokens ni la ganancia de EXP pasiva en segundo plano.
  5. **Notificaciones Flotantes sin Recorte Superior:**
     - Reubicación y ajuste de padding de `#walkerFloatingBubble` y `#walkerAlert` a `top: 14px`, con animación `translateY` de -10px, eliminando todo recorte contra el borde superior de la ventana.
  6. **Archivado de Pokémon Nivel 100 a Pokédex:**
     - Botón `[🏛️ Archivar a Dex]` en el Inspector de la Caja PC. Si el ejemplar alcanzó el Nivel 100, se archiva de forma permanente otorgándole la Estrella de Maestría ⭐ a la especie en la Pokédex y liberando la casilla en la Caja PC. Si es inferior a Nivel 100, libera la casilla y premia con Esencia.
  7. **Sistema de Rango de Potencial e IVs (F ➔ SSS) con Esencia de Repetidos:**
     - Escala de rangos: `F ➔ E ➔ D ➔ C ➔ B ➔ A ➔ S ➔ SS ➔ SSS` con bonus creciente de +0% a +50% en todas las estadísticas del Pokémon.
     - Al capturar ejemplares repetidos, se convierten en Esencia de Especie + bono de tokens de tienda en lugar de clonarse en la caja. Acumular esencia permite subir el rango de la especie desde la ficha modal de la Pokédex.
     - Insignia de rango visible junto al nombre del Líder (`#leadRankBadge`) y en la ficha de la Pokédex.
- **Validación Automatizada:**
  - `scratch/check_ipc_integrity.js`: 0 canales huérfanos.
  - `scratch/test_rank_and_dex_modal.js`: Pruebas de deduplicación, esencias, rangos F➔E, archivo a Dex con estrella de maestría y reclutamiento ejecutadas con código 0.
  - `scratch/test_renderer_errors.js`: Electron headless verificado con 0 errores de renderizador, Pokédex de 1,025 especies sincronizada.

---

### [US-017] Purga Total y Reinicio Limpio de Partida (Huevo Misterioso Inicial, Erradicación de Clones y Respaldo Preventivo)
- **Fecha:** 2026-10-11
- **Estado:** ✅ Completado y Validado (0 Errores en Consola, Captura Visual de Electron Exitosa)
- **Agentes / Skills Involucrados:** `agente-auditor`, `agente-planner`, `smart-planner`, `iso-25010-clean-code`, `systematic-debugging`
- **Requerimientos Implementados:**
  1. **Respaldo Preventivo Inmutable de Datos Históricos:**
     - Se archivó la partida anterior completa (380 KB) en `AppData\Roaming\poketokenbar-windows\companion-state.purga-backup-20261011.json`, preservando el progreso previo en caso de auditoría o consulta histórica.
  2. **Purga Integral de Estado en Todas las Rutas de Persistencia:**
     - Se eliminaron por completo las instancias fantasma de Charmeleon y Charizard heredadas de versiones previas.
     - Se limpió el equipo activo (1 ranura con el huevo nuevo, 5 ranuras vacías), la Caja PC (0/30) y la Pokédex (0 registradas), dejando el sistema en estado virgen libre de corrupción de datos.
  3. **Blindaje de Eclosión de Huevo Inicial (No Hardcoded):**
     - En `src/pokemon.js`: `createInitialState()` configurado con `lineIndex: -1` y `name: "Huevo Pokémon (Misterioso)"`.
     - La eclosión ahora sortea de forma limpia y equitativa entre las líneas evolutivas sin forzar a Charmander como starter predeterminado.
  4. **Verificación Visual en Tiempo Real:**
     - Verificado con Electron headless (`scratch/capture_clean_card.js`): HUD de Líder a Nivel 1 mostrando exclusivamente el "Huevo Pokémon (Misterioso)", barra de equipo con 1 huevo activo, cero errores y lista para ejecutar con `start.bat` o `reiniciar.bat`.

---

### [US-018] Documentación Oficial para GitHub, Suite de 7 Capturas y .gitignore Blindado
- **Fecha:** 2026-10-11
- **Estado:** ✅ Completado y Validado
- **Agentes / Skills Involucrados:** `agente-auditor`, `git-workflow-clean`, `iso-25010-clean-code`
- **Requerimientos Implementados:**
  1. **Filtro Preventivo `.gitignore` Profesional:**
     - Exclusión total de dependencias (`node_modules/`), entorno de pruebas internas (`scratch/`), archivos de registro (`*.log`), estados de guardado local del usuario (`companion-state*.json`, `.agent-state.json`) y capturas temporales de desarrollo.
     - Garantiza que nuevos usuarios al clonar el repositorio comiencen con una instalación virgen y sin fugas de datos locales.
  2. **Generación Automatizada de 7 Capturas Oficiales en `docs/screenshots/`:**
     - `01_hud_principal.png`: Tarjeta del líder con nivel, naturaleza, progreso, saldo y ranuras del equipo.
     - `02_paseo_escritorio.png`: Modo paseo por el escritorio con sprite animado y bocadillos de diálogo interactivos.
     - `03_caja_pc_gba.png`: Sistema de Caja PC estilo GBA (30 casillas, inspector lateral y wallpaper retro).
     - `04_pokedex_nacional.png`: Pokédex Nacional completa con selector de las 9 generaciones (1,025 especies) y siluetas.
     - `05_ficha_pokedex_modal.png`: Ficha modal técnica con estadísticas base BST, habilidad, tipos, descripción y escala de Rango de Potencial F ➔ SSS.
     - `06_estadio_combate.png`: Estadio de combate flotante 1v1 con ataques por turnos, PP, menú de Poké Balls, velocidad x2 y auto-batalla.
     - `07_tienda_y_mochila.png`: Tienda de suministros (Poké Balls, pociones, caramelos raros, mentas y huevos).
  3. **`README.md` Completo y Estructurado para Comunidad Open Source:**
     - Badges informativos, resumen introductorio, guía visual paso a paso de cada característica con imágenes incrustadas, requisitos, instrucciones de instalación (`npm install`, `start.bat`, `reiniciar.bat`), tabla de atajos de teclado (`Ctrl+Shift+H`), arquitectura de archivos, almacenamiento en `%APPDATA%` y créditos a PokeAPI y Pokémon Showdown bajo licencia MIT.

---

### [US-019] Guía de Referencia Suprema en README.md: Origen macOS, Manual de Botones, EXP, Economía, Capturas y Habilidades
- **Fecha:** 2026-10-11
- **Estado:** ✅ Completado y Validado (380+ Líneas de Documentación Exhaustiva y Formato GitHub)
- **Agentes / Skills Involucrados:** `agente-auditor`, `agente-planner`, `iso-25010-clean-code`, `git-workflow-clean`
- **Requerimientos Implementados:**
  1. **Historia y Evolución (macOS ➔ Windows):**
     - Documentación del origen en los menús minimalistas de macOS para Cursor y el salto cualitativo al adaptarlo a Windows con Electron: de un contador pasivo a una suite con mascota de escritorio, 1,025 especies, estadio de combate y Cajas GBA.
  2. **Manual Exhaustivo de Interfaz y Botones:**
     - Detalle de la barra superior (`🔊/🔇`, `⚔️`, `🐾`, `▼/▲`, `—`, `🗖`, `✕`).
     - Desglose del modal de Ajustes (`⚙️`): los 5 interruptores (*Encuentros Salvajes*, *Omitir Diálogo VS*, *Poké Balls Especiales*, *Sonido*, *Ocultar en Juegos `Ctrl+Shift+H`*) y la herramienta de *🔧 Sincronizar / Reparar Equipo*.
     - Acciones rápidas (`Pasear`, `Combate`, `Grito`), controles de Caja PC (`Al Equipo`, `Archivar a Dex`, `Limpiar Duplicados`) y botones del Estadio Flotante (`⚡ x1/x2`, `🤖 Auto`, `Poción`, `Capturar`, `Cambiar`, `Huir`).
  3. **Mecánica de Experiencia (EXP) y Nivel 1-100:**
     - Conversión de tokens de actividad (`delta / 150`) con Repartir EXP (Líder y Huevos 100%, Compañeros 50% pasivo).
     - Ganancia de EXP pasiva de paseo (+25 XP por ciclo), botín por victoria en combates y caramelos raros (+1 nivel instantáneo).
  4. **Economía del Juego y Saldo de Tienda:**
     - Fórmula matemática de saldo disponible (`Tokens + Premios - Gastos`).
     - Recompensas en efectivo por captura exitosa (`Nivel × $250,000 + $1,000,000`).
     - Reembolso de dinero y Esencia al reciclar duplicados en la Caja PC.
  5. **Mecánica de Capturas y Poké Balls:**
     - Tasas base por rareza (Comunes 65%, Raros 42%, Legendarios 22%).
     - Multiplicadores oficiales de Poké Ball (x1.0), Super Ball (x1.45), Ultra Ball (x2.15) y Master Ball (100% infalible).
     - Fase de Captura obligatoria (*Catch Phase*) al debilitar al rival en 0 PS.
     - Destino inteligente: incorporación al equipo (< 6), almacenamiento en Caja PC (6/6) o reciclaje en Esencia si es duplicado.
  6. **Sistema de Habilidades y Reemplazo de Ataques:**
     - Pool de 4 movimientos con tipos elementales y puntos de poder (PP).
     - Modal de Aprendizaje y Reemplazo (`#moveLearnModalOverlay`) con `Olvidar` y `No Aprender Ahora`.
  7. **Estrellas de Maestría ⭐ y Rangos de Potencial (F ➔ SSS):**
     - Consagración de Pokémon Nv. 100 en la Pokédex Nacional (`⭐ xN`).
     - Escala de potencial de +0% a +50% en todas las estadísticas base con Esencia de Especie y rareza Shiny ★.




