# Yaguanimix Studio 2.8.0

Una interfaz renovada y seis revelados tipográficos con máscara desarrollados a partir de una investigación de diseño y motion. Instalar el ZIP completo, cerrar el panel anterior y reiniciar After Effects. El encabezado debe mostrar **2.8.0**.

## Una nueva interfaz

- Temas porcelana, grafito y midnight, con fuentes del sistema y sin descargas de fuentes externas.
- Cabecera y navegación translúcidas, superficies de contenido opacas y jerarquía tipográfica más clara.
- Respuesta a las pulsaciones, indicador deslizante de sección, transiciones de contenido y estados de selección.
- Vista de edición con preview e inspector en paralelo en paneles amplios; disposición vertical en paneles acoplados.
- Colección de presets con nuevas tarjetas y búsqueda por nombre o ID.
- Herramientas adicionales de texto recogidas en «Un poco más de magia».
- Cambio de tema desde la cabecera y movimiento «Seguir sistema / Animado / Reducido» en Ajustes.
- Previews con pausa, repetición y control para recorrer la animación manualmente.

Los ajustes guardados de la instalación anterior se conservan, incluidos tema y acento. El tema inicial de una instalación nueva es claro; los usuarios existentes pueden cambiarlo con el botón de la cabecera.

## Seis revelados con personalidad

Se conservan los IDs para la compatibilidad de selección y ajustes:

| ID | Preset | Carácter |
| --- | --- | --- |
| MRU | Silk Rise | Ascenso y borde de seda curvo. |
| MRD | Ribbon Fall | Apertura descendente de cinta. |
| MRL | Prism Sweep | Barrido lateral prismático. |
| MRR | Split Slide | Tres franjas por línea con desfase. |
| MSC | Iris Bloom | Apertura central redondeada en dos ejes. |
| MDI | Oblique Cut | Abanico de cortes con inclinación alterna. |

Nuevos controles: intensidad de forma, desplazamiento del texto y orden de líneas. Se mantienen cadencia, feather, duración y retraso. Ajustar intensidad y desplazamiento a cero proporciona una variante geométrica más contenida.

IN y OUT permanecen independientes. Las máscaras de salida de esta versión son sustractivas y se colocan después de las máscaras de entrada. Las salidas antiguas conservan su funcionamiento hasta sustituirlas. Las animaciones ya aplicadas a un proyecto no se actualizan automáticamente: selecciona las capas y vuelve a aplicar el preset de la fase que quieras cambiar.

La capa original mantiene su Source Text, estilo base y keyframes de Transform. El desplazamiento añadido utiliza animadores de texto por línea. Se protegen las máscaras manuales antes de reemplazar una fase. La validación de OUT incluye la duración de la última línea y de la última franja.

## Previews y limitaciones

Las seis previews rápidas usan SVG y la misma geometría ES3 que el motor de AE. Se muestrean las formas en los mismos intervalos que los keyframes nativos. Para juzgar el acabado final, utiliza «Renderizar preview real en el panel» o «Abrir preview real en AE».

El render del panel conserva las características de 2.7.7: texto de muestra en una composición de prueba, fotogramas a media resolución, unos 12 fps y un máximo de 180 imágenes. No es una captura de la capa seleccionada. En composiciones largas baja la frecuencia de muestreo manteniendo la duración. La escritura de PNG requiere el permiso de scripts correspondiente en AE.

La división de líneas parte del rectángulo global del texto y los saltos de línea explícitos, con un máximo de 20 franjas de línea. Para los resultados más previsibles, usar interlineado uniforme y saltos manuales; no se garantiza un ajuste individual exacto con autoajuste de párrafos o estilos con tamaños e interlineados distintos. La nueva geometría respeta esta limitación del motor previo.

El movimiento reducido detiene la reproducción automática de las previews y desactiva las transiciones de interfaz; puedes reproducirlas manualmente. No cambia la animación aplicada a tu composición.

## Validación

- 32 presets: matriz de 62 combinaciones válidas de aplicación/preview y rechazo de OUT en Number/Timer.
- Seis máscaras: 48 combinaciones de fase y orden, topología constante de ocho vértices y 7.020 comprobaciones de forma sin coordenadas no finitas.
- Preservación de fases, Source Text y Transform; retirada de fases y controles cero; límites de duración con cadencia y franjas.
- Chromium: todas las secciones en cinco anchos de panel, temas claro/oscuro, búsqueda, foco de teclado, movimiento reducido, pausa/scrubbing y carga de fotogramas mediante CEP simulado.
- Regresiones actuales de texto, barridos, zoom y Attach/Grid.

**After Effects no está instalado en el entorno de desarrollo.** No se ha certificado visualmente esta versión en AE 2024/2025. Las pruebas automatizadas modelan las propiedades y el comportamiento, pero no sustituyen su render nativo. Se incluye `qa/diagnostico_2_8.jsx` para generar seis composiciones de revisión en AE.

La biblioteca AEP se incluye íntegra; esta versión modifica los presets nativos de TEXT y la interfaz, no los proyectos AEP de Library.

Ver [investigación y referencias](INVESTIGACION_MOTION_2.8.0.md) y [pruebas de la versión](qa/README_2_8.md).
