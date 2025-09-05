document.addEventListener('DOMContentLoaded', function() {
  const nav = document.getElementById('post-nav');
  const content = document.querySelector('.post-content');
  const sidebar = document.querySelector('.post-sidebar');
  const navToggle = document.getElementById('post-nav-toggle');

  // --- Table of Contents Generation ---
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

    // Smooth scrolling with offset for fixed header
    nav.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (!link || !link.hash) return;
      e.preventDefault();
      const target = document.getElementById(link.hash.slice(1));
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      // Hide sidebar on mobile after clicking a link
      if (window.innerWidth <= 700 && sidebar && navToggle) {
        sidebar.classList.remove('show');
        sidebar.classList.add('hide');
        navToggle.textContent = '▶';
        navToggle.setAttribute('aria-label', 'Show navigation');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Share Functionality ---
  const shareBtn = document.getElementById('share-btn');
  const shareLinks = document.getElementById('share-links');

  if (shareBtn && shareLinks) {
    const url = encodeURIComponent(window.location.href);
    const titleEl = document.querySelector('.post-header h1');
    const metaImage = document.querySelector('meta[property="og:image"]');
    const rawTitle = titleEl ? titleEl.textContent : document.title;
    const text = encodeURIComponent(rawTitle);
    const image = encodeURIComponent(metaImage ? metaImage.getAttribute('content') : '');

    // Define share targets
    const targets = {
      // These platforms generate a preview card with an image by crawling the shared URL.
      // They do not support passing an image URL directly as a parameter.
      x:        `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      whatsapp: `https://api.whatsapp.com/send?text=${text}%20${url}`,
      line:     `https://social-plugins.line.me/lineit/share?url=${url}`,
      
      // These platforms allow specifying an image URL directly.
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}` + (image ? `&source=${image}` : ''),
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}` + (image ? `&picture=${image}` : ''),
      
      // Gmail does not support embedding images via URL parameters.
      gmail:    `https://mail.google.com/mail/?view=cm&fs=1&su=${text}&body=${url}`,
    };

    Object.entries(targets).forEach(([id, href]) => {
      const a = document.getElementById(`share-${id}`);
      if (a) {
        a.href = '#';
        a.dataset.href = href;
      }
    });

    // --- Web Share API (Native Share) ---
    const shareNative = document.getElementById('share-native');
    if (shareNative) {
      if (navigator.share) {
        shareNative.addEventListener('click', async e => {
          e.preventDefault();
          e.stopPropagation();

          const shareData = {
            title: rawTitle,
            text: rawTitle,
            url: window.location.href,
          };

          // Resolve the meta image URL to an absolute path
          const imageUrl = metaImage ? new URL(metaImage.getAttribute('content'), window.location.href).href : null;

          // If an image is specified, try to fetch and share it.
          if (imageUrl) {
            try {
              const response = await fetch(imageUrl);
              if (!response.ok) {
                throw new Error('Image fetch failed with status ' + response.status);
              }
              const blob = await response.blob();
              const fileName = `share-image.${blob.type.split('/')[1] || 'jpg'}`;
              const imageFile = new File([blob], fileName, { type: blob.type });

              // When sharing files, some platforms might ignore the 'url' field.
              // To ensure the link is shared, we append it to the 'text' field.
              const fileShareData = {
                ...shareData,
                files: [imageFile],
                text: `${rawTitle}\n\n${window.location.href}`,
              };

              // Check if the browser can share files, then share with image.
              if (navigator.canShare && navigator.canShare(fileShareData)) {
                await navigator.share(fileShareData);
              } else {
                console.warn('File sharing not supported, falling back to URL share.');
                await navigator.share(shareData);
              }
            } catch (err) {
              console.error('Could not share image, falling back to URL only.', err);
              // If any error occurs (network, CORS), share URL only.
              await navigator.share(shareData).catch(shareErr => console.error('Fallback share failed', shareErr));
            }
          } else {
            // If no image meta tag, share URL only.
            try {
              await navigator.share(shareData);
            } catch(err) {
              // This catch block handles the user dismissing the share sheet.
              if (err.name !== 'AbortError') {
                console.error('Share failed', err);
              }
            }
          }

          // Close the share menu
          shareLinks.classList.remove('open');
          shareBtn.setAttribute('aria-expanded', 'false');
        });
      } else {
        // Hide native share button if API is not supported.
        shareNative.style.display = 'none';
      }
    }

    // Toggle share links visibility
    shareBtn.addEventListener('click', () => {
      shareLinks.classList.toggle('open');
      shareBtn.setAttribute('aria-expanded', String(shareLinks.classList.contains('open')));
    });

    // Open share links in a new window
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

  // --- Copy to Clipboard ---
  const shareCopy = document.getElementById('share-copy');
  if (shareCopy) {
    shareCopy.addEventListener('click', function() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        // Optional: Provide user feedback
        const originalText = shareCopy.innerHTML;
        shareCopy.innerHTML = 'Copied!';
        setTimeout(() => {
            shareCopy.innerHTML = originalText;
        }, 1500);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }

  // --- Responsive Sidebar Toggle ---
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