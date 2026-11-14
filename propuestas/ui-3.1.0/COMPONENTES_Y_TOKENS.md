# Catálogo y sistema de diseño propuestos

Todos los componentes serán propios (HTML/CSS/JS), con los mismos IDs/valores/handlers del producto. La implementación integrará un sistema coherente y retirará reglas antiguas conflictivas; no se limitará a acumular otro fichero de parches.

| Componente | Anatomía / tamaño | Responsive | Halo / teclado |
|---|---|---|---|
| Botón primario | Uno por pantalla, azul #66C2FF, texto casi negro, alto ≥32px, radio 8px | Ancho flexible; verbo corto en estrecho y aria-label completa | Ambiental 9s; foco 2px; pressed .97 |
| Botón secundario / icono | Superficie elevada, etiqueta o icono uniforme 16/20px, hit area 32px | Texto envuelve o ellipsis con título; icon-only conserva nombre accesible | Hover 7s solo en el más cercano; Enter/Space |
| Fila de ajuste | Label, slider fino, valor tabular, unidad | ≥480 una fila cuando cabe; estrecho label arriba y rango/valor debajo | Rango nativo y valor con arrastre; teclado/foco; doble clic/Enter para escribir |
| Campo / pop-up | Input/select dentro de wrapper borde/halo; mínimo 32px | width/max-width:100%, min-width:0 | Sin pseudo en input reemplazado; select nativo, opciones por teclado |
| Segmented / tabs | 2–4 opciones cortas, estado activo azul claro | Envuelve en dos filas o cambia a pop-up cuando las etiquetas no caben | APG tabs manual, flechas/Home/End, Enter/Space |
| Interruptor | Pastilla azul (no verde), thumb contrastado, área ≥28–32px | No se encoge; label puede envolver | role=switch, aria-checked, Space; foco visible |
| Grupo plegable | Summary con nombre/contador, cuerpo asociado | Ancho fluido, títulos envolventes | Teclado nativo/APG; familia conserva animación, body ≤4px |
| Tarjeta / fila de preset | Nombre compacto, selección y favorito accesible | Grid auto-fit con mínimos limitados por 100%; una columna a 220px | aria-pressed; no depender de hover; conservar scroll |
| Preview / medio | Frame halo exterior, clip hijo de ratio, transporte fuera | Sin min-height que transfiera ancho; contain, viewBox o backing-store independiente | Ampliar preview accesible; caption siempre legible |
| Gráfico / pins | Trazo y handle visual discreto, target ≥28px | Hit area en CSS px, no escalada por viewBox; números X/Y alternativos | Teclado, reset, nombre/valor; contraste 3:1 |
| Lista / biblioteca | Search + filtros + filas, selección y ficha | Un panel o dos columnas según ancho | Acciones visibles al foco/táctil, títulos para truncado |
| Barra de acción | Fuera del scroll principal; estado + acción principal | Compacta en ≤340; presente a 360px de altura | Orden de foco estable; no clonar callbacks |
| Tooltip | Singleton medido respecto al viewport, retardo 400ms | Clamp lateral/vertical; nunca obliga a scroll horizontal | aria-describedby, foco y hover, no información exclusiva |
| Vacío / carga / error | Mensaje corto, contexto y acción útil | Texto envuelve; no ilustraciones grandes | aria-live; errores de host persistentes y reintento |
| Diálogo | Título, contenido, acciones; foco contenido | max-width:calc(100% - gutters), alto máximo con scroll interior | Escape, restaurar foco, no cambiar confirmaciones existentes |

## Tokens

| Grupo | Propuesta |
|---|---|
| Superficies | --base:#101216; --surface:#191C22; --raised:#22262E; --interactive:#292F39 |
| Texto | --text:#F1F4F8; --secondary:#B0B8C5; --tertiary:#8F9BAD; disabled opacidad .25 (exento de contraste de contenido activo) |
| Acento | --accent:#66C2FF; --accent-ink:#0D0E11; --focus:#91D3FF; hover #8BD1FF |
| Selección | --selected:rgba(102,194,255,.12); --selected-border:rgba(102,194,255,.55) |
| Halo | --halo-color:190,230,255; --halo-opacity:.06 reposo, .48 hover/foco, .7 pulsado; principal .23 blanco |
| Bordes / track | --border:rgba(255,255,255,.08) decorativo; track interactivo #6F7F96 (no se confía en el borde 8% para información esencial) |
| Semánticos propuestos | Error #D6A2A2; aviso #CAB995; éxito #9EBCAC; uso local, no sustituyen el acento |
| Tipo | -apple-system,"SF Pro Text",Inter,"Segoe UI",sans-serif; Inter empaquetada OFL; 13/11–12/15–17px; 400/500/600; tabular-nums |
| Código / valores | Consolas,"Liberation Mono",monospace para código; valores Inter con tabular-nums; no keyword ui-monospace por Chrome99 |
| Espaciado | 4,8,12,16,24px expresados en rem; gutters clamp(8px,2.2vw,24px) |
| Radios | Control 8px; tarjeta 14px; panel 18px; hijos con radio = radio padre menos borde/padding |
| Sombra | 0 .6rem 1.5rem rgba(0,0,0,.16); sin glow persistente en todas las tarjetas |
| Curvas | --ease-out:cubic-bezier(.32,.72,0,1); --ease-standard:cubic-bezier(.4,0,.2,1) |
| Tiempos | --dur-fast:120ms; --dur-base:240ms; --dur-slow:320ms; --dur-exit:400ms; tooltip:150ms + retardo400ms; popover200ms |
| Breakpoints | ≤260,≤340,≤480,≤720,>720; altura≤480; mínimo220×360 CSS px |

Los tokens del prototipo están en mock/design.css como muestra revisable. Los tokens de duración complementarios se completarán en la integración; ninguna duración arbitraria quedará repartida por componentes. Los ~40% de texto terciario del brief se traducen a un color medido, no a opacidad literal que haga fallar AA en texto pequeño.

## Halo: técnica y rendimiento

`.halo` usa pseudo de anillo con inset:-1px y padding de 1px; conic-gradient y -webkit-mask / -webkit-mask-composite:xor. El frame no recorta: el hijo de medios sí. Los wrappers de campos reciben foco de sus inputs. Solo el elemento más cercano recibe el estado hover/foco para evitar halos de todos sus ancestors. En reposo no hay loops salvo el primario. Sin box-shadow/filter animado en bucle, sin backdrop-filter masivo. Reduced motion deja estados/foco sin rotación ni scale.

## Compatibilidad

Chrome99 soporta custom properties, flex/grid, minmax/min/clamp, gap de flex, aspect-ratio, object-fit, conic-gradient, @property, :focus-visible, ResizeObserver y prefers-reduced-motion utilizados. No se usarán :has, @container, color-mix, oklch/lab, dvh/svh ni scrollbar-width. El CSS actual contiene color-mix y scrollbar-width heredados: se retirarán al consolidar.

Doiuse señala CSS Masks como soporte parcial: el halo usa explícitamente la ruta prefijada de WebKit compatible, y tendrá fallback de borde/foco estático si no se soporta. No se declara compatibilidad basándose en silencios del linter: se probará esa ruta en CEF/AE. El entorno automatizado utiliza Chromium actual, no un binario de Chromium99; el contraste y la geometría se prueban aparte.


## Temas conservados

La maqueta revisable muestra el oscuro, prioritario en AE. No se elimina Claro ni Midnight ni se sobrescribe la preferencia existente. En integración se completarán tokens por tema y se repetirán contraste/matriz: Claro usará superficies #F4F6F8/#FFFFFF/#E9EDF2, texto #17202B y el mismo botón #66C2FF con texto #0D0E11; enlaces/foco usarán una derivación oscura del azul (#0B5F92), porque el azul claro como texto sobre blanco no alcanza AA. Midnight mantendrá tres superficies azul-negras (#0D121B/#151E2B/#1E2B3C) sin introducir un segundo acento. Estos temas todavía no están implementados en la maqueta ni certificados por sus pruebas.

Búsqueda global: icono de cabecera, diálogo con búsqueda/lista, Escape y restauración de foco; cargar no aplica. Indexará presets por ID, biblioteca y recursos propios sin ejecutar scripts. El prototipo muestra el flujo con78 entradas; la integración indexará todo el inventario real.
