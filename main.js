var ui = require("sdk/ui");
var panels = require("sdk/panel");
var self = require("sdk/self");
var base64 = require("./imports/base64");
var startup = require("./imports/startup.js");
var storage = require("./imports/storage.js");


var panel = panels.Panel({
  contentURL: self.data.url("panel/panel.html"),
});

panel.on("*", function(e) {
  //console.log("event " + e + " was emitted");
});

var button = ui.ActionButton({
  id: "my-button",
  label: "my button",
  icon: "./icon-16.png",
  onClick: handleClick
});

function handleClick(state) {
  panel.show({
    position: button,
    height: 400,
  });
}


// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js

exports.main = function (options, callbacks) {

	if(startup.init(options.loadReason)){
		//console.log("Addon synced");
	}

	storage.init();
	
};

exports.onUnload = function (reason) {
	console.log(reason);
};


exports.dummy = function(text, callback) {
	callback(text);
};

