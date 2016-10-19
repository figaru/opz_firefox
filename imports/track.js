const auth = require("./auth.js");
const tabs = require("./tabs.js");
const state = require("./state.js");
const request = require("./requests.js");
const pref = require("./prefs.js");

function init(){
	auth.init().then(result => {
		if(pref.get("app_running"))
			tabs.init();
	}).catch(error => {	
		console.log("Unable to start addon -> login required");
	});
}

function beat(data){
	if(pref.get("app_running")){
	    //Async - sending heartbeat to server

	    let beat = {
	    	token: pref.get("user_token"),
	    	data: data,
	    };

		request.post(beat, pref.get("endpoint_beat")).then(json => {
			console.log("beat sent");
		}).catch(error => {
			console.log(error);
		});
	}else{}
}

function terminate(){
	tabs.destroy();
}


exports.stop = terminate;
exports.start = init;
exports.beat = beat;