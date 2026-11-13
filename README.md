# YaguaTool 3.0.0

[Descargar YaguaTool 3.0.0](YaguaTool_3.0.0.zip) · [Capturas](previews/3.0.0) · [Vídeo de la interfaz](previews/3.0.0/YaguaTool_3.0.0_Interfaz.webm)

Extensión CEP para After Effects 2024/2025. Evolución de Yaguanimix 2.8.0 con la misma interfaz de estudio y los módulos anteriores conservados.

- TEXT: barridos de color desplegados, selección sin saltos de scroll y Motion Lab v0.9 integrado con sus 33 presets, previews en directo, curvas, sliders y exportaciones.
- Complex text animation: efecto fluido desde el AEP original, importado al proyecto y duplicado con dependencias independientes. Preview de fotogramas renderizados por AE.
- Carrousel: Línea editorial y Órbita suave; generador con preview, tres puntos interactivos y controles nativos editables para imágenes y composiciones.
- Tools: curvas Bézier propias, gestión de keyframes, utilidades de formas/composiciones y biblioteca/editor de scripts y expresiones.

Extrae el ZIP completo y consulta [GUIA_INSTALACION.md](GUIA_INSTALACION.md). Instala la fuente `assets/fonts/GeistLab760.ttf` para Motion Lab nativo; el fluido original utiliza Impact.

## Validación

Comparación con el panel Motion Lab original: 33 presets y 15.793 valores numéricos coincidentes. Pruebas de interfaz en 60 combinaciones de sección/anchura; scroll estable y pruebas simuladas de adaptadores nativos. Consulta [VALIDACION_3.0.0.md](VALIDACION_3.0.0.md) y [MATRIZ_FUNCIONES_3.0.0.md](MATRIZ_FUNCIONES_3.0.0.md).

After Effects no está disponible en el entorno de desarrollo: la ejecución real y la equivalencia visual del render nativo requieren revisión en AE. El motor web original está conservado; el bake nativo a 60 fps utiliza transformaciones editables, pero las fuentes, el desenfoque SVG/Gaussian y el color pueden mostrar diferencias de rasterizado. La preview de Fluido necesita AE y escritura de archivos habilitada.

Se mantienen identificadores CEP y datos locales anteriores para actualizar la instalación. Los prefijos internos Animix y nombres de controles existentes se conservan por compatibilidad. Los documentos con versiones anteriores son históricos.
