# YaguaTool 3.0.1 — corrección de conexión con After Effects

El usuario informó de «error línea 1» y de que ningún botón de creación/aplicación funcionaba, aunque las previews web sí. En 3.0.0 el punto de entrada nativo comenzaba con `#include "host.jsx"` y dependía de inclusiones relativas; el panel marcaba «AE conectado» por la mera presencia de CEP, sin verificar la carga del host ni recuperarla. La línea exacta que falló en el equipo del usuario no se pudo inspeccionar desde este entorno.

## Corrección

- `jsx/yagua-host.jsx` es ahora un archivo ES3 autocontenido que incluye el núcleo y los cinco módulos, sin directivas #include. Se genera con `python qa/build_host.py`.
- El panel carga explícitamente ese archivo por ruta absoluta mediante $.evalFile. Normaliza rutas de Windows/macOS y URLs de CEP, espacios y caracteres codificados. No presupone que ScriptPath haya cargado correctamente el host.
- La ruta de recursos se suministra explícitamente; una ausencia de $.fileName ya no interrumpe el registro de todos los módulos.
- Una comprobación nativa valida versión 3.0.1, raíz, módulos y las funciones necesarias de Texto, Motion Lab, Fluido, Carrousel y Tools. El estado «AE conectado · host 3.0.1» requiere superar esa comprobación.
- Los botones esperan a la conexión verificada. Los errores de carga permanecen visibles con su detalle y botón Reconectar AE. Se sustituyen hosts antiguos que hayan quedado en memoria. Los fallos nativos de una operación se muestran al usuario.
- Se conserva la interfaz, presets, parámetros, datos, AEP original y motores de animación de 3.0.0.

## Pruebas realizadas

- Sintaxis ES3 del archivo nativo final y de las llamadas enviadas por CEP.
- Arranque sin host cargado, rutas Windows/macOS, versión antigua, error línea 1, escape del mensaje y recuperación posterior.
- Navegador con transporte CEP hacia un entorno nativo simulado que ejecuta el bundle real distribuido (no respuestas de éxito prefabricadas): botón Aplicar de Texto crea animadores; Original nativo de Lab lee el JSON incluido y crea capas; Crear e Insertar de Lab muestrean la preview, escriben datos y ejecutan el constructor; Crear carrousel genera comp y capas.
- Error de arranque visible y reconexión con estado verificado; scroll estable y regresiones de máscaras/adaptadores pasan.

Estos tests ejecutan el código real del paquete con APIs de Adobe simuladas. No hay After Effects instalado en este entorno y no se declara comprobación del render ni del comportamiento real de esas APIs en AE.

## Actualizar

Cierra After Effects, extrae el ZIP completo y ejecuta el instalador. Reinicia AE y abre YaguaTool. El encabezado debe indicar «AE conectado · host 3.0.1». Instala GeistLab760.ttf para el Lab nativo; Fluido utiliza Impact. Si aparece el recuadro de error, Reconectar AE vuelve a cargar los scripts e indica el detalle del fallo. Se incluye YaguaTool_Diagnostico.jsx para diagnóstico manual opcional desde Archivo > Scripts > Ejecutar archivo de script.
