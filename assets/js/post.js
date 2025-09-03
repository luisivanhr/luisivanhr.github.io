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
        li.appendChild(a);
        ul.appendChild(li);
      });
      nav.appendChild(ul);
    }
  }

  const shareBtn = document.getElementById('share-btn');
  const shareLinks = document.getElementById('share-links');
  if (shareBtn && shareLinks) {
    shareBtn.addEventListener('click', function() {
      shareLinks.hidden = !shareLinks.hidden;
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