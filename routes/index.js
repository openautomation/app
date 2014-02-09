
/**
 * Module dependencies.
 */

var views = require('co-views');
var render = views(__dirname + '/../public', { map: { html: 'swig' } });

/**
 * GET home page.
 */

module.exports = function *(){
  this.body = yield render('index.html', { title: 'iorobotics' });
};