(function(){
  const btn = document.getElementById('nav-toggle');
  const list = document.getElementById('nav-list');
  if (!btn || !list) return;

  const saved = localStorage.getItem('navOpen') === '1';
  if (saved) {
    list.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  }

  const toggle = () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    const next = !open;
    btn.setAttribute('aria-expanded', String(next));
    list.hidden = !next;
    try { localStorage.setItem('navOpen', next ? '1' : '0'); } catch(_) {}
  };

  btn.addEventListener('click', toggle);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });

  if (!saved) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      if (!reduce) {
        btn.animate([{transform:'translateY(0)'},{transform:'translateY(2px)'},{transform:'translateY(0)'}], {duration:500,iterations:1});
      }
    }, 1200);
  }
})();
