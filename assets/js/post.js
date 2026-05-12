document.addEventListener('DOMContentLoaded', function() {
  const nav = document.getElementById('post-nav');
  const content = document.querySelector('.post-content');
  const sidebar = document.querySelector('.post-sidebar');
  const navToggle = document.getElementById('post-nav-toggle');
  const showNavIcon = '\u25c0';
  const hideNavIcon = '\u25b6';
  const sidebarCollapseQuery = window.matchMedia('(max-width: 1024px)');

  async function writeClipboardText(value) {
    if (!navigator.clipboard || !window.isSecureContext) return false;
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (err) {
      console.error('Copy failed', err);
      return false;
    }
  }

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
      if (isSidebarCollapsible()) {
        setSidebarOpen(false);
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
      //whatsapp:`https://api.whatsapp.com/send?text=${text}%20${url}`,
      //line:    `https://social-plugins.line.me/lineit/share?url=${url}`
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
    shareCopy.addEventListener('click', async function() {
      await writeClipboardText(window.location.href);
    });
  }

  const citationCopy = document.getElementById('citation-copy');
  if (citationCopy) {
    const originalLabel = citationCopy.textContent;
    citationCopy.addEventListener('click', async function() {
      try {
        const copied = await writeClipboardText(citationCopy.dataset.citation || '');
        if (!copied) throw new Error('Copy command was rejected');
        citationCopy.textContent = 'Citation copied';
        window.setTimeout(() => {
          citationCopy.textContent = originalLabel;
        }, 1600);
      } catch (err) {
        console.error('Citation copy failed', err);
      }
    });
  }

  function isSidebarCollapsible() {
    return sidebarCollapseQuery.matches;
  }

  function setSidebarOpen(isOpen) {
    if (!sidebar || !navToggle) return;
    sidebar.classList.toggle('show', isOpen);
    sidebar.classList.toggle('hide', !isOpen);
    navToggle.textContent = isOpen ? hideNavIcon : showNavIcon;
    navToggle.setAttribute('aria-label', isOpen ? 'Hide navigation' : 'Show navigation');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  function resizePost() {
    if (!sidebar || !navToggle) return;
    if (isSidebarCollapsible()) {
      navToggle.style.display = 'block';
      setSidebarOpen(false);
    } else {
      sidebar.classList.remove('hide', 'show');
      navToggle.style.display = 'none';
      navToggle.textContent = showNavIcon;
      navToggle.setAttribute('aria-label', 'Show navigation');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  resizePost();
  window.addEventListener('resize', resizePost);

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      setSidebarOpen(!sidebar.classList.contains('show'));
    });
  }

  document.addEventListener('click', e => {
    if (!isSidebarCollapsible() || !sidebar || !navToggle || !sidebar.classList.contains('show')) return;
    if (sidebar.contains(e.target) || navToggle.contains(e.target)) return;
    setSidebarOpen(false);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isSidebarCollapsible() && sidebar && sidebar.classList.contains('show')) {
      setSidebarOpen(false);
    }
  });
});
