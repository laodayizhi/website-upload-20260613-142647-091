(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                panel.classList.toggle("is-open");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
            var index = 0;
            var timer = null;
            function show(next) {
                if (!slides.length) {
                    return;
                }
                index = (next + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("is-active", i === index);
                });
            }
            function play() {
                clearInterval(timer);
                timer = setInterval(function () {
                    show(index + 1);
                }, 5200);
            }
            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                    play();
                });
            });
            show(0);
            play();
            hero.addEventListener("mouseenter", function () {
                clearInterval(timer);
            });
            hero.addEventListener("mouseleave", play);
        }

        var filterInput = document.querySelector("[data-filter-input]");
        var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]"));
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-search]"));
        var empty = document.querySelector("[data-empty]");
        var activeChip = "all";
        function applyFilter() {
            var term = filterInput ? filterInput.value.trim().toLowerCase() : "";
            var shown = 0;
            cards.forEach(function (card) {
                var text = (card.getAttribute("data-search") || "").toLowerCase();
                var chipOk = activeChip === "all" || text.indexOf(activeChip.toLowerCase()) !== -1;
                var termOk = !term || text.indexOf(term) !== -1;
                var visible = chipOk && termOk;
                card.style.display = visible ? "" : "none";
                if (visible) {
                    shown += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", shown === 0);
            }
        }
        if (filterInput) {
            filterInput.addEventListener("input", applyFilter);
        }
        filterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                activeChip = button.getAttribute("data-filter-chip") || "all";
                filterButtons.forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                applyFilter();
            });
        });
        applyFilter();
    });
})();
