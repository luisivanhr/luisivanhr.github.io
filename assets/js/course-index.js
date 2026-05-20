(function () {
  function slugify(value) {
    return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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

  function firstHitUrl(entry) {
    if (entry.hits && entry.hits[0] && entry.hits[0].url) return entry.hits[0].url;
    if (entry.subentries && entry.subentries[0] && entry.subentries[0].hits[0]) {
      return entry.subentries[0].hits[0].url;
    }
    return "#";
  }

  function flattenEntries(entries) {
    var terms = [];
    (entries || []).forEach(function (entry) {
      if (entry.hits && entry.hits.length) {
        terms.push({
          label: entry.label,
          displayLabel: entry.label,
          parent: "",
          searchText: [entry.label].concat((entry.hits || []).map(function (hit) {
            return hit.pageTitle + " " + hit.context;
          })).join(" "),
          url: firstHitUrl(entry)
        });
      }

      (entry.subentries || []).forEach(function (subentry) {
        terms.push({
          label: subentry.label,
          displayLabel: entry.label + ": " + subentry.label,
          parent: entry.label,
          searchText: subentry.searchText || entry.label + " " + subentry.label,
          url: subentry.hits && subentry.hits[0] ? subentry.hits[0].url : firstHitUrl(entry)
        });
      });
    });

    return terms.sort(function (a, b) {
      return a.displayLabel.localeCompare(b.displayLabel);
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

  window.CourseIndex = {
    cleanText: cleanText,
    entryMatchesQuery: entryMatchesQuery,
    extractCourseIndexEntries: extractCourseIndexEntries,
    flattenEntries: flattenEntries,
    hitLabel: hitLabel,
    parseIndexMarker: parseIndexMarker,
    replaceIndexMarkers: replaceIndexMarkers
  };
})();
