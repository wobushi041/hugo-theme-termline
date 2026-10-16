(() => {
  const storageKey = "theme-preference";
  const root = document.documentElement;

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function getTheme() {
    return localStorage.getItem(storageKey) || root.dataset.theme || "light";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    window.dispatchEvent(new Event("themechange"));
    const button = document.querySelector("[data-theme-toggle]");
    if (button) {
      button.setAttribute("aria-pressed", String(theme === "light"));
      button.setAttribute("title", theme === "light" ? "深色模式" : "浅色模式");
      button.setAttribute("aria-label", theme === "light" ? "深色模式" : "浅色模式");
  }
}

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getTheme());

    const button = document.querySelector("[data-theme-toggle]");
    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      const nextTheme = getTheme() === "light" ? "dark" : "light";
      localStorage.setItem(storageKey, nextTheme);
      applyTheme(nextTheme);
    });
  });
})();
