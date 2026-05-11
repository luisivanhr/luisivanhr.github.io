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
    var defaultView = page.querySelector("[data-default-view]");
    var searchView = page.querySelector("[data-search-view]");
    var searchList = page.querySelector("[data-search-list]");
    var searchSummary = page.querySelector("[data-search-summary]");
    var searchSources = Array.prototype.slice.call(page.querySelectorAll("[data-search-source]"));

    function selectCourse(courseId) {
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

    if (cards.length) {
      selectCourse(cards[0].getAttribute("data-course-id"));
    }
  });
})();
