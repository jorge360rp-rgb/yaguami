# Yaguanimix Motion Lab v0.9

Abre `Yaguanimix_Motion_Lab_v09.html` en Chrome o Edge. No requiere instalación, servidor, npm ni conexión a Internet. La fuente Geist está incluida en el HTML.

Esta versión conserva la interfaz Yaguanimix y sustituye las fórmulas aproximadas de la v0.8 por el renderizador público de la demo de Qwix. Los cálculos de los 33 presets individuales se han comparado con una instancia independiente del módulo de referencia. No se ha certificado una comparación píxel a píxel con los MP4 adjuntos ni con After Effects.

## Uso

1. Selecciona un pack y un preset. **Texto original de la web** carga su texto de referencia; al escribir un texto propio, se desactiva esa opción.
2. Pulsa **Replay**, pausa y usa **−1 f / +1 f** para avanzar a 60 fps. El deslizador permite buscar cualquier instante.
3. Ajusta movimiento, Bézier, anclaje, Fill, Ghost y Echo. **Valores predeterminados** restaura el preset.
4. **Secuencia IN/OUT original** reproduce las parejas de Demo Reel usando sus dos tipos de animación y sus dos juegos de parámetros originales. En el resto de presets mantiene el comportamiento individual.
5. **Exportar configuración** descarga el JSON de ajustes. **Exportar 60 fps** descarga las poses y el estado visual de las capas para preparar la fase de After Effects.

El reloj comienza en cero; Ghost Delay usa fotogramas a 30 fps, como el renderizador de referencia. El control Hold afecta al modo individual IN & OUT. Las secuencias originales de Demo Reel conservan su pausa de 200 ms.

## Archivos

- `Yaguanimix_Motion_Lab_v09.html`: panel completo y autónomo.
- `INFORME_REVISION.md`: hallazgos, cambios, comprobaciones y límites.
- `AFTER_EFFECTS_SIGUIENTE_FASE.md`: unidades y datos necesarios para la futura implementación en AE.
- `PRESETS_33.csv`: parámetros principales de los 33 presets.
- `src/`: interfaz, adaptador, motor, catálogos y plantilla editables.
- `assets/geist-latin.woff2`: tipografía usada por el escenario web.
- `validation/`: resultados, capturas, manifiesto de fuentes, módulo original de comparación y prueba automatizada.

Para reconstruir el HTML desde las fuentes: `python build.py`. La aplicación no necesita Python para funcionar. La prueba opcional `python validation/test-browser.py` necesita Python, Playwright y Chromium; la ruta de Chromium puede ajustarse en ese archivo.

Los MP4 originales no están incluidos en este paquete. Los documentos adjuntos se han usado como documentación de referencia; su antiguo prompt de generación de una extensión CEP no se ha ejecutado como una petición nueva. Esta entrega prepara y verifica la versión web; no instala un plugin en After Effects.
