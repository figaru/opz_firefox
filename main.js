var self = require("sdk/self");
var base64 = require("./imports/base64");
var startup = require("./imports/startup.js");
var storage = require("./imports/storage.js");
var panel = require("./imports/panel.js");
var request = require("./imports/requests.js");
var auth = require("./imports/auth.js");


// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js

exports.main = function (options, callbacks) {

	if(startup.init(options.loadReason)){
		//console.log("Addon synced");
	}
	storage.init();
	auth.init();
	//request.post("nothing");
	
};


exports.onUnload = function (reason) {
	console.log(reason);
};


exports.dummy = function(text, callback) {
	callback(text);
};

