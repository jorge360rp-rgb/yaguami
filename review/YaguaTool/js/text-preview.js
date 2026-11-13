/* Parameter-driven TEXT simulator and native AE frame player. CEP compatible. */
var YaguTextPreview = (function () {
  "use strict";
  var dispose = function () {}, svgSequence=0;
  function stop() { dispose(); dispose = function () {}; }
  function clamp(x) { return Math.max(0, Math.min(1, x)); }
  function num(v, k, d) { return v[k] === undefined ? d : Number(v[k]); }
  function smooth(x) { x = clamp(x); return x*x*(3-2*x); }
  function formatNumber(value, v) {
    var parts=value.toFixed(num(v,"decimals",0)).split(".");
    if(v.sep)parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,v.sep);
    return (v.prefix||"")+parts.join(".")+(v.suffix||"");
  }
  function timer(value,fmt) {
    var neg=value<0?"-":"",v=Math.abs(value);
    function z(x) { return ("0"+Math.floor(x)).slice(-2); }
    var sec=z(v%60),min=z(Math.floor(v/60)%60),ms=z((v%1)*100);
    if(fmt==="hh:mm:ss")return neg+z(v/3600)+":"+min+":"+sec;
    if(fmt==="ss.ms")return neg+(v<10?"0":"")+Math.floor(v)+"."+ms;
    var m=Math.floor(v/60);var base=neg+(m<10?"0":"")+m+":"+sec;
    return base+(fmt==="mm:ss:ff"?":"+z((v%1)*30):fmt==="mm:ss.ms"?"."+ms:"");
  }
  function create(h,cur,v,run,hasCEP) {
    stop();
    var id=cur.id, dead=false,raf=0,epoch=null,frames=null,images=[],loading=false,revision=0,paused=false,scrubTime=null,svg=null,maskNodes=[],maskText=[],maskBounds=null;
    var reduced=document.documentElement.getAttribute("data-motion")==="reduced";paused=reduced;
    var stage=h("div",{class:"text-preview-stage"}),scene=h("div",{class:"text-preview-scene"});
    var status=h("small",{},"Simulación rápida · renderiza en AE para comprobar el resultado real");
    var output=h("img",{class:"text-preview-render",alt:"Fotograma renderizado por After Effects",hidden:true});
    var units=[],mask=/^(MR[UDLR]|MSC|MDI)$/.test(id),whole=/^(WR|WB)$/.test(id),generator=/^(N|TM|TW)$/.test(id);
    var play=h("button",{class:"btn sm",onclick:replay},"↻ Reproducir");
    var render=h("button",{class:"btn sm",onclick:renderNative},"Renderizar preview real en el panel");
    var open=h("button",{class:"btn sm",onclick:function(){if(!hasCEP){status.textContent="Abre la extensión en After Effects para usar la preview real.";return;}run("previewText",{kind:id,params:params()});}},"Abrir preview real en AE");
    var pause=h("button",{class:"btn sm preview-pause","aria-label":"Pausar preview",onclick:function(){paused=!paused;pause.textContent=paused?"Continuar":"Pausar";pause.setAttribute("aria-label",paused?"Continuar preview":"Pausar preview");}},"Pausar");
    var scrub=h("input",{type:"range",min:0,max:1000,step:1,value:0,"aria-label":"Posición de la preview",oninput:function(){paused=true;scrubTime=Number(scrub.value)/1000*(frames?frames.duration:cycleLength()-1);if(frames){var at=Math.min(images.length-1,Math.round(scrubTime*frames.fps));output.src=images[at].src;}else paint(scrubTime);pause.textContent="Continuar";clock.textContent=scrubTime.toFixed(2)+" s";}});
    var clock=h("output",{class:"preview-clock"},"0.00 s");
    var transport=h("div",{class:"preview-transport"},pause,scrub,clock);
    var wrap=h("div",{class:"card preview-card"},h("div",{class:"preview-head"},h("b",{},"Vista previa · "+cur.name),play),stage,transport,status,render,open);
    stage.appendChild(scene);stage.appendChild(output);
    function params() { var p={},k;for(k in v)if(v.hasOwnProperty(k))p[k]=v[k];if(id==="TW")p.twMode=p.mode==="out"?"delete":"type";return p; }
    function build() {
      scene.innerHTML="";units=[];svg=null;maskNodes=[];maskText=[];maskBounds=null;
      scene.className="text-preview-scene"+(mask?" has-mask-scene":"");
      if(mask){buildMasks();return;}
      var basis=mask?"lines":whole?"whole":(v.basedOn||"chars");
      if(generator){var item=h("span",{class:"text-preview-unit"});scene.appendChild(item);units.push(item);return;}
      var lines=whole?["CREATIVE MOTION\nDESIGN WITH TYPE"]:["CREATIVE MOTION","DESIGN WITH TYPE"];
      lines.forEach(function(txt){
        var row=h("div",{class:"text-preview-row"});scene.appendChild(row);
        var parts=basis==="lines"||basis==="whole"?[txt]:basis==="words"?txt.split(" "):txt.split("");
        parts.forEach(function(part,i){
          var item=h("span",{class:"text-preview-unit"},part===" "?"\u00a0":part);row.appendChild(item);
          if(basis==="words"&&i<parts.length-1)row.appendChild(h("span",{},"\u00a0"));
          if(basis!=="nospace"||part!==" ")units.push(item);
        });
      });
    }
    function paint(t) {
      var d=Math.max(.1,num(v,"dur",.8)),out=v.mode==="out",delay=num(v,"delay",0),local=t-delay;
      if(mask){paintMasks(t);return;}
      if(generator){
        var p=clamp(local/d),txt;
        if(id==="N")txt=formatNumber(num(v,"start",0)+(num(v,"end",1000)-num(v,"start",0))*smooth(p),v);
        else if(id==="TM")txt=timer(num(v,"start",0)+(num(v,"end",60)-num(v,"start",0))*p,v.format||"mm:ss");
        else { var full="CREATIVE MOTION",n=Math.round(full.length*(out?1-p:p));txt=full.substr(0,n);if(v.cursor&&n>0&&n<full.length&&Math.floor(t*num(v,"blink",2)*2)%2===0)txt+=v.cursorChar||"|"; }
        units[0].textContent=txt;return;
      }
      var n=units.length,spring=/^(EL|SB)$/.test(id),overlap=clamp(num(v,"overlap",100)/100);
      var step=spring?d*(.16+(1-overlap)*.26)/Math.max(1,n):0;
      units.forEach(function(el,i){
        var p=clamp((local-(mask&&!out?i*num(v,"stagger",.09):spring?i*step:0))/(spring?Math.max(.09,d-(n-1)*step):d));
        var q=smooth(p),amount;
        if(spring){var b=clamp(num(v,"bounce",25)/100);amount=p>=1?0:Math.pow(1-p,3)*(1-b)+b*Math.exp(-5*p)*Math.cos(2*Math.PI*num(v,"bounces",2)*p);if(out)amount=1-amount;}
        else if(whole){if(id==="WB"&&!out)q+=Math.min(.6,num(v,"bounce",25)/100)*Math.sin(p*Math.PI*4)*Math.pow(1-p,2);amount=out?q:1-q;}
        else {var width=Math.max(.001,overlap/Math.max(1,n));var boundary=q;var center=(i+.5)/Math.max(1,n);amount=clamp((center-boundary)/width+.5);if(out)amount=1-amount;}
        var dist=num(v,"dist",0),x=v.dir==="left"?dist:v.dir==="right"?-dist:0,y=v.dir==="up"?dist:v.dir==="down"?-dist:0;
        if(out){x=-x;y=-y;}
        if(id==="O"||id==="WO"){x=0;y=0;}
        el.style.transform="translate("+x*amount+"px,"+y*amount+"px) rotate("+num(v,"rot",0)*(out?-1:1)*amount+"deg) scale("+(1+(num(v,"scale",100)/100-1)*amount)+")";
        el.style.filter="blur("+Math.max(0,num(v,"blur",0)*amount)+"px)";
        var opacity=v.fade===false?1:clamp(1-amount);
        if(id==="O"||id==="WO")opacity=clamp(1-amount);
        if(id==="WO"&&p>0&&p<1)opacity*=.5+.5*Math.sin(t*num(v,"freq",5)*Math.PI*2+i*2.4);
        el.style.opacity=opacity;
        if(id==="CT"||id==="YHERO")el.style.letterSpacing=num(v,"tracking",28)*amount/10+"px";
        if(id==="YHERO"&&v.highlight!==false&&!out)el.style.color=Math.abs((i+.5)/n-q)<.12?(v.highlightColor||"#ff9eaa"):"";
      });
    }
    function node(tag,attrs){var el=document.createElementNS("http://www.w3.org/2000/svg",tag);for(var key in attrs)if(attrs.hasOwnProperty(key))el.setAttribute(key,attrs[key]);return el;}
    function buildMasks(){
      var out=v.mode==="out",clipId="yagu-mask-"+(++svgSequence),filterId=clipId+"-soft";
      svg=node("svg",{viewBox:"0 0 900 440",class:"mask-live-svg","aria-label":cur.name+" · "+(out?"OUT":"IN")});
      var defs=node("defs",{}),matte=node("mask",{id:clipId,maskUnits:"userSpaceOnUse",x:-300,y:-300,width:1500,height:1040,"mask-type":"luminance"});
      matte.appendChild(node("rect",{x:-300,y:-300,width:1500,height:1040,fill:out?"white":"black"}));
      var filter=node("filter",{id:filterId,x:"-100%",y:"-100%",width:"300%",height:"300%"});
      filter.appendChild(node("feGaussianBlur",{stdDeviation:num(v,"feather",1)*.5}));defs.appendChild(filter);
      var collection=node("g",{filter:"url(#"+filterId+")"});
      for(var line=0;line<2;line++)for(var slice=0;slice<YaguMaskMotion.slices(id);slice++){
        var path=node("path",{fill:out?"black":"white"});collection.appendChild(path);maskNodes.push({node:path,line:line,slice:slice});
      }
      matte.appendChild(collection);defs.appendChild(matte);svg.appendChild(defs);
      var textGroup=node("g",{mask:"url(#"+clipId+")",fill:"#f0f5ff","font-size":62,"font-family":"Arial, sans-serif","font-weight":700,"text-anchor":"middle"});
      ["CREATIVE MOTION","DESIGN WITH TYPE"].forEach(function(txt,i){var el=node("text",{x:450,y:190+i*74.4,class:"text-preview-mask-line"});el.textContent=txt;textGroup.appendChild(el);maskText.push(el);});
      svg.appendChild(textGroup);scene.appendChild(svg);
    }
    function paintMasks(time){
      if(!svg)return;
      if(!maskBounds){
        var left=900,top=440,right=0,bottom=0;
        maskText.forEach(function(el){var box=el.getBBox();if(!box.width)return;left=Math.min(left,box.x);top=Math.min(top,box.y);right=Math.max(right,box.x+box.width);bottom=Math.max(bottom,box.y+box.height);});
        if(right<=left)return;
        var pad=10+num(v,"feather",1)*1.8;maskBounds={x:left-pad,y:top-pad,w:right-left+pad*2,h:bottom-top+pad*2};
      }
      var bounds=maskBounds,out=v.mode==="out",d=YaguMaskMotion.duration(v),local=time-num(v,"delay",0),slices=YaguMaskMotion.slices(id);
      maskNodes.forEach(function(item){
        var u=clamp((local-YaguMaskMotion.offset(id,item.line,2,item.slice,v))/d),height=bounds.h/2/slices,
          y=bounds.y+bounds.h/2*item.line+height*item.slice,g=YaguMaskMotion.at(id,u,v,bounds.w/height,item.line,item.slice,out),path="",points=[],ins=[],outs=[];
        for(var j=0;j<8;j++){
          points.push([bounds.x+g.vertices[j][0]*bounds.w,y+g.vertices[j][1]*height]);
          ins.push([g.inTangents[j][0]*bounds.w,g.inTangents[j][1]*height]);outs.push([g.outTangents[j][0]*bounds.w,g.outTangents[j][1]*height]);
        }
        path="M"+points[0].join(",");for(j=1;j<=8;j++){
          var prev=(j-1)%8,next=j%8;
          path+="C"+[points[prev][0]+outs[prev][0],points[prev][1]+outs[prev][1],points[next][0]+ins[next][0],points[next][1]+ins[next][1],points[next][0],points[next][1]].join(",");
        }
        item.node.setAttribute("d",path+"Z");
      });
      maskText.forEach(function(el,i){var u=clamp((local-YaguMaskMotion.offset(id,i,2,0,v))/d),p=YaguMaskMotion.travel(id,u,v,out);el.setAttribute("transform","translate("+p[0]+","+p[1]+")");});
    }
    function cycleLength(){return num(v,"delay",0)+(mask?YaguMaskMotion.span(id,2,v):Math.max(.1,num(v,"dur",.8)))+1;}
    function tick(now){
      if(dead)return;
      if(paused&&mask&&!maskBounds)paint(cycleLength()-1);
      if(!paused){
        if(epoch===null)epoch=now-(scrubTime||0)*1000;
        var t=(now-epoch)/1000,length=frames?frames.duration+.8:cycleLength(),current=t%length;
        if(frames){var index=Math.min(frames.frames.length-1,Math.floor(current*frames.fps));var src=images[index].src;if(output.src!==src)output.src=src;}
        else paint(current);
        scrubTime=current;scrub.value=Math.round(clamp(current/(frames?frames.duration:cycleLength()-1))*1000);clock.textContent=current.toFixed(2)+" s";
      }else epoch=null;
      if(window.requestAnimationFrame)raf=window.requestAnimationFrame(tick);
    }
    function replay(){epoch=null;scrubTime=0;paused=false;pause.textContent="Pausar";scrub.value=0;paint(0);}
    function refresh(){revision++;frames=null;images=[];output.hidden=true;scene.hidden=false;scene.style.clipPath="";status.textContent=loading?"Renderizando en AE… los cambios requieren otro render.":"Simulación rápida · renderiza en AE para comprobar el resultado real";build();replay();if(reduced){paused=true;pause.textContent="Continuar";scrubTime=cycleLength()-1;scrub.value=1000;clock.textContent=scrubTime.toFixed(2)+" s";paint(scrubTime);}}
    function renderNative(){
      if(loading)return;
      if(!hasCEP){status.textContent="Abre la extensión en After Effects para renderizar fotogramas reales.";return;}
      if((id==="N"||id==="TM")&&v.mode==="out"){status.textContent="Elige IN para previsualizar este generador.";return;}
      loading=true;frames=null;images=[];output.hidden=true;scene.hidden=false;render.disabled=true;
      status.textContent="Renderizando en After Effects… puede tardar unos segundos.";
      var requested=revision;
      run("previewText",{kind:id,params:params(),renderFrames:true}).then(function(r){
        if(dead)return;
        if(!r.ok||!r.data||!r.data.frames){throw new Error(r.msg||"AE no devolvió fotogramas.");}
        if(requested!==revision){status.textContent="Los ajustes han cambiado. Vuelve a renderizar la preview.";return;}
        return Promise.all(r.data.frames.map(function(path){return new Promise(function(resolve,reject){var im=new Image();im.onload=function(){resolve(im);};im.onerror=function(){reject(new Error("No se pudo cargar un fotograma de AE."));};im.src=path+"?v="+Date.now();});})).then(function(loaded){
          if(dead||requested!==revision)return;images=loaded;frames=r.data;scene.hidden=true;output.hidden=false;status.textContent="Render real de AE · texto de muestra · "+Math.round(frames.fps)+" fps";replay();
        });
      }).catch(function(e){if(!dead)status.textContent=e.message;}).then(function(){loading=false;if(!dead)render.disabled=false;});
    }
    refresh();if(window.requestAnimationFrame)raf=window.requestAnimationFrame(tick);
    dispose=function(){dead=true;if(window.cancelAnimationFrame)window.cancelAnimationFrame(raf);images=[];};
    return {element:wrap,refresh:refresh,replay:replay};
  }
  return {create:create,stop:stop,formatNumber:formatNumber,timer:timer};
})();
