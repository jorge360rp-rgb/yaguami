(function(){
 var api=Animix.api;
 api.ytSocialComp=function(o){
  var f=null,i;for(i=0;i<YaguaSocialFormats.length;i++)if(YaguaSocialFormats[i].id===o.id)f=YaguaSocialFormats[i];
  if(!f)throw Error('Formato de red social no válido.');
  var fps=Math.max(1,Math.min(120,Number(o.fps)||30)),duration=Math.max(1,Math.min(600,Number(o.duration)||10));
  if(!app.project)app.newProject();var c=app.project.items.addComp('YaguaTool · '+f.name,f.width,f.height,1,duration,fps);c.openInViewer();
  return{msg:'Composición creada: '+f.name+' · '+f.width+' × '+f.height,data:{id:c.id,width:f.width,height:f.height}};
 };
 function numeric(v){if(typeof v==='number')return isFinite(v);if(Object.prototype.toString.call(v)==='[object Array]'){for(var i=0;i<v.length;i++)if(typeof v[i]!=='number'||!isFinite(v[i]))return false;return true;}return false;}
 api.ytBounceCurve=function(o){var props=YaguaHost.selectedProps(),plans=[],i,j,p,keys,c=YaguaHost.comp(),strength=o.strength===undefined?100:Number(o.strength);
  if(!isFinite(strength))throw Error('Intensidad no válida.');
  for(i=0;i<props.length;i++){p=props[i];if(p.expressionEnabled||!numeric(p.value))throw Error('Selecciona propiedades numéricas sin expresión.');keys=p.selectedKeys;if(keys.length<2)throw Error('Selecciona al menos dos keys consecutivas.');
   for(j=0;j<keys.length-1;j++){if(keys[j+1]!==keys[j]+1)throw Error('No debe haber keys sin seleccionar dentro de cada segmento.');plans.push({p:p,a:p.keyTime(keys[j]),b:p.keyTime(keys[j+1]),v1:p.keyValue(keys[j]),v2:p.keyValue(keys[j+1]),inType:p.keyInInterpolationType(keys[j]),outType:p.keyOutInterpolationType(keys[j+1])});}
  }
  for(i=0;i<plans.length;i++){var plan=plans[i],steps=Math.min(600,Math.max(12,Math.ceil((plan.b-plan.a)*c.frameRate))),v,t,u,k;p=plan.p;
   for(j=0;j<=steps;j++){t=plan.a+(plan.b-plan.a)*j/steps;u=YaguaBounce.value(j/steps,o.direction,strength);if(typeof plan.v1==='number')v=plan.v1+(plan.v2-plan.v1)*u;else{v=[];for(k=0;k<plan.v1.length;k++)v.push(plan.v1[k]+(plan.v2[k]-plan.v1[k])*u);}p.setValueAtTime(t,v);k=p.nearestKeyIndex(t);p.setInterpolationTypeAtKey(k,j===0?plan.inType:KeyframeInterpolationType.LINEAR,j===steps?plan.outType:KeyframeInterpolationType.LINEAR);if(p.isSpatial&&j>0&&j<steps){var zero=[];for(var d=0;d<plan.v1.length;d++)zero.push(0);p.setSpatialAutoBezierAtKey(k,false);p.setSpatialTangentsAtKey(k,zero,zero);}}
  }return{msg:'Curva Rebote aplicada a '+plans.length+' segmentos. Deshacer recupera las keys anteriores.'};
 };
})();
