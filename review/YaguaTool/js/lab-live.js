/* Rebuild only a rig's render cache when its native preset controls/text change. */
window.YaguaLabLive=(function(){
 'use strict';
 var running=false,busy=false,timer=0,pending='',since=0,failed='',lastMessage='';
 function report(status,msg){if(status+'|'+msg===lastMessage)return;lastMessage=status+'|'+msg;document.dispatchEvent(new CustomEvent('yagua-lab-sync',{detail:{status:status,message:msg}}));}
 function later(){if(running)timer=setTimeout(tick,650);}
 async function tick(){if(!running)return;if(YaguaAEBridge.getState().status!=='ready'){later();return;}if(busy||document.hidden){later();return;}busy=true;
  try{
   const reply=await YaguaAEBridge.call('ytLabRigState',{});if(!reply.ok)throw Error(reply.msg);const rig=reply.data;
   if(!rig){pending='';report('idle','');return;}
   const key=rig.id+'|'+rig.signature;
   if(rig.signature===rig.applied){pending='';failed='';report('ready','Motion Lab · texto y controles sincronizados');return;}
   if(key===failed)return;
   if(pending!==key){pending=key;since=Date.now();report('waiting','Motion Lab · esperando a que termines el ajuste…');return;}
   if(Date.now()-since<650)return;
   report('working','Motion Lab · actualizando animación con el motor original…');
   const options=JSON.parse(JSON.stringify(rig.options)),preset=(window.YMX_CATALOG||[]).find(p=>p.id===options.presetId||(p.pack===options.data.pack&&p.name===options.data.name));
   if(!preset)throw Error('No se encuentra el preset original para sincronizar.');
   options.data={name:preset.name,pack:preset.pack,kind:preset.smartKind};options.presetId=preset.id;
   if(!options.text.trim())throw Error('Escribe algún carácter visible en TEXTO.');
   const baked=await YaguaLabBake.capture(options,null,()=>!running);
   const temp=await YaguaAEBridge.call('tempDir',{});if(!temp.ok)throw Error(temp.msg);
   const path=temp.data+'/YaguaTool_Lab_Live_'+Date.now()+'.json',fs=window.cep&&window.cep.fs;if(!fs)throw Error('CEP no permite guardar el muestreo temporal.');
   const written=fs.writeFile(path,JSON.stringify(baked));if(written.err)throw Error('No se ha podido escribir el muestreo temporal.');
   try{const result=await YaguaAEBridge.call('ytLabRigUpdate',{id:rig.id,path:path,signature:rig.signature,temporary:true});if(!result.ok)throw Error(result.msg);if(!result.data||!result.data.stale)report('ready',result.msg);}
   finally{if(fs.deleteFile)try{fs.deleteFile(path);}catch(ignoreDelete){}}
  }catch(e){if(running){failed=pending;report('error','Motion Lab · '+e.message);}}finally{busy=false;later();}
 }
 function start(){if(running)return;running=true;later();}
 function stop(){running=false;clearTimeout(timer);}
 function pause(){stop();report('paused','Motion Lab · sincronización pausada. Los controles Global siguen funcionando.');}
 return{start:start,stop:stop,pause:pause,retry:function(){failed='';pending='';since=0;},getState:function(){return{running:running,busy:busy,pending:pending,failed:failed};}};
})();
