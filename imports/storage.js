const db = require("sdk/simple-storage");
const pref = require("./prefs.js");


//populate storage with correct fields check synced
function init(){
}

function getSettings(){
	return db.storage.settings;
}

function getStorage(key){
	if(key == "updated"){
		return db.storage.updated;
	}else if(key == "api"){
		return db.storage.api;
	}else if(key == "settings"){
		return db.storage.settings;
	}
}


function updateStorage(key, data){
	if(key == "updated"){
		db.storage.updated =  {
			updated: new Date().getTime(),
		};
	}else if(key == "api"){
		db.storage.api = {
			uid: data.uid,
			session: data.session,
		};

		console.log("User settings sync completed!");
	}else if(key == "settings"){
		pref.set("user_token", data.setting.token);
		pref.set("user_name", data.user.name);
		pref.set("user_email", data.user.email);

		db.storage.settings = {
				privateDays: data.setting.privateDays,
				privateHours: data.setting.privateHours,
			};


	}

	db.storage.updated = new Date().getTime();
}

//return bool of field(s) if not empty
function checkField(params){

}

//return field(s) value(s)
function getField(params){

}

//create a new field
function addField(params){

}

exports.init = init;
exports.update = updateStorage;
exports.get = getStorage;