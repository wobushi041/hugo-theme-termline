(() => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  function animate(element) {
    const original = element.dataset.textValue || element.textContent || "";
    element.dataset.textValue = original;

    let frame = 0;
    const totalFrames = original.length + 8;

    if (element.__hyperTextTimer) {
      cancelAnimationFrame(element.__hyperTextTimer);
    }

    function tick() {
      const next = original
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < frame / 2) return original[index];
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

      element.textContent = next;
      frame += 1;

      if (frame <= totalFrames) {
        element.__hyperTextTimer = requestAnimationFrame(tick);
      } else {
        element.textContent = original;
      }
    }

    tick();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const targets = document.querySelectorAll("[data-hyper-text]");
    targets.forEach((element) => {
      element.dataset.textValue = element.textContent || "";
      element.addEventListener("mouseenter", () => animate(element));
      element.addEventListener("focus", () => animate(element));
    });
  });
})();
