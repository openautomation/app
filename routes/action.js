
/**
 * Execute an action.
 */

exports.create = function(req, res){
  var action = req.body;

  console.log(action);
  // XXX: should call ROS script
  res.json(action);
};