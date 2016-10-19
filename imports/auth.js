const cred = require("sdk/passwords");
const request = require("./requests.js");
const date = require("./dateDiff.js");
const pref = require("./prefs.js");
const db = require("./db.js");
const validate = require("./validate.js");

function init() {
	return new Promise(function (resolve, reject) {
        //check if user login details are already stored
		checkCredentials().then(result => {
			//retrieve session and uid
			let syncData = db.getSync();

			//check if sync data available
			if(!validate.hasNull(syncData)){
				let userData = db.getUser();

				if(!validate.hasNull(userData)){
					
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

			db.storeUser(result.data);

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
				
				//add credentials
				updateCredentials(data.cred).then(result => {

				}).catch(error => {
					reject();
				});

				//store api session and uid
				db.storeSync(result);

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

function updateCredentials() {
	return new Promise(function (resolve, reject) {
        cred.remove({
		  realm: "Opz Addon",
		  onComplete: function onComplete() {
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