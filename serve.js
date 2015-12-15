var dnsServer = require('./index');


var server = dnsServer()

server.serve(15353);
