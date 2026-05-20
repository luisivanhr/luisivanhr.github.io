document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('post-search');
  const postsContainer = document.getElementById('posts-list');
  if (!postsContainer) return;

  const allPosts = Array.from(postsContainer.children);
  const categoryButtons = Array.from(document.querySelectorAll('[data-category]'));
  const yearSelect = document.getElementById('blog-year-filter');
  const clearMonthButton = document.getElementById('blog-month-clear');
  const monthMap = document.getElementById('blog-month-map');
  const monthMapTitle = document.getElementById('blog-month-map-title');
  const pagination = document.getElementById('pagination-controls');
  const perPage = 6;

  let page = 1;
  let currentCategory = 'all';
  let selectedYear = yearSelect ? yearSelect.value : latestPostYear();
  let selectedMonth = '';
  let yearFilterActive = false;
  let filteredPosts = allPosts.slice();
  const postCountsByMonth = new Map();

  allPosts.forEach(post => {
    const month = post.dataset.month;
    if (!month) return;
    postCountsByMonth.set(month, (postCountsByMonth.get(month) || 0) + 1);
  });

  function latestPostYear() {
    const firstPostDate = allPosts.find(post => post.dataset.date)?.dataset.date;
    return firstPostDate ? firstPostDate.slice(0, 4) : '';
  }

  function updateCategoryStates() {
    categoryButtons.forEach(btn => {
      const active = btn.dataset.category === currentCategory;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function updateDateFilterState() {
    const hasActiveFilters = Boolean(searchInput?.value.trim()) || currentCategory !== 'all' || yearFilterActive || Boolean(selectedMonth);
    if (clearMonthButton) {
      clearMonthButton.disabled = !hasActiveFilters;
      clearMonthButton.classList.toggle('is-active', hasActiveFilters);
    }
    if (yearSelect) {
      yearSelect.classList.toggle('is-active', yearFilterActive || Boolean(selectedMonth));
    }
  }

  function resetFilters() {
    if (searchInput) searchInput.value = '';
    currentCategory = 'all';
    selectedYear = yearSelect?.dataset.initialYear || latestPostYear();
    selectedMonth = '';
    yearFilterActive = false;
    if (yearSelect) yearSelect.value = selectedYear;
    updateCategoryStates();
    renderMonthMap();
    applyFilters();
  }

  function applyFilters() {
    const terms = (searchInput ? searchInput.value.toLowerCase() : '').split(/\s+/).filter(Boolean);
    filteredPosts = allPosts.filter(post => {
      const text = (post.textContent || '').toLowerCase();
      const textMatch = terms.every(term => text.includes(term));
      const cats = (post.dataset.categories || '').split(' ');
      const catMatch = currentCategory === 'all' || cats.includes(currentCategory);
      const yearMatch = !yearFilterActive || post.dataset.date.slice(0, 4) === selectedYear;
      const monthMatch = !selectedMonth || post.dataset.month === selectedMonth;
      return textMatch && catMatch && yearMatch && monthMatch;
    });
    page = 1;
    updateDateFilterState();
    render();
  }

  function render() {
    allPosts.forEach(post => {
      post.style.display = 'none';
    });

    if (pagination) {
      const totalPages = Math.max(1, Math.ceil(filteredPosts.length / perPage));
      filteredPosts.forEach((post, index) => {
        if (index >= (page - 1) * perPage && index < page * perPage) {
          post.style.display = '';
        }
      });
      renderControls(totalPages);
    } else {
      filteredPosts.forEach(post => {
        post.style.display = '';
      });
    }
  }

  function renderMonthMap() {
    if (!monthMap) return;
    const year = selectedYear || latestPostYear();
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    monthMap.replaceChildren();
    if (monthMapTitle) {
      monthMapTitle.textContent = `${year} Months`;
    }

    monthLabels.forEach((label, index) => {
      const monthNumber = String(index + 1).padStart(2, '0');
      const candidateMonth = `${year}-${monthNumber}`;
      const count = postCountsByMonth.get(candidateMonth) || 0;

      if (count > 0) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'blog-month';
        button.dataset.month = candidateMonth;
        button.setAttribute('aria-label', `${count} post${count === 1 ? '' : 's'} in ${label} ${year}`);
        button.setAttribute('aria-pressed', selectedMonth === candidateMonth ? 'true' : 'false');
        button.classList.toggle('is-selected', selectedMonth === candidateMonth);
        button.textContent = label;

        const postCount = document.createElement('span');
        postCount.className = 'blog-month-count';
        postCount.textContent = count;
        button.append(postCount);

        button.addEventListener('click', () => {
          selectedYear = year;
          selectedMonth = candidateMonth;
          yearFilterActive = true;
          if (yearSelect) yearSelect.value = year;
          renderMonthMap();
          applyFilters();
        });
        monthMap.append(button);
      } else {
        const empty = document.createElement('span');
        empty.className = 'blog-month-empty';
        empty.textContent = label;
        empty.setAttribute('aria-disabled', 'true');
        monthMap.append(empty);
      }
    });
  }

  function renderControls(total) {
    pagination.replaceChildren();
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
    btn.setAttribute('aria-pressed', btn.dataset.category === currentCategory ? 'true' : 'false');
    btn.addEventListener('click', event => {
      event.preventDefault();
      currentCategory = btn.dataset.category;
      updateCategoryStates();
      applyFilters();
    });
  });

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      selectedYear = yearSelect.value || yearSelect.dataset.initialYear || latestPostYear();
      selectedMonth = '';
      yearFilterActive = Boolean(yearSelect.value);
      renderMonthMap();
      applyFilters();
    });
  }
  if (clearMonthButton) {
    clearMonthButton.addEventListener('click', resetFilters);
  }

  updateCategoryStates();
  renderMonthMap();
  applyFilters();

  const container = document.querySelector('.blog-container');
  function resizeLayout() {
    if (!container) return;
    const mobileLandscape = window.innerHeight <= 560 && window.innerWidth <= 1180;
    if (window.innerWidth <= 1180 || mobileLandscape) {
      container.classList.add('compact');
    } else {
      container.classList.remove('compact');
    }
  }
  resizeLayout();
  window.addEventListener('resize', resizeLayout);
});
