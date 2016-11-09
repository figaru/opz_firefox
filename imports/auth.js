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

			console.log(syncData);

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
				let credential = JSON.parse(data.cred);

				//add Credentials
				cred.store({
				  realm: "Opz Addon",
				  username: credential.username,
				  password: credential.password,
				  onComplete:function onComplete(data){
				  	db.storeSync(result.data);

					resolve(true);
				  },
				  onError: function onError(error){
				  	console.log("failed");
				  }
				});
			}else{
				reject();
			}

		}).catch(error => {
			console.log(error);

			reject(error);
		});
	});
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

function addCredentials(user, pass) {
	return new Promise(function (resolve, reject) {
		console.log(user);
		console.log(pass);
        cred.store({
		  realm: "Opz Addon",
		  username: user,
		  password: pass,
		  onComplete: function onComplete() {
		    resolve("Credentials Added Successfuly!");
		  },
		  onError: function onError(err){
		  	reject(err);
		  }
		});	
    });
}

function updateCredentials(params) {
	return new Promise(function (resolve, reject) {
        cred.remove({
		  realm: "Opz Addon",
		  onComplete: function onComplete() {
		    cred.store({
			  realm: "Opz Addon",
			  username: params.username,
			  password: params.password,
			  onComplete: function onComplete() {
			    resolve("Credentials Added Successfuly!");
			  },
			  onError: function onError(err){
			  	reject(err);
			  }
			});	
		  },
		  onError: function onError(err){
		  	cred.store({
			  realm: "Opz Addon",
			  username: params.username,
			  password: params.password,
			  onComplete: function onComplete() {
			    resolve("Credentials Added Successfuly!");
			  },
			  onError: function onError(err){
			  	reject(err);
			  }
			});
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
		        		username: credential.username,
		        		password: credential.password,
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