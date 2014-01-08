var net = require('net'),
    options = JSON.parse(require('optimist').argv.options),
    handler;

if (options.script){
  handler = require(options.script);
}

var server = net.createServer(function(socket) {
  options.server = server;
  handler && handler(options, socket);
});

var port = options.port || 4499;
server.listen(port);
console.log('listening on port ', port);