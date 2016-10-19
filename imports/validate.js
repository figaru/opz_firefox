function hasNull(target) {
    for (var member in target) {
        if (target[member] == null || target[member] == "")
            return true;
    }
    return false;
}


function validatePrivate(){
    var today = new Date().getDay();
    var now = new Date().getHours();

    var settings = storage.get("settings");

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

exports.hasNull = hasNull;