var self = require("sdk/self");
var panels = require("sdk/panel");
var ui = require("sdk/ui");
var auth = require("./auth.js");

var panel = panels.Panel({
  contentURL: self.data.url("panel/panel.html"),
  contentScriptFile: [self.data.url("panel/jquery.min.js"), self.data.url("panel/panel.js")],
  
});

panel.on("*", function(e) {
  //console.log("event " + e + " was emitted");
});

panel.port.on("sync", function(data){
  auth.logIn(data.data);
});

var button = ui.ActionButton({
  id: "my-button",
  label: "my button",
  icon: "./icon-16.png",
  onClick: handleClick
});

function handleClick(state) {
    panel.port.emit("onLoad", {
    	session: undefined,
    	settings: {},
    });
    panel.show({
        position: button,
        height: 400,
        width: 350,
        padding: 0,
    });

}