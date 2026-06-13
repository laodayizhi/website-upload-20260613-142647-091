(function () {
    function all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function initMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = all('[data-hero-slide]', hero);
        var dots = all('[data-hero-dot]', hero);
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function play() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                show(dotIndex);
                play();
            });
        });

        show(0);
        play();
    }

    function initSearch() {
        var panel = document.querySelector('[data-search-panel]');
        if (!panel) {
            return;
        }
        var keyword = panel.querySelector('[data-filter-keyword]');
        var region = panel.querySelector('[data-filter-region]');
        var type = panel.querySelector('[data-filter-type]');
        var cards = all('[data-movie-card]');
        var empty = document.querySelector('[data-empty-state]');

        function text(value) {
            return String(value || '').trim().toLowerCase();
        }

        function apply() {
            var q = text(keyword && keyword.value);
            var selectedRegion = text(region && region.value);
            var selectedType = text(type && type.value);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = text(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-genre'));
                var cardRegion = text(card.getAttribute('data-region'));
                var cardType = text(card.getAttribute('data-type'));
                var matched = true;

                if (q && haystack.indexOf(q) === -1) {
                    matched = false;
                }
                if (selectedRegion && cardRegion !== selectedRegion) {
                    matched = false;
                }
                if (selectedType && cardType !== selectedType) {
                    matched = false;
                }

                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.style.display = visible ? 'none' : 'block';
            }
        }

        try {
            var params = new URLSearchParams(window.location.search);
            var query = params.get('q');
            if (query && keyword && !keyword.value) {
                keyword.value = query;
            }
        } catch (error) {}

        [keyword, region, type].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });

        apply();
    }

    function initPlayer() {
        all('[data-player]').forEach(function (player) {
            var video = player.querySelector('video');
            var cover = player.querySelector('[data-play]');
            var src = player.getAttribute('data-src');
            var started = false;
            var hls = null;

            if (!video || !cover || !src) {
                return;
            }

            function bindSource() {
                if (started) {
                    return;
                }
                started = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = src;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });
                    hls.loadSource(src);
                    hls.attachMedia(video);
                } else {
                    video.src = src;
                }
            }

            function start() {
                bindSource();
                cover.classList.add('is-hidden');
                video.setAttribute('controls', 'controls');
                var promise = video.play();
                if (promise && promise.catch) {
                    promise.catch(function () {});
                }
            }

            cover.addEventListener('click', start);
            video.addEventListener('click', function () {
                if (!started) {
                    start();
                }
            });
            video.addEventListener('play', function () {
                cover.classList.add('is-hidden');
            });
            window.addEventListener('pagehide', function () {
                if (hls) {
                    hls.destroy();
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initSearch();
        initPlayer();
    });
})();
