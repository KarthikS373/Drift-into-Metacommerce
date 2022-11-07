export const loadExternalScript = function (path) {
  var result = $.Deferred();
  var script = document.createElement("script");

  script.async = "async";
  script.type = "text/javascript";
  script.src = path;
  script.onload = script.onreadystatechange = function (_, isAbort) {
    if (!script.readyState || /loaded|complete/.test(script.readyState)) {
      if (isAbort) result.reject();
      else result.resolve();
    }
  };

  script.onerror = function () {
    result.reject();
  };

  $("head")[0].appendChild(script);
  // console.log(document.getElementsByName("head"));

  return result.promise();
};
