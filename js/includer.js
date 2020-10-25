var _currentDirPath = "js/";
function include(url) {
    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}
include(_currentDirPath + "engine/_include.js");
include(_currentDirPath + "GemTD/_include.js");
include(_currentDirPath + "data.js");
include(_currentDirPath + "main.js");