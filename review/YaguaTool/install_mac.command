#!/bin/bash
# YaguaTool 3.1.0 · user install, upgrade and rollback.
set -euo pipefail
YAGUA_SOURCE="$(cd "$(dirname "$0")" && pwd)"
YAGUA_EXTDIR="$HOME/Library/Application Support/Adobe/CEP/extensions"
YAGUA_DEST="$YAGUA_EXTDIR/YaguaTool"
YAGUA_STAGE="$YAGUA_EXTDIR/YaguaTool.__installing__"
YAGUA_BACKUP="$HOME/Documents/YaguaTool_Backups/$(date +%Y%m%d-%H%M%S)"
printf '\nYaguaTool 3.1.0 — After Effects 2024/2025\nCierra After Effects antes de instalar.\n'
[[ -f "$YAGUA_SOURCE/CSXS/manifest.xml" && -f "$YAGUA_SOURCE/jsx/yagua-host.jsx" ]] || { printf 'Extrae el ZIP completo y ejecuta desde YaguaTool.\n' >&2; exit 1; }
mkdir -p "$YAGUA_EXTDIR" "$YAGUA_BACKUP"
if [[ -e "$YAGUA_STAGE" ]]; then rm -rf "$YAGUA_STAGE"; fi
ditto "$YAGUA_SOURCE" "$YAGUA_STAGE"
[[ -f "$YAGUA_STAGE/motion-lab/reference-player.js" && -f "$YAGUA_STAGE/js/ae-bridge.js" && -f "$YAGUA_STAGE/jsx/yagua-host.jsx" && -f "$YAGUA_STAGE/library/Fluido_Original_AE2024.aep" ]] || { printf 'Copia incompleta; se conserva la instalación anterior.\n' >&2; exit 1; }
YAGUA_COMMITTED=0
function yagua_restore_on_error() {
  YAGUA_RESULT=$?
  if [[ "$YAGUA_RESULT" -ne 0 && "$YAGUA_COMMITTED" -eq 0 ]]; then
    if [[ ! -e "$YAGUA_DEST" && -d "$YAGUA_BACKUP/YaguaTool" ]]; then mv "$YAGUA_BACKUP/YaguaTool" "$YAGUA_DEST"; fi
    if [[ ! -e "$YAGUA_EXTDIR/Yaguanimix" && -d "$YAGUA_BACKUP/Yaguanimix" ]]; then mv "$YAGUA_BACKUP/Yaguanimix" "$YAGUA_EXTDIR/Yaguanimix"; fi
  fi
}
trap yagua_restore_on_error EXIT
if [[ -e "$YAGUA_DEST" ]]; then mv "$YAGUA_DEST" "$YAGUA_BACKUP/YaguaTool"; fi
if [[ -e "$YAGUA_EXTDIR/Yaguanimix" ]]; then mv "$YAGUA_EXTDIR/Yaguanimix" "$YAGUA_BACKUP/Yaguanimix"; fi
if ! mv "$YAGUA_STAGE" "$YAGUA_DEST"; then
  [[ ! -d "$YAGUA_BACKUP/YaguaTool" ]] || mv "$YAGUA_BACKUP/YaguaTool" "$YAGUA_DEST"
  [[ ! -d "$YAGUA_BACKUP/Yaguanimix" ]] || mv "$YAGUA_BACKUP/Yaguanimix" "$YAGUA_EXTDIR/Yaguanimix"
  printf 'No se pudo activar la versión; se ha recuperado la anterior.\n' >&2
  exit 1
fi
YAGUA_COMMITTED=1
for YAGUA_CSXS in 11 12 13; do defaults write "com.adobe.CSXS.$YAGUA_CSXS" PlayerDebugMode 1 || true; done
printf '\nInstalado: %s\nRespaldo: %s\n' "$YAGUA_DEST" "$YAGUA_BACKUP"
printf 'Reinicia AE > Ventana > Extensiones (heredadas) > YaguaTool.\n'
printf 'Motion Lab nativo utiliza la fuente incluida assets/fonts/GeistLab760.ttf.\n'
