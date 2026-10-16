(() => {
  const modal = document.querySelector("[data-search-modal]");
  const openButton = document.querySelector("[data-search-open]");
  const closeTargets = document.querySelectorAll("[data-search-close]");
  const input = document.querySelector("[data-search-input]");
  const resultsWrap = document.querySelector("[data-search-results]");
  const emptyState = document.querySelector("[data-search-empty]");
  const confirmButton = document.querySelector("[data-search-confirm]");

  if (!modal || !openButton || !input || !resultsWrap || !emptyState || !confirmButton) {
    return;
  }

  const storage = {
    items: [],
  };
  const SEARCH_EMPTY_PROMPT = "输入关键词开始搜索";
  const SEARCH_NO_RESULTS = "未找到相关结果";

  async function loadData() {
    if (storage.items.length) return storage.items;
    const response = await fetch("/index.json");
    storage.items = await response.json();
    return storage.items;
  }

  function openModal() {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => input.focus());
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function setEmpty(text) {
    emptyState.textContent = text;
    emptyState.classList.remove("hidden");
  }

  function hideEmpty() {
    emptyState.classList.add("hidden");
  }

  function renderResults(items) {
    resultsWrap.querySelectorAll(".site-search__item").forEach((node) => node.remove());
    const keywords = getKeywords(input.value.trim());

    if (!items.length) {
      setEmpty(input.value.trim() ? SEARCH_NO_RESULTS : SEARCH_EMPTY_PROMPT);
      return;
    }

    hideEmpty();

    items.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.permalink;
      link.className = "site-search__item";
      const snippet = getSnippet(item, keywords);
      const safeTitle = highlightKeywords(escapeHtml(item.title || ""), keywords);
      link.innerHTML = `
        <div class="site-search__item-title">${safeTitle}</div>
        <div class="site-search__item-meta">${item.date}</div>
        <div class="site-search__item-snippet">${snippet}</div>
      `;
      resultsWrap.appendChild(link);
    });
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getKeywords(raw) {
    return raw
      .toLowerCase()
      .split(/\s+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function highlightKeywords(text, keywords) {
    if (!keywords.length) return text;
    const uniqueKeywords = [...new Set(keywords)].sort((a, b) => b.length - a.length);
    const pattern = uniqueKeywords
      .map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    if (!pattern) return text;
    return text.replace(new RegExp(`(${pattern})`, "ig"), "<mark>$1</mark>");
  }

  function getSnippet(item, keywords) {
    const source = (item.content || item.summary || "").replace(/\s+/g, " ").trim();
    if (!source) return "";
    if (!keywords.length) return escapeHtml(source.slice(0, 120));

    const lowered = source.toLowerCase();
    const positions = keywords
      .map((keyword) => lowered.indexOf(keyword))
      .filter((index) => index >= 0)
      .sort((a, b) => a - b);

    if (!positions.length) {
      return escapeHtml(source.slice(0, 120));
    }

    const firstMatch = positions[0];
    const longestKeywordLength = Math.max(...keywords.map((keyword) => keyword.length));
    const start = Math.max(0, firstMatch - 36);
    const end = Math.min(source.length, firstMatch + longestKeywordLength + 60);
    const prefix = start > 0 ? "..." : "";
    const suffix = end < source.length ? "..." : "";
    const snippet = source.slice(start, end);
    const safeSnippet = escapeHtml(snippet);
    return `${prefix}${highlightKeywords(safeSnippet, keywords)}${suffix}`;
  }

  function countMatches(text, keywords) {
    const haystack = (text || "").toLowerCase();
    if (!haystack || !keywords.length) return 0;
    return keywords.reduce((total, keyword) => total + (haystack.includes(keyword) ? 1 : 0), 0);
  }

  function scoreItem(item, keywords) {
    const titleScore = countMatches(item.title, keywords) * 50;
    const tagScore = countMatches((item.tags || []).join(" "), keywords) * 30;
    const summaryScore = countMatches(item.summary, keywords) * 18;
    const contentScore = countMatches(item.content, keywords) * 10;
    return titleScore + tagScore + summaryScore + contentScore;
  }

  function getFilteredItems() {
    const keywords = getKeywords(input.value.trim());
    if (!keywords.length) return [];

    return storage.items
      .map((item) => {
        const haystack = `${item.title} ${item.summary} ${item.content || ""} ${(item.tags || []).join(" ")}`.toLowerCase();
        const matched = keywords.every((keyword) => haystack.includes(keyword));
        return matched
          ? { ...item, _score: scoreItem(item, keywords) }
          : null;
      })
      .filter(Boolean)
      .sort((a, b) => b._score - a._score)
      .slice(0, 8);
  }

  function refreshResults() {
    const items = getFilteredItems();
    renderResults(items);
    return items;
  }

  function confirmActive() {
    const items = getFilteredItems();
    if (!items.length) return;
    window.location.href = items[0].permalink;
  }

  openButton.addEventListener("click", async () => {
    await loadData();
    openModal();
    refreshResults();
  });

  closeTargets.forEach((node) => {
    node.addEventListener("click", closeModal);
  });

  confirmButton.addEventListener("click", confirmActive);

  input.addEventListener("input", () => {
    refreshResults();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmActive();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== input) {
      event.preventDefault();
      loadData().then(() => {
        openModal();
        refreshResults();
      });
    }
  });
})();
