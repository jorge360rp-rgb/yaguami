# Yaguanimix

## Motion Lab v0.9 · referencia web

Panel HTML autónomo con los 33 presets individuales de los packs Echo, Apple Style, Demo Reel y Ghost. Usa el renderizador público de la demo de Qwix y conserva la interfaz de evaluación Yaguanimix.

- [Descargar el paquete completo](Yaguanimix_Motion_Lab_v09_Referencia_Web.zip)
- [Panel HTML autónomo](motion-lab/v09/Yaguanimix_Motion_Lab_v09.html): descarga el archivo y ábrelo en Chrome o Edge.
- [Instrucciones](motion-lab/v09/LEEME.md)
- [Informe de revisión y límites](motion-lab/v09/INFORME_REVISION.md)
- [Código editable](motion-lab/v09/src)
- [Datos para la siguiente fase en After Effects](motion-lab/v09/AFTER_EFFECTS_SIGUIENTE_FASE.md)
- [Resultados de las pruebas](motion-lab/v09/validation/test-results.json)

Incluye avance fotograma a fotograma y exportación de configuración y poses a 60 fps. No necesita npm, servidor ni conexión para funcionar. Para reconstruir el HTML desde las fuentes, ejecuta `python build.py` dentro de `motion-lab/v09`.

Se verificaron 264 muestras numéricas de 33 presets frente al módulo de referencia. La comparación visual con los cuatro MP4 completos y la validación en After Effects siguen pendientes; esta entrega no es una extensión instalable de AE.

## Paquetes anteriores de la extensión

Paquetes de la extensión Yaguanimix para After Effects.

La revisión TEXT 2.7.7 se encuentra en la rama `codex/yaguanimix-2.7.7-text`, en el archivo `Yaguanimix_2.7.7_TEXT.zip`.

El ZIP incluye las instrucciones de instalación y el informe de revisión. La validación visual en After Effects sigue pendiente.
