var db = require("sdk/simple-storage");


//populate storage with correct fields check synced
function init(){
	/*if(JSON.stringify(db.storage) === '{}'){
		console.log("Populating Database");
		//empty storage - populate databse with correct fields
		db.storage.addon = {
			user:{
				name: undefined,
				email: undefined,
			},
			settings:{
				token: undefined,
				privateDays: [],
				privateHours: [],
			},
			updated: new Date().getTime(),
		}
	}*/
}

function getSettings(){
	return db.storage.addon.settings;
}

function updateSettings(params){
	db.storage.addon = {
		user:{
			name: undefined,
			email: params.user,
		},
		settings:{
			token: params.user.token,
			privateDays: params.settings.privateDays,
			privateHours: params.settings.privateHours,
		},
		updated: new Date().getTime(),
	}

	console.log("User settings sync completed!");
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
exports.sync = updateSettings;
exports.settings = getSettings;