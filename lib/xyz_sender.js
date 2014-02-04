
var roslib = require('./roslib');

module.exports = move;

var ros, moveTopic;

function init() {
  var serverAddr = 'ws://localhost:11311';
  
  ros = new roslib.Ros();
  ros.on('error', function(error) {
    console.log(error);
  });

  // Find out exactly when we made a connection.
  ros.on('connection', function() {
    console.log('Connection made!');
  });

  ros.connect(serverAddr);	//use ROS environment default for local machine
  
  moveTopic = new roslib.Topic({
    ros : ros,
    name : 'cmd_move_xyz',
    messageType : 'geometry_msgs/Twist'
  });
}

function shutdown() {
  ros.close();
}

function move(x, y) {

  // Then we create the payload to be published. The object we pass in to ros.Message matches the 
  // fields defined in the geometry_msgs/Twist.msg definition (when we use actual twist msgs instead of strings).
  var twist = new roslib.Message({
    linear : {
      x : x,
      y : y
//      z : 0
    }
  });
  
  moveTopic.publish(new roslib.Message(pos));
}

init();

