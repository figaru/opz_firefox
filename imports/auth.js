var cred = require("sdk/passwords");
var request = require("./requests.js");

function init(){
	//addCred()
	checkCredentials().then(exists => {
		console.log(exists);
	}).catch(error => {
		console.log(error);
	});
}

function userLoggin(data){
	var url = "http://192.168.178.104:5000/v1/auth?" + data;

    // The function returns a promise
	// so we can chain with a .then and a .catch
	request.get(url).then(json => {
		var result = JSON.parse(json);

		console.log(result);
	}).catch(error => {
		console.log(error);
	});
}

function syncSettings(){
	console.log("Synchronizing settings...");
}

function addCredentials(){
	cred.store({
	  realm: "Opz Addon",
	  username: "test",
	  password: "SeCrEt123",
	  onComplete: function onComplete() {
	    console.log("Credentials have been added");
	    showCred();
	  },
	  onError: function onError(err){
	  	console.log(err);
	  }
	});	
}

function updateCredentials(){
	require("sdk/passwords").remove({
	  realm: "Opz Addon",
	  username: "test",
	  password: "SeCrEt123",
	  onComplete: function onComplete() {
	    require("sdk/passwords").store({
	      realm: "Opz Addon",
	      username: "test",
	      password: "{new password}"
	    })
	  },
	  onError: function onError(err){
	  	console.log(err);
	  }
	});
}

function checkCredentials() {
	return new Promise(function (resolve, reject) {
        cred.search({
		    realm: "Opz Addon",
		    onComplete: function onComplete(credentials) {
		    	if(credentials.length > 0){
		    		resolve(true);
		    	}else{
		    		reject(false);
		    	}
		      	// credentials.forEach(function(credential) {
		       //  	console.log(credential.username);
		       //  	console.log(credential.password);
		       //  });
			}
	    });
    });
}

exports.init = init;
exports.logIn = userLoggin;
exports.sync = syncSettings;