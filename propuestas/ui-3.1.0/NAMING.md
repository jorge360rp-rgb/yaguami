# Naming Yaguano — propuesta de migración compatible

**No hay renombrado aplicado todavía.** Cambiar solo la palabra visible en capas no basta: hay expresiones y búsquedas por nombre. AUDITORIA_NAMING.json recoge 195 puntos de creación, nombres o lookup en las fuentes JSX (se excluye el bundle generado para no duplicarlos).

## Fuente única

`shared/product-config.js` será ES3 sin referencias a window, con BRAND="Yaguano", BRAND_MOTION="Yaguano Motion" y VERSION="3.1.0". Un único naming(kind,effect,index) y uniqueName(container,...) construirán nombres; el manifest, header, pie, diagnóstico y distribución derivarán de esa misma fuente. El XML se genera durante empaquetado de desarrollo: el usuario instala archivos planos, sin compilar. La revisión de UI/hash de bundle es un identificador interno, no una segunda versión mostrada.

Separador: U+00B7 (` · `) en UTF-8 y literales escapados con JSON.stringify al crear expresiones. No usar el texto localizado de nombres de efectos de Adobe: conservar matchName.

| Elemento generado | Patrón | Ejemplo |
|---|---|---|
| Capa de texto nueva | Yaguano · <Efecto> | Yaguano · Smart Reveal |
| Forma | Yaguano Shape · <Efecto> | Yaguano Shape · Grid Pro |
| Nulo/control | Yaguano Ctrl · <Efecto> | Yaguano Ctrl · Slide |
| Ajuste | Yaguano Adj · <Efecto> | Yaguano Adj · Lo-Fi Steps |
| Sólido/fondo | Yaguano BG | Yaguano BG |
| Composición | Yaguano Motion · <Efecto> | Yaguano Motion · Órbita suave |
| Precomposición | Yaguano Pre · <Efecto> | Yaguano Pre · Slide |
| Raíz / carpetas | Yaguano Motion / Yaguano Text, Yaguano Carousel, Yaguano Fluid | Yaguano Motion / Yaguano Text |
| Animator/control de expresión nuevo | Yaguano · <Parámetro> | Yaguano · Distancia |
| Duplicado | <nombre base> 02, 03… | Yaguano · Smart Reveal 02 |
| Texto de ejemplo general | BRAND_MOTION | Yaguano Motion |
| Ejemplo corto | BRAND | Yaguano |
| Menú / extensión | BRAND / BRAND_MOTION | Yaguano / Yaguano Motion |
| Pie | BRAND_MOTION · vVERSION | Yaguano Motion · v3.1.0 |

No se prefija cada etiqueta visible de UI; Smart Reveal, Órbita suave, Línea editorial, los controles y secciones conservan sus nombres. El branding de elementos generados en AE es distinto del naming de UI.

## Auditoría por módulo y compatibilidad

| Fuente | Dependencias actuales por nombre / metadata | Acción segura propuesta |
|---|---|---|
| jsx/host.jsx · Texto | Animix <kind> In/Out, MaskMotion/Mask Reveal, WO, Highlight, Spring Selector; Yaguano Spring/TW/Sweep/FX/Zoom; removers y expresiones | Nombre nuevo centralizado al crear; alias heredados al detectar/quitar/actualizar; jamás cambiar un TextDocument seleccionado por branding |
| jsx/host.jsx · fondos | YBG_PREFIX, YBG_CTRL, YBG_COLORS, SPEED/POWER; expresión bgExprProperty | Tabla de alias por parámetro; expresiones nuevas construidas con el nombre real encontrado |
| jsx/host.jsx · biblioteca | YL_ORIGINAL / YL_INSTANCE y nombres originales AEP | Conservar tags/IDs y originales; renombrar solo copias independientes, con memo del grafo y referencias correctas |
| jsx/host.jsx · Grid Pro | DG_NAME, DG_BG, DG_MASK, DG_META, DG_EXPR / DG_SCALE_EXPR; dgLayer/dgBgLayer/dgBoundsJS | Metadata primero, alias antiguo/nuevo después; migración de nombre solo explícita y con expresiones actualizadas |
| jsx/lab-native.jsx | Carpetas, glifos, scale/position nodes, IDs de muestreo | IDs internos y geometría no cambian; nombre visible por helper, descriptor interno separado |
| jsx/lab-editable.jsx | driverName/cacheName, fields[].name, nombre de comp/layer en expresiones, IDs externos | Rigs antiguos leen su metadata con nombres antiguos; nuevos guardan nombres nuevos; globals usan referencias resueltas, no literales repetidos |
| jsx/carrousel.jsx | YaguaTool Carrousel Control y etiquetas de sliders/pins en expresiones | Crear un mapa de nombres por instancia y usarlo en todas las expresiones/máscaras; rigs previos intactos |
| jsx/complex-text.jsx | Vapor Text, Text 01/02 y marker de master | Master importado intacto; copias con nombres nuevos; localizar por IDs/metadata antes de renombrar, no perder el mapa de textos |
| jsx/tools-pro.jsx | Expresiones/loops, formas y comps duplicadas | Nombrar únicamente lo que se crea; no renombrar fuentes, capas seleccionadas ni código del usuario |
| jsx/workflow.jsx | Comp RRSS generada | nombre común, valores de formatos/FPS/duración sin cambios |
| js previews / Lab / librerías | Defaults dispersos, referencia original y estado persistido | Default de marca solo cuando no hay texto de usuario; thumbnails/previews usan helper sin reescribir catálogos |
| Instaladores / manifest / bridge | com.animix.panel, root, versiones, backup folders | IDs CEP y API Animix.call quedan; ruta nueva o actual resuelta por bridge; backup fuera de CEP y no coexistencia del mismo ID |

No se editarán AEP, fuentes ni ZIP publicados, JSON de presets o presets guardados. No se hará find/replace global de Animix/YaguaTool. No se renombrarán automáticamente elementos de proyectos existentes. Alias no significa borrar cualquier capa de usuario que coincida: se exigen metadata/controles propios. La limpieza continúa limitada a IDs propios y sin usos externos.

## Texto del usuario y excepciones funcionales

Capa de texto ya seleccionada: contenido intacto. Estado persistido: no se interpreta «Tu texto» o «Meet Qwix» como permiso para sustituirlo; se respeta cualquier valor guardado y se aplica marca solo a nuevos defaults. Los generadores numéricos/Timer mantienen su salida y valores para no cambiar la función; marca en nombre y caption. La acción de referencia original conserva los textos del recurso al invocarse explícitamente. Estas dos excepciones forman parte de la propuesta de aprobación.

Fluido mantiene AEP master intacto. Una copia independiente puede usar defaults Yaguano / Motion si el usuario elige texto personalizado; el original y su preview real siguen siendo originales.

## Pruebas a añadir al implementar

1. Patrones por tipo y duplicados 02/03 con nombres que contienen espacios, acentos, comillas y barras.
2. Misma versión en manifest, web, host y distribución, proveniente del config único; recarga de host antiguo con misma versión pública y revisión interna distinta.
3. No sobrescribir contenido/nombre de una capa seleccionada o texto/preset guardado por branding.
4. Crear/quitar/actualizar sobre proyectos nuevos y sobre rigs legacy; resolver nombres antiguos y nuevos sin tocar terceros.
5. Expresiones y metadatos usan el nombre real generado/encontrado, incluyendo cambios de comps/instancias y duplicados.
6. Grid/fondos/Carrousel/Lab conservan enlaces, máscaras, secuencia, curvas y parámetros; limpieza solo de propios.
7. SHA256 de AEP, JSON de presets, fuentes originales y ZIP publicados idénticos; Inter con OFL.
8. Declaración de branding central: no se permiten literales sueltos para nuevos nombres generados fuera del módulo/aliases.
