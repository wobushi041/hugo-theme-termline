(() => {
  const target = document.querySelector(".flickering-grid-hero__content h1");
  if (!target) return;

  const fullText = (target.textContent || "").trim();
  if (!fullText) return;

  target.dataset.fullText = fullText;
  target.textContent = "";
  target.classList.add("typewriter-hero");

  const typeDelay = 95;
  let index = 0;

  function tick() {
    index += 1;
    target.textContent = fullText.slice(0, index);

    if (index >= fullText.length) {
      target.dataset.typed = "true";
      return;
    }

    window.setTimeout(tick, typeDelay);
  }

  tick();
})();
