
/**
 * Module dependencies.
 */

var koa = require('koa');
var route = require('koa-route');
var serve = require('koa-static');
var index = require('./routes');
var actions = require('./routes/action');

/**
 * App.
 */

var app = koa();

/**
 * Middleware.
 */

app.use(serve('public/'))
app.use(route.get('/', index));
app.use(route.post('/actions', actions.create));

/**
 * Start.
 */

app.listen(3000);