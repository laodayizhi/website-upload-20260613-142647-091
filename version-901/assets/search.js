(function () {
    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;",
                "'": "&#39;"
            }[char];
        });
    }

    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var input = document.querySelector("[data-search-page-input]");
        var list = document.querySelector("[data-search-results]");
        var empty = document.querySelector("[data-search-empty]");
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";
        if (input) {
            input.value = initial;
        }
        function render() {
            if (!list) {
                return;
            }
            var term = input ? input.value.trim().toLowerCase() : "";
            var movies = window.SearchMovies || [];
            var matches = movies.filter(function (movie) {
                if (!term) {
                    return true;
                }
                var text = [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.tags, movie.category, movie.oneLine].join(" ").toLowerCase();
                return text.indexOf(term) !== -1;
            }).slice(0, 240);
            list.innerHTML = matches.map(function (movie) {
                return '<article class="movie-card" data-search="' + escapeHtml([movie.title, movie.year, movie.region, movie.type, movie.genre, movie.tags, movie.category].join(" ")) + '">' +
                    '<a class="poster-link" href="' + escapeHtml(movie.file) + '" aria-label="观看 ' + escapeHtml(movie.title) + '">' +
                    '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" decoding="async">' +
                    '<span class="poster-gradient"></span>' +
                    '<span class="card-type">' + escapeHtml(movie.type) + '</span>' +
                    '<span class="card-year">' + escapeHtml(movie.year) + '</span>' +
                    '</a>' +
                    '<div class="card-content">' +
                    '<a href="' + escapeHtml(movie.file) + '" class="card-title">' + escapeHtml(movie.title) + '</a>' +
                    '<p class="card-desc">' + escapeHtml(movie.oneLine) + '</p>' +
                    '<div class="card-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.category) + '</span><span>热度 ' + escapeHtml(movie.score) + '</span></div>' +
                    '<div class="card-tags"><span>' + escapeHtml(movie.genre) + '</span></div>' +
                    '</div>' +
                    '</article>';
            }).join("");
            if (empty) {
                empty.classList.toggle("is-visible", matches.length === 0);
            }
        }
        if (input) {
            input.addEventListener("input", render);
        }
        render();
    });
})();
