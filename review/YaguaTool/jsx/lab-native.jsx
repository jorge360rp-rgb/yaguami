// Native adapter based on the user's AE Lab v0.1; source poses are sampled unchanged at 60 fps.
var YaguaNativeLab=(function(){
 function rgb(s) {var v=s.match(/[\d.]+/g);return [Number(v[0])/255,Number(v[1])/255,Number(v[2])/255];}
 // M = R(u) * diag(s1,s2) * R(v). Three ordinary AE transforms preserve skew too.
 function affine(m) {
  var a=m[0],b=m[1],c=m[2],d=m[3],v=.5*Math.atan2(2*(a*c+b*d),a*a+b*b-c*c-d*d),cv=Math.cos(v),sv=Math.sin(v);
  var x=a*cv+c*sv,y=b*cv+d*sv,s1=Math.sqrt(x*x+y*y),s2=s1>1e-10?(a*d-b*c)/s1:0,u=s1>1e-10?Math.atan2(y,x):0;
  return {u:u*180/Math.PI,v:-v*180/Math.PI,s:[s1*100,s2*100]};
 }
 function keys(property,times,values) {property.setValuesAtTimes(times,values);for(var k=1;k<=property.numKeys;k++)property.setInterpolationTypeAtKey(k,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);}
 function nullLayer(comp,name){var n=comp.layers.addNull(comp.duration);n.name=name;n.transform.anchorPoint.setValue([0,0]);n.transform.position.setValue([0,0]);n.guideLayer=false;return n;}
 function build(data,options) {
  options=options||{};var receiving=app.project.activeItem;
  if(!app.project)app.newProject();var folder=app.project.items.addFolder('YaguaTool Lab - '+data.name),duration=data.frames.length/data.fps;
  var comp=app.project.items.addComp('YaguaTool - '+data.name,data.width,data.height,1,duration,data.fps);comp.parentFolder=folder;comp.bgColor=[.06,.06,.07];
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
    var actualFont=charLayer.property('ADBE Text Properties').property('ADBE Text Document').value;
    if(actualFont.font!==data.font)throw Error('Instala primero GeistLab760.ttf desde assets/fonts. AE ha sustituido la fuente.');
    try{if(actualFont.fontObject&&actualFont.fontObject.isSubstitute)throw Error('Instala primero GeistLab760.ttf desde assets/fonts.');}catch(fontError){if(String(fontError).indexOf('Instala primero')>=0)throw fontError;}
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
   if(first&&first.blend==='ADD')try{layer.blendingMode=BlendingMode.ADD;}catch(ignoreBlend){}
   scaleNode.shy=true;rotationNode.shy=true;
  }
  comp.hideShyLayers=true;comp.comment='YaguaTool Motion Lab v0.9 | '+JSON.stringify({parameters:data.parameters,sequence:data.sequence,holdMs:data.holdMs,sourceEngine:data.sourceEngine||'AE Lab v0.1'});
  if(options.cacheOnly)return comp;
  if(options.editable)return YaguaLabRig.create(comp,data,options,receiving);
  if(options.insert){if(!(receiving instanceof CompItem))throw Error("Abre una composición antes de insertar la animación.");var inserted=receiving.layers.add(comp);inserted.startTime=receiving.time;inserted.name="YaguaTool Lab · "+data.name;receiving.openInViewer();}else comp.openInViewer();return comp;
 }

 function safeBuild(data,options){
  var before={},i,original=app.project.activeItem;for(i=1;i<=app.project.numItems;i++)before[app.project.item(i).id]=true;
  try{return build(data,options);}catch(e){for(i=app.project.numItems;i>=1;i--)if(!before[app.project.item(i).id])try{app.project.item(i).remove();}catch(ignoreRemove){}if(original instanceof CompItem)original.openInViewer();throw e;}
 }
 function validate(data){
  if(!data||data.schema!==1||!data.frames||!data.frames.length||data.fps!==60||!data.geometry)throw Error("Formato de animación nativa no válido.");
  if(!data.text||!String(data.text).replace(/\s/g,""))throw Error("Escribe algún carácter visible.");
 }
 Animix.api.ytLabBuild=function(o){
  if(o.insert&&!(app.project.activeItem instanceof CompItem))throw Error("Abre una composición antes de insertar.");
  var file=new File(o.path),data=YaguaHost.read(file),created,before={},i;
  validate(data);for(i=1;i<=app.project.numItems;i++)before[app.project.item(i).id]=true;
  try{created=build(data,o);return{msg:"Animación creada a 60 fps: "+created.name,data:{id:created.id,name:created.name,frames:data.frames.length}};}
  catch(e){for(i=app.project.numItems;i>=1;i--)if(!before[app.project.item(i).id])try{app.project.item(i).remove();}catch(ignoreRemove){}throw e;}
  finally{if(o.temporary&&file.fsName.indexOf(Folder.temp.fsName)===0&&file.name.indexOf("YaguaTool_Lab_")===0)try{file.remove();}catch(ignoreTemp){}}
 };
 Animix.api.ytLabDefault=function(o){
  if(!/^pack-[a-z0-9-]+$/.test(o.id))throw Error("Preset no válido.");
  var file=new File(YaguaHost.root+"/lab-data/"+o.id+".json"),data=YaguaHost.read(file);validate(data);var c=safeBuild(data,{editable:true});
  return{msg:"Original nativo AE Lab v0.1 creado: "+c.name,data:{id:c.id}};
 };
 return{build:build,affine:affine,safeBuild:safeBuild};
})();
