/**
 * Footprints / Journeys Interactive Map Controller
 * Features:
 * - Dual Vector Map Switching: 34-Province SVG & 370-City Prefecture SVG
 * - Standard Albers projection calibration
 * - Robust JSON decode (double-encoding safeguard)
 * - High-precision status binding on both Province & Prefecture City levels
 * - Dynamic SVG text annotations for lit cities with exact coordinates
 * - Floating frosted-glass tooltip with viewport boundary protection
 * - Bidirectional synchronization between Maps, Filter Chips, and Story Cards
 * - Responsive theme-aware styling
 */
(() => {
  function initJourneysMap() {
    const pageContainer = document.querySelector("[data-journeys-page]");
    const dataElement = document.getElementById("journeys-page-data");
    if (!pageContainer || !dataElement) return;

    let pageData;
    try {
      pageData = JSON.parse(dataElement.textContent);
      // Double-decode safeguard in case of Go template escaping
      if (typeof pageData === "string") {
        pageData = JSON.parse(pageData);
      }
    } catch (e) {
      console.error("Failed to parse journeys page data", e);
      return;
    }

    const {
      provinces = [],
      spots = [],
      cityCoords = [],
      allCities = [],
      homeCity = ""
    } = pageData;

    const tooltip = pageContainer.querySelector(".footprint-tooltip");
    const cards = Array.from(pageContainer.querySelectorAll(".js-journeys-card"));
    const emptyState = pageContainer.querySelector("[data-journeys-empty]");
    const viewButtons = Array.from(pageContainer.querySelectorAll("[data-view-mode]"));
    const provinceBar = pageContainer.querySelector('[data-filter-bar="province"]');
    const cityBar = pageContainer.querySelector('[data-filter-bar="city"]');
    const filterChips = Array.from(pageContainer.querySelectorAll(".journeys-filter-chip"));

    const cornerTitle = pageContainer.querySelector("[data-corner-title]");
    const cornerVal = pageContainer.querySelector("[data-corner-val]");
    const cornerSub = pageContainer.querySelector("[data-corner-sub]");
    const cornerDesc = pageContainer.querySelector("[data-corner-desc]");

    const provinceElements = Array.from(pageContainer.querySelectorAll(".footprint-province"));
    const cityUnits = Array.from(pageContainer.querySelectorAll(".footprint-city-unit"));

    // 1. Build status indexes
    let visitedProvincesCount = 0;
    const visitedCitiesSet = new Set();
    const cityStatusMap = new Map();
    const provinceMap = new Map();

    const homeCitiesList = (typeof homeCity === "string" ? homeCity.split(/[、,，/ ·]+/) : [homeCity])
      .map((s) => s.trim().replace(/市|地区|自治州|盟/g, ""))
      .filter(Boolean);

    const isHomeCity = (name) => {
      if (!name) return false;
      const clean = name.replace(/市|地区|自治州|盟/g, "");
      return homeCitiesList.includes(clean) || homeCitiesList.includes(name);
    };

    provinces.forEach((p) => {
      provinceMap.set(p.name, p);
      if (p.shortName) provinceMap.set(p.shortName, p);

      const isResidentProv = p.status === "resident";
      const isVisitedProv = p.status === "visited";
      if (isResidentProv || isVisitedProv) {
        visitedProvincesCount++;
      }

      if (p.cities && Array.isArray(p.cities)) {
        p.cities.forEach((cityName) => {
          const cleanName = cityName.replace(/市|地区|自治州|盟/g, "");
          const isHome = isHomeCity(cleanName) || isHomeCity(cityName);
          const status = isHome ? "resident" : (p.status === "planned" ? "planned" : "visited");

          cityStatusMap.set(cleanName, { status, province: p.name, shortName: cleanName, fullName: cityName });
          cityStatusMap.set(cityName, { status, province: p.name, shortName: cleanName, fullName: cityName });
          if (!cityName.endsWith("市")) {
            cityStatusMap.set(cityName + "市", { status, province: p.name, shortName: cleanName, fullName: cityName });
          }

          if (status === "resident" || status === "visited") {
            visitedCitiesSet.add(cleanName);
          }
        });
      }
    });

    // Also register from cityCoords
    cityCoords.forEach((c) => {
      const cleanName = c.name.replace(/市|地区|自治州|盟/g, "");
      const isHome = c.isHome || isHomeCity(cleanName) || isHomeCity(c.name);
      const existing = cityStatusMap.get(cleanName) || cityStatusMap.get(c.name);
      const status = isHome ? "resident" : (c.status || (existing ? existing.status : "visited"));

      cityStatusMap.set(cleanName, { status, province: c.province, shortName: cleanName, fullName: c.name });
      cityStatusMap.set(c.name, { status, province: c.province, shortName: cleanName, fullName: c.name });
      if (status === "resident" || status === "visited") {
        visitedCitiesSet.add(cleanName);
      }
    });

    // Also register from spots
    spots.forEach((s) => {
      if (s.city) {
        const cleanName = s.city.replace(/市|地区|自治州|盟/g, "");
        if (!cityStatusMap.has(cleanName) && !cityStatusMap.has(s.city)) {
          cityStatusMap.set(cleanName, { status: "visited", province: s.province, shortName: cleanName, fullName: s.city });
          cityStatusMap.set(s.city, { status: "visited", province: s.province, shortName: cleanName, fullName: s.city });
          visitedCitiesSet.add(cleanName);
        }
      }
    });

    // 2. Mark status on Province SVG paths
    provinceElements.forEach((path) => {
      const name = path.getAttribute("data-name") || "";
      const shortName = path.getAttribute("data-short") || "";
      const p = provinceMap.get(name) || provinceMap.get(shortName);
      if (p && p.status) {
        path.classList.add("status-" + p.status);
      }
    });

    // 3. Mark status on Prefecture City SVG paths & add city text labels (文字注记)
    const citySvg = pageContainer.querySelector(".footprint-svg-city");
    let cityLabelsGroup = null;
    if (citySvg) {
      cityLabelsGroup = citySvg.querySelector(".footprint-city-unit-labels-group");
      if (!cityLabelsGroup) {
        cityLabelsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        cityLabelsGroup.setAttribute("class", "footprint-city-unit-labels-group");
        citySvg.appendChild(cityLabelsGroup);
      }
    }

    cityUnits.forEach((path) => {
      const name = path.getAttribute("data-name") || "";
      const shortName = path.getAttribute("data-short") || "";
      const provName = path.getAttribute("data-province") || "";
      const cx = path.getAttribute("data-cx");
      const cy = path.getAttribute("data-cy");

      let match = cityStatusMap.get(shortName) || cityStatusMap.get(name);
      if (!match) {
        for (const [k, v] of cityStatusMap.entries()) {
          if (name.includes(k) || k.includes(shortName) || (shortName && k.startsWith(shortName))) {
            match = v;
            break;
          }
        }
      }

      if (match) {
        path.classList.add("status-" + match.status);
        path.setAttribute("data-status", match.status);
        visitedCitiesSet.add(shortName || name);

        // Add SVG text label on lit cities
        if (cityLabelsGroup && cx && cy && cx !== "0" && cy !== "0") {
          const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
          lbl.setAttribute("class", "footprint-city-unit-label status-" + match.status);
          lbl.setAttribute("x", cx);
          lbl.setAttribute("y", cy);
          lbl.setAttribute("data-city", shortName || name);
          lbl.textContent = shortName || name;
          cityLabelsGroup.appendChild(lbl);
        }
      }
    });

    // 4. Tooltip controller
    function showTooltip(e, title, badge, details) {
      if (!tooltip) return;
      tooltip.innerHTML = `
        <div class="footprint-tooltip__header">
          <span class="footprint-tooltip__title">${title}</span>
          ${badge ? `<span class="footprint-tooltip__badge footprint-tooltip__badge--${badge.type}">${badge.text}</span>` : ""}
        </div>
        ${details ? `<div class="footprint-tooltip__body">${details}</div>` : ""}
      `;
      tooltip.removeAttribute("aria-hidden");
      tooltip.classList.add("is-visible");
      positionTooltip(e);
    }

    function positionTooltip(e) {
      if (!tooltip || !tooltip.classList.contains("is-visible")) return;
      const wrapRect = pageContainer.querySelector(".journeys-map-canvas-wrap").getBoundingClientRect();
      let x = e.clientX - wrapRect.left + 14;
      let y = e.clientY - wrapRect.top + 14;

      const tipWidth = tooltip.offsetWidth || 180;
      const tipHeight = tooltip.offsetHeight || 80;

      if (x + tipWidth > wrapRect.width - 15) {
        x = e.clientX - wrapRect.left - tipWidth - 14;
      }
      if (y + tipHeight > wrapRect.height - 15) {
        y = e.clientY - wrapRect.top - tipHeight - 14;
      }

      tooltip.style.transform = `translate(${Math.max(10, x)}px, ${Math.max(10, y)}px)`;
    }

    function hideTooltip() {
      if (!tooltip) return;
      tooltip.classList.remove("is-visible");
      tooltip.setAttribute("aria-hidden", "true");
    }

    // SVG Z-Index stacking helper: raises element to top of its layer so outer highlight border & glow are not clipped by siblings
    function raiseElement(el) {
      if (!el || !el.parentNode) return;
      if (el.nextElementSibling) {
        el.parentNode.appendChild(el);
      }
    }

    function restoreSelectedLayer() {
      if (currentMode === "province") {
        provinceElements.forEach((p) => {
          if (p.classList.contains("is-selected")) raiseElement(p);
        });
      } else if (currentMode === "city") {
        cityUnits.forEach((c) => {
          if (c.classList.contains("is-selected")) raiseElement(c);
        });
      }
    }

    // 5. Province interactions
    provinceElements.forEach((path) => {
      const name = path.getAttribute("data-name") || "";
      const shortName = path.getAttribute("data-short") || "";
      const pData = provinceMap.get(name) || provinceMap.get(shortName);

      path.addEventListener("pointerenter", (e) => {
        if (currentMode !== "province") return;
        raiseElement(path);
        let badge = null;
        let details = "";

        if (pData) {
          const statusLabels = { resident: "常住", visited: "已打卡", planned: "计划心愿" };
          badge = { type: pData.status, text: statusLabels[pData.status] || "已涉足" };
          if (pData.cities && pData.cities.length) {
            details = `<span class="footprint-tooltip__cities">已去过：${pData.cities.join("、")}</span>`;
          }
        } else {
          badge = { type: "unvisited", text: "尚未涉足" };
          details = "期待未来的相逢";
        }

        showTooltip(e, name, badge, details);
      });

      path.addEventListener("pointermove", (e) => {
        if (currentMode === "province") positionTooltip(e);
      });

      path.addEventListener("pointerleave", () => {
        if (currentMode === "province") {
          hideTooltip();
          restoreSelectedLayer();
        }
      });

      path.addEventListener("click", () => {
        if (currentMode !== "province") return;
        const nextVal = currentFilter === name ? "" : name;
        applyFilter("province", nextVal);
      });
    });

    // 6. City Unit interactions
    cityUnits.forEach((path) => {
      const name = path.getAttribute("data-name") || "";
      const shortName = path.getAttribute("data-short") || "";
      const provName = path.getAttribute("data-province") || "";
      const status = path.getAttribute("data-status");

      path.addEventListener("pointerenter", (e) => {
        if (currentMode !== "city") return;
        raiseElement(path);
        let badge = null;
        let details = `隶属 ${provName}`;

        if (status === "resident") {
          badge = { type: "resident", text: "常住地" };
        } else if (status === "visited") {
          badge = { type: "visited", text: "已打卡" };
        } else if (status === "planned") {
          badge = { type: "planned", text: "计划心愿" };
        } else {
          badge = { type: "unvisited", text: "尚未涉足" };
        }

        showTooltip(e, name, badge, details);
      });

      path.addEventListener("pointermove", (e) => {
        if (currentMode === "city") positionTooltip(e);
      });

      path.addEventListener("pointerleave", () => {
        if (currentMode === "city") {
          hideTooltip();
          restoreSelectedLayer();
        }
      });

      path.addEventListener("click", () => {
        if (currentMode !== "city") return;
        const targetVal = shortName || name;
        const nextVal = currentFilter === targetVal ? "" : targetVal;
        applyFilter("city", nextVal);
      });
    });

    // 7. Filter logic & Card synchronization
    let currentMode = "province"; // 'province' | 'city'
    let currentFilter = "";

    function applyFilter(mode, val) {
      currentFilter = val;

      // Update chips active state
      filterChips.forEach((chip) => {
        const chipMode = chip.getAttribute("data-filter-mode");
        const chipVal = chip.getAttribute("data-filter-val") || "";
        const isActive = chipMode === mode && chipVal === val;
        chip.classList.toggle("is-active", isActive);
      });

      // Update Province paths
      provinceElements.forEach((path) => {
        const name = path.getAttribute("data-name") || "";
        const shortName = path.getAttribute("data-short") || "";
        if (!val) {
          path.classList.remove("is-selected", "is-dimmed");
        } else if (mode === "province") {
          const match = name === val || shortName === val;
          path.classList.toggle("is-selected", match);
          path.classList.toggle("is-dimmed", !match);
          if (match) raiseElement(path);
        }
      });

      // Update City paths
      cityUnits.forEach((path) => {
        const name = path.getAttribute("data-name") || "";
        const shortName = path.getAttribute("data-short") || "";
        const provName = path.getAttribute("data-province") || "";

        if (!val) {
          path.classList.remove("is-selected", "is-dimmed");
        } else if (mode === "city") {
          const match = name === val || shortName === val || name.includes(val) || val.includes(shortName);
          path.classList.toggle("is-selected", match);
          path.classList.toggle("is-dimmed", !match);
          if (match) raiseElement(path);
        } else if (mode === "province") {
          const match = provName === val || provName.includes(val);
          path.classList.toggle("is-selected", match);
          path.classList.toggle("is-dimmed", !match);
          if (match) raiseElement(path);
        }
      });

      // Update City text labels
      const cityUnitLabels = Array.from(pageContainer.querySelectorAll(".footprint-city-unit-label"));
      cityUnitLabels.forEach((lbl) => {
        const lCity = lbl.getAttribute("data-city") || "";
        if (!val) {
          lbl.classList.remove("is-selected", "is-dimmed");
        } else {
          const match = lCity === val || val.includes(lCity) || lCity.includes(val);
          lbl.classList.toggle("is-selected", match);
          lbl.classList.toggle("is-dimmed", !match);
        }
      });

      // Filter story cards
      let visibleCount = 0;
      cards.forEach((card) => {
        const cProv = card.getAttribute("data-province") || "";
        const cCity = card.getAttribute("data-city") || "";

        let match = false;
        if (!val) {
          match = true;
        } else if (mode === "province") {
          match = cProv.includes(val) || val.includes(cProv);
        } else if (mode === "city") {
          const cleanVal = val.replace(/市|地区|自治州|盟/g, "");
          const cleanCardCity = cCity.replace(/市|地区|自治州|盟/g, "");
          match = cleanCardCity.includes(cleanVal) || cleanVal.includes(cleanCardCity);
        }

        card.hidden = !match;
        if (match) visibleCount++;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }
    }

    // Bind chip clicks
    filterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const mode = chip.getAttribute("data-filter-mode");
        const val = chip.getAttribute("data-filter-val") || "";
        applyFilter(mode, val);
      });
    });

    // 8. View Mode Switcher
    function setViewMode(mode) {
      currentMode = mode;
      pageContainer.setAttribute("data-view", mode);

      viewButtons.forEach((b) => {
        const m = b.getAttribute("data-view-mode");
        b.classList.toggle("is-active", m === mode);
      });

      hideTooltip();

      if (provinceBar) {
        provinceBar.hidden = mode !== "province";
      }
      if (cityBar) {
        cityBar.hidden = mode !== "city";
      }

      // Update corner stats card
      if (cornerTitle && cornerVal && cornerSub && cornerDesc) {
        if (mode === "city") {
          cornerTitle.textContent = "已点亮城市";
          cornerVal.textContent = visitedCitiesSet.size;
          cornerSub.textContent = "个地级市";
          cornerDesc.innerHTML = `已点亮 <b>${visitedCitiesSet.size}</b> 个城市 · 常住 <b>${homeCity}</b>`;
        } else {
          cornerTitle.textContent = "已点亮中国";
          cornerVal.textContent = visitedProvincesCount;
          cornerSub.textContent = "/ 34 省市";
          cornerDesc.innerHTML = `打卡 <b>${visitedCitiesSet.size}</b> 个城市 · 常住 <b>${homeCity}</b>`;
        }
      }

      // Reset filter in new view mode
      applyFilter(mode, "");
    }

    viewButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-view-mode");
        setViewMode(mode);
      });
    });

    // Initialize to Province view
    setViewMode("province");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initJourneysMap);
  } else {
    initJourneysMap();
  }
})();
