
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