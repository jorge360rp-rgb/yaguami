/* Sample the supplied v0.9 scene, not a replacement animation formula. */
window.YaguaLabBake=(function(){
 'use strict';
 const clone=v=>JSON.parse(JSON.stringify(v));
 function blur(s){const match=String(s||'').match(/blur\(([\d.e+-]+)/);return match?Number(match[1]):0;}
 function matrix(el){const C=window.DOMMatrix||window.WebKitCSSMatrix,m=new C(getComputedStyle(el).transform==='none'?'':getComputedStyle(el).transform);return [m.a,m.b,m.c,m.d,m.e,m.f];}
 function rgb(el){return getComputedStyle(el).color;}
 async function capture(options,progress,cancelled){
  await document.fonts.load('760 96px YMXGeist');
  const stage=document.createElement('div');stage.className='yt-bake-stage';document.body.append(stage);
  const source=clone(options);source.fontSize=96*Math.min(1,10/Math.max(1,source.text.length));
  const scene=new window.YMXReferenceScene(stage);scene.configure(source);
  try{
   const geometry=[],offsets=[];
   for(const p of scene.players){
    offsets.push(geometry.length);p.settle();
    for(const el of p.pieceEls){
     const probe=document.createElement('span');probe.style.cssText='display:inline-block;width:0;height:0;padding:0';el.append(probe);
     const baseline=probe.getBoundingClientRect().top-el.getBoundingClientRect().top;probe.remove();
     geometry.push({x:p.textEl.offsetLeft+el.offsetLeft,y:p.textEl.offsetTop+el.offsetTop,w:el.offsetWidth,h:el.offsetHeight,
      origin:getComputedStyle(el).transformOrigin.split(' ').map(parseFloat),chars:Array.from(el.querySelectorAll('.qfx-char'),c=>({text:c.textContent,x:c.offsetLeft,y:baseline}))});
    }
   }
   const fps=60,count=Math.ceil(scene.duration*fps)+1,frames=[];
   function oneFrame(time){
    scene.render(time);const output=[];
    scene.players.forEach((p,side)=>{
     if(p.host.style.visibility==='hidden')return;
     const hostAlpha=parseFloat(p.host.style.opacity||'1');
     function layer(prefix,root,pieces,extra,z,override){
      if(root.style.display==='none'||root.style.visibility==='hidden')return;
      const alpha=hostAlpha*parseFloat(root.style.opacity||'1');if(alpha<=0)return;
      pieces.forEach((el,index)=>{
       const opacity=alpha*parseFloat(el.style.opacity||'1');if(opacity<.00001)return;
       const chars=Array.from(el.querySelectorAll('.qfx-char'),c=>{const m=matrix(c);return {color:override&&override.color||rgb(c),opacity:parseFloat(c.style.opacity||'1'),x:m[4],y:m[5]};});
       output.push({id:'s'+side+'_'+prefix+'_'+index,piece:offsets[side]+index,z,m:matrix(el),opacity,blur:extra+blur(el.style.filter),chars,blend:override&&override.blend||'NORMAL'});
      });
     }
     layer('main',p.textEl,p.pieceEls,blur(p.textEl.style.filter),2);
     p.ghosts.forEach((g,i)=>layer('echo'+i,g.root,g.pieces,blur(g.root.parentElement.style.filter),(p.echoBehind?1:3)+(parseFloat(g.root.style.zIndex)||0)/1000));
     if(p.ghostOverlay){
      const ghost=p.ghostOverlay;layer('ghost',ghost.root,ghost.pieces,blur(ghost.root.style.filter),1);
      const filter=ghost.root.querySelector('filter');
      if(filter){const gaussian=filter.querySelector('feGaussianBlur'),flood=filter.querySelector('feFlood');if(gaussian&&flood){const sigma=Number(gaussian.getAttribute('stdDeviation'))||0;layer('ghost-glow',ghost.root,ghost.pieces,Math.sqrt(Math.pow(blur(ghost.root.style.filter),2)+sigma*sigma),.9,{color:flood.getAttribute('flood-color'),blend:'ADD'});}}
     }
     p.halos.forEach((halo,i)=>layer('glow'+i,halo.root,halo.pieces,blur(halo.root.style.filter),0));
    });return output;
   }
   for(let f=0;f<count;f++){
    if(cancelled&&cancelled())throw Error('Preparación cancelada al salir de Motion Lab.');
    frames.push(oneFrame(Math.min(scene.duration,f/fps)));
    if(f%6===0){if(progress)progress(f/count);await new Promise(resolve=>setTimeout(resolve,0));}
   }
   if(progress)progress(1);
   return {schema:1,name:source.data.name,pack:source.data.pack,id:source.presetId||source.data.name,text:source.text,renderOptions:source,font:'GeistLab760',fontSize:source.fontSize,width:1920,height:1080,fps,geometry,frames,parameters:source.params,sequence:source.sequence,holdMs:source.holdMs,sourceEngine:'Motion Lab v0.9 · unchanged reference-player.js'};
  }finally{scene.destroy();stage.remove();}
 }
 return {capture};
})();
