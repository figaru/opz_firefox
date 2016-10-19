var cred = require("sdk/passwords");
var request = require("./requests.js");
var storage = require("./storage.js");
var date = require("./dateDiff.js");
const pref = require("./prefs.js");

function init() {
	return new Promise(function (resolve, reject) {
        //check if user login details are already stored
		checkCredentials().then(result => {
			var syncData = storage.get("api");

			if(syncData){
				var settings = storage.get("settings");
				if(settings){
					var diff = date.diff(new Date().getTime(), settings.updated);
					if(diff.minutes >= 5){
						userSync(syncData).then(result => {
							resolve();
						}).catch(error => {	
							reject();
						});
					}else{
						resolve();
					}
				}else{
					userSync(syncData).then(result => {
						resolve();
					}).catch(error => {	
						reject();
					});
				}
			}else{
				reject();
			}

		}).catch(error => {
			console.log(error);
			reject();
		});
    });
}

function userSync(data){
	return new Promise(function (resolve, reject) {
		var url = pref.get("endpoint_sync") + "?uid=" 
			+ data.uid + "&session=" + data.session;

	    //Async - wait for user settings from server
		request.get(url).then(json => {
			var result = JSON.parse(json);

			storage.update("settings", result);

			resolve();
		}).catch(error => {
			reject(error);
		});
	});
}

function userLogin(data){
	return new Promise(function (resolve, reject) {
		var url = pref.get("endpoint_auth") + "?" + data.data;

		console.log(url);

	    //Async - wait for user settings from server
		request.get(url).then(json => {
			var result = JSON.parse(json);

			//check if user login details are already stored
			validateServerResult(result).then(result => {
				//check if user login details are already stored
				checkCredentials().then(check => {
		
				}).catch(error => {
					//add credentials
					addCredentials(data.cred).then(result => {

					}).catch(error => {
						reject();
					});
				});

				this.storage.update("api", result);

				resolve(true);

			}).catch(error => {
				//add credentials
				reject(error);
			});

		}).catch(error => {
			console.log(error);

			reject(error);
		});
	});
}

function validateServerResult(result){
	return new Promise(function (resolve, reject) {
		//check if "success = true" and "error = false"
		if(!result.error){
			resolve(result);
		}
		//check if "error = true" and "success = false"
		else if(result.error && !result.success){
        	reject(result.error_msg);
        }
    });
}

function addCredentials(params) {
	return new Promise(function (resolve, reject) {
        cred.store({
		  realm: "Opz Addon",
		  username: params.user,
		  password: params.pass,
		  onComplete: function onComplete() {
		    resolve("Credentials Added Successfuly!");
		  },
		  onError: function onError(err){
		  	reject(err);
		  }
		});	
    });
}

function removeCredentials() {
	return new Promise(function (resolve, reject) {
        cred.remove({
		  realm: "Opz Addon",
		  onComplete: function onComplete() {
		    resolve("Credentials successfuly removed!");
		  },
		  onError: function onError(err){
		  	reject("Failed to remove credentials.");
		  }
		});
    });
}

function checkCredentials() {
	return new Promise(function (resolve, reject) {
        cred.search({
		    realm: "Opz Addon",
		    onComplete: function onComplete(credentials) {
		    	if(credentials[0].username){
		    		if(credentials[0].password){
			    		resolve(credentials[0].username);
			    	}
			    	reject(credentials[0].username);
		    	}else{
		    		reject("No credentials Found.");
		    	}
			},
			onError: function(err){
				reject("No credentials Found.");
			}
	    });
    });
}

function getCredentials() {
	return new Promise(function (resolve, reject) {
        cred.search({
		    realm: "Opz Addon",
		    onComplete: function onComplete(credentials) {
		    	credentials.forEach(function(credential) {
		        	resolve({
		        		user: credential.username,
		        		pass: credential.password,
		        	});
		        });
			},
			onError: function(error){

			}
	    });
    });
}


exports.init = init;
exports.login = userLogin;
exports.sync = userSync;