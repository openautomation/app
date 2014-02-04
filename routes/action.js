
/**
 * Module dependencies.
 */

var move = require('../lib/xyz_sender');

/**
 * Execute an action.
 */

exports.create = function(req, res){
  var action = req.body;

  console.log(action);
  move(10, 10)
  // XXX: should call ROS script
  res.json(action);
};
