# Inventario completo y mapa de información

Base: 3.1.0 publicada. No se considera que las capturas del prototipo sean una implementación de estas funciones: el inventario es el compromiso de conservación para la fase aprobada.

| Pantalla / estado | Se conserva | Organización propuesta / motivo | Acción principal |
|---|---|---|---|
| Texto · Presets | 32 presets, IN/OUT, unidades, preview simulada/real, parámetros, restaurar | Preview + controles habituales; catálogo compacto con búsqueda/favoritos/recientes y 4 familias; sin miniaturas decorativas | Aplicar preset |
| Texto · Zoom y barridos | Zoom independiente, 5 estilos, colores, Blur, secuencia, follow, quitar y preview AE | Barridos desplegados; un grupo por intención; no se llevan a Lab | Aplicar acción seleccionada |
| Texto · Motion Lab v0.9 | 33 presets/4 packs, texto propio/original, dos líneas, Fill1–5, base/Echo/Ghost/glow, curva/anclaje, IN/OUT, secuencia/hold, transporte ±1f/scrub/loop, export config/60fps, crear/insertar/original/fuente | Texto primero; preview y controles principales; avanzados replegados por Movimiento/Aspecto/Tiempo; export y crear-insertar como elección accesible | Crear (con modo Crear/Insertar/Original) |
| Texto · Complex text animation | AEP original, render PNG de AE, pausa/scrub, dos textos opcionales, copia/insertar/abrir original | Acceso anidado dentro de Texto y ruta antigua compatible; frame correcto, caption fuera del clip, secundarios visibles | Insertar / Crear copia según modo |
| Biblioteca | Colecciones AEP, búsqueda, filtros, preview original, inserción/copia e importación | Lista y ficha de preview iguales a Texto; dependencias en Avanzado | Insertar |
| Carrousel | Línea editorial / Órbita suave, tres pins drag/teclado/X-Y, pausa/reset, imágenes/comp, count/gap/tamaños/anchura/softness/speed/radios/esquinas/duración/reverse/orient | Sigue debajo de Biblioteca; preview con pins que no se vuelven diminutos al reducir; fuentes antes de ajustes | Crear carrousel |
| Movimiento | 6 expresiones, preview, parámetros, código personalizado, CTA Ping, Lo-Fi Steps y aplicar | Nombres compactos, un inspector; avanzados sin perder parámetros | Aplicar expresión |
| Fondos | Estilos, paletas, intensidad/velocidad, controles nativos y actualización | Preview + Aspecto/Tiempo; conservar colores artísticos de los estilos | Crear / actualizar fondo |
| Curvas | Value/Speed, handles, coordenadas/leer/aplicar/guardar, 22 presets y personalizados, Curva Rebote llegada/salida/intensidad | Gráfico con hit targets, biblioteca y modo Rebote; no convertir rebote a una Bézier ficticia | Aplicar curva |
| Tools · Keys y curvas | 14 presets propios, gráfico valor/velocidad, números, guardar/leer/aplicar, IN/OUT, clipboard, pegar, shift/scale con colisiones | Un mismo control de valores; clipboard es acción directa secundaria | Aplicar curva o timing activo |
| Tools · Shapes y comps | Distribución H/V, duplicación superficial/profunda, recortar, extraer/fusionar formas, nulos de path, loop/Elastic | Grupos por tarea; límites operativos visibles donde se necesitan | Aplicar herramienta elegida |
| Tools · Scripts y expresiones | Código, selector de tipo, guardar/eliminar/cargar, drop sin ejecutar, reemplazo, Ctrl/Cmd+Enter | Editor wrap fluido y biblioteca lateral/anidada según ancho; ejecutar explícito | Ejecutar / aplicar |
| Tools · utilidades previas | Anclas 3×3, alineación, capas y todas las utilidades antiguas | Mismos componentes; agrupación, no eliminación | Acción contextual |
| Guardado | Paletas, referencias, fuentes, presets/FFX y recursos que ya estén disponibles; importar/exportar | Tabs por tipo, búsqueda/empty states, mismos datos persistidos | Añadir / guardar |
| Retícula | 10 formatos RRSS, FPS/duración, overlays TikTok/IG/Shorts mostrar/quitar/opacidad | Selector de formato fluido y acciones; overlays en grupo propio | Crear composición |
| Grid Pro | Distribución, estilo, geometría, guías/marcadores, animación, fuentes, attach/follow/pin/cover, máscaras, reparar/diagnosticar/desvincular | Preview + Distribución/Aspecto/Vínculos; color fields con espacio reservado | Crear / actualizar grid |
| Ajustes | Temas, acento/ayudas/movimiento, contexto, diagnóstico/reconectar, backups y reset | Conservar Claro y Midnight además del oscuro principal; acento fijo de propuesta o preferencias existentes sin sobrescribirlas | Exportar copia; ajustes con guardado automático |
| Estados / diálogos | Demo, vacío, cargando, error, cancelación, fuente/permisos y confirmación destructiva | Estado local/aria-live; error de host persistente; reconexión manual; foco modal y Escape | Reintentar / continuar |

## Qué permanece visible y qué se pliega

- Siempre: título corto, preview cuando existe, texto editable de Lab, preset actual, controles frecuentes, acción contextual persistente y estado.
- Por intención: Movimiento, Aspecto, Tiempo, Fuentes o Vínculos según corresponda; el mismo nombre no significa forzar controles que no existen en ese efecto.
- Avanzado: opciones raras, exportaciones técnicas, diagnóstico y dependencias. Son accesibles por teclado y no cambian valores al plegar.
- Barridos se mantienen desplegados por requisito previo. El tamaño de cada bloque se reduce por diseño de filas, no ocultando los barridos.
- Nombres originales de presets/secciones/controles de UI se mantienen. Solo se traducirá copy auxiliar nueva; una traducción que cambie un nombre existente no se hará sin acordarla.

## Flujo de dos clics

Desde cualquier sección: clic 1 en búsqueda global y clic 2 en resultado para cargarlo, sin aplicar. Desde el catálogo: clic 1 en familia/pack, clic 2 en preset para cargarlo; buscar encuentra en todas las familias sin necesidad de abrirlas. Favoritos/recientes son metadatos UI por ID, no mutaciones de presets. Acciones Aplicar/Crear continúan explícitas y no se disparan al navegar.

## Notas de comportamiento a aprobar

Seleccionar un formato RRSS en un catálogo y crear desde la barra contextual es una reorganización de la acción actual; si se quiere mantener el botón de creación directa por formato, se conservará como secundaria sin duplicar lógica. Las utilidades de un clic de Tools conservarán ejecución directa secundaria. El prototipo no ha eliminado funciones que no muestra en detalle; su conservación está en esta matriz y deberá comprobarse en código al implementar.
