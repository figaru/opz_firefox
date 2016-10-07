self.port.on("onLoad", function(params){
    if(params.session){
        //auth.sync();
    }else{
        console.log("Log in required!");

        $(".panel").removeClass("action-auth");
        $(".panel").addClass("action-auth");
    }
});    

$('document').ready(function() {

    $(".js-login").submit(function( event ) {
        //do not reload page
        event.preventDefault();

        self.port.emit("sync", {
            data: $('.js-login').serialize(),
            cred: {
                user: $('#user').val(),
                pass: $('#pass').val(),
            }
        });

        return false;
    });

});
