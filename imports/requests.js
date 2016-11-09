const {XMLHttpRequest} = require("sdk/net/xhr");


function syncRequest(data){
    console.log(data);
    // Promises require two functions: one for success, one for failure
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', data.url);

        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("X-User-Id", data.cred.uid);
        xhr.setRequestHeader("X-Auth-Token", data.cred.session);

        xhr.onload = () => {
            if (xhr.status === 200) {
                // We can resolve the promise
                resolve(xhr.response);
            } else {
                // It's a failure, so let's reject the promise
                reject("Unable to load RSS");
            }
        
        }

        xhr.onerror = () => {
            // It's a failure, so let's reject the promise
            reject("Unable to load RSS");
        };

        xhr.send();
    });
}

function loginRequest(data){
    // Promises require two functions: one for success, one for failure
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        data.cred = JSON.stringify(data.cred);

        xhr.open('POST', data.url, true);
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onload = () => {
            if (xhr.status === 200) {
                // We can resolve the promise
                resolve(xhr.response);
            } else {
                // It's a failure, so let's reject the promise
                reject(xhr);
            }
        
        }

        xhr.onerror = () => {
            // It's a failure, so let's reject the promise
            reject("Unable to load RSS");
        };

        xhr.send(data.cred);
    });
}

exports.login = loginRequest;
exports.sync = syncRequest;