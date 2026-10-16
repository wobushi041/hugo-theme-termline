(function () {
  function initTocSidebar(sidebar) {
    var toggle = sidebar.querySelector("[data-toc-toggle]");
    var backToTop = sidebar.querySelector("[data-toc-back-to-top]");
    var panel = sidebar.querySelector("[data-toc-panel]");
    var layout = sidebar.closest(".post-layout");
    var main = layout ? layout.querySelector(".post-main") : null;
    var parent = sidebar.parentNode;
    var nextSibling = sidebar.nextSibling;
    var placeholder = document.createComment("toc-sidebar-placeholder");
    var isMounted = true;

    if (!toggle || !panel) {
      return;
    }

    var desktopCollapsed = false;

    function getBrowserZoomApprox() {
      var screenWidth = window.screen && window.screen.availWidth ? window.screen.availWidth : 0;
      var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;

      if (!screenWidth || !viewportWidth) {
        return 1;
      }

      return screenWidth / viewportWidth;
    }

    function syncState() {
      var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
      var rightMargin = 12;
      var minGap = 24;
      var minSidebarWidth = 150;
      var maxSidebarWidth = 260;
      var mainRight = main ? Math.ceil(main.getBoundingClientRect().right) : 0;
      var availableWidth = Math.floor(viewportWidth - mainRight - rightMargin);
      var runtimeWidth = Math.min(maxSidebarWidth, Math.max(minSidebarWidth, availableWidth - minGap));
      var zoomApprox = getBrowserZoomApprox();
      var hideToc = viewportWidth <= 1100 || !main || availableWidth < minSidebarWidth + minGap || zoomApprox >= 1.5;
      var tightToc = !hideToc && runtimeWidth < 190;

      if (hideToc) {
        desktopCollapsed = false;
        sidebar.style.removeProperty("--post-sidebar-runtime-width");
        sidebar.style.removeProperty("--post-sidebar-runtime-right");
        sidebar.classList.remove("is-collapsed");

        if (isMounted && parent) {
          parent.insertBefore(placeholder, nextSibling);
          sidebar.remove();
          isMounted = false;
        }

        return;
      }

      if (!isMounted && placeholder.parentNode) {
        placeholder.parentNode.insertBefore(sidebar, placeholder);
        placeholder.remove();
        isMounted = true;
      }

      sidebar.classList.toggle("is-tight", tightToc);

      var runtimeRight = rightMargin + availableWidth - minGap - runtimeWidth;

      sidebar.style.setProperty("--post-sidebar-runtime-width", runtimeWidth + "px");
      sidebar.style.setProperty("--post-sidebar-runtime-right", runtimeRight + "px");

      var isExpanded = !desktopCollapsed;

      sidebar.classList.toggle("is-collapsed", desktopCollapsed);
      toggle.setAttribute("aria-expanded", String(isExpanded));
      toggle.setAttribute("aria-label", isExpanded ? "收起目录" : "展开目录");
    }

    toggle.addEventListener("click", function () {
      desktopCollapsed = !desktopCollapsed;
      syncState();
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        desktopCollapsed = true;
        syncState();
      });
    });

    if (backToTop) {
      backToTop.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    }

    window.addEventListener("resize", syncState);
    window.addEventListener("orientationchange", syncState);

    syncState();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-toc-sidebar]").forEach(initTocSidebar);
  });
})();
