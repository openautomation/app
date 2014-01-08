var util = require('util'),
    Stream = require('stream').Stream,
    net = require('net'),
    defaults = require('defaults'),
    path = require('path'),
    child = require('child_process');


var proc;

var createProcess = function(options) {
  if (!proc) {
    proc = child.spawn('node', [
      path.join(__dirname, 'daemon.js'),
      '--options', JSON.stringify(options)
    ], {
      stdio: !options.keepProcessReference ? 'pipe' : 'inherit',
      detached: !options.keepProcessReference
    });
  }
}

var timer;
var connect = function(options, fn) {
  var log = options.log || function() {};

  log('attempting to connect to ' + options.host + ':' + options.port);
  var client = net.createConnection(options, function() {
    log('connected');
    fn(null, client, process);
  });

  client.on('error', function(err) {
    log('connection error: ' + err)
    // daemon is not running
    if (err.code && err.code === 'ECONNREFUSED') {
      createProcess(options);

      !options.keepProcessReference && proc.unref();
      client.destroy();
      clearTimeout(timer);
      timer = setTimeout(function() {
        connect(options, fn);
      }, 500);
    } else {
      fn(err);
    }
  });
};

module.exports = function(options, fn) {
  if (!fn && typeof options === 'function') {
    fn = options;
    options = {};
  }

  options = defaults(options, {
    host: 'localhost',
    port: 4499,
    log : function() {}
  });

  connect(options, fn);
};