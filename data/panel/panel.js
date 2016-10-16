self.port.on("panel", function(params){
    $("#panel").removeClass();
    $("#panel").addClass("action-main");

    if(params.status){
        $("#status").prop('checked', true);
    }
});

self.port.on("panelSync", function(){
    $("#panel").removeClass();
    $("#panel").addClass("action-loading");
});

self.port.on("panelLogin", function(callback){
    $("#login-message").removeClass();
    $("#panel").removeClass();
    $("#panel").addClass("action-login");

    if(callback.error){
        $("#login-message").text(callback.msg).addClass("error");
    }
});

$('document').ready(function() {

    $("#login-form").submit(function( event ) {
        //do not reload page
        event.preventDefault();

        self.port.emit("login", {
            data: $('#login-form').serialize(),
            cred: {
                user: $('#form-user').val(),
                pass: $('#form-pass').val(),
            }
        });

        return false;
    });

    $('#status').on('change', function(){ // on change of state
        if(this.checked) // if changed state is "CHECKED"
        {
            self.port.emit("status", true);
        }else{
            self.port.emit("status", false);
        }
    });

});
