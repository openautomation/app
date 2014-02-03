
/**
 * Module dependencies.
 */

var adapter = require('./lib/rest');
var query = require('tower-query');
query.use(adapter);
var resource = require('tower-resource');
var getUserMedia = require('get-user-media');
var canvasPosition = require('window2canvas');
var transformBounds = require('transform-bounds');
var events = require('event');
var agent = require('superagent');
var SVG = require('svg.js').SVG;
var drawing = SVG('sprites').fixSubPixelOffset();

/**
 * Lab equipment.
 */

var Microplate = require('./lib/microplate');
var LiquidContainer = require('./lib/liquid-container');
var PetriDish = require('./lib/petri-dish');

/**
 * Canvas.
 */

var video = document.getElementById('webcam');
var canvas = document.getElementById('canvas');

/**
 * Hardcoded lab box dimensions.
 */

var labBox = {
  width: 20000,
  height: 20000
};

events.bind(canvas, 'click', function(e){
  // get position relative to canvas
  var local = canvasPosition(canvas, e.clientX, e.clientY);
  // convert to coordinates of lab box
  var remote = transformBounds(local.x, local.y, canvas.getBoundingClientRect(), labBox);

  sendMove(remote);
});

function sendMove(remote) {
  // resource('action').create(remote, function(){
  //   console.log('done', arguments);
  // });
  agent.post('/actions')
    .send({ type: 'move', position: remote })
    .end(function(res){
      console.log(res);
    });
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// http://inspirit.github.io/jsfeat/js/compatibility.js
navigator.getUserMedia({ video: true }, function(stream){
  try {
    video.src = webkitURL.createObjectURL(stream);
  } catch (err) {
    video.src = stream;
  }

  start();
}, function(){
  console.log(arguments);
});

function start() {
  video.play();
  demo_app();
  requestAnimationFrame(tick);

  // add lab equipment
  var microplate = new Microplate(drawing);
  microplate.move(100, 100);
  //microplate.size(100, 200);
  microplate.on('select', function(well){
    // XXX: somehow get position from microplate.
    sendMove(well);
  });

  var liquid = new LiquidContainer(drawing);
}

function success(stream) {
  try {
    video.src = webkitURL.createObjectURL(stream);
  } catch (err) {
    video.src = stream;
  }
}

function failure(err) {
  $('#canvas').hide();
  $('#log').hide();
  $('#no_rtc').html('<h4>WebRTC not available.</h4>');
  $('#no_rtc').show();
}

var gui,options,ctx,canvasWidth,canvasHeight;
var img_u8;

function demo_app() {
  canvasWidth  = canvas.width;
  canvasHeight = canvas.height;
  ctx = canvas.getContext('2d');
  img_u8 = new jsfeat.matrix_t(640, 480, jsfeat.U8C1_t);
}

function tick() {
  requestAnimationFrame(tick);

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    ctx.drawImage(video, 0, 0, 640, 480);
    return;
    var imageData = ctx.getImageData(0, 0, 640, 480);
    jsfeat.imgproc.grayscale(imageData.data, img_u8.data);

    var r = options.blur_radius|0;
    var kernel_size = (r+1) << 1;
    jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);
    jsfeat.imgproc.canny(img_u8, img_u8, options.low_threshold|0, options.high_threshold|0);

    // render result back to canvas
    var data_u32 = new Uint32Array(imageData.data.buffer);
    var alpha = (0xff << 24);
    var i = img_u8.cols*img_u8.rows, pix = 0;
    while(--i >= 0) {
      pix = img_u8.data[i];
      data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
}