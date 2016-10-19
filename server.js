var validUser = {
	uid: "userId",
	session: "sessionKey"
}


Router.route(
	'/v1/sync', 
	function () {
        var response = {};
        var res = this.response;
		var req = this.request;

		Meteor.setTimeout(function(){ 
			console.log("Synchronizing Settings");
			console.log(req.query);

			try {
			    if (req.query.uid == "userId" && req.query.session == "sessionKey") {
			      	//console.log('password is valid for this user');
			      	//var user = Meteor.users.findOne({ "emails.address" : req.body.email });
			      	response = {
				        error: false,
					    data: {
					    	name: "Daniel Abrantes",
					    	email: "test@test.com",
					    	token: "f6bd64fd-af5e-d965-9da3-0bc9684b85f1",
					    	privateDays: [0, 7],
					    	privateHours: [0, 1, 2, 3, 4, 5, 6, 7, 8],
					    }
				    };
			    } else {
			      	response = {
					    tag: "login",
					    success: 0,
					    error: 1,
					    error_msg: "Login credentials are incorrect. Please try again!"
					}
			    }
			} catch (exc) {
			  		//console.log(exc.message);
			  		response = {
					    tag: "login",
					    success: 0,
					    error: 1,
					    error_msg: "User account does not exist."
					}
			  // 'User is not found', 'User has no password set', etc
			}

			var final = JSON.stringify(response);


			//Right now we always send 200 OK code.
			res.end(final);

		}, 200);

	}, 
	{
		where: 'server'
	}
);

Router.route(
	'/v1/auth', 
	function () {
        var response = {};
        var res = this.response;
		var req = this.request;

		Meteor.setTimeout(function(){ 
			console.log("Requested Login");
			console.log(req.query);

			try {
			    if (ApiPassword.validate({username: req.query.user, password: req.query.pass})) {
			      	//console.log('password is valid for this user');
			      	//var user = Meteor.users.findOne({ "emails.address" : req.body.email });
			      	response = {
				        error: false,
					    session: "sessionKey",
					    uid: "userId"
				    };
			    } else {
			      	response = {
					    tag: "login",
					    success: 0,
					    error: 1,
					    error_msg: "Login credentials are incorrect."
					}
			    }
			} catch (exc) {
			  		//console.log(exc.message);
			  		response = {
					    tag: "login",
					    success: 0,
					    error: 1,
					    error_msg: "An unknown error occured. Try again later."
					}
			  // 'User is not found', 'User has no password set', etc
			}

			var final = JSON.stringify(response);


			//Right now we always send 200 OK code.
			res.end(final);

		}, 200);

	}, 
	{
		where: 'server'
	}
);