(function(){
 var api=Animix.api;
 function validSource(item){return (item instanceof CompItem||item instanceof FootageItem)&&item.width>0&&item.height>0;}
 function sources(o){var out=[],i,item,c=app.project.activeItem,ls=(c instanceof CompItem)?c.selectedLayers:[],selection=app.project.selection;
  if(o.sourceIds&&o.sourceIds.length){for(i=0;i<o.sourceIds.length;i++){item=app.project.itemByID(o.sourceIds[i]);if(!item||!validSource(item))throw Error("Vuelve a cargar la selección de fuentes de este proyecto.");out.push(item);}}
  else if(ls.length){for(i=0;i<ls.length;i++)if(validSource(ls[i].source))out.push(ls[i].source);}
  if(!out.length)for(i=0;i<selection.length;i++)if(validSource(selection[i]))out.push(selection[i]);
  if(!out.length)throw Error("Selecciona composiciones o imágenes en el proyecto o en el timeline.");return out;
 }
 function info(items){var list=[],i,item,c=app.project.activeItem,folder=new Folder(Folder.temp.fsName+"/YaguaTool-carrousel-thumbs");
  for(i=0;i<items.length;i++){item=items[i];var url=null;
   if(item instanceof FootageItem&&item.file)url=YaguaHost.uri(item.file);
   if(item instanceof CompItem){var resolution=item.resolutionFactor;try{if(folder.exists||folder.create()){var file=new File(folder.fsName+"/source-"+item.id+".png"),ratio=Math.max(1,Math.ceil(Math.max(item.width,item.height)/500));item.resolutionFactor=[ratio,ratio];item.saveFrameToPng(Math.max(0,Math.min(item.duration-item.frameDuration,item.time)),file);if(file.exists)url=YaguaHost.uri(file);}}catch(ignoreThumb){}finally{item.resolutionFactor=resolution;}}
   list.push({id:item.id,name:item.name,width:item.width,height:item.height,url:url});
  }return{items:list,width:c instanceof CompItem?c.width:1920,height:c instanceof CompItem?c.height:1080};
 }
 api.ytCarouselSources=function(o){return{msg:"Fuentes cargadas",data:info(sources(o))};};
 api.ytCarouselPick=function(){var files=File.openDialog("Añadir imágenes al carrousel","Imágenes:*.png;*.jpg;*.jpeg;*.tif;*.tiff;*.psd;*.webp",true),items=[],i,options;if(!files)return{msg:"Importación cancelada",data:null};for(i=0;i<files.length;i++){options=new ImportOptions(files[i]);items.push(app.project.importFile(options));}return{msg:items.length+" imágenes importadas",data:info(items)};};
 function slider(layer,name,value){var e=layer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");e.name=name;e.property(1).setValue(value);return e;}
 function point(layer,name,value){var e=layer.property("ADBE Effect Parade").addProperty("ADBE Point Control");e.name=name;e.property(1).setValue(value);return e;}
 api.ytCarouselCreate=function(o){
  var src=sources(o),cfg=o.config||{},active=app.project.activeItem,w=Number(cfg.viewportWidth)||(active instanceof CompItem?active.width:1920),h=Number(cfg.viewportHeight)||(active instanceof CompItem?active.height:1080),
   fps=active instanceof CompItem?active.frameRate:30,duration=Math.max(1,Math.min(120,Number(cfg.duration)||10)),count=Math.max(2,Math.min(20,Math.round(Number(cfg.count)||src.length))),
   c=null,root=new File(YaguaHost.root+"/js/carrousel-model.js"),model;
  root.encoding="UTF-8";if(!root.open("r"))throw Error("Falta la geometría del carrousel.");try{model=root.read();}finally{root.close();}
  try{c=app.project.items.addComp("YaguaTool Carrousel · "+(cfg.mode==="radial"?"Órbita suave":"Línea editorial"),w,h,1,duration,fps);var ctrl=c.layers.addNull(),i,source,l,camera;
  ctrl.name="YaguaTool Carrousel Control";ctrl.guideLayer=true;ctrl.shy=true;
  var fields=[["radius","Radio esquinas",24],["gap","Separacion",100/count],["speed","Velocidad",10],["baseSize","Tamano base",100],["middleSize","Tamano central",160],["middleWidth","Anchura central",8],["softness","Suavidad",20],["radiusX","Radio X",35],["radiusY","Radio Y",18]];
  for(i=0;i<fields.length;i++)slider(ctrl,fields[i][1],cfg[fields[i][0]]===undefined?fields[i][2]:Number(cfg[fields[i][0]]));
  slider(ctrl,"Radial",cfg.mode==="radial"?1:0);slider(ctrl,"Invertir",cfg.reverse?1:0);slider(ctrl,"Orientar",cfg.orient?1:0);
  var pins=cfg.points||[[.12,.68],[.5,.42],[.88,.65]];for(i=0;i<3;i++)point(ctrl,"Punto "+(i+1),[pins[i][0]*w,pins[i][1]*h]);
  
  camera=c.layers.addCamera("YaguaTool Carrousel Camera",[w/2,h/2]);camera.transform.position.setValue([w/2,h/2,-3000]);camera.transform.pointOfInterest.setValue([w/2,h/2,0]);camera.property("ADBE Camera Options Group").property("ADBE Camera Zoom").setValue(3000);
  var expression=model+"\nvar C=thisComp.layer(\"YaguaTool Carrousel Control\");\nvar o={};\n";
  for(i=0;i<fields.length;i++)expression+='o.'+fields[i][0]+'=C.effect("'+fields[i][1]+'")(1);\n';
  expression+='o.mode=C.effect("Radial")(1)>.5?"radial":"curve";o.reverse=C.effect("Invertir")(1)>.5;o.orient=C.effect("Orientar")(1)>.5;\no.points=[];for(var j=1;j<=3;j++){var point=C.effect("Punto "+j)(1);o.points.push([point[0]/thisComp.width,point[1]/thisComp.height]);}\n';
  for(i=0;i<count;i++){
   source=src[i%src.length];l=c.layers.add(source);l.name="Carrousel "+(i+1)+" · "+source.name;l.threeDLayer=true;l.motionBlur=true;
   var calc=expression+'var p=YaguaCarrouselModel.pose('+i+','+count+',time,o);var q=YaguaCarrouselModel.projection(p,thisComp.width,thisComp.height,3000);\n';
   var matte=l.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");matte.name="YaguaTool · Esquinas";matte.maskMode=MaskMode.ADD;
   matte.property("ADBE Mask Shape").expression=model+'\nvar w=thisLayer.source.width,h=thisLayer.source.height;var r=thisComp.layer("YaguaTool Carrousel Control").effect("Radio esquinas")(1)*w/(thisComp.width*.12);var p=YaguaCarrouselModel.rounded(w,h,r);createPath(p.vertices,p.inTangents,p.outTangents,true);';
   l.transform.position.expression=calc+'q.position;';
   l.transform.scale.expression=calc+'var s='+(.12*w/source.width*100)+'*q.scale;[s,s,s];';
   l.transform.opacity.expression=calc+'p.opacity*100;';l.property("ADBE Transform Group").property("ADBE Rotate Z").expression=calc+'p.rotation;';
  }
  c.hideShyLayers=true;c.comment="YaguaTool Carrousel | "+JSON.stringify(cfg);c.openInViewer();return{msg:count+" elementos creados en un carrousel editable.",data:{id:c.id,count:count}};
  }catch(error){if(c)try{c.remove();}catch(ignoreRemove){}if(active instanceof CompItem)try{active.openInViewer();}catch(ignoreViewer){}throw error;}
 };
})();
