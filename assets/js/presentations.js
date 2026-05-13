document.addEventListener('DOMContentLoaded', () => {
  const pageRoot = document.querySelector('[data-presentations-page]');
  if (!pageRoot) return;

  const searchInput = document.getElementById('presentation-search');
  const presentationsContainer = document.getElementById('presentations-list');
  if (!presentationsContainer) return;

  const allPresentations = Array.from(presentationsContainer.querySelectorAll('[data-presentation-card]'));
  const filterButtons = Array.from(document.querySelectorAll('[data-presentation-filter]'));
  const yearSelect = document.getElementById('presentation-year-filter');
  const clearMonthButton = document.getElementById('presentation-month-clear');
  const monthMap = document.getElementById('presentation-month-map');
  const monthMapTitle = document.getElementById('presentation-month-map-title');
  const pagination = document.getElementById('presentation-pagination-controls');
  const emptyNode = document.querySelector('[data-presentations-empty]');
  const perPage = 6;

  let page = 1;
  let currentFilter = 'all';
  let selectedYear = yearSelect ? yearSelect.value : latestPresentationYear();
  let selectedMonth = '';
  let yearFilterActive = false;
  let filteredPresentations = allPresentations.slice();
  const presentationCountsByMonth = new Map();

  function parseDateParts(dateString) {
    const parts = (dateString || '').split('-').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    return { year: parts[0], month: parts[1], day: parts[2] };
  }

  function dateToNumber(dateString) {
    const parts = parseDateParts(dateString);
    if (!parts) return 0;
    return parts.year * 10000 + parts.month * 100 + parts.day;
  }

  function monthToRange(monthString) {
    const parts = (monthString || '').split('-').map(Number);
    if (parts.length !== 2 || parts.some(Number.isNaN)) return null;
    const [year, month] = parts;
    const lastDay = new Date(year, month, 0).getDate();
    return {
      start: year * 10000 + month * 100 + 1,
      end: year * 10000 + month * 100 + lastDay
    };
  }

  function yearToRange(yearString) {
    const year = Number(yearString);
    if (Number.isNaN(year)) return null;
    return {
      start: year * 10000 + 101,
      end: year * 10000 + 1231
    };
  }

  function rangeOverlaps(startString, endString, range) {
    if (!range) return false;
    const start = dateToNumber(startString);
    const end = dateToNumber(endString || startString);
    return start <= range.end && end >= range.start;
  }

  function rangeOverlapsMonth(startString, endString, monthString) {
    return rangeOverlaps(startString, endString, monthToRange(monthString));
  }

  function rangeOverlapsYear(startString, endString, yearString) {
    return rangeOverlaps(startString, endString, yearToRange(yearString));
  }

  function incrementMonth(monthString) {
    presentationCountsByMonth.set(monthString, (presentationCountsByMonth.get(monthString) || 0) + 1);
  }

  allPresentations.forEach(presentation => {
    const startParts = parseDateParts(presentation.dataset.date);
    const endParts = parseDateParts(presentation.dataset.endDate || presentation.dataset.date);
    if (!startParts || !endParts) return;

    const cursor = new Date(startParts.year, startParts.month - 1, 1);
    const end = new Date(endParts.year, endParts.month - 1, 1);
    while (cursor <= end) {
      const monthString = [
        cursor.getFullYear(),
        String(cursor.getMonth() + 1).padStart(2, '0')
      ].join('-');
      incrementMonth(monthString);
      cursor.setMonth(cursor.getMonth() + 1);
    }
  });

  function latestPresentationYear() {
    const firstPresentationDate = allPresentations.find(presentation => presentation.dataset.date)?.dataset.date;
    return firstPresentationDate ? firstPresentationDate.slice(0, 4) : '';
  }

  function updateFilterStates() {
    filterButtons.forEach(button => {
      const active = button.dataset.presentationFilter === currentFilter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function updateDateFilterState() {
    const hasActiveFilters = Boolean(searchInput?.value.trim()) || currentFilter !== 'all' || yearFilterActive || Boolean(selectedMonth);
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
    currentFilter = 'all';
    selectedYear = yearSelect?.dataset.initialYear || latestPresentationYear();
    selectedMonth = '';
    yearFilterActive = false;
    if (yearSelect) yearSelect.value = selectedYear;
    updateFilterStates();
    renderMonthMap();
    applyFilters();
  }

  function applyFilters() {
    const terms = (searchInput ? searchInput.value.toLowerCase() : '').split(/\s+/).filter(Boolean);
    filteredPresentations = allPresentations.filter(presentation => {
      const searchText = (presentation.dataset.searchText || presentation.textContent || '').toLowerCase();
      const searchMatch = terms.every(term => searchText.includes(term));
      const filters = (presentation.dataset.filters || '').split(' ');
      const filterMatch = currentFilter === 'all' || filters.includes(currentFilter);
      const yearMatch = !yearFilterActive || rangeOverlapsYear(presentation.dataset.date, presentation.dataset.endDate, selectedYear);
      const monthMatch = !selectedMonth || rangeOverlapsMonth(presentation.dataset.date, presentation.dataset.endDate, selectedMonth);
      return searchMatch && filterMatch && yearMatch && monthMatch;
    });
    page = 1;
    updateDateFilterState();
    render();
  }

  function render() {
    allPresentations.forEach(presentation => {
      presentation.hidden = true;
      presentation.style.display = 'none';
    });

    const totalPages = Math.max(1, Math.ceil(filteredPresentations.length / perPage));
    filteredPresentations.forEach((presentation, index) => {
      if (index >= (page - 1) * perPage && index < page * perPage) {
        presentation.hidden = false;
        presentation.style.display = '';
      }
    });

    if (emptyNode) {
      emptyNode.hidden = filteredPresentations.length !== 0;
    }
    renderControls(totalPages);
  }

  function renderMonthMap() {
    if (!monthMap) return;
    const year = selectedYear || latestPresentationYear();
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    monthMap.replaceChildren();
    if (monthMapTitle) {
      monthMapTitle.textContent = `${year} Months`;
    }

    monthLabels.forEach((label, index) => {
      const monthNumber = String(index + 1).padStart(2, '0');
      const candidateMonth = `${year}-${monthNumber}`;
      const count = presentationCountsByMonth.get(candidateMonth) || 0;

      if (count > 0) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'presentation-month';
        button.dataset.month = candidateMonth;
        button.setAttribute('aria-label', `${count} presentation${count === 1 ? '' : 's'} in ${label} ${year}`);
        button.setAttribute('aria-pressed', selectedMonth === candidateMonth ? 'true' : 'false');
        button.classList.toggle('is-selected', selectedMonth === candidateMonth);
        button.textContent = label;

        const monthCount = document.createElement('span');
        monthCount.className = 'presentation-month-count';
        monthCount.textContent = count;
        button.append(monthCount);

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
        empty.className = 'presentation-month-empty';
        empty.textContent = label;
        empty.setAttribute('aria-disabled', 'true');
        monthMap.append(empty);
      }
    });
  }

  function renderControls(total) {
    if (!pagination) return;
    pagination.innerHTML = '';
    pagination.setAttribute('role', 'navigation');
    pagination.setAttribute('aria-label', 'Presentation pagination');

    function goToPage(nextPage) {
      page = nextPage;
      render();
      pageRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    status.className = 'presentation-pagination-status';
    status.textContent = `Page ${page} of ${total}`;

    pagination.append(
      btn('First', 'First page', page === 1, () => { goToPage(1); }),
      btn('Previous', 'Previous page', page === 1, () => { goToPage(page - 1); }),
      status,
      btn('Next', 'Next page', page === total, () => { goToPage(page + 1); }),
      btn('Last', 'Last page', page === total, () => { goToPage(total); })
    );
  }

  filterButtons.forEach(button => {
    button.setAttribute('aria-pressed', button.dataset.presentationFilter === currentFilter ? 'true' : 'false');
    button.addEventListener('click', event => {
      event.preventDefault();
      currentFilter = button.dataset.presentationFilter;
      updateFilterStates();
      applyFilters();
    });
  });

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      selectedYear = yearSelect.value || yearSelect.dataset.initialYear || latestPresentationYear();
      selectedMonth = '';
      yearFilterActive = Boolean(yearSelect.value);
      renderMonthMap();
      applyFilters();
    });
  }
  if (clearMonthButton) {
    clearMonthButton.addEventListener('click', resetFilters);
  }

  updateFilterStates();
  renderMonthMap();
  applyFilters();
});
