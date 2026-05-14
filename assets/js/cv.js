document.addEventListener("DOMContentLoaded", () => {
  const pageRoot = document.querySelector("[data-cv-page]");
  if (!pageRoot) return;

  pageRoot.addEventListener("click", event => {
    const toggle = event.target.closest(".cv-panel-toggle");
    if (!toggle) return;

    const panelId = toggle.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", isExpanded ? "false" : "true");
    panel.hidden = isExpanded;

    if (!isExpanded) {
      const card = toggle.closest("[data-cv-panel]");
      window.requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const targetTop = window.scrollY + rect.top - Math.max(72, Math.round(window.innerHeight * 0.16));
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth"
        });
      });
    }
  });
});
