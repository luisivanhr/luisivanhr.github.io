(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var page = document.querySelector("[data-models-page]");
    if (!page) return;

    var rows = Array.prototype.slice.call(page.querySelectorAll("[data-model-row]"));
    var details = Array.prototype.slice.call(page.querySelectorAll("[data-model-detail]"));
    var searchInput = page.querySelector("#model-search");
    var filterButtons = Array.prototype.slice.call(page.querySelectorAll("[data-model-filter]"));
    var sortSelect = page.querySelector("#model-sort");
    var listBody = page.querySelector("[data-model-list]");
    var countNode = page.querySelector("[data-model-count]");
    var emptyNode = page.querySelector("[data-model-empty]");
    var detailPane = page.querySelector("[data-model-detail-pane]");
    var browseButtons = Array.prototype.slice.call(page.querySelectorAll("[data-browse-models]"));
    var listRegion = page.querySelector("#models-list");
    var activeFilter = "all";
    var selectedId = rows[0] ? rows[0].getAttribute("data-model-id") : "";
    var urlFilters = window.SiteUrlFilters;
    var searchState = urlFilters.parseSearchValue(searchInput ? searchInput.value : "");

    function normalize(value) {
      return (value || "").toString().toLowerCase();
    }

    function isMobileDetailFlow() {
      return window.matchMedia("(max-width: 1180px)").matches;
    }

    function visibleRows() {
      return rows.filter(function (row) {
        return !row.hidden;
      });
    }

    function setSelected(modelId, scrollToDetail) {
      selectedId = modelId;

      rows.forEach(function (row) {
        var isActive = row.getAttribute("data-model-id") === modelId;
        row.classList.toggle("active", isActive);
        row.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      details.forEach(function (detail) {
        detail.hidden = detail.getAttribute("data-model-id") !== modelId;
      });

      if (scrollToDetail && detailPane && isMobileDetailFlow()) {
        detailPane.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    function updateCount(count) {
      if (!countNode) return;
      countNode.textContent = "Showing " + count + " " + (count === 1 ? "model" : "models");
    }

    function updateFilterStates() {
      filterButtons.forEach(function (button) {
        var isActive = (button.getAttribute("data-model-filter") || "all") === activeFilter;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }

    function applyFilters() {
      var count = 0;
      var selectedStillVisible = false;

      rows.forEach(function (row) {
        var type = row.getAttribute("data-model-type") || "";
        var typeMatch = activeFilter === "all" || type === activeFilter;
        var searchTarget = searchState.exact
          ? row.getAttribute("data-model-title")
          : row.getAttribute("data-search-text");
        var searchMatch = urlFilters.matchesText(searchTarget || "", searchState);
        var show = typeMatch && searchMatch;

        row.hidden = !show;
        if (show) {
          count += 1;
          if (row.getAttribute("data-model-id") === selectedId) {
            selectedStillVisible = true;
          }
        }
      });

      updateCount(count);
      if (emptyNode) emptyNode.hidden = count !== 0;

      if (!selectedStillVisible) {
        var firstVisible = visibleRows()[0];
        if (firstVisible) {
          setSelected(firstVisible.getAttribute("data-model-id"), false);
        }
      }
    }

    function sortRows(selectFirstVisible) {
      if (!sortSelect || !listBody) return;
      var mode = sortSelect.value;
      var sorted = rows.slice().sort(function (a, b) {
        if (mode === "title-asc") {
          return normalize(a.getAttribute("data-model-title")).localeCompare(normalize(b.getAttribute("data-model-title")));
        }
        if (mode === "type-asc") {
          return normalize(a.getAttribute("data-model-type")).localeCompare(normalize(b.getAttribute("data-model-type")));
        }
        var updatedCompare = normalize(b.getAttribute("data-model-date")).localeCompare(normalize(a.getAttribute("data-model-date")));
        if (updatedCompare !== 0) return updatedCompare;
        return normalize(b.getAttribute("data-model-created")).localeCompare(normalize(a.getAttribute("data-model-created")));
      });

      sorted.forEach(function (row) {
        listBody.appendChild(row);
      });
      rows = sorted;
      applyFilters();

      if (selectFirstVisible) {
        var firstVisible = visibleRows()[0];
        if (firstVisible) {
          setSelected(firstVisible.getAttribute("data-model-id"), false);
        }
      }
    }

    function applyInitialUrlFilters() {
      var initialSearch = urlFilters.getSearchParam("q");
      if (initialSearch.query && searchInput) {
        searchInput.value = initialSearch.query;
        searchState = initialSearch;
      }

      var type = urlFilters.getParam("type");
      if (type && urlFilters.hasDataValue(filterButtons, "data-model-filter", type)) {
        activeFilter = type;
      }

      urlFilters.selectOption(sortSelect, urlFilters.getParam("sort"));
      updateFilterStates();
    }

    rows.forEach(function (row) {
      row.addEventListener("click", function (event) {
        if (event.target.closest("[data-no-row-select]")) return;
        setSelected(row.getAttribute("data-model-id"), true);
      });

      row.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        setSelected(row.getAttribute("data-model-id"), true);
      });
    });

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-model-filter") || "all";
        updateFilterStates();
        applyFilters();
      });
    });

    browseButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (!listRegion) return;
        listRegion.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        searchState = urlFilters.parseSearchValue(searchInput.value);
        applyFilters();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        sortRows(false);
      });
    }

    applyInitialUrlFilters();
    sortRows(true);
  });
})();
