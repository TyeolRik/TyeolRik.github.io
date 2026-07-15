(() => {
  "use strict";

  const navbar = document.querySelector(".navbar-custom");
  const navigation = document.getElementById("main-navigation");

  const updateNavbar = () => {
    if (navbar) navbar.classList.toggle("top-nav-collapse", window.scrollY > 50);
  };

  const closeNavigation = () => {
    if (!navigation || !navigation.classList.contains("show") || !window.bootstrap) return;
    window.bootstrap.Collapse.getOrCreateInstance(navigation, { toggle: false }).hide();
  };

  document.querySelectorAll('a.page-scroll[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      link.blur();
      closeNavigation();
    });
  });

  document.querySelectorAll("#main-navigation a, .navbar-brand").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.querySelectorAll("[data-share-popup]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const width = 580;
      const height = 470;
      const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
      const top = window.screenY + Math.max(0, (window.outerHeight - height) / 3);
      const popup = window.open(
        link.href,
        "share",
        `popup=yes,scrollbars=yes,width=${width},height=${height},left=${left},top=${top}`
      );
      if (popup) popup.focus();
    });
  });

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });
})();
