var self = require("sdk/self");
var panels = require("sdk/panel");
const ui = require("sdk/ui");
var auth = require("./auth.js");
var track = require("./track.js");
const state = require("./state.js");

var panel = panels.Panel({
  contentURL: self.data.url("panel/panel.html"),
  contentScriptFile: [self.data.url("panel/jquery.min.js"), self.data.url("panel/panel.js")],
  
});

panel.port.on("status", function(bool){
  state.setStatus(bool);
});

panel.port.on("login", function(data){
  panel.port.emit("panelSync", {});

  //check if user login details are already stored
  auth.login(data).then(success => {
    panel.port.emit("panel", {status: state.status});
  }).catch(failed => {
    panel.port.emit("panelLogin", {error: true, msg: failed});
  });
});

var button = ui.ActionButton({
  id: "my-button",
  label: "my button",
  icon: "./icon-16.png",
  onClick: handleClick
});

function handleClick(state) {
    panel.port.emit("panelSync", {});

    //check if user login details are already stored
    auth.init().then(success => {
      panel.port.emit("panel", {status: state.status});
    }).catch(failed => {
      panel.port.emit("panelLogin", {});
    });


    panel.show({
        position: button,
        height: 500,
        width: 400,
        padding: 0,
    });

}