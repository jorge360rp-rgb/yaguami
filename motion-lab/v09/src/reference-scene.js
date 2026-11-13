/* Deterministic timeline adapter. All sampled poses come from the reference player. */
(function () {
'use strict';
const clone = value => JSON.parse(JSON.stringify(value));
const referencePacks = window.YMX_REFERENCE_PACKS;
function referenceFor(data) {
 const pack = referencePacks.find(pack => pack.name === data.pack);
 if (!pack) return null;
 const preset = pack.presets.find(preset => preset.name === data.name || (preset.installAs || []).includes(data.name));
 if (!preset) return null;
 const side = preset.installAs ? Math.max(0,preset.installAs.indexOf(data.name)) : 0;
 return { pack, preset, side };
}
class ReferenceScene {
 constructor(host) { this.host=host;this.signature='';this.players=[];this.options=null; }
 configure(options) {
  const signature=JSON.stringify(options);
  if (signature===this.signature) return;
  this.destroy();this.signature=signature;this.options=clone(options);
  const ref=referenceFor(options.data),params=clone(options.params);
  const layers=options.sequence&&ref?.preset.sequence?clone(ref.preset.layers):[{...clone(ref?.preset.layers[ref.side]||{}),kind:options.data.kind,params}];
  if (layers.length>1) layers[ref.side].params=params;
  layers.forEach(layer => {
   const root=document.createElement('div');root.className='ymx-fx-host';
   root.style.fontSize=options.fontSize+'px';root.style.color=options.baseColor;
   this.host.appendChild(root);
   const player=new window.YMXTextFxPlayer(root,{text:options.text,layers:[layer],lite:false,referenceFontSize:ref?.pack.referenceFontSize||32});
   this.players.push(player);
  });
  this.sequence=layers.length>1;
  this.firstEnd=this.players[0].durationWithTail+250;
  this.outStart=this.firstEnd+(options.sequence?200:0);
  // A single player has its own exact 500 ms IN/OUT hold. The UI can override it explicitly.
  this.holdMs=options.holdMs??500;
  this.lengthMs=this.sequence?this.outStart+this.players[1].durationWithTail+250+420:this.players[0].durationWithTail+400+(params.mode==='both'?this.holdMs-500:0);
 }
 get duration() { return this.lengthMs/1000; }
 localTime(ms,player) {
  if(player.mode!=='both'||this.holdMs===500)return ms;
  const end=player.totalMs;
  if(ms<=end)return ms;
  if(ms<=end+this.holdMs)return end;
  return ms-this.holdMs+500;
 }
 render(seconds) {
  if(!this.players.length)return;
  const ms=Math.max(0,seconds*1000),side=this.sequence&&ms>=this.outStart?1:0;
  this.players.forEach((player,index)=>{player.host.style.visibility=index===side?'visible':'hidden';player.host.style.opacity='1';});
  const player=this.players[side],time=this.localTime(this.sequence&&side?ms-this.outStart:ms,player);
  if(this.sequence&&side&&time>player.durationWithTail+250){
   this.players[side].host.style.visibility='hidden';
   this.players[0].host.style.visibility='visible';this.players[0].settle();
   // Native sequence wrapper fades the incoming rest pose after the OUT finishes.
   const f=Math.min(1,(time-player.durationWithTail-250)/420);
   let low=0,high=1;for(let k=0;k<20;k++){const t=(low+high)/2,x=3*(1-t)*t*t*.58+t*t*t;if(x<f)low=t;else high=t;}
   const t=(low+high)/2;this.players[0].host.style.opacity=String(3*(1-t)*t*t+t*t*t);
  }else if(player.mode==='in'&&time>=player.durationWithTail+250)player.settle();
  else player.seek(time);
  // The public player uses white as the Fill base; this explicit user override is optional.
  if(this.options.baseColor.toLowerCase()!=='#ffffff'){
   for(const node of player.charEls)if(node&&!node.style.color)node.style.color=this.options.baseColor;
  }
 }
 sample(seconds) {
  const ms=Math.max(0,seconds*1000),side=this.sequence&&ms>=this.outStart?1:0;
  const player=this.players[side],time=this.localTime(side?ms-this.outStart:ms,player);
  const frame=player.sample(time);
  return {time:seconds,side,localTimeMs:time,text:player.text,fontSize:player.fontSize,unit:player.unit,textBlur:frame.textBlur,
   pieces:frame.pieces.map((pose,index)=>({index,text:player.pieceSplits[player.nonSpacePieces[index]].rawText,startIndex:player.pieceSplits[player.nonSpacePieces[index]].startIndex,anchorX:player.layer.params.anchorX,anchorY:player.layer.params.anchorY,...pose})),
   trackX:frame.trackX?Array.from(frame.trackX):null,trackY:frame.trackY?Array.from(frame.trackY):null,fill:frame.fill,charOpacity:frame.charOpacity?Array.from(frame.charOpacity):null,
   settled:player.mode==='in'&&time>=player.durationWithTail+250,sequenceReset:this.sequence&&side===1&&time>player.durationWithTail+250};
 }
 geometry() {
  return this.players.map(player=>({text:player.text,fontSize:player.fontSize,unit:player.unit,kind:player.layer.kind,params:player.layer.params,
   textBox:{width:player.textEl.offsetWidth,height:player.textEl.offsetHeight},
   pieces:player.pieceEls.map((element,index)=>({index,text:player.pieceSplits[player.nonSpacePieces[index]].rawText,startIndex:player.pieceSplits[player.nonSpacePieces[index]].startIndex,x:element.offsetLeft,y:element.offsetTop,width:element.offsetWidth,height:element.offsetHeight,transformOrigin:element.style.transformOrigin})),
   characters:player.charEls.map((element,index)=>element?{index,text:element.textContent,x:element.offsetLeft,y:element.offsetTop,width:element.offsetWidth,height:element.offsetHeight}:null)}));
 }
 visualSnapshot(seconds) {
  this.render(seconds);
  const piece=element=>({transform:element.style.transform,transformOrigin:element.style.transformOrigin,opacity:element.style.opacity||'1',filter:element.style.filter||'none'});
  const chars=elements=>Array.from(elements,element=>element?{color:element.style.color||'',opacity:element.style.opacity||'1',transform:element.style.transform||''}:null);
  return this.players.map(player=>({visibility:player.host.style.visibility,hostOpacity:player.host.style.opacity,textFilter:player.textEl.style.filter,
   main:{pieces:player.pieceEls.map(piece),characters:chars(player.charEls),tracking:chars(player.trackEls)},
   echo:player.ghosts.map(layer=>({display:layer.root.style.display,opacity:layer.root.style.opacity,zIndex:layer.root.style.zIndex,slot:layer.slot,pieces:layer.pieces.map(piece),characters:chars(layer.chars)})),
   ghost:player.ghostOverlay?{opacity:player.ghostOverlay.root.style.opacity,filter:player.ghostOverlay.root.style.filter,lagMs:player.ghostOverlay.lagMs,distance:player.ghostOverlay.distance,pieces:player.ghostOverlay.pieces.map(piece),characters:chars(player.ghostOverlay.chars)}:null,
   glow:player.halos.map(layer=>({opacity:layer.root.style.opacity,filter:layer.root.style.filter,pieces:layer.pieces.map(piece),characters:chars(layer.chars)}))}));
 }
 destroy() { for(const player of this.players)player.destroy();this.players=[];this.host.replaceChildren(); }
}
window.YMXReferenceScene=ReferenceScene;
window.YMXReferenceFor=referenceFor;
})();
