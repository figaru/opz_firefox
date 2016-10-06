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
        console.log("form submited");


        self.port.emit("sync", {
            data: $('.js-login').serialize()
        });

        /*$.ajax({
          url: "http://192.168.178.104:5000/v1/auth",
          type: post,
          data : $('.js-login').serialize(),
          success: function(data){
            console.log("Form Submitted");
            console.log(data);
            return;
          }
        });*/

        /*$.post($(this).attr("action"), $(this).serialize(), function(data){
          console.log(data);
          return;
        }, "json");*/
        return false;
    });

});
