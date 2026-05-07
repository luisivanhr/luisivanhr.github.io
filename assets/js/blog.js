document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('post-search');
  const postsContainer = document.getElementById('posts-list');
  if (!postsContainer) return;
  const allPosts = Array.from(postsContainer.children);
  const categoryButtons = document.querySelectorAll('.categories-panel [data-category]');
  const pagination = document.getElementById('pagination-controls');
  const perPage = 6;
  let page = 1;
  let currentCategory = 'all';
  let filteredPosts = allPosts.slice();

  function applyFilters() {
    const term = searchInput ? searchInput.value.toLowerCase() : '';
    filteredPosts = allPosts.filter(p => {
      const textMatch = p.textContent.toLowerCase().includes(term);
      const cats = (p.dataset.categories || '').split(' ');
      const catMatch = currentCategory === 'all' || cats.includes(currentCategory);
      return textMatch && catMatch;
    });
    page = 1;
    render();
  }

  function render() {
    allPosts.forEach(p => p.style.display = 'none');
    if (pagination) {
      const totalPages = Math.max(1, Math.ceil(filteredPosts.length / perPage));
      filteredPosts.forEach((p, i) => {
        if (i >= (page - 1) * perPage && i < page * perPage) {
          p.style.display = '';
        }
      });
      renderControls(totalPages);
    } else {
      filteredPosts.forEach(p => p.style.display = '');
    }
  }

  function renderControls(total) {
    pagination.innerHTML = '';
    pagination.setAttribute('role', 'navigation');
    pagination.setAttribute('aria-label', 'Blog pagination');

    function goToPage(nextPage) {
      page = nextPage;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function btn(label, ariaLabel, disabled, handler) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.setAttribute('aria-label', ariaLabel);
      b.disabled = disabled;
      b.addEventListener('click', handler);
      return b;
    }

    const status = document.createElement('span');
    status.className = 'pagination-status';
    status.textContent = `Page ${page} of ${total}`;

    pagination.append(
      btn('First', 'First page', page === 1, () => { goToPage(1); }),
      btn('Previous', 'Previous page', page === 1, () => { goToPage(page - 1); }),
      status,
      btn('Next', 'Next page', page === total, () => { goToPage(page + 1); }),
      btn('Last', 'Last page', page === total, () => { goToPage(total); })
    );
  }

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      currentCategory = btn.dataset.category;
      applyFilters();
    });
  });

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  applyFilters();

  const container = document.querySelector('.blog-container');
  function resizeLayout() {
    if (!container) return;
    if (window.innerWidth <= 700) {
      container.classList.add('compact');
    } else {
      container.classList.remove('compact');
    }
  }
  resizeLayout();
  window.addEventListener('resize', resizeLayout);
});
