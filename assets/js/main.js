
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

})(); 
