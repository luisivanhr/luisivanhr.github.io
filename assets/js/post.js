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
  }

  const shareBtn = document.getElementById('share-btn');
  const shareLinks = document.getElementById('share-links');
  if (shareBtn && shareLinks) {
    const url = encodeURIComponent(window.location.href);
    const titleEl = document.querySelector('.post-header h1');
    const text = encodeURIComponent(titleEl ? titleEl.textContent : document.title);

    const targets = {
      x:       `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin:`https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook:`https://www.facebook.com/sharer/sharer.php?u=${url}`,
      gmail:   `https://mail.google.com/mail/?view=cm&fs=1&su=${text}&body=${url}`,
      whatsapp:`https://api.whatsapp.com/send?text=${text}%20${url}`,
      line:    `https://social-plugins.line.me/lineit/share?url=${url}`
    };
    Object.entries(targets).forEach(([id, href]) => {
      const a = document.getElementById(`share-${id}`);
      if (a) a.href = href;
    });

    shareBtn.addEventListener('click', () => {
      shareLinks.hidden = !shareLinks.hidden;
      shareBtn.setAttribute('aria-expanded', String(!shareLinks.hidden));
    });

    shareLinks.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (link) {
        window.open(link.href, '_blank', 'noopener');
        e.preventDefault();
        shareLinks.hidden = true;
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