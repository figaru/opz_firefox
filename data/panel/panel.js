self.port.on("panel", function(params){
    $("#panel").removeClass();
    $("#panel").addClass("action-home");
});

self.port.on("panelSync", function(){
    console.log("synchronizing");
    $("#panel").removeClass();
    $("#panel").addClass("action-sync");
});

self.port.on("panelLogin", function(){
    console.log("login required");
    $("#panel").removeClass();
    $("#panel").addClass("action-auth");
});

$('document').ready(function() {

    $(".js-login").submit(function( event ) {
        //do not reload page
        event.preventDefault();

        self.port.emit("login", {
            data: $('.js-login').serialize(),
            cred: {
                user: $('#user').val(),
                pass: $('#pass').val(),
            }
        });

        return false;
    });

});
