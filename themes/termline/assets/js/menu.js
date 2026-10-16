const container = document.querySelector(".container");
const allMenus = document.querySelectorAll(".menu");

const closeMenu = (menu) => {
  menu.classList.remove("open");

  const trigger = menu.querySelector(".menu__trigger");
  if (trigger) {
    trigger.setAttribute("aria-expanded", "false");
  }
};

const closeAllMenus = () => {
  allMenus.forEach((menu) => {
    closeMenu(menu);
  });
};

// Hide menus on body click
document.body.addEventListener("click", closeAllMenus);

// Reset menus on resize
window.addEventListener("resize", closeAllMenus);

// Handle menus with dropdowns ("更多" and language selector)
allMenus.forEach((menu) => {
  const trigger = menu.querySelector(".menu__trigger");
  const dropdown = menu.querySelector(".menu__dropdown");

  if (!trigger || !dropdown) {
    return;
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();

    if (menu.classList.contains("open")) {
      closeMenu(menu);
    } else {
      closeAllMenus();
      menu.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    }

    if (dropdown.getBoundingClientRect().right > container.getBoundingClientRect().right) {
      dropdown.style.left = "auto";
      dropdown.style.right = 0;
    }
  });

  dropdown.addEventListener("click", (e) => e.stopPropagation());
});
