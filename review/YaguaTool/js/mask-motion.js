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
