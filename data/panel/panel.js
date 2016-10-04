self.port.on("onLoad", function(params){
    if(params.session){
        
    }else{
        console.log("Log in required!");

        $(".panel").addClass("action-auth");
    }
});    

$('document').ready(function() {

    $(".js-login").submit(function( event ) {
        if () {
            console.log("validated")
            return;
        }

        console.log("not valid")

        //do not reload page
        event.preventDefault();
    });

});
