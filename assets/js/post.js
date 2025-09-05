document.addEventListener('DOMContentLoaded', function() {
  const nav = document.getElementById('post-nav');
  const content = document.querySelector('.post-content');
  if (nav && content) {
    const headings = content.querySelectorAll('h2, h3');
    if (headings.length > 0) {
      const ul = document.createElement('ul');
      headings.forEach(h => {
        const id = h.id || h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-');
        h.id = id;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = h.textContent;
        a.href = '#' + id;
        a.classList.add('nav-btn');
        li.appendChild(a);
        ul.appendChild(li);
      });
      nav.appendChild(ul);
    }
    // smooth scrolling with offset for fixed header
    nav.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (!link || !link.hash) return;
      e.preventDefault();
      const target = document.getElementById(link.hash.slice(1));
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  }

  const shareBtn = document.getElementById('share-btn');
  const shareLinks = document.getElementById('share-links');
  if (shareBtn && shareLinks) {
    const url = encodeURIComponent(window.location.href);
    const titleEl = document.querySelector('.post-header h1');
    const metaImage = document.querySelector('meta[property="og:image"]');
    const text = encodeURIComponent(titleEl ? titleEl.textContent : document.title);
    const image = encodeURIComponent(metaImage ? metaImage.getAttribute('content') : '');

    const targets = {
      x:       `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin:`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}` + (image ? `&source=${image}` : ''),
      facebook:`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}` + (image ? `&picture=${image}` : ''),
      gmail:   `https://mail.google.com/mail/?view=cm&fs=1&su=${text}&body=${url}`,
      whatsapp:`https://api.whatsapp.com/send?text=${text}%20${url}`,
      line:    `https://social-plugins.line.me/lineit/share?url=${url}`,
      slack:   `https://slack.com/intl/en-gb/share?url=${url}&text=${text}`,
      discord: `https://discord.com/channels/@me?url=${url}`
    };
    Object.entries(targets).forEach(([id, href]) => {
      const a = document.getElementById(`share-${id}`);
      if (a) {
        a.href = '#';
        a.dataset.href = href;
      }
    });

    shareBtn.addEventListener('click', () => {
      shareLinks.classList.toggle('open');
      shareBtn.setAttribute('aria-expanded', String(shareLinks.classList.contains('open')));
    });

    shareLinks.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (link && link.dataset.href) {
        e.preventDefault();
        e.stopPropagation();
        window.open(link.dataset.href, '_blank', 'noopener');
        shareLinks.classList.remove('open');
        shareBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
  const shareCopy = document.getElementById('share-copy');
  if (shareCopy) {
    shareCopy.addEventListener('click', function() {
      navigator.clipboard.writeText(window.location.href);
    });
  }

  // dynamic layout resize similar to main.js
  const body = document.querySelector('.post-body');
  function resizePost() {
    if (!body) return;
    if (window.innerWidth <= 700) {
      body.classList.add('compact');
    } else {
      body.classList.remove('compact');
    }
  }
  resizePost();
  window.addEventListener('resize', resizePost);
});