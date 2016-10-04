var cred = require("sdk/passwords");

function init(){
	//addCred();
}

function addCredentials(){
	cred.store({
	  url: "http://www.example.com",
	  realm: "ExampleCo Login",
	  username: "joe",
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
	  realm: "User Registration",
	  username: "joe",
	  password: "SeCrEt123",
	  onComplete: function onComplete() {
	    require("sdk/passwords").store({
	      realm: "User Registration",
	      username: "joe",
	      password: "{new password}"
	    })
	  },
	  onError: function onError(err){
	  	console.log(err);
	  }
	});
}

function checkCredentials(){

}

function checkSettings(){

}

function syncSettings(){

}

function showCredentials() {
  cred.search({
    username: "joe",
    onComplete: function onComplete(credentials) {
      credentials.forEach(function(credential) {
        console.log(credential.username);
        console.log(credential.password);
        });
      }
    });
}

exports.init = init;