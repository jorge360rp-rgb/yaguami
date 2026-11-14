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
