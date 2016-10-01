const { atob, btoa } = require("resource://gre/modules/Services.jsm");
 
exports.encode = a => btoa(a);
exports.decode = b => atob(b);