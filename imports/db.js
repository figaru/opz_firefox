const db = require("sdk/simple-storage");
const pref = require("./prefs.js");

/*if(!db.storage.test){
	console.log("creating test");
	db.storage.test = "test";
}else{
	console.log(db.storage.test);
}*/
function myOnOverQuotaListener() {
  console.log("Uh oh.");
}
db.on("OverQuota", myOnOverQuotaListener);

if(!db.storage.addon){
	console.log("populating database");
	db.storage.addon = {
		sync:{
			session: "",
			uid: "",
			username: "",
		},
		user:{
			name: "",
			company: "",
			token: "",
			privateDays: [],
			privateHours: [],
		},
		app: {
			status: false,
			runtime: null,
			updated: null,
		}
	};
}else{
	console.log(db.storage.addon);
}

function storeSync(data){

	pref.set("session", data.authToken);
	pref.set("uid", data.userId);


	db.storage.addon.sync = {
		session: data.authToken,
		uid: data.userId,
		username: data.username,
	};
}

function storeUser(data){
	db.storage.addon.user = {
		name: data.name,
		company: data.company,
		token: data.token,
		privateDays: data.privateDays,
		privateHours: data.privateHours,
	};

	pref.set("user_token", data.token);

	db.storage.addon.app.updated = new Date().getTime();
}


function getSync(){ 
	let sync = {
		session: pref.get("session"),
		uid: pref.get("uid")
	}
	return sync; 
};
function getUser(){ return db.storage.addon.user; };
function getApp(){ return db.storage.addon.app; };

exports.getSync = getSync;
exports.getUser = getUser;
exports.getApp = getApp;

exports.storeSync = storeSync;
exports.storeUser = storeUser;


//exports.init = init;