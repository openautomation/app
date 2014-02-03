
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Main definitions.
 */

require.mains = {};

/**
 * Define a main.
 */

require.main = function(name, path){
  require.mains[name] = path;
};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if ('/' == path.charAt(0)) path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  if (require.mains[path]) {
    paths = [path + '/' + require.mains[path]];
  }

  for (var i = 0, len = paths.length; i < len; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) {
      return path;
    }
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0, len = path.length; i < len; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var root = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(root, path);
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("juliangruber-get-user-media/index.js", function(exports, require, module){

/**
 * Detect getUserMedia implementation.
 */

var getUserMedia = navigator.getUserMedia
  || navigator.webkitGetUserMedia
  || navigator.mozGetUserMedia
  || navigator.msGetUserMedia;

/**
 * Node style getUserMedia.
 *
 * @param {Object} constraints
 * @param {Function} fn
 */

module.exports = function(constraints, fn) {
  getUserMedia.call(navigator, constraints, success, error);
  
  function success(stream) {
    fn(null, stream);
  }
  
  function error(err) {
    fn(err);
  }
};

});
require.register("brighthas-window2canvas/index.js", function(exports, require, module){
module.exports = function(canvas,windowX,windowY){
    var bbox = canvas.getBoundingClientRect(),
        w_scale = canvas.width/bbox.width,
        h_scale = canvas.height/bbox.height;
        
    return {
        x:windowX * w_scale - bbox.left * w_scale,
        y:windowY * h_scale -bbox.top * h_scale
    }
}
});
require.register("component-event/index.js", function(exports, require, module){
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);

  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);

  return fn;
};
});
require.register("component-query/index.js", function(exports, require, module){
function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};

});
require.register("component-matches-selector/index.js", function(exports, require, module){
/**
 * Module dependencies.
 */

var query = require("component-query");

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matches
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = query.all(selector, el.parentNode);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}

});
require.register("discore-closest/index.js", function(exports, require, module){
var matches = require("component-matches-selector")

module.exports = function (element, selector, checkYoSelf, root) {
  element = checkYoSelf ? {parentNode: element} : element

  root = root || document

  // Make sure `element !== document` and `element != null`
  // otherwise we get an illegal invocation
  while ((element = element.parentNode) && element !== document) {
    if (matches(element, selector))
      return element
    // After `matches` on the edge case that
    // the selector matches the root
    // (when the root is not the document)
    if (element === root)
      return  
  }
}
});
require.register("component-delegate/index.js", function(exports, require, module){
/**
 * Module dependencies.
 */

var closest = require("discore-closest")
  , event = require("component-event");

/**
 * Delegate event `type` to `selector`
 * and invoke `fn(e)`. A callback function
 * is returned which may be passed to `.unbind()`.
 *
 * @param {Element} el
 * @param {String} selector
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, selector, type, fn, capture){
  return event.bind(el, type, function(e){
    var target = e.target || e.srcElement;
    e.delegateTarget = closest(target, selector, true, el);
    if (e.delegateTarget) fn.call(el, e);
  }, capture);
};

/**
 * Unbind event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  event.unbind(el, type, fn, capture);
};

});
require.register("component-events/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var events = require("component-event");
var delegate = require("component-delegate");

/**
 * Expose `Events`.
 */

module.exports = Events;

/**
 * Initialize an `Events` with the given
 * `el` object which events will be bound to,
 * and the `obj` which will receive method calls.
 *
 * @param {Object} el
 * @param {Object} obj
 * @api public
 */

function Events(el, obj) {
  if (!(this instanceof Events)) return new Events(el, obj);
  if (!el) throw new Error('element required');
  if (!obj) throw new Error('object required');
  this.el = el;
  this.obj = obj;
  this._events = {};
}

/**
 * Subscription helper.
 */

Events.prototype.sub = function(event, method, cb){
  this._events[event] = this._events[event] || {};
  this._events[event][method] = cb;
};

/**
 * Bind to `event` with optional `method` name.
 * When `method` is undefined it becomes `event`
 * with the "on" prefix.
 *
 * Examples:
 *
 *  Direct event handling:
 *
 *    events.bind('click') // implies "onclick"
 *    events.bind('click', 'remove')
 *    events.bind('click', 'sort', 'asc')
 *
 *  Delegated event handling:
 *
 *    events.bind('click li > a')
 *    events.bind('click li > a', 'remove')
 *    events.bind('click a.sort-ascending', 'sort', 'asc')
 *    events.bind('click a.sort-descending', 'sort', 'desc')
 *
 * @param {String} event
 * @param {String|function} [method]
 * @return {Function} callback
 * @api public
 */

Events.prototype.bind = function(event, method){
  var e = parse(event);
  var el = this.el;
  var obj = this.obj;
  var name = e.name;
  var method = method || 'on' + name;
  var args = [].slice.call(arguments, 2);

  // callback
  function cb(){
    var a = [].slice.call(arguments).concat(args);
    obj[method].apply(obj, a);
  }

  // bind
  if (e.selector) {
    cb = delegate.bind(el, e.selector, name, cb);
  } else {
    events.bind(el, name, cb);
  }

  // subscription for unbinding
  this.sub(name, method, cb);

  return cb;
};

/**
 * Unbind a single binding, all bindings for `event`,
 * or all bindings within the manager.
 *
 * Examples:
 *
 *  Unbind direct handlers:
 *
 *     events.unbind('click', 'remove')
 *     events.unbind('click')
 *     events.unbind()
 *
 * Unbind delegate handlers:
 *
 *     events.unbind('click', 'remove')
 *     events.unbind('click')
 *     events.unbind()
 *
 * @param {String|Function} [event]
 * @param {String|Function} [method]
 * @api public
 */

Events.prototype.unbind = function(event, method){
  if (0 == arguments.length) return this.unbindAll();
  if (1 == arguments.length) return this.unbindAllOf(event);

  // no bindings for this event
  var bindings = this._events[event];
  if (!bindings) return;

  // no bindings for this method
  var cb = bindings[method];
  if (!cb) return;

  events.unbind(this.el, event, cb);
};

/**
 * Unbind all events.
 *
 * @api private
 */

Events.prototype.unbindAll = function(){
  for (var event in this._events) {
    this.unbindAllOf(event);
  }
};

/**
 * Unbind all events for `event`.
 *
 * @param {String} event
 * @api private
 */

Events.prototype.unbindAllOf = function(event){
  var bindings = this._events[event];
  if (!bindings) return;

  for (var method in bindings) {
    this.unbind(event, method);
  }
};

/**
 * Parse `event`.
 *
 * @param {String} event
 * @return {Object}
 * @api private
 */

function parse(event) {
  var parts = event.split(/ +/);
  return {
    name: parts.shift(),
    selector: parts.join(' ')
  }
}

});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("intron-transform-bounds/index.js", function(exports, require, module){
module.exports = function(x, y, source, target) {
  var newX = (x / source.width) * target.width;
  var newY = (y / source.height) * target.height;
  return { x: newX, y: newY };
}

});
require.register("component-reduce/index.js", function(exports, require, module){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
});
require.register("visionmedia-superagent/lib/client.js", function(exports, require, module){
/**
 * Module dependencies.
 */

var Emitter = require("component-emitter");
var reduce = require("component-reduce");

/**
 * Root reference for iframes.
 */

var root = 'undefined' == typeof window
  ? this
  : window;

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Determine XHR.
 */

function getXHR() {
  if (root.XMLHttpRequest
    && ('file:' != root.location.protocol || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
}

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join('&');
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  this.text = this.xhr.responseText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this.parseBody(this.text)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = request.parse[this.type];
  return parse
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  var type = status / 100 | 0;

  // status / class
  this.status = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status || 1223 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var path = req.path;

  var msg = 'cannot ' + method + ' ' + path + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.path = path;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  Emitter.call(this);
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function(){
    var res = new Response(self);
    if ('HEAD' == method) res.text = null;
    self.callback(null, res);
  });
}

/**
 * Mixin `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass){
  var str = btoa(user + ':' + pass);
  this.set('Authorization', 'Basic ' + str);
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // querystring
 *       request.get('/search')
 *         .end(callback)
 *
 *       // multiple data "writes"
 *       request.get('/search')
 *         .send({ search: 'query' })
 *         .send({ range: '1..5' })
 *         .send({ order: 'desc' })
 *         .end(callback)
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"})
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.getHeader('Content-Type');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this.getHeader('Content-Type');
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  if (2 == fn.length) return fn(err, res);
  if (err) return this.emit('error', err);
  fn(res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
  err.crossDomain = true;
  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;
    if (0 == xhr.status) {
      if (self.aborted) return self.timeoutError();
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  if (xhr.upload) {
    xhr.upload.onprogress = function(e){
      e.percent = e.loaded / e.total * 100;
      self.emit('progress', e);
    };
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  xhr.open(this.method, this.url, true);

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var serialize = request.serialize[this.getHeader('Content-Type')];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  // send stuff
  xhr.send(data);
  return this;
};

/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(method, url) {
  // callback
  if ('function' == typeof url) {
    return new Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new Request('GET', method);
  }

  return new Request(method, url);
}

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.del = function(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * Expose `request`.
 */

module.exports = request;

});
require.main("visionmedia-superagent", "lib/client.js")
require.register("wout-svg.js/dist/svg.js", function(exports, require, module){
/* svg.js v1.0rc2-15-g3754d89 - svg regex default color array pointarray patharray number viewbox bbox rbox element parent container fx relative event defs group arrange mask clip gradient doc shape use rect ellipse line poly path image text textpath nested hyperlink sugar set data memory loader - svgjs.com/license */
;(function() {

  this.SVG = function(element) {
    if (!SVG.parser)
      SVG.prepare()
  
    if (SVG.supported)
      return new SVG.Doc(element)
  }
  
  // Default namespaces
  SVG.ns    = 'http://www.w3.org/2000/svg'
  SVG.xmlns = 'http://www.w3.org/2000/xmlns/'
  SVG.xlink = 'http://www.w3.org/1999/xlink'
  
  // Element id sequence
  SVG.did  = 1000
  
  // Get next named element id
  SVG.eid = function(name) {
    return 'Svgjs' + name.charAt(0).toUpperCase() + name.slice(1) + (SVG.did++)
  }
  
  // Method for element creation
  SVG.create = function(name) {
    /* create element */
    var element = document.createElementNS(this.ns, name)
    
    /* apply unique id */
    element.setAttribute('id', this.eid(name))
    
    return element
  }
  
  // Method for extending objects
  SVG.extend = function() {
    var modules, methods, key, i
    
    /* get list of modules */
    modules = [].slice.call(arguments)
    
    /* get object with extensions */
    methods = modules.pop()
    
    for (i = modules.length - 1; i >= 0; i--)
      if (modules[i])
        for (key in methods)
          modules[i].prototype[key] = methods[key]
  
    /* make sure SVG.Set inherits any newly added methods */
    if (SVG.Set && SVG.Set.inherit)
      SVG.Set.inherit()
  }
  
  // Method for getting an element by id
  SVG.get = function(id) {
    var node = document.getElementById(id)
    if (node) return node.instance
  }
  
  // Initialize parsing element
  SVG.prepare = function() {
    /* select document body and create svg element*/
    var body = document.getElementsByTagName('body')[0] || document.getElementsByTagName('svg')[0]
      , draw = new SVG.Doc(body).size(2, 2).style('opacity:0;position:fixed;left:100%;top:100%;')
  
    /* create parser object */
    SVG.parser = {
      body: body
    , draw: draw
    , poly: draw.polygon().node
    , path: draw.path().node
    }
  }
  
  // svg support test
  SVG.supported = (function() {
    return !! document.createElementNS &&
           !! document.createElementNS(SVG.ns,'svg').createSVGRect
  })()
  
  if (!SVG.supported) return false

  SVG.regex = {
    /* test a given value */
    test: function(value, test) {
      return this[test].test(value)
    }
    
    /* parse unit value */
  , unit:         /^(-?[\d\.]+)([a-z%]{0,2})$/
    
    /* parse hex value */
  , hex:          /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
    
    /* parse rgb value */
  , rgb:          /rgb\((\d+),(\d+),(\d+)\)/
  
    /* test hex value */
  , isHex:        /^#[a-f0-9]{3,6}$/i
    
    /* test rgb value */
  , isRgb:        /^rgb\(/
    
    /* test css declaration */
  , isCss:        /[^:]+:[^;]+;?/
    
    /* test css property */
  , isStyle:      /^font|text|leading|cursor/
    
    /* test for blank string */
  , isBlank:      /^(\s+)?$/
    
    /* test for numeric string */
  , isNumber:     /^-?[\d\.]+$/
  
    /* test for percent value */
  , isPercent:    /^-?[\d\.]+%$/
    
  }

  SVG.defaults = {
    // Default matrix
    matrix:       '1 0 0 1 0 0'
    
    // Default attribute values
  , attrs: {
      /* fill and stroke */
      'fill-opacity':     1
    , 'stroke-opacity':   1
    , 'stroke-width':     0
    , 'stroke-linejoin':  'miter'
    , 'stroke-linecap':   'butt'
    , fill:               '#000000'
    , stroke:             '#000000'
    , opacity:            1
      /* position */
    , x:                  0
    , y:                  0
    , cx:                 0
    , cy:                 0
      /* size */  
    , width:              0
    , height:             0
      /* radius */  
    , r:                  0
    , rx:                 0
    , ry:                 0
      /* gradient */  
    , offset:             0
    , 'stop-opacity':     1
    , 'stop-color':       '#000000'
    }
    
    // Default transformation values
  , trans: function() {
      return {
        /* translate */
        x:        0
      , y:        0
        /* scale */
      , scaleX:   1
      , scaleY:   1
        /* rotate */
      , rotation: 0
        /* skew */
      , skewX:    0
      , skewY:    0
        /* matrix */
      , matrix:   this.matrix
      , a:        1
      , b:        0
      , c:        0
      , d:        1
      , e:        0
      , f:        0
      }
    }
    
  }

  SVG.Color = function(color) {
    var match
    
    /* initialize defaults */
    this.r = 0
    this.g = 0
    this.b = 0
    
    /* parse color */
    if (typeof color == 'string') {
      if (SVG.regex.isRgb.test(color)) {
        /* get rgb values */
        match = SVG.regex.rgb.exec(color.replace(/\s/g,''))
        
        /* parse numeric values */
        this.r = parseInt(match[1])
        this.g = parseInt(match[2])
        this.b = parseInt(match[3])
        
      } else if (SVG.regex.isHex.test(color)) {
        /* get hex values */
        match = SVG.regex.hex.exec(this._fullHex(color))
  
        /* parse numeric values */
        this.r = parseInt(match[1], 16)
        this.g = parseInt(match[2], 16)
        this.b = parseInt(match[3], 16)
  
      }
      
    } else if (typeof color == 'object') {
      this.r = color.r
      this.g = color.g
      this.b = color.b
      
    }
      
  }
  
  SVG.extend(SVG.Color, {
    // Default to hex conversion
    toString: function() {
      return this.toHex()
    }
    // Build hex value
  , toHex: function() {
      return '#'
        + this._compToHex(this.r)
        + this._compToHex(this.g)
        + this._compToHex(this.b)
    }
    // Build rgb value
  , toRgb: function() {
      return 'rgb(' + [this.r, this.g, this.b].join() + ')'
    }
    // Calculate true brightness
  , brightness: function() {
      return (this.r / 255 * 0.30)
           + (this.g / 255 * 0.59)
           + (this.b / 255 * 0.11)
    }
    // Make color morphable
  , morph: function(color) {
      this.destination = new SVG.Color(color)
  
      return this
    }
    // Get morphed color at given position
  , at: function(pos) {
      /* make sure a destination is defined */
      if (!this.destination) return this
  
      /* normalise pos */
      pos = pos < 0 ? 0 : pos > 1 ? 1 : pos
  
      /* generate morphed color */
      return new SVG.Color({
        r: ~~(this.r + (this.destination.r - this.r) * pos)
      , g: ~~(this.g + (this.destination.g - this.g) * pos)
      , b: ~~(this.b + (this.destination.b - this.b) * pos)
      })
    }
    // Private: ensure to six-based hex 
  , _fullHex: function(hex) {
      return hex.length == 4 ?
        [ '#',
          hex.substring(1, 2), hex.substring(1, 2)
        , hex.substring(2, 3), hex.substring(2, 3)
        , hex.substring(3, 4), hex.substring(3, 4)
        ].join('') : hex
    }
    // Private: component to hex value
  , _compToHex: function(comp) {
      var hex = comp.toString(16)
      return hex.length == 1 ? '0' + hex : hex
    }
    
  })
  
  // Test if given value is a color string
  SVG.Color.test = function(color) {
    color += ''
    return SVG.regex.isHex.test(color)
        || SVG.regex.isRgb.test(color)
  }
  
  // Test if given value is a rgb object
  SVG.Color.isRgb = function(color) {
    return color && typeof color.r == 'number'
                 && typeof color.g == 'number'
                 && typeof color.b == 'number'
  }
  
  // Test if given value is a color
  SVG.Color.isColor = function(color) {
    return SVG.Color.isRgb(color) || SVG.Color.test(color)
  }

  SVG.Array = function(array, fallback) {
    array = (array || []).valueOf()
  
    /* if array is empty and fallback is provided, use fallback */
    if (array.length == 0 && fallback)
      array = fallback.valueOf()
  
    /* parse array */
    this.value = this.parse(array)
  }
  
  SVG.extend(SVG.Array, {
    // Make array morphable
    morph: function(array) {
      this.destination = this.parse(array)
  
      /* normalize length of arrays */
      if (this.value.length != this.destination.length) {
        var lastValue       = this.value[this.value.length - 1]
          , lastDestination = this.destination[this.destination.length - 1]
  
        while(this.value.length > this.destination.length)
          this.destination.push(lastDestination)
        while(this.value.length < this.destination.length)
          this.value.push(lastValue)
      }
  
      return this
    }
    // Clean up any duplicate points
  , settle: function() {
      /* find all unique values */
      for (var i = 0, il = this.value.length, seen = []; i < il; i++)
        if (seen.indexOf(this.value[i]) == -1)
          seen.push(this.value[i])
  
      /* set new value */
      return this.value = seen
    }
    // Get morphed array at given position
  , at: function(pos) {
      /* make sure a destination is defined */
      if (!this.destination) return this
  
      /* generate morphed array */
      for (var i = 0, il = this.value.length, array = []; i < il; i++)
        array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos)
  
      return new SVG.Array(array)
    }
    // Convert array to string
  , toString: function() {
      return this.value.join(' ')
    }
    // Real value
  , valueOf: function() {
      return this.value
    }
    // Parse whitespace separated string
  , parse: function(array) {
      array = array.valueOf()
  
      /* if already is an array, no need to parse it */
      if (Array.isArray(array)) return array
  
      return this.split(array)
    }
    // Strip unnecessary whitespace
  , split: function(string) {
      return string.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g,'').split(' ') 
    }
  
  })
  


  SVG.PointArray = function() {
    this.constructor.apply(this, arguments)
  }
  
  // Inherit from SVG.Array
  SVG.PointArray.prototype = new SVG.Array
  
  SVG.extend(SVG.PointArray, {
    // Convert array to string
    toString: function() {
      /* convert to a poly point string */
      for (var i = 0, il = this.value.length, array = []; i < il; i++)
        array.push(this.value[i].join(','))
  
      return array.join(' ')
    }
    // Get morphed array at given position
  , at: function(pos) {
      /* make sure a destination is defined */
      if (!this.destination) return this
  
      /* generate morphed point string */
      for (var i = 0, il = this.value.length, array = []; i < il; i++)
        array.push([
          this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos
        , this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos
        ])
  
      return new SVG.PointArray(array)
    }
    // Parse point string
  , parse: function(array) {
      array = array.valueOf()
  
      /* if already is an array, no need to parse it */
      if (Array.isArray(array)) return array
  
      /* split points */
      array = this.split(array)
  
      /* parse points */
      for (var i = 0, il = array.length, p, points = []; i < il; i++) {
        p = array[i].split(',')
        points.push([parseFloat(p[0]), parseFloat(p[1])])
      }
  
      return points
    }
    // Move point string
  , move: function(x, y) {
      var box = this.bbox()
  
      /* get relative offset */
      x -= box.x
      y -= box.y
  
      /* move every point */
      if (!isNaN(x) && !isNaN(y))
        for (var i = this.value.length - 1; i >= 0; i--)
          this.value[i] = [this.value[i][0] + x, this.value[i][1] + y]
  
      return this
    }
    // Resize poly string
  , size: function(width, height) {
      var i, box = this.bbox()
  
      /* recalculate position of all points according to new size */
      for (i = this.value.length - 1; i >= 0; i--) {
        this.value[i][0] = ((this.value[i][0] - box.x) * width)  / box.width  + box.x
        this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.x
      }
  
      return this
    }
    // Get bounding box of points
  , bbox: function() {
      if (this._cachedBBox) return this._cachedBBox
  
      SVG.parser.poly.setAttribute('points', this.toString())
  
      return SVG.parser.poly.getBBox()
    }
  
  })

  SVG.PathArray = function(array, fallback) {
    this.constructor.call(this, array, fallback)
  }
  
  // Inherit from SVG.Array
  SVG.PathArray.prototype = new SVG.Array
  
  SVG.extend(SVG.PathArray, {
    // Convert array to string
    toString: function() {
      for (var s, i = 0, il = this.value.length, array = []; i < il; i++) {
        s = [this.value[i].type]
        
        switch(this.value[i].type) {
          case 'H':
            s.push(this.value[i].x)
          break
          case 'V':
            s.push(this.value[i].y)
          break
          case 'M':
          case 'L':
          case 'T':
          case 'S':
          case 'Q':
          case 'C':
            if (/[QC]/.test(this.value[i].type))
              s.push(this.value[i].x1, this.value[i].y1)
            if (/[CS]/.test(this.value[i].type))
              s.push(this.value[i].x2, this.value[i].y2)
  
            s.push(this.value[i].x, this.value[i].y)
  
          break
          case 'A':
            s.push(
              this.value[i].rx
            , this.value[i].ry
            , this.value[i].angle
            , this.value[i].largeArcFlag
            , this.value[i].sweepFlag
            , this.value[i].x
            , this.value[i].y
            )
          break
        }
  
        /* add to array */
        array.push(s.join(' '))
      }
      
      return array.join(' ')
    }
    // Move path string
  , move: function(x, y) {
  		/* get bounding box of current situation */
  		var box = this.bbox()
  		
      /* get relative offset */
      x -= box.x
      y -= box.y
  
      if (!isNaN(x) && !isNaN(y)) {
        /* move every point */
        for (var i = this.value.length - 1; i >= 0; i--) {
          switch (this.value[i].type) {
            case 'H':
              /* move along x axis only */
              this.value[i].x += x
            break
            case 'V':
              /* move along y axis only */
              this.value[i].y += y
            break
            case 'M':
            case 'L':
            case 'T':
            case 'S':
            case 'Q':
            case 'C':
              /* move first point along x and y axes */
              this.value[i].x += x
              this.value[i].y += y
  
              /* move third points along x and y axes */
              if (/[CQ]/.test(this.value[i].type)) {
                this.value[i].x1 += x
                this.value[i].y1 += y
              }
  
              /* move second points along x and y axes */
              if (/[CS]/.test(this.value[i].type)) {
                this.value[i].x2 += x
                this.value[i].y2 += y
              }
  
            break
            case 'A':
              /* only move position values */
              this.value[i].x += x
              this.value[i].y += y
            break
          }
        }
      }
  
      return this
    }
    // Resize path string
  , size: function(width, height) {
  		/* get bounding box of current situation */
  		var box = this.bbox()
  
      /* recalculate position of all points according to new size */
      for (var i = this.value.length - 1; i >= 0; i--) {
        switch (this.value[i].type) {
          case 'H':
            /* move along x axis only */
            this.value[i].x = ((this.value[i].x - box.x) * width)  / box.width  + box.x
          break
          case 'V':
            /* move along y axis only */
            this.value[i].y = ((this.value[i].y - box.y) * height) / box.height + box.y
          break
          case 'M':
          case 'L':
          case 'T':
          case 'S':
          case 'Q':
          case 'C':
            this.value[i].x = ((this.value[i].x - box.x) * width)  / box.width  + box.x
            this.value[i].y = ((this.value[i].y - box.y) * height) / box.height + box.y
  
            /* move third points along x and y axes */
            if (/[CQ]/.test(this.value[i].type)) {
              this.value[i].x1 = ((this.value[i].x1 - box.x) * width)  / box.width  + box.x
              this.value[i].y1 = ((this.value[i].y1 - box.y) * height) / box.height + box.y
            }
  
            /* move second points along x and y axes */
            if (/[CS]/.test(this.value[i].type)) {
              this.value[i].x2 = ((this.value[i].x2 - box.x) * width)  / box.width  + box.x
              this.value[i].y2 = ((this.value[i].y2 - box.y) * height) / box.height + box.y
            }
  
          break
          case 'A':
            /* resize radii */
            this.value[i].values.rx = (this.value[i].values.rx * width)  / box.width
            this.value[i].values.ry = (this.value[i].values.ry * height) / box.height
  
            /* move position values */
            this.value[i].values.x = ((this.value[i].values.x - box.x) * width)  / box.width  + box.x
            this.value[i].values.y = ((this.value[i].values.y - box.y) * height) / box.height + box.y
          break
        }
      }
  
      return this
    }
    // Absolutize and parse path to array
  , parse: function(array) {
      array = array.valueOf()
  
      /* if already is an array, no need to parse it */
      if (Array.isArray(array)) return array
  
      /* prepare for parsing */
      var i, il, x0, y0, x1, y1, x2, y2, s, seg, segs
        , x = 0
        , y = 0
      
      /* populate working path */
      SVG.parser.path.setAttribute('d', array)
      
      /* get segments */
      segs = SVG.parser.path.pathSegList
  
      for (i = 0, il = segs.numberOfItems; i < il; ++i) {
        seg = segs.getItem(i)
        s = seg.pathSegTypeAsLetter
  
        if (/[MLHVCSQTA]/.test(s)) {
          if ('x' in seg) x = seg.x
          if ('y' in seg) y = seg.y
  
        } else {
          if ('x1' in seg) x1 = x + seg.x1
          if ('x2' in seg) x2 = x + seg.x2
          if ('y1' in seg) y1 = y + seg.y1
          if ('y2' in seg) y2 = y + seg.y2
          if ('x'  in seg) x += seg.x
          if ('y'  in seg) y += seg.y
  
          switch(s){
            case 'm': 
              segs.replaceItem(SVG.parser.path.createSVGPathSegMovetoAbs(x, y), i)
            break
            case 'l': 
              segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoAbs(x, y), i)
            break
            case 'h': 
              segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoHorizontalAbs(x), i)
            break
            case 'v': 
              segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoVerticalAbs(y), i)
            break
            case 'c': 
              segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i)
            break
            case 's': 
              segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i)
            break
            case 'q': 
              segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i)
            break
            case 't': 
              segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i)
            break
            case 'a': 
              segs.replaceItem(SVG.parser.path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i) 
            break
            case 'z':
            case 'Z':
              x = x0
              y = y0
            break
          }
        }
  
        /* record the start of a subpath */
        if (/[Mm]/.test(s)) {
          x0 = x
          y0 = y
        }
      }
  
      /* build internal representation */
      array = []
      segs = SVG.parser.path.pathSegList
      
      for (i = 0, il = segs.numberOfItems; i < il; ++i) {
        seg = segs.getItem(i)
        s = {}
  
        switch (seg.pathSegTypeAsLetter) {
          case 'M':
          case 'L':
          case 'T':
          case 'S':
          case 'Q':
          case 'C':
            if (/[QC]/.test(seg.pathSegTypeAsLetter)) {
              s.x1 = seg.x1
              s.y1 = seg.y1
            }
  
            if (/[SC]/.test(seg.pathSegTypeAsLetter)) {
              s.x2 = seg.x2
              s.y2 = seg.y2
            }
  
          break
          case 'A':
            s = {
              r1: seg.r1
            , r2: seg.r2
            , a:  seg.angle
            , l:  seg.largeArcFlag
            , s:  seg.sweepFlag
            }
          break
        }
  
        /* make the letter, x and y values accessible as key/values */
        s.type = seg.pathSegTypeAsLetter
        s.x = seg.x
        s.y = seg.y
  
        /* store segment */
        array.push(s)
      }
      
      return array
    }
    // Get bounding box of path
  , bbox: function() {
  		if (this._cachedBBox) return this._cachedBBox
  
      SVG.parser.path.setAttribute('d', this.toString())
  
      return SVG.parser.path.getBBox()
    }
  
  })

  SVG.Number = function(value) {
  
    /* initialize defaults */
    this.value = 0
    this.unit = ''
  
    /* parse value */
    switch(typeof value) {
      case 'number':
        /* ensure a valid numeric value */
        this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value
      break
      case 'string':
        var match = value.match(SVG.regex.unit)
  
        if (match) {
          /* make value numeric */
          this.value = parseFloat(match[1])
      
          /* normalize percent value */
          if (match[2] == '%')
            this.value /= 100
      
          /* store unit */
          this.unit = match[2]
        }
        
      break
      default:
        if (value instanceof SVG.Number) {
          this.value = value.value
          this.unit  = value.unit
        }
      break
    }
  }
  
  SVG.extend(SVG.Number, {
    // Stringalize
    toString: function() {
      return (this.unit == '%' ? ~~(this.value * 1e8) / 1e6 : this.value) + this.unit
    }
  , // Convert to primitive
    valueOf: function() {
      return this.value
    }
    // Add number
  , plus: function(number) {
      this.value = this + new SVG.Number(number)
  
      return this
    }
    // Subtract number
  , minus: function(number) {
      return this.plus(-new SVG.Number(number))
    }
    // Multiply number
  , times: function(number) {
      this.value = this * new SVG.Number(number)
  
      return this
    }
    // Divide number
  , divide: function(number) {
      this.value = this / new SVG.Number(number)
  
      return this
    }
    // Convert to different unit
  , to: function(unit) {
      if (typeof unit === 'string')
        this.unit = unit
  
      return this
    }
    // Make number morphable
  , morph: function(number) {
      this.destination = new SVG.Number(number)
  
      return this
    }
    // Get morphed number at given position
  , at: function(pos) {
      /* make sure a destination is defined */
      if (!this.destination) return this
  
      /* generate morphed number */
      return new SVG.Number(this.destination)
          .minus(this)
          .times(pos)
          .plus(this)
    }
  
  })

  SVG.ViewBox = function(element) {
    var x, y, width, height
      , wm   = 1 /* width multiplier */
      , hm   = 1 /* height multiplier */
      , box  = element.bbox()
      , view = (element.attr('viewBox') || '').match(/-?[\d\.]+/g)
  
    /* get dimensions of current node */
    width  = new SVG.Number(element.width())
    height = new SVG.Number(element.height())
  
    /* find nearest non-percentual dimensions */
    while (width.unit == '%') {
      wm *= width.value
      width = new SVG.Number(element instanceof SVG.Doc ? element.parent.offsetWidth : element.width())
    }
    while (height.unit == '%') {
      hm *= height.value
      height = new SVG.Number(element instanceof SVG.Doc ? element.parent.offsetHeight : element.height())
    }
    
    /* ensure defaults */
    this.x      = box.x
    this.y      = box.y
    this.width  = width  * wm
    this.height = height * hm
    this.zoom   = 1
    
    if (view) {
      /* get width and height from viewbox */
      x      = parseFloat(view[0])
      y      = parseFloat(view[1])
      width  = parseFloat(view[2])
      height = parseFloat(view[3])
      
      /* calculate zoom accoring to viewbox */
      this.zoom = ((this.width / this.height) > (width / height)) ?
        this.height / height :
        this.width  / width
  
      /* calculate real pixel dimensions on parent SVG.Doc element */
      this.x      = x
      this.y      = y
      this.width  = width
      this.height = height
      
    }
    
  }
  
  //
  SVG.extend(SVG.ViewBox, {
    // Parse viewbox to string
    toString: function() {
      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
    }
    
  })

  SVG.BBox = function(element) {
    var box
  
    /* initialize zero box */
    this.x      = 0
    this.y      = 0
    this.width  = 0
    this.height = 0
    
    /* get values if element is given */
    if (element) {
      try {
        /* actual, native bounding box */
        box = element.node.getBBox()
      } catch(e) {
        /* fallback for some browsers */
        box = {
          x:      element.node.clientLeft
        , y:      element.node.clientTop
        , width:  element.node.clientWidth
        , height: element.node.clientHeight
        }
      }
      
      /* include translations on x an y */
      this.x = box.x + element.trans.x
      this.y = box.y + element.trans.y
      
      /* plain width and height */
      this.width  = box.width  * element.trans.scaleX
      this.height = box.height * element.trans.scaleY
    }
    
    /* add the center */
    this.cx = this.x + this.width / 2
    this.cy = this.y + this.height / 2
    
  }
  
  //
  SVG.extend(SVG.BBox, {
    // merge bounding box with another, return a new instance
    merge: function(box) {
      var b = new SVG.BBox()
  
      /* merge box */
      b.x      = Math.min(this.x, box.x)
      b.y      = Math.min(this.y, box.y)
      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y
  
      /* add the center */
      b.cx = b.x + b.width / 2
      b.cy = b.y + b.height / 2
  
      return b
    }
  
  })

  SVG.RBox = function(element) {
    var e, zoom
      , box = {}
  
    /* initialize zero box */
    this.x      = 0
    this.y      = 0
    this.width  = 0
    this.height = 0
    
    if (element) {
      e = element.doc().parent
      zoom = element.doc().viewbox().zoom
      
      /* actual, native bounding box */
      box = element.node.getBoundingClientRect()
      
      /* get screen offset */
      this.x = box.left
      this.y = box.top
      
      /* subtract parent offset */
      this.x -= e.offsetLeft
      this.y -= e.offsetTop
      
      while (e = e.offsetParent) {
        this.x -= e.offsetLeft
        this.y -= e.offsetTop
      }
      
      /* calculate cumulative zoom from svg documents */
      e = element
      while (e = e.parent) {
        if (e.type == 'svg' && e.viewbox) {
          zoom *= e.viewbox().zoom
          this.x -= e.x() || 0
          this.y -= e.y() || 0
        }
      }
    }
    
    /* recalculate viewbox distortion */
    this.x /= zoom
    this.y /= zoom
    this.width  = box.width  /= zoom
    this.height = box.height /= zoom
    
    /* add the center */
    this.cx = this.x + this.width  / 2
    this.cy = this.y + this.height / 2
    
  }
  
  //
  SVG.extend(SVG.RBox, {
    // merge rect box with another, return a new instance
    merge: function(box) {
      var b = new SVG.RBox()
  
      /* merge box */
      b.x      = Math.min(this.x, box.x)
      b.y      = Math.min(this.y, box.y)
      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y
  
      /* add the center */
      b.cx = b.x + b.width / 2
      b.cy = b.y + b.height / 2
  
      return b
    }
  
  })

  SVG.Element = function(node) {
    /* make stroke value accessible dynamically */
    this._stroke = SVG.defaults.attrs.stroke
    
    /* initialize style store */
    this.styles = {}
    
    /* initialize transformation store with defaults */
    this.trans = SVG.defaults.trans()
    
    /* keep reference to the element node */
    if (this.node = node) {
      this.type = node.nodeName
      this.node.instance = this
    }
  }
  
  //
  SVG.extend(SVG.Element, {
    // Move over x-axis
    x: function(x) {
      if (x) {
        x = new SVG.Number(x)
        x.value /= this.trans.scaleX
      }
      return this.attr('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      if (y) {
        y = new SVG.Number(y)
        y.value /= this.trans.scaleY
      }
      return this.attr('y', y)
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2)
    }
    // Move element to given x and y values
  , move: function(x, y) {
      return this.x(x).y(y)
    }
    // Move element by its center
  , center: function(x, y) {
      return this.cx(x).cy(y)
    }
    // Set width of element
  , width: function(width) {
      return this.attr('width', width)
    }
    // Set height of element
  , height: function(height) {
      return this.attr('height', height)
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = this._proportionalSize(width, height)
  
      return this.attr({
        width:  new SVG.Number(p.width)
      , height: new SVG.Number(p.height)
      })
    }
    // Clone element
  , clone: function() {
      var clone , attr
        , type = this.type
      
      /* invoke shape method with shape-specific arguments */
      clone = type == 'rect' || type == 'ellipse' ?
        this.parent[type](0,0) :
      type == 'line' ?
        this.parent[type](0,0,0,0) :
      type == 'image' ?
        this.parent[type](this.src) :
      type == 'text' ?
        this.parent[type](this.content) :
      type == 'path' ?
        this.parent[type](this.attr('d')) :
      type == 'polyline' || type == 'polygon' ?
        this.parent[type](this.attr('points')) :
      type == 'g' ?
        this.parent.group() :
        this.parent[type]()
      
      /* apply attributes attributes */
      attr = this.attr()
      delete attr.id
      clone.attr(attr)
      
      /* copy transformations */
      clone.trans = this.trans
      
      /* apply attributes and translations */
      return clone.transform({})
    }
    // Remove element
  , remove: function() {
      if (this.parent)
        this.parent.removeElement(this)
      
      return this
    }
    // Replace element
  , replace: function(element) {
      this.after(element).remove()
  
      return element
    }
    // Add element to given container and return self
  , addTo: function(parent) {
      return parent.put(this)
    }
    // Add element to given container and return container
  , putIn: function(parent) {
      return parent.add(this)
    }
    // Get parent document
  , doc: function(type) {
      return this._parent(type || SVG.Doc)
    }
    // Set svg element attribute
  , attr: function(a, v, n) {
      if (a == null) {
        /* get an object of attributes */
        a = {}
        v = this.node.attributes
        for (n = v.length - 1; n >= 0; n--)
          a[v[n].nodeName] = SVG.regex.test(v[n].nodeValue, 'isNumber') ? parseFloat(v[n].nodeValue) : v[n].nodeValue
        
        return a
        
      } else if (typeof a == 'object') {
        /* apply every attribute individually if an object is passed */
        for (v in a) this.attr(v, a[v])
        
      } else if (v === null) {
          /* remove value */
          this.node.removeAttribute(a)
        
      } else if (v == null) {
        /* act as a getter for style attributes */
        if (this._isStyle(a)) {
          return a == 'text' ?
                   this.content :
                 a == 'leading' && this.leading ?
                   this.leading() :
                   this.style(a)
        
        /* act as a getter if the first and only argument is not an object */
        } else {
          v = this.node.getAttribute(a)
          return v == null ? 
            SVG.defaults.attrs[a] :
          SVG.regex.test(v, 'isNumber') ?
            parseFloat(v) : v
        }
      
      } else if (a == 'style') {
        /* redirect to the style method */
        return this.style(v)
      
      } else {
        /* treat x differently on text elements */
        if (a == 'x' && Array.isArray(this.lines))
          for (n = this.lines.length - 1; n >= 0; n--)
            this.lines[n].attr(a, v)
        
        /* BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0 */
        if (a == 'stroke-width')
          this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
        else if (a == 'stroke')
          this._stroke = v
        
        /* ensure full hex color */
        if (SVG.Color.test(v) || SVG.Color.isRgb(v))
          v = new SVG.Color(v)
  
        /* ensure correct numeric values */
        else if (typeof v === 'number')
          v = new SVG.Number(v)
  
        /* parse array values */
        else if (Array.isArray(v))
          v = new SVG.Array(v)
  
        /* set give attribute on node */
        n != null ?
          this.node.setAttributeNS(n, a, v.toString()) :
          this.node.setAttribute(a, v.toString())
        
        /* if the passed argument belongs in the style as well, add it there */
        if (this._isStyle(a)) {
          a == 'text' ?
            this.text(v) :
          a == 'leading' && this.leading ?
            this.leading(v) :
            this.style(a, v)
          
          /* rebuild if required */
          if (this.rebuild)
            this.rebuild(a, v)
        }
      }
      
      return this
    }
    // Manage transformations
  , transform: function(o, v) {
      
      if (arguments.length == 0) {
        /* act as a getter if no argument is given */
        return this.trans
        
      } else if (typeof o === 'string') {
        /* act as a getter if only one string argument is given */
        if (arguments.length < 2)
          return this.trans[o]
        
        /* apply transformations as object if key value arguments are given*/
        var transform = {}
        transform[o] = v
        
        return this.transform(transform)
      }
      
      /* ... otherwise continue as a setter */
      var transform = []
      
      /* parse matrix */
      o = this._parseMatrix(o)
      
      /* merge values */
      for (v in o)
        if (o[v] != null)
          this.trans[v] = o[v]
      
      /* compile matrix */
      this.trans.matrix = this.trans.a
                  + ' ' + this.trans.b
                  + ' ' + this.trans.c
                  + ' ' + this.trans.d
                  + ' ' + this.trans.e
                  + ' ' + this.trans.f
      
      /* alias current transformations */
      o = this.trans
      
      /* add matrix */
      if (o.matrix != SVG.defaults.matrix)
        transform.push('matrix(' + o.matrix + ')')
      
      /* add rotation */
      if (o.rotation != 0)
        transform.push('rotate(' + o.rotation + ' ' + (o.cx == null ? this.bbox().cx : o.cx) + ' ' + (o.cy == null ? this.bbox().cy : o.cy) + ')')
      
      /* add scale */
      if (o.scaleX != 1 || o.scaleY != 1)
        transform.push('scale(' + o.scaleX + ' ' + o.scaleY + ')')
      
      /* add skew on x axis */
      if (o.skewX != 0)
        transform.push('skewX(' + o.skewX + ')')
      
      /* add skew on y axis */
      if (o.skewY != 0)
        transform.push('skewY(' + o.skewY + ')')
      
      /* add translation */
      if (o.x != 0 || o.y != 0)
        transform.push('translate(' + new SVG.Number(o.x / o.scaleX) + ' ' + new SVG.Number(o.y / o.scaleY) + ')')
      
      /* update transformations, even if there are none */
      if (transform.length == 0)
        this.node.removeAttribute('transform')
      else
        this.node.setAttribute('transform', transform.join(' '))
      
      return this
    }
    // Dynamic style generator
  , style: function(s, v) {
      if (arguments.length == 0) {
        /* get full style */
        return this.attr('style') || ''
      
      } else if (arguments.length < 2) {
        /* apply every style individually if an object is passed */
        if (typeof s == 'object') {
          for (v in s) this.style(v, s[v])
        
        } else if (SVG.regex.isCss.test(s)) {
          /* parse css string */
          s = s.split(';')
  
          /* apply every definition individually */
          for (var i = 0; i < s.length; i++) {
            v = s[i].split(':')
  
            if (v.length == 2)
              this.style(v[0].replace(/\s+/g, ''), v[1].replace(/^\s+/,'').replace(/\s+$/,''))
          }
        } else {
          /* act as a getter if the first and only argument is not an object */
          return this.styles[s]
        }
      
      } else if (v === null || SVG.regex.test(v, 'isBlank')) {
        /* remove value */
        delete this.styles[s]
        
      } else {
        /* store value */
        this.styles[s] = v
      }
      
      /* rebuild style string */
      s = ''
      for (v in this.styles)
        s += v + ':' + this.styles[v] + ';'
      
      /* apply style */
      if (s == '')
        this.node.removeAttribute('style')
      else
        this.node.setAttribute('style', s)
      
      return this
    }
    // Get bounding box
  , bbox: function() {
      return new SVG.BBox(this)
    }
    // Get rect box
  , rbox: function() {
      return new SVG.RBox(this)
    }
    // Checks whether the given point inside the bounding box of the element
  , inside: function(x, y) {
      var box = this.bbox()
      
      return x > box.x
          && y > box.y
          && x < box.x + box.width
          && y < box.y + box.height
    }
    // Show element
  , show: function() {
      return this.style('display', '')
    }
    // Hide element
  , hide: function() {
      return this.style('display', 'none')
    }
    // Is element visible?
  , visible: function() {
      return this.style('display') != 'none'
    }
    // Return id on string conversion
  , toString: function() {
      return this.attr('id')
    }
    // Private: find svg parent by instance
  , _parent: function(parent) {
      var element = this
      
      while (element != null && !(element instanceof parent))
        element = element.parent
  
      return element
    }
    // Private: tester method for style detection
  , _isStyle: function(a) {
      return typeof a == 'string' ? SVG.regex.test(a, 'isStyle') : false
    }
    // Private: parse a matrix string
  , _parseMatrix: function(o) {
      if (o.matrix) {
        /* split matrix string */
        var m = o.matrix.replace(/\s/g, '').split(',')
        
        /* pasrse values */
        if (m.length == 6) {
          o.a = parseFloat(m[0])
          o.b = parseFloat(m[1])
          o.c = parseFloat(m[2])
          o.d = parseFloat(m[3])
          o.e = parseFloat(m[4])
          o.f = parseFloat(m[5])
        }
      }
      
      return o
    }
    // Private: calculate proportional width and height values when necessary
  , _proportionalSize: function(width, height) {
      if (width == null || height == null) {
        var box = this.bbox()
  
        if (height == null)
          height = box.height / box.width * width
        else if (width == null)
          width = box.width / box.height * height
      }
      
      return {
        width:  width
      , height: height
      }
    }
    
  })

  SVG.Parent = function(element) {
    this.constructor.call(this, element)
  }
  
  // Inherit from SVG.Element
  SVG.Parent.prototype = new SVG.Element
  
  //
  SVG.extend(SVG.Parent, {
  	// Returns all child elements
    children: function() {
      return this._children || (this._children = [])
    }
    // Add given element at a position
  , add: function(element, i) {
      if (!this.has(element)) {
        /* define insertion index if none given */
        i = i == null ? this.children().length : i
        
        /* remove references from previous parent */
        if (element.parent)
          element.parent.children().splice(element.parent.index(element), 1)
        
        /* add element references */
        this.children().splice(i, 0, element)
        this.node.insertBefore(element.node, this.node.childNodes[i] || null)
        element.parent = this
      }
  
      /* reposition defs */
      if (this._defs) {
        this.node.removeChild(this._defs.node)
        this.node.appendChild(this._defs.node)
      }
      
      return this
    }
    // Basically does the same as `add()` but returns the added element instead
  , put: function(element, i) {
      this.add(element, i)
      return element
    }
    // Checks if the given element is a child
  , has: function(element) {
      return this.index(element) >= 0
    }
    // Gets index of given element
  , index: function(element) {
      return this.children().indexOf(element)
    }
    // Get a element at the given index
  , get: function(i) {
      return this.children()[i]
    }
    // Get first child, skipping the defs node
  , first: function() {
      return this.children()[0]
    }
    // Get the last child
  , last: function() {
      return this.children()[this.children().length - 1]
    }
    // Iterates over all children and invokes a given block
  , each: function(block, deep) {
      var i, il
        , children = this.children()
      
      for (i = 0, il = children.length; i < il; i++) {
        if (children[i] instanceof SVG.Element)
          block.apply(children[i], [i, children])
  
        if (deep && (children[i] instanceof SVG.Container))
          children[i].each(block, deep)
      }
    
      return this
    }
    // Remove a child element at a position
  , removeElement: function(element) {
      this.children().splice(this.index(element), 1)
      this.node.removeChild(element.node)
      element.parent = null
      
      return this
    }
    // Remove all elements in this container
  , clear: function() {
      /* remove children */
      for (var i = this.children().length - 1; i >= 0; i--)
        this.removeElement(this.children()[i])
  
      /* remove defs node */
      if (this._defs)
        this._defs.clear()
  
      return this
    }
   , // Get defs
    defs: function() {
      return this.doc().defs()
    }
  })

  SVG.Container = function(element) {
    this.constructor.call(this, element)
  }
  
  // Inherit from SVG.Parent
  SVG.Container.prototype = new SVG.Parent
  
  //
  SVG.extend(SVG.Container, {
    // Get the viewBox and calculate the zoom value
    viewbox: function(v) {
      if (arguments.length == 0)
        /* act as a getter if there are no arguments */
        return new SVG.ViewBox(this)
      
      /* otherwise act as a setter */
      v = arguments.length == 1 ?
        [v.x, v.y, v.width, v.height] :
        [].slice.call(arguments)
      
      return this.attr('viewBox', v)
    }
    
  })

  SVG.FX = function(element) {
    /* store target element */
    this.target = element
  }
  
  SVG.extend(SVG.FX, {
    // Add animation parameters and start animation
    animate: function(d, ease, delay) {
      var akeys, tkeys, skeys, key
        , element = this.target
        , fx = this
      
      /* dissect object if one is passed */
      if (typeof d == 'object') {
        delay = d.delay
        ease = d.ease
        d = d.duration
      }
  
      /* ensure default duration and easing */
      d = d == null ? 1000 : d
      ease = ease || '<>'
  
      /* process values */
      fx.to = function(pos) {
        var i
  
        /* normalise pos */
        pos = pos < 0 ? 0 : pos > 1 ? 1 : pos
  
        /* collect attribute keys */
        if (akeys == null) {
          akeys = []
          for (key in fx.attrs)
            akeys.push(key)
  
          /* make sure morphable elements are scaled, translated and morphed all together */
          if (element.morphArray && (fx._plot || akeys.indexOf('points') > -1)) {
            /* get destination */
            var box
              , p = new element.morphArray(fx._plot || fx.attrs.points || element.array)
  
            /* add size */
            if (fx._size) p.size(fx._size.width.to, fx._size.height.to)
  
            /* add movement */
            box = p.bbox()
            if (fx._x) p.move(fx._x.to, box.y)
            else if (fx._cx) p.move(fx._cx.to - box.width / 2, box.y)
  
            box = p.bbox()
            if (fx._y) p.move(box.x, fx._y.to)
            else if (fx._cy) p.move(box.x, fx._cy.to - box.height / 2)
  
            /* delete element oriented changes */
            delete fx._x
            delete fx._y
            delete fx._cx
            delete fx._cy
            delete fx._size
  
            fx._plot = element.array.morph(p)
          }
        }
  
        /* collect transformation keys */
        if (tkeys == null) {
          tkeys = []
          for (key in fx.trans)
            tkeys.push(key)
        }
  
        /* collect style keys */
        if (skeys == null) {
          skeys = []
          for (key in fx.styles)
            skeys.push(key)
        }
  
        /* apply easing */
        pos = ease == '<>' ?
          (-Math.cos(pos * Math.PI) / 2) + 0.5 :
        ease == '>' ?
          Math.sin(pos * Math.PI / 2) :
        ease == '<' ?
          -Math.cos(pos * Math.PI / 2) + 1 :
        ease == '-' ?
          pos :
        typeof ease == 'function' ?
          ease(pos) :
          pos
        
        /* run plot function */
        if (fx._plot) {
          element.plot(fx._plot.at(pos))
  
        } else {
          /* run all x-position properties */
          if (fx._x)
            element.x(at(fx._x, pos))
          else if (fx._cx)
            element.cx(at(fx._cx, pos))
  
          /* run all y-position properties */
          if (fx._y)
            element.y(at(fx._y, pos))
          else if (fx._cy)
            element.cy(at(fx._cy, pos))
  
          /* run all size properties */
          if (fx._size)
            element.size(at(fx._size.width, pos), at(fx._size.height, pos))
        }
  
        /* run all viewbox properties */
        if (fx._viewbox)
          element.viewbox(
            at(fx._viewbox.x, pos)
          , at(fx._viewbox.y, pos)
          , at(fx._viewbox.width, pos)
          , at(fx._viewbox.height, pos)
          )
  
        /* animate attributes */
        for (i = akeys.length - 1; i >= 0; i--)
          element.attr(akeys[i], at(fx.attrs[akeys[i]], pos))
  
        /* animate transformations */
        for (i = tkeys.length - 1; i >= 0; i--)
          element.transform(tkeys[i], at(fx.trans[tkeys[i]], pos))
  
        /* animate styles */
        for (i = skeys.length - 1; i >= 0; i--)
          element.style(skeys[i], at(fx.styles[skeys[i]], pos))
  
        /* callback for each keyframe */
        if (fx._during)
          fx._during.call(element, pos, function(from, to) {
            return at({ from: from, to: to }, pos)
          })
      }
      
      if (typeof d === 'number') {
        /* delay animation */
        this.timeout = setTimeout(function() {
          var start = new Date().getTime()
  
          /* initialize situation object */
          fx.situation = {
            interval: 1000 / 60
          , start:    start
          , play:     true
          , finish:   start + d
          , duration: d
          }
  
          /* render function */
          fx.render = function(){
            
            if (fx.situation.play === true) {
              // This code was borrowed from the emile.js micro framework by Thomas Fuchs, aka MadRobby.
              var time = new Date().getTime()
                , pos = time > fx.situation.finish ? 1 : (time - fx.situation.start) / d
              
              /* process values */
              fx.to(pos)
              
              /* finish off animation */
              if (time > fx.situation.finish) {
                if (fx._plot)
                  element.plot(new SVG.PointArray(fx._plot.destination).settle())
  
                if (fx._loop === true || (typeof fx._loop == 'number' && fx._loop > 1)) {
                  if (typeof fx._loop == 'number')
                    --fx._loop
                  fx.animate(d, ease, delay)
                } else {
                  fx._after ? fx._after.apply(element, [fx]) : fx.stop()
                }
  
              } else {
                requestAnimFrame(fx.render)
              }
            } else {
              requestAnimFrame(fx.render)
            }
            
          }
  
          /* start animation */
          fx.render()
          
        }, delay || 0)
      }
      
      return this
    }
    // Get bounding box of target element
  , bbox: function() {
      return this.target.bbox()
    }
    // Add animatable attributes
  , attr: function(a, v) {
      if (typeof a == 'object') {
        for (var key in a)
          this.attr(key, a[key])
      
      } else {
        var from = this.target.attr(a)
  
        this.attrs[a] = SVG.Color.isColor(from) ?
          new SVG.Color(from).morph(v) :
        SVG.regex.unit.test(from) ?
          new SVG.Number(from).morph(v) :
          { from: from, to: v }
      }
      
      return this
    }
    // Add animatable transformations
  , transform: function(o, v) {
      if (arguments.length == 1) {
        /* parse matrix string */
        o = this.target._parseMatrix(o)
        
        /* dlete matrixstring from object */
        delete o.matrix
        
        /* store matrix values */
        for (v in o)
          this.trans[v] = { from: this.target.trans[v], to: o[v] }
        
      } else {
        /* apply transformations as object if key value arguments are given*/
        var transform = {}
        transform[o] = v
        
        this.transform(transform)
      }
      
      return this
    }
    // Add animatable styles
  , style: function(s, v) {
      if (typeof s == 'object')
        for (var key in s)
          this.style(key, s[key])
      
      else
        this.styles[s] = { from: this.target.style(s), to: v }
      
      return this
    }
    // Animatable x-axis
  , x: function(x) {
      this._x = { from: this.target.x(), to: x }
      
      return this
    }
    // Animatable y-axis
  , y: function(y) {
      this._y = { from: this.target.y(), to: y }
      
      return this
    }
    // Animatable center x-axis
  , cx: function(x) {
      this._cx = { from: this.target.cx(), to: x }
      
      return this
    }
    // Animatable center y-axis
  , cy: function(y) {
      this._cy = { from: this.target.cy(), to: y }
      
      return this
    }
    // Add animatable move
  , move: function(x, y) {
      return this.x(x).y(y)
    }
    // Add animatable center
  , center: function(x, y) {
      return this.cx(x).cy(y)
    }
    // Add animatable size
  , size: function(width, height) {
      if (this.target instanceof SVG.Text) {
        /* animate font size for Text elements */
        this.attr('font-size', width)
        
      } else {
        /* animate bbox based size for all other elements */
        var box = this.target.bbox()
  
        this._size = {
          width:  { from: box.width,  to: width  }
        , height: { from: box.height, to: height }
        }
      }
      
      return this
    }
    // Add animatable plot
  , plot: function(p) {
      this._plot = p
  
      return this
    }
    // Add animatable viewbox
  , viewbox: function(x, y, width, height) {
      if (this.target instanceof SVG.Container) {
        var box = this.target.viewbox()
        
        this._viewbox = {
          x:      { from: box.x,      to: x      }
        , y:      { from: box.y,      to: y      }
        , width:  { from: box.width,  to: width  }
        , height: { from: box.height, to: height }
        }
      }
      
      return this
    }
    // Add animateable gradient update
  , update: function(o) {
      if (this.target instanceof SVG.Stop) {
        if (o.opacity != null) this.attr('stop-opacity', o.opacity)
        if (o.color   != null) this.attr('stop-color', o.color)
        if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))
      }
  
      return this
    }
    // Add callback for each keyframe
  , during: function(during) {
      this._during = during
      
      return this
    }
    // Callback after animation
  , after: function(after) {
      this._after = after
      
      return this
    }
    // Make loopable
  , loop: function(times) {
      this._loop = times || true
  
      return this
    }
    // Stop running animation
  , stop: function() {
      /* stop current animation */
      clearTimeout(this.timeout)
      clearInterval(this.interval)
      
      /* reset storage for properties that need animation */
      this.attrs     = {}
      this.trans     = {}
      this.styles    = {}
      this.situation = {}
  
      delete this._x
      delete this._y
      delete this._cx
      delete this._cy
      delete this._size
      delete this._plot
      delete this._loop
      delete this._after
      delete this._during
      delete this._viewbox
  
      return this
    }
    // Pause running animation
  , pause: function() {
      if (this.situation.play === true) {
        this.situation.play  = false
        this.situation.pause = new Date().getTime()
      }
  
      return this
    }
    // Play running animation
  , play: function() {
      if (this.situation.play === false) {
        var pause = new Date().getTime() - this.situation.pause
        
        this.situation.finish += pause
        this.situation.start  += pause
        this.situation.play    = true
      }
  
      return this
    }
    
  })
  
  SVG.extend(SVG.Element, {
    // Get fx module or create a new one, then animate with given duration and ease
    animate: function(d, ease, delay) {
      return (this.fx || (this.fx = new SVG.FX(this))).stop().animate(d, ease, delay)
    }
    // Stop current animation; this is an alias to the fx instance
  , stop: function() {
      if (this.fx)
        this.fx.stop()
      
      return this
    }
    // Pause current animation
  , pause: function() {
      if (this.fx)
        this.fx.pause()
  
      return this
    }
    // Play paused current animation
  , play: function() {
      if (this.fx)
        this.fx.play()
  
      return this
    }
    
  })
  
  // Calculate position according to from and to
  function at(o, pos) {
    /* number recalculation (don't bother converting to SVG.Number for performance reasons) */
    return typeof o.from == 'number' ?
      o.from + (o.to - o.from) * pos :
    
    /* instance recalculation */
    o instanceof SVG.Color || o instanceof SVG.Number ? o.at(pos) :
    
    /* for all other values wait until pos has reached 1 to return the final value */
    pos < 1 ? o.from : o.to
  }
  
  // Shim layer with setTimeout fallback by Paul Irish
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.msRequestAnimationFrame     ||
            function (c) { window.setTimeout(c, 1000 / 60) }
  })()

  SVG.extend(SVG.Element, SVG.FX, {
    // Relative methods
    relative: function() {
      var b, e = this
  
      return {
        // Move over x axis
        x: function(x) {
          b = e.bbox()
  
          return e.x(b.x + (x || 0))
        }
        // Move over y axis
      , y: function(y) {
          b = e.bbox()
  
          return e.y(b.y + (y || 0))
        }
        // Move over x and y axes
      , move: function(x, y) {
          this.x(x)
          return this.y(y)
        }
      }
    }
  
  })

  ;[  'click'
    , 'dblclick'
    , 'mousedown'
    , 'mouseup'
    , 'mouseover'
    , 'mouseout'
    , 'mousemove'
    , 'mouseenter'
    , 'mouseleave' ].forEach(function(event) {
    
    /* add event to SVG.Element */
    SVG.Element.prototype[event] = function(f) {
      var self = this
      
      /* bind event to element rather than element node */
      this.node['on' + event] = typeof f == 'function' ?
        function() { return f.apply(self, arguments) } : null
      
      return this
    }
    
  })
  
  // Add event binder in the SVG namespace
  SVG.on = function(node, event, listener) {
    if (node.addEventListener)
      node.addEventListener(event, listener, false)
    else
      node.attachEvent('on' + event, listener)
  }
  
  // Add event unbinder in the SVG namespace
  SVG.off = function(node, event, listener) {
    if (node.removeEventListener)
      node.removeEventListener(event, listener, false)
    else
      node.detachEvent('on' + event, listener)
  }
  
  //
  SVG.extend(SVG.Element, {
    // Bind given event to listener
    on: function(event, listener) {
      SVG.on(this.node, event, listener)
      
      return this
    }
    // Unbind event from listener
  , off: function(event, listener) {
      SVG.off(this.node, event, listener)
      
      return this
    }
  })

  SVG.Defs = function() {
    this.constructor.call(this, SVG.create('defs'))
  }
  
  // Inherits from SVG.Container
  SVG.Defs.prototype = new SVG.Container

  SVG.G = function() {
    this.constructor.call(this, SVG.create('g'))
  }
  
  // Inherit from SVG.Container
  SVG.G.prototype = new SVG.Container
  
  //
  SVG.extend(SVG.G, {
    // Move over x-axis
    x: function(x) {
      return x == null ? this.trans.x : this.transform('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      return y == null ? this.trans.y : this.transform('y', y)
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
    }
    
  })
  
  //
  SVG.extend(SVG.Container, {
    // Create a group element
    group: function() {
      return this.put(new SVG.G)
    }
    
  })

  SVG.extend(SVG.Element, {
    // Get all siblings, including myself
    siblings: function() {
      return this.parent.children()
    }
    // Get the curent position siblings
  , position: function() {
      return this.parent.index(this)
    }
    // Get the next element (will return null if there is none)
  , next: function() {
      return this.siblings()[this.position() + 1]
    }
    // Get the next element (will return null if there is none)
  , previous: function() {
      return this.siblings()[this.position() - 1]
    }
    // Send given element one step forward
  , forward: function() {
      var i = this.position()
      return this.parent.removeElement(this).put(this, i + 1)
    }
    // Send given element one step backward
  , backward: function() {
      var i = this.position()
      
      if (i > 0)
        this.parent.removeElement(this).add(this, i - 1)
  
      return this
    }
    // Send given element all the way to the front
  , front: function() {
      return this.parent.removeElement(this).put(this)
    }
    // Send given element all the way to the back
  , back: function() {
      if (this.position() > 0)
        this.parent.removeElement(this).add(this, 0)
      
      return this
    }
    // Inserts a given element before the targeted element
  , before: function(element) {
      element.remove()
  
      var i = this.position()
      
      this.parent.add(element, i)
  
      return this
    }
    // Insters a given element after the targeted element
  , after: function(element) {
      element.remove()
      
      var i = this.position()
      
      this.parent.add(element, i + 1)
  
      return this
    }
  
  })

  SVG.Mask = function() {
    this.constructor.call(this, SVG.create('mask'))
  
    /* keep references to masked elements */
    this.targets = []
  }
  
  // Inherit from SVG.Container
  SVG.Mask.prototype = new SVG.Container
  
  //
  SVG.extend(SVG.Mask, {
    // Unmask all masked elements and remove itself
    remove: function() {
      /* unmask all targets */
      for (var i = this.targets.length - 1; i >= 0; i--)
        if (this.targets[i])
          this.targets[i].unmask()
      delete this.targets
  
      /* remove mask from parent */
      this.parent.removeElement(this)
      
      return this
    }
  })
  
  //
  SVG.extend(SVG.Element, {
    // Distribute mask to svg element
    maskWith: function(element) {
      /* use given mask or create a new one */
      this.masker = element instanceof SVG.Mask ? element : this.parent.mask().add(element)
  
      /* store reverence on self in mask */
      this.masker.targets.push(this)
      
      /* apply mask */
      return this.attr('mask', 'url("#' + this.masker.attr('id') + '")')
    }
    // Unmask element
  , unmask: function() {
      delete this.masker
      return this.attr('mask', null)
    }
    
  })
  
  //
  SVG.extend(SVG.Container, {
    // Create masking element
    mask: function() {
      return this.defs().put(new SVG.Mask)
    }
    
  })

  SVG.Clip = function() {
    this.constructor.call(this, SVG.create('clipPath'))
  
    /* keep references to clipped elements */
    this.targets = []
  }
  
  // Inherit from SVG.Container
  SVG.Clip.prototype = new SVG.Container
  
  //
  SVG.extend(SVG.Clip, {
    // Unclip all clipped elements and remove itself
    remove: function() {
      /* unclip all targets */
      for (var i = this.targets.length - 1; i >= 0; i--)
        if (this.targets[i])
          this.targets[i].unclip()
      delete this.targets
  
      /* remove clipPath from parent */
      this.parent.removeElement(this)
      
      return this
    }
  })
  
  //
  SVG.extend(SVG.Element, {
    // Distribute clipPath to svg element
    clipWith: function(element) {
      /* use given clip or create a new one */
      this.clipper = element instanceof SVG.Clip ? element : this.parent.clip().add(element)
  
      /* store reverence on self in mask */
      this.clipper.targets.push(this)
      
      /* apply mask */
      return this.attr('clip-path', 'url("#' + this.clipper.attr('id') + '")')
    }
    // Unclip element
  , unclip: function() {
      delete this.clipper
      return this.attr('clip-path', null)
    }
    
  })
  
  //
  SVG.extend(SVG.Container, {
    // Create clipping element
    clip: function() {
      return this.defs().put(new SVG.Clip)
    }
  
  })

  SVG.Gradient = function(type) {
    this.constructor.call(this, SVG.create(type + 'Gradient'))
    
    /* store type */
    this.type = type
  }
  
  // Inherit from SVG.Container
  SVG.Gradient.prototype = new SVG.Container
  
  //
  SVG.extend(SVG.Gradient, {
    // From position
    from: function(x, y) {
      return this.type == 'radial' ?
        this.attr({ fx: new SVG.Number(x), fy: new SVG.Number(y) }) :
        this.attr({ x1: new SVG.Number(x), y1: new SVG.Number(y) })
    }
    // To position
  , to: function(x, y) {
      return this.type == 'radial' ?
        this.attr({ cx: new SVG.Number(x), cy: new SVG.Number(y) }) :
        this.attr({ x2: new SVG.Number(x), y2: new SVG.Number(y) })
    }
    // Radius for radial gradient
  , radius: function(r) {
      return this.type == 'radial' ?
        this.attr({ r: new SVG.Number(r) }) :
        this
    }
    // Add a color stop
  , at: function(stop) {
      return this.put(new SVG.Stop(stop))
    }
    // Update gradient
  , update: function(block) {
      /* remove all stops */
      this.clear()
      
      /* invoke passed block */
      block(this)
      
      return this
    }
    // Return the fill id
  , fill: function() {
      return 'url(#' + this.attr('id') + ')'
    }
    // Alias string convertion to fill
  , toString: function() {
      return this.fill()
    }
    
  })
  
  //
  SVG.extend(SVG.Defs, {
    // define gradient
    gradient: function(type, block) {
      var element = this.put(new SVG.Gradient(type))
      
      /* invoke passed block */
      block(element)
      
      return element
    }
    
  })
  
  //
  SVG.extend(SVG.Container, {
    // Create gradient element in defs
    gradient: function(type, block) {
      return this.defs().gradient(type, block)
    }
    
  })
  
  
  SVG.Stop = function(stop) {
    this.constructor.call(this, SVG.create('stop'))
    
    /* immediatelly build stop */
    this.update(stop)
  }
  
  // Inherit from SVG.Element
  SVG.Stop.prototype = new SVG.Element
  
  //
  SVG.extend(SVG.Stop, {
    // add color stops
    update: function(o) {
      /* set attributes */
      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
      if (o.color   != null) this.attr('stop-color', o.color)
      if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))
  
      return this
    }
    
  })
  


  SVG.Doc = function(element) {
    /* ensure the presence of a html element */
    this.parent = typeof element == 'string' ?
      document.getElementById(element) :
      element
    
    /* If the target is an svg element, use that element as the main wrapper.
       This allows svg.js to work with svg documents as well. */
    this.constructor
      .call(this, this.parent.nodeName == 'svg' ? this.parent : SVG.create('svg'))
    
    /* set svg element attributes */
    this
      .attr({ xmlns: SVG.ns, version: '1.1', width: '100%', height: '100%' })
      .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
    
    /* create the <defs> node */
    this._defs = new SVG.Defs
    this._defs.parent = this
    this.node.appendChild(this._defs.node)
  
    /* turno of sub pixel offset by default */
    this.doSubPixelOffsetFix = false
    
    /* ensure correct rendering */
    if (this.parent.nodeName != 'svg')
      this.stage()
  }
  
  // Inherits from SVG.Container
  SVG.Doc.prototype = new SVG.Container
  
  //
  SVG.extend(SVG.Doc, {
    // Hack for safari preventing text to be rendered in one line.
    // Basically it sets the position of the svg node to absolute
    // when the dom is loaded, and resets it to relative a few milliseconds later.
    // It also handles sub-pixel offset rendering properly.
    stage: function() {
      var check
        , element = this
        , wrapper = document.createElement('div')
  
      /* set temporary wrapper to position relative */
      wrapper.style.cssText = 'position:relative;height:100%;'
  
      /* put element into wrapper */
      element.parent.appendChild(wrapper)
      wrapper.appendChild(element.node)
  
      /* check for dom:ready */
      check = function() {
        if (document.readyState === 'complete') {
          element.style('position:absolute;')
          setTimeout(function() {
            /* set position back to relative */
            element.style('position:relative;overflow:hidden;')
  
            /* remove temporary wrapper */
            element.parent.removeChild(element.node.parentNode)
            element.node.parentNode.removeChild(element.node)
            element.parent.appendChild(element.node)
  
            /* after wrapping is done, fix sub-pixel offset */
            element.subPixelOffsetFix()
            
            /* make sure sub-pixel offset is fixed every time the window is resized */
            SVG.on(window, 'resize', function() {
              element.subPixelOffsetFix()
            })
            
          }, 5)
        } else {
          setTimeout(check, 10)
        }
      }
  
      check()
  
      return this
    }
  
    // Creates and returns defs element
  , defs: function() {
      return this._defs
    }
  
    // Fix for possible sub-pixel offset. See:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
  , subPixelOffsetFix: function() {
      if (this.doSubPixelOffsetFix) {
        var pos = this.node.getScreenCTM()
        
        if (pos)
          this
            .style('left', (-pos.e % 1) + 'px')
            .style('top',  (-pos.f % 1) + 'px')
      }
      
      return this
    }
  
  , fixSubPixelOffset: function() {
      this.doSubPixelOffsetFix = true
  
      return this
    }
    
  })

  SVG.Shape = function(element) {
    this.constructor.call(this, element)
  }
  
  // Inherit from SVG.Element
  SVG.Shape.prototype = new SVG.Element

  SVG.Use = function() {
    this.constructor.call(this, SVG.create('use'))
  }
  
  // Inherit from SVG.Shape
  SVG.Use.prototype = new SVG.Shape
  
  //
  SVG.extend(SVG.Use, {
    // Use element as a reference
    element: function(element) {
      /* store target element */
      this.target = element
  
      /* set lined element */
      return this.attr('href', '#' + element, SVG.xlink)
    }
    
  })
  
  //
  SVG.extend(SVG.Container, {
    // Create a use element
    use: function(element) {
      return this.put(new SVG.Use).element(element)
    }
  
  })

  SVG.Rect = function() {
    this.constructor.call(this, SVG.create('rect'))
  }
  
  // Inherit from SVG.Shape
  SVG.Rect.prototype = new SVG.Shape
  
  //
  SVG.extend(SVG.Container, {
    // Create a rect element
    rect: function(width, height) {
      return this.put(new SVG.Rect().size(width, height))
    }
  
  })

  SVG.Ellipse = function() {
    this.constructor.call(this, SVG.create('ellipse'))
  }
  
  // Inherit from SVG.Shape
  SVG.Ellipse.prototype = new SVG.Shape
  
  //
  SVG.extend(SVG.Ellipse, {
    // Move over x-axis
    x: function(x) {
      return x == null ? this.cx() - this.attr('rx') : this.cx(x + this.attr('rx'))
    }
    // Move over y-axis
  , y: function(y) {
      return y == null ? this.cy() - this.attr('ry') : this.cy(y + this.attr('ry'))
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.attr('cx') : this.attr('cx', new SVG.Number(x).divide(this.trans.scaleX))
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.attr('cy') : this.attr('cy', new SVG.Number(y).divide(this.trans.scaleY))
    }
    // Set width of element
  , width: function(width) {
      return width == null ? this.attr('rx') * 2 : this.attr('rx', new SVG.Number(width).divide(2))
    }
    // Set height of element
  , height: function(height) {
      return height == null ? this.attr('ry') * 2 : this.attr('ry', new SVG.Number(height).divide(2))
    }
    // Custom size function
  , size: function(width, height) {
      var p = this._proportionalSize(width, height)
  
      return this.attr({
        rx: new SVG.Number(p.width).divide(2)
      , ry: new SVG.Number(p.height).divide(2)
      })
    }
    
  })
  
  //
  SVG.extend(SVG.Container, {
    // Create circle element, based on ellipse
    circle: function(size) {
      return this.ellipse(size, size)
    }
    // Create an ellipse
  , ellipse: function(width, height) {
      return this.put(new SVG.Ellipse).size(width, height).move(0, 0)
    }
    
  })
  
  // Usage:
  
  //     draw.ellipse(200, 100)

  SVG.Line = function() {
    this.constructor.call(this, SVG.create('line'))
  }
  
  // Inherit from SVG.Shape
  SVG.Line.prototype = new SVG.Shape
  
  // Add required methods
  SVG.extend(SVG.Line, {
    // Move over x-axis
    x: function(x) {
      var b = this.bbox()
      
      return x == null ? b.x : this.attr({
        x1: this.attr('x1') - b.x + x
      , x2: this.attr('x2') - b.x + x
      })
    }
    // Move over y-axis
  , y: function(y) {
      var b = this.bbox()
      
      return y == null ? b.y : this.attr({
        y1: this.attr('y1') - b.y + y
      , y2: this.attr('y2') - b.y + y
      })
    }
    // Move by center over x-axis
  , cx: function(x) {
      var half = this.bbox().width / 2
      return x == null ? this.x() + half : this.x(x - half)
    }
    // Move by center over y-axis
  , cy: function(y) {
      var half = this.bbox().height / 2
      return y == null ? this.y() + half : this.y(y - half)
    }
    // Set width of element
  , width: function(width) {
      var b = this.bbox()
  
      return width == null ? b.width : this.attr(this.attr('x1') < this.attr('x2') ? 'x2' : 'x1', b.x + width)
    }
    // Set height of element
  , height: function(height) {
      var b = this.bbox()
  
      return height == null ? b.height : this.attr(this.attr('y1') < this.attr('y2') ? 'y2' : 'y1', b.y + height)
    }
    // Set line size by width and height
  , size: function(width, height) {
      var p = this._proportionalSize(width, height)
  
      return this.width(p.width).height(p.height)
    }
    // Set path data
  , plot: function(x1, y1, x2, y2) {
      return this.attr({
        x1: x1
      , y1: y1
      , x2: x2
      , y2: y2
      })
    }
    
  })
  
  //
  SVG.extend(SVG.Container, {
    // Create a line element
    line: function(x1, y1, x2, y2) {
      return this.put(new SVG.Line().plot(x1, y1, x2, y2))
    }
    
  })


  SVG.Polyline = function() {
    this.constructor.call(this, SVG.create('polyline'))
  }
  
  // Inherit from SVG.Shape
  SVG.Polyline.prototype = new SVG.Shape
  
  SVG.Polygon = function() {
    this.constructor.call(this, SVG.create('polygon'))
  }
  
  // Inherit from SVG.Shape
  SVG.Polygon.prototype = new SVG.Shape
  
  // Add polygon-specific functions
  SVG.extend(SVG.Polyline, SVG.Polygon, {
    // Define morphable array
    morphArray:  SVG.PointArray
    // Plot new path
  , plot: function(p) {
      return this.attr('points', (this.array = new SVG.PointArray(p, [[0,0]])))
    }
    // Move by left top corner
  , move: function(x, y) {
      return this.attr('points', this.array.move(x, y))
    }
    // Move by left top corner over x-axis
  , x: function(x) {
      return x == null ? this.bbox().x : this.move(x, this.bbox().y)
    }
    // Move by left top corner over y-axis
  , y: function(y) {
      return y == null ? this.bbox().y : this.move(this.bbox().x, y)
    }
    // Set width of element
  , width: function(width) {
      var b = this.bbox()
  
      return width == null ? b.width : this.size(width, b.height)
    }
    // Set height of element
  , height: function(height) {
      var b = this.bbox()
  
      return height == null ? b.height : this.size(b.width, height) 
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = this._proportionalSize(width, height)
  
      return this.attr('points', this.array.size(p.width, p.height))
    }
  
  })
  
  //
  SVG.extend(SVG.Container, {
    // Create a wrapped polyline element
    polyline: function(p) {
      return this.put(new SVG.Polyline).plot(p)
    }
    // Create a wrapped polygon element
  , polygon: function(p) {
      return this.put(new SVG.Polygon).plot(p)
    }
  
  })

  SVG.Path = function() {
    this.constructor.call(this, SVG.create('path'))
  }
  
  // Inherit from SVG.Shape
  SVG.Path.prototype = new SVG.Shape
  
  SVG.extend(SVG.Path, {
    // Plot new poly points
    plot: function(p) {
      return this.attr('d', (this.array = new SVG.PathArray(p, [{ type:'M',x:0,y:0 }])))
    }
    // Move by left top corner
  , move: function(x, y) {
      return this.attr('d', this.array.move(x, y))
    }
    // Move by left top corner over x-axis
  , x: function(x) {
      return x == null ? this.bbox().x : this.move(x, this.bbox().y)
    }
    // Move by left top corner over y-axis
  , y: function(y) {
      return y == null ? this.bbox().y : this.move(this.bbox().x, y)
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = this._proportionalSize(width, height)
      
      return this.attr('d', this.array.size(p.width, p.height))
    }
    // Set width of element
  , width: function(width) {
      return width == null ? this.bbox().width : this.size(width, this.bbox().height)
    }
    // Set height of element
  , height: function(height) {
      return height == null ? this.bbox().height : this.size(this.bbox().width, height)
    }
  
  })
  
  //
  SVG.extend(SVG.Container, {
    // Create a wrapped path element
    path: function(d) {
      return this.put(new SVG.Path).plot(d)
    }
  
  })

  SVG.Image = function() {
    this.constructor.call(this, SVG.create('image'))
  }
  
  // Inherit from SVG.Element
  SVG.Image.prototype = new SVG.Shape
  
  //
  SVG.extend(SVG.Image, {
    // (re)load image
    load: function(url) {
      return (url ? this.attr('href', (this.src = url), SVG.xlink) : this)
    }
  })
  
  //
  SVG.extend(SVG.Container, {
    // Create image element, load image and set its size
    image: function(source, width, height) {
      width = width != null ? width : 100
      return this.put(new SVG.Image().load(source).size(width, height != null ? height : width))
    }
  
  })

  var _styleAttr = ('size family weight stretch variant style').split(' ')
  
  SVG.Text = function() {
    this.constructor.call(this, SVG.create('text'))
    
    /* define default style */
    this.styles = {
      'font-size':    16
    , 'font-family':  'Helvetica, Arial, sans-serif'
    , 'text-anchor':  'start'
    }
    
    this._leading = new SVG.Number('1.2em')
    this._rebuild = true
  }
  
  // Inherit from SVG.Element
  SVG.Text.prototype = new SVG.Shape
  
  //
  SVG.extend(SVG.Text, {
    // Move over x-axis
    x: function(x, a) {
      /* act as getter */
      if (x == null)
        return a ? this.attr('x') : this.bbox().x
      
      /* set x taking anchor in mind */
      if (!a) {
        a = this.style('text-anchor')
        x = a == 'start' ? x : a == 'end' ? x + this.bbox().width : x + this.bbox().width / 2
      }
  
      /* move lines as well if no textPath si present */
      if (!this.textPath)
        this.lines.each(function() { if (this.newLined) this.x(x) })
  
      return this.attr('x', x)
    }
    // Move center over x-axis
  , cx: function(x, a) {
      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
    }
    // Move center over y-axis
  , cy: function(y, a) {
      return y == null ? this.bbox().cy : this.y(a ? y : y - this.bbox().height / 2)
    }
    // Move element to given x and y values
  , move: function(x, y, a) {
      return this.x(x, a).y(y)
    }
    // Move element by its center
  , center: function(x, y, a) {
      return this.cx(x, a).cy(y, a)
    }
    // Set the text content
  , text: function(text) {
      /* act as getter */
      if (text == null)
        return this.content
      
      /* remove existing lines */
      this.clear()
      
      if (typeof text === 'function') {
        this._rebuild = false
  
        text.call(this, this)
  
      } else {
        this._rebuild = true
  
        /* make sure text is not blank */
        text = SVG.regex.isBlank.test(text) ? 'text' : text
        
        var i, il
          , lines = text.split('\n')
        
        /* build new lines */
        for (i = 0, il = lines.length; i < il; i++)
          this.tspan(lines[i]).newLine()
  
        this.rebuild()
      }
      
      return this
    }
    // Create a tspan
  , tspan: function(text) {
      var node  = this.textPath ? this.textPath.node : this.node
        , tspan = new SVG.TSpan().text(text)
        , style = this.style()
      
      /* add new tspan */
      node.appendChild(tspan.node)
      this.lines.add(tspan)
  
      /* add style if any */
      if (!SVG.regex.isBlank.test(style))
        tspan.style(style)
  
      /* store content */
      this.content += text
  
      /* store text parent */
      tspan.parent = this
  
      return tspan
    }
    // Set font size
  , size: function(size) {
      return this.attr('font-size', size)
    }
    // Set / get leading
  , leading: function(value) {
      /* act as getter */
      if (value == null)
        return this._leading
      
      /* act as setter */
      value = new SVG.Number(value)
      this._leading = value
      
      /* apply leading */
      this.lines.each(function() {
        if (this.newLined)
          this.attr('dy', value)
      })
  
      return this
    }
    // rebuild appearance type
  , rebuild: function() {
      var self = this
  
      /* define position of all lines */
      if (this._rebuild) {
        this.lines.attr({
          x:      this.attr('x')
        , dy:     this._leading
        , style:  this.style()
        })
      }
  
      return this
    }
    // Clear all lines
  , clear: function() {
      var node = this.textPath ? this.textPath.node : this.node
  
      /* remove existing child nodes */
      while (node.hasChildNodes())
        node.removeChild(node.lastChild)
      
      /* refresh lines */
      delete this.lines
      this.lines = new SVG.Set
      
      /* initialize content */
      this.content = ''
  
      return this
    }
    
  })
  
  //
  SVG.extend(SVG.Container, {
    // Create text element
    text: function(text) {
      return this.put(new SVG.Text).text(text)
    }
    
  })
  
  // tspan class
  SVG.TSpan = function() {
    this.constructor.call(this, SVG.create('tspan'))
  }
  
  // Inherit from SVG.Shape
  SVG.TSpan.prototype = new SVG.Shape
  
  // Include the container object
  SVG.extend(SVG.TSpan, {
    // Set text content
    text: function(text) {
      this.node.appendChild(document.createTextNode(text))
      
      return this
    }
    // Shortcut dx
  , dx: function(dx) {
      return this.attr('dx', dx)
    }
    // Shortcut dy
  , dy: function(dy) {
      return this.attr('dy', dy)
    }
    // Create new line
  , newLine: function() {
      this.newLined = true
      this.parent.content += '\n'
      this.dy(this.parent._leading)
      return this.attr('x', this.parent.x())
    }
  
  })


  SVG.TextPath = function() {
    this.constructor.call(this, SVG.create('textPath'))
  }
  
  // Inherit from SVG.Element
  SVG.TextPath.prototype = new SVG.Element
  
  //
  SVG.extend(SVG.Text, {
    // Create path for text to run on
    path: function(d) {
      /* create textPath element */
      this.textPath = new SVG.TextPath
  
      /* move lines to textpath */
      while(this.node.hasChildNodes())
        this.textPath.node.appendChild(this.node.firstChild)
  
      /* add textPath element as child node */
      this.node.appendChild(this.textPath.node)
  
      /* create path in defs */
      this.track = this.doc().defs().path(d, true)
  
      /* create circular reference */
      this.textPath.parent = this
  
      /* link textPath to path and add content */
      this.textPath.attr('href', '#' + this.track, SVG.xlink)
  
      return this
    }
    // Plot path if any
  , plot: function(d) {
      if (this.track) this.track.plot(d)
      return this
    }
  
  })

  SVG.Nested = function() {
    this.constructor.call(this, SVG.create('svg'))
    
    this.style('overflow', 'visible')
  }
  
  // Inherit from SVG.Container
  SVG.Nested.prototype = new SVG.Container
  
  //
  SVG.extend(SVG.Container, {
    // Create nested svg document
    nested: function() {
      return this.put(new SVG.Nested)
    }
    
  })

  SVG.A = function() {
    this.constructor.call(this, SVG.create('a'))
  }
  
  // Inherit from SVG.Parent
  SVG.A.prototype = new SVG.Container
  
  //
  SVG.extend(SVG.A, {
    // Link url
    to: function(url) {
      return this.attr('href', url, SVG.xlink)
    }
    // Link show attribute
  , show: function(target) {
      return this.attr('show', target, SVG.xlink)
    }
    // Link target attribute
  , target: function(target) {
      return this.attr('target', target)
    }
  
  })
  
  //
  SVG.extend(SVG.Container, {
    // Create a hyperlink element
    link: function(url) {
      return this.put(new SVG.A).to(url)
    }
    
  })
  
  //
  SVG.extend(SVG.Element, {
    // Create a hyperlink element
    linkTo: function(url) {
      var link = new SVG.A
  
      if (typeof url == 'function')
        url.call(link, link)
      else
        link.to(url)
  
      return this.parent.put(link).put(this)
    }
    
  })

  SVG._stroke = ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
  SVG._fill   = ['color', 'opacity', 'rule']
  
  
  // Prepend correct color prefix
  var _colorPrefix = function(type, attr) {
    return attr == 'color' ? type : type + '-' + attr
  }
  
  /* Add sugar for fill and stroke */
  ;['fill', 'stroke'].forEach(function(method) {
    var extension = {}
    
    extension[method] = function(o) {
      var indexOf
      
      if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))
        this.attr(method, o)
  
      else
        /* set all attributes from _fillAttr and _strokeAttr list */
        for (index = SVG['_' + method].length - 1; index >= 0; index--)
          if (o[SVG['_' + method][index]] != null)
            this.attr(_colorPrefix(method, SVG['_' + method][index]), o[SVG['_' + method][index]])
      
      return this
    }
    
    SVG.extend(SVG.Element, SVG.FX, extension)
    
  })
  
  SVG.extend(SVG.Element, SVG.FX, {
    // Rotation
    rotate: function(deg, x, y) {
      return this.transform({
        rotation: deg || 0
      , cx: x
      , cy: y
      })
    }
    // Skew
  , skew: function(x, y) {
      return this.transform({
        skewX: x || 0
      , skewY: y || 0
      })
    }
    // Scale
  , scale: function(x, y) {
      return this.transform({
        scaleX: x
      , scaleY: y == null ? x : y
      })
    }
    // Translate
  , translate: function(x, y) {
      return this.transform({
        x: x
      , y: y
      })
    }
    // Matrix
  , matrix: function(m) {
      return this.transform({ matrix: m })
    }
    // Opacity
  , opacity: function(value) {
      return this.attr('opacity', value)
    }
  
  })
  
  //
  SVG.extend(SVG.Rect, SVG.Ellipse, {
    // Add x and y radius
    radius: function(x, y) {
      return this.attr({ rx: x, ry: y || x })
    }
  
  })
  
  
  if (SVG.Text) {
    SVG.extend(SVG.Text, SVG.FX, {
      // Set font 
      font: function(o) {
        for (var key in o)
          key == 'anchor' ?
            this.attr('text-anchor', o[key]) :
          _styleAttr.indexOf(key) > -1 ?
            this.attr('font-'+ key, o[key]) :
            this.attr(key, o[key])
        
        return this
      }
      
    })
  }
  


  SVG.Set = function() {
    /* set initial state */
    this.clear()
  }
  
  // Set FX class
  SVG.SetFX = function(set) {
    /* store reference to set */
    this.set = set
  }
  
  //
  SVG.extend(SVG.Set, {
    // Add element to set
    add: function() {
      var i, il, elements = [].slice.call(arguments)
  
      for (i = 0, il = elements.length; i < il; i++)
        this.members.push(elements[i])
      
      return this
    }
    // Remove element from set
  , remove: function(element) {
      var i = this.index(element)
      
      /* remove given child */
      if (i > -1)
        this.members.splice(i, 1)
  
      return this
    }
    // Iterate over all members
  , each: function(block) {
      for (var i = 0, il = this.members.length; i < il; i++)
        block.apply(this.members[i], [i, this.members])
  
      return this
    }
    // Restore to defaults
  , clear: function() {
      /* initialize store */
      this.members = []
  
      return this
    }
    // Checks if a given element is present in set
  , has: function(element) {
      return this.index(element) >= 0
    }
    // retuns index of given element in set
  , index: function(element) {
      return this.members.indexOf(element)
    }
    // Get member at given index
  , get: function(i) {
      return this.members[i]
    }
    // Default value
  , valueOf: function() {
      return this.members
    }
    // Get the bounding box of all members included or empty box if set has no items
  , bbox: function(){
      var box = new SVG.BBox()
  
      /* return an empty box of there are no members */
      if (this.members.length == 0)
        return box
  
      /* get the first rbox and update the target bbox */
      var rbox = this.members[0].rbox()
      box.x      = rbox.x
      box.y      = rbox.y
      box.width  = rbox.width
      box.height = rbox.height
  
      this.each(function() {
        /* user rbox for correct position and visual representation */
        box = box.merge(this.rbox())
      })
  
      return box
    }
  
  })
  
  
  
  // Alias methods
  SVG.Set.inherit = function() {
    var m
      , methods = []
    
    /* gather shape methods */
    for(var m in SVG.Shape.prototype)
      if (typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')
        methods.push(m)
  
    /* apply shape aliasses */
    methods.forEach(function(method) {
      SVG.Set.prototype[method] = function() {
        for (var i = 0, il = this.members.length; i < il; i++)
          if (this.members[i] && typeof this.members[i][method] == 'function')
            this.members[i][method].apply(this.members[i], arguments)
  
        return method == 'animate' ? (this.fx || (this.fx = new SVG.SetFX(this))) : this
      }
    })
  
    /* clear methods for the next round */
    methods = []
  
    /* gather fx methods */
    for(var m in SVG.FX.prototype)
      if (typeof SVG.FX.prototype[m] == 'function' && typeof SVG.SetFX.prototype[m] != 'function')
        methods.push(m)
  
    /* apply fx aliasses */
    methods.forEach(function(method) {
      SVG.SetFX.prototype[method] = function() {
        for (var i = 0, il = this.set.members.length; i < il; i++)
          this.set.members[i].fx[method].apply(this.set.members[i].fx, arguments)
  
        return this
      }
    })
  }
  
  //
  SVG.extend(SVG.Container, {
    // Create a new set
    set: function() {
      return new SVG.Set
    }
  
  })
  
  
  


  SVG.extend(SVG.Element, {
  	// Store data values on svg nodes
    data: function(a, v, r) {
    	if (typeof a == 'object') {
    		for (v in a)
    			this.data(v, a[v])
  
      } else if (arguments.length < 2) {
        try {
          return JSON.parse(this.attr('data-' + a))
        } catch(e) {
          return this.attr('data-' + a)
        }
        
      } else {
        this.attr(
          'data-' + a
        , v === null ?
            null :
          r === true || typeof v === 'string' || typeof v === 'number' ?
            v :
            JSON.stringify(v)
        )
      }
      
      return this
    }
  })

  SVG.extend(SVG.Element, {
    // Remember arbitrary data
    remember: function(k, v) {
      /* remember every item in an object individually */
      if (typeof arguments[0] == 'object')
        for (var v in k)
          this.remember(v, k[v])
  
      /* retrieve memory */
      else if (arguments.length == 1)
        return this.memory()[k]
  
      /* store memory */
      else
        this.memory()[k] = v
  
      return this
    }
  
    // Erase a given memory
  , forget: function() {
      if (arguments.length == 0)
        this._memory = {}
      else
        for (var i = arguments.length - 1; i >= 0; i--)
          delete this.memory()[arguments[i]]
  
      return this
    }
  
    // Initialize or return local memory object
  , memory: function() {
      return this._memory || (this._memory = {})
    }
  
  })

  if (typeof define === 'function' && define.amd)
    define(function() { return SVG })
  else if (typeof exports !== 'undefined')
    exports.SVG = SVG

}).call(this);

});
require.main("wout-svg.js", "dist/svg.js")
require.register("openautomation/lib/microplate.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var events = require("component-events");
var Emitter = require("component-emitter");

/**
 * Expose `Microplate`.
 */

module.exports = Microplate;

/**
 * Radius of well.
 */

Microplate.prototype.wellRadius = null;

/**
 * Microplate dimensions.
 */

Microplate.prototype.bounds = null;

/**
 * Outer padding on microplate.
 */

Microplate.prototype.padding = null;

/**
 * Instantiate a new `Microplate` sprite.
 */

function Microplate(drawing, opts) {
  opts = opts || {};
  this.parent = drawing;

  this.opts = opts; // { rows: 6, columns: 3 };
  this.rows = opts.rows || 8;
  this.columns = opts.columns || 12;
  // Hard-Shell 96-well Skirted Bio-Rad plate.
  // in millimeters
  this.bounds = { width: millimetersToPixels(127.76), height: millimetersToPixels(85.48) };
  this.padding = { top: millimetersToPixels(11.35 - 4.5), left: millimetersToPixels(14.45 - 4.5) };
  // center-to-center spacing of wells is 9mm
  // XXX: there is a border there to account for too.
  this.wellRadius = millimetersToPixels(9);

  this.draw();
  this.bind();
}

/**
 * Mixin `Emitter`.
 */

Emitter(Microplate.prototype);

/**
 * Draw.
 */

Microplate.prototype.draw = function(){
  // draw group
  var group = this.group = this.parent.group();

  // draw rectangle
  var rect = this.rect = this.parent.rect(100, 100);
  rect.radius(10);
  rect.fill({ opacity: 0 });
  rect.stroke({ width: 2 });
  group.add(rect);

  // draw wells
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.columns; j++) {
      this.drawWell(
        this.padding.left + (j * (this.wellRadius + 1)),
        this.padding.top + (i * (this.wellRadius + 1))
      );
    }
  }

  this.size(this.bounds.width, this.bounds.height);
};

/**
 * Draw well.
 */

Microplate.prototype.drawWell = function(x, y){
  var circle = this.parent.circle(this.wellRadius);
  circle.fill({ opacity: 0 });
  circle.stroke({ width: 1 });
  circle.move(x, y);
  this.group.add(circle);
};

/**
 * Bind event listeners.
 */

Microplate.prototype.bind = function(){
  //this.events = events(this.rect, this);
  //this.events.bind('click');
  this.group.click(this.onclick.bind(this));
};

/**
 * Move to position.
 */

Microplate.prototype.move = function(x, y){
  this.group.move(x, y);
};

/**
 * Resize.
 */

Microplate.prototype.size = function(w, h){
  // XXX: should do sizing from group somehow.
  this.rect.size(w, h);
};

/**
 * Click handler.
 */

Microplate.prototype.onclick = function(e){
  this.emit('visit', e);
};

/**
 * Millimeter to pixel conversion.
 *
 * XXX: need to think about more.
 */

var mmRatio = 72/25.4;

function millimetersToPixels(mm) {
  // 1 mm = 72/25.4 = 2.8346
  return mm * mmRatio;
}
});
require.register("openautomation/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var getUserMedia = require("juliangruber-get-user-media");
var canvasPosition = require("brighthas-window2canvas");
var transformBounds = require("intron-transform-bounds");
var events = require("component-event");
var agent = require("visionmedia-superagent");
var SVG = require("wout-svg.js").SVG;
var drawing = SVG('sprites').fixSubPixelOffset();

/**
 * Lab equipment.
 */

var Microplate = require("./lib/microplate");

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
  microplate.on('visit', function(){
    // XXX: somehow get position from microplate.
    sendMove({ x: 1200, y: 3500 });
  });
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
});















