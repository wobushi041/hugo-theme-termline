(() => {
  const canvas = document.querySelector("[data-pixel-snow]");
  const toggle = document.querySelector("[data-pixel-snow-toggle]");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const storageKey = "pixel-snow-enabled";

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let flakes = [];
  let frameId = 0;
  const storedPreference = localStorage.getItem(storageKey);
  let enabled = storedPreference === "true";

  function cssVar(name, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  }

  function palette() {
    return {
      foreground: cssVar("--foreground", "#d7d7d7"),
      accent: cssVar("--accent", "#8a959e"),
    };
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createFlake(initial = false) {
    return {
      x: random(0, width),
      y: initial ? random(0, height) : random(-height * 0.2, -8),
      size: Math.floor(random(1, 4)),
      speedY: random(0.45, 1.9),
      speedX: random(-0.22, 0.22),
      drift: random(0.004, 0.016),
      phase: random(0, Math.PI * 2),
      alpha: random(0.22, 0.78),
    };
  }

  function buildFlakes() {
    const count = Math.max(54, Math.round((width * height) / 13000));
    flakes = Array.from({ length: count }, () => createFlake(true));
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildFlakes();
  }

  function draw() {
    if (!enabled) return;
    const { foreground, accent } = palette();
    ctx.clearRect(0, 0, width, height);

    flakes.forEach((flake, index) => {
      flake.phase += flake.drift;
      flake.y += flake.speedY;
      flake.x += flake.speedX + Math.sin(flake.phase) * 0.12;

      if (flake.y > height + 8 || flake.x < -10 || flake.x > width + 10) {
        flakes[index] = createFlake(false);
        return;
      }

      ctx.globalAlpha = flake.alpha;
      ctx.fillStyle = index % 5 === 0 ? accent : foreground;
      ctx.fillRect(
        Math.round(flake.x),
        Math.round(flake.y),
        flake.size,
        flake.size
      );
    });

    ctx.globalAlpha = 1;
    frameId = requestAnimationFrame(draw);
  }

  function start() {
    cancelAnimationFrame(frameId);
    ctx.clearRect(0, 0, width, height);
    if (!enabled || mediaReduced.matches) return;
    draw();
  }

  function updateToggleState() {
    if (!toggle) return;
    toggle.setAttribute("aria-pressed", String(enabled));
    toggle.setAttribute("title", enabled ? "关闭粒子效果" : "开启粒子效果");
    toggle.setAttribute("aria-label", enabled ? "关闭粒子效果" : "开启粒子效果");
    toggle.classList.toggle("is-active", enabled);
  }

  function setEnabled(nextValue) {
    enabled = nextValue;
    localStorage.setItem(storageKey, String(enabled));
    updateToggleState();
    start();
  }

  window.addEventListener("resize", () => {
    resize();
    start();
  });

  window.addEventListener("themechange", start);
  mediaReduced.addEventListener?.("change", start);

  toggle?.addEventListener("click", () => {
    setEnabled(!enabled);
  });

  resize();
  updateToggleState();
  start();
})();
