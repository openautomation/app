
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
var FastClick = require('fastclick').FastClick;
var drawing = SVG('sprites').fixSubPixelOffset();

/**
 * Angular stuff.
 */

var app = angular.module('App', []);
app.run(function(){
  FastClick.attach(document.body);
});

/**
 * Lab equipment.
 */

var Microplate = require('./lib/microplate');
var LiquidContainer = require('./lib/liquid-container');
var PetriDish = require('./lib/petri-dish');

require('live-css').start();

app.controller('StepsController', function ($scope){
  $scope.view = 'steps';

  var wells = new Array(96);
  for (var i = 0, n = wells.length; i < n; i++) {
    wells[i] = { selected: i < 5 };
  }

  $scope.steps = [
    { title: 'Add sample',// to each microplate well',
      icon: 'liquid',
      variables: [
        { name: 'Liquid', value: 'Liquid A', type: 'array' },
        { name: 'Volume (ml)', value: 10, type: 'number' },
        { name: 'Wells', value: '5', type: 'microplate', data: wells } ] },
    { title: 'Incubate microplate',
      icon: 'fridge',
      variables: [
        { name: 'Temperature (C)', value: 37, type: 'number' },
        { name: 'Duration (min)', value: 60, type: 'number' } ] },
    { title: 'Wash microplate',
      icon: 'faucet',
      variables: [
        { name: 'Times', value: 4, type: 'number' } ] },
    { title: 'View in microscope',
      icon: 'microscope',
      variables: [
        { name: 'Zoom level', value: 400, type: 'number' } ] }
  ];

  $scope.wells = wells;

  $scope.liquids = [
    'Liquid A',
    'Liquid B'
  ];

  $scope.selectWell = function(well){
    well.selected = !well.selected;
  };

  $scope.selectWells = function(){
    var count = 0;
    for (var i = 0, n = wells.length; i < n; i++) {
      if (wells[i].selected) count++;
    }
    $scope.activeVariable.value = count;
    $scope.view = 'step';
    $scope.activeVariable = null;
  };

  $scope.selectValue = function(liquid){
    $scope.view = 'step';
    $scope.activeVariable.value = liquid;
    $scope.activeVariable = null;
  };

  $scope.showVariable = function(variable) {
    // don't change screen if it's simple
    if ('number' == variable.type) return;
    $scope.view = 'variable';
    $scope.activeVariable = variable;
  };

  $scope.showStep = function(step){
    $scope.view = 'step';
    $scope.activeStep = step;
  };

  $scope.showSteps = function(){
    $scope.view = 'steps';
    $scope.activeStep = null;
  };

  $scope.run = function(){
    agent.post('/run')
      .send($scope.steps)
      .end(function(res){
        console.log(res.body);
      });
  };
});

/**
 * Canvas.
 */

var video = document.getElementById('webcam');
var canvas = document.getElementById('canvas');
canvas.style.zIndex = 0;

/**
 * Hardcoded lab box dimensions.
 */

var labBox = {
  width: 20000,
  height: 20000
};

var paused = false;
var videostream;
var gif = 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7';
//document.querySelector('.snapshot').src = gif;
events.bind(window, 'clicks', function(e){
  if (e.target.tagName.toLowerCase() == 'input') return;
  if (paused) {
    document.querySelector('.snapshot').src = gif;
    document.querySelector('.viewport').style.display = 'none';
    document.querySelector('.editor').style.display = 'none';
    //canvas.style.webkitFilter = '';
    video.play();
  } else {
    video.pause();
    //document.querySelector('.snapshot').style.backgroundImage = 'url(' + canvas.toDataURL() + ');';
    document.querySelector('.snapshot').src = canvas.toDataURL('image/webp', 0.001);
    document.querySelector('.viewport').style.display = 'block';
    document.querySelector('.editor').style.display = 'block';
    //canvas.style.webkitFilter = 'blur(13px)';
  }
  paused = !paused;
  return;
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
  document.querySelector('#log').appendChild(
    document.createTextNode('selected ' + JSON.stringify(remote))
  );

  agent.post('/actions')
    .send({ type: 'move', position: remote })
    .end(function(res){
      console.log(res);
    });
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// http://inspirit.github.io/jsfeat/js/compatibility.js
navigator.getUserMedia({ video: true }, function(stream){
  videostream = stream;
  try {
    video.src = webkitURL.createObjectURL(stream);
  } catch (err) {
    video.src = stream;
  }

  setTimeout(start, 500);
}, function(){
  console.log(arguments);
});

function start() {
  video.play();
  demo_app();
  requestAnimationFrame(tick);
  return;
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
  var content = document.querySelector('.content');
  var ratio = 480 / 640;
  canvas.width = content.offsetWidth
  canvas.height = content.offsetWidth * ratio;
  canvasWidth  = canvas.width;
  canvasHeight = canvas.height;
  ctx = canvas.getContext('2d');
  img_u8 = new jsfeat.matrix_t(canvas.width, canvas.height, jsfeat.U8C1_t);
}

var imageData;
function tick() {
  requestAnimationFrame(tick);

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return;
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