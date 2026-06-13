(function () {
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[ch];
    });
  }

  function getQuery() {
    return new URLSearchParams(window.location.search).get('q') || '';
  }

  function matchText(movie, keyword) {
    if (!keyword) {
      return true;
    }
    var text = [movie.title, movie.type, movie.region, movie.year, movie.genre, movie.tags, movie.oneLine].join(' ').toLowerCase();
    return text.indexOf(keyword.toLowerCase()) !== -1;
  }

  function card(movie) {
    return '<a class="movie-card" href="' + escapeHtml(movie.url) + '">' +
      '<div class="card-cover">' +
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="card-badge">' + escapeHtml(movie.type) + '</span>' +
      '<span class="card-duration">' + escapeHtml(movie.year) + '</span>' +
      '<span class="play-dot">▶</span>' +
      '</div>' +
      '<div class="card-body">' +
      '<h3 class="card-title">' + escapeHtml(movie.title) + '</h3>' +
      '<p class="card-copy">' + escapeHtml(movie.oneLine) + '</p>' +
      '<div class="card-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.genre) + '</span></div>' +
      '</div>' +
      '</a>';
  }

  function initFilters(movies) {
    var typeSelect = document.getElementById('typeFilter');
    var regionSelect = document.getElementById('regionFilter');
    var yearSelect = document.getElementById('yearFilter');
    function fill(select, values) {
      if (!select) {
        return;
      }
      values.forEach(function (value) {
        var option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
    }
    fill(typeSelect, Array.from(new Set(movies.map(function (movie) { return movie.type; }))).sort());
    fill(regionSelect, Array.from(new Set(movies.map(function (movie) { return movie.region; }))).sort());
    fill(yearSelect, Array.from(new Set(movies.map(function (movie) { return String(movie.year); }))).sort().reverse());
  }

  function initSearch() {
    var movies = window.SITE_MOVIES || [];
    var form = document.getElementById('searchPageForm');
    var input = document.getElementById('searchKeyword');
    var typeSelect = document.getElementById('typeFilter');
    var regionSelect = document.getElementById('regionFilter');
    var yearSelect = document.getElementById('yearFilter');
    var output = document.getElementById('searchResults');
    var title = document.getElementById('searchResultTitle');
    if (!form || !input || !output) {
      return;
    }
    input.value = getQuery();
    initFilters(movies);

    function render() {
      var keyword = input.value.trim();
      var type = typeSelect ? typeSelect.value : '';
      var region = regionSelect ? regionSelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      var list = movies.filter(function (movie) {
        return matchText(movie, keyword) &&
          (!type || movie.type === type) &&
          (!region || movie.region === region) &&
          (!year || String(movie.year) === year);
      }).slice(0, 80);
      if (title) {
        title.textContent = keyword ? '搜索结果：' + keyword : '热门推荐';
      }
      output.innerHTML = list.map(card).join('') || '<div class="info-card"><h2>暂无匹配内容</h2><p>可以换一个片名、地区、类型或年份继续查找。</p></div>';
      Array.prototype.slice.call(output.querySelectorAll('img')).forEach(function (img) {
        img.addEventListener('error', function () {
          img.classList.add('image-hidden');
        });
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var params = new URLSearchParams(window.location.search);
      if (input.value.trim()) {
        params.set('q', input.value.trim());
      } else {
        params.delete('q');
      }
      history.replaceState(null, '', window.location.pathname + (params.toString() ? '?' + params.toString() : ''));
      render();
    });

    [typeSelect, regionSelect, yearSelect].forEach(function (select) {
      if (select) {
        select.addEventListener('change', render);
      }
    });

    render();
  }

  document.addEventListener('DOMContentLoaded', initSearch);
})();
