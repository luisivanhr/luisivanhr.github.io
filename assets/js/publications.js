document.addEventListener('DOMContentLoaded', () => {
  const pageRoot = document.querySelector('[data-publications-page]');
  if (!pageRoot) return;

  const searchInput = document.getElementById('publication-search');
  const categorySelect = document.getElementById('publication-category-filter');
  const yearSelect = document.getElementById('publication-year-filter');
  const resetYearButton = document.getElementById('publication-year-clear');
  const publicationsContainer = document.getElementById('publications-list');
  const pagination = document.getElementById('publication-pagination-controls');
  const emptyNode = document.querySelector('[data-publications-empty]');
  const countNode = document.querySelector('[data-publication-count]');
  if (!publicationsContainer) return;

  const allPublications = Array.from(publicationsContainer.querySelectorAll('[data-publication-card]'));
  const perPage = 8;
  const urlFilters = window.SiteUrlFilters;
  let page = 1;
  let filteredPublications = allPublications.slice();
  let searchState = urlFilters.parseSearchValue(searchInput ? searchInput.value : '');

  function updateResetYearState() {
    const hasYear = Boolean(yearSelect?.value);
    if (resetYearButton) {
      resetYearButton.disabled = !hasYear;
      resetYearButton.classList.toggle('is-active', hasYear);
    }
    if (yearSelect) {
      yearSelect.classList.toggle('is-active', hasYear);
    }
  }

  function applyFilters() {
    const selectedCategory = categorySelect?.value || 'all';
    const selectedYear = yearSelect?.value || '';

    filteredPublications = allPublications.filter(publication => {
      const searchTarget = searchState.exact
        ? publication.dataset.title
        : publication.dataset.searchText || publication.textContent;
      const searchMatch = urlFilters.matchesText(searchTarget || '', searchState);
      const categoryMatch = selectedCategory === 'all' || publication.dataset.category === selectedCategory;
      const yearMatch = !selectedYear || publication.dataset.year === selectedYear;
      return searchMatch && categoryMatch && yearMatch;
    });

    page = 1;
    updateResetYearState();
    render();
  }

  function render() {
    allPublications.forEach(publication => {
      publication.hidden = true;
      publication.style.display = 'none';
    });

    const totalPages = Math.max(1, Math.ceil(filteredPublications.length / perPage));
    filteredPublications.forEach((publication, index) => {
      if (index >= (page - 1) * perPage && index < page * perPage) {
        publication.hidden = false;
        publication.style.display = '';
      }
    });

    if (emptyNode) {
      emptyNode.hidden = filteredPublications.length !== 0;
    }
    if (countNode) {
      countNode.textContent = `Showing ${filteredPublications.length} ${filteredPublications.length === 1 ? 'publication' : 'publications'}`;
    }
    renderControls(totalPages);
  }

  function renderControls(total) {
    if (!pagination) return;
    pagination.replaceChildren();
    if (total <= 1) return;

    pagination.setAttribute('role', 'navigation');
    pagination.setAttribute('aria-label', 'Publication pagination');

    function goToPage(nextPage) {
      page = nextPage;
      render();
      pageRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function makeButton(label, ariaLabel, disabled, handler) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.setAttribute('aria-label', ariaLabel);
      button.disabled = disabled;
      button.addEventListener('click', handler);
      return button;
    }

    const status = document.createElement('span');
    status.className = 'publications-pagination-status';
    status.textContent = `Page ${page} of ${total}`;

    pagination.append(
      makeButton('First', 'First page', page === 1, () => { goToPage(1); }),
      makeButton('Previous', 'Previous page', page === 1, () => { goToPage(page - 1); }),
      status,
      makeButton('Next', 'Next page', page === total, () => { goToPage(page + 1); }),
      makeButton('Last', 'Last page', page === total, () => { goToPage(total); })
    );
  }

  function resetYear() {
    if (!yearSelect) return;
    yearSelect.value = '';
    applyFilters();
  }

  function applyInitialUrlFilters() {
    const initialSearch = urlFilters.getSearchParam('q');
    if (initialSearch.query && searchInput) {
      searchInput.value = initialSearch.query;
      searchState = initialSearch;
    }

    urlFilters.selectOption(categorySelect, urlFilters.getParam('category'));
    urlFilters.selectOption(yearSelect, urlFilters.getParam('year'));
  }

  pageRoot.addEventListener('click', event => {
    const toggle = event.target.closest('.publication-summary-toggle');
    if (!toggle) return;

    const targetId = toggle.getAttribute('aria-controls');
    const panel = targetId ? document.getElementById(targetId) : null;
    if (!panel) return;

    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    toggle.querySelector('span').textContent = isExpanded ? 'Show summary' : 'Hide summary';
    panel.hidden = isExpanded;

    if (!isExpanded) {
      const card = toggle.closest('[data-publication-card]');
      window.requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const targetTop = window.scrollY + rect.top - Math.max(72, Math.round(window.innerHeight * 0.16));
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth'
        });
      });
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchState = urlFilters.parseSearchValue(searchInput.value);
      applyFilters();
    });
  }
  if (categorySelect) categorySelect.addEventListener('change', applyFilters);
  if (yearSelect) yearSelect.addEventListener('change', applyFilters);
  if (resetYearButton) resetYearButton.addEventListener('click', resetYear);

  applyInitialUrlFilters();
  applyFilters();
});
