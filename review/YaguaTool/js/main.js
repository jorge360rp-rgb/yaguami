/* Yaguanimix - UI del panel */
(function () {
  "use strict";
  var KEY = "animix.v1";
  var hasCEP = !!(window.__adobe_cep__ && window.__adobe_cep__.evalScript);

  /* ---------- almacenamiento ---------- */
  var S = {
    settings: { tips: true, theme: "light", accent: "#0066cc", startAt: "layer", textPhase:"in", ease: 55, page: "text" },
    vals: {},          // valores por preset
    palettes: [{ name: "Mi paleta", colors: ["#8b7bff", "#ff7ac6", "#ffd166", "#06d6a0", "#118ab2"] }],
    refs: [], refFolders: ["General"], comps: [], fonts: [], fontText: "Aa Texto de prueba",
    slots: [], ffx: [], graphPresets: [], customExpr: [], graph: { x1: .42, y1: 0, x2: .58, y2: 1, mode: "value" }
  };
  function load() {
    try { var r = localStorage.getItem(KEY); if (r) { var o = JSON.parse(r), k; for (k in o) S[k] = o[k]; } } catch (e) { }
  }
  var saveT;
  function save(now) {
    clearTimeout(saveT);
    var run = function () {
      try { localStorage.setItem(KEY, JSON.stringify(S)); }
      catch (e) { toast("No se pudo guardar: almacenamiento lleno (borra referencias).", true); }
    };
    if (now) run(); else saveT = setTimeout(run, 250);
  }
  load();

  /* ---------- helpers ---------- */
  function h(tag, props) {
    var e = document.createElement(tag), k, v, i;
    props = props || {};
    for (k in props) {
      v = props[k];
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k === "style") e.style.cssText = v;
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) e.setAttribute(k, v);
    }
    for (i = 2; i < arguments.length; i++) add(e, arguments[i]);
    return e;
  }
  function add(e, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(e, x); }); return; }
    e.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(c) : c);
  }
  var toastT;
  function toast(msg, err) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.className = "show" + (err ? " err" : "");
    clearTimeout(toastT); toastT = setTimeout(function () { t.className = ""; }, err ? 4500 : 2200);
  }
  function jsx(fn, args) {
    return new Promise(function (res) {
      if (!hasCEP) { console.log("[demo] jsx", fn, args); res({ ok: true, msg: "(demo) " + fn, data: null }); return; }
      var script = "Animix.call(" + JSON.stringify(fn) + "," + JSON.stringify(JSON.stringify(args || {})) + ")";
      window.__adobe_cep__.evalScript(script, function (r) {
        try { res(JSON.parse(r)); } catch (e) { res({ ok: false, msg: "AE respondió: " + String(r).slice(0, 160) }); }
      });
    });
  }
  function run(fn, args, quiet) {
    return jsx(fn, args).then(function (r) { if (!quiet || !r.ok) toast(r.msg, !r.ok); return r; });
  }
  function copyText(t) {
    var ta = h("textarea", { style: "position:fixed;left:-999px" }); ta.value = t; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("Copiado " + t); } catch (e) { } ta.remove();
  }
  function cepFS() { return window.cep && window.cep.fs ? window.cep : null; }
  function dataURLToB64(u) { return u.split(",")[1]; }
  function hex2rgb(x) { x = x.replace("#", ""); return [parseInt(x.substr(0, 2), 16), parseInt(x.substr(2, 2), 16), parseInt(x.substr(4, 2), 16)]; }
  function rgb2hex(r, g, b) { return "#" + [r, g, b].map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? "0" : "") + v.toString(16); }).join(""); }
  function rgb2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255; var mx = Math.max(r, g, b), mn = Math.min(r, g, b), hh, s, l = (mx + mn) / 2, d = mx - mn;
    if (!d) return [0, 0, l];
    s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
    hh = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [hh * 60, s, l];
  }
  function hsl2hex(hh, s, l) {
    hh = ((hh % 360) + 360) % 360; var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((hh / 60) % 2 - 1)), m = l - c / 2, r, g, b;
    if (hh < 60) { r = c; g = x; b = 0; } else if (hh < 120) { r = x; g = c; b = 0; } else if (hh < 180) { r = 0; g = c; b = x; }
    else if (hh < 240) { r = 0; g = x; b = c; } else if (hh < 300) { r = x; g = 0; b = c; } else { r = c; g = 0; b = x; }
    return rgb2hex((r + m) * 255, (g + m) * 255, (b + m) * 255);
  }
  function lum(hex) { var c = hex2rgb(hex).map(function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; }
  function contrast(a, b) { var l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); }
  function fileToImage(file, maxW, q) {
    return new Promise(function (res, rej) {
      var fr = new FileReader();
      fr.onload = function () {
        var im = new Image();
        im.onload = function () {
          var k = Math.min(1, maxW / im.width), c = document.createElement("canvas");
          c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
          c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
          res({ url: c.toDataURL("image/jpeg", q), canvas: c });
        };
        im.onerror = rej; im.src = fr.result;
      };
      fr.onerror = rej; fr.readAsDataURL(file);
    });
  }

  /* ---------- controles ---------- */
  function vals(id, params) {
    var v = S.vals[id] = S.vals[id] || {};
    // Migra solo valores que coinciden exactamente con los defaults antiguos;
    // los ajustes personalizados del usuario se conservan.
    if (!S.vals.__motion105) {
      var legacy = {
        textHWR:{dur:[1.1,.95],dist:[60,36],blur:[10,6],overlap:[60,100]},
        textCT:{dur:[1.2,.95],dist:[60,36],blur:[10,6],overlap:[60,100]},
        textSBL:{dur:[1.0,.9],dist:[60,36],blur:[10,6],overlap:[60,100]},
        textEL:{dur:[1.3,1.05],dist:[60,36],blur:[10,6],bounce:[30,16],bounces:[2,1],overlap:[60,100]},
        textAFW:{dur:[1.3,1.1],dist:[60,36],blur:[10,6]},
        textAFL:{dur:[1.4,1.1],dist:[60,36],blur:[10,6]},
        textAFC:{dur:[1.2,1.0],dist:[60,36],blur:[10,6]},
        textSR:{dist:[60,36],blur:[20,12],overlap:[60,100]},
        textWR:{dist:[60,36],blur:[20,12]},
        textSB:{dist:[60,36],blur:[20,12],bounce:[30,16],bounces:[2,1],overlap:[60,100]},
        textWB:{dist:[60,36],blur:[20,12],bounce:[30,16]},
        textO:{overlap:[60,100]},
        textWO:{freq:[8,5]}
      };
      var oldSet, oldKey;
      for (oldKey in legacy) if (legacy.hasOwnProperty(oldKey)) {
        oldSet = S.vals[oldKey];
        if (oldSet) for (var field in legacy[oldKey]) if (legacy[oldKey].hasOwnProperty(field)) {
          if (oldSet[field] === legacy[oldKey][field][0]) oldSet[field] = legacy[oldKey][field][1];
        }
      }
      S.vals.__motion105 = true;
      save(true);
    }
    params.forEach(function (p) { if (v[p.k] === undefined) v[p.k] = p.def; });
    return v;
  }
  var controlSequence=0;
  function control(p, v, onUpdate) {
    var fieldId="yagu-field-"+(++controlSequence);
    var ctl, set = function (x) { v[p.k] = x; save(); if (typeof onUpdate === "function") onUpdate(); };
    if (p.t === "num") {
      var r = h("input", { "aria-label":p.label,type: "range", min: p.min, max: p.max, step: p.step, value: v[p.k] });
      var n = h("input", { id:fieldId,type: "number", min: p.min, max: p.max, step: p.step, value: v[p.k] });
      r.addEventListener("input", function () { n.value = r.value; set(+r.value); });
      n.addEventListener("change", function () { var x = Math.max(p.min, Math.min(p.max, +n.value || 0)); n.value = x; r.value = x; set(x); });
      ctl = [r, n, h("span", { style: "color:var(--mut);width:16px;flex:none" }, p.unit || "")];
    } else if (p.t === "seg") {
      var seg = h("div", { class: "seg" });
      p.opts.forEach(function (o) {
        var b = h("button", { class: v[p.k] === o[0] ? "on" : "", onclick: function () { set(o[0]); Array.prototype.forEach.call(seg.children, function (c) { c.classList.remove("on"); }); b.classList.add("on"); } }, o[1]);
        seg.appendChild(b);
      });
      ctl = seg;
    } else if (p.t === "sel") {
      var sl = h("select", { onchange: function () { set(sl.value); } }, p.opts.map(function (o) { return h("option", { value: o[0], selected: v[p.k] === o[0] }, o[1]); }));
      ctl = sl;
    } else if (p.t === "tog") {
      var tg = h("button", { class: "tog" + (v[p.k] ? " on" : ""), onclick: function () { set(!v[p.k]); tg.classList.toggle("on");tg.setAttribute("aria-checked",v[p.k]?"true":"false"); },role:"switch","aria-checked":v[p.k]?"true":"false","aria-label":p.label });
      ctl = tg;
    } else if (p.t === "color") {
      ctl = h("input", { type: "color", value: v[p.k], oninput: function (e) { set(e.target.value); } });
    } else if (p.t === "txt") {
      ctl = h("input", { type: "text", value: v[p.k], oninput: function (e) { set(e.target.value); } });
    }
    if(ctl&&!Array.isArray(ctl)){ctl.setAttribute("id",fieldId);ctl.setAttribute("aria-label",p.label);}
    return h("div", { class: "row" }, h("label", {"for":fieldId}, p.label), h("div", { class: "ctl" }, ctl));
  }
  function seg2(opts, cur, on) {
    var el = h("div", { class: "seg" });
    opts.forEach(function (o) {
      var b = h("button", { class: cur === o[0] ? "on" : "", onclick: function () { on(o[0]); Array.prototype.forEach.call(el.children, function (c) { c.classList.remove("on"); }); b.classList.add("on"); } }, o[1]);
      el.appendChild(b);
    });
    return el;
  }
  function toggleRow(label, key, obj, cb) {
    var t = h("button", { class: "tog" + (obj[key] ? " on" : ""), "aria-label": label, "aria-pressed": obj[key] ? "true" : "false", onclick: function () { obj[key] = !obj[key]; t.classList.toggle("on"); t.setAttribute("aria-pressed",obj[key]?"true":"false"); save(); cb && cb(); } });
    return h("div", { class: "row" }, h("label", { style: "flex:1" }, label), t);
  }
  function base() { return { startAt: S.settings.startAt, ease: S.settings.ease }; }
  function merge(a, b) { var k; for (k in b) a[k] = b[k]; return a; }

  /* ---------- páginas con presets (Texto / Movimiento) ---------- */
  var sel = { text: "MRU", expr: "wiggle" };
  function effectPreview(key, cur, v) {
    if(key === "text" && cur.params && typeof YaguTextPreview !== "undefined")return YaguTextPreview.create(h,cur,v,run,hasCEP);
    var id = String(cur.id).toLowerCase();
    var stage = h("div", { class: "animix-preview-stage pv-effect-" + id + " pv-demo-" + id });
    var grid = h("div", { class: "pv-grid" });
    var content = h("div", { class: "pv-demo-content" });
    var title, sub, extra;
    function line(txt, cls) { return h("span", { class: cls || "pv-demo-line" }, txt); }
    function word(txt) { return h("span", { class: "pv-word" }, txt); }
    function charSet(txt) { var box=h("span",{class:"pv-char-set"}); txt.split("").forEach(function(c){box.appendChild(h("i",{},c===" "?"\u00a0":c));}); return box; }

    if (key==="text" && /^(mru|mrd|mrl|mrr|msc|mdi)$/.test(id)) {
      content.className += " pv-mask-content";
      content.appendChild(h("div",{class:"pv-mask-lines"},[
        h("span",{class:"pv-mask-line"},"DESIGN WITH"),
        h("span",{class:"pv-mask-line"},"INTENTION")
      ]));
      content.appendChild(line("NATIVE MASK PATH · AFTER EFFECTS","pv-caption"));
    // Previews de texto dinámicos: representan exactamente la unidad seleccionada.
    } else if (key === "text" && (id === "sr" || id === "sb")) {
      var unit = v.basedOn || "chars";
      if (unit === "lines") {
        content.className += " pv-unit-lines";
        content.appendChild(h("div", { class: "pv-lines" }, [
          line("Diseño que"), line("cuenta historias"), line("en movimiento")
        ]));
        content.appendChild(line("ANIMACIÓN POR LÍNEAS", "pv-caption"));
      } else {
        content.className += " pv-unit-letters";
        content.appendChild(charSet("YAGUANIMIX"));
        content.appendChild(line("ANIMACIÓN POR LETRAS", "pv-caption"));
      }
    // Cada preset no textual conserva su escena específica.
    } else if (id === "hwr" || id === "afw" || id === "glide" || id === "lift" || id === "kpu") {
      content.appendChild(h("div",{class:"pv-words"},[word("Ideas"),word("que"),word("mueven") ]));
      content.appendChild(line("HERO · WORD REVEAL","pv-caption"));
    } else if (id === "ct") {
      content.appendChild(h("div",{class:"pv-tracking"},"CINEMATIC"));
      content.appendChild(line("T R A C K I N G","pv-caption"));
    } else if (id === "sbl" || id === "afl" || id === "editorial" || id === "stag") {
      content.appendChild(h("div",{class:"pv-lines"},[line("Diseño que"),line("cuenta historias"),line("en movimiento")]));
      content.appendChild(line("LINE BY LINE","pv-caption"));
    } else if (id === "el" || id === "afc" || id === "sr" || id === "sb" || id === "depth" || id === "snap") {
      content.appendChild(charSet(id === "el" ? "ELASTIC" : id === "afc" ? "FLUID TYPE" : "MOTION"));
      content.appendChild(line(id === "el" ? "LETTER STAGGER + BOUNCE" : "CHARACTER REVEAL","pv-caption"));
    } else if (id === "wr" || id === "wb") {
      content.appendChild(h("div",{class:"pv-whole"},id === "wb" ? "BOUNCE" : "WHOLE TEXT"));
      content.appendChild(line("SINGLE LAYER MOVE","pv-caption"));
    } else if (id === "o" || id === "wo") {
      content.appendChild(h("div",{class:"pv-opacity"},"FADE IN"));
      content.appendChild(line(id === "wo" ? "IRREGULAR FLICKER" : "OPACITY ONLY","pv-caption"));
    } else if (id === "n") {
      content.appendChild(h("div",{class:"pv-counter"},"0 → 1,250"));
      content.appendChild(line("COUNT UP","pv-caption"));
    } else if (id === "tm") {
      content.appendChild(h("div",{class:"pv-timer"},"00:00:08"));
      content.appendChild(line("TIMER / STOPWATCH","pv-caption"));
    } else if (id === "tw") {
      content.appendChild(h("div",{class:"pv-typewriter"},[h("span",{},"Escribe algo"),h("i",{},"▍")]));
      content.appendChild(line("TYPEWRITER","pv-caption"));
    } else if (id === "sweep") {
      content.appendChild(h("div",{class:"pv-sweep-object"},"Yaguano"));
      content.appendChild(h("div",{class:"pv-sweep-ink"},"Yaguano"));
      content.appendChild(line("COLOR SWEEP GLOW","pv-caption"));
    } else if (id === "ping") {
      content.appendChild(h("div",{class:"pv-cta-wrap"},[h("span",{class:"pv-cta-halo"}),h("span",{class:"pv-cta-button"},"CLICK" )]));
      content.appendChild(line("CTA PING · LOOP","pv-caption"));
    } else if (id === "lofi") {
      content.appendChild(h("div",{class:"pv-lofi-object"},"12 FPS"));
      content.appendChild(line("FRAME-STEPPED MOTION","pv-caption"));
    } else if (id === "wiggle") {
      content.appendChild(h("div",{class:"pv-shape pv-wiggle-shape"},"✳"));
      content.appendChild(line("ORGANIC POSITION","pv-caption"));
    } else if (id === "jump") {
      content.appendChild(h("div",{class:"pv-shape pv-jump-shape"},"●"));
      content.appendChild(line("JUMP + SQUASH","pv-caption"));
    } else if (id === "pop") {
      content.appendChild(h("div",{class:"pv-pop-card"},[h("b",{},"NEW"),h("span",{},"Pop up")]));
      content.appendChild(line("SCALE + OVERSHOOT","pv-caption"));
    } else if (id === "spin") {
      content.appendChild(h("div",{class:"pv-spin-shape"},"✦"));
      content.appendChild(line("ROTATION","pv-caption"));
    } else if (id === "blur") {
      content.appendChild(h("div",{class:"pv-blur-text"},"FOCUS"));
      content.appendChild(line("BLUR TO SHARP","pv-caption"));
    } else if (id === "bounce") {
      content.appendChild(h("div",{class:"pv-bounce-ball"},"●"));
      content.appendChild(line("DECAYING BOUNCE","pv-caption"));
    } else {
      content.appendChild(h("div",{class:"pv-whole"},key === "text" ? "TYPE" : "MOTION"));
      content.appendChild(line("ANIMIX PREVIEW","pv-caption"));
    }
    stage.appendChild(grid); stage.appendChild(content);

    var play = h("button", { class: "btn sm", onclick: replay }, "↻ Reproducir");
    function refresh() {
      var d = Number(v.dur || v.pingDur || 1.1);
      if (id === "ping") d = Number(v.pingDur || d);
      if (id === "lofi") d = 1.1;
      d = Math.max(0.25, Math.min(10, d));
      stage.style.setProperty("--pv-duration", d + "s");
      if (/^(mru|mrd|mrl|mrr|msc|mdi)$/.test(id)) stage.style.setProperty("--pv-stagger",Math.max(0,Number(v.stagger)||0)+"s");
      stage.style.setProperty("--pv-distance", Math.max(12, Math.min(70, Number(v.dist || 32))) + "px");
      stage.style.setProperty("--pv-blur", Math.max(0, Math.min(16, Number(v.blur || 6))) + "px");
      if (v.tracking !== undefined) stage.style.setProperty("--pv-tracking", Math.max(0, Math.min(100, Number(v.tracking))) + "px");
      stage.style.setProperty("--pv-glow", Math.max(0, Math.min(1, Number(v.glow === undefined ? 16 : v.glow / 100))));
      if (id === "sweep") stage.style.setProperty("--pv-color-power", Math.max(0,Math.min(1,Number(v.colorPower===undefined?64:v.colorPower)/100)));
      stage.style.setProperty("--pv-band", Math.max(12, Math.min(60, Number(v.band || 120) / 5)) + "%");
      stage.style.setProperty("--pv-ping-size", Math.max(20, Math.min(500, Number(v.pingSize || 100))) + "px");
      stage.style.setProperty("--pv-fps", Math.max(2, Math.min(24, Number(v.fps || 12))));
      stage.style.setProperty("--pv-separation", Math.max(0.1, Math.min(2, Number(v.separation || 0.55))));
      if (v.pingColor) stage.style.setProperty("--pv-accent", v.pingColor);
      if (v.palette) stage.setAttribute("data-palette", v.palette);
      if (v.colors && v.colors.length === 3 && id === "sweep") {
        stage.style.setProperty("--sweep-c1",v.colors[0]);
        stage.style.setProperty("--sweep-c2",v.colors[1]);
        stage.style.setProperty("--sweep-c3",v.colors[2]);
      }
      if (v.dir) stage.setAttribute("data-dir", v.dir);
      if (v.mode) stage.setAttribute("data-mode", v.mode);
      if (id==="sweep") stage.setAttribute("data-orientation",v.vertical?"vertical":"horizontal");
      stage.setAttribute("data-light", v.lightAccent ? "true" : "false");
      if (key === "text") {
        stage.setAttribute("data-unit", v.basedOn || "chars");
      }
      if (v.start !== undefined && v.end !== undefined && id === "n") content.querySelector(".pv-counter").textContent = Number(v.start).toLocaleString() + " → " + Number(v.end).toLocaleString();
      if (id === "tm" && v.format) content.querySelector(".pv-timer").textContent = v.format === "hh:mm:ss" ? "00:00:08" : "00:08";
    }
    function replay() {
      stage.classList.remove("is-playing");
      // Reinicia los keyframes en Chromium/CEP.
      var force = stage.offsetWidth;
      stage.classList.add("is-playing");
    }
    refresh();
    var wrap = h("div", { class: "card preview-card" },
      h("div", { class: "preview-head" }, h("div", {}, h("b", {}, "Vista previa · " + (cur.name || cur.id)), h("small", {}, "Vista CSS orientativa · usa «Preview real en AE» para verlo fielmente")), play), stage);
    replay();
    return { element: wrap, refresh: refresh, replay: replay };
  }
  function presetPage(root, list, key, fn, removeFn) {
    var cur = list.filter(function (p) { return p.id === sel[key]; })[0] || list[0];
    var v = vals(key + cur.id, cur.params);
    root.appendChild(h("h3", {}, key === "text" ? "Presets de texto" : "Expresiones y movimiento"));
    var chips = h("div", { class: "preset-families" });
    var groupFor = function(p) {
      if (/^(MRU|MRD|MRL|MRR|MSC|MDI)$/.test(p.id)) return 0;
      if (/^(HWR|CT|SBL|AFW|AFL|AFC|EDITORIAL|GLIDE|LIFT|STAG|YHERO|YDRIFT|YSLOW)$/.test(p.id)) return 1;
      if (/^(EL|KPU|SNAP|DEPTH|SR|SB|WB)$/.test(p.id)) return 2;
      return 3;
    };
    var groupTitles=["01 · Revelados con máscara real", "02 · Editorial y producto", "03 · Kinetic y experimental", "04 · Esenciales y utilidades"];
    var groupCount=(key==="text"?4:1);
    for(var g=0;g<groupCount;g++){
      // Cada familia posee su propia rejilla; evita que el título colapse
      // en una columna estrecha cuando el panel CEP se acopla a 300 px.
      var opened= key==="text" && (S.textFamilyOpen26 && S.textFamilyOpen26["f"+g]!==undefined ?
        S.textFamilyOpen26["f"+g] : groupFor(cur)===g);
      var family=h(key==="text"?"details":"section",{class:"preset-family"});
      if(key==="text"){
        family.open=!!opened;
        (function(index,details){ details.addEventListener("toggle",function(){
          S.textFamilyOpen26=S.textFamilyOpen26||{};
          if(S.textFamilyOpen26["f"+index]!==details.open){S.textFamilyOpen26["f"+index]=details.open;save();}
        }); })(g,family);
      }
      var grid=h("div",{class:"preset-family-grid"});
      if(key==="text")family.appendChild(h("summary",{class:"preset-family-title"},
         h("span",{class:"preset-family-caption"},groupTitles[g]),
         h("span",{class:"preset-family-count"},list.filter(function(p){return groupFor(p)===g;}).length+" presets")));
      list.forEach(function(p){
        if(key==="text" && groupFor(p)!==g)return;
        grid.appendChild(h("button",{class:"chip"+(p===cur?" on":""),"data-tip":p.desc,"aria-pressed":p===cur?"true":"false",onclick:function(event){sel[key]=p.id;if(key==="text"){
          S.textFamilyOpen26=S.textFamilyOpen26||{};S.textFamilyOpen26["f"+groupFor(p)]=true;
        }render();if(event.detail===0){var active=document.querySelector(".chip.on");if(active)active.focus({preventScroll:true});}}},h("span",{class:"preset-art art-"+p.id,"aria-hidden":"true"},h("i",{},"Aa")),h("b",{},p.id.toUpperCase()),h("span",{class:"chip-name"},p.name)));
      });
      family.appendChild(grid);chips.appendChild(family);
    }
    // Texto: primero la fase, la preview y las acciones; la galería queda
    // debajo para que aplicar un preset no exija recorrer 32 botones.
    if(key!=="text")root.appendChild(chips);
    if(key==="text"){
      var phase=S.settings.textPhase==="out"?"out":"in";
      var phaseCard=h("div",{class:"card phase-card"},
        h("div",{class:"phase-title"},"Fase de animación"),
        h("div",{class:"phase-options"},seg2([["in","IN · Entrada"],["out","OUT · Salida"]],phase,function(next){
          S.settings.textPhase=next;save(true);render();
        })),
        h("div",{class:"desc phase-help"},phase==="out"?
          "La salida empieza en el cabezal. Puedes combinarla con una entrada distinta.":
          "La entrada comienza en el inicio de capa o en el cabezal, según Ajustes."));
      root.appendChild(phaseCard);
      v.mode=phase;
    }
    if (key === "text") {
      var based = cur.params.filter(function (p) { return p.k === "basedOn"; })[0];
      if (based) {
        var unitCard = h("div", { class: "card text-unit-card" });
        if (based.opts && based.opts.length > 1) {
          unitCard.appendChild(h("div", { class: "row" }, h("label", {}, "Animar por"),
            h("select", { "aria-label":"Animar por",onchange: function (e) { v.basedOn = e.target.value; save(); render(); } },
              based.opts.map(function (opt) { return h("option", { value: opt[0], selected: v.basedOn === opt[0] }, opt[1]); }))));
        } else if (based.opts && based.opts.length) {
          // Presets específicos (Words, Lines) nunca se convierten a letras por un ajuste global.
          v.basedOn = based.opts[0][0];
          unitCard.appendChild(h("div", { class: "desc" }, "Unidad del preset: " + based.opts[0][1]));
        }
        root.appendChild(unitCard);
      }
    }
    var pv = effectPreview(key, cur, v);

    root.appendChild(pv.element);
    var card = h("div", { class: "card", style: "margin-top:10px" }, h("div", { class: "desc" }, cur.desc), cur.params.filter(function (p) { return !(key === "text" && (p.k === "basedOn" || p.k === "mode" || p.k === "twMode")); }).map(function (p) { return control(p, v, pv.refresh); }));
    root.appendChild(card);
    var isOut=(key==="text" && S.settings.textPhase==="out");
    var btns = h("div", { class: "btns" },
      h("button", { class: "btn pri", onclick: function () {
        if(key==="text" && isOut && (cur.id==="N" || cur.id==="TM")){
          toast("Números y temporizador generan contenido; elige una animación visual para OUT.",true);return;
        }
        var params=merge(merge({kind:cur.id},base()),v);
        if(key==="text"){
          params.mode=isOut?"out":"in";
          if(isOut)params.startAt="cti";
          if(cur.id==="TW")params.twMode=isOut?"delete":"type";
        }
        run(fn,params);
      } }, key==="text"?(isOut?"Aplicar OUT en cabezal":"Aplicar IN · "+cur.name):"Aplicar "+cur.name));
    if(key==="text"){
      btns.appendChild(h("button",{class:"btn","data-tip":"Quita solo la fase activa, sin tocar la otra",onclick:function(){run("removeTextPhase",{phase:isOut?"out":"in"});}},isOut?"Quitar OUT":"Quitar IN"));
    }else{
      btns.appendChild(h("button",{class:"btn danger",onclick:function(){run(removeFn);}},"Quitar"));
    }
    if (key === "text"){
      btns.appendChild(h("button", { class: "btn", "data-tip": "Vuelve a los ajustes recomendados. No modifica la composición.", onclick: function () {
        delete S.vals[key + cur.id]; save(true); render(); toast("Ajustes de " + cur.name + " restablecidos");
      } }, "↺ Restablecer ajustes"));
    }
    root.appendChild(btns);
    if(key==="text"){
      root.appendChild(h("div",{class:"desc phase-footnote"},"Entrada y salida se ajustan por separado."));
      root.appendChild(h("h3",{},"Explorar presets de texto"));
      var search=h("input",{type:"search",placeholder:"Buscar un preset…","aria-label":"Buscar presets",oninput:function(){
        var q=search.value.toLowerCase();
        Array.prototype.forEach.call(chips.querySelectorAll(".preset-family"),function(family){
          var visible=0;Array.prototype.forEach.call(family.querySelectorAll(".chip"),function(chip){var match=chip.textContent.toLowerCase().indexOf(q)>=0;chip.hidden=!match;if(match)visible++;});
          family.hidden=visible===0;if(q&&visible)family.open=true;
        });
        empty.hidden=!!chips.querySelector(".chip:not([hidden])");
      }});
      var empty=h("p",{class:"search-empty",hidden:true},"No encontramos ese preset. Prueba otro nombre.");
      root.appendChild(h("div",{class:"collection-toolbar"},h("span",{},"32 formas de dar vida al texto"),search));
      root.appendChild(chips);root.appendChild(empty);
    }
  }
  // v2.5 · Zoom opcional: efecto adicional al IN/OUT, independiente.
  function pageZoom(root){
    var z=S.zoom250=S.zoom250||{direction:"in",phase:"in",strength:24,dur:.8,delay:0,enabled:false};
    root.appendChild(h("h3",{},"Zoom tipográfico · opcional"));
    var card=h("div",{class:"card v250-card"},
      h("div",{class:"desc"},"Añade un zoom a las letras sin tocar los keyframes de posición o escala de la capa. Mueve el cabezal al inicio del tramo y elige su duración. Puedes combinarlo con Smart Reveal IN y Smart Bounce OUT."),
      toggleRow("Activar controles de zoom","enabled",z,function(){render();}));
    if(z.enabled){
      card.appendChild(h("div",{class:"row"},h("label",{},"Dirección"),seg2([["in","Zoom In"],["out","Zoom Out"]],z.direction,function(v){z.direction=v;save();})));
      card.appendChild(h("div",{class:"row"},h("label",{},"Momento"),seg2([["in","Entrada IN"],["out","Salida OUT"]],z.phase,function(v){z.phase=v;save();})));
      card.appendChild(control({k:"strength",t:"num",label:"Intensidad",min:1,max:85,step:1,def:24,unit:"%"},z));
      card.appendChild(control({k:"dur",t:"num",label:"Duración",min:.1,max:5,step:.05,def:.8,unit:"s"},z));
      card.appendChild(control({k:"delay",t:"num",label:"Desfase",min:0,max:4,step:.05,def:0,unit:"s"},z));
      card.appendChild(h("div",{class:"desc"},"Inicio = cabezal + desfase. El efecto utiliza el escalado nativo de caracteres. En Efectos podrás modificar la intensidad y los keyframes de progreso."));
      card.appendChild(h("div",{class:"btns"},
        h("button",{class:"btn pri",onclick:function(){run("textZoom",{direction:z.direction,phase:z.phase,strength:z.strength,dur:z.dur,delay:z.delay});}},"Aplicar zoom"),
        h("button",{class:"btn",onclick:function(){run("removeTextZoom",{phase:z.phase});}},"Quitar zoom "+z.phase.toUpperCase()),
        h("button",{class:"btn sm",onclick:function(){S.zoom250={direction:"in",phase:"in",strength:24,dur:.8,delay:0,enabled:true};save(true);render();}},"↺ Restablecer")));
    }
    root.appendChild(card);
  }
  // 2.6 · Barridos unificados. El modelo contiene un único estilo activo.
  var SWEEP_STYLES_26={
    classic:{name:"Color Sweep Glow",desc:"Coral suave · luz integrada en las letras.",colors:["#e7bd9a","#f4a16c","#eb5d6a"]},
    silk:{name:"Iridescent Silk",desc:"Brillo perla, lavanda y rosa.",colors:["#b4e6ee","#c9a4f6","#f4b6c6"],width:29,feather:135},
    chrome:{name:"Chrome Glint",desc:"Reflejo metálico plata y azul frío.",colors:["#667c91","#ffffff","#9bb6d5"],width:12,feather:65},
    prism:{name:"Prism Split",desc:"Triple separación de color, gráfica y expresiva.",colors:["#ff6486","#4de7e8","#8276ff"],width:17,feather:75},
    scan:{name:"Signal Scan",desc:"Escaneo digital de estética CRT.",colors:["#2f80ed","#9dfdfa","#effbff"],width:10,feather:55}
  };
  function pageSweepStudio(root){
    var defs=SWEEP_STYLES_26;
    var z=S.styleSweep250=S.styleSweep250||{};
    var defaults={style:"silk",colors:defs.silk.colors.slice(),width:29,feather:135,power:68,dur:1.1,delay:0,lineGap:.12,sequential:false,follow:false,reverse:false,startAt:"cti"};
    Object.keys(defaults).forEach(function(k){if(z[k]===undefined)z[k]=defaults[k];});
    if(!defs[z.style]||z.style==="classic")z.style="silk";
    var card=h("div",{class:"card v250-card sweep-details"},h("div",{class:"desc"},defs[z.style].desc+" Edita el barrido sobre las letras existentes, sin sustituir IN ni OUT."));
    card.appendChild(h("div",{class:"v250-colors"},[0,1,2].map(function(i){return h("div",{},h("label",{},"Color "+(i+1)),h("input",{type:"color",value:z.colors[i],oninput:function(e){z.colors[i]=e.target.value;save();}}));})));
    card.appendChild(control({k:"width",t:"num",label:"Ancho",min:2,max:80,step:1,def:29,unit:"%"},z));
    card.appendChild(control({k:"feather",t:"num",label:"Suavidad",min:25,max:250,step:5,def:135,unit:"%"},z));
    card.appendChild(control({k:"power",t:"num",label:"Intensidad",min:0,max:100,step:1,def:68,unit:"%"},z));
    card.appendChild(control({k:"dur",t:"num",label:"Duración",min:.15,max:5,step:.05,def:1.1,unit:"s"},z));
    card.appendChild(control({k:"delay",t:"num",label:"Desfase",min:0,max:4,step:.05,def:0,unit:"s"},z));
    card.appendChild(h("div",{class:"row"},h("label",{},"Inicio"),seg2([["cti","Cabezal"],["layer","Capa"]],z.startAt,function(v){z.startAt=v;save();})));
    card.appendChild(toggleRow("Seguir la animación IN compatible","follow",z));
    card.appendChild(toggleRow("Recorrido inverso","reverse",z));
    card.appendChild(toggleRow("Una línea tras otra","sequential",z,function(){render();}));
    if(z.sequential)card.appendChild(control({k:"lineGap",t:"num",label:"Pausa línea",min:0,max:1.5,step:.05,def:.12,unit:"s"},z));
    function args(){return {style:z.style,colors:z.colors.slice(),width:z.width,feather:z.feather,power:z.power,dur:z.dur,delay:z.delay,startAt:z.startAt,follow:z.follow,reverse:z.reverse,sequential:z.sequential,lineGap:z.lineGap,blurAmount:S.sweepShared26.blurAmount};}
    card.appendChild(h("div",{class:"btns"},
      h("button",{class:"btn pri",onclick:function(){run("styleSweep",args());}},"Aplicar "+defs[z.style].name),
      h("button",{class:"btn",onclick:function(){run("previewStyleSweep",args());}},"▶ Preview real en AE"),
      h("button",{class:"btn danger",onclick:function(){run("removeAnySweep");}},"Quitar barrido")));
    card.appendChild(h("div",{class:"desc",style:"margin-top:10px"},"Después de aplicar, cambia Blur, ancho, colores e intensidad desde los controles de Efectos de la capa de texto."));
    root.appendChild(card);
  }
  function pageText(root) {
    var mode=S.settings.textWorkspace||"native";
    root.appendChild(h("div",{class:"text-workspace-tabs"},seg2([["native","Presets de texto"],["lab","Motion Lab v0.9"]],mode,function(v){S.settings.textWorkspace=v;save(true);render();})));
    if(mode==="lab"){
      var lab=h("section",{class:"yt-lab",id:"yt-lab"});root.appendChild(lab);
      window.YaguaMotionLab.mount(lab,{h:h,jsx:jsx,run:run,S:S,save:save,toast:toast,hasCEP:hasCEP});
    }else presetPage(root, TEXT_PRESETS, "text", "text", "removeText");
    pageZoom(root);
    root.appendChild(h("h3", {}, "Barridos de color · 5 estilos"));
    var sweepKind=S.sweepChoice26=S.sweepChoice26||"classic";
    if(!SWEEP_STYLES_26[sweepKind])sweepKind=S.sweepChoice26="classic";
    var shared=S.sweepShared26=S.sweepShared26||{blurAmount:1.5};
    if(typeof shared.blurAmount!=="number" || !isFinite(shared.blurAmount))shared.blurAmount=1.5;
    var stylesGrid=h("div",{class:"sweep-unified-grid"});
    Object.keys(SWEEP_STYLES_26).forEach(function(id){
      var prof=SWEEP_STYLES_26[id];
      stylesGrid.appendChild(h("button",{
        class:"sweep-style-choice"+(sweepKind===id?" active":""),"aria-pressed":sweepKind===id?"true":"false",
        onclick:function(){
          if(id!=="classic"){
            var z=S.styleSweep250=S.styleSweep250||{};
            if(z.style!==id){z.style=id;z.colors=prof.colors.slice();z.width=prof.width;z.feather=prof.feather;}
          }
          S.sweepChoice26=id;save(true);render();
        }
      },h("span",{class:"sweep-style-bar",style:"background:linear-gradient(95deg,"+prof.colors.join(",")+")"}),
        h("strong",{},prof.name),h("small",{},prof.desc)));
    });
    root.appendChild(h("div",{class:"card sweep-selector-card"},
      h("div",{class:"desc"},"Elige un barrido. Al aplicar uno nuevo se sustituye el anterior de YaguaTool; tus animaciones IN/OUT permanecen intactas."),
      stylesGrid,
      control({k:"blurAmount",t:"num",label:"Blur del barrido",min:0,max:20,step:.25,def:1.5,unit:"px"},shared),
      h("div",{class:"desc sweep-blur-help"},"Desenfoque localizado durante el barrido (0 = nítido). Después puedes ajustarlo desde Efectos de After Effects.")));
    var sweepPane=h("div",{class:"sweep-details sweep-classic"});
    var sw = S.sweepCfg = S.sweepCfg || { palette:"peko", colors:["#e7bd9a","#f4a16c","#eb5d6a"], band:68, separation:0.60, feather:0.70, colorPower:48, glow:12, dur:1.00, delay:0, vertical:false, mode:"in", lineMode:"all", lineGap:0.08, blur:"soft", reveal:"follow" };
    if (sw.feather === undefined) sw.feather = 0.55;
    if (sw.reveal === "off") sw.reveal = "follow";
    if (sw.reveal === "typewriter") sw.reveal = "add"; // migración no destructiva
    if (!S.__sweep122) {
      // Solo si conserva exactamente la paleta antigua sin personalizar,
      // sustituirla por el nuevo gradiente electrico mas contrastado.
      if (sw.palette === "minimal" && Array.isArray(sw.colors) &&
          sw.colors.join(",").toLowerCase() === "#77d7ff,#6485ff,#9470ff") {
        sw.palette = "electric";
        sw.colors = ["#00dfff", "#3775ff", "#c647ff"];
      }
      // Migrar unicamente valores identicos a los defaults de la version vieja.
      if (sw.glow === 24 || sw.glow === 32) sw.glow = 54;
      if (sw.separation === .42) sw.separation = .95;
      if (sw.band === 90) sw.band = 110;
      if (sw.feather === .55 || sw.feather === .32) sw.feather = .60;
      if (sw.blur === "off") sw.blur = "soft";
      S.__sweep122 = true; save();
    }
    if (sw.colorPower === undefined) sw.colorPower=48;
    if (sw.delay === undefined) sw.delay = 0;
    if (sw.vertical === undefined) sw.vertical = false;
    if (!S.__sweep130) {
      if (sw.palette === "electric" && Array.isArray(sw.colors) && sw.colors.join(",").toLowerCase() === "#00dfff,#3775ff,#c647ff") {
        sw.palette="peko";sw.colors=["#e7bd9a","#f4a16c","#eb5d6a"];
        if(sw.band===110)sw.band=68;
        if(sw.separation===.95)sw.separation=.60;
        if(sw.feather===.60)sw.feather=.52;
        if(sw.colorPower===82)sw.colorPower=64;
        if(sw.glow===54)sw.glow=16;
      }
      S.__sweep130 = true;save(true);
    }
    if (!S.__sweep200) {
      if (sw.palette === "peko" && Array.isArray(sw.colors) &&
          sw.colors.join(",").toLowerCase() === "#e7bd9a,#f4a16c,#eb5d6a") {
        if (sw.colorPower === 64) sw.colorPower = 48;
        if (sw.glow === 16) sw.glow = 12;
        if (sw.feather === .52) sw.feather = .70;
      }
      S.__sweep200 = true;
      save(true);
    }
    var palettes={peko:["#e7bd9a","#f4a16c","#eb5d6a"],electric:["#00dfff","#3775ff","#c647ff"],apple:["#8b5cf6","#ec4899","#38bdf8"],aurora:["#00c9a7","#438bff","#a56bff"],sunset:["#ff7272","#ffad66","#ffe08a"],ice:["#e5f7ff","#7dd3fc","#818cf8"],fire:["#ffe58a","#ff9b45","#ef5350"],minimal:["#77d7ff","#6485ff","#9470ff"]};
    sw.colors=Array.isArray(sw.colors)&&sw.colors.length===3?sw.colors:(palettes[sw.palette]||palettes.apple).slice();
    var sweepPreview=effectPreview("text",{id:"sweep"},sw);
    sweepPane.appendChild(sweepPreview.element);
    sweepPane.appendChild(h("button",{class:"btn sm",style:"margin-bottom:10px;width:100%",onclick:function(){run("previewSweep",{colors:sw.colors.slice(),band:sw.band,separation:sw.separation,feather:sw.feather,colorPower:sw.colorPower,glow:sw.glow,dur:sw.dur,delay:sw.delay,vertical:sw.vertical,mode:sw.mode,lineMode:sw.lineMode,lineGap:sw.lineGap,blurAmount:shared.blurAmount,reveal:sw.reveal});}},"▶ Preview real de Color Sweep en AE"));
    var sweepCard=h("div",{class:"card"});
    sweepCard.appendChild(h("div",{class:"row"},h("label",{},"Paleta rápida"),h("select",{onchange:function(e){sw.palette=e.target.value;sw.colors=(palettes[sw.palette]||sw.colors).slice();sweepCard.querySelectorAll("[data-sweep-color]").forEach(function(el,i){el.value=sw.colors[i];});save();sweepPreview.refresh();sweepPreview.replay();}},[["custom","Personalizada"],["peko","Coral · melocotón/coral"],["electric","Eléctrico · cian/azul/violeta"],["minimal","Azul · violeta"],["apple","Apple"],["aurora","Aurora"],["sunset","Sunset"],["ice","Ice"],["fire","Fire"]].map(function(x){return h("option",{value:x[0],selected:sw.palette===x[0]},x[1]);}))));
    sweepCard.appendChild(h("div",{class:"desc"},"Puedes elegir una combinación rápida o modificar individualmente los tres colores."));
    ["Color 1","Color 2","Color 3"].forEach(function(label,i){sweepCard.appendChild(h("div",{class:"row"},h("label",{},label),h("input",{type:"color","data-sweep-color":"1",value:sw.colors[i],oninput:function(e){sw.colors[i]=e.target.value;sw.palette="custom";sweepCard.querySelector("select").value="custom";save();sweepPreview.refresh();sweepPreview.replay();}})));});
    sweepCard.appendChild(control({k:"band",t:"num",label:"Ancho de banda",min:20,max:400,step:5,def:68,unit:"px"},sw,sweepPreview.refresh));
    sweepCard.appendChild(control({k:"separation",t:"num",label:"Separación de colores",min:0.1,max:1.5,step:0.05,def:0.60},sw,sweepPreview.refresh));
    sweepCard.appendChild(control({k:"feather",t:"num",label:"Suavidad del borde",min:0.05,max:1.5,step:0.05,def:0.70},sw,sweepPreview.refresh));
    sweepCard.appendChild(control({k:"colorPower",t:"num",label:"Intensidad de color",min:0,max:100,step:1,def:48,unit:"%"},sw,sweepPreview.refresh));
    sweepCard.appendChild(control({k:"glow",t:"num",label:"Halo luminoso",min:0,max:100,step:1,def:12,unit:"%"},sw,sweepPreview.refresh));
    sweepCard.appendChild(h("div",{class:"desc"},"Inspirado en la referencia de luz tipográfica: color cálido sobre los contornos de las letras, transición corta y un halo muy contenido. Evita un gran manchón coloreado."));
    sweepCard.appendChild(h("div",{class:"row"},h("label",{},"Aplicar por líneas"),h("select",{onchange:function(e){sw.lineMode=e.target.value;save();}},[["all","Todo el texto a la vez"],["sequential","Línea 1 → línea 2 → ..."]].map(function(x){return h("option",{value:x[0],selected:(sw.lineMode||"all")===x[0]},x[1]);}))));
    sweepCard.appendChild(control({k:"lineGap",t:"num",label:"Pausa entre líneas",min:0,max:2,step:0.05,def:0.12,unit:"s"},sw,sweepPreview.refresh));
    sweepCard.appendChild(h("div",{class:"row"},h("label",{},"Aparición del texto"),h("select",{onchange:function(e){sw.reveal=e.target.value;save();}},[["follow","Seguir animación existente (recomendado)"],["add","Crear aparición adicional sin tocar Source Text"]].map(function(x){return h("option",{value:x[0],selected:(sw.reveal||"off")===x[0]},x[1]);}))));
    sweepCard.appendChild(h("div",{class:"desc"},"El color se anima sobre los caracteres originales y mantiene las máscaras y keyframes existentes. En modo Seguir copia la curva del selector de texto si existe; de otro modo usa el tiempo de la capa. El halo es una copia opcional independiente."));
    sweepCard.appendChild(control({k:"delay",t:"num",label:"Retraso",min:0,max:10,step:0.05,def:0,unit:"s"},sw,sweepPreview.refresh));
    sweepCard.appendChild(h("div",{class:"row"},h("label",{},"Orientación"),seg2([["horizontal","Horizontal"],["vertical","Vertical"]],sw.vertical?"vertical":"horizontal",function(v){sw.vertical=v==="vertical";save();sweepPreview.refresh();sweepPreview.replay();})));
    sweepCard.appendChild(control({k:"dur",t:"num",label:"Duración",min:0.2,max:4,step:0.05,def:1.15,unit:"s"},sw,sweepPreview.refresh));
    sweepCard.appendChild(h("div",{class:"row"},h("label",{},"Modo"),seg2([["in","Entrada"],["out","Salida"],["inout","Ida y vuelta"]],sw.mode,function(v){sw.mode=v;save();sweepPreview.refresh();sweepPreview.replay();})));
    sweepCard.appendChild(h("div",{class:"btns"},h("button",{class:"btn pri",onclick:function(){run("colorSweep",{startAt:S.settings.startAt,colors:sw.colors.slice(),band:sw.band,separation:sw.separation,feather:sw.feather,colorPower:sw.colorPower,glow:sw.glow,dur:sw.dur,delay:sw.delay,vertical:sw.vertical,mode:sw.mode,lineMode:sw.lineMode||"all",lineGap:sw.lineGap||0,blurAmount:shared.blurAmount,reveal:sw.reveal||"off"});}},"Aplicar Color Sweep Glow"),h("button",{class:"btn danger",onclick:function(){run("removeAnySweep");}},"Quitar barrido"),h("button",{class:"btn",onclick:function(){S.sweepCfg={palette:"peko",colors:["#e7bd9a","#f4a16c","#eb5d6a"],band:68,separation:0.60,feather:0.70,colorPower:48,glow:12,dur:1.00,delay:0,vertical:false,mode:"in",lineMode:"all",lineGap:0.08,blur:"soft",reveal:"follow"};save(true);render();toast("Ajustes de Color Sweep restablecidos");}},"↺ Restablecer")));
    sweepPane.appendChild(sweepCard);
    if(sweepKind==="classic")root.appendChild(sweepPane);
    else pageSweepStudio(root);
    root.appendChild(h("h3", {}, "Custom .ffx"));
    var box = h("div", { class: "list" });
    function draw() {
      box.innerHTML = "";
      if (!S.ffx.length) box.appendChild(h("div", { class: "empty" }, "Importa tus propios presets .ffx para tenerlos junto a los de YaguaTool."));
      S.ffx.forEach(function (f, i) {
        box.appendChild(h("div", { class: "it" }, h("span", { class: "nm" }, f.name), h("button", { class: "btn sm pri", onclick: function () { run("applyFFX", { path: f.path }); } }, "Aplicar"),
          h("button", { class: "btn sm danger", onclick: function () { S.ffx.splice(i, 1); save(); draw(); } }, "✕")));
      });
    }
    draw(); root.appendChild(box);
    root.appendChild(h("button", { class: "btn", style: "width:100%", onclick: function () {
      jsx("pickFile", { prompt: "Elige un preset .ffx", filter: "FFX:*.ffx", ext: "ffx" }).then(function (r) {
        if (r.ok && r.data) { S.ffx.push({ path: r.data, name: r.data.split(/[\\/]/).pop().replace(/\.ffx$/i, "") }); save(); draw(); } else toast(r.msg, !r.ok);
      });
    } }, "+ Importar .ffx"));
  }
  function pageExpr(root) {
    presetPage(root, EXPR_PRESETS, "expr", "expr", "removeExpr");
    root.appendChild(h("h3", {}, "Micro-interacciones"));
    var mc = S.motionCfg = S.motionCfg || { pingColor:"#8b7bff", pingSize:100, pingDur:0.8, fps:12 };
    var pingPreview = effectPreview("expr", { id: "ping" }, { dur: mc.pingDur, pingDur: mc.pingDur, pingSize: mc.pingSize, pingColor: mc.pingColor });
    root.appendChild(pingPreview.element);
    var lofiPreview = effectPreview("expr", { id: "lofi", name: "Lo-Fi Steps" }, { dur: 1.1, fps: mc.fps });
    root.appendChild(lofiPreview.element);
    root.appendChild(h("div", { class:"card" },
      h("div",{class:"row"},h("label",{},"Color CTA Ping"),h("input",{type:"color",value:mc.pingColor,oninput:function(e){mc.pingColor=e.target.value;save();pingPreview.refresh();pingPreview.replay();}})),
      control({k:"pingSize",t:"num",label:"Tamaño anillo",min:20,max:500,step:5,def:100,unit:"px"},mc,pingPreview.refresh),
      control({k:"pingDur",t:"num",label:"Duración pulso",min:0.25,max:3,step:0.05,def:0.8,unit:"s"},mc,pingPreview.refresh),
      h("button",{class:"btn pri",style:"width:100%",onclick:function(){run("ctaPing",{color:mc.pingColor,size:mc.pingSize,dur:mc.pingDur});}},"Aplicar CTA Ping")));
    root.appendChild(h("div",{class:"card",style:"margin-top:8px"},
      control({k:"fps",t:"num",label:"FPS de pasos",min:2,max:24,step:1,def:12},mc,function(){lofiPreview.refresh();lofiPreview.replay();}),
      h("button",{class:"btn pri",style:"width:100%",onclick:function(){run("lofiSteps",{fps:mc.fps});}},"Aplicar Lo-Fi Steps")));
    root.appendChild(h("h3", {}, "Custom"));
    var ta = h("textarea", { placeholder: "// Pega aquí tu expresión\nwiggle(2, 30)" });
    var name = h("input", { type: "text", placeholder: "Nombre para guardarla" });
    var list = h("div", { class: "list", style: "margin-top:8px" });
    function draw() {
      list.innerHTML = "";
      S.customExpr.forEach(function (c, i) {
        list.appendChild(h("div", { class: "it" }, h("span", { class: "nm", onclick: function () { ta.value = c.code; }, style: "cursor:pointer" }, c.name),
          h("button", { class: "btn sm pri", onclick: function () { run("expr", { kind: "custom", code: c.code }); } }, "Aplicar"),
          h("button", { class: "btn sm danger", onclick: function () { S.customExpr.splice(i, 1); save(); draw(); } }, "✕")));
      });
    }
    draw();
    root.appendChild(h("div", { class: "card" }, ta, h("div", { class: "row" }, name, h("button", { class: "btn", onclick: function () {
      if (!ta.value.trim()) return toast("Escribe una expresión.", true);
      S.customExpr.push({ name: name.value.trim() || "Expresión " + (S.customExpr.length + 1), code: ta.value }); name.value = ""; save(); draw();
    } }, "Guardar")),
      h("div", { class: "btns" }, h("button", { class: "btn pri", onclick: function () { run("expr", { kind: "custom", code: ta.value }); } }, "Aplicar a propiedades seleccionadas")), list));
  }

  /* ---------- Backgrounds 2.2 · 3 luces radiales editables ---------- */
  function pageBackgrounds(root) {
    var styles = [
      ["minimal", "Pearl Bloom", "Perla luminosa con tres halos difusos de color."],
      ["gradient", "Cobalt Horizon", "Azul profundo con horizontes cian y azul."],
      ["aurora", "Aurora Silk", "Velos de colores orgánicos en movimiento."],
      ["dark", "Nocturne Flux", "Azul noche y reflejos atmosféricos delicados."]
    ];
    var defaults = {
      minimal: {color1:"#4ac5ff",color2:"#9d8bff",accent:"#f5a0da",speed:1,intensity:75},
      gradient: {color1:"#1261f4",color2:"#76ddff",accent:"#545cff",speed:1.15,intensity:78},
      aurora: {color1:"#7454ff",color2:"#22bffe",accent:"#d39dff",speed:1.1,intensity:75},
      dark: {color1:"#1035aa",color2:"#3e90ff",accent:"#15c6ed",speed:0.9,intensity:69}
    };
    var cfg = S.bgCfg = S.bgCfg || {style:"minimal"};
    if (!defaults[cfg.style]) cfg.style = "minimal";
    var def = defaults[cfg.style], updateTimer, busy = false, next = false;
    ["color1","color2","accent","speed","intensity"].forEach(function(k){if(cfg[k]===undefined)cfg[k]=def[k];});
    // Migrar valores heredados que producían Pearl casi blanco.
    if(!S.__bg220){
      if (cfg.style==="minimal" && cfg.intensity<=55)cfg.intensity=75;
      S.__bg220=true;save(true);
    }
    var preview=h("div",{class:"bg-preview bg-style-"+cfg.style},
      h("div",{class:"bg-preview-label"},"YAGUANIMIX / ATMOSPHERES",h("b",{},"Living color.")));
    var status=h("div",{class:"desc",style:"margin:7px 0 3px;min-height:30px;"},
      "Elige tres colores y pulsa Crear. Una vez creado, los cambios se sincronizan con AE.");
    function packet(){return {style:cfg.style,color1:cfg.color1,color2:cfg.color2,accent:cfg.accent,speed:cfg.speed,intensity:cfg.intensity};}
    function paint(){
      preview.className="bg-preview bg-style-"+cfg.style;
      preview.style.setProperty("--bg-a",cfg.color1);
      preview.style.setProperty("--bg-b",cfg.color2);
      preview.style.setProperty("--bg-c",cfg.accent);
      preview.style.setProperty("--bg-int",Math.max(.35,Math.min(1,Number(cfg.intensity)/80)));
      preview.style.setProperty("--bg-duration-a",(8/Math.max(.15,cfg.speed)).toFixed(2)+"s");
      preview.style.setProperty("--bg-duration-b",(11/Math.max(.15,cfg.speed)).toFixed(2)+"s");
      preview.style.setProperty("--bg-duration-c",(9/Math.max(.15,cfg.speed)).toFixed(2)+"s");
    }
    function sendUpdate(){
      if(!hasCEP)return;
      if(busy){next=true;return;}
      busy=true;
      jsx("backgroundUpdate",packet()).then(function(r){
        busy=false;
        if(!r.ok) status.textContent="AE: "+r.msg;
        else if(r.data&&r.data.updated)status.textContent="✓ Colores, movimiento e intensidad actualizados en After Effects.";
        else status.textContent="Pulsa Crear fondo animado para usar esta paleta en AE.";
        if(next){next=false;sendUpdate();}
      });
    }
    function scheduleUpdate(immediate){
      clearTimeout(updateTimer);
      updateTimer=setTimeout(sendUpdate,immediate?0:280);
    }
    function updateDefaults(style){
      cfg.style=style;
      var p=defaults[style],k;
      for(k in p)cfg[k]=p[k];
      save(true);render();
      // Si existe un fondo previo, se cambia inmediatamente al nuevo estilo.
      // Si no hay ninguno, la llamada no crea capas de forma inesperada.
      if(hasCEP)jsx("backgroundUpdate",packet());
    }
    paint();
    root.appendChild(h("h3",{},"Fondos atmosféricos · 2.2"));
    root.appendChild(h("div",{class:"desc"},"Tres luces radiales a pantalla completa. Sin bordes rectos, y los tres colores son editables después de crear el fondo."));
    root.appendChild(preview);
    root.appendChild(h("div",{class:"bg-style-grid"},styles.map(function(s){
      return h("button",{class:"bg-style-btn"+(cfg.style===s[0]?" active":""),onclick:function(){updateDefaults(s[0]);}},h("b",{},s[1]),h("small",{},s[2]));
    })));
    var card=h("div",{class:"card"});
    [["Color principal","color1"],["Color secundario","color2"],["Acento","accent"]].forEach(function(r){
      card.appendChild(h("div",{class:"row"},h("label",{},r[0]),h("input",{
        type:"color",value:cfg[r[1]],
        oninput:function(e){cfg[r[1]]=e.target.value;save();paint();scheduleUpdate(false);},
        onchange:function(e){cfg[r[1]]=e.target.value;save();paint();scheduleUpdate(true);}
      })));
    });
    card.appendChild(control({k:"speed",t:"num",label:"Velocidad orgánica",min:.15,max:2.4,step:.05,def:1,unit:"×"},cfg,function(){paint();scheduleUpdate(false);}));
    card.appendChild(control({k:"intensity",t:"num",label:"Potencia de luz",min:0,max:100,step:1,def:75,unit:"%"},cfg,function(){paint();scheduleUpdate(false);}));
    card.appendChild(h("div",{class:"desc"},"Los colores también pueden modificarse en Efectos → Animix BG - CONTROLES 2.2. Esta vista es una aproximación CSS; el acabado final se calcula en AE."));
    card.appendChild(status);
    card.appendChild(h("div",{class:"btns"},
      h("button",{class:"btn pri",onclick:function(){
        run("background",packet()).then(function(r){if(r.ok)status.textContent="✓ Fondo creado. Los tres colores están vinculados al controlador en AE.";});
      }},"Crear / Reemplazar fondo"),
      h("button",{class:"btn",onclick:function(){
        run("backgroundUpdate",packet()).then(function(r){if(r.ok)status.textContent="✓ Fondo sincronizado con los colores actuales.";});
      }},"Actualizar colores en AE"),
      h("button",{class:"btn danger",onclick:function(){
        run("background",{remove:true}).then(function(r){if(r.ok)status.textContent="Fondo quitado de esta composición.";});
      }},"Quitar fondo"),
      h("button",{class:"btn",onclick:function(){updateDefaults(cfg.style);}},"↺ Restablecer")
    ));
    root.appendChild(card);
  }
  /* ---------- Graph Editor (restored) ---------- */
  function drawCurve(ctx, W, H, g, o) {
    o = o || {};
    var pad = o.pad === undefined ? 22 : o.pad, w = W - pad * 2, ht = H - pad * 2, ymin = -.5, ymax = 1.5;
    function X(x) { return pad + x * w; }
    function Y(y) { return pad + (1 - (y - ymin) / (ymax - ymin)) * ht; }
    ctx.clearRect(0, 0, W, H);
    var cs = getComputedStyle(document.documentElement), line = cs.getPropertyValue("--line").trim() || "#333", acc = cs.getPropertyValue("--acc").trim() || "#8b7bff", mut = cs.getPropertyValue("--mut").trim() || "#888";
    if (!o.mini) {
      ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.beginPath();
      [0, .25, .5, .75, 1].forEach(function (t) { ctx.moveTo(X(t), Y(ymin)); ctx.lineTo(X(t), Y(ymax)); });
      [0, 1].forEach(function (t) { ctx.moveTo(X(0), Y(t)); ctx.lineTo(X(1), Y(t)); });
      ctx.stroke();
    }
    if (g.mode === "speed" && !o.mini) {
      // g.x1,g.y1 = (influencia, velocidad relativa) saliente; g.x2,g.y2 = entrante
      var sY = function (s) { return Y(s / 3 * 2 - .5); };
      ctx.strokeStyle = acc; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(X(0), sY(g.y1)); ctx.bezierCurveTo(X(g.x1), sY(g.y1), X(g.x2), sY(g.y2), X(1), sY(g.y2)); ctx.stroke();
      return { P1: [X(g.x1), sY(g.y1)], P2: [X(g.x2), sY(g.y2)], X: X, Y: Y, sY: sY, pad: pad, w: w, ht: ht, ymin: ymin, ymax: ymax };
    }
    ctx.strokeStyle = acc; ctx.lineWidth = o.mini ? 1.6 : 2.4; ctx.beginPath();
    ctx.moveTo(X(0), Y(0)); ctx.bezierCurveTo(X(g.x1), Y(g.y1), X(g.x2), Y(g.y2), X(1), Y(1)); ctx.stroke();
    if (!o.mini) {
      ctx.strokeStyle = mut; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(g.x1), Y(g.y1)); ctx.moveTo(X(1), Y(1)); ctx.lineTo(X(g.x2), Y(g.y2)); ctx.stroke();
      [[g.x1, g.y1], [g.x2, g.y2]].forEach(function (p) { ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 6, 0, 7); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke(); });
    }
    return { P1: [X(g.x1), Y(g.y1)], P2: [X(g.x2), Y(g.y2)], X: X, Y: Y, pad: pad, w: w, ht: ht, ymin: ymin, ymax: ymax };
  }
  function pageGraph(root) {
    var g = S.graph, W = 300, H = 240, drag = -1, geo;
    var cv = h("canvas", { class: "curve", width: W * 2, height: H * 2, style: "aspect-ratio:" + W + "/" + H });
    var ctx = cv.getContext("2d"); ctx.scale(2, 2);
    var info = h("div", { class: "kv" });
    function redraw() {
      geo = drawCurve(ctx, W, H, g);
      info.innerHTML = g.mode === "speed" ? "Salida: infl " + (g.x1 * 100).toFixed(0) + "% · vel ×" + g.y1.toFixed(2) + " &nbsp; Entrada: infl " + ((1 - g.x2) * 100).toFixed(0) + "% · vel ×" + g.y2.toFixed(2)
        : "cubic-bezier(" + [g.x1, g.y1, g.x2, g.y2].map(function (n) { return n.toFixed(2); }).join(", ") + ")";
    }
    function pos(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; }
    cv.addEventListener("pointerdown", function (e) {
      var p = pos(e), d1 = Math.hypot(p[0] - geo.P1[0], p[1] - geo.P1[1]), d2 = Math.hypot(p[0] - geo.P2[0], p[1] - geo.P2[1]);
      drag = d1 <= d2 ? 0 : 1; cv.setPointerCapture(e.pointerId); move(e);
    });
    function move(e) {
      if (drag < 0) return; var p = pos(e), x = Math.max(0, Math.min(1, (p[0] - geo.pad) / geo.w)), y;
      if (g.mode === "speed") { y = Math.max(0, Math.min(3, ((1 - (p[1] - geo.pad) / geo.ht) * (geo.ymax - geo.ymin) + geo.ymin + .5) / 2 * 3)); }
      else y = (1 - (p[1] - geo.pad) / geo.ht) * (geo.ymax - geo.ymin) + geo.ymin;
      y = Math.max(-.5, Math.min(3, y)); if (g.mode !== "speed") y = Math.max(-.5, Math.min(1.5, y));
      if (drag === 0) { g.x1 = Math.max(.001, x); g.y1 = y; } else { g.x2 = Math.min(.999, x); g.y2 = y; }
      redraw(); save();
    }
    cv.addEventListener("pointermove", move); cv.addEventListener("pointerup", function () { drag = -1; });
    root.appendChild(h("h3", {}, "Editor de curva"));
    root.appendChild(h("div", { class: "row" }, seg2([["value", "Value Graph"], ["speed", "Speed Graph"]], g.mode, function (m) {
      if (m === g.mode) return;
      if (m === "speed") { g.x1 = .33; g.y1 = 0; g.x2 = .67; g.y2 = 0; } else { g.x1 = .42; g.y1 = 0; g.x2 = .58; g.y2 = 1; }
      g.mode = m; redraw(); save();
    })));
    root.appendChild(cv); root.appendChild(info);
    root.appendChild(h("div", { class: "btns" },
      h("button", { class: "btn pri", "data-tip": "Aplica la curva a los keyframes seleccionados", onclick: function () { run("graphApply", g); } }, "Aplicar"),
      h("button", { class: "btn", "data-tip": "Lee la curva de los keyframes seleccionados", onclick: function () {
        jsx("graphRead").then(function (r) { if (!r.ok) return toast(r.msg, true); var d = r.data;
          if (g.mode === "speed") { var a = Math.abs(d.avg) || 1; g.x1 = d.oi / 100; g.y1 = Math.min(3, Math.abs(d.so) / a); g.x2 = 1 - d.ii / 100; g.y2 = Math.min(3, Math.abs(d.si) / a); }
          else { g.x1 = d.x1; g.y1 = d.y1; g.x2 = d.x2; g.y2 = d.y2; }
          redraw(); save(); toast("Curva leída"); });
      } }, "Leer"),
      h("button", { class: "btn", onclick: function () {
        var n = prompt("Nombre del preset:"); if (!n) return; S.graphPresets.push({ n: n, v: [g.x1, g.y1, g.x2, g.y2], m: g.mode }); save(); render();
      } }, "Guardar")));
    redraw();
    function grid(title, items, del) {
      root.appendChild(h("h3", {}, title));
      var el = h("div", { class: "gp" });
      items.forEach(function (it, i) {
        var c = h("canvas", { width: 100, height: 100 }), cx = c.getContext("2d"); drawCurve(cx, 100, 100, { x1: it.v[0], y1: it.v[1], x2: it.v[2], y2: it.v[3], mode: "value" }, { mini: true, pad: 14 });
        var b = h("button", { "data-tip": it.n, onclick: function () { g.mode = it.m || "value"; g.x1 = it.v[0]; g.y1 = it.v[1]; g.x2 = it.v[2]; g.y2 = it.v[3]; redraw(); save(); } }, c, it.n);
        if (del) b.addEventListener("contextmenu", function (e) { e.preventDefault(); S.graphPresets.splice(i, 1); save(); render(); });
        el.appendChild(b);
      });
      root.appendChild(el);
      if (del && items.length) root.appendChild(h("div", { class: "desc", style: "margin-top:6px" }, "Clic derecho sobre un preset propio para borrarlo."));
    }
    if (S.graphPresets.length) grid("Mis presets", S.graphPresets, true);
    grid("Biblioteca", GRAPH_PRESETS.map(function (p) { return { n: p[0], v: p.slice(1) }; }));
  }

  /* ---------- Tools ---------- */
  function pageTools(root) {
    if(window.YaguaToolsPro)window.YaguaToolsPro.render(root,{h:h,run:run,jsx:jsx,S:S,save:save,toast:toast,control:control});
    var cfg = S.toolCfg = S.toolCfg || { solid: "#ffffff", fill: "#ff3366", orb: "#7c5cff", by: "words", deep: true };
    function btn(label, tip, fn) { return h("button", { class: "btn", "data-tip": tip, onclick: fn }, label); }
    root.appendChild(h("h3", {}, "Anchor Point"));
    var an = h("div", { class: "anchor" });
    ANCHORS.forEach(function (a) { an.appendChild(h("button", { "data-tip": "Mover anchor point", onclick: function () { run("anchor", { fx: a[0], fy: a[1] }); } })); });
    root.appendChild(h("div", { class: "card", style: "display:flex;justify-content:center" }, an));
    root.appendChild(h("h3", {}, "Capas"));
    var solidC = h("input", { type: "color", value: cfg.solid, oninput: function (e) { cfg.solid = e.target.value; save(); } });
    root.appendChild(h("div", { class: "tools" },
      btn("Adjustment", "Capa de ajuste", function () { run("newLayer", { kind: "adjustment" }); }),
      btn("Null", "Capa nula", function () { run("newLayer", { kind: "null" }); }),
      btn("Camera", "Cámara", function () { run("newLayer", { kind: "camera" }); }),
      btn("Solid", "Sólido con el color elegido", function () { run("newLayer", { kind: "solid", color: cfg.solid }); }),
      h("div", { class: "btn", style: "display:flex;align-items:center;justify-content:center;gap:6px" }, "Color", solidC),
      btn("Parent Null", "Crea un null y emparenta la selección", function () { run("parentNull"); })));
    root.appendChild(h("h3", {}, "Utilidades"));
    root.appendChild(h("div", { class: "tools" },
      btn("Un-Precomp", "Saca el contenido de la precomp a la comp actual", function () { run("unprecomp"); }),
      btn("Cam + Nulls", "Cámara con nulls de control", function () { run("camNulls"); }),
      btn("Paste Image", "Pega una imagen del portapapeles", pasteBtn),
      btn("Duplicate", "Duplica la comp activa", function () { run("dupComp", { deep: cfg.deep }); }),
      btn("Create Orb", "Orbe preparado con brillo", function () { run("orb", { color: cfg.orb }); }),
      btn("Fill", "Añade Fill a la selección", function () { run("fill", { color: cfg.fill }); })));
    root.appendChild(h("div", { class: "card", style: "margin-top:8px" },
      toggleRow("Duplicar precomps anidadas", "deep", cfg),
      h("div", { class: "row" }, h("label", {}, "Color orb"), h("input", { type: "color", value: cfg.orb, oninput: function (e) { cfg.orb = e.target.value; save(); } })),
      h("div", { class: "row" }, h("label", {}, "Color fill"), h("input", { type: "color", value: cfg.fill, oninput: function (e) { cfg.fill = e.target.value; save(); } }))));
    root.appendChild(h("h3", {}, "Split Text"));
    root.appendChild(h("div", { class: "card" }, h("div", { class: "row" }, seg2([["letters", "Letras"], ["words", "Palabras"], ["lines", "Líneas"]], cfg.by, function (v) { cfg.by = v; save(); })),
      h("div", { class: "desc" }, "Crea una capa por parte conservando la posición exacta (las demás letras se ocultan con un animador)."),
      h("button", { class: "btn pri", style: "width:100%", onclick: function () { run("splitText", { by: cfg.by }); } }, "Dividir texto")));
    root.appendChild(h("h3", {}, "Align a la comp"));
    var al = h("div", { class: "align" });
    ALIGNS.forEach(function (a) { al.appendChild(h("button", { class: "btn", "data-tip": a[2], onclick: function () { run("align", { edge: a[0] }); } }, a[1])); });
    root.appendChild(al);
    // v2.5 · Herramientas de edición directa con Undo agrupado.
    var tc=S.timelineTools250=S.timelineTools250||{frames:4,origin:"playhead",influence:70,prefix:"Motion_",first:1};
    root.appendChild(h("h3",{},"Timeline · edición rápida"));
    var timeCard=h("div",{class:"card v250-card"},
      h("div",{class:"desc"},"Trabaja sobre capas seleccionadas en el timeline. Cada acción se puede deshacer con un único Ctrl+Z / Cmd+Z."));
    timeCard.appendChild(control({k:"frames",t:"num",label:"Escalonar",min:-120,max:120,step:1,def:4,unit:"fr"},tc));
    timeCard.appendChild(h("div",{class:"row"},h("label",{},"Desde"),seg2([["playhead","Cabezal"],["first","1ª capa"]],tc.origin,function(v){tc.origin=v;save();})));
    timeCard.appendChild(h("div",{class:"v250-tool-grid"},
      btn("Escalonar capas","Separa entradas por el número de fotogramas configurado; mantiene animaciones internas",function(){run("toolStagger",{frames:tc.frames,origin:tc.origin});}),
      btn("Alinear inicios","Mueve las capas seleccionadas para comenzar en el cabezal",function(){run("toolAlignIn");}),
      btn("Recortar IN","Recorta el inicio de las capas al cabezal; no borra sus keyframes",function(){run("toolTrim",{side:"in"});}),
      btn("Recortar OUT","Recorta el final de las capas al cabezal; no borra sus keyframes",function(){run("toolTrim",{side:"out"});}),
      btn("Marcador IN","Crea marcador IN sin sobrescribir marcadores en el mismo fotograma",function(){run("toolMarker",{tag:"in"});}),
      btn("Marcador OUT","Crea marcador OUT sin sobrescribir marcadores en el mismo fotograma",function(){run("toolMarker",{tag:"out"});})));
    root.appendChild(timeCard);
    root.appendChild(h("h3",{},"Keyframes · Easy Ease"));
    root.appendChild(h("div",{class:"card v250-card"},
      h("div",{class:"desc"},"Selecciona keyframes en la línea de tiempo. El suavizado solo modifica los fotogramas seleccionados."),
      control({k:"influence",t:"num",label:"Influencia",min:10,max:95,step:5,def:70,unit:"%"},tc),
      h("button",{class:"btn pri",style:"width:100%",onclick:function(){run("toolEaseKeys",{influence:tc.influence});}},"Suavizar keyframes seleccionados")));
    root.appendChild(h("h3",{},"Renombrar capas en lote"));
    root.appendChild(h("div",{class:"card v250-card"},
      control({k:"prefix",t:"txt",label:"Prefijo",def:"Motion_"},tc),
      control({k:"first",t:"num",label:"Desde nº",min:1,max:9999,step:1,def:1},tc),
      h("button",{class:"btn",style:"width:100%",onclick:function(){run("toolRename",{prefix:tc.prefix,first:tc.first});}},"Renombrar selección")));
    root.appendChild(h("h3", {}, "Mis herramientas"));
    var box = h("div", { class: "list" });
    function draw() {
      box.innerHTML = "";
      if (!S.slots.length) box.appendChild(h("div", { class: "empty" }, "Guarda un set de efectos (de la capa seleccionada) o un .ffx como botón de acceso rápido."));
      S.slots.forEach(function (s, i) {
        box.appendChild(h("div", { class: "it" }, h("span", { class: "nm" }, s.name), h("small", {}, s.type),
          h("button", { class: "btn sm pri", onclick: function () { s.type === "ffx" ? run("applyFFX", { path: s.path }) : run("applyEffects", { effects: s.effects }); } }, "Usar"),
          h("button", { class: "btn sm danger", onclick: function () { S.slots.splice(i, 1); save(); draw(); } }, "✕")));
      });
    }
    draw(); root.appendChild(box);
    root.appendChild(h("div", { class: "btns" },
      h("button", { class: "btn", onclick: function () {
        jsx("captureEffects").then(function (r) { if (!r.ok) return toast(r.msg, true); var n = prompt("Nombre de la herramienta:", "Efectos de " + r.data[0].name); if (!n) return; S.slots.push({ name: n, type: "efectos", effects: r.data }); save(); draw(); });
      } }, "+ Desde efectos"),
      h("button", { class: "btn", onclick: function () {
        jsx("pickFile", { prompt: "Elige un preset .ffx", filter: "FFX:*.ffx", ext: "ffx" }).then(function (r) { if (r.ok && r.data) { S.slots.push({ name: r.data.split(/[\\/]/).pop().replace(/\.ffx$/i, ""), type: "ffx", path: r.data }); save(); draw(); } });
      } }, "+ Desde .ffx")));
  }
  function pasteBtn() {
    if (navigator.clipboard && navigator.clipboard.read) {
      navigator.clipboard.read().then(function (items) {
        for (var i = 0; i < items.length; i++) for (var j = 0; j < items[i].types.length; j++) if (/^image\//.test(items[i].types[j])) {
          return items[i].getType(items[i].types[j]).then(importBlob);
        }
        toast("El portapapeles no contiene una imagen.", true);
      }).catch(function () { toast("Pulsa Ctrl/Cmd+V con el panel enfocado para pegar la imagen."); });
    } else toast("Pulsa Ctrl/Cmd+V con el panel enfocado para pegar la imagen.");
  }
  function importBlob(blob) {
    var c = cepFS();
    if (!c) return toast("(demo) imagen recibida " + blob.size + " bytes");
    var fr = new FileReader();
    fr.onload = function () {
      jsx("tempDir").then(function (r) {
        var p = r.data + "/animix_paste_" + Date.now() + ".png", w = c.fs.writeFile(p, dataURLToB64(fr.result), c.encoding.Base64);
        if (w.err) return toast("No se pudo escribir la imagen temporal.", true);
        run("pasteImage", { path: p });
      });
    };
    fr.readAsDataURL(blob);
  }
  document.addEventListener("paste", function (e) {
    var it = e.clipboardData && e.clipboardData.items, i;
    if (!it || /input|textarea/i.test((e.target || {}).tagName || "")) return;
    for (i = 0; i < it.length; i++) if (/^image\//.test(it[i].type)) {
      var b = it[i].getAsFile();
      if (S.settings.page === "saved" && S.savedTab === "refs") addRef(b); else importBlob(b);
      e.preventDefault(); return;
    }
  });

  /* ---------- Saved ---------- */
  var colorSel = [], applyTarget = "fill";
  function palFromImage(file, n) {
    return fileToImage(file, 120, .8).then(function (r) {
      var d = r.canvas.getContext("2d").getImageData(0, 0, r.canvas.width, r.canvas.height).data, bins = {}, i;
      for (i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 128) continue;
        var k = (d[i] >> 4) + "," + (d[i + 1] >> 4) + "," + (d[i + 2] >> 4), b = bins[k] || (bins[k] = { c: 0, r: 0, g: 0, b: 0 });
        b.c++; b.r += d[i]; b.g += d[i + 1]; b.b += d[i + 2];
      }
      var arr = Object.keys(bins).map(function (k) { var b = bins[k]; return { c: b.c, r: b.r / b.c, g: b.g / b.c, b: b.b / b.c }; }).sort(function (a, b) { return b.c - a.c; });
      var out = [];
      arr.forEach(function (x) {
        if (out.length >= n) return;
        if (out.every(function (o) { return Math.hypot(o.r - x.r, o.g - x.g, o.b - x.b) > 48; })) out.push(x);
      });
      return out.map(function (x) { return rgb2hex(x.r, x.g, x.b); });
    });
  }
  function harmony(hex, kind) {
    var rgb = hex2rgb(hex), hs = rgb2hsl(rgb[0], rgb[1], rgb[2]), H = hs[0], s = hs[1], l = hs[2];
    var off = { comp: [0, 180], analog: [-30, 0, 30], triad: [0, 120, 240], split: [0, 150, 210], tetra: [0, 90, 180, 270] }[kind];
    return off.map(function (o) { return hsl2hex(H + o, s, l); });
  }
  function pageSaved(root) {
    var tab = S.savedTab = S.savedTab || "colors";
    root.appendChild(h("div", { class: "row" }, seg2([["colors", "Colors"], ["refs", "Refs"], ["comps", "Comps"], ["fonts", "Fonts"]], tab, function (v) { S.savedTab = v; save(); render(); })));
    var body = h("div"); root.appendChild(body);
    ({ colors: savedColors, refs: savedRefs, comps: savedComps, fonts: savedFonts })[tab](body);
  }
  function swatch(hex, onclick, extra) {
    return h("div", { class: "sw" + (colorSel.indexOf(hex) >= 0 ? " sel" : ""), style: "background:" + hex, "data-tip": hex + " — clic: aplicar · Alt: copiar · Shift: seleccionar para Match", onclick: function (e) {
      if (e.altKey) return copyText(hex);
      if (e.shiftKey) { var i = colorSel.indexOf(hex); if (i >= 0) colorSel.splice(i, 1); else colorSel = colorSel.concat(hex).slice(-2); return render(); }
      run("applyColor", { hex: hex, target: applyTarget });
    }, oncontextmenu: function (e) { e.preventDefault(); copyText(hex); } }, extra);
  }
  function savedColors(root) {
    var picker = h("input", { type: "color", value: "#8b7bff" });
    root.appendChild(h("div", { class: "row" }, h("label", {}, "Aplicar en"), seg2([["fill", "Fill"], ["stroke", "Stroke"]], applyTarget, function (v) { applyTarget = v; })));
    root.appendChild(h("div", { class: "row" }, picker,
      h("button", { class: "btn sm", onclick: function () { addColor(picker.value); } }, "+ Añadir"),
      h("button", { class: "btn sm", "data-tip": "Lee el color de la capa seleccionada", onclick: function () { jsx("readColor").then(function (r) { r.ok ? addColor(r.data) : toast(r.msg, true); }); } }, "Desde capa"),
      h("button", { class: "btn sm", onclick: function () { S.palettes.push({ name: "Paleta " + (S.palettes.length + 1), colors: [] }); save(); render(); } }, "+ Paleta")));
    function addColor(hex) { if (!S.palettes.length) S.palettes.push({ name: "Mi paleta", colors: [] }); var p = S.palettes[0]; if (p.colors.indexOf(hex) < 0) p.colors.push(hex); save(); render(); }
    S.palettes.forEach(function (p, pi) {
      var sw = h("div", { class: "swatches" }, p.colors.map(function (c, ci) {
        var s = swatch(c); s.addEventListener("dblclick", function () { p.colors.splice(ci, 1); save(); render(); }); return s;
      }));
      root.appendChild(h("div", { class: "pal card" }, h("div", { class: "hd" }, h("input", { type: "text", value: p.name, onchange: function (e) { p.name = e.target.value; save(); } }),
        h("span", {}, h("button", { class: "btn sm", "data-tip": "Copiar todos los HEX", onclick: function () { copyText(p.colors.join(" ")); } }, "Copiar"), " ",
          h("button", { class: "btn sm danger", onclick: function () { S.palettes.splice(pi, 1); save(); render(); } }, "✕"))), p.colors.length ? sw : h("div", { class: "desc" }, "Vacía"),
        p.colors.length ? h("div", { class: "desc", style: "margin:6px 0 0" }, "Doble clic en un color para borrarlo.") : null));
    });
    root.appendChild(h("h3", {}, "Match (contraste)"));
    var m = h("div", { class: "card" });
    if (colorSel.length === 2) {
      var c = contrast(colorSel[0], colorSel[1]);
      m.appendChild(h("div", { style: "display:flex;gap:8px;align-items:center" }, h("div", { style: "flex:1;height:54px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;background:" + colorSel[0] + ";color:" + colorSel[1] }, "Aa Texto"),
        h("div", { style: "flex:1;height:54px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;background:" + colorSel[1] + ";color:" + colorSel[0] }, "Aa Texto")));
      m.appendChild(h("div", { class: "kv", style: "margin-top:8px" }, h("span", {}, "Contraste"), h("b", {}, c.toFixed(2) + ":1")));
      m.appendChild(h("div", { class: "kv" }, h("span", {}, "AA texto normal"), h("b", { style: "color:" + (c >= 4.5 ? "var(--ok)" : "var(--err)") }, c >= 4.5 ? "Sí" : "No")));
      m.appendChild(h("div", { class: "kv" }, h("span", {}, "AAA texto normal"), h("b", { style: "color:" + (c >= 7 ? "var(--ok)" : "var(--err)") }, c >= 7 ? "Sí" : "No")));
    } else m.appendChild(h("div", { class: "desc" }, "Mantén Shift y haz clic en dos colores para compararlos."));
    root.appendChild(m);
    root.appendChild(h("h3", {}, "Generar paleta"));
    var base = colorSel[0] || picker.value;
    var gen = h("div", { class: "card" });
    var harm = [["comp", "Complementaria"], ["analog", "Análoga"], ["triad", "Triádica"], ["split", "Split"], ["tetra", "Tetrádica"]];
    gen.appendChild(h("div", { class: "desc" }, "Armonías desde el primer color seleccionado (Shift+clic) o el del selector."));
    gen.appendChild(h("div", { class: "grid2" }, harm.map(function (x) { return h("button", { class: "btn sm", onclick: function () { S.palettes.push({ name: x[1], colors: harmony(base, x[0]) }); save(); render(); } }, x[1]); })));
    var f = h("input", { type: "file", accept: "image/*", style: "display:none", onchange: function () {
      if (!f.files[0]) return; palFromImage(f.files[0], 6).then(function (cols) { S.palettes.push({ name: "Desde imagen", colors: cols }); save(); render(); toast("Paleta creada"); });
    } });
    gen.appendChild(h("div", { class: "btns" }, h("button", { class: "btn pri", onclick: function () { f.click(); } }, "Desde imagen…"), f));
    root.appendChild(gen);
  }
  function addRef(file) {
    fileToImage(file, 900, .75).then(function (r) {
      S.refs.push({ id: Date.now(), url: r.url, name: file.name || "Captura", folder: S.refFolder || S.refFolders[0] }); save(true); render();
    }).catch(function () { toast("No se pudo leer la imagen.", true); });
  }
  function savedRefs(root) {
    var cur = S.refFolder = S.refFolder && S.refFolders.indexOf(S.refFolder) >= 0 ? S.refFolder : S.refFolders[0];
    root.appendChild(h("div", { class: "row" }, h("select", { onchange: function (e) { S.refFolder = e.target.value; save(); render(); } }, S.refFolders.map(function (f) { return h("option", { value: f, selected: f === cur }, f); })),
      h("button", { class: "btn sm", onclick: function () { var n = prompt("Nombre de la carpeta:"); if (n && S.refFolders.indexOf(n) < 0) { S.refFolders.push(n); S.refFolder = n; save(); render(); } } }, "+ Carpeta"),
      S.refFolders.length > 1 ? h("button", { class: "btn sm danger", onclick: function () { if (!confirm("¿Borrar la carpeta y sus referencias?")) return; S.refs = S.refs.filter(function (r) { return r.folder !== cur; }); S.refFolders.splice(S.refFolders.indexOf(cur), 1); S.refFolder = null; save(); render(); } }, "✕") : null));
    var f = h("input", { type: "file", accept: "image/*", multiple: true, style: "display:none", onchange: function () { Array.prototype.forEach.call(f.files, addRef); } });
    var drop = h("div", { class: "empty", style: "margin-bottom:8px;cursor:pointer", onclick: function () { f.click(); } }, "Arrastra imágenes aquí, pega con Ctrl/Cmd+V o haz clic para elegir", f);
    drop.addEventListener("dragover", function (e) { e.preventDefault(); });
    drop.addEventListener("drop", function (e) { e.preventDefault(); Array.prototype.forEach.call(e.dataTransfer.files, function (x) { if (/^image\//.test(x.type)) addRef(x); }); });
    root.appendChild(drop);
    var g = h("div", { class: "grid2" });
    S.refs.filter(function (r) { return r.folder === cur; }).forEach(function (r) {
      g.appendChild(h("div", { class: "thumb", style: "background-image:url(" + r.url + ")", onclick: function () { var v = document.getElementById("viewer"); v.innerHTML = ""; v.appendChild(h("img", { src: r.url })); v.hidden = false; } },
        h("button", { class: "x", onclick: function (e) { e.stopPropagation(); S.refs = S.refs.filter(function (z) { return z !== r; }); save(true); render(); } }, "✕")));
    });
    root.appendChild(g);
  }
  function savedComps(root) {
    root.appendChild(h("div", { class: "btns", style: "margin-top:0" },
      h("button", { class: "btn pri", onclick: function () {
        jsx("compInfo").then(function (r) {
          if (!r.ok) return toast(r.msg, true); var d = r.data, c = cepFS();
          if (d.preview && c) { var rd = c.fs.readFile(d.preview, c.encoding.Base64); if (!rd.err) d.thumb = "data:image/png;base64," + rd.data; }
          delete d.preview; S.comps.push(d); save(true); render();
        });
      } }, "Guardar comp activa"),
      h("button", { class: "btn", onclick: function () { jsx("pickFile", { prompt: "Elige un proyecto .aep", filter: "AEP:*.aep;*.aepx", ext: "aep|aepx" }).then(function (r) { if (r.ok && r.data) run("importAep", { path: r.data }); }); } }, "Importar .aep")));
    if (!S.comps.length) return root.appendChild(h("div", { class: "empty", style: "margin-top:10px" }, "Guarda composiciones útiles para recuperarlas rápido. Si abres otro proyecto, usa «Importar .aep» con el proyecto original."));
    var list = h("div", { class: "list", style: "margin-top:10px" });
    S.comps.forEach(function (c, i) {
      list.appendChild(h("div", { class: "it", style: "align-items:stretch" },
        h("div", { style: "width:72px;min-height:48px;border-radius:6px;background:var(--panel2) center/cover;flex:none;background-image:" + (c.thumb ? "url(" + c.thumb + ")" : "none") }),
        h("div", { style: "flex:1;min-width:0;display:flex;flex-direction:column;gap:4px" },
          h("div", { class: "nm", style: "font-weight:600" }, c.name), h("small", {}, c.w + "×" + c.h + " · " + Math.round(c.fps * 100) / 100 + " fps · " + c.dur.toFixed(1) + " s"),
          h("div", { style: "display:flex;gap:4px;flex-wrap:wrap" },
            h("button", { class: "btn sm", onclick: function () { run("compOpen", { id: c.id }); } }, "Abrir"),
            h("button", { class: "btn sm pri", onclick: function () { run("compAdd", { id: c.id }); } }, "Duplicar"),
            h("button", { class: "btn sm danger", onclick: function () { S.comps.splice(i, 1); save(true); render(); } }, "✕")))));
    });
    root.appendChild(list);
  }
  var allFonts = null;
  function savedFonts(root) {
    var txt = h("input", { type: "text", value: S.fontText, placeholder: "Texto de prueba", oninput: function (e) { S.fontText = e.target.value; save(); Array.prototype.forEach.call(document.querySelectorAll(".fprev"), function (n) { n.textContent = S.fontText || "Aa"; }); } });
    root.appendChild(h("div", { class: "row" }, txt));
    var list = h("div", { class: "list" });
    function row(f, saved) {
      return h("div", { class: "it", style: "flex-direction:column;align-items:stretch;gap:3px" },
        h("div", { style: "display:flex;gap:6px;align-items:center" }, h("small", { class: "nm" }, f.fam + " — " + f.sty),
          h("button", { class: "btn sm", onclick: function () { run("applyFont", { ps: f.ps }); } }, "Aplicar"),
          h("button", { class: "btn sm " + (saved ? "danger" : ""), onclick: function () {
            if (saved) S.fonts = S.fonts.filter(function (x) { return x.ps !== f.ps; }); else if (!S.fonts.some(function (x) { return x.ps === f.ps; })) S.fonts.push(f); save(); render();
          } }, saved ? "✕" : "★")),
        h("div", { class: "big fprev", style: "font-family:'" + f.fam + "';white-space:nowrap;overflow:hidden;text-overflow:ellipsis" }, S.fontText || "Aa"));
    }
    root.appendChild(h("h3", {}, "Mi lista (" + S.fonts.length + ")"));
    if (!S.fonts.length) list.appendChild(h("div", { class: "empty" }, "Busca fuentes del sistema y márcalas con ★."));
    S.fonts.forEach(function (f) { list.appendChild(row(f, true)); });
    root.appendChild(list);
    root.appendChild(h("h3", {}, "Fuentes del sistema"));
    var q = h("input", { type: "text", placeholder: "Buscar…" }), res = h("div", { class: "list" });
    function show() {
      res.innerHTML = ""; if (!allFonts) return;
      var s = q.value.toLowerCase(), n = 0;
      for (var i = 0; i < allFonts.length && n < 40; i++) if ((allFonts[i].fam + " " + allFonts[i].sty).toLowerCase().indexOf(s) >= 0) { res.appendChild(row(allFonts[i], false)); n++; }
      if (!n) res.appendChild(h("div", { class: "empty" }, "Sin resultados"));
    }
    q.addEventListener("input", show);
    root.appendChild(h("div", { class: "row" }, q, h("button", { class: "btn sm", onclick: function () {
      jsx("fontsList").then(function (r) { if (!r.ok) return toast(r.msg, true); allFonts = r.data; show(); toast(r.msg); });
    } }, allFonts ? "Recargar" : "Cargar")));
    root.appendChild(res); show();
  }

  /* ---------- Grid ---------- */
  function pageGrid(root) {
    var cfg = S.gridCfg = S.gridCfg || { opacity: 45 };
    root.appendChild(h("h3", {}, "Overlays de redes sociales"));
    root.appendChild(h("div", { class: "desc" }, "Añade una capa guía (no se renderiza) con las zonas que cubre la interfaz de cada app. Las medidas son aproximadas sobre 1080×1920 y se escalan a tu comp."));
    root.appendChild(h("div", { class: "card" }, control({ k: "opacity", t: "num", label: "Opacidad", min: 5, max: 100, step: 1, def: 45, unit: "%" }, cfg)));
    [["tiktok", "TikTok"], ["instagram", "Instagram Reels"], ["youtube", "YouTube Shorts"]].forEach(function (p) {
      root.appendChild(h("div", { class: "it card grid-overlay-row", style: "display:flex;align-items:center;gap:8px;padding:8px 10px" }, h("span", { class: "nm", style: "flex:1;font-weight:600" }, p[1]),
        h("button", { class: "btn sm pri", onclick: function () { run("grid", { platform: p[0], opacity: cfg.opacity }); } }, "Mostrar"),
        h("button", { class: "btn sm danger", onclick: function () { run("grid", { platform: p[0], remove: true }); } }, "Quitar")));
    });
  }


  /* ---------- Biblioteca de proyectos .aep ---------- */
  var libSelection = {pack: "text24", choice: "", search: "", busy: false, fit: false};
  function yagExtensionRoot() {
    var p = "";
    try { if (window.__adobe_cep__ && window.__adobe_cep__.getSystemPath)
      p = window.__adobe_cep__.getSystemPath("extension") || "";
    } catch (e) { }
    if (!p) {
      try { p = decodeURI(window.location.pathname.replace(/\/index\.html.*$/i, "")); }
      catch (e2) { p = ""; }
    }
    if (/^\/[A-Za-z]:/.test(p)) p = p.slice(1);
    return p.replace(/[\\/]$/, "");
  }
  function pageAepLibrary(root) {
    var packs = typeof YAG_AEP_PACKS !== "undefined" ? YAG_AEP_PACKS : [];
    root.appendChild(h("h3", {}, "Biblioteca de animaciones originales"));
    root.appendChild(h("div", {class:"desc"},
      "51 composiciones reales de tus tres proyectos .aep. Vista previa = composición original en After Effects. " +
      "Aplicar = copia independiente en tu timeline. Los presets nativos siguen en Texto."));
    if (!packs.length) {root.appendChild(h("div",{class:"empty"},"No se ha cargado el catálogo AEP. Reinstala la extensión completa."));return;}
    var bar=h("div",{class:"lib-pack-bar"}),info=h("div",{class:"card lib-status"}),list=h("div",{class:"lib-list"}),detail=h("div",{class:"card lib-actions"});
    var pack=packs.filter(function(p){return p.id===libSelection.pack;})[0]||packs[0];
    var pick=pack.items.filter(function(c){return c.name===libSelection.choice;})[0]||pack.items[0];
    libSelection.choice=pick.name;
    function send(method,args) {
      if (libSelection.busy) return Promise.resolve({ok:false,msg:"Operación en curso"});
      libSelection.busy=true;
      args=args||{};args.root=yagExtensionRoot();args.pack=pack.id;args.name=libSelection.choice;
      return jsx(method,args).then(function(r){
        libSelection.busy=false;toast(r.msg,!r.ok);
        if(method==="aepLibraryImport"&&r.ok)status();
        return r;
      });
    }
    function status() {
      jsx("aepLibraryStatus",{root:yagExtensionRoot(),pack:pack.id}).then(function(r){
        info.innerHTML="";
        info.appendChild(h("b",{},pack.name));
        info.appendChild(h("div",{class:"desc"},pack.description));
        info.appendChild(h("div",{class:"desc"},r.ok && r.data ? (r.data.loaded ? "✓ Ya importado en el proyecto · "+r.data.comps+" composiciones" : "Listo · se importará solo al utilizar el primer preset") : r.msg));
      });
    }
    packs.forEach(function(p){
      bar.appendChild(h("button",{class:"btn sm"+(p.id===pack.id?" pri":""),onclick:function(){
        libSelection.pack=p.id;libSelection.choice="";libSelection.search="";render();
      }},p.name));
    });
    root.appendChild(bar);root.appendChild(info);
    var input=h("input",{type:"search",placeholder:"Buscar animación…",value:libSelection.search,
      oninput:function(e){libSelection.search=e.target.value;draw();}});
    root.appendChild(h("div",{class:"row"},input));
    function draw(){
      list.innerHTML=""; var query=libSelection.search.toLowerCase(),total=0,grp="";
      pack.items.forEach(function(c){
        if(query && (c.name+" "+c.group).toLowerCase().indexOf(query)<0)return;
        if(grp!==c.group){grp=c.group;list.appendChild(h("div",{class:"lib-group"},grp));}
        total++;
        list.appendChild(h("button",{class:"lib-preset"+(c.name===libSelection.choice?" on":""),onclick:function(){libSelection.choice=c.name;draw();}},
          h("span",{class:"lib-preset-name"},c.name),h("span",{class:"lib-preset-arrow"},"›")));
      });
      if(!total)list.appendChild(h("div",{class:"empty"},"No hay coincidencias."));
      detail.innerHTML="";
      var active=pack.items.filter(function(c){return c.name===libSelection.choice;})[0]||pack.items[0];
      detail.appendChild(h("b",{},active.name));
      detail.appendChild(h("div",{class:"desc"},active.group+" · Composición original con keyframes, controles y expresiones."));
      detail.appendChild(h("div",{class:"row"},
        h("label",{style:"flex:1"},"Encajar tamaño en la comp"),
        h("button",{class:"tog"+(libSelection.fit?" on":""),onclick:function(){libSelection.fit=!libSelection.fit;draw();}})));
      detail.appendChild(h("div",{class:"btns"},
        h("button",{class:"btn sm",onclick:function(){send("aepLibraryOpen");}},"▶ Ver original en AE"),
        h("button",{class:"btn sm pri",onclick:function(){send("aepLibraryApply",{open:true,fit:libSelection.fit});}},"+ Aplicar en composición")));
      detail.appendChild(h("div",{class:"desc"},"Para aplicar, abre antes tu composición de destino. Se insertará una precomp editable con sus dependencias aisladas."));
    }
    root.appendChild(list);root.appendChild(detail);
    root.appendChild(h("div",{class:"card",style:"margin-top:10px"},
      h("div",{class:"desc"},"Importación bajo demanda: el pack completo entra una sola vez por proyecto, por limitaciones de ExtendScript. Las instancias se duplican y sus fuentes originales permanecen intactas."),
      h("button",{class:"btn sm",onclick:function(){send("aepLibraryImport");}},"Importar este pack ahora")));
    draw();status();
  }

  /* ---------- Settings ---------- */
  function pageSettings(root) {
    var st = S.settings;
    root.appendChild(h("h3", {}, "Interfaz"));
    root.appendChild(h("div", { class: "card" },
      h("div", { class: "row" }, h("label", {}, "Tema"), seg2([["dark", "Oscuro"], ["midnight", "Midnight"], ["light", "Claro"]], st.theme, function (v) { st.theme = v; save(); applyTheme(); })),
      h("div", { class: "row" }, h("label", {}, "Acento"), h("input", { type: "color", value: st.accent, oninput: function (e) { st.accent = e.target.value; save(); applyTheme(); } })),
      toggleRow("Tooltips", "tips", st, applyTheme),
      h("div",{class:"row"},h("label",{},"Movimiento"),h("select",{"aria-label":"Movimiento de la interfaz",onchange:function(e){st.uiMotion=e.target.value;save();applyTheme();render();}},[["system","Seguir sistema"],["full","Animado"],["reduced","Reducido"]].map(function(o){return h("option",{value:o[0],selected:(st.uiMotion||"system")===o[0]},o[1]);})))));
    root.appendChild(h("h3", {}, "Animación"));
    root.appendChild(h("div", { class: "card" },
      h("div", { class: "row" }, h("label", {}, "Empezar en"), seg2([["layer", "Inicio de capa"], ["cti", "Indicador de tiempo"]], st.startAt, function (v) { st.startAt = v; save(); })),
      control({ k: "ease", t: "num", label: "Easing", min: 1, max: 100, step: 1, def: 55, unit: "%" }, st),
      h("div", { class: "desc" }, "«Inicio de capa»: In al principio de la capa y Out terminando en su punto de salida. «Indicador»: usa la posición actual del CTI.")));
    root.appendChild(h("h3", {}, "Datos"));
    var imp = h("div", { class: "btns", style: "margin-top:0" },
      h("button", { class: "btn", onclick: function () {
        var data = JSON.stringify(S);
        if (hasCEP) jsx("saveText", { content: data }).then(function (r) { toast(r.msg, !r.ok); });
        else { var a = h("a", { href: "data:application/json;charset=utf-8," + encodeURIComponent(data), download: "animix-backup.json" }); a.click(); }
      } }, "Exportar copia"),
      h("button", { class: "btn", onclick: function () {
        function apply(s) { try { var o = JSON.parse(s), k; for (k in o) S[k] = o[k]; save(true); applyTheme(); render(); toast("Copia importada"); } catch (e) { toast("Archivo no válido.", true); } }
        if (hasCEP) jsx("openText").then(function (r) { if (r.ok && r.data) apply(r.data); }); else toast("Disponible dentro de After Effects.");
      } }, "Importar copia"),
      h("button", { class: "btn danger", onclick: function () { if (confirm("¿Borrar todos los datos de YaguaTool (paletas, refs, presets)?")) { try { localStorage.removeItem(KEY); } catch (e) { } location.reload(); } } }, "Restablecer"));
    root.appendChild(h("div", { class: "card" }, imp,
      h("div", { class: "kv", style: "margin-top:8px" }, h("span", {}, "Referencias"), h("span", {}, S.refs.length)),
      h("div", { class: "kv" }, h("span", {}, "Paletas"), h("span", {}, S.palettes.length)),
      h("div", { class: "kv" }, h("span", {}, "Comps guardadas"), h("span", {}, S.comps.length))));
    root.appendChild(h("div", { class: "desc", style: "text-align:center;margin-top:10px" }, "YaguaTool 3.0.0 · " + (hasCEP ? "conectado a After Effects" : "modo demo (fuera de After Effects)")));
  }

  /* ---------- shell ---------- */
  var ICONS = {
    text: '<path d="M5 6h14M12 6v13M9 19h6"/>',
    library: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h8M8 13h8"/>',
    motion: '<path d="M3 17c3-9 6-9 9 0s6 9 9 0"/>',
    graph: '<path d="M4 20V4M4 20h16M7 16c4 0 5-8 10-8"/>',
    complex: '<path d="M4 6h16M4 12c4-8 8 8 16 0M4 18h16"/>',
    carrousel: '<rect x="7" y="5" width="10" height="14" rx="2"/><path d="M3 8v8M21 8v8"/>',
    tools: '<path d="M14 6l4 4-8 8H6v-4zM13 7l4 4"/>',
    saved: '<path d="M7 4h10v16l-5-4-5 4z"/>',
    backgrounds: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 14c4-5 7 5 11 0s5-3 7-1"/>',
    grid: '<path d="M4 4h16v16H4zM4 9.3h16M4 14.7h16M9.3 4v16M14.7 4v16"/>',
    dynamicgrid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M10 3v18M16 3v18M3 10h18M3 16h18"/><circle cx="10" cy="10" r="2"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>'
  };
  function pageDynamicGrid(root) {
    if (!window.YaguanimixDynamicGrid) {root.textContent="No se pudo iniciar Dynamic Grid.";return;}
    window.YaguanimixDynamicGrid.render(root,{h:h,run:run,jsx:jsx,save:save,S:S,toast:toast});
  }
  function pageComplex(root){window.YaguaComplex.render(root,{h:h,run:run,jsx:jsx,S:S,save:save,toast:toast,hasCEP:hasCEP});}
  function pageCarrousel(root){window.YaguaCarrousel.render(root,{h:h,run:run,jsx:jsx,S:S,save:save,toast:toast,hasCEP:hasCEP});}
  var PAGES = [["text", "Texto", pageText],["complex","Complex text animation",pageComplex],["carrousel","Carrousel",pageCarrousel], ["library", "Biblioteca", pageAepLibrary], ["motion", "Movimiento", pageExpr], ["backgrounds", "Fondos", pageBackgrounds], ["graph", "Curvas", pageGraph], ["tools", "Herramientas", pageTools], ["saved", "Guardado", pageSaved], ["grid", "Retícula", pageGrid], ["dynamicgrid", "Grid Pro", pageDynamicGrid], ["settings", "Ajustes", pageSettings]];
  var sectionCopy={
    complex:["Complex text animation.","Efecto fluido · proyecto original de After Effects."],
    carrousel:["Carrousel.","Organiza imágenes y composiciones sobre una trayectoria viva."],
    text:["Texto en movimiento.","Encuentra el gesto perfecto para tus palabras."],
    library:["Tu biblioteca creativa.","Explora composiciones y encuentra tu próximo punto de partida."],
    motion:["Ideas que se mueven.","Da carácter a cada propiedad con expresiones y movimiento."],
    backgrounds:["Atmósferas con carácter.","Color, profundidad y movimiento para el fondo de tu historia."],
    graph:["El ritmo está en la curva.","Afina la velocidad. Siente la diferencia."],
    tools:["Menos pasos. Más ideas.","Pequeñas herramientas para un flujo de trabajo más ligero."],
    saved:["Lo tuyo, a mano.","Tus referencias y recursos, listos para volver a crear."],
    grid:["Todo encuentra su lugar.","Alinea y organiza con intención."],
    dynamicgrid:["Diseña el espacio.","Construye composiciones conectadas y afina cada relación."],
    settings:["Hazlo tuyo.","Un espacio de trabajo que se adapta a tu manera de crear."]
  };
  var lastSection=null,navIndicator=null;
  function arrangeText(root){
    var preview=root.querySelector(".preview-card"),phase=root.querySelector(".phase-card"),unit=root.querySelector(".text-unit-card");
    if(!preview||!phase)return;
    var params=preview.nextElementSibling,actions=params.nextElementSibling,foot=root.querySelector(".phase-footnote"),
      workbench=h("div",{class:"text-workbench"}),canvas=h("div",{class:"workbench-canvas"}),inspector=h("div",{class:"workbench-inspector"});
    root.insertBefore(workbench,phase);canvas.appendChild(preview);
    inspector.appendChild(phase);if(unit)inspector.appendChild(unit);
    if(params){params.classList.add("parameter-card");params.insertBefore(h("div",{class:"inspector-heading"},h("b",{},"Ajusta el movimiento"),h("small",{},sel.text)),params.firstChild);inspector.appendChild(params);}
    if(actions){actions.classList.add("apply-actions");inspector.appendChild(actions);}
    if(foot)inspector.appendChild(foot);
    workbench.appendChild(canvas);workbench.appendChild(inspector);
    var first=root.querySelector("h3");if(first&&first.textContent==="Presets de texto")first.remove();
    var families=root.querySelector(".preset-families"),extras=h("section",{class:"extras-panel"}),body=h("div",{class:"extras-body"});
    extras.appendChild(h("h3",{},"Zoom y barridos de color"));
    var cursor=families?families.nextElementSibling:null;
    while(cursor){var next=cursor.nextElementSibling;if(!cursor.classList.contains("search-empty"))body.appendChild(cursor);cursor=next;}
    extras.appendChild(body);root.appendChild(extras);
  }
  function render() {
    if(window.YaguaMotionLab)window.YaguaMotionLab.disposeAll();
    if(window.YaguaCarrousel)window.YaguaCarrousel.stop();
    if(window.YaguaComplex)window.YaguaComplex.stop();
    if(typeof YaguTextPreview!=="undefined")YaguTextPreview.stop();
    var page=document.getElementById("page"),top=page.scrollTop,cur=S.settings.page,changed=lastSection!==cur;
    var previousHeight=changed?0:page.scrollHeight,previousNavTop=document.getElementById("tabs").scrollTop;
    page.innerHTML="";page.setAttribute("data-section",cur);
    var selected=(PAGES.filter(function(p){return p[0]===cur;})[0]||PAGES[0]),copy=sectionCopy[cur]||sectionCopy.text,
      content=h("div",{class:"page-content"}),lead=h("header",{class:"section-lead"},
        h("div",{class:"section-eyebrow"},"YAGUATOOL",h("span",{},selected[1])),
        h("h1",{},copy[0]),h("p",{},copy[1]));
    page.appendChild(content);content.appendChild(lead);
    var body=h("div",{class:"section-body"});content.appendChild(body);selected[2](body);
    if(cur==="text")arrangeText(body);
    if(!changed&&previousHeight>page.clientHeight)content.style.minHeight=Math.max(0,previousHeight-parseFloat(getComputedStyle(page).paddingTop)-parseFloat(getComputedStyle(page).paddingBottom))+"px";
    page.scrollTop=changed?0:top;
    var tabs=document.getElementById("tabs"),shade=document.getElementById("nav-shade"),isOpen=!!S.settings.sidebarOpen26;
    if(!navIndicator){navIndicator=h("div",{class:"nav-selection","aria-hidden":"true"});tabs.appendChild(navIndicator);}
    var previous=tabs.querySelector(".nav-list");if(previous)previous.remove();
    var list=h("div",{class:"nav-list"});tabs.appendChild(list);
    document.getElementById("workspace").classList.toggle("nav-expanded",isOpen);
    tabs.className=isOpen?"is-open":"";tabs.setAttribute("aria-expanded",isOpen?"true":"false");shade.hidden=!isOpen;
    list.appendChild(h("button",{class:"nav-toggle","aria-label":isOpen?"Contraer menú lateral":"Expandir menú lateral",title:"Secciones","aria-expanded":isOpen?"true":"false",onclick:function(){S.settings.sidebarOpen26=!S.settings.sidebarOpen26;save();render();}},
      h("span",{class:"nav-icon",html:'<svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM10 5v14"/></svg>'}),h("span",{class:"nav-label"},"Tu espacio")));
    PAGES.forEach(function(p){
      list.appendChild(h("button",{class:"nav-item"+(p[0]===cur?" on":""),title:p[1],"aria-label":p[1],"aria-current":p[0]===cur?"page":null,
        onclick:function(e){
          if(S.settings.page!==p[0])S.settings.page=p[0];
          if(window.innerWidth<900)S.settings.sidebarOpen26=false;
          save();render();if(e.detail===0){var active=tabs.querySelector(".nav-item.on");if(active)active.focus();}
        }},h("span",{class:"nav-icon",html:'<svg viewBox="0 0 24 24">'+ICONS[p[0]]+'</svg>'}),h("span",{class:"nav-label"},p[1])));
    });
    var active=tabs.querySelector(".nav-item.on");if(active){navIndicator.style.transform="translateY("+(active.offsetTop+list.offsetTop)+"px)";navIndicator.style.height=active.offsetHeight+"px";}
    tabs.scrollTop=previousNavTop;
    if(!changed){page.style.scrollBehavior="auto";page.scrollTop=top;requestAnimationFrame(function(){if(S.settings.page===cur)page.scrollTop=top;});}
    if(changed&&typeof YaguStudioMotion!=="undefined")YaguStudioMotion.enter(content,true);
    lastSection=cur;
  }
  function applyTheme() {
    var r = document.documentElement, st = S.settings;
    r.setAttribute("data-theme", st.theme); r.style.setProperty("--acc", st.accent);
    var c = hex2rgb(st.accent); r.style.setProperty("--acc-ink", lum(st.accent) > .179 ? "#111" : "#fff");
    r.style.setProperty("--acc-soft","rgba("+c.join(",")+",.11)");r.style.setProperty("--acc-ring","rgba("+c.join(",")+",.28)");
    r.style.setProperty("--selection","rgba("+c.join(",")+",.10)");
    r.style.setProperty("--acc-text",st.theme!=="light"&&st.accent==="#0066cc"?"#69b1ff":st.accent);
    document.body.classList.toggle("tips", !!st.tips);
    var systemReduced=!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    r.setAttribute("data-motion",st.uiMotion==="reduced"||(st.uiMotion!=="full"&&systemReduced)?"reduced":"full");
    var toggle=document.getElementById("theme-toggle");if(toggle){toggle.setAttribute("aria-label",st.theme==="light"?"Activar tema oscuro":"Activar tema claro");toggle.textContent=st.theme==="light"?"☾":"☀";}

  }
  document.getElementById("nav-shade").addEventListener("click",function(){S.settings.sidebarOpen26=false;save();render();});
  document.addEventListener("keydown",function(e){if((e.key==="Escape"||e.keyCode===27)&&S.settings.sidebarOpen26){S.settings.sidebarOpen26=false;save();render();}});
  document.getElementById("viewer").addEventListener("click", function () { this.hidden = true; });
  function updateCtx() {
    if (!hasCEP) { document.getElementById("ctx").textContent = "demo"; return; }
    document.getElementById("ctx").textContent = "AE conectado";
  }
  var themeToggle=document.getElementById("theme-toggle");if(themeToggle)themeToggle.addEventListener("click",function(){S.settings.theme=S.settings.theme==="light"?"dark":"light";save(true);applyTheme();});
  if(window.matchMedia){var motionQuery=window.matchMedia("(prefers-reduced-motion: reduce)");if(motionQuery.addListener)motionQuery.addListener(function(){applyTheme();render();});}
  applyTheme(); render(); updateCtx();
  window.addEventListener("error", function (e) { toast("Error: " + e.message, true); });
})();
