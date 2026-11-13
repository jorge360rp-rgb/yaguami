#include "json2.js"
/* Independent native After Effects test panel. ES3 host code. */
(function (scope) {
 var home = new File($.fileName).parent;
 function read(file) { if (!file.exists) throw Error('No existe: '+file.fsName);file.encoding='UTF-8';if(!file.open('r'))throw Error('No se puede abrir '+file.fsName);var s=file.read();file.close();return JSON.parse(s); }
 function rgb(s) {var v=s.match(/[\d.]+/g);return [Number(v[0])/255,Number(v[1])/255,Number(v[2])/255];}
 // M = R(u) * diag(s1,s2) * R(v). Three ordinary AE transforms preserve skew too.
 function affine(m) {
  var a=m[0],b=m[1],c=m[2],d=m[3],v=.5*Math.atan2(2*(a*c+b*d),a*a+b*b-c*c-d*d),cv=Math.cos(v),sv=Math.sin(v);
  var x=a*cv+c*sv,y=b*cv+d*sv,s1=Math.sqrt(x*x+y*y),s2=s1>1e-10?(a*d-b*c)/s1:0,u=s1>1e-10?Math.atan2(y,x):0;
  return {u:u*180/Math.PI,v:-v*180/Math.PI,s:[s1*100,s2*100]};
 }
 function keys(property,times,values) {property.setValuesAtTimes(times,values);for(var k=1;k<=property.numKeys;k++)property.setInterpolationTypeAtKey(k,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);}
 function nullLayer(comp,name){var n=comp.layers.addNull(comp.duration);n.name=name;n.transform.anchorPoint.setValue([0,0]);n.transform.position.setValue([0,0]);n.guideLayer=false;return n;}
 function build(data) {
  if(!app.project)app.newProject();var folder=app.project.items.addFolder('YMX Lab - '+data.name),duration=data.frames.length/data.fps;
  var comp=app.project.items.addComp('YMX - '+data.name,data.width,data.height,1,duration,data.fps);comp.parentFolder=folder;comp.bgColor=[.06,.06,.07];
  var records={},order=[],i,j,k,r,id,times=[];
  for(i=0;i<data.frames.length;i++){times.push(i/data.fps);for(j=0;j<data.frames[i].length;j++){r=data.frames[i][j];if(!records[r.id]){records[r.id]={piece:r.piece,z:r.z,frames:[]};order.push(r.id);}records[r.id].frames[i]=r;}}
  order.sort(function(a,b){return records[a].z-records[b].z;});
  for(k=0;k<order.length;k++){
   id=order[k];var rec=records[id],g=data.geometry[rec.piece],origin=g.origin;
   var piece=app.project.items.addComp(id,data.width,data.height,1,duration,data.fps);piece.parentFolder=folder;
   var glyphs=[],first=null;
   for(i=0;i<rec.frames.length;i++)if(rec.frames[i]){first=rec.frames[i];break;}
   for(j=0;j<g.chars.length;j++){
    var charLayer=piece.layers.addText(g.chars[j].text),doc=charLayer.property('ADBE Text Properties').property('ADBE Text Document').value;
    doc.font=data.font;doc.fontSize=data.fontSize;doc.applyFill=true;doc.fillColor=[1,1,1];doc.applyStroke=false;doc.tracking=0;
    charLayer.property('ADBE Text Properties').property('ADBE Text Document').setValue(doc);
    charLayer.transform.anchorPoint.setValue([0,0]);glyphs.push(charLayer);
    var positions=[],alphas=[],documents=[],previousColor='';
    for(i=0;i<data.frames.length;i++){
     r=rec.frames[i];var ch=r&&r.chars[j]?r.chars[j]:{x:0,y:0,opacity:0,color:'rgb(255,255,255)'};
     positions.push([g.x+g.chars[j].x+ch.x,g.y+g.chars[j].y+ch.y]);alphas.push(ch.opacity*100);
     if(ch.color!==previousColor){var td=charLayer.property('ADBE Text Properties').property('ADBE Text Document').value;td.fillColor=rgb(ch.color);charLayer.property('ADBE Text Properties').property('ADBE Text Document').setValueAtTime(times[i],td);previousColor=ch.color;}
    }
    keys(charLayer.transform.position,times,positions);keys(charLayer.transform.opacity,times,alphas);
   }
   var layer=comp.layers.add(piece);layer.name=id;layer.transform.anchorPoint.setValue([g.x+origin[0],g.y+origin[1]]);layer.transform.position.setValue([0,0]);
   var scaleNode=nullLayer(comp,id+' scale'),rotationNode=nullLayer(comp,id+' position');
   layer.parent=scaleNode;scaleNode.parent=rotationNode;
   // Setting a parent preserves world transforms; explicitly restore local identity.
   layer.transform.position.setValue([0,0]);scaleNode.transform.position.setValue([0,0]);
   var pos=[],rot=[],inner=[],scales=[],opacity=[],blurs=[];
   for(i=0;i<data.frames.length;i++){
    r=rec.frames[i]||{m:[1,0,0,1,0,0],opacity:0,blur:0};var decomposition=affine(r.m);
    pos.push([g.x+origin[0]+r.m[4],g.y+origin[1]+r.m[5]]);rot.push(decomposition.u);inner.push(decomposition.v);scales.push(decomposition.s);opacity.push(r.opacity*100);blurs.push(r.blur);
   }
   keys(rotationNode.transform.position,times,pos);keys(rotationNode.transform.rotation,times,rot);keys(scaleNode.transform.scale,times,scales);keys(layer.transform.rotation,times,inner);keys(layer.transform.opacity,times,opacity);
   var fx=layer.property('ADBE Effect Parade').addProperty('ADBE Gaussian Blur 2');keys(fx.property(1),times,blurs);
   scaleNode.shy=true;rotationNode.shy=true;status.text='Construyendo '+(k+1)+' / '+order.length;if(win instanceof Window)win.update();
  }
  comp.hideShyLayers=true;comp.comment='YMX AE Lab: native reconstruction at 60 fps. Validate font/filter parity before integration.';
  comp.openInViewer();return comp;
 }
 var win=(scope instanceof Panel)?scope:new Window('palette','Yaguanimix AE Lab — independiente',undefined,{resizeable:true});win.orientation='column';win.alignChildren='fill';
 win.add('statictext',undefined,'Prueba nativa · 33 presets · 60 fps');
 var list=win.add('dropdownlist',undefined,[]),manifest;
 try{manifest=read(new File(home.fsName+'/data/manifest.json'));for(var i=0;i<manifest.length;i++)list.add('item',manifest[i].pack+' / '+manifest[i].name);list.selection=0;}catch(error){alert(error.toString());return;}
 var apply=win.add('button',undefined,'Crear composición de prueba nativa');
 var reference=win.add('button',undefined,'Importar secuencia PNG de referencia');
 var status=win.add('statictext',undefined,'Instala primero la fuente GeistLab760.ttf.');status.characters=58;
 apply.onClick=function(){var begun=false;try{if(!list.selection)return;var data=read(new File(home.fsName+'/data/'+manifest[list.selection.index].file));app.beginUndoGroup('YMX AE Lab');begun=true;apply.enabled=false;build(data);status.text='Composición creada. Comparar con PNG antes de integrar.';}catch(error){alert('YMX Lab: '+error.toString()+'\nLínea: '+error.line);}finally{if(begun)app.endUndoGroup();apply.enabled=true;}};
 reference.onClick=function(){try{var file=File.openDialog('Selecciona el primer PNG de la secuencia');if(!file)return;var opts=new ImportOptions(file);opts.sequence=true;opts.forceAlphabetical=true;app.beginUndoGroup('YMX referencia');try{var footage=app.project.importFile(opts);footage.mainSource.conformFrameRate=60;if(footage.mainSource.hasAlpha)footage.mainSource.alphaMode=AlphaMode.STRAIGHT;var comp=app.project.items.addComp('YMX Referencia PNG',footage.width,footage.height,1,footage.duration,60);comp.layers.add(footage);comp.openInViewer();}finally{app.endUndoGroup();}}catch(error){alert(error.toString());}};
 win.onResizing=win.onResize=function(){this.layout.resize();};win.layout.layout(true);if(win instanceof Window){win.center();win.show();}
})(this);
