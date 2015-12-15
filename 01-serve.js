

var native_dns = require('native-dns')

var yourModule = function () {
  var server = native_dns.createServer();

  server.on('request', function (request, response) {
    //console.log(request)
    debug('questions: %j', request.question)
    debug('address: %j', request.address)
    debug('authority: %j', request.authority)
    debug('header: %j', request.header)
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
    console.error(err);
  });

  return server;
};

//module.exports = yourModule;
process.env['DEBUG'] = 'dns-pl';

var debug = require('debug')('dns-pl')

var server = yourModule()

server.serve(15353);

// dig -p 15353 @127.0.0.1 www.google.com +short