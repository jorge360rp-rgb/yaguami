/* UI motion remains independent of the animation applied in After Effects. */
var YaguStudioMotion=(function(){
  "use strict";
  var entry=null;
  function reduced(){return document.documentElement.getAttribute("data-motion")==="reduced";}
  function enter(el,section){
    if(entry)entry.cancel();
    if(reduced()||!el.animate)return;
    entry=el.animate([{opacity:0,transform:"translateY("+(section?12:5)+"px)"},{opacity:1,transform:"translateY(0)"}],{duration:section?380:240,easing:"cubic-bezier(.16,1,.3,1)"});
  }
  function press(e){
    var button=e.target.closest?e.target.closest("button,summary"):null;
    if(!button||button.disabled)return;
    var box=button.getBoundingClientRect();
    button.style.setProperty("--press-x",(e.clientX-box.left)+"px");button.style.setProperty("--press-y",(e.clientY-box.top)+"px");
    if(!reduced()&&button.animate)button.animate([{transform:"scale(1)"},{transform:"scale(.975)"},{transform:"scale(1)"}],{duration:260,easing:"cubic-bezier(.2,.8,.2,1)"});
  }
  document.addEventListener("pointerdown",press);
  return {enter:enter,reduced:reduced};
})();
