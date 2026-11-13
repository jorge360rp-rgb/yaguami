/* CEP -> ExtendScript transport. Load the packaged host explicitly, then verify it. */
window.YaguaAEBridge=(function(){
 'use strict';
 var VERSION='3.0.1',pending=null,listeners=[],state={status:'idle',message:'Conectando con After Effects…',data:null};
 function available(){return !!(window.__adobe_cep__&&typeof window.__adobe_cep__.evalScript==='function');}
 function publish(status,message,data){state={status:status,message:message,data:data||null};listeners.forEach(function(fn){fn(state);});}
 function root(){var path='',encoded=false;try{path=window.__adobe_cep__.getSystemPath('extension')||'';}catch(ignore){}
  if(!path){path=window.location.pathname.replace(/\/[^/]*$/,'');encoded=true;}
  encoded=encoded||/^file:/i.test(String(path));path=String(path).replace(/^file:\/\//i,'');if(encoded)try{path=decodeURIComponent(path);}catch(ignoreDecode){}
  if(/^\/[A-Za-z]:/.test(path))path=path.slice(1);return path.replace(/\\/g,'/').replace(/\/$/,'');
 }
 function literal(value){return JSON.stringify(value).replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');}
 function error(message,code){return{ok:false,msg:message,code:code||'AE_BRIDGE_ERROR'};}
 function evaluate(script,timeout){return new Promise(function(resolve){var settled=false,timer=timeout>0?setTimeout(function(){finish(error('After Effects no ha respondido. Cierra los cuadros de diálogo de AE y pulsa Reconectar AE.','AE_TIMEOUT'));},timeout):null;
  function finish(value){if(settled)return;settled=true;clearTimeout(timer);resolve(value);}
  try{window.__adobe_cep__.evalScript(script,function(raw){try{var result=JSON.parse(raw);if(!result||typeof result.ok!=='boolean')throw Error('Respuesta inválida');finish(result);}catch(e){finish(error('No se pudo ejecutar el script en AE: '+String(raw).slice(0,300),'AE_SCRIPT_ERROR'));}});}catch(e){finish(error('No se pudo contactar con AE: '+e.message,'AE_TRANSPORT_ERROR'));}
 });}
 function bootstrapNative(root,force,version){
  function quote(s){return '"'+String(s).replace(/[\\"\u0000-\u001f\u2028\u2029]/g,function(c){return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);})+'"';}
  try{
   if(force||typeof Animix==='undefined'||typeof Animix.yaguaHealth!=='function'||Animix.yaguaVersion!==version||typeof YaguaHost==='undefined'||String(YaguaHost.root).replace(/\\/g,'/')!==root){
    $._yaguaExtensionRoot=root;var f=new File(root+'/jsx/yagua-host.jsx');if(!f.exists)throw Error('No se encuentra '+f.fsName+'. Extrae e instala el ZIP completo.');$.evalFile(f);
   }
   if(typeof Animix==='undefined'||typeof Animix.yaguaHealth!=='function')throw Error('El host de YaguaTool no se ha inicializado.');
   return JSON.stringify(Animix.yaguaHealth());
  }catch(e){return '{"ok":false,"code":"AE_LOAD_ERROR","msg":'+quote(String(e.message||e)+' | '+String(e.fileName||'host')+':'+String(e.line||'?'))+'}';}
 }
 function connect(force){if(pending)return pending;if(!available()){publish('demo','Modo demo · abre el panel dentro de After Effects');return Promise.resolve(error(state.message,'AE_UNAVAILABLE'));}
  if(!force&&state.status==='ready')return Promise.resolve({ok:true,msg:state.message,data:state.data});
  publish('loading','Cargando scripts de After Effects…');
  var script='('+bootstrapNative.toString()+')('+literal(root())+','+Boolean(force)+','+literal(VERSION)+')';
  pending=evaluate(script,20000).then(function(reply){pending=null;if(reply.ok&&reply.data&&reply.data.version===VERSION)publish('ready','AE conectado · host '+VERSION,reply.data);else{if(reply.ok)reply=error('La versión del host no coincide. Reinstala el ZIP completo y reinicia AE.','AE_VERSION_ERROR');publish('error',reply.msg,reply.data);}return reply;});return pending;
 }
 function call(name,args){return connect(false).then(function(ready){if(!ready.ok)return ready;
  var script='(function(){try{return Animix.call('+literal(name)+','+literal(JSON.stringify(args||{}))+');}catch(e){return JSON.stringify({ok:false,msg:String(e.message||e),code:"AE_DISPATCH_ERROR"});}})()';
  return evaluate(script,0).then(function(reply){if(!reply.ok&&/^AE_(SCRIPT|DISPATCH|TRANSPORT)_ERROR$/.test(reply.code||''))publish('error',reply.msg);return reply;});
 });}
 return{available:available,connect:connect,call:call,root:root,getState:function(){return state;},subscribe:function(fn){listeners.push(fn);fn(state);return function(){listeners=listeners.filter(function(item){return item!==fn;});};}};
})();
