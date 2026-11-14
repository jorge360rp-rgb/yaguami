// Optional manual diagnostic: File > Scripts > Run Script File in After Effects.
(function(){
 try{
  var root=new File($.fileName).parent.fsName;
  $._yaguaExtensionRoot=root;$.evalFile(new File(root+'/jsx/yagua-host.jsx'));
  var result=Animix.yaguaHealth();
  alert('YaguaTool 3.1.0\n'+result.msg+'\n'+JSON.stringify(result.data,null,2));
 }catch(e){alert('YaguaTool: '+String(e.message||e)+'\nArchivo: '+String(e.fileName||'')+'\nLínea: '+String(e.line||'?'));}
})();
