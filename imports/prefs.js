const pref = require('sdk/simple-prefs').prefs;

function get(key){
	return pref[key];
}

exports.get = get;