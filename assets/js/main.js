
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
  // renderer tells the draw loop to use a soft radial-gradient "dust" look
  renderer: 'dust',
  color: '#ffffff',
  gravity: -8,           // drift upward
  spread: 1.2,           // wider angular spread
  size: [6, 16],         // bigger, soft puffs
  life: [1.2, 2.2],      // longer lived
  rateIdle: 8,           // gentle idle haze
  rateHover: 120,        // dense dust on hover
  speed: [5, 18]         // slow initial velocity
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
    const state = { el:h, cfg, hover:false, burst:0, center: ptFromRectCenter(h), accum: 0 };
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
    for (let i=parts.length-1; i>=0; i--){
      // fraction of life lived
      const u = p.t / p.life;
      if (u >= 1){ parts.splice(i,1); continue; }

      // move
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // size & fade
      const sz = p.size * (0.7 + 0.6 * u * (1 - u));
      const alpha = 1 - u;

      if (p.renderer === 'dust') {
        // wobble for smoky waft
        p.phase += dt * 2.5;
        p.x += Math.sin(p.phase) * 12 * dt;

        // additive blend
        const prevOp = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = 'lighter';

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz);
        g.addColorStop(0, `rgba(255,255,255,${0.35 * alpha})`);
        g.addColorStop(1, `rgba(255,255,255,0)`);

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalCompositeOperation = prevOp;
      } else {
        // default solid dot
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, sz * 0.6), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

})(); 
