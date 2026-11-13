# Instalar YaguaTool 3.0.1

1. Cierra After Effects y extrae todo `YaguaTool_3.0.1.zip`.
2. Windows: ejecuta `YaguaTool/install_windows.bat`. macOS: ejecuta `YaguaTool/install_mac.command` (si hace falta, otorga permiso de ejecución al archivo desde Terminal).
3. Los instaladores copian la extensión al directorio CEP del usuario y respaldan las carpetas anteriores llamadas Yaguanimix/YaguaTool en `Documentos/YaguaTool_Backups`. No necesitas administrador. Conserva el respaldo para volver atrás.
4. Instala `YaguaTool/assets/fonts/GeistLab760.ttf` antes de crear composiciones nativas de Motion Lab. Se incluye su licencia OFL. Para el efecto fluido conserva/instala Impact, según la licencia de tu sistema.
5. Reinicia AE. Abre **Ventana > Extensiones (heredadas) > YaguaTool**.
6. El encabezado debe indicar **AE conectado · host 3.0.1**. Si aparece un error de carga, pulsa **Reconectar AE** y consulta su detalle.
7. Activa en las preferencias de scripts de AE **Permitir que los scripts escriban archivos y accedan a la red** para las previews PNG, los guardados JSON y la generación nativa del Lab. La extensión no añade telemetría.

## Instalación manual

Copia la carpeta completa `YaguaTool` a `%APPDATA%/Adobe/CEP/extensions/` en Windows o `~/Library/Application Support/Adobe/CEP/extensions/` en macOS. Activa `PlayerDebugMode=1` en CSXS 11/12/13 mediante el instalador o el registro incluido. La carpeta debe contener `CSXS`, `jsx`, `motion-lab`, `lab-data`, `library`, `assets`, `js` y `css`.

Retira del directorio CEP cualquier instalación adicional del mismo panel que hayas renombrado manualmente: la nueva versión conserva el ID CEP anterior para actualizarlo. Guarda esas copias fuera de `extensions`.

## Primer uso

- TEXT > Nativos: los barridos aparecen abiertos. Seleccionar otro preset o barrido mantiene el scroll. TEXT > Motion Lab v0.9: selecciona pack y preset, modifica controles y usa transporte/curvas/preview.
- **Crear animación en AE** hornea la configuración actual a 60 fps. **Crear e insertar en composición activa** añade una precomposición en el cabezal. Puede tardar según duración, texto y Echo/Ghost. No cierres el panel durante el cálculo.
- **Original nativo AE Lab v0.1** carga los datos predeterminados suministrados: no aplica los cambios actuales de sliders/texto. Se conserva como alternativa original.
- Complex text animation > **Renderizar preview real**: importa el AEP original una sola vez y genera 49 PNG. Crear copia/insertar duplica sus precomposiciones. Los dos textos opcionales afectan solo a la copia; la preview muestra el original. No se abre ni se sustituye tu proyecto.
- Carrousel: carga capas seleccionadas o elementos del proyecto, o importa imágenes. Configura la preview y crea una composición nueva. Los controles nativos permiten seguir ajustando el movimiento. Si faltan fuentes al reabrir otro proyecto, vuelve a cargar la selección.
- Tools: selecciona propiedades/keyframes para curvas y timing; los scripts de la biblioteca se ejecutan solo al pulsar Ejecutar o Ctrl/Cmd+Enter. Arrastrar un archivo únicamente lo añade.

## Recuperar la versión anterior

Cierra AE, mueve la carpeta nueva fuera de CEP y devuelve el respaldo a su ruta original. No mantengas las dos versiones con el mismo ID CEP activas a la vez. Los instaladores no eliminan proyectos, recursos ni preferencias de AE.

## Comprobación en AE pendiente

Los instaladores Windows/macOS y el render de AE no se pueden ejecutar en el entorno Linux de desarrollo. Prueba primero en una copia de proyecto: fuentes, color, efectos disponibles y permisos pueden influir en el resultado. Motion Lab se genera en 1920×1080 a 60 fps; el carrusel toma el tamaño/fps de la composición activa al cargar/crear. Las miniaturas del carrusel son estáticas (fotograma actual de una comp), aunque el contenido de esas comps se reproduce normalmente en AE.
