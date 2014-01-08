if (require.main !== module) {
  // Daemon
  var clients = [];

  module.exports = function(options, stream) {
    stream.setMaxListeners(0);

    clients.forEach(function(client) {
      client.pipe(stream);
      stream.pipe(client);
    });

    clients.push(stream);
  };
}


var test = require('tap').test,
    net = require('net'),
    child = require('child_process'),
    path = require('path');

test('ensure daemon wrapper spawns correctly', function(t) {
  var p = child.spawn('node', [
    path.join(__dirname, '..','daemon.js'),
    '--options', JSON.stringify({ port : 9999 })
  ]);

  p.stdout.pipe(process.stdout);

  setTimeout(function() {
    net.createConnection({
      host: 'localhost',
      port: 9999
    }, function() {
      p.kill();
      t.end();
    });
  }, 200);
});

test('ensure sproc spawns the daemon wrapper properly', function(t) {
  var sproc = require('../sproc');
  var options = {
    script: __dirname + '/shared-daemon',
    port: 5666
  };

  sproc(options, function(err, stream, p) {
    net.createConnection({
      host: 'localhost',
      port: 5666
    }, function() {
      p.kill();
      t.end();
    });
  });
});


test('ensure sproc spawns the daemon wrapper properly', function(t) {
  var options = {
    keepProcessReference : true,
    script: __dirname + '/ping-pong',
    port: 5666
  };

  sproc(options, function(err, a, p) {
    sproc(options, function(err, b) {
      b.on('data', function(buffer) {
        if (buffer.toString().indexOf('pong') > -1) {
          b.end()
          p.kill();
          t.end();
        }
      });
      b.write('ping');
    });

    a.on('data', function(buffer) {
      if (buffer.toString().indexOf('ping') > -1) {
        a.write('pong');
      }
    });
  });
});
