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

  function appendChildren(parent, children) {
    children.flat().filter(child => child !== null && child !== undefined).forEach(child => {
      parent.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return parent;
  }

  function node(tag, attrs = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(attrs).forEach(([name, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (name === "class") {
        element.className = value;
      } else if (name === "text") {
        element.textContent = value;
      } else if (name === "dataset") {
        Object.entries(value).forEach(([key, dataValue]) => {
          element.dataset[key] = String(dataValue);
        });
      } else {
        element.setAttribute(name, String(value));
      }
    });
    return appendChildren(element, children);
  }

  function svgNode(tag, attrs = {}, children = []) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([name, value]) => {
      if (value !== null && value !== undefined && value !== false) {
        element.setAttribute(name === "class" ? "class" : name, String(value));
      }
    });
    return appendChildren(element, children);
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
    return "\u2605".repeat(score) + "\u2606".repeat(5 - score);
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
    const steam = svgNode("svg", { class: "coffee-icon", viewBox: "0 0 24 24", fill: "none" }, [
      svgNode("path", { d: "M8 7c0-1.5 1.4-1.7 1.4-3", stroke: "currentColor", "stroke-linecap": "round" }),
      svgNode("path", { d: "M12 7c0-1.5 1.4-1.7 1.4-3", stroke: "currentColor", "stroke-linecap": "round" }),
      svgNode("path", { d: "M16 7c0-1.5 1.4-1.7 1.4-3", stroke: "currentColor", "stroke-linecap": "round" }),
      svgNode("path", { d: "M5 10h12v4a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5v-4z", stroke: "currentColor", "stroke-linejoin": "round" }),
      svgNode("path", { d: "M17 11h1.5a2.5 2.5 0 0 1 0 5H17", stroke: "currentColor", "stroke-linecap": "round" }),
      svgNode("path", { d: "M4 21h16", stroke: "currentColor", "stroke-linecap": "round" })
    ]);

    const bean = svgNode("svg", { class: "coffee-icon", viewBox: "0 0 24 24" }, [
      svgNode("path", { d: "M16.7 3.4c3.4 2.1 3.9 7.7 1.3 12.3s-7.6 7-11 4.9S3.2 12.9 5.8 8.3s7.5-7 10.9-4.9z", fill: "currentColor", opacity: "0.9" }),
      svgNode("path", { d: "M8.1 19.4c2.5-3.4 0.7-7.4 7-12.8", fill: "none", stroke: "#122430", "stroke-width": "1.4", "stroke-linecap": "round" })
    ]);

    return node("div", { class: "coffee-symbols", "aria-hidden": "true" }, [steam, bean]);
  }

  function imageBlock(entry, className, fallbackLabel) {
    const title = String(fallbackLabel || entry.title || "Local asset");
    const wrapper = node("div", { class: className });
    const source = entry.image || entry.cover;
    if (source) {
      wrapper.appendChild(node("img", {
        class: "photo-img",
        src: source,
        "data-fallback": title,
        alt: title,
        loading: "lazy"
      }));
    } else {
      wrapper.textContent = title;
    }
    return wrapper;
  }

  function labeledSection(label, value, valueClass) {
    const section = node("div", { class: "coffee-section" }, [
      node("span", { class: "label", text: label })
    ]);
    section.appendChild(node("div", { class: valueClass || "", text: value || "" }));
    return section;
  }

  function renderCoffee(entry) {
    const article = node("article", { class: "coffee-note" });
    const titleGroup = node("div", {}, [
      node("h3", { text: entry.title || "" }),
      node("div", { class: "coffee-meta", text: [entry.roaster, entry.method, formatDate(entry.date)].filter(Boolean).join(" - ") })
    ]);
    article.appendChild(node("header", { class: "coffee-head" }, [titleGroup, coffeeIcons()]));
    article.appendChild(labeledSection("Aroma", entry.aroma));
    article.appendChild(labeledSection("Taste", entry.taste));
    article.appendChild(labeledSection("Notes", entry.notes));
    article.appendChild(labeledSection("Rating", ratingText(entry.rating), "rating"));
    return article;
  }

  function renderCooking(entry) {
    const ingredients = Array.isArray(entry.ingredients) ? entry.ingredients : [];
    const method = Array.isArray(entry.method) ? entry.method : [];
    const fragment = document.createDocumentFragment();

    const article = node("article", { class: "recipe-card" }, [
      imageBlock(entry, "recipe-photo", entry.title),
      node("div", {}, [
        node("span", { class: "label", text: "Recent recipe" }),
        node("p", { class: "widget-copy", text: [entry.summary, entry.notes].filter(Boolean).join(" ") }),
        node("ul", { class: "chip-list", "aria-label": "Ingredients" }, ingredients.map(item => node("li", { text: item })))
      ])
    ]);

    const methodList = node("ol", { class: "method-list" }, method.map(step => {
      const item = node("li", {}, [node("strong", { text: step.label || "" })]);
      item.appendChild(document.createTextNode(step.text || ""));
      return item;
    }));

    fragment.appendChild(article);
    fragment.appendChild(node("section", { class: "recipe-method", "aria-label": "Concise cooking method" }, [
      node("span", { class: "label", text: "Method" }),
      methodList
    ]));
    return fragment;
  }

  function renderBooks(entry) {
    return node("article", { class: "book-feature" }, [
      node("div", {}, [
        node("span", { class: "label", text: "Current shelf" }),
        node("p", { class: "widget-copy", text: "A compact cover-and-impression card works better here than a long review." }),
        labeledSection("About", entry.about),
        labeledSection("Impression", entry.impression),
        labeledSection("For who?", entry.for_who)
      ]),
      imageBlock(entry, "book-cover", entry.title)
    ]);
  }

  const renderers = {
    coffee: renderCoffee,
    cooking: renderCooking,
    books: renderBooks
  };

  function renderMiniDeck(type, deck, selectedIndex, container) {
    const buttons = deck.map((entry, index) => {
      const selected = index === selectedIndex;
      const date = formatDate(entry.date);
      return node("button", {
        class: "mini-card" + (selected ? " is-selected" : ""),
        type: "button",
        "aria-pressed": selected ? "true" : "false",
        dataset: { deckIndex: index }
      }, [
        node("div", { class: "deck-thumb " + type, text: entry.title || "" }),
        node("span", { text: entry.title || "" }),
        node("small", { text: date || "Entry" })
      ]);
    });
    container.replaceChildren(...buttons);
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
      feature.replaceChildren(renderer(deck[selectedIndex]));
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
