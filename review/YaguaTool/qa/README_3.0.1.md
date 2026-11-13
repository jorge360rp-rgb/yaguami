# Pruebas de arranque 3.0.1

Instala acorn y Playwright en el entorno de QA. `node qa/bridge_301_mock.js` valida arranque/ES3/dispatch. Sirve la raíz del panel en http://127.0.0.1:8769 y ejecuta `node qa/browser_bridge301.js` para probar los botones en Chromium con el bundle final y APIs simuladas. Configura NODE_PATH si instalas dependencias fuera del proyecto; el navegador se espera en /usr/bin/chromium.

`python qa/build_host.py` regenera jsx/yagua-host.jsx a partir de los seis módulos. No publiques solo el wrapper antiguo con #include. La prueba del puente debe ejecutarse contra el archivo generado que se vaya a distribuir.

Los tests no renderizan After Effects. Las pruebas 3.0.0 se conservan como historial; test_cep300.js utilizaba un stub antiguo y no cubre el nuevo arranque. Utiliza browser_bridge301.js para la integración actual.
