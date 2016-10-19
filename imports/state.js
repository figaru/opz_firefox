const track = require("./track.js");
const pref = require("./prefs.js");

const state = {
	session: undefined,
	status: false,
	token: "f6bd64fd-af5e-d965-9da3-0bc9684b85f1",
	endpoint: "http://opz.io/v1/logs",
}

function init(){
	
}

function setStatus(bool){
	state.status = bool;
	if(bool){
		track.start();
	}else{
		track.stop();
	}
}

function getSession(){return state.session;}

function getToken(){return state.token;}

function getStatus(){return state.status;}

function getEndpoint(){return state.endpoint;}

exports.status = getStatus;
exports.token = getToken;
exports.endpoint = getEndpoint;
exports.session = getSession;

exports.setStatus = setStatus;