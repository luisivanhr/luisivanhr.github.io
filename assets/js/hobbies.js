document.addEventListener("DOMContentLoaded", () => {
  const pageRoot = document.querySelector("[data-hobbies-page]");
  if (!pageRoot) return;

  const dataNode = document.getElementById("hobbies-data");
  let hobbies = {};
  try {
    hobbies = dataNode ? JSON.parse(dataNode.textContent || "{}") : {};
  } catch (error) {
    hobbies = {};
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fallbackSvg(label) {
    const safeLabel = escapeHtml(label || "Local asset");
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="368" height="138" viewBox="0 0 368 138">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#123b88"/><stop offset="1" stop-color="#17767d"/></linearGradient></defs>' +
      '<rect width="368" height="138" fill="url(#g)"/>' +
      '<rect x="10" y="10" width="348" height="118" fill="none" stroke="rgba(255,255,255,.32)" stroke-width="2"/>' +
      '<text x="24" y="76" fill="#ffffff" font-family="system-ui,Segoe UI,sans-serif" font-size="22" font-weight="800">' + safeLabel + '</text>' +
      '<text x="24" y="102" fill="rgba(255,255,255,.72)" font-family="system-ui,Segoe UI,sans-serif" font-size="14" font-weight="700">local image placeholder</text>' +
      '</svg>';
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function setupImageFallbacks(scope = pageRoot) {
    scope.querySelectorAll("img[data-fallback]").forEach(image => {
      if (image.dataset.fallbackReady === "true") return;
      image.dataset.fallbackReady = "true";
      image.addEventListener("error", () => {
        image.src = fallbackSvg(image.getAttribute("data-fallback"));
      }, { once: true });
      if (!image.getAttribute("src")) {
        image.src = fallbackSvg(image.getAttribute("data-fallback"));
      }
    });
  }

  function formatDate(value) {
    if (!value) return "";
    const [year, month, day] = String(value).split("-");
    if (!year || !month) return String(value);
    const date = new Date(Number(year), Number(month) - 1, Number(day || 1));
    return date.toLocaleDateString("en", { month: "short", year: "numeric" });
  }

  function ratingText(value) {
    const score = Math.max(0, Math.min(5, Math.round(Number(value || 0))));
    return "★".repeat(score) + "☆".repeat(5 - score);
  }

  function sortedEntries(entries) {
    return Array.isArray(entries)
      ? entries.slice().sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
      : [];
  }

  function sampleEntries(entries, count) {
    const pool = entries.slice();
    for (let index = pool.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
    }
    return pool.slice(0, count);
  }

  function coffeeIcons() {
    return '<div class="coffee-symbols" aria-hidden="true">' +
      '<svg class="coffee-icon" viewBox="0 0 24 24" fill="none">' +
      '<path d="M8 7c0-1.5 1.4-1.7 1.4-3" stroke="currentColor" stroke-linecap="round"/>' +
      '<path d="M12 7c0-1.5 1.4-1.7 1.4-3" stroke="currentColor" stroke-linecap="round"/>' +
      '<path d="M16 7c0-1.5 1.4-1.7 1.4-3" stroke="currentColor" stroke-linecap="round"/>' +
      '<path d="M5 10h12v4a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5v-4z" stroke="currentColor" stroke-linejoin="round"/>' +
      '<path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17" stroke="currentColor" stroke-linecap="round"/>' +
      '<path d="M4 21h16" stroke="currentColor" stroke-linecap="round"/>' +
      '</svg>' +
      '<svg class="coffee-icon" viewBox="0 0 24 24">' +
      '<path d="M16.7 3.4c3.4 2.1 3.9 7.7 1.3 12.3s-7.6 7-11 4.9S3.2 12.9 5.8 8.3s7.5-7 10.9-4.9z" fill="currentColor" opacity="0.9"/>' +
      '<path d="M8.1 19.4c2.5-3.4 0.7-7.4 7-12.8" fill="none" stroke="#122430" stroke-width="1.4" stroke-linecap="round"/>' +
      '</svg>' +
      '</div>';
  }

  function imageBlock(entry, className, fallbackLabel) {
    const title = escapeHtml(fallbackLabel || entry.title);
    if (entry.image || entry.cover) {
      const source = escapeHtml(entry.image || entry.cover);
      return '<div class="' + className + '"><img class="photo-img" src="' + source + '" data-fallback="' + title + '" alt="' + title + '" loading="lazy"></div>';
    }
    return '<div class="' + className + '">' + title + '</div>';
  }

  function renderCoffee(entry) {
    return '<article class="coffee-note">' +
      '<header class="coffee-head"><div><h3>' + escapeHtml(entry.title) + '</h3>' +
      '<div class="coffee-meta">' + escapeHtml([entry.roaster, entry.method, formatDate(entry.date)].filter(Boolean).join(" - ")) + '</div></div>' +
      coffeeIcons() + '</header>' +
      '<div class="coffee-section"><span class="label">Aroma</span>' + escapeHtml(entry.aroma) + '</div>' +
      '<div class="coffee-section"><span class="label">Taste</span>' + escapeHtml(entry.taste) + '</div>' +
      '<div class="coffee-section"><span class="label">Notes</span>' + escapeHtml(entry.notes) + '</div>' +
      '<div class="coffee-section"><span class="label">Rating</span><div class="rating">' + ratingText(entry.rating) + '</div></div>' +
      '</article>';
  }

  function renderCooking(entry) {
    const ingredients = Array.isArray(entry.ingredients) ? entry.ingredients : [];
    const method = Array.isArray(entry.method) ? entry.method : [];
    return '<article class="recipe-card">' +
      imageBlock(entry, "recipe-photo", entry.title) +
      '<div><span class="label">Recent recipe</span>' +
      '<p class="widget-copy">' + escapeHtml([entry.summary, entry.notes].filter(Boolean).join(" ")) + '</p>' +
      '<ul class="chip-list" aria-label="Ingredients">' + ingredients.map(item => '<li>' + escapeHtml(item) + '</li>').join("") + '</ul></div>' +
      '</article>' +
      '<section class="recipe-method" aria-label="Concise cooking method"><span class="label">Method</span>' +
      '<ol class="method-list">' + method.map(step => '<li><strong>' + escapeHtml(step.label) + '</strong>' + escapeHtml(step.text) + '</li>').join("") + '</ol></section>';
  }

  function renderBooks(entry) {
    return '<article class="book-feature">' +
      '<div><span class="label">Current shelf</span>' +
      '<p class="widget-copy">A compact cover-and-impression card works better here than a long review.</p>' +
      '<div class="coffee-section"><span class="label">About</span>' + escapeHtml(entry.about) + '</div>' +
      '<div class="coffee-section"><span class="label">Impression</span>' + escapeHtml(entry.impression) + '</div>' +
      '<div class="coffee-section"><span class="label">For who?</span>' + escapeHtml(entry.for_who) + '</div></div>' +
      imageBlock(entry, "book-cover", entry.title) +
      '</article>';
  }

  const renderers = {
    coffee: renderCoffee,
    cooking: renderCooking,
    books: renderBooks
  };

  function renderMiniDeck(type, deck, selectedIndex, container) {
    container.innerHTML = deck.map((entry, index) => {
      const selected = index === selectedIndex;
      const date = formatDate(entry.date);
      return '<button class="mini-card' + (selected ? ' is-selected' : '') + '" type="button" data-deck-index="' + index + '" aria-pressed="' + (selected ? "true" : "false") + '">' +
        '<div class="deck-thumb ' + type + '">' + escapeHtml(entry.title) + '</div>' +
        '<span>' + escapeHtml(entry.title) + '</span>' +
        '<small>' + escapeHtml(date || "Entry") + '</small>' +
        '</button>';
    }).join("");
  }

  function setupDeck(type, entries, widget) {
    if (!widget) return;

    const feature = widget.querySelector('[data-feature-card="' + type + '"]');
    const miniDeck = widget.querySelector('[data-mini-deck="' + type + '"]');
    const renderer = renderers[type];
    if (!feature || !miniDeck || !renderer) return;

    const sorted = sortedEntries(entries);
    if (!sorted.length) return;

    const deckSize = Math.max(1, Number(widget.dataset.deckSize || 4));
    const deck = [sorted[0], ...sampleEntries(sorted.slice(1), Math.max(0, deckSize - 1))];
    let selectedIndex = 0;

    function render() {
      feature.innerHTML = renderer(deck[selectedIndex]);
      renderMiniDeck(type, deck, selectedIndex, miniDeck);
      setupImageFallbacks(feature);
    }

    miniDeck.addEventListener("click", event => {
      const button = event.target.closest("[data-deck-index]");
      if (!button) return;
      selectedIndex = Number(button.dataset.deckIndex || 0);
      render();
    });

    render();
  }

  pageRoot.addEventListener("click", event => {
    const toggle = event.target.closest(".hobbies-widget-toggle");
    if (!toggle) return;

    const panelId = toggle.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", isExpanded ? "false" : "true");
    panel.hidden = isExpanded;
    const widget = toggle.closest("[data-hobbies-widget]");
    if (widget) {
      widget.classList.toggle("is-collapsed", isExpanded);
    }

    if (!isExpanded && widget) {
      window.requestAnimationFrame(() => {
        const rect = widget.getBoundingClientRect();
        const targetTop = window.scrollY + rect.top - Math.max(72, Math.round(window.innerHeight * 0.16));
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth"
        });
      });
    }
  });

  setupImageFallbacks();
  setupDeck("cooking", hobbies.cooking, pageRoot.querySelector('[data-deck-widget="cooking"]'));
  setupDeck("coffee", hobbies.coffee, pageRoot.querySelector('[data-deck-widget="coffee"]'));
  setupDeck("books", hobbies.books, pageRoot.querySelector('[data-deck-widget="books"]'));
});
