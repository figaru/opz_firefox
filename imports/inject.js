
/*$(document).on('keyup keypress click scroll change', throttle(function (event) {
  console.log(event.type);
  self.port.emit("trigger", event.type);
}, 4000));*/

// Throttled resize function
$(document).on('keyup keypress click scroll change', throttle(function(e){
  // Do responsive stuff
  //console.log(e);
  self.port.emit("trigger");
}, 5000));


function throttle (func, wait) {
    return function() {
        var that = this,
            args = [].slice(arguments);

        clearTimeout(func._throttleTimeout);

        func._throttleTimeout = setTimeout(function() {
            func.apply(that, args);
        }, wait);
    };
}

//setInterval(function(){ console.log("content script running"); }, 5000);

/*function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}*/