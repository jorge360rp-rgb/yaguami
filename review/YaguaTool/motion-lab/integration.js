

/* Yaguanimix Motion Lab v0.9 · Referencia web — original preview implementation.
   The catalog is supplied by the user. This engine is an independent approximation,
   not Qwix's rendering or After Effects engine. */
window.YaguaMotionLab=(function(){
let activeDispose=null;
function mount(root,host){
 if(activeDispose)activeDispose();
 root.innerHTML="<div class=\"lab-section-head\"><h2>Motion Lab <small>v0.9</small></h2><p>33 presets · preview en directo · curvas y anclaje</p><div class=\"pack-tabs\" id=\"packTabs\"></div></div>\n  <section class=\"stage\" aria-label=\"Escenario de pruebas\">\n   <div class=\"stage-top\"><div class=\"preset-pill\"><span>Preset</span><b id=\"shortcode\">SB</b><strong id=\"presetHeading\">Smart Bounce Reveal</strong><span style=\"color:#ff8b91;margin-left:7px\">☷</span></div><div style=\"display:flex;align-items:center;gap:12px;color:#bbb;font-size:11px\"><span id=\"indexText\">03 / 11</span><button id=\"resetAll\" title=\"Restablecer ajustes\" style=\"background:#22232a;border:1px solid #35353e;color:white;border-radius:8px;padding:7px 10px\">↺ Valores predeterminados</button></div></div>\n   <div class=\"stage-grid\">\n    <aside class=\"controls\">\n      <div class=\"mini-preview\" id=\"miniScene\" aria-label=\"Preview del panel, animada y sincronizada\"><div class=\"scene-content\"><div id=\"miniGhost\" class=\"group-layer ghost-layer\"></div><div id=\"miniBase\" class=\"group-layer\"></div></div></div>\n      <section class=\"ymx-motion-inspector\" aria-label=\"Inspector persistente de velocidad y anclaje\">\n        <div class=\"ymx-curve-pane\">\n          <div class=\"ymx-inspector-title\"><strong>Curva de movimiento</strong><span id=\"curveState\">Bézier</span></div>\n          <svg id=\"motionGraph\" viewBox=\"0 0 220 120\" role=\"img\" aria-label=\"Editor Bézier interactivo. Arrastra los puntos rojos para modificar la aceleración\" tabindex=\"0\">\n            <path d=\"M12 12 V104 H208\" stroke=\"#69414a\" fill=\"none\" stroke-width=\"1\"/>\n            <path d=\"M12 58 H208 M110 12 V104\" stroke=\"#48252b\" fill=\"none\" stroke-width=\".7\" stroke-dasharray=\"3 4\"/>\n            <path id=\"curveHandleA\" stroke=\"#d8777b\" stroke-width=\"1\" fill=\"none\"/>\n            <path id=\"curveHandleB\" stroke=\"#d8777b\" stroke-width=\"1\" fill=\"none\"/>\n            <path id=\"curvePath\" stroke=\"#ff646d\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n            <circle id=\"curveDot\" r=\"4\" fill=\"#fff0f0\" cx=\"12\" cy=\"104\"/>\n            <circle id=\"curveP1\" class=\"ymx-handle\" r=\"6\" cx=\"65\" cy=\"54\" fill=\"#ff7378\" stroke=\"#230c12\" stroke-width=\"2\"/>\n            <circle id=\"curveP2\" class=\"ymx-handle\" r=\"6\" cx=\"160\" cy=\"48\" fill=\"#ff7378\" stroke=\"#230c12\" stroke-width=\"2\"/>\n          </svg>\n          <div class=\"ymx-curve-actions\"><select id=\"curvePreset\" aria-label=\"Curva de velocidad\"><option value=\"original\">Original</option><option value=\"linear\">Lineal</option><option value=\"easeOut\">Ease Out</option><option value=\"easeInOut\">Ease In/Out</option><option value=\"snappy\">Snappy</option><option value=\"overshoot\">Overshoot</option><option value=\"custom\">Personalizada</option></select><button id=\"saveCurve\" title=\"Guardar curva en el navegador\" type=\"button\">Guardar</button></div>\n          <label class=\"ymx-inline-label\" for=\"curveNumbers\">x1, y1, x2, y2</label><input id=\"curveNumbers\" class=\"ymx-bezier-numbers\" spellcheck=\"false\" value=\"0.16, 1, 0.3, 1\" aria-label=\"Coordenadas Bézier x1, y1, x2, y2\">\n        </div>\n        <div class=\"ymx-anchor-pane\">\n          <div class=\"ymx-inspector-title\"><strong>Anchor</strong><span id=\"anchorState\">Custom</span></div>\n          <div class=\"ymx-anchor-grid\" id=\"anchorGrid\" role=\"group\" aria-label=\"Posición del punto de anclaje\"></div>\n          <div class=\"ymx-anchor-nums\"><label>X<input id=\"anchorXNumber\" type=\"number\" step=\"1\" min=\"-350\" max=\"350\" aria-label=\"Anchor X\"></label><label>Y<input id=\"anchorYNumber\" type=\"number\" step=\"1\" min=\"-350\" max=\"350\" aria-label=\"Anchor Y\"></label></div>\n        </div>\n      </section>\n      <div class=\"selects\"><select id=\"io\" aria-label=\"Entrada y salida\"><option>IN</option><option>OUT</option><option>IN &amp; OUT</option></select><select id=\"direction\" aria-label=\"Dirección del movimiento\"><option>Custom</option><option>Up</option><option>Down</option><option>Left</option><option>Right</option></select><select id=\"unit\" aria-label=\"Unidad de animación\"><option>Letters</option><option>Words</option><option>Lines</option></select><select id=\"order\" aria-label=\"Orden de las unidades\"><option>From Start</option><option>From End</option><option>Center Out</option><option>Center In</option><option>Random</option><option>All at Once</option><option>Custom Index</option></select></div>\n      <div class=\"hold-row\"><label for=\"holdSeconds\">Hold IN → OUT</label><input type=\"range\" id=\"holdSeconds\" min=\"0\" max=\"4\" step=\".05\" value=\".5\"><output id=\"holdValue\">0.50 s</output></div><div class=\"native-lab-actions\"><button class=\"primary\" id=\"applyNative\">Crear animación en AE</button><button class=\"secondary\" id=\"insertNative\">Crear e insertar en activa</button><button class=\"secondary\" id=\"applyBakedDefault\" title=\"Crea el preset original de AE Lab v0.1; no usa los cambios actuales\">Original nativo · AE Lab v0.1</button></div><div class=\"control-actions\"><button class=\"primary\" id=\"apply\">Apply</button><button class=\"secondary\" id=\"clear\">Clear</button></div>\n      <div class=\"ymx-reference-tools\"><label style=\"display:block\"><input type=\"checkbox\" id=\"referenceText\" checked> Texto original del preset</label><label><input type=\"checkbox\" id=\"webSequence\"> Secuencia IN/OUT original (Demo Reel)</label><div><button type=\"button\" id=\"prevFrame\" title=\"Retroceder un fotograma\">−1 f</button><button type=\"button\" id=\"nextFrame\" title=\"Avanzar un fotograma\">+1 f</button><button type=\"button\" id=\"exportFrames\">Exportar 60 fps</button></div></div><div class=\"control-tabs\" id=\"controlTabs\"><button data-tab=\"fill\">● Fill</button><button class=\"active\" data-tab=\"motion\">Motion</button><button data-tab=\"trails\">Ghost / Echo</button><button data-tab=\"advanced\">Advanced</button></div>\n      <div id=\"fillOptions\" class=\"fill-options\"><label for=\"fillMode\">Fill mode</label><select id=\"fillMode\"><option value=\"With Reveal\">With Reveal</option><option value=\"Sweep\">Sweep</option><option value=\"Per Piece\">Per Piece</option></select></div>\n      <div class=\"fill-options\" id=\"unitOptions\"><label for=\"fillUnit\">Fill Unit</label><select id=\"fillUnit\"><option>Letters</option><option>Words</option><option>Lines</option></select></div>\n      <div class=\"fill-options\" id=\"directionOptions\"><label for=\"fillDirection\">Fill Direction</label><select id=\"fillDirection\"><option>From Start</option><option>From End</option><option>Center Out</option><option>Center In</option></select></div>\n      <div class=\"ymx-controls-head\"><span id=\"controlContext\">Ajustes de este preset</span><label class=\"ymx-all-toggle\"><input type=\"checkbox\" id=\"showAllControls\"> Todos</label></div>\n      <div class=\"sliders\" id=\"sliders\" aria-label=\"Parámetros del efecto\"></div>\n      <div class=\"ymx-extra-actions\"><button type=\"button\" id=\"addColorPass\">+ Añadir Fill</button><button type=\"button\" id=\"resetLocal\">↺ Restablecer preset</button></div>\n      <div class=\"palette\" id=\"palette\"><label>Base <input type=\"color\" id=\"fillColor\" value=\"#fff9fc\"></label><label>Fill 1 <input type=\"color\" id=\"fillOneColor\" value=\"#ff9c54\"></label><label>Fill 2 <input type=\"color\" id=\"fillTwoColor\" value=\"#ff328d\"></label><label>Fill 3 <input type=\"color\" id=\"fillThreeColor\" value=\"#a755ff\"></label><label>Echo <input type=\"color\" id=\"echoColor\" value=\"#f439ba\"></label></div><div class=\"palette\" id=\"fillExtraPalette\"></div>\n      <p id=\"ymxStatus\" role=\"status\" class=\"ymx-status\">Preview v0.9 · configura y aplica en una composición nativa nueva.</p><p class=\"fill-caption\" id=\"fillCaption\">With Reveal · el color acompaña la aparición de cada unidad de texto.</p>\n    </aside>\n    <div class=\"output-stage\">\n     <div class=\"display-area\" id=\"bigScene\"><div class=\"scene-content\" id=\"stageText\"><div class=\"group-layer ghost-layer\" id=\"ghostChars\"></div><div class=\"group-layer\" id=\"mainChars\"></div></div></div>\n     <div class=\"display-footer\"><div class=\"dots\" id=\"dots\"></div><button id=\"animate\" class=\"animate\">↻ &nbsp; Replay</button><div class=\"scene-label\"><i id=\"effectDot\"></i><span id=\"effectLabel\">Squeeze Arc</span></div></div><div class=\"transport\"><button id=\"playPause\" class=\"transport-play\" type=\"button\" aria-label=\"Pausar\">Ⅱ</button><input id=\"seek\" type=\"range\" min=\"0\" max=\"1000\" step=\"1\" value=\"0\" aria-label=\"Posición de reproducción\"><span id=\"timeReadout\">0.00 / 0.00 s</span><label class=\"loop-label\"><input id=\"loop\" type=\"checkbox\" checked> Loop</label></div>\n    </div>\n   </div>\n  </section>\n  <section><div class=\"section-head\"><small id=\"packEyebrow\">IN THIS PACK</small><h2 id=\"cardHeadline\">All 11 presets</h2><p>Haz clic en cualquier preset para cargarlo en el escenario. Cambia los parámetros y pulsa Animate.</p></div><div class=\"cards\" id=\"cards\"></div></section>\n  <div class=\"bottom\"><div><strong>Motion Lab:</strong> el mismo motor v0.9, con todos sus parámetros. La aplicación nativa crea una composición nueva a 60 fps.</div><label class=\"inputrow\">Texto de la animación <textarea id=\"sampleText\" aria-label=\"Texto de la animación, admite saltos de línea\" maxlength=\"100\" rows=\"2\">Meet Qwix</textarea></label><button id=\"twoLines\" class=\"secondary\" type=\"button\" style=\"padding:9px 13px\">Probar 2 líneas</button></div>\n";
 let disposed=false;
 const globals=[];
 function listen(target,event,fn){target.addEventListener(event,fn);globals.push(()=>target.removeEventListener(event,fn));}
 function motionReduced(){return document.documentElement.getAttribute('data-motion')==='reduced';}

'use strict';
const $=id=>root.querySelector("#"+id);
const textFirst=document.createElement('section');textFirst.className='lab-text-first card';
const textLabel=$('sampleText').closest('label');textFirst.appendChild(textLabel);textFirst.appendChild($('twoLines'));
const originalToggle=$('referenceText').closest('label');textFirst.appendChild(originalToggle);root.prepend(textFirst);
$('referenceText').checked=false;$('sampleText').value='Tu texto';
const liveHelp=document.createElement('p');liveHelp.className='desc';liveHelp.textContent='Después de crear: edita TEXTO en AE y sus controles de efectos. Mantén YaguaTool abierto para sincronizar los parámetros del preset.';textFirst.appendChild(liveHelp);

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const num=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f;
const fmt=n=>(Math.round(num(n)*1000)/1000).toString();
const color=(s,f='#ffffff')=>/^#[0-9a-fA-F]{6}$/.test(String(s))?s:f;
const rgba=(h,a)=>{const c=parseInt(color(h).slice(1),16);return `rgba(${c>>16},${(c>>8)&255},${c&255},${a})`};
function cubic(a,b,t){const u=1-t;return 3*u*u*t*a+3*u*t*t*b+t*t*t;}
const phaseStart=0;
function duration(){return previewScenes[0]?.reference?.duration||1;}
function measureVisualGlyphPositions(){}
function splitText(text,unit){return {pieces:Array.from(text).filter(c=>!/\s/.test(c)),meta:{},text,unit};}
// In-document catalog data is injected by build script before this engine.
const catalog=window.YMX_CATALOG||[];
const packs=['Echo Pack','Apple Style Pack','Demo Reel Pack','Ghost Pack'];
const $catalog=catalog.map(d=>({id:d.id,name:d.name,pack:d.pack,kind:d.smartKind,p:d.params,label:d.label}));
const groups={};packs.forEach(p=>groups[p]=$catalog.filter(x=>x.pack===p));
let lastThumbPaint=-1;
let curveIsCustom=false,editorDragging=null,customCurveMemory=[];
let pack=packs[0],selected=$catalog.find(p=>p.name==='Slide'&&p.pack==='Apple Style Pack')||$catalog[0],current={},activeTab='motion',playing=true,looping=true,playhead=0,lastTime=null,raf=0,thumbTime=0,mainModel=null,previewScenes=[],thumbScenes=[],mode='IN',effectiveOrder='From Start',hold=.75;
const labels={duration:'Duration',delay:'Delay',distanceX:'Distance',distanceY:'Distance Y',directionAngle:'Angle',blur:'Blur',opacity:'Opacity',height:'Height',scale:'Scale',scaleX:'Scale X',scaleY:'Scale Y',rotation:'Rotation',rotationMode:'Rotation Mode',skew:'Skew',swing:'Swing',frequency:'Frequency',decay:'Decay',stagger:'Stagger',tracking:'Tracking',trackingOrigin:'Tracking Origin',trackingFocus:'Tracking Focus',anchorX:'Anchor X',anchorY:'Anchor Y',fill:'Fill',fillLength:'Fill Length',fillSpeed:'Fill Speed',fillHold:'Fill Hold',fillGlow:'Fill Glow',fillGlowSize:'Glow Size',fill2:'Fill 2',fill2Length:'Fill 2 Length',fill2Speed:'Fill 2 Speed',fill2Delay:'Fill 2 Delay',fill3:'Fill 3',echo:'Echo',echoLength:'Echo Length',echoBlur:'Echo Blur',echoStyle:'Echo Style',echoPlace:'Echo Place',ghost:'Ghost',ghostLag:'Ghost Delay (frames @30)',ghostDistance:'Ghost Distance',ghostBlur:'Ghost Blur',ghostGlow:'Ghost Glow',ghostRadius:'Ghost Radius',ghostEngine:'Ghost Engine',amplitude:'Amplitude',compression:'Compression',stretch:'Stretch',motionDistribution:'Motion Distribution'};
const sections={
 fill:['fill','fillLength','fillSpeed','fillHold','fillGlow','fillGlowSize','fillGlowStyle','fillGlowEngine','fill2','fill2Length','fill2Speed','fill2Delay','fill2Direction','fill2DelayMode','fill3','fill3Length','fill3Speed','fill3Delay','fill3Direction','fill3DelayMode','fill4','fill4Length','fill4Speed','fill4Delay','fill4Direction','fill4DelayMode','fill5','fill5Length','fill5Speed','fill5Delay','fill5Direction','fill5DelayMode'],
 motion:['duration','delay','distanceX','distanceY','blur','opacity','scale','scaleX','scaleY','height','rotation','swing','frequency','decay','stagger','skew','tracking','trackingOrigin','trackingFocus','compression','stretch','amplitude'],
 trails:['echo','echoLength','echoBlur','echoStyle','echoPlace','ghost','ghostLag','ghostDistance','ghostBlur','ghostGlow','ghostRadius','ghostEngine']};
const ranges={duration:[.1,5,.01],delay:[0,.5,.005],distanceX:[0,500,1],distanceY:[0,500,1],directionAngle:[-180,180,1],scale:[0,500,1],scaleX:[0,500,1],scaleY:[0,500,1],height:[0,80,1],opacity:[0,100,1],rotation:[-180,180,1],skew:[-60,60,1],swing:[-200,200,1],frequency:[.5,8,.05],decay:[1,25,.05],stagger:[0,10,.05],blur:[0,90,.5],tracking:[-2000,2000,1],trackingOrigin:[0,100,1],trackingFocus:[-100,100,1],anchorX:[-350,350,1],anchorY:[-350,350,1],amplitude:[0,250,1],compression:[0,60,1],stretch:[0,60,1],fill:[0,100,1],fillLength:[5,100,1],fillSpeed:[.25,4,.05],fillHold:[0,10,1],fillGlow:[0,200,1],fillGlowSize:[1,80,1],fill2:[0,100,1],fill2Length:[0,150,1],fill2Speed:[.15,6,.05],fill2Delay:[0,2,.01],fill3:[0,100,1],fill4:[0,100,1],fill5:[0,100,1],echo:[0,100,1],echoLength:[.05,1,.01],echoBlur:[0,40,.5],ghost:[0,100,1],ghostLag:[1,20,1],ghostDistance:[0,100,1],ghostBlur:[0,10,.1],ghostGlow:[0,100,1],ghostRadius:[1,300,1]};
const pickers={fill2Direction:['start','end','center','to-center'],fill3Direction:['start','end','center','to-center'],fill4Direction:['start','end','center','to-center'],fill5Direction:['start','end','center','to-center'],fill2DelayMode:['manual','chain'],fill3DelayMode:['manual','chain'],fill4DelayMode:['manual','chain'],fill5DelayMode:['manual','chain'],blurMode:['piece','global'],echoStyle:['trail','ghost'],echoPlace:['behind','over'],rotationMode:['uniform','split'],motionDistribution:['stagger','simultaneous'],ghostEngine:['deep','deep2','glow'],fillGlowStyle:['soft','hard'],fillGlowEngine:['glow','deep']};
const neutral={distanceX:0,distanceY:0,blur:0,opacity:0,height:28,scale:100,scaleX:100,scaleY:100,rotation:0,swing:0,frequency:3.9,decay:7.5,stagger:2.7,skew:0,tracking:0,trackingOrigin:50,trackingFocus:0,compression:0,stretch:0,amplitude:100,echo:0,ghost:0,fill:0,fill2:0,fill3:0,fill4:0,fill5:0};
const motionCore={smartReveal:['duration','delay','distanceX','blur','opacity'],wholeReveal:['duration','distanceX','blur','opacity','scale'],smartBounceReveal:['duration','delay','distanceX','blur','scale','rotation','swing','frequency','decay','stagger']};
const defaultCurves={linear:{x1:.333333,y1:.333333,x2:.666667,y2:.666667},easeOut:{x1:.16,y1:1,x2:.3,y2:1},easeInOut:{x1:.42,y1:0,x2:.58,y2:1},snappy:{x1:.12,y1:.88,x2:.22,y2:1},overshoot:{x1:.2,y1:1.35,x2:.25,y2:1.05}};
function inspectDirty(){
 if(!selected)return false;
 if(Object.keys(selected.p).some(k=>JSON.stringify(current[k])!==JSON.stringify(selected.p[k])))return true;
 const p=selected.p;
 if($('io').value.toLowerCase()!==String(p.mode||'in'))return true;
 if($('unit').value!==(p.split==='words'?'Words':p.split==='lines'?'Lines':'Letters'))return true;
 if($('fillMode').value!==(p.fillStyle==='sweep'?'Sweep':p.fillStyle==='piece'?'Per Piece':'With Reveal'))return true;
 if($('fillOneColor').value.toLowerCase()!==color(p.fillColor,'#ff6a76').toLowerCase())return true;
 return false;
}
const appleControlMap={
 'Slide':['duration','delay','distanceX','blur','opacity'],
 'Scale Slam':['duration','blur','opacity','scale'],
 'Color Scale':['duration','blur','opacity','scale'],
 'Slide Delay':['duration','delay','distanceX','blur','opacity'],
 'Bounce Drop':['duration','delay','distanceX','blur','opacity','height','frequency','decay'],
 'Blur Rise':['duration','delay','distanceX','blur','opacity'],
 'Scale Words':['duration','delay','blur','opacity','scale'],
 'Slide Rotation':['duration','delay','rotation','blur','opacity'],
 'Scale Tracking':['duration','tracking','trackingOrigin','blur','opacity']
};
function smartControls(){
 const original=selected.p||{},fields=sections.motion;
 if(selected.pack==='Apple Style Pack'){
   const fixed=appleControlMap[selected.name]||[];
   const added=fields.filter(k=>!fixed.includes(k)&&num(current[k],neutral[k]??0)!==num(selected.p[k],neutral[k]??0));
   return [...fixed,...added].filter(k=>k in current);
 }
 const main=motionCore[selected.kind]||motionCore.smartReveal;
 const force=new Set(main);
 for(const field of fields){
  if(!(field in current))continue;
  const value=current[field],initial=original[field],z=neutral[field];
  if(typeof value==='number'&&(z===undefined||value!==z||initial!==z))force.add(field);
 }
 // High frequency & decay are shown only when bouncing or purposefully edited.
 if(selected.kind!=='smartBounceReveal')for(const field of ['frequency','decay','stagger'])if(num(current.swing,0)===0&&num(current[field],neutral[field])===neutral[field]&&num(original[field],neutral[field])===neutral[field])force.delete(field);
 return fields.filter(k=>force.has(k));
}
function fillControls(){
 const fill=$('fillMode').value,fields=['fill','fillLength','fillSpeed','fillHold','fillGlow','fillGlowSize','fillGlowStyle','fillGlowEngine'];
 let base=fields.filter(k=>k==='fill'||(fill==='Sweep'?k!=='fillHold':fill==='Per Piece'?k!=='fillSpeed'&&k!=='fillLength':k!=='fillHold'&&k!=='fillSpeed'));
 for(let n=2;n<=5;n++){
  if(num(current['fill'+n],0)>0||num(selected.p['fill'+n],0)>0){base.push('fill'+n);if(fill==='Sweep'){base.push('fill'+n+'Length','fill'+n+'Speed','fill'+n+'Delay','fill'+n+'Direction','fill'+n+'DelayMode')}else if(fill==='With Reveal'){base.push('fill'+n+'Length','fill'+n+'Delay','fill'+n+'DelayMode')}else{base.push('fill'+n+'Delay','fill'+n+'DelayMode')}}
 }
 return base;
}
function refreshFillPalette(){
 const panel=$('fillExtraPalette');if(!panel)return;
 panel.replaceChildren();panel.hidden=activeTab!=='fill';
 for(let i=4;i<=5;i++){
  if(num(current['fill'+i],0)<=0&&num(selected.p['fill'+i],0)<=0)continue;
  const label=document.createElement('label');label.textContent='Fill '+i+' ';
  const input=document.createElement('input');input.type='color';input.id='fillExtraColor'+i;
  input.value=color(current['fill'+i+'Color'],'#ff9563');
  input.addEventListener('input',()=>{current['fill'+i+'Color']=input.value;render(playhead)});
  label.append(input);panel.append(label);
 }
}
function trailControls(){
 const e=num(current.echo,0)>0||num(selected.p.echo,0)>0,g=num(current.ghost,0)>0||num(selected.p.ghost,0)>0;
 const out=['echo'];if(e)out.push('echoLength','echoBlur','echoStyle','echoPlace');out.push('ghost');if(g)out.push('ghostLag','ghostDistance','ghostBlur','ghostGlow','ghostRadius','ghostEngine');return out;
}
function currentOrder(p){const order=$('order').value;if(order!=='From Start')return order;const tr=p.trajectory||'start';return tr==='end'?'From End':tr==='center'?'Center Out':tr==='random'?'Random':'From Start';}
function currentMode(){return $('io').value;}
function modelFromText(value,unit){return splitText(value,unit)}
function createStageScenes(){
 for(const scene of previewScenes)scene.reference.destroy();
 mainModel=splitText($('sampleText').value,$('unit').value);
 previewScenes=[];
 for(const small of [false,true]){
  const target=$(small?'miniBase':'mainChars');$(small?'miniGhost':'ghostChars').replaceChildren();
  const reference=new window.YMXReferenceScene(target);
  previewScenes.push({small,reference});
 }
 render(playhead);
}
function fontFor(text,small=false,thumb=false){
 const width=thumb?270:$('bigScene').clientWidth;
 const fit=Math.min(1,10/Math.max(1,text.length));
 const main=Math.max(46,Math.min(124,width*.116))*fit;
 return thumb?Math.max(18,Math.min(36,width*.124))*fit:small?Math.min(22,main*.32):main;
}
function renderOptions(data,params,text,small=false,thumb=false){
 return {data:{name:data.name,pack:data.pack,kind:data.kind},params,text,baseColor:params.baseColor||'#ffffff',fontSize:fontFor(text,small,thumb),sequence:!thumb&&$('webSequence').checked,holdMs:Number($('holdSeconds').value)*1000};
}
function createThumbnail(data,index){
 const card=document.createElement('button');card.type='button';card.style.setProperty('--card-order',String(index));card.className='preset-card'+(selected.id===data.id?' active':'');card.setAttribute('aria-label','Ver preset '+data.name);
 const top=document.createElement('div');top.className='card-stage';
 const host=document.createElement('div');host.className='ymx-thumb-host';top.append(host);
 const tag=document.createElement('span');tag.className='thumb-live';tag.textContent='LIVE';top.append(tag);
 const ix=document.createElement('span');ix.className='card-index';ix.textContent=String(index+1).padStart(2,'0');top.append(ix);
 const label=document.createElement('div');label.className='card-name';label.textContent=data.name;
 card.append(top,label);card.addEventListener('click',()=>loadPreset(data));
 return {card,scene:{reference:new window.YMXReferenceScene(host)},data,visible:true};
}
function buildGallery(){
 if($('cards').dataset.pack===pack&&thumbScenes.length){
  thumbScenes.forEach(entry=>entry.card.classList.toggle('active',entry.data.id===selected.id));
  Array.from($('dots').children).forEach((node,index)=>node.classList.toggle('selected',groups[pack][index].id===selected.id));
  return;
 }
 $('cards').dataset.pack=pack;

 const tabs=$('packTabs');tabs.replaceChildren();
 for(const p of packs){const btn=document.createElement('button');btn.type='button';btn.textContent=p;btn.className=p===pack?'active':'';btn.addEventListener('click',()=>{pack=p;loadPreset(groups[p][0])});tabs.append(btn)}
 const arr=groups[pack];for(const old of thumbScenes)old.scene.reference.destroy();$('cards').replaceChildren();thumbScenes=[];lastThumbPaint=-1;
 $('cardHeadline').textContent='All '+arr.length+' presets · previews animadas';$('packEyebrow').textContent=pack.toUpperCase();
 arr.forEach((d,i)=>{const entry=createThumbnail(d,i);thumbScenes.push(entry);$('cards').append(entry.card);measureVisualGlyphPositions(entry.scene)});renderThumbs(thumbTime);
 const dots=$('dots');dots.replaceChildren();arr.forEach(d=>{const dot=document.createElement('button');dot.title=d.name;dot.className=d.id===selected.id?'selected':'';dot.addEventListener('click',()=>loadPreset(d));dots.append(dot)});
}
function refreshControls(){
 const fill=$('fillMode').value;
 root.querySelectorAll('#controlTabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===activeTab));
 $('fillOptions').hidden=activeTab!=='fill';$('unitOptions').hidden=activeTab!=='fill';$('directionOptions').hidden=activeTab!=='fill'||fill!=='Sweep';
 $('fillCaption').hidden=activeTab!=='fill';$('palette').hidden=activeTab==='advanced';$('addColorPass').hidden=activeTab!=='fill';
 $('sliders').replaceChildren();
 const all=$('showAllControls').checked;
 const shown=activeTab==='advanced'?Object.keys(current).filter(k=>!Object.values(sections).flat().includes(k)&&!['kind','baseColor','bezier','anchorX','anchorY'].includes(k)).sort()
  :all?sections[activeTab]:activeTab==='motion'?smartControls():activeTab==='fill'?fillControls():trailControls();
 const count=shown.filter(k=>k in current).length;
 $('controlContext').textContent=(activeTab==='motion'?'Movimiento · ':activeTab==='fill'?'Color · ':activeTab==='trails'?'Ecos · ':'Opciones · ')+count+' controles';
 const optionField=k=>pickers[k];
 for(const field of shown){
  if(!(field in current))continue;
  if(activeTab==='fill'&&!all){
   if(fill==='Per Piece'&&(/Length|Speed/.test(field)))continue;
   if(fill==='With Reveal'&&(/Speed|Hold/.test(field)))continue;
   if(fill==='Sweep'&&field==='fillHold')continue;
  }
  let value=current[field];const row=document.createElement('div');row.className='slider-field';row.dataset.key=field;
  const head=document.createElement('div');head.className='field-row';const name=document.createElement('label');name.textContent=labels[field]||field.replace(/([a-z0-9])([A-Z])/g,'$1 $2').replace(/^fill(\d)/,'Fill $1').replace(/^fill/,'Fill');const valueTag=document.createElement('output');valueTag.textContent=typeof value==='object'?JSON.stringify(value):String(value??'—');head.append(name,valueTag);row.append(head);
  const numeric=typeof value==='number';const setting=ranges[field]||[-400,400,.01];
  if(numeric){
   const input=document.createElement('input');input.type='range';input.min=Math.min(setting[0],value);input.max=Math.max(setting[1],value);input.step=setting[2];input.value=value;input.setAttribute('aria-label',labels[field]||field);
   const sync=()=>{const pc=clamp((Number(input.value)-Number(input.min))/(Number(input.max)-Number(input.min))*100,0,100);input.style.background=`linear-gradient(to right,var(--acc) 0%,var(--acc) ${pc}%,var(--line) ${pc}%,var(--line) 100%)`};sync();
   input.addEventListener('input',()=>{current[field]=Number(input.value);
    if(field==='scale'){current.scaleX=current.scale;current.scaleY=current.scale;}
    if(field==='distanceX'&&['up','down'].includes(current.direction))current.distanceY=current.distanceX;
    valueTag.textContent=fmt(current[field]);sync();updateInspector();render(playhead)});row.append(input);
  }else if(optionField(field)){
   const input=document.createElement('select');input.className='ymx-field-pick';for(const val of pickers[field]){const op=document.createElement('option');op.value=val;op.textContent=val;input.append(op)}
   input.value=String(value);input.addEventListener('change',()=>{current[field]=input.value;valueTag.textContent=input.value;render(playhead)});row.append(input);
  }else{
   const input=document.createElement('input');input.className='expert-input';input.type='text';input.value=typeof value==='object'?JSON.stringify(value):String(value??'');
   input.addEventListener('change',()=>{let next=input.value;try{next=JSON.parse(next)}catch{}current[field]=next;valueTag.textContent=typeof next==='object'?JSON.stringify(next):String(next);render(playhead)});row.append(input);
  }
  $('sliders').append(row);
 }
 refreshFillPalette();
 $('fillCaption').textContent=fill==='Sweep'?'Sweep: banda con posición según la anchura de las letras; entrada, recorrido y salida limpia.':fill==='Per Piece'?'Per Piece: resaltado por unidad, con Fill Hold y transición suave entre unidades.':'With Reveal: el pulso de Fill sigue la aparición de cada letra, palabra o línea.';
}
function syncSelectors(){
 $('io').value=current.mode==='out'?'OUT':'IN';$('direction').value=['up','down','left','right'].includes(current.direction)?current.direction[0].toUpperCase()+current.direction.slice(1):'Custom';
 $('unit').value=current.split==='words'?'Words':current.split==='lines'?'Lines':'Letters';
 $('order').value=current.trajectory==='random'?'Random':current.trajectory==='end'?'From End':current.trajectory==='center-out'?'Center Out':current.trajectory==='center-in'?'Center In':current.trajectory==='all-at-once'?'All at Once':current.trajectory==='custom-index'?'Custom Index':'From Start';
 $('fillMode').value=current.fillStyle==='sweep'?'Sweep':current.fillStyle==='piece'?'Per Piece':'With Reveal';
 $('fillUnit').value=current.fillUnit==='words'?'Words':current.fillUnit==='lines'?'Lines':'Letters';
 $('fillDirection').value=current.fillDirection==='end'?'From End':current.fillDirection==='center'?'Center Out':current.fillDirection==='to-center'?'Center In':'From Start';
 $('fillColor').value=color(current.baseColor,'#f8f8fb');$('fillOneColor').value=color(current.fillColor,'#ff6a76');$('fillTwoColor').value=color(current.fill2Color,'#ff4796');$('fillThreeColor').value=color(current.fill3Color,'#8c5bff');$('echoColor').value=color(current.echoColor,'#ff84a3');refreshFillPalette();
}
function curveVals(){const b=current.bezier||selected.p.bezier||defaultCurves.easeOut;return {x1:clamp(num(b.x1,.16),0,1),y1:num(b.y1,1),x2:clamp(num(b.x2,.3),0,1),y2:num(b.y2,1)}}
function updateInspector(){
 if(!selected||!current)return;
 const b=curveVals(),px=x=>12+196*x,py=y=>104-92*y;
 $('curvePath').setAttribute('d',`M ${px(0)} ${py(0)} C ${px(b.x1)} ${py(b.y1)}, ${px(b.x2)} ${py(b.y2)}, ${px(1)} ${py(1)}`);
 $('curveHandleA').setAttribute('d',`M12 104 L${px(b.x1)} ${py(b.y1)}`);
 $('curveHandleB').setAttribute('d',`M208 12 L${px(b.x2)} ${py(b.y2)}`);
 $('curveP1').setAttribute('cx',px(b.x1));$('curveP1').setAttribute('cy',py(b.y1));$('curveP2').setAttribute('cx',px(b.x2));$('curveP2').setAttribute('cy',py(b.y2));
 $('curveNumbers').value=[b.x1,b.y1,b.x2,b.y2].map(fmt).join(', ');
 $('curveState').textContent=curveIsCustom?'Personalizada':'Original';
 const ax=num(current.anchorX,0),ay=num(current.anchorY,0);
 $('anchorXNumber').value=ax;$('anchorYNumber').value=ay;
 $('anchorState').textContent=(ax%100===0&&ay%100===0&&Math.abs(ax)<=100&&Math.abs(ay)<=100)?'Rejilla 3×3':'Custom';
 for(const node of $('anchorGrid').children){const selectedPoint=(num(node.dataset.x,0)===ax&&num(node.dataset.y,0)===ay);node.classList.toggle('active',selectedPoint);node.setAttribute('aria-pressed',String(selectedPoint));}
 $('resetAll').disabled=!inspectDirty();
}
function updateCurveDot(time){
 const b=curveVals(),durationValue=Math.max(.001,num(current.duration,.8));
 const f=clamp((time-phaseStart)/durationValue,0,1);let lo=0,hi=1;for(let i=0;i<18;i++){const t=(lo+hi)/2;if(cubic(b.x1,b.x2,t)<f)lo=t;else hi=t;}
 const t=(lo+hi)/2;
 $('curveDot').setAttribute('cx',12+196*cubic(b.x1,b.x2,t));$('curveDot').setAttribute('cy',104-92*cubic(b.y1,b.y2,t));
}
function setCurve(b,isCustom=true){
 current.bezier={x1:clamp(num(b.x1,0),0,1),y1:clamp(num(b.y1,0),-1,2),x2:clamp(num(b.x2,1),0,1),y2:clamp(num(b.y2,1),-1,2)};
 curveIsCustom=isCustom;updateInspector();render(playhead);
}
function restoreDefault(){loadPreset(selected);$('ymxStatus').textContent='Valores originales restaurados: movimiento, Fill, Ghost/Echo, curva y punto de anclaje.';}
function setupInspector(){
 const grid=$('anchorGrid');grid.replaceChildren();
 for(const y of [-100,0,100])for(const x of [-100,0,100]){
  const b=document.createElement('button');b.type='button';b.textContent='•';b.dataset.x=x;b.dataset.y=y;b.title=`X ${x} · Y ${y}`;b.setAttribute('aria-label',b.title);b.addEventListener('click',()=>{current.anchorX=x;current.anchorY=y;updateInspector();render(playhead)});grid.append(b);
 }
 for(const [id,key] of [['anchorXNumber','anchorX'],['anchorYNumber','anchorY']])$(id).addEventListener('input',()=>{current[key]=clamp(num($(id).value,0),-350,350);updateInspector();render(playhead)});
 $('motionGraph').addEventListener('pointerdown',e=>{
  const t=e.target;if(t.id!=='curveP1'&&t.id!=='curveP2')return;
  editorDragging=t.id==='curveP1'?'p1':'p2';$('motionGraph').setPointerCapture(e.pointerId);e.preventDefault();
 });
 $('motionGraph').addEventListener('pointermove',e=>{
  if(!editorDragging)return;const box=$('motionGraph').getBoundingClientRect();const sx=220/Math.max(1,box.width),sy=120/Math.max(1,box.height);const x=clamp(((e.clientX-box.left)*sx-12)/196,0,1),y=clamp((104-(e.clientY-box.top)*sy)/92,-.5,1.5);
  const b=curveVals();if(editorDragging==='p1'){b.x1=x;b.y1=y}else{b.x2=x;b.y2=y}setCurve(b);$('curvePreset').value='custom';
 });
 const end=()=>{editorDragging=null};$('motionGraph').addEventListener('pointerup',end);$('motionGraph').addEventListener('pointercancel',end);
 $('curveNumbers').addEventListener('change',()=>{
  const arr=$('curveNumbers').value.replace(/;/g,',').split(/[\s,]+/).filter(Boolean).map(Number);
  if(arr.length===4&&arr.every(Number.isFinite)){setCurve({x1:arr[0],y1:arr[1],x2:arr[2],y2:arr[3]});$('curvePreset').value='custom'}else updateInspector();
 });
 $('curvePreset').addEventListener('change',()=>{
  const name=$('curvePreset').value;
  if(name==='original'){setCurve(JSON.parse(JSON.stringify(selected.p.bezier||defaultCurves.easeOut)),false)}
  else if(defaultCurves[name]){setCurve(defaultCurves[name],true)}
  else if(name.startsWith('saved:')){const curve=customCurveMemory[Number(name.substring(6))];if(curve)setCurve(curve.value,true)}
 });
 function savedCurves(){
  try{const list=JSON.parse(localStorage.getItem('ymxSavedBezierV06')||'[]');if(Array.isArray(list))customCurveMemory=list.slice(0,20)}catch{};
  customCurveMemory.forEach((item,i)=>{const option=document.createElement('option');option.value='saved:'+i;option.textContent='★ '+item.name;$('curvePreset').append(option)});
 }
 savedCurves();
 $('saveCurve').addEventListener('click',()=>{
  const name='Mi curva '+(customCurveMemory.length+1);customCurveMemory.push({name,value:curveVals()});
  try{localStorage.setItem('ymxSavedBezierV06',JSON.stringify(customCurveMemory.slice(0,20)))}catch{}
  const option=document.createElement('option');option.value='saved:'+(customCurveMemory.length-1);option.textContent='★ '+name;$('curvePreset').append(option);$('curvePreset').value=option.value;
  $('ymxStatus').textContent='Curva guardada localmente como '+name;
 });
 $('resetLocal').addEventListener('click',restoreDefault);
 $('showAllControls').addEventListener('change',refreshControls);
 $('addColorPass').addEventListener('click',()=>{
  for(let n=2;n<=5;n++){if(num(current['fill'+n],0)<=0){current['fill'+n]=100;current['fill'+n+'Color']=current['fill'+n+'Color']||'#ff9563';activeTab='fill';refreshControls();render(playhead);$('ymxStatus').textContent='Añadido pase Fill '+n;return;}}
  $('ymxStatus').textContent='Ya están activados los cinco pases Fill';
 });
}
function loadPreset(p){
 if($('referenceText').checked)$('sampleText').value=window.YMXReferenceFor(p)?.preset.text||'Meet Qwix';
 selected=p;current=JSON.parse(JSON.stringify(p.p));current.kind=p.kind;current.baseColor='#ffffff';
 current.fillGlowStyle=current.fillGlowStyle||'soft';current.fillGlowEngine=current.fillGlowEngine||'glow';
 for(let pass=2;pass<=5;pass++){
  const suffix=String(pass);
  if(!Number.isFinite(Number(current['fill'+suffix])))current['fill'+suffix]=0;
  if(current['fill'+suffix+'Length']===undefined)current['fill'+suffix+'Length']=num(current.fillLength,35);
  if(current['fill'+suffix+'Speed']===undefined)current['fill'+suffix+'Speed']=num(current.fillSpeed,1);
  if(current['fill'+suffix+'Delay']===undefined)current['fill'+suffix+'Delay']=(pass-1)*.15;
  if(current['fill'+suffix+'DelayMode']===undefined)current['fill'+suffix+'DelayMode']='manual';
  if(current['fill'+suffix+'Direction']===undefined)current['fill'+suffix+'Direction']=current.fillDirection||'start';
  if(current['fill'+suffix+'Color']===undefined)current['fill'+suffix+'Color']=pass===2?'#ff4398':pass===3?'#9666ff':pass===4?'#ff9b63':'#ff5e81';
 }
 curveIsCustom=false;$('curvePreset').value='original';
 pack=p.pack;syncSelectors();
 $('presetHeading').textContent=p.name;$('effectLabel').textContent=p.name;$('shortcode').textContent=p.label||p.name.split(' ').map(x=>x[0]).join('').slice(0,3).toUpperCase();
 $('effectDot').style.background=color(current.echoColor,'#ff6571');
 $('indexText').textContent=String(groups[pack].findIndex(x=>x.id===p.id)+1).padStart(2,'0')+' / '+String(groups[pack].length).padStart(2,'0');
 buildGallery();createStageScenes();refreshControls();updateInspector();replay();
}
function config(mode){
 const p={...current};p.presetName=selected.name;p.mode=mode==='OUT'?'out':mode==='IN & OUT'?'both':'in';p.split=$('unit').value.toLowerCase()==='letters'?'chars':$('unit').value.toLowerCase();
 p.fillStyle=$('fillMode').value==='Sweep'?'sweep':$('fillMode').value==='Per Piece'?'piece':'reveal';p.fillUnit=$('fillUnit').value==='Letters'?'chars':$('fillUnit').value.toLowerCase();
 p.fillDirection=$('fillDirection').value==='From End'?'end':$('fillDirection').value==='Center Out'?'center':$('fillDirection').value==='Center In'?'to-center':'start';
 const dir=$('direction').value;p.direction=dir==='Custom'?'custom':dir.toLowerCase();if(dir!=='Custom')p.directionAngle={Up:-90,Down:90,Left:180,Right:0}[dir];
 p.trajectory={'From Start':'start','From End':'end','Center Out':'center-out','Center In':'center-in','Random':'random','All at Once':'all-at-once','Custom Index':'custom-index'}[$('order').value];p.baseColor=$('fillColor').value;p.fillColor=$('fillOneColor').value;p.fill2Color=$('fillTwoColor').value;p.fill3Color=$('fillThreeColor').value;for(let i=4;i<=5;i++){const picker=$('fillExtraColor'+i);if(picker)p['fill'+i+'Color']=picker.value;}p.echoColor=$('echoColor').value;
 return p;
}
function render(time){
 if(!previewScenes.length)return;
 const p=config(currentMode()),text=$('sampleText').value||' ';
 p.mode=currentMode()==='OUT'?'out':currentMode()==='IN & OUT'?'both':'in';
 p.trajectory={'From Start':'start','From End':'end','Center Out':'center-out','Center In':'center-in','Random':'random','All at Once':'all-at-once','Custom Index':'custom-index'}[$('order').value];
 for(const scene of previewScenes)scene.reference.configure(renderOptions(selected,p,text,scene.small));
 const length=duration();playhead=clamp(time,0,length);
 for(const scene of previewScenes)scene.reference.render(playhead);
 $('seek').value=String(Math.round(playhead/length*1000));$('timeReadout').textContent=playhead.toFixed(2)+' / '+length.toFixed(2)+' s';updateCurveDot(playhead);
}
function renderThumbs(t){
 for(const obj of thumbScenes){
  const p={...obj.data.p,baseColor:'#ffffff'};
  obj.scene.reference.configure(renderOptions(obj.data,p,window.YMXReferenceFor(obj.data)?.preset.text||'Meet Qwix',false,true));
  obj.scene.reference.render(motionReduced()?obj.scene.reference.duration:t%obj.scene.reference.duration);
 }
}
function tick(now){
 raf=0;
 if(document.hidden){lastTime=null;return;}
 const d=lastTime===null?0:Math.max(0,Math.min(.08,(now-lastTime)/1000));lastTime=now;
 // Independent gallery clock: previews do not depend on play / pause of the stage.
 thumbTime+=d;
 if(lastThumbPaint<0||thumbTime-lastThumbPaint>=.033){renderThumbs(thumbTime);lastThumbPaint=thumbTime;}
 if(playing&&mainModel){
  playhead+=d;const p=config(currentMode()),length=duration(p,mainModel.pieces.length,currentMode(),Number($('holdSeconds').value),mainModel.meta);
  if(playhead>=length){if(looping)playhead%=length;else{playhead=length;playing=false;}}
  render(playhead);
 }
 updateButtons();
 if(playing||!motionReduced())start();
}
function start(){if(!disposed&&!raf&&!document.hidden)raf=requestAnimationFrame(tick)}
function replay(){playhead=0;lastThumbPaint=-1;playing=!motionReduced();lastTime=null;render(playing?0:duration());renderThumbs(0);updateButtons();updateInspector();start()}
function updateButtons(){$('playPause').textContent=playing?'Ⅱ':'▶';$('playPause').setAttribute('aria-label',playing?'Pausar':'Reproducir')}
function downloadJSON(data,name){
 if(host.hasCEP){host.run('ytSaveJSON',{name,content:JSON.stringify(data,null,2)});return;}
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),link=document.createElement('a'),url=URL.createObjectURL(blob);
 link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportSettings(){
 render(playhead);
 const reference=window.YMXReferenceFor(selected);
 const data={project:'YaguaTool Motion Lab',version:'0.9',source:'https://qwixplugin.com/presets',rendererModule:33879,presetId:selected.id,presetName:selected.name,text:$('sampleText').value,mode:currentMode(),split:$('unit').value,order:$('order').value,hold:Number($('holdSeconds').value),sequence:$('webSequence').checked,referenceFontSize:reference?.pack.referenceFontSize||32,parameters:config(currentMode()),originalPreset:reference?.preset};
 downloadJSON(data,'YMX_'+selected.name.replace(/[^A-Za-z0-9]/g,'_')+'_v09.json');
 $('ymxStatus').textContent='Configuración exportada con los parámetros y la referencia web.';
}
function exportFrames(){
 render(playhead);const scene=previewScenes[0].reference,fps=60,frames=[];
 for(let index=0;index<=Math.ceil(scene.duration*fps);index++){const time=Math.min(scene.duration,index/fps);frames.push({frame:index,...scene.sample(time),visual:scene.visualSnapshot(time)})}
 const data={schema:'ymx.motion.samples.v1',fps,source:'https://qwixplugin.com/presets',rendererModule:33879,preset:selected.name,text:$('sampleText').value,coordinateSystem:'CSS pixels; +X right, +Y down; rotation degrees; scale 1 = 100%; opacity 0..1; positions relative to glyph/word rest geometry',font:{family:'Geist',weight:760,size:scene.players[0].fontSize,referenceSize:window.YMXReferenceFor(selected)?.pack.referenceFontSize||32},options:scene.options,geometry:scene.geometry(),frames};
 render(playhead);downloadJSON(data,'YMX_'+selected.name.replace(/[^A-Za-z0-9]/g,'_')+'_60fps_v09.json');
 $('ymxStatus').textContent='Exportadas '+frames.length+' muestras a 60 fps para la reconstrucción en AE.';
 return data;
}
function hook(){
 $('referenceText').addEventListener('change',()=>{if($('referenceText').checked){$('sampleText').value=window.YMXReferenceFor(selected)?.preset.text||'Meet Qwix';createStageScenes();replay()}});
 $('webSequence').addEventListener('change',()=>{render(0);replay()});
 $('exportFrames').addEventListener('click',exportFrames);
 for(const [id,delta] of [['prevFrame',-1],['nextFrame',1]])$(id).addEventListener('click',()=>{playing=false;render(playhead+delta/60);updateButtons()});
 listen(window,'resize',()=>{render(playhead);renderThumbs(thumbTime)});
 document.fonts.load('760 32px YMXGeist').then(()=>{for(const scene of previewScenes)scene.reference.signature='';for(const item of thumbScenes)item.scene.reference.signature='';render(playhead);renderThumbs(thumbTime)});

 $('animate').addEventListener('click',replay);$('apply').textContent='Exportar configuración';$('apply').title='Descarga un archivo JSON con todos los parámetros del preset';$('apply').addEventListener('click',exportSettings);
 $('clear').textContent='Detener';$('clear').addEventListener('click',()=>{playing=false;lastTime=null;playhead=duration(config(currentMode()),mainModel.pieces.length,currentMode(),Number($('holdSeconds').value),mainModel.meta);render(playhead);updateButtons()});
 $('playPause').addEventListener('click',()=>{playing=!playing;if(playing){if(playhead>=duration(config(currentMode()),mainModel.pieces.length,currentMode(),Number($('holdSeconds').value),mainModel.meta))playhead=0;lastTime=null;start()}updateButtons()});
 $('seek').addEventListener('input',()=>{const len=duration(config(currentMode()),mainModel.pieces.length,currentMode(),Number($('holdSeconds').value),mainModel.meta);playhead=len*Number($('seek').value)/1000;render(playhead)});
 $('loop').addEventListener('change',()=>{looping=$('loop').checked});
 $('fillMode').addEventListener('change',()=>{current.fillStyle=$('fillMode').value==='Sweep'?'sweep':$('fillMode').value==='Per Piece'?'piece':'reveal';refreshControls();replay()});
 $('unit').addEventListener('change',()=>{createStageScenes();replay()});
 $('sampleText').addEventListener('input',()=>{$('referenceText').checked=false;createStageScenes();replay()});
 $('twoLines').addEventListener('click',()=>{const words=$('sampleText').value.replace(/\n/g,' ').trim().split(/\s+/),half=Math.max(1,Math.floor(words.length/2));$('sampleText').value=words.length>1?words.slice(0,half).join(' ')+'\n'+words.slice(half).join(' '):words[0]+'\nMOTION';$('unit').value='Lines';createStageScenes();replay()});
 ['io','order','direction','fillUnit','fillDirection'].forEach(id=>$(id).addEventListener('change',replay));
 ['fillColor','fillOneColor','fillTwoColor','fillThreeColor','echoColor'].forEach(id=>$(id).addEventListener('input',()=>{render(playhead);updateInspector()}));
 $('resetAll').addEventListener('click',restoreDefault);
 root.querySelectorAll('#controlTabs button').forEach(b=>b.addEventListener('click',()=>{activeTab=b.dataset.tab;refreshControls()}));
 const toggle=$('holdSeconds');if(toggle)toggle.addEventListener('input',()=>{window.YMX_HOLD=Number(toggle.value);$('holdValue').textContent=fmt(window.YMX_HOLD)+' s';replay()});
 listen(document,'visibilitychange',()=>{lastTime=null;lastThumbPaint=-1;if(!document.hidden)start()});
 const mq={matches:motionReduced()};if(mq.matches){playing=false;looping=false;$('loop').checked=false;}
 window.YMX_TEST={version:'0.9',galleryClock:()=>thumbTime,thumbnailPaint:()=>lastThumbPaint,thumbnailScenes:()=>thumbScenes,inspector:()=>curveVals(),restoreDefault,changePack:(name)=>{const p=groups[name];if(p&&p.length)loadPreset(p[0])},catalog:$catalog,select:(id)=>{const data=$catalog.find(x=>x.id===id);if(data)loadPreset(data)},selected:()=>selected,presetParameters:()=>current,render,renderThumbs,scene:()=>mainModel,duration,referenceScenes:()=>previewScenes,config:()=>config(currentMode()),pause:()=>{playing=false;updateButtons()},sample:(time)=>previewScenes[0].reference.sample(time),exportFrames};

}
if(!$catalog.length){$('presetHeading').textContent='No se pudo cargar el catálogo';return}
setupInspector();hook();loadPreset(selected);if(!playing){const p=config(currentMode());render(duration(p,mainModel.pieces.length,currentMode(),Number($('holdSeconds').value),mainModel.meta));updateButtons()}

function remember(){
 if(disposed)return;
 host.S.motionLab09={id:selected.id,parameters:config(currentMode()),text:$('sampleText').value,referenceText:$('referenceText').checked,webSequence:$('webSequence').checked,hold:$('holdSeconds').value,activeTab,tab:currentMode()};host.save();
}
function restoreStored(){
 const previous=host.S.motionLab09;if(!previous)return;
 const found=$catalog.find(p=>p.id===previous.id);if(!found)return;
 loadPreset(found);current=JSON.parse(JSON.stringify(previous.parameters));$('referenceText').checked=!!previous.referenceText;$('sampleText').value=previous.text;$('webSequence').checked=!!previous.webSequence;$('holdSeconds').value=previous.hold;
 activeTab=previous.activeTab||'motion';syncSelectors();$('io').value=previous.tab||'IN';createStageScenes();refreshControls();updateInspector();replay();
}
function status(message){$('ymxStatus').textContent=message;}
async function applyNative(insert){
 if(!host.hasCEP){status('Abre YaguaTool en After Effects para crear la animación nativa.');return;}
 const button=$(insert?'insertNative':'applyNative');if(button.disabled)return;button.disabled=true;playing=false;updateButtons();
 try{
  status('Muestreando el motor v0.9 a 60 fps…');
  const options=renderOptions(selected,config(currentMode()),$('sampleText').value||' ');
  if(raf){cancelAnimationFrame(raf);raf=0;}
  options.presetId=selected.id;options.editable=true;
  const baked=await window.YaguaLabBake.capture(options,(fraction)=>status('Preparando '+Math.round(fraction*100)+' % · sin reducir Echo ni Ghost'),()=>disposed);
  if(disposed)return;
  const pathReply=await host.jsx('tempDir');if(!pathReply.ok)throw Error(pathReply.msg);
  const fs=window.cep&&window.cep.fs;if(!fs)throw Error('El acceso a archivos CEP no está disponible.');
  const path=pathReply.data+'/YaguaTool_Lab_'+Date.now()+'.json';const result=fs.writeFile(path,JSON.stringify(baked));if(result.err)throw Error('No se pudo escribir la animación temporal: '+result.err);
  status('Creando capas nativas en AE…');
  const answer=await host.run('ytLabBuild',{path,insert:!!insert,temporary:true,editable:true});status(answer.msg);
 }catch(e){status(e.message);}finally{if(!disposed){button.disabled=false;render(playhead);start();}}
}
const fontButton=document.createElement('button');fontButton.className='secondary';fontButton.textContent='Abrir fuente incluida';fontButton.addEventListener('click',()=>{if(host.hasCEP)host.run('ytOpenFontFolder');else status('La fuente está incluida en assets/fonts/GeistLab760.ttf del ZIP.');});root.querySelector('.native-lab-actions').append(fontButton);
$('applyNative').addEventListener('click',()=>applyNative(false));$('insertNative').addEventListener('click',()=>applyNative(true));
$('applyBakedDefault').addEventListener('click',()=>{if(!host.hasCEP){status('Disponible en After Effects.');return;}host.run('ytLabDefault',{id:selected.id}).then(r=>status(r.msg));});
let stateTimer;
listen(root,'change',()=>{clearTimeout(stateTimer);stateTimer=setTimeout(remember,120)});
listen(root,'input',()=>{clearTimeout(stateTimer);stateTimer=setTimeout(remember,180)});
restoreStored();
activeDispose=function(){remember();disposed=true;clearTimeout(stateTimer);if(raf)cancelAnimationFrame(raf);for(const fn of globals)fn();for(const scene of previewScenes)scene.reference.destroy();for(const scene of thumbScenes)scene.scene.reference.destroy();if(window.YMX_TEST&&window.YMX_TEST.version==='0.9')window.YMX_TEST=null;activeDispose=null;};
return {dispose:activeDispose,exportFrames};
}
return {mount,disposeAll(){if(activeDispose)activeDispose();}};
})();
