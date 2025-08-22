// ===== Optional: hard block page zoom (Ctrl/Cmd + wheel, Ctrl/Cmd +/−/0) =====
(function hardBlockPageZoom(){
  const blockWheel = (e) => {
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); e.stopImmediatePropagation(); }
  };
  window.addEventListener('wheel', blockWheel, { passive: false, capture: true });
  document.addEventListener('wheel', blockWheel, { passive: false, capture: true });

  const blockKeys = (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const code = e.code, key = e.key;
    if (code === 'Equal' || code === 'Minus' || code === 'Digit0' ||
        code === 'NumpadAdd' || code === 'NumpadSubtract' || code === 'Numpad0' ||
        key === '+' || key === '=' || key === '-' || key === '0') {
      e.preventDefault(); e.stopImmediatePropagation();
    }
  };
  window.addEventListener('keydown', blockKeys, { capture: true });
  document.addEventListener('keydown', blockKeys, { capture: true });

  ['gesturestart','gesturechange','gestureend'].forEach(t => {
    window.addEventListener(t, e => { e.preventDefault(); e.stopImmediatePropagation(); }, { capture: true });
  });
})();

// ===== FX metrics & canvas sizing =====
const DESIGN_W = 1600;   // match your SVG/viewBox width
const DESIGN_H = 900;    // match your SVG/viewBox height

function getFxMetrics(canvas){
  const rect = canvas.getBoundingClientRect();
  const dpr  = window.devicePixelRatio || 1;
  return {
    rect, dpr,
    cssW: rect.width, cssH: rect.height,
    scaleW: rect.width  / DESIGN_W,
    scaleH: rect.height / DESIGN_H,
    scale:  Math.min(rect.width / DESIGN_W, rect.height / DESIGN_H),
    areaScale: (rect.width * rect.height) / (DESIGN_W * DESIGN_H)
  };
}

function resizeFxCanvas(){
  const canvas = document.getElementById('fx-layer');
  if (!canvas) return;
  const m = getFxMetrics(canvas);
  const W = Math.max(1, Math.round(m.cssW * m.dpr));
  const H = Math.max(1, Math.round(m.cssH * m.dpr));
  if (canvas.width !== W || canvas.height !== H) {
    canvas.width  = W;
    canvas.height = H;
  }
  const ctx = canvas.getContext('2d');
  // draw in CSS pixel units
  ctx.setTransform(m.dpr, 0, 0, m.dpr, 0, 0);
  canvas.__metrics = m;
}

function setupDPRListener(){
  let mq = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
  const onChange = () => {
    resizeFxCanvas();
    mq.removeEventListener('change', onChange);
    setupDPRListener(); // rebind for the new DPR
  };
  mq.addEventListener('change', onChange);
}

// ===== Tooltips, feeds, banner (unchanged minimal) =====
(function(){
  const tooltip = document.getElementById('tooltip');
  function fmtDate(iso){ try { return new Date(iso).toLocaleDateString(); } catch(e){ return ''; } }
  const previewCache = Object.create(null);
  async function getFeed(url){
    if(!url) return {"items":[{"title":"(placeholder)","url":"#","date": new Date().toISOString(),"summary":"No feed yet.","image":""}]};
    if(previewCache[url]) return previewCache[url];
    try {
      const res = await fetch(url, {cache:'no-store'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      const data = await res.json();
      previewCache[url] = data;
      return data;
    } catch(e) {
      return {"items":[{"title":"(placeholder)","url":"#","date": new Date().toISOString(),"summary":"No feed yet.","image":""}]};
    }
  }
  function showTooltip(x, y, item){
    tooltip.querySelector('.title').textContent = item.title || '';
    tooltip.querySelector('.meta').textContent = ((item.summary||'') + ' · ' + fmtDate(item.date||'')).trim();
    const img = tooltip.querySelector('.thumb');
    if(item.image){ img.src = item.image; img.hidden = false; } else { img.hidden = true; }
    tooltip.style.left = (x+16) + 'px';
    tooltip.style.top  = (y+16) + 'px';
    tooltip.hidden = false;
  }
  function hideTooltip(){ tooltip.hidden = true; }

  const hotspots = document.querySelectorAll('#desk-hotspots .hotspot');
  hotspots.forEach(h => {
    const feed = h.getAttribute('data-feed');
    h.addEventListener('mouseenter', async () => {
      if (!feed) return;
      const data = await getFeed(feed);
      const item = data.items?.[0] || {};
      const r = h.getBoundingClientRect();
      showTooltip(r.right, r.top, item);
    });
    h.addEventListener('mouseleave', hideTooltip);
    h.addEventListener('click', () => {
      const mapping = {
        blog: '/blog/', models: '/models/', courses: '/courses/', hobbies: '/hobbies/',
        achievements: '/achievements/', publications: '/publications/', news: '/news/',
        cv: '/cv/', about: '/about/', presentations: '/presentations/'
      };
      const href = mapping[h.getAttribute('data-target') || ''] || '/';
      location.href = href;
    });
  });

  // Banner
  (async function hydrateBanner(){
    const slides = document.querySelectorAll('#banner .slide');
    for (const s of slides) {
      const src = s.getAttribute('data-src');
      const data = await getFeed(src);
      const item = data.items?.[0];
      if(item){
        s.innerHTML = `<strong>${s.textContent}:</strong> <a href="${item.url}">${item.title}</a>`;
      }
    }
  })();
})();

// ===== Board Math: load JSON and render with KaTeX or MathJax if present =====
function hydrateBoardMath(){
  const board = document.querySelector('.board-math');
  if (!board) return;

  async function renderLatex(latexList){
    // Clear the board
    board.innerHTML = '';
    // Use KaTeX if available
    if (window.katex && typeof window.katex.render === 'function'){
      latexList.forEach(src => {
        const block = document.createElement('div');
        block.className = 'board-eq';
        board.appendChild(block);
        try{
          window.katex.render(String(src), block, {displayMode: true, throwOnError: false});
        }catch(_){
          block.textContent = String(src);
        }
      });
      return;
    }
    // Else use MathJax v3 if available
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function'){
      const html = latexList.map(s => `$$${String(s)}$$`).join('\n');
      board.innerHTML = html;
      try { await window.MathJax.typesetPromise([board]); } catch(_){}
      return;
    }
    // Fallback: plain TeX text
    board.innerHTML = latexList.map(s => `<pre style="margin:0">${String(s)}</pre>`).join('\n');
  }

  const src = board.getAttribute('data-src');
  if (!src){
    // No data source: just typeset existing content if any
    const existing = board.textContent.trim();
    if (existing) renderLatex([existing]);
    return;
  }

  // Fetch JSON and pick reasonable fields
  fetch(src, {cache:'no-store'}).then(r => r.ok ? r.json() : null).then(data => {
    if (!data){ return; }
    let list = [];
    if (Array.isArray(data)){
      list = data.map(String);
    } else if (Array.isArray(data.equations)){
      list = data.equations.map(String);
    } else if (Array.isArray(data.items)){
      // try common "items" format: {items:[{latex:'..'} or {math:'..'} or {text:'..'}]}
      list = data.items.map(it => String(it.latex || it.math || it.text || '')).filter(Boolean);
    } else if (typeof data.latex === 'string'){
      list = [data.latex];
    } else if (typeof data.math === 'string'){
      list = [data.math];
    } else if (typeof data === 'object'){
      // Generic: concatenate string values
      list = Object.values(data).filter(v => typeof v === 'string');
    }
    if (list.length === 0) return;
    renderLatex(list);
  }).catch(()=>{
    // ignore errors; leave board empty
  });
}

// Ensure board hydrates after DOM and when fonts load
window.addEventListener('load', hydrateBoardMath);




// ===== FX system (scaled & zoom-resilient) =====
(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const wrap = document.querySelector('.desk-bg');
  if (!wrap) return;

  // Canvas overlay
  const cvs = document.createElement('canvas');
  cvs.id = 'fx-layer';
  const ctx = cvs.getContext('2d');
  wrap.appendChild(cvs);

  // Initial sizing + listeners
  function fullResize(){
    resizeFxCanvas();
    rebuildGlowPaths();
    rebuildParticles(true);
  }
  window.addEventListener('load', fullResize);
  window.addEventListener('resize', fullResize);
  setupDPRListener();
  // Also react to stage size changes
  const stage = document.querySelector('.stage') || wrap;
  try {
    const ro = new ResizeObserver(fullResize);
    ro.observe(stage);
  } catch(_) {}

  // ==== Geometry helpers ====
  function ptFromRectCenter(el){
    const r = el.getBoundingClientRect();
    const host = wrap.getBoundingClientRect();
    return { x: (r.left + r.width/2) - host.left, y: (r.top + r.height/2) - host.top, w: r.width, h: r.height };
  }

  // ==== Glow edge cache (scaled) ====
  const glowPaths = new Map();

  function buildGlowPath(el) {
    const svg = el.ownerSVGElement;
    if (!svg) return null;
    const path = new Path2D();
    const ctm = el.getScreenCTM();
    if (!ctm) return null;
    const toScreen = (x, y) => {
      const pt = new DOMPoint(x, y).matrixTransform(ctm);
      const host = wrap.getBoundingClientRect();
      return [pt.x - host.left, pt.y - host.top];
    };
    const tag = el.tagName.toLowerCase();
    if (tag === 'polygon') {
      const raw = (el.getAttribute('points') || '').trim().split(/\s+/);
      raw.forEach((p, i) => {
        const [x, y] = p.split(',').map(Number);
        const [sx, sy] = toScreen(x, y);
        if (i === 0) path.moveTo(sx, sy); else path.lineTo(sx, sy);
      });
      path.closePath();
    } else if (tag === 'path') {
      const len = el.getTotalLength ? el.getTotalLength() : 0;
      if (len > 0) {
        const steps = Math.max(24, Math.min(160, Math.round(len / 10)));
        for (let i = 0; i <= steps; i++) {
          const p = el.getPointAtLength((i / steps) * len);
          const [sx, sy] = toScreen(p.x, p.y);
          if (i === 0) path.moveTo(sx, sy); else path.lineTo(sx, sy);
        }
        path.closePath();
      } else {
        const b = el.getBBox();
        const pts = [[b.x,b.y],[b.x+b.width,b.y],[b.x+b.width,b.y+b.height],[b.x,b.y+b.height]];
        pts.forEach(([x, y], i) => {
          const [sx, sy] = toScreen(x, y);
          if (i === 0) path.moveTo(sx, sy); else path.lineTo(sx, sy);
        });
        path.closePath();
      }
    } else {
      return null;
    }
    return path;
  }

  function rebuildGlowPaths() {
    glowPaths.clear();
    const hotspots = document.querySelectorAll('#desk-hotspots .hotspot');
    hotspots.forEach(h => {
      if ((h.getAttribute('data-effect') || '').includes('glow-edge')) {
        const p = buildGlowPath(h);
        if (p) {
          glowPaths.set(h, {
            path: p,
            color: h.getAttribute('data-glow-color') || 'rgba(120,190,255,0.85)',
            width: +(h.getAttribute('data-glow-width') || 10),
            blur:  +(h.getAttribute('data-glow-blur')  || 20),
            alpha: +(h.getAttribute('data-glow-alpha') || 0.12),
            pulse: +(h.getAttribute('data-glow-pulse') || 1.0),
            twinkle: (h.getAttribute('data-glow-twinkle') || 'false') === 'true'
          });
        }
      }
    });
  }

  // ==== Particles (scaled) ====
  const presets = {
    glow:     { color:'#7bd4ff',  gravity:  5, spread:0.7, size:[1.5,2.5], life:[0.7,1.5], rateIdle:15, rateHover:35, speed:[0,70] },
    paper:    { color:'#eec71cff', gravity:  5, spread:0.7, size:[1.5,2.5], life:[0.7,1.3], rateIdle:15, rateHover:35, speed:[25,55] },
    confetti: { color:['#ff6b6b','#ffd166','#06d6a0','#4cc9f0'], gravity:25, spread:1.0, size:[1,3], life:[0.5,0.9], rateIdle:10, rateHover:35, speed:[60,120] },
    chalk:    { renderer:'fog', color:'#ffffff', target:50, gravity:-2, spread:0.0, size:[30,45], life:[22.0,35.0], rateIdle:0, rateHover:0, speed:[1,3] }
  };

  const emitters = new Map();
  const parts = [];

  function rebuildParticles(hard=false){
    if (hard) parts.length = 0;
    emitters.clear();
    const hotspots = document.querySelectorAll('#desk-hotspots .hotspot');
    hotspots.forEach(h => {
      const effect = h.getAttribute('data-effect') || 'glow';
      const cfg = presets[effect] || presets.glow;
      emitters.set(h, {
        el: h,
        cfg,
        hover: false,
        burst: 0,
        center: ptFromRectCenter(h),
        accum: 0,
        seed: Math.random() * 1000,
        fogCount: 0
      });
      h.addEventListener('mouseenter', ()=>{ const st = emitters.get(h); if(st) st.hover = true; });
      h.addEventListener('mouseleave', ()=>{ const st = emitters.get(h); if(st) st.hover = false; });
      h.addEventListener('click', ()=>{ const st = emitters.get(h); if(st) st.burst = 1; });
    });
  }

  function rand(a,b){ return a + Math.random()*(b-a); }
  function pick(arr){ return Array.isArray(arr) ? arr[(Math.random()*arr.length)|0] : arr; }

  function spawn(dt){
    const m = cvs.__metrics || getFxMetrics(cvs);
    const s = Math.max(0.5, Math.min(3, m.scale));
    const area = Math.max(0.2, Math.min(5, m.areaScale));

    emitters.forEach(st => {
      st.center = ptFromRectCenter(st.el);
      const base = st.hover ? st.cfg.rateHover : st.cfg.rateIdle;
      // scale rate by area so density is stable
      let rate = base * dt * area + (st.burst ? 80 * dt : 0);
      st.burst = 0;
      st.accum += rate;
      const n = Math.floor(st.accum);
      st.accum -= n;

      if (st.cfg.renderer === 'fog' || (st.el.getAttribute('data-effect')||'').includes('glow-edge')) {
        // maintain roughly constant puff density
        const target = Math.round((st.cfg.target || 200) * area);
        const need = target - st.fogCount;
        const addNow = Math.min(4, Math.max(0, need));
        for (let k = 0; k < addNow; k++) {
          const c = st.center;
          const px = c.x + (Math.random() - 0.9) * c.w * 0.9;
          const py = c.y + (Math.random() - 0.2) * c.h * 0.6;
          const vx = (Math.random() - 0.5) * 2 * s;
          const vy = (-Math.random() * 2 - 0.5) * s;
          const life = rand(st.cfg.life[0], st.cfg.life[1]);
          parts.push({
            x: px, y: py, vx: vx, vy: vy,
            life: life, t: Math.random() * life * 0.8,
            size: rand(st.cfg.size[0], st.cfg.size[1]) * s,
            color: st.cfg.color,
            renderer: 'fog',
            phase: Math.random() * Math.PI * 2,
            seed: st.seed + Math.random() * 1000,
            owner: st
          });
          st.fogCount++;
        }
        return;
      }

      for (let i = 0; i < n; i++) {
        const angle = (Math.random() - 0.5) * Math.PI * st.cfg.spread;
        const speed = rand(st.cfg.speed[0], st.cfg.speed[1]) * s;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed + st.cfg.gravity * s;
        const c = st.center;
        const px = c.x + (Math.random() - 0.5) * c.w * 0.8;
        const py = c.y + (Math.random() - 0.5) * c.h * 0.6;
        parts.push({
          x: px, y: py, vx, vy,
          life: rand(st.cfg.life[0], st.cfg.life[1]),
          t: 0,
          size: rand(st.cfg.size[0], st.cfg.size[1]) * s,
          color: pick(st.cfg.color),
          renderer: st.cfg.renderer || 'dot',
          phase: Math.random() * Math.PI * 2
        });
      }
    });
  }

  function tick(now){
    if (!cvs.__metrics) resizeFxCanvas();
    const m = cvs.__metrics || getFxMetrics(cvs);
    const s = Math.max(0.5, Math.min(3, m.scale));

    // time step
    const tnow = now || performance.now();
    tick.__last = tick.__last || tnow;
    const dt = Math.min(0.05, (tnow - tick.__last) / 1000);
    tick.__last = tnow;

    // clear in CSS pixels
    ctx.clearRect(0, 0, m.cssW, m.cssH);

    // spawn/update
    spawn(dt);

    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.t += dt;
      const u = p.t / p.life;

      if (p.renderer === 'fog') {
        if (u >= 1) {
          const st = p.owner;
          if (st && st.el && st.cfg && st.cfg.renderer === 'fog') {
            const c = st.center = ptFromRectCenter(st.el);
            p.t = 0;
            p.life = rand(st.cfg.life[0], st.cfg.life[1]);
            p.size = rand(st.cfg.size[0], st.cfg.size[1]) * s;
            p.x = c.x + (Math.random() - 0.5) * c.w * 0.9;
            p.y = c.y + (Math.random() - 0.2) * c.h * 0.6;
            p.vx = (Math.random() - 0.5) * 2 * s;
            p.vy = (-Math.random() * 2 - 0.5) * s;
            p.phase = Math.random() * Math.PI * 2;
          } else {
            parts.splice(i, 1);
            continue;
          }
        }

        // gentle drift
        const tsec = performance.now() * 0.001;
        const kx = 0.015, ky = 0.012;
        const wx = 0.25, wy = 0.22;
        const ampX = 10 * s, ampY = 6 * s;
        const driftX = ampX * Math.sin(p.seed + p.x * kx + tsec * wx);
        const driftY = ampY * Math.cos(p.seed * 0.7 + p.y * ky + tsec * wy) - 6 * s;
        p.x += (p.vx + driftX) * dt * 0.5;
        p.y += (p.vy + driftY) * dt * 0.5;

        // soft puff
        const alpha = 0.08;
        const prevOp = ctx.globalCompositeOperation;
        const prevFilt = ctx.filter;
        ctx.globalCompositeOperation = 'lighter';
        const r = Math.max(1, p.size);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, `rgba(255,255,255,${alpha})`);
        g.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = prevFilt;
        ctx.globalCompositeOperation = prevOp;
      } else {
        if (u >= 1) { parts.splice(i, 1); continue; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const alpha = 1 - u;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, p.size * (1 - u)), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Edge glow (scaled widths/blur)
    if (glowPaths.size) {
      const t = performance.now() * 0.001;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      glowPaths.forEach(cfg => {
        const p = cfg.path;
        const pulse = cfg.alpha * (cfg.pulse === 1 ? 1 : 0.5 + 0.5 * Math.sin(t * 2.5) * (cfg.pulse - 1) + 1 - (cfg.pulse - 1)/2);
        const sBlur = cfg.blur  * s;
        const sWidth= cfg.width * s;

        // Outer halo
        ctx.lineWidth = sWidth;
        ctx.shadowColor = cfg.color;
        ctx.shadowBlur  = sBlur;
        ctx.strokeStyle = setAlpha(cfg.color, pulse);
        ctx.setLineDash([]);
        ctx.stroke(p);

        // Inner rim
        ctx.shadowBlur = 0;
        ctx.lineWidth = Math.max(2, sWidth * 0.28);
        ctx.strokeStyle = setAlpha(cfg.color, pulse * 0.15);
        ctx.stroke(p);

        if (cfg.twinkle) {
          const base = 6 * s;
          const gap  = 10 * s;
          const wob  = 2 * s + Math.sin(t * 2.1) * 1.5 * s;
          const offset = (t * 24) % (base + gap);
          ctx.shadowBlur = sBlur * 0.6;
          ctx.lineWidth = Math.max(1.5, sWidth * 0.35);
          ctx.setLineDash([base + wob, gap + wob]);
          ctx.lineDashOffset = -offset;
          ctx.strokeStyle = setAlpha(cfg.color, pulse * 0.6);
          ctx.stroke(p);
          ctx.shadowBlur = sBlur * 0.3;
          ctx.lineWidth = Math.max(1, sWidth * 0.22);
          ctx.setLineDash([3 * s + wob * 0.5, 12 * s + wob]);
          ctx.lineDashOffset = offset * 1.7;
          ctx.strokeStyle = setAlpha(cfg.color, pulse * 0.35);
          ctx.stroke(p);
          ctx.setLineDash([]);
        }
      });
      ctx.restore();
    }

    requestAnimationFrame(tick);
  }

  function setAlpha(color, a) {
    const m = String(color).match(/^rgba?\(([^)]+)\)$/i);
    if (m) {
      const parts = m[1].split(',').map(s => s.trim());
      const [r,g,b] = parts;
      return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
    }
    const hex = String(color).replace('#','');
    let r,g,b;
    if (hex.length === 3) {
      r = parseInt(hex[0]+hex[0],16);
      g = parseInt(hex[1]+hex[1],16);
      b = parseInt(hex[2]+hex[2],16);
    } else if (hex.length >= 6) {
      r = parseInt(hex.slice(0,2),16);
      g = parseInt(hex.slice(2,4),16);
      b = parseInt(hex.slice(4,6),16);
    } else { r=120; g=190; b=255; }
    return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
  }

  // Kickoff
  resizeFxCanvas();
  rebuildGlowPaths();
  rebuildParticles(true);
  requestAnimationFrame(tick);
})();

// ===== Debug helpers (optional) =====
(function () {
  // only show panel when ?fx=1 is in the URL
  if (!/(\?|&)fx=1\b/.test(location.search)) return;
  const qs = (q) => document.querySelector(q.startsWith('#') ? q : `#desk-hotspots ${q}`);

  let el = null;
  window.fxTarget = (q) => {
    const next = qs(q);
    if (!next) { console.warn('fxTarget: not found', q); return null; }
    el = next;
    panel.querySelectorAll('input').forEach(i => i.disabled = false);
    apply();
    return el;
  };

  const panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;right:10px;top:10px;z-index:9999;background:#0b1118cc;color:#e6f0ff;padding:10px;border:1px solid #214;backdrop-filter:blur(4px);border-radius:8px;font:12px/1.3 system-ui';
  panel.innerHTML = `
    <div style="margin-bottom:6px;font-weight:600">Glow Debug</div>
    <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">
      <input id="gsel" placeholder="#hotspot-id or .selector" style="flex:1;min-width:150px;background:#0a0f16;color:#e6f0ff;border:1px solid #223;padding:4px 6px;border-radius:6px">
      <button id="guse" style="background:#153451;border:1px solid #2b5c86;color:#cfeaff;padding:4px 8px;border-radius:6px;cursor:pointer">Use</button>
    </div>
    <label>Color <input id="gx" type="color" value="#7cc8ff"></label><br>
    <label>Width <input id="gw" type="range" min="2" max="24" value="10"></label><br>
    <label>Blur  <input id="gb" type="range" min="4" max="40" value="20"></label><br>
    <label>Alpha <input id="ga" type="range" min="0" max="0.4" step="0.01" value="0.12"></label><br>
    <label>Pulse <input id="gp" type="range" min="1" max="2" step="0.01" value="1.2"></label><br>
    <label>Twinkle <input id="gt" type="checkbox" checked></label>
  `;
  document.body.appendChild(panel);
  panel.querySelectorAll('input').forEach(i => i.disabled = true);
  panel.querySelector('#guse').addEventListener('click', () => {
    const q = panel.querySelector('#gsel').value.trim();
    if (q) window.fxTarget(q);
  });

  function apply() {
    if (!el) return;
    el.setAttribute('data-glow-color', panel.querySelector('#gx').value);
    el.setAttribute('data-glow-width', panel.querySelector('#gw').value);
    el.setAttribute('data-glow-blur',  panel.querySelector('#gb').value);
    el.setAttribute('data-glow-alpha', panel.querySelector('#ga').value);
    el.setAttribute('data-glow-pulse', panel.querySelector('#gp').value);
    el.setAttribute('data-glow-twinkle', panel.querySelector('#gt').checked ? 'true' : 'false');
    (typeof rebuildGlowPaths === 'function') && rebuildGlowPaths();
  }
  panel.addEventListener('input', apply);

  const firstGlow = document.querySelector('#desk-hotspots .hotspot[data-effect*="glow-edge"]');
  if (firstGlow) window.fxTarget('#' + (firstGlow.id || firstGlow.getAttribute('id') || firstGlow.getAttribute('data-id') || firstGlow.tagName.toLowerCase()));
})();

// Quick selectors for console
window.fxSel = (q) => document.querySelector(q.startsWith('#') ? q : `#desk-hotspots ${q}`);
window.fxSet = (q, name, val) => {
  const el = fxSel(q);
  if (!el) return null;
  el.setAttribute(name, String(val));
  if (typeof rebuildGlowPaths === 'function') rebuildGlowPaths();
  return el;
};
window.fxDump = (q) => {
  const el = fxSel(q);
  if (!el) return '';
  const attrs = Array.from(el.attributes).filter(a => a.name.startsWith('data-'));
  const txt = attrs.map(a => `${a.name}="${a.value}"`).join(' ');
  console.log(txt);
  return txt;
};