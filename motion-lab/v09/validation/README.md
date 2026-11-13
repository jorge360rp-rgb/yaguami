# Validación

`test-browser.py` compara el panel con una instancia independiente del módulo original guardado en `reference-module-33879.txt`. No usa red. Requiere Python, Playwright y Chromium.

`test-results.json` contiene los resultados de los 33 presets y las comprobaciones de integración. `source-manifest.json` identifica los recursos públicos consultados y sus hashes; no significa que todos esos recursos se integren en el producto.

`Panel_v09.png` y `Panel_v09_mobile.png` son capturas del panel entregado. `sample-export.json` es una exportación de prueba de Slide OUT, a 60 fps. `catalog-differences.json` está vacío porque los parámetros adjuntos coinciden con los del sitio consultado.

No se realizó comparación de imágenes con los MP4 completos: la descarga de esos cuatro archivos superó el límite de transferencia.
