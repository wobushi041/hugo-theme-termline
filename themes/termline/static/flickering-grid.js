(() => {
  const canvas = document.querySelector("[data-flickering-grid]");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const hero = canvas.closest(".flickering-grid-hero");
  if (!hero) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const glyphs = "01·•+*/\\<>=";
  const cellSize = 14;
  const mutationRate = 0.04;
  const interval = 90;
  const fadeBottom = 0.6;

  let cols = 0;
  let rows = 0;
  let cells = [];
  let alphas = [];
  let frameId = 0;
  let lastTick = 0;
  let stopped = false;
  let lastWidth = 0;
  let lastHeight = 0;
  let colorRgba = { r: 107, g: 114, b: 128, a: 1 };

  function randomGlyph() {
    return glyphs[Math.floor(Math.random() * glyphs.length)] || "0";
  }

  function randomAlpha() {
    return 0.05 + Math.random() * 0.35;
  }

  function resolveColor() {
    const probe = document.createElement("canvas");
    const probeCtx = probe.getContext("2d");
    if (!probeCtx) return;

    const styles = getComputedStyle(hero);
    const colorValue =
      styles.getPropertyValue("--hero-glyph-color").trim() ||
      styles.getPropertyValue("--foreground").trim() ||
      styles.color ||
      "#6B7280";

    probe.width = 1;
    probe.height = 1;
    probeCtx.fillStyle = "#6B7280";
    probeCtx.fillStyle = colorValue;
    probeCtx.fillRect(0, 0, 1, 1);

    const [r, g, b, a] = probeCtx.getImageData(0, 0, 1, 1).data;
    colorRgba = { r, g, b, a: a / 255 };
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    if (width === lastWidth && height === lastHeight) {
      return false;
    }

    lastWidth = width;
    lastHeight = height;

    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.max(1, Math.ceil(width / cellSize));
    rows = Math.max(1, Math.ceil(height / cellSize));

    const total = cols * rows;
    cells = new Array(total).fill("").map(randomGlyph);
    alphas = new Array(total).fill(0).map(randomAlpha);
    return true;
  }

  function draw() {
    const width = lastWidth || Math.max(1, hero.clientWidth || 0);
    const height = lastHeight || Math.max(1, hero.clientHeight || 0);

    ctx.clearRect(0, 0, width, height);
    ctx.font = `${cellSize - 2}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    ctx.textBaseline = "top";

    const { r, g, b, a: baseAlpha } = colorRgba;
    for (let row = 0; row < rows; row += 1) {
      const fade = fadeBottom > 0 ? 1 - (row / rows) * fadeBottom : 1;
      for (let col = 0; col < cols; col += 1) {
        const index = row * cols + col;
        const alpha = alphas[index] * fade * baseAlpha;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fillText(cells[index], col * cellSize, row * cellSize);
      }
    }
  }

  function tick(timestamp) {
    if (stopped) return;

    if (timestamp - lastTick >= interval) {
      lastTick = timestamp;

      const total = cols * rows;
      const mutations = Math.max(1, Math.floor(total * mutationRate));

      for (let count = 0; count < mutations; count += 1) {
        const index = Math.floor(Math.random() * total);
        cells[index] = randomGlyph();
        alphas[index] = 0.05 + Math.random() * 0.45;
      }

      draw();
    }

    frameId = window.requestAnimationFrame(tick);
  }

  function syncCanvas() {
    const changed = resize();
    if (changed) {
      draw();
    }
  }

  const resizeObserver = new ResizeObserver(() => {
    resolveColor();
    syncCanvas();
  });

  resizeObserver.observe(hero);
  resolveColor();
  resize();
  draw();
  frameId = window.requestAnimationFrame(tick);

  window.addEventListener("resize", syncCanvas);
  window.addEventListener("themechange", resolveColor);
  window.addEventListener("themechange", draw);
  document.addEventListener("visibilitychange", draw);

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    resolveColor();
    draw();
  });

  window.addEventListener("beforeunload", () => {
    stopped = true;
    window.cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
  });
})();
