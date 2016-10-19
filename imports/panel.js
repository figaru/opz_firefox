var self = require("sdk/self");
var panels = require("sdk/panel");
const ui = require("sdk/ui");
var auth = require("./auth.js");
var track = require("./track.js");
const pref = require("./prefs.js");
const db = require("./db.js");

var panel = panels.Panel({
  contentURL: self.data.url("panel/panel.html"),
  contentScriptFile: [self.data.url("panel/jquery.min.js"), self.data.url("panel/panel.js")],
  
});

panel.port.on("status", function(bool){
  pref.set("app_running", bool);
});

panel.port.on("login", function(data){
  panel.port.emit("panelSync", {});

  //check if user login details are already stored
  auth.login(data).then(success => {
    //check if user login details are already stored
    auth.init().then(success => {
      panelEmit();
    }).catch(failed => {
      panel.port.emit("panelLogin", {});
    });
  }).catch(failed => {
    panel.port.emit("panelLogin", {error: true, msg: failed});
  });
});

var button = ui.ActionButton({
  id: "opz-button",
  label: "opz.io",
  icon: "./img/icon.png",
  onClick: handleClick
});

function panelEmit(){
  panel.port.emit("panel", {
    status: pref.get("app_running"),
    user: db.getUser(),
  });
}

function handleClick(state) {
    panel.port.emit("panelSync", {});

    //check if user login details are already stored
    auth.init().then(success => {
      panelEmit();
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