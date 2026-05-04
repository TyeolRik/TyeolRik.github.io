(function () {
  var photos = [
    "./gallery/photo1.jpg",
    "./gallery/photo2.jpg",
    "./gallery/photo3.jpg",
    "./gallery/photo4.jpg"
  ];

  var viewer = document.querySelector(".viewer");
  var viewerImage = document.querySelector(".viewer__image");
  var closeButton = document.querySelector(".viewer__close");
  var prevButton = document.querySelector(".viewer__nav--prev");
  var nextButton = document.querySelector(".viewer__nav--next");
  var currentIndex = 0;

  function openViewer(index) {
    currentIndex = index;
    viewerImage.src = photos[currentIndex];
    viewerImage.alt = "갤러리 사진 " + (currentIndex + 1) + " 크게 보기";
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeViewer() {
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function moveViewer(step) {
    currentIndex = (currentIndex + step + photos.length) % photos.length;
    viewerImage.src = photos[currentIndex];
    viewerImage.alt = "갤러리 사진 " + (currentIndex + 1) + " 크게 보기";
  }

  document.querySelectorAll("[data-gallery-index]").forEach(function (button) {
    button.addEventListener("click", function () {
      openViewer(Number(button.getAttribute("data-gallery-index")));
    });
  });

  closeButton.addEventListener("click", closeViewer);
  prevButton.addEventListener("click", function () {
    moveViewer(-1);
  });
  nextButton.addEventListener("click", function () {
    moveViewer(1);
  });

  viewer.addEventListener("click", function (event) {
    if (event.target === viewer) {
      closeViewer();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (!viewer.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeViewer();
    } else if (event.key === "ArrowLeft") {
      moveViewer(-1);
    } else if (event.key === "ArrowRight") {
      moveViewer(1);
    }
  });

  var status = document.querySelector(".copy-status");

  function setStatus(message) {
    status.textContent = message;
    window.clearTimeout(setStatus.timer);
    setStatus.timer = window.setTimeout(function () {
      status.textContent = "";
    }, 2200);
  }

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      setStatus("계좌번호를 복사했습니다.");
    } catch (error) {
      setStatus("복사하지 못했습니다. 계좌번호를 직접 선택해 주세요.");
    } finally {
      document.body.removeChild(textarea);
    }
  }

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var text = button.getAttribute("data-copy");

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () {
          setStatus("계좌번호를 복사했습니다.");
        }).catch(function () {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    });
  });

  var countdown = document.querySelector("[data-wedding-date]");

  function renderCountdown() {
    var weddingDate = new Date(countdown.getAttribute("data-wedding-date"));
    var today = new Date();
    var diff = weddingDate.getTime() - today.getTime();
    var day = Math.ceil(diff / 86400000);

    if (day > 0) {
      countdown.textContent = "예식까지 " + day + "일 남았습니다.";
    } else if (day === 0) {
      countdown.textContent = "오늘 예식이 진행됩니다.";
    } else {
      countdown.textContent = "함께해 주셔서 감사합니다.";
    }
  }

  if (countdown) {
    renderCountdown();
  }
}());
