(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initImages() {
    qsa('img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.classList.add('image-hidden');
      });
    });
  }

  function initMenu() {
    var button = qs('[data-menu-toggle]');
    var menu = qs('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('is-open');
      button.setAttribute('aria-expanded', menu.classList.contains('is-open') ? 'true' : 'false');
    });
  }

  function initSearchForms() {
    qsa('[data-header-search]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = qs('input[name="q"]', form);
        if (!input || !input.value.trim()) {
          event.preventDefault();
          input && input.focus();
        }
      });
    });
  }

  function initHero() {
    qsa('[data-hero]').forEach(function (hero) {
      var slides = qsa('[data-hero-slide]', hero);
      var dots = qsa('[data-hero-dot]', hero);
      if (!slides.length) {
        return;
      }
      var active = 0;
      var timer;
      function show(index) {
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, idx) {
          slide.classList.toggle('is-active', idx === active);
        });
        dots.forEach(function (dot, idx) {
          dot.classList.toggle('is-active', idx === active);
          dot.setAttribute('aria-selected', idx === active ? 'true' : 'false');
        });
      }
      function start() {
        stop();
        timer = window.setInterval(function () {
          show(active + 1);
        }, 5000);
      }
      function stop() {
        if (timer) {
          window.clearInterval(timer);
        }
      }
      dots.forEach(function (dot, idx) {
        dot.addEventListener('click', function () {
          show(idx);
          start();
        });
      });
      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
      show(0);
      start();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initImages();
    initMenu();
    initSearchForms();
    initHero();
  });
})();
