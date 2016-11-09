let appParams = {};

self.port.on("panel", function(params){
    $("#panel").removeClass();
    $("#panel").addClass("action-main");

    appParams = params;
    
    if(params){
        $("#status").prop('checked', params.status);
        $("#title-user").html(params.user.name);
        $("#title-email").html(params.user.email);
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
            url: "",
            cred: {
                username: $('#form-user').val(),
                password: $('#form-pass').val(),
            }
        });

        return false;
    });

    $('#status').on('change', function(){ // on change of state

        if(this.checked) // if changed state is "CHECKED"
        {
            if(validatePrivate()){
                self.port.emit("status", true);
            }else{
                $("#status").prop('checked', false);
            }   
        }else{
            self.port.emit("status", false);
        }
    });

});

function validatePrivate(){
    var today = new Date().getDay();
    var now = new Date().getHours();

    var settings = appParams.user;

    for(let day of settings.privateDays){
        if(today == day){
            return false;
        }
    }

    for(let hour of settings.privateHours){
        if(now == hour){
            return false;
        }
    }


    return true;
}
