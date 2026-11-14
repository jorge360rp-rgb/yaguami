// YaguaTool 3.1.0 - generated self-contained CEP host. Run qa/build_host.py to update.
var YaguaHostBoot={version:"3.1.0",modules:[],errors:[]};

// MODULE host.jsx SHA256 64a803ccbd334cd05a4b1c03a9e8559e93fe009834260307888c2845dbc1eb24
try {
// BEGIN SHARED MASK MOTION 280
/* Shared ES3 geometry. Embedded verbatim in host.jsx by qa/sync_mask_motion.py. */
var YaguMaskMotion = (function () {
    var STEPS=16;
    function clamp(v){return Math.max(0,Math.min(1,v));}
    function number(o,k,d){var v=Number(o[k]);return o[k]===undefined||!isFinite(v)?d:v;}
    function isMask(k){return /^(MR[UDLR]|MSC|MDI)$/.test(k);}
    function progress(u,out){u=clamp(u);return out?u*u*u:1-Math.pow(1-u,4);}
    function rank(index,count,order){
        var indexes=[],i;for(i=0;i<count;i++)indexes.push(i);
        indexes.sort(function(a,b){
            if(order==="reverse")return b-a;
            if(order==="center")return Math.abs(a-(count-1)/2)-Math.abs(b-(count-1)/2)||a-b;
            if(order==="alternate")return (a%2)-(b%2)||a-b;
            return a-b;
        });
        for(i=0;i<count;i++)if(indexes[i]===index)return i;
        return 0;
    }
    function slices(kind){return kind==="MRR"?3:1;}
    function duration(o){return Math.max(.16,number(o,"dur",.82));}
    function gap(o){return Math.max(0,number(o,"stagger",.09));}
    function offset(kind,index,count,slice,o){return rank(index,count,o.order)*gap(o)+slice*duration(o)*.055;}
    function span(kind,count,o){return duration(o)+(Math.max(1,count)-1)*gap(o)+(slices(kind)-1)*duration(o)*.055;}
    function raw(kind,q,character,aspect,index,slice){
        q=clamp(q);var e=Math.max(.00001,q),strength=clamp(character/100),wave=Math.sin(Math.PI*q)*strength;
        var l=0,t=0,r=1,b=1,rx=0,ry=0,shear=0,bow=0,i;
        aspect=Math.max(.05,aspect);
        if(kind==="MRU"){t=1-e;ry=Math.min(e*.48,.26*wave);rx=ry/aspect;bow=.16*wave;}
        else if(kind==="MRD"){b=e;ry=Math.min(e*.48,.32*wave);rx=ry/aspect;bow=-.19*wave;}
        else if(kind==="MRL"){r=e;shear=.2*wave;ry=Math.min(.22*wave,e*aspect*.35);rx=ry/aspect;}
        else if(kind==="MRR"){l=1-e;shear=(slice%2?-.17:.17)*wave;}
        else if(kind==="MSC"){
            var h=Math.max(.00001,Math.sqrt(q));l=.5-e/2;r=.5+e/2;t=.5-h/2;b=.5+h/2;
            ry=Math.min(h*.49,e*aspect*.49)*strength*(1-q);rx=ry/aspect;
        }else {r=e;shear=.46*wave*(index%2?-1:1);}
        rx=Math.min(rx,(r-l)/2);ry=Math.min(ry,(b-t)/2);
        var v=[[l+rx,t],[r-rx,t],[r,t+ry],[r,b-ry],[r-rx,b],[l+rx,b],[l,b-ry],[l,t+ry]];
        var k=.55228475,ins=[[-rx*k,0],[0,0],[0,-ry*k],[0,0],[rx*k,0],[0,0],[0,ry*k],[0,0]],
            outs=[[0,0],[rx*k,0],[0,0],[0,ry*k],[0,0],[-rx*k,0],[0,0],[0,-ry*k]];
        // A curved leading edge for the two fabric-inspired vertical reveals.
        if(kind==="MRU"){outs[0]=[(r-l)*.32,-bow];ins[1]=[-(r-l)*.32,-bow];}
        if(kind==="MRD"){outs[4]=[-(r-l)*.32,-bow];ins[5]=[(r-l)*.32,-bow];}
        for(i=0;i<8;i++){
            v[i][0]+=shear*(v[i][1]-.5);
            ins[i][0]+=shear*ins[i][1];outs[i][0]+=shear*outs[i][1];
        }
        return {vertices:v,inTangents:ins,outTangents:outs};
    }
    function at(kind,u,o,aspect,index,slice,out){
        u=clamp(u);var frame=u*STEPS,lo=Math.floor(frame),mix=frame-lo;
        var a=raw(kind,progress(lo/STEPS,out),number(o,"character",65),aspect,index,slice),
            b=raw(kind,progress(Math.min(STEPS,lo+1)/STEPS,out),number(o,"character",65),aspect,index,slice),keys=["vertices","inTangents","outTangents"],i,j,key;
        for(i=0;i<keys.length;i++){key=keys[i];for(j=0;j<8;j++){
            a[key][j][0]+=(b[key][j][0]-a[key][j][0])*mix;
            a[key][j][1]+=(b[key][j][1]-a[key][j][1])*mix;
        }}
        return a;
    }
    function travel(kind,u,o,out){
        var distance=Math.max(0,number(o,"travel",24)),f=progress(u,out),x=0,y=0;
        if(kind==="MRU")y=distance;else if(kind==="MRD")y=-distance;
        else if(kind==="MRL")x=-distance;else if(kind==="MRR")x=distance;
        else if(kind==="MDI"){x=-distance;y=distance*.36;}
        else y=distance*.25;
        var amount=out?-f:1-f;return [x*amount,y*amount,0];
    }
    return {steps:STEPS,isMask:isMask,progress:progress,rank:rank,slices:slices,duration:duration,gap:gap,offset:offset,span:span,at:at,travel:travel};
})();
// END SHARED MASK MOTION 280
// Animix - host script (ExtendScript, ES3). Todas las funciones se invocan con Animix.call(nombre, jsonString)
if (typeof JSON === "undefined") {
    JSON = {};
    JSON.parse = function (s) { return eval("(" + s + ")"); };
    JSON.stringify = function str(v) {
        var t = typeof v, i, out;
        if (v === null || v === undefined) return "null";
        if (t === "number") return isFinite(v) ? String(v) : "null";
        if (t === "boolean") return String(v);
        if (t === "string") {
            return '"' + v.replace(/[\\"\u0000-\u001f\u2028\u2029]/g, function (c) {
                var m = { '"': '\\"', "\\": "\\\\", "\n": "\\n", "\r": "\\r", "\t": "\\t" };
                return m[c] || "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
            }) + '"';
        }
        if (v instanceof Array) { out = []; for (i = 0; i < v.length; i++) out.push(str(v[i])); return "[" + out.join(",") + "]"; }
        out = []; for (i in v) if (v.hasOwnProperty(i) && typeof v[i] !== "function") out.push(str(String(i)) + ":" + str(v[i]));
        return "{" + out.join(",") + "}";
    };
}

var Animix = (function () {
    var A = {}, api = {};
    A.api = api;

    // ---------- utilidades ----------
    function fail(m) { throw new Error(m); }
    function comp() {
        var c = app.project.activeItem;
        if (!(c instanceof CompItem)) fail("Abre y activa una composición.");
        return c;
    }
    function selLayers() {
        var s = comp().selectedLayers;
        if (!s.length) fail("Selecciona al menos una capa.");
        return s;
    }
    function textLayers() {
        var s = selLayers(), out = [], i;
        for (i = 0; i < s.length; i++) if (s[i] instanceof TextLayer) out.push(s[i]);
        if (!out.length) fail("Selecciona al menos una capa de texto.");
        return out;
    }
    function hex2rgb(h) {
        h = String(h).replace("#", "");
        return [parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255];
    }
    function rgb2hex(c) {
        var i, s = "#", x;
        for (i = 0; i < 3; i++) { x = Math.round(Math.max(0, Math.min(1, c[i])) * 255).toString(16); s += (x.length < 2 ? "0" : "") + x; }
        return s;
    }
    function fx(l) { return l.property("ADBE Effect Parade"); }
    function ctl(l, name, val, kind) {
        var e = fx(l).property(name);
        if (!e) {
            e = fx(l).addProperty(kind === "check" ? "ADBE Checkbox Control" : kind === "color" ? "ADBE Color Control" : "ADBE Slider Control");
            e.name = name;
        }
        e.property(1).setValue(val);
        return e;
    }
    function easeDims(p) {
        if (p.isSpatial) return 1;
        if (p.propertyValueType === PropertyValueType.TwoD) return 2;
        if (p.propertyValueType === PropertyValueType.ThreeD) return 3;
        return 1;
    }
    function easeKeys(p, infl, speed) {
        var i, d, n = easeDims(p), a, b;
        infl = infl || 55;
        for (i = 1; i <= p.numKeys; i++) {
            try {
                p.setInterpolationTypeAtKey(i, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
                a = []; b = [];
                for (d = 0; d < n; d++) { a.push(new KeyframeEase(speed || 0, infl)); b.push(new KeyframeEase(speed || 0, infl)); }
                p.setTemporalEaseAtKey(i, a, b);
            } catch (e) { }
        }
    }
    // Curvas direccionales para texto: entrada con llegada larga y salida con
    // aceleración progresiva. Los keyframes intermedios conservan el impulso.
    function easeMotionKeys(p, profile, isOut) {
        var i, d, n = easeDims(p), a, b, firstOut, lastIn, midIn, midOut;
        profile = profile || {};
        firstOut = isOut ? (profile.exitStart || 78) : (profile.enterStart || 26);
        lastIn = isOut ? (profile.exitEnd || 24) : (profile.enterEnd || 82);
        midIn = profile.midIn || 48;
        midOut = profile.midOut || 48;
        for (i = 1; i <= p.numKeys; i++) {
            try {
                p.setInterpolationTypeAtKey(i, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
                a = []; b = [];
                for (d = 0; d < n; d++) {
                    a.push(new KeyframeEase(0, i === p.numKeys ? lastIn : (i === 1 ? 33 : midIn)));
                    b.push(new KeyframeEase(0, i === 1 ? firstOut : (i === p.numKeys ? 33 : midOut)));
                }
                p.setTemporalEaseAtKey(i, a, b);
            } catch (e) { }
        }
    }
    function textEaseProfile(kind) {
        if (kind === "YDRIFT") return { enterStart: 15, enterEnd: 80, exitStart: 88, exitEnd: 14, midIn: 52, midOut: 36 };
        if (kind === "YSLOW") return { enterStart: 22, enterEnd: 94, exitStart: 88, exitEnd: 12, midIn: 60, midOut: 32 };
        if (kind === "YHERO") return { enterStart: 17, enterEnd: 92, exitStart: 86, exitEnd: 17, midIn: 58, midOut: 38 };
        if (kind === "KPU") return { enterStart: 14, enterEnd: 78, exitStart: 84, exitEnd: 18, midIn: 54, midOut: 40 };
        if (kind === "LIFT") return { enterStart: 18, enterEnd: 92, exitStart: 86, exitEnd: 16, midIn: 58, midOut: 38 };
        if (kind === "STAG") return { enterStart: 22, enterEnd: 90, exitStart: 84, exitEnd: 18, midIn: 58, midOut: 38 };
        if (kind === "SNAP") return { enterStart: 10, enterEnd: 72, exitStart: 88, exitEnd: 16, midIn: 56, midOut: 38 };
        if (kind === "EDITORIAL") return { enterStart: 16, enterEnd: 94, exitStart: 88, exitEnd: 16, midIn: 60, midOut: 36 };
        if (kind === "DEPTH") return { enterStart: 9, enterEnd: 76, exitStart: 90, exitEnd: 12, midIn: 50, midOut: 40 };
        if (kind === "GLIDE") return { enterStart: 20, enterEnd: 96, exitStart: 86, exitEnd: 18, midIn: 64, midOut: 34 };
        if (kind === "HWR") return { enterStart: 22, enterEnd: 86, exitStart: 82, exitEnd: 22 };
        if (kind === "CT") return { enterStart: 18, enterEnd: 90, exitStart: 84, exitEnd: 20 };
        if (kind === "SBL") return { enterStart: 26, enterEnd: 82, exitStart: 80, exitEnd: 24 };
        if (kind === "AFW" || kind === "AFL" || kind === "AFC") return { enterStart: 22, enterEnd: 86, exitStart: 82, exitEnd: 22 };
        if (kind === "EL" || kind === "SB") return { enterStart: 20, enterEnd: 72, exitStart: 78, exitEnd: 24, midIn: 48, midOut: 48 };
        if (kind === "O") return { enterStart: 24, enterEnd: 88, exitStart: 86, exitEnd: 22 };
        return { enterStart: 28, enterEnd: 78, exitStart: 78, exitEnd: 26 };
    }
    function scaleVal(v, k) { var o = [], i; for (i = 0; i < v.length; i++) o.push(v[i] * k); return o; }
    function startAt(l, o, isOut, d) {
        var delay = o.delay || 0;
        if (isOut) {
            if (o.startAt === "cti" && !o.both) return comp().time + delay;
            return l.outPoint - delay - d;
        }
        return (o.startAt === "cti" ? comp().time : l.inPoint) + delay;
    }
    function addBlur(l, name, amt, t0, t1, outDir) {
        var e = fx(l).addProperty("ADBE Gaussian Blur 2");
        e.name = name;
        var p = e.property(1);
        try { e.property(3).setValue(1); } catch (er) { }
        if (outDir) { p.setValueAtTime(t0, 0); p.setValueAtTime(t1, amt); }
        else { p.setValueAtTime(t0, amt); p.setValueAtTime(t1, 0); }
        easeMotionKeys(p, textEaseProfile("SR"), !!outDir);
    }

    // ---------- TEXTO ----------
    function dirVec(dir, dist, isOut) {
        var v = dir === "up" ? [0, dist] : dir === "down" ? [0, -dist] : dir === "left" ? [dist, 0] : [-dist, 0];
        // "dir" describe el sentido del movimiento: al entrar viene del lado opuesto, al salir se va hacia ese lado
        return isOut ? [-v[0], -v[1]] : v;
    }
    var TYPE = { chars: 1, nospace: 2, words: 3, lines: 4 };

    function buildAnimator(l, o, isOut, kind) {
        var anims = l.property("ADBE Text Properties").property("ADBE Text Animators");
        var a = anims.addProperty("ADBE Text Animator");
        a.name = "Animix " + kind + (isOut ? " Out" : " In");
        var ap = a.property("ADBE Text Animator Properties"), v = dirVec(o.dir, o.dist || 0, isOut);
        var plain = (kind === "O" || kind === "WO");
        if (!plain) {
            if (o.dist) ap.addProperty("ADBE Text Position 3D").setValue([v[0], v[1], 0]);
            if (o.rot) ap.addProperty("ADBE Text Rotation").setValue(isOut ? -o.rot : o.rot);
            if (o.scale !== undefined && o.scale != 100) ap.addProperty("ADBE Text Scale 3D").setValue([o.scale, o.scale, o.scale]);
            if (o.blur) ap.addProperty("ADBE Text Blur").setValue([o.blur, o.blur]);
        }
        if (o.fade !== false || ap.numProperties === 0) ap.addProperty("ADBE Text Opacity").setValue(0);
        var sels = a.property("ADBE Text Selectors");
        var sel = sels.numProperties ? sels.property(1) : sels.addProperty("ADBE Text Selector");
        var adv = sel.property("ADBE Text Range Advanced");
        try { adv.property("ADBE Text Range Type2").setValue(TYPE[o.basedOn] || 1); } catch (e1) { }
        try { adv.property("ADBE Text Selector Smoothness").setValue(o.overlap === undefined ? 100 : o.overlap); } catch (e2) { }
        // Tracking real de After Effects: expansión del espaciado por carácter.
        if (kind === "CT" || kind === "YHERO") {
            try { ap.addProperty("ADBE Text Tracking Amount").setValue(o.tracking === undefined ? 28 : o.tracking); } catch (eTrack) { }
        }
        sel.property("ADBE Text Percent Start").setValue(0);
        sel.property("ADBE Text Percent End").setValue(100);
        return sel.property("ADBE Text Percent Offset");
    }

    // Una fase no reemplaza la opuesta: permite IN Smart Reveal + OUT Smart Bounce.
    function removeAnimatorPhase(l, kind, isOut) {
        var group = l.property("ADBE Text Properties").property("ADBE Text Animators"), i;
        var target = "Animix " + kind + (isOut ? " Out" : " In");
        for (i=group.numProperties;i>=1;i--) {
            if (group.property(i).name === target) group.property(i).remove();
        }
    }
    function animText(l, o, kind) {
        var group=l.property("ADBE Text Properties").property("ADBE Text Animators"),ri;
        if(o.mode === "in" || o.mode === "inout")removeAnimatorPhase(l,kind,false);
        if(o.mode === "out" || o.mode === "inout")removeAnimatorPhase(l,kind,true);
        var d = o.dur || 0.8, t, off, both = (o.mode === "inout");
        o.both = both;
        if (o.mode === "in" || both) {
            off = buildAnimator(l, o, false, kind);
            t = startAt(l, o, false, d);
            off.setValueAtTime(t, 0); off.setValueAtTime(t + d, 100);
            easeMotionKeys(off, textEaseProfile(kind), false);
        }
        if (o.mode === "out" || both) {
            var offOut = buildAnimator(l, o, true, kind);
            t = startAt(l, o, true, d);
            offOut.setValueAtTime(t, -100); offOut.setValueAtTime(t + d, 0);
            easeMotionKeys(offOut, textEaseProfile(kind), true);
        }
    }

    // v2.0: a real, self-contained spring selector. It never writes Transform
    // keyframes, nor depends on the Range Selector's selectorValue.
    function editorialHighlight(l,o){
        // Degrada el color temporalmente solo en palabras seleccionadas.
        // No cambia Source Text, Fill base ni otros animadores de la capa.
        var group=l.property("ADBE Text Properties").property("ADBE Text Animators"), i;
        for(i=group.numProperties;i>=1;i--){
            if(group.property(i).name==="Animix YHERO Highlight")group.property(i).remove();
        }
        if(o.highlight===false)return;
        var col=ctl(l,"Yaguano Editorial Highlight",hex2rgb(o.highlightColor||"#ff9eaa"),"color");
        var a=group.addProperty("ADBE Text Animator");a.name="Animix YHERO Highlight";
        var ap=a.property("ADBE Text Animator Properties"), fill=ap.addProperty("ADBE Text Fill Color");
        fill.expression='effect("Yaguano Editorial Highlight")(1)';
        var sel=a.property("ADBE Text Selectors").property(1),
            adv=sel.property("ADBE Text Range Advanced"),
            off=sel.property("ADBE Text Percent Offset"),
            d=Math.max(.15,Number(o.dur)||.75), t=startAt(l,o,false,d);
        try{adv.property("ADBE Text Range Type2").setValue(3);}catch(no){}
        try{adv.property("ADBE Text Selector Smoothness").setValue(100);}catch(no2){}
        sel.property("ADBE Text Percent Start").setValue(0);
        sel.property("ADBE Text Percent End").setValue(24);
        off.setValueAtTime(t,-25);
        off.setValueAtTime(t+d,105);
        easeMotionKeys(off,textEaseProfile("YHERO"),false);
    }

    function elasticText(l,o,kind){
        var aGroup=l.property("ADBE Text Properties").property("ADBE Text Animators"),
            phases=o.mode==="inout"?[false,true]:[o.mode==="out"],i,old,j;
        for(i=0;i<phases.length;i++)removeAnimatorPhase(l,kind,phases[i]);
        for(i=0;i<phases.length;i++){
            var isOut=phases[i],d=Math.max(.12,Number(o.dur)||1),t=startAt(l,o,isOut,d),
                a=aGroup.addProperty("ADBE Text Animator");
            a.name="Animix "+kind+(isOut?" Out":" In");
            var ap=a.property("ADBE Text Animator Properties"),
                v=dirVec(o.dir,o.dist===undefined?36:Number(o.dist),isOut),s=a.property("ADBE Text Selectors");
            if(Number(o.dist)!==0)ap.addProperty("ADBE Text Position 3D").setValue([v[0],v[1],0]);
            if(o.scale!==undefined&&Number(o.scale)!==100)ap.addProperty("ADBE Text Scale 3D").setValue([Number(o.scale),Number(o.scale),Number(o.scale)]);
            if(Number(o.rot))ap.addProperty("ADBE Text Rotation").setValue(isOut?-Number(o.rot):Number(o.rot));
            if(Number(o.blur))ap.addProperty("ADBE Text Blur").setValue([Number(o.blur),Number(o.blur)]);
            if(o.fade!==false)ap.addProperty("ADBE Text Opacity").setValue(0);
            if(ap.numProperties===0)ap.addProperty("ADBE Text Position 3D").setValue([0,0,0]);
            // Range + Expression Selectors are not used together: multiplying
            // the range by an oscillating selector made the spring disappear.
            while(s.numProperties)s.property(s.numProperties).remove();
            var es=s.addProperty("ADBE Text Expressible Selector");
            es.property("ADBE Text Range Type2").setValue(TYPE[o.basedOn] || 1);
            es.name="Animix Spring Selector";
            var amt=es.property("ADBE Text Expressible Amount")||es.property(1),
                bounce=Math.max(0,Math.min(100,Number(o.bounce===undefined?25:o.bounce))),
                bounces=Math.max(1,Math.min(6,Number(o.bounces)||2)),
                overlap=Math.max(0,Math.min(100,Number(o.overlap===undefined?75:o.overlap)));
            // Sliders on the ORIGINAL text layer remain editable in AE.
            // Controles independientes por fase: retocar OUT no cambia el rebote IN.
            var suffix=isOut?" OUT":" IN";
            ctl(l,"Yaguano Spring Bounce"+suffix,bounce);
            ctl(l,"Yaguano Spring Bounces"+suffix,bounces);
            ctl(l,"Yaguano Spring Overlap"+suffix,overlap);
            amt.expression="// YAGUANO_SPRING_240\n"+
                "var n=Math.max(1,textTotal), i=textIndex-1;\n"+
                "var d="+d+",start="+t+";\n"+
                "var b=Math.max(0,Math.min(1,effect(\"Yaguano Spring Bounce"+suffix+"\")(1)/100));\n"+
                "var cycles=Math.max(1,Math.min(6,effect(\"Yaguano Spring Bounces"+suffix+"\")(1)));\n"+
                "var overlap=Math.max(0,Math.min(1,effect(\"Yaguano Spring Overlap"+suffix+"\")(1)/100));\n"+
                "var step=d*(0.16+(1-overlap)*0.26)/n;\n"+
                "var local=Math.max(.09,d-(n-1)*step);\n"+
                "var u=Math.max(0,Math.min(1,(time-start-i*step)/local));\n"+
                "var spring=(Math.pow(1-u,3)*(1-b)+b*Math.exp(-5*u)*Math.cos(6.28318530718*cycles*u));\n"+
                "var amount=(u>=1?0:100*spring);\n"+
                (isOut?"100-amount;":"amount;");
            // Effect controls are native and available without opening expressions.
            // Deliberately no per-letter wiggle() to keep preview cheap.
        }
    }

    // Whole Text 2.4: utiliza un selector de expresión sobre el animador de texto.
    // Evita escribir en Transform y preserva todos los keyframes del editor.
    function wholeText(l,o,bounce){
        var kind=bounce?"WB":"WR", phases=o.mode==="inout"?[false,true]:[o.mode==="out"];
        var i,a,ap,s,es,amt,t,d,v,isOut,ease;
        for(i=0;i<phases.length;i++){
            isOut=phases[i];removeAnimatorPhase(l,kind,isOut);
            d=Math.max(.12,Number(o.dur)||.8);
            t=startAt(l,o,isOut,d);
            v=dirVec(o.dir,Number(o.dist)||0,isOut);
            a=l.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator");
            a.name="Animix "+kind+(isOut?" Out":" In");
            ap=a.property("ADBE Text Animator Properties");
            if(Number(o.dist))ap.addProperty("ADBE Text Position 3D").setValue([v[0],v[1],0]);
            if(Number(o.scale)!==100&&o.scale!==undefined)ap.addProperty("ADBE Text Scale 3D").setValue([Number(o.scale),Number(o.scale),Number(o.scale)]);
            if(Number(o.rot))ap.addProperty("ADBE Text Rotation").setValue(isOut?-Number(o.rot):Number(o.rot));
            if(Number(o.blur))ap.addProperty("ADBE Text Blur").setValue([Number(o.blur),Number(o.blur)]);
            if(o.fade!==false||ap.numProperties===0)ap.addProperty("ADBE Text Opacity").setValue(0);
            s=a.property("ADBE Text Selectors");
            while(s.numProperties)s.property(s.numProperties).remove();
            es=s.addProperty("ADBE Text Expressible Selector");
            amt=es.property("ADBE Text Expressible Amount")||es.property(1);
            ease=Math.max(0,Math.min(0.6,Number(o.bounce===undefined?25:o.bounce)/100));
            amt.expression="// YAGUANO_WHOLE_240\n"+
                "var u=Math.max(0,Math.min(1,(time-"+t+")/"+d+"));\n"+
                "var q=u*u*(3-2*u);\n"+
                (bounce&&!isOut?"q+=("+ease+")*Math.sin(u*Math.PI*4)*Math.pow(1-u,2);\n":"")+
                (isOut?"100*q;":"100*(1-q);");
        }
    }

    function wiggleOpacity(l, o) {
        var d = o.dur || 0.8, passes = (o.mode === "inout") ? [false, true] : [o.mode === "out"], i, isOut, t;
        o.both = (o.mode === "inout");
        for (i = 0; i < passes.length; i++) {
            isOut = passes[i];
            removeAnimatorPhase(l,"WO",isOut);
            var a = l.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator");
            a.name = "Animix WO " + (isOut ? "Out" : "In");
            a.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity").setValue(0);
            var sels = a.property("ADBE Text Selectors");
            var sel = sels.numProperties ? sels.property(1) : sels.addProperty("ADBE Text Selector");
            try { sel.property("ADBE Text Range Advanced").property("ADBE Text Range Type2").setValue(TYPE[o.basedOn] || 1); } catch (e) { }
            var w = sels.addProperty("ADBE Text Wiggly Selector");
            try { w.property("ADBE Text Temporal Freq").setValue(o.freq || 8); } catch (e3) { }
            try { w.property("ADBE Text Correlation").setValue(0); } catch (e4) { }
            var mx = w.property("ADBE Text Wiggly Max Amount"), mn = w.property("ADBE Text Wiggly Min Amount");
            t = startAt(l, o, isOut, d);
            // In: empieza parpadeando fuerte y se asienta; el rango base (0->100 offset) hace de "máscara"
            var off = sel.property("ADBE Text Percent Offset");
            sel.property("ADBE Text Percent Start").setValue(0); sel.property("ADBE Text Percent End").setValue(100);
            if (!isOut) { off.setValueAtTime(t, 0); off.setValueAtTime(t + d, 100); }
            else { off.setValueAtTime(t, -100); off.setValueAtTime(t + d, 0); }
            easeMotionKeys(off, textEaseProfile("O"), isOut);
            if(mx)mx.setValue(0); if(mn)mn.setValue(-100);
        }
    }

    function sliderRef(n) { return 'effect("' + n + '")(1)'; }

    function numberText(l, o) {
        var d = o.dur || 2;
        ctl(l, "Num Start", o.start === undefined ? 0 : o.start); ctl(l, "Num End", o.end === undefined ? 100 : o.end);
        ctl(l, "Num Duration", d); ctl(l, "Num Delay", o.delay || 0);
        var st = o.startAt === "cti" ? comp().time : l.inPoint;
        var ex =
            "// YAGUANIMIX_NUMBER\nvar s=" + sliderRef("Num Start") + ", e=" + sliderRef("Num End") + ", d=" + sliderRef("Num Duration") + ", dl=" + sliderRef("Num Delay") + ";\n" +
            "var t0=" + st + "+dl; var p=Math.min(Math.max((time-t0)/d,0),1);\n" +
            "p = p*p*(3-2*p);\n" +
            "var v=s+(e-s)*p; var dec=" + (o.decimals || 0) + ";\n" +
            "var str=v.toFixed(dec);\n" +
            (o.sep ? "var parts=str.split('.'); parts[0]=parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g,'" + o.sep + "'); str=parts.join('.');\n" : "") +
            JSON.stringify(String(o.prefix || "")) + "+str+" + JSON.stringify(String(o.suffix || "")) + ";";
        l.property("ADBE Text Properties").property("ADBE Text Document").expression = ex;
    }

    function timerText(l, o) {
        var d = o.dur || 10;
        ctl(l, "Timer Start", o.start === undefined ? 0 : o.start); ctl(l, "Timer End", o.end === undefined ? 60 : o.end); ctl(l, "Timer Duration", d);
        var st = o.startAt === "cti" ? comp().time : l.inPoint;
        var fmt = o.format || "mm:ss";
        var ex =
            "// YAGUANIMIX_TIMER\nfunction z(n,l){var s=''+Math.floor(Math.abs(n));while(s.length<(l||2))s='0'+s;return s;}\n" +
            "var s=" + sliderRef("Timer Start") + ", e=" + sliderRef("Timer End") + ", d=" + sliderRef("Timer Duration") + ";\n" +
            "var p=Math.min(Math.max((time-" + st + ")/d,0),1); var v=s+(e-s)*p; var neg=v<0?'-':''; v=Math.abs(v);\n" +
            "var h=Math.floor(v/3600), m=Math.floor((v%3600)/60), sc=Math.floor(v%60), ms=Math.floor((v%1)*100), fr=Math.floor((v%1)*thisComp.frameDuration>0?(v%1)/thisComp.frameDuration:0);\n";
        if (fmt === "hh:mm:ss") ex += "neg+z(h)+':'+z(m)+':'+z(sc);";
        else if (fmt === "mm:ss:ff") ex += "neg+z(Math.floor(v/60))+':'+z(sc)+':'+z(fr);";
        else if (fmt === "ss.ms") ex += "neg+z(Math.floor(v),2)+'.'+z(ms);";
        else if (fmt === "mm:ss.ms") ex += "neg+z(Math.floor(v/60))+':'+z(sc)+'.'+z(ms);";
        else ex += "neg+z(Math.floor(v/60))+':'+z(sc);";
        l.property("ADBE Text Properties").property("ADBE Text Document").expression = ex;
    }

    // Typewriter 2.4: progreso IN y OUT separado. Nunca borra los keyframes
    // de la otra fase; conserva la edición del texto mediante Source Text.
    function twProgress(l,name,defaultValue){
        var e=fx(l).property(name);
        if(!e){e=fx(l).addProperty("ADBE Slider Control");e.name=name;e.property(1).setValue(defaultValue);}
        return e.property(1);
    }
    function typewriter(l,o){
        var d=Math.max(.1,Number(o.dur)||2),isOut=o.mode==="out"||o.twMode==="delete",t=startAt(l,o,isOut,d),i;
        var doc=l.property("ADBE Text Properties").property("ADBE Text Document");
        if(doc.expression && doc.expression.indexOf("YAGUANIMIX_TW")<0)fail("Source Text tiene una expresión ajena. Se ha protegido para no sobrescribirla.");
        var pin=twProgress(l,"Yaguano TW IN",100),pout=twProgress(l,"Yaguano TW OUT",0);
        // Migración de un typewriter anterior: reutilizar su entrada cuando
        // se añade la primera salida, en lugar de ocultar la escritura previa.
        var legacy=fx(l).property("TW Progress");
        if(isOut && pin.numKeys===0 && legacy && legacy.property(1).numKeys>0){
            var old=legacy.property(1);
            for(i=1;i<=old.numKeys;i++)pin.setValueAtTime(old.keyTime(i),old.keyValue(i));
        }
        var p=isOut?pout:pin;
        while(p.numKeys>0)p.removeKey(1);
        p.setValueAtTime(t,isOut?0:0);
        p.setValueAtTime(t+d,100);
        for(i=1;i<=p.numKeys;i++)p.setInterpolationTypeAtKey(i,KeyframeInterpolationType.LINEAR);
        ctl(l,"TW Cursor Blink",o.blink===undefined?2:o.blink);
        var cursor=o.cursor?String(o.cursorChar||"|"):"";
        cursor=cursor.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/[\r\n]/g,"");
        doc.expression="// YAGUANIMIX_TW_240\n"+
          "var full=value.toString();\n"+
          "var a=Math.max(0,Math.min(1,effect(\"Yaguano TW IN\")(1)/100));\n"+
          "var b=Math.max(0,Math.min(1,effect(\"Yaguano TW OUT\")(1)/100));\n"+
          "var n=Math.round(full.length*a*(1-b));\n"+
          "var c='"+cursor+"',hz=effect(\"TW Cursor Blink\")(1);\n"+
          "var blink=(hz<=0||Math.floor(time*hz*2)%2===0);\n"+
          "full.substr(0,n)+(c&&blink&&n>0&&n<full.length?c:'');";
    }

    // ---------- NATIVE CREATIVE MASK REVEALS 2.8 ----------
    // The mask is created on the selected text layer, not an approximate overlay.
    // Existing user masks are never overwritten. Only named Animix masks are removed.
    function removeMaskReveal(l,phase) {
        var ms=l.property("ADBE Mask Parade"),j,n=0,nm;
        if(!ms)return 0;
        for(j=ms.numProperties;j>=1;j--){
            nm=ms.property(j).name;
            if(nm.indexOf("Animix Mask Reveal ")!==0)continue;
            if(!phase || nm.indexOf("Animix Mask Reveal "+phase+" ")===0 ||
               (phase==="IN" && nm.indexOf("Animix Mask Reveal IN ")!==0 && nm.indexOf("Animix Mask Reveal OUT ")!==0)){
                ms.property(j).remove();n++;
            }
        }
        return n;
    }
    function normalizeMaskExit(l){
        var ms=l.property("ADBE Mask Parade"),j,m,hasIn=false,exits=[];
        if(!ms)return;
        for(j=1;j<=ms.numProperties;j++)if(ms.property(j).name.indexOf("Animix Mask Reveal IN ")===0)hasIn=true;
        for(j=1;j<=ms.numProperties;j++){
            m=ms.property(j);
            if(m.name.indexOf("Animix Mask Reveal OUT ")!==0)continue;
            // v280 uses independent subtractive apertures. Legacy exits keep their geometry/mode.
            m.maskMode=m.name.indexOf(" v280")>=0?MaskMode.SUBTRACT:(hasIn?MaskMode.INTERSECT:MaskMode.ADD);
            exits.push(m);
        }
        for(j=0;j<exits.length;j++)try{exits[j].moveTo(ms.numProperties);}catch(ignoreOrder){}
    }
    function maskLineCount(l){
        var doc=l.property("ADBE Text Properties").property("ADBE Text Document").value;
        return Math.max(1,Math.min(20,String(doc.text||"").replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n").length));
    }
    function maskTravel(l,o,kind,line,count,t,d,isOut){
        if(Number(o.travel)===0)return;
        var an=l.property("ADBE Text Properties").property("ADBE Text Animators"),
            a=an.addProperty("ADBE Text Animator"),suffix=isOut?" Out":" In",j;
        a.name="Animix MaskMotion "+kind+" Line "+(line+1)+suffix;
        var pos=a.property("ADBE Text Animator Properties").addProperty("ADBE Text Position 3D"),
            selector=a.property("ADBE Text Selectors").property(1),adv=selector.property("ADBE Text Range Advanced");
        adv.property("ADBE Text Range Type2").setValue(4);
        adv.property("ADBE Text Selector Smoothness").setValue(0);
        selector.property("ADBE Text Percent Start").setValue(100*line/count);
        selector.property("ADBE Text Percent End").setValue(100*(line+1)/count);
        selector.property("ADBE Text Percent Offset").setValue(0);
        for(j=0;j<=YaguMaskMotion.steps;j++){
            pos.setValueAtTime(t+d*j/YaguMaskMotion.steps,YaguMaskMotion.travel(kind,j/YaguMaskMotion.steps,o,isOut));
            pos.setInterpolationTypeAtKey(j+1,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);
        }
    }
    function maskReveal(l,o,kind){
        var ms=l.property("ADBE Mask Parade"),j,m,mode=o.mode||"in";
        if(!ms)fail("No es posible crear máscaras en esta capa.");
        for(j=1;j<=ms.numProperties;j++)if(ms.property(j).name.indexOf("Animix Mask Reveal ")!==0)
            fail("La capa '"+l.name+"' ya tiene máscaras manuales. Para protegerlas, duplica el texto antes de aplicar un revelado.");
        if(mode==="inout"){
            var c1={},k;for(k in o)if(o.hasOwnProperty(k))c1[k]=o[k];
            c1.mode="in";maskReveal(l,c1,kind);c1.mode="out";maskReveal(l,c1,kind);return 2;
        }
        var isOut=mode==="out";removeMaskReveal(l,isOut?"OUT":"IN");
        var animators=l.property("ADBE Text Properties").property("ADBE Text Animators"),suffix=isOut?" Out":" In";
        for(j=animators.numProperties;j>=1;j--){var name=animators.property(j).name;
            if(name.indexOf("Animix MaskMotion ")===0&&name.slice(-suffix.length)===suffix)animators.property(j).remove();
        }
        var r=l.sourceRectAtTime(Math.min(l.outPoint-.001,Math.max(l.inPoint+.001,comp().time)),false);
        if(!r||r.width<=0||r.height<=0)fail("El texto no tiene un rectángulo visible para revelar.");
        var count=maskLineCount(l),d=YaguMaskMotion.duration(o),span=YaguMaskMotion.span(kind,count,o),
            ff=Math.max(0,Math.min(22,Number(o.feather)||0)),pad=10+ff*1.8,
            x1=r.left-pad,x2=r.left+r.width+pad,yTop=r.top-pad,yBottom=r.top+r.height+pad,
            t0=startAt(l,o,isOut,span),slices=YaguMaskMotion.slices(kind),slice,frame,shape,g,t,y1,y2,ph,lineTop,lineBottom,i;
        for(j=0;j<count;j++){
            lineTop=yTop+(yBottom-yTop)*j/count;lineBottom=yTop+(yBottom-yTop)*(j+1)/count;
            t=t0+YaguMaskMotion.offset(kind,j,count,0,o);
            maskTravel(l,o,kind,j,count,t,d,isOut);
            for(slice=0;slice<slices;slice++){
                m=ms.addProperty("ADBE Mask Atom");
                m.name="Animix Mask Reveal "+(isOut?"OUT ":"IN ")+kind+" "+(j+1)+"."+(slice+1)+" v280";
                m.maskMode=isOut?MaskMode.SUBTRACT:MaskMode.ADD;
                y1=lineTop+(lineBottom-lineTop)*slice/slices;y2=lineTop+(lineBottom-lineTop)*(slice+1)/slices;
                t=t0+YaguMaskMotion.offset(kind,j,count,slice,o);ph=m.property("ADBE Mask Shape")||m.property(1);
                for(frame=0;frame<=YaguMaskMotion.steps;frame++){
                    g=YaguMaskMotion.at(kind,frame/YaguMaskMotion.steps,o,(x2-x1)/(y2-y1),j,slice,isOut);
                    shape=new Shape();shape.vertices=[];shape.inTangents=[];shape.outTangents=[];shape.closed=true;
                    for(i=0;i<8;i++){
                        shape.vertices.push([x1+g.vertices[i][0]*(x2-x1),y1+g.vertices[i][1]*(y2-y1)]);
                        shape.inTangents.push([g.inTangents[i][0]*(x2-x1),g.inTangents[i][1]*(y2-y1)]);
                        shape.outTangents.push([g.outTangents[i][0]*(x2-x1),g.outTangents[i][1]*(y2-y1)]);
                    }
                    ph.setValueAtTime(t+d*frame/YaguMaskMotion.steps,shape);
                    ph.setInterpolationTypeAtKey(frame+1,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);
                }
                m.property("ADBE Mask Feather").setValue([ff,ff]);
            }
        }
        normalizeMaskExit(l);return count*slices;
    }

    function syncMaskToSweepOverlays(src,o,kind){
        var c=comp(),tag="[S"+src.id+"]",i,l,n=0;
        for(i=1;i<=c.numLayers;i++){
            l=c.layer(i);
            if(l instanceof TextLayer && l.name.indexOf("Animix Sweep ")===0 && l.name.indexOf(tag)>=0){
                maskReveal(l,o,kind);n++;
            }
        }
        return n;
    }
    function removeNativePhase(l,phase){
        var isOut=phase==="OUT",an=l.property("ADBE Text Properties").property("ADBE Text Animators"),
            ef=fx(l),i,nm,suffix=isOut?" Out":" In";
        for(i=an.numProperties;i>=1;i--){
            nm=an.property(i).name;
            if((nm.indexOf("Animix ")===0 && nm.slice(-suffix.length)===suffix) ||
               (!isOut && nm==="Animix YHERO Highlight"))an.property(i).remove();
        }
        removeMaskReveal(l,phase);normalizeMaskExit(l);
        // Solo controles de la fase, nunca los de la otra. No se borran
        // los keyframes ni las expresiones personales.
        for(i=ef.numProperties;i>=1;i--){
            nm=ef.property(i).name;
            if(nm.indexOf("Yaguano Spring ")===0 && nm.slice(-phase.length)===phase)ef.property(i).remove();
        }
    }

    function validateTextPhase(ls,o){
        var c=comp(),t=c.time+Math.max(0,Number(o.delay)||0),d,i,l,ends=[];
        if(o.mode!=="out"||o.startAt!=="cti")return;
        for(i=0;i<ls.length;i++){
            l=ls[i];d=YaguMaskMotion.isMask(o.kind)?YaguMaskMotion.span(o.kind,maskLineCount(l),o):Math.max(.1,Number(o.dur)||.8);
            if(t<0||t+d>c.duration+.00001)fail("La salida completa, incluida la cadencia, termina fuera de la composición. Mueve el cabezal o reduce la duración.");
            if(l.locked)fail("Desbloquea la capa de texto '"+l.name+"'.");
            if(t<l.inPoint)fail("El cabezal está antes del inicio de la capa '"+l.name+"'.");
            ends.push(t+d);
        }
        for(i=0;i<ls.length;i++)if(ls[i].outPoint<ends[i])ls[i].outPoint=ends[i];
    }
    function validateMaskSetup(l){
        if(l.locked)fail("Desbloquea la capa de texto '"+l.name+"'.");
        var ms=l.property("ADBE Mask Parade"),i;
        if(!ms)fail("No es posible crear máscaras en esta capa.");
        for(i=1;i<=ms.numProperties;i++)if(ms.property(i).name.indexOf("Animix Mask Reveal ")!==0)
            fail("La capa '"+l.name+"' ya tiene máscaras manuales. Para protegerlas, duplica el texto antes de aplicar un revelado.");
    }
    function applyTextPreset(l,o,kind){
            if (/^MR[UDLR]$/.test(kind) || kind==="MSC" || kind==="MDI") {maskReveal(l, o, kind);syncMaskToSweepOverlays(l,o,kind);}
            else if (kind === "SB") elasticText(l, o, "SB");
            else if (kind === "SR" || kind === "O") animText(l, o, kind);
            else if (kind === "HWR" || kind === "CT" || kind === "SBL" || kind === "AFW" || kind === "AFL" || kind === "AFC" ||
                kind === "YDRIFT" || kind === "YSLOW" || kind === "YHERO" || kind === "KPU" || kind === "LIFT" || kind === "STAG" || kind === "SNAP" || kind === "EDITORIAL" || kind === "DEPTH" || kind === "GLIDE") { animText(l, o, kind); if(kind==="YHERO" && o.mode!=="out") editorialHighlight(l,o); }
            else if (kind === "EL") elasticText(l, o, "EL");
            else if (kind === "WR") wholeText(l, o, false);
            else if (kind === "WB") wholeText(l, o, true);
            else if (kind === "WO") wiggleOpacity(l, o);
            else if (kind === "N") numberText(l, o);
            else if (kind === "TM") timerText(l, o);
            else if (kind === "TW") typewriter(l, o);
            else fail("Preset desconocido: " + kind);
        // Apple-inspired: movimiento nativo primero, resplandor solo a petición.
        // Nunca sobrescribimos Source Text ni añadimos 3 trails sin confirmación.
        if ((kind === "AFW" || kind === "AFL" || kind === "AFC") && o.lightAccent) {
            var copy = { colors:["#83b9ff","#aaa0ff","#ddbbf9"], band:100, separation:.3,
                glow:17, feather:.75, blur:"soft", dur:o.dur || .9, delay:o.delay || 0,
                lineMode:kind === "AFL" ? "sequential" : "all", lineGap:.05,
                mode:o.mode || "in", startAt:o.startAt, reveal:"follow" };
            api.colorSweep(copy, [l]);
        }
    }

    api.text = function (o) {
        var ls = textLayers(), i, kind = o.kind;
        if(o.mode==="out")o.startAt="cti";
        if((kind==="N"||kind==="TM") && o.mode==="out")fail("Números y temporizador son generadores de contenido. Elige un preset visual para OUT.");
        if(YaguMaskMotion.isMask(kind))for(i=0;i<ls.length;i++)validateMaskSetup(ls[i]);
        validateTextPhase(ls,o);
        for (i = 0; i < ls.length; i++) {
            var l = ls[i];
            // Reemplaza el preset anterior de ESTA fase, no el otro.
            // Los animadores ajenos a Yaguanimix no se modifican.
            removeNativePhase(l,o.mode==="out"?"OUT":"IN");
            applyTextPreset(l,o,kind);
        }
        return { msg: "Aplicado " + kind + " a " + ls.length + " capa(s) de texto" };
    };


    // Uses the production dispatcher; optional PNG frames are AE renders, not CSS.
    api.previewText = function(o){
        var kind=o.kind||"SR",config=o.params||{},cfg={},k,original=app.project.activeItem;
        for(k in config)if(config.hasOwnProperty(k))cfg[k]=config[k];
        cfg.mode=config.mode==="out"?"out":"in";
        if((kind==="N"||kind==="TM")&&cfg.mode==="out")fail("Elige IN para previsualizar este generador de contenido.");
        cfg.startAt="cti";cfg.delay=Math.max(0,Number(config.delay)||0);
        if(kind==="TW")cfg.twMode=cfg.mode==="out"?"delete":"type";
        var duration=Math.max(.1,Number(cfg.dur)||.8), lead=cfg.mode==="out"?.6:0;
        var total=lead+cfg.delay+(YaguMaskMotion.isMask(kind)?YaguMaskMotion.span(kind,2,cfg):duration)+.8;
        var pc=app.project.items.addComp("Animix Preview "+kind+" (real)",900,440,1,Math.max(2,total),30);
        var folder=null,frames=[],rendered=!!o.renderFrames;
        try{
            pc.bgColor=[.07,.085,.13];pc.openInViewer();pc.time=lead;
            var t=pc.layers.addText("CREATIVE MOTION\rDESIGN WITH TYPE"); t.name="Preview - "+kind;t.selected=true;
            var td=t.property("ADBE Text Properties").property("ADBE Text Document"),doc=td.value;
            doc.fontSize=62;doc.fillColor=[.94,.96,1];doc.applyFill=true;
            try{doc.justification=ParagraphJustification.CENTER_JUSTIFY;}catch(just){}
            td.setValue(doc);t.transform.position.setValue([450,190]);
            applyTextPreset(t,cfg,kind);
            if(rendered){
                // A fixed, extension-owned temp cache bounds disk use across requests.
                folder=new Folder(Folder.temp.fsName+"/Yaguanimix-text-preview");
                if(!folder.exists&&!folder.create())fail("No se pudo crear la carpeta temporal de previews.");
                var old=folder.getFiles("frame-*.png"),j;
                for(j=0;j<old.length;j++)if(old[j] instanceof File)old[j].remove();
                var count=Math.min(180,Math.max(2,Math.ceil(total*12)+1)),fps=(count-1)/total;
                pc.resolutionFactor=[2,2];
                for(j=0;j<count;j++){
                    var file=new File(folder.fsName+"/frame-"+("0000"+j).slice(-4)+".png");
                    pc.saveFrameToPng(Math.min(pc.duration-pc.frameDuration,j/fps),file);
                    if(!file.exists)fail("After Effects no ha guardado el fotograma de preview.");
                    var nativePath=file.fsName.replace(/\\/g,"/");
                    frames.push("file://"+(nativePath.charAt(0)==="/"?"":"/")+encodeURI(nativePath).replace(/#/g,"%23").replace(/\?/g,"%3F"));
                }
                return {msg:"Preview renderizada por After Effects",data:{frames:frames,fps:fps,duration:total}};
            }
            pc.time=0;pc.openInViewer();
            return {msg:"Preview nativa "+cfg.mode.toUpperCase()+" creada: "+pc.name+". Pulsa espacio para verla en AE."};
        }catch(err){
            if(!rendered)try{pc.remove();}catch(ignoreFailed){}
            throw new Error("No se pudo generar la preview: "+err.message+(rendered?". Comprueba en Preferencias > Scripts y expresiones que AE permite escribir archivos.":""));
        }finally{
            if(rendered){
                try{pc.remove();}catch(ignoreRemove){}
                try{if(original instanceof CompItem)original.openInViewer();}catch(ignoreRestore){}
            }
        }
    };

    api.removeTextPhase=function(o){
        var ls=textLayers(),phase=o.phase==="out"?"OUT":"IN",i,p,n=0;
        for(i=0;i<ls.length;i++){
            removeNativePhase(ls[i],phase);n++;
            p=fx(ls[i]).property("Yaguano TW "+phase);
            if(p){
                while(p.property(1).numKeys)p.property(1).removeKey(1);
                p.property(1).setValue(phase==="IN"?100:0);
            }
        }
        return {msg:"Fase "+phase+" retirada de "+n+" capas. La fase contraria se conserva."};
    };

    api.removeText = function () {
        var ls = textLayers(), i, j, n = 0;
        for (i = 0; i < ls.length; i++) {
            sweepRemoveForSource(comp(),ls[i]);
            n+=removeMaskReveal(ls[i]);
            var an = ls[i].property("ADBE Text Properties").property("ADBE Text Animators");
            for (j = an.numProperties; j >= 1; j--) if (an.property(j).name.indexOf("Animix") === 0) { an.property(j).remove(); n++; }
            var ef = fx(ls[i]);
            for (j = ef.numProperties; j >= 1; j--) {
                var nm = ef.property(j).name;
                if (nm.indexOf("Animix") === 0 || nm.indexOf("Yaguano Spring ") === 0 || nm.indexOf("Num ") === 0 || nm.indexOf("Timer ") === 0 || nm.indexOf("TW ") === 0 || nm.indexOf("Yaguano TW ") === 0 || nm.indexOf("Yaguano Zoom ") === 0 || nm.indexOf("Yaguano FX ") === 0) ef.property(j).remove();
            }
            try { var doc=ls[i].property("ADBE Text Properties").property("ADBE Text Document");
                if (doc.expression && doc.expression.indexOf("YAGUANIMIX_")>=0) doc.expression="";
            } catch (e) { }
        }
        try {
            var cc = comp(), z;
            for (z = cc.numLayers; z >= 1; z--) if (/^Animix Trail [1-3]( Line \d+)?$/.test(cc.layer(z).name)) { cc.layer(z).remove(); n++; }
        } catch (erem) {}
        return { msg: "Se quitaron " + n + " elementos Animix" };
    };


    // ---------- YAGUANO COLOR SWEEP 2.0 ----------
    // The color is applied by native Text Animators ON the original layer.
    // It therefore inherits masks, text reveal, Scale/Position, source-text
    // expressions and ALL existing keyframes without replicating the text.
    function sweepLineBounds(txt){
        var lines=String(txt).replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n"),b=[],i,at=0;
        for(i=0;i<lines.length;i++){b.push([at,at+lines[i].length]);at+=lines[i].length+1;}
        return b;
    }
    function sweepTextRect(src,t){
        try{return src.sourceRectAtTime(t,false);}catch(e){return {left:0,top:0,width:400,height:100};}
    }
    function sweepRemoveForSource(c,src){
        var j,n=0,tag="[S"+src.id+"]",l,a,f;
        for(j=c.numLayers;j>=1;j--){
            l=c.layer(j);
            if(l.name.indexOf("Animix Sweep ")===0&&l.name.indexOf(tag)>=0){l.remove();n++;}
        }
        a=src.property("ADBE Text Properties").property("ADBE Text Animators");
        for(j=a.numProperties;j>=1;j--){
            if(a.property(j).name.indexOf("Animix Sweep ")===0){a.property(j).remove();n++;}
        }
        f=fx(src);
        for(j=f.numProperties;j>=1;j--)if(f.property(j).name.indexOf("Yaguano Sweep ")===0)f.property(j).remove();
        return n;
    }
    function sweepSyncStart(src,c,o,dur){
        return (o.startAt==="cti"?c.time:(o.mode==="out"?src.outPoint-dur:src.inPoint))+(Number(o.delay)||0);
    }
    function sweepNativeProgress(src,o,dur,t0){
        var a=src.property("ADBE Text Properties").property("ADBE Text Animators"),
            j,s,p,tag,progress=ctl(src,"Yaguano Sweep Progress",0),
            control=progress.property(1),source=null,selectedName="";
        // Find the most recently applied incoming animator with an actual
        // animated Offset. Ignore all Sweep/Out animators and static selectors.
        if(o.reveal==="follow")for(j=a.numProperties;j>=1;j--){
            tag=a.property(j).name;
            if(tag.indexOf("Animix ")!==0||tag.indexOf(" Out")>=0||tag.indexOf("Sweep")>=0)continue;
            try{
                s=a.property(j).property("ADBE Text Selectors");
                p=s.property(1).property("ADBE Text Percent Offset");
                if(p&&p.numKeys>1){source=p;selectedName=tag;break;}
            }catch(ex){}
        }
        if(source){
            try{
                for(j=1;j<=source.numKeys;j++){
                    var tm=source.keyTime(j)+(Number(o.delay)||0),v=source.keyValue(j);
                    // Incoming range: 0 -> 100; outgoing: -100 -> 0.
                    control.setValueAtTime(tm,Math.max(0,Math.min(100,v)));
                }
                for(j=1;j<=source.numKeys;j++){
                    try{control.setInterpolationTypeAtKey(j,source.keyInInterpolationType(j),source.keyOutInterpolationType(j));}catch(ki){}
                    try{control.setTemporalEaseAtKey(j,source.keyInTemporalEase(j),source.keyOutTemporalEase(j));}catch(ke){}
                }
                return selectedName;
            }catch(e){try{while(control.numKeys)control.removeKey(control.numKeys);}catch(ignore){}}
        }
        // Fallback for manually animated text, Source Text reveal, or a layer
        // without an Animix range selector. Still rides on ORIGINAL letters.
        control.setValueAtTime(t0,0);
        control.setValueAtTime(t0+dur,100);
        if(o.mode==="inout")control.setValueAtTime(t0+dur*2,0);
        easeMotionKeys(control,textEaseProfile("GLIDE"),false);
        return "timeline";
    }
    function sweepAmountExpression(bounds,o,bandIndex){
        var arr=JSON.stringify(bounds),seq=o.lineMode==="sequential",gap=Math.max(0,Number(o.lineGap)||0),
            shift=(bandIndex-1)*Math.max(.08,Math.min(1.5,Number(o.separation)||.6));
        return "// YAGUANO_SWEEP_200\n"+
            "var lines="+arr+",idx=textIndex-1,line=0;\n"+
            "for(var j=0;j<lines.length;j++){if(idx>=lines[j][0]&&idx<lines[j][1]){line=j;break;}}\n"+
            "var from=lines[line][0],n=Math.max(1,lines[line][1]-from);\n"+
            "var x="+(o.vertical?"(line+0.5)/Math.max(1,lines.length)":"(idx-from+0.5)/n")+";\n"+
            "var pp=effect(\"Yaguano Sweep Progress\")(1);\n"+
            "var d=Math.max(.15,effect(\"Yaguano Sweep Duration\")(1));\n"+
            "var q=pp.valueAtTime(time-"+(seq?"line*(d+"+gap+")":"0")+")/100;\n"+
            "q=Math.max(0,Math.min(1,q));\n"+
            (o.mode==="out"?"q=1-q;\n":"")+
            "var r=Math.max(.014,effect(\"Yaguano Sweep Width\")(1)/Math.max(100,"+(Number(o.textWidth)||400)+"));\n"+
            "var soft=Math.max(.3,effect(\"Yaguano Sweep Softness\")(1)/50);\n"+
            "var c=q*(1+4*r)-2*r+"+shift+"*r;\n"+
            "var z=(x-c)/(r*soft);\n"+
            "var light=Math.exp(-.5*z*z);\n"+
            "var env=Math.sin(Math.PI*Math.max(0,Math.min(1,q)));\n"+
            "var power=Math.max(0,Math.min(100,effect(\"Yaguano Sweep Color\")(1)));\n"+
            "Math.max(0,Math.min(100,power*light*env));";
    }
    function sweepColorAnimator(l,name,color,colorCtl){
        var a=l.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator");
        a.name=name;
        var ap=a.property("ADBE Text Animator Properties"),fill=ap.addProperty("ADBE Text Fill Color");
        fill.setValue(hex2rgb(color).concat([1]));
        fill.expression='effect("'+colorCtl+'")(1)';
        var sels=a.property("ADBE Text Selectors");
        while(sels.numProperties)sels.property(sels.numProperties).remove();
        var sel=sels.addProperty("ADBE Text Expressible Selector");
        return sel.property("ADBE Text Expressible Amount")||sel.property(1);
    }
    // Blur localizado del barrido; se anima solo en la banda iluminada.
    // Nunca aplica Gaussian Blur a la capa original ni cambia sus keyframes.
    function ygSweepTextBlur(l,name,selectorExpr,ctlName){
        var a=l.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator");
        a.name=name;
        var props=a.property("ADBE Text Animator Properties");
        var blur=props.addProperty("ADBE Text Blur");
        blur.setValue([0,0]);
        blur.expression='var b=Math.max(0,Math.min(20,effect("'+ctlName+'")(1))); [b,b];';
        var sels=a.property("ADBE Text Selectors");
        while(sels.numProperties)sels.property(sels.numProperties).remove();
        var selector=sels.addProperty("ADBE Text Expressible Selector");
        (selector.property("ADBE Text Expressible Amount")||selector.property(1)).expression=selectorExpr;
        return a;
    }
    api.colorSweep=function(o,suppliedLayers){
        var c=comp(),ls=suppliedLayers||textLayers(),cols=o.colors||["#e7bd9a","#f4a16c","#eb5d6a"],
            dur=Math.max(.15,Number(o.dur)||1),n=0,i,j,src,t0,bounds,txt,rect,prog,amount,dup,g,gate,fill;
        // Clean obsolete untagged v1.x trails as well.
        for(j=c.numLayers;j>=1;j--)if(/^Animix Trail [1-3]( Line \d+)?$/.test(c.layer(j).name))c.layer(j).remove();
        for(i=0;i<ls.length;i++){
            src=ls[i];if(!(src instanceof TextLayer))continue;
            sweepRemoveForSource(c,src);
            // Un solo look de barrido activo por capa: evita mezcla accidental.
            ygRemoveNamedAnimators(src,"Animix StyleSweep ");
            ygRemoveNamedEffects(src,"Yaguano FX ");
            t0=sweepSyncStart(src,c,o,dur);
            txt="";try{txt=String(src.property("ADBE Text Properties").property("ADBE Text Document").value.text);}catch(ignore){}
            bounds=sweepLineBounds(txt);
            rect=sweepTextRect(src,src.inPoint+Math.max(.01,dur));
            o.textWidth=Math.max(80,rect.width);
            ctl(src,"Yaguano Sweep Width",Math.max(8,Math.min(240,Number(o.band)||68)));
            ctl(src,"Yaguano Sweep Softness",Math.max(10,Math.min(150,(Number(o.feather)||.6)*100)));
            ctl(src,"Yaguano Sweep Color",Math.max(0,Math.min(100,Number(o.colorPower===undefined?48:o.colorPower))));
            ctl(src,"Yaguano Sweep Glow",Math.max(0,Math.min(100,Number(o.glow===undefined?12:o.glow))));
            ctl(src,"Yaguano Sweep Duration",dur);
            ctl(src,"Yaguano Sweep Blur",Math.max(0,Math.min(20,Number(o.blurAmount)||0)));
            for(j=0;j<3;j++)ctl(src,"Yaguano Sweep Tone "+(j+1),hex2rgb(cols[j]).concat([1]),"color");
            prog=sweepNativeProgress(src,o,dur,t0);
            if(o.reveal==="add"){
                var addCfg={mode:"in",basedOn:"chars",dir:"up",dist:0,blur:0,fade:true,dur:dur,delay:o.delay||0,startAt:o.startAt};
                var range=buildAnimator(src,addCfg,false,"Sweep Reveal");
                range.setValueAtTime(t0,0);range.setValueAtTime(t0+dur,100);
                easeMotionKeys(range,textEaseProfile("GLIDE"),false);
            }
            for(j=0;j<3;j++){
                amount=sweepColorAnimator(src,"Animix Sweep Tint "+(j+1),cols[j],"Yaguano Sweep Tone "+(j+1));
                amount.expression=sweepAmountExpression(bounds,o,j);
            }
            try{ygSweepTextBlur(src,"Animix Sweep Moving Blur",sweepAmountExpression(bounds,o,1),"Yaguano Sweep Blur");}
            catch(blurSetupErr){throw new Error("No se pudo crear el blur del barrido: "+blurSetupErr.message);}
            // A single optional soft halo on a separate layer; the source
            // keeps its transform opacity expressions / animations untouched.
            if(Number(o.glow)>0){
                dup=src.duplicate();dup.name="Animix Sweep Halo [S"+src.id+"]";
                dup.label=9;
                var an=dup.property("ADBE Text Properties").property("ADBE Text Animators");
                g=an.addProperty("ADBE Text Animator");g.name="Animix Sweep Halo Gate";
                g.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity").setValue(0);
                var sels=g.property("ADBE Text Selectors");
                while(sels.numProperties)sels.property(sels.numProperties).remove();
                gate=sels.addProperty("ADBE Text Expressible Selector");
                var gatExpr=sweepAmountExpression(bounds,o,1);
                (gate.property("ADBE Text Expressible Amount")||gate.property(1)).expression=gatExpr.replace(/Math.max\(0,Math.min\(100,power\*light\*env\)\);\s*$/, "100-Math.max(0,Math.min(100,power*light*env));");
                dup.transform.opacity.expression="value * Math.max(0,Math.min(1,effect(\"Yaguano Sweep Glow\")(1)/100)) * .32";
                try{dup.blendingMode=BlendingMode.SCREEN;}catch(bm){}
                try{var gb=fx(dup).addProperty("ADBE Gaussian Blur 2");gb.name="Animix Sweep Halo Feather";
                    gb.property(1).expression='Math.max(1.25,Math.min(24,effect("Yaguano Sweep Blur")(1)+1.25));';
                    try{gb.property(3).setValue(1);}catch(repeat){}
                }catch(blurErr){}
                dup.moveBefore(src);
                try{dup.selected=false;src.selected=true;}catch(selErr){}
            }
            n++;
        }
        return {msg:"Color Sweep 2.0 sobre "+n+" texto(s): color en letras originales, seguimiento "+prog+", halo independiente."};
    };
    api.previewSweep=function(o){
        var dur=Math.max(.8,Number(o.dur)||1),pc=app.project.items.addComp("Yaguano Preview Color Sweep",960,480,1,Math.max(5,dur*3),30);
        pc.bgColor=[.965,.960,.950];pc.openInViewer();
        var bg=pc.layers.addSolid([.965,.960,.950],"Warm studio background",pc.width,pc.height,1,pc.duration);
        var t=pc.layers.addText("Yaguano");t.name="Yaguano - texto editable";
        var prop=t.property("ADBE Text Properties").property("ADBE Text Document"),doc=prop.value;
        doc.fontSize=135;doc.fillColor=[.66,.65,.66];doc.applyFill=true;
        try{doc.justification=ParagraphJustification.CENTER_JUSTIFY;}catch(just){}
        prop.setValue(doc);t.transform.position.setValue([480,285]);
        var cfg={},k;for(k in o)if(o.hasOwnProperty(k))cfg[k]=o[k];
        cfg.startAt="layer";cfg.mode="in";cfg.delay=.2;
        api.colorSweep(cfg,[t]);bg.moveToEnd();pc.time=0;
        return {msg:"Preview real Yaguano creada con Color Sweep 2.0"};
    };
    api.removeSweep=function(){
        var c=comp(),sel=c.selectedLayers,i,j,n=0,all=sel.length===0,sources=[];
        for(i=0;i<sel.length;i++)if(sel[i] instanceof TextLayer&&sel[i].name.indexOf("Animix Sweep ")!==0)sources.push(sel[i]);
        if(all){for(i=1;i<=c.numLayers;i++){var l=c.layer(i);if(l instanceof TextLayer&&l.name.indexOf("Animix Sweep ")!==0)sources.push(l);}}
        for(j=0;j<sources.length;j++)n+=sweepRemoveForSource(c,sources[j]);
        return {msg:"Color Sweep retirado: "+n+" elementos. Animaciones anteriores conservadas."};
    };
    // ---------- v2.5 · SWEEP STUDIO / ZOOM / EDITORIAL TOOLS ----------
    // Native Text Animators remain on the ORIGINAL text layer. No source text,
    // transform keyframes, parenting, masks, IN or OUT animators are replaced.
    function ygSafeNumber(x,lo,hi,def){ x=Number(x); if(!isFinite(x))x=def; return Math.max(lo,Math.min(hi,x)); }
    function ygRemoveNamedAnimators(layer,prefix){
        var an=layer.property("ADBE Text Properties").property("ADBE Text Animators"),i,n=0;
        for(i=an.numProperties;i>=1;i--)if(an.property(i).name.indexOf(prefix)===0){an.property(i).remove();n++;}
        return n;
    }
    function ygRemoveNamedEffects(layer,prefix){
        var e=fx(layer),i,n=0;
        for(i=e.numProperties;i>=1;i--)if(e.property(i).name.indexOf(prefix)===0){e.property(i).remove();n++;}
        return n;
    }
    function ygTimelineBounds(layer,at,d){
        if(at<layer.inPoint-.0001||at+d>layer.outPoint+.0001||at+d>comp().duration+.0001)
            fail("El intervalo está fuera de la capa. Mueve el cabezal o alarga la capa antes de aplicar.");
    }
    function ygSweepProfile(id){
        var profiles={
            silk:{colors:["#b4e6ee","#c9a4f6","#f4b6c6"],width:0.29,soft:1.35},
            chrome:{colors:["#667c91","#ffffff","#9bb6d5"],width:0.12,soft:0.65},
            prism:{colors:["#ff6486","#4de7e8","#8276ff"],width:0.17,soft:0.75},
            scan:{colors:["#2f80ed","#9dfdfa","#effbff"],width:0.10,soft:0.55}
        };
        if(!profiles[id])fail("Barrido desconocido: "+id);
        return profiles[id];
    }
    function ygStyleProgress(layer,c,at,d,follow){
        var prog=ctl(layer,"Yaguano FX Progress",0).property(1),a,i,j,p;
        if(follow){
            a=layer.property("ADBE Text Properties").property("ADBE Text Animators");
            for(i=a.numProperties;i>=1;i--){
                if(a.property(i).name.indexOf("Animix ")!==0||a.property(i).name.indexOf(" Out")>=0||
                   a.property(i).name.indexOf("Sweep")>=0)continue;
                try{
                    p=a.property(i).property("ADBE Text Selectors").property(1).property("ADBE Text Percent Offset");
                    if(p&&p.numKeys>1){
                        for(j=1;j<=p.numKeys;j++)prog.setValueAtTime(p.keyTime(j),ygSafeNumber(p.keyValue(j),0,100,0));
                        return "animación IN";
                    }
                }catch(ignore){}
            }
        }
        prog.setValueAtTime(at,0);prog.setValueAtTime(at+d,100);
        easeMotionKeys(prog,textEaseProfile("GLIDE"),false);
        return "cabezal";
    }
    function ygStyleExpression(style,index,bounds,reverse,seq,lineGap){
        // One light-weight expression per character. All effect lookups use
        // tool-owned control names and universal property index 1.
        var sh=(index-1)*0.38;
        var src="// YAGUANO_STYLE_250\\n"+
          "var ls="+JSON.stringify(bounds)+",idx=textIndex-1,line=0;\\n"+
          "for(var j=0;j<ls.length;j++){if(idx>=ls[j][0]&&idx<ls[j][1]){line=j;break;}}\\n"+
          "var n=Math.max(1,ls[line][1]-ls[line][0]);\\n"+
          "var x=(idx-ls[line][0]+0.5)/n;\\n"+
          "var prog=effect(\"Yaguano FX Progress\")(1);\\n"+
          "var q=prog.valueAtTime(time-"+(seq?"line*"+Number(lineGap):"0")+")/100;\\n"+
          "q=Math.max(0,Math.min(1,q));\\n"+
          (reverse?"q=1-q;\\n":"")+
          "var w=Math.max(.012,effect(\"Yaguano FX Width\")(1)/100);\\n"+
          "var soft=Math.max(.25,effect(\"Yaguano FX Feather\")(1)/100);\\n"+
          "var p=effect(\"Yaguano FX Intensity\")(1);\\n"+
          "var z=(x-(q*(1+2*w)-w+"+sh+"*w))/(w*soft);\\n"+
          "var amp=Math.exp(-.5*z*z);\\n";
        if(style==="silk")src+="amp=Math.exp(-.5*z*z*.33)*(0.85+0.15*Math.sin(q*6.283+textIndex*.12));\\n";
        if(style==="chrome")src+="amp=Math.pow(amp,1.8)*(.85+.15*Math.cos(textIndex*.7));\\n";
        if(style==="prism")src+="amp=Math.exp(-.5*z*z*.72);\\n";
        if(style==="scan")src+="amp=(Math.abs(x-Math.floor(q*16)/16)<w*1.1?amp:0)*(.78+.22*Math.sin(time*24+textIndex*.9));\\n";
        src+="var env=Math.sin(Math.PI*q);\\nMath.max(0,Math.min(100,p*amp*env));";
        return src.replace(/\\n/g,"\n");
    }
    api.styleSweep=function(o,suppliedLayers){
        var c=comp(),ls=suppliedLayers||textLayers(),id=String(o.style||"silk"),prof=ygSweepProfile(id),i,j,l,cols=o.colors||prof.colors;
        var dur=ygSafeNumber(o.dur,.15,8,1.1),width=ygSafeNumber(o.width,2,80,prof.width*100),power=ygSafeNumber(o.power,0,100,70);
        var feather=ygSafeNumber(o.feather,25,250,prof.soft*100),delay=ygSafeNumber(o.delay,0,8,0),at,lb,txt,ex,follow,used=0;
        for(i=0;i<ls.length;i++){
            l=ls[i];at=(o.startAt==="layer"?l.inPoint:c.time)+delay;
            // Start at CTI by default. Existing IN animation can also drive progress.
            if(o.follow===true&&o.startAt!=="cti")at=l.inPoint+delay;
            ygTimelineBounds(l,at,dur);
        }
        for(i=0;i<ls.length;i++){
            l=ls[i];at=(o.startAt==="layer"?l.inPoint:c.time)+delay;
            // Reemplazar el barrido anterior de cualquiera de las dos familias.
            sweepRemoveForSource(c,l);
            ygRemoveNamedAnimators(l,"Animix StyleSweep ");ygRemoveNamedEffects(l,"Yaguano FX ");
            ctl(l,"Yaguano FX Width",width);ctl(l,"Yaguano FX Feather",feather);
            ctl(l,"Yaguano FX Intensity",power);
            ctl(l,"Yaguano FX Blur",ygSafeNumber(o.blurAmount,0,20,1.5));
            for(j=0;j<3;j++)ctl(l,"Yaguano FX Tone "+(j+1),hex2rgb(cols[j]||prof.colors[j]).concat([1]),"color");
            txt="";try{txt=String(l.property("ADBE Text Properties").property("ADBE Text Document").value.text);}catch(ignore){}
            lb=sweepLineBounds(txt);
            follow=ygStyleProgress(l,c,at,dur,o.follow===true);
            for(j=0;j<3;j++){
                ex=sweepColorAnimator(l,"Animix StyleSweep "+id+" "+(j+1),cols[j]||prof.colors[j],"Yaguano FX Tone "+(j+1));
                ex.expression=ygStyleExpression(id,j,lb,o.reverse===true,o.sequential===true,ygSafeNumber(o.lineGap,0,1.5,.12));
            }
            try{ygSweepTextBlur(l,"Animix StyleSweep Motion Blur",ygStyleExpression(id,1,lb,o.reverse===true,o.sequential===true,ygSafeNumber(o.lineGap,0,1.5,.12)),"Yaguano FX Blur");}
            catch(blurSetupErr){throw new Error("No se pudo crear el blur Studio: "+blurSetupErr.message);}
            used++;
        }
        return {msg:"Barrido "+id+" aplicado en "+used+" texto(s). Originales, IN y OUT intactos. Controles en Efectos."};
    };
    api.removeStyleSweep=function(){
        var ls=textLayers(),i,n=0;
        for(i=0;i<ls.length;i++){
            n+=ygRemoveNamedAnimators(ls[i],"Animix StyleSweep ");
            n+=ygRemoveNamedEffects(ls[i],"Yaguano FX ");
        }
        return {msg:"Sweep Studio eliminado ("+n+" elementos); Color Sweep original conservado."};
    };
    api.removeAnySweep=function(){
        var ls=textLayers(),c=comp(),i,n=0;
        for(i=0;i<ls.length;i++){
            n+=sweepRemoveForSource(c,ls[i]);
            n+=ygRemoveNamedAnimators(ls[i],"Animix StyleSweep ");
            n+=ygRemoveNamedEffects(ls[i],"Yaguano FX ");
        }
        return {msg:"Barrido retirado de "+ls.length+" texto(s): "+n+" componentes; IN/OUT conservados."};
    };
    api.previewStyleSweep=function(o){
        var c=app.project.items.addComp("Yaguano · Preview Sweep "+String(o.style||"silk"),960,480,1,5,30);
        var bg=c.layers.addSolid([.065,.073,.115],"Preview background",960,480,1,5);
        var l=c.layers.addText("Yaguano");l.name="Yaguano · editable";
        var docProp=l.property("ADBE Text Properties").property("ADBE Text Document"),doc=docProp.value;
        doc.fontSize=135;doc.fillColor=[.9,.9,.92];doc.applyFill=true;docProp.setValue(doc);l.transform.position.setValue([165,285]);
        c.time=0;c.openInViewer();
        var cfg={},k;for(k in o)if(o.hasOwnProperty(k))cfg[k]=o[k];
        cfg.startAt="layer";cfg.follow=false;cfg.delay=.3;
        api.styleSweep(cfg,[l]);bg.moveToEnd();c.openInViewer();
        return {msg:"Preview real del barrido creada en AE"};
    };
    // Single zoom animator per phase: expression-selector applies the same
    // amount to every glyph and never touches Transform.scale.
    api.textZoom=function(o){
        var ls=textLayers(),c=comp(),phase=o.phase==="out"?"OUT":"IN",dir=o.direction==="out"?"out":"in";
        var strength=ygSafeNumber(o.strength,1,85,24),dur=ygSafeNumber(o.dur,.1,10,.8);
        var delay=ygSafeNumber(o.delay,0,8,0),t=c.time+delay,i,l,a,ap,sc,sels,ex,n=0,p;
        for(i=0;i<ls.length;i++)ygTimelineBounds(ls[i],t,dur);
        for(i=0;i<ls.length;i++){
            l=ls[i];ygRemoveNamedAnimators(l,"Animix Zoom "+phase+" ");
            ygRemoveNamedEffects(l,"Yaguano Zoom "+phase+" ");
            // Prefix is phase-specific: editing IN does not reset OUT.
            p=ctl(l,"Yaguano Zoom "+phase+" Strength",strength).property(1);
            p=ctl(l,"Yaguano Zoom "+phase+" Progress",phase==="IN"?100:0).property(1);
            while(p.numKeys)p.removeKey(p.numKeys);
            if(phase==="IN"){p.setValueAtTime(t,100);p.setValueAtTime(t+dur,0);}
            else{p.setValueAtTime(t,0);p.setValueAtTime(t+dur,100);}
            easeMotionKeys(p,textEaseProfile("GLIDE"),phase==="OUT");
            a=l.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator");
            a.name="Animix Zoom "+phase+" "+dir;
            ap=a.property("ADBE Text Animator Properties");sc=ap.addProperty("ADBE Text Scale 3D");
            sc.expression="// YAGUANO_ZOOM_250\nvar s=Math.max(1,Math.min(85,effect(\"Yaguano Zoom "+phase+" Strength\")(1)));\nvar v=100"+(dir==="in"?"-":"+")+"s;[v,v,100];";
            sels=a.property("ADBE Text Selectors");while(sels.numProperties)sels.property(sels.numProperties).remove();
            ex=sels.addProperty("ADBE Text Expressible Selector");
            (ex.property("ADBE Text Expressible Amount")||ex.property(1)).expression="effect(\"Yaguano Zoom "+phase+" Progress\")(1)";
            n++;
        }
        return {msg:"Zoom "+dir+" · "+phase+" aplicado a "+n+" capa(s) de texto, desde el cabezal. Intensidad y fotogramas editables en Efectos."};
    };
    api.removeTextZoom=function(o){
        var ls=textLayers(),phase=o.phase==="out"?"OUT":o.phase==="in"?"IN":"",i,n=0;
        for(i=0;i<ls.length;i++){
            if(phase){n+=ygRemoveNamedAnimators(ls[i],"Animix Zoom "+phase+" ");n+=ygRemoveNamedEffects(ls[i],"Yaguano Zoom "+phase+" ");}
            else{n+=ygRemoveNamedAnimators(ls[i],"Animix Zoom ");n+=ygRemoveNamedEffects(ls[i],"Yaguano Zoom ");}
        }
        return {msg:"Zoom "+(phase||"IN/OUT")+" retirado de "+ls.length+" capa(s)."};
    };
    // Timeline utilities: work with native layer timing/keyframes, all grouped
    // by the central Animix.call undo wrapper (single Ctrl+Z).
    api.toolStagger=function(o){
        var ls=selLayers(),c=comp(),frames=ygSafeNumber(o.frames,-120,120,4),i,t,b=c.time;
        if(ls.length<2)fail("Selecciona al menos dos capas en el orden de la pila.");
        if(o.origin==="first")b=ls[0].inPoint;
        for(i=0;i<ls.length;i++){
            t=b+i*frames*c.frameDuration;
            if(t<0||t+(ls[i].outPoint-ls[i].inPoint)>c.duration+.0001)fail("El escalonado no cabe en la composición. Reduce el intervalo o amplía la duración.");
        }
        for(i=0;i<ls.length;i++)ls[i].startTime+=b+i*frames*c.frameDuration-ls[i].inPoint;
        return {msg:ls.length+" capas escalonadas cada "+frames+" fotogramas."};
    };
    api.toolAlignIn=function(){
        var ls=selLayers(),c=comp(),i,span;
        for(i=0;i<ls.length;i++){
            span=ls[i].outPoint-ls[i].inPoint;
            if(c.time+span>c.duration+.0001)fail("Una de las capas no cabe desde el cabezal hasta el final de la composición.");
        }
        for(i=0;i<ls.length;i++)ls[i].startTime+=c.time-ls[i].inPoint;
        return {msg:"Inicio alineado con el cabezal para "+ls.length+" capa(s)."};
    };
    api.toolTrim=function(o){
        var ls=selLayers(),c=comp(),side=o.side==="out"?"out":"in",i,t=c.time;
        for(i=0;i<ls.length;i++){
            if(t<=ls[i].inPoint+c.frameDuration*.5||t>=ls[i].outPoint-c.frameDuration*.5)
                fail("El cabezal debe estar dentro de todas las capas seleccionadas, dejando al menos un fotograma.");
        }
        for(i=0;i<ls.length;i++)if(side==="in")ls[i].inPoint=t;else ls[i].outPoint=t;
        return {msg:ls.length+" capa(s) recortadas hasta el cabezal ("+side+"). Undo disponible."};
    };
    api.toolEaseKeys=function(o){
        var c=comp(),props=c.selectedProperties,infl=ygSafeNumber(o.influence,10,95,70),i,j,k,prop,keys,n=0,dim,inc,outc,d;
        for(i=0;i<props.length;i++){
            prop=props[i];if(prop.propertyType!==PropertyType.PROPERTY||!prop.isTimeVarying)continue;
            keys=prop.selectedKeys;
            for(j=0;j<keys.length;j++){
                k=keys[j];
                try{
                    prop.setInterpolationTypeAtKey(k,KeyframeInterpolationType.BEZIER,KeyframeInterpolationType.BEZIER);
                    dim=1;
                    try{if(prop.value instanceof Array)dim=Math.min(4,prop.value.length);}catch(ignore){}
                    inc=[];outc=[];
                    for(d=0;d<dim;d++){inc.push(new KeyframeEase(0,infl));outc.push(new KeyframeEase(0,infl));}
                    prop.setTemporalEaseAtKey(k,inc,outc);n++;
                }catch(ignored){}
            }
        }
        if(!n)fail("Selecciona keyframes animables en el timeline antes de pulsar Easy Ease.");
        return {msg:"Easy Ease aplicado a "+n+" keyframes (influencia "+infl+"%)."};
    };
    api.toolRename=function(o){
        var ls=selLayers(),pref=String(o.prefix||"Capa ").substr(0,90),first=Math.round(ygSafeNumber(o.first,1,9999,1)),i;
        if(!pref.replace(/\s/g,""))fail("Escribe un prefijo de nombre.");
        for(i=0;i<ls.length;i++)ls[i].name=pref+(first+i);
        return {msg:ls.length+" capas renombradas."};
    };
    api.toolMarker=function(o){
        var ls=selLayers(),c=comp(),tag=o.tag==="out"?"OUT":"IN",i,p,k,n=0,near;
        for(i=0;i<ls.length;i++){
            p=ls[i].property("ADBE Marker");if(!p)continue;
            near=p.numKeys?p.nearestKeyIndex(c.time):0;
            if(near&&Math.abs(p.keyTime(near)-c.time)<c.frameDuration*.25)continue;
            p.setValueAtTime(c.time,new MarkerValue("Yaguano "+tag));n++;
        }
        return {msg:n+" marcadores Yaguano "+tag+" colocados; los marcadores preexistentes se conservan."};
    };

    api.ctaPing = function (o) {
        var ls = selLayers(), c = comp(), i, made = 0;
        for (i = 0; i < ls.length; i++) {
            var target = ls[i], ring = c.layers.addShape(); ring.name = "Animix CTA Ping";
            var root = ring.property("ADBE Root Vectors Group"), g = root.addProperty("ADBE Vector Group"), vg = g.property("ADBE Vectors Group");
            var el = vg.addProperty("ADBE Vector Shape - Ellipse"); el.property("ADBE Vector Ellipse Size").setValue([o.size || 100, o.size || 100]);
            var st = vg.addProperty("ADBE Vector Graphic - Stroke"); st.property("ADBE Vector Stroke Color").setValue(hex2rgb(o.color || "#8b7bff"));
            st.property("ADBE Vector Stroke Width").setValue(o.stroke || 4);
            ring.parent = target; ring.transform.position.setValue([0,0]);
            var d = Math.max(0.25, o.dur || 0.8), sc = ring.transform.scale, op = ring.transform.opacity, t = o.startAt === "cti" ? c.time : target.inPoint;
            sc.setValueAtTime(t, [60,60]); sc.setValueAtTime(t+d, [180,180]); op.setValueAtTime(t, 85); op.setValueAtTime(t+d, 0);
            sc.expression = "loopOut('cycle')"; op.expression = "loopOut('cycle')";
            ring.startTime = target.startTime; ring.inPoint = target.inPoint; ring.outPoint = target.outPoint; ring.moveToBeginning(); made++;
        }
        return { msg: "CTA Ping añadido a " + made + " capa(s)" };
    };
    api.lofiSteps = function (o) {
        var ls = selLayers(), i, n = 0, fps = Math.max(1, o.fps || 12);
        for (i = 0; i < ls.length; i++) {
            var T = ls[i].transform, props = ["position","scale","rotation","opacity"], j;
            for (j = 0; j < props.length; j++) {
                var p = T[props[j]];
                if (p.canSetExpression) { p.expression = "posterizeTime(" + fps + "); value;"; p.expressionEnabled = true; n++; }
            }
        }
        return { msg: "Lo-Fi Steps aplicado (" + fps + " fps) a " + n + " propiedades" };
    };

    // ---------- ffx / archivos ----------
    api.pickFile = function (o) {
        var f = File.openDialog(o.prompt || "Elige un archivo",
            $.os.indexOf("Win") !== -1 ? (o.filter || "Todos:*.*") : function (x) { return (x instanceof Folder) || new RegExp("\\.(" + (o.ext || "ffx") + ")$", "i").test(x.name); });
        if (!f) return { msg: "Cancelado", data: null };
        return { msg: "Archivo elegido", data: f.fsName };
    };


    api.applyFFX = function (o) {
        var ls = selLayers(), i, f = new File(o.path);
        if (!f.exists) fail("No existe el archivo: " + o.path);
        for (i = 0; i < ls.length; i++) ls[i].applyPreset(f);
        return { msg: "Preset aplicado a " + ls.length + " capa(s)" };
    };
    api.captureEffects = function () {
        var l = selLayers()[0], e = fx(l), out = [], i;
        for (i = 1; i <= e.numProperties; i++) out.push({ match: e.property(i).matchName, name: e.property(i).name });
        if (!out.length) fail("La capa seleccionada no tiene efectos.");
        return { msg: out.length + " efecto(s) capturados", data: out };
    };
    api.applyEffects = function (o) {
        var ls = selLayers(), i, j;
        for (i = 0; i < ls.length; i++) for (j = 0; j < o.effects.length; j++) { try { fx(ls[i]).addProperty(o.effects[j].match); } catch (e) { } }
        return { msg: "Efectos añadidos" };
    };
    api.saveText = function (o) {
        var f = File.saveDialog("Guardar copia de seguridad", "JSON:*.json");
        if (!f) return { msg: "Cancelado", data: false };
        f.encoding = "UTF-8"; f.open("w"); f.write(o.content); f.close();
        return { msg: "Guardado en " + f.fsName, data: true };
    };
    api.openText = function () {
        var f = File.openDialog("Importar copia de seguridad", $.os.indexOf("Win") !== -1 ? "JSON:*.json" : function (x) { return (x instanceof Folder) || /\.json$/i.test(x.name); });
        if (!f) return { msg: "Cancelado", data: null };
        f.encoding = "UTF-8"; f.open("r"); var s = f.read(); f.close();
        return { msg: "Leído", data: s };
    };
    api.tempDir = function () { return { data: Folder.temp.fsName }; };

    // ---------- EXPRESIONES ----------
    function validProps(l) {
        var sp = l.selectedProperties, out = [], i;
        for (i = 0; i < sp.length; i++) {
            var p = sp[i];
            if (p.propertyType === PropertyType.PROPERTY && p.canSetExpression && p.parentProperty && p.parentProperty.matchName !== "ADBE Slider Control" && p.propertyValueType !== PropertyValueType.NO_VALUE) out.push(p);
        }
        return out;
    }
    function setExpr(p, ex) { p.expression = ex; p.expressionEnabled = true; }
    function stAt(l, o) { return o.startAt === "cti" ? comp().time : l.inPoint; }

    api.expr = function (o) {
        var ls = selLayers(), i, kind = o.kind, T;
        for (i = 0; i < ls.length; i++) {
            var l = ls[i]; T = l.transform;
            if (kind === "wiggle") {
                ctl(l, "Wiggle Freq", o.freq);
                if (o.pos) { ctl(l, "Wiggle Pos Amp", o.posAmp); setExpr(T.position, "wiggle(" + sliderRef("Wiggle Freq") + "," + sliderRef("Wiggle Pos Amp") + ")"); }
                if (o.scale) { ctl(l, "Wiggle Scale Amp", o.scaleAmp); setExpr(T.scale, "var a=" + sliderRef("Wiggle Scale Amp") + "; var w=wiggle(" + sliderRef("Wiggle Freq") + ",a); var k=w[0]-value[0]; value.length==3?[w[0],w[0]/value[0]*value[1],w[2]]:[w[0],w[0]/value[0]*value[1]]"); }
                if (o.opacity) { ctl(l, "Wiggle Opacity Amp", o.opacityAmp); setExpr(T.opacity, "clamp(wiggle(" + sliderRef("Wiggle Freq") + "," + sliderRef("Wiggle Opacity Amp") + "),0,100)"); }
                if (o.rot) { ctl(l, "Wiggle Rot Amp", o.rotAmp); setExpr(T.rotation, "wiggle(" + sliderRef("Wiggle Freq") + "," + sliderRef("Wiggle Rot Amp") + ")"); }
            } else if (kind === "jump") {
                ctl(l, "Jump Height", o.height); ctl(l, "Jump Speed", o.speed); ctl(l, "Jump Squash", o.squash);
                setExpr(T.position, "var h=" + sliderRef("Jump Height") + ", sp=" + sliderRef("Jump Speed") + ";\nvar p=(time*sp)%1; var y=-h*4*p*(1-p);\nvar v=value.slice(); v[1]+=y; v;");
                if (o.squash > 0) setExpr(T.scale, "var sq=" + sliderRef("Jump Squash") + "/100, sp=" + sliderRef("Jump Speed") + ";\nvar p=(time*sp)%1; var k=Math.pow(Math.abs(Math.cos(Math.PI*p)),8)*sq;\nvar v=value.slice(); v[0]=value[0]*(1+k); v[1]=value[1]*(1-k); v;");
            } else if (kind === "pop") {
                var d = o.dur, t = stAt(l, o) + (o.delay || 0), sc = T.scale, b = sc.valueAtTime(t + d, false), s0 = o.startScale / 100, k = o.bounce / 100;
                sc.setValueAtTime(t, scaleVal(b, s0));
                sc.setValueAtTime(t + d * 0.6, scaleVal(b, 1 + k * 0.2));
                sc.setValueAtTime(t + d * 0.82, scaleVal(b, 1 - k * 0.06));
                sc.setValueAtTime(t + d, b);
                easeKeys(sc, 45);
                if (o.fade) { var op = T.opacity, bo = op.valueAtTime(t + d, false); op.setValueAtTime(t, 0); op.setValueAtTime(t + d * 0.4, bo); easeKeys(op, 50); }
            } else if (kind === "spin") {
                var dd = o.dur, tt = stAt(l, o) + (o.delay || 0), ro = T.rotation, br = ro.valueAtTime(tt + dd, false), kk = o.bounce / 100;
                ro.setValueAtTime(tt, br + o.from);
                if (kk > 0) { ro.setValueAtTime(tt + dd * 0.72, br + o.to + (o.to - o.from) * 0.08 * kk * 2); }
                ro.setValueAtTime(tt + dd, br + o.to);
                easeKeys(ro, 50);
                if (o.scaleIn) { var s2 = T.scale, b2 = s2.valueAtTime(tt + dd, false); s2.setValueAtTime(tt, scaleVal(b2, 0.2)); s2.setValueAtTime(tt + dd, b2); easeKeys(s2, 50); }
            } else if (kind === "blur") {
                var t0 = stAt(l, o) + (o.delay || 0);
                addBlur(l, "Animix Blur", o.amount, t0, t0 + o.dur, o.mode === "out");
                if (o.fade) { var op2 = T.opacity, bo2 = op2.valueAtTime(t0 + o.dur, false); if (o.mode === "out") { op2.setValueAtTime(t0, bo2); op2.setValueAtTime(t0 + o.dur, 0); } else { op2.setValueAtTime(t0, 0); op2.setValueAtTime(t0 + o.dur, bo2); } easeKeys(op2, 50); }
            } else if (kind === "bounce") {
                ctl(l, "Bounce Amp", o.amp); ctl(l, "Bounce Freq", o.freq); ctl(l, "Bounce Decay", o.decay);
                var tg = validProps(l);
                if (!tg.length) { tg = []; if (o.pos) tg.push(T.position); if (o.scale) tg.push(T.scale); if (o.rot) tg.push(T.rotation); }
                var ex =
                    "var amp=" + sliderRef("Bounce Amp") + "/100, freq=" + sliderRef("Bounce Freq") + ", decay=" + sliderRef("Bounce Decay") + ";\n" +
                    "var n=0; if(numKeys>0){ n=nearestKey(time).index; if(nearestKey(time).time>time) n--; }\n" +
                    "if(n==0){ value; } else { var t=time-key(n).time; if(t>0){ var v=velocityAtTime(key(n).time-0.001); value+v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t); } else { value; } }";
                var j, cnt = 0;
                for (j = 0; j < tg.length; j++) if (tg[j].numKeys > 0) { setExpr(tg[j], ex); cnt++; }
                if (!cnt) fail("Bounce necesita propiedades con keyframes (selecciona propiedades o anima posición/escala/rotación).");
            } else if (kind === "custom") {
                var props = validProps(l), q;
                if (!props.length) fail("Selecciona propiedades de la capa para aplicar la expresión.");
                for (q = 0; q < props.length; q++) setExpr(props[q], o.code);
            } else fail("Expresión desconocida: " + kind);
        }
        return { msg: "Aplicado " + kind + " a " + ls.length + " capa(s)" };
    };

    api.removeExpr = function () {
        var ls = selLayers(), i, j, n = 0;
        for (i = 0; i < ls.length; i++) {
            var T = ls[i].transform, names = ["position", "scale", "rotation", "opacity"];
            for (j = 0; j < names.length; j++) { try { if (T[names[j]].expression) { T[names[j]].expression = ""; n++; } } catch (e) { } }
            var ef = fx(ls[i]);
            for (j = ef.numProperties; j >= 1; j--) {
                var nm = ef.property(j).name;
                if (/^(Wiggle|Jump|Bounce|Animix)/.test(nm)) ef.property(j).remove();
            }
        }
        return { msg: "Expresiones y controles Animix eliminados" };
    };

    // ---------- GRAPH ----------
    function selProps() {
        var sp = comp().selectedProperties, out = [], i;
        for (i = 0; i < sp.length; i++) if (sp[i].propertyType === PropertyType.PROPERTY && sp[i].selectedKeys && sp[i].selectedKeys.length >= 2) out.push(sp[i]);
        if (!out.length) fail("Selecciona al menos 2 keyframes de una propiedad.");
        return out;
    }
    function delta(p, k1, k2) {
        var a = p.keyValue(k1), b = p.keyValue(k2), dur = p.keyTime(k2) - p.keyTime(k1), n, i;
        if (!(a instanceof Array)) return { dv: [b - a], dur: dur };
        n = a.length; var dv = [];
        for (i = 0; i < n; i++) dv.push(b[i] - a[i]);
        if (p.isSpatial) { var s = 0; for (i = 0; i < n; i++) s += dv[i] * dv[i]; return { dv: [Math.sqrt(s)], dur: dur }; }
        return { dv: dv, dur: dur };
    }
    api.graphApply = function (o) {
        var ps = selProps(), i, c = 0;
        for (i = 0; i < ps.length; i++) {
            var p = ps[i], sk = p.selectedKeys, j;
            for (j = 0; j < sk.length - 1; j++) {
                var k1 = sk[j], k2 = sk[j + 1], dl = delta(p, k1, k2), n = easeDims(p), d, out1 = [], in2 = [];
                var oi = Math.max(0.1, Math.min(100, o.x1 * 100)), ii = Math.max(0.1, Math.min(100, (1 - o.x2) * 100));
                for (d = 0; d < n; d++) {
                    var dv = dl.dv[Math.min(d, dl.dv.length - 1)], avg = dv / dl.dur, so, si;
                    if (o.mode === "speed") { var a0 = Math.abs(avg); so = o.y1 * a0 * (avg < 0 ? -1 : 1); si = o.y2 * a0 * (avg < 0 ? -1 : 1); }
                    else { so = (o.x1 > 0.0001 ? o.y1 / o.x1 : 0) * avg; si = ((1 - o.x2) > 0.0001 ? (1 - o.y2) / (1 - o.x2) : 0) * avg; }
                    if (p.isSpatial) { so = Math.abs(so); si = Math.abs(si); }
                    out1.push(new KeyframeEase(so, oi)); in2.push(new KeyframeEase(si, ii));
                }
                try {
                    p.setInterpolationTypeAtKey(k1, p.keyInInterpolationType(k1), KeyframeInterpolationType.BEZIER);
                    p.setInterpolationTypeAtKey(k2, KeyframeInterpolationType.BEZIER, p.keyOutInterpolationType(k2));
                    var in1 = p.keyInTemporalEase(k1), out2 = p.keyOutTemporalEase(k2);
                    p.setTemporalEaseAtKey(k1, in1, out1);
                    p.setTemporalEaseAtKey(k2, in2, out2);
                    c++;
                } catch (e) { fail("No se pudo aplicar la curva: " + e.message); }
            }
        }
        return { msg: "Curva aplicada a " + c + " segmento(s)" };
    };
    api.graphRead = function () {
        var p = selProps()[0], sk = p.selectedKeys, k1 = sk[0], k2 = sk[1], dl = delta(p, k1, k2);
        var eo = p.keyOutTemporalEase(k1)[0], ei = p.keyInTemporalEase(k2)[0], avg = dl.dv[0] / dl.dur;
        var x1 = eo.influence / 100, x2 = 1 - ei.influence / 100, y1, y2;
        if (Math.abs(avg) < 1e-9) { y1 = x1; y2 = x2; } else {
            var so = eo.speed, si = ei.speed;
            if (p.isSpatial) { so = Math.abs(so); si = Math.abs(si); }
            y1 = (so / avg) * x1; y2 = 1 - (si / avg) * (1 - x2);
        }
        return { msg: "Curva leída", data: { x1: x1, y1: y1, x2: x2, y2: y2, so: eo.speed, si: ei.speed, avg: avg, oi: eo.influence, ii: ei.influence } };
    };

    // ---------- TOOLS ----------
    function posAdjust(l, dx, dy) {
        var s = l.transform.scale.value, rot = l.transform.rotation.value * Math.PI / 180, pp = l.transform.position;
        var sx = dx * s[0] / 100, sy = dy * s[1] / 100;
        var rx = sx * Math.cos(rot) - sy * Math.sin(rot), ry = sx * Math.sin(rot) + sy * Math.cos(rot), i, v;
        if (pp.numKeys > 0) {
            for (i = 1; i <= pp.numKeys; i++) { v = pp.keyValue(i); v[0] += rx; v[1] += ry; pp.setValueAtKey(i, v); }
        } else { v = pp.value; v[0] += rx; v[1] += ry; pp.setValue(v); }
    }
    api.anchor = function (o) {
        var ls = selLayers(), i, c = comp(), n = 0;
        for (i = 0; i < ls.length; i++) {
            var l = ls[i];
            if (l instanceof CameraLayer || l instanceof LightLayer) continue;
            var r = l.sourceRectAtTime(c.time, false), ap = l.transform.anchorPoint, old = ap.value;
            var nx = r.left + r.width * o.fx, ny = r.top + r.height * o.fy;
            var nv = [nx, ny]; if (old.length > 2) nv.push(old[2]);
            if (ap.numKeys > 0) continue;
            ap.setValue(nv);
            posAdjust(l, nx - old[0], ny - old[1]); n++;
        }
        return { msg: "Anchor point movido en " + n + " capa(s)" };
    };
    api.newLayer = function (o) {
        var c = comp(), l, k = o.kind;
        if (k === "null") { l = c.layers.addNull(); l.name = "Null"; }
        else if (k === "camera") { l = c.layers.addCamera("Camera", [c.width / 2, c.height / 2]); }
        else if (k === "adjustment") { l = c.layers.addSolid([1, 1, 1], "Adjustment Layer", c.width, c.height, c.pixelAspect, c.duration); l.adjustmentLayer = true; }
        else if (k === "solid") { l = c.layers.addSolid(hex2rgb(o.color || "#ffffff"), "Solid", c.width, c.height, c.pixelAspect, c.duration); }
        else fail("Capa desconocida");
        return { msg: "Creado: " + l.name };
    };
    api.unprecomp = function () {
        var c = comp(), ls = selLayers(), i, j, n = 0;
        for (i = 0; i < ls.length; i++) {
            var pl = ls[i];
            if (!(pl.source instanceof CompItem)) continue;
            var src = pl.source, copied = [];
            if (typeof src.layer(1).copyToComp !== "function") fail("Esta versión de After Effects no soporta copyToComp.");
            var before = c.numLayers;
            for (j = src.numLayers; j >= 1; j--) src.layer(j).copyToComp(c);
            var added = c.numLayers - before;
            var nul = c.layers.addNull(); nul.name = "Unprecomp " + src.name;
            var T = pl.transform; nul.transform.anchorPoint.setValue(T.anchorPoint.value); nul.transform.position.setValue(T.position.value);
            nul.transform.scale.setValue(T.scale.value); nul.transform.rotation.setValue(T.rotation.value);
            nul.moveToBeginning();
            for (j = 2; j <= added + 1; j++) {
                var cl = c.layer(j);
                cl.startTime += pl.startTime;
                if (!cl.parent) cl.parent = nul;
            }
            pl.remove(); n++;
        }
        if (!n) fail("Selecciona una capa que sea una precomposición.");
        return { msg: "Precomp deshecha (" + n + ")" };
    };
    api.parentNull = function () {
        var c = comp(), ls = selLayers(), i, sx = 0, sy = 0, sel = [];
        for (i = 0; i < ls.length; i++) sel.push(ls[i]);
        for (i = 0; i < sel.length; i++) { var p = sel[i].transform.position.value; sx += p[0]; sy += p[1]; }
        var nul = c.layers.addNull(); nul.name = "Parent Null";
        nul.transform.position.setValue([sx / sel.length, sy / sel.length]);
        nul.moveBefore(sel[0]);
        for (i = 0; i < sel.length; i++) sel[i].setParentWithJump(nul);
        return { msg: "Parent Null creado" };
    };
    api.splitText = function (o) {
        var ls = textLayers(), i, made = 0;
        for (i = 0; i < ls.length; i++) {
            var l = ls[i], td = l.property("ADBE Text Properties").property("ADBE Text Document"), txt = td.value.text, ranges = [], re, m, last = 0;
            if (o.by === "letters") { var k; for (k = 0; k < txt.length; k++) if (!/\s/.test(txt.charAt(k))) ranges.push([k, k + 1, txt.charAt(k)]); }
            else if (o.by === "words") { re = /\S+/g; while ((m = re.exec(txt)) !== null) ranges.push([m.index, m.index + m[0].length, m[0]]); }
            else { var parts = txt.split(/\r\n|\r|\n|\u0003/), pos = 0, q; for (q = 0; q < parts.length; q++) { if (parts[q].length) ranges.push([pos, pos + parts[q].length, parts[q]]); pos += parts[q].length + 1; } }
            if (ranges.length < 2) continue;
            var r;
            for (r = 0; r < ranges.length; r++) {
                var dup = l.duplicate(); dup.name = ranges[r][2];
                var a = dup.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator"); a.name = "Animix Split";
                a.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity").setValue(0);
                var sels = a.property("ADBE Text Selectors");
                var s1 = sels.numProperties ? sels.property(1) : sels.addProperty("ADBE Text Selector");
                var s2 = sels.addProperty("ADBE Text Selector");
                s1.property("ADBE Text Range Advanced").property("ADBE Text Range Units").setValue(1); // porcentaje: todo
                s2.property("ADBE Text Range Advanced").property("ADBE Text Range Units").setValue(2); // índices
                s2.property("ADBE Text Range Advanced").property("ADBE Text Selector Mode").setValue(2); // restar
                s2.property("ADBE Text Percent Start").setValue(ranges[r][0]);
                s2.property("ADBE Text Percent End").setValue(ranges[r][1]);
                s2.property("ADBE Text Range Advanced").property("ADBE Text Selector Smoothness").setValue(0);
                s1.property("ADBE Text Range Advanced").property("ADBE Text Selector Smoothness").setValue(0);
                made++;
            }
            l.enabled = false;
        }
        if (!made) fail("El texto no tiene suficientes partes para dividir.");
        return { msg: made + " capas creadas (la original queda desactivada)" };
    };
    api.pasteImage = function (o) {
        var f = new File(o.path); if (!f.exists) fail("No se encontró la imagen temporal.");
        var io = new ImportOptions(f), item = app.project.importFile(io);
        var c = app.project.activeItem; if (c instanceof CompItem) { var l = c.layers.add(item); l.name = "Pasted Image"; }
        return { msg: "Imagen importada" };
    };
    api.camNulls = function () {
        var c = comp(), cam = c.layers.addCamera("Camera Rig", [c.width / 2, c.height / 2]);
        cam.transform.position.setValue([c.width / 2, c.height / 2, -c.width * 1.1]);
        var poi = c.layers.addNull(); poi.name = "Cam POI"; poi.threeDLayer = true; poi.transform.position.setValue([c.width / 2, c.height / 2, 0]);
        var pos = c.layers.addNull(); pos.name = "Cam Position"; pos.threeDLayer = true; pos.transform.position.setValue([c.width / 2, c.height / 2, -c.width * 1.1]);
        cam.autoOrient = AutoOrientType.CAMERA_OR_POINT_OF_INTEREST;
        cam.property("ADBE Transform Group").property("ADBE Point of Interest").expression = "thisComp.layer('Cam POI').transform.position";
        cam.transform.position.expression = "thisComp.layer('Cam Position').transform.position";
        return { msg: "Cámara + nulls creados" };
    };
    function dupComp(c, deep, map) {
        var d = c.duplicate(), i; d.name = c.name + " copy";
        if (deep) for (i = 1; i <= d.numLayers; i++) {
            var l = d.layer(i);
            if (l.source instanceof CompItem) {
                var id = l.source.id;
                if (!map[id]) map[id] = dupComp(l.source, true, map);
                l.replaceSource(map[id], false);
            }
        }
        return d;
    }
    api.dupComp = function (o) { var d = dupComp(comp(), !!o.deep, {}); d.openInViewer(); return { msg: "Comp duplicada: " + d.name }; };
    api.orb = function (o) {
        var c = comp(), col = hex2rgb(o.color || "#7c5cff"), size = o.size || 400;
        var l = c.layers.addShape(); l.name = "Orb";
        var g = l.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"), cs = g.property("ADBE Vectors Group");
        cs.addProperty("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").setValue([size, size]);
        var fl = cs.addProperty("ADBE Vector Graphic - Fill"); fl.property("ADBE Vector Fill Color").setValue([col[0], col[1], col[2], 1]);
        l.transform.position.setValue([c.width / 2, c.height / 2]);
        try { var gl = fx(l).addProperty("ADBE Glo2"); gl.name = "Orb Glow"; gl.property("ADBE Glo2-0002").setValue(60); gl.property("ADBE Glo2-0003").setValue(size * 0.4); } catch (e) { }
        var h = c.layers.addShape(); h.name = "Orb Highlight";
        var g2 = h.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"), c2 = g2.property("ADBE Vectors Group");
        c2.addProperty("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").setValue([size * 0.35, size * 0.22]);
        var f2 = c2.addProperty("ADBE Vector Graphic - Fill"); f2.property("ADBE Vector Fill Color").setValue([1, 1, 1, 1]);
        h.transform.position.setValue([c.width / 2 - size * 0.16, c.height / 2 - size * 0.26]); h.transform.opacity.setValue(55);
        var gb = fx(h).addProperty("ADBE Gaussian Blur 2"); gb.property(1).setValue(size * 0.05);
        h.parent = l; h.moveToBeginning();
        return { msg: "Orb creado" };
    };
    // ---------- ATMÓSFERAS 2.2 | RAMPS RADIALES SIN LÍMITES ----------
    // Un ramp radial pinta el sólido COMPLETO. El extremo exterior es blanco
    // para MULTIPLY (Pearl) o negro para SCREEN (resto): sin máscaras ni blobs.
    // Los tres colores se leen desde un NULL de controles, sin volver a generar.
    var YBG_PREFIX = "Animix BG - ";
    var YBG_CTRL = "Animix BG - CONTROLES 2.2";
    var YBG_COLORS = ["Yaguano BG Principal", "Yaguano BG Secundario", "Yaguano BG Acento"];
    var YBG_SPEED = "Yaguano BG Velocidad";
    var YBG_POWER = "Yaguano BG Intensidad";
    var YBG_VERSION = "YAGUANO_BG_220";

    function bgSafeHex(h, fallback) {
        h = String(h || fallback || "#ffffff");
        if (!/^#[0-9a-fA-F]{6}$/.test(h)) h = fallback || "#ffffff";
        return h;
    }
    function bgBound(v, low, high, defaultValue) {
        v = Number(v);
        return isNaN(v) ? defaultValue : Math.min(high, Math.max(low, v));
    }
    function bgStyle(s) {
        return s === "minimal" || s === "gradient" || s === "aurora" || s === "dark" ? s : "minimal";
    }
    function bgSettings(o) {
        return {
            style: bgStyle(o.style),
            cols: [bgSafeHex(o.color1, "#4ac5ff"), bgSafeHex(o.color2, "#9d8bff"), bgSafeHex(o.accent, "#f5a0da")],
            speed: bgBound(o.speed, .15, 3, 1),
            power: bgBound(o.intensity, 0, 100, 65)
        };
    }
    function bgFindControl(c) {
        var i, l;
        for (i = 1; i <= c.numLayers; i++) {
            l = c.layer(i);
            if (l.name.indexOf(YBG_CTRL) === 0 && fx(l) && fx(l).property(YBG_COLORS[0]) &&
                fx(l).property(YBG_COLORS[1]) && fx(l).property(YBG_COLORS[2])) return l;
        }
        return null;
    }
    function bgPresent(c) {
        var i;
        for (i = 1; i <= c.numLayers; i++) if (c.layer(i).name.indexOf(YBG_PREFIX) === 0) return true;
        return false;
    }
    function bgSetControl(p, v, t) {
        if (p.numKeys > 0) p.setValueAtTime(t, v);
        else p.setValue(v);
    }
    function bgUpdateControls(c, ctrl, s) {
        var i, f;
        for (i = 0; i < 3; i++) {
            f = fx(ctrl).property(YBG_COLORS[i]);
            if (!f) fail("Falta el control " + YBG_COLORS[i]);
            bgSetControl(f.property(1), hex2rgb(s.cols[i]).concat([1]), c.time);
        }
        bgSetControl(fx(ctrl).property(YBG_SPEED).property(1), s.speed, c.time);
        bgSetControl(fx(ctrl).property(YBG_POWER).property(1), s.power, c.time);
    }
    function bgExprProperty(ctrl, name) {
        // Nombres creados por el script, no localizados; (1) universal para Color/Slider.
        return "thisComp.layer(" + JSON.stringify(ctrl.name) + ").effect(" + JSON.stringify(name) + ")(1)";
    }
    function bgAnimatePoint(p, w, h, x, y, radius, dx, dy, phase, speedRef) {
        // Start y End usan EXACTAMENTE el mismo desplazamiento. Así el radio
        // permanece constante y el halo no salta ni genera cortes en el borde.
        var xs = (w*x + radius).toFixed(5), ys = (h*y).toFixed(5);
        var ax = (w*dx).toFixed(5), ay = (h*dy).toFixed(5);
        p.expression = "// " + YBG_VERSION + "\n" +
            "var v=Math.max(0.15," + speedRef + ");\n" +
            "var t=time*v;\n" +
            "[" + xs + "+"+ax+"*Math.sin(t*0.70+"+phase+")+"+(w*dx*.25).toFixed(5)+"*Math.sin(t*0.24+"+(phase+1.6)+"),"+
            ys+"+"+ay+"*Math.cos(t*0.52+"+phase+")+"+(h*dy*.22).toFixed(5)+"*Math.sin(t*0.17+"+(phase+.5)+")];";
    }
    function bgHalo(c, ctrl, s, index, cfg) {
        var isPearl = s.style === "minimal";
        // MULTIPLY sobre blanco (perla); SCREEN sobre negro (fondos oscuros).
        var neutral = isPearl ? [1,1,1] : [0,0,0];
        var radius = Math.max(c.width,c.height) * cfg.radius;
        var light = c.layers.addSolid(neutral, YBG_PREFIX + ["Luz principal", "Luz secundaria", "Luz de acento"][index],
            c.width, c.height, c.pixelAspect, c.duration);
        try {
            var ramp = fx(light).addProperty("ADBE Ramp");
            if (!ramp) fail("After Effects no pudo añadir Gradient Ramp.");
            ramp.name = "Yaguano Radial " + (index+1);
            // 1 inicio, 2 color inicial, 3 fin, 4 color final, 5 forma,
            // 6 scatter, 7 mezcla original (índices universales AE).
            var start = ramp.property(1), end = ramp.property(3);
            if (!start || !end || !ramp.property(2) || !ramp.property(4) || !ramp.property(5))
                fail("Gradient Ramp no ofrece los controles de punto y color esperados.");
            // Valores base para una composición útil incluso con expresiones desactivadas.
            start.setValue([c.width*cfg.x,c.height*cfg.y]);
            end.setValue([c.width*cfg.x+radius,c.height*cfg.y]);
            bgAnimatePoint(start, c.width, c.height, cfg.x, cfg.y, 0, cfg.dx, cfg.dy, cfg.phase, bgExprProperty(ctrl,YBG_SPEED));
            bgAnimatePoint(end, c.width, c.height, cfg.x, cfg.y, radius, cfg.dx, cfg.dy, cfg.phase, bgExprProperty(ctrl,YBG_SPEED));
            ramp.property(2).setValue(hex2rgb(s.cols[index]).concat([1]));
            ramp.property(2).expression = "// " + YBG_VERSION + "\n" + bgExprProperty(ctrl,YBG_COLORS[index]) + ";";
            ramp.property(4).setValue(neutral.concat([1]));
            ramp.property(5).setValue(2); // radial
            if (ramp.property(6)) ramp.property(6).setValue(12); // reducir banding
            if (ramp.property(7)) ramp.property(7).setValue(0);
            light.blendingMode = isPearl ? BlendingMode.MULTIPLY : BlendingMode.SCREEN;
            light.transform.opacity.setValue(bgBound(s.power*cfg.opacity,0,100,60));
            light.transform.opacity.expression = "// " + YBG_VERSION + "\n" +
                "Math.min(100,Math.max(0," + bgExprProperty(ctrl,YBG_POWER) + "*" + cfg.opacity + "));";
            return light;
        } catch (e) {
            try { light.remove(); } catch (cleanup) {}
            throw e;
        }
    }
    // Cada perfil tiene centros, escalas, amplitud, velocidad visual y opacidades
    // propias; los 3 colores (principal, secundario, acento) aparecen en TODOS.
    function bgProfile(style) {
        if (style === "minimal") return {
            base:[.965,.972,.984],
            lights:[
                {x:.12,y:.38,radius:.75,dx:.15,dy:.09,phase:.1,opacity:.83},
                {x:.85,y:.65,radius:.78,dx:.13,dy:.13,phase:2.2,opacity:.72},
                {x:.48,y:.89,radius:.63,dx:.19,dy:.10,phase:4.5,opacity:.40}
            ]};
        if (style === "gradient") return {
            base:[.016,.048,.19],
            lights:[
                {x:.03,y:.34,radius:.99,dx:.16,dy:.13,phase:.3,opacity:1.00},
                {x:.68,y:.81,radius:.91,dx:.19,dy:.12,phase:2.5,opacity:.86},
                {x:.92,y:.17,radius:.75,dx:.14,dy:.17,phase:4.4,opacity:.65}
            ]};
        if (style === "aurora") return {
            base:[.070,.030,.15],
            lights:[
                {x:.15,y:.09,radius:.86,dx:.24,dy:.18,phase:.6,opacity:.88},
                {x:.84,y:.56,radius:.91,dx:.21,dy:.19,phase:2.7,opacity:.94},
                {x:.30,y:.90,radius:.79,dx:.20,dy:.20,phase:4.8,opacity:.78}
            ]};
        return {
            base:[.007,.020,.067],
            lights:[
                {x:.24,y:.29,radius:.81,dx:.14,dy:.18,phase:1.1,opacity:.65},
                {x:.80,y:.83,radius:.80,dx:.17,dy:.13,phase:3.0,opacity:.78},
                {x:.52,y:.43,radius:.87,dx:.12,dy:.20,phase:5.0,opacity:.47}
            ]};
    }
    function bgDelete(c, keep) {
        var i, l, count = 0;
        for (i=c.numLayers;i>=1;i--) {
            l=c.layer(i);
            if (l.name.indexOf(YBG_PREFIX) === 0 && (!keep || l !== keep)) {
                l.remove(); count++;
            }
        }
        return count;
    }
    api.background = function (o) {
        var c=comp(),s=bgSettings(o),i,created=[],ctrl=null,base=null,profile,nm;
        if (o.remove) return {msg:"Fondo Yaguanimix eliminado (" + bgDelete(c,null) + " capas)."};
        profile = bgProfile(s.style);
        try {
            // Se construye primero, antes de borrar el fondo anterior.
            ctrl = c.layers.addNull();
            ctrl.name = YBG_CTRL;
            ctrl.label = 11;
            ctrl.inPoint=0;ctrl.outPoint=c.duration;
            created.push(ctrl);
            for (i=0;i<3;i++) ctl(ctrl,YBG_COLORS[i],hex2rgb(s.cols[i]).concat([1]),"color");
            ctl(ctrl,YBG_SPEED,s.speed);
            ctl(ctrl,YBG_POWER,s.power);
            ctrl.comment = YBG_VERSION + ":" + s.style;
            base = c.layers.addSolid(profile.base,YBG_PREFIX + "Base 2.2",c.width,c.height,c.pixelAspect,c.duration);
            created.push(base);
            var lights=[];
            for (i=0;i<3;i++) {
                var light=bgHalo(c,ctrl,s,i,profile.lights[i]);
                created.push(light);lights.push(light);
            }
            // Eliminar fondos anteriores SOLO si esta construcción ha funcionado.
            for (i=c.numLayers;i>=1;i--) {
                var old=c.layer(i),keep=false,j;
                for(j=0;j<created.length;j++) if(old===created[j]){keep=true;break;}
                if(!keep && old.name.indexOf(YBG_PREFIX)===0)old.remove();
            }
            // Fondo debajo de las capas de texto. Top -> Control,Luz3,Luz2,Luz1,Base.
            for(i=created.length-1;i>=0;i--)created[i].moveToEnd();
            return {msg:"Fondo " + s.style + " generado con principal, secundario y acento editables en Efectos.",data:{style:s.style,editable:true}};
        } catch(e) {
            // Si falla el motor nativo, se conserva el fondo anterior.
            for (i=created.length-1;i>=0;i--) try{created[i].remove();}catch(clean){}
            fail("No se pudo construir el fondo: " + ((e && e.message) ? e.message : e));
        }
    };
    api.backgroundUpdate = function (o) {
        var c=comp(),s=bgSettings(o),ctrl=bgFindControl(c),i;
        if (!ctrl) {
            if (bgPresent(c)) return api.background(o); // migra el fondo antiguo al primer cambio.
            return {msg:"Todavía no hay fondo. Pulsa Crear fondo animado.",data:{updated:false}};
        }
        // Si cambia el estilo, hay que reconstruir los recorridos y el color base.
        if (String(ctrl.comment || "").indexOf(":" + s.style) < 0) return api.background(o);
        bgUpdateControls(c,ctrl,s);
        return {msg:"Fondo actualizado: 3 colores, velocidad e intensidad.",data:{updated:true}};
    };
    api.backgroundInfo = function () {
        var c=comp(),ctrl=bgFindControl(c);
        return {msg:"Estado del fondo",data:{exists:!!ctrl,legacy:!ctrl&&bgPresent(c),style:ctrl ? String(ctrl.comment).split(":")[1] : ""}};
    };
    api.fill = function (o) {
        var ls = selLayers(), i;
        for (i = 0; i < ls.length; i++) { var e = fx(ls[i]).addProperty("ADBE Fill"); if (o.color) e.property("ADBE Fill-0002").setValue(hex2rgb(o.color)); }
        return { msg: "Fill añadido" };
    };
    api.align = function (o) {
        var c = comp(), ls = selLayers(), i, n = 0;
        for (i = 0; i < ls.length; i++) {
            var l = ls[i]; if (l instanceof CameraLayer || l instanceof LightLayer) continue;
            var r = l.sourceRectAtTime(c.time, false), s = l.transform.scale.value, ap = l.transform.anchorPoint.value, p = l.transform.position, v = p.value;
            var left = v[0] + (r.left - ap[0]) * s[0] / 100, right = v[0] + (r.left + r.width - ap[0]) * s[0] / 100;
            var top = v[1] + (r.top - ap[1]) * s[1] / 100, bottom = v[1] + (r.top + r.height - ap[1]) * s[1] / 100, d = 0, ax = true;
            if (o.edge === "left") d = -left; else if (o.edge === "hcenter") d = c.width / 2 - (left + right) / 2; else if (o.edge === "right") d = c.width - right;
            else { ax = false; if (o.edge === "top") d = -top; else if (o.edge === "vcenter") d = c.height / 2 - (top + bottom) / 2; else d = c.height - bottom; }
            var k;
            if (p.numKeys > 0) { for (k = 1; k <= p.numKeys; k++) { var kv = p.keyValue(k); kv[ax ? 0 : 1] += d; p.setValueAtKey(k, kv); } }
            else { v[ax ? 0 : 1] += d; p.setValue(v); }
            n++;
        }
        return { msg: "Alineadas " + n + " capa(s)" };
    };

    // ---------- SAVED ----------
    function walkVec(g, cb) {
        var i, p;
        for (i = 1; i <= g.numProperties; i++) {
            p = g.property(i);
            cb(p);
            if (p.propertyType !== PropertyType.PROPERTY && p.numProperties) walkVec(p, cb);
        }
    }
    api.applyColor = function (o) {
        var ls = selLayers(), i, c = hex2rgb(o.hex), n = 0;
        for (i = 0; i < ls.length; i++) {
            var l = ls[i];
            if (l instanceof TextLayer) {
                var sp = l.property("ADBE Text Properties").property("ADBE Text Document"), td = sp.value;
                if (o.target === "stroke") { td.applyStroke = true; td.strokeColor = c; } else { td.applyFill = true; td.fillColor = c; }
                sp.setValue(td); n++;
            } else if (l instanceof ShapeLayer) {
                walkVec(l.property("ADBE Root Vectors Group"), function (p) {
                    if (o.target === "stroke" && p.matchName === "ADBE Vector Graphic - Stroke") { p.property("ADBE Vector Stroke Color").setValue([c[0], c[1], c[2], 1]); n++; }
                    if (o.target !== "stroke" && p.matchName === "ADBE Vector Graphic - Fill") { p.property("ADBE Vector Fill Color").setValue([c[0], c[1], c[2], 1]); n++; }
                });
            } else if (o.target !== "stroke") {
                var e = fx(l).property("ADBE Fill") || fx(l).addProperty("ADBE Fill"); e.property("ADBE Fill-0002").setValue(c); n++;
            }
        }
        return { msg: "Color aplicado (" + n + ")" };
    };
    api.readColor = function () {
        var l = selLayers()[0], hex = null;
        if (l instanceof TextLayer) hex = rgb2hex(l.property("ADBE Text Properties").property("ADBE Text Document").value.fillColor);
        else if (l instanceof ShapeLayer) walkVec(l.property("ADBE Root Vectors Group"), function (p) { if (!hex && p.matchName === "ADBE Vector Graphic - Fill") hex = rgb2hex(p.property("ADBE Vector Fill Color").value); });
        else if (l.source && l.source.mainSource instanceof SolidSource) hex = rgb2hex(l.source.mainSource.color);
        if (!hex) fail("No se pudo leer un color de la capa seleccionada.");
        return { msg: "Color leído " + hex, data: hex };
    };
    api.compInfo = function () {
        var c = comp(), data = { id: c.id, name: c.name, w: c.width, h: c.height, fps: c.frameRate, dur: c.duration, project: app.project.file ? app.project.file.fsName : "", preview: null };
        try {
            var f = new File(Folder.temp.fsName + "/animix_prev_" + c.id + ".png");
            c.saveFrameToPng(c.time, f);
            if (f.exists) data.preview = f.fsName;
        } catch (e) { }
        return { msg: "Comp guardada: " + c.name, data: data };
    };
    api.compOpen = function (o) { var it = app.project.itemByID(o.id); if (!it || !(it instanceof CompItem)) fail("La comp ya no existe en este proyecto."); it.openInViewer(); return { msg: "Abierta " + it.name }; };
    api.compAdd = function (o) {
        var it = app.project.itemByID(o.id); if (!it || !(it instanceof CompItem)) fail("La comp no existe en este proyecto. Importa su .aep.");
        var d = dupComp(it, true, {}); d.openInViewer(); return { msg: "Duplicada " + d.name };
    };
    api.importAep = function (o) {
        var f = new File(o.path); if (!f.exists) fail("No existe: " + o.path);
        var io = new ImportOptions(f); io.importAs = ImportAsType.PROJECT; app.project.importFile(io);
        return { msg: "Proyecto importado" };
    };

    // ---------- BIBLIOTECA AEP 2.1 ----------
    // Las plantillas se importan una sola vez por proyecto. Cada inserción crea
    // una instancia aislada (composición y precomposiciones duplicadas), sin
    // modificar la fuente. Solo se usan APIs ExtendScript ES3 de AE 2024/2025.
    var YL_FILES = {
        text24: "Text Animation 24.x.aep",
        text: "Text Animation.aep",
        dynamic: "Dynamic Text Animation.aep"
    };
    var YL_ORIGINAL = "YAGUANO_LIBRARY_21:";
    var YL_INSTANCE = "YAGUANO_INSTANCE_21:";

    function ylPack(id) {
        if (!YL_FILES.hasOwnProperty(id)) fail("Biblioteca desconocida: " + id);
        return id;
    }
    function ylFile(o) {
        var id = ylPack(o.pack), root = String(o.root || "");
        if (!root) fail("No se recibió la ruta de la extensión desde el panel CEP.");
        if (root.indexOf("file://") === 0) root = decodeURI(root.replace(/^file:\/\//, ""));
        if (root.charAt(0) === "/" && /^[A-Za-z]:/.test(root.substr(1))) root = root.substr(1);
        var file = new File(root + "/library/" + YL_FILES[id]);
        if (!file.exists) fail("No encuentro " + YL_FILES[id] + " en la carpeta library/ de Yaguanimix. Reinstala el paquete completo.");
        return file;
    }
    function ylMark(item) { try { return String(item.comment || ""); } catch(e) { return ""; } }
    function ylImported(id) {
        var i, n=0;
        for (i=1;i<=app.project.numItems;i++) {
            var it=app.project.item(i);
            if (it instanceof CompItem && ylMark(it).indexOf(YL_ORIGINAL + id + ":")===0) n++;
        }
        return n;
    }
    function ylFind(id,name) {
        var i, marker=YL_ORIGINAL+id+":"+name;
        for(i=1;i<=app.project.numItems;i++) {
            var it=app.project.item(i);
            if (it instanceof CompItem && ylMark(it)===marker) return it;
        }
        return null;
    }
    function ylImport(o) {
        var id=ylPack(o.pack), count=ylImported(id), i, imported=0, compCount=0, seen={}, f, io;
        if(count) return {count:count,imported:false};
        f=ylFile(o); // verifica el archivo antes de hacer cambios en el proyecto
        for(i=1;i<=app.project.numItems;i++) seen[String(app.project.item(i).id)]=true;
        io=new ImportOptions(f);
        try { if (io.canImportAs(ImportAsType.PROJECT)) io.importAs=ImportAsType.PROJECT; } catch(ignore){}
        app.project.importFile(io);
        for(i=1;i<=app.project.numItems;i++) {
            var it=app.project.item(i);
            if(seen[String(it.id)]) continue;
            imported++;
            if(it instanceof CompItem) {
                it.comment=YL_ORIGINAL+id+":"+it.name;
                compCount++;
            }
        }
        if(!compCount) fail("After Effects no ha importado ninguna composición desde " + f.name + ".");
        return {count:compCount,imported:true,items:imported};
    }
    function ylResolve(o) {
        var id=ylPack(o.pack), name=String(o.name||""), src=ylFind(id,name);
        if (!name || name.length>250) fail("Elige una plantilla válida de la biblioteca.");
        if (!src) {
            if (ylImported(id)) fail("La composición '"+name+"' ya no está en la biblioteca importada. Restaura el proyecto original o importa el pack en un proyecto nuevo.");
            ylImport(o);
            src=ylFind(id,name);
        }
        if (!src) fail("No se encontró la composición '"+name+"' en el AEP original. Comprueba la versión del proyecto.");
        return src;
    }
    function ylInstancesFolder() {
        var i,it;
        for(i=1;i<=app.project.numItems;i++) {
            it=app.project.item(i);
            if (it instanceof FolderItem && it.name==="Yaguano · Instancias AEP") return it;
        }
        return app.project.items.addFolder("Yaguano · Instancias AEP");
    }
    function ylLabel(source,counter) {return "YAG · " + source.name + " · " + counter;}
    // Duplica también las precomposiciones internas y conserva footage/solids
    // sin copiarlos. memo evita duplicar el mismo source dos veces.
    function ylCloneTree(source, folder, index, memo, pairs, depth) {
        var key=String(source.id),i,lay,nested,d;
        if(memo[key]) return memo[key];
        if(depth>30) fail("Dependencias de composición demasiado profundas.");
        d=source.duplicate();
        memo[key]=d;
        d.name=ylLabel(source,index);
        d.comment=YL_INSTANCE + String(source.id);
        d.parentFolder=folder;
        pairs.push({src:source,copy:d});
        for(i=1;i<=d.numLayers;i++) {
            lay=d.layer(i);
            try{nested=lay.source;}catch(e){nested=null;}
            if(nested && nested instanceof CompItem){
                var clone=ylCloneTree(nested,folder,index,memo,pairs,depth+1);
                // Expresiones por referencia del source se corrigen después
                lay.replaceSource(clone,false);
            }
        }
        return d;
    }
    function ylRewriteExpressions(group,map) {
        var i,prop,e,exp,replaced;
        if(!group || !group.numProperties) return;
        for(i=1;i<=group.numProperties;i++) {
            try{prop=group.property(i);}catch(err){continue;}
            if(!prop)continue;
            if(prop.propertyType===PropertyType.PROPERTY){
                if(!prop.canSetExpression || !prop.expressionEnabled)continue;
                try {
                    exp=prop.expression;
                    if(!exp || exp.indexOf("comp(")<0)continue;
                    replaced=exp.replace(/\bcomp\s*\(\s*(["'])([^"']+)\1\s*\)/g,function(full,quote,name){
                        if(!map.hasOwnProperty(name))return full;
                        return "comp("+quote+map[name]+quote+")";
                    });
                    if(replaced!==exp)prop.expression=replaced;
                }catch(ignore){}
            } else ylRewriteExpressions(prop,map);
        }
    }
    function ylReferencedComps(group, seen) {
        var i,prop,exp,re,name;
        if(!group || !group.numProperties)return;
        for(i=1;i<=group.numProperties;i++){
            try{prop=group.property(i);}catch(e){continue;}
            if(!prop)continue;
            if(prop.propertyType===PropertyType.PROPERTY){
                if(!prop.canSetExpression || !prop.expressionEnabled)continue;
                try{
                    exp=prop.expression;
                    if(!exp || exp.indexOf("comp(")<0)continue;
                    re=/\bcomp\s*\(\s*(["'])([^"']+)\1\s*\)/g;
                    while((name=re.exec(exp))!==null)seen[name[2]]=true;
                }catch(ignore){}
            }else ylReferencedComps(prop,seen);
        }
    }
    function ylCloneExternalRefs(id,pairs,folder,slot,memo){
        var i,j,copy,refs,refName,source;
        // Algunas plantillas usan comp("Nombre") sin una capa de precomp
        // (p. ej. referencias a un controller de otro Title). Clonamos
        // también esa composición para evitar depender de su original editable.
        for(i=0;i<pairs.length && i<120;i++){
            copy=pairs[i].copy;refs={};
            for(j=1;j<=copy.numLayers;j++) ylReferencedComps(copy.layer(j),refs);
            for(refName in refs) if(refs.hasOwnProperty(refName)){
                source=ylFind(id,refName);
                if(source && !memo[String(source.id)])ylCloneTree(source,folder,slot,memo,pairs,0);
            }
        }
    }
    function ylIsolateExpressions(pairs) {
        var map={}, collisions={},i,j,orig,copy,lay;
        for(i=0;i<pairs.length;i++) {
            orig=pairs[i].src.name;
            if(map.hasOwnProperty(orig)) collisions[orig]=true;
            map[orig]=pairs[i].copy.name;
        }
        for(var key in collisions) if(collisions.hasOwnProperty(key)) delete map[key];
        for(i=0;i<pairs.length;i++) {
            copy=pairs[i].copy;
            for(j=1;j<=copy.numLayers;j++) ylRewriteExpressions(copy.layer(j),map);
        }
    }
    api.aepLibraryStatus=function(o){
        var id=ylPack(o.pack),f=ylFile(o),num=ylImported(id);
        return {msg:"Biblioteca " + id + (num?" ya importada":" lista para importar"),data:{loaded:num>0,comps:num,file:f.name}};
    };
    api.aepLibraryList=function(o){
        var id=ylPack(o.pack),i,items=[];
        for(i=1;i<=app.project.numItems;i++){
            var it=app.project.item(i), tag=YL_ORIGINAL+id+":";
            if(it instanceof CompItem && ylMark(it).indexOf(tag)===0)
                items.push({name:it.name,id:it.id,seconds:it.duration,frames:it.frameRate});
        }
        return {msg:items.length+" composiciones disponibles",data:items};
    };
    api.aepLibraryImport=function(o){
        var result=ylImport(o);
        return {msg:result.imported?"Pack original importado al proyecto":"Este pack ya estaba importado; no se ha duplicado",data:result};
    };
    api.aepLibraryOpen=function(o){
        var source=ylResolve(o);
        source.openInViewer();
        return {msg:"Original abierto: "+source.name+". No se ha modificado.",data:{name:source.name}};
    };
    api.aepLibraryApply=function(o){
        // Al importar un proyecto, AE puede activar otra composición.
        // Capturamos el destino ANTES de la importación.
        var dest=comp(),src,folder,memo={},pairs=[],instance,lay,t;
        if (ylMark(dest).indexOf(YL_ORIGINAL)===0)
            fail("Estás viendo una plantilla original. Abre primero tu composición de destino y después pulsa Aplicar.");
        src=ylResolve(o); folder=ylInstancesFolder();
        var slot=1, i;
        for(i=1;i<=app.project.numItems;i++){
            var it=app.project.item(i);
            if(it instanceof CompItem && ylMark(it).indexOf(YL_INSTANCE)===0)slot++;
        }
        try {
            instance=ylCloneTree(src,folder,slot,memo,pairs,0);
            ylCloneExternalRefs(o.pack,pairs,folder,slot,memo);
            ylIsolateExpressions(pairs);
            lay=dest.layers.add(instance);
        } catch(err) {
            // No dejar precomposiciones huérfanas si falla algún clon o efecto.
            for(i=pairs.length-1;i>=0;i--) {
                try{pairs[i].copy.remove();}catch(cleanErr){}
            }
            throw err;
        }
        if (o.fit===true) {
            try {
                var factor=Math.min(dest.width/instance.width,dest.height/instance.height)*100;
                if(factor>0 && isFinite(factor))lay.transform.scale.setValue([factor,factor]);
            }catch(fitError){}
        }
        lay.name="Yaguano · "+src.name;
        t=dest.time;
        // Nueva capa en el indicador, sin alterar keyframes del original.
        lay.startTime=t;
        try{lay.inPoint=t;lay.outPoint=Math.min(dest.duration,t+instance.duration);}catch(no){}
        if(o.open===true)instance.openInViewer();
        return {msg:"Añadida plantilla '"+src.name+"' con "+pairs.length+" composición(es) independientes.",data:{count:pairs.length,instance:instance.name,destination:dest.name}};
    };

    api.fontsList = function () {
        var out = [], i, j;
        try {
            var all = app.fonts.allFonts;
            for (i = 0; i < all.length && out.length < 8000; i++) for (j = 0; j < all[i].length; j++) out.push({ ps: all[i][j].postScriptName, fam: all[i][j].familyName, sty: all[i][j].styleName });
        } catch (e) { fail("Esta versión de After Effects no expone la lista de fuentes (se necesita 22.0+)."); }
        return { msg: out.length + " fuentes", data: out };
    };
    api.applyFont = function (o) {
        var ls = textLayers(), i;
        for (i = 0; i < ls.length; i++) { var sp = ls[i].property("ADBE Text Properties").property("ADBE Text Document"), td = sp.value; td.font = o.ps; sp.setValue(td); }
        return { msg: "Fuente aplicada" };
    };

    // ---------- GRID ----------
    var ZONES = {
        tiktok: { name: "TikTok", z: [["Top bar", 0, 0, 1080, 160], ["Caption + audio", 0, 1400, 1080, 520], ["Side buttons", 900, 880, 180, 760]] },
        instagram: { name: "Instagram", z: [["Top bar", 0, 0, 1080, 220], ["Caption", 0, 1500, 1080, 420], ["Side buttons", 930, 1000, 150, 620]] },
        youtube: { name: "YouTube Shorts", z: [["Top bar", 0, 0, 1080, 200], ["Caption + channel", 0, 1420, 1080, 500], ["Side buttons", 900, 960, 180, 640]] }
    };
    api.grid = function (o) {
        var c = comp(), spec = ZONES[o.platform]; if (!spec) fail("Plataforma desconocida");
        var nm = "Animix Grid - " + spec.name, i;
        for (i = c.numLayers; i >= 1; i--) if (c.layer(i).name === nm) c.layer(i).remove();
        if (o.remove) return { msg: "Overlay eliminado" };
        var sx = c.width / 1080, sy = c.height / 1920;
        var l = c.layers.addShape(); l.name = nm; l.guideLayer = true; l.transform.opacity.setValue(o.opacity || 45);
        var root = l.property("ADBE Root Vectors Group"), k;
        for (k = 0; k < spec.z.length; k++) {
            var z = spec.z[k], g = root.addProperty("ADBE Vector Group"); g.name = z[0];
            var cs = g.property("ADBE Vectors Group"), rc = cs.addProperty("ADBE Vector Shape - Rect");
            rc.property("ADBE Vector Rect Size").setValue([z[3] * sx, z[4] * sy]);
            rc.property("ADBE Vector Rect Position").setValue([(z[1] + z[3] / 2) * sx, (z[2] + z[4] / 2) * sy]);
            var fl = cs.addProperty("ADBE Vector Graphic - Fill"); fl.property("ADBE Vector Fill Color").setValue([1, 0.15, 0.25, 1]);
        }
        l.transform.anchorPoint.setValue([0, 0]); l.transform.position.setValue([0, 0]);
        l.moveToBeginning();
        return { msg: "Overlay " + spec.name + " añadido (capa guía, no se renderiza)" };
    };

    // ---------- YAGUANIMIX DYNAMIC GRID 2.7 ----------
    // ExtendScript ES3: no external AE plugins; editable native vector paths.
    var DG_NAME = "Yaguanimix Dynamic Grid";
    var DG_BG = "Yaguanimix Dynamic Backdrop";
    var DG_META = "YAGUANIMIX_DGRID_V1:";
    var DG_EXPR = "// YAGUANIMIX_DGRID_ATTACH\n";
    var DG_MASK = "YAG Dynamic Grid Clip";
    function dgClamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }
    function dgCopy(v) { return JSON.parse(JSON.stringify(v)); }
    function dgColor(h) {var a=hex2rgb(h);return [a[0],a[1],a[2],1];}
    function dgArray(n) { var a = [], i; for (i = 0; i <= n; i++) a.push(i / n); return a; }
    function dgDefault() { return { cols:5, rows:5, layout:{ x:dgArray(5), y:dgArray(5) }, gap:6, radius:10, lineWidth:2,
      cellOpacity:22, rim:0, cellColor:"#8b7bff", lineColor:"#d7ddff", markerColor:"#ffffff", markers:true, draw:"both" }; }
    function dgValidate(o) {
      if (!o) o = dgDefault();
      o.cols = dgClamp(Math.round(+o.cols || 5), 1, 8);
      o.rows = dgClamp(Math.round(+o.rows || 5), 1, 8);
      if (!o.layout || !o.layout.x || !o.layout.y || o.layout.x.length !== o.cols+1 || o.layout.y.length !== o.rows+1)
        fail("El layout no coincide con las filas/columnas.");
      var axes = [o.layout.x, o.layout.y], a, i, axis;
      for (a = 0; a < 2; a++) {
        axis = axes[a];
        if (Math.abs(+axis[0]) > .001 || Math.abs(+axis[axis.length-1]-1) > .001) fail("Los límites del grid deben ser 0 y 1.");
        for (i = 1; i < axis.length; i++) if (typeof axis[i] !== "number" || !isFinite(axis[i]) || axis[i] <= axis[i-1]) fail("Divisores inválidos: deben estar ordenados.");
      }
      o.gap = dgClamp(+o.gap || 0,0,50); o.radius=dgClamp(+o.radius||0,0,90);
      o.lineWidth=dgClamp(+o.lineWidth||1,.25,12); o.rim=dgClamp(+o.rim||0,0,12);
      o.cellOpacity=dgClamp(+o.cellOpacity||0,0,100);
      return o;
    }
    function dgLayer(c) { var i,l;for(i=1;i<=c.numLayers;i++){l=c.layer(i);if(l.name===DG_NAME)return l;}return null; }
    function dgBgLayer(c) { var i,l;for(i=1;i<=c.numLayers;i++){l=c.layer(i);if(l.name===DG_BG)return l;}return null; }
    function dgConfig(l) {
      try { if(l && l.comment && l.comment.indexOf(DG_META)===0)return JSON.parse(l.comment.substr(DG_META.length)); } catch (e) { }
      return null;
    }
    function dgSave(l,o) { l.comment=DG_META+JSON.stringify(o); }
    function dgGroup(root,name) {var g=root.addProperty("ADBE Vector Group");g.name=name;return g.property("ADBE Vectors Group");}
    function dgRect(g, name, pos, size, color, opacity, roundness, rim, rimColor) {
      var rc=g.addProperty("ADBE Vector Shape - Rect"),fl,st;
      rc.name=name;
      rc.property("ADBE Vector Rect Position").setValue(pos);
      rc.property("ADBE Vector Rect Size").setValue(size);
      rc.property("ADBE Vector Rect Roundness").setValue(roundness || 0);
      fl=g.addProperty("ADBE Vector Graphic - Fill");
      fl.property("ADBE Vector Fill Color").setValue(dgColor(color));
      fl.property("ADBE Vector Fill Opacity").setValue(opacity);
      st=g.addProperty("ADBE Vector Graphic - Stroke");st.property("ADBE Vector Stroke Color").setValue(dgColor(rimColor));st.property("ADBE Vector Stroke Width").setValue(rim);
      return rc;
    }
    function dgEllipse(g,name,pos,d,color) {
      // AE invalida referencias a hermanos al insertar una propiedad en grupos indexados.
      var el=g.addProperty("ADBE Vector Shape - Ellipse"),fl;
      el.name=name;
      el.property("ADBE Vector Ellipse Position").setValue(pos);
      el.property("ADBE Vector Ellipse Size").setValue([d,d]);
      fl=g.addProperty("ADBE Vector Graphic - Fill");
      fl.property("ADBE Vector Fill Color").setValue(dgColor(color));
    }
    function dgCell(c,L,r,col,gap){var x=L.x,y=L.y,w=c.width,hh=c.height;
      return {p:[(x[col]+x[col+1])*w/2,(y[r]+y[r+1])*hh/2],
        s:[Math.max(.5,(x[col+1]-x[col])*w-gap),Math.max(.5,(y[r+1]-y[r])*hh-gap)]};
    }
    function dgShapeProps(l, name, rectName) {
      var group=l.property("ADBE Root Vectors Group").property(name);
      if(!group)return null;
      var path=group.property("ADBE Vectors Group").property(rectName);
      return path||null;
    }
    function dgEachObject(l,cfg,fn){var r,i,path;
      for(r=0;r<cfg.rows;r++)for(i=0;i<cfg.cols;i++){
        path=dgShapeProps(l,"DG Cell "+r+" "+i,"DG Rect");if(path)fn(path,"cell",r,i);
      }
      for(i=1;i<cfg.cols;i++){path=dgShapeProps(l,"DG Vertical "+i,"DG Rect");if(path)fn(path,"vline",0,i);}
      for(i=1;i<cfg.rows;i++){path=dgShapeProps(l,"DG Horizontal "+i,"DG Rect");if(path)fn(path,"hline",i,0);}
      for(r=1;r<cfg.rows;r++)for(i=1;i<cfg.cols;i++){
        path=dgShapeProps(l,"DG Dot "+r+" "+i,"DG Dot");if(path)fn(path,"dot",r,i);
      }
    }
    function dgRemoveKeys(p) {while(p.numKeys) p.removeKey(p.numKeys);}
    function dgApplyStyle(l,newO,oldO){var c=comp(),root=l.property("ADBE Root Vectors Group");
      dgEachObject(l,oldO,function(path,kind,r,i){var group=path.parentProperty,fl=group.property("ADBE Vector Graphic - Fill"),stroke=group.property("ADBE Vector Graphic - Stroke");
        if(kind==="cell"){
          if(fl){fl.property("ADBE Vector Fill Color").setValue(dgColor(newO.cellColor));fl.property("ADBE Vector Fill Opacity").setValue(oldO.draw==="lines"?0:newO.cellOpacity);}
          path.property("ADBE Vector Rect Roundness").setValue(newO.radius);
          if(stroke){stroke.property("ADBE Vector Stroke Width").setValue(newO.rim);stroke.property("ADBE Vector Stroke Color").setValue(dgColor(newO.lineColor));}
        }else if(kind==="vline"||kind==="hline"){
          if(fl)fl.property("ADBE Vector Fill Color").setValue(dgColor(newO.lineColor));
        }else if(fl)fl.property("ADBE Vector Fill Color").setValue(dgColor(newO.markerColor));
      });
      var tm=comp().time,pp,i;
      for(i=0;i<=newO.cols;i++){pp=dgSlider(l,dgCtrlName("x",i));if(pp.numKeys)pp.setValueAtTime(tm,newO.layout.x[i]);else pp.setValue(newO.layout.x[i]);}
      for(i=0;i<=newO.rows;i++){pp=dgSlider(l,dgCtrlName("y",i));if(pp.numKeys)pp.setValueAtTime(tm,newO.layout.y[i]);else pp.setValue(newO.layout.y[i]);}
      pp=dgSlider(l,"DG Gap");if(pp.numKeys)pp.setValueAtTime(tm,newO.gap);else pp.setValue(newO.gap);
      pp=dgSlider(l,"DG Line Width");if(pp.numKeys)pp.setValueAtTime(tm,newO.lineWidth);else pp.setValue(newO.lineWidth);
      dgRigExpressions(l,newO);
    }
    api.dgCreate = function(o){var c=comp(),prev=dgLayer(c),root,l,g,r,i,d,oldCfg,z,ep;
      dgValidate(o);
      if(prev && !dgConfig(prev))fail("Ya existe una capa llamada Dynamic Grid sin metadatos. Renómbrala antes de crear una nueva.");
      if(prev){
        oldCfg=dgConfig(prev);
        if(oldCfg.cols!==o.cols||oldCfg.rows!==o.rows){
          for(z=1;z<=c.numLayers;z++)if(c.layer(z)!==prev){
            try{ep=c.layer(z).property("ADBE Transform Group").property("ADBE Position").expression;
              if(ep&&ep.indexOf(DG_EXPR)===0)fail("Desvincula las capas antes de cambiar las dimensiones del grid.");
            }catch(e){if(String(e).indexOf("Desvincula")>=0)throw e;}
          }
        }
      }
      // Construcción transaccional: no borrar el grid anterior hasta que exista el nuevo.
      l=c.layers.addShape();
      try {
        l.label=10;
        l.transform.anchorPoint.setValue([0,0]);l.transform.position.setValue([0,0]);
        root=l.property("ADBE Root Vectors Group");
        for(r=0;r<o.rows;r++)for(i=0;i<o.cols;i++){
          d=dgCell(c,o.layout,r,i,o.gap);g=dgGroup(root,"DG Cell "+r+" "+i);
          dgRect(g,"DG Rect",d.p,d.s,o.cellColor,o.draw==="lines"?0:o.cellOpacity,o.radius,o.draw==="lines"?0:o.rim,o.lineColor);
        }
        if(o.draw!=="cells"){
          for(i=1;i<o.cols;i++){g=dgGroup(root,"DG Vertical "+i);dgRect(g,"DG Rect",[o.layout.x[i]*c.width,c.height/2],[o.lineWidth,c.height],o.lineColor,100,0,0,o.lineColor);}
          for(r=1;r<o.rows;r++){g=dgGroup(root,"DG Horizontal "+r);dgRect(g,"DG Rect",[c.width/2,o.layout.y[r]*c.height],[c.width,o.lineWidth],o.lineColor,100,0,0,o.lineColor);}
        }
        if(o.markers)for(r=1;r<o.rows;r++)for(i=1;i<o.cols;i++){
          g=dgGroup(root,"DG Dot "+r+" "+i);dgEllipse(g,"DG Dot",[o.layout.x[i]*c.width,o.layout.y[r]*c.height],Math.max(4,o.lineWidth*2+2),o.markerColor);
        }
        dgApplyCtrlValues(l,o,0,false);
        dgRigExpressions(l,o);
        dgSave(l,o);
      }catch(err){try{l.remove();}catch(ee){}throw err;}
      // Mantener el grid anterior si falla la construcción de shapes.
      if(prev)prev.remove();
      l.name=DG_NAME;l.moveToBeginning();
      return {msg:"Dynamic Grid "+o.cols+"×"+o.rows+" creado: "+(o.cols*o.rows)+" celdas editables"};
    };
    api.dgStatus=function(){var l=dgLayer(comp()),cfg=l?dgConfig(l):null;
      if(!cfg)return {msg:"No existe un Grid Pro reconocido en la composición",data:null};
      return {msg:"Grid encontrado: "+cfg.cols+"×"+cfg.rows,data:cfg};
    };
    api.dgSetLayout=function(o){var c=comp(),l=dgLayer(c),cfg,animated=0,i,p;
      if(!l)fail("Crea primero el Dynamic Grid.");cfg=dgConfig(l);if(!cfg)fail("Grid sin metadatos.");
      if(o.cols!==cfg.cols||o.rows!==cfg.rows||o.draw!==cfg.draw||o.markers!==cfg.markers)
        fail("Para cambiar filas, columnas, modo de dibujo o marcadores pulsa «Crear / reconstruir grid».");
      dgValidate(o);
      dgApplyStyle(l,o,cfg);
      for(i=0;i<=o.cols;i++){
        p=dgSlider(l,dgCtrlName("x",i));
        try{p.expression="";}catch(e1){}
        if(p.numKeys){p.setValueAtTime(c.time,o.layout.x[i]);animated++;}else p.setValue(o.layout.x[i]);
      }
      for(i=0;i<=o.rows;i++){
        p=dgSlider(l,dgCtrlName("y",i));
        try{p.expression="";}catch(e2){}
        if(p.numKeys){p.setValueAtTime(c.time,o.layout.y[i]);animated++;}else p.setValue(o.layout.y[i]);
      }
      p=dgSlider(l,"DG Gap");try{p.expression="";}catch(e3){}if(p.numKeys){p.setValueAtTime(c.time,o.gap);animated++;}else p.setValue(o.gap);
      p=dgSlider(l,"DG Line Width");try{p.expression="";}catch(e4){}if(p.numKeys){p.setValueAtTime(c.time,o.lineWidth);animated++;}else p.setValue(o.lineWidth);
      dgRigExpressions(l,o);
      dgSave(l,o);
      return {msg:"Disposición actualizada"+(animated?" · keyframe en "+c.time.toFixed(2)+" s":"")};
    };
    api.dgStyle=function(o){var l=dgLayer(comp()),old;if(!l)fail("Crea primero el Dynamic Grid.");dgValidate(o);old=dgConfig(l);
      if(!old)fail("No se reconoce la configuración del grid.");
      if(o.cols!==old.cols||o.rows!==old.rows||o.draw!==old.draw||o.markers!==old.markers)fail("Para cambiar filas, modo de dibujo o marcadores usa Reconstruir.");
      dgApplyStyle(l,o,old);dgSave(l,o);return {msg:"Estilo actualizado sin borrar keyframes"};
    };
    api.dgRemove=function(){var c=comp(),l=dgLayer(c),i,exp;if(!l)return {msg:"No había Dynamic Grid"};
      for(i=1;i<=c.numLayers;i++){if(c.layer(i)===l)continue;try{exp=c.layer(i).property("ADBE Transform Group").property("ADBE Position").expression;
        if(exp&&exp.indexOf(DG_EXPR)===0)fail("Hay capas ancladas al grid. Desvincúlalas antes de eliminarlo.");}catch(e){if(String(e).indexOf("ancladas")>=0)throw e;}}
      l.remove();return {msg:"Dynamic Grid eliminado"};
    };
    function dgWeights(name,n,axis){var out=[],weights=[],i,v,x,sum=0;
      for(i=0;i<n;i++){x=(i+.5)/n;v=1;
        if(name==="Breathe")v=1+.48*Math.sin(x*Math.PI);
        else if(name==="Shutter")v=1+(i%2?-.78:.78);
        else if(name==="Collapse & Bloom")v=1+(Math.abs(x-.5)-.25)*2.8;
        else if(name==="Wave")v=1+.82*Math.sin(i*1.6+(axis==="x"?1:2));
        else if(name==="Accordion")v=1+(i%2?.95:-.48);
        else if(name==="Golden Split")v=1+(x<.5?1.3:-.35);
        else if(name==="Spotlight")v=1+(i===Math.floor(n/2)?2.5:-.4);
        else if(name==="Swing")v=1+.8*Math.cos(i*2.2);
        else if(name==="Stairs")v=1+(.8-x);
        else if(name==="Rhythm Shift")v=1+([.8,-.6,.4,-.4][i%4]);
        else if(name==="Random")v=1+.8*Math.sin(i*23.11+axis.length*5);
        v=Math.max(.08,v);weights.push(v);sum+=v;
      }
      out=[0];var accum=0;for(i=0;i<n;i++){accum+=weights[i]/sum;out.push(accum);}out[n]=1;return out;
    }
    function dgEase(t,name){var pi=Math.PI,s,c,d,q;
      if(name==="Linear")return t;
      if(name==="Easy Ease"||name==="Smooth"||name==="Classic"||name==="Ease In Out"||name==="Cubic In Out")return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
      if(name==="Punchy"||name==="Expo Out")return t===1?1:1-Math.pow(2,-10*t);
      if(name==="Ease In"||name==="Quad In")return t*t;
      if(name==="Ease Out"||name==="Quad Out")return 1-(1-t)*(1-t);
      if(name==="Quad In Out")return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
      if(name==="Cubic In")return t*t*t;
      if(name==="Cubic Out")return 1-Math.pow(1-t,3);
      if(name==="Quart In")return Math.pow(t,4);
      if(name==="Quart Out")return 1-Math.pow(1-t,4);
      if(name==="Quart In Out")return t<.5?8*Math.pow(t,4):1-Math.pow(-2*t+2,4)/2;
      if(name==="Quint In")return Math.pow(t,5);
      if(name==="Quint Out")return 1-Math.pow(1-t,5);
      if(name==="Quint In Out")return t<.5?16*Math.pow(t,5):1-Math.pow(-2*t+2,5)/2;
      if(name==="Sine In")return 1-Math.cos(t*pi/2);
      if(name==="Sine Out")return Math.sin(t*pi/2);
      if(name==="Sine In Out")return -(Math.cos(pi*t)-1)/2;
      if(name==="Expo In")return t===0?0:Math.pow(2,10*t-10);
      if(name==="Expo In Out")return t===0?0:t===1?1:t<.5?Math.pow(2,20*t-10)/2:(2-Math.pow(2,-20*t+10))/2;
      if(name==="Back In")return 2.70158*t*t*t-1.70158*t*t;
      if(name==="Back Out"||name==="Bounce & overshoot")return 1+2.70158*Math.pow(t-1,3)+1.70158*Math.pow(t-1,2);
      if(name==="Back In Out")return t<.5?Math.pow(2*t,2)*((2.5949+1)*2*t-2.5949)/2:(Math.pow(2*t-2,2)*((2.5949+1)*(2*t-2)+2.5949)+2)/2;
      if(name==="Elastic Out")return t===0?0:t===1?1:Math.pow(2,-10*t)*Math.sin((t*10-.75)*2*pi/3)+1;
      if(name==="Bounce Out"){
        c=7.5625;d=2.75;
        if(t<1/d)return c*t*t;
        if(t<2/d){t-=1.5/d;return c*t*t+.75;}
        if(t<2.5/d){t-=2.25/d;return c*t*t+.9375;}
        t-=2.625/d;return c*t*t+.984375;
      }
      return t;
    }
    function dgBlend(a,b,p){var x=[],y=[],i;for(i=0;i<a.x.length;i++)x.push(a.x[i]+(b.x[i]-a.x[i])*p);
      for(i=0;i<a.y.length;i++)y.push(a.y[i]+(b.y[i]-a.y[i])*p);return{x:x,y:y};}
    function dgGeometry(c,L,kind,r,i,gap,width){
      if(kind==="cell")return dgCell(c,L,r,i,gap);
      if(kind==="vline")return {p:[L.x[i]*c.width,c.height/2],s:[width,c.height]};
      if(kind==="hline")return {p:[c.width/2,L.y[r]*c.height],s:[c.width,width]};
      return {p:[L.x[i]*c.width,L.y[r]*c.height],s:[Math.max(4,width*2+2),Math.max(4,width*2+2)]};
    }
    function dgProp(path,kind,which){var r=kind==="dot";
      if(which==="p")return path.property(r?"ADBE Vector Ellipse Position":"ADBE Vector Rect Position");
      return path.property(r?"ADBE Vector Ellipse Size":"ADBE Vector Rect Size");
    }
    function dgSlider(l,name,val){var e=fx(l).property(name);if(!e){e=fx(l).addProperty("ADBE Slider Control");e.name=name;}if(val!==undefined)e.property(1).setValue(val);return e.property(1);}
    function dgCtrlName(axis,index){return "DG "+axis.toUpperCase()+" "+index;}
    function dgClearCtrlAnim(l,cfg){var ax,i,p;
      for(ax=0;ax<2;ax++)for(i=0;i<=((ax===0)?cfg.cols:cfg.rows);i++){
        p=dgSlider(l,dgCtrlName(ax===0?"x":"y",i));
        try{p.expression="";}catch(e){}
        dgRemoveKeys(p);
      }
      p=dgSlider(l,"DG Gap");try{p.expression="";}catch(e2){}dgRemoveKeys(p);
      p=dgSlider(l,"DG Line Width");try{p.expression="";}catch(e3){}dgRemoveKeys(p);
    }
    function dgApplyCtrlValues(l,cfg,tm,keyed){var i,p;
      for(i=0;i<=cfg.cols;i++){p=dgSlider(l,dgCtrlName("x",i));if(keyed)p.setValueAtTime(tm,cfg.layout.x[i]);else p.setValue(cfg.layout.x[i]);}
      for(i=0;i<=cfg.rows;i++){p=dgSlider(l,dgCtrlName("y",i));if(keyed)p.setValueAtTime(tm,cfg.layout.y[i]);else p.setValue(cfg.layout.y[i]);}
      p=dgSlider(l,"DG Gap");if(keyed)p.setValueAtTime(tm,cfg.gap);else p.setValue(cfg.gap);
      p=dgSlider(l,"DG Line Width");if(keyed)p.setValueAtTime(tm,cfg.lineWidth);else p.setValue(cfg.lineWidth);
    }
    function dgExprCellPos(r,c){return "// YAGUANIMIX_DGRID_RIG\n"+
      "var x0=thisLayer.effect(\""+dgCtrlName("x",c)+"\")(1)*thisComp.width;\n"+
      "var x1=thisLayer.effect(\""+dgCtrlName("x",c+1)+"\")(1)*thisComp.width;\n"+
      "var y0=thisLayer.effect(\""+dgCtrlName("y",r)+"\")(1)*thisComp.height;\n"+
      "var y1=thisLayer.effect(\""+dgCtrlName("y",r+1)+"\")(1)*thisComp.height;\n"+
      "[(x0+x1)/2,(y0+y1)/2];";}
    function dgExprCellSize(r,c){return "// YAGUANIMIX_DGRID_RIG\n"+
      "var x0=thisLayer.effect(\""+dgCtrlName("x",c)+"\")(1)*thisComp.width;\n"+
      "var x1=thisLayer.effect(\""+dgCtrlName("x",c+1)+"\")(1)*thisComp.width;\n"+
      "var y0=thisLayer.effect(\""+dgCtrlName("y",r)+"\")(1)*thisComp.height;\n"+
      "var y1=thisLayer.effect(\""+dgCtrlName("y",r+1)+"\")(1)*thisComp.height;\n"+
      "var g=thisLayer.effect(\"DG Gap\")(1);\n"+
      "[Math.max(.5,x1-x0-g),Math.max(.5,y1-y0-g)];";}
    function dgExprVPos(i){return "// YAGUANIMIX_DGRID_RIG\n[thisLayer.effect(\""+dgCtrlName("x",i)+"\")(1)*thisComp.width,thisComp.height/2];";}
    function dgExprVSize(){return "// YAGUANIMIX_DGRID_RIG\n[thisLayer.effect(\"DG Line Width\")(1),thisComp.height];";}
    function dgExprHPos(r){return "// YAGUANIMIX_DGRID_RIG\n[thisComp.width/2,thisLayer.effect(\""+dgCtrlName("y",r)+"\")(1)*thisComp.height];";}
    function dgExprHSize(){return "// YAGUANIMIX_DGRID_RIG\n[thisComp.width,thisLayer.effect(\"DG Line Width\")(1)];";}
    function dgExprDotPos(r,c){return "// YAGUANIMIX_DGRID_RIG\n[thisLayer.effect(\""+dgCtrlName("x",c)+"\")(1)*thisComp.width,thisLayer.effect(\""+dgCtrlName("y",r)+"\")(1)*thisComp.height];";}
    function dgExprDotSize(){return "// YAGUANIMIX_DGRID_RIG\nvar w=thisLayer.effect(\"DG Line Width\")(1); var d=Math.max(4,w*2+2); [d,d];";}
    function dgRigExpressions(l,cfg){var i;for(i=0;i<=cfg.cols;i++)dgSlider(l,dgCtrlName("x",i));for(i=0;i<=cfg.rows;i++)dgSlider(l,dgCtrlName("y",i));dgSlider(l,"DG Gap");dgSlider(l,"DG Line Width");dgEachObject(l,cfg,function(path,kind,r,i){var p=dgProp(path,kind,"p"),s=dgProp(path,kind,"s");
      if(kind==="cell"){p.expression=dgExprCellPos(r,i);s.expression=dgExprCellSize(r,i);}
      else if(kind==="vline"){p.expression=dgExprVPos(i);s.expression=dgExprVSize();}
      else if(kind==="hline"){p.expression=dgExprHPos(r);s.expression=dgExprHSize();}
      else{p.expression=dgExprDotPos(r,i);s.expression=dgExprDotSize();}
    });}
    function dgOrder(kind,r,col,o){var n=o.cols*o.rows,x;
      if(kind!=="cell")return 0;
      if(o.order==="column")return col*o.rows+r;
      if(o.order==="reverse")return n-1-(r*o.cols+col);
      if(o.order==="center")return Math.round((Math.abs(r-(o.rows-1)/2)+Math.abs(col-(o.cols-1)/2))*2);
      if(o.order==="random")return (r*137+col*61+29)%n;
      return r*o.cols+col;
    }
    function dgLastKey(l,cfg){var maxT=-1,i,p;
      for(i=0;i<=cfg.cols;i++){p=dgSlider(l,dgCtrlName("x",i));if(p.numKeys)maxT=Math.max(maxT,p.keyTime(p.numKeys));}
      for(i=0;i<=cfg.rows;i++){p=dgSlider(l,dgCtrlName("y",i));if(p.numKeys)maxT=Math.max(maxT,p.keyTime(p.numKeys));}
      p=dgSlider(l,"DG Gap");if(p.numKeys)maxT=Math.max(maxT,p.keyTime(p.numKeys));
      p=dgSlider(l,"DG Line Width");if(p.numKeys)maxT=Math.max(maxT,p.keyTime(p.numKeys));
      return maxT;
    }
    function dgDividerRank(axis,index,o){var count=axis==="x"?o.cols:o.rows,mid=(count+1)/2;
      if(o.order==="reverse")return count-index;
      if(o.order==="center")return Math.abs(index-mid);
      if(o.order==="random")return (index*137+(axis==="x"?17:43))%(count+1);
      return index;
    }
    function dgAnimSlider(p,t0,t1,v0,v1,samples,easing){var step,k,tt,amt;
      p.setValueAtTime(t0,v0);
      for(step=1;step<=samples;step++){tt=step/samples;amt=dgEase(tt,easing);p.setValueAtTime(t0+(t1-t0)*tt,v0+(v1-v0)*amt);} 
    }
    function dgWriteAnimation(c,l,cfg,o,layouts){var start=c.time,move,hold,i,segments=[],cursor,custom=!!o.custom,stagger=dgClamp(+o.stagger||0,0,.5),samples=12,maxEnd,seg,axis,index,p,offset,lastValue;
      if(o.extend){start=Math.max(start,dgLastKey(l,cfg)+c.frameDuration);}
      if(custom){
        cursor=start+dgClamp(+o.frames[0].hold||0,0,5);
        for(i=1;i<o.frames.length;i++){
          move=dgClamp(+o.frames[i].move||.8,.1,6);hold=dgClamp(+o.frames[i].hold||0,0,5);
          segments.push({a:o.frames[i-1].layout,b:o.frames[i].layout,t:cursor,move:move,hold:hold});cursor+=move+hold;
        }
      }else{
        move=dgClamp(+o.move||.8,.1,6);hold=dgClamp(+o.hold||0,0,5);
        segments.push({a:layouts[0],b:layouts[1],t:start,move:move,hold:hold});
        segments.push({a:layouts[1],b:layouts[0],t:start+move+hold,move:move,hold:0});
      }
      if(!segments.length)fail("Se necesitan al menos dos layouts.");
      maxEnd=segments[segments.length-1].t+segments[segments.length-1].move+segments[segments.length-1].hold+stagger*Math.max(cfg.cols,cfg.rows);
      if(maxEnd>c.duration+.0001)fail("La animación excede la duración de la composición. Acorta Move/Hold o Stagger.");
      if(!o.extend)dgClearCtrlAnim(l,cfg);
      dgRigExpressions(l,cfg);
      for(axis in {x:1,y:1}){
        var count=(axis==="x")?cfg.cols:cfg.rows;
        for(index=0;index<=count;index++){
          p=dgSlider(l,dgCtrlName(axis,index));
          try{p.expression="";}catch(ex){}
          offset=(index===0||index===count)?0:dgDividerRank(axis,index,o)*stagger;
          if(custom)p.setValueAtTime(start+offset,o.frames[0].layout[axis][index]);
          for(i=0;i<segments.length;i++){
            seg=segments[i];
            dgAnimSlider(p,seg.t+offset,seg.t+offset+seg.move,seg.a[axis][index],seg.b[axis][index],samples,o.easing);
            if(seg.hold>0)p.setValueAtTime(seg.t+offset+seg.move+seg.hold,seg.b[axis][index]);
          }
          if(o.loop)p.expression='loopOut("cycle")';
        }
      }
      p=dgSlider(l,"DG Gap");try{p.expression="";}catch(e1){} if(!o.extend&&p.numKeys)dgRemoveKeys(p); p.setValue(cfg.gap); if(o.loop)p.expression='value';
      p=dgSlider(l,"DG Line Width");try{p.expression="";}catch(e2){} if(!o.extend&&p.numKeys)dgRemoveKeys(p); p.setValue(cfg.lineWidth); if(o.loop)p.expression='value';
      return maxEnd;
    }
    api.dgAnimate=function(o){var c=comp(),l=dgLayer(c),cfg,i,frames=[],base,alt,end;
      if(!l)fail("Primero crea Dynamic Grid desde la pestaña Grid.");cfg=dgConfig(l);if(!cfg)fail("Grid sin metadatos; vuelve a crearlo.");
      o.cols=cfg.cols;o.rows=cfg.rows;
      if(o.custom){
        if(!o.frames || o.frames.length<2)fail("Necesitas dos o más layouts guardados.");
        for(i=0;i<o.frames.length;i++){dgValidate({cols:cfg.cols,rows:cfg.rows,layout:o.frames[i].layout});frames.push(dgCopy(o.frames[i].layout));}
      }else{
        base=dgCopy(cfg.layout);
        alt={x:dgWeights(o.motion||"Breathe",cfg.cols,"x"),y:dgWeights(o.motion||"Breathe",cfg.rows,"y")};
        frames=[base,alt];
      }
      end=dgWriteAnimation(c,l,cfg,o,frames);
      return {msg:(o.extend?"Animación extendida":"Grid animado")+" · hasta "+end.toFixed(2)+" s"};
    };
    api.dgClearAnimation=function(){var c=comp(),l=dgLayer(c),cfg,now;if(!l)fail("No existe Dynamic Grid.");cfg=dgConfig(l);now=c.time;
      dgClearCtrlAnim(l,cfg);
      dgApplyCtrlValues(l,cfg,0,false);
      dgRigExpressions(l,cfg);
      return{msg:"Animación del grid eliminada; geometría inicial conservada"};
    };
    api.dgBackdropRemove=function(){var c=comp(),b=dgBgLayer(c);if(b)b.remove();return{msg:"Fondo de Dynamic Grid eliminado"};};
    api.dgBackdrop=function(o){var c=comp(),old=dgBgLayer(c),l,imp,fl,scale,x,y,e,selected,source,orient;
      if(o.mode==="layer"){
        if(!c.selectedLayers.length)fail("Selecciona la capa que quieres usar como fondo.");
        selected=c.selectedLayers[0];if(selected.name===DG_BG||selected.name===DG_NAME)fail("Selecciona una capa diferente del grid/fondo.");
      }
      if(o.mode==="file"){
        fl=File.openDialog("Selecciona imagen o vídeo para el fondo");if(!fl)return{msg:"Importación cancelada"};
        imp=new ImportOptions(fl);if(!imp.canImportAs(ImportAsType.FOOTAGE))fail("El archivo no se puede importar como metraje.");
        source=app.project.importFile(imp);
      }
      if(o.mode==="layer")l=selected.duplicate();
      else if(o.mode==="file")l=c.layers.add(source);
      else {
        l=c.layers.addSolid(hex2rgb(o.color1||"#101827"),DG_BG,c.width,c.height,c.pixelAspect,c.duration);
        if(o.mode==="gradient"){
          try{
            e=l.property("ADBE Effect Parade").addProperty("ADBE Ramp");
            orient=o.direction||"horizontal";
            x=orient==="vertical"?c.width/2:0;y=orient==="horizontal"?c.height/2:0;
            e.property(1).setValue([x,y]);
            e.property(2).setValue(dgColor(o.color1||"#101827"));
            e.property(3).setValue([orient==="vertical"?c.width/2:c.width,orient==="horizontal"?c.height/2:c.height]);
            e.property(4).setValue(dgColor(o.color2||"#6356ab"));
          }catch(ex){l.remove();fail("No se pudo crear Gradient Ramp: "+ex.message);}
        }
      }
      l.label=11;
      if(o.mode==="file"||o.mode==="layer"){
        try {scale=100*Math.max(c.width/l.width,c.height/l.height);if(isFinite(scale)&&scale>0)l.transform.scale.setValue([scale,scale]);
          l.transform.position.setValue([c.width/2,c.height/2]);}catch(e2){}
      }
      l.transform.opacity.setValue(dgClamp(+o.opacity,0,100));
      if(old)old.remove();l.name=DG_BG;l.moveToEnd();
      return{msg:"Fondo "+o.mode+" preparado detrás del grid"};
    };
    function dgTargetBounds(targets,cfg){var minR=cfg.rows,maxR=-1,minC=cfg.cols,maxC=-1,coords=[],i,t,a,kind,ri,ci;
      for(i=0;i<targets.length;i++){
        t=String(targets[i]).split(":");kind=t[0];ri=+t[1];ci=+t[2];
        if(kind==="c"&&ri>=0&&ri<cfg.rows&&ci>=0&&ci<cfg.cols){
          minR=Math.min(minR,ri);maxR=Math.max(maxR,ri);minC=Math.min(minC,ci);maxC=Math.max(maxC,ci);
        }else if(kind==="v"&&ri>=1&&ri<cfg.cols){coords.push(["v",ri]);}
        else if(kind==="h"&&ri>=1&&ri<cfg.rows){coords.push(["h",ri]);}
        else if(kind==="d"&&ri>=1&&ri<cfg.rows&&ci>=1&&ci<cfg.cols){coords.push(["d",ri,ci]);}
        else fail("Destino de grid inválido: "+targets[i]);
      }
      if(maxR>=0){return {kind:"rect",r0:minR,r1:maxR,c0:minC,c1:maxC};}
      if(coords.length){return {kind:"points",points:coords};}
      fail("Selecciona celdas o puntos válidos.");
    }
    // 2.7.5: Las celdas y Attach leen la MISMA fuente de geometría:
    // los sliders DG X/Y. Se evita consultar rectángulos con expresiones
    // encadenadas y samplear Rect.position.valueAtTime en un fotograma pasado.
    function dgAxisExpr(axis,i){return 'g.effect("DG '+axis.toUpperCase()+' '+i+'")(1)*thisComp.'+(axis==="x"?"width":"height");}
    function dgBoundsJS(b,cfg){var out='var g=thisComp.layer("'+DG_NAME+'");\n',i,pt,kind,r,c,px=[],py=[];
      if(b.kind==="rect"){
        out+='var xl='+dgAxisExpr("x",b.c0)+',xr='+dgAxisExpr("x",b.c1+1)+';\n';
        out+='var yt='+dgAxisExpr("y",b.r0)+',yb='+dgAxisExpr("y",b.r1+1)+';\n';
        out+='var dgGap=g.effect("DG Gap")(1);\n';
        out+='var w=Math.max(.5,xr-xl-dgGap),h=Math.max(.5,yb-yt-dgGap);\n';
        out+='var cx=(xl+xr)/2,cy=(yt+yb)/2;\n';
        out+='var L=cx-w/2,R=cx+w/2,T=cy-h/2,B=cy+h/2;\n';
        return out;
      }
      for(i=0;i<b.points.length;i++){
        pt=b.points[i];kind=pt[0];r=pt[1];c=pt[2];
        if(kind==="v"){px.push(dgAxisExpr("x",r));py.push("thisComp.height/2");}
        else if(kind==="h"){px.push("thisComp.width/2");py.push(dgAxisExpr("y",r));}
        else{px.push(dgAxisExpr("x",c));py.push(dgAxisExpr("y",r));}
      }
      out+='var L=Math.min('+px.join(',')+'),R=Math.max('+px.join(',')+');\n';
      out+='var T=Math.min('+py.join(',')+'),B=Math.max('+py.join(',')+');\n';
      return out;
    }
    // Mide la celda con los sliders nativos en el tiempo de creación.
    // No depende de la base geométrica guardada (que puede ser anterior a Animate).
    function dgBoundsAt(c,grid,b,t){var gap,x0,x1,y0,y1,px=[],py=[],i,k,a,p;
      if(b.kind==="rect"){
        x0=dgSlider(grid,dgCtrlName("x",b.c0)).valueAtTime(t,false)*c.width;
        x1=dgSlider(grid,dgCtrlName("x",b.c1+1)).valueAtTime(t,false)*c.width;
        y0=dgSlider(grid,dgCtrlName("y",b.r0)).valueAtTime(t,false)*c.height;
        y1=dgSlider(grid,dgCtrlName("y",b.r1+1)).valueAtTime(t,false)*c.height;
        gap=dgSlider(grid,"DG Gap").valueAtTime(t,false);
        var ww=Math.max(.5,x1-x0-gap),hh=Math.max(.5,y1-y0-gap);
        return {L:(x0+x1-ww)/2,R:(x0+x1+ww)/2,T:(y0+y1-hh)/2,B:(y0+y1+hh)/2};
      }
      for(i=0;i<b.points.length;i++){
        a=b.points[i];k=a[0];
        px.push(k==="h"?c.width/2:dgSlider(grid,dgCtrlName("x",k==="v"?a[1]:a[2])).valueAtTime(t,false)*c.width);
        py.push(k==="v"?c.height/2:dgSlider(grid,dgCtrlName("y",a[1])).valueAtTime(t,false)*c.height);
      }
      return {L:Math.min.apply(Math,px),R:Math.max.apply(Math,px),T:Math.min.apply(Math,py),B:Math.max.apply(Math,py)};
    }
    function dgNumeric(v){v=Number(v);if(!isFinite(v))fail("El control de celda produjo un número inválido.");return String(Math.round(v*1000000)/1000000);}
    // Pin: alinea el centro visible de la fuente y compensa anchor/scale/rotation.
    // La coordenada objetivo se calcula primero en comp, luego en espacio padre.
    function dgPosExpression(b,cfg,align,is3D){var s=DG_EXPR+"// PIN_CELL_275\n"+dgBoundsJS(b,cfg);
      s+='var x=(L+R)/2,y=(T+B)/2;\n';
      var fx=.5,fy=.5;
      if(align==="top-left"){s+="x=L;y=T;\n";fx=0;fy=0;}
      else if(align==="top"){s+="y=T;\n";fy=0;}
      else if(align==="bottom"){s+="y=B;\n";fy=1;}
      else if(align==="bottom-right"){s+="x=R;y=B;\n";fx=1;fy=1;}
      if(!is3D){
        s+='var src=thisLayer.sourceRectAtTime(time,false);\n';
        s+='var ox=(src.left+src.width*'+fx+'-thisLayer.anchorPoint[0])*thisLayer.scale[0]/100;\n';
        s+='var oy=(src.top+src.height*'+fy+'-thisLayer.anchorPoint[1])*thisLayer.scale[1]/100;\n';
        s+='var angle=thisLayer.rotation*Math.PI/180;\n';
        s+='var dx=ox*Math.cos(angle)-oy*Math.sin(angle);\n';
        s+='var dy=ox*Math.sin(angle)+oy*Math.cos(angle);\n';
        s+='var dest=thisLayer.hasParent?thisLayer.parent.fromComp([x,y]):[x,y];\n';
        s+='[dest[0]-dx,dest[1]-dy];';
      }else{
        s+='var dest=thisLayer.hasParent?thisLayer.parent.fromComp([x,y,0]):[x,y,value[2]];\n';
        s+='[dest[0],dest[1],value[2]];';
      }
      return s;
    }
    // Follow: suma el delta del centro al valor base de Posición.
    // El punto de referencia se guarda al pulsar el botón, sin llamadas a
    // valueAtTime en rectángulos ni dependencias circulares de la máscara.
    function dgFollowExpression(b,cfg,origin){
      if(b.kind!=="rect")fail("Seguir máscara requiere celdas.");
      var s=DG_EXPR+"// FOLLOW_CELL_275\n"+dgBoundsJS(b,cfg);
      s+='var now=[(L+R)/2,(T+B)/2];\n';
      s+='var origin=['+dgNumeric(origin[0])+','+dgNumeric(origin[1])+'];\n';
      s+='var parentLayer=thisLayer.hasParent?thisLayer.parent:null;\n';
      s+='var d=[now[0]-origin[0],now[1]-origin[1]];\n';
      s+='if(parentLayer!=null){var a=parentLayer.fromComp(now);var z=parentLayer.fromComp(origin);d=[a[0]-z[0],a[1]-z[1]];}\n';
      s+='[value[0]+d[0],value[1]+d[1]];';
      return s;
    }
    // AE no siempre lanza excepción al asignar una expresión incorrecta.
    function dgVerifyExpr(prop,title,t){var err="";
      if(!prop||!prop.expression)return;
      try{prop.valueAtTime(t,false);}catch(ev){err=String(ev);}
      try{if(prop.expressionError)err=String(prop.expressionError);}catch(ee){}
      if(err)fail(title+" tiene una expresión inválida: "+err);
      try{if(prop.expressionEnabled===false)fail(title+" tiene la expresión desactivada. Comprueba el aviso de After Effects.");}catch(ignore){if(String(ignore).indexOf("desactivada")>=0)throw ignore;}
    }
    function dgClipExpression(b,cfg){var s="// YAGUANIMIX_DGRID_CLIP\n"+dgBoundsJS(b,cfg);
      s+='function pt(x,y){var p=thisLayer.fromComp([x,y,0]);return [p[0],p[1]];}\n';
      s+='createPath([pt(L,T),pt(R,T),pt(R,B),pt(L,B)],[],[],true);';return s;
    }
    function dgRemoveClip(layer){var masks=layer.property("ADBE Mask Parade"),i;if(!masks)return;
      for(i=masks.numProperties;i>=1;i--)if(masks.property(i).name===DG_MASK)masks.property(i).remove();
    }
    function dgReplaceClip(layer,b,cfg,t){var masks=layer.property("ADBE Mask Parade"),m,p,temp="YAG Dynamic Grid Clip New";
      m=masks.addProperty("ADBE Mask Atom");m.name=temp;p=m.property("ADBE Mask Shape");
      try{p.expression=dgClipExpression(b,cfg);dgVerifyExpr(p,"Máscara de «"+layer.name+"»",t);}
      catch(err){try{masks.property(temp).remove();}catch(ee){}throw err;}
      // Mantener la máscara anterior hasta que la nueva expresión sea válida.
      dgRemoveClip(layer);masks.property(temp).name=DG_MASK;
    }
    function dgRigAvailable(grid,cfg){var e=fx(grid),i;
      if(!e||!e.property("DG Gap"))return false;
      for(i=0;i<=cfg.cols;i++)if(!e.property(dgCtrlName("x",i)))return false;
      for(i=0;i<=cfg.rows;i++)if(!e.property(dgCtrlName("y",i)))return false;
      return true;
    }
    var DG_SCALE_EXPR = "// YAGUANIMIX_DGRID_FIT\n";
    function dgFitExpression(b,cfg,fit){return DG_SCALE_EXPR+dgBoundsJS(b,cfg)+
      'var w=Math.max(1,R-L),h=Math.max(1,B-T);\n'+
      'var rect=thisLayer.sourceRectAtTime(time,false);\n'+
      'var sw=Math.max(1,rect.width),sh=Math.max(1,rect.height);\n'+
      'var factor='+ (fit==="contain"?'Math.min':'Math.max') +'(w/sw,h/sh)*100;\n'+
      'var parentScale=thisLayer.hasParent?thisLayer.parent.transform.scale[0]/100:1;\n'+
      'var s=factor/Math.max(.001,Math.abs(parentScale));[s,s];';}
    api.dgAttach=function(o){var c=comp(),grid=dgLayer(c),cfg,ls=c.selectedLayers,i,l,pos,b,sets=[],one,mask,sc,existingSc;
      if(!grid)fail("Primero crea el grid.");cfg=dgConfig(grid);
      if(!cfg)fail("Dynamic Grid no tiene metadatos válidos.");
      if(!dgRigAvailable(grid,cfg))fail("Este grid es de una versión antigua. Crea un grid nuevo con Yaguanimix 2.7.6 antes de usar Attach.");
      if(!o.targets||!o.targets.length)fail("Selecciona un destino en la vista previa.");
      if(!ls.length)fail("Selecciona capas de la composición.");
      if(o.mode==="each"&&o.targets.length!==ls.length)fail("One each necesita el mismo número de capas y destinos.");
      for(i=0;i<ls.length;i++){
        l=ls[i];if(l===grid)fail("No puedes anclar el propio grid.");
        if(l.name===DG_BG&&!o.follow)fail("Para anclar el fondo de Grid Pro utiliza «Revelar y seguir celda»; también puedes seleccionar una imagen como capa independiente.");
        pos=l.property("ADBE Transform Group").property("ADBE Position");
        sc=l.property("ADBE Transform Group").property("ADBE Scale");
        one=o.mode==="each"?[o.targets[i]]:o.targets;
        b=dgTargetBounds(one,cfg);
        if(o.follow){
          if(l.threeDLayer)fail("Revelar y seguir celda necesita una capa 2D: "+l.name);
          if(b.kind!=="rect")fail("Seguir máscara solo admite celdas.");
          if(pos.dimensionsSeparated)fail("Desactiva Separate Dimensions en Posición de: "+l.name);
          if(pos.expression&&pos.expression.indexOf(DG_EXPR)!==0)
            fail("La capa «"+l.name+"» tiene otra expresión de Posición. No se sobrescribe.");
          if(sc.expression&&sc.expression.indexOf(DG_SCALE_EXPR)===0)
            fail("La capa «"+l.name+"» tiene ajuste de escala automático. Desvincúlala antes de usar Seguir celda.");
          sets.push({l:l,pos:pos,b:b,sc:sc});
          continue;
        }
        if(o.reveal){
          if(l.threeDLayer)fail("Revelar fondo necesita una capa 2D: "+l.name);
          if(b.kind!=="rect")fail("Revelar fondo solo admite celdas.");
          if(pos.expression&&pos.expression.indexOf(DG_EXPR)===0)
            fail("«"+l.name+"» ya está anclada a una celda. Pulsa Desvincular antes de crear una máscara fija.");
          if(sc.expression&&sc.expression.indexOf(DG_SCALE_EXPR)===0)
            fail("«"+l.name+"» tiene ajuste automático del grid. Pulsa Desvincular antes de revelar fondo fijo.");
          sets.push({l:l,pos:pos,b:b,sc:sc});
          continue;
        }
        if(pos.dimensionsSeparated)fail("Desactiva Separate Dimensions en Posición de: "+l.name);
        if(pos.expression&&pos.expression.indexOf(DG_EXPR)!==0)fail("La capa «"+l.name+"» ya tiene una expresión de Posición; no se reemplaza.");
        if(o.clip&&l.threeDLayer)fail("Recorte: la capa 3D «"+l.name+"» no admite máscara 2D desde el grid. Desactiva Recortar.");
        existingSc=sc.expression||"";
        if(o.fit&&o.fit!=="none"&&l.threeDLayer)fail("El ajuste automático de escala está disponible para capas 2D. Desactívalo para «"+l.name+"».");
        if(o.fit&&o.fit!=="none"&&existingSc&&existingSc.indexOf(DG_SCALE_EXPR)!==0)
          fail("La capa «"+l.name+"» ya tiene una expresión de Escala y no se reemplazará.");
        if(o.clip&&b.kind!=="rect")fail("El recorte solo admite destinos de celdas.");
        sets.push({l:l,pos:pos,b:b,sc:sc});
      }
      for(i=0;i<sets.length;i++){
        l=sets[i].l;pos=sets[i].pos;b=sets[i].b;sc=sets[i].sc;
        if(o.follow){
          // Replace a previous grid-position expression with the evaluated current
          // pose so the image does not jump when switching from Pin to Follow.
          if(pos.expression&&pos.expression.indexOf(DG_EXPR)===0)dgFreezeExpr(pos,c.time);
          var rest=dgBoundsAt(c,grid,b,c.time);
          pos.expression=dgFollowExpression(b,cfg,[(rest.L+rest.R)/2,(rest.T+rest.B)/2]);
          dgVerifyExpr(pos,"Posición de «"+l.name+"»",c.time);
          dgReplaceClip(l,b,cfg,c.time);
          // Converting a Backdrop allows the layer to be individually attached,
          // without it being destroyed by a later Backdrop update.
          if(l.name===DG_BG)l.name="Yaguanimix Image (follow grid)";
          continue;
        }
        if(o.reveal){
          // True fixed-footage reveal: only mask shape is driven by the grid.
          // Existing transform values, keyframes and external expressions are preserved.
          dgReplaceClip(l,b,cfg,c.time);
          continue;
        }
        // Primero actualizar la escala. Así, la expresión de centrado usa
        // la misma escala definitiva que tendrá la capa en el render.
        if(o.fit&&o.fit!=="none"){
          sc.expression=dgFitExpression(b,cfg,o.fit);
          dgVerifyExpr(sc,"Escala de «"+l.name+"»",c.time);
        }else if(sc.expression&&sc.expression.indexOf(DG_SCALE_EXPR)===0)dgFreezeExpr(sc,c.time);
        pos.expression=dgPosExpression(b,cfg,o.align||"center",l.threeDLayer);
        dgVerifyExpr(pos,"Posición de «"+l.name+"»",c.time);
        if(o.clip)dgReplaceClip(l,b,cfg,c.time);
        else dgRemoveClip(l);
      }
      return{msg:o.follow?ls.length+" imagen(es) siguen su máscara conservando el encuadre":o.reveal?ls.length+" máscara(s) de revelado creadas (imagen fija)":ls.length+" capa(s) anclada(s) al grid"};
    };
    // 2.7.6: corrige vínculos creados por versiones anteriores sin borrar
    // la máscara, el punto de anclaje ni la escala original de la imagen.
    function dgRepairParentExpr(prop,tag,t){var before=prop.expression||"",after=before;
      if(before.indexOf(tag)!==0)return false;
      after=after.replace(/var parentLayer=thisLayer\.parent;/g,'var parentLayer=thisLayer.hasParent?thisLayer.parent:null;');
      after=after.replace(/\(thisLayer\.parent!=null\)/g,'(thisLayer.hasParent)');
      if(after===before)return false;
      prop.expression=after;
      // AE puede haber desactivado la expresión tras el error original.
      try{if(prop.expressionEnabled===false)prop.expressionEnabled=true;}catch(e){}
      dgVerifyExpr(prop,"Vínculo reparado",t);
      return true;
    }
    api.dgRepairAttach=function(){var c=comp(),ls=selLayers(),i,l,pos,sc,m,mp,repaired=0,had=0;
      for(i=0;i<ls.length;i++){
        l=ls[i];pos=l.property("ADBE Transform Group").property("ADBE Position");
        sc=l.property("ADBE Transform Group").property("ADBE Scale");
        if(pos.expression&&pos.expression.indexOf(DG_EXPR)===0){had++;if(dgRepairParentExpr(pos,DG_EXPR,c.time))repaired++;}
        if(sc.expression&&sc.expression.indexOf(DG_SCALE_EXPR)===0){had++;if(dgRepairParentExpr(sc,DG_SCALE_EXPR,c.time))repaired++;}
      }
      if(!had)fail("Selecciona una imagen con un vínculo de Grid Pro en Posición o Escala.");
      return {msg:repaired+" expresión(es) reparada(s). Si aún ves una alerta, pulsa Comprobar vínculo en AE."};
    };
    api.dgDiagnoseAttach=function(){var c=comp(),grid=dgLayer(c),ls=selLayers(),i,l,p,mask,m,mp,out=[],t=c.time,tf=Math.min(c.duration-.001,t+Math.max(5*c.frameDuration,.3)),now,next,ep;
      if(!grid)fail("No se ha encontrado Dynamic Grid en la composición.");
      out.push("Grid "+grid.name+", instante "+t.toFixed(2)+" s");
      for(i=0;i<ls.length;i++){
        l=ls[i];if(l===grid)continue;
        p=l.property("ADBE Transform Group").property("ADBE Position");
        ep=p.expression||"";
        out.push(l.name+": "+(ep.indexOf("FOLLOW_CELL_275")>=0?"seguir celda 2.7.5/6/6":ep.indexOf("PIN_CELL_275")>=0?"centrar 2.7.5/6/6":ep.indexOf(DG_EXPR)===0?"vínculo antiguo":ep?"otra expresión":"sin vínculo"));
        try{now=p.valueAtTime(t,false);next=p.valueAtTime(tf,false);
          out.push(" Posición "+Math.round(now[0])+","+Math.round(now[1])+" → "+Math.round(next[0])+","+Math.round(next[1])+" ("+tf.toFixed(2)+" s)");
        }catch(e){out.push(" ERROR al evaluar Posición: "+e);}
        try{if(p.expressionError)out.push(" ERROR Posición: "+p.expressionError);}catch(e2){}
        mask=l.property("ADBE Mask Parade");m=mask?mask.property(DG_MASK):null;
        if(!m)out.push(" Sin máscara Dynamic Grid");
        else{mp=m.property("ADBE Mask Shape");try{mp.valueAtTime(t,false);if(mp.expressionError)out.push(" ERROR Máscara: "+mp.expressionError);else out.push(" Máscara: presente, expresión activa");}catch(e3){out.push(" ERROR Máscara: "+e3);}}
      }
      return {msg:out.join(" | "),data:{report:out.join("\n")}};
    };
    function dgFreezeExpr(p,time){var val;
      try{val=p.valueAtTime(time,false);}catch(e){val=p.value;}
      p.expression="";
      if(p.numKeys)p.setValueAtTime(time,val);else p.setValue(val);
    }
    api.dgDetach=function(){var c=comp(),ls=selLayers(),i,pos,sc,cnt=0,ex;
      for(i=0;i<ls.length;i++){
        pos=ls[i].property("ADBE Transform Group").property("ADBE Position");
        sc=ls[i].property("ADBE Transform Group").property("ADBE Scale");
        ex=pos.expression||"";
        if(ex.indexOf(DG_EXPR)===0){dgFreezeExpr(pos,c.time);cnt++;}
        if(sc.expression&&sc.expression.indexOf(DG_SCALE_EXPR)===0)dgFreezeExpr(sc,c.time);
        dgRemoveClip(ls[i]);
      }
      return{msg:cnt+" vinculación(es) retiradas; posición y escala conservadas en el cabezal"};
    };

    // ---------- núcleo ----------
    A.call = function (name, argStr) {
        var o = {}, out;
        try { if (argStr) o = JSON.parse(argStr); } catch (e0) { }
        app.beginUndoGroup("YaguaTool: " + name);
        try {
            if (!api[name]) fail("Función desconocida: " + name);
            var r = api[name](o) || {};
            out = { ok: true, msg: r.msg || "Listo", data: r.data === undefined ? null : r.data };
        } catch (e) {
            out = { ok: false, msg: (e && e.message) ? e.message : String(e) };
        }
        try { app.endUndoGroup(); } catch (e2) { }
        return JSON.stringify(out);
    };
    return A;
})();

YaguaHostBoot.modules.push("host.jsx");
} catch (yaguaModuleError) {
YaguaHostBoot.errors.push("host.jsx: "+String(yaguaModuleError.message||yaguaModuleError)+" (line "+String(yaguaModuleError.line||"?")+")");
}

// MODULE yagua-core.jsx SHA256 658159a7ff107452253dc3abdfe3fa0852919dd2259316f639202d858b57df62
try {
// Shared helpers for the new modules. Original Animix identifiers stay compatible.
var YaguaHost=(function(){
 var H={root:""};
 // CEP supplies a stable root explicitly; $.fileName may be empty during evalScript.
 if(typeof $!=="undefined"){
  if($._yaguaExtensionRoot)H.root=String($._yaguaExtensionRoot);
  else try{var entry=new File($.fileName);if(entry.exists&&entry.parent&&entry.parent.parent)H.root=entry.parent.parent.fsName;}catch(ignoreRoot){}
 }
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

YaguaHostBoot.modules.push("yagua-core.jsx");
} catch (yaguaModuleError) {
YaguaHostBoot.errors.push("yagua-core.jsx: "+String(yaguaModuleError.message||yaguaModuleError)+" (line "+String(yaguaModuleError.line||"?")+")");
}

// MODULE lab-native.jsx SHA256 5717e926fca7b68053e80ffb00e78a976eaaf986cf5a6e2b0b9177c97f233b77
try {
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

YaguaHostBoot.modules.push("lab-native.jsx");
} catch (yaguaModuleError) {
YaguaHostBoot.errors.push("lab-native.jsx: "+String(yaguaModuleError.message||yaguaModuleError)+" (line "+String(yaguaModuleError.line||"?")+")");
}

// MODULE complex-text.jsx SHA256 dfadf6ba5ff3e2469df2063031558b22929513bdd971d00494147990eee8ec17
try {
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

YaguaHostBoot.modules.push("complex-text.jsx");
} catch (yaguaModuleError) {
YaguaHostBoot.errors.push("complex-text.jsx: "+String(yaguaModuleError.message||yaguaModuleError)+" (line "+String(yaguaModuleError.line||"?")+")");
}

// MODULE carrousel.jsx SHA256 a2583957571119c7654267bee73cf17a63253309ad9289165daf2df24d58b7f3
try {
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

YaguaHostBoot.modules.push("carrousel.jsx");
} catch (yaguaModuleError) {
YaguaHostBoot.errors.push("carrousel.jsx: "+String(yaguaModuleError.message||yaguaModuleError)+" (line "+String(yaguaModuleError.line||"?")+")");
}

// MODULE tools-pro.jsx SHA256 95486ee3cc321c4a65c1671a31124194889f81c86502518fde7a96847f223d49
try {
// Original YaguaTool utilities. No code from the supplied restricted curvas plugin.
var YaguaToolsNative=(function(){
 var api=Animix.api,clipboard=null;
 function props(){return YaguaHost.selectedProps();}
 function selectedKeys(p){var keys=p.selectedKeys,out=[],i;for(i=0;i<keys.length;i++)out.push(keys[i]);return out;}
 function isNumeric(value){if(typeof value==="number")return isFinite(value);if(Object.prototype.toString.call(value)==="[object Array]"){for(var i=0;i<value.length;i++)if(typeof value[i]!=="number"||!isFinite(value[i]))return false;return true;}return false;}
 function keyState(p,k){var out={time:p.keyTime(k),value:p.keyValue(k),inType:p.keyInInterpolationType(k),outType:p.keyOutInterpolationType(k)};
  try{out.inEase=p.keyInTemporalEase(k);out.outEase=p.keyOutTemporalEase(k);out.temporalContinuous=p.keyTemporalContinuous(k);out.temporalAuto=p.keyTemporalAutoBezier(k);}catch(ignoreEase){}
  if(p.isSpatial)try{out.inSpatial=p.keyInSpatialTangent(k);out.outSpatial=p.keyOutSpatialTangent(k);out.spatialContinuous=p.keySpatialContinuous(k);out.spatialAuto=p.keySpatialAutoBezier(k);out.roving=p.keyRoving(k);}catch(ignoreSpatial){}return out;
 }
 function putKey(p,state,time){p.setValueAtTime(time,state.value);var k=p.nearestKeyIndex(time);p.setInterpolationTypeAtKey(k,state.inType,state.outType);
  try{if(state.inEase)p.setTemporalEaseAtKey(k,state.inEase,state.outEase);if(state.temporalContinuous!==undefined)p.setTemporalContinuousAtKey(k,state.temporalContinuous);if(state.temporalAuto!==undefined)p.setTemporalAutoBezierAtKey(k,state.temporalAuto);}catch(ignoreEase){}
  if(p.isSpatial&&state.inSpatial)try{p.setSpatialTangentsAtKey(k,state.inSpatial,state.outSpatial);p.setSpatialContinuousAtKey(k,state.spatialContinuous);p.setSpatialAutoBezierAtKey(k,state.spatialAuto);if(state.roving&&k>1&&k<p.numKeys)p.setRovingAtKey(k,true);}catch(ignoreSpatial){}
  try{p.setSelectedAtKey(k,true);}catch(ignoreSelect){}
 }
 api.ytKeysCopy=function(){var ps=props(),sets=[],first=1e30,count=0,i,j,keys,states;for(i=0;i<ps.length;i++){keys=selectedKeys(ps[i]);states=[];for(j=0;j<keys.length;j++){states.push(keyState(ps[i],keys[j]));first=Math.min(first,ps[i].keyTime(keys[j]));count++;}if(states.length)sets.push({match:ps[i].matchName,type:ps[i].propertyValueType,states:states});}if(!count)throw Error("Selecciona los keyframes que quieres copiar.");clipboard={sets:sets,first:first,count:count};return{msg:count+" keyframes copiados con su interpolación.",data:{count:count,properties:sets.length}};};
 api.ytKeysPaste=function(){if(!clipboard)throw Error("Copia primero unos keyframes.");var ps=props(),plans=[],i,j,set,c=YaguaHost.comp(),k,time;
  for(i=0;i<ps.length;i++){set=clipboard.sets.length===1?clipboard.sets[0]:null;if(!set)for(j=0;j<clipboard.sets.length;j++)if(clipboard.sets[j].match===ps[i].matchName){set=clipboard.sets[j];break;}if(!set||set.type!==ps[i].propertyValueType)throw Error("La selección de destino no es compatible con lo copiado.");
   for(j=0;j<set.states.length;j++){time=c.time+set.states[j].time-clipboard.first;for(k=1;k<=ps[i].numKeys;k++)if(Math.abs(ps[i].keyTime(k)-time)<1e-7)throw Error("Ya hay keyframes en el destino. Mueve el cabezal para no sobrescribirlos.");}plans.push({p:ps[i],set:set});}
  var count=0;for(i=0;i<plans.length;i++)for(j=0;j<plans[i].set.states.length;j++){putKey(plans[i].p,plans[i].set.states[j],c.time+plans[i].set.states[j].time-clipboard.first);count++;}return{msg:count+" keyframes pegados desde el cabezal."};
 };
 api.ytKeysTiming=function(o){var ps=props(),plans=[],first=1e30,i,j,k,keys,c=YaguaHost.comp(),factor=o.scale===undefined?1:Number(o.scale)/100,shift=(Number(o.frames)||0)/c.frameRate;
  if(!isFinite(factor)||factor<=0)throw Error("La escala temporal debe ser mayor que cero.");
  for(i=0;i<ps.length;i++){keys=selectedKeys(ps[i]);var states=[];for(j=0;j<keys.length;j++){states.push(keyState(ps[i],keys[j]));first=Math.min(first,ps[i].keyTime(keys[j]));}if(states.length)plans.push({p:ps[i],keys:keys,states:states,times:[]});}
  if(!plans.length)throw Error("Selecciona keyframes.");
  for(i=0;i<plans.length;i++)for(j=0;j<plans[i].states.length;j++){var target=first+(plans[i].states[j].time-first)*factor+shift;if(target<0)throw Error("El desplazamiento llevaría keyframes antes de cero.");for(k=1;k<=plans[i].p.numKeys;k++){var chosen=false;for(var n=0;n<plans[i].keys.length;n++)if(plans[i].keys[n]===k)chosen=true;if(!chosen&&Math.abs(plans[i].p.keyTime(k)-target)<1e-7)throw Error("El cambio colisiona con keyframes no seleccionados.");}plans[i].times.push(target);}
  var count=0;for(i=0;i<plans.length;i++){for(j=plans[i].keys.length-1;j>=0;j--)plans[i].p.removeKey(plans[i].keys[j]);for(j=0;j<plans[i].states.length;j++){putKey(plans[i].p,plans[i].states[j],plans[i].times[j]);count++;}}return{msg:count+" keyframes retimados; valores y curvas conservados."};
 };
 function average(p,a,b){var va=p.keyValue(a),vb=p.keyValue(b),dt=p.keyTime(b)-p.keyTime(a),out=[],i;
  if(p.isSpatial){var prev=p.valueAtTime(p.keyTime(a),true),length=0;for(i=1;i<=48;i++){var next=p.valueAtTime(p.keyTime(a)+dt*i/48,true),sq=0;for(var k=0;k<next.length;k++)sq+=Math.pow(next[k]-prev[k],2);length+=Math.sqrt(sq);prev=next;}return[length/dt];}
  if(typeof va==="number")return[(vb-va)/dt];for(i=0;i<va.length;i++)out.push((vb[i]-va[i])/dt);return out;
 }
 api.ytCurveApply=function(o){var ps=props(),x1=Math.max(.001,Math.min(.999,Number(o.x1))),x2=Math.max(.001,Math.min(.999,Number(o.x2))),y1=Number(o.y1),y2=Number(o.y2),plans=[],i,j,k,keys,dv;
  if(!isFinite(x1)||!isFinite(x2)||!isFinite(y1)||!isFinite(y2))throw Error("Curva no válida.");
  for(i=0;i<ps.length;i++){if(!isNumeric(ps[i].value))throw Error("Selecciona propiedades numéricas para aplicar la curva.");keys=selectedKeys(ps[i]);for(j=0;j<keys.length-1;j++){if(keys[j+1]!==keys[j]+1)throw Error("Selecciona keyframes consecutivos en cada segmento.");plans.push({p:ps[i],a:keys[j],b:keys[j+1],speed:average(ps[i],keys[j],keys[j+1])});}}
  if(!plans.length)throw Error("Selecciona al menos dos keyframes consecutivos.");
  for(i=0;i<plans.length;i++){var plan=plans[i],inA=plan.p.keyInTemporalEase(plan.a),outB=plan.p.keyOutTemporalEase(plan.b),outA=[],inB=[];for(k=0;k<plan.speed.length;k++){outA.push(new KeyframeEase(plan.speed[k]*y1/x1,x1*100));inB.push(new KeyframeEase(plan.speed[k]*(1-y2)/(1-x2),(1-x2)*100));}plan.p.setInterpolationTypeAtKey(plan.a,plan.p.keyInInterpolationType(plan.a),KeyframeInterpolationType.BEZIER);plan.p.setInterpolationTypeAtKey(plan.b,KeyframeInterpolationType.BEZIER,plan.p.keyOutInterpolationType(plan.b));plan.p.setTemporalEaseAtKey(plan.a,inA,outA);plan.p.setTemporalEaseAtKey(plan.b,inB,outB);}
  return{msg:"Curva aplicada a "+plans.length+" segmentos seleccionados."};
 };
 api.ytCurveRead=function(){var ps=props(),p=ps[0],keys=selectedKeys(p);if(keys.length<2||keys[1]!==keys[0]+1)throw Error("Selecciona dos keyframes consecutivos.");var speed=average(p,keys[0],keys[1])[0],a=p.keyOutTemporalEase(keys[0])[0],b=p.keyInTemporalEase(keys[1])[0],x1=a.influence/100,x2=1-b.influence/100;return{msg:"Curva leída",data:{x1:x1,y1:Math.abs(speed)<1e-9?x1:a.speed/speed*x1,x2:x2,y2:Math.abs(speed)<1e-9?x2:1-b.speed/speed*(1-x2)}};};
 api.ytEaseInfluence=function(o){var ps=props(),i,j,k,keys,count=0,inside=Math.max(.1,Math.min(100,Number(o.influenceIn)||.1)),outside=Math.max(.1,Math.min(100,Number(o.influenceOut)||.1));
  for(i=0;i<ps.length;i++){keys=selectedKeys(ps[i]);for(j=0;j<keys.length;j++){var a=ps[i].keyInTemporalEase(keys[j]),b=ps[i].keyOutTemporalEase(keys[j]),inEase=[],outEase=[];for(k=0;k<a.length;k++)inEase.push(new KeyframeEase(0,inside));for(k=0;k<b.length;k++)outEase.push(new KeyframeEase(0,outside));ps[i].setInterpolationTypeAtKey(keys[j],KeyframeInterpolationType.BEZIER,KeyframeInterpolationType.BEZIER);ps[i].setTemporalEaseAtKey(keys[j],inEase,outEase);count++;}}if(!count)throw Error("Selecciona keyframes.");return{msg:count+" keyframes suavizados."};
 };
 api.ytDistribute=function(o){var ls=YaguaHost.layers(),c=YaguaHost.comp(),axis=o.axis==="y"?1:0,items=[],i,p,v;if(ls.length<3)throw Error("Selecciona al menos tres capas.");for(i=0;i<ls.length;i++){if(ls[i].locked||ls[i].parent||ls[i].threeDLayer)throw Error("Distribuye capas 2D desbloqueadas y sin padre.");p=ls[i].transform.position;if(p.expressionEnabled||p.dimensionsSeparated)throw Error("Usa posición unificada y sin expresión.");items.push({layer:ls[i],p:p,v:p.valueAtTime(c.time,false)});}items.sort(function(a,b){return a.v[axis]-b.v[axis];});var start=items[0].v[axis],end=items[items.length-1].v[axis];for(i=1;i<items.length-1;i++){v=items[i].v;v[axis]=start+(end-start)*i/(items.length-1);YaguaHost.put(items[i].p,v,c.time);}return{msg:"Centros distribuidos de forma uniforme."};};
 api.ytCropComp=function(o){var c=YaguaHost.comp(),ls=YaguaHost.layers(),i,l,r,p,s,v,rot,points=[],x1=1e30,x2=-1e30,y1=1e30,y2=-1e30;
  for(i=0;i<c.numLayers;i++){l=c.layer(i+1);if(l.locked||l.parent||l.threeDLayer||l.transform.position.numKeys||l.transform.position.expressionEnabled||l.transform.position.dimensionsSeparated)throw Error("Recorta una composición con capas 2D, sin padre y con posiciones estáticas.");}
  for(i=0;i<ls.length;i++){l=ls[i];r=l.sourceRectAtTime(c.time,false);p=l.transform.position.value;s=l.transform.scale.value;var anchor=l.transform.anchorPoint.value;rot=l.transform.rotation.value*Math.PI/180;var corners=[[r.left,r.top],[r.left+r.width,r.top],[r.left+r.width,r.top+r.height],[r.left,r.top+r.height]];for(var j=0;j<4;j++){var x=(corners[j][0]-anchor[0])*s[0]/100,y=(corners[j][1]-anchor[1])*s[1]/100,wx=p[0]+x*Math.cos(rot)-y*Math.sin(rot),wy=p[1]+x*Math.sin(rot)+y*Math.cos(rot);x1=Math.min(x1,wx);x2=Math.max(x2,wx);y1=Math.min(y1,wy);y2=Math.max(y2,wy);}}
  var pad=Math.max(0,Number(o.padding)||0),width=Math.max(4,Math.ceil(x2-x1+2*pad)),height=Math.max(4,Math.ceil(y2-y1+2*pad));if(width>30000||height>30000)throw Error("El área resultante excede el límite de AE.");
  for(i=1;i<=c.numLayers;i++){p=c.layer(i).transform.position;v=p.value;p.setValue([v[0]-x1+pad,v[1]-y1+pad]);}c.width=width;c.height=height;return{msg:"Composición recortada a "+width+" × "+height+". Capas conservadas."};
 };
 function propertyHasExpression(group){if(group.expressionEnabled)return true;for(var i=1;i<=group.numProperties;i++)if(propertyHasExpression(group.property(i)))return true;return false;}
 function keyed(group){if(group.numKeys)return true;for(var i=1;i<=group.numProperties;i++)if(keyed(group.property(i)))return true;return false;}
 function copyProperties(src,dst){var i,sp,dp,k;for(i=1;i<=src.numProperties;i++){sp=src.property(i);if(dst.canAddProperty&&dst.canAddProperty(sp.matchName))dp=dst.addProperty(sp.matchName);else dp=dst.property(sp.matchName)||dst.property(i);if(!dp)throw Error("No se puede copiar la propiedad "+sp.name);try{dp.name=sp.name;}catch(ignoreName){}
  if(sp.numProperties)copyProperties(sp,dp);else{if(sp.numKeys){for(k=1;k<=sp.numKeys;k++)putKey(dp,keyState(sp,k),sp.keyTime(k));}else try{dp.setValue(sp.value);}catch(ignoreValue){}}}}
 api.ytExtractShapes=function(){var ls=YaguaHost.layers(),i,j,src,groups,count=0;for(i=0;i<ls.length;i++)if(!(ls[i] instanceof ShapeLayer)||ls[i].locked)throw Error("Selecciona capas de forma desbloqueadas.");for(i=0;i<ls.length;i++){src=ls[i];groups=src.property("ADBE Root Vectors Group");for(j=1;j<=groups.numProperties;j++){var copy=src.duplicate(),contents=copy.property("ADBE Root Vectors Group");copy.name=src.name+" · "+groups.property(j).name;for(var k=contents.numProperties;k>=1;k--)if(k!==j)contents.property(k).remove();copy.enabled=true;count++;}src.enabled=false;}return{msg:count+" grupos separados. Los originales se conservan desactivados."};};
 api.ytMergeShapes=function(){var ls=YaguaHost.layers(),c=YaguaHost.comp(),i,j,l;for(i=0;i<ls.length;i++){l=ls[i];if(!(l instanceof ShapeLayer)||l.locked||l.parent||l.threeDLayer||l.transform.position.dimensionsSeparated||keyed(l.property("ADBE Transform Group"))||l.property("ADBE Effect Parade").numProperties||l.property("ADBE Mask Parade").numProperties||propertyHasExpression(l.property("ADBE Root Vectors Group"))||propertyHasExpression(l.property("ADBE Transform Group")))throw Error("Combina formas 2D con Transform estático, sin padres, efectos, máscaras ni expresiones. Los keyframes del contenido se conservan.");}
  var merged=c.layers.addShape();merged.name="YaguaTool · Formas combinadas";var root=merged.property("ADBE Root Vectors Group"),pairs=[["ADBE Anchor Point","ADBE Vector Anchor"],["ADBE Position","ADBE Vector Position"],["ADBE Scale","ADBE Vector Scale"],["ADBE Rotate Z","ADBE Vector Rotation"],["ADBE Opacity","ADBE Vector Group Opacity"]];
  try{for(i=0;i<ls.length;i++){l=ls[i];var group=root.addProperty("ADBE Vector Group");group.name=l.name;copyProperties(l.property("ADBE Root Vectors Group"),group.property("ADBE Vectors Group"));var transform=group.property("ADBE Vector Transform Group");for(j=0;j<pairs.length;j++){var from=l.property("ADBE Transform Group").property(pairs[j][0]),to=transform.property(pairs[j][1]);if(from.numKeys)for(var k=1;k<=from.numKeys;k++)putKey(to,keyState(from,k),from.keyTime(k));else to.setValue(from.value);}var opacity=transform.property("ADBE Vector Group Opacity");opacity.expression="time>="+l.inPoint+"&&time<"+l.outPoint+"?value:0;";}
   merged.transform.position.setValue([0,0]);merged.transform.anchorPoint.setValue([0,0]);for(i=0;i<ls.length;i++)ls[i].enabled=false;
  }catch(e){merged.remove();throw e;}return{msg:"Formas combinadas; originales conservados desactivados."};
 };

 function pathExpression(property){var list=[],d,item;for(d=0;d<property.propertyDepth;d++){item=d===0?property:property.propertyGroup(d);list.unshift(item.propertyIndex);}var out="L";for(d=0;d<list.length;d++)out+="("+list[d]+")";return out;}
 api.ytNullsToPoints=function(){
  var ps=props(),c=YaguaHost.comp(),plans=[],i,j,p,owner,value,groups,d,group;
  for(i=0;i<ps.length;i++){p=ps[i];if(p.propertyValueType!==PropertyValueType.SHAPE)continue;owner=p.propertyGroup(p.propertyDepth);if(owner.threeDLayer)throw Error("Usa trazados de una capa 2D.");value=p.valueAtTime(c.time,false);if(!value.vertices||!value.vertices.length)continue;groups=[];for(d=1;d<p.propertyDepth;d++){group=p.propertyGroup(d);if(group.matchName==="ADBE Vector Group")groups.push(pathExpression(group));}plans.push({p:p,owner:owner,vertices:value.vertices,groups:groups});}
  if(!plans.length)throw Error("Selecciona propiedades Path de formas o máscaras.");
  var count=0,rotate='function R(p,a){var q=a*Math.PI/180;return [p[0]*Math.cos(q)-p[1]*Math.sin(q),p[0]*Math.sin(q)+p[1]*Math.cos(q)];}';
  for(i=0;i<plans.length;i++)for(j=0;j<plans[i].vertices.length;j++){
   var n=c.layers.addNull();n.name="YaguaTool · Punto "+(j+1);n.guideLayer=true;var link=n.property("ADBE Effect Parade").addProperty("ADBE Layer Control");link.name="Fuente";link.property(1).setValue(plans[i].owner.index);
   var expression='// YaguaTool Nulls to Points\nvar linked=effect("Fuente")(1);var L=typeof linked==="number"?thisComp.layer(linked):linked;var path='+pathExpression(plans[i].p)+';var vertices=path.points(time);var p=vertices[Math.min('+j+',vertices.length-1)];\n'+rotate+'\n';
   for(d=0;d<plans[i].groups.length;d++)expression+='var T='+plans[i].groups[d]+'.transform;var a=T.anchorPoint,s=T.scale;p=[(p[0]-a[0])*s[0]/100,(p[1]-a[1])*s[1]/100];p=R(p,-T.skewAxis);p=[p[0]-Math.tan(T.skew*Math.PI/180)*p[1],p[1]];p=R(p,T.skewAxis);p=R(p,T.rotation);p=[p[0]+T.position[0],p[1]+T.position[1]];\n';
   n.transform.position.expression=expression+'var w=L.toComp(p);[w[0],w[1]];';count++;
  }return{msg:count+" nulos creados; siguen los vértices sin modificar el trazado."};
 };
 api.ytExpression=function(o){var ps=props(),i,code=String(o.code||"");for(i=0;i<ps.length;i++){if(!ps[i].canSetExpression)throw Error("La selección contiene propiedades sin soporte de expresiones.");if(!o.replace&&ps[i].expression)throw Error("Ya hay una expresión. Activa Reemplazar para sustituirla.");}for(i=0;i<ps.length;i++)ps[i].expression=code;return{msg:"Expresión aplicada a "+ps.length+" propiedades."};};
 api.ytLoop=function(o){var ps=props(),i;for(i=0;i<ps.length;i++)if(ps[i].numKeys<2||ps[i].expression)throw Error("Selecciona propiedades con dos keyframes o más y sin otra expresión.");for(i=0;i<ps.length;i++)ps[i].expression='// YaguaTool Loop\n'+(o.direction==="in"?'loopIn':'loopOut')+'("'+(o.mode==="pingpong"?'pingpong':'cycle')+'");';return{msg:"Loop aplicado a "+ps.length+" propiedades."};};
 api.ytElastic=function(o){var ps=props(),i,amp=Math.max(0,Number(o.amplitude)||.06),frequency=Math.max(.1,Number(o.frequency)||3),decay=Math.max(.1,Number(o.decay)||6);for(i=0;i<ps.length;i++)if(ps[i].numKeys<2||!ps[i].canSetExpression||ps[i].expression)throw Error("Selecciona propiedades animadas sin expresión previa.");var code='// YaguaTool Elastic '+(o.legacy?'Legacy':'')+'\nvar n=0;if(numKeys>0){n=nearestKey(time).index;if(key(n).time>time)n--;}var t=n>0?time-key(n).time:0;if(n>0&&t>0){var v=velocityAtTime(key(n).time-thisComp.frameDuration/10);value+v*'+amp+'*Math.sin(t*'+frequency+'*Math.PI*2)'+(o.legacy?'':'/('+frequency+'*Math.PI*2)')+'/Math.exp('+decay+'*t);}else value;';for(i=0;i<ps.length;i++)ps[i].expression=code;return{msg:"Elastic aplicado. Amplitud, frecuencia y decay incluidos en la expresión."};};
 api.ytRunScript=function(o){if(o.path){var f=new File(o.path);if(!f.exists||!(/\.(jsx|js)$/i).test(f.name))throw Error("Selecciona un archivo .jsx o .js existente.");$.evalFile(f);}else{if(!o.code)throw Error("El script está vacío.");(function(){eval(String(o.code));})();}return{msg:"Script ejecutado."};};
 return{keyState:keyState,putKey:putKey,average:average};
})();
Animix.api.ytPickCode=function(){var file=File.openDialog("Añadir script o expresión","Código:*.jsx;*.js;*.txt");if(!file)return{msg:"Cancelado",data:null};file.encoding="UTF-8";if(!file.open("r"))throw Error("No se puede leer el archivo.");var code;try{code=file.read();}finally{file.close();}return{msg:"Archivo cargado, sin ejecutar.",data:{name:file.name,code:code}};};

YaguaHostBoot.modules.push("tools-pro.jsx");
} catch (yaguaModuleError) {
YaguaHostBoot.errors.push("tools-pro.jsx: "+String(yaguaModuleError.message||yaguaModuleError)+" (line "+String(yaguaModuleError.line||"?")+")");
}

// MODULE ../js/workflow-model.js SHA256 4e404fbf17363fd8038950018e1faae96c23bf64bfa7ff6a705f2e7361e54ad1
try {
/* ES3 models shared by the panel and native host. */
var YaguaSocialFormats=[
 {id:'ig-reel',name:'Instagram Reels / Stories',width:1080,height:1920},
 {id:'ig-feed',name:'Instagram Feed 4:5',width:1080,height:1350},
 {id:'ig-portrait',name:'Instagram retrato 3:4',width:1080,height:1440},
 {id:'square',name:'Post cuadrado',width:1080,height:1080},
 {id:'tiktok',name:'TikTok vertical',width:1080,height:1920},
 {id:'shorts',name:'YouTube Shorts',width:1080,height:1920},
 {id:'youtube',name:'YouTube horizontal',width:1920,height:1080},
 {id:'linkedin',name:'LinkedIn horizontal',width:1200,height:627},
 {id:'x',name:'X horizontal',width:1600,height:900},
 {id:'pinterest',name:'Pinterest Pin',width:1000,height:1500}
];
var YaguaBounce=(function(){
 function out(t){var n=7.5625,d=2.75;if(t<1/d)return n*t*t;if(t<2/d){t-=1.5/d;return n*t*t+.75;}if(t<2.5/d){t-=2.25/d;return n*t*t+.9375;}t-=2.625/d;return n*t*t+.984375;}
 function value(t,direction,strength){t=Math.max(0,Math.min(1,t));var b=direction==='in'?1-out(1-t):out(t);return t+(b-t)*Math.max(0,Math.min(100,Number(strength)))/100;}
 return{value:value};
})();
if(typeof module!=='undefined'&&module.exports)module.exports={formats:YaguaSocialFormats,bounce:YaguaBounce};

YaguaHostBoot.modules.push("../js/workflow-model.js");
} catch (yaguaModuleError) {
YaguaHostBoot.errors.push("../js/workflow-model.js: "+String(yaguaModuleError.message||yaguaModuleError)+" (line "+String(yaguaModuleError.line||"?")+")");
}

// MODULE workflow.jsx SHA256 b7e880d7cd4604b8870390ceb0f28ea4cc8541915e618a07262559e7edf388ea
try {
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

YaguaHostBoot.modules.push("workflow.jsx");
} catch (yaguaModuleError) {
YaguaHostBoot.errors.push("workflow.jsx: "+String(yaguaModuleError.message||yaguaModuleError)+" (line "+String(yaguaModuleError.line||"?")+")");
}

// MODULE lab-editable.jsx SHA256 67fb99f94d2ca4239c518244d14d8338f1590d95d076fda3566cf26b19086254
try {
// Editable front controller; original motion is regenerated with the unchanged browser engine.
var YaguaLabRig=(function(){
 var MARK='YAGUA_LAB_RIG_310|',DRIVER='YAGUA_LAB_DRIVER_310|',globalFields=[['Global - Escala %',100],['Global - X',0],['Global - Y',0],['Global - Rotacion',0],['Global - Opacidad %',100],['Global - Blur',0]];
 var choices={direction:['up','down','left','right','custom'],split:['chars','words','lines','whole'],mode:['in','out','both'],trajectory:['start','end','center-out','center-in','all-at-once','random','custom-index'],rotationMode:['uniform','split'],blurMode:['piece','global'],echoPlace:['over','behind'],echoStyle:['trail','ghost'],ghostEngine:['deep','deep2','glow'],fillUnit:['chars','words','lines'],fillDirection:['start','end','center','to-center'],fillStyle:['reveal','wave'],fillGlowStyle:['soft','hard'],fillGlowEngine:['glow','deep'],motionDistribution:['stagger','simultaneous'],blinkSplit:['chars','words','lines']};
 function meta(c){try{return c instanceof CompItem&&c.comment.indexOf(MARK)===0?JSON.parse(c.comment.substr(MARK.length)):null;}catch(e){return null;}}
 function setMeta(c,m){c.comment=MARK+JSON.stringify(m);}
 function effect(layer,name,type,value,items){var fx=layer.property('ADBE Effect Parade').addProperty(type||'ADBE Slider Control'),index=layer.property('ADBE Effect Parade').numProperties;if(items){fx.property(1).setPropertyParameters(items);fx=layer.property('ADBE Effect Parade').property(index);}fx.name=name;fx.property(1).setValue(value);}
 function descriptors(params){var list=[],k,j,v,opts;for(k in params)if(params.hasOwnProperty(k)){v=params[k];if(typeof v==='number')list.push({key:k,name:'Preset - '+k,type:'number'});else if(/^#[0-9a-f]{6}$/i.test(String(v)))list.push({key:k,name:'Preset - '+k,type:'color'});else if(k==='bezier'&&v){for(j in v)if(v.hasOwnProperty(j))list.push({key:k,sub:j,name:'Curva - '+j,type:'number'});}else if(typeof v==='string'){opts=choices[k]||(/Direction$/.test(k)?['start','end','center','to-center']:/DelayMode$/.test(k)?['manual','chain']:null);if(opts&&opts.length){opts=opts.slice(0);var found=false;for(j=0;j<opts.length;j++)if(opts[j]===v)found=true;if(!found)opts.push(v);list.push({key:k,name:'Preset - '+k,type:'enum',choices:opts});}}}return list;}
 function color(s){return[parseInt(s.substr(1,2),16)/255,parseInt(s.substr(3,2),16)/255,parseInt(s.substr(5,2),16)/255];}
 function install(layer,m){var i,d,v,j;for(i=0;i<globalFields.length;i++)effect(layer,globalFields[i][0],null,globalFields[i][1]);for(i=0;i<m.fields.length;i++){d=m.fields[i];v=d.sub?m.options.params[d.key][d.sub]:m.options.params[d.key];if(d.type==='color')effect(layer,d.name,'ADBE Color Control',color(v));else if(d.type==='enum'){for(j=0;j<d.choices.length;j++)if(d.choices[j]===v)break;effect(layer,d.name,'ADBE Dropdown Control',j+1,d.choices);}else effect(layer,d.name,null,v);}}
 function driver(c,m){if(!m.external)return c.layer(m.driverName);var receiving=app.project.itemByID(m.external.compId),i;if(!(receiving instanceof CompItem))throw Error('No se encuentra la composición del controlador de texto.');for(i=1;i<=receiving.numLayers;i++)if((m.external.layerId?receiving.layer(i).id===m.external.layerId:receiving.layer(i).comment===DRIVER+c.id))return receiving.layer(i);throw Error('No se encuentra el controlador de texto.');}
 function state(c){var m=meta(c);if(!m)return null;var layer=driver(c,m),p=JSON.parse(JSON.stringify(m.options.params)),i,d,v,text=layer.property('ADBE Text Properties').property('ADBE Text Document').value.text;
  for(i=0;i<m.fields.length;i++){d=m.fields[i];var prop=layer.property('ADBE Effect Parade').property(d.name).property(1);if(prop.numKeys)throw Error('Los parámetros Preset se ajustan sin keyframes. Para animar con keys utiliza los controles Global.');v=prop.value;if(d.type==='color'){var h='#';for(var j=0;j<3;j++)h+=('0'+Math.round(Math.max(0,Math.min(1,v[j]))*255).toString(16)).slice(-2);v=h;}else if(d.type==='enum')v=d.choices[Math.max(0,Math.min(d.choices.length-1,Math.round(v)-1))];if(d.sub)p[d.key][d.sub]=v;else p[d.key]=v;}
  var options=JSON.parse(JSON.stringify(m.options));options.params=p;options.text=String(text).replace(/\r\n?/g,'\n');var signature=JSON.stringify({text:options.text,params:p});return{id:c.id,signature:signature,applied:m.applied,options:options,name:c.name};
 }
 function identify(){var c=app.project.activeItem,i,l,m;if(!(c instanceof CompItem))return null;if(meta(c))return c;var ls=c.selectedLayers;for(i=0;i<ls.length;i++){l=ls[i];if(l.comment&&l.comment.indexOf(DRIVER)===0){var item=app.project.itemByID(Number(l.comment.substr(DRIVER.length)));if(meta(item))return item;}if(l.source&&meta(l.source))return l.source;}return null;}
 function owned(raw,except){var out=[],i,item;for(i=1;i<=app.project.numItems;i++){item=app.project.item(i);if(item!==except&&item.parentFolder===raw.parentFolder&&item instanceof CompItem)out.push(item.id);}return out;}
 function create(raw,data,options,receiving){var duration=raw.duration,c=app.project.items.addComp('YaguaTool Lab · '+data.name,data.width,data.height,1,duration,data.fps);c.parentFolder=raw.parentFolder;
  try{
  var opts=data.renderOptions||{data:{name:data.name,pack:data.pack,kind:''},params:data.parameters,text:data.text,baseColor:'#ffffff',fontSize:data.fontSize,sequence:!!data.sequence,holdMs:data.holdMs||500,presetId:data.id};
  var m={cacheIds:owned(raw,c),options:opts,fields:descriptors(opts.params),driverName:'TEXTO - editar aqui',cacheName:'MOTION - cache original',applied:JSON.stringify({text:data.text,params:opts.params})},input=c.layers.addText(data.text);input.name=m.driverName;input.enabled=false;input.guideLayer=true;input.comment=DRIVER+c.id;install(input,m);
  var cache=c.layers.add(raw);cache.name=m.cacheName;
  var prefix='var C=thisComp.layer('+JSON.stringify(m.driverName)+');';
  cache.transform.position.expression=prefix+'value+[C.effect("Global - X")(1),C.effect("Global - Y")(1)];';
  cache.transform.scale.expression=prefix+'value*C.effect("Global - Escala %")(1)/100;';cache.transform.rotation.expression=prefix+'value+C.effect("Global - Rotacion")(1);';cache.transform.opacity.expression=prefix+'value*C.effect("Global - Opacidad %")(1)/100;';
  var blur=cache.property('ADBE Effect Parade').addProperty('ADBE Gaussian Blur 2');blur.property(1).expression=prefix+'Math.max(0,C.effect("Global - Blur")(1));';
  cache.locked=true;setMeta(c,m);
  if(options.insert){var instance=receiving.layers.add(c);instance.startTime=receiving.time;instance.name='YaguaTool Lab · '+data.name;var external=receiving.layers.addText(data.text);external.name='TEXTO - '+data.name+' - '+c.id;external.startTime=receiving.time;external.enabled=false;external.guideLayer=true;external.comment=DRIVER+c.id;install(external,m);
   var ref='comp('+JSON.stringify(receiving.name)+').layer('+JSON.stringify(external.name)+')';input.property('ADBE Text Properties').property('ADBE Text Document').expression=ref+'.text.sourceText;';
   var effects=input.property('ADBE Effect Parade');for(var i=1;i<=effects.numProperties;i++)effects.property(i).property(1).expression=ref+'.effect('+JSON.stringify(effects.property(i).name)+')(1);';
   m.external={compId:receiving.id,layerId:external.id};setMeta(c,m);for(i=1;i<=receiving.numLayers;i++)receiving.layer(i).selected=false;external.selected=true;receiving.openInViewer();
  }else{input.selected=true;c.openInViewer();}
  m.applied=state(c).signature;setMeta(c,m);return c;
  }catch(error){if(external)try{external.remove();}catch(ignoreExternal){}if(instance)try{instance.remove();}catch(ignoreInstance){}try{c.remove();}catch(ignoreComp){}throw error;}
 }
 function cleanup(folder,except,ids){if(!folder)return;try{var changed=true,i,item;while(changed){changed=false;for(i=folder.numItems;i>=1;i--){item=folder.item(i);var ours=false;for(var n=0;n<(ids||[]).length;n++)if(ids[n]===item.id)ours=true;if(ours&&item!==except&&item instanceof CompItem&&item.usedIn.length===0){item.remove();changed=true;}}}if(folder.numItems===0)folder.remove();}catch(ignoreCleanup){}}
 Animix.api.ytLabRigState=function(){var c=identify();return{data:c?state(c):null};};
 Animix.api.ytLabRigUpdate=function(o){var c=app.project.itemByID(o.id),m=meta(c);if(!m)throw Error('El rig ya no existe.');var before=state(c);if(before.signature!==o.signature)return{msg:'Hay cambios más recientes; se actualizarán en la siguiente sincronización.',data:{stale:true}};
  var oldIds=m.cacheIds||[],oldDuration=c.duration,uses=c.usedIn||[],instances=[],ui,li;for(ui=0;ui<uses.length;ui++)for(li=1;li<=uses[ui].numLayers;li++){var use=uses[ui].layer(li);if(use.source===c&&!use.locked&&use.stretch>0&&Math.abs(use.outPoint-(use.startTime+oldDuration*use.stretch/100))<uses[ui].frameDuration)instances.push(use);}
  var data=YaguaHost.read(new File(o.path)),raw=null,old=c.layer(m.cacheName).source,oldFolder=old.parentFolder,viewer=app.project.activeItem;
  try{raw=YaguaNativeLab.safeBuild(data,{cacheOnly:true});if(raw.parentFolder!==c.parentFolder)raw.parentFolder.parentFolder=c.parentFolder;var cache=c.layer(m.cacheName);cache.locked=false;try{cache.replaceSource(raw,false);c.duration=raw.duration;cache.outPoint=raw.duration;}finally{cache.locked=true;}for(ui=0;ui<instances.length;ui++){instances[ui].outPoint=instances[ui].startTime+raw.duration*instances[ui].stretch/100;if(instances[ui].containingComp.duration<instances[ui].outPoint)instances[ui].containingComp.duration=instances[ui].outPoint;}
   // Keep a stable wrapper ID and user-controlled layers/effects; only the render cache changes.
   m.options=data.renderOptions;m.cacheIds=owned(raw,c);m.applied=o.signature;setMeta(c,m);cleanup(oldFolder,c,oldIds);if(viewer instanceof CompItem)viewer.openInViewer();return{msg:'Motion Lab sincronizado: '+c.name,data:{id:c.id}};
  }finally{if(o.temporary)try{var f=new File(o.path);if(f.fsName.indexOf(Folder.temp.fsName)===0&&f.name.indexOf('YaguaTool_Lab_')===0)f.remove();}catch(ignoreFile){}}
 };
 return{create:create,meta:meta,state:state};
})();

YaguaHostBoot.modules.push("lab-editable.jsx");
} catch (yaguaModuleError) {
YaguaHostBoot.errors.push("lab-editable.jsx: "+String(yaguaModuleError.message||yaguaModuleError)+" (line "+String(yaguaModuleError.line||"?")+")");
}

if(typeof Animix==="undefined"||!Animix) { var Animix={}; }
Animix.yaguaVersion="3.1.0";
Animix.yaguaHealth=function(){
 var required=["text","removeText","tempDir","ytLabBuild","ytLabDefault","ytFluidCreate","ytFluidPreview","ytCarouselCreate","ytCarouselSources","ytCurveApply","ytSaveJSON","ytLabRigState","ytLabRigUpdate","ytSocialComp","ytBounceCurve"],missing=[],i;
 for(i=0;i<required.length;i++)if(!Animix.api||typeof Animix.api[required[i]]!=="function")missing.push(required[i]);
 var root=typeof YaguaHost!=="undefined"&&YaguaHost?YaguaHost.root:"",ready=typeof Animix.call==="function"&&missing.length===0&&YaguaHostBoot.errors.length===0&&!!root;
 return {ok:ready,msg:ready?"Host 3.1.0 cargado y verificado":"No se ha podido cargar el host completo: "+YaguaHostBoot.errors.join(" | ")+(missing.length?" | faltan: "+missing.join(", "):"")+(!root?" | ruta de extensión no disponible":""),
 data:{version:"3.1.0",root:root,host:typeof app!=="undefined"?String(app.name):"",hostVersion:typeof app!=="undefined"?String(app.version):"",modules:YaguaHostBoot.modules,errors:YaguaHostBoot.errors,missing:missing}};
};
if(typeof $!=="undefined"&&$.global){$.global.Animix=Animix;$.global.YaguaHost=typeof YaguaHost!=="undefined"?YaguaHost:null;}
