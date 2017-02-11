const cred = require("sdk/passwords");
const request = require("./requests.js");
const date = require("./dateDiff.js");
const pref = require("./prefs.js");
const db = require("./db.js");
const validate = require("./validate.js");

function init() {
	return new Promise(function (resolve, reject) {
        //check if user login details are already stored
        let syncData = db.getSync();

        console.log(syncData);
		if(validateNotNull(syncData)){
				let userData = db.getUser();

				if( validateNotNull(userData) ){
					//retrieve app data - containign updated timestamp
					var app = db.getApp();

					//check if app data available
					if(app){
						var diff = date.diff(new Date().getTime(), app.updated);
						if(diff.minutes >= 5){
							userSync(syncData).then(result => {
								resolve();
							}).catch(error => {	
								reject();
							});
						}else{
							resolve();
						}
					}

				}else{
					userSync(syncData).then(callback => {
						resolve();
					}).catch(error => {	
						reject();
					});
				}

		}else{
			reject();
		}
    });
}

function userSync(data){
	return new Promise(function (resolve, reject) {
		data.cred = data;
		data.url = pref.get("endpoint_sync");

	    //Async - wait for user settings from server
		request.sync(data).then(json => {
			var result = JSON.parse(json);

			db.storeUser(result.data);

			resolve();
		}).catch(error => {
			reject(error);
		});
	});
}

function userLogin(data){
	return new Promise(function (resolve, reject) {
		data.url = pref.get("endpoint_auth");

	    //Async - wait for user settings from server
		request.login(data).then(json => {
			var result = JSON.parse(json);

			//check if user login details are already stored
			if(validateServerResult(result)){
				let cred = JSON.parse(data.cred);
				result.data.username = cred.username;
				db.storeSync(result.data);

				resolve();
			}else{
				reject();
			}

		}).catch(error => {

			reject(error);
		});
	});
}

function validateNotNull(data){
	//check if sync data available
	if(data && !validate.hasNull(data)){
		return true;
	}else{
		console.log("failed to validate:");
		console.log(data);
		return false;
	}
}

function validateServerResult(result){
	return new Promise(function (resolve, reject) {
		//check if "success = true" and "error = false"
		if(result.status == "success"){
			return true;
		}else{
        	return false;
        }
    });
}


exports.init = init;
exports.login = userLogin;
exports.sync = userSync;