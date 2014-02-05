
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

  // XXX: should call ROS script
  x = "x10";
  y = "y0";
  z = "z0";
  grbl(function(machine) {
	cmd = ["G1", x, y, z, "f10000", "\n"].join(" ");
	console.log(cmd);
	machine.write(cmd);
  });
};


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
