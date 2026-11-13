# Revisión del panel y reconstrucción del movimiento

Fecha: 13 de noviembre de 2026.

## Resultado

La v0.9 conserva el panel Yaguanimix y usa las fórmulas del `TextFxPlayer` que sirve `https://qwixplugin.com/presets`. Se ha adaptado únicamente la exportación del módulo para poder utilizarlo sin el sitio Next.js. Las ecuaciones internas del motor se conservan.

**La coincidencia numérica se ha verificado con el renderizador web público. Esto no equivale a una certificación visual 1:1 con los vídeos ni con After Effects.** La interfaz propia tampoco se presenta como una copia completa de la interfaz Qwix: se mantiene el panel facilitado para evaluar sus animaciones.

## Material revisado

Se han podido descargar 25 archivos: ZIP, especificación, antiguo prompt y todos los HTML, CSS y JavaScript adjuntos. Las seis parejas `.js` / `.js.descarga` tienen contenido idéntico. El inventario y sus SHA-256 están en `validation/upload-inventory.json`.

Se revisaron el código del panel v0.8, su informe, las cuatro hojas de fotogramas del ZIP, el catálogo adjunto, el adaptador de demostración, el puente de controles, las hojas de estilos y los paquetes JavaScript públicos de la página de presets.

**Los cuatro MP4 completos no pudieron transferirse:** la herramienta de descarga rechazó cada uno porque supera su límite de 32 MiB. Por tanto, no se ha hecho seguimiento temporal ni comparación fotograma a fotograma de esos archivos. Las hojas de fotogramas muestran cambios manuales de parámetros; esos estados no deben confundirse con los valores iniciales del catálogo.

La especificación adjunta distingue parcialmente animación de interfaz y animación de texto. Sus keyframes de interfaz y tokens no bastan para reconstruir los efectos de texto del escenario. El antiguo `CHATGPT_PROMPT.md` pedía una extensión CEP y JSX; se ha tratado como documentación histórica porque la petición actual sitúa After Effects en una fase posterior.

## Hallazgo decisivo

La web distribuye el módulo 33879, exportado como `TextFxPlayer`, en:

`https://qwixplugin.com/_next/static/chunks/2y5enb9abei6b.js`

Este módulo contiene separación de unidades, orden, tiempos, Bézier, rebote, resorte, tracking, Fill, ecos temporales, Ghost y Glow. Es una fuente más directa para replicar el escenario web que deducir fórmulas a partir de valores de sliders o capturas. Se incluye su versión de referencia y su hash en `validation/`.

Los parámetros de los 33 presets adjuntos coinciden con los del sitio consultado: `validation/catalog-differences.json` está vacío. La diferencia estaba en las fórmulas y la organización de los efectos, no en los valores guardados.

## Diferencias corregidas respecto a la v0.8

| Área | Comportamiento de referencia incorporado |
| --- | --- |
| Dirección y distancia | Vector inicial con signo inverso a la dirección de revelado. Smart Reveal aplica un factor de 2; Smart Bounce depende de Swing. Whole Reveal no usa distancia de traslación. |
| Unidades y espacios | El stagger cuenta las piezas no vacías del motor; los espacios conservan geometría sin consumir un turno de animación. |
| Inicio y duración | Se elimina el adelanto artificial de 150 ms. Se usan las duraciones por pieza y la extensión real de efectos, con el final de reproducción del jugador. |
| Opacidad | Se usa el valor inicial real. Si la opacidad inicial es positiva, las piezas posteriores permanecen ocultas hasta su turno. |
| Bounce Drop y otros rebotes | Se sustituye el modelo especial inventado para Bounce Drop por `bounce()`, `spring()` y los pulsos de compresión y estiramiento del motor público. Frequency y Decay pertenecen al resorte; no se fuerza una influencia extra cuando Swing es cero. |
| Escala, pivote y rotación | Escala cero permitida, anclaje porcentual original y modos de rotación simétrica/aleatoria del motor. Se conservan los controles de escala vinculada. |
| Tracking | Distribución por caracteres, origen, compensación de escala y de rotación, en vez de un espaciado estimado independiente. |
| Blur | Desenfoque por pieza o global con su propia envolvente temporal; ya no se deriva de una única cantidad genérica de movimiento. |
| Fill | Se usan sus reglas originales de Sweep, Per Piece y With Reveal, mezcla secuencial, acumulación de delays y encadenamiento `chain`. |
| Echo | Muestreo temporal con intervalos mínimos de 1/30 s, decaimiento exponencial, hasta 30 muestras históricas y máscara frente al texto actual. |
| Ghost | Retardo en fotogramas a 30 fps, distancia normalizada y filtro SVG de desenfoque/tinte/composición. No se interpreta Ghost Delay como segundos. |
| Ghost Pack | Escala de referencia 38 frente a 32 para los otros packs. Se conserva `ghostFirstPassOnly` en Bounce Rotation Reveal, ausente del catálogo plano. |
| Demo Reel | Se conservan nueve presets individuales y se añaden las cuatro parejas originales, con su posible cambio de tipo de animación entre entrada y salida. Los textos originales se recuperan del sitio. |
| Tipografía | Geist variable, peso 760, line-height 1.08 y letter-spacing −.045em en el escenario. Se reconstruyen las escenas tras cargar la fuente. |
| Entrada de tarjetas | Última definición CSS adjunta: 32 px sin escala, 430 ms, stagger de 24 ms y Bézier `.16,.86,.22,1`. |

Algunos parámetros expuestos por el plugin, como `ghostEngine`, `fillGlowEngine` y `echoStyle`, no tienen una rama equivalente en el renderizador público del escenario. Se conservan sus valores, pero no se inventan efectos para ellos. Esa limitación de la demo será relevante al comparar con el plugin real de AE.

## Verificación realizada

Pruebas ejecutadas en Chromium con el HTML autónomo:

- 33 presets × 8 instantes = **264 muestras**, comparadas con una instancia independiente del módulo original. Tolerancia numérica: `1e-9`.
- Comparación de las poses, tracking, Fill y opacidad; comparación adicional de estilos de piezas y capas visibles de Echo, Ghost y Glow.
- Comprobación de Distance, escala vinculada, Height, Tracking Origin, restauración, dirección, orden y salida desde la interfaz.
- Reproducción de las cuatro parejas de Demo Reel, incluyendo cambio de tipo en la salida.
- Exportación JSON a 60 fps, con 145 muestras en el caso de prueba Slide OUT. Incluye geometría de reposo y estado visual de capas.
- Movimiento reducido: la galería no mantiene una animación continua.
- Anchuras de 1440 px y 390 px; sin desbordamiento horizontal en 390 px.
- Sin errores JavaScript durante la prueba y comprobación sintáctica de los archivos editables.

Los resultados están en `validation/test-results.json`. Las pruebas validan la integración con el código de referencia. No sustituyen una comparación de imágenes independiente.

## Límites que siguen abiertos

1. Comparación de los cuatro vídeos completos, alineados por inicio de animación y por parámetros de cada segmento.
2. Igualdad de rasterización, antialiasing y blur entre navegadores, sistemas operativos y GPU.
3. Equivalencia entre el pequeño preview interno del plugin y el escenario externo de la web: esta entrega usa el motor del escenario también en su preview pequeño para evaluar el mismo cálculo a otra escala.
4. Comportamiento multilínea: la referencia pública se utiliza con textos de una línea. El botón de prueba multilínea se conserva, pero no se ha certificado su geometría contra una referencia original.
5. Instalación, expresiones, animadores, filtros y comparación de renders en After Effects. No se ha ejecutado AE en este entorno.

La próxima comparación visual necesita los vídeos en una forma accesible para esta herramienta: archivos de menos de 32 MiB, segmentos cortos o una URL de descarga accesible. El trabajo web y las pruebas disponibles se han completado sin depender de esa transferencia.
