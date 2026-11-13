from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1050},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
 page.set_content((root/'Yaguanimix_Motion_Lab_v09.html').read_text(),wait_until='load');page.evaluate('document.fonts.ready')
 raw=(root/'validation/reference-module-33879.txt').read_text()
 register='e=>'+raw.split(',e=>',1)[1]
 page.evaluate('() => {const register='+register+';register({s(args){window.OriginalTextFxPlayer=args[2]}});}');
 result=page.evaluate(r'''() => {
 YMX_TEST.pause();const results=[];
 function close(a,b,path=''){
  if(typeof a==='number'&&typeof b==='number'){if(!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a-b)>1e-9)throw new Error(path+': '+a+' != '+b);return;}
  if(a===null||b===null||typeof a!=='object'||typeof b!=='object'){if(a!==b)throw new Error(path+': '+a+' != '+b);return;}
  const keys=new Set([...Object.keys(a),...Object.keys(b)]);for(const key of keys)close(a[key],b[key],path+'.'+key);
 }
 for(const item of YMX_TEST.catalog){
  YMX_TEST.select(item.id);YMX_TEST.pause();YMX_TEST.render(0);
  const scene=YMX_TEST.referenceScenes()[0].reference,actual=scene.players[0],ref=YMXReferenceFor(item),layer=ref.preset.layers[ref.side];
  const host=document.createElement('div');host.className='ymx-fx-host';host.style.fontSize=actual.fontSize+'px';host.style.width='861px';host.style.height='300px';host.style.position='fixed';host.style.left='-3000px';document.body.appendChild(host);
  const original=new OriginalTextFxPlayer(host,{text:actual.text,layers:[layer],lite:false,referenceFontSize:ref.pack.referenceFontSize||32});
  const times=[0,1/60,.08,.2,.4,.8,actual.totalMs/1000,actual.durationWithTail/1000];
  for(const time of times){
   close(actual.sample(time*1000),original.sample(time*1000),item.name+'@'+time);
   actual.seek(time*1000);original.seek(time*1000);
   close(actual.pieceEls.map(e=>e.getAttribute('style')),original.pieceEls.map(e=>e.getAttribute('style')),item.name+'.DOM');
   const style=node=>Object.fromEntries(Array.from(node.style).map(key=>[key,node.style.getPropertyValue(key).replace(/qfx-ghost-glow-\d+/g,'GLOW')]));
   const layerState=player=>({ghosts:player.ghosts.map(x=>x.root.style.display==='none'?{display:'none'}:({root:style(x.root),pieces:x.pieces.map(style),chars:x.chars.map(n=>n?style(n):null)})),glow:player.halos.map(x=>({root:style(x.root),pieces:x.pieces.map(style),chars:x.chars.map(n=>n?style(n):null)})),ghost:player.ghostOverlay?{root:style(player.ghostOverlay.root),pieces:player.ghostOverlay.pieces.map(style),chars:player.ghostOverlay.chars.map(n=>n?style(n):null)}:null});
   close(layerState(actual),layerState(original),item.name+'.FX');
  }
  results.push({preset:item.name,pack:item.pack,samples:times.length,pieces:actual.pieceEls.length,totalMs:actual.totalMs,referenceFontSize:ref.pack.referenceFontSize||32});
  original.destroy();host.remove();
 }
 return {presets:results,samples:results.reduce((n,x)=>n+x.samples,0)};
 }''')
 print('PARITY',len(result['presets']),result['samples'])
 # Actual UI controls must feed the new renderer, including changes that used to be ignored.
 ui=page.evaluate('''() => {
 const check=(condition,message)=>{if(!condition)throw new Error(message)};
 const select=name=>{YMX_TEST.select(YMX_TEST.catalog.find(x=>x.name===name).id);YMX_TEST.pause();YMX_TEST.render(.2)};
 const move=(key,value)=>{const input=document.querySelector('[data-key="'+key+'"] input');input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));};
 select('Slide');const before=YMX_TEST.sample(.2).pieces[0].y;move('distanceX',80);const after=YMX_TEST.sample(.2).pieces[0].y;check(after>before*4,'Distance');
 YMX_TEST.restoreDefault();YMX_TEST.pause();check(YMX_TEST.presetParameters().distanceX===15,'reset');
 select('Scale Slam');move('scale',80);check(YMX_TEST.sample(0).pieces[0].sx>.79,'scale');
 select('Bounce Drop');const dropBefore=YMX_TEST.sample(.4).pieces[0].y;move('height',10);check(YMX_TEST.sample(.4).pieces[0].y!==dropBefore,'height');
 select('Scale Tracking');const tracking=YMX_TEST.sample(.2).trackX;check(Math.min(...tracking)<0&&Math.max(...tracking)>0,'tracking');
 select('Scale Words');check(YMX_TEST.sample(0).pieces[0].opacity===1,'start opacity');
 select('Slide');const dir=document.getElementById('direction');dir.value='Left';dir.dispatchEvent(new Event('change',{bubbles:true}));YMX_TEST.pause();YMX_TEST.render(.2);check(YMX_TEST.sample(.2).pieces[0].x>0,'direction');
 const order=document.getElementById('order');order.value='From End';order.dispatchEvent(new Event('change',{bubbles:true}));YMX_TEST.pause();check(YMX_TEST.sample(.2).pieces[0].opacity<YMX_TEST.sample(.2).pieces[7].opacity,'order');
 const io=document.getElementById('io');io.value='OUT';io.dispatchEvent(new Event('change',{bubbles:true}));YMX_TEST.pause();YMX_TEST.render(0);check(YMX_TEST.sample(0).pieces[0].opacity>.99,'out');
 return {distance:[before,after],dropChanged:true,trackingCentered:true,scaleLinked:true,out:true,order:true,direction:true};
 }''')
 print('UI',ui)
 with page.expect_download() as download:
  page.click('#exportFrames')
 downloaded=download.value
 frames=json.loads(downloaded.path().read_text());print('EXPORT',frames['fps'],len(frames['frames']))
 (root/'validation/sample-export.json').write_text(json.dumps(frames,ensure_ascii=False,indent=2))
 # Sequence must change sides, restore the correct class/kind and return to incoming rest.
 sequence=page.evaluate('''() => {
 const result=[];for(const item of YMX_TEST.catalog){if(!item.name.endsWith(' In')||item.pack!=='Demo Reel Pack')continue;
 YMX_TEST.select(item.id);YMX_TEST.pause();document.getElementById('webSequence').checked=true;YMX_TEST.render(0);
 const scene=YMX_TEST.referenceScenes()[0].reference;
 if(!scene.sequence)continue;
 scene.render(scene.outStart/1000+.01);if(scene.sample(scene.outStart/1000+.01).side!==1)throw Error('sequence side');
 scene.render(scene.duration);if(!scene.sample(scene.duration).sequenceReset)throw Error('sequence reset');
 result.push({preset:item.name,outStart:scene.outStart,duration:scene.duration,kindOut:scene.players[1].layer.kind});
 }document.getElementById('webSequence').checked=false;return result;
 }''')
 print('SEQUENCE',sequence)
 # Scrubbing, downloadable configuration, reduced motion, resize and snapshots.
 page.evaluate("YMX_TEST.select('pack-apple-style-pack-slide');YMX_TEST.pause();YMX_TEST.render(1.3)")
 page.click('#nextFrame');page.click('#prevFrame')
 page.screenshot(path=str(root/'validation/Panel_v09.png'),full_page=True)
 page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(100)
 print('MOBILE',page.evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})'))
 page.screenshot(path=str(root/'validation/Panel_v09_mobile.png'),full_page=True)
 reduced=browser.new_page(viewport={'width':1280,'height':900},reduced_motion='reduce')
 reduced.set_content((root/'Yaguanimix_Motion_Lab_v09.html').read_text(),wait_until='load');reduced.wait_for_timeout(80)
 clock1=reduced.evaluate('YMX_TEST.galleryClock()');reduced.wait_for_timeout(100);clock2=reduced.evaluate('YMX_TEST.galleryClock()')
 assert clock1==clock2,'reduced motion gallery keeps playing'
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'mobile overflow'
 result.update({'ui':ui,'sequence':sequence,'export':{'fps':frames['fps'],'frames':len(frames['frames'])},'errors':errors,'reducedMotion':clock1==clock2})
 assert not errors,errors
 (root/'validation/test-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
 browser.close()
