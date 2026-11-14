# YaguaTool 3.1.0

## Motion Lab: texto primero y edición accesible

El cuadro de texto aparece antes del catálogo y la preview. El texto propio se conserva al cambiar de preset; el texto de referencia sigue disponible como opción. Zoom y barridos ya no aparecen dentro de Motion Lab; permanecen en Presets de texto.

Las nuevas creaciones incorporan un controlador de texto en el primer nivel. En Crear animación se encuentra dentro de la composición que se abre. En Crear e insertar se añade directamente al timeline receptor. La capa se llama `TEXTO - ...`; está desactivada y marcada como guía para no duplicar el texto en el render. Cambia su **Texto de origen** para editar el contenido, y abre **Controles de efectos** para ajustar el movimiento. No es necesario entrar en las precomposiciones de glifos.

- **Global**: posición X/Y, escala, rotación, opacidad y desenfoque. Se aplican mediante expresiones nativas, responden inmediatamente, admiten keyframes y funcionan con el panel cerrado.
- **Preset / Curva**: valores numéricos del preset, colores, menús y coordenadas Bézier. Se sincronizan tras terminar el ajuste, con YaguaTool abierto. El panel vuelve a muestrear el motor original a 60 fps y sustituye únicamente la caché de render; mantiene el ID de composición, los controles y las capas del usuario. El tiempo de actualización depende del texto y de Echo/Ghost.
- Los parámetros Preset se ajustan **sin keyframes**; se muestra un aviso si los tienen. Para cambios animados con keys utiliza Global. No se afirma que el motor completo sea una expresión nativa independiente del panel.
- Texto permite cambiar longitud y saltos de línea. Se conserva la fuente original del Lab. Las modificaciones de tipografía del controlador no cambian los glifos renderizados.
- La sincronización puede pausarse y reanudarse. Paúsala antes de recorrer Deshacer si no quieres que se vuelva a generar una configuración que has deshecho. Actualizar reintenta un error.
- Se rechazan muestras antiguas si se ha vuelto a cambiar un control durante el cálculo. Solo se eliminan elementos de caché creados por ese rig, comprobados por ID y sin usos externos.
- Original nativo AE Lab v0.1 conserva sus datos iniciales suministrados y también añade controlador. Al editarlo pasa a sincronizar con el motor v0.9 del mismo preset.

Las animaciones existentes de 3.0.x no se convierten automáticamente: crea una animación nueva para disponer de estos controles. Para obtener instancias independientes vuelve a crear desde el panel; duplicar una instancia enlazada no crea otro controlador independiente. Al insertar, las expresiones enlazan por nombre el controlador receptor; no renombres sus efectos ni borres la capa de control. La sincronización se dirige a la composición/instancia/controlador seleccionados. Se actualiza la duración de instancias que conservan el outPoint automático; se respetan recortes manuales.

## Organización y otras herramientas

- Presets de texto y Movimiento: tarjetas más bajas con el nombre, sin miniaturas decorativas ni códigos. Se mantienen la preview principal y los parámetros.
- Carrousel situado inmediatamente debajo de Biblioteca.
- Complex text animation: PNG original del ZIP IMAGEN EFECTO, sin cambios de píxeles, como referencia inicial. El botón de render real de AE continúa disponible.
- Retícula: creación de composiciones para Instagram Reels/Stories, Feed 4:5, retrato 3:4, post cuadrado, TikTok, Shorts, YouTube horizontal, LinkedIn, X y Pinterest. FPS y duración configurables. Los overlays anteriores se conservan.
- Curvas: Curva Rebote con llegada/salida, intensidad y preview. Genera keys intermedias entre keys seleccionadas consecutivas, con interpolación lineal de las muestras; no representa el rebote como una única curva Bézier. Admite valores escalares y vectores numéricos. Se puede deshacer.

## Validación y límites

Comprobadas la sintaxis ES3 del host final, conservación binaria del motor/catálogo y los datos originales, interfaz en anchos 280/380/768/1250, texto persistente, menús compactos, orden de secciones, formatos y PNG. Pruebas de navegador hacia el bundle real con APIs Adobe simuladas: creación del controlador, cambio de texto de longitud distinta y dos líneas, cambio de distancia, nueva caché con ID de rig estable, protección ante cambios más recientes, controlador en timeline receptor, creación RRSS y keyframes de Rebote. Regresiones de máscaras y adaptadores nativos pasan.

No hay After Effects instalado en este entorno. La ejecución y comparación visual dentro de AE siguen pendientes; las pruebas con APIs simuladas no certifican el render de Adobe. El nuevo rig conserva el motor y el muestreo anteriores, con las diferencias de rasterizado SVG/Gaussian/fuentes ya documentadas en 3.0.0.
