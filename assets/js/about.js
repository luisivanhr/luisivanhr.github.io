(function () {
  const page = document.querySelector("[data-about-page]");
  if (!page) return;

  const portraitCard = page.querySelector("[data-about-portrait-card]");
  const rightColumn = page.querySelector(".about-dossier-right");
  const wideLayout = window.matchMedia("(min-width: 1121px)");

  function measureExpandedColumnHeight() {
    if (!portraitCard || !rightColumn) return;

    if (!wideLayout.matches) {
      page.style.removeProperty("--about-expanded-column-height");
      return;
    }

    const panels = Array.from(page.querySelectorAll("[data-about-toggle]"))
      .map((button) => {
        const panelId = button.getAttribute("aria-controls");
        return panelId ? document.getElementById(panelId) : null;
      })
      .filter(Boolean);
    const hiddenStates = panels.map((panel) => panel.hidden);

    panels.forEach((panel) => {
      panel.hidden = false;
    });

    const columnItems = Array.from(rightColumn.children);
    const rowGap = parseFloat(window.getComputedStyle(rightColumn).rowGap) || 0;
    const height = Math.ceil(
      columnItems.reduce((total, item) => total + item.getBoundingClientRect().height, 0) +
      Math.max(0, columnItems.length - 1) * rowGap
    );
    page.style.setProperty("--about-expanded-column-height", `${height}px`);

    panels.forEach((panel, index) => {
      panel.hidden = hiddenStates[index];
    });
  }

  measureExpandedColumnHeight();
  window.addEventListener("resize", () => {
    window.requestAnimationFrame(measureExpandedColumnHeight);
  });

  page.querySelectorAll("[data-about-toggle]").forEach((button) => {
    const panelId = button.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      const nextExpanded = !isExpanded;
      const widget = button.closest("[data-about-panel]");
      button.setAttribute("aria-expanded", String(nextExpanded));
      panel.hidden = !nextExpanded;

      if (widget) {
        widget.classList.toggle("is-collapsed", !nextExpanded);
      }

      if (nextExpanded && widget) {
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
  });

  const modal = document.getElementById("about-photo-modal");
  const modalTitle = document.getElementById("about-photo-modal-title");
  const modalCaption = document.getElementById("about-photo-modal-caption");
  const modalVisual = document.getElementById("about-photo-modal-visual");
  if (!modal || !modalTitle || !modalCaption || !modalVisual) return;

  function toneBackground(tone) {
    if (tone === "warm") {
      return "linear-gradient(135deg, rgba(95, 61, 42, 0.88), rgba(180, 125, 29, 0.7)), linear-gradient(45deg, #7a5338, #e4d7bd)";
    }
    if (tone === "green") {
      return "linear-gradient(145deg, rgba(45, 110, 79, 0.9), rgba(23, 118, 125, 0.72)), linear-gradient(45deg, #2d6e4f, #78cdd5)";
    }
    if (tone === "red") {
      return "linear-gradient(145deg, rgba(139, 47, 61, 0.9), rgba(18, 59, 136, 0.7)), linear-gradient(45deg, #8b2f3d, #123b88)";
    }
    return "linear-gradient(135deg, rgba(18, 59, 136, 0.86), rgba(23, 118, 125, 0.66)), linear-gradient(45deg, #123b88, #78cdd5)";
  }

  function closeModal() {
    modal.hidden = true;
  }

  page.querySelectorAll(".about-photo-card").forEach((button) => {
    button.addEventListener("click", () => {
      const title = button.getAttribute("data-preview-title") || "Photobook preview";
      const caption = button.getAttribute("data-preview-caption") || "";
      const tone = button.getAttribute("data-preview-tone") || "blue";
      const image = button.getAttribute("data-preview-image") || "";
      const imageAlt = button.getAttribute("data-preview-image-alt") || title;
      modalTitle.textContent = title;
      modalCaption.textContent = caption;
      modalVisual.textContent = title;
      modalVisual.setAttribute("aria-label", imageAlt);
      modalVisual.classList.toggle("has-image", Boolean(image));
      if (image) {
        modalVisual.style.backgroundImage = `linear-gradient(180deg, rgba(4, 14, 20, 0) 35%, rgba(4, 14, 20, 0.72) 100%), url("${image}")`;
        modalVisual.style.backgroundColor = "#05090c";
      } else {
        modalVisual.style.background = toneBackground(tone);
      }
      modal.hidden = false;
    });
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
}());
