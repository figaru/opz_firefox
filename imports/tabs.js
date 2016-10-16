var tabs = require("sdk/tabs");
var storage = require("./storage.js");
var track = require("./track.js");



function init(){
	//if tab open - run function OnOpen
	if(tabs){
		for (let tab of tabs)
  			tabOpen(tab);
	}
    tabs.on('open', tabOpen);
}

function destroy(){
    if(tabs){
        for (let tab of tabs)
            tab.destroy();
    }
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
    var data = {
    	"title": tab.title,
    	"domain": domain,
    	"url": tab.url,
    	"time": Math.floor((new Date).getTime()/1000),
    }

    track.beat(data);
}


exports.init = init;