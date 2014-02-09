
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
app.use(route.post('/actions', actions.create));

/**
 * Start.
 */

app.listen(3000);