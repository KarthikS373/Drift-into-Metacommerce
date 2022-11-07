window.requestAnimFrame = (() => {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback, element) {
      return window.setTimeout(callback, 1000 / 60);
    }
  );
})();

window.cancelRequestAnimFrame = (function () {
  return (
    window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.clearTimeout
  );
})();

function supports_video() {
  return !!document.createElement("video").canPlayType;
}

function supports_h264_baseline_video() {
  if (!supports_video()) {
    return false;
  }
  const v = document.createElement("video");
  return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
}

function supports_webm_video() {
  if (!supports_video()) {
    return false;
  }
  const v = document.createElement("video");
  return v.canPlayType('video/webm; codecs="vp8"');
}
