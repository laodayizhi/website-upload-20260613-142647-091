(function () {
  function closest(element, selector) {
    while (element && element.nodeType === 1) {
      if (element.matches(selector)) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function setupMobileMenu() {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }

  function setupCarousel() {
    document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
      var target = carousel.querySelector("[data-carousel-track]");
      var prev = carousel.querySelector("[data-carousel-prev]");
      var next = carousel.querySelector("[data-carousel-next]");
      if (!target) {
        return;
      }
      function move(direction) {
        var amount = Math.max(280, Math.floor(target.clientWidth * 0.8));
        target.scrollBy({
          left: direction * amount,
          behavior: "smooth"
        });
      }
      if (prev) {
        prev.addEventListener("click", function () {
          move(-1);
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          move(1);
        });
      }
    });
  }

  function setupFilters() {
    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
      var keywordInput = panel.querySelector("[data-filter-keyword]");
      var yearInput = panel.querySelector("[data-filter-year]");
      var categorySelect = panel.querySelector("[data-filter-category]");
      var resetButton = panel.querySelector("[data-filter-reset]");
      var scope = closest(panel, "main") || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-search-card]"));
      var empty = scope.querySelector("[data-empty-state]");

      function cardText(card) {
        return [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" ").toLowerCase();
      }

      function applyFilter() {
        var keyword = normalize(keywordInput && keywordInput.value);
        var year = normalize(yearInput && yearInput.value);
        var category = normalize(categorySelect && categorySelect.value);
        var shown = 0;

        cards.forEach(function (card) {
          var text = cardText(card);
          var cardYear = normalize(card.getAttribute("data-year"));
          var cardCategory = normalize(card.getAttribute("data-category"));
          var ok = true;

          if (keyword && text.indexOf(keyword) === -1) {
            ok = false;
          }
          if (year && cardYear.indexOf(year) === -1) {
            ok = false;
          }
          if (category && cardCategory !== category) {
            ok = false;
          }

          card.style.display = ok ? "" : "none";
          if (ok) {
            shown += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("show", shown === 0);
        }
      }

      [keywordInput, yearInput, categorySelect].forEach(function (input) {
        if (input) {
          input.addEventListener("input", applyFilter);
          input.addEventListener("change", applyFilter);
        }
      });

      if (resetButton) {
        resetButton.addEventListener("click", function () {
          if (keywordInput) {
            keywordInput.value = "";
          }
          if (yearInput) {
            yearInput.value = "";
          }
          if (categorySelect) {
            categorySelect.value = "";
          }
          applyFilter();
        });
      }
    });
  }

  window.initializeMoviePlayer = function (streamUrl) {
    var container = document.querySelector("[data-player]");
    if (!container) {
      return;
    }

    var video = container.querySelector("video");
    var startButton = container.querySelector("[data-player-start]");
    var ready = false;
    var hls = null;

    function attachStream() {
      if (!video || ready) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        ready = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        ready = true;
        return;
      }

      video.src = streamUrl;
      ready = true;
    }

    function playMovie() {
      attachStream();
      container.classList.add("is-playing");
      video.setAttribute("controls", "controls");
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {});
      }
    }

    if (startButton) {
      startButton.addEventListener("click", playMovie);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          playMovie();
        }
      });
      video.addEventListener("play", function () {
        container.classList.add("is-playing");
      });
      video.addEventListener("ended", function () {
        container.classList.remove("is-playing");
      });
    }

    window.addEventListener("beforeunload", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  };

  document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    setupCarousel();
    setupFilters();
  });
})();
