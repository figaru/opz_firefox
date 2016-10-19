require("sdk/simple-prefs").on("app_running", appStatusChange);
const pref = require('sdk/simple-prefs').prefs;
const track = require("./track.js");


function appStatusChange(key) {
	if(pref[key]){
		track.start();
	}else{
		track.stop();
	}
}



function set(key, value){
	pref[key] = value;
}

function get(key){
	return pref[key];
}

exports.get = get;
exports.set = set;