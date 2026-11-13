/* Yaguanimix Dynamic Grid 2.7.6 · CEP-compatible ES5 panel. */
(function (global) {
  "use strict";
  var presets = [
    ["classic","Classic 5×5",5,5],["columns","Columns",5,2],
    ["rows","Rows",2,5],["bento","Bento",4,3],
    ["dense","Dense 8×8",8,8],["mirror","Mirror cols",6,4]
  ];
  var motions = ["Breathe","Shutter","Collapse & Bloom","Wave","Accordion","Golden Split","Spotlight","Swing","Stairs","Rhythm Shift","Random"];
  var curves = ["Easy Ease","Smooth","Classic","Punchy","Bounce & overshoot","Linear",
    "Ease In","Ease Out","Ease In Out","Quad In","Quad Out","Quad In Out",
    "Cubic In","Cubic Out","Cubic In Out","Quart In","Quart Out","Quart In Out",
    "Quint In","Quint Out","Quint In Out","Sine In","Sine Out","Sine In Out",
    "Expo In","Expo Out","Expo In Out","Back In","Back Out","Back In Out","Elastic Out","Bounce Out"];
  var ctx, state, root, viewport, lastPreview = null, hoverTimer = null, hoverStart = 0, mouseDown = null;
  function makeArray(n) { var a=[],i; for(i=0;i<=n;i++)a.push(i/n); return a; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
  function layoutOf(c,r){return {x:makeArray(c),y:makeArray(r)};}
  function defaults(){return {
    tab:"grid",layoutPreset:"classic",cols:5,rows:5,layout:layoutOf(5,5),
    symmetry:"none",draw:"both",markers:true,gap:6,radius:10,lineWidth:2,
    cellOpacity:22,rim:0,cellColor:"#8b7bff",lineColor:"#d7ddff",markerColor:"#ffffff",
    backgroundMode:"solid",bg1:"#101827",bg2:"#6356ab",bgAngle:"horizontal",bgOpacity:100,
    motion:"Breathe",move:0.8,hold:0.3,easing:"Smooth",stagger:0.045,order:"row",loop:false,
    customFrames:[],chosenFrame:0,pickType:"cells",pickMode:"area",pickGesture:"single",
    attachMode:"reveal",align:"center",fit:"none",clip:false,picks:[]
  };}
  function h(t,p){var a=[t,p],i;for(i=2;i<arguments.length;i++)a.push(arguments[i]);return ctx.h.apply(null,a);}
  function label(text){return h("label",{},text);}
  function desc(text){return h("div",{class:"desc"},text);}
  function head(title,extra){return h("div",{class:"dg-card-title"},h("strong",{},title),extra||"");}
  function button(t,fn,cl){return h("button",{type:"button",class:"btn sm"+(cl?" "+cl:""),onclick:fn},t);}
  function select(k,options,onChange){return h("select",{value:state[k],onchange:function(e){state[k]=e.target.value;ctx.save();if(onChange)onChange();else render();}},options.map(function(o){return h("option",{value:o[0],selected:String(state[k])===String(o[0])},o[1]);}));}
  function toggle(k,title){return h("label",{class:"dg-switch"},h("input",{type:"checkbox",checked:!!state[k],onchange:function(e){state[k]=!!e.target.checked;ctx.save();preview();}}),h("span",{},title));}
  function range(k,title,min,max,step,suffix,onCommit){
    var value=h("output",{},String(state[k])+ (suffix||""));
    var slider=h("input",{type:"range",min:min,max:max,step:step,value:state[k],oninput:function(e){state[k]=+e.target.value;value.textContent=state[k]+(suffix||"");ctx.save();preview();if(onCommit)onCommit();}});
    return h("div",{class:"dg-range"},h("div",{class:"dg-range-cap"},h("label",{},title),value),slider);
  }
  function color(k,title){return h("label",{class:"dg-color"},h("span",{},title),h("input",{type:"color",value:state[k],oninput:function(e){state[k]=e.target.value;ctx.save();preview();}}));}
  function field(k,title,min,max,step){return h("label",{class:"dg-small-field"},h("span",{},title),h("input",{type:"number",value:state[k],min:min,max:max,step:step,onchange:function(e){state[k]=clamp(+e.target.value||0,min,max);if(k==="cols"||k==="rows"){state.layout=layoutOf(state.cols,state.rows);state.layoutPreset="custom";state.customFrames=[];state.picks=[];}ctx.save();render();}}));}
  function segment(k,opts){return h("div",{class:"dg-segments"},opts.map(function(o){return h("button",{class:state[k]===o[0]?"on":"",type:"button",onclick:function(){state[k]=o[0];ctx.save();render();}},o[1]);}));}
  function call(action,arg){return ctx.run(action,arg);}
  function syncFromAE(){ctx.jsx("dgStatus",{}).then(function(r){
    if(!r.ok){ctx.toast(r.msg,true);return;}
    if(!r.data){ctx.toast("Esta composición todavía no tiene Dynamic Grid.",true);return;}
    var cfg=r.data,fields=["cols","rows","gap","radius","lineWidth","cellOpacity","rim","cellColor","lineColor","markerColor","markers","draw"],i;
    for(i=0;i<fields.length;i++)if(cfg[fields[i]]!==undefined)state[fields[i]]=cfg[fields[i]];
    state.layout=clone(cfg.layout);state.layoutPreset="custom";state.customFrames=[];state.picks=[];
    ctx.save();render();ctx.toast("Grid de After Effects cargado en el panel.");
  });}
  function preset(id){
    var p=presets.filter(function(v){return v[0]===id;})[0]||presets[0];
    state.layoutPreset=p[0];state.cols=p[2];state.rows=p[3];state.layout=layoutOf(p[2],p[3]);
    if(id==="bento"){state.layout.x=[0,.16,.44,.76,1];state.layout.y=[0,.22,.67,1];}
    if(id==="mirror"){state.layout.x=[0,.13,.31,.5,.69,.87,1];state.symmetry="vertical";}
    state.customFrames=[];state.chosenFrame=0;state.picks=[];ctx.save();render();
  }
  function validLayout(L){
    return L&&L.x&&L.y&&L.x.length===state.cols+1&&L.y.length===state.rows+1;
  }
  function fixState(){
    var d=defaults(),k;
    if(!ctx.S.dynamicGrid||typeof ctx.S.dynamicGrid!=="object")ctx.S.dynamicGrid=d;
    state=ctx.S.dynamicGrid;
    for(k in d)if(Object.prototype.hasOwnProperty.call(d,k)&&state[k]===undefined)state[k]=clone(d[k]);
    state.cols=clamp(+state.cols||5,1,8);state.rows=clamp(+state.rows||5,1,8);
    if(!validLayout(state.layout))state.layout=layoutOf(state.cols,state.rows);
    if(!Array.isArray(state.picks))state.picks=[];
    if(state.pickGesture==="single"&&state.pickType==="cells"&&state.picks.length>1)state.picks=[];
    if(!Array.isArray(state.customFrames))state.customFrames=[];
  }
  function uiTab(t,labelText){return h("button",{type:"button",class:state.tab===t?"on":"",onclick:function(){mouseDown=null;state.tab=t;ctx.save();render();}},labelText);}
  function options(names){return names.map(function(s){return [s,s];});}
  function footerButtons(items){return h("div",{class:"dg-actions"},items);}
  function payload(){return {cols:state.cols,rows:state.rows,layout:clone(state.layout),draw:state.draw,markers:state.markers,
    gap:state.gap,radius:state.radius,lineWidth:state.lineWidth,cellOpacity:state.cellOpacity,rim:state.rim,
    cellColor:state.cellColor,lineColor:state.lineColor,markerColor:state.markerColor};}
  function render(){
    if(!root)return;
    root.innerHTML="";
    root.appendChild(h("div",{class:"dg-header"},
      h("div",{class:"dg-kicker"},"MOTION SYSTEM / 02"),
      h("h2",{},"Dynamic Grid"),
      desc("Cuadrículas editables, layouts animados y capas ancladas a celdas.")));
    root.appendChild(h("div",{class:"dg-tabbar"},
      uiTab("grid","Grid"),uiTab("animate","Animate"),uiTab("backdrop","Backdrop"),uiTab("attach","Attach")));
    var stage=h("div",{class:"dg-stage"},
      h("div",{class:"dg-stage-toolbar"},h("span",{},state.cols+" × "+state.rows+" · "+state.layoutPreset),
        h("span",{},state.tab==="attach"?state.picks.length+" selección(es)":"Arrastra los divisores")));
    viewport=h("div",{class:"dg-preview-wrap"}); stage.appendChild(viewport);root.appendChild(stage);
    preview();
    if(state.tab==="grid")renderGrid();
    if(state.tab==="animate")renderAnimate();
    if(state.tab==="backdrop")renderBackdrop();
    if(state.tab==="attach")renderAttach();
  }
  function renderGrid(){
    var c=h("div",{class:"card dg-card"},head("Layouts rápidos"),h("div",{class:"dg-preset-list"},presets.map(function(p){
      return h("button",{class:state.layoutPreset===p[0]?"on":"",onclick:function(){preset(p[0]);}},p[1]);
    })));
    root.appendChild(c);
    c=h("div",{class:"card dg-card"},head("Construcción"),
      h("div",{class:"dg-pair"},field("cols","Divisores V (columnas)",1,8,1),field("rows","Divisores H (filas)",1,8,1)),
      h("div",{class:"dg-line"},label("Simetría"),select("symmetry",[["none","Ninguna"],["vertical","Vertical"],["horizontal","Horizontal"],["central","Central"]],render)),
      h("div",{class:"dg-line"},label("Dibujar"),select("draw",[["both","Celdas + líneas"],["cells","Solo celdas"],["lines","Solo líneas"]],preview)),
      toggle("markers","Marcadores en intersecciones"));
    root.appendChild(c);
    root.appendChild(h("div",{class:"card dg-card"},head("Estilo"),
      h("div",{class:"dg-pair"},range("gap","Gap",0,50,1," px"),range("radius","Roundness",0,90,1," px")),
      h("div",{class:"dg-pair"},range("lineWidth","Peso línea",.5,12,.5," px"),range("cellOpacity","Opacidad celda",0,100,1,"%")),
      range("rim","Borde celda",0,12,.5," px"),
      h("div",{class:"dg-pair dg-colors"},color("cellColor","Celdas"),color("lineColor","Líneas"),color("markerColor","Marcadores"))));
    root.appendChild(footerButtons([
      button("Crear / reconstruir grid",function(){call("dgCreate",payload());},"pri"),
      button("Aplicar disposición",function(){call("dgSetLayout",payload());},"pri"),
      button("Aplicar estilo",function(){call("dgStyle",payload());}),
      button("Leer grid de AE",syncFromAE),
      button("Eliminar grid",function(){call("dgRemove",{});},"danger")
    ]));
    root.appendChild(desc("Primero crea el grid. Si arrastras divisores, pulsa «Aplicar disposición» para actualizar las formas en After Effects sin reconstruirlas. En un grid animado se añade un keyframe al cabezal; «Aplicar estilo» conserva los anteriores. Cambiar filas, modo de dibujo o marcadores requiere «Reconstruir»."));
  }
  function renderAnimate(){
    root.appendChild(h("div",{class:"card dg-card"},head("Movimiento por layouts"),
      h("div",{class:"dg-motion-list"},motions.map(function(m){return h("button",{type:"button",class:state.motion===m?"on":"",title:"Pasa el cursor para previsualizar",onmouseenter:function(){startHover(m);},onmouseleave:stopHover,onclick:function(){stopHover();state.motion=m;ctx.save();render();}},m);})),
      desc("Pasa el cursor sobre un preset para ver su comportamiento. Seleccionarlo no altera la composición.")));
    root.appendChild(h("div",{class:"card dg-card"},head("Timing"),
      h("div",{class:"dg-pair"},range("move","Move in",.1,6,.05," s"),range("hold","Hold",0,5,.05," s")),
      h("div",{class:"dg-line"},label("Easing"),select("easing",options(curves))),
      h("div",{class:"dg-pair"},range("stagger","Stagger",0,.5,.005," s"),
        h("div",{class:"dg-mini"},label("Orden"),select("order",[["row","Filas"],["column","Columnas"],["reverse","Inverso"],["center","Desde centro"],["random","Aleatorio"]]))),
      toggle("loop","Repetición en bucle")));
    var frames=h("div",{class:"dg-frames"});
    function showFrames(){frames.innerHTML="";state.customFrames.forEach(function(f,i){frames.appendChild(
      h("button",{type:"button",class:"dg-frame"+(state.chosenFrame===i?" on":""),onclick:function(){state.chosenFrame=i;state.layout=clone(f.layout);ctx.save();render();}},
        h("strong",{},"Layout "+(i+1)),h("span",{},"Move "+f.move+"s · Hold "+f.hold+"s")));
    });}
    showFrames();
    root.appendChild(h("div",{class:"card dg-card"},head("Keyframes personalizados"),
      desc("Ajusta los divisores arrastrando en la vista previa; guarda cada disposición como un fotograma de layout."),frames,
      footerButtons([
        button("+ Guardar layout",function(){state.customFrames.push({layout:clone(state.layout),move:state.move,hold:state.hold});state.chosenFrame=state.customFrames.length-1;ctx.save();showFrames();},"pri"),
        button("Actualizar seleccionado",function(){if(!state.customFrames.length)return;state.customFrames[state.chosenFrame]={layout:clone(state.layout),move:state.move,hold:state.hold};ctx.save();showFrames();}),
        button("− Quitar seleccionado",function(){state.customFrames.splice(state.chosenFrame,1);state.chosenFrame=clamp(state.chosenFrame,0,Math.max(0,state.customFrames.length-1));ctx.save();showFrames();})])));
    root.appendChild(footerButtons([
      button("Animar preset",function(){call("dgAnimate",animatePayload(false));},"pri"),
      button("Animar keyframes",function(){if(!state.customFrames.length)return ctx.toast("Guarda al menos dos layouts para animarlos.",true);if(state.customFrames.length<2)return ctx.toast("Se necesitan al menos dos layouts.",true);call("dgAnimate",animatePayload(true));}),
      button("Extender al cabezal",function(){call("dgAnimate",animatePayload(state.customFrames.length>=2,true));}),
      button("Quitar animación",function(){call("dgClearAnimation",{});},"danger")
    ]));
    root.appendChild(desc("Anima la geometría de cada celda y divisor en el timeline. Extender conserva los keyframes anteriores. Los keyframes personalizados deben tener igual número de filas y columnas."));
  }
  function animatePayload(custom,extend){var a=payload();a.motion=state.motion;a.move=state.move;a.hold=state.hold;a.easing=state.easing;
    a.stagger=state.stagger;a.order=state.order;a.loop=state.loop;a.custom=!!custom;a.extend=!!extend;
    a.frames=custom?clone(state.customFrames):[];return a;}
  function renderBackdrop(){
    root.appendChild(h("div",{class:"card dg-card"},head("Fondo del grid"),
      segment("backgroundMode",[["solid","Sólido"],["gradient","Gradiente"],["layer","Capa"],["file","Archivo"]]),
      h("div",{class:"dg-pair dg-colors"},color("bg1",state.backgroundMode==="gradient"?"Color 1":"Color"),
        state.backgroundMode==="gradient"?color("bg2","Color 2"):""),
      state.backgroundMode==="gradient"?h("div",{class:"dg-line"},label("Dirección"),select("bgAngle",[["horizontal","Horizontal"],["vertical","Vertical"],["diagonal","Diagonal"]])):"",
      range("bgOpacity","Opacidad",0,100,1,"%"),
      desc(state.backgroundMode==="file"?"After Effects abrirá un selector para imagen o vídeo.":state.backgroundMode==="layer"?"Selecciona una capa en la composición; se creará una copia al fondo.":"El fondo se coloca detrás del grid y de las capas de la composición.")));
    root.appendChild(footerButtons([
      button("Crear / actualizar fondo",function(){call("dgBackdrop",{mode:state.backgroundMode,color1:state.bg1,color2:state.bg2,direction:state.bgAngle,opacity:state.bgOpacity});},"pri"),
      button("Quitar fondo",function(){call("dgBackdropRemove",{});},"danger")
    ]));
  }
  function renderAttach(){
    var reveal=state.attachMode==="reveal",follow=state.attachMode==="follow";
    root.appendChild(h("div",{class:"card dg-card"},head("Revelar imagen / anclar capas"),
      h("div",{class:"dg-line"},label("Acción"),select("attachMode",[["reveal","Revelar fondo (imagen fija)"],["follow","Mover imagen con la celda (sin reescalar)"],["pin","Centrar imagen en la celda"]],render)),
      desc(reveal?"La imagen no se mueve; únicamente la máscara descubre una parte del fondo.":
        follow?"Imagen y máscara se desplazan JUNTAS. Mantiene el encuadre y la escala que tenga tu imagen al pulsar el botón.":
        "Centra la imagen en la celda y, si quieres, cambia la escala para cubrirla."),
      h("div",{class:"dg-line"},label("Seleccionar"),select("pickType",[["cells","Celdas"],["lines","Líneas"],["dots","Intersecciones"]],function(){mouseDown=null;state.picks=[];ctx.save();render();})),
      h("div",{class:"dg-line"},label("Gesto"),select("pickGesture",[["single","Una sola celda"],["multi","Varias con clics"],["block","Bloque arrastrando"]],function(){mouseDown=null;state.picks=[];ctx.save();render();})),
      h("div",{class:"dg-line"},label("Distribución"),select("pickMode",[["area","One area · un bloque"],["each","One each · una por capa"]])),
      (!reveal&&!follow)?h("div",{class:"dg-line"},label("Alineación"),select("align",[["center","Centro"],["top-left","Arriba izquierda"],["top","Arriba"],["bottom","Abajo"],["bottom-right","Abajo derecha"]])):"",
      (!reveal&&!follow)?h("div",{class:"dg-line"},label("Ajuste"),select("fit",[["none","Solo anclar"],["cover","Cubrir celda"],["contain","Contener en celda"]])):"",
      (!reveal&&!follow)?toggle("clip","Recortar a las celdas (capas 2D)"):"",
      desc(state.pickGesture==="single"?"Haz clic en el cuadro deseado: se reemplazará cualquier selección anterior.":
        state.pickGesture==="multi"?"Cada clic añade o quita una celda sin arrastrar.":
        "Haz clic y arrastra desde una celda hasta otra para seleccionar un bloque rectangular."),
      h("div",{class:"dg-picks-list"},state.picks.length?state.picks.join(" · "):"Sin destinos seleccionados")));
    root.appendChild(footerButtons([
      button(reveal?"Crear máscara de revelado":follow?"Revelar y mover imagen":"Anclar capas seleccionadas",function(){
        if(!state.picks.length)return ctx.toast("Selecciona una celda en la vista previa.",true);
        if((reveal||follow)&&state.pickType!=="cells")return ctx.toast("Para revelar imagen debes elegir celdas.",true);
        call("dgAttach",{cols:state.cols,rows:state.rows,targets:clone(state.picks),mode:state.pickMode,
          align:state.align,fit:state.fit,clip:(reveal||follow)?true:state.clip,reveal:reveal,follow:follow});
      },"pri"),
      button("Desvincular / quitar máscara",function(){call("dgDetach",{});}),
      button("Reparar vínculo antiguo",function(){call("dgRepairAttach",{});}),
      button("Comprobar vínculo en AE",function(){ctx.jsx("dgDiagnoseAttach",{}).then(function(r){
        var el=root.querySelector(".dg-diagnostic");if(el)el.textContent=r.ok&&r.data&&r.data.report?r.data.report:r.msg;
        ctx.toast(r.ok?"Diagnóstico de AE listo":r.msg,!r.ok);
      });}),
      button("Limpiar selección",function(){mouseDown=null;state.picks=[];ctx.save();refreshPicks();})
    ]));
    root.appendChild(h("div",{class:"desc dg-diagnostic"},"Si la imagen no acompaña a la celda, selecciona la capa y pulsa «Comprobar vínculo en AE». El informe mostrará errores de expresiones y cambios de posición."));
    root.appendChild(desc(reveal?"Selecciona una imagen o vídeo en el timeline. La máscara deja la imagen fija; coloca un sólido negro debajo para ocultar el exterior.":
      follow?"Selecciona la imagen en la línea de tiempo. Conserva su escala y posición al vincular, y después suma el desplazamiento de la celda. Si la celda crece simétricamente pero su centro no cambia, la imagen tampoco se desplaza.":
      "La imagen se coloca en el centro real de la celda, compensando escala, ancla y rotación. Cubrir/Contener ajustan la escala uniformemente. Activa Recortar para que solo aparezca dentro del cuadro."));
  }
  function svgEl(tag,attrs){var e=document.createElementNS("http://www.w3.org/2000/svg",tag),k;for(k in attrs)if(attrs.hasOwnProperty(k))e.setAttribute(k,attrs[k]);return e;}
  function pick(id){
    var old=state.picks.indexOf(id);
    if(old>=0)state.picks.splice(old,1);else state.picks.push(id);
    ctx.save();preview();refreshPicks();
  }
  function chooseCell(id,r,c,ev){
    if(state.tab!=="attach"||state.pickType!=="cells")return;
    if(ev.button!==undefined&&ev.button!==0)return;
    if(ev.preventDefault)ev.preventDefault();
    if(ev.stopPropagation)ev.stopPropagation();
    if(state.pickGesture==="multi"){
      mouseDown=null;
      var i=state.picks.indexOf(id);if(i>=0)state.picks.splice(i,1);else state.picks.push(id);
    }else if(state.pickGesture==="block"){
      state.picks=[id];mouseDown={type:"cellBlock",row:r,col:c,last:id};
    }else{
      mouseDown=null;
      state.picks=[id];
    }
    ctx.save();refreshPicks();
  }
  function refreshPicks(){
    var a=root.querySelector(".dg-picks-list"),i,cell,id,on,cells,caption;
    if(a)a.textContent=state.picks.length?state.picks.join(" · "):"Sin destinos seleccionados";
    cells=viewport?viewport.querySelectorAll("[data-dg-cell]"):[];
    for(i=0;i<cells.length;i++){
      cell=cells[i];id=cell.getAttribute("data-dg-cell");on=state.tab==="attach"&&state.picks.indexOf(id)>=0;
      cell.setAttribute("fill",on?"#8b7bff":state.cellColor);
      cell.setAttribute("fill-opacity",on?".65":(state.draw==="lines"?0:state.cellOpacity/100));
      cell.setAttribute("stroke",on?"#ffffff":state.lineColor);
      cell.setAttribute("stroke-width",on?"1.5":(state.rim?Math.max(.5,state.rim/3):.01));
      cell.setAttribute("stroke-opacity",on?"1":(state.draw!=="lines"&&state.rim?".8":"0"));
    }
    caption=root.querySelector(".dg-stage-toolbar span:last-child");
    if(caption&&state.tab==="attach")caption.textContent=state.picks.length+" selección(es)";
  }
  function point(ev){var svg=viewport.querySelector("svg"),rect=svg.getBoundingClientRect();
    return {x:clamp((ev.clientX-rect.left)/Math.max(1,rect.width),0,1),y:clamp((ev.clientY-rect.top)/Math.max(1,rect.height),0,1)};
  }
  function cellAt(p){var r,c;for(c=0;c<state.cols;c++)if(p.x<state.layout.x[c+1])break;
    for(r=0;r<state.rows;r++)if(p.y<state.layout.y[r+1])break;
    return {row:clamp(r,0,state.rows-1),col:clamp(c,0,state.cols-1)};
  }
  function setDivider(axis,index,value){
    var arr=state.layout[axis],n=arr.length-1,min=.035;
    arr[index]=clamp(value,arr[index-1]+min,arr[index+1]-min);
    var symmetry=state.symmetry;
    if((axis==="x"&&(symmetry==="vertical"||symmetry==="central"))||(axis==="y"&&(symmetry==="horizontal"||symmetry==="central"))){
      var other=n-index;if(other!==index&&other>0&&other<n)arr[other]=clamp(1-arr[index],arr[other-1]+min,arr[other+1]-min);
    }
    state.layoutPreset="custom";ctx.save();preview();
  }
  function preview(L){
    if(!viewport)return;
    L=L||state.layout;viewport.innerHTML="";
    var svg=svgEl("svg",{viewBox:"0 0 600 350",role:"img","aria-label":"Vista previa interactiva de la cuadrícula"}),
      defs=svgEl("defs",{}),lg=svgEl("linearGradient",{id:"dg-gradient",x1:"0%",y1:"0%",x2:state.bgAngle==="vertical"?"0%":"100%",y2:state.bgAngle==="horizontal"?"0%":"100%"}),
      i,j,w=600,hh=350,gap=state.gap*600/1920,rx=state.radius*600/1920;
    lg.appendChild(svgEl("stop",{offset:"0%","stop-color":state.bg1}));lg.appendChild(svgEl("stop",{offset:"100%","stop-color":state.bg2}));defs.appendChild(lg);svg.appendChild(defs);
    svg.appendChild(svgEl("rect",{x:0,y:0,width:w,height:hh,fill:state.backgroundMode==="gradient"?"url(#dg-gradient)":(state.backgroundMode==="solid"?state.bg1:"#161d30")}));
    var lines=svgEl("g",{}),cells=svgEl("g",{}),hit=svgEl("g",{}),marks=svgEl("g",{});
    for(j=0;j<state.rows;j++)for(i=0;i<state.cols;i++){
      (function(r,c){
        var id="c:"+r+":"+c,selected=state.tab==="attach"&&state.picks.indexOf(id)>=0;
        var x=L.x[c]*w+gap/2,y=L.y[r]*hh+gap/2,ww=(L.x[c+1]-L.x[c])*w-gap,hh2=(L.y[r+1]-L.y[r])*hh-gap;
        var cell=svgEl("rect",{"data-dg-cell":id,x:x,y:y,width:Math.max(1,ww),height:Math.max(1,hh2),rx:rx,
          fill:selected?"#8b7bff":state.cellColor,"fill-opacity":selected?".65":(state.draw==="lines"?0:state.cellOpacity/100),
          stroke:selected?"#ffffff":state.lineColor,"stroke-width":state.rim?Math.max(.5,state.rim/3):.01,"stroke-opacity":(state.draw!=="lines"&&state.rim)?".8":"0"});
        cell.style.cursor=state.tab==="attach"?"crosshair":"default";
        if(state.tab==="attach"&&state.pickType==="cells")cell.addEventListener("mousedown",function(ev){chooseCell(id,r,c,ev);});
        cells.appendChild(cell);
      })(j,i);
    }
    if(state.draw!=="cells"||(state.tab==="attach"&&state.pickType==="lines")){
      for(i=1;i<state.cols;i++)(function(q){
        var pos=L.x[q]*w,id="v:"+q,selected=state.picks.indexOf(id)>=0;
        lines.appendChild(svgEl("line",{x1:pos,y1:0,x2:pos,y2:hh,stroke:selected?"#fff":state.lineColor,"stroke-width":selected?4:Math.max(.5,state.lineWidth/1.8),"stroke-opacity":state.draw==="cells"&&!selected?0:.7}));
        var sl=svgEl("line",{x1:pos,y1:0,x2:pos,y2:hh,stroke:"transparent","stroke-width":13});sl.style.cursor=state.tab==="attach"?"pointer":"col-resize";
        if(state.tab!=="attach"||state.pickType==="lines"){
          sl.addEventListener("mousedown",function(ev){ev.preventDefault();if(state.tab==="grid"||state.tab==="animate")mouseDown={axis:"x",index:q};else if(state.pickType==="lines")pick(id);});hit.appendChild(sl);
        }
      })(i);
      for(j=1;j<state.rows;j++)(function(q){
        var pos=L.y[q]*hh,id="h:"+q,selected=state.picks.indexOf(id)>=0;
        lines.appendChild(svgEl("line",{x1:0,y1:pos,x2:w,y2:pos,stroke:selected?"#fff":state.lineColor,"stroke-width":selected?4:Math.max(.5,state.lineWidth/1.8),"stroke-opacity":state.draw==="cells"&&!selected?0:.7}));
        var sl=svgEl("line",{x1:0,y1:pos,x2:w,y2:pos,stroke:"transparent","stroke-width":13});sl.style.cursor=state.tab==="attach"?"pointer":"row-resize";
        if(state.tab!=="attach"||state.pickType==="lines"){
          sl.addEventListener("mousedown",function(ev){ev.preventDefault();if(state.tab==="grid"||state.tab==="animate")mouseDown={axis:"y",index:q};else if(state.pickType==="lines")pick(id);});hit.appendChild(sl);
        }
      })(j);
    }
    if(state.markers || (state.tab==="attach"&&state.pickType==="dots"))for(i=1;i<state.cols;i++)for(j=1;j<state.rows;j++)(function(c,r){
      var x=L.x[c]*w,y=L.y[r]*hh,id="d:"+r+":"+c,selected=state.picks.indexOf(id)>=0;
      var el=svgEl("circle",{cx:x,cy:y,r:selected?5.2:2.7,fill:selected?"#8b7bff":state.markerColor,stroke:selected?"#fff":"none","stroke-width":1.4});
      el.style.cursor=state.tab==="attach"&&state.pickType==="dots"?"pointer":"default";
      if(state.tab==="attach"&&state.pickType==="dots")el.addEventListener("mousedown",function(ev){ev.preventDefault();pick(id);});
      else el.style.pointerEvents="none";
      marks.appendChild(el);
    })(i,j);
    svg.appendChild(cells);svg.appendChild(lines);svg.appendChild(hit);svg.appendChild(marks);
    viewport.appendChild(svg);
  }
  function motionWeights(name,n,axis,phase){
    var a=[],i,x,shift;
    for(i=0;i<n;i++){
      x=(i+.5)/n;shift=(phase||0);
      if(name==="Breathe")a.push(1+.48*Math.sin(x*Math.PI)*shift);
      else if(name==="Shutter")a.push(1+((i%2)?-.8:.8)*shift);
      else if(name==="Collapse & Bloom")a.push(1+(Math.abs(x-.5)-.25)*3*shift);
      else if(name==="Wave")a.push(1+.85*Math.sin(i*1.6+(axis==="x"?1:2))*shift);
      else if(name==="Accordion")a.push(1+((i%2)?1.1:-.5)*shift);
      else if(name==="Golden Split")a.push(1+(x<.5?1.3:-.35)*shift);
      else if(name==="Spotlight")a.push(1+(i===Math.floor(n/2)?2.6:-.4)*shift);
      else if(name==="Swing")a.push(1+.8*Math.cos(i*2.2)*shift);
      else if(name==="Stairs")a.push(1+(.8-x)*shift);
      else if(name==="Rhythm Shift")a.push(1+([.8,-.6,.4,-.4][i%4])*shift);
      else if(name==="Random")a.push(1+(.8*Math.sin(i*23.11+axis.length*5))*shift);
      else a.push(1);
    }
    var total=a.reduce(function(p,q){return p+Math.max(.08,q);},0),out=[0],acc=0;
    a.forEach(function(q){acc+=Math.max(.08,q)/total;out.push(clamp(acc,0,1));});out[n]=1;return out;
  }
  function startHover(m){stopHover();hoverStart=Date.now();function step(){if(!viewport||state.tab!=="animate")return;
    var p=.5+.5*Math.sin((Date.now()-hoverStart)/450),x=motionWeights(m,state.cols,"x",p),y=motionWeights(m,state.rows,"y",p);
    preview({x:x,y:y});hoverTimer=setTimeout(step,45);
  }step();}
  function stopHover(){if(hoverTimer){clearTimeout(hoverTimer);hoverTimer=null;preview();}}
  function renderPage(el,context){ctx=context;root=el;fixState();render();}
  document.addEventListener("mousemove",function(ev){if(!mouseDown||!viewport)return;
    if(mouseDown.axis){var p=point(ev);setDivider(mouseDown.axis,mouseDown.index,p[mouseDown.axis]);}
    else if(mouseDown.type==="cellBlock"&&state.tab==="attach"&&state.pickType==="cells"){
      var c=cellAt(point(ev)),id="c:"+c.row+":"+c.col,r0,r1,c0,c1,rr,cc,arr=[];
      if(mouseDown.last!==id){
        mouseDown.last=id;
        r0=Math.min(mouseDown.row,c.row);r1=Math.max(mouseDown.row,c.row);
        c0=Math.min(mouseDown.col,c.col);c1=Math.max(mouseDown.col,c.col);
        for(rr=r0;rr<=r1;rr++)for(cc=c0;cc<=c1;cc++)arr.push("c:"+rr+":"+cc);
        state.picks=arr;refreshPicks();
      }
    }
  });
  document.addEventListener("mouseup",function(){if(mouseDown&&ctx)ctx.save();mouseDown=null;});
  global.YaguanimixDynamicGrid={render:renderPage,presets:presets,motions:motions,curves:curves};
})(window);
