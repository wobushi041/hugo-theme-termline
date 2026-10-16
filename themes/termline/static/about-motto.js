(() => {
  const target = document.querySelector("[data-about-motto]");
  const source = document.querySelector("[data-about-mottos]");
  if (!target || !source) return;

  let mottos;
  try {
    mottos = JSON.parse(source.textContent || "[]");
    if (typeof mottos === "string") {
      mottos = JSON.parse(mottos);
    }
  } catch (_error) {
    return;
  }

  mottos = mottos
    .map((item) => String(item || "").trim())
    .filter(Boolean);

  if (!mottos.length) return;

  const typeDelay = 95;
  const deleteDelay = 55;
  const holdDelay = 1500;
  const switchDelay = 350;

  let mottoIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = mottos[mottoIndex];

    if (!deleting) {
      charIndex += 1;
      target.textContent = current.slice(0, charIndex);

      if (charIndex >= current.length) {
        deleting = true;
        window.setTimeout(tick, holdDelay);
        return;
      }

      window.setTimeout(tick, typeDelay);
      return;
    }

    charIndex -= 1;
    target.textContent = current.slice(0, Math.max(charIndex, 0));

    if (charIndex <= 0) {
      deleting = false;
      mottoIndex = (mottoIndex + 1) % mottos.length;
      window.setTimeout(tick, switchDelay);
      return;
    }

    window.setTimeout(tick, deleteDelay);
  }

  tick();
})();
