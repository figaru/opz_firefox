var cred = require("sdk/passwords");
var request = require("./requests.js");
var storage = require("./storage.js");
var date = require("./dateDiff.js");

function init() {
	return new Promise(function (resolve, reject) {
        //check if user login details are already stored
		checkCredentials().then(result => {

			var settings = storage.get("settings");

			if(settings){
				var diff = date.diff(new Date().getTime(), settings.updated);
				if(diff.minutes >= 1){
					console.log("Sync Now!");
					var syncData = storage.get("api");
					userSync(syncData).then(result => {
						resolve();
					}).catch(error => {	
						reject();
					});
				}else{
					resolve();
				}
			}else{
				console.log("First time sync");
				var syncData = storage.get("api");
				console.log(syncData);
				userSync(syncData).then(result => {
					resolve();
				}).catch(error => {	
					reject();
				});
			}


		}).catch(error => {
			console.log(error);
			reject();
		});
    });
}

function userSync(data){
	return new Promise(function (resolve, reject) {
		var url = "http://192.168.178.104:5000/v1/sync?uid=" 
			+ data.uid + "&session=" + data.session;

	    //Async - wait for user settings from server
		request.get(url).then(json => {
			var result = JSON.parse(json);

			storage.update("settings", result);

			resolve();
		}).catch(error => {
			console.log("line 32: " + error);
			reject(error);
		});
	});
}

function userLogin(data){
	return new Promise(function (resolve, reject) {
		var url = "http://192.168.178.104:5000/v1/auth?" + data.data;

	    //Async - wait for user settings from server
		request.get(url).then(json => {
			var result = JSON.parse(json);

			//check if user login details are already stored
			checkCredentials().then(result => {
				
			}).catch(error => {
				//add credentials
				addCredentials(data.cred).then(result => {
					console.log(result);
				}).catch(error => {
					console.log(error);
				});
			});

			this.storage.update("api", result);

			resolve(true);

		}).catch(error => {
			console.log(error);

			reject(error);
		});
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
				if(credentials[0]){
		    		resolve(credentials[0]);
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