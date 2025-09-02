document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('post-search');
  const postsContainer = document.getElementById('posts-list');
  if (!postsContainer) return;
  const allPosts = Array.from(postsContainer.children);
  let filteredPosts = allPosts.slice();
  const pagination = document.getElementById('pagination-controls');
  const perPage = 5;
  let page = 1;

  function filterPosts() {
    const term = searchInput ? searchInput.value.toLowerCase() : '';
    filteredPosts = allPosts.filter(p => p.textContent.toLowerCase().includes(term));
    page = 1;
    render();
  }

  function render() {
    if (pagination) {
      const totalPages = Math.max(1, Math.ceil(filteredPosts.length / perPage));
      filteredPosts.forEach((p, i) => {
        p.style.display = (i >= (page - 1) * perPage && i < page * perPage) ? '' : 'none';
      });
      renderControls(totalPages);
    } else {
      filteredPosts.forEach(p => p.style.display = '');
    }
  }

  function renderControls(total) {
    pagination.innerHTML = '';
    function btn(label, disabled, handler) {
      const b = document.createElement('button');
      b.textContent = label;
      b.disabled = disabled;
      b.addEventListener('click', handler);
      return b;
    }
    pagination.append(
      btn('First', page === 1, () => { page = 1; render(); }),
      btn('Prev', page === 1, () => { page--; render(); }),
      document.createTextNode(` Page ${page} of ${total} `),
      btn('Next', page === total, () => { page++; render(); }),
      btn('Last', page === total, () => { page = total; render(); })
    );
  }

  if (searchInput) searchInput.addEventListener('input', filterPosts);
  filterPosts();
});