document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('post-search');
  const postsContainer = document.getElementById('posts-list');
  if (!postsContainer) return;
  const allPosts = Array.from(postsContainer.children);
  const categoryButtons = document.querySelectorAll('[data-category]');
  const monthInput = document.getElementById('blog-month-filter');
  const clearMonthButton = document.getElementById('blog-month-clear');
  const calendar = document.getElementById('blog-calendar');
  const calendarTitle = document.getElementById('blog-calendar-title');
  const pagination = document.getElementById('pagination-controls');
  const perPage = 6;
  let page = 1;
  let currentCategory = 'all';
  let calendarMonth = monthInput ? monthInput.value : '';
  let dateFilterActive = false;
  let currentDay = '';
  let filteredPosts = allPosts.slice();
  const postCountsByDate = new Map();

  allPosts.forEach(post => {
    const date = post.dataset.date;
    if (!date) return;
    postCountsByDate.set(date, (postCountsByDate.get(date) || 0) + 1);
  });

  function latestPostMonth() {
    if (calendarMonth) return calendarMonth;
    const firstPostDate = allPosts.find(post => post.dataset.month)?.dataset.month;
    return firstPostDate || '';
  }

  function applyFilters() {
    const term = searchInput ? searchInput.value.toLowerCase() : '';
    filteredPosts = allPosts.filter(p => {
      const textMatch = p.textContent.toLowerCase().includes(term);
      const cats = (p.dataset.categories || '').split(' ');
      const catMatch = currentCategory === 'all' || cats.includes(currentCategory);
      const monthMatch = !dateFilterActive || Boolean(currentDay) || p.dataset.month === calendarMonth;
      const dayMatch = !currentDay || p.dataset.date === currentDay;
      return textMatch && catMatch && monthMatch && dayMatch;
    });
    page = 1;
    updateDateFilterState();
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

  function updateCategoryStates() {
    categoryButtons.forEach(btn => {
      const active = btn.dataset.category === currentCategory;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function updateDateFilterState() {
    if (clearMonthButton) {
      clearMonthButton.disabled = !dateFilterActive;
      clearMonthButton.classList.toggle('is-active', dateFilterActive);
    }
    if (monthInput) {
      monthInput.classList.toggle('is-active', dateFilterActive && !currentDay);
    }
  }

  function formatMonthLabel(monthString) {
    const parts = monthString.split('-').map(Number);
    if (parts.length !== 2 || parts.some(Number.isNaN)) return 'Calendar';
    return new Date(parts[0], parts[1] - 1, 1).toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric'
    });
  }

  function renderCalendar() {
    if (!calendar) return;
    const monthString = calendarMonth || latestPostMonth();
    const parts = monthString.split('-').map(Number);
    calendar.replaceChildren();
    if (parts.length !== 2 || parts.some(Number.isNaN)) return;

    const [year, month] = parts;
    const monthIndex = month - 1;
    const firstDay = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const leadingEmptyCells = (firstDay.getDay() + 6) % 7;
    const weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    if (calendarTitle) {
      calendarTitle.textContent = formatMonthLabel(monthString);
    }

    weekdayLabels.forEach(label => {
      const weekday = document.createElement('span');
      weekday.className = 'calendar-weekday';
      weekday.textContent = label;
      calendar.append(weekday);
    });

    for (let i = 0; i < leadingEmptyCells; i += 1) {
      const empty = document.createElement('span');
      empty.className = 'calendar-empty';
      empty.setAttribute('aria-hidden', 'true');
      calendar.append(empty);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateString = `${monthString}-${String(day).padStart(2, '0')}`;
      const count = postCountsByDate.get(dateString) || 0;
      if (count > 0) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'calendar-day has-posts';
        button.dataset.date = dateString;
        button.setAttribute('aria-label', `${count} post${count === 1 ? '' : 's'} on ${dateString}`);
        button.setAttribute('aria-pressed', currentDay === dateString ? 'true' : 'false');
        button.classList.toggle('is-selected', currentDay === dateString);

        const number = document.createElement('span');
        number.className = 'calendar-number';
        number.textContent = day;
        button.append(number);

        const postCount = document.createElement('span');
        postCount.className = 'calendar-post-count';
        postCount.textContent = count;
        button.append(postCount);

        button.addEventListener('click', () => {
          currentDay = currentDay === dateString ? '' : dateString;
          dateFilterActive = true;
          renderCalendar();
          applyFilters();
        });
        calendar.append(button);
      } else {
        const mutedDay = document.createElement('span');
        mutedDay.className = 'calendar-day is-muted';
        mutedDay.textContent = day;
        mutedDay.setAttribute('aria-disabled', 'true');
        calendar.append(mutedDay);
      }
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
    btn.setAttribute('aria-pressed', btn.dataset.category === currentCategory ? 'true' : 'false');
    btn.addEventListener('click', e => {
      e.preventDefault();
      currentCategory = btn.dataset.category;
      updateCategoryStates();
      applyFilters();
    });
  });

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (monthInput) {
    monthInput.addEventListener('change', () => {
      calendarMonth = monthInput.value || monthInput.dataset.initialMonth || latestPostMonth();
      currentDay = '';
      dateFilterActive = Boolean(monthInput.value);
      renderCalendar();
      applyFilters();
    });
  }
  if (clearMonthButton) {
    clearMonthButton.addEventListener('click', () => {
      currentDay = '';
      dateFilterActive = false;
      renderCalendar();
      applyFilters();
    });
  }
  updateCategoryStates();
  renderCalendar();
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
