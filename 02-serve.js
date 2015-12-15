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




process.env['DEBUG'] = 'dns-pl';

var debug = require('debug')('dns-pl')

var server = serverDns()

server.on('request', answerDns);

server.serve(15353);

// dig -p 15353 @127.0.0.1 www.google.com +short