
var dns = require('dns');
var native_dns = require('native-dns')

var SimpleRecords = {
  'www.google.com': [{
    address: '127.0.0.1',
    ttl: 600,
  }]
};

var matchRecords = function(s){
  var found = false
  s.forEach(function (question) {
    if (!found && question.name in SimpleRecords) {
      found = SimpleRecords[question.name]
    }
  })
  return found
}



var serverDns = function () {
  var server = native_dns.createServer();
  server.on('error', function (err, buff, req, res) {
    console.log(err.stack);
  });
  return server;
};



var answerDns = function (request, response) {
  var answers = matchRecords(request.question);
  debug('questions: %j', request.question)
  debug('address: %j', request.address)
  if (answers!==false) {
    debug('answers: %j', answers)
    answers.forEach(function (a) {
      response.answer.push(native_dns.A({
        name: request.question[0].name,
        address: a.address,
        ttl: a.ttl,
      }));
    })
  } else {
    debug('not answered')
  }
  response.send();
};


var isRoot = require('is-root');
if(!isRoot()) throw 'must be root';

process.env['DEBUG'] = 'dns-pl';

var debug = require('debug')('dns-pl')

/*
 dns.setServers(servers)

 Given an array of IP addresses as strings, set them as the servers to use for resolving

 If you specify a port with the address it will be stripped, as the underlying library doesn't support that.

 This will throw if you pass invalid input.
 */
dns.setServers(['127.0.0.1'])

var server = serverDns()

server.on('request', answerDns);

server.serve(53);

// su -
// systemctl status dnsmasq.service
// netstat -lntpa | grep 53
// killall dnsmasq
// node 03*
// netstat -lntpa | grep 53

// dig -p 15353 @127.0.0.1 www.google.com +short
// 127.0.0.1

/*
 dns-pl questions: [{"name":"www.google.com","type":1,"class":1}] +0ms
 dns-pl address: {"address":"127.0.0.1","family":"IPv4","port":58745,"size":43} +5ms
 dns-pl answers: [{"address":"127.0.0.1","ttl":600}] +3ms
 */

// systemctl start dnsmasq.service
// netstat -lntpa | grep 53s
