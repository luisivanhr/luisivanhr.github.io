/**
 * assets/js/main.js
 * Unified script with:
 *  - Robust zoom blocking (Ctrl/Cmd + wheel and +/-/0, Safari gestures)
 *  - Canvas DPR/resize handling with device-pixel sizing
 *  - FX metrics so particle sizes, speeds, blurs, counts scale with scene size
 *  - Edge-glow widths/blur scaled with scene
 *  - Hotspots + tooltip + banner + board-math loader
 * 
 * Assumes your HTML has:
 *   <div id="desk-wrap">
 *     <div class="stage">
 *       <div class="desk-bg">
 *         {% include desk-bg.svg %}
 *         {% include desk-hotspots.svg %}
 *         <div id="board-math" class="board-math" data-src="{{ '/data/equations.json' | relative_url }}"></div>
 *       </div>
 *     </div>
 *   </div>
 */

// ===================== 0) Hard-block page zoom (optional) =====================
(function hardBlockPageZoom(){
  const blockWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  };
  window.addEventListener('wheel', blockWheel, { passive: false, capture: true });
  document.addEventListener('wheel', blockWheel, { passive: false, capture: true });

  const blockKeys = (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const code = e.code, key = e.key;
    if (
      code === 'Equal' || code === 'Minus' || code === 'Digit0' ||
      code === 'NumpadAdd' || code === 'NumpadSubtract' || code === 'Numpad0' ||
      key === '+' || key === '=' || key === '-' || key === '0'
    ) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  };
  window.addEventListener('keydown', blockKeys, { capture: true });
  document.addEventListener('keydown', blockKeys, { capture: true });

  // Safari desktop pinch-zoom
  ['gesturestart','gesturechange','gestureend'].forEach(t => {
    window.addEventListener(t, e => { e.preventDefault(); e.stopImmediatePropagation(); }, { capture: true });
  });
})();


// ===================== 1) FX sizing + DPR handling =====================
const DESIGN_W = 1600;  // SVG/viewBox width
const DESIGN_H = 900;   // SVG/viewBox height

function getFxMetrics(canvas){
  const rect = canvas.getBoundingClientRect();
  const dpr  = window.devicePixelRatio || 1;
  return {
    rect, dpr,
    cssW: rect.width,
    cssH: rect.height,
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
  ctx.setTransform(m.dpr, 0, 0, m.dpr, 0, 0); // 1 unit == 1 CSS px
  canvas.__metrics = m;
}

function setupDPRListener(){
  let mq = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
  const onChange = () => {
    resizeFxCanvas();
    // Re-arm for new DPR
    mq.removeEventListener('change', onChange);
    setupDPRListener();
  };
  mq.addEventListener('change', onChange);
}


// ===================== 2) Hotspots, Tooltip, Banner =====================
(function(){
  const tooltip = document.getElementById('tooltip');
  const hotspots = document.querySelectorAll('#desk-hotspots .hotspot');
  const previewCache = {};

  function fmtDate(iso){ try { return new Date(iso).toLocaleDateString(); } catch(e){ return ''; } }

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
    if (!tooltip) return;
    tooltip.querySelector('.title').textContent = item.title || '';
    tooltip.querySelector('.meta').textContent = ((item.summary||'') + ' · ' + fmtDate(item.date||'')).trim();
    const img = tooltip.querySelector('.thumb');
    if(img){
      if(item.image){ img.src = item.image; img.hidden = false; } else { img.hidden = true; }
    }
    tooltip.style.left = (x+16) + 'px';
    tooltip.style.top = (y+16) + 'px';
    tooltip.hidden = false;
  }
  function hideTooltip(){ if(tooltip) tooltip.hidden = true; }

  hotspots.forEach(h => {
    const feed = h.getAttribute('data-feed');
    h.addEventListener('mouseenter', async ()=>{
      if (!feed) return;
      const data = await getFeed(feed);
      const item = data.items?.[0] || {};
      const rect = h.getBoundingClientRect();
      showTooltip(rect.right, rect.top, item);
    });
    h.addEventListener('mouseleave', hideTooltip);
    h.addEventListener('click', ()=>{
      const mapping = {
        blog: '/blog/', models: '/models/', courses: '/courses/',
        hobbies: '/hobbies/', achievements: '/achievements/',
        publications: '/publications/', news: '/news/',
        cv: '/cv/', about: '/about/', presentations: '/presentations/'
      };
      const href = mapping[h.getAttribute('data-target') || ''] || '/';
      window.location.href = href;
    });
  });

  // Banner hydration
  (async function hydrateBanner(){
    const slides = document.querySelectorAll('#banner .slide');
    slides.forEach(async s => {
      const src = s.getAttribute('data-src');
      const data = await getFeed(src);
      const item = data.items?.[0];
      if(item){
        s.innerHTML = `<strong>${s.textContent}:</strong> <a href="${item.url}">${item.title}</a>`;
      }
    });
  })();
})();


// ===================== 3) Board math loader =====================
(function(){
  const board = document.getElementById('board-math');
  if (!board) return;
  async function loadBoardMath() {
    try {
      const url = board.getAttribute('data-src') || '/data/equations.json';
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const payload = await res.json();
      const list = Array.isArray(payload.equations) ? payload.equations : [];
      board.innerHTML = list.map(eq => `<div class="eq">$$${eq}$$</div>`).join('');
      if (typeof renderMathInElement === 'function') {
        renderMathInElement(board, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$",  right: "$",  display: false }
          ],
          throwOnError: false
        });
      }
    } catch (e) {
      console.warn('Equations load failed:', e);
      board.textContent = '';
    }
  }
  document.addEventListener('DOMContentLoaded', loadBoardMath);
})();


// ===================== 4) Particle FX & Edge Glow (scaled) =====================
(function(){
  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const wrap = document.querySelector('.desk-bg');
  if (!wrap) return;

  // Canvas overlay
  const cvs = document.createElement('canvas');
  cvs.id = 'fx-layer';
  wrap.appendChild(cvs);
  const ctx = cvs.getContext('2d');

  // Ensure proper sizing
  function syncCanvasSize(){
    resizeFxCanvas();
  }
  window.addEventListener('load',  syncCanvasSize);
  window.addEventListener('resize', syncCanvasSize);
  setupDPRListener();
  // Rebuild on stage size change
  const stage = document.querySelector('.stage');
  if (stage && 'ResizeObserver' in window) {
    new ResizeObserver(() => { resizeFxCanvas(); rebuildGlowPaths(); buildParticles(/*reseed=*/false); })
      .observe(stage);
  }
  // Initial size
  resizeFxCanvas();

  // Helpers: map hotspot rect center to canvas coords
  function ptFromRectCenter(el){
    const r = el.getBoundingClientRect();
    const host = wrap.getBoundingClientRect();
    return { x: (r.left + r.width/2) - host.left, y: (r.top + r.height/2) - host.top, w: r.width, h: r.height };
  }

  // --- Hotspots & emitters ----
  const hotspots = Array.from(document.querySelectorAll('#desk-hotspots .hotspot'));

  // Base constants tuned for DESIGN_W x DESIGN_H
  const BASE = {
    COUNT:   220,     // population for a full-scene effect
    RADIUS:  2.2,     // px
    BLUR:    24,      // px
    LINE:    2,       // px
    SPEED:   60       // px/s
  };

  // Effect presets; sizes/speeds will be scaled in buildParticles()
  const presets = {
    chalk: {
      renderer: 'fog',
      color: '#ffffff',
      target: 120,         // base target fog puffs per emitter at design area
      gravity: -2,
      spread: 0.0,
      size: [30, 45],      // base px at design scale
      life: [22.0, 35.0],
      rateIdle: 0,
      rateHover: 0,
      speed: [1, 3]
    },
    glow:     { color:'#7bd4ff', gravity:  5, spread:0.7, size:[1.5,2.5], life:[0.7,1.5], rateIdle:15, rateHover:35, speed:[30,70] },
    paper:    { color:'#eec71cff', gravity: 5, spread:0.7, size:[1.5,2.5], life:[0.7,1.3], rateIdle:15, rateHover:35, speed:[25,55] },
    confetti: { color:['#ff6b6b','#ffd166','#06d6a0','#4cc9f0'],
                gravity: 25, spread:1.0, size:[1,3], life:[0.5,0.9], rateIdle:10, rateHover:35, speed:[60,120] }
  };

  // Glow edge cache
  const glowPaths = new Map();

  function buildGlowPath(el) {
    const svg = el.ownerSVGElement;
    if (!svg) return null;
    const path = new Path2D();
    const ctm = el.getScreenCTM();
    if (!ctm) return null;
    const host = wrap.getBoundingClientRect();

    const toScreen = (x, y) => {
      const pt = new DOMPoint(x, y).matrixTransform(ctm);
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
        });
        path.closePath();
      } else {
        const b = el.getBBox();
        const pts = [
          [b.x, b.y], [b.x + b.width, b.y],
          [b.x + b.width, b.y + b.height], [b.x, b.y + b.height]
        ];
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
window.rebuildGlowPaths = rebuildGlowPaths;
  rebuildGlowPaths();
  window.addEventListener('resize', rebuildGlowPaths);

  // Emitters
  const emitters = new Map();
  const parts = [];

  function rand(a,b){ return a + Math.random()*(b-a); }
  function pick(arr){ return Array.isArray(arr) ? arr[(Math.random()*arr.length)|0] : arr; }

  hotspots.forEach(h => {
    const effect = h.getAttribute('data-effect') || 'glow';
    const cfg = presets[effect] || presets.glow;
    const state = {
      el: h,
      cfg,
      hover: false,
      burst: 0,
      center: ptFromRectCenter(h),
      accum: 0,
      seed: Math.random() * 1000,
      fogCount: 0
    };
    emitters.set(h, state);
    h.addEventListener('mouseenter', ()=>{ state.hover = true; });
    h.addEventListener('mouseleave', ()=>{ state.hover = false; });
    h.addEventListener('click', ()=>{ state.burst = 1; });
  });

  function buildParticles(reseed=true){
    const m = cvs.__metrics || getFxMetrics(cvs);
    // Rebuild fog population counts based on area
    emitters.forEach(st => {
      if (st.cfg.renderer === 'fog') {
        st.target = Math.max(20, Math.round((st.cfg.target || 120) * (m.areaScale)));
        if (reseed) st.fogCount = 0;
      }
    });
  }
  buildParticles(true);

  function spawn(dt){
    const m = cvs.__metrics || getFxMetrics(cvs);
    emitters.forEach(st => {
      st.center = ptFromRectCenter(st.el);
      const base = st.hover ? st.cfg.rateHover : st.cfg.rateIdle;
      let rate = base * dt + (st.burst ? 80 * dt : 0);
      st.burst = 0;
      st.accum += rate;
      const n = Math.floor(st.accum);
      st.accum -= n;

      // Fog mode maintains a soft target population per emitter
      if (st.cfg.renderer === 'fog' || ((st.el.getAttribute('data-effect')||'').includes('glow-edge'))) {
        const need = (st.target || 120) - st.fogCount;
        const addNow = Math.min(4, Math.max(0, need));
        for (let k = 0; k < addNow; k++) {
          const px = st.center.x + (Math.random() - 0.5) * st.center.w * 0.9;
          const py = st.center.y + (Math.random() - 0.2) * st.center.h * 0.6;
          const vx = (Math.random() - 0.5) * 2 * m.scale;  // scaled drift
          const vy = (-Math.random() * 2 - 0.5) * m.scale;
          const life = rand(st.cfg.life[0], st.cfg.life[1]);
          parts.push({
            x: px, y: py, vx, vy,
            life, t: Math.random() * life * 0.8,
            size: rand(st.cfg.size[0], st.cfg.size[1]) * m.scale, // scale size
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

      // Non-fog spawns
      for (let i = 0; i < n; i++) {
        const angle = (Math.random() - 0.5) * Math.PI * st.cfg.spread;
        const speed = rand(st.cfg.speed[0], st.cfg.speed[1]) * m.scale;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed + st.cfg.gravity * m.scale;
        const px = st.center.x + (Math.random() - 0.5) * st.center.w * 0.8;
        const py = st.center.y + (Math.random() - 0.5) * st.center.h * 0.6;
        parts.push({
          x: px, y: py, vx, vy,
          life: rand(st.cfg.life[0], st.cfg.life[1]),
          t: 0,
          size: rand(st.cfg.size[0], st.cfg.size[1]) * m.scale,
          color: pick(st.cfg.color),
          renderer: st.cfg.renderer || 'dot',
          phase: Math.random() * Math.PI * 2
        });
      }
    });
  }

  function step(dt){
    const m = cvs.__metrics || getFxMetrics(cvs);
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
            p.size = rand(st.cfg.size[0], st.cfg.size[1]) * m.scale;
            p.x = c.x + (Math.random() - 0.5) * c.w * 0.9;
            p.y = c.y + (Math.random() - 0.2) * c.h * 0.6;
            p.vx = (Math.random() - 0.5) * 2 * m.scale;
            p.vy = (-Math.random() * 2 - 0.5) * m.scale;
            p.phase = Math.random() * Math.PI * 2;
          } else {
            parts.splice(i, 1);
            continue;
          }
        }

        // Smooth drift field
        const tsec = performance.now() * 0.001;
        const kx = 0.015, ky = 0.012;
        const wx = 0.25, wy = 0.22;
        const ampX = 10 * m.scale,  ampY = 6 * m.scale;

        const driftX = ampX * Math.sin(p.seed + p.x * kx + tsec * wx);
        const driftY = ampY * Math.cos(p.seed * 0.7 + p.y * ky + tsec * wy) - 6 * m.scale;

        p.x += (p.vx + driftX) * dt * 0.5;
        p.y += (p.vy + driftY) * dt * 0.5;

        // Draw fog puff
        const alpha = 0.08;
        const sz = Math.max(1, p.size);
        const prevOp = ctx.globalCompositeOperation;
        const prevFilt = ctx.filter;
        ctx.globalCompositeOperation = 'lighter';
        // ctx.filter = 'blur(1px)'; // keep disabled for perf unless needed

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz);
        g.addColorStop(0, `rgba(255,255,255,${alpha})`);
        g.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
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
    if (hex.length === 3) { r=parseInt(hex[0]+hex[0],16); g=parseInt(hex[1]+hex[1],16); b=parseInt(hex[2]+hex[2],16); }
    else if (hex.length >= 6) { r=parseInt(hex.slice(0,2),16); g=parseInt(hex.slice(2,4),16); b=parseInt(hex.slice(4,6),16); }
    else { r=120; g=190; b=255; }
    return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
  }

  // Main loop
  let last = performance.now();
  function tick(now){
    const dt = Math.min(0.05, (now-last)/1000);
    last = now;

    // Clear in CSS pixels
    const m = cvs.__metrics || getFxMetrics(cvs);
    ctx.clearRect(0, 0, m.cssW, m.cssH);

    spawn(dt);
    step(dt);

    // Edge glow (scaled width/blur)
    if (glowPaths.size) {
      const t = performance.now() * 0.001;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      glowPaths.forEach(cfg => {
        const pulseBase = cfg.alpha;
        const pulse = (cfg.pulse === 1)
          ? pulseBase
          : pulseBase * (0.5 + 0.5 * Math.sin(t * 2.5));

        const width = Math.max(1, cfg.width * m.scale);
        const blur  = Math.max(0, cfg.blur  * m.scale);

        // Outer halo
        ctx.lineWidth = width;
        ctx.shadowColor = cfg.color;
        ctx.shadowBlur  = blur;
        ctx.strokeStyle = setAlpha(cfg.color, pulse);
        ctx.setLineDash([]);
        ctx.stroke(cfg.path);

        // Inner rim
        ctx.shadowBlur = 0;
        ctx.lineWidth = Math.max(2, width * 0.28);
        ctx.strokeStyle = setAlpha(cfg.color, pulse * 0.15);
        ctx.stroke(cfg.path);

        if (cfg.twinkle) {
          const base = 6 * m.scale, gap = 10 * m.scale;
          const wob  = (2 + Math.sin(t * 2.1) * 1.5) * m.scale;
          const offset = (t * 24) % (base + gap);

          ctx.shadowBlur = blur * 0.6;
          ctx.lineWidth = Math.max(1.5, width * 0.35);
          ctx.setLineDash([base + wob, gap + wob]);
          ctx.lineDashOffset = -offset;
          ctx.strokeStyle = setAlpha(cfg.color, pulse * 0.6);
          ctx.stroke(cfg.path);

          ctx.shadowBlur = blur * 0.3;
          ctx.lineWidth = Math.max(1, width * 0.22);
          ctx.setLineDash([3 + wob * 0.5, 12 + wob]);
          ctx.lineDashOffset = offset * 1.7;
          ctx.strokeStyle = setAlpha(cfg.color, pulse * 0.35);
          ctx.stroke(cfg.path);

          ctx.setLineDash([]);
        }
      });
      ctx.restore();
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();


// ===================== 5) Tiny helpers for console tuning (optional) =====================
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
