(function () {
    function init(options) {
        var video = document.querySelector(options.videoSelector);
        var trigger = document.querySelector(options.triggerSelector);
        var overlay = document.querySelector(options.overlaySelector);
        if (!video || !options.source) {
            return;
        }
        var started = false;
        var hls = null;
        function attach() {
            if (started) {
                return;
            }
            started = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = options.source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(options.source);
                hls.attachMedia(video);
            } else {
                video.src = options.source;
            }
            video.controls = true;
            video.setAttribute("playsinline", "");
        }
        function start() {
            attach();
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }
        if (trigger) {
            trigger.addEventListener("click", start);
        }
        if (overlay) {
            overlay.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (!started || video.paused) {
                start();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }
    window.SitePlayer = {
        init: init
    };
})();
