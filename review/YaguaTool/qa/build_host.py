"""Package a single ES3 host: CEP must not resolve relative #include directives."""
from pathlib import Path
import hashlib
root=Path(__file__).resolve().parent.parent
names=['host.jsx','yagua-core.jsx','lab-native.jsx','complex-text.jsx','carrousel.jsx','tools-pro.jsx']
parts=['// YaguaTool 3.0.1 - generated self-contained CEP host. Run qa/build_host.py to update.\nvar YaguaHostBoot={version:"3.0.1",modules:[],errors:[]};\n']
for name in names:
 source=(root/'jsx'/name).read_text(encoding='utf-8')
 assert '#include' not in source
 parts.append('\n// MODULE '+name+' SHA256 '+hashlib.sha256(source.encode()).hexdigest()+'\ntry {\n'+source+'\nYaguaHostBoot.modules.push("'+name+'");\n} catch (yaguaModuleError) {\nYaguaHostBoot.errors.push("'+name+': "+String(yaguaModuleError.message||yaguaModuleError)+" (line "+String(yaguaModuleError.line||"?")+")");\n}\n')
parts.append('''
if(typeof Animix==="undefined"||!Animix) { var Animix={}; }
Animix.yaguaVersion="3.0.1";
Animix.yaguaHealth=function(){
 var required=["text","removeText","tempDir","ytLabBuild","ytLabDefault","ytFluidCreate","ytFluidPreview","ytCarouselCreate","ytCarouselSources","ytCurveApply","ytSaveJSON"],missing=[],i;
 for(i=0;i<required.length;i++)if(!Animix.api||typeof Animix.api[required[i]]!=="function")missing.push(required[i]);
 var root=typeof YaguaHost!=="undefined"&&YaguaHost?YaguaHost.root:"",ready=typeof Animix.call==="function"&&missing.length===0&&YaguaHostBoot.errors.length===0&&!!root;
 return {ok:ready,msg:ready?"Host 3.0.1 cargado y verificado":"No se ha podido cargar el host completo: "+YaguaHostBoot.errors.join(" | ")+(missing.length?" | faltan: "+missing.join(", "):"")+(!root?" | ruta de extensión no disponible":""),
 data:{version:"3.0.1",root:root,host:typeof app!=="undefined"?String(app.name):"",hostVersion:typeof app!=="undefined"?String(app.version):"",modules:YaguaHostBoot.modules,errors:YaguaHostBoot.errors,missing:missing}};
};
if(typeof $!=="undefined"&&$.global){$.global.Animix=Animix;$.global.YaguaHost=typeof YaguaHost!=="undefined"?YaguaHost:null;}
''')
(root/'jsx/yagua-host.jsx').write_text(''.join(parts),encoding='utf-8')
print('Built self-contained host:',(root/'jsx/yagua-host.jsx').stat().st_size,'bytes')
