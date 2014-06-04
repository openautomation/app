
  var ROSLIB = require('./roslib');
  var ros = new ROSLIB.Ros();
    
  var cmdVel;


  // If there is an error on the backend, an 'error' emit will be emitted.
  ros.on('error', function(error) {
    console.log(error);
  });
  
  //app.post('/move/connect', function(req, res) {

    // Find out exactly when we made a connection.
  ros.on('connection', function() {
    console.log('Connection made!');
      
    // Publishing a Topic
    // ------------------
    
    // First, we create a Topic object with details of the topic's name and message type.
    cmdVel = new ROSLIB.Topic({
      ros : ros,
      name : '/cmd_move_xyz',
      messageType : 'geometry_msgs/Twist'
    });
  });
 
  ros.connect('ws://localhost:9090');

 
  module.exports = function*(next) {
    debugger;
    // Then we create the payload to be published. The object we pass in to ros.Message matches the 
    // fields defined in the geometry_msgs/Twist.msg definition.
    var twist = new ROSLIB.Message({
      linear : {
        x : 0.1,
        y : 0.2,
        z : 0.3
      },
      angular : {
        x : -0.1,
        y : -0.2,
        z : -0.3
      }
    });
  
  
    cmdVel.publish(twist);

    this.body = 'Hello World';
  };
