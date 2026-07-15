(() => {
  "use strict";

  const loader = document.currentScript;
  const measurementId = loader && loader.dataset.measurementId;
  if (!measurementId || window.location.hostname !== "tyeolrik.github.io") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  const tag = document.createElement("script");
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(tag);
})();
