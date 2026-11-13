// Shared helpers for the new modules. Original Animix identifiers stay compatible.
var YaguaHost=(function(){
 var H={};H.root=typeof $!=="undefined"?File($.fileName).parent.parent.fsName:"";
 H.fail=function(message){throw new Error(message);};
 H.comp=function(){var c=app.project.activeItem;if(!(c instanceof CompItem))H.fail("Abre una composición.");return c;};
 H.layers=function(){var c=H.comp();if(!c.selectedLayers.length)H.fail("Selecciona al menos una capa.");return c.selectedLayers;};
 H.read=function(file){file=typeof file==="string"?new File(file):file;file.encoding="UTF-8";if(!file.exists||!file.open("r"))H.fail("No se puede leer: "+file.fsName);try{return JSON.parse(file.read());}finally{file.close();}};
 H.keys=function(p,times,values){p.setValuesAtTimes(times,values);for(var i=1;i<=p.numKeys;i++)p.setInterpolationTypeAtKey(i,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);};
 H.uri=function(file){var path=file.fsName.replace(/\\/g,"/");return "file://"+(path.charAt(0)==="/"?"":"/")+encodeURI(path).replace(/#/g,"%23").replace(/\?/g,"%3F");};
 H.selectedProps=function(){var c=H.comp(),out=[],props=c.selectedProperties,i;for(i=0;i<props.length;i++)if(props[i].propertyType===PropertyType.PROPERTY&&props[i].canVaryOverTime)out.push(props[i]);if(!out.length)H.fail("Selecciona propiedades animables en el timeline.");return out;};
 H.put=function(p,value,t){if(p.expressionEnabled)H.fail("La propiedad tiene una expresión activa.");if(p.numKeys)p.setValueAtTime(t,value);else p.setValue(value);};
 Animix.api.ytSaveJSON=function(o){var f=File.saveDialog("Guardar "+String(o.name||"configuración"),"JSON:*.json");if(!f)return{msg:"Guardado cancelado",data:false};f.encoding="UTF-8";if(!f.open("w"))H.fail("No se pudo abrir el archivo para escribir.");try{if(!f.write(o.content))H.fail("No se pudo escribir el archivo.");}finally{f.close();}return{msg:"Guardado: "+f.fsName,data:true};};
 Animix.api.ytOpenFontFolder=function(){var f=new Folder(H.root+"/assets/fonts");if(!f.exists||!f.execute())H.fail("No se pudo abrir la carpeta de fuentes.");return{msg:"Instala GeistLab760.ttf para el render nativo del Lab."};};
 return H;
})();
