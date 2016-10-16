const auth = require("./auth.js");
const tabs = require("./tabs.js");
const state = require("./state.js");
const request = require("./requests.js");

function init(){
	auth.init().then(result => {
		tabs.init();
	}).catch(error => {	
		console.log("Unable to start addon -> login required");
	});
}

function beat(data){
	if(state.status()){
	    //Async - sending heartbeat to server

	    let beat = {
	    	token: state.token(),
	    	data: data,
	    };

	    console.log(beat);

		request.post(beat, state.endpoint()).then(json => {
			console.log("beat sent");
		}).catch(error => {
			console.log(error);
		});
	}else{
		console.log("Running: " + state.status);
	}
}

function terminate(){
	tabs.destroy();
}


exports.stop = terminate;
exports.start = init;
exports.beat = beat;