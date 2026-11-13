# Inventario de integración 3.0.0

## Motion Lab v0.9

Se conserva cada ID del formulario original, más acciones nativas. Referencias byte a byte: reference-player.js, reference-scene.js, catalog.json y reference-packs.json.

| Grupo | Prestaciones incluidas |
|---|---|
| Catálogo | 4 packs, 33 efectos; tarjetas con preview independiente y pares IN/OUT de Demo Reel |
| Preview principal | Motor original, texto original/personalizado, dos líneas, transporte, reloj, reproducción/pausa, repetición, replay, ±1 fotograma y scrub |
| Secuencia | IN/OUT original, retención configurable, escenas secundarias y reset de estado |
| Estilo | Fill 1–5 según preset, color base, Echo/Ghost, composición secundaria y todos los parámetros avanzados del original |
| Curvas | Línea editable, handles arrastrables, coordenadas numéricas, presets y curvas guardadas |
| Anclaje | Cuadrícula de nueve posiciones y coordenadas numéricas |
| Exportación | Configuración JSON y frames JSON a 60 fps; diálogo nativo de guardado dentro de CEP |
| AE actual | Bake del estado editado: texto, colores, secuencia/hold, Ghost/Echo/Glow, matrices afines/skew y animación de caracteres |
| AE original | Los 33 JSON suministrados por AE Lab v0.1, sin recalcularlos ni reemplazarlos |
| Persistencia | Preset, parámetros, texto, secuencia y retención conservados al salir/volver; se limpian RAF/listeners al desmontar |

| Pack | Preset | ID |
|---|---|---|
| Echo Pack | Swing Trail | `pack-echo-pack-swing-trail` |
| Echo Pack | Afterimage | `pack-echo-pack-afterimage` |
| Echo Pack | Squeeze Arc | `pack-echo-pack-squeeze-arc` |
| Echo Pack | Comet | `pack-echo-pack-comet` |
| Echo Pack | Scale Pop | `pack-echo-pack-scale-pop` |
| Echo Pack | Tidal Bounce | `pack-echo-pack-tidal-bounce` |
| Echo Pack | Echo Stack | `pack-echo-pack-echo-stack` |
| Echo Pack | Word Slam | `pack-echo-pack-word-slam` |
| Echo Pack | Tilt Drift | `pack-echo-pack-tilt-drift` |
| Echo Pack | Letter Rain | `pack-echo-pack-letter-rain` |
| Echo Pack | Halo | `pack-echo-pack-halo` |
| Apple Style Pack | Slide | `pack-apple-style-pack-slide` |
| Apple Style Pack | Scale Slam | `pack-apple-style-pack-scale-slam` |
| Apple Style Pack | Color Scale | `pack-apple-style-pack-color-scale` |
| Apple Style Pack | Slide Delay | `pack-apple-style-pack-slide-delay` |
| Apple Style Pack | Bounce Drop | `pack-apple-style-pack-bounce-drop` |
| Apple Style Pack | Blur Rise | `pack-apple-style-pack-blur-rise` |
| Apple Style Pack | Scale Words | `pack-apple-style-pack-scale-words` |
| Apple Style Pack | Slide Rotation | `pack-apple-style-pack-slide-rotation` |
| Apple Style Pack | Scale Tracking | `pack-apple-style-pack-scale-tracking` |
| Demo Reel Pack | Red Echo Bounce In | `pack-demo-reel-pack-red-echo-bounce-in` |
| Demo Reel Pack | Red Echo Bounce Out | `pack-demo-reel-pack-red-echo-bounce-out` |
| Demo Reel Pack | Cyan Glide In | `pack-demo-reel-pack-cyan-glide-in` |
| Demo Reel Pack | Cyan Glide Out | `pack-demo-reel-pack-cyan-glide-out` |
| Demo Reel Pack | Magenta Snap In | `pack-demo-reel-pack-magenta-snap-in` |
| Demo Reel Pack | Magenta Snap Out | `pack-demo-reel-pack-magenta-snap-out` |
| Demo Reel Pack | Neon Spin In | `pack-demo-reel-pack-neon-spin-in` |
| Demo Reel Pack | Neon Spin Out | `pack-demo-reel-pack-neon-spin-out` |
| Demo Reel Pack | Pink Pop In | `pack-demo-reel-pack-pink-pop-in` |
| Ghost Pack | Rotation Reveal | `pack-ghost-pack-rotation-reveal` |
| Ghost Pack | Skew Reveal | `pack-ghost-pack-skew-reveal` |
| Ghost Pack | Bounce Reveal | `pack-ghost-pack-bounce-reveal` |
| Ghost Pack | Bounce Rotation Reveal | `pack-ghost-pack-bounce-rotation-reveal` |

## Carrousel

Dos presets: Línea editorial / Órbita suave. Tres pins de trayectoria (ratón, teclado y campos X/Y), pausa/reset, elementos, separación, tamaño base/central, anchura central, suavidad, velocidad, dirección, orientación, radio horizontal/vertical, esquinas y duración. Carga de selección o imágenes, relación de aspecto de fuentes y composición, preview de imágenes o miniaturas y generación nativa con expresiones/controles editables. Las miniaturas no reproducen vídeo; fuentes de formatos que Chromium no decodifique pueden necesitar una miniatura PNG.

## Tools: funciones y límites operativos

| Función | Comportamiento |
|---|---|
| Curvas | Valor/velocidad, 14 presets, cuatro coordenadas, guardar/leer/aplicar; segmentos de keys consecutivas y propiedades numéricas |
| IN/OUT | Influencias independientes sobre keys seleccionadas |
| Clipboard | Valores, tiempo relativo, interpolación y metadatos temporales/espaciales; rechazo previo de colisiones |
| Timing | Desplazamiento en frames y escala temporal; no sobrescribe keys no seleccionadas |
| Distribuir H/V | Centros de capas 2D sin padre, posición unificada sin expresión |
| Duplicar comps | Opciones superficial/profunda de las herramientas existentes |
| Recortar comp | Capas 2D sin padre y posiciones estáticas; conserva y desplaza todas las capas |
| Extraer formas | Copias por grupo; originales conservados desactivados |
| Fusionar formas | Transformaciones estáticas y sin padres, máscaras, efectos ni expresiones; conserva animación de contenidos vectoriales; originales desactivados |
| Nulos a puntos | Sigue vértices con referencias de capa y transformación de grupos |
| Loop | IN/OUT y pingpong, sin reemplazar expresiones existentes |
| Elastic | Variante moderna y clásica, parámetros amplitud/frecuencia/decay |
| Scripts/expresiones | Editor, selector de tipo, guardar/eliminar/cargar, dragdrop y ejecución explícita; opción de reemplazo para expresiones |
| Herramientas previas | Anclas, alineación y demás utilidades 2.8 disponibles debajo del bloque nuevo |

## Efecto fluido

Archivo original `library/Fluido_Original_AE2024.aep`, SHA256 `68ed66dd1215b644ded3ba9a90a823f27a8bc110db8be1f4e1b8d9d01fd97f95`. Se importan Vapor Text, Text 01/02, mapas y dependencias. No se ejecuta el script autónomo adjunto que abre otro proyecto. El nuevo módulo importa y duplica el grafo, con dos textos opcionales de la copia y 49 PNG de preview del original.
