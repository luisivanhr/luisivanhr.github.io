(function () {
  const page = document.querySelector("[data-achievements-page]");
  if (!page) return;

  page.querySelectorAll("[data-achievements-toggle]").forEach((button) => {
    const panelId = button.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      const nextExpanded = !isExpanded;
      const widget = button.closest(".achievements-academic-panel, .achievements-nonacademic-panel");
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
}());
