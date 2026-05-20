(function () {
  function parsePositiveInteger(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  function getPageFromHash(pageCount) {
    const match = window.location.hash.match(/^#page-(\d+)$/);
    if (!match) return 0;
    const requested = parsePositiveInteger(match[1], 1) - 1;
    return Math.min(Math.max(requested, 0), pageCount - 1);
  }

  function setPageHash(pageIndex) {
    const nextHash = `#page-${pageIndex + 1}`;
    if (window.location.hash === nextHash) return;
    window.history.replaceState(null, "", nextHash);
  }

  function buildPages(groups, entriesPerPage) {
    const pages = [];
    let currentPage = [];
    let currentCount = 0;

    groups.forEach((group) => {
      const groupCount = parsePositiveInteger(group.dataset.entryCount, 1);
      const wouldOverflow = currentPage.length > 0 && currentCount + groupCount > entriesPerPage;
      if (wouldOverflow) {
        pages.push(currentPage);
        currentPage = [];
        currentCount = 0;
      }

      currentPage.push(group);
      currentCount += groupCount;

      if (currentCount >= entriesPerPage) {
        pages.push(currentPage);
        currentPage = [];
        currentCount = 0;
      }
    });

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    return pages;
  }

  function initNewsPagination() {
    const log = document.querySelector("[data-news-log]");
    const pager = document.querySelector("[data-news-pager]");
    if (!log || !pager) return;

    const groups = Array.from(log.querySelectorAll("[data-news-group]"));
    if (groups.length === 0) return;

    const entriesPerPage = parsePositiveInteger(log.dataset.entriesPerPage, 12);
    const pages = buildPages(groups, entriesPerPage);
    const pageStatus = document.querySelector("[data-news-page-status]");
    const entryStatus = pager.querySelector("[data-news-entry-status]");
    const newerButton = pager.querySelector("[data-news-newer]");
    const olderButton = pager.querySelector("[data-news-older]");
    const totalEntries = groups.reduce((sum, group) => {
      return sum + parsePositiveInteger(group.dataset.entryCount, 1);
    }, 0);

    if (window.__newsHashHandler) {
      window.removeEventListener("hashchange", window.__newsHashHandler);
      window.__newsHashHandler = null;
    }

    if (pages.length <= 1 || !newerButton || !olderButton || !entryStatus) {
      groups.forEach((group) => {
        group.hidden = false;
      });
      if (pageStatus) pageStatus.textContent = "Showing all entries";
      pager.hidden = true;
      if (newerButton) newerButton.onclick = null;
      if (olderButton) olderButton.onclick = null;
      return;
    }

    let currentPageIndex = getPageFromHash(pages.length);

    function render(updateHash) {
      let startEntry = 1;
      for (let i = 0; i < currentPageIndex; i += 1) {
        startEntry += pages[i].reduce((sum, group) => {
          return sum + parsePositiveInteger(group.dataset.entryCount, 1);
        }, 0);
      }
      const visibleCount = pages[currentPageIndex].reduce((sum, group) => {
        return sum + parsePositiveInteger(group.dataset.entryCount, 1);
      }, 0);
      const endEntry = startEntry + visibleCount - 1;

      groups.forEach((group) => {
        group.hidden = true;
      });
      pages[currentPageIndex].forEach((group) => {
        group.hidden = false;
      });

      const pageText = `Page ${currentPageIndex + 1} of ${pages.length}`;
      if (pageStatus) pageStatus.textContent = pageText;
      entryStatus.textContent = `Showing entries ${startEntry}-${endEntry} of ${totalEntries}`;

      newerButton.disabled = currentPageIndex === 0;
      olderButton.disabled = currentPageIndex === pages.length - 1;
      newerButton.setAttribute("aria-disabled", String(newerButton.disabled));
      olderButton.setAttribute("aria-disabled", String(olderButton.disabled));

      if (updateHash) setPageHash(currentPageIndex);
    }

    newerButton.onclick = () => {
      if (currentPageIndex === 0) return;
      currentPageIndex -= 1;
      render(true);
    };

    olderButton.onclick = () => {
      if (currentPageIndex >= pages.length - 1) return;
      currentPageIndex += 1;
      render(true);
    };

    window.__newsHashHandler = () => {
      currentPageIndex = getPageFromHash(pages.length);
      render(false);
    };
    window.addEventListener("hashchange", window.__newsHashHandler);

    pager.hidden = false;
    render(false);
  }

  window.newsInitPagination = initNewsPagination;
  document.addEventListener("DOMContentLoaded", initNewsPagination);
})();
