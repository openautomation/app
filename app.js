
/**
 * Module dependencies.
 */

var koa = require('koa');
var route = require('koa-route');
var serve = require('koa-static');
var timer = require('koa-response-time');
var favicon = require('koa-favicon');
var compress = require('koa-compress');
var index = require('./routes');
var actions = require('./routes/action');
var actions = require('./routes/video');
var spawn = require('child_process').spawn;

/**
 * App.
 */

var app = koa();

/**
 * Middleware.
 */

app.use(favicon());
app.use(timer());
app.use(compress({
  filter: function (content_type) {
    return /text/i.test(content_type)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}));
app.use(serve('public/'))
app.use(route.get('/', index));
app.use(route.post('/run', actions.create));
app.use(route.get('/video-stream.mp4', video.stream));

/**
 * Video streaming to client.
 */

require('./server/video-stream-server.js');

//start video streaming to local websocket
var ffmpeg_args = '-s 640x480 -f video4linux2 -i /dev/video0 -f mpeg1video -b 800k -r 30 -vf scale=1024:768 http://localhost:8082/password/1024/768/';
var ffmpeg = spawn('ffmpeg', ffmpeg_args.split(' '));
ffmpeg.on('close', function (code) {
  console.log('ffmpeg video streaming process exited with code ' + code);
});
ffmpeg.stderr.on('data', function (data) {
  console.log('ffmpeg stderr: ' + data);
});
ffmpeg.stdout.on('data', function (data) {
  console.log('ffmpeg stdout: ' + data);
});


/**
 * Start.
 */

app.listen(process.env.PORT || 3000);
