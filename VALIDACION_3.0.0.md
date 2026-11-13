# Validación YaguaTool 3.0.0

Comprobaciones realizadas con Node y Chromium en Linux. No se dispone de After Effects.

- Motor/catálogo/packs/scene de Lab v0.9: comparación binaria con los adjuntos, sin diferencias.
- Los 33 presets: cinco instantes por animación, parámetros, capas secundarias y 15.793 valores numéricos normalizados; coincidencia con el panel original a tolerancia 1e-6.
- Bake a 60 fps de Slide, Ghost Bounce Reveal y Neon Spin IN/OUT con retención: geometría, matrices y caracteres finitos; capas secundarias y segunda escena presentes.
- Puente CEP simulado en Chromium: fuentes de carrusel vertical, payload de creación, preview PNG del fluido y generación/guardado del Lab actual a 60 fps pasan.
- Conservación de los IDs de controles de la interfaz original.
- Interfaz: 12 secciones en anchos 280, 320, 380, 768 y 1340, sin desbordamiento horizontal global ni errores JS. Pins con teclado/drag, modo radial, número de tarjetas, curva numérica, biblioteca y drop sin ejecución.
- Scroll: selección de presets nativos, cinco barridos y packs/tarjetas del Lab sin cambio de scrollTop.
- Pruebas del motor anterior: máscaras 2.8, IN/OUT, engine 2.6, attach y Dynamic Grid pasan.
- Adaptadores nativos simulados: clipboard/metadatos/colisiones, retiming, curvas multidimensionales, loops/Elastic, expresiones del carrusel, cámara/máscaras, cadena afín del Lab, aislamiento de dependencias del fluido y restauración tras preview.
- AEP original: SHA256 coincide con el archivo adjunto. Los datos nativos originales de 33 presets y licencia/fuentes están incluidos.
- Sintaxis de JS/JSX y manifiesto verificados; instalador macOS pasa bash -n. Windows/macOS no ejecutados en este entorno.

Los resultados de comparación e interfaz están en qa/*300-results.json. Los mocks validan lógica y construcción de llamadas, no el comportamiento real de las APIs de Adobe ni su render.

## Revisión pendiente en After Effects

Abrir el panel en AE2024, instalar GeistLab760 e Impact, generar presets representativos (Apple, Ghost, Echo y secuencia Demo), revisar blur/raster/color, editar curvas/controles y comparar la preview; probar importación del fluido y sus PNG, comps con fuentes de diferentes proporciones en carrusel, y ejecutar utilidades en una copia de proyecto. No se declara igualdad píxel a píxel del bake SVG a AE. El AEP fluido se mantiene intacto, aunque fuentes y gestión de color del proyecto receptor influyen en su aspecto.

## Repetir pruebas

`node qa/native_300_mock.js` y los mocks históricos no requieren AE. Para las pruebas Chromium instala Playwright, sirve la raíz de YaguaTool en http://127.0.0.1:8767 y ejecuta `node qa/test_ui300.js`, `node qa/test_scroll300.js` y `node qa/test_cep300.js`. Los scripts usan Chromium en `/usr/bin/chromium`; adapta esa ruta en macOS/Windows. El test de paridad requiere además el panel v0.9 adjunto original; su informe se incluye en qa/lab-parity300-results.json.
