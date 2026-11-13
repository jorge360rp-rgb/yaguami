"""Generate native AE motion data and optional transparent reference PNGs."""
from pathlib import Path
import argparse,json,base64,hashlib
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser();parser.add_argument('--text');parser.add_argument('--png',action='store_true');parser.add_argument('--preset');parser.add_argument('--chromium',default=None);args=parser.parse_args()
packs=json.loads((root/'renderer/reference-packs.json').read_text());catalog=json.loads((root/'renderer/catalog.json').read_text())
font=base64.b64encode((root/'renderer/geist-latin.woff2').read_bytes()).decode()
html='<style>@font-face{font-family:Lab;font-weight:100 900;src:url(data:font/woff2;base64,'+font+')}html,body{margin:0;background:transparent;width:1920px;height:1080px}.ymx-fx-host{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:760 96px/1.08 Lab;letter-spacing:-.045em;color:white;isolation:isolate}'+(root/'renderer/reference-player.css').read_text()+'</style><div id="host" style="position:absolute;inset:0"></div>'
with sync_playwright() as p:
 launch={'headless':True}
 if args.chromium:launch['executable_path']=args.chromium
 elif Path('/usr/bin/chromium').exists():launch['executable_path']='/usr/bin/chromium'
 browser=p.chromium.launch(**launch)
 page=browser.new_page(viewport={'width':1920,'height':1080},device_scale_factor=1)
 page.set_content(html);page.evaluate((root/'renderer/reference-player.js').read_text());page.evaluate('window.YMX_REFERENCE_PACKS='+json.dumps(packs));page.evaluate((root/'renderer/reference-scene.js').read_text());page.evaluate("document.fonts.load('760 96px Lab')")
 manifest=[]
 for entry in catalog:
  if args.preset and args.preset!=entry['name']:continue
  text=args.text or next((preset.get('text','Meet Qwix') for pack in packs for preset in pack['presets'] if preset['name']==entry['name'] or entry['name'] in preset.get('installAs',[])), 'Meet Qwix')
  options={'data':{'name':entry['name'],'pack':entry['pack'],'kind':entry['smartKind']},'params':entry['params'],'text':text,'fontSize':96,'baseColor':'#ffffff','sequence':False,'holdMs':500}
  page.evaluate('o=>{window.scene=new YMXReferenceScene(document.getElementById("host"));scene.configure(o)}',options)
  geometry=page.evaluate('''() => {const p=scene.players[0];p.settle();return p.pieceEls.map((el,i)=>{const probe=document.createElement('span');probe.style.cssText='display:inline-block;width:0;height:0;padding:0';el.appendChild(probe);const baseline=probe.getBoundingClientRect().top-el.getBoundingClientRect().top;probe.remove();const chars=[...el.querySelectorAll('.qfx-char')].map(c=>({text:c.textContent,x:c.offsetLeft,y:baseline}));return {x:p.textEl.offsetLeft+el.offsetLeft,y:p.textEl.offsetTop+el.offsetTop,w:el.offsetWidth,h:el.offsetHeight,origin:getComputedStyle(el).transformOrigin.split(' ').map(parseFloat),chars};})}''')
  duration=page.evaluate('scene.duration');count=int(duration*60+0.999999)+1
  frames=[]
  for f in range(count):
   frame=page.evaluate((root/'renderer/capture.js').read_text(),min(duration,f/60))
   frames.append(frame)
   if args.png:
    folder=root/'reference-png'/entry['id'];folder.mkdir(parents=True,exist_ok=True)
    page.screenshot(path=str(folder/('frame_%05d.png'%f)),omit_background=True,animations='allow')
  payload={'schema':1,'name':entry['name'],'pack':entry['pack'],'id':entry['id'],'text':text,'font':'GeistLab760','fontSize':96,'width':1920,'height':1080,'fps':60,'geometry':geometry,'frames':frames,'parameters':entry['params']}
  path=root/'data'/(entry['id']+'.json');path.write_text(json.dumps(payload,separators=(',',':')))
  manifest.append({'name':entry['name'],'pack':entry['pack'],'id':entry['id'],'file':path.name,'frames':count,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()});print(entry['name'],count,flush=True)
  page.evaluate('scene.destroy()')
 if args.preset and (root/'data/manifest.json').exists():
  previous=json.loads((root/'data/manifest.json').read_text());by_id={x['id']:x for x in previous};by_id.update({x['id']:x for x in manifest});manifest=list(by_id.values())
 (root/'data/manifest.json').write_text(json.dumps(manifest,indent=2));browser.close()
