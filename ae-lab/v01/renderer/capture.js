(time) => {
 scene.render(time);
 const p=scene.players[0],out=[];
 function blur(s){return parseFloat((s||'').match(/blur\(([\d.]+)/)?.[1]||0);}
 function capture(id,root,pieces,extra,z){
  if(root.style.display==='none'||root.style.visibility==='hidden')return;
  const alpha=parseFloat(root.style.opacity||'1');if(alpha===0)return;
  pieces.forEach((el,i)=>{
   const opacity=alpha*parseFloat(el.style.opacity||'1');if(opacity<.00001)return;
   const m=new DOMMatrix(getComputedStyle(el).transform);
   const chars=[...el.querySelectorAll('.qfx-char')].map(c=>{
    const q=new DOMMatrix(getComputedStyle(c).transform);
    return {color:getComputedStyle(c).color,opacity:parseFloat(c.style.opacity||'1'),x:q.e,y:q.f};
   });
   out.push({id:id+'_'+i,piece:i,z,m:[m.a,m.b,m.c,m.d,m.e,m.f],opacity,blur:extra+blur(el.style.filter),chars});
  });
 }
 capture('main',p.textEl,p.pieceEls,p.sample(time*1000).textBlur,2);
 p.ghosts.forEach((e,i)=>capture('echo'+i,e.root,e.pieces,blur(e.root.parentElement.style.filter),(p.echoBehind?1:3)+(parseFloat(e.root.style.zIndex)||0)/1000));
 if(p.ghostOverlay)capture('ghost',p.ghostOverlay.root,p.ghostOverlay.pieces,blur(p.ghostOverlay.root.style.filter),1);
 p.halos.forEach((e,i)=>capture('glow'+i,e.root,e.pieces,blur(e.root.style.filter),0));
 return out;
}
