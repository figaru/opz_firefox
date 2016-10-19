var tabs = require("sdk/tabs");
var storage = require("./storage.js");
var track = require("./track.js");

var workers = [];

function init(){
	//if tab open - run function OnOpen
    console.log("init tabs");
	if(tabs){
		for (let tab of tabs)
  			tabInitialize(tab);
	}

    tabs.on('open', tabOpen);
}

function destroy(){
    console.log("destroying tab workers");
    if(workers){
        for (let worker of workers)
            //remove all content scripts
            worker.destroy();
    }
}

function tabInitialize(tab){
    tabOpen(tab);
    tabShow(tab);
}

function tabOpen(tab){
    tab.on("pageshow", tabShow);
    tab.on("activate", tabActivate);
    tab.on("deactivate", tabDeactivate);
    tab.on("close", tabClose);
}


function tabShow(tab) {
    trigger(tab);
	//attach script file to monitor triggers
	var worker = tab.attach({
    	contentScriptFile:[ "./../imports/jquery.min.js", "./../imports/inject.js"],
        contentScriptWhen: "end",
    });

    workers.push(worker);

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

    if(domain == "blank" || domain == "newtab"){
        return;
    }
    
    var data = {
    	"title": tab.title,
    	"domain": domain,
    	"url": tab.url,
    	"time": Math.floor((new Date).getTime()/1000),
    }

    track.beat(data);
}


exports.init = init;
exports.destroy = destroy;