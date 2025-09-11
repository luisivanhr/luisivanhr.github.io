document.addEventListener('DOMContentLoaded', function() {
  const nav = document.getElementById('post-nav');
  const content = document.querySelector('.post-content');
  const sidebar = document.querySelector('.post-sidebar');
  const navToggle = document.getElementById('post-nav-toggle');
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
      if (window.innerWidth <= 700 && sidebar && navToggle) {
        sidebar.classList.remove('show');
        sidebar.classList.add('hide');
        navToggle.textContent = '▶';
        navToggle.setAttribute('aria-label', 'Show navigation');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const shareBtn = document.getElementById('share-btn');
  const shareLinks = document.getElementById('share-links');
  if (shareBtn && shareLinks) {
    const url = encodeURIComponent(window.location.href);
    const titleEl = document.querySelector('.post-header h1');
    const metaImage = document.querySelector('meta[property="og:image"]');
    const rawTitle = titleEl ? titleEl.textContent : document.title;
    const text = encodeURIComponent(rawTitle);
    const image = encodeURIComponent(metaImage ? metaImage.getAttribute('content') : '');

    const targets = {
      x:       `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin:`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}` + (image ? `&source=${image}` : ''),
      facebook:`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}` + (image ? `&picture=${image}` : ''),
      gmail:   `https://mail.google.com/mail/?view=cm&fs=1&su=${text}&body=${url}`
    };
    Object.entries(targets).forEach(([id, href]) => {
      const a = document.getElementById(`share-${id}`);
      if (a) {
        a.href = '#';
        a.dataset.href = href;
      }
    });

    const shareNative = document.getElementById('share-native');
    if (shareNative) {
      if (navigator.share) {
        shareNative.addEventListener('click', async e => {
          e.preventDefault();
          e.stopPropagation();
          try {
            await navigator.share({ title: rawTitle, text: rawTitle, url: window.location.href });
          } catch (err) {
            console.error('Share failed', err);
          }
          shareLinks.classList.remove('open');
          shareBtn.setAttribute('aria-expanded', 'false');
        });
      } else {
        shareNative.style.display = 'none';
      }
    }

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

  function resizePost() {
    if (!sidebar || !navToggle) return;
    if (window.innerWidth <= 700) {
      sidebar.classList.add('hide');
      sidebar.classList.remove('show');
      navToggle.style.display = 'block';
      navToggle.textContent = '▶';
      navToggle.setAttribute('aria-label', 'Show navigation');
      navToggle.setAttribute('aria-expanded', 'false');
    } else {
      sidebar.classList.remove('hide', 'show');
      navToggle.style.display = 'none';
    }
  }
  resizePost();
  window.addEventListener('resize', resizePost);

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
        sidebar.classList.add('hide');
        navToggle.textContent = '▶';
        navToggle.setAttribute('aria-label', 'Show navigation');
        navToggle.setAttribute('aria-expanded', 'false');
      } else {
        sidebar.classList.add('show');
        sidebar.classList.remove('hide');
        navToggle.textContent = '◀';
        navToggle.setAttribute('aria-label', 'Hide navigation');
        navToggle.setAttribute('aria-expanded', 'true');
      }
    });
  }
});