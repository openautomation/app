
/**
 * Module dependencies.
 */

var spawn = require('child_process').spawn;
var PassThrough = require('stream').PassThrough;

// https://github.com/schaermu/node-fluent-ffmpeg
exports.stream = function *(next){
  //this.body = yield render('index.html', { title: 'iorobotics' });
  this.res.writeHead(200, { 'Content-Type': 'video/webm', 'Connection': 'keep-alive' });
  // start video streaming to local websocket
  // var ffmpeg_args = '-s 640x480 -f video4linux2 -i /dev/video0 -f mp4 -b 800k -r 30 -vf scale=1024:768 http://localhost:8082/password/1024/768/';
  // var ffmpeg = spawn('ffmpeg', ffmpeg_args.split(' '));
  // ffmpeg.on('close', function (code) {
  //   console.log('ffmpeg video streaming process exited with code ' + code);
  // });
  // ffmpeg.stderr.on('data', function (data) {
  //   //console.log('ffmpeg stderr: ' + data);
  // });
  // ffmpeg.stdout.on('data', function (data) {
  //   //console.log('ffmpeg stdout: ' + data);
  // });
  var opts = '-s 640x480 -f video4linux2 -i /dev/video0 -re -f webm -b 800k -r 30 -vf scale=1024:768 -'.split(' ');
  var ffmpeg = spawn("ffmpeg", opts
      // "-f", "video4linux2",
      // "-i", "/dev/video0",
      // "-re",                   // Real time mode
      // "-f","x11grab",          // Grab screen
      // "-r","100",              // Framerate
      // "-vf", "scale=1024:768",
      // "-s","640x480",   // Capture size
      // "-g","0",                // All frames are i-frames
      // "-me_method","zero",     // Motion algorithms off
      // "-flags2","fast",
      // "-vcodec","libvpx",      // vp8 encoding
      // "-preset","ultrafast",
      // "-tune","zerolatency",
      // "-b:v","1M",             // Target bit rate
      // "-crf","40",             // Quality
      // "-qmin","5",             // Quantization
      // "-qmax","5",
      // "-f","mp4",             // File format
      // "-"                      // Output to STDOUT
  );
  // Pipe the video output to the client response
  //this.body = ffmpeg.stdout;
  //var stream = this.body = new PassThrough();
  // setImmediate(function(){
  //   // stream.write('hello');
  //   // stream.write(' ');
  //   // stream.write('world');
  //   // stream.end();
  // });
  //ffmpeg.stdout.pipe(stream);
  var res = this.res;
  ffmpeg.stdout.on('data', function(data){
    res.write(data);
  });
  ffmpeg.stderr.on('data', function(data){
    console.log('error:', String(data));
  });
  this.res.on('close',function(){
    ffmpeg.kill();
  });
  // // Kill the subprocesses when client disconnects
  // res.on("close",function(){
  //   glxgears.kill();
  //   ffmpeg.kill();
  // })
};
