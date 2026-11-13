# Yaguanimix AE Lab v0.1 — prueba nativa independiente

Esta entrega crea composiciones de prueba dentro de After Effects, con capas de texto, precomposiciones y keyframes nativos a 60 fps. No instala ni modifica el panel principal. Es una implementación de prueba: **no se ha ejecutado After Effects en este entorno y no se certifica equivalencia visual 1:1**.

## Probar en After Effects 2024/2025

1. Descomprime el ZIP completo en una carpeta. Mantén `data`, `json2.js` y el JSX juntos.
2. Instala `GeistLab760.ttf` (clic derecho → Instalar en Windows; Catálogo Tipográfico en macOS) y reinicia AE. Es una instancia estática del peso 760 de la misma fuente WOFF2 usada en la referencia.
3. En AE: **Archivo → Secuencias de comandos → Ejecutar archivo de secuencia de comandos**, selecciona `Yaguanimix_AE_Lab.jsx`.
4. Elige primero **Apple Style Pack / Slide** y pulsa **Crear composición de prueba nativa**. Espera a que termine; presets con muchos ecos pueden crear cientos de capas y tardar minutos.
5. Se abre una composición nueva de 1920×1080 a 60 fps, con transparencia. Los elementos auxiliares están ocultos con Shy. El proyecto y las capas que ya tenías no se reemplazan.
6. Para deshacer la creación completa usa un único Deshacer. Si ocurre un error, anota su texto y línea y deshaz la operación parcial.

No necesita CEP, Python ni navegador para usar los 33 presets incluidos. El texto y los parámetros corresponden a las referencias originales; esta primera versión hornea el movimiento en keyframes. Cambiar el texto o parámetros requiere regenerar los datos; no hay sliders vivos de expresión todavía.

## Comparación visual

Incluimos `reference-png/pack-apple-style-pack-slide`: secuencia PNG RGBA de Slide obtenida directamente del motor web, no de AE.

En el panel pulsa **Importar secuencia PNG de referencia**, selecciona `frame_00000.png`. Importa como secuencia a 60 fps con alfa recto y crea una composición de referencia. Ponla encima de la composición nativa, ambas comenzando en cero. Compara primero sin motion blur y al 100 % de resolución. Usa modo de fusión Diferencia y revisa los frames 0, 12, 24, 48 y el final.

El render PNG conserva el resultado del navegador; el render nativo intenta reconstruirlo con texto y efectos de AE. Es esperable que existan diferencias de rasterización, desenfoque y glow. No confundir el PNG de referencia con una validación del resultado nativo.

## Qué está implementado

- 33 presets individuales; datos de 3.673 fotogramas y 85.235 poses visibles de capas.
- Geometría de reposo por carácter, fuente estática, anclajes, traslación, escala, rotación, opacidad, tracking y colores por unidad.
- Skew mediante una descomposición afín en tres transformaciones nativas. Error máximo de reconstrucción numérica medido: menor de 1e-14.
- Capas temporales de Echo y la geometría de Ghost/Glow derivadas del motor web.
- Grupos de deshacer y captura de errores. Todo se crea dentro de una carpeta de proyecto propia.

## Lo que sigue pendiente antes de integrar

- Ejecutar el script realmente en AE y comprobar compatibilidad de su API y carga de fuente.
- Igualar rasterización y baseline entre el motor de texto de AE y Chromium.
- El blur utiliza Gaussian Blur nativo. No se ha calibrado su radio frente a CSS. El blur global de la web se reparte por piezas en esta prueba.
- El halo SVG de Ghost (tinte, composición aritmética y glow) no se reconstruye todavía de forma equivalente. Las capas Glow usan desenfoque nativo y composición ordinaria; los bordes y mezcla pueden diferir.
- La animación está muestreada a 60 fps. No hay garantía de equivalencia entre fotogramas o con motion blur/subfotogramas. Las rotaciones de la descomposición pueden tener discontinuidades equivalentes en los frames completos.
- Las parejas IN/OUT de Demo Reel se ofrecen como presets individuales, no como secuencias combinadas.
- No aplicar estos datos como producto final ni integrar el módulo en el panel principal hasta superar la comparación visual y resolver esas diferencias.

## Regeneración para desarrollo

Necesita Python 3, `pip install playwright`, `python -m playwright install chromium`.

Ejemplo desde esta carpeta:

```
python renderer/bake.py --preset "Slide" --text "Mi texto" --png
```

Sin `--preset` regenera los 33. Sin `--png` genera solamente datos nativos. Puede usarse `--chromium RUTA_AL_EJECUTABLE`. Si se regeneran solo algunos presets con texto propio, el catálogo conserva los demás originales. Cada JSON es independiente.

`python validation/check.py` comprueba integridad, números finitos y recomposición de matrices de todos los datos. El resultado incluye expresamente `AEExecuted: false`. No sustituye pruebas en AE.

El motor procede del módulo público 33879 de qwixplugin.com/presets. La fuente conserva su licencia OFL en `OFL-Geist.txt`. El JSON parser de Douglas Crockford se incluye sin modificar. Los MP4 del usuario no se redistribuyen.
