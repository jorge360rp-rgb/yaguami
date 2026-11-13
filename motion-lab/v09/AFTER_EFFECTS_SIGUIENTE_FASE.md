# Datos preparados para la fase de After Effects

Esta entrega no incluye una extensión CEP instalable ni un JSX que pretenda aplicar los efectos originales. Incluye el motor de referencia, sus parámetros y una exportación de muestras para construir y verificar esa implementación después.

## Datos disponibles

`src/reference-packs.json` contiene la estructura original de las 29 tarjetas de la web: Echo 11, Apple Style 9, Demo Reel 5 y Ghost 4. Cuatro tarjetas Demo Reel contienen una entrada y una salida, por lo que equivalen a los 33 presets individuales de `src/catalog.json`.

`src/reference-player.js` contiene las funciones de movimiento utilizadas. El cuerpo procede del módulo público 33879. `src/reference-scene.js` añade búsqueda temporal y organización de secuencias, sin sustituir los cálculos de poses.

**Exportar configuración** conserva parámetros y preset original. **Exportar 60 fps** añade:

- Texto, tipografía, tamaño y escala de referencia.
- Geometría de reposo de piezas y caracteres.
- Posición X/Y, rotación, skew, escala X/Y, opacidad y blur por pieza y por fotograma.
- Desplazamientos de tracking y colores/mezclas de Fill por carácter.
- Estado visual de las capas principales, Echo, Ghost y Glow, con transforms, opacidades, filtros y colores.
- Indicadores de pose final y reinicio de secuencia. Estos indicadores deben aplicarse al reconstruir el estado final: la muestra matemática sin esos indicadores no representa por sí sola el `settle()`.

Hay una muestra de exportación en `validation/sample-export.json`.

## Unidades y tiempos

| Dato | Interpretación |
| --- | --- |
| Tiempo exportado | Segundos; `localTimeMs` conserva el tiempo usado por el jugador. |
| Posición | Píxeles CSS relativos a la geometría de reposo de la pieza. X positivo a la derecha; Y positivo hacia abajo. |
| Escala | 1 equivale a 100 %. |
| Opacidad | Intervalo 0–1. |
| Rotación | Grados. La matriz de skew usa el signo indicado por `pieceTransform()` y por el estado visual. |
| Anclaje | `50 + anchorX/2` y `50 + anchorY/2`, en porcentaje de la caja de la pieza. |
| Escala espacial | `fontSize/referenceFontSize`, con referencia 32 o 38 en Ghost Pack. |
| Ghost Delay | Fotogramas a 30 fps: `lagMs = 1000 * lag / 30`, dentro del intervalo que limita el motor. |
| Echo | Historial discretizado a un intervalo mínimo de 1/30 s. No es solamente una copia desenfocada. |
| Secuencia Demo Reel | Fin de entrada, margen del jugador, pausa de 200 ms, preset de salida y restauración con fade de 420 ms. |

El Hold de IN & OUT individual es de 500 ms por defecto. El adaptador permite modificarlo explícitamente. No confundir ese Hold con la pausa de la secuencia de dos presets diferentes de Demo Reel.

## Implementación recomendada para el siguiente paso

1. Fijar composición, resolución, fuente, peso y texto. Crear una referencia con una sola línea y movimiento de cámara desactivado.
2. Validar primero Slide, Scale Slam, Slide Delay y Slide Rotation, sin efectos secundarios. Construir las unidades y sus anclajes usando cajas compatibles con la fuente real.
3. Implementar `bounce()`, `spring()`, las envolventes de blur y el tracking con las ecuaciones del jugador. Su comportamiento no queda descrito solamente por el Bézier guardado.
4. Añadir Fill y después las capas secundarias. El filtro Ghost usa operaciones SVG específicas; un Glow o Echo nativo de AE con valores parecidos no garantiza el mismo resultado.
5. Para la primera comparación, usar el JSON a 60 fps como referencia de valores por fotograma. Las muestras son exactas para esos instantes; la interpolación entre muestras no sustituye las ecuaciones continuas ni garantiza subfotogramas para motion blur.
6. Renderizar ambos resultados a 60 fps, alinear el primer fotograma de entrada y medir posición y opacidad por unidad. Después comparar imágenes con la misma escala, fondo y tipografía.

ExtendScript necesita una adaptación compatible con su versión de JavaScript; no se debe pegar la clase moderna del navegador directamente en un `.jsx`. Tampoco debe convertirse un Bézier normalizado a `KeyframeEase` usando un único factor fijo: las velocidades dependen de duración y cambio de valor de cada propiedad, y los rebotes y colores necesitan lógica adicional.

La tipografía incluida es un WOFF2 variable para navegador. La fase AE debe comprobar la misma familia y un peso equivalente a 760, o preparar una instancia estática compatible antes de comparar métricas. El sistema de medidas, la rasterización y los filtros deben verificarse dentro de After Effects.
