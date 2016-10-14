var db = require("sdk/simple-storage");


//populate storage with correct fields check synced
function init(){
	/*if(JSON.stringify(db.storage) === '{}'){
		console.log("Populating Database");
		//empty storage - populate databse with correct fields
		db.storage.settings = {
			user:{
				name: undefined,
				email: undefined,
			},
			settings:{
				token: undefined,
				privateDays: [],
				privateHours: [],
			},
			updated: 000000,
		}
	}*/
}

function getSettings(){
	return db.storage.settings;
}

function getStorage(key){
	if(key == "updated"){
		return db.storage.updated;
	}else if(key == "api"){
		return db.storage.api;
	}else if(key == "token"){
		return db.storage.settings.settings.token;
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
		db.storage.settings = {
			user:{
				name: data.user.name,
				email: data.user.email,
			},
			settings:{
				token: data.setting.token,
				privateDays: data.setting.privateDays,
				privateHours: data.setting.privateHours,
			},
			updated: new Date().getTime(),
		};
	}
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