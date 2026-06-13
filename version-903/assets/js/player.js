(function () {
  function initPlayer(frame) {
    var video = frame.querySelector('video');
    var overlay = frame.querySelector('[data-player-overlay]');
    var button = frame.querySelector('[data-player-button]');
    var source = frame.getAttribute('data-source') || (video && video.getAttribute('data-source'));
    var loaded = false;
    var hls = null;

    if (!video || !source) {
      return;
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    }

    function loadSource() {
      if (loaded) {
        return;
      }
      loaded = true;
      video.controls = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().then(hideOverlay).catch(hideOverlay);
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal && hls) {
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
              video.src = source;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', function () {
          video.play().then(hideOverlay).catch(hideOverlay);
        }, { once: true });
      } else {
        video.src = source;
        video.play().then(hideOverlay).catch(hideOverlay);
      }
    }

    function togglePlayback() {
      if (!loaded) {
        loadSource();
        return;
      }
      if (video.paused) {
        video.play().then(hideOverlay).catch(hideOverlay);
      } else {
        video.pause();
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        loadSource();
      });
    }

    video.addEventListener('click', togglePlayback);
    video.addEventListener('play', hideOverlay);
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(initPlayer);
  });
})();
