var _currentDirPath = "js/";

function include(url) {
	var script = document.createElement('script');
	script.async = false;
	script.src = url;
	// script.async = false;
	// document.getElementById("scripts").appendChild(script);
	// script.async = false;
	// document.body.appendChild(script);
	document.getElementsByTagName('head')[0].appendChild(script);
	return true;
}
if (include(_currentDirPath + "engine/_include.js")) {
	include(_currentDirPath + "GemTD/_include.js");
	include(_currentDirPath + "main.js");
}