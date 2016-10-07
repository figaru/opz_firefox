var cred = require("sdk/passwords");
var request = require("./requests.js");
var storage = require("./storage.js");

function init(){
	//addCred()
	//check if user login details are already stored
	checkCredentials().then(data => {

	}).catch(error => {
		
	});
}

function userSync(){

}

function userLoggin(data){
	var url = "http://192.168.178.104:5000/v1/auth?" + data.data;

    //Async - wait for user settings from server
	request.get(url).then(json => {
		var result = JSON.parse(json);

		console.log(result);

		//check if user login details are already stored
		checkCredentials().then(data => {

		}).catch(error => {
			//setup create params
			var params = {
				user: data.cred.user,
				pass: data.cred.pass,
			}
			//add credentials
			addCredentials(params).then(data => {
				console.log("Credentials Successfuly added!");

			}).catch(error => {
				console.log(error);
			});
		});

	}).catch(error => {
		console.log(error);
	});

}

function addCredentials(params) {
	return new Promise(function (resolve, reject) {
        cred.store({
		  realm: "Opz Addon",
		  username: params.user,
		  password: params.pass,
		  onComplete: function onComplete() {
		    resolve(true);
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
		    	if(credentials.length > 0){
		    		resolve(credentials);
		    	}else{
		    		reject("No credentials Found.");
		    	}
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
exports.logIn = userLoggin;
exports.sync = syncSettings;