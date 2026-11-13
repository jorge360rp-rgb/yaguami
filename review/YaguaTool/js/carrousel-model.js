/* Original shared ES3 geometry for the live view and AE expressions. */
var YaguaCarrouselModel=(function(){
 function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
 function number(o,k,d){var n=Number(o[k]);return o[k]===undefined||!isFinite(n)?d:n;}
 function smooth(x){x=clamp(x,0,1);return x*x*(3-2*x);}
 function control(points){return [2*points[1][0]-.5*(points[0][0]+points[2][0]),2*points[1][1]-.5*(points[0][1]+points[2][1])];}
 function curve(p,t){var q=control(p),u=1-t;return [u*u*p[0][0]+2*u*t*q[0]+t*t*p[2][0],u*u*p[0][1]+2*u*t*q[1]+t*t*p[2][1]];}
 function pose(index,count,time,o){
  var progress=((index*number(o,'gap',100/Math.max(1,count))/100+time*number(o,'speed',10)/100*(o.reverse?-1:1))%1+1)%1,
      width=Math.max(.005,number(o,'middleWidth',8)/100),soft=clamp(number(o,'softness',20)/100,0,1),distance=Math.abs(progress-.5),
      focus=1-smooth((distance-width*.4)/Math.max(.001,width*(.6+soft*2))),size=number(o,'baseSize',100)/100*(1+(number(o,'middleSize',160)/100-1)*focus),position,rotation=0,depth;
  var points=o.points||[[.12,.68],[.5,.42],[.88,.65]];
  if(o.mode==='radial'){
   var angle=(progress-.5)*Math.PI*2,rx=number(o,'radiusX',35)/100,ry=number(o,'radiusY',18)/100;
   position=[.5+Math.sin(angle)*rx,.45+Math.cos(angle)*ry];depth=(1-Math.cos(angle))*.5*400;
   if(o.orient)rotation=-Math.sin(angle)*14;
  }else{
   position=curve(points,progress);depth=(1-focus)*400;
   if(o.orient){var q=control(points),dx=2*(1-progress)*(q[0]-points[0][0])+2*progress*(points[2][0]-q[0]),dy=2*(1-progress)*(q[1]-points[0][1])+2*progress*(points[2][1]-q[1]);rotation=Math.atan2(dy,dx)*180/Math.PI;}
  }
  var edge=Math.max(.015,soft*.13),alpha=o.mode==='radial'?.55+.45*focus:smooth(progress/edge)*smooth((1-progress)/edge);
  return {progress:progress,x:position[0],y:position[1],scale:size,rotation:rotation,opacity:alpha,focus:focus,z:depth};
 }
 function projection(p,width,height,zoom){var ratio=(zoom+p.z)/zoom;return {position:[width/2+(p.x*width-width/2)*ratio,height/2+(p.y*height-height/2)*ratio,p.z],scale:p.scale*ratio};}
 function rounded(width,height,radius){var r=clamp(radius,0,Math.min(width,height)/2),k=.55228475;return{vertices:[[r,0],[width-r,0],[width,r],[width,height-r],[width-r,height],[r,height],[0,height-r],[0,r]],inTangents:[[-r*k,0],[0,0],[0,-r*k],[0,0],[r*k,0],[0,0],[0,r*k],[0,0]],outTangents:[[0,0],[r*k,0],[0,0],[0,r*k],[0,0],[-r*k,0],[0,0],[0,-r*k]]};}
 return{pose:pose,curve:curve,control:control,projection:projection,rounded:rounded};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=YaguaCarrouselModel;
