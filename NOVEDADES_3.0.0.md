# YaguaTool 3.0.0

## Texto y navegación

Nombre de producto actualizado, manteniendo la estética 2.8 y los módulos previos. Barridos siempre desplegados. Scroll restaurado al seleccionar presets/barridos y al cambiar tarjetas de Motion Lab; se evita el anclaje automático del navegador y la animación de entrada en selecciones de la misma sección.

Motion Lab v0.9 vive dentro de TEXT, sin iframe y con preview destacada, adaptándose al ancho del panel. Motor, adaptador de escenas, catálogo y packs originales intactos. Se retienen todos los controles y se añaden acciones CEP para generar composiciones nativas desde la configuración actual a 60 fps, o cargar los datos predeterminados originales del AE Lab v0.1.

## Nuevas secciones

**Complex text animation / Efecto fluido:** AEP AE2024 original sin modificaciones, importación al proyecto actual, duplicación recursiva independiente, textos opcionales de la copia, inserción en el cabezal y preview real renderizada por AE.

**Carrousel:** dos presets, Línea editorial y Órbita suave. Preview SVG en directo, tres puntos arrastrables/con teclado, controles numéricos y sliders. Tamaño, separación, aumento central, anchura, suavidad, velocidad, dirección, orientación, radios, esquinas y duración. Imágenes/comp seleccionadas o importadas; geometría compartida entre preview y expresiones nativas, cámara y controles editables.

**Tools:** editor propio de curvas con vista valor/velocidad, presets y curvas guardadas; leer/aplicar curvas; IN/OUT; copiar/pegar y retimar keyframes conservando metadatos y rechazando colisiones; distribución, recorte, formas, nulos de trazado, loops y dos variantes de Elastic. Biblioteca/editor de scripts y expresiones con carga, guardado, eliminación y drag-and-drop sin ejecución automática. Herramientas anteriores conservadas.

## Distribución

Instaladores con copia de respaldo y recuperación ante fallo de activación. Fuentes, datos originales de los 33 presets y AEP incluidos. El paquete `curvas` adjunto restringe su redistribución: no se incorpora su código, activos, activación ni analítica; las curvas de Tools son una implementación independiente.

## Límites de validación

La equivalencia matemática del motor web está comprobada. No se certifica igualdad píxel a píxel del bake nativo ni ejecución de los scripts en AE: esa revisión requiere After Effects. Las previews PNG del efecto fluido sí usan el render del AEP cuando se ejecutan dentro de AE. Más detalle en VALIDACION_3.0.0.md.
