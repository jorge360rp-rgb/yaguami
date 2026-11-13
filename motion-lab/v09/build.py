"""Build the standalone panel using Python 3, with no network or npm."""
from pathlib import Path
import json,base64
root=Path(__file__).resolve().parent
src=root/'src'
template=(src/'template.html').read_text(encoding='utf-8')
packs=json.loads((src/'reference-packs.json').read_text(encoding='utf-8'))
catalog=json.loads((src/'catalog.json').read_text(encoding='utf-8'))
engine='window.YMX_REFERENCE_PACKS='+json.dumps(packs,separators=(',',':'))+';\n'+(src/'reference-player.js').read_text(encoding='utf-8')+'\n'+(src/'reference-scene.js').read_text(encoding='utf-8')
values={'{{ENGINE}}':engine,'{{CATALOG}}':'window.YMX_CATALOG='+json.dumps(catalog,separators=(',',':'))+';','{{UI}}':(src/'ui.js').read_text(encoding='utf-8'),'{{GEIST_BASE64}}':base64.b64encode((root/'assets/geist-latin.woff2').read_bytes()).decode(),'{{PLAYER_CSS}}':(src/'reference-player.css').read_text(encoding='utf-8')}
for key,value in values.items():template=template.replace(key,value)
output=root/'Yaguanimix_Motion_Lab_v09.html'
output.write_text(template,encoding='utf-8')
print(output.name)
