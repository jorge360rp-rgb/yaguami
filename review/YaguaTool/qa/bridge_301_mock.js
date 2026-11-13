// Yaguanimix 2.0 simulated AE engine: masks + ink sweep + full-frame gradient backgrounds.
// This is NOT a substitute for rendering in After Effects.
const vm=require('vm'),fs=require('fs'),assert=require('assert'),path=require('path');
let nextId=1, sceneComps=[];
class Shape{constructor(){this.vertices=[];this.inTangents=[];this.outTangents=[];this.closed=false}}
class Prop{
  constructor(name){this.name=name;this.children=[];this.value=0;this.keys=[];this.expression='';this.expressionEnabled=false;this.parentProperty=null;this.isSpatial=false;this.propertyValueType=0;this.maskMode=0}
  get numProperties(){return this.children.length}get numKeys(){return this.keys.length}
  property(n){return typeof n==='number'?this.children[n-1]||null:this.children.find(x=>x.name===n)||null}
  addProperty(name){let x=new Prop(name);x.parentProperty=this;
    if(name==='ADBE Text Animator'){x.addProperty('ADBE Text Animator Properties');let s=x.addProperty('ADBE Text Selectors');let r=s.addProperty('ADBE Text Selector');r.addProperty('ADBE Text Range Advanced');r.addProperty('ADBE Text Percent Start');r.addProperty('ADBE Text Percent End');r.addProperty('ADBE Text Percent Offset')}
    else if(name==='ADBE Text Range Advanced'){x.addProperty('ADBE Text Range Type2');x.addProperty('ADBE Text Selector Smoothness');}
    else if(name==='ADBE Text Expressible Selector'){x.addProperty('ADBE Text Expressible Amount');x.addProperty('ADBE Text Range Type2');}
    else if(name==='ADBE Slider Control'||name==='ADBE Color Control')x.addProperty('value');
    else if(name==='ADBE 4ColorGradient')for(let i=1;i<=8;i++)x.addProperty('effect-'+i);
    else if(name==='ADBE Ramp')for(let i=1;i<=7;i++)x.addProperty('ramp-'+i);
    else if(name==='ADBE Vector Group')x.addProperty('ADBE Vectors Group');
    else if(name==='ADBE Vector Shape - Ellipse')x.addProperty('ADBE Vector Ellipse Size');
    else if(name==='ADBE Vector Shape - Rect')x.addProperty('ADBE Vector Rect Size');
    else if(name==='ADBE Vector Graphic - Fill')x.addProperty('ADBE Vector Fill Color');
    else if(name==='ADBE Gaussian Blur 2'){x.addProperty('amount');x.addProperty('unused');x.addProperty('repeat edge pixels')}
    else if(name==='ADBE Fill')x.addProperty('ADBE Fill-0002');
    else if(name==='ADBE Glo2')for(let i=1;i<=5;i++)x.addProperty('ADBE Glo2-'+String(i).padStart(4,'0'));
    else if(name==='ADBE Mask Atom'){x.addProperty('ADBE Mask Shape');x.addProperty('ADBE Mask Feather')}
    this.children.push(x);return x;
  }
  setValue(v){this.value=v} setValueAtTime(t,v){this.keys.push([t,v]);this.value=v}
  valueAtTime(){return this.value}keyTime(i){return this.keys[i-1][0]} keyValue(i){return this.keys[i-1][1]} removeKey(i){this.keys.splice(i-1,1)} keyInInterpolationType(){return 1} keyOutInterpolationType(){return 1} keyInTemporalEase(){return [{}]} keyOutTemporalEase(){return [{}]}
  moveTo(index){if(!this.parentProperty)return;const ar=this.parentProperty.children;const old=ar.indexOf(this);if(old<0)return;ar.splice(old,1);ar.splice(Math.max(0,Math.min(ar.length,index-1)),0,this)}
  remove(){if(this.parentProperty)this.parentProperty.children=this.parentProperty.children.filter(x=>x!==this)}
  setInterpolationTypeAtKey(){}setTemporalEaseAtKey(){}
}
class Layer{
  constructor(name,comp){this.id=nextId++;this.name=name;this.comp=comp;this.inPoint=0;this.outPoint=comp.duration;this.label=1;this.selected=false;this.audioEnabled=false;this.properties={};this.source=null;this.transform={};
    for(const name of ['position','scale','rotation','opacity','anchorPoint'])this.transform[name]=new Prop(name);
    this.transform.opacity.value=100;this.transform.position.value=[200,200];this.transform.scale.value=[100,100];
    this.properties['ADBE Effect Parade']=new Prop('ADBE Effect Parade');
    this.properties['ADBE Root Vectors Group']=new Prop('ADBE Root Vectors Group');
    this.properties['ADBE Mask Parade']=new Prop('ADBE Mask Parade');
    let tp=this.properties['ADBE Text Properties']=new Prop('ADBE Text Properties');tp.addProperty('ADBE Text Animators');let td=tp.addProperty('ADBE Text Document');td.value={text:'Creative\rMotion',fontSize:82};
  }
  property(n){return this.properties[n]||null}
  duplicate(){let d=new this.constructor('Duplicated',this.comp);d.inPoint=this.inPoint;d.outPoint=this.outPoint;
    d.transform.opacity.value=this.transform.opacity.value;d.transform.opacity.expression=this.transform.opacity.expression;
    d.property('ADBE Text Properties').property('ADBE Text Document').value={...this.property('ADBE Text Properties').property('ADBE Text Document').value};
    d.property('ADBE Text Properties').property('ADBE Text Document').expression=this.property('ADBE Text Properties').property('ADBE Text Document').expression;
    this.comp.arr.unshift(d);return d}
  sourceRectAtTime(){return {left:-150,top:-90,width:360,height:160}}
  moveBefore(other){this.comp.arr=this.comp.arr.filter(x=>x!==this);this.comp.arr.splice(this.comp.arr.indexOf(other),0,this)}
  moveToEnd(){this.comp.arr=this.comp.arr.filter(x=>x!==this);this.comp.arr.push(this)}
  remove(){this.comp.arr=this.comp.arr.filter(x=>x!==this)}
}
class TextLayer extends Layer{}
class ShapeLayer extends Layer{}
class CompItem{
  constructor(w=1080,h=1920,d=10,fps=30){this.width=w;this.height=h;this.duration=d;this.frameRate=fps;this.frameDuration=1/fps;this.pixelAspect=1;this.time=0;this.arr=[];this.usedIn=[];
    this.layers={
      addNull:()=>{let l=new Layer('Null',this);this.arr.unshift(l);return l},
      addShape:()=>{let l=new ShapeLayer('Shape',this);this.arr.unshift(l);return l},
      addSolid:(c,nm)=>{let l=new ShapeLayer(nm,this);this.arr.unshift(l);return l},
      add:(source)=>{let l=new Layer(source.name,this);l.source=source;this.arr.unshift(l);return l},
      addText:(txt)=>{let l=new TextLayer('Text',this);l.property('ADBE Text Properties').property('ADBE Text Document').value.text=txt;this.arr.unshift(l);return l}
    }
  }
  get numLayers(){return this.arr.length}layer(i){return this.arr[i-1]}
  get selectedLayers(){return this.arr.filter(x=>x.selected)}
  openInViewer(){current=this}
  remove(){sceneComps=sceneComps.filter(x=>x!==this)}
}
let current=new CompItem();let orig=new TextLayer('Original',current);orig.selected=true;current.arr.push(orig);
orig.property('ADBE Text Properties').property('ADBE Text Document').expression='"keep expression"';
orig.transform.opacity.expression='value*0.5';orig.transform.opacity.expressionEnabled=true;
const sandbox={app:{project:{get activeItem(){return current},items:{addComp:(nm,w,h,pa,d,fps)=>{let c=new CompItem(w,h,d,fps);c.name=nm;sceneComps.push(c);return c}}},beginUndoGroup(){},endUndoGroup(){}},
 CompItem,TextLayer,ShapeLayer,Shape,MaskMode:{ADD:1,INTERSECT:2,SUBTRACT:3},BlendingMode:{NORMAL:1,SCREEN:2,MULTIPLY:3},KeyframeEase:class{},KeyframeInterpolationType:{BEZIER:1,LINEAR:2},PropertyValueType:{TwoD:2,ThreeD:3},ParagraphJustification:{CENTER_JUSTIFY:1},JSON,Math};
// Deliberately start without a loaded ScriptPath host.
const call=(name,o)=>JSON.parse(sandbox.Animix.call(name,JSON.stringify(o)));

const base={mode:'in',dur:.8,delay:0,startAt:'layer',basedOn:'chars',dir:'up',dist:32,blur:5,scale:92,rot:0,bounce:23,bounces:2,overlap:70,fade:true};
function reset(){current=new CompItem();orig=new TextLayer('Original',current);orig.selected=true;current.arr.push(orig);orig.property('ADBE Text Properties').property('ADBE Text Document').value.text='Hello\rWorld';}
function animatorNames(){return orig.property('ADBE Text Properties').property('ADBE Text Animators').children.map(x=>x.name);}
function maskNames(){return orig.property('ADBE Mask Parade').children.map(x=>x.name);}



// Semantic mocks for the newly integrated native adapters. These do not render AE pixels.
const projectItems=[];let chosenProps=[],missingFont=false;
Object.defineProperties(Prop.prototype,{
 propertyType:{get(){return this.children.length?2:1}},
 canVaryOverTime:{get(){return this.children.length===0}},
 canSetExpression:{get(){return this.children.length===0}},
 selectedKeys:{get(){return this.keys.flatMap((key,i)=>key[2]?.selected?[i+1]:[])},set(list){this.keys.forEach((k,i)=>{k[2]??={};k[2].selected=list.includes(i+1)})}},
 propertyIndex:{get(){return this.parentProperty?.children?.indexOf(this)+1||1}},
 propertyDepth:{get(){let n=this,depth=0;while(n.parentProperty){depth++;n=n.parentProperty}return depth}}
});
Prop.prototype.propertyGroup=function(depth){let p=this;for(let i=0;i<depth;i++)p=p.parentProperty;return p};
Prop.prototype.setValue=function(v){this.value=v;if(v&&v.font&&missingFont)this.value={...v,fontObject:{isSubstitute:true}}};
Prop.prototype.setValueAtTime=function(t,v){let key=this.keys.find(k=>Math.abs(k[0]-t)<1e-9);if(key)key[1]=v;else{key=[t,v,{inType:1,outType:1,inEase:[{speed:0,influence:33}],outEase:[{speed:0,influence:33}]}];this.keys.push(key);this.keys.sort((a,b)=>a[0]-b[0])}this.value=v};
Prop.prototype.setValuesAtTimes=function(times,values){times.forEach((t,i)=>this.setValueAtTime(t,values[i]))};
Prop.prototype.keyTime=function(i){return this.keys[i-1][0]};Prop.prototype.keyValue=function(i){return this.keys[i-1][1]};
Prop.prototype.valueAtTime=function(t){if(!this.keys.length)return this.value;if(t<=this.keys[0][0])return this.keys[0][1];let i=this.keys.findIndex(k=>k[0]>=t);if(i<0)return this.keys.at(-1)[1];let a=this.keys[i-1],b=this.keys[i],u=(t-a[0])/(b[0]-a[0]);return Array.isArray(a[1])?a[1].map((v,j)=>v+(b[1][j]-v)*u):typeof a[1]==='number'?a[1]+(b[1]-a[1])*u:a[1]};
Prop.prototype.nearestKeyIndex=function(t){let best=0,dist=Infinity;this.keys.forEach((k,i)=>{if(Math.abs(t-k[0])<dist){best=i+1;dist=Math.abs(t-k[0])}});return best};
Prop.prototype.keyInInterpolationType=function(i){return this.keys[i-1][2]?.inType||1};Prop.prototype.keyOutInterpolationType=function(i){return this.keys[i-1][2]?.outType||1};
Prop.prototype.keyInTemporalEase=function(i){return this.keys[i-1][2]?.inEase||[{speed:0,influence:33}]};Prop.prototype.keyOutTemporalEase=function(i){return this.keys[i-1][2]?.outEase||[{speed:0,influence:33}]};
Prop.prototype.setInterpolationTypeAtKey=function(i,a,b){let m=this.keys[i-1][2]??={};m.inType=a;m.outType=b};
Prop.prototype.setTemporalEaseAtKey=function(i,a,b){let m=this.keys[i-1][2]??={};m.inEase=a;m.outEase=b};
for(const type of ['TemporalContinuous','TemporalAutoBezier','SpatialContinuous','SpatialAutoBezier','Roving']){Prop.prototype['key'+type]=()=>false;Prop.prototype['set'+type+'AtKey']=()=>{}}
Prop.prototype.setSelectedAtKey=function(i,v){(this.keys[i-1][2]??={}).selected=v};
Prop.prototype.keyInSpatialTangent=()=>[0,0];Prop.prototype.keyOutSpatialTangent=()=>[0,0];Prop.prototype.setSpatialTangentsAtKey=()=>{};
const originalAdd=Prop.prototype.addProperty;
Prop.prototype.addProperty=function(name){let p=originalAdd.call(this,name);p.matchName=name;if(name==='ADBE Point Control'||name==='ADBE Layer Control')p.addProperty('value');if(name==='ADBE Vector Group'){let tf=p.addProperty('ADBE Vector Transform Group');for(const key of ['ADBE Vector Anchor','ADBE Vector Position','ADBE Vector Scale','ADBE Vector Rotation','ADBE Vector Group Opacity']){let prop=tf.addProperty(key);prop.value=key==='ADBE Vector Scale'?[100,100]:key==='ADBE Vector Group Opacity'?100:key.includes('Rotation')?0:[0,0];}}return p};
const getLayerProp=Layer.prototype.property;
Layer.prototype.property=function(name){if(name==='ADBE Transform Group'&&!this.properties[name]){let tf=new Prop(name);tf.parentProperty=this;this.properties[name]=tf;const map={'ADBE Position':'position','ADBE Scale':'scale','ADBE Opacity':'opacity','ADBE Rotate Z':'rotation','ADBE Anchor Point':'anchorPoint'};for(const [match,alias]of Object.entries(map)){let p=this.transform[alias];p.name=match;p.matchName=match;p.parentProperty=tf;p.propertyValueType=Array.isArray(p.value)?p.value.length:1;tf.children.push(p);}}const p=getLayerProp.call(this,name);if(p)p.parentProperty=this;return p};
Object.defineProperty(Layer.prototype,'index',{get(){return this.comp.arr.indexOf(this)+1}});
Layer.prototype.replaceSource=function(source){this.source=source};
Object.defineProperty(CompItem.prototype,'id',{get(){return this._id??=nextId++}});
Object.defineProperty(CompItem.prototype,'selectedProperties',{get(){return chosenProps}});
CompItem.prototype.layer=function(i){return typeof i==='string'?this.arr.find(l=>l.name===i):this.arr[i-1]};
CompItem.prototype.remove=function(){const i=projectItems.indexOf(this);if(i>=0)projectItems.splice(i,1)};
function cloneProp(p,parent){let q=new Prop(p.name);q.parentProperty=parent;q.value=JSON.parse(JSON.stringify(p.value));q.keys=JSON.parse(JSON.stringify(p.keys));q.expression=p.expression;q.children=p.children.map(c=>cloneProp(c,q));return q;}
CompItem.prototype.duplicate=function(){let c=addComp(this.name+' 2',this.width,this.height,1,this.duration,this.frameRate);c.comment=this.comment;c.arr=this.arr.map(l=>{let q=l instanceof TextLayer?new TextLayer(l.name,c):new Layer(l.name,c);q.source=l.source;q.inPoint=l.inPoint;q.outPoint=l.outPoint;for(const key of Object.keys(l.properties))q.properties[key]=cloneProp(l.properties[key],q);for(const key of Object.keys(l.transform))q.transform[key]=cloneProp(l.transform[key],null);return q});return c;};
function addComp(name,w,h,pixel,d,fps){let c=new CompItem(w,h,d,fps);c.name=name;c.resolutionFactor=[1,1];c.comment='';c.layers.addCamera=(name)=>{let l=new Layer(name,c);l.transform.pointOfInterest=new Prop('pointOfInterest');let camera=l.properties['ADBE Camera Options Group']=new Prop('ADBE Camera Options Group');camera.addProperty('ADBE Camera Zoom');c.arr.unshift(l);return l;};projectItems.push(c);return c;}
class FolderItem{constructor(name){this.id=nextId++;this.name=name}remove(){projectItems.splice(projectItems.indexOf(this),1)}}
class FootageItem{constructor(name,w,h){this.name=name;this.width=w;this.height=h;this.id=nextId++;this.file=null;projectItems.push(this)}}
class NativeFile{constructor(p){this.fsName=p;this.name=p.split('/').at(-1);this.exists=true;}open(){return true}read(){if(this.name==='carrousel-model.js')return fs.readFileSync(path.join(__dirname,'../js/carrousel-model.js'),'utf8');return JSON.stringify({})}close(){}remove(){this.exists=false}}
class NativeFolder{constructor(p){this.fsName=p;this.exists=true}create(){return true}getFiles(){return []}}
NativeFolder.temp={fsName:'/tmp'};
sandbox.app.project.items.addComp=addComp;sandbox.app.project.items.addFolder=name=>{let f=new FolderItem(name);projectItems.push(f);return f};
Object.defineProperties(sandbox.app.project,{numItems:{get(){return projectItems.length}},selection:{get(){return sandbox._selection||[]}}});
sandbox.app.project.item=i=>projectItems[i-1];sandbox.app.project.itemByID=id=>projectItems.find(x=>x.id===id);
sandbox.File=NativeFile;sandbox.Folder=NativeFolder;sandbox.FootageItem=FootageItem;sandbox.ImportOptions=class{constructor(file){this.file=file}canImportAs(){return true}};sandbox.ImportAsType={PROJECT:1};
sandbox.PropertyType={PROPERTY:1};sandbox.PropertyValueType={OneD:1,TwoD:2,ThreeD:3,SHAPE:4};sandbox.KeyframeEase=function(speed,influence){this.speed=speed;this.influence=influence};sandbox.KeyframeInterpolationType={LINEAR:1,BEZIER:2,HOLD:3};sandbox.BlendingMode={NORMAL:1,ADD:2};

const root=path.resolve(__dirname,'..'),bundle=fs.readFileSync(root+'/jsx/yagua-host.jsx','utf8'),acorn=require('acorn');
assert(!/^#include/m.test(bundle));acorn.parse(bundle,{ecmaVersion:3});
const nativeContext=vm.createContext(sandbox);sandbox.$={fileName:'',global:sandbox};sandbox.app.name='Adobe After Effects';sandbox.app.version='24.6';let loads=0,failLoad=false;
sandbox.$.evalFile=function(file){loads++;if(failLoad)throw {message:'Error línea 1: archivo "incompleto"',line:1,fileName:file.fsName};assert(file.fsName.endsWith('/jsx/yagua-host.jsx'));vm.runInContext(bundle,nativeContext,{filename:file.fsName});};
const bridgeSource=fs.readFileSync(root+'/js/ae-bridge.js','utf8');
function bridge(sysPath,replyOverride){const web={window:null,Promise,JSON,setTimeout,clearTimeout,location:{pathname:'/fallback/index.html'}};web.window=web;web.__adobe_cep__={getSystemPath(){return sysPath;},evalScript(script,cb){acorn.parse(script,{ecmaVersion:3});if(replyOverride)return cb(replyOverride);try{cb(vm.runInContext(script,nativeContext))}catch(e){cb('EvalScript error. '+e.message)}}};vm.runInNewContext(bridgeSource,web);return web.YaguaAEBridge;}
(async()=>{
 let bridgeAPI=bridge('file:///C:/Users/Jorge/Adobe%20CEP/YaguaTool');let health=await bridgeAPI.connect(false);assert(health.ok,JSON.stringify(health));assert.equal(health.data.modules.length,6);assert.equal(health.data.root,'C:/Users/Jorge/Adobe CEP/YaguaTool');assert.equal(loads,1);assert.equal(bridgeAPI.getState().status,'ready');
 // Real native API registration and dispatch, no canned success responses.
 let result=await bridgeAPI.call('tempDir',{});assert(result.ok);assert.equal(result.data,'/tmp');
 result=await bridgeAPI.call('text',{kind:'SR',mode:'in',dur:.8,dist:50,basedOn:'chars',startAt:'layer'});assert(result.ok,result.msg);assert(orig.property('ADBE Text Properties').property('ADBE Text Animators').numProperties>0);
 result=await bridgeAPI.call('ytLabDefault',{id:'invalid'});assert(!result.ok);assert(result.msg.includes('Preset no válido'),'native Lab actually dispatched');
 const one=new FootageItem('Source',800,600);sandbox._selection=[one];current.arr.forEach(l=>l.selected=false);result=await bridgeAPI.call('ytCarouselCreate',{config:{count:3,points:[[.1,.6],[.5,.3],[.9,.6]]}});assert(result.ok,result.msg);assert.equal(current.arr.filter(l=>l.source instanceof FootageItem).length,3);
 assert.equal(loads,1,'commands must reuse the verified host');await bridgeAPI.connect(true);assert.equal(loads,2,'explicit reconnect reloads');
 // Stale engine from another installed version must be replaced, not mistaken for ready.
 sandbox.Animix.yaguaVersion='3.0.0';bridgeAPI=bridge('/Users/Jorge/Library/Application Support/Adobe/CEP/extensions/YaguaTool');health=await bridgeAPI.connect();assert(health.ok,health.msg);assert.equal(loads,3);assert(health.data.root.startsWith('/Users/'));
 // Header readiness cannot be inferred merely from the CEP object.
 failLoad=true;sandbox.Animix=undefined;bridgeAPI=bridge('file:///C:/Users/Jorge/YaguaTool');const bad=await bridgeAPI.connect();assert(!bad.ok);assert(bad.msg.includes('línea 1'));assert(bad.msg.includes('"incompleto"'));assert.equal(bridgeAPI.getState().status,'error');failLoad=false;assert((await bridgeAPI.connect(true)).ok,'recovery after failed load');
 bridgeAPI=bridge('/another/path','EvalScript error.');assert(!(await bridgeAPI.connect()).ok);assert.equal(bridgeAPI.getState().status,'error');
 bridgeAPI=bridge('file:///C:/Users/Jo%C3%A3o/YaguaTool');assert.equal(bridgeAPI.root(),'C:/Users/João/YaguaTool');
 console.log('BRIDGE 3.0.1 PASS: packaged ES3 host; cold start; absolute Windows/macOS paths; stale version; actual text/Carousel dispatch; Lab registration; native errors; recovery; readiness');
})().catch(e=>{console.error(e);process.exit(1)});
