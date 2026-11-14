[Descargar propuesta completa con prototipo y todas las capturas](Yaguano_UI_Propuesta_3.1.0.zip)

# Yaguano · Propuesta UI 3.1.0 — pendiente de aprobación

Esta entrega prepara las decisiones solicitadas antes de implementar. **No es una extensión instalable y no modifica la versión 3.1.0 ni sus AEP/ZIP.**

1. Abre **informe.html** para ver comparación, capturas de los 450 casos base y450 de maqueta, regresión de medios y halo.
2. Abre **mock/index.html** para navegar el prototipo sin conexión a AE. Búsqueda global, sliders, controles, tabs y switches son muestras de interacción; previews/pins son representativos y ningún botón ejecuta scripts. La muestra de búsqueda indexa78 presets; el producto deberá indexar también los recursos/bibliotecas del usuario.
3. Revisa **DECISIONES_UI.md** (causa del bug y decisiones), **MAPA_E_INVENTARIO.md**, **COMPONENTES_Y_TOKENS.md** y **REFERENCIAS.md**.
4. Revisa **NAMING.md** y **DEFAULTS_POR_EFECTO.md**: nombres centralizados, compatibilidad con proyectos antiguos y excepciones funcionales de números/Timer/originales.

Base correcta: release e2bc261… de3.1.0, con PR#4 como ancestro. main no contiene esa entrega. Fuente y producto protegidos por hash:153 archivos sin cambios.

Decisiones clave a aprobar: diseño oscuro con azul #66C2FF; mínimo220×360; preview/controles/acciones coherentes; Complex dentro de Texto con alias; naming Yaguano para nuevas creaciones; valores numéricos y modo original conservan contenido funcional. La versión pública seguirá siendo3.1.0 por el brief; se diferenciará la revisión interna para evitar un host antiguo en memoria.

La aprobación autoriza implementación por fases. El documento original pide: «Espera mi aprobación de todo esto antes de implementar» (BRIEF_ORIGINAL.txt). No se ha hecho todavía el rediseño del producto.


Para revisar: descomprime todo y abre informe.html; contiene enlaces a las imágenes y al prototipo. Si tu navegador restringe file://, sirve esta carpeta con `python -m http.server 8771` y abre http://localhost:8771/informe.html. El entorno de desarrollo bloquea file:// por política, por lo que la prueba interactiva se realizó con HTTP local, sin recursos de internet en la maqueta.

Las carpetas con las 900 capturas están en el ZIP; no se duplican como 900 blobs de Git.
