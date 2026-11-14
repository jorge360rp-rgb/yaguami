# Propuesta de rediseño Yaguano · revisión UI de 3.1.0

**Estado: pendiente de aprobación.** No se ha modificado la extensión, el ZIP 3.1.0 ni ningún AEP. El prototipo es independiente y no tiene puente CEP ni acciones de AE. El texto adjunto exige: «Espera mi aprobación de todo esto antes de implementar»; por eso esta entrega concreta las decisiones antes de cambiar el producto.

## 1. Base verificada en Git

Se parte de la rama `codex/yaguatool-3.1.0-editable-motion-lab`, commit `e2bc26138adc0c7fa04e2a82447c6b819cd44488`. `main` sigue en `6a68c8a…` y no es la base correcta para este trabajo. El historial contiene `48632ec…` y `bbab956…` (corrección PR #4), y merge-base confirma que son ancestros de 3.1.0. El código revisable está en `review/YaguaTool`; el main.js publicado coincide byte a byte con el paquete de trabajo.

La corrección ya está incluida: host autocontenido ES3, carga por ruta absoluta, comprobación de versión/APIs y diagnóstico/reconexión. No hay que reaplicarla ni volver a introducir #include relativos. Se conservarán las llamadas, firmas, IDs CEP y almacenamiento existentes. Evidencia: HISTORIAL_BASE.txt y BASE_PROTEGIDA.json.

## 2. Bug de Complex text animation: causa demostrada

El CSS combina `.fluid-preview-stage { min-height:330px }` (220px en estrecho) con `aspect-ratio:940/459`, sin limitar explícitamente su ancho a la tarjeta. El tamaño mínimo derivado es aproximadamente 676px o 451px. En un panel estrecho la tarjeta es mucho menor; el frame y la imagen se salen juntos. No es solamente la anchura intrínseca del PNG. El selector amplio `.fluid-preview-stage img` también aplica posicionamiento absoluto tanto a la referencia como al render de AE. El overflow-x:hidden de #page oculta el scroll, pero no corrige el tamaño interno. Los tests antiguos de ancho del documento daban un falso positivo.

Reproducción: 24 de 30 combinaciones de Complex fallan en el recuadro (anchuras 220–720; alturas 360/560/800). En la medición inicial de 240px, un frame de ~451px entraba en una tarjeta de ~150px. Los valores estables por caso están en BASELINE_RESPONSIVE.json y REGRESION_MEDIA.json. Capturas: bug-240.png y bug-420.png.

**Solución propuesta:** componente de medios común con frame exterior `.halo` de width/max-width:100%, min-width:0 y sin altura mínima; un hijo de recorte con aspect-ratio derivado de la fuente, overflow:hidden y radio interior; imagen o render PNG al 100%, object-fit:contain y display:block. El caption queda fuera del recorte. Las capas estática/render conservan sus nodos, IDs, listeners y estado. Los ancestors flex/grid usan min-width:0 y minmax(0,1fr). Nada de ampliar el frame a partir de una altura mínima.

La misma anatomía se usará en imágenes, vídeos, canvas y SVG raíz: regla max-width:100%, tamaño CSS fluido, viewBox/preserveAspectRatio o backing-store de canvas separados del tamaño visual. El halo no se recorta. Los efectos deliberadamente desbordados dentro de la preview siguen recortados por su clip interior; no se confunden con desbordamientos de UI.

Se ha probado la estructura propuesta **solo en el DOM de la prueba**, sin escribir archivos del producto: 60 comprobaciones pasan (referencia y PNG renderizado × 10 anchos × 3 alturas). `node regression-media.js --proof` reproduce primero el fallo y después comprueba la solución. En implementación el modo normal será una regresión que falle si el frame o cualquier imagen excede la tarjeta. No se presenta esta prueba como una corrección ya instalada.

## 3. Problemas actuales de UX (10 como máximo)

1. Fluido: altura mínima + aspect-ratio fuerzan anchura y el scroll oculto enmascara el error.
2. Motion Lab a 220px: el inspector llega a ~11px útiles; desplegable/coordenadas exceden su grupo.
3. Tools: mini-SVG de 60px dentro de botones de ~36px; varios títulos se recortan.
4. Retícula: minmax(160px,1fr) supera los ~122px disponibles a 220px de panel.
5. Grid Pro: controles de color/etiquetas de marcadores se pisan o desbordan en 320px.
6. Texto/Guardado: algunas etiquetas de botones se cortan sin ellipsis ni tooltip suficiente.
7. Variantes de filas, toggles y controles se acumulan en varios CSS; la misma tarea tiene geometrías distintas.
8. Múltiples acciones principales azules y barras de aplicar alejadas por scroll; jerarquía poco clara.
9. Grandes cabeceras y rail relativamente ancho consumen el espacio útil en paneles bajos/estrechos.
10. Naming y defaults repartidos entre módulos; hay búsquedas por nombres heredados que impiden renombrados indiscriminados.

La auditoría de base cubre 15 estados × 30 tamaños = 450 casos. Detecta 63 casos con al menos una incidencia geométrica o de texto; no implica 63 causas distintas. No se afirma una prueba exhaustiva de los controles que solo existen dentro de AE. El informe distingue contenido animado intencional dentro de una preview de chrome desbordado.

## 4. Dirección de diseño

Una herramienta de trabajo oscura, no una landing page: tres superficies, títulos 15–17px, cuerpo 13px, filas familiares a AE, cifras tabulares. Acento único #66C2FF con texto #0D0E11. Los colores propios de presets/imágenes no se recolorean como si fueran acentos de UI. Marca clara en cabecera, ejemplos y pie; no se repite en cada etiqueta de control.

La plantilla común será cabecera → preview si aplica → controles principales → avanzado → barra de acción persistente. La posición de preview y controles pasa de dos columnas a una a 720px. A 480px se apilan etiquetas/slider/valor según espacio. A 340px el contexto de la barra se abrevia; a 260px se simplifican wordmark y pie. Se soportará **220×360 CSS px**, con 240px como anchura compacta recomendada; el manifest podrá permitir 220px. La barra de acciones permanece fuera del scroll principal. El rail usa 44–48px en estrecho y una columna de texto en ancho; el contenido nunca depende de hover para estar disponible.

Hay una sola acción de acento por pantalla; las utilidades directas siguen siendo botones secundarios, sin confirmaciones adicionales para tareas reversibles. El halo ambiental solo está en esa acción principal. El contenido de cada pantalla, todos sus parámetros y las acciones se inventarían antes de moverlos; no se eliminarán funciones.

## 5. Mapa de información y componentes

Ver MAPA_E_INVENTARIO.md y COMPONENTES_Y_TOKENS.md. Los nombres de efectos, presets, secciones y controles de UI se mantienen. Los nombres técnicos de índices/route keys también se mantienen, aunque Complex tenga un acceso anidado dentro de Texto. Cambiar de sección es instantáneo y estático; el estado de scroll y las familias abiertas se conserva.

## 6. Decisiones y alternativas descartadas

| Decisión | Problema que resuelve | Alternativa descartada |
|---|---|---|
| Frame de ancho explícito + clip hijo | Medios que fuerzan anchura; halo recortado | Ocultar overflow del documento o reducir solo el PNG |
| Catálogo único de componentes | Filas y controles inconsistentes | Añadir una cuarta capa de overrides específicos |
| Preview dominante y controles por intención | Desplazamiento excesivo y poca orientación | Mostrar 30 sliders simultáneamente |
| Rail compacto con labels/tooltip accesibles | Anchuras 220–480 | Ocultar herramientas o usar menú distinto por sección |
| Barra de acción fuera del scroll | Aplicar requiere buscar un botón | Clonar handlers/botones por toda la pantalla |
| Halo único con estados marcados en el más cercano | Exceso visual y cientos de animaciones | Animar todos los bordes en reposo |
| Inputs/selects dentro de wrapper halo | Pseudo-elementos no fiables en elementos reemplazados | Intentar ::before en input/select |
| Nombres centralizados + alias | Expresiones y rigs antiguos dependen de literales | Sustituir «Animix» globalmente |
| Defaults de marca separados del catálogo | Identidad sin alterar presets | Reescribir JSON de presets o textos guardados |
| Una versión pública + revisión interna de UI | El brief exige 3.1.0 y manifiesto coherente | Subir solo la etiqueta del header o cambiar el ID CEP |
| Pruebas de bounds y ancestros | scrollWidth global no detecta clips | Validar solo document.documentElement |

## 7. Movimiento

| Elemento | Duración/token | Curva | Propiedad |
|---|---|---|---|
| Hover / estados | 120–240ms; --dur-fast/--dur-base | --ease-standard (.4,0,.2,1) | opacity, color de estado |
| Salida del halo | 400ms; --dur-exit | --ease-standard | opacity |
| Pulsado | 120ms; --dur-fast | --ease-standard | transform scale(.97), opacity |
| Familias TEXT | 320ms; --dur-slow | --ease-out (.32,.72,0,1) | apertura existente conservada; contenido opacity/translate ≤4px; alturas reales, no grid 0fr→1fr |
| Pestaña interna | 180–220ms; token de popover | --ease-out | opacity y translate ≤6px |
| Popover | 200ms; token de popover | --ease-out | opacity y scale .98→1 |
| Tooltip | retardo 400ms; entrada 150ms | --ease-standard | opacity |
| Halo hover/foco | 7s/vuelta lineal | linear | --halo-angle registrado |
| Halo principal | 9s/vuelta lineal | linear | --halo-angle |
| Cambio de sección / rail activo | **0ms** | ninguna | sin animación de menú ni contenido |
| Reduced motion | 0ms para desplazamientos/rotación | ninguna | foco/estado estáticos, sin loop |

La selección de presets/barridos mantiene scrollTop y no dispara navegación animada; desplazamientos iniciados por el usuario pueden ser suaves. Esto exige que las restauraciones programáticas de scroll sigan siendo instantáneas, no un smooth global que provoque saltos.

## 8. Branding, naming e impacto nativo

Ver NAMING.md y DEFAULTS_POR_EFECTO.md. Se propone una fuente común `shared/product-config.js` compatible con ES3 para BRAND, BRAND_MOTION y VERSION=3.1.0. El XML no puede leer una constante JS al cargar: el manifest se generará desde esa fuente **en las herramientas de empaquetado**, no con un build que deba ejecutar el usuario. La extensión final sigue siendo HTML/CSS/JS/JSX planos, sin frameworks ni descargas externas.

**Aviso de alcance:** el branding de capas/comps/controles requiere cambios limitados en JSX, además de frontend. Es imprescindible para la petición; no cambia las matemáticas, datos o valores de presets ni firmas de las API. El puente de PR #4 se conserva. Se propone una revisión interna/fingerprint para distinguir el host rediseñado de otro host 3.1.0 que quede en memoria, sin cambiar la versión pública exigida. Esta adaptación del handshake, si se confirma necesaria al implementar, tendrá pruebas de recarga/reconexión y rollback, nunca una sustitución del puente.

Dos excepciones propuestas que requieren aprobarse con esta decisión: los generadores Count Up/Timer conservan su contenido numérico/temporal (marca en nombre/caption), y el modo «original» explícito conserva el contenido del recurso de referencia. La marca por defecto de las acciones normales/previews será Yaguano o Yaguano Motion. Así no se cambia una función ni se falsifica un original para imponer una palabra.

## 9. Lugares de marca y funciones reubicadas

Marca: wordmark, logo existente, pie, menú CEP, defaults de ejemplo y preview, nombres de nuevos elementos nativos, instaladores/archivo de distribución/documentación. No se renombra contenido del usuario, presets ni originales AEP. Los nombres de funciones/API y claves de almacenamiento heredadas no son branding y se conservan.

Reubicaciones: Complex pasa al grupo Texto manteniendo acceso directo/alias de ruta; zoom/barridos siguen solo en Presets de texto; controles Lab mantienen texto arriba, transportes/exportación/IN-OUT/hold/Echo/Ghost/Fill1–5/anclaje/curvas; acciones de pantalla van al pie fijo sin duplicar listeners; utilidades poco frecuentes se agrupan en Avanzado; Tools conserva tabs y biblioteca/editor; Retícula conserva los diez formatos y overlays; Grid Pro conserva todos sus vínculos. El buscador global permite abrir y elegir cualquier preset en dos clics desde otra sección; dentro del catálogo, familia/pack y preset también son dos clics. No aplica la animación automáticamente.

## 10. Evidencia, licencias y aprobación

- INFORME_RESPONSIVE.md / informe.html: baseline, prototipo y prueba de medios, con capturas.
- mock/index.html: propuesta navegable independiente, sin AE y sin cambios al producto.
- Halo_Estados.webm y capturas halo-*.png: reposo, hover, foco, pulsado y principal. El clip muestra una muestra, no el producto implementado.
- REFERENCIAS.md: tabla por sección/componente; fuentes verificadas y alternativas a URL rotas.
- NAMING.md / AUDITORIA_NAMING.json: patrones, alias, riesgos y pruebas previstas.
- Inter OFL local; ningún activo de Apple ni código de bibliotecas de UI adaptado. JS/CSS propios; imagen y logo del usuario.

**Aprobar esta propuesta autoriza pasar a implementación por fases.** No constituye todavía una nueva extensión instalable. Tras aprobar: medios/base responsive → sistema/naming/halo → navegación → TEXT/Complex → Carrousel → Tools/resto → ajustes/detalles, sin avanzar de fase con desbordamientos. Se ejecutarán pruebas de scroll, puente nativo, datos/nombres, matriz completa y accesibilidad. El acoplamiento/flotante y escalado real 100–200% se deben comprobar manualmente en AE; no se simularán como resultados aprobados aquí.


## Protección del motor al integrar estilos

Los estilos de chrome se acotarán a la app/componentes y no al escenario offscreen de bake 1920×1080. GeistLab760/YMXGeist, medidas, SVG de filtros, IDs y parámetros de la animación se conservarán; Inter es la fuente de UI. No se aplicará width:100% a todos los SVG internos indiscriminadamente: la regla global es max-width:100%, y el dimensionado pertenece al SVG raíz de cada preview. Se compararán los33 presets con el mismo texto/tiempos antes y después, separando cambios de naming del muestreo numérico. Las clases que usa JS permanecerán como contrato aunque cambie el estilo visual; la consolidación no elimina nodos/handlers sin actualizar sus consumidores.
