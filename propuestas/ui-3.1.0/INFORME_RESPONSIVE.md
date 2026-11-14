# Informe de diagnóstico y propuesta responsive

**No es la validación de un rediseño ya instalado.** El producto 3.1.0 permanece intacto; se comparan base, prueba de solución en DOM y prototipo independiente.

| Prueba | Resultado | Límite |
|---|---|---|
| Base 3.1.0 | 450 casos, 63 con incidencias detectadas | 15 estados: 12 secciones + Lab y dos tabs Tools |
| Matriz | anchuras 220/240/280/320/360/420/520/720/1000/1400 × alturas 360/560/800 | CSS px, tema oscuro y movimiento reducido para geometría |
| Prototipo | 450 casos, cero desbordamientos/solapamientos/recortes sin ellipsis detectados | Maqueta visual; no ejecuta la extensión |
| Regresión de medios | 24 fallos originales; 60 checks de solución pasan | Referencia + PNG simulado de AE; corrección inyectada solo en DOM de prueba |
| Axe | 0 infracciones automáticas en 13 secciones | No certifica AA por sí sola; revisar incomplete y teclado manual |
| Contraste | 17 combinaciones pasan | Texto ≥4.5:1; track ≥3:1; principal 9.86:1 |
| Chrome99 / doiuse | 2 avisos de CSS Masks parcial | Implementación prefijada WebKit con fallback de borde/foco; confirmar en CEF de AE |
| Integridad | 153 archivos de extensión sin cambios | Native bridge, presets, fuentes y AEP no modificados |

El informe visual está en [informe.html](informe.html). Se guardaron capturas de cada estado × ancho × altura, antes y propuesta. Las mediciones no se limitan al scroll del documento: también comparan frames/medios, ancestros, controles y clipping. Se excluye el desbordamiento artístico intencional dentro de previews recortadas.

## Problemas encontrados → solución propuesta

| Hallazgo | Evidencia / solución | Estado |
|---|---|---|
| Fluido fuerza ~451/676px por min-height + ratio | ancho explícito, min-height:0, clip hijo y media contain | Demostrado en 60 checks; pendiente producto |
| Inspector Lab demasiado estrecho | una columna; avanzados por intención; numeric controls accesibles | Maqueta responde; integración pendiente |
| SVG Tools mayor que botón | SVG fluido y targets estables; mínimos limitados por 100% | Maqueta responde; integración pendiente |
| Formatos RRSS min 160px | catálogo fluido/pop-up y barra contextual | Maqueta responde; integración pendiente |
| Color fields Grid Pro | filas apilables y min-width:0 | Maqueta responde; integración pendiente |
| Botones cortados Texto/Guardado/Tools | wrapping/ellipsis con títulos, secundarios compactos | Maqueta responde; integración pendiente |
| Versión/fuentes CSS incompatibles | tokens; Consolas/fallback mono en lugar de ui-monospace; retirar color-mix/scrollbar-width actuales | Propuesta y compat check; pendiente consolidar producto |

## Qué prueban y qué no prueban las herramientas

- Scripts y JSON están incluidos para reproducir las mediciones. El navegador automatizado es Chromium actual; doiuse comprueba el objetivo Chrome99. No se ha ejecutado Chromium99 real ni After Effects.
- La búsqueda global de muestra carga un preset en dos clics, no lo aplica; Escape restaura el foco. Teclado: acordeón/Enter, tabs/flechas, switch/Space y ausencia de loops/transform bajo reduced motion tras estabilizar el estado.
- DPR automatizado 1/1.25/1.5/2 en 240×560 comprueba rasterización y ausencia de scroll. **No equivale a escalado real de SO/CEF ni a panel acoplado/flotante.**
- Las capturas de defecto/corrección y el halo son evidencia visual, no renders de After Effects. Los pins de Carrousel y las curvas del prototipo son representaciones; su interacción de producto se conserva y verificará al implementar.

## Verificación manual en AE pendiente tras aprobar e implementar

Panel acoplado/flotante; resize continuo; escalado SO 100/125/150/200%; temas oscuro/claro/Midnight; teclado y foco en menús/diálogos; texto largo/localizado; carga/error/empty/retry; preview real PNG; native create/insert/original Lab a60fps; Fill/Echo/Ghost/secuencia; scroll estable; imágenes/comps y pins; Tools/scripts/drop sin ejecución; alias de nombres legacy; contenido/presets guardados intactos. No avanzar de fase con desbordamientos.

## Reproducir

Servir la extensión intacta en :8770 y esta propuesta en :8771. node audit-baseline.js produce el baseline. node regression-media.js --proof reproduce el bug y prueba la estructura solo en DOM. node test-mock.js cubre la maqueta. Las dependencias Playwright, axe-core, postcss y doiuse son de desarrollo y no se incorporarán a la extensión.
