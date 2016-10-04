const {XMLHttpRequest} = require("sdk/net/xhr");
var url = "http://192.168.178.104:5000/app/login";
var xhr = null;

function post(params) {
    xhr = new XMLHttpRequest(); //next you would initiate a XMLHTTPRequest:
    var data = {
        'test': "test",
    };

    data = JSON.stringify(data);

    xhr.open("POST", url, true); //what kind of request will we be sending

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState !== 4 && xhr.status !== 200) {
            console.log(http.responseText);//check if the data was received successfully.
        }  
    }
    xhr.onerror = function() { 

    };//if failed to send heartbeat to server | Save to array

    xhr.send(data);//send object to server
}

exports.post = post;