var db = require("sdk/simple-storage");


//populate storage with correct fields check synced
function init(){
	if(JSON.stringify(db.storage) === '{}'){
		console.log("Populating Database");
		//empty storage - populate databse with correct fields
		db.storage.addon = {
			api: {
				log: "http://opz.io/v1/logs",
				sync: "http://opz.io/v1/logs",
				update: "http://opz.io/v1/logs"
			},
			timestamps: {
				updated: Math.floor((new Date).getTime()/1000),
				created: Math.floor((new Date).getTime()/1000),
				synced: Math.floor((new Date).getTime()/1000),
			},
			user:{
				name: "Daniel Abrantes",
				email: "test@test.com",
			},
			settings:{
				token: "f6bd64fd-af5e-d965-9da3-0bc9684b85f1",
				privateDays: [],
				privateHours: [],
			}
		}
	}else{
		console.log("Database Sync With Server - Succeeded");
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