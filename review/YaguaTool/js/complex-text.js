window.YaguaComplex=(function(){
 var dispose=null;
 function stop(){if(dispose)dispose();dispose=null;}
 function render(root,api){
  stop();var h=api.h,v=api.S.fluid=api.S.fluid||{customize:false,text1:'YAGUANO',text2:'MOTION'},dead=false,raf=0,images=[],data=null,epoch=null,paused=false;
  var stage=h('div',{class:'fluid-preview-stage'},h('div',{class:'fluid-placeholder'},h('b',{},'Efecto fluido'),h('span',{},'Preview del proyecto original de AE'))),image=h('img',{hidden:true,alt:'Efecto fluido renderizado por After Effects'}),status=h('p',{class:'desc',role:'status'},'Renderiza la preview para ver los efectos originales, sin reconstrucciones.');stage.appendChild(image);
  var card=h('div',{class:'card'},h('div',{class:'preview-head'},h('b',{},'Vapor Text · original AE2024')),stage,status);root.appendChild(card);
  function message(t){status.textContent=t;}
  var native=h('button',{class:'btn pri',onclick:function(){
   if(!api.hasCEP){message('La preview real requiere abrir YaguaTool dentro de After Effects.');return;}native.disabled=true;message('Renderizando el proyecto original en AE…');
   api.run('ytFluidPreview',{}).then(function(r){if(!r.ok||!r.data)throw Error(r.msg);return Promise.all(r.data.frames.map(function(url){return new Promise(function(resolve,reject){var im=new Image();im.onload=function(){resolve(im);};im.onerror=function(){reject(Error('No se pudo cargar un fotograma.'));};im.src=url+'?t='+Date.now();});})).then(function(items){if(dead)return;images=items;data=r.data;image.hidden=false;stage.querySelector('.fluid-placeholder').hidden=true;epoch=null;message('Render real de AE · original sin cambios · '+Math.round(data.fps)+' fps de muestreo.');});}).catch(function(e){if(!dead)message(e.message);}).then(function(){if(!dead)native.disabled=false;});
  }},'Renderizar preview real');
  var pause=h('button',{class:'btn',onclick:function(){paused=!paused;pause.textContent=paused?'Continuar':'Pausar';}},'Pausar'),seek=h('input',{type:'range',min:0,max:1000,value:0,'aria-label':'Posición de preview del efecto fluido',oninput:function(){if(!data)return;paused=true;var index=Math.min(images.length-1,Math.floor(Number(seek.value)/1000*(images.length-1)));image.src=images[index].src;epoch=null;pause.textContent='Continuar';}});
  card.appendChild(h('div',{class:'fluid-transport'},native,pause,seek));
  root.appendChild(h('div',{class:'card'},h('b',{},'Crear una instancia independiente'),h('p',{class:'desc'},'Se conserva el AEP original, sus precomposiciones, mapas, efectos y keyframes. Requiere la fuente Impact.'),
   h('label',{class:'check-line'},h('input',{type:'checkbox',checked:v.customize,onchange:function(e){v.customize=e.target.checked;api.save();}}),'Cambiar los dos textos de la copia'),
   h('label',{class:'fluid-text-label'},'Texto 01',h('input',{type:'text',value:v.text1,'aria-label':'Texto 01 del efecto fluido',oninput:function(e){v.text1=e.target.value;api.save();}})),
   h('label',{class:'fluid-text-label'},'Texto 02',h('input',{type:'text',value:v.text2,'aria-label':'Texto 02 del efecto fluido',oninput:function(e){v.text2=e.target.value;api.save();}})),
   h('div',{class:'btns'},h('button',{class:'btn pri',onclick:function(){api.run('ytFluidCreate',{insert:true,customize:v.customize,text1:v.text1,text2:v.text2});}},'Insertar en composición activa'),h('button',{class:'btn',onclick:function(){api.run('ytFluidCreate',{insert:false,customize:v.customize,text1:v.text1,text2:v.text2});}},'Crear copia editable'),h('button',{class:'btn',onclick:function(){api.run('ytFluidOpen');}},'Abrir original importado')),
   h('p',{class:'desc'},'La preview muestra el original. Los textos personalizados se aplican a una copia. La fuente y la gestión de color del proyecto receptor influyen en el acabado.')));
  function tick(now){if(dead)return;if(data&&!paused){if(epoch===null)epoch=now-Number(seek.value)/1000*data.duration*1000;var t=((now-epoch)/1000)%(data.duration+.4),i=Math.min(images.length-1,Math.floor(t*data.fps));if(image.src!==images[i].src)image.src=images[i].src;seek.value=Math.round(Math.min(1,t/data.duration)*1000);}else if(paused)epoch=null;raf=requestAnimationFrame(tick);}
  raf=requestAnimationFrame(tick);dispose=function(){dead=true;cancelAnimationFrame(raf);images=[];};
 }
 return{render:render,stop:stop};
})();
