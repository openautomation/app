
/**
 * Module dependencies.
 */

var koa = require('koa');
var route = require('koa-route');
var serve = require('koa-static');
var timer = require('koa-response-time');
var favicon = require('koa-favicon');
var compress = require('koa-compress');
var fs = require('fs');
var index = require('./routes');
var actions = require('./routes/action');
var spawn = require('child_process').spawn;

/**
 * App.
 */

var app = koa();
//app.use(route(app))

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

app.use(route.get('/move', require('./controllers/move.js')));

/*
// dynamically include the controllers
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
    module = require('./controllers/' + file);
    module.controller(app);
  }
});*/

/**
 * Video streaming to client.
 */

//require('./server/video-stream-server.js');

//start video streaming to local websocket
//ffmpeg_args = '-s 640x480 -f video4linux2 -i /dev/video0 -f mpeg1video -b 800k -r 30  http://localhost:8082/password/640/480/';
//ffmpeg_args = '-s 640x480 -f video4linux2 -i /dev/video0 -f mpeg1video -b 800k -r 30 -vf scale=1024:768 http://localhost:8082/password/1024/768/';
//ffmpeg = spawn('ffmpeg', ffmpeg_args.split(' '));
//ffmpeg.on('close', function (code) {
//  console.log('ffmpeg video streaming process exited with code ' + code);
//});
/*ffmpeg.stderr.on('data', function (data) {
  console.log('ffmpeg stderr: ' + data);
});
/*ffmpeg.stdout.on('data', function (data) {
  console.log('ffmpeg stdout: ' + data);
});*/


/**
 * Start.
 */

app.listen(process.env.PORT || 3000);
