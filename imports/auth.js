var cred = require("sdk/passwords");
var request = require("./requests.js");
var storage = require("./storage.js");

function init() {
	return new Promise(function (resolve, reject) {
        //check if user login details are already stored
		userSync().then(success => {
			resolve(storage.settings());
		}).catch(failed => {
			if(failed === "noCred"){
				reject("Login Required");
			}
		});
    });
}

function userSync(){
	return new Promise(function (resolve, reject) {
		checkCredentials().then(data => {
			var url = "http://192.168.178.104:5000/v1/sync?uid=" 
				+ data.uid + "&session=" + data.session;

		    //Async - wait for user settings from server
			request.get(url).then(json => {
				var result = JSON.parse(json);

				storage.sync(result);

				resolve(true);
			}).catch(error => {
				console.log("line 32: " + error);
				reject(false);
			});
		}).catch(error => {
			console.log("line 36: " + error);
			reject("noCred");
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
			checkCredentials().then(data => {

				storage.sync(result);

				resolve(true);

			}).catch(error => {
				//setup create params
				var params = {
					user: data.cred.user,
					pass: data.cred.pass,
					uid: result.uid,
					session: result.session,
				}
				//add credentials
				addCredentials(params).then(response => {
					console.log(response);

					storage.sync(result);

					resolve(true);

				}).catch(error => {
					console.log("line 76: " + error);

					reject(error);
				});
			});

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
		    	if(credentials.length >= 0){
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