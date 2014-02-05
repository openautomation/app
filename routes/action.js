
/**
 * Module dependencies.
 */

//var move = require('../lib/grbl-gantry/gantry');
var grbl = require('grbl');
var fs = require('fs');

/**
 * Execute an action.
 */

exports.create = function(req, res){
  var action = req.body;

  console.log(action);

  grbl(function(machine){
    machine.write(movement(10, 0, 0));
  });

  // XXX: should call ROS script
  res.json(action);
};

function movement(x, y, z) {
  return ["G1", x, y, z, "f10000", "\n"].join(" ");
}

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

grbl(function(machine) {
        console.log("configuring grbl...");

        machine.write("$X\n");
        machine.write("G91\n");
	//machine.write("G92 x0 y0 z0\n");

        machine.write("", function() {
            console.log("done!");
            machine.end();
	});
});
