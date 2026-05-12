(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var page = document.querySelector("[data-courses-page]");
    if (!page) return;

    var cards = Array.prototype.slice.call(page.querySelectorAll("[data-course-card]"));
    var details = Array.prototype.slice.call(page.querySelectorAll("[data-course-detail]"));
    var searchInput = page.querySelector("#course-search");
    var sortSelect = page.querySelector("#course-sort");
    var cardList = page.querySelector("[data-course-list]");
    var defaultView = page.querySelector("[data-default-view]");
    var searchView = page.querySelector("[data-search-view]");
    var searchList = page.querySelector("[data-search-list]");
    var searchSummary = page.querySelector("[data-search-summary]");
    var searchSources = Array.prototype.slice.call(page.querySelectorAll("[data-search-source]"));
    var selectedCourseId = cards[0] ? cards[0].getAttribute("data-course-id") : "";

    function selectCourse(courseId) {
      selectedCourseId = courseId;

      cards.forEach(function (card) {
        var isActive = card.getAttribute("data-course-id") === courseId;
        card.classList.toggle("active", isActive);
        card.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      details.forEach(function (detail) {
        if (!detail.hasAttribute("data-course-detail")) return;
        detail.hidden = detail.getAttribute("data-course-id") !== courseId;
      });
    }

    function activateTab(detail, tabName) {
      var tabs = Array.prototype.slice.call(detail.querySelectorAll("[data-course-tab]"));
      var panels = Array.prototype.slice.call(detail.querySelectorAll("[data-course-panel]"));

      tabs.forEach(function (tab) {
        var isActive = tab.getAttribute("data-course-tab") === tabName;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      panels.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-course-panel") !== tabName;
      });
    }

    function normalize(value) {
      return (value || "").toString().toLowerCase();
    }

    function courseKindRank(source) {
      var kind = source.getAttribute("data-kind") || "";
      if (kind === "Course match") return 0;
      if (kind === "Subtitle match") return 1;
      if (kind === "Update match") return 2;
      if (kind === "Index match") return 3;
      return 4;
    }

    function compareCourseData(a, b) {
      var mode = sortSelect ? sortSelect.value : "date-desc";

      if (mode === "title-asc") {
        return normalize(a.getAttribute("data-course-title")).localeCompare(normalize(b.getAttribute("data-course-title")));
      }

      if (mode === "track-asc") {
        var trackCompare = normalize(a.getAttribute("data-course-track")).localeCompare(normalize(b.getAttribute("data-course-track")));
        if (trackCompare !== 0) return trackCompare;
        return normalize(a.getAttribute("data-course-title")).localeCompare(normalize(b.getAttribute("data-course-title")));
      }

      var updatedCompare = normalize(b.getAttribute("data-course-updated")).localeCompare(normalize(a.getAttribute("data-course-updated")));
      if (updatedCompare !== 0) return updatedCompare;
      var createdCompare = normalize(b.getAttribute("data-course-created")).localeCompare(normalize(a.getAttribute("data-course-created")));
      if (createdCompare !== 0) return createdCompare;
      return normalize(a.getAttribute("data-course-title")).localeCompare(normalize(b.getAttribute("data-course-title")));
    }

    function compareSearchSources(a, b) {
      var courseCompare = compareCourseData(a, b);
      if (courseCompare !== 0) return courseCompare;
      var kindCompare = courseKindRank(a) - courseKindRank(b);
      if (kindCompare !== 0) return kindCompare;
      return normalize(a.getAttribute("data-title")).localeCompare(normalize(b.getAttribute("data-title")));
    }

    function sortCards(selectFirst) {
      if (!cardList) return;

      var sorted = cards.slice().sort(compareCourseData);
      sorted.forEach(function (card) {
        cardList.appendChild(card);
      });
      cards = sorted;

      if (selectFirst && cards.length) {
        selectCourse(cards[0].getAttribute("data-course-id"));
      } else if (selectedCourseId) {
        selectCourse(selectedCourseId);
      }
    }

    function makeResult(source) {
      var link = document.createElement("a");
      link.className = "course-section-hit";
      link.href = source.getAttribute("data-url") || "#";

      var small = document.createElement("small");
      small.textContent = (source.getAttribute("data-kind") || "Match") + " - " + (source.getAttribute("data-meta") || "");

      var title = document.createElement("strong");
      title.textContent = source.getAttribute("data-title") || "Untitled";

      var summary = document.createElement("span");
      summary.textContent = source.getAttribute("data-summary") || "";

      link.appendChild(small);
      link.appendChild(title);
      link.appendChild(summary);

      link.addEventListener("click", function () {
        var courseId = source.getAttribute("data-course-id");
        if (courseId) selectCourse(courseId);
      });

      return link;
    }

    function showDefaultView() {
      if (defaultView) defaultView.hidden = false;
      if (searchView) searchView.hidden = true;
      if (searchList) searchList.textContent = "";
      if (searchSummary) {
        searchSummary.textContent = "Type to search course titles, section titles, updates, and index terms.";
      }
    }

    function applySearch() {
      if (!searchInput || !searchList) return;

      var rawTerm = searchInput.value.trim();
      var terms = normalize(rawTerm).split(/\s+/).filter(Boolean);

      if (!terms.length) {
        showDefaultView();
        return;
      }

      if (defaultView) defaultView.hidden = true;
      if (searchView) searchView.hidden = false;

      var results = searchSources
        .filter(function (source) {
          var text = normalize(source.getAttribute("data-search-text"));
          return terms.every(function (term) {
            return text.indexOf(term) !== -1;
          });
        })
        .sort(compareSearchSources)
        .slice(0, 14);

      searchList.textContent = "";

      if (!results.length) {
        var empty = document.createElement("div");
        empty.className = "course-search-empty";
        empty.textContent = "No course titles, sections, updates, or index terms match this search.";
        searchList.appendChild(empty);
      } else {
        results.forEach(function (source) {
          searchList.appendChild(makeResult(source));
        });
      }

      if (searchSummary) {
        searchSummary.textContent =
          results.length +
          (results.length === 1 ? " match" : " matches") +
          ' for "' +
          rawTerm +
          '". Results can point to course pages, section subtitles, updates, or index terms.';
      }
    }

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        selectCourse(card.getAttribute("data-course-id"));
      });
    });

    details.forEach(function (detail) {
      if (!detail.hasAttribute("data-course-detail")) return;

      Array.prototype.slice.call(detail.querySelectorAll("[data-course-tab]")).forEach(function (tab) {
        tab.addEventListener("click", function () {
          activateTab(detail, tab.getAttribute("data-course-tab"));
        });
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", applySearch);
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        sortCards(true);
        if (searchInput && searchInput.value.trim()) {
          applySearch();
        }
      });
    }

    sortCards(true);
  });
})();
