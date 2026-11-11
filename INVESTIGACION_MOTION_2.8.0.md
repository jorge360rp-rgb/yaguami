# Investigación de diseño y motion · 2.8.0

Revisión: 11 de noviembre de 2026. Objetivo: renovar la interfaz de una extensión CEP de After Effects y dar a sus seis revelados con máscara una identidad visual propia. La investigación combina documentación de Apple, análisis de fundiciones y escuelas especializadas y casos publicados por estudios. No se han copiado animaciones, fuentes ni recursos gráficos de estas marcas.

## Fuentes y decisiones

| Fuente consultada | Observación relevante | Decisión aplicada |
| --- | --- | --- |
| [Apple · Motion](https://developer.apple.com/design/human-interface-guidelines/motion) | El movimiento debe comunicar una respuesta, una relación o un cambio de estado, con moderación. | Respuesta breve a la pulsación, indicador que se desplaza entre secciones y entrada suave del contenido. |
| [Apple · Materials](https://developer.apple.com/design/human-interface-guidelines/materials) | Los materiales separan los controles del contenido. Apple reserva Liquid Glass para la capa funcional y recomienda usarlo con mesura. | Translucidez en cabecera y navegación; tarjetas de contenido opacas y legibles. |
| [Apple · Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) | La interfaz debe adaptarse a preferencias y métodos de interacción. | Foco visible, etiquetas de campos, conservación del foco de navegación por teclado y preferencia de movimiento reducido. |
| [Apple · presentación del diseño de 2025](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/) | Material, tipografía y movimiento se presentan como un sistema coherente. | Paleta contenida, radios consistentes, tipografía del sistema y una jerarquía común entre secciones. |
| [The Type Founders · Typography Trends in 2026](https://thetypefounders.com/world-of-type/typography-trends-in-2026/) | El análisis de septiembre de 2026 identifica variedad y contraste: tipografía expresiva junto a sistemas discretos. También destaca el movimiento contextual, incluso sutil. | Interfaz tranquila y presets expresivos. La creatividad vive en la preview, mientras los controles se mantienen estables. |
| [Monotype · Type Trends: Re:Vision](https://www.monotype.com/type-trends) | La investigación tipográfica vincula expresión visual y contexto cultural; no prescribe una única apariencia contemporánea. | Mantener editables fuente, texto y color del usuario. Los presets aportan tratamiento y ritmo, sin imponer una tipografía. |
| [Monotype · Human Types](https://typetrends.monotype.com/human-types/) | El proyecto pone en primer plano criterio y expresión de los diseñadores. | Seis coreografías reconocibles, con decisiones geométricas y temporales explícitas, en lugar de una variación aleatoria. |
| [BUCK · Comfy Brand Refresh](https://buck.co/work/comfy-brand-refresh) | El estudio documenta contenedores modulares, tipografía adaptable y revelados espaciales con máscara. | Prism Sweep y Split Slide exploran cortes, módulos y desfases; Iris Bloom usa una apertura espacial. Son interpretaciones originales, no recreaciones del proyecto. |
| [BUCK · BUCK Rebrand](https://buck.co/work/buck-rebrand) | Un sistema común puede sostener formas expresivas y contrastantes. | Los seis presets comparten controles y una base geométrica, pero cada uno presenta una silueta y cadencia distintas. |
| [Ordinary Folk · Process](https://www.ordinaryfolk.co/process) | Su proceso conecta mensaje, diseño, animación y refinamiento del movimiento. | Diseñar primero el carácter de cada revelado; después ajustar su trayectoria, tiempos y salida. |
| [School of Motion · State of Motion Design 2025](https://schoolofmotion.com/blog/eoy2025) | El análisis de la industria sigue situando composición, tipografía y principios de animación entre las capacidades duraderas. | Priorizar legibilidad, llegada cuidada y control del ritmo frente a añadir efectos que compitan con el texto. |
| [Motionographer · predicciones para 2025, parte 2](https://partners.motionographer.com/2025/01/02/25-for-2025-the-motionographers-crystal-ball-motion-design-predictions-part-2/) | La publicación describe tipografía cinética y materialidad como líneas de exploración. Es una predicción editorial de 2025, no una medición del mercado de 2026. | Usarla como referencia secundaria para explorar velos, cintas y aperturas, contrastada con casos de estudio y fuentes más recientes. |

## Síntesis e interpretación

Las fuentes no establecen un único estilo dominante en 2026. La lectura de este proyecto es combinar una herramienta de edición serena con un repertorio de movimiento más expresivo. Se han elegido cuatro principios: contraste entre interfaz y contenido; aperturas con carácter espacial; cadencias que se puedan dirigir; y llegada limpia para que el titular conserve su legibilidad.

Esta síntesis es una decisión de diseño para Yaguanimix, no una afirmación de que todos los estudios sigan esas reglas. Los nombres y las formas de los seis presets son desarrollos propios.

## Traducción a los seis revelados

| ID conservado | Nuevo nombre | Tratamiento |
| --- | --- | --- |
| MRU | Silk Rise | Un borde Bézier curvo sube como un velo mientras el texto asciende. La curvatura se disuelve al terminar. |
| MRD | Ribbon Fall | Una apertura de borde redondeado desciende como una cinta, acompañada de un movimiento tipográfico corto. |
| MRL | Prism Sweep | Un barrido lateral desarrolla una inclinación prismática transitoria y un desplazamiento coordinado del texto. |
| MRR | Split Slide | Cada línea se divide en tres franjas con inclinación y desfase propios, como una persiana editorial. |
| MSC | Iris Bloom | Una apertura central crece en anchura y altura; sus esquinas redondeadas se transforman en una ventana completa. |
| MDI | Oblique Cut | La inclinación alterna entre líneas y se acompaña de una trayectoria diagonal. |

Las curvas de entrada tienen una llegada prolongada. Las salidas aceleran y sustraen aperturas por línea, de modo que también tengan coreografía. Se puede elegir orden normal, inverso, desde el centro o alterno. Intensidad cero reduce la deformación de la forma; desplazamiento cero elimina el movimiento tipográfico adicional.

## Qué no se ha adoptado

Se han descartado deformaciones de glifos dependientes de una fuente variable, simulaciones 3D y capas de partículas: añadirían dependencias o cambiarían el carácter de la tipografía del usuario. Tampoco se ha trasladado la transparencia a todas las tarjetas; en un panel de edición estrecho perjudicaría la jerarquía y la lectura. La implementación visual está inspirada en los principios de Apple y utiliza CSS compatible con CEP; no es el material nativo Liquid Glass de sus sistemas operativos.

La preview rápida comparte las formas y el muestreo temporal con el motor de AE. La rasterización de tipografía, feather y materiales difiere entre SVG y AE; la comprobación del acabado corresponde a la preview renderizada en After Effects.
