
/* Minimal interactivity for hotspots + banner + tooltips + patch guidance */
(function(){
  const tooltip = document.getElementById('tooltip');
  const desk = document.getElementById('desk-wrap');
  const hotspots = document.querySelectorAll('#desk-hotspots .hotspot');
  let previewCache = {};

  function fmtDate(iso){ try { return new Date(iso).toLocaleDateString(); } catch(e){ return ''; } }

  async function getFeed(url){
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
    tooltip.querySelector('.title').textContent = item.title;
    tooltip.querySelector('.meta').textContent = (item.summary||'') + ' · ' + fmtDate(item.date);
    const img = tooltip.querySelector('.thumb');
    if(item.image){ img.src = item.image; img.hidden = false; } else { img.hidden = true; }
    tooltip.style.left = (x+16) + 'px';
    tooltip.style.top = (y+16) + 'px';
    tooltip.hidden = false;
  }

  function hideTooltip(){ tooltip.hidden = true; }

  hotspots.forEach(h => {
    const feed = h.getAttribute('data-feed');
    h.addEventListener('mouseenter', async (e)=>{
      const data = await getFeed(feed);
      const item = data.items?.[0] || {};
      const rect = h.getBoundingClientRect();
      showTooltip(rect.right, rect.top, item);
    });
    h.addEventListener('mouseleave', hideTooltip);
    h.addEventListener('click', async ()=>{
      const target = h.getAttribute('data-target') || '';
      // Navigate to listing page that matches the target
      const mapping = {
        blog: '/blog/',
        models: '/models/',
        courses: '/courses/',
        hobbies: '/hobbies/',
        achievements: '/achievements/',
        publications: '/publications/',
        news: '/news/'
      };
      const href = mapping[target] || '/';
      window.location.href = href;
    });
  });

  // Simple banner loader: populate slides with current first item titles
  async function hydrateBanner(){
    const slides = document.querySelectorAll('#banner .slide');
    slides.forEach(async s => {
      const src = s.getAttribute('data-src');
      const data = await getFeed(src);
      const item = data.items?.[0];
      if(item){
        s.innerHTML = `<strong>${s.textContent}:</strong> <a href="${item.url}">${item.title}</a>`;
      }
    });
  }
  hydrateBanner();


  // === Particle FX (idle + hover + click) ==============================
(function(){
  // Respect reduced motion
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const wrap = document.querySelector('.desk-bg');
  if (!wrap) return;

  // Canvas overlay
  const cvs = document.createElement('canvas');
  cvs.id = 'fx-layer';
  const ctx = cvs.getContext('2d');
  wrap.appendChild(cvs);

  // Resize to match desk box
  function sizeCanvas(){
    const r = wrap.getBoundingClientRect();
    cvs.width  = r.width  * devicePixelRatio;
    cvs.height = r.height * devicePixelRatio;
    cvs.style.width  = r.width + 'px';
    cvs.style.height = r.height + 'px';
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  sizeCanvas();
  addEventListener('resize', sizeCanvas);

  // Map from DOM coords to canvas coords
  function ptFromRectCenter(el){
    const r = el.getBoundingClientRect();
    const host = wrap.getBoundingClientRect();
    return { x: (r.left + r.width/2) - host.left, y: (r.top + r.height/2) - host.top, w: r.width, h: r.height };
  }

  // Emitter presets
  const presets = {
  chalk: {
    renderer: 'fog',     // custom fog renderer
    color: '#ffffff',
    target: 100,         // maintain ~220 puffs (no bursty spawn)
    gravity: -3,         // slow rise
    spread: 0.0,         // not used for fog spawn
    size: [14, 30],      // bigger, soft blobs
    life: [9.0, 14.0],   // long-lived
    rateIdle: 0,         // no emitter “rate”
    rateHover: 0,        // hover doesn’t change density (we keep it calm)
    speed: [1, 3]        // very slow initial motion
  },
    glow:     { color:'#7bd4ff',  gravity:  8, spread:0.6, size:[1,2],  life:[0.7,1.1],  rateIdle:  5, rateHover: 30, speed:[30,70] },
    paper:    { color:'#c9d7e6',  gravity:  5, spread:0.7, size:[1,2],  life:[0.7,1.3],  rateIdle:  5, rateHover: 28, speed:[25,55] },
    confetti: { color:['#ff6b6b','#ffd166','#06d6a0','#4cc9f0'],
                gravity: 25, spread:1.0, size:[1,3], life:[0.5,0.9], rateIdle: 0, rateHover: 35, speed:[60,120] }
  };

  const hotspots = Array.from(document.querySelectorAll('#desk-hotspots .hotspot'));
  const emitters = new Map();
  const parts = [];

  function rand(a,b){ return a + Math.random()*(b-a); }
  function pick(arr){ return Array.isArray(arr) ? arr[(Math.random()*arr.length)|0] : arr; }

  // Make an emitter for each hotspot
  hotspots.forEach(h => {
    const effect = h.getAttribute('data-effect') || 'glow';
    const cfg = presets[effect] || presets.glow;
    const state = {
      el: h,
      cfg,
      hover: false,
      burst: 0,
      center: ptFromRectCenter(h),
      accum: 0,           // keep for non-fog effects
      seed: Math.random() * 1000,
      fogCount: 0         // current fog particles for this emitter
    };
    emitters.set(h, state);

    h.addEventListener('mouseenter', ()=>{ state.hover = true; });
    h.addEventListener('mouseleave', ()=>{ state.hover = false; });
    h.addEventListener('click', ()=>{ state.burst = 1; }); // one-shot burst
  });

  function spawn(dt){
    
    emitters.forEach(st => {
    st.center = ptFromRectCenter(st.el);
    const base = st.hover ? st.cfg.rateHover : st.cfg.rateIdle;
    let rate = base * dt + (st.burst ? 80 * dt : 0);
    st.burst = 0; // consume burst

    st.accum += rate;
    const n = Math.floor(st.accum);
    st.accum -= n;

    // --- Fog mode: softly fill up to target, then recycle on death ---
    if (st.cfg.renderer === 'fog') {
      // Maintain population
      const need = (st.cfg.target || 200) - st.fogCount;
      const addNow = Math.min(4, Math.max(0, need)); // trickle in a few per frame
      for (let k = 0; k < addNow; k++) {
        const px = st.center.x + (Math.random() - 0.5) * st.center.w * 0.9;
        const py = st.center.y + (Math.random() - 0.2) * st.center.h * 0.6; // bias slightly lower
        const vx = (Math.random() - 0.5) * 2;  // tiny initial drift
        const vy = -Math.random() * 2 - 0.5;   // slight upward
        const life = rand(st.cfg.life[0], st.cfg.life[1]);
        parts.push({
          x: px, y: py, vx: vx, vy: vy,
          life: life,
          t: Math.random() * life * 0.8, // start at random life phase to avoid pulses
          size: rand(st.cfg.size[0], st.cfg.size[1]),
          color: st.cfg.color,
          renderer: 'fog',
          phase: Math.random() * Math.PI * 2,
          seed: st.seed + Math.random() * 1000,
          owner: st
        });
        st.fogCount++;
      }
      // Skip rate-based spawn for fog and move to next emitter
      return;
    }
    for (let i = 0; i < n; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * st.cfg.spread;
      const speed = rand(st.cfg.speed[0], st.cfg.speed[1]);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed + st.cfg.gravity;
      const px = st.center.x + (Math.random() - 0.5) * st.center.w * 0.8;
      const py = st.center.y + (Math.random() - 0.5) * st.center.h * 0.6;
      parts.push({
        x: px, y: py, vx, vy,
        life: rand(st.cfg.life[0], st.cfg.life[1]),
        t: 0,
        size: rand(st.cfg.size[0], st.cfg.size[1]),
        color: pick(st.cfg.color),
        renderer: st.cfg.renderer || 'dot',  // NEW 
        phase: Math.random() * Math.PI * 2   // NEW
      });
    }
  });
}

  let last = performance.now();
  function tick(now){
    const dt = Math.min(0.05, (now-last)/1000); // clamp for stability
    last = now;

    // Clear
    ctx.clearRect(0,0,cvs.width, cvs.height);

    // Spawn and update
    spawn(dt);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.t += dt;
      const u = p.t / p.life;

      if (p.renderer === 'fog') {
        // Recycle instead of removing: continuous cloud
        if (u >= 1) {
          // respawn softly near owner’s bounds
          const st = p.owner;
          if (st && st.el && st.cfg && st.cfg.renderer === 'fog') {
            const c = st.center = ptFromRectCenter(st.el);
            p.t = 0;
            p.life = rand(st.cfg.life[0], st.cfg.life[1]);
            p.size = rand(st.cfg.size[0], st.cfg.size[1]);
            p.x = c.x + (Math.random() - 0.5) * c.w * 0.9;
            p.y = c.y + (Math.random() - 0.2) * c.h * 0.6;
            p.vx = (Math.random() - 0.5) * 2;
            p.vy = -Math.random() * 2 - 0.5;
            p.phase = Math.random() * Math.PI * 2;
            // continue without removing
          } else {
            // fallback remove if owner missing
            parts.splice(i, 1);
            continue;
          }
        }

        // Smooth drift field (sinusoidal): gentle side-to-side + slow rise
        const tsec = performance.now() * 0.001;
        const kx = 0.015, ky = 0.012;      // spatial frequency
        const wx = 0.25, wy = 0.22;        // temporal freq
        const ampX = 10,  ampY = 6;        // drift amplitudes

        const driftX = ampX * Math.sin(p.seed + p.x * kx + tsec * wx);
        const driftY = ampY * Math.cos(p.seed * 0.7 + p.y * ky + tsec * wy) - 6; // overall upward bias

        p.x += (p.vx + driftX) * dt * 0.5;
        p.y += (p.vy + driftY) * dt * 0.5;

        // Soft alpha and size shaping (near-constant)
        const alpha = 0.08; // per puff opacity (keep low; many puffs stack)
        const sz = p.size;

        // Optional blur for creamier fog
        const prevOp = ctx.globalCompositeOperation;
        const prevFilt = ctx.filter;
        ctx.globalCompositeOperation = 'lighter';
        ctx.filter = 'blur(1px)'; // safe; remove if perf-constrained

        // Radial gradient puff
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(1, sz));
        g.addColorStop(0, `rgba(255,255,255,${alpha})`);
        g.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, sz), 0, Math.PI * 2);
        ctx.fill();

        ctx.filter = prevFilt;
        ctx.globalCompositeOperation = prevOp;
      } else {
        // --- default renderer (dots for other effects) ---
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
    ctx.globalAlpha = 1;

    

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

})(); 
