var tabs = require("sdk/tabs");
var storage = require("./storage.js");



function init(){
	//if tab open - run function OnOpen
	if(tabs){
		for (let tab of tabs)
  			tabOpen(tab);
	}
    tabs.on('open', tabOpen);
}

function tabOpen(tab){
    tab.on("pageshow", tabShow);
    tab.on("activate", tabActivate);
    tab.on("deactivate", tabDeactivate);
    tab.on("close", tabClose);
}


function tabShow(tab) {
	//attach script file to monitor triggers
	var worker = tab.attach({
    	contentScriptFile:[ "./../imports/jquery.min.js", "./../imports/inject.js"]
    });

    //run function if event scroll or click recived
    worker.port.on("trigger", function (text) {
    	if(tab == tabs.activeTab){
    		//tab matches active tab -> send beat
    		trigger(tab);
    	}else{
    		//ingore - Tab no longer activated
    	}
    });
}


function tabActivate(tab) {
   	trigger(tab);
}

function tabDeactivate(tab) {
	trigger(tab);
}

function tabClose(tab) {
	trigger(tab);
}


function trigger(tab){

	var domain = tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
    var beat = {
    	"token": storage.get("token"),
    	"title": tab.title,
    	"domain": domain,
    	"url": tab.url,
    	"timestamp": Math.floor((new Date).getTime()/1000),
    }

    console.log(beat);

}


exports.init = init;