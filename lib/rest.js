
/**
 * Module dependencies.
 */

var adapter = require('tower-adapter')('openautomation');
var agent = require('superagent');

/**
 * Map of model names to REST API names.
 */

var names = {
  action: 'actions',
  user: 'users',
  experiment: 'experiments'
};

/**
 * Map of query actions to HTTP methods.
 */

var methods = {
  select: 'GET',
  create: 'POST',
  update: 'PUT',
  remove: 'DELETE'
};

var calls = {
  get: 'get',
  post: 'post',
  put: 'put',
  'delete': 'del'
};

/**
 * Expose `adapter`.
 */

exports = module.exports = adapter;

/**
 * API Version.
 */

exports.v = 'v1';
exports.url = window.location.protocol + '//' + window.location.host;

/**
 * XXX: way to specify headers for all requests.
 */

exports.header = function(name, val){

};

exports.params = [];
exports.param = function(name, val){
  exports.params.push({ name: name, val: val });
  return exports;
};

/**
 * Convert query into REST API request.
 *
 * @param {Query} query A `Query` object.
 * @param {Function} fn Callback function.
 */

adapter.exec = function(query, fn){
  var name = query.resources[0].resource;
  name = names[name] || name + 's';
  var method = methods[query.type];
  var call = calls[method.toLowerCase()];
  var params = serializeParams(query);

  var url = exports.url + '/api/' + exports.v + '/' + name;

  var req = agent[call](url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');

  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    req.send(query.data || {});
  }

  req.query(params);

  req.end(function(res){
    if (fn) fn(res.error ? res.text : null, res.body);
  });
};

/**
 * Convert query constraints into query parameters.
 *
 * @param {Query} query
 * @api private
 */

function serializeParams(query) {
  var constraints = query.constraints;
  var params = {};

  constraints.forEach(function(constraint){
    params[constraint.left.attr] = constraint.right.value;
  });

  return params;
}