var auth = require("./auth.js");

function track(){
	auth.init().then(result => {
		track.init();
	}).catch(error => {	
		console.log("Unable to start addon -> login required");
	});
}


exports.init = track;