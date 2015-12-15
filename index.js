var native_dns = require('native-dns')


var yourModule = function () {
  var server = native_dns.createServer();

  server.on('request', function (request, response) {
    //console.log(request)
    response.answer.push(native_dns.A({
      name: request.question[0].name,
      address: '127.0.0.1',
      ttl: 600,
    }));
    response.answer.push(native_dns.A({
      name: request.question[0].name,
      address: '127.0.0.25',
      ttl: 600,
    }));
    response.additional.push(native_dns.A({
      name: 'hostA.example.org',
      address: '127.0.0.3',
      ttl: 600,
    }));
    response.send();
  });

  server.on('error', function (err, buff, req, res) {
    console.log(err.stack);
  });

  return server;
};

module.exports = yourModule;
// dig @ns1.google.com www.google.com