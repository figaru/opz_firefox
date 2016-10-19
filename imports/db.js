const db = require("sdk/simple-storage");
const pref = require("./prefs.js");

function init(){
	if(db.storage){
		console.log("populating database");
		db.storage = {
			sync:{
				session: "",
				uid: "",
			},
			user:{
				name: "",
				email: "",
				token: "",
				privateDays: [],
				privateHours: [],
			},
			api: {
				end_sync: "",
				end_auth: "",
				end_beat: "",
			},
			app: {
				status: false,
				runtime: null,
				updated: null,
			}
		};
	}
}

function storeSync(data){
	db.storage.sync = {
		session: data.session,
		uid: data.uid,
	};
}

function storeUser(data){
	db.storage.user = {
		name: data.name,
		email: data.email,
		token: data.token,
		privateDays: data.privateDays,
		privateHours: data.privateHours,
	};

	db.storage.app.updated = new Date().getTime();
}


function getSync(){ return db.storage.sync; };
function getUser(){ return db.storage.user; };
function getApp(){ return db.storage.app; };

exports.getSync = getSync;
exports.getUser = getUser;
exports.getApp = getApp;

exports.storeSync = storeSync;
exports.storeUser = storeUser;


exports.init = init;