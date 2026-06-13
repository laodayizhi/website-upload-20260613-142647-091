(function () {
    var input = document.querySelector('[data-search-input]');
    var form = document.querySelector('[data-search-form]');
    var results = document.querySelector('[data-search-results]');
    var summary = document.querySelector('[data-search-summary]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (!input || !results || !Array.isArray(window.MOVIE_SEARCH_DATA)) {
        return;
    }

    input.value = initialQuery;

    function cardTemplate(movie) {
        var tags = movie.tags.slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');

        return [
            '<article class="movie-card">',
            '<a class="poster-link" href="./' + movie.file + '" aria-label="观看' + escapeHtml(movie.title) + '">',
            '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '<span class="poster-badge">' + escapeHtml(movie.type) + '</span>',
            '</a>',
            '<div class="movie-card-body">',
            '<div class="movie-meta-line"><span>' + movie.year + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
            '<h3><a href="./' + movie.file + '">' + escapeHtml(movie.title) + '</a></h3>',
            '<p>' + escapeHtml(movie.oneLine) + '</p>',
            '<div class="tag-row">' + tags + '</div>',
            '</div>',
            '</article>'
        ].join('');
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"]/g, function (character) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            }[character];
        });
    }

    function search(query) {
        var cleanQuery = query.trim().toLowerCase();
        var matches;

        if (!cleanQuery) {
            matches = window.MOVIE_SEARCH_DATA.slice(0, 48);
            summary.textContent = '输入关键词后查看匹配内容。';
        } else {
            matches = window.MOVIE_SEARCH_DATA.filter(function (movie) {
                return movie.searchText.indexOf(cleanQuery) !== -1;
            }).slice(0, 96);
            summary.textContent = matches.length ? '已为你筛选出相关影片。' : '没有找到匹配内容。';
        }

        results.innerHTML = matches.map(cardTemplate).join('');
    }

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var query = input.value.trim();
            var url = new URL(window.location.href);

            if (query) {
                url.searchParams.set('q', query);
            } else {
                url.searchParams.delete('q');
            }

            window.history.replaceState(null, '', url.toString());
            search(query);
        });
    }

    input.addEventListener('input', function () {
        search(input.value);
    });

    search(initialQuery);
}());
