# QA 3.1.0

Instala Playwright/acorn como dependencias de desarrollo. Sirve la raíz de YaguaTool en http://127.0.0.1:8770 y ejecuta node qa/browser_310.js y node qa/ui310.js. Se utiliza Chromium en /usr/bin/chromium. La prueba ejecuta el bundle real con APIs Adobe simuladas y valida el ciclo texto/controles -> muestreo -> actualización de caché.

python qa/build_host.py regenera el host autocontenido. Los módulos source y reference-scene/player originales se conservan. qa/native_300_mock.js y qa/engine_mask_280_mock.js son regresiones; los tests antiguos 3.0.1 se mantienen como historial y sus aserciones de versión no corresponden a 3.1.0.

No se dispone de After Effects en este entorno; no se afirma certificación del render nativo. Revisar en AE: nuevos rigs de Apple/Echo/Ghost/IN-OUT, sliders/menús/colores/curva, texto de longitud y líneas distintas, Global con keys, sincronización pausada, Deshacer y duración de instancias insertadas.
