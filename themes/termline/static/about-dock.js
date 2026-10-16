(() => {
  const docks = document.querySelectorAll("[data-social-dock]");
  if (!docks.length) return;

  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!isFinePointer.matches) return;

  const MAX_SCALE = 1.22;
  const MAX_LIFT = -6;
  const INFLUENCE = 96;

  function resetDock(dock) {
    dock.querySelectorAll(".about-links__item").forEach((item) => {
      item.style.setProperty("--dock-scale", "1");
      item.style.setProperty("--dock-lift", "0px");
    });
  }

  docks.forEach((dock) => {
    const items = Array.from(dock.querySelectorAll(".about-links__item"));
    if (!items.length) return;

    resetDock(dock);

    dock.addEventListener("mousemove", (event) => {
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const distance = Math.abs(event.clientX - centerX);
        const proximity = Math.max(0, 1 - distance / INFLUENCE);
        const eased = proximity * proximity;
        const scale = 1 + (MAX_SCALE - 1) * eased;
        const lift = MAX_LIFT * eased;

        item.style.setProperty("--dock-scale", scale.toFixed(3));
        item.style.setProperty("--dock-lift", `${lift.toFixed(2)}px`);
      });
    });

    dock.addEventListener("mouseleave", () => {
      resetDock(dock);
    });
  });
})();
