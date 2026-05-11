(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function slugify(value) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function writeClipboardText(value) {
    if (!navigator.clipboard || !window.isSecureContext) return false;
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (err) {
      console.error("Copy failed", err);
      return false;
    }
  }

  function cleanText(value) {
    return (value || "").toString().replace(/\s+/g, " ").trim();
  }

  function capitalizeTerm(value) {
    var clean = cleanText(value);
    return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : clean;
  }

  function parseIndexMarker(value) {
    var clean = cleanText(value);
    if (!clean) return null;

    var separator = clean.indexOf("::");
    if (separator !== -1) {
      var parent = cleanText(clean.slice(0, separator));
      var term = cleanText(clean.slice(separator + 2));
      if (!parent || !term) return null;
      return {
        parent: parent,
        term: term,
        label: term,
        searchText: parent + " " + term
      };
    }

    return {
      parent: "",
      term: clean,
      label: clean,
      searchText: clean
    };
  }

  function replaceIndexMarkers(root) {
    var markerPattern = /\[\[([^\]\n]+)\]\]/g;
    var nodes = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || parent.closest("code, pre, script, style")) {
          return NodeFilter.FILTER_REJECT;
        }
        markerPattern.lastIndex = 0;
        return markerPattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var fragment = document.createDocumentFragment();
      var lastIndex = 0;
      var match;

      markerPattern.lastIndex = 0;
      while ((match = markerPattern.exec(text)) !== null) {
        var parsed = parseIndexMarker(match[1]);
        if (!parsed) continue;

        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }

        var span = document.createElement("span");
        span.className = "course-index-marker";
        span.dataset.indexTerm = parsed.term;
        if (parsed.parent) span.dataset.indexParent = parsed.parent;
        span.textContent = parsed.term;
        fragment.appendChild(span);
        lastIndex = markerPattern.lastIndex;
      }

      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      node.parentNode.replaceChild(fragment, node);
    });
  }

  function findAnchorTitle(element) {
    if (!element) return "";
    if (/^H[2-4]$/.test(element.tagName)) return cleanText(element.textContent);
    var heading = element.querySelector && element.querySelector("h2, h3, h4");
    return cleanText(heading ? heading.textContent : element.getAttribute("aria-label") || capitalizeTerm(element.id.replace(/-/g, " ")));
  }

  function lastAnchorCandidate(root) {
    if (!root || root.nodeType !== 1) return null;
    var candidates = [];
    if (root.matches("h2, h3, h4, [id]")) candidates.push(root);
    candidates = candidates.concat(Array.prototype.slice.call(root.querySelectorAll("h2, h3, h4, [id]")));
    candidates = candidates.filter(function (candidate) {
      return !candidate.closest("code, pre, script, style");
    });
    return candidates.length ? candidates[candidates.length - 1] : null;
  }

  function findNearestIndexAnchor(textNode) {
    var parent = textNode.parentElement;
    var ownAnchor = parent && parent.closest("[id]");
    if (ownAnchor && !ownAnchor.closest("code, pre, script, style")) {
      return {
        id: ownAnchor.id,
        title: findAnchorTitle(ownAnchor)
      };
    }

    var current = textNode;
    while (current && current.parentNode) {
      var sibling = current.previousSibling;
      while (sibling) {
        var candidate = lastAnchorCandidate(sibling);
        if (candidate) {
          return {
            id: candidate.id || slugify(candidate.textContent),
            title: findAnchorTitle(candidate)
          };
        }
        sibling = sibling.previousSibling;
      }
      current = current.parentNode;
    }

    return null;
  }

  function pushUniqueHit(list, hit) {
    var exists = list.some(function (item) {
      return item.url === hit.url && item.context === hit.context && item.pageTitle === hit.pageTitle;
    });
    if (!exists) list.push(hit);
  }

  function addIndexHit(map, parsed, hit) {
    var parentLabel = parsed.parent ? capitalizeTerm(parsed.parent) : capitalizeTerm(parsed.term);
    var parentKey = parentLabel.toLowerCase();
    if (!map[parentKey]) {
      map[parentKey] = {
        label: parentLabel,
        searchText: parentLabel,
        hits: [],
        subentries: {}
      };
    }

    var entry = map[parentKey];
    entry.searchText += " " + parsed.searchText;

    if (parsed.parent) {
      var subLabel = cleanText(parsed.term);
      var subKey = subLabel.toLowerCase();
      if (!entry.subentries[subKey]) {
        entry.subentries[subKey] = {
          label: subLabel,
          hits: [],
          searchText: parentLabel + " " + subLabel
        };
      }
      entry.subentries[subKey].searchText += " " + hit.pageTitle + " " + hit.context;
      pushUniqueHit(entry.subentries[subKey].hits, hit);
    } else {
      entry.searchText += " " + hit.pageTitle + " " + hit.context;
      pushUniqueHit(entry.hits, hit);
    }
  }

  function extractCourseIndexEntries(course) {
    var markerPattern = /\[\[([^\]\n]+)\]\]/g;
    var map = {};
    var pages = course && course.pages ? course.pages : [];

    pages.forEach(function (page) {
      var content = page.content || "";
      var doc = new DOMParser().parseFromString("<main>" + content + "</main>", "text/html");
      var walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          var parent = node.parentElement;
          if (!parent || parent.closest("code, pre, script, style")) {
            return NodeFilter.FILTER_REJECT;
          }
          markerPattern.lastIndex = 0;
          return markerPattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      var nodes = [];

      while (walker.nextNode()) nodes.push(walker.currentNode);

      nodes.forEach(function (node) {
        var match;
        markerPattern.lastIndex = 0;
        while ((match = markerPattern.exec(node.nodeValue)) !== null) {
          var parsed = parseIndexMarker(match[1]);
          if (!parsed) continue;

          var anchor = findNearestIndexAnchor(node);
          var url = page.url || "#";
          if (anchor && anchor.id) url += "#" + anchor.id;

          addIndexHit(map, parsed, {
            url: url,
            pageTitle: page.title || "Course page",
            context: anchor && anchor.title ? anchor.title : page.title || "Course page"
          });
        }
      });
    });

    return Object.keys(map).map(function (key) {
      var entry = map[key];
      entry.subentries = Object.keys(entry.subentries).map(function (subKey) {
        return entry.subentries[subKey];
      }).sort(function (a, b) {
        return a.label.localeCompare(b.label);
      });
      entry.hits.sort(function (a, b) {
        return (a.pageTitle + a.context).localeCompare(b.pageTitle + b.context);
      });
      entry.subentries.forEach(function (subentry) {
        subentry.hits.sort(function (a, b) {
          return (a.pageTitle + a.context).localeCompare(b.pageTitle + b.context);
        });
      });
      return entry;
    }).sort(function (a, b) {
      return a.label.localeCompare(b.label);
    });
  }

  function hitLabel(hit) {
    if (!hit.context || hit.context === hit.pageTitle) return hit.pageTitle;
    return hit.pageTitle + ": " + hit.context;
  }

  function entryMatchesQuery(entry, query) {
    if (!query) return entry;
    var q = query.toLowerCase();
    if ((entry.searchText || "").toLowerCase().indexOf(q) !== -1) return entry;

    var hits = entry.hits.filter(function (hit) {
      return (hitLabel(hit) + " " + hit.url).toLowerCase().indexOf(q) !== -1;
    });
    var subentries = entry.subentries.map(function (subentry) {
      var subText = (subentry.searchText || subentry.label).toLowerCase();
      var subHits = subentry.hits.filter(function (hit) {
        return (hitLabel(hit) + " " + hit.url).toLowerCase().indexOf(q) !== -1;
      });
      if (subText.indexOf(q) !== -1) subHits = subentry.hits;
      return subHits.length ? {
        label: subentry.label,
        hits: subHits,
        searchText: subentry.searchText
      } : null;
    }).filter(Boolean);

    if (!hits.length && !subentries.length) return null;
    return {
      label: entry.label,
      searchText: entry.searchText,
      hits: hits,
      subentries: subentries
    };
  }

  function renderIndexHitList(hits) {
    var list = document.createElement("div");
    list.className = "course-index-hit-list";
    hits.forEach(function (hit) {
      var link = document.createElement("a");
      link.href = hit.url;
      link.textContent = hitLabel(hit);
      list.appendChild(link);
    });
    return list;
  }

  function renderCourseIndexEntries(root, entries, query) {
    var results = root.querySelector("[data-index-results]");
    var letters = root.querySelector("[data-index-letters]");
    if (!results || !letters) return;

    var filtered = entries.map(function (entry) {
      return entryMatchesQuery(entry, query);
    }).filter(Boolean);
    var availableLetters = filtered.map(function (entry) {
      return (entry.label.charAt(0) || "#").toUpperCase();
    }).filter(function (letter, index, list) {
      return list.indexOf(letter) === index;
    });

    letters.textContent = "";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (letter) {
      if (availableLetters.indexOf(letter) === -1) {
        var disabled = document.createElement("span");
        disabled.textContent = letter;
        letters.appendChild(disabled);
        return;
      }

      var link = document.createElement("a");
      link.href = "#index-letter-" + letter;
      link.textContent = letter;
      letters.appendChild(link);
    });

    results.textContent = "";

    var summary = document.createElement("p");
    summary.className = "course-index-summary";
    summary.textContent = filtered.length +
      (filtered.length === 1 ? " entry" : " entries") +
      (query ? ' matching "' + query + '".' : " listed alphabetically.");
    results.appendChild(summary);

    if (!filtered.length) {
      var empty = document.createElement("p");
      empty.className = "course-muted";
      empty.textContent = "No index entries match this search.";
      results.appendChild(empty);
      return;
    }

    availableLetters.forEach(function (letter) {
      var section = document.createElement("section");
      section.className = "course-index-letter-section";
      section.id = "index-letter-" + letter;

      var heading = document.createElement("h2");
      heading.textContent = letter;
      section.appendChild(heading);

      var list = document.createElement("div");
      list.className = "course-index-entry-list";

      filtered.filter(function (entry) {
        return (entry.label.charAt(0) || "#").toUpperCase() === letter;
      }).forEach(function (entry) {
        var article = document.createElement("article");
        article.className = "course-index-entry";

        var term = document.createElement("div");
        term.className = "course-index-main-term";
        term.textContent = entry.label;
        article.appendChild(term);

        if (entry.hits.length) {
          article.appendChild(renderIndexHitList(entry.hits));
        }

        if (entry.subentries.length) {
          var subentries = document.createElement("div");
          subentries.className = "course-index-subentries";
          entry.subentries.forEach(function (subentry) {
            var row = document.createElement("div");
            row.className = "course-index-subentry";

            var subterm = document.createElement("span");
            subterm.className = "course-index-subterm";
            subterm.textContent = subentry.label;
            row.appendChild(subterm);

            var locations = document.createElement("span");
            locations.className = "course-index-locations";
            subentry.hits.forEach(function (hit) {
              var link = document.createElement("a");
              link.href = hit.url;
              link.textContent = hitLabel(hit);
              locations.appendChild(link);
            });
            row.appendChild(locations);
            subentries.appendChild(row);
          });
          article.appendChild(subentries);
        }

        list.appendChild(article);
      });

      section.appendChild(list);
      results.appendChild(section);
    });
  }

  function initCourseIndexPage() {
    var root = document.querySelector("[data-course-index-page]");
    if (!root) return;

    var source = root.getAttribute("data-index-source");
    var slug = root.getAttribute("data-course-slug");
    var search = root.querySelector("[data-index-search]");
    var results = root.querySelector("[data-index-results]");
    if (!source || !results) return;

    fetch(source, { credentials: "same-origin" })
      .then(function (response) {
        if (!response.ok) throw new Error("Index source not found");
        return response.json();
      })
      .then(function (data) {
        var courses = data.courses || [];
        var course = courses.find(function (item) {
          return item.slug === slug;
        });
        var entries = extractCourseIndexEntries(course);
        renderCourseIndexEntries(root, entries, "");

        if (search) {
          search.addEventListener("input", function () {
            renderCourseIndexEntries(root, entries, cleanText(search.value));
          });
        }
      })
      .catch(function (err) {
        console.error("Course index failed", err);
        results.textContent = "";
        var message = document.createElement("p");
        message.className = "course-muted";
        message.textContent = "The course index could not be loaded.";
        results.appendChild(message);
      });
  }

  ready(function () {
    document.querySelectorAll(".course-section-content, .course-home-content").forEach(replaceIndexMarkers);

    initCourseIndexPage();

    document.querySelectorAll(".exercise").forEach(function (exercise) {
      var button = exercise.querySelector(".answer-button");
      var panel = exercise.querySelector(".answer-panel");
      if (!button || !panel) return;

      var controlsId = panel.id || "answer-" + Math.random().toString(36).slice(2);
      panel.id = controlsId;
      button.setAttribute("aria-controls", controlsId);
      button.setAttribute("aria-expanded", exercise.classList.contains("open") ? "true" : "false");

      button.addEventListener("click", function () {
        var isOpen = exercise.classList.toggle("open");
        var lower = button.textContent.toLowerCase();
        button.textContent = lower.indexOf("note") !== -1
          ? (isOpen ? "Hide note" : "Show note")
          : (isOpen ? "Hide answer" : "Show answer");
        button.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });

    var content = document.querySelector(".course-section-content");
    var nav = document.getElementById("course-section-nav");
    var sidebar = document.querySelector(".course-section-sidebar");
    var navToggle = document.getElementById("course-nav-toggle");
    var showNavIcon = "\u25c0";
    var hideNavIcon = "\u25b6";

    if (content && nav && nav.children.length === 0) {
      var headings = Array.prototype.slice.call(content.querySelectorAll("h2, h3"));
      headings.forEach(function (heading) {
        if (heading.closest(".math-block, .exercise, .code-window, .result-panel, .rail-card")) return;
        var id = heading.id || slugify(heading.textContent);
        if (!id) return;
        heading.id = id;
        var link = document.createElement("a");
        link.className = "course-side-link";
        link.href = "#" + id;
        link.textContent = heading.textContent;
        nav.appendChild(link);
      });
      var firstLink = nav.querySelector("a");
      if (firstLink) firstLink.classList.add("active");
    }

    if (nav && content) {
      nav.addEventListener("click", function (event) {
        var link = event.target.closest("a");
        if (!link || !link.hash) return;
        var target = document.getElementById(link.hash.slice(1));
        if (!target) return;
        event.preventDefault();
        var y = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: "smooth" });

        nav.querySelectorAll("a").forEach(function (item) {
          item.classList.toggle("active", item === link);
        });

        if (window.innerWidth <= 700 && sidebar && navToggle) {
          sidebar.classList.remove("show");
          sidebar.classList.add("hide");
          navToggle.textContent = showNavIcon;
          navToggle.setAttribute("aria-label", "Show navigation");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    function resizeCourseNav() {
      if (!sidebar || !navToggle) return;
      if (window.innerWidth <= 700) {
        sidebar.classList.add("hide");
        sidebar.classList.remove("show");
        navToggle.style.display = "block";
        navToggle.textContent = showNavIcon;
        navToggle.setAttribute("aria-label", "Show navigation");
        navToggle.setAttribute("aria-expanded", "false");
      } else {
        sidebar.classList.remove("hide", "show");
        navToggle.style.display = "none";
      }
    }

    resizeCourseNav();
    window.addEventListener("resize", resizeCourseNav);

    if (navToggle && sidebar) {
      navToggle.addEventListener("click", function () {
        if (sidebar.classList.contains("show")) {
          sidebar.classList.remove("show");
          sidebar.classList.add("hide");
          navToggle.textContent = showNavIcon;
          navToggle.setAttribute("aria-label", "Show navigation");
          navToggle.setAttribute("aria-expanded", "false");
        } else {
          sidebar.classList.add("show");
          sidebar.classList.remove("hide");
          navToggle.textContent = hideNavIcon;
          navToggle.setAttribute("aria-label", "Hide navigation");
          navToggle.setAttribute("aria-expanded", "true");
        }
      });
    }

    var shareBtn = document.getElementById("course-share-btn");
    var shareLinks = document.getElementById("course-share-links");
    if (shareBtn && shareLinks) {
      var url = encodeURIComponent(window.location.href);
      var titleEl = document.querySelector(".course-home-hero h1, .course-section-header h1");
      var metaImage = document.querySelector('meta[property="og:image"]');
      var rawTitle = titleEl ? titleEl.textContent : document.title;
      var text = encodeURIComponent(rawTitle);
      var image = encodeURIComponent(metaImage ? metaImage.getAttribute("content") : "");
      var targets = {
        x: "https://twitter.com/intent/tweet?url=" + url + "&text=" + text,
        linkedin: "https://www.linkedin.com/shareArticle?mini=true&url=" + url + "&title=" + text + (image ? "&source=" + image : ""),
        facebook: "https://www.facebook.com/sharer/sharer.php?u=" + url + "&quote=" + text + (image ? "&picture=" + image : ""),
        gmail: "https://mail.google.com/mail/?view=cm&fs=1&su=" + text + "&body=" + url
      };

      Object.keys(targets).forEach(function (id) {
        var link = document.getElementById("course-share-" + id);
        if (link) {
          link.href = "#";
          link.dataset.href = targets[id];
        }
      });

      var nativeShare = document.getElementById("course-share-native");
      if (nativeShare) {
        if (navigator.share) {
          nativeShare.addEventListener("click", async function (event) {
            event.preventDefault();
            event.stopPropagation();
            try {
              await navigator.share({ title: rawTitle, text: rawTitle, url: window.location.href });
            } catch (err) {
              console.error("Share failed", err);
            }
            shareLinks.classList.remove("open");
            shareBtn.setAttribute("aria-expanded", "false");
          });
        } else {
          nativeShare.style.display = "none";
        }
      }

      shareBtn.addEventListener("click", function () {
        shareLinks.classList.toggle("open");
        shareBtn.setAttribute("aria-expanded", String(shareLinks.classList.contains("open")));
      });

      shareLinks.addEventListener("click", function (event) {
        var link = event.target.closest("a");
        if (link && link.dataset.href) {
          event.preventDefault();
          event.stopPropagation();
          window.open(link.dataset.href, "_blank", "noopener");
          shareLinks.classList.remove("open");
          shareBtn.setAttribute("aria-expanded", "false");
        }
      });
    }

    var shareCopy = document.getElementById("course-share-copy");
    if (shareCopy) {
      shareCopy.addEventListener("click", async function () {
        await writeClipboardText(window.location.href);
      });
    }

    if (typeof renderMathInElement === "function") {
      document.querySelectorAll(".course-section-content, .course-home-shell").forEach(function (root) {
        renderMathInElement(root, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
          ],
          throwOnError: false
        });
      });
    }
  });
})();
