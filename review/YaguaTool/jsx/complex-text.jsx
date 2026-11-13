// Load the supplied AEP intact; never run the autonomous script that opens another project.
var YaguaFluid=(function(){
 var MARK="YAGUATOOL_FLUID_MASTER_V1";
 function master(){
  var i,it,path=new File(YaguaHost.root+"/library/Fluido_Original_AE2024.aep"),seen={},root=null;
  for(i=1;i<=app.project.numItems;i++){it=app.project.item(i);if(it instanceof CompItem&&it.comment===MARK)return it;seen[it.id]=true;}
  if(!path.exists)throw Error("Falta el AEP original del efecto fluido.");
  var options=new ImportOptions(path);if(!options.canImportAs(ImportAsType.PROJECT))throw Error("AE no puede importar el proyecto original.");options.importAs=ImportAsType.PROJECT;app.project.importFile(options);
  for(i=1;i<=app.project.numItems;i++){it=app.project.item(i);if(!seen[it.id]&&it instanceof CompItem&&it.name==="Vapor Text"){root=it;break;}}
  if(!root)throw Error("El proyecto se ha importado, pero no se encontró Vapor Text.");root.comment=MARK;return root;
 }
 function duplicateGraph(src,memo,named){
  var key=String(src.id);if(memo[key])return memo[key];var copy=src.duplicate(),i,l;memo[key]=copy;named[src.name]=copy;copy.comment="YaguaTool Fluido · instancia independiente";
  for(i=1;i<=copy.numLayers;i++){l=copy.layer(i);if(l.source instanceof CompItem)l.replaceSource(duplicateGraph(l.source,memo,named),false);}
  return copy;
 }
 function instance(o){var named={},copy=duplicateGraph(master(),{},named),i,c,l,doc,names=["Text 01","Text 02"],values=[o.text1,o.text2];copy.name="YaguaTool · Efecto fluido";
  if(o.customize)for(i=0;i<names.length;i++){c=named[names[i]];if(!c)throw Error("No se encontró "+names[i]+" para editar el texto.");for(var j=1;j<=c.numLayers;j++){l=c.layer(j);if(l instanceof TextLayer){doc=l.property("ADBE Text Properties").property("ADBE Text Document");var value=doc.value;value.text=String(values[i]);doc.setValue(value);}}}
  return copy;
 }
 Animix.api.ytFluidOpen=function(){var c=master();c.openInViewer();return{msg:"Original importado: Vapor Text. Efectos y keyframes conservados.",data:{id:c.id,duration:c.duration,width:c.width,height:c.height}};};
 Animix.api.ytFluidCreate=function(o){var target=app.project.activeItem;if(o.insert&&!(target instanceof CompItem))throw Error("Abre la composición donde quieres insertar el efecto.");var c=instance(o);if(o.insert){var l=target.layers.add(c);l.startTime=target.time;l.name="YaguaTool · Efecto fluido";target.openInViewer();}else c.openInViewer();return{msg:o.insert?"Efecto fluido insertado como precomposición independiente.":"Efecto fluido duplicado; el original se conserva.",data:{id:c.id}};};
 Animix.api.ytFluidPreview=function(o){
  var original=app.project.activeItem,c=master(),resolution=c.resolutionFactor,time=c.time,folder=new Folder(Folder.temp.fsName+"/YaguaTool-fluid-preview"),frames=[],count=49,span=Math.max(c.frameDuration,c.duration-c.frameDuration),i,file;
  if(!folder.exists&&!folder.create())throw Error("No se puede crear la caché de preview. Activa la escritura de archivos para scripts en AE.");
  var old=folder.getFiles("frame-*.png");for(i=0;i<old.length;i++)if(old[i] instanceof File)old[i].remove();
  try{
   c.resolutionFactor=[2,2];
   for(i=0;i<count;i++){file=new File(folder.fsName+"/frame-"+("0000"+i).slice(-4)+".png");c.saveFrameToPng(span*i/(count-1),file);if(!file.exists)throw Error("AE no ha guardado la preview.");frames.push(YaguaHost.uri(file));}
   return{msg:"Preview del AEP original renderizada por AE",data:{frames:frames,duration:span,fps:(count-1)/span}};
  }finally{c.resolutionFactor=resolution;c.time=time;if(original instanceof CompItem)original.openInViewer();}
 };
 return{master:master,instance:instance};
})();
