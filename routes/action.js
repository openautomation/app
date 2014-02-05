
/**
 * Module dependencies.
 */

var move = require('../lib/xyz_sender');

/**
 * Execute an action.
 */

exports.create = function(req, res){
  var action = req.body;

  move(10, 10);
  console.log(action);
  // XXX: should call ROS script
  res.json(action);
};

//var xmlrpc = require('xmlrpc')
//var server = xmlrpc.createServer({ host: '192.168.0.20', port: 11311 });
// 192.168.0.20:11311

// var net = require('net');
// var host = '192.168.0.20';
// var port = 11311;
// var socket = net.createConnection(port, host);
// socket.on('error', function(){ console.log(arguments); });
// socket.on('connect', function(){ console.log(arguments); });
// var msg = [
//   '# xyz - vector rotation axis, w - scalar term (cos(ang/2))',
//   'float64 x',
//   'float64 y',
//   'float64 z',
//   'float64 w'
// ].join('\n') + '\r\n';
// socket.write(msg);

// http://wiki.ros.org/ROS/Connection%20Header