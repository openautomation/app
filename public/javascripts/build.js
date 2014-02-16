
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
 * Registered aliases.
 */

require.aliases = {};

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
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
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

  for (var i = 0; i < path.length; ++i) {
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
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

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
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
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

var query = require('query');

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
var matches = require('matches-selector')

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

var closest = require('closest')
  , event = require('event');

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

var events = require('event');
var delegate = require('delegate');

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

var Emitter = require('emitter');
var reduce = require('reduce');

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
require.register("wout-svg.js/dist/svg.js", function(exports, require, module){
/* svg.js 1.0.0-rc.5 - svg inventor regex default color array pointarray patharray number viewbox bbox rbox element parent container fx relative event defs group arrange mask clip gradient pattern doc shape use rect ellipse line poly path image text textpath nested hyperlink sugar set data memory loader - svgjs.com/license */
;(function() {

  this.SVG = function(element) {
    if (SVG.supported) {
      element = new SVG.Doc(element)
  
      if (!SVG.parser)
        SVG.prepare(element)
  
      return element
    }
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
  SVG.prepare = function(element) {
    /* select document body and create invisible svg element */
    var body = document.getElementsByTagName('body')[0]
      , draw = (body ? new SVG.Doc(body) : element.nested()).size(2, 2)
      , path = SVG.create('path')
  
    /* insert parsers */
    draw.node.appendChild(path)
  
    /* create parser object */
    SVG.parser = {
      body: body || element.parent
    , draw: draw.style('opacity:0;position:fixed;left:100%;top:100%;overflow:hidden')
    , poly: draw.polyline().node
    , path: path
    }
  }
  
  // svg support test
  SVG.supported = (function() {
    return !! document.createElementNS &&
           !! document.createElementNS(SVG.ns,'svg').createSVGRect
  })()
  
  if (!SVG.supported) return false

  SVG.invent = function(config) {
  	/* create element initializer */
  	var initializer = typeof config.create == 'function' ?
  		config.create :
  		function() {
  			this.constructor.call(this, SVG.create(config.create))
  		}
  
  	/* inherit prototype */
  	if (config.inherit)
  		initializer.prototype = new config.inherit
  
  	/* extend with methods */
  	if (config.extend)
  		SVG.extend(initializer, config.extend)
  
  	/* attach construct method to parent */
  	if (config.construct)
  		SVG.extend(config.parent || SVG.Container, config.construct)
  
  	return initializer
  }

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
    
    /* test for blank string */
  , isBlank:      /^(\s+)?$/
    
    /* test for numeric string */
  , isNumber:     /^-?[\d\.]+$/
  
    /* test for percent value */
  , isPercent:    /^-?[\d\.]+%$/
  
    /* test for image url */
  , isImage:      /\.(jpg|jpeg|png|gif)(\?[^=]+.*)?/i
    
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
      /* text */
    , 'font-size':        16
    , 'font-family':      'Helvetica, Arial, sans-serif'
    , 'text-anchor':      'start'
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
      return arrayToString(this.value)
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
        for (var l, i = this.value.length - 1; i >= 0; i--) {
          l = this.value[i][0]
  
          if (l == 'M' || l == 'L' || l == 'T')  {
            this.value[i][1] += x
            this.value[i][2] += y
  
          } else if (l == 'H')  {
            this.value[i][1] += x
  
          } else if (l == 'V')  {
            this.value[i][1] += y
  
          } else if (l == 'C' || l == 'S' || l == 'Q')  {
            this.value[i][1] += x
            this.value[i][2] += y
            this.value[i][3] += x
            this.value[i][4] += y
  
            if (l == 'C')  {
              this.value[i][5] += x
              this.value[i][6] += y
            }
  
          } else if (l == 'A')  {
            this.value[i][6] += x
            this.value[i][7] += y
          }
  
        }
      }
  
      return this
    }
    // Resize path string
  , size: function(width, height) {
  		/* get bounding box of current situation */
  		var i, l, box = this.bbox()
  
      /* recalculate position of all points according to new size */
      for (i = this.value.length - 1; i >= 0; i--) {
        l = this.value[i][0]
  
        if (l == 'M' || l == 'L' || l == 'T')  {
          this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
          this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
  
        } else if (l == 'H')  {
          this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
  
        } else if (l == 'V')  {
          this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y
  
        } else if (l == 'C' || l == 'S' || l == 'Q')  {
          this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
          this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
          this.value[i][3] = ((this.value[i][3] - box.x) * width)  / box.width  + box.x
          this.value[i][4] = ((this.value[i][4] - box.y) * height) / box.height + box.y
  
          if (l == 'C')  {
            this.value[i][5] = ((this.value[i][5] - box.x) * width)  / box.width  + box.x
            this.value[i][6] = ((this.value[i][6] - box.y) * height) / box.height + box.y
          }
  
        } else if (l == 'A')  {
          /* resize radii */
          this.value[i][1] = (this.value[i][1] * width)  / box.width
          this.value[i][2] = (this.value[i][2] * height) / box.height
  
          /* move position values */
          this.value[i][6] = ((this.value[i][6] - box.x) * width)  / box.width  + box.x
          this.value[i][7] = ((this.value[i][7] - box.y) * height) / box.height + box.y
        }
  
      }
  
      return this
    }
    // Absolutize and parse path to array
  , parse: function(array) {
      /* if it's already is a patharray, no need to parse it */
      if (array instanceof SVG.PathArray) return array.valueOf()
  
      /* prepare for parsing */
      var i, il, x0, y0, x1, y1, x2, y2, s, seg, segs
        , x = 0
        , y = 0
      
      /* populate working path */
      SVG.parser.path.setAttribute('d', typeof array === 'string' ? array : arrayToString(array))
      
      /* get segments */
      segs = SVG.parser.path.pathSegList
  
      for (i = 0, il = segs.numberOfItems; i < il; ++i) {
        seg = segs.getItem(i)
        s = seg.pathSegTypeAsLetter
  
        /* yes, this IS quite verbose but also about 30 times faster than .test() with a precompiled regex */
        if (s == 'M' || s == 'L' || s == 'H' || s == 'V' || s == 'C' || s == 'S' || s == 'Q' || s == 'T' || s == 'A') {
          if ('x' in seg) x = seg.x
          if ('y' in seg) y = seg.y
  
        } else {
          if ('x1' in seg) x1 = x + seg.x1
          if ('x2' in seg) x2 = x + seg.x2
          if ('y1' in seg) y1 = y + seg.y1
          if ('y2' in seg) y2 = y + seg.y2
          if ('x'  in seg) x += seg.x
          if ('y'  in seg) y += seg.y
  
          if (s == 'm')
            segs.replaceItem(SVG.parser.path.createSVGPathSegMovetoAbs(x, y), i)
          else if (s == 'l')
            segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoAbs(x, y), i)
          else if (s == 'h')
            segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoHorizontalAbs(x), i)
          else if (s == 'v')
            segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoVerticalAbs(y), i)
          else if (s == 'c')
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i)
          else if (s == 's')
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i)
          else if (s == 'q')
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i)
          else if (s == 't')
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i)
          else if (s == 'a')
            segs.replaceItem(SVG.parser.path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i)
          else if (s == 'z' || s == 'Z') {
            x = x0
            y = y0
          }
        }
  
        /* record the start of a subpath */
        if (s == 'M' || s == 'm') {
          x0 = x
          y0 = y
        }
      }
  
      /* build internal representation */
      array = []
      segs  = SVG.parser.path.pathSegList
      
      for (i = 0, il = segs.numberOfItems; i < il; ++i) {
        seg = segs.getItem(i)
        s = seg.pathSegTypeAsLetter
        x = [s]
  
        if (s == 'M' || s == 'L' || s == 'T')
          x.push(seg.x, seg.y)
        else if (s == 'H')
          x.push(seg.x)
        else if (s == 'V')
          x.push(seg.y)
        else if (s == 'C')
          x.push(seg.x1, seg.y1, seg.x2, seg.y2, seg.x, seg.y)
        else if (s == 'S')
          x.push(seg.x2, seg.y2, seg.x, seg.y)
        else if (s == 'Q')
          x.push(seg.x1, seg.y1, seg.x, seg.y)
        else if (s == 'A')
          x.push(seg.r1, seg.r2, seg.angle, seg.largeArcFlag|0, seg.sweepFlag|0, seg.x, seg.y)
  
        /* store segment */
        array.push(x)
      }
      
      return array
    }
    // Get bounding box of path
  , bbox: function() {
      SVG.parser.path.setAttribute('d', this.toString())
  
      return SVG.parser.path.getBBox()
    }
  
  })
  
  // PathArray Helpers
  function arrayToString(a) {
    for (var i = 0, il = a.length, s = ''; i < il; i++) {
      s += a[i][0]
  
      if (a[i][1] != null) {
        s += a[i][1]
  
        if (a[i][2] != null) {
          s += ' '
          s += a[i][2]
  
          if (a[i][3] != null) {
            s += ' '
            s += a[i][3]
            s += ' '
            s += a[i][4]
  
            if (a[i][5] != null) {
              s += ' '
              s += a[i][5]
              s += ' '
              s += a[i][6]
  
              if (a[i][7] != null) {
                s += ' '
                s += a[i][7]
              }
            }
          }
        }
      }
    }
    
    return s + ' '
  }

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
          else if (match[2] == 's')
            this.value *= 1000
      
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
      return (
        this.unit == '%' ?
          ~~(this.value * 1e8) / 1e6:
        this.unit == 's' ?
          this.value / 1e3 :
          this.value
      ) + this.unit
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

  SVG.Element = SVG.invent({
    // Initialize node
    create: function(node) {
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
  
    // Add class methods
  , extend: {
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
          /* act as a getter if the first and only argument is not an object */
          v = this.node.getAttribute(a)
          return v == null ? 
            SVG.defaults.attrs[a] :
          SVG.regex.test(v, 'isNumber') ?
            parseFloat(v) : v
        
        } else if (a == 'style') {
          /* redirect to the style method */
          return this.style(v)
        
        } else {
          /* BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0 */
          if (a == 'stroke-width')
            this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
          else if (a == 'stroke')
            this._stroke = v
  
          /* convert image fill and stroke to patterns */
          if (a == 'fill' || a == 'stroke') {
            if (SVG.regex.isImage.test(v))
              v = this.doc().defs().image(v, 0, 0)
  
            if (v instanceof SVG.Image)
              v = this.doc().defs().pattern(0, 0, function() {
                this.add(v)
              })
          }
          
          /* ensure full hex color */
          if (SVG.Color.isColor(v))
            v = new SVG.Color(v)
  
          /* ensure correct numeric values */
          else if (typeof v === 'number')
            v = new SVG.Number(v)
  
          /* parse array values */
          else if (Array.isArray(v))
            v = new SVG.Array(v)
  
          /* if the passed attribute is leading... */
          if (a == 'leading') {
            /* ... call the leading method instead */
            if (this.leading)
              this.leading(v)
          } else {
            /* set give attribute on node */
            n != null ?
              this.node.setAttributeNS(n, a, v.toString()) :
              this.node.setAttribute(a, v.toString())
          }
          
          /* rebuild if required */
          if (this.rebuild && (a == 'font-size' || a == 'x'))
            this.rebuild(a, v)
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
    }
    
  })

  SVG.Parent = SVG.invent({
    // Initialize node
    create: function(element) {
      this.constructor.call(this, element)
    }
  
    // Inherit from
  , inherit: SVG.Element
  
    // Add class methods
  , extend: {
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
    }
    
  })


  SVG.Container = SVG.invent({
    // Initialize node
    create: function(element) {
      this.constructor.call(this, element)
    }
  
    // Inherit from
  , inherit: SVG.Parent
  
    // Add class methods
  , extend: {
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
    }
    
  })

  SVG.FX = SVG.invent({
    // Initialize FX object
    create: function(element) {
      /* store target element */
      this.target = element
    }
  
    // Add class methods
  , extend: {
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
        d = d == '=' ? d : d == null ? 1000 : new SVG.Number(d).valueOf()
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
            
          }, new SVG.Number(delay).valueOf())
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
      
    }
  
    // Define parent class
  , parent: SVG.Element
  
    // Add method to parent elements
  , construct: {
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
    // Relative move over x axis
    dx: function(x) {
      return this.x(this.x() + x)
    }
    // Relative move over y axis
  , dy: function(y) {
      return this.y(this.y() + y)
    }
    // Relative move over x and y axes
  , dmove: function(x, y) {
      return this.dx(x).dy(y)
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

  SVG.Defs = SVG.invent({
    // Initialize node
    create: 'defs'
  
    // Inherit from
  , inherit: SVG.Container
  })

  SVG.G = SVG.invent({
    // Initialize node
    create: 'g'
  
    // Inherit from
  , inherit: SVG.Container
    
    // Add class methods
  , extend: {
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
    }
    
    // Add parent method
  , construct: {
      // Create a group element
      group: function() {
        return this.put(new SVG.G)
      }
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

  SVG.Mask = SVG.invent({
    // Initialize node
    create: function() {
      this.constructor.call(this, SVG.create('mask'))
  
      /* keep references to masked elements */
      this.targets = []
    }
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
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
    }
    
    // Add parent method
  , construct: {
      // Create masking element
      mask: function() {
        return this.defs().put(new SVG.Mask)
      }
    }
  })
  
  
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


  SVG.Clip = SVG.invent({
    // Initialize node
    create: function() {
      this.constructor.call(this, SVG.create('clipPath'))
  
      /* keep references to clipped elements */
      this.targets = []
    }
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
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
    }
    
    // Add parent method
  , construct: {
      // Create clipping element
      clip: function() {
        return this.defs().put(new SVG.Clip)
      }
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

  SVG.Gradient = SVG.invent({
    // Initialize node
    create: function(type) {
      this.constructor.call(this, SVG.create(type + 'Gradient'))
      
      /* store type */
      this.type = type
    }
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
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
        return this.put(new SVG.Stop).update(stop)
      }
      // Update gradient
    , update: function(block) {
        /* remove all stops */
        this.clear()
        
        /* invoke passed block */
        if (typeof block == 'function')
          block.call(this, this)
        
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
    }
    
    // Add parent method
  , construct: {
      // Create gradient element in defs
      gradient: function(type, block) {
        return this.defs().gradient(type, block)
      }
    }
  })
  
  SVG.extend(SVG.Defs, {
    // define gradient
    gradient: function(type, block) {
      return this.put(new SVG.Gradient(type)).update(block)
    }
    
  })
  
  SVG.Stop = SVG.invent({
    // Initialize node
    create: 'stop'
  
    // Inherit from
  , inherit: SVG.Element
  
    // Add class methods
  , extend: {
      // add color stops
      update: function(o) {
        /* set attributes */
        if (o.opacity != null) this.attr('stop-opacity', o.opacity)
        if (o.color   != null) this.attr('stop-color', o.color)
        if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))
  
        return this
      }
    }
  
  })


  SVG.Pattern = SVG.invent({
    // Initialize node
    create: 'pattern'
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      // Return the fill id
  	  fill: function() {
  	    return 'url(#' + this.attr('id') + ')'
  	  }
  	  // Update pattern by rebuilding
  	, update: function(block) {
  			/* remove content */
        this.clear()
        
        /* invoke passed block */
        if (typeof block == 'function')
        	block.call(this, this)
        
        return this
  		}
  	  // Alias string convertion to fill
  	, toString: function() {
  	    return this.fill()
  	  }
    }
    
    // Add parent method
  , construct: {
      // Create pattern element in defs
  	  pattern: function(width, height, block) {
  	    return this.defs().pattern(width, height, block)
  	  }
    }
  })
  
  SVG.extend(SVG.Defs, {
    // Define gradient
    pattern: function(width, height, block) {
      return this.put(new SVG.Pattern).update(block).attr({
        x:            0
      , y:            0
      , width:        width
      , height:       height
      , patternUnits: 'userSpaceOnUse'
      })
    }
  
  })

  SVG.Doc = SVG.invent({
    // Initialize node
    create: function(element) {
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
  
      /* turn off sub pixel offset by default */
      this.doSpof = false
      
      /* ensure correct rendering */
      if (this.parent != this.node)
        this.stage()
    }
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      /* enable drawing */
      stage: function() {
        var element = this
  
        /* insert element */
        this.parent.appendChild(this.node)
  
        /* fix sub-pixel offset */
        element.spof()
        
        /* make sure sub-pixel offset is fixed every time the window is resized */
        SVG.on(window, 'resize', function() {
          element.spof()
        })
  
        return this
      }
  
      // Creates and returns defs element
    , defs: function() {
        return this._defs
      }
  
      // Fix for possible sub-pixel offset. See:
      // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
    , spof: function() {
        if (this.doSpof) {
          var pos = this.node.getScreenCTM()
          
          if (pos)
            this
              .style('left', (-pos.e % 1) + 'px')
              .style('top',  (-pos.f % 1) + 'px')
        }
        
        return this
      }
  
      // Enable sub-pixel offset
    , fixSubPixelOffset: function() {
        this.doSpof = true
  
        return this
      }
    }
    
  })


  SVG.Shape = SVG.invent({
    // Initialize node
    create: function(element) {
  	  this.constructor.call(this, element)
  	}
  
    // Inherit from
  , inherit: SVG.Element
  
  })

  SVG.Use = SVG.invent({
    // Initialize node
    create: 'use'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Use element as a reference
      element: function(element) {
        /* store target element */
        this.target = element
  
        /* set lined element */
        return this.attr('href', '#' + element, SVG.xlink)
      }
    }
    
    // Add parent method
  , construct: {
      // Create a use element
      use: function(element) {
        return this.put(new SVG.Use).element(element)
      }
    }
  })

  SVG.Rect = SVG.invent({
  	// Initialize node
    create: 'rect'
  
  	// Inherit from
  , inherit: SVG.Shape
  	
  	// Add parent method
  , construct: {
    	// Create a rect element
    	rect: function(width, height) {
    	  return this.put(new SVG.Rect().size(width, height))
    	}
    	
  	}
  	
  })

  SVG.Ellipse = SVG.invent({
    // Initialize node
    create: 'ellipse'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
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
      
    }
  
    // Add parent method
  , construct: {
      // Create circle element, based on ellipse
      circle: function(size) {
        return this.ellipse(size, size)
      }
      // Create an ellipse
    , ellipse: function(width, height) {
        return this.put(new SVG.Ellipse).size(width, height).move(0, 0)
      }
      
    }
  
  })

  SVG.Line = SVG.invent({
    // Initialize node
    create: 'line'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
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
    }
    
    // Add parent method
  , construct: {
      // Create a line element
      line: function(x1, y1, x2, y2) {
        return this.put(new SVG.Line().plot(x1, y1, x2, y2))
      }
    }
  })


  SVG.Polyline = SVG.invent({
    // Initialize node
    create: 'polyline'
  
    // Inherit from
  , inherit: SVG.Shape
    
    // Add parent method
  , construct: {
      // Create a wrapped polyline element
      polyline: function(p) {
        return this.put(new SVG.Polyline).plot(p)
      }
    }
  })
  
  SVG.Polygon = SVG.invent({
    // Initialize node
    create: 'polygon'
  
    // Inherit from
  , inherit: SVG.Shape
    
    // Add parent method
  , construct: {
      // Create a wrapped polygon element
      polygon: function(p) {
        return this.put(new SVG.Polygon).plot(p)
      }
    }
  })
  
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

  SVG.Path = SVG.invent({
    // Initialize node
    create: 'path'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Plot new poly points
      plot: function(p) {
        return this.attr('d', (this.array = new SVG.PathArray(p, [['M', 0, 0]])))
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
      
    }
    
    // Add parent method
  , construct: {
      // Create a wrapped path element
      path: function(d) {
        return this.put(new SVG.Path).plot(d)
      }
    }
  })

  SVG.Image = SVG.invent({
    // Initialize node
    create: 'image'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // (re)load image
      load: function(url) {
        if (!url) return this
  
        var self = this
          , img  = document.createElement('img')
        
        /* preload image */
        img.onload = function() {
          var p = self.doc(SVG.Pattern)
  
          /* ensure image size */
          if (self.width() == 0 && self.height() == 0)
            self.size(img.width, img.height)
  
          /* ensure pattern size if not set */
          if (p && p.width() == 0 && p.height() == 0)
            p.size(self.width(), self.height())
          
          /* callback */
          if (typeof self._loaded == 'function')
            self._loaded.call(self, {
              width:  img.width
            , height: img.height
            , ratio:  img.width / img.height
            , url:    url
            })
        }
  
        return this.attr('href', (img.src = this.src = url), SVG.xlink)
      }
      // Add loade callback
    , loaded: function(loaded) {
        this._loaded = loaded
        return this
      }
    }
    
    // Add parent method
  , construct: {
      // Create image element, load image and set its size
      image: function(source, width, height) {
        return this.put(new SVG.Image).load(source).size(width || 0, height || width || 0)
      }
    }
  })

  SVG.Text = SVG.invent({
    // Initialize node
    create: function() {
      this.constructor.call(this, SVG.create('text'))
      
      this._leading = new SVG.Number(1.3) /* store leading value for rebuilding */
      this._rebuild = true                /* enable automatic updating of dy values */
      this._build   = false               /* disable build mode for adding multiple lines */
  
      /* set default font */
      this.attr('font-family', SVG.defaults.attrs['font-family'])
    }
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Move over x-axis
      x: function(x) {
        /* act as getter */
        if (x == null)
          return this.attr('x')
        
        /* move lines as well if no textPath is present */
        if (!this.textPath)
          this.lines.each(function() { if (this.newLined) this.x(x) })
  
        return this.attr('x', x)
      }
      // Move over y-axis
    , y: function(y) {
        /* act as getter */
        if (y == null)
          return this.attr('y')
  
        return this.attr('y', y + this.attr('y') - this.bbox().y)
      }
      // Move center over x-axis
    , cx: function(x) {
        return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
      }
      // Move center over y-axis
    , cy: function(y) {
        return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
      }
      // Move element to given x and y values
    , move: function(x, y) {
        return this.x(x).y(y)
      }
      // Move element by its center
    , center: function(x, y) {
        return this.cx(x).cy(y)
      }
      // Set the text content
    , text: function(text) {
        /* act as getter */
        if (!text) return this.content
        
        /* remove existing content */
        this.clear().build(true)
        
        if (typeof text === 'function') {
          /* call block */
          text.call(this, this)
  
        } else {
          /* store text and make sure text is not blank */
          text = (this.content = (SVG.regex.isBlank.test(text) ? 'text' : text)).split('\n')
          
          /* build new lines */
          for (var i = 0, il = text.length; i < il; i++)
            this.tspan(text[i]).newLine()
        }
        
        /* disable build mode and rebuild lines */
        return this.build(false).rebuild()
      }
      // Set font size
    , size: function(size) {
        return this.attr('font-size', size).rebuild()
      }
      // Set / get leading
    , leading: function(value) {
        /* act as getter */
        if (value == null)
          return this._leading
        
        /* act as setter */
        this._leading = new SVG.Number(value)
        
        return this.rebuild()
      }
      // Rebuild appearance type
    , rebuild: function(rebuild) {
        var self = this
  
        /* store new rebuild flag if given */
        if (typeof rebuild == 'boolean')
          this._rebuild = rebuild
  
        /* define position of all lines */
        if (this._rebuild) {
          this.lines.each(function() {
            if (this.newLined) {
              if (!this.textPath)
                this.attr('x', self.attr('x'))
              this.attr('dy', self._leading * new SVG.Number(self.attr('font-size'))) 
            }
          })
        }
  
        return this
      }
      // Enable / disable build mode
    , build: function(build) {
        this._build = !!build
        return this
      }
    }
    
    // Add parent method
  , construct: {
      // Create text element
      text: function(text) {
        return this.put(new SVG.Text).text(text)
      }
      // Create plain text element
    , plain: function(text) {
        return this.put(new SVG.Text).plain(text)
      }
    }
  
  })
  
  SVG.TSpan = SVG.invent({
    // Initialize node
    create: 'tspan'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Set text content
      text: function(text) {
        typeof text === 'function' ? text.call(this, this) : this.plain(text)
  
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
        /* fetch text parent */
        var t = this.doc(SVG.Text)
  
        /* mark new line */
        this.newLined = true
  
        /* apply new hy¡n */
        return this.dy(t._leading * t.attr('font-size')).attr('x', t.x())
      }
    }
    
  })
  
  SVG.extend(SVG.Text, SVG.TSpan, {
    // Create plain text node
    plain: function(text) {
      /* clear if build mode is disabled */
      if (this._build === false)
        this.clear()
  
      /* create text node */
      this.node.appendChild(document.createTextNode((this.content = text)))
      
      return this
    }
    // Create a tspan
  , tspan: function(text) {
      var node  = (this.textPath || this).node
        , tspan = new SVG.TSpan
  
      /* clear if build mode is disabled */
      if (this._build === false)
        this.clear()
      
      /* add new tspan and reference */
      node.appendChild(tspan.node)
      tspan.parent = this
  
      /* only first level tspans are considered to be "lines" */
      if (this instanceof SVG.Text)
        this.lines.add(tspan)
  
      return tspan.text(text)
    }
    // Clear all lines
  , clear: function() {
      var node = (this.textPath || this).node
  
      /* remove existing child nodes */
      while (node.hasChildNodes())
        node.removeChild(node.lastChild)
      
      /* reset content references  */
      if (this instanceof SVG.Text) {
        delete this.lines
        this.lines = new SVG.Set
        this.content = ''
      }
      
      return this
    }
  })
  


  SVG.TextPath = SVG.invent({
    // Initialize node
    create: 'textPath'
  
    // Inherit from
  , inherit: SVG.Element
  
    // Define parent class
  , parent: SVG.Text
  
    // Add parent method
  , construct: {
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
        this.track = this.doc().defs().path(d)
  
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
    }
  })

  SVG.Nested = SVG.invent({
    // Initialize node
    create: function() {
      this.constructor.call(this, SVG.create('svg'))
      
      this.style('overflow', 'visible')
    }
  
    // Inherit from
  , inherit: SVG.Container
    
    // Add parent method
  , construct: {
      // Create nested svg document
    nested: function() {
        return this.put(new SVG.Nested)
      }
    }
  })

  SVG.A = SVG.invent({
    // Initialize node
    create: 'a'
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
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
    }
    
    // Add parent method
  , construct: {
      // Create a hyperlink element
      link: function(url) {
        return this.put(new SVG.A).to(url)
      }
    }
  })
  
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

  var sugar = {
    stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
  , fill:   ['color', 'opacity', 'rule']
  , prefix: function(t, a) {
      return a == 'color' ? t : t + '-' + a
    }
  }
  
  /* Add sugar for fill and stroke */
  ;['fill', 'stroke'].forEach(function(m) {
    var i, extension = {}
    
    extension[m] = function(o) {
      if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))
        this.attr(m, o)
  
      else
        /* set all attributes from sugar.fill and sugar.stroke list */
        for (i = sugar[m].length - 1; i >= 0; i--)
          if (o[sugar[m][i]] != null)
            this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]])
      
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
  
  SVG.extend(SVG.Rect, SVG.Ellipse, SVG.FX, {
    // Add x and y radius
    radius: function(x, y) {
      return this.attr({ rx: x, ry: y || x })
    }
  
  })
  
  SVG.extend(SVG.Path, {
    // Get path length
    length: function() {
      return this.node.getTotalLength()
    }
    // Get point at length
  , pointAt: function(length) {
      return this.node.getPointAtLength(length)
    }
  
  })
  
  SVG.extend(SVG.Text, SVG.FX, {
    // Set font 
    font: function(o) {
      for (var k in o)
        k == 'leading' ?
          this.leading(o[k]) :
        k == 'anchor' ?
          this.attr('text-anchor', o[k]) :
        k == 'size' || k == 'family' || k == 'weight' || k == 'stretch' || k == 'variant' || k == 'style' ?
          this.attr('font-'+ k, o[k]) :
          this.attr(k, o[k])
      
      return this
    }
    
  })
  


  SVG.Set = SVG.invent({
    // Initialize
    create: function() {
      /* set initial state */
      this.clear()
    }
  
    // Add class methods
  , extend: {
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
    }
    
    // Add parent method
  , construct: {
      // Create a new set
      set: function() {
        return new SVG.Set
      }
    }
  })
  
  SVG.SetFX = SVG.invent({
    // Initialize node
    create: function(set) {
      /* store reference to set */
      this.set = set
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
require.register("component-inherit/index.js", function(exports, require, module){

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
});
require.register("component-indexof/index.js", function(exports, require, module){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
require.register("tower-emitter/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var index = require('indexof');
var slice = [].slice;

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

Emitter.prototype.on = function(event, fn){
  this._callbacks || (this._callbacks = {});
  (this._callbacks[event] || (this._callbacks[event] = []))
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
  this._callbacks || (this._callbacks = {});

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
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
Emitter.prototype.removeAllListeners = function(event, fn){
  if (!this._callbacks) return this;

  // all
  if (0 === arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 === arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
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
  if (!this._callbacks) return this;

  this._callbacks || (this._callbacks || {});

  var callbacks = this._callbacks[event];

  if (callbacks) {
    var args = slice.call(arguments, 1);
    callbacks = callbacks.slice(0);
    for (var i = 0, n = callbacks.length; i < n; ++i) {
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
  this._callbacks || (this._callbacks = {});
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
  return !!this.listeners(event).length;
};
});
require.register("tower-type/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');
var validator = require('tower-validator');
var types = require('./lib/types');

/**
 * Expose `type`.
 */

exports = module.exports = type;

/**
 * Expose `Type`.
 */

exports.Type = Type;

/**
 * Expose `collection`.
 */

exports.collection = [];

/**
 * Expose `validator`.
 */

exports.validator = validator.ns('type');

/**
 * Define or get a type.
 *
 * @param {String} name Type name.
 * @param {Function} fn A function added to a list of sanitizers that sanitizes the type.
 * @return {Type} A type instance.
 * @api public
 */

function type(name, fn) {
  if (undefined === fn && exports.collection[name])
      return exports.collection[name];

  var instance = new Type(name, fn);
  exports.collection[name] = instance;
  exports.collection.push(instance);
  exports.emit('define', name, instance);
  return instance;
}

/**
 * Mixin `Emitter`.
 */

Emitter(exports);

/**
 * Check if validator exists.
 *
 * @param {String} name Type name.
 * @return {Boolean} true if `Type` exists, else false.
 * @api public
 */

exports.defined = function(name){
  return exports.collection.hasOwnProperty(name);
};

/**
 * Scope validators to a namespace.
 *
 * @param {String} ns A namespace
 * @return {Function} A function that returns a namespaced exports object.
 * @api public
 */

exports.ns = function(ns){
  return function type(name, fn) {
    return exports(ns + '.' + name, fn);
  }
};

/**
 * Remove all validators.
 *
 * @chainable
 * @return {Function} exports The main `type` function.
 * @api public
 */

exports.clear = function(){
  var collection = exports.collection;

  exports.off();
  for (var key in collection) {
    if (collection.hasOwnProperty(key)) {
      delete collection[key];
    }
  }
  collection.length = 0;
  return exports;
};

/**
 * Class representing a type.
 *
 * @class
 * @param {String} name A type name.
 * @param {Function} fn A function added to a list of sanitizers that sanitizes the type.
 * @api public
 */

function Type(name, fn) {
  // XXX: name or path? maybe both.
  this.name = name;
  // XXX: or maybe just delegate:
  // this.validator = type.validator.ns(name);
  // that might reduce memory quite a bit.
  // even though it's still only a tiny bit of it.
  this.validators = [];
  // serialization/sanitization function.
  if (fn) this.use(fn);
}

/**
 * Add a validator function to a type.
 *
 * @chainable
 * @param {String} name A validator name.
 * @param {Function} fn A validator function.
 * @returns {Type}.
 * @api public
 */

Type.prototype.validator = function(name, fn){
  // XXX: see above, this should probably just
  // be happening in `validator.ns(this.name)`.
  exports.validator(this.name + '.' + name, fn);
  this.validators.push(this.validators[name] = fn);
  return this;
};

/**
 * Sanitize functions to pass value through.
 *
 * @chainable
 * @param {Function} fn A sanitizor function.
 * @return {Type}
 * @api public
 */

Type.prototype.use = function(fn){
  (this.sanitizers || (this.sanitizers = [])).push(fn);
  return this;
};

/**
 * Sanitize (or maybe `serialize`).
 *
 * XXX: maybe rename to `cast`?
 *
 * @param {Mixed} val A value to sanitize.
 * @return {Mixed} The value sanitized.
 * @api public
 */

Type.prototype.sanitize = function(val, obj){
  if (!this.sanitizers) return val;

  for (var i = 0, n = this.sanitizers.length; i < n; i++) {
    val = this.sanitizers[i](val, obj);
  }

  return val;
};

/**
 * Seralizer object by name.
 *
 * XXX: Maybe refactor into `tower/serializer` module.
 *
 * @chainable
 * @param {String} name Object name.
 * @return {Type}
 * @api public
 */

Type.prototype.serializer = function(name){
  this.context = (this.serializers || (this.serializers = {}))[name] = {};
  return this;
};

/**
 * Define how to serialize type from
 * JavaScript to external API/service request format.
 *
 * XXX: to/out/request/serialize/format/use
 *
 * @chainable
 * @param {Function} fn Function to handle serialization.
 * @return {Type}
 * @api public
 */

Type.prototype.to = function(fn){
  // XXX: some way to set a default serializer.
  if (!this.context) this.serializer('default');
  this.context.to = fn;
  return this;
};

/**
 * Define how to deserialize type from 
 * external API/service request format to JavaScript.
 *
 * XXX: from/in/response/deserialize
 *
 * @chainable
 * @param {Function} fn Function to handle deserialization.
 * @return {Type}
 * @api public
 */

Type.prototype.from = function(fn){
  if (!this.context) this.serializer('default');
  this.context.from = fn;
  return this;
};

/**
 * Bring back to parent context.
 *
 * XXX: need more robust way to do this across modules.
 *
 * @param {String} name A type name.
 */

Type.prototype.type = function(name){

};

types(exports);
});
require.register("tower-type/lib/types.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var isArray = require('part-is-array');

/**
 * Expose `types`.
 */

module.exports = types;

/**
 * Define basic types and type validators.
 *
 * @param {Function} The type module.
 */

function types(type) {
  // XXX: type('string').validator('lte')
  // would default to `validator('gte')` if not explicitly defined.
  type('string')
    .use(String)
    .validator('gte', function gte(a, b){
      return a.length >= b.length;
    })
    .validator('gt', function gt(a, b){
      return a.length > b.length;
    });

  type('id');

  type('integer')
    .use(parseInt);

  type('object');

  type('float')
    .use(parseFloat);

  type('decimal')
    .use(parseFloat);

  type('number')
    .use(parseFloat);
    
  type('date')
    .use(parseDate);

  type('boolean')
    .use(parseBoolean);

  type('array')
    // XXX: test? test('asdf') // true/false if is type.
    // or `validate`
    .use(function(val){
      // XXX: handle more cases.
      return isArray(val)
        ? val
        : val.split(/,\s*/);
    })
    .validator('lte', function lte(a, b){
      return a.length <= b.length;
    });

  function parseDate(val) {
    return isDate(val)
      ? val
      : new Date(val);
  }

  function parseBoolean(val) {
    // XXX: can be made more robust
    var kind = typeof(val);
    switch (kind) {
      case 'string':
        return '1' === val;
      case 'number':
        return 1 === val;
      default:
        return !!val;
    }
  }
}

// XXX: refactor to `part`
function isDate(val) {
  return '[object Date]' === Object.prototype.toString.call(val);
}
});
require.register("part-is-array/index.js", function(exports, require, module){

/**
 * Expose `isArray`.
 */

module.exports = Array.isArray || isArray;

function isArray(obj) {
  return '[object Array]' === toString.call(obj);
}
});
require.register("tower-param/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');
var validator = require('tower-validator');
var type = require('tower-type');
var isArray = require('part-is-array');
var validators = require('./lib/validators');

/**
 * Expose `param`.
 */

exports = module.exports = param;

/**
 * Expose `Param`.
 */

exports.Param = Param;

/**
 * Expose `collection`.
 */

exports.collection = [];

/**
 * Expose `validator`.
 */

exports.validator = validator.ns('param');

/**
 * Get a `Param`.
 */

function param(name, type, options) {
  if (exports.collection[name])
    return exports.collection[name];

  var instance = new Param(name, type, options);
  exports.collection[name] = instance;
  exports.collection.push(instance);
  exports.emit('define', name, instance);
  return instance;
}

/**
 * Mixin `Emitter`.
 */

Emitter(exports);

/**
 * Instantiate a new `Param`.
 */

function Param(name, type, options){
  if (!type) {
    options = { type: 'string' };
  } else if (isArray(type)) {
    options = { type: 'array' };
    options.itemType = type[0] || 'string';
  } else if ('object' === typeof type) {
    options = type;
  } else {
    options || (options = {});
    options.type = type;
  }

  this.name = name;
  this.type = options.type || 'string';

  if (options.validators) this.validators = [];
  if (options.alias) this.aliases = [ options.alias ];
  else if (options.aliases) this.aliases = options.aliases;

  // XXX: lazily create validators/operators?
  // this.validators = options.validators || [];
  // this.operators = options.operators || [];
}

/**
 * Add validator to stack.
 */

Param.prototype.validator = function(key, val){
  var assert = exports.validator(key);

  (this.validators || (this.validators = []))
    .push(function validate(self, query, constraint){ // XXX: fn callback later
      if (!assert(self, constraint.right.value, val))
        query.errors.push('Invalid Constraint something...');
    });
};

/**
 * Append operator to stack.
 */

Param.prototype.operator = function(name){
  if (!this.operators) {  
    this.operators = [];

    var assert = validator('in');

    (this.validators || (this.validators = []))
      .push(function validate(self, query, constraint){
        if (!assert(self, constraint.operator, self.operators)) {
          query.errors.push('Invalid operator ' + constraint.operator);
        } else {
          // XXX: typecast
        }
      });
  }

  this.operators.push(name);
};

Param.prototype.validate = function(query, constraint, fn){
  if (!this.validators) return true;

  for (var i = 0, n = this.validators.length; i < n; i++) {
    this.validators[i](this, query, constraint);
  }

  return !(query.errors && query.errors.length);
};

Param.prototype.alias = function(key){
  (this.aliases || (this.aliases = [])).push(key);
};

// XXX: this might be too specific, trying it out for now.
Param.prototype.format = function(type, name){
  this.serializer = { type: type, name: name };
};

/**
 * Convert a value into a proper form.
 *
 * Typecasting.
 *
 * @param {Mixed} val
 */
 
Param.prototype.typecast = function(val, fn){
  // XXX: handle for whether or not it's a constraint or simple equality.
  // XXX: handle async parsing too, in tower-type (for things like streams)
  var res = type(this.type).sanitize(val);
  if (fn) fn(null, res);
  return res;
};

/**
 * Expression for param.
 */

Param.prototype.expression = function(name){
  this._expression = name;
  return this;
};

validators(exports);
});
require.register("tower-param/lib/validators.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var validator = require('tower-validator');

/**
 * Expose `validators`.
 */

module.exports = validators;

/**
 * Define default validators.
 */

function validators(param) {
  // XXX: todo
  param.validator('present', function(self, obj){
    return null != obj;
  });

	function define(key) {
    param.validator(key, function(self, obj, val){
      return validator(key)(obj, val);
    });
  }

  define('eq');
  define('neq');
  define('in');
  define('nin');
  define('contains');
  define('gte');
  define('gt');
  define('lt');
  define('lte');
  define('match');
}
});
require.register("tower-stream/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var load = require('tower-load');
var proto = require('./lib/proto');
var statics = require('./lib/static');
var api = require('./lib/api');

/**
 * Expose `stream`.
 */

exports = module.exports = stream;

/**
 * Find or create a stream by `name`.
 *
 * @param {String} name A stream name.
 * @param {Function} fn Function called on stream execution.
 * @api public
 */

function stream(name, fn) {
  if (exports.collection[name]) return exports.collection[name];
  if (exports.load(name)) return exports.collection[name];

  /**
   * Class representing a stream.
   *
   * @class
   * @param {Object} options Stream options.
   * @api public
   */

  function Stream(options) {
    options || (options = {});

    for (var key in options) this[key] = options[key];

    this.name = name;
    this.inputs = options.inputs || [];
    this.outputs = options.outputs || [];
    Stream.emit('init', this);
  }

  api.init(name, Stream, statics, proto, stream);

  Stream.action = function(x, fn){
    return stream(Stream.ns + '.' + x, fn);
  }

  if ('function' === typeof fn) Stream.on('exec', fn);

  api.dispatch(stream, name, Stream);

  return Stream;
}

/**
 * Mixin API behavior.
 */

api(exports, statics, proto);

/**
 * Extend the `stream` API under a namespace.
 *
 * @param {String} ns A namespace.
 * @return {Function} The `stream` API function extended under a namespace.
 * @api public
 */

exports.ns = function(ns){
  function stream(name, fn) {
    return exports(ns + '.' + name, fn);
  }

  api.extend(stream, exports);

  stream.exists = function(name){
    return exports.exists(ns + '.' + name);
  }

  return stream;
};

/**
 * Lazy-load.
 * 
 * @param {String} name A unique key such as a stream name.
 * @param {Path} path Full `require.resolve(x)` path.
 * @return {Function} A module.
 * @api public
 */

exports.load = function(name, path){
  return 1 === arguments.length
    ? load(exports, name)
    : load.apply(load, [exports].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Check if `stream` exists by `name`.
 *
 * @param {String} name A stream name.
 * @return {Boolean} true if the stream exists, else false.
 * @api public
 */

exports.exists = function(name){
  // try lazy loading
  if (undefined === exports.collection[name])
    return !!exports.load(name);

  return !!exports.collection[name];
};
});
require.register("tower-stream/lib/static.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var Param = require('tower-param').Param;
var Attr = require('tower-attr').Attr;

/**
 * Instantiate a new `Stream`.
 *
 * XXX: rename to `init`.
 *
 * @param {Object} options Stream options.
 * @return {Stream} A `Stream` instance.
 * @api public
 */

exports.create = function(options){
  return new this(options);
};
exports.init = exports.create;

/**
 * Instantiate a new `Param`.
 *
 * @param {String} name Param name.
 * @param {String} type Param type.
 * @param {Object} options Param options.
 * @return {Param} A `Param` instance.
 * @api public.
 */

exports.param = function(name, type, options){
  this.params || (this.params = []);
  this.context = this.params[name] = new Param(name, type, options);
  this.params.push(this.context);
  return this;
};

/**
 * Instantiate a new `Attr`.
 *
 * @param {String} name Attr name.
 * @param {Type} type Attr type.
 * @param {Object} options Attr options.
 * @return {Attr} A `Attr` instance.
 * @api public.
 */

exports.attr = function(name, type, options){
  this.attrs || (this.attrs = []);
  this.context = this.attrs[name] = new Attr(name, type, options);
  this.attrs.push(this.context);
  return this;
};

/**
 * Add an alias.
 *
 * @param {String} name An alias name.
 * @return {Object} The instance object.
 */

exports.alias = function(name){
  this.context.alias(name);
  return this;
};

/**
 * Define a validator.
 *
 * @param {String} key Name of the operator for assertion.
 * @param {Mixed} val
 * @return {Object} The instance object.
 */

exports.validate = function(key, val){
  if (this === this.context)
    // key is a function
    this.validator(key, val)
  else
    // param or attr
    this.context.validator(key, val);

  return this;
};

/**
 * Append a validator function to the stack.
 *
 * @param {Function} fn A validator function.
 * @return {Object} The instance object.
 */

exports.validator = function(fn){
  // XXX: just a function in this case, but could handle more.
  this.validators.push(fn);
  return this;
};

/**
 * Reset the `context` to `this`.
 *
 * @return {Object} The instance object.
 */

exports.self = function(){
  return this.context = this;
};
});
require.register("tower-stream/lib/proto.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var noop = function(){}; // XXX: temp until async emitter.

/**
 * Execute the stream.
 * 
 * @param {Object} data The stream data.
 * @param {Function} fn Function called on executing stream.
 */

exports.exec = function(data, fn){
  this.constructor.emit('exec', this, data, fn || noop);
  // XXX: need to handle with/without cases.
  //if (fn) fn();
};

/**
 * Open the stream.
 *
 * @param {Object} data The stream data.
 * @param {Function} fn Function called on opening stream.
 */

exports.open = function(data, fn){
  // XXX: refactor
  if (this.constructor.hasListeners('open'))
    this.constructor.emit('open', this, data, fn || noop);
  if (this.hasListeners('open'))
    this.emit('open', fn || noop);

  if (!this.hasListeners('open') && !this.constructor.hasListeners('open'))
    fn();
};

/**
 * Close the stream.
 *
 * @param {Function} fn Function called on closing stream.
 */

exports.close = function(fn){
  this.constructor.emit('close', this, fn);
  this.emit('close', fn);
};
});
require.register("tower-stream/lib/api.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');

/**
 * Expose `constructorFn`
 */

exports = module.exports = api;

/**
 * Setup the DSL API for a library.
 *
 * This is called once per "apiFn method".
 *
 * @param {Function} apiFn An api.
 * @param {Function} statics Module containing static functions to attach to `apiFn`.
 * @param {Function} proto Module containing instance functions to attach to `apiFn`.
 * @return {Function} The api `apiFn`.
 */

function api(apiFn, statics, proto){
  apiFn.collection = [];

  // mixin `Emitter`

  Emitter(apiFn);
  Emitter(statics);
  Emitter(proto);

  apiFn.clear = clear;//clear.bind(apiFn);
  apiFn.remove = remove;//remove.bind(apiFn);

  return apiFn;
}

/**
 * Add base behavior to a `Function`.
 *
 * This is called inside the API method.
 *
 * @param {String} name `fn` id.
 * @param {Function} fn A function.
 * @param {Function} statics Module containing static functions to attach to `fn`.
 * @param {Function} proto Module containing instance functions to attach to `fn`.
 * @param {Function} apiFn An api.
 * @return {Function} The api `apiFn`.
 */

exports.init = function(name, fn, statics, proto, apiFn){
  fn.id = name;

  // namespace

  fn.ns = name.replace(/\.\w+$/, '');

  // statics

  for (var key in statics) fn[key] = statics[key];

  // prototype

  fn.prototype = {};
  fn.prototype.constructor = fn;
  
  for (var key in proto) fn.prototype[key] = proto[key];

  apiFn.collection[name] = fn;
  apiFn.collection.push(fn);

  return apiFn;
};

/**
 * Emit events for the `name`,
 * so that external libraries can add extensions.
 *
 * @param {Function} apiFn An api.
 * @param {String} name A name.
 * @param {Function} fn Function called on `apiFn` define event.
 * @return {Function} The api `apiFn`.
 */

exports.dispatch = function(apiFn, name, fn){
  var parts = name.split('.');

  for (var i = 1, n = parts.length + 1; i < n; i++) {
    apiFn.emit('define ' + parts.slice(0, i).join('.'), fn);
  }

  apiFn.emit('define', fn);

  return apiFn;
};

/**
 * Scope the `constructorFn` names under a namespace.
 *
 * @param {Function} childApi The api to copy functions to.
 * @param {Function} parentApi The api to copy functions from.
 * @return {Function} The api `childApi`.
 */

exports.extend = function(childApi, parentApi){
  // XXX: copy functions?
  for (var key in parentApi) {
    if ('function' === typeof parentApi[key])
      childApi[key] = parentApi[key];
  }
  return childApi;
};

/**
 * Clear API behavior.
 */

function clear(){
  // remove all listeners
  this.off();

  while (this.collection.length)
    this.remove(this.collection.pop());

  return this;
}

function remove(val, i){
  var emitter = this.collection[val] || val;
  emitter.off();
  delete this.collection[emitter.id];
  // XXX: delete from collection array.
}
});
require.register("part-is-blank/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

module.exports = function isBlank(obj){
  if (null == obj || '' === obj) return true;
  if (obj.length) return !obj.length;
  if ('object' === typeof obj) {
    for (var key in obj) return false;
    return true;
  }
  return false;
};
});
require.register("component-type/index.js", function(exports, require, module){
/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object Error]': return 'error';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val !== val) return 'nan';
  if (val && val.nodeType === 1) return 'element';

  return typeof val.valueOf();
};

});
require.register("tower-attr/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var validator = require('tower-validator').ns('attr');
var types = require('tower-type');
var kindof = 'undefined' === typeof window ? require('type-component') : require('type');
var each = require('part-async-series');
var isBlank = require('part-is-blank');
var validators = require('./lib/validators');

/**
 * Expose `attr`.
 */

exports = module.exports = attr;

/**
 * Expose `Attr`.
 */

exports.Attr = Attr;

/**
 * Expose `validator`.
 */

exports.validator = validator;

/**
 * Get an `Attr` instance.
 */

function attr(name, type, options, path) {
  return new Attr(name, type, options, path);
}

/**
 * Instantiate a new `Attr`.
 */

function Attr(name, type, options, path){
  if (undefined === type) {
    // .attr('title')
    options = { type: 'string' };
  } else {
    var kind = kindof(type);

    if ('object' === kind) {
      // .attr('title', { value: 'Hello World', type: 'string' })
      options = type;
    } else if ('function' === kind) {
      // .attr('title', function(){})
      options = { value: type };
      // XXX: array too
    } else if ('array' === kind) {
      options = { type: 'array', value: type };
    } else {
      if ('object' !== kindof(options)) {
        options = { value: options };
      } else {
        options || (options = {});
      }

      // if `type` isn't in the list,
      // it's a default value.
      if (undefined !== options.value || types.defined(type))
        options.type = type;
      else
        options.value = type;
    }
  }

  this.name = name;
  this.path = path || 'attr.' + name;

  for (var key in options) this[key] = options[key];
  if (!this.type) this.type = 'string';
  
  // override `.apply` for complex types
  this.valueType = kindof(this.value);

  switch (this.valueType) {
    case 'function':
      this.apply = functionType;
      break;
    case 'array':
      this.apply = arrayType;
      break;
    case 'date':
      this.apply = dateType;
      break;
  }
}

/**
 * Add validator to stack.
 */

Attr.prototype.validator = function(key, val){
  var self = this;
  var assert = validator(key);
  this.validators || (this.validators = []);
  var validate;

  if (4 === assert.length) {
    validate = function(obj, errors, fn){
      assert(self, obj, val, function(err){
        if (err) errors[key] = false;
      });
    };
  } else {
    validate = function(obj, errors, fn){
      if (!assert(self, obj, val))
        errors[key] = false;
      fn();
    }
  }

  this.validators.push(validate);
};

Attr.prototype.alias = function(key){
  (this.aliases || (this.aliases = [])).push(key);
};

Attr.prototype.validate = function(data, errors, fn){
  if (!this.validators) return fn();

  var validators = this.validators;
  var i = 0;
  var validator;
  
  function next() {
    validator = validators[i++];
    if (validator) {
      validator(data, errors, next); 
    } else {
      if (isBlank(errors))
        fn();
      else
        fn(errors);
    }
  }

  next();

  return errors;
};

/**
 * Convert a value into a proper form.
 *
 * Typecasting.
 *
 * @param {Mixed} val
 * @param {Mixed} obj The object instance this attr value is relative to.
 */

Attr.prototype.typecast = function(val, obj){
  return types(this.type).sanitize(val, obj);
};

/**
 * Get default value.
 *
 * @param {Mixed} obj the object/record/instance to use
 *    in computing the default value (if it's a function).
 */

Attr.prototype.apply = function(obj){
  return this.value;
};

/**
 * Types for applying default values.
 */

function functionType(obj, val) {
  return this.value(obj, val);
}

function arrayType(obj) {
  return this.value.concat();
}

function dateType(obj) {
  return new Date(this.value.getTime());
}

/**
 * Define basic validators.
 */

validators(exports);
});
require.register("tower-attr/lib/validators.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var validator = require('tower-validator');

/**
 * Expose `validators`.
 */

module.exports = validators;

/**
 * Define default validators.
 */

function validators(attr) {
  // XXX: maybe this goes into a separate module.
  attr.validator('present', function(self, obj){
    return null != obj[self.name];
  });

  function define(key) {
    attr.validator(key, function(self, obj, val){
      return validator(key)(obj[self.name], val);
    });
  }

  define('eq');
  define('neq');
  define('in');
  define('nin');
  define('contains');
  define('gte');
  define('gt');
  define('lt');
  define('lte');

  validator('string.gte', function(a, b){
    return a.length >= b;
  });

  validator('string.lte', function(a, b){
    return a.length <= b;
  });

  define('string.gte');
  define('string.lte');

  attr.validator('min', attr.validator('string.gte'));
  attr.validator('max', attr.validator('string.lte'));
}
});
require.register("tower-validator/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');
var validators = require('./lib/validators');

/**
 * Expose `validator`.
 */

exports = module.exports = validator;

/**
 * All validators in the order they were defined.
 */

exports.collection = [];

/**
 * Get or set a validator function.
 *
 * @param {String} name Validator name.
 * @param {Function} fn Validator function.
 * @return {Function} Validator function.
 * @api public
 */

function validator(name, fn) {
  if (undefined === fn) return exports.collection[name];

  exports.collection[name] = fn;
  exports.collection.push(fn);
  exports.emit('define', name, fn);
  
  return fn;
}

/**
 * Mixin `Emitter`.
 */

Emitter(exports);

/**
 * Check if validator exists.
 *
 * @param {String} name Validator name.
 * @return {Boolean} true if the validator exists in the current list of validators, else false.
 * @api public
 */

exports.defined = function(name){
  return exports.collection.hasOwnProperty(name);
};

/**
 * Scope validators to a namespace.
 *
 * @param {String} ns A namespace.
 * @return {Function} Function to get or set a validator under a namespace.
 * @api public
 */

exports.ns = function(ns){
  return function validator(name, fn) {
    return exports(ns + '.' + name, fn);
  }
};

/**
 * Remove all validators.
 *
 * @chainable
 * @return {Function} exports The main `validator` function.
 * @api public
 */

exports.clear = function(){
  var collection = exports.collection;

  exports.off('define');
  for (var key in collection) {
    if (collection.hasOwnProperty(key)) {
      delete collection[key];
    }
  }
  collection.length = 0;
  return exports;
};

validators(exports);
});
require.register("tower-validator/lib/validators.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var indexof = require('indexof');

/**
 * Expose `validators`.
 */

module.exports = validators;

/**
 * Define basic operators/validators.
 *
 * @param {Function} The validator module.
 */

function validators(validator) {
  validator('eq', function eq(a, b){
    return a === b;
  });

  validator('neq', function neq(a, b){
    return a !== b;
  });

  validator('contains', function contains(a, b){
    return !!~indexof(b, a);
  });

  validator('in', validator('contains'));

  validator('excludes', function nin(a, b){
    return !~indexof(b, a);
  });

  validator('nin', validator('excludes'));

  validator('gte', function gte(a, b){
    return a >= b;
  });

  validator('gt', function gt(a, b){
    return a > b;
  });

  validator('lte', function gte(a, b){
    return a <= b;
  });

  validator('lt', function gt(a, b){
    return a < b;
  });

  validator('match', function match(a, b){
    return !!a.match(b);
  });
}
});
require.register("tower-text/index.js", function(exports, require, module){

/**
 * DSL context.
 */

var context;

/**
 * Current language.
 */

var locale;

/**
 * Expose `text`.
 */

exports = module.exports = text;

/**
 * Example:
 *
 *    text('messages')
 *
 * @param {String} key
 * @api public
 */

function text(key, val) {
  return undefined === val
    ? (locale[key] || (locale[key] = new Text))
    : (locale[key] = new Text).one(val);
}

exports.has = function(key){
  return !!locale[key];
};

/**
 * Set locale.
 */

exports.locale = function(val){
  locale = exports[val] || (exports[val] = {});
  return exports;
};

/**
 * Default locale is `en`.
 */

exports.locale('en');

/**
 * Instantiate a new `Text`.
 *
 * @api private
 */

function Text() {
  this.inflections = [];
}

/**
 * @param {String} string
 * @api public
 */

Text.prototype.past = function(string){
  return this.inflection(string, context.count, 'past');
};

/**
 * @param {String} string
 * @api public
 */

Text.prototype.present = function(string){
  return this.inflection(string, context.count, 'present');
};

/**
 * @param {String} string
 * @api public
 */

Text.prototype.future = function(string){
  return this.inflection(string, context.count, 'future');
};

/**
 * @param {String} string
 * @param {String} tense
 * @param {String} count
 * @api public
 */

Text.prototype.tense = function(string, tense, count){
  return this.inflection(string, count, tense);
};

/**
 * @param {String} string
 * @api public
 */

Text.prototype.none = function(string){
  return this.inflection(string, 'none');
};

/**
 * @param {String} string
 * @api public
 */

Text.prototype.one = function(string){
  return this.inflection(string, 'one');
};

/**
 * @param {String} string
 * @api public
 */

Text.prototype.other = function(string){
  return this.inflection(string, 'other');
};

/**
 * @param {String} string
 * @param {String} count
 * @param {String} tense
 * @api public
 */

Text.prototype.inflection = function(string, count, tense){
  // this isn't quite correct...
  this.inflections.push(context = {
    string: string,
    count: count == null ? 'all' : count,
    tense: tense || 'present'
  });

  return this;
};

/**
 * This could be a view on the client.
 *
 * @param {Object} options
 * @api public
 */

Text.prototype.render = function(options){
  options || (options = {});

  var count = (options.count ? (1 === options.count ? 'one' : 'other') : 'none')
    , tense = options.tense || 'present'
    , key = tense + '.' + count
    , inflections = this.inflections
    , inflection = inflections[0]
    , currScore = 0
    , prevScore = 0;

  for (var i = 0, n = inflections.length; i < n; i++) {
    currScore = 0
      + (count === inflections[i].count ? 1 : 0)
      + (tense === inflections[i].tense ? 1 : 0);

    if (currScore > prevScore) {
      inflection = inflections[i];
      prevScore = currScore; 
    }
  }

  return inflection.string.replace(/\{\{(\w+)\}\}/g, function(_, $1){
    return options[$1];
  });
};
});
require.register("tower-load/index.js", function(exports, require, module){

/**
 * Expose `load`.
 */

exports = module.exports = load;

/**
 * Map of `api + '.' + key` to absolute module path.
 */

exports.paths = {};

/**
 * Map of path to array of `api + '.' + key`.
 */

exports.keys = {};

/**
 * Map of path to `fn`.
 */

exports.fns = {};

/**
 * Lazy-load a module.
 *
 * This is something like an IoC container.
 * Make sure the `api.toString()` is unique.
 *
 * @param {Function} api An api.
 * @param {String} key A unique key.
 * @param {Path} path Full `require.resolve(x)` path.
 * @return {Function} A module.
 * @api public
 */

function load(api, key, path) {
  return undefined === path
    ? exports.get(api, key)
    : exports.set.apply(exports, arguments);
}

/**
 * Get a module.
 *
 * @param {Function} api An api.
 * @param {String} key A unique key
 * @return {Function} A module.
 * @api public
 */

exports.get = function(api, key){
  var path = exports.paths[api.name + '.' + key];
  if (path) {
    var fn = exports.fns[path];
    if (fn) return fn();
  }
}

/**
 * Define how to lazy-load a module.
 *
 * @chainable
 * @param {Function} api An api.
 * @param {String} key A unique key.
 * @param {Path} path Full `require.resolve(x)` path.
 * @return {Function} exports The main `load` function.
 * @api public
 */

exports.set = function(api, key, path){
  var pathKey = api.name + '.' + key;
  if (!exports.paths[pathKey]) {
    exports.paths[pathKey] = path;
    (exports.keys[path] || (exports.keys[path] = [])).push(pathKey);
    if (!exports.fns[path]) {
      exports.fns[path] = requireFn(path, Array.prototype.slice.call(arguments, 3));
    }
  }
  return exports;
};

/**
 * Clear all modules.
 *
 * @param {Path} path Full `require.resolve(x)` path.
 * @api public
 */

exports.clear = function(path){
  for (var i = 0, n = exports.keys[path].length; i < n; i++) {
    delete exports.paths[exports.keys[path][i]];
  }
  exports.keys[path].length = 0;
  delete exports.keys[path];
  delete exports.fns[path];
};

/**
 * Return module function results.
 *
 * @param {Path} path Full `require.resolve(x)` path.
 * @param {Array} args Module function arguments array.
 * @return {Mixed} Module function return value.
 */

function requireFn(path, args) {
  return function(obj) {
    // remove all listeners
    exports.clear(path);

    var result = require(path);

    if ('function' === typeof result) {
      //args.unshift(obj);
      result.apply(result, args);
    }
    
    args = undefined;
    return result;
  }
}
});
require.register("part-async-series/index.js", function(exports, require, module){
module.exports = function(fns, val, done, binding){
  var i = 0, fn;

  function handle(err) {
    if (err) return done(err);
    next();
  }

  function next() {
    if (fn = fns[i++]) {
      if (2 === fn.length) {
        fn.call(binding, val, handle);
      } else {
        if (false === fn.call(binding, val))
          done(new Error('haulted'));
        else
          next();
      }
    } else {
      if (done) done();
    }
  }

  next();
}
});
require.register("tower-resource/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');
var stream = require('tower-stream');
var validator = require('tower-validator').ns('resource');
var load = require('tower-load');
var proto = require('./lib/proto');
var statics = require('./lib/static');
var slice = [].slice;

/**
 * Expose `resource`.
 */

exports = module.exports = resource;

/**
 * Expose `collection`
 */

exports.collection = [];

/**
 * Expose `validator`.
 */

exports.validator = validator;

/**
 * Create a new resource constructor with the given `name`.
 *
 * @param {String} name Resource name.
 * @return {Function} The `Resource` class constructor.
 * @api public
 */

function resource(name) {
  if (exports.collection[name]) return exports.collection[name];
  if (exports.load(name)) return exports.collection[name];

  /**
   * Initialize a new resource with the given `attrs`.
   *
   * @class
   * @param {Object} attrs An object with attributes.
   * @param {Boolean} storedAttrs Attributes that should not be dirtied.
   * @api public
   */

  function Resource(attrs, storedAttrs) {
    // XXX: if storedAttrs, don't set to dirty
    this.attrs = {};
    this.dirty = {};
    this._callbacks = {};
    attrs = Resource._defaultAttrs(attrs, this);

    for (var key in attrs) {
      if (attrs.hasOwnProperty(key))
        this.set(key, attrs[key], true);
    }

    Resource.emit('init', this);
  }

  Resource.toString = function toString(){
    return 'resource("' + name + '")';
  }

  // statics

  Resource.className = name;
  Resource.id = name;
  Resource.attrs = [];
  // optimization
  Resource.attrs.__default__ = {};
  Resource.validators = [];
  Resource.prototypes = [];
  Resource.relations = [];
  Resource._callbacks = {};
  // starting off context
  Resource.context = Resource;

  for (var key in statics) Resource[key] = statics[key];

  // prototype

  Resource.prototype = {};
  Resource.prototype.constructor = Resource;
  
  for (var key in proto) Resource.prototype[key] = proto[key];

  Resource.action = stream.ns(name);
  Resource.id();

  exports.collection[name] = Resource;
  exports.collection.push(Resource);
  exports.emit('define', Resource);
  exports.emit('define ' + name, Resource);

  return Resource;
}

/**
 * Mixin `Emitter`.
 */

Emitter(resource);
Emitter(statics);
Emitter(proto);

/**
 * Mixins.
 */

exports.use = function(obj){
  if ('function' === typeof obj) {
    obj.call(exports, statics, proto, exports);
  } else {
    for (var key in obj) statics[key] = obj[key]
  }
};

/**
 * Lazy-load stuff for a particular constructor.
 *
 * Example:
 *
 *    resource.load('user', require.resolve('./lib/user'));
 *
 * @param {String} name Resource name.
 * @param {String} path Resource path.
 * @api public
 */

exports.load = function(name, path){
  return 1 === arguments.length
    ? load(exports, name)
    : load.apply(load, [exports].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Create a `resource` function that
 * just prepends a namespace to every key.
 *
 * This is used to make the DSL simpler,
 * check out the `tower-adapter` code for an example.
 *
 * @param {String} ns The namespace.
 * @return {Resource} The resource.
 * @api public
 */

exports.ns = function(ns){
  function resource(name) {
    return exports(ns + '.' + name);
  }

  // XXX: copy functions?
  for (var key in exports) {
    if ('function' === typeof exports[key])
      resource[key] = exports[key];
  }
  return resource;
};

/**
 * Check object is a `Resource` object.
 * XXX: maybe remove "resource('name')" as toString.
 *
 * @param {Object} obj A JavaScript object.
 * @return {Boolean} true if obj is a `Resource` object, otherwise false.
 * @api public
 */

exports.is = function(obj){
  return obj && obj.constructor.toString().indexOf('resource(') === 0;
};

/**
 * Clear resources.
 *
 * @return {Function} exports The main `resource` function.
 * @api public
 */

exports.clear = function(){
  exports.collection.forEach(function(emitter){
    emitter.off('define');
    delete exports.collection[emitter.className];
  });

  exports.collection.length = 0;

  return exports;
};
});
require.register("tower-resource/lib/static.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var attr = require('tower-attr');
var validator = require('tower-validator').ns('resource');
var text = require('tower-text'); // XXX: rename `tower-text`?
var query = require('tower-query');
var series = require('part-async-series');

text('resource.error', 'Resource validation failed');

/**
 * Instantiate a new `Resource`.
 *
 * @constructor Resource
 * @param {Object} attrs Resource attributes.
 * @param {Boolean} storedAttrs Boolean to enable caching attributes.
 * @return {Object} instance.
 */

exports.init = function(attrs, storedAttrs){
  return new this(attrs, storedAttrs);
};

/**
 * Check if this resource is new.
 *
 * @constructor Resource
 * @param {Object} data The attributes to test.
 * @return {Boolean} true if resource is new, else false.
 * @api public
 */

exports.isNew = function(data){
  return !has(data, this.primaryKey);
};

/**
 * Use the given plugin `fn()`.
 *
 * @constructor Resource
 * @chainable
 * @param {Function} fn Plugin function.
 * @return {Function} exports The main `resource` function.
 * @api public
 */

exports.use = function(fn){
  fn(this);
  return this;
};

/**
 * Add validation `fn()`.
 *
 * @constructor Resource
 * @chainable
 * @param {Function} fn Validation function.
 * @return {Function} exports The main `resource` function.
 * @api public
 */

exports.validate = function(key, val){
  // XXX: add validator to validate attributes.
  if (!this.validators.attrs && this !== this.context) {
    var self = this;
    this.validators.attrs = true;
    this.validator(function validateAttributes(obj, fn){
      var validators = [];

      self.attrs.forEach(function(attr){
        if (attr.validators && attr.validators.length) {
          validators.push(function validate(obj){
            attr.validate(obj);
          });
        }
      });

      series(validators, obj, fn);
    });
  }
  
  if ('function' === typeof key)
    this.validator(key);
  else
    this.context.validator(key, val);

  return this;
};

/**
 * Add a validation function to a list of validators.
 *
 * @constructor Resource
 * @chainable
 * @param key Resource property.
 * @param val Resource property value.
 * @return {Function} exports The main `resource` function.
 * @api public
 */

exports.validator = function(key, val){
  if ('function' === typeof key) {
    // XXX: needs to handle pushing errors.
    this.validators.push(key);
  } else {
    var assert = validator(key);
    // XXX: should be set somewhere earlier.
    var path = this.path || 'resource.' + this.className + '.' + key;

    this.validators.push(function validate(obj, fn){
      if (!assert(obj, val)) {
        // XXX: hook into `tower-text` for I18n
        var error = text.has(path)
          ? text(path).render(obj)
          : text('resource.error').render(obj);

        obj.errors[attr.name] = error;
        obj.errors.push(error);
      }
    });
  }
  return this;
};

/**
 * Define an `id`.
 *
 * @constructor Resource
 * @chainable
 * @param {String} name
 * @param {Object} options
 * @return {Function} exports The main `resource` function.
 * @api public
 */

exports.id = function(name, type, options){
  options || (options = {});
  return this.attr(name || 'id', type || 'id', options);
};

/**
 * Define attr with the given `name` and `options`.
 *
 * @constructor Resource
 * @chainable
 * @param {String} name
 * @param {Object} options
 * @return {Function} exports The main `resource` function.
 * @api public
 */

exports.attr = function(name, type, options){
  var obj = this.context = attr(name, type, options, this.id + '.' + name);

  // set?
  this.attrs[name] = obj;
  this.attrs.push(obj);
  // optimization
  if (obj.hasDefaultValue) this.attrs.__default__[name] = obj;

  // implied pk
  if ('id' === name) {
    options.primaryKey = true;
    this.primaryKey = name;
  }

  return this;
};

/**
 * Insert/POST/create a new record.
 *
 * @constructor Resource
 * @param {Object} attrs Initial record attribute values.
 * @param {Function} fn Function called on record creation.
 * @return {Topology} A stream object.
 * @api public
 */

exports.create = function(attrs, fn){
  if ('function' === typeof attrs) {
    fn = attrs;
    attrs = undefined;
  }
  return this.init(attrs).save(fn);
};

/**
 * Save/PUT/update an existing record.
 *
 * @constructor Resource
 * @param {Object} attrs Record attribute values to be updated to.
 * @param {Function} fn Function called on record update.
 * @return {Topology} A stream object.
 * @api public
 */

exports.save = function(attrs, fn){
  if ('function' === typeof attrs) {
    fn = attrs;
    attrs = undefined;
  }
  return this.init(attrs).save(fn);
};

/**
 * Make a SELECT query on className and name.
 *
 * @param {String} name An appended namespace.
 * @return {Query} Query object containing query results.
 * @api public
 */

exports.query = function(name){
  return null == name
    ? query().select(this.className)
    // XXX: this should only happen first time.
    : query(this.className + '.' + name).select(this.className);
};

/**
 * Execute find query with `fn`.
 *
 * @constructor Resource
 * @param {Function} fn Function executed on query `find` call.
 * @return {Query} Query object containing query results.
 */

exports.find = function(fn){
  return this.query().find(fn);
};

/**
 * Remove all records of this type.
 *
 * @constructor Resource
 * @param {Function} fn Function executed on query `remove` call.
 * @return {Query} Query object containing query results.
 * @api public
 */

exports.remove = function(fn){
  return this.query().remove(fn);
};

/**
 * Updates a list of records.
 *
 * @constructor Resource
 * @param {Array} updates List of record attributes to update.
 * @param {Function} fn Function executed on record update.
 * @api public
 */

exports.update = function(updates, fn){
  return this.query().update(updates, fn);
};

/**
 * Begin defining a query.
 *
 * @constructor Resource
 * @param {String} key Attribute path
 * @return {Query} Query object.
 * @api public
 */

exports.where = function(key){
  return this.query().where(key);
};

/**
 * Get all records.
 *
 * @constructor Resource
 * @param {Function} fn Function executed on query `all` call.
 * @return {Query} Query object containing query results.
 */

exports.all = function(fn){
  return this.query().all(fn);
};

/**
 * XXX: Load data into store.
 *
 * @constructor Resource
 * @param {Object} Data to load into store.
 */

exports.load = function(data){
  // XXX require('tower-memory-adapter').load(data);
};

/**
 * Returns the default model attributes with their values.
 *
 * @constructor Resource
 * @return {Object} The default model attributes with their values.
 * @api private
 */

exports._defaultAttrs = function(attrs, binding){
  // XXX: this can be optimized further.
  var defaultAttrs = this.attrs.__default__;
  attrs || (attrs = {});
  for (var name in defaultAttrs) {
    if (undefined === attrs[name])
      attrs[name] = defaultAttrs[name].apply(binding);
  }
  return attrs;
};
});
require.register("tower-resource/lib/proto.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var query = require('tower-query');
var each = require('part-async-series');

/**
 * Save and invoke `fn(err)`.
 *
 * Events:
 *
 *  - `save` on updates and saves
 *  - `saving` pre-update or save, after validation
 *
 * @constructor Resource
 * @param {Function} fn Function invoked on resource creation.
 * @api public
 */

exports.save = function(fn){
  var self = this;
  this.constructor.emit('saving', this);
  this.emit('saving');
  // XXX: needs to somehow set default properties
  // XXX: this itself should probably be
  //      bundled into a topology/stream/action.
  this.validate(function(err){
    if (err) {
      fn(err);
    } else {
      query()
        .select(self.constructor.className)
        .create(self, function(){
          self.dirty = {};
          self.constructor.emit('save', self);
          self.emit('save');
          if (fn) fn(null, self);
        });
    }
  });
};

/**
 * Update and invoke `fn(err)`.
 *
 * @constructor Resource
 * @param {Function} fn Function executed on resource update.
 * @return {Mixed} fn return value.
 * @api private
 */

exports.update = function(fn){
  return query()
    .select(this.constructor.className)
    .action('update', this).exec(fn);
};

/**
 * Remove the resource and mark it as `.removed`
 * and invoke `fn(err)`.
 *
 * Events:
 *
 *  - `removing` before deletion
 *  - `remove` on deletion
 *
 * @constructor Resource
 * @param {Function} fn Function executed on resource removal.
 * @return {Mixed} fn return value.
 * @api public
 */

exports.remove = function(fn){
  return query()
    .select(this.constructor.className)
    .where('id').eq(this.get('id'))
    .action('remove').exec(fn);
};

/**
 * Validate the resource and return a boolean.
 *
 * @constructor Resource
 * @param {Function} fn Validation function.
 * @return {Boolean} true if there were errors, else false.
 * @api public
 */

exports.isValid = function(fn){
  this.validate(fn);
  return 0 === this.errors.length;
};

/**
 * Perform validations.
 *
 * @constructor Resource
 * @param {Function} fn Validation function.
 * @return {Boolean} true if there were errors, else false.
 * @api private
 */

exports.validate = function(fn){
  var self = this;
  this.errors = [];
  this.emit('validating', this);
  // XXX: need single `validateAttributes`
  // XXX: need to store validators by key.
  each(this.constructor.validators, this, function(){
    // self.emit('after-validate', self);
    // self.emit('validated', self);
    self.emit('validate', self);

    if (fn) {
      if (self.errors.length)
        fn(new Error('Validation Error'));
      else
        fn(); 
    }
  });
  return 0 === this.errors.length;
};

/**
 * Set attribute value.
 *
 * @constructor Resource
 * @chainable
 * @param {String} name Attribute name.
 * @param {Mixed} val Attribute value.
 * @param {Boolean} quiet If true, won't dispatch change events.
 * @return {Resource}
 * @api public
 */

exports.set = function(name, val, quiet){
  var attr = this.constructor.attrs[name];
  if (!attr) return; // XXX: throw some error, or dynamic property flag?
  if (undefined === val && attr.hasDefaultValue)
    val = attr.apply(this);
  val = attr.typecast(val);
  var prev = this.attrs[name];
  this.dirty[name] = val;
  this.attrs[name] = val;

  // XXX: this `quiet` functionality could probably be implemented
  //   in a less ad-hoc way. It is currently only used when setting
  //   properties passed in through `init`, such as from a db/adapter
  //   serializing data into a resource, doesn't need to dispatch changes.
  if (!quiet) {
    this.constructor.emit('change ' + name, this, val, prev);
    this.emit('change ' + name, val, prev); 
  }
  return this;
};

/**
 * Get `name` value.
 *
 * @constructor Resource
 * @param {String} name Attribute name.
 * @return {Mixed} Attribute value.
 * @api public
 */

exports.get = function(name){
  // XXX: need a better way to do this
  if ('id' === name && this.__id__) return this.__id__;
  if (undefined === this.attrs[name]) {
    var attr = this.defaultAttr(name)
    if (attr)
      return this.attrs[name] = attr.apply(this);
  } else {
    return this.attrs[name];
  }
};

/**
 * Check if `attr` is present (not `null` or `undefined`).
 *
 * @constructor Resource
 * @param {String} attr Attribute name.
 * @return {Boolean} true if attribute exists, else false.
 * @api public
 */

exports.has = function(attr){
  return null != this.attrs[attr];
};

/**
 * Return the JSON representation of the resource.
 *
 * @constructor Resource
 * @return {Object} Resource attributes.
 * @api public
 */

exports.toJSON = function(){
  return this.attrs;
};

/**
 * Returns `Attr` definition if it has a default value.
 *
 * @constructor Resource
 * @param {String} name Attribute name.
 * @return {Boolean|Function} Attr definition if it exists, else.
 * @api private
 */

exports.defaultAttr = function(name){
  var defaultAttrs = this.constructor.attrs.__default__;
  return defaultAttrs.hasOwnProperty(name) && defaultAttrs[name];
};
});
require.register("tower-program/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');
var stream = require('tower-stream').ns('program');
var proto = require('./lib/proto');
var statics = require('./lib/statics');

/**
 * Expose `program`.
 */

exports = module.exports = program;

/**
 * Expose `collection`.
 */

exports.collection = [];

/**
 * Get/set `Program`.
 */

function program(name) {
  if (exports.collection[name])
    return exports.collection[name];

  function Program(name) {
    this.inputs = initStreams(Program.inputs);
    this.outputs = initStreams(Program.outputs);
  }

  // statics

  for (var key in statics) Program[key] = statics[key];

  Program.id = name;
  Program.inputs = [];
  Program.outputs = [];
  Program.stream = stream.ns(name);

  // prototype

  Program.prototype = {};
  Program.prototype.constructor = Program;
  
  for (var key in proto) Program.prototype[key] = proto[key];

  exports.collection[name] = Program;
  exports.collection.push(Program);

  return Program;
}

function initStreams(streams) {
  var result = [];
  for (var name in streams) {
    result.push(streams[name].create());
  }
  return result;
}
});
require.register("tower-program/lib/proto.js", function(exports, require, module){

exports.input = function(name, fn){
  if (undefined === fn) return this.inputs[name];
  this.inputs[name] = fn;
  this.inputs.push(fn);
  return this;
};

exports.output = function(name, fn){
  if (undefined === fn) return this.outputs[name];
  this.outputs[name] = fn;
  this.outputs.push(fn);
  return this;
};
});
require.register("tower-program/lib/statics.js", function(exports, require, module){

/**
 * Instantiate a new `Program`.
 *
 * @param {Object} options
 * @return {Program}
 */

exports.init = function(options){
  return new this(options);
};

/**
 * Define input by `name`.
 *
 * @param {String} name
 * @param {Mixed} obj Function or stream constructor.
 */

exports.input = function(name, obj){
  // XXX: 'function' === typeof obj ...
  this.inputs[name] = obj = this.stream(name, obj);
  // this.inputs.push(obj);
  return this;
};

/**
 * Define output by `name`.
 *
 * @param {String} name
 * @param {Mixed} obj Function or stream constructor.
 */

exports.output = function(name, obj){
  this.outputs[name] = obj = this.stream(name, obj);
  //this.outputs.push(obj);
  return this;
};
});
require.register("part-each-array/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var nativeForEach = [].forEach;

/**
 * Expose `each`.
 */

module.exports = each;

/**
 * Array iterator.
 */

function each(arr, iterator, context) {
  if (null == arr) return;
  if (nativeForEach && arr.forEach === nativeForEach) {
    arr.forEach(iterator, context);
  } else {
    for (var i = 0, n = arr.length; i < n; i++) {
      if (false === iterator.call(context, arr[i], i, arr)) return;
    }
  }
}

});
require.register("tower-query/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var each = require('part-each-array');
var isArray = require('part-is-array');
var Constraint = require('./lib/constraint');
var validate = require('./lib/validate');
var validateConstraints = require('./lib/validate-constraints');
var filter = require('./lib/filter');
var subscriber = require('./lib/subscriber');

/**
 * Expose `query`.
 */

exports = module.exports = query;

/**
 * Expose `Query`.
 */

exports.Query = Query;

/**
 * Expose `Constraint`.
 */

exports.Constraint = Constraint;

/**
 * Wrap an array for chaining query criteria.
 *
 * @param {String} name A query name.
 * @return {Query} A query.
 * @api public
 */

function query(name) {
  return null == name
    ? new Query
    : exports.collection[name]
      ? exports.collection[name].clone()
      : (exports.collection[name] = new Query(name));
}

/**
 * Named queries.
 */

exports.collection = {};

/**
 * Queryable adapters.
 */

exports.adapters = [];

/**
 * Expose `filter`.
 */

exports.filter = filter;

/**
 * Validate query constraints.
 */

exports.validate = validateConstraints;

/**
 * Make an adapter queryable.
 *
 * XXX: The main reason for doing it this way
 *      is to not create circular dependencies.
 *
 * @chainable
 * @param {Adapter} adapter An adapter object.
 * @return {Function} exports The main `query` function.
 * @api public
 */

exports.use = function(adapter){
  exports.adapters[adapter.name] = adapter;
  exports.adapters.push(adapter);
  return exports;
};

/**
 * Class representing a query.
 *
 * @class
 * @param {String} name A query instance's name.
 * @api public
 */

function Query(name) {
  this.name = name;
  this.constraints = [];
  this.resources = [];
  this.sorting = [];
  this.paging = {};
  // XXX: accomplish both joins and graph traversals.
  this.relations = [];
  // this.starts = []
  // this.groupings = {}
}

/**
 * Explicitly tell the query what adapters to use.
 *
 * If not specified, it will do its best to find
 * the adapter. If one or more are specified, the
 * first specified will be the default, and its namespace
 * can be left out of the resources used in the query
 * (e.g. `user` vs. `facebook.user` if `query().use('facebook').select('user')`).
 *
 * @chainable
 * @param {Mixed} name Name of the adapter, or the adapter object itself.
 *   In `package.json`, maybe this is under a `"key": "memory"` property.
 * @return {Query}
 * @api public
 */

Query.prototype.use = function(name){
  (this.adapters || (this.adapters = []))
    .push('string' === typeof name ? exports.adapters[name] : name);
  return this;
};

/**
 * The starting table or record for the query.
 *
 * @chainable
 * @param {String} key The starting table or record name.
 * @param {Object} val
 * @return {Query}
 * @api public
 */

Query.prototype.start = function(key, val){
  this._start = key;
  (this.starts || (this.starts = [])).push(queryModel(key));
  return this;
};

/**
 * Add a query pattern to be returned.
 * XXX: http://docs.neo4j.org/chunked/stable/query-return.html
 *
 * @param {String} key A query pattern that you want to be returned.
 * @return {Query}
 */

Query.prototype.returns = function(key){
  this.resources.push(queryAttr(key, this._start));
  return this;
};

/**
 * Start a SELECT query.
 *
 * @chainable
 * @param {String} key A record or table name.
 * @return {Query}
 * @api public
 */
Query.prototype.resource = function(key){
  this._start = this._start || key;
  this.resources.push(queryModel(key, this._start));
  return this;
};

/**
 * Add a WHERE clause.
 *
 * @param {String} key A record or table property/column name.
 * @return {Query}
 * @api public
 */
Query.prototype.where = function(key){
  this.context = key;
  return this;
};

/**
 * In a graph database, the data pointing _to_ this node.
 * In a relational/document database, the records with
 * a foreign key pointing to this record or set of records.
 *
 * Example:
 *
 *    query().start('users')
 *      .incoming('friends')
 *      .incoming('friends');
 *
 * @chainable
 * @param {String} key Name of the data coming to the start node.
 * @return {Query}
 * @api public
 */

Query.prototype.incoming = function(key){
  return this.relation('incoming', key);
};

/**
 * In a graph database, the data pointing _from_ this node.
 * In a relational/document database, the record this
 * record points to via its foreign key.
 *
 * Example:
 *
 *    query().start('users')
 *      .outgoing('friends')
 *      .outgoing('friends');
 *
 * @chainable
 * @param {String} key Name of the data going out from the start node.
 * @return {Query}
 * @api public
 */

Query.prototype.outgoing = function(key){
  return this.relation('outgoing', key);
};

/**
 * What the variable should be called for the data returned.
 * References the previous item in the query.
 *
 * Example:
 *
 *    query().start('users').as('people');
 *
 * @param {String} key The data's new variable name.
 * @return {Query}
 * @api public
 */

Query.prototype.as = function(key){
  // XXX: todo
  this.resources[this.resources.length - 1].alias = key;
  return this;
};

/**
 * Append constraint to query.
 *
 * Example:
 *
 *    query().start('users').where('likeCount').lte(200);
 *
 * @param {String} key The property to compare `val` to.
 * @param {Number|Date} val The number or date value.
 * @api public
 */

each(['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'nin', 'match'], function(operator){
  Query.prototype[operator] = function(val){
    return this.constraint(this.context, operator, val);
  }
});

/**
 * Check if the value exists within a set of values.
 *
 * @chainable
 * @param {Object} val The constraint value.
 * @return {Query}
 * @api public
 */

Query.prototype.contains = function(val){
  return this.constraint(this.context, 'in', val);
};

/**
 * Append action to query, then execute.
 *
 * Example:
 *
 *    query().start('users')
 *      .insert({ email: 'john.smith@gmail.com' });
 *
 *    query().start('users').query(fn);
 *
 * @api public
 */

each([
    'select'
  , 'pipe'
  , 'stream'
  , 'count'
  , 'exists'
], function(action){
  Query.prototype[action] = function(fn){
    return this.action(action).exec(fn);
  }
});

/**
 * Create one or more records.
 *
 * This is different from the other actions 
 * in that it can take data (records) as arguments.
 *
 * Example:
 *
 *    query()
 *      .use('memory')
 *      .select('post')
 *      .create({ title: 'Foo' }, function(err, post){
 *
 *      });
 *
 * @param {Object} data Data record.
 * @param {Function} fn Function to be executed on record creation.
 * @return {Mixed} Whatever `fn` returns on the `create` action.
 * @api public
 */

Query.prototype.create = function(data, fn){
  return this.action('create', data).exec(fn);
};

/**
 * Update one or more records.
 *
 * This is different from the other actions
 * in that it can take data (records) as arguments.
 *
 * Example:
 *
 *    query()
 *      .use('memory')
 *      .select('post')
 *      .update({ title: 'Foo' }, function(err, post){
 *
 *      });
 *
 * @param {Object} data Data record.
 * @param {Function} fn Function to be executed on record update.
 * @return {Mixed} Whatever `fn` returns on the `update` action.
 * @api public
 */

Query.prototype.update = function(data, fn){
  return this.action('update', data).exec(fn);
};

Query.prototype.remove = function(data, fn){
  return 2 === arguments.length
    ? this.action('remove', data).exec(fn)
    : this.action('remove').exec(data);
};

/**
 * Return the first record that matches the query pattern.
 *
 * @param {Function} fn Function to execute on records after `find` action finishes.
 * @api public
 */

Query.prototype.first = function(fn){
  this.limit(1).action('find').exec(function(err, records){
    if (err) return fn(err);
    fn(err, records[0]);
  });
};

/**
 * Return the last record that matches the query pattern.
 *
 * @param {Function} fn Function to execute on records after `find` action finishes.
 * @api public
 */

Query.prototype.last = function(fn){
  this.limit(1).action('find').exec(function(err, records){
    if (err) return fn(err);
    fn(err, records[0]);
  });
};

/**
 * Add a record query LIMIT.
 *
 * @chainable
 * @param {Integer} val The record limit.
 * @return {Query}
 * @api public
 */

Query.prototype.limit = function(val){
  this.paging.limit = val;
  return this;
};

/**
 * Specify the page number.
 *
 * Use in combination with `limit` for calculating `offset`.
 *
 * @chainable
 * @param {Integer} val The page number.
 * @return {Query}
 * @api public
 */

Query.prototype.page = function(val){
  this.paging.page = val;
  return this;
};

/**
 * Specify the offset.
 *
 * @chainable
 * @param {Integer} val The offset value.
 * @return {Query}
 * @api public
 */
Query.prototype.offset = function(val){
  this.paging.offset = val;
  return this;
};

/**
 * Sort ascending by `key`.
 *
 * If the key is a property name, it will
 * be combined with the table/collection name
 * defined somewhere earlier in the query.
 *
 * Example:
 *
 *    query().start('users').asc('createdAt');
 *
 * @chainable
 * @param {String} key A property name.
 * @return {Query}
 * @api public
 */

Query.prototype.asc = function(key){
  return this.sort(key, 1);
};

/**
 * Sort descending by `key`.
 *
 * If the key is a property name, it will
 * be combined with the table/collection name
 * defined somewhere earlier in the query.
 *
 * Example:
 *
 *    query().start('users').desc('createdAt');
 *
 * @chainable
 * @param {String} key A property name.
 * @return {Query}
 * @api public
 */

Query.prototype.desc = function(key){
  return this.sort(key, -1);
};

/**
 * Pushes a `"relation"` onto the query.
 *
 * @chainable
 * @param {String} dir The direction.
 * @param {String} key The key.
 * @return {Query}
 * @api private
 */

Query.prototype.relation = function(dir, key){
  var attr = queryAttr(key, this._start);
  attr.direction = dir;
  this.relations.push(attr);
  return this;
};

/**
 * Pushes a `"constraint"` onto the query.
 *
 * @chainable
 * @param {String} key The constraint key.
 * @param {String} op Operator string
 * @param {Object} val The constraint value.
 * @return {Query}
 * @api public
 *
 * @see http://en.wikipedia.org/wiki/Lagrange_multiplier
 */

Query.prototype.constraint = function(key, op, val){
  this.constraints.push(new Constraint(key, op, val, this._start));
  return this;
};

/**
 * Pushes an `"action"` onto the query.
 *
 * Example:
 *
 *    query().action('insert', { message: 'Test' });
 *    query().action('insert', [ { message: 'one.' }, { message: 'two.' } ]);
 *
 * @chainable
 * @param {String} type The action type.
 * @param {Object|Array} data The data to act on.
 * @return {Query}
 * @api private
 */

Query.prototype.action = function(type, data){
  this.type = type
  this.data = data ? isArray(data) ? data : [data] : undefined;
  return this;
};

// XXX: only do if it decreases final file size
// each(['find', 'create', 'update', 'delete'])

/**
 * Pushes a sort direction onto the query.
 *
 * @chainable
 * @param {String} key The property to sort on.
 * @param {Integer} dir Direction it should point (-1, 1, 0).
 * @return {Query}
 * @api private
 */

Query.prototype.sort = function(key, dir){
  var attr = queryAttr(key, this._start);
  attr.direction = key;
  this.sorting.push(attr);
  return this;
};

/**
 * A way to log the query criteria,
 * so you can see if the adapter supports it.
 *
 * @chainable
 * @param {Function} fn The query criteria logging function
 * @return {Query}
 * @api public
 */

Query.prototype.explain = function(fn){
  this._explain = fn;
  return this;
};

/**
 * Clone the current `Query` object.
 *
 * @return {Query} A cloned `Query` object.
 * @api public
 */

Query.prototype.clone = function(){
  return new Query(this.name);
};

/**
 * Execute the query.
 * XXX: For now, only one query per adapter.
 *      Later, you can query across multiple adapters
 *
 * @see http://en.wikipedia.org/wiki/Query_optimizer
 * @see http://en.wikipedia.org/wiki/Query_plan
 * @see http://homepages.inf.ed.ac.uk/libkin/teach/dbs12/set5.pdf
 * @param {Function} fn Function that gets called on adapter execution.
 * @return {Mixed} Whatever `fn` returns on execution.
 * @api public
 */

Query.prototype.exec = function(fn){
  this.context = this._start = undefined;
  var adapter = this.adapters && this.adapters[0] || exports.adapters[0];
  this.validate(function(){});
  if (this.errors && this.errors.length) return fn(this.errors);
  if (!this.resources[0]) throw new Error('Must `.select(resourceName)`');
  return adapter.exec(this, fn);
};

/**
 * Validate the query on all adapters.
 *
 * @param {Function} fn Function called on query validation.
 * @api public
 */

Query.prototype.validate = function(fn){
  var adapter = this.adapters && this.adapters[0] || exports.adapters[0];
  validate(this, adapter, fn);
};

/**
 * Subscribe to a type of query.
 *
 * @param {Function} fn Function executed on each subscriber output.
 * @api public
 */

Query.prototype.subscribe = function(fn){
  var self = this;
  subscriber.output(this.type, function(record){
    if (self.test(record)) fn(record);
  });
};

/**
 * Define another query on the parent scope.
 *
 * XXX: wire this up with the resource (for todomvc).
 *
 * @param {String} name A query name.
 * @return {Query} A `Query` object.
 * @api public
 */

Query.prototype.query = function(name) {
  return query(name);
};

function queryModel(key) {
  key = key.split('.');

  if (2 === key.length)
    return { adapter: key[0], resource: key[1], ns: key[0] + '.' + key[1] };
  else
    return { resource: key[0], ns: key[0] }; // XXX: adapter: adapter.default()
}

/**
 * Variables used in query.
 */

function queryAttr(val, start){
  var variable = {};

  val = val.split('.');

  switch (val.length) {
    case 3:
      variable.adapter = val[0];
      variable.resource = val[1];
      variable.attr = val[2];
      variable.ns = variable.adapter + '.' + variable.resource;
      break;
    case 2:
      variable.adapter = 'memory'; // XXX: adapter.default();
      variable.resource = val[0];
      variable.attr = val[1];
      variable.ns = variable.resource;
      break;
    case 1:
      variable.adapter = 'memory'; // XXX: adapter.default();
      variable.resource = start;
      variable.attr = val[0];
      variable.ns = variable.resource;
      break;
  }

  variable.path = variable.ns + '.' + variable.attr;

  return variable;
}

function queryValue(val) {
  // XXX: eventually handle relations/joins.
  return { value: val, type: typeof(val) };
}
});
require.register("tower-query/lib/constraint.js", function(exports, require, module){

/**
 * Expose `Constraint`.
 */

module.exports = Constraint;

/**
 * Class representing a query constraint.
 *
 * @class
 *
 * @param {String} a The left constraint.
 * @param {String} operator The constraint.
 * @param {String} b The right constraint.
 * @param {Object} start The starting object.
 * @api public
 */

function Constraint(a, operator, b, start) {
  this.left = left(a, start);
  this.operator = operator;
  this.right = right(b);
}

function left(val, start) {
  var variable = {};

  val = val.split('.');

  switch (val.length) {
    case 3:
      variable.adapter = val[0];
      variable.resource = val[1];
      variable.attr = val[2];
      variable.ns = variable.adapter + '.' + variable.resource;
      break;
    case 2:
      variable.adapter = 'memory'; // XXX: adapter.default();
      variable.resource = val[0];
      variable.attr = val[1];
      variable.ns = variable.resource;
      break;
    case 1:
      variable.adapter = 'memory'; // XXX: adapter.default();
      variable.resource = start;
      variable.attr = val[0];
      variable.ns = variable.resource;
      break;
  }
  
  variable.path = variable.ns + '.' + variable.attr;

  return variable;
}

function right(val) {
  // XXX: eventually handle relations/joins.
  return { value: val, type: typeof(val) };
}
});
require.register("tower-query/lib/validate.js", function(exports, require, module){

/**
 * Expose `validate`.
 */

module.exports = validate;

/**
 * Add validations to perform before this is executed.
 *
 * XXX: not implemented.
 *
 * @param {Query} query A query object.
 * @param {Adapter} adapter An adapter object.
 * @param {Function} fn Function executed at the end of validation.
 */

function validate(query, adapter, fn) {
  // XXX: only supports one action at a time atm.
  var constraints = query.constraints;
  var type = query.type;
  query.errors = [];
  // XXX: collect validators for resource and for each attribute.
  // var resourceValidators = resource(criteria[0][1].ns).validators;
  for (var i = 0, n = constraints.length; i < n; i++) {
    var constraint = constraints[i];

    if (!adapter.action.exists(constraint.left.resource + '.' + type))
      continue;

    var stream = adapter.action(constraint.left.resource + '.' + type);
    var param = stream.params && stream.params[constraint.left.attr];
    if (param && param.validate(query, constraint)) {
      // $ tower list ec2:group --name 'hello-again-again,hello-again'
      constraint.right.value = param.typecast(constraint.right.value);
    }
  }

  query.errors.length ? fn(query.errors) : fn();
}
});
require.register("tower-query/lib/validate-constraints.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var validator = require('tower-validator');

/**
 * Expose `validate`.
 */

module.exports = validate;

/**
 * Validate an object against an array of constraints.
 *
 * To define validations, use the `tower-validator` module.
 * XXX: that isn't implemented yet, they're in here.
 *
 * @param {Object} obj Record or other simple JavaScript object.
 * @param {Array} constraints Array of constraints.
 * @return {Boolean} true if obj passes all constraints, otherwise false.
 */

function validate(obj, constraints) {
  for (var i = 0, n = constraints.length; i < n; i++) {
    // XXX: obj vs. obj.get
    var constraint = constraints[i]
      , left = obj.get ? obj.get(constraint.left.attr) : obj[constraint.left.attr]
      , right = constraint.right.value;

    if (!validator(constraint.operator)(left, right))
      return false;
  }

  return true;
}
});
require.register("tower-query/lib/filter.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var validateConstraints = require('./validate-constraints');

/**
 * Expose `filter`.
 */

module.exports = filter;

/**
 * Filter records based on a set of constraints.
 *
 * This is a robust solution, hooking into an
 * extendable validation system. If you just need
 * something simple, use the built-in `array.filter`.
 *
 * @param {Array} array Array of plain objects (such as records).
 * @param {Array} constraints Array of constraints.
 * @return {Array} The filtered records.
 */

function filter(array, constraints) {
  if (!constraints.length) return array;

  var result = [];

  // XXX: is there a more optimal algorithm?
  for (var i = 0, n = array.length; i < n; i++) {
    if (validateConstraints(array[i], constraints))
      result.push(array[i]);
  }

  return result;
}
});
require.register("tower-query/lib/subscriber.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var program = require('tower-program');

/**
 * Expose `query-subscriber` program.
 */

module.exports = subscriber();

/**
 * Define a query subscribing program.
 *
 * @return {Program} A query subscriber program.
 */

function subscriber() {
  program('query-subscriber')
    .input('create')
    .input('update')
    .input('remove');

  return program('query-subscriber').init();
}
});
require.register("tower-adapter/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');
var stream = require('tower-stream');
var resource = require('tower-resource');
var query = require('tower-query');
var type = require('tower-type');
var load = require('tower-load');

/**
 * Expose `adapter`.
 */

exports = module.exports = adapter;

/**
 * Expose `collection`.
 */

exports.collection = [];

/**
 * Expose `Adapter` constructor.
 */

exports.Adapter = Adapter;

/**
 * Lazily get an adapter instance by `name`.
 *
 * @param {String} name An adapter name.
 * @return {Adapter} An adapter.
 * @api public
 */

function adapter(name) {
  if (exports.collection[name]) return exports.collection[name];
  if (exports.load(name)) return exports.collection[name];

  var obj = new Adapter(name);
  exports.collection[name] = obj;
  // exports.collection.push(obj);
  // XXX: if has any event listeners...
  exports.emit('define', obj);
  return obj;
}

/**
 * Mixin `Emitter`.
 */

Emitter(exports);

/**
 * Lazy-load adapters.
 *
 * @param {String} name An adapter name.
 * @return {Adapter} An adapter.
 * @api public
 */

exports.load = function(name, path){
  return 1 === arguments.length
    ? load(exports, name)
    : load.apply(load, [exports].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Check if adapter `name` exists.
 *
 * @param {String} name An adapter name.
 * @return {Boolean} true if adapter exists, otherwise false.
 * @api public
 */

exports.exists = function(name){
  return !!exports.collection[name];
};

// XXX: remove `exists` in favor of `has`.
exports.has = exports.exists;

/**
 * Class representing an abstraction over remote services and databases.
 *
 * @class
 *
 * @param {String} name An adapter name.
 * @api public
 */

function Adapter(name) {
  this.name = name;
  this.context = this;
  this.types = {};
  this.settings = {};
  // XXX
  this.resources = {};
  this.connections = {};
  //this.resource = this.resource.bind(this);
  // XXX: refactor, should handle namespacing.
  this.resource = resource.ns(name);
  this.action = stream.ns(name);
  // XXX: todo
  // this.type = type.ns(name);

  // make queryable.
  // XXX: add to `clear` for both (or something like).
  query.use(this);
}

/**
 * Start a query against this adapter.
 *
 * @return {Mixed} Whatever the implementation of the use function attribute returns.
 * @api public
 */

Adapter.prototype.query = function(){
  return query().use(this);
};

/**
 * Use database/connection (config).
 *
 * @param {String} name An adapter name.
 * @api public
 */

Adapter.prototype.use = function(name){
  throw new Error('Adapter#use not implemented');
};

/**
 * Define connection settings.
 *
 * @param {String} name An adapter name.
 * @param {Object} options Adapter options.
 * @api public
 */

Adapter.prototype.connection = function(name, options){
  if (1 === arguments.length && 'string' == typeof name) {
    setting = this.context = settings[name]
    return this;
  }

  if ('object' === typeof name) options = name;
  options || (options = {});
  options.name || (options.name = name);
  setting = this.context = settings[options.name] = options;

  return this;
};

/**
 * Datatype serialization.
 *
 * @chainable
 * @param {String} name An adapter name.
 * @return {Adapter}
 * @api public
 */

Adapter.prototype.type = function(name){
  this.context =
    this.types[name] || (this.types[name] = type(this.name + '.' + name));
  return this;
};

/**
 * Delegate to `type`.
 *
 * XXX: This may just actually become the `type` object itself.
 *
 * @chainable
 * @param {String} name An adapter name.
 * @return {Adapter}
 * @api public
 */

Adapter.prototype.serializer = function(name){
  // `this.types[x] === this.context`
  this.context.serializer(name);
  return this;
};

/**
 * Set a `to` relationship.
 *
 * @chainable
 * @param {Function} fn Function executed on `to` query.
 * @return {Adapter}
 * @api public
 */

Adapter.prototype.to = function(fn){
  this.context.to(fn);
  return this;
};

/**
 * Set a `from` relationship.
 *
 * @chainable
 * @param {Function} fn Function executed on `from` query.
 * @return {Adapter}
 * @api public
 */

Adapter.prototype.from = function(fn){
  this.context.from(fn);
  return this;
};

/**
 * Main Adapter function the query object executes which you need to implement on your own adapter.
 *
 * @chainable
 * @param {Query} query A query object.
 * @param {Function} fn Adapter implementation function.
 * @return {Adapter}
 * @api public
 */

Adapter.prototype.exec = function(query, fn){
  throw new Error('Adapter#exec not implemented.');
};

/**
 * Reset the context to `this`.
 *
 * @chainable
 * @return {Adapter}
 * @api public
 */

Adapter.prototype.self = function(){
  return this.context = this;
};

var methods = [ 'connect', 'disconnect', 'query', 'use', 'type', 'to', 'from' ];

Adapter.prototype.api = function(){
  if (this._api) return this._api;

  var self = this;

  function fn(name) {
    return name
      ? self.query().select(name)
      : self;
  }

  var i = methods.length;
  while (i--)
    api(fn, methods[i], this);

  return this._api = fn;
};

function api(fn, method, adapter) {
  fn[method] = function(){
    return adapter[method].apply(adapter, arguments);
  }
}
});

require.register("visionmedia-debug/debug.js", function(exports, require, module){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    fmt = coerce(fmt);

    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

/**
 * Coerce `val`.
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

// persist

try {
  if (window.localStorage) debug.enable(localStorage.debug);
} catch(e){}

});
require.register("component-props/index.js", function(exports, require, module){
/**
 * Global Names
 */

var globals = /\b(Array|Date|Object|Math|JSON)\b/g;

/**
 * Return immediate identifiers parsed from `str`.
 *
 * @param {String} str
 * @param {String|Function} map function or prefix
 * @return {Array}
 * @api public
 */

module.exports = function(str, fn){
  var p = unique(props(str));
  if (fn && 'string' == typeof fn) fn = prefixed(fn);
  if (fn) return map(str, p, fn);
  return p;
};

/**
 * Return immediate identifiers in `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function props(str) {
  return str
    .replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '')
    .replace(globals, '')
    .match(/[a-zA-Z_]\w*/g)
    || [];
}

/**
 * Return `str` with `props` mapped with `fn`.
 *
 * @param {String} str
 * @param {Array} props
 * @param {Function} fn
 * @return {String}
 * @api private
 */

function map(str, props, fn) {
  var re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
  return str.replace(re, function(_){
    if ('(' == _[_.length - 1]) return fn(_);
    if (!~props.indexOf(_)) return _;
    return fn(_);
  });
}

/**
 * Return unique array.
 *
 * @param {Array} arr
 * @return {Array}
 * @api private
 */

function unique(arr) {
  var ret = [];

  for (var i = 0; i < arr.length; i++) {
    if (~ret.indexOf(arr[i])) continue;
    ret.push(arr[i]);
  }

  return ret;
}

/**
 * Map with prefix `str`.
 */

function prefixed(str) {
  return function(_){
    return str + _;
  };
}

});
require.register("component-to-function/index.js", function(exports, require, module){
/**
 * Module Dependencies
 */

try {
  var expr = require('props');
} catch(e) {
  var expr = require('props-component');
}

/**
 * Expose `toFunction()`.
 */

module.exports = toFunction;

/**
 * Convert `obj` to a `Function`.
 *
 * @param {Mixed} obj
 * @return {Function}
 * @api private
 */

function toFunction(obj) {
  switch ({}.toString.call(obj)) {
    case '[object Object]':
      return objectToFunction(obj);
    case '[object Function]':
      return obj;
    case '[object String]':
      return stringToFunction(obj);
    case '[object RegExp]':
      return regexpToFunction(obj);
    default:
      return defaultToFunction(obj);
  }
}

/**
 * Default to strict equality.
 *
 * @param {Mixed} val
 * @return {Function}
 * @api private
 */

function defaultToFunction(val) {
  return function(obj){
    return val === obj;
  }
}

/**
 * Convert `re` to a function.
 *
 * @param {RegExp} re
 * @return {Function}
 * @api private
 */

function regexpToFunction(re) {
  return function(obj){
    return re.test(obj);
  }
}

/**
 * Convert property `str` to a function.
 *
 * @param {String} str
 * @return {Function}
 * @api private
 */

function stringToFunction(str) {
  // immediate such as "> 20"
  if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);

  // properties such as "name.first" or "age > 18" or "age > 18 && age < 36"
  return new Function('_', 'return ' + get(str));
}

/**
 * Convert `object` to a function.
 *
 * @param {Object} object
 * @return {Function}
 * @api private
 */

function objectToFunction(obj) {
  var match = {}
  for (var key in obj) {
    match[key] = typeof obj[key] === 'string'
      ? defaultToFunction(obj[key])
      : toFunction(obj[key])
  }
  return function(val){
    if (typeof val !== 'object') return false;
    for (var key in match) {
      if (!(key in val)) return false;
      if (!match[key](val[key])) return false;
    }
    return true;
  }
}

/**
 * Built the getter function. Supports getter style functions
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function get(str) {
  var props = expr(str);
  if (!props.length) return '_.' + str;

  var val;
  for(var i = 0, prop; prop = props[i]; i++) {
    val = '_.' + prop;
    val = "('function' == typeof " + val + " ? " + val + "() : " + val + ")";
    str = str.replace(new RegExp(prop, 'g'), val);
  }

  return str;
}

});
require.register("component-each/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var toFunction = require('to-function');
var type;

try {
  type = require('type-component');
} catch (e) {
  type = require('type');
}

/**
 * HOP reference.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Iterate the given `obj` and invoke `fn(val, i)`.
 *
 * @param {String|Array|Object} obj
 * @param {Function} fn
 * @api public
 */

module.exports = function(obj, fn){
  fn = toFunction(fn);
  switch (type(obj)) {
    case 'array':
      return array(obj, fn);
    case 'object':
      if ('number' == typeof obj.length) return array(obj, fn);
      return object(obj, fn);
    case 'string':
      return string(obj, fn);
  }
};

/**
 * Iterate string chars.
 *
 * @param {String} obj
 * @param {Function} fn
 * @api private
 */

function string(obj, fn) {
  for (var i = 0; i < obj.length; ++i) {
    fn(obj.charAt(i), i);
  }
}

/**
 * Iterate object keys.
 *
 * @param {Object} obj
 * @param {Function} fn
 * @api private
 */

function object(obj, fn) {
  for (var key in obj) {
    if (has.call(obj, key)) {
      fn(key, obj[key]);
    }
  }
}

/**
 * Iterate array-ish.
 *
 * @param {Array|Object} obj
 * @param {Function} fn
 * @api private
 */

function array(obj, fn) {
  for (var i = 0; i < obj.length; ++i) {
    fn(obj[i], i);
  }
}

});
require.register("component-url/index.js", function(exports, require, module){

/**
 * Parse the given `url`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(url){
  var a = document.createElement('a');
  a.href = url;
  return {
    href: a.href,
    host: a.host || location.host,
    port: ('0' === a.port || '' === a.port) ? port(a.protocol) : a.port,
    hash: a.hash,
    hostname: a.hostname || location.hostname,
    pathname: a.pathname.charAt(0) != '/' ? '/' + a.pathname : a.pathname,
    protocol: !a.protocol || ':' == a.protocol ? location.protocol : a.protocol,
    search: a.search,
    query: a.search.slice(1)
  };
};

/**
 * Check if `url` is absolute.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isAbsolute = function(url){
  return 0 == url.indexOf('//') || !!~url.indexOf('://');
};

/**
 * Check if `url` is relative.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isRelative = function(url){
  return !exports.isAbsolute(url);
};

/**
 * Check if `url` is cross domain.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isCrossDomain = function(url){
  url = exports.parse(url);
  return url.hostname !== location.hostname
    || url.port !== location.port
    || url.protocol !== location.protocol;
};

/**
 * Return default port for `protocol`.
 *
 * @param  {String} protocol
 * @return {String}
 * @api private
 */
function port (protocol){
  switch (protocol) {
    case 'http:':
      return 80;
    case 'https:':
      return 443;
    default:
      return location.port;
  }
}

});
require.register("component-live-css/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var request = require('superagent')
  , debug = require('debug')('live-css')
  , each = require('each')
  , url = require('url');

/**
 * Poll timer.
 */

var timer;

/**
 * Poll interval.
 */

var interval = 1000;

/**
 * Etag map.
 */

var etags = {};

/**
 * Last-Modified map.
 */

var mtimes = {};

/**
 * Start live.
 *
 * @api public
 */

exports.start = function(){
  timer = setTimeout(function(){
    checkAll();
    exports.start();
  }, interval);
};

/**
 * Stop live.
 *
 * @api public
 */

exports.stop = function(){
  clearTimeout(timer);
};

/**
 * Check styles.
 *
 * @api private
 */

function checkAll() {
  var styles = getStyles();
  each(styles, check);
}

/**
 * Check `style`.
 *
 * @param {Element} style
 * @api private
 */

function check(style) {
  var href = style.getAttribute('href');
  var prevEtag = etags[href];
  var prevMtime = mtimes[href];

  request
  .head(href)
  .query({ bust: new Date })
  .end(function(res){
    var etag = res.header.etag;
    if (etag) etags[href] = etag;

    var mtime = res.header['last-modified'];
    if (mtime) mtimes[href] = mtime;

    if (etag && etag != prevEtag) {
      debug('etag mismatch');
      debug('old "%s"', prevEtag);
      debug('new "%s"', etag);
      debug('changed %s', href);
      return refresh(style);
    }

    if (mtime && mtime != prevMtime) {
      debug('mtime mismatch');
      debug('old "%s"', prevMtime);
      debug('new "%s"', mtime);
      debug('changed %s', href);
      return refresh(style);
    }
  });
}

/**
 * Refresh `style`.
 *
 * @param {Element} style
 * @api private
 */

function refresh(style) {
  var parent = style.parentNode;
  var sibling = style.nextSibling;
  var clone = style.cloneNode(true);

  // insert
  if (sibling) {
    parent.insertBefore(clone, sibling);
  } else {
    parent.appendChild(clone);
  }

  // remove prev
  clone.onload = function(){
    parent.removeChild(style);
  };
}

/**
 * Return stylesheet links.
 *
 * @return {Array}
 * @api private
 */

function getStyles() {
  var links = document.getElementsByTagName('link');
  var styles = [];

  each(links, function(link){
    if ('stylesheet' != link.getAttribute('rel')) return;
    if (url.isAbsolute(link.getAttribute('href'))) return;
    styles.push(link);
  });

  return styles;
}
});
require.register("ftlabs-fastclick/lib/fastclick.js", function(exports, require, module){
/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 0.6.11
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specificed layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 */
function FastClick(layer) {
	'use strict';
	var oldOnClick, self = this;


	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * Touchmove boundary, beyond which a click will be cancelled.
	 *
	 * @type number
	 */
	this.touchBoundary = 10;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	if (!layer || !layer.nodeType) {
		throw new TypeError('Layer must be a document node');
	}

	/** @type function() */
	this.onClick = function() { return FastClick.prototype.onClick.apply(self, arguments); };

	/** @type function() */
	this.onMouse = function() { return FastClick.prototype.onMouse.apply(self, arguments); };

	/** @type function() */
	this.onTouchStart = function() { return FastClick.prototype.onTouchStart.apply(self, arguments); };

	/** @type function() */
	this.onTouchMove = function() { return FastClick.prototype.onTouchMove.apply(self, arguments); };

	/** @type function() */
	this.onTouchEnd = function() { return FastClick.prototype.onTouchEnd.apply(self, arguments); };

	/** @type function() */
	this.onTouchCancel = function() { return FastClick.prototype.onTouchCancel.apply(self, arguments); };

	if (FastClick.notNeeded(layer)) {
		return;
	}

	// Set up event handlers as required
	if (this.deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchmove', this.onTouchMove, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {

	// Don't send a synthetic click to disabled inputs (issue #62)
	case 'button':
	case 'select':
	case 'textarea':
		if (target.disabled) {
			return true;
		}

		break;
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if ((this.deviceIsIOS && target.type === 'file') || target.disabled) {
			return true;
		}

		break;
	case 'label':
	case 'video':
		return true;
	}

	return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
		return true;
	case 'select':
		return !this.deviceIsAndroid;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
	'use strict';

	//Issue #159: Android Chrome Select Box does not open with a synthetic click event
	if (this.deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
		return 'mousedown';
	}

	return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	if (this.deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	if (event.targetTouches.length > 1) {
		return true;
	}

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (this.deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!this.deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			if (touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		event.preventDefault();
	}

	return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0], boundary = this.touchBoundary;

	if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
		return true;
	}

	return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
	'use strict';
	if (!this.trackingClick) {
		return true;
	}

	// If the touch has moved, cancel the click tracking
	if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		this.cancelNextClick = true;
		return true;
	}

	// Reset to prevent wrong click cancel on input (issue #156).
	this.cancelNextClick = false;

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (this.deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];

		// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
		targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (this.deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if ((event.timeStamp - trackingClickStart) > 100 || (this.deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		if (!this.deviceIsIOS4 || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (this.deviceIsIOS && !this.deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
	'use strict';

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	if (this.deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchmove', this.onTouchMove, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
	'use strict';
	var metaViewport;
	var chromeVersion;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	// Chrome version - zero for other browsers
	chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

	if (chromeVersion) {

		if (FastClick.prototype.deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');
			
			if (metaViewport) {
				// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// Chrome 32 and above with width=device-width or less don't need FastClick
				if (chromeVersion > 31 && window.innerWidth <= window.screen.width) {
					return true;
				}
			}

		// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
	if (layer.style.msTouchAction === 'none') {
		return true;
	}

	return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.attach = function(layer) {
	'use strict';
	return new FastClick(layer);
};


if (typeof define !== 'undefined' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return FastClick;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = FastClick.attach;
	module.exports.FastClick = FastClick;
} else {
	window.FastClick = FastClick;
}

});
require.register("openautomation/lib/jsmpg.js", function(exports, require, module){
(function(window){ "use strict";

// jsmpeg by Dominic Szablewski - phoboslab.org, github.com/phoboslab
//
// Consider this to be under MIT license. It's largely based an an Open Source
// Decoder for Java under GPL, while I looked at another Decoder from Nokia 
// (under no particular license?) for certain aspects.
// I'm not sure if this work is "derivative" enough to have a different license
// but then again, who still cares about MPEG1?
//
// Based on "Java MPEG-1 Video Decoder and Player" by Korandi Zoltan:
// http://sourceforge.net/projects/javampeg1video/
//
// Inspired by "MPEG Decoder in Java ME" by Nokia:
// http://www.developer.nokia.com/Community/Wiki/MPEG_decoder_in_Java_ME


var requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
})();
		
var jsmpeg = window.jsmpeg = function( url, opts ) {
	opts = opts || {};
	this.benchmark = !!opts.benchmark;
	this.canvas = opts.canvas || document.createElement('canvas');
	this.autoplay = !!opts.autoplay;
	this.loop = !!opts.loop;
	this.externalLoadCallback = opts.onload || null;
	this.externalDecodeCallback = opts.ondecodeframe || null;
	this.bwFilter = opts.bwFilter || false;

	this.customIntraQuantMatrix = new Uint8Array(64);
	this.customNonIntraQuantMatrix = new Uint8Array(64);
	this.blockData = new Int32Array(64);

	this.canvasContext = this.canvas.getContext('2d');

	if( url instanceof WebSocket ) {
		this.client = url;
		this.client.onopen = this.initSocketClient.bind(this);
	} 
	else {
		this.load(url);
	}
};



// ----------------------------------------------------------------------------
// Streaming over WebSockets

jsmpeg.prototype.waitForIntraFrame = true;
jsmpeg.prototype.socketBufferSize = 512 * 1024; // 512kb each
jsmpeg.prototype.onlostconnection = null;

jsmpeg.prototype.initSocketClient = function( client ) {
	this.buffer = new BitReader(new ArrayBuffer(this.socketBufferSize));

	this.nextPictureBuffer = new BitReader(new ArrayBuffer(this.socketBufferSize));
	this.nextPictureBuffer.writePos = 0;
	this.nextPictureBuffer.chunkBegin = 0;
	this.nextPictureBuffer.lastWriteBeforeWrap = 0;

	this.client.binaryType = 'arraybuffer';
	this.client.onmessage = this.receiveSocketMessage.bind(this);
};

jsmpeg.prototype.decodeSocketHeader = function( data ) {
	// Custom header sent to all newly connected clients when streaming
	// over websockets:
	// struct { char magic[4] = "jsmp"; unsigned short width, height; };
	if( 
		data[0] == SOCKET_MAGIC_BYTES.charCodeAt(0) && 
		data[1] == SOCKET_MAGIC_BYTES.charCodeAt(1) && 
		data[2] == SOCKET_MAGIC_BYTES.charCodeAt(2) && 
		data[3] == SOCKET_MAGIC_BYTES.charCodeAt(3)
	) {
		this.width = (data[4] * 256 + data[5]);
		this.height = (data[6] * 256 + data[7]);
		this.initBuffers();
	}
};

jsmpeg.prototype.receiveSocketMessage = function( event ) {
	var messageData = new Uint8Array(event.data);

	if( !this.sequenceStarted ) {
		this.decodeSocketHeader(messageData);
	}

	var current = this.buffer;
	var next = this.nextPictureBuffer;

	if( next.writePos + messageData.length > next.length ) {
		next.lastWriteBeforeWrap = next.writePos;
		next.writePos = 0;
		next.index = 0;
	}
	
	next.bytes.set( messageData, next.writePos );
	next.writePos += messageData.length;

	var startCode = 0;
	while( true ) {
		startCode = next.findNextMPEGStartCode();
		if( 
			startCode == BitReader.NOT_FOUND ||
			((next.index >> 3) > next.writePos)
		) {
			// We reached the end with no picture found yet; move back a few bytes
			// in case we are at the beginning of a start code and exit.
			next.index = Math.max((next.writePos-3), 0) << 3;
			return;
		}
		else if( startCode == START_PICTURE ) {
			break;
		}
	}

	// If we are still here, we found the next picture start code!

	
	// Skip picture decoding until we find the first intra frame?
	if( this.waitForIntraFrame ) {
		next.advance(10); // skip temporalReference
		if( next.getBits(3) == PICTURE_TYPE_I ) {
			this.waitForIntraFrame = false;
			next.chunkBegin = (next.index-13) >> 3;
		}
		return;
	}

	// Last picture hasn't been decoded yet? Decode now but skip output
	// before scheduling the next one
	if( !this.currentPictureDecoded ) {
		this.decodePicture(DECODE_SKIP_OUTPUT);
	}

	
	// Copy the picture chunk over to 'this.buffer' and schedule decoding.
	var chunkEnd = ((next.index) >> 3);

	if( chunkEnd > next.chunkBegin ) {
		// Just copy the current picture chunk
		current.bytes.set( next.bytes.subarray(next.chunkBegin, chunkEnd) );
		current.writePos = chunkEnd - next.chunkBegin;
	}
	else {
		// We wrapped the nextPictureBuffer around, so we have to copy the last part
		// till the end, as well as from 0 to the current writePos
		current.bytes.set( next.bytes.subarray(next.chunkBegin, next.lastWriteBeforeWrap) );
		var written = next.lastWriteBeforeWrap - next.chunkBegin;
		current.bytes.set( next.bytes.subarray(0, chunkEnd), written );
		current.writePos = chunkEnd + written;
	}

	current.index = 0;
	next.chunkBegin = chunkEnd;

	// Decode!
	this.currentPictureDecoded = false;
	requestAnimFrame( this.scheduleDecoding.bind(this), this.canvas );
};

jsmpeg.prototype.scheduleDecoding = function() {
	this.decodePicture();
	this.currentPictureDecoded = true;
};



// ----------------------------------------------------------------------------
// Recording from WebSockets

jsmpeg.prototype.isRecording = false;
jsmpeg.prototype.recorderWaitForIntraFrame = false;
jsmpeg.prototype.recordedFrames = 0;
jsmpeg.prototype.recordedSize = 0;
jsmpeg.prototype.didStartRecordingCallback = null;

jsmpeg.prototype.recordBuffers = [];

jsmpeg.prototype.canRecord = function(){
	return (this.client && this.client.readyState == this.client.OPEN);
};

jsmpeg.prototype.startRecording = function(callback) {
	if( !this.canRecord() ) {
		return;
	}
	
	// Discard old buffers and set for recording
	this.discardRecordBuffers();
	this.isRecording = true;
	this.recorderWaitForIntraFrame = true;
	this.didStartRecordingCallback = callback || null;

	this.recordedFrames = 0;
	this.recordedSize = 0;
	
	// Fudge a simple Sequence Header for the MPEG file
	
	// 3 bytes width & height, 12 bits each
	var wh1 = (this.width >> 4),
		wh2 = ((this.width & 0xf) << 4) | (this.height >> 8),
		wh3 = (this.height & 0xff);
	
	this.recordBuffers.push(new Uint8Array([
		0x00, 0x00, 0x01, 0xb3, // Sequence Start Code
		wh1, wh2, wh3, // Width & height
		0x13, // aspect ratio & framerate
		0xff, 0xff, 0xe1, 0x58, // Meh. Bitrate and other boring stuff
		0x00, 0x00, 0x01, 0xb8, 0x00, 0x08, 0x00, // GOP
		0x00, 0x00, 0x00, 0x01, 0x00 // First Picture Start Code
	]));
};

jsmpeg.prototype.recordFrameFromCurrentBuffer = function() {
	if( !this.isRecording ) { return; }
	
	if( this.recorderWaitForIntraFrame ) {
		// Not an intra frame? Exit.
		if( this.pictureCodingType != PICTURE_TYPE_I ) { return; }
	
		// Start recording!
		this.recorderWaitForIntraFrame = false;
		if( this.didStartRecordingCallback ) {
			this.didStartRecordingCallback( this );
		}
	}
	
	this.recordedFrames++;
	this.recordedSize += this.buffer.writePos;
	
	// Copy the actual subrange for the current picture into a new Buffer
	this.recordBuffers.push(new Uint8Array(this.buffer.bytes.subarray(0, this.buffer.writePos)));
};

jsmpeg.prototype.discardRecordBuffers = function() {
	this.recordBuffers = [];
	this.recordedFrames = 0;
};

jsmpeg.prototype.stopRecording = function() {
	var blob = new Blob(this.recordBuffers, {type: 'video/mpeg'});
	this.discardRecordBuffers();
	this.isRecording = false;
	return blob;
};



// ----------------------------------------------------------------------------
// Loading via Ajax
	
jsmpeg.prototype.load = function( url ) {
	this.url = url;

	var request = new XMLHttpRequest();
	var that = this;
	request.onreadystatechange = function() {		
		if( request.readyState == request.DONE && request.status == 200 ) {
			that.loadCallback(request.response);
		}
	};
	request.onprogress = this.updateLoader.bind(this);
	console.log('GET', url);

	request.open('GET', url);
	request.responseType = "arraybuffer";
	request.send();
};

jsmpeg.prototype.updateLoader = function( ev ) {
	var 
		p = ev.loaded / ev.total,
		w = this.canvas.width,
		h = this.canvas.height,
		ctx = this.canvasContext;

	ctx.fillStyle = '#222';
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, h - h*p, w, h*p);
};
	
jsmpeg.prototype.loadCallback = function(file) {
	var time = Date.now();
	this.buffer = new BitReader(file);
	
	this.findStartCode(START_SEQUENCE);
	this.firstSequenceHeader = this.buffer.index;
	this.decodeSequenceHeader();

	// Load the first frame
	this.nextFrame();
	
	if( this.autoplay ) {
		this.play();
	}

	if( this.externalLoadCallback ) {
		this.externalLoadCallback(this);
	}
};

jsmpeg.prototype.play = function(file) {
	if( this.playing ) { return; }
	this.targetTime = Date.now();
	this.playing = true;
	this.scheduleNextFrame();
};

jsmpeg.prototype.pause = function(file) {
	this.playing = false;
};

jsmpeg.prototype.stop = function(file) {
	if( this.buffer ) {
		this.buffer.index = this.firstSequenceHeader;
	}
	this.playing = false;
	if( this.client ) {
		this.client.close();
		this.client = null;
	}
};



// ----------------------------------------------------------------------------
// Utilities

jsmpeg.prototype.readCode = function(codeTable) {
	var state = 0;
	do {
		state = codeTable[state + this.buffer.getBits(1)];
	} while( state >= 0 && codeTable[state] != 0 );
	return codeTable[state+2];
};

jsmpeg.prototype.findStartCode = function( code ) {
	var current = 0;
	while( true ) {
		current = this.buffer.findNextMPEGStartCode();
		if( current == code || current == BitReader.NOT_FOUND ) {
			return current;
		}
	}
	return BitReader.NOT_FOUND;
};

jsmpeg.prototype.fillArray = function(a, value) {
	for( var i = 0, length = a.length; i < length; i++ ) {
		a[i] = value;
	}
};



// ----------------------------------------------------------------------------
// Sequence Layer

jsmpeg.prototype.pictureRate = 30;
jsmpeg.prototype.lateTime = 0;
jsmpeg.prototype.firstSequenceHeader = 0;
jsmpeg.prototype.targetTime = 0;

jsmpeg.prototype.nextFrame = function() {
	if( !this.buffer ) { return; }
	while(true) {
		var code = this.buffer.findNextMPEGStartCode();
		
		if( code == START_SEQUENCE ) {
			this.decodeSequenceHeader();
		}
		else if( code == START_PICTURE ) {
			if( this.playing ) {
				this.scheduleNextFrame();
			}
			this.decodePicture();
			return this.canvas;
		}
		else if( code == BitReader.NOT_FOUND ) {
			this.stop(); // Jump back to the beginning

			// Only loop if we found a sequence header
			if( this.loop && this.sequenceStarted ) {
				this.play();
			}
			return null;
		}
		else {
			// ignore (GROUP, USER_DATA, EXTENSION, SLICES...)
		}
	}
};

jsmpeg.prototype.scheduleNextFrame = function() {
	this.lateTime = Date.now() - this.targetTime;
	var wait = Math.max(0, (1000/this.pictureRate) - this.lateTime);
	this.targetTime = Date.now() + wait;

	if( this.benchmark ) {
		var now = Date.now();
		if(!this.benchframe) {
			this.benchstart = now;
			this.benchframe = 0;
		}
		this.benchframe++;
		var timepassed = now - this.benchstart;
		if( this.benchframe >= 100 ) {
			this.benchfps = (this.benchframe / timepassed) * 1000;
			if( console ) {
				console.log("frames per second: " + this.benchfps);
			}
			this.benchframe = null;
		}
		setTimeout( this.nextFrame.bind(this), 0);
	}
	else if( wait < 18) {
		this.scheduleAnimation();
	}
	else {
		setTimeout( this.scheduleAnimation.bind(this), wait );
	}
};

jsmpeg.prototype.scheduleAnimation = function() {
	requestAnimFrame( this.nextFrame.bind(this), this.canvas );
};
	
jsmpeg.prototype.decodeSequenceHeader = function() {
	this.width = this.buffer.getBits(12);
	this.height = this.buffer.getBits(12);
	this.buffer.advance(4); // skip pixel aspect ratio
	this.pictureRate = PICTURE_RATE[this.buffer.getBits(4)];
	this.buffer.advance(18 + 1 + 10 + 1); // skip bitRate, marker, bufferSize and constrained bit

	this.initBuffers();

	if( this.buffer.getBits(1) ) { // load custom intra quant matrix?
		for( var i = 0; i < 64; i++ ) {
			this.customIntraQuantMatrix[ZIG_ZAG[i]] = this.buffer.getBits(8);
		}
		this.intraQuantMatrix = this.customIntraQuantMatrix;
	}
	
	if( this.buffer.getBits(1) ) { // load custom non intra quant matrix?
		for( var i = 0; i < 64; i++ ) {
			this.customNonIntraQuantMatrix[ZIG_ZAG[i]] = this.buffer.getBits(8);
		}
		this.nonIntraQuantMatrix = this.customNonIntraQuantMatrix;
	}
};

jsmpeg.prototype.initBuffers = function() {	
	this.intraQuantMatrix = DEFAULT_INTRA_QUANT_MATRIX;
	this.nonIntraQuantMatrix = DEFAULT_NON_INTRA_QUANT_MATRIX;
	
	this.mbWidth = (this.width + 15) >> 4;
	this.mbHeight = (this.height + 15) >> 4;
	this.mbSize = this.mbWidth * this.mbHeight;
	
	this.codedWidth = this.mbWidth << 4;
	this.codedHeight = this.mbHeight << 4;
	this.codedSize = this.codedWidth * this.codedHeight;
	
	this.halfWidth = this.mbWidth << 3;
	this.halfHeight = this.mbHeight << 3;
	this.quarterSize = this.codedSize >> 2;
	
	// Sequence already started? Don't allocate buffers again
	if( this.sequenceStarted ) { return; }
	this.sequenceStarted = true;
	
	
	// Manually clamp values when writing macroblocks for shitty browsers
	// that don't support Uint8ClampedArray
	var MaybeClampedUint8Array = window.Uint8ClampedArray || window.Uint8Array;
	if( !window.Uint8ClampedArray ) {
		this.copyBlockToDestination = this.copyBlockToDestinationClamp;
		this.addBlockToDestination = this.addBlockToDestinationClamp;
	}
	
	// Allocated buffers and resize the canvas
	this.currentY = new MaybeClampedUint8Array(this.codedSize);
	this.currentY32 = new Uint32Array(this.currentY.buffer);

	this.currentCr = new MaybeClampedUint8Array(this.codedSize >> 2);
	this.currentCr32 = new Uint32Array(this.currentCr.buffer);

	this.currentCb = new MaybeClampedUint8Array(this.codedSize >> 2);
	this.currentCb32 = new Uint32Array(this.currentCb.buffer);
	

	this.forwardY = new MaybeClampedUint8Array(this.codedSize);
	this.forwardY32 = new Uint32Array(this.forwardY.buffer);

	this.forwardCr = new MaybeClampedUint8Array(this.codedSize >> 2);
	this.forwardCr32 = new Uint32Array(this.forwardCr.buffer);

	this.forwardCb = new MaybeClampedUint8Array(this.codedSize >> 2);
	this.forwardCb32 = new Uint32Array(this.forwardCb.buffer);
	
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	
	this.currentRGBA = this.canvasContext.getImageData(0, 0, this.width, this.height);

	if( this.bwFilter ) {
		// This fails in IE10; don't use the bwFilter if you need to support it.
		this.currentRGBA32 = new Uint32Array( this.currentRGBA.data.buffer );
	}
	this.fillArray(this.currentRGBA.data, 255);
};




// ----------------------------------------------------------------------------
// Picture Layer

jsmpeg.prototype.currentY = null;
jsmpeg.prototype.currentCr = null;
jsmpeg.prototype.currentCb = null;

jsmpeg.prototype.currentRGBA = null;

jsmpeg.prototype.pictureCodingType = 0;

// Buffers for motion compensation
jsmpeg.prototype.forwardY = null;
jsmpeg.prototype.forwardCr = null;
jsmpeg.prototype.forwardCb = null;

jsmpeg.prototype.fullPelForward = false;
jsmpeg.prototype.forwardFCode = 0;
jsmpeg.prototype.forwardRSize = 0;
jsmpeg.prototype.forwardF = 0;


jsmpeg.prototype.decodePicture = function(skipOutput) {
	this.buffer.advance(10); // skip temporalReference
	this.pictureCodingType = this.buffer.getBits(3);
	this.buffer.advance(16); // skip vbv_delay
	
	// Skip B and D frames or unknown coding type
	if( this.pictureCodingType <= 0 || this.pictureCodingType >= PICTURE_TYPE_B ) {
		return;
	}
	
	// full_pel_forward, forward_f_code
	if( this.pictureCodingType == PICTURE_TYPE_P ) {
		this.fullPelForward = this.buffer.getBits(1);
		this.forwardFCode = this.buffer.getBits(3);
		if( this.forwardFCode == 0 ) {
			// Ignore picture with zero forward_f_code
			return;
		}
		this.forwardRSize = this.forwardFCode - 1;
		this.forwardF = 1 << this.forwardRSize;
	}
	
	var code = 0;
	do {
		code = this.buffer.findNextMPEGStartCode();
	} while( code == START_EXTENSION || code == START_USER_DATA );
	
	
	while( code >= START_SLICE_FIRST && code <= START_SLICE_LAST ) {
		this.decodeSlice( (code & 0x000000FF) );
		code = this.buffer.findNextMPEGStartCode();
	}
	
	// We found the next start code; rewind 32bits and let the main loop handle it.
	this.buffer.rewind(32);

	// Record this frame, if the recorder wants it
	this.recordFrameFromCurrentBuffer();
	
	
	if( skipOutput != DECODE_SKIP_OUTPUT ) {
		if( this.bwFilter ) {
			this.YToRGBA();
		}
		else {
			this.YCbCrToRGBA();	
		}
		this.canvasContext.putImageData(this.currentRGBA, 0, 0);

		if(this.externalDecodeCallback) {
			this.externalDecodeCallback(this, this.canvas);
		}
	}
	
	// If this is a reference picutre then rotate the prediction pointers
	if( this.pictureCodingType == PICTURE_TYPE_I || this.pictureCodingType == PICTURE_TYPE_P ) {
		var 
			tmpY = this.forwardY,
			tmpY32 = this.forwardY32,
			tmpCr = this.forwardCr,
			tmpCr32 = this.forwardCr32,
			tmpCb = this.forwardCb,
			tmpCb32 = this.forwardCb32;

		this.forwardY = this.currentY;
		this.forwardY32 = this.currentY32;
		this.forwardCr = this.currentCr;
		this.forwardCr32 = this.currentCr32;
		this.forwardCb = this.currentCb;
		this.forwardCb32 = this.currentCb32;

		this.currentY = tmpY;
		this.currentY32 = tmpY32;
		this.currentCr = tmpCr;
		this.currentCr32 = tmpCr32;
		this.currentCb = tmpCb;
		this.currentCb32 = tmpCb32;
	}
};

jsmpeg.prototype.YCbCrToRGBA = function() {	
	var pY = this.currentY;
	var pCb = this.currentCb;
	var pCr = this.currentCr;
	var pRGBA = this.currentRGBA.data;

	// Chroma values are the same for each block of 4 pixels, so we proccess
	// 2 lines at a time, 2 neighboring pixels each.
	// I wish we could use 32bit writes to the RGBA buffer instead of writing
	// each byte separately, but we need the automatic clamping of the RGBA
	// buffer.

	var yIndex1 = 0;
	var yIndex2 = this.codedWidth;
	var yNext2Lines = this.codedWidth + (this.codedWidth - this.width);

	var cIndex = 0;
	var cNextLine = this.halfWidth - (this.width >> 1);

	var rgbaIndex1 = 0;
	var rgbaIndex2 = this.width * 4;
	var rgbaNext2Lines = this.width * 4;
	
	var cols = this.width >> 1;
	var rows = this.height >> 1;

	var y, cb, cr, r, g, b;

	for( var row = 0; row < rows; row++ ) {
		for( var col = 0; col < cols; col++ ) {
			cb = pCb[cIndex];
			cr = pCr[cIndex];
			cIndex++;
			
			r = (cr + ((cr * 103) >> 8)) - 179;
			g = ((cb * 88) >> 8) - 44 + ((cr * 183) >> 8) - 91;
			b = (cb + ((cb * 198) >> 8)) - 227;
			
			// Line 1
			y = pY[yIndex1++];
			pRGBA[rgbaIndex1] = y + r;
			pRGBA[rgbaIndex1+1] = y - g;
			pRGBA[rgbaIndex1+2] = y + b;
			rgbaIndex1 += 4;
			
			y = pY[yIndex1++];
			pRGBA[rgbaIndex1] = y + r;
			pRGBA[rgbaIndex1+1] = y - g;
			pRGBA[rgbaIndex1+2] = y + b;
			rgbaIndex1 += 4;
			
			// Line 2
			y = pY[yIndex2++];
			pRGBA[rgbaIndex2] = y + r;
			pRGBA[rgbaIndex2+1] = y - g;
			pRGBA[rgbaIndex2+2] = y + b;
			rgbaIndex2 += 4;
			
			y = pY[yIndex2++];
			pRGBA[rgbaIndex2] = y + r;
			pRGBA[rgbaIndex2+1] = y - g;
			pRGBA[rgbaIndex2+2] = y + b;
			rgbaIndex2 += 4;
		}
		
		yIndex1 += yNext2Lines;
		yIndex2 += yNext2Lines;
		rgbaIndex1 += rgbaNext2Lines;
		rgbaIndex2 += rgbaNext2Lines;
		cIndex += cNextLine;
	}
};

jsmpeg.prototype.YToRGBA = function() {	
	// Luma only
	var pY = this.currentY;
	var pRGBA = this.currentRGBA32;

	var yIndex = 0;
	var yNext2Lines = (this.codedWidth - this.width);

	var rgbaIndex = 0;	
	var cols = this.width;
	var rows = this.height;

	var y;

	for( var row = 0; row < rows; row++ ) {
		for( var col = 0; col < cols; col++ ) {
			y = pY[yIndex++];
			pRGBA[rgbaIndex++] = 0xff000000 | y << 16 | y << 8 | y;
		}
		
		yIndex += yNext2Lines;
	}
};




// ----------------------------------------------------------------------------
// Slice Layer

jsmpeg.prototype.quantizerScale = 0;
jsmpeg.prototype.sliceBegin = false;

jsmpeg.prototype.decodeSlice = function(slice) {	
	this.sliceBegin = true;
	this.macroblockAddress = (slice - 1) * this.mbWidth - 1;
	
	// Reset motion vectors and DC predictors
	this.motionFwH = this.motionFwHPrev = 0;
	this.motionFwV = this.motionFwVPrev = 0;
	this.dcPredictorY  = 128;
	this.dcPredictorCr = 128;
	this.dcPredictorCb = 128;
	
	this.quantizerScale = this.buffer.getBits(5);
	
	// skip extra bits
	while( this.buffer.getBits(1) ) {
		this.buffer.advance(8);
	}

	do {
		this.decodeMacroblock();
		// We may have to ignore Video Stream Start Codes here (0xE0)!?
	} while( !this.buffer.nextBytesAreStartCode() );
}


// ----------------------------------------------------------------------------
// Macroblock Layer

jsmpeg.prototype.macroblockAddress = 0;
jsmpeg.prototype.mbRow = 0;
jsmpeg.prototype.mbCol = 0;
	
jsmpeg.prototype.macroblockType = 0;
jsmpeg.prototype.macroblockIntra = false;
jsmpeg.prototype.macroblockMotFw = false;
	
jsmpeg.prototype.motionFwH = 0;
jsmpeg.prototype.motionFwV = 0;
jsmpeg.prototype.motionFwHPrev = 0;
jsmpeg.prototype.motionFwVPrev = 0;

jsmpeg.prototype.decodeMacroblock = function() {
	// Decode macroblock_address_increment
	var 
		increment = 0,
		t = this.readCode(MACROBLOCK_ADDRESS_INCREMENT);
	
	while( t == 34 ) {
		// macroblock_stuffing
		t = this.readCode(MACROBLOCK_ADDRESS_INCREMENT);
	}
	while( t == 35 ) {
		// macroblock_escape
		increment += 33;
		t = this.readCode(MACROBLOCK_ADDRESS_INCREMENT);
	}
	increment += t;

	// Process any skipped macroblocks
	if( this.sliceBegin ) {
		// The first macroblock_address_increment of each slice is relative
		// to beginning of the preverious row, not the preverious macroblock
		this.sliceBegin = false;
		this.macroblockAddress += increment;
	}
	else {
		if( this.macroblockAddress + increment >= this.mbSize ) {
			// Illegal (too large) macroblock_address_increment
			return;
		}
		if( increment > 1 ) {
			// Skipped macroblocks reset DC predictors
			this.dcPredictorY  = 128;
			this.dcPredictorCr = 128;
			this.dcPredictorCb = 128;
			
			// Skipped macroblocks in P-pictures reset motion vectors
			if( this.pictureCodingType == PICTURE_TYPE_P ) {
				this.motionFwH = this.motionFwHPrev = 0;
				this.motionFwV = this.motionFwVPrev = 0;
			}
		}
		
		// Predict skipped macroblocks
		while( increment > 1) {
			this.macroblockAddress++;
			this.mbRow = (this.macroblockAddress / this.mbWidth)|0;
			this.mbCol = this.macroblockAddress % this.mbWidth;
			this.copyMacroblock(this.motionFwH, this.motionFwV, this.forwardY, this.forwardCr, this.forwardCb);
			increment--;
		}
		this.macroblockAddress++;
	}
	this.mbRow = (this.macroblockAddress / this.mbWidth)|0;
	this.mbCol = this.macroblockAddress % this.mbWidth;

	// Process the current macroblock
	this.macroblockType = this.readCode(MACROBLOCK_TYPE_TABLES[this.pictureCodingType]);
	this.macroblockIntra = (this.macroblockType & 0x01);
	this.macroblockMotFw = (this.macroblockType & 0x08);

	// Quantizer scale
	if( (this.macroblockType & 0x10) != 0 ) {
		this.quantizerScale = this.buffer.getBits(5);
	}

	if( this.macroblockIntra ) {
		// Intra-coded macroblocks reset motion vectors
		this.motionFwH = this.motionFwHPrev = 0;
		this.motionFwV = this.motionFwVPrev = 0;
	}
	else {
		// Non-intra macroblocks reset DC predictors
		this.dcPredictorY = 128;
		this.dcPredictorCr = 128;
		this.dcPredictorCb = 128;
		
		this.decodeMotionVectors();
		this.copyMacroblock(this.motionFwH, this.motionFwV, this.forwardY, this.forwardCr, this.forwardCb);
	}

	// Decode blocks
	var cbp = ((this.macroblockType & 0x02) != 0) 
		? this.readCode(CODE_BLOCK_PATTERN) 
		: (this.macroblockIntra ? 0x3f : 0);

	for( var block = 0, mask = 0x20; block < 6; block++ ) {
		if( (cbp & mask) != 0 ) {
			this.decodeBlock(block);
		}
		mask >>= 1;
	}
};


jsmpeg.prototype.decodeMotionVectors = function() {
	var code, d, r = 0;
	
	// Forward
	if( this.macroblockMotFw ) {
		// Horizontal forward
		code = this.readCode(MOTION);
		if( (code != 0) && (this.forwardF != 1) ) {
			r = this.buffer.getBits(this.forwardRSize);
			d = ((Math.abs(code) - 1) << this.forwardRSize) + r + 1;
			if( code < 0 ) {
				d = -d;
			}
		}
		else {
			d = code;
		}
		
		this.motionFwHPrev += d;
		if( this.motionFwHPrev > (this.forwardF << 4) - 1 ) {
			this.motionFwHPrev -= this.forwardF << 5;
		}
		else if( this.motionFwHPrev < ((-this.forwardF) << 4) ) {
			this.motionFwHPrev += this.forwardF << 5;
		}
		
		this.motionFwH = this.motionFwHPrev;
		if( this.fullPelForward ) {
			this.motionFwH <<= 1;
		}
		
		// Vertical forward
		code = this.readCode(MOTION);
		if( (code != 0) && (this.forwardF != 1) ) {
			r = this.buffer.getBits(this.forwardRSize);
			d = ((Math.abs(code) - 1) << this.forwardRSize) + r + 1;
			if( code < 0 ) {
				d = -d;
			}
		}
		else {
			d = code;
		}
		
		this.motionFwVPrev += d;
		if( this.motionFwVPrev > (this.forwardF << 4) - 1 ) {
			this.motionFwVPrev -= this.forwardF << 5;
		}
		else if( this.motionFwVPrev < ((-this.forwardF) << 4) ) {
			this.motionFwVPrev += this.forwardF << 5;
		}
		
		this.motionFwV = this.motionFwVPrev;
		if( this.fullPelForward ) {
			this.motionFwV <<= 1;
		}
	}
	else if( this.pictureCodingType == PICTURE_TYPE_P ) {
		// No motion information in P-picture, reset vectors
		this.motionFwH = this.motionFwHPrev = 0;
		this.motionFwV = this.motionFwVPrev = 0;
	}
};

jsmpeg.prototype.copyMacroblock = function(motionH, motionV, sY, sCr, sCb ) {
	var 
		width, scan, 
		H, V, oddH, oddV,
		src, dest, last;

	// We use 32bit writes here
	var dY = this.currentY32;
	var dCb = this.currentCb32;
	var dCr = this.currentCr32;

	// Luminance
	width = this.codedWidth;
	scan = width - 16;
	
	H = motionH >> 1;
	V = motionV >> 1;
	oddH = (motionH & 1) == 1;
	oddV = (motionV & 1) == 1;
	
	src = ((this.mbRow << 4) + V) * width + (this.mbCol << 4) + H;
	dest = (this.mbRow * width + this.mbCol) << 2;
	last = dest + (width << 2);

	var y1, y2, y;
	if( oddH ) {
		if( oddV ) {
			while( dest < last ) {
				y1 = sY[src] + sY[src+width]; src++;
				for( var x = 0; x < 4; x++ ) {
					y2 = sY[src] + sY[src+width]; src++;
					y = (((y1 + y2 + 2) >> 2) & 0xff);

					y1 = sY[src] + sY[src+width]; src++;
					y |= (((y1 + y2 + 2) << 6) & 0xff00);
					
					y2 = sY[src] + sY[src+width]; src++;
					y |= (((y1 + y2 + 2) << 14) & 0xff0000);

					y1 = sY[src] + sY[src+width]; src++;
					y |= (((y1 + y2 + 2) << 22) & 0xff000000);

					dY[dest++] = y;
				}
				dest += scan >> 2; src += scan-1;
			}
		}
		else {
			while( dest < last ) {
				y1 = sY[src++];
				for( var x = 0; x < 4; x++ ) {
					y2 = sY[src++];
					y = (((y1 + y2 + 1) >> 1) & 0xff);
					
					y1 = sY[src++];
					y |= (((y1 + y2 + 1) << 7) & 0xff00);
					
					y2 = sY[src++];
					y |= (((y1 + y2 + 1) << 15) & 0xff0000);
					
					y1 = sY[src++];
					y |= (((y1 + y2 + 1) << 23) & 0xff000000);

					dY[dest++] = y;
				}
				dest += scan >> 2; src += scan-1;
			}
		}
	}
	else {
		if( oddV ) {
			while( dest < last ) {
				for( var x = 0; x < 4; x++ ) {
					y = (((sY[src] + sY[src+width] + 1) >> 1) & 0xff); src++;
					y |= (((sY[src] + sY[src+width] + 1) << 7) & 0xff00); src++;
					y |= (((sY[src] + sY[src+width] + 1) << 15) & 0xff0000); src++;
					y |= (((sY[src] + sY[src+width] + 1) << 23) & 0xff000000); src++;
					
					dY[dest++] = y;
				}
				dest += scan >> 2; src += scan;
			}
		}
		else {
			while( dest < last ) {
				for( var x = 0; x < 4; x++ ) {
					y = sY[src]; src++;
					y |= sY[src] << 8; src++;
					y |= sY[src] << 16; src++;
					y |= sY[src] << 24; src++;

					dY[dest++] = y;
				}
				dest += scan >> 2; src += scan;
			}
		}
	}
	
	if( this.bwFilter ) {
		// No need to copy chrominance when black&white filter is active
		return;
	}
	

	// Chrominance
	
	width = this.halfWidth;
	scan = width - 8;
	
	H = (motionH/2) >> 1;
	V = (motionV/2) >> 1;
	oddH = ((motionH/2) & 1) == 1;
	oddV = ((motionV/2) & 1) == 1;
	
	src = ((this.mbRow << 3) + V) * width + (this.mbCol << 3) + H;
	dest = (this.mbRow * width + this.mbCol) << 1;
	last = dest + (width << 1);
	
	var cr1, cr2, cr;
	var cb1, cb2, cb;
	if( oddH ) {
		if( oddV ) {
			while( dest < last ) {
				cr1 = sCr[src] + sCr[src+width];
				cb1 = sCb[src] + sCb[src+width];
				src++;
				for( var x = 0; x < 2; x++ ) {
					cr2 = sCr[src] + sCr[src+width];
					cb2 = sCb[src] + sCb[src+width]; src++;
					cr = (((cr1 + cr2 + 2) >> 2) & 0xff);
					cb = (((cb1 + cb2 + 2) >> 2) & 0xff);

					cr1 = sCr[src] + sCr[src+width];
					cb1 = sCb[src] + sCb[src+width]; src++;
					cr |= (((cr1 + cr2 + 2) << 6) & 0xff00);
					cb |= (((cb1 + cb2 + 2) << 6) & 0xff00);

					cr2 = sCr[src] + sCr[src+width];
					cb2 = sCb[src] + sCb[src+width]; src++;
					cr |= (((cr1 + cr2 + 2) << 14) & 0xff0000);
					cb |= (((cb1 + cb2 + 2) << 14) & 0xff0000);

					cr1 = sCr[src] + sCr[src+width];
					cb1 = sCb[src] + sCb[src+width]; src++;
					cr |= (((cr1 + cr2 + 2) << 22) & 0xff000000);
					cb |= (((cb1 + cb2 + 2) << 22) & 0xff000000);

					dCr[dest] = cr;
					dCb[dest] = cb;
					dest++;
				}
				dest += scan >> 2; src += scan-1;
			}
		}
		else {
			while( dest < last ) {
				cr1 = sCr[src];
				cb1 = sCb[src];
				src++;
				for( var x = 0; x < 2; x++ ) {
					cr2 = sCr[src];
					cb2 = sCb[src++];
					cr = (((cr1 + cr2 + 1) >> 1) & 0xff);
					cb = (((cb1 + cb2 + 1) >> 1) & 0xff);

					cr1 = sCr[src];
					cb1 = sCb[src++];
					cr |= (((cr1 + cr2 + 1) << 7) & 0xff00);
					cb |= (((cb1 + cb2 + 1) << 7) & 0xff00);

					cr2 = sCr[src];
					cb2 = sCb[src++];
					cr |= (((cr1 + cr2 + 1) << 15) & 0xff0000);
					cb |= (((cb1 + cb2 + 1) << 15) & 0xff0000);

					cr1 = sCr[src];
					cb1 = sCb[src++];
					cr |= (((cr1 + cr2 + 1) << 23) & 0xff000000);
					cb |= (((cb1 + cb2 + 1) << 23) & 0xff000000);

					dCr[dest] = cr;
					dCb[dest] = cb;
					dest++;
				}
				dest += scan >> 2; src += scan-1;
			}
		}
	}
	else {
		if( oddV ) {
			while( dest < last ) {
				for( var x = 0; x < 2; x++ ) {
					cr = (((sCr[src] + sCr[src+width] + 1) >> 1) & 0xff);
					cb = (((sCb[src] + sCb[src+width] + 1) >> 1) & 0xff); src++;

					cr |= (((sCr[src] + sCr[src+width] + 1) << 7) & 0xff00);
					cb |= (((sCb[src] + sCb[src+width] + 1) << 7) & 0xff00); src++;

					cr |= (((sCr[src] + sCr[src+width] + 1) << 15) & 0xff0000);
					cb |= (((sCb[src] + sCb[src+width] + 1) << 15) & 0xff0000); src++;

					cr |= (((sCr[src] + sCr[src+width] + 1) << 23) & 0xff000000);
					cb |= (((sCb[src] + sCb[src+width] + 1) << 23) & 0xff000000); src++;
					
					dCr[dest] = cr;
					dCb[dest] = cb;
					dest++;
				}
				dest += scan >> 2; src += scan;
			}
		}
		else {
			while( dest < last ) {
				for( var x = 0; x < 2; x++ ) {
					cr = sCr[src];
					cb = sCb[src]; src++;

					cr |= sCr[src] << 8;
					cb |= sCb[src] << 8; src++;

					cr |= sCr[src] << 16;
					cb |= sCb[src] << 16; src++;

					cr |= sCr[src] << 24;
					cb |= sCb[src] << 24; src++;

					dCr[dest] = cr;
					dCb[dest] = cb;
					dest++;
				}
				dest += scan >> 2; src += scan;
			}
		}
	}
};


// ----------------------------------------------------------------------------
// Block layer

jsmpeg.prototype.dcPredictorY;
jsmpeg.prototype.dcPredictorCr;
jsmpeg.prototype.dcPredictorCb;

jsmpeg.prototype.blockData = null;
jsmpeg.prototype.decodeBlock = function(block) {
	
	var
		n = 0,
		quantMatrix;
	
	// Clear preverious data
	this.fillArray(this.blockData, 0);
	
	// Decode DC coefficient of intra-coded blocks
	if( this.macroblockIntra ) {
		var 
			predictor,
			dctSize;
		
		// DC prediction
		
		if( block < 4 ) {
			predictor = this.dcPredictorY;
			dctSize = this.readCode(DCT_DC_SIZE_LUMINANCE);
		}
		else {
			predictor = (block == 4 ? this.dcPredictorCr : this.dcPredictorCb);
			dctSize = this.readCode(DCT_DC_SIZE_CHROMINANCE);
		}
		
		// Read DC coeff
		if( dctSize > 0 ) {
			var differential = this.buffer.getBits(dctSize);
			if( (differential & (1 << (dctSize - 1))) != 0 ) {
				this.blockData[0] = predictor + differential;
			}
			else {
				this.blockData[0] = predictor + ((-1 << dctSize)|(differential+1));
			}
		}
		else {
			this.blockData[0] = predictor;
		}
		
		// Save predictor value
		if( block < 4 ) {
			this.dcPredictorY = this.blockData[0];
		}
		else if( block == 4 ) {
			this.dcPredictorCr = this.blockData[0];
		}
		else {
			this.dcPredictorCb = this.blockData[0];
		}
		
		// Dequantize + premultiply
		this.blockData[0] <<= (3 + 5);
		
		quantMatrix = this.intraQuantMatrix;
		n = 1;
	}
	else {
		quantMatrix = this.nonIntraQuantMatrix;
	}
	
	// Decode AC coefficients (+DC for non-intra)
	var level = 0;
	while( true ) {
		var 
			run = 0,
			coeff = this.readCode(DCT_COEFF);
		
		if( (coeff == 0x0001) && (n > 0) && (this.buffer.getBits(1) == 0) ) {
			// end_of_block
			break;
		}
		if( coeff == 0xffff ) {
			// escape
			run = this.buffer.getBits(6);
			level = this.buffer.getBits(8);
			if( level == 0 ) {
				level = this.buffer.getBits(8);
			}
			else if( level == 128 ) {
				level = this.buffer.getBits(8) - 256;
			}
			else if( level > 128 ) {
				level = level - 256;
			}
		}
		else {
			run = coeff >> 8;
			level = coeff & 0xff;
			if( this.buffer.getBits(1) ) {
				level = -level;
			}
		}
		
		n += run;
		var dezigZagged = ZIG_ZAG[n];
		n++;
		
		// Dequantize, oddify, clip
		level <<= 1;
		if( !this.macroblockIntra ) {
			level += (level < 0 ? -1 : 1);
		}
		level = (level * this.quantizerScale * quantMatrix[dezigZagged]) >> 4;
		if( (level & 1) == 0 ) {
			level -= level > 0 ? 1 : -1;
		}
		if( level > 2047 ) {
			level = 2047;
		}
		else if( level < -2048 ) {
			level = -2048;
		}

		// Save premultiplied coefficient
		this.blockData[dezigZagged] = level * PREMULTIPLIER_MATRIX[dezigZagged];
	};
	
	// Transform block data to the spatial domain
	if( n == 1 ) {
		// Only DC coeff., no IDCT needed
		this.fillArray(this.blockData, (this.blockData[0] + 128) >> 8);
	}
	else {
		this.IDCT();
	}
	
	// Move block to its place
	var
		destArray,
		destIndex,
		scan;
	
	if( block < 4 ) {
		destArray = this.currentY;
		scan = this.codedWidth - 8;
		destIndex = (this.mbRow * this.codedWidth + this.mbCol) << 4;
		if( (block & 1) != 0 ) {
			destIndex += 8;
		}
		if( (block & 2) != 0 ) {
			destIndex += this.codedWidth << 3;
		}
	}
	else {
		destArray = (block == 4) ? this.currentCb : this.currentCr;
		scan = (this.codedWidth >> 1) - 8;
		destIndex = ((this.mbRow * this.codedWidth) << 2) + (this.mbCol << 3);
	}
	
	n = 0;
	
	var blockData = this.blockData;
	if( this.macroblockIntra ) {
		// Overwrite (no prediction)
		this.copyBlockToDestination(this.blockData, destArray, destIndex, scan);
	}
	else {
		// Add data to the predicted macroblock
		this.addBlockToDestination(this.blockData, destArray, destIndex, scan);
	}
};


jsmpeg.prototype.copyBlockToDestination = function(blockData, destArray, destIndex, scan) {
	var n = 0;
	for( var i = 0; i < 8; i++ ) {
		for( var j = 0; j < 8; j++ ) {
			destArray[destIndex++] = blockData[n++];
		}
		destIndex += scan;
	}
};

jsmpeg.prototype.addBlockToDestination = function(blockData, destArray, destIndex, scan) {
	var n = 0;
	for( var i = 0; i < 8; i++ ) {
		for( var j = 0; j < 8; j++ ) {
			destArray[destIndex++] += blockData[n++];
		}
		destIndex += scan;
	}
};

// Clamping version for shitty browsers (IE) that don't support Uint8ClampedArray
jsmpeg.prototype.copyBlockToDestinationClamp = function(blockData, destArray, destIndex, scan) {
	var n = 0;
	for( var i = 0; i < 8; i++ ) {
		for( var j = 0; j < 8; j++ ) {
			var p = blockData[n++];
			destArray[destIndex++] = p > 255 ? 255 : (p < 0 ? 0 : p);
		}
		destIndex += scan;
	}
};

jsmpeg.prototype.addBlockToDestinationClamp = function(blockData, destArray, destIndex, scan) {
	var n = 0;
	for( var i = 0; i < 8; i++ ) {
		for( var j = 0; j < 8; j++ ) {
			var p = blockData[n++] + destArray[destIndex];
			destArray[destIndex++] = p > 255 ? 255 : (p < 0 ? 0 : p);
		}
		destIndex += scan;
	}
};

jsmpeg.prototype.IDCT = function() {
	// See http://vsr.informatik.tu-chemnitz.de/~jan/MPEG/HTML/IDCT.html
	// for more info.
	
	var 
		b1, b3, b4, b6, b7, tmp1, tmp2, m0,
		x0, x1, x2, x3, x4, y3, y4, y5, y6, y7,
		i,
		blockData = this.blockData;
	
	// Transform columns
	for( i = 0; i < 8; ++i ) {
		b1 =  blockData[4*8+i];
		b3 =  blockData[2*8+i] + blockData[6*8+i];
		b4 =  blockData[5*8+i] - blockData[3*8+i];
		tmp1 = blockData[1*8+i] + blockData[7*8+i];
		tmp2 = blockData[3*8+i] + blockData[5*8+i];
		b6 = blockData[1*8+i] - blockData[7*8+i];
		b7 = tmp1 + tmp2;
		m0 =  blockData[0*8+i];
		x4 =  ((b6*473 - b4*196 + 128) >> 8) - b7;
		x0 =  x4 - (((tmp1 - tmp2)*362 + 128) >> 8);
		x1 =  m0 - b1;
		x2 =  (((blockData[2*8+i] - blockData[6*8+i])*362 + 128) >> 8) - b3;
		x3 =  m0 + b1;
		y3 =  x1 + x2;
		y4 =  x3 + b3;
		y5 =  x1 - x2;
		y6 =  x3 - b3;
		y7 = -x0 - ((b4*473 + b6*196 + 128) >> 8);
		blockData[0*8+i] =  b7 + y4;
		blockData[1*8+i] =  x4 + y3;
		blockData[2*8+i] =  y5 - x0;
		blockData[3*8+i] =  y6 - y7;
		blockData[4*8+i] =  y6 + y7;
		blockData[5*8+i] =  x0 + y5;
		blockData[6*8+i] =  y3 - x4;
		blockData[7*8+i] =  y4 - b7;
	}
	
	// Transform rows
	for( i = 0; i < 64; i += 8 ) {
		b1 =  blockData[4+i];
		b3 =  blockData[2+i] + blockData[6+i];
		b4 =  blockData[5+i] - blockData[3+i];
		tmp1 = blockData[1+i] + blockData[7+i];
		tmp2 = blockData[3+i] + blockData[5+i];
		b6 = blockData[1+i] - blockData[7+i];
		b7 = tmp1 + tmp2;
		m0 =  blockData[0+i];
		x4 =  ((b6*473 - b4*196 + 128) >> 8) - b7;
		x0 =  x4 - (((tmp1 - tmp2)*362 + 128) >> 8);
		x1 =  m0 - b1;
		x2 =  (((blockData[2+i] - blockData[6+i])*362 + 128) >> 8) - b3;
		x3 =  m0 + b1;
		y3 =  x1 + x2;
		y4 =  x3 + b3;
		y5 =  x1 - x2;
		y6 =  x3 - b3;
		y7 = -x0 - ((b4*473 + b6*196 + 128) >> 8);
		blockData[0+i] =  (b7 + y4 + 128) >> 8;
		blockData[1+i] =  (x4 + y3 + 128) >> 8;
		blockData[2+i] =  (y5 - x0 + 128) >> 8;
		blockData[3+i] =  (y6 - y7 + 128) >> 8;
		blockData[4+i] =  (y6 + y7 + 128) >> 8;
		blockData[5+i] =  (x0 + y5 + 128) >> 8;
		blockData[6+i] =  (y3 - x4 + 128) >> 8;
		blockData[7+i] =  (y4 - b7 + 128) >> 8;
	}
};


// ----------------------------------------------------------------------------
// VLC Tables and Constants

var
	SOCKET_MAGIC_BYTES = 'jsmp',
	DECODE_SKIP_OUTPUT = 1,
	PICTURE_RATE = [
		0.000, 23.976, 24.000, 25.000, 29.970, 30.000, 50.000, 59.940,
		60.000,  0.000,  0.000,  0.000,  0.000,  0.000,  0.000,  0.000
	],
	ZIG_ZAG = new Uint8Array([
		 0,  1,  8, 16,  9,  2,  3, 10,
		17, 24, 32, 25, 18, 11,  4,  5,
		12, 19, 26, 33, 40, 48, 41, 34,
		27, 20, 13,  6,  7, 14, 21, 28,
		35, 42, 49, 56, 57, 50, 43, 36,
		29, 22, 15, 23, 30, 37, 44, 51,
		58, 59, 52, 45, 38, 31, 39, 46,
		53, 60, 61, 54, 47, 55, 62, 63
	]),
	DEFAULT_INTRA_QUANT_MATRIX = new Uint8Array([
		 8, 16, 19, 22, 26, 27, 29, 34,
		16, 16, 22, 24, 27, 29, 34, 37,
		19, 22, 26, 27, 29, 34, 34, 38,
		22, 22, 26, 27, 29, 34, 37, 40,
		22, 26, 27, 29, 32, 35, 40, 48,
		26, 27, 29, 32, 35, 40, 48, 58,
		26, 27, 29, 34, 38, 46, 56, 69,
		27, 29, 35, 38, 46, 56, 69, 83
	]),
	DEFAULT_NON_INTRA_QUANT_MATRIX = new Uint8Array([
		16, 16, 16, 16, 16, 16, 16, 16,
		16, 16, 16, 16, 16, 16, 16, 16,
		16, 16, 16, 16, 16, 16, 16, 16,
		16, 16, 16, 16, 16, 16, 16, 16,
		16, 16, 16, 16, 16, 16, 16, 16,
		16, 16, 16, 16, 16, 16, 16, 16,
		16, 16, 16, 16, 16, 16, 16, 16,
		16, 16, 16, 16, 16, 16, 16, 16
	]),
	
	PREMULTIPLIER_MATRIX = new Uint8Array([
		32, 44, 42, 38, 32, 25, 17,  9,
		44, 62, 58, 52, 44, 35, 24, 12,
		42, 58, 55, 49, 42, 33, 23, 12,
		38, 52, 49, 44, 38, 30, 20, 10,
		32, 44, 42, 38, 32, 25, 17,  9,
		25, 35, 33, 30, 25, 20, 14,  7,
		17, 24, 23, 20, 17, 14,  9,  5,
		 9, 12, 12, 10,  9,  7,  5,  2
	]),
	
	// MPEG-1 VLC
	
	//  macroblock_stuffing decodes as 34.
	//  macroblock_escape decodes as 35.
	
	MACROBLOCK_ADDRESS_INCREMENT = new Int16Array([
		 1*3,  2*3,  0, //   0
		 3*3,  4*3,  0, //   1  0
		   0,    0,  1, //   2  1.
		 5*3,  6*3,  0, //   3  00
		 7*3,  8*3,  0, //   4  01
		 9*3, 10*3,  0, //   5  000
		11*3, 12*3,  0, //   6  001
		   0,    0,  3, //   7  010.
		   0,    0,  2, //   8  011.
		13*3, 14*3,  0, //   9  0000
		15*3, 16*3,  0, //  10  0001
		   0,    0,  5, //  11  0010.
		   0,    0,  4, //  12  0011.
		17*3, 18*3,  0, //  13  0000 0
		19*3, 20*3,  0, //  14  0000 1
		   0,    0,  7, //  15  0001 0.
		   0,    0,  6, //  16  0001 1.
		21*3, 22*3,  0, //  17  0000 00
		23*3, 24*3,  0, //  18  0000 01
		25*3, 26*3,  0, //  19  0000 10
		27*3, 28*3,  0, //  20  0000 11
		  -1, 29*3,  0, //  21  0000 000
		  -1, 30*3,  0, //  22  0000 001
		31*3, 32*3,  0, //  23  0000 010
		33*3, 34*3,  0, //  24  0000 011
		35*3, 36*3,  0, //  25  0000 100
		37*3, 38*3,  0, //  26  0000 101
		   0,    0,  9, //  27  0000 110.
		   0,    0,  8, //  28  0000 111.
		39*3, 40*3,  0, //  29  0000 0001
		41*3, 42*3,  0, //  30  0000 0011
		43*3, 44*3,  0, //  31  0000 0100
		45*3, 46*3,  0, //  32  0000 0101
		   0,    0, 15, //  33  0000 0110.
		   0,    0, 14, //  34  0000 0111.
		   0,    0, 13, //  35  0000 1000.
		   0,    0, 12, //  36  0000 1001.
		   0,    0, 11, //  37  0000 1010.
		   0,    0, 10, //  38  0000 1011.
		47*3,   -1,  0, //  39  0000 0001 0
		  -1, 48*3,  0, //  40  0000 0001 1
		49*3, 50*3,  0, //  41  0000 0011 0
		51*3, 52*3,  0, //  42  0000 0011 1
		53*3, 54*3,  0, //  43  0000 0100 0
		55*3, 56*3,  0, //  44  0000 0100 1
		57*3, 58*3,  0, //  45  0000 0101 0
		59*3, 60*3,  0, //  46  0000 0101 1
		61*3,   -1,  0, //  47  0000 0001 00
		  -1, 62*3,  0, //  48  0000 0001 11
		63*3, 64*3,  0, //  49  0000 0011 00
		65*3, 66*3,  0, //  50  0000 0011 01
		67*3, 68*3,  0, //  51  0000 0011 10
		69*3, 70*3,  0, //  52  0000 0011 11
		71*3, 72*3,  0, //  53  0000 0100 00
		73*3, 74*3,  0, //  54  0000 0100 01
		   0,    0, 21, //  55  0000 0100 10.
		   0,    0, 20, //  56  0000 0100 11.
		   0,    0, 19, //  57  0000 0101 00.
		   0,    0, 18, //  58  0000 0101 01.
		   0,    0, 17, //  59  0000 0101 10.
		   0,    0, 16, //  60  0000 0101 11.
		   0,    0, 35, //  61  0000 0001 000. -- macroblock_escape
		   0,    0, 34, //  62  0000 0001 111. -- macroblock_stuffing
		   0,    0, 33, //  63  0000 0011 000.
		   0,    0, 32, //  64  0000 0011 001.
		   0,    0, 31, //  65  0000 0011 010.
		   0,    0, 30, //  66  0000 0011 011.
		   0,    0, 29, //  67  0000 0011 100.
		   0,    0, 28, //  68  0000 0011 101.
		   0,    0, 27, //  69  0000 0011 110.
		   0,    0, 26, //  70  0000 0011 111.
		   0,    0, 25, //  71  0000 0100 000.
		   0,    0, 24, //  72  0000 0100 001.
		   0,    0, 23, //  73  0000 0100 010.
		   0,    0, 22  //  74  0000 0100 011.
	]),
	
	//  macroblock_type bitmap:
	//    0x10  macroblock_quant
	//    0x08  macroblock_motion_forward
	//    0x04  macroblock_motion_backward
	//    0x02  macrobkock_pattern
	//    0x01  macroblock_intra
	//
	
	MACROBLOCK_TYPE_I = new Int8Array([
		 1*3,  2*3,     0, //   0
		  -1,  3*3,     0, //   1  0
		   0,    0,  0x01, //   2  1.
		   0,    0,  0x11  //   3  01.
	]),
	
	MACROBLOCK_TYPE_P = new Int8Array([
		 1*3,  2*3,     0, //  0
		 3*3,  4*3,     0, //  1  0
		   0,    0,  0x0a, //  2  1.
		 5*3,  6*3,     0, //  3  00
		   0,    0,  0x02, //  4  01.
		 7*3,  8*3,     0, //  5  000
		   0,    0,  0x08, //  6  001.
		 9*3, 10*3,     0, //  7  0000
		11*3, 12*3,     0, //  8  0001
		  -1, 13*3,     0, //  9  00000
		   0,    0,  0x12, // 10  00001.
		   0,    0,  0x1a, // 11  00010.
		   0,    0,  0x01, // 12  00011.
		   0,    0,  0x11  // 13  000001.
	]),
	
	MACROBLOCK_TYPE_B = new Int8Array([
		 1*3,  2*3,     0,  //  0
		 3*3,  5*3,     0,  //  1  0
		 4*3,  6*3,     0,  //  2  1
		 8*3,  7*3,     0,  //  3  00
		   0,    0,  0x0c,  //  4  10.
		 9*3, 10*3,     0,  //  5  01
		   0,    0,  0x0e,  //  6  11.
		13*3, 14*3,     0,  //  7  001
		12*3, 11*3,     0,  //  8  000
		   0,    0,  0x04,  //  9  010.
		   0,    0,  0x06,  // 10  011.
		18*3, 16*3,     0,  // 11  0001
		15*3, 17*3,     0,  // 12  0000
		   0,    0,  0x08,  // 13  0010.
		   0,    0,  0x0a,  // 14  0011.
		  -1, 19*3,     0,  // 15  00000
		   0,    0,  0x01,  // 16  00011.
		20*3, 21*3,     0,  // 17  00001
		   0,    0,  0x1e,  // 18  00010.
		   0,    0,  0x11,  // 19  000001.
		   0,    0,  0x16,  // 20  000010.
		   0,    0,  0x1a   // 21  000011.
	]),
	
	CODE_BLOCK_PATTERN = new Int16Array([
		  2*3,   1*3,   0,  //   0
		  3*3,   6*3,   0,  //   1  1
		  4*3,   5*3,   0,  //   2  0
		  8*3,  11*3,   0,  //   3  10
		 12*3,  13*3,   0,  //   4  00
		  9*3,   7*3,   0,  //   5  01
		 10*3,  14*3,   0,  //   6  11
		 20*3,  19*3,   0,  //   7  011
		 18*3,  16*3,   0,  //   8  100
		 23*3,  17*3,   0,  //   9  010
		 27*3,  25*3,   0,  //  10  110
		 21*3,  28*3,   0,  //  11  101
		 15*3,  22*3,   0,  //  12  000
		 24*3,  26*3,   0,  //  13  001
		    0,     0,  60,  //  14  111.
		 35*3,  40*3,   0,  //  15  0000
		 44*3,  48*3,   0,  //  16  1001
		 38*3,  36*3,   0,  //  17  0101
		 42*3,  47*3,   0,  //  18  1000
		 29*3,  31*3,   0,  //  19  0111
		 39*3,  32*3,   0,  //  20  0110
		    0,     0,  32,  //  21  1010.
		 45*3,  46*3,   0,  //  22  0001
		 33*3,  41*3,   0,  //  23  0100
		 43*3,  34*3,   0,  //  24  0010
		    0,     0,   4,  //  25  1101.
		 30*3,  37*3,   0,  //  26  0011
		    0,     0,   8,  //  27  1100.
		    0,     0,  16,  //  28  1011.
		    0,     0,  44,  //  29  0111 0.
		 50*3,  56*3,   0,  //  30  0011 0
		    0,     0,  28,  //  31  0111 1.
		    0,     0,  52,  //  32  0110 1.
		    0,     0,  62,  //  33  0100 0.
		 61*3,  59*3,   0,  //  34  0010 1
		 52*3,  60*3,   0,  //  35  0000 0
		    0,     0,   1,  //  36  0101 1.
		 55*3,  54*3,   0,  //  37  0011 1
		    0,     0,  61,  //  38  0101 0.
		    0,     0,  56,  //  39  0110 0.
		 57*3,  58*3,   0,  //  40  0000 1
		    0,     0,   2,  //  41  0100 1.
		    0,     0,  40,  //  42  1000 0.
		 51*3,  62*3,   0,  //  43  0010 0
		    0,     0,  48,  //  44  1001 0.
		 64*3,  63*3,   0,  //  45  0001 0
		 49*3,  53*3,   0,  //  46  0001 1
		    0,     0,  20,  //  47  1000 1.
		    0,     0,  12,  //  48  1001 1.
		 80*3,  83*3,   0,  //  49  0001 10
		    0,     0,  63,  //  50  0011 00.
		 77*3,  75*3,   0,  //  51  0010 00
		 65*3,  73*3,   0,  //  52  0000 00
		 84*3,  66*3,   0,  //  53  0001 11
		    0,     0,  24,  //  54  0011 11.
		    0,     0,  36,  //  55  0011 10.
		    0,     0,   3,  //  56  0011 01.
		 69*3,  87*3,   0,  //  57  0000 10
		 81*3,  79*3,   0,  //  58  0000 11
		 68*3,  71*3,   0,  //  59  0010 11
		 70*3,  78*3,   0,  //  60  0000 01
		 67*3,  76*3,   0,  //  61  0010 10
		 72*3,  74*3,   0,  //  62  0010 01
		 86*3,  85*3,   0,  //  63  0001 01
		 88*3,  82*3,   0,  //  64  0001 00
		   -1,  94*3,   0,  //  65  0000 000
		 95*3,  97*3,   0,  //  66  0001 111
		    0,     0,  33,  //  67  0010 100.
		    0,     0,   9,  //  68  0010 110.
		106*3, 110*3,   0,  //  69  0000 100
		102*3, 116*3,   0,  //  70  0000 010
		    0,     0,   5,  //  71  0010 111.
		    0,     0,  10,  //  72  0010 010.
		 93*3,  89*3,   0,  //  73  0000 001
		    0,     0,   6,  //  74  0010 011.
		    0,     0,  18,  //  75  0010 001.
		    0,     0,  17,  //  76  0010 101.
		    0,     0,  34,  //  77  0010 000.
		113*3, 119*3,   0,  //  78  0000 011
		103*3, 104*3,   0,  //  79  0000 111
		 90*3,  92*3,   0,  //  80  0001 100
		109*3, 107*3,   0,  //  81  0000 110
		117*3, 118*3,   0,  //  82  0001 001
		101*3,  99*3,   0,  //  83  0001 101
		 98*3,  96*3,   0,  //  84  0001 110
		100*3,  91*3,   0,  //  85  0001 011
		114*3, 115*3,   0,  //  86  0001 010
		105*3, 108*3,   0,  //  87  0000 101
		112*3, 111*3,   0,  //  88  0001 000
		121*3, 125*3,   0,  //  89  0000 0011
		    0,     0,  41,  //  90  0001 1000.
		    0,     0,  14,  //  91  0001 0111.
		    0,     0,  21,  //  92  0001 1001.
		124*3, 122*3,   0,  //  93  0000 0010
		120*3, 123*3,   0,  //  94  0000 0001
		    0,     0,  11,  //  95  0001 1110.
		    0,     0,  19,  //  96  0001 1101.
		    0,     0,   7,  //  97  0001 1111.
		    0,     0,  35,  //  98  0001 1100.
		    0,     0,  13,  //  99  0001 1011.
		    0,     0,  50,  // 100  0001 0110.
		    0,     0,  49,  // 101  0001 1010.
		    0,     0,  58,  // 102  0000 0100.
		    0,     0,  37,  // 103  0000 1110.
		    0,     0,  25,  // 104  0000 1111.
		    0,     0,  45,  // 105  0000 1010.
		    0,     0,  57,  // 106  0000 1000.
		    0,     0,  26,  // 107  0000 1101.
		    0,     0,  29,  // 108  0000 1011.
		    0,     0,  38,  // 109  0000 1100.
		    0,     0,  53,  // 110  0000 1001.
		    0,     0,  23,  // 111  0001 0001.
		    0,     0,  43,  // 112  0001 0000.
		    0,     0,  46,  // 113  0000 0110.
		    0,     0,  42,  // 114  0001 0100.
		    0,     0,  22,  // 115  0001 0101.
		    0,     0,  54,  // 116  0000 0101.
		    0,     0,  51,  // 117  0001 0010.
		    0,     0,  15,  // 118  0001 0011.
		    0,     0,  30,  // 119  0000 0111.
		    0,     0,  39,  // 120  0000 0001 0.
		    0,     0,  47,  // 121  0000 0011 0.
		    0,     0,  55,  // 122  0000 0010 1.
		    0,     0,  27,  // 123  0000 0001 1.
		    0,     0,  59,  // 124  0000 0010 0.
		    0,     0,  31   // 125  0000 0011 1.
	]),
	
	MOTION = new Int16Array([
		  1*3,   2*3,   0,  //   0
		  4*3,   3*3,   0,  //   1  0
		    0,     0,   0,  //   2  1.
		  6*3,   5*3,   0,  //   3  01
		  8*3,   7*3,   0,  //   4  00
		    0,     0,  -1,  //   5  011.
		    0,     0,   1,  //   6  010.
		  9*3,  10*3,   0,  //   7  001
		 12*3,  11*3,   0,  //   8  000
		    0,     0,   2,  //   9  0010.
		    0,     0,  -2,  //  10  0011.
		 14*3,  15*3,   0,  //  11  0001
		 16*3,  13*3,   0,  //  12  0000
		 20*3,  18*3,   0,  //  13  0000 1
		    0,     0,   3,  //  14  0001 0.
		    0,     0,  -3,  //  15  0001 1.
		 17*3,  19*3,   0,  //  16  0000 0
		   -1,  23*3,   0,  //  17  0000 00
		 27*3,  25*3,   0,  //  18  0000 11
		 26*3,  21*3,   0,  //  19  0000 01
		 24*3,  22*3,   0,  //  20  0000 10
		 32*3,  28*3,   0,  //  21  0000 011
		 29*3,  31*3,   0,  //  22  0000 101
		   -1,  33*3,   0,  //  23  0000 001
		 36*3,  35*3,   0,  //  24  0000 100
		    0,     0,  -4,  //  25  0000 111.
		 30*3,  34*3,   0,  //  26  0000 010
		    0,     0,   4,  //  27  0000 110.
		    0,     0,  -7,  //  28  0000 0111.
		    0,     0,   5,  //  29  0000 1010.
		 37*3,  41*3,   0,  //  30  0000 0100
		    0,     0,  -5,  //  31  0000 1011.
		    0,     0,   7,  //  32  0000 0110.
		 38*3,  40*3,   0,  //  33  0000 0011
		 42*3,  39*3,   0,  //  34  0000 0101
		    0,     0,  -6,  //  35  0000 1001.
		    0,     0,   6,  //  36  0000 1000.
		 51*3,  54*3,   0,  //  37  0000 0100 0
		 50*3,  49*3,   0,  //  38  0000 0011 0
		 45*3,  46*3,   0,  //  39  0000 0101 1
		 52*3,  47*3,   0,  //  40  0000 0011 1
		 43*3,  53*3,   0,  //  41  0000 0100 1
		 44*3,  48*3,   0,  //  42  0000 0101 0
		    0,     0,  10,  //  43  0000 0100 10.
		    0,     0,   9,  //  44  0000 0101 00.
		    0,     0,   8,  //  45  0000 0101 10.
		    0,     0,  -8,  //  46  0000 0101 11.
		 57*3,  66*3,   0,  //  47  0000 0011 11
		    0,     0,  -9,  //  48  0000 0101 01.
		 60*3,  64*3,   0,  //  49  0000 0011 01
		 56*3,  61*3,   0,  //  50  0000 0011 00
		 55*3,  62*3,   0,  //  51  0000 0100 00
		 58*3,  63*3,   0,  //  52  0000 0011 10
		    0,     0, -10,  //  53  0000 0100 11.
		 59*3,  65*3,   0,  //  54  0000 0100 01
		    0,     0,  12,  //  55  0000 0100 000.
		    0,     0,  16,  //  56  0000 0011 000.
		    0,     0,  13,  //  57  0000 0011 110.
		    0,     0,  14,  //  58  0000 0011 100.
		    0,     0,  11,  //  59  0000 0100 010.
		    0,     0,  15,  //  60  0000 0011 010.
		    0,     0, -16,  //  61  0000 0011 001.
		    0,     0, -12,  //  62  0000 0100 001.
		    0,     0, -14,  //  63  0000 0011 101.
		    0,     0, -15,  //  64  0000 0011 011.
		    0,     0, -11,  //  65  0000 0100 011.
		    0,     0, -13   //  66  0000 0011 111.
	]),
	
	DCT_DC_SIZE_LUMINANCE = new Int8Array([
		  2*3,   1*3, 0,  //   0
		  6*3,   5*3, 0,  //   1  1
		  3*3,   4*3, 0,  //   2  0
		    0,     0, 1,  //   3  00.
		    0,     0, 2,  //   4  01.
		  9*3,   8*3, 0,  //   5  11
		  7*3,  10*3, 0,  //   6  10
		    0,     0, 0,  //   7  100.
		 12*3,  11*3, 0,  //   8  111
		    0,     0, 4,  //   9  110.
		    0,     0, 3,  //  10  101.
		 13*3,  14*3, 0,  //  11  1111
		    0,     0, 5,  //  12  1110.
		    0,     0, 6,  //  13  1111 0.
		 16*3,  15*3, 0,  //  14  1111 1
		 17*3,    -1, 0,  //  15  1111 11
		    0,     0, 7,  //  16  1111 10.
		    0,     0, 8   //  17  1111 110.
	]),
	
	DCT_DC_SIZE_CHROMINANCE = new Int8Array([
		  2*3,   1*3, 0,  //   0
		  4*3,   3*3, 0,  //   1  1
		  6*3,   5*3, 0,  //   2  0
		  8*3,   7*3, 0,  //   3  11
		    0,     0, 2,  //   4  10.
		    0,     0, 1,  //   5  01.
		    0,     0, 0,  //   6  00.
		 10*3,   9*3, 0,  //   7  111
		    0,     0, 3,  //   8  110.
		 12*3,  11*3, 0,  //   9  1111
		    0,     0, 4,  //  10  1110.
		 14*3,  13*3, 0,  //  11  1111 1
		    0,     0, 5,  //  12  1111 0.
		 16*3,  15*3, 0,  //  13  1111 11
		    0,     0, 6,  //  14  1111 10.
		 17*3,    -1, 0,  //  15  1111 111
		    0,     0, 7,  //  16  1111 110.
		    0,     0, 8   //  17  1111 1110.
	]),
	
	//  dct_coeff bitmap:
	//    0xff00  run
	//    0x00ff  level
	
	//  Decoded values are unsigned. Sign bit follows in the stream.
	
	//  Interpretation of the value 0x0001
	//    for dc_coeff_first:  run=0, level=1
	//    for dc_coeff_next:   If the next bit is 1: run=0, level=1
	//                         If the next bit is 0: end_of_block
	
	//  escape decodes as 0xffff.
	
	DCT_COEFF = new Int32Array([
		  1*3,   2*3,      0,  //   0
		  4*3,   3*3,      0,  //   1  0
		    0,     0, 0x0001,  //   2  1.
		  7*3,   8*3,      0,  //   3  01
		  6*3,   5*3,      0,  //   4  00
		 13*3,   9*3,      0,  //   5  001
		 11*3,  10*3,      0,  //   6  000
		 14*3,  12*3,      0,  //   7  010
		    0,     0, 0x0101,  //   8  011.
		 20*3,  22*3,      0,  //   9  0011
		 18*3,  21*3,      0,  //  10  0001
		 16*3,  19*3,      0,  //  11  0000
		    0,     0, 0x0201,  //  12  0101.
		 17*3,  15*3,      0,  //  13  0010
		    0,     0, 0x0002,  //  14  0100.
		    0,     0, 0x0003,  //  15  0010 1.
		 27*3,  25*3,      0,  //  16  0000 0
		 29*3,  31*3,      0,  //  17  0010 0
		 24*3,  26*3,      0,  //  18  0001 0
		 32*3,  30*3,      0,  //  19  0000 1
		    0,     0, 0x0401,  //  20  0011 0.
		 23*3,  28*3,      0,  //  21  0001 1
		    0,     0, 0x0301,  //  22  0011 1.
		    0,     0, 0x0102,  //  23  0001 10.
		    0,     0, 0x0701,  //  24  0001 00.
		    0,     0, 0xffff,  //  25  0000 01. -- escape
		    0,     0, 0x0601,  //  26  0001 01.
		 37*3,  36*3,      0,  //  27  0000 00
		    0,     0, 0x0501,  //  28  0001 11.
		 35*3,  34*3,      0,  //  29  0010 00
		 39*3,  38*3,      0,  //  30  0000 11
		 33*3,  42*3,      0,  //  31  0010 01
		 40*3,  41*3,      0,  //  32  0000 10
		 52*3,  50*3,      0,  //  33  0010 010
		 54*3,  53*3,      0,  //  34  0010 001
		 48*3,  49*3,      0,  //  35  0010 000
		 43*3,  45*3,      0,  //  36  0000 001
		 46*3,  44*3,      0,  //  37  0000 000
		    0,     0, 0x0801,  //  38  0000 111.
		    0,     0, 0x0004,  //  39  0000 110.
		    0,     0, 0x0202,  //  40  0000 100.
		    0,     0, 0x0901,  //  41  0000 101.
		 51*3,  47*3,      0,  //  42  0010 011
		 55*3,  57*3,      0,  //  43  0000 0010
		 60*3,  56*3,      0,  //  44  0000 0001
		 59*3,  58*3,      0,  //  45  0000 0011
		 61*3,  62*3,      0,  //  46  0000 0000
		    0,     0, 0x0a01,  //  47  0010 0111.
		    0,     0, 0x0d01,  //  48  0010 0000.
		    0,     0, 0x0006,  //  49  0010 0001.
		    0,     0, 0x0103,  //  50  0010 0101.
		    0,     0, 0x0005,  //  51  0010 0110.
		    0,     0, 0x0302,  //  52  0010 0100.
		    0,     0, 0x0b01,  //  53  0010 0011.
		    0,     0, 0x0c01,  //  54  0010 0010.
		 76*3,  75*3,      0,  //  55  0000 0010 0
		 67*3,  70*3,      0,  //  56  0000 0001 1
		 73*3,  71*3,      0,  //  57  0000 0010 1
		 78*3,  74*3,      0,  //  58  0000 0011 1
		 72*3,  77*3,      0,  //  59  0000 0011 0
		 69*3,  64*3,      0,  //  60  0000 0001 0
		 68*3,  63*3,      0,  //  61  0000 0000 0
		 66*3,  65*3,      0,  //  62  0000 0000 1
		 81*3,  87*3,      0,  //  63  0000 0000 01
		 91*3,  80*3,      0,  //  64  0000 0001 01
		 82*3,  79*3,      0,  //  65  0000 0000 11
		 83*3,  86*3,      0,  //  66  0000 0000 10
		 93*3,  92*3,      0,  //  67  0000 0001 10
		 84*3,  85*3,      0,  //  68  0000 0000 00
		 90*3,  94*3,      0,  //  69  0000 0001 00
		 88*3,  89*3,      0,  //  70  0000 0001 11
		    0,     0, 0x0203,  //  71  0000 0010 11.
		    0,     0, 0x0104,  //  72  0000 0011 00.
		    0,     0, 0x0007,  //  73  0000 0010 10.
		    0,     0, 0x0402,  //  74  0000 0011 11.
		    0,     0, 0x0502,  //  75  0000 0010 01.
		    0,     0, 0x1001,  //  76  0000 0010 00.
		    0,     0, 0x0f01,  //  77  0000 0011 01.
		    0,     0, 0x0e01,  //  78  0000 0011 10.
		105*3, 107*3,      0,  //  79  0000 0000 111
		111*3, 114*3,      0,  //  80  0000 0001 011
		104*3,  97*3,      0,  //  81  0000 0000 010
		125*3, 119*3,      0,  //  82  0000 0000 110
		 96*3,  98*3,      0,  //  83  0000 0000 100
		   -1, 123*3,      0,  //  84  0000 0000 000
		 95*3, 101*3,      0,  //  85  0000 0000 001
		106*3, 121*3,      0,  //  86  0000 0000 101
		 99*3, 102*3,      0,  //  87  0000 0000 011
		113*3, 103*3,      0,  //  88  0000 0001 110
		112*3, 116*3,      0,  //  89  0000 0001 111
		110*3, 100*3,      0,  //  90  0000 0001 000
		124*3, 115*3,      0,  //  91  0000 0001 010
		117*3, 122*3,      0,  //  92  0000 0001 101
		109*3, 118*3,      0,  //  93  0000 0001 100
		120*3, 108*3,      0,  //  94  0000 0001 001
		127*3, 136*3,      0,  //  95  0000 0000 0010
		139*3, 140*3,      0,  //  96  0000 0000 1000
		130*3, 126*3,      0,  //  97  0000 0000 0101
		145*3, 146*3,      0,  //  98  0000 0000 1001
		128*3, 129*3,      0,  //  99  0000 0000 0110
		    0,     0, 0x0802,  // 100  0000 0001 0001.
		132*3, 134*3,      0,  // 101  0000 0000 0011
		155*3, 154*3,      0,  // 102  0000 0000 0111
		    0,     0, 0x0008,  // 103  0000 0001 1101.
		137*3, 133*3,      0,  // 104  0000 0000 0100
		143*3, 144*3,      0,  // 105  0000 0000 1110
		151*3, 138*3,      0,  // 106  0000 0000 1010
		142*3, 141*3,      0,  // 107  0000 0000 1111
		    0,     0, 0x000a,  // 108  0000 0001 0011.
		    0,     0, 0x0009,  // 109  0000 0001 1000.
		    0,     0, 0x000b,  // 110  0000 0001 0000.
		    0,     0, 0x1501,  // 111  0000 0001 0110.
		    0,     0, 0x0602,  // 112  0000 0001 1110.
		    0,     0, 0x0303,  // 113  0000 0001 1100.
		    0,     0, 0x1401,  // 114  0000 0001 0111.
		    0,     0, 0x0702,  // 115  0000 0001 0101.
		    0,     0, 0x1101,  // 116  0000 0001 1111.
		    0,     0, 0x1201,  // 117  0000 0001 1010.
		    0,     0, 0x1301,  // 118  0000 0001 1001.
		148*3, 152*3,      0,  // 119  0000 0000 1101
		    0,     0, 0x0403,  // 120  0000 0001 0010.
		153*3, 150*3,      0,  // 121  0000 0000 1011
		    0,     0, 0x0105,  // 122  0000 0001 1011.
		131*3, 135*3,      0,  // 123  0000 0000 0001
		    0,     0, 0x0204,  // 124  0000 0001 0100.
		149*3, 147*3,      0,  // 125  0000 0000 1100
		172*3, 173*3,      0,  // 126  0000 0000 0101 1
		162*3, 158*3,      0,  // 127  0000 0000 0010 0
		170*3, 161*3,      0,  // 128  0000 0000 0110 0
		168*3, 166*3,      0,  // 129  0000 0000 0110 1
		157*3, 179*3,      0,  // 130  0000 0000 0101 0
		169*3, 167*3,      0,  // 131  0000 0000 0001 0
		174*3, 171*3,      0,  // 132  0000 0000 0011 0
		178*3, 177*3,      0,  // 133  0000 0000 0100 1
		156*3, 159*3,      0,  // 134  0000 0000 0011 1
		164*3, 165*3,      0,  // 135  0000 0000 0001 1
		183*3, 182*3,      0,  // 136  0000 0000 0010 1
		175*3, 176*3,      0,  // 137  0000 0000 0100 0
		    0,     0, 0x0107,  // 138  0000 0000 1010 1.
		    0,     0, 0x0a02,  // 139  0000 0000 1000 0.
		    0,     0, 0x0902,  // 140  0000 0000 1000 1.
		    0,     0, 0x1601,  // 141  0000 0000 1111 1.
		    0,     0, 0x1701,  // 142  0000 0000 1111 0.
		    0,     0, 0x1901,  // 143  0000 0000 1110 0.
		    0,     0, 0x1801,  // 144  0000 0000 1110 1.
		    0,     0, 0x0503,  // 145  0000 0000 1001 0.
		    0,     0, 0x0304,  // 146  0000 0000 1001 1.
		    0,     0, 0x000d,  // 147  0000 0000 1100 1.
		    0,     0, 0x000c,  // 148  0000 0000 1101 0.
		    0,     0, 0x000e,  // 149  0000 0000 1100 0.
		    0,     0, 0x000f,  // 150  0000 0000 1011 1.
		    0,     0, 0x0205,  // 151  0000 0000 1010 0.
		    0,     0, 0x1a01,  // 152  0000 0000 1101 1.
		    0,     0, 0x0106,  // 153  0000 0000 1011 0.
		180*3, 181*3,      0,  // 154  0000 0000 0111 1
		160*3, 163*3,      0,  // 155  0000 0000 0111 0
		196*3, 199*3,      0,  // 156  0000 0000 0011 10
		    0,     0, 0x001b,  // 157  0000 0000 0101 00.
		203*3, 185*3,      0,  // 158  0000 0000 0010 01
		202*3, 201*3,      0,  // 159  0000 0000 0011 11
		    0,     0, 0x0013,  // 160  0000 0000 0111 00.
		    0,     0, 0x0016,  // 161  0000 0000 0110 01.
		197*3, 207*3,      0,  // 162  0000 0000 0010 00
		    0,     0, 0x0012,  // 163  0000 0000 0111 01.
		191*3, 192*3,      0,  // 164  0000 0000 0001 10
		188*3, 190*3,      0,  // 165  0000 0000 0001 11
		    0,     0, 0x0014,  // 166  0000 0000 0110 11.
		184*3, 194*3,      0,  // 167  0000 0000 0001 01
		    0,     0, 0x0015,  // 168  0000 0000 0110 10.
		186*3, 193*3,      0,  // 169  0000 0000 0001 00
		    0,     0, 0x0017,  // 170  0000 0000 0110 00.
		204*3, 198*3,      0,  // 171  0000 0000 0011 01
		    0,     0, 0x0019,  // 172  0000 0000 0101 10.
		    0,     0, 0x0018,  // 173  0000 0000 0101 11.
		200*3, 205*3,      0,  // 174  0000 0000 0011 00
		    0,     0, 0x001f,  // 175  0000 0000 0100 00.
		    0,     0, 0x001e,  // 176  0000 0000 0100 01.
		    0,     0, 0x001c,  // 177  0000 0000 0100 11.
		    0,     0, 0x001d,  // 178  0000 0000 0100 10.
		    0,     0, 0x001a,  // 179  0000 0000 0101 01.
		    0,     0, 0x0011,  // 180  0000 0000 0111 10.
		    0,     0, 0x0010,  // 181  0000 0000 0111 11.
		189*3, 206*3,      0,  // 182  0000 0000 0010 11
		187*3, 195*3,      0,  // 183  0000 0000 0010 10
		218*3, 211*3,      0,  // 184  0000 0000 0001 010
		    0,     0, 0x0025,  // 185  0000 0000 0010 011.
		215*3, 216*3,      0,  // 186  0000 0000 0001 000
		    0,     0, 0x0024,  // 187  0000 0000 0010 100.
		210*3, 212*3,      0,  // 188  0000 0000 0001 110
		    0,     0, 0x0022,  // 189  0000 0000 0010 110.
		213*3, 209*3,      0,  // 190  0000 0000 0001 111
		221*3, 222*3,      0,  // 191  0000 0000 0001 100
		219*3, 208*3,      0,  // 192  0000 0000 0001 101
		217*3, 214*3,      0,  // 193  0000 0000 0001 001
		223*3, 220*3,      0,  // 194  0000 0000 0001 011
		    0,     0, 0x0023,  // 195  0000 0000 0010 101.
		    0,     0, 0x010b,  // 196  0000 0000 0011 100.
		    0,     0, 0x0028,  // 197  0000 0000 0010 000.
		    0,     0, 0x010c,  // 198  0000 0000 0011 011.
		    0,     0, 0x010a,  // 199  0000 0000 0011 101.
		    0,     0, 0x0020,  // 200  0000 0000 0011 000.
		    0,     0, 0x0108,  // 201  0000 0000 0011 111.
		    0,     0, 0x0109,  // 202  0000 0000 0011 110.
		    0,     0, 0x0026,  // 203  0000 0000 0010 010.
		    0,     0, 0x010d,  // 204  0000 0000 0011 010.
		    0,     0, 0x010e,  // 205  0000 0000 0011 001.
		    0,     0, 0x0021,  // 206  0000 0000 0010 111.
		    0,     0, 0x0027,  // 207  0000 0000 0010 001.
		    0,     0, 0x1f01,  // 208  0000 0000 0001 1011.
		    0,     0, 0x1b01,  // 209  0000 0000 0001 1111.
		    0,     0, 0x1e01,  // 210  0000 0000 0001 1100.
		    0,     0, 0x1002,  // 211  0000 0000 0001 0101.
		    0,     0, 0x1d01,  // 212  0000 0000 0001 1101.
		    0,     0, 0x1c01,  // 213  0000 0000 0001 1110.
		    0,     0, 0x010f,  // 214  0000 0000 0001 0011.
		    0,     0, 0x0112,  // 215  0000 0000 0001 0000.
		    0,     0, 0x0111,  // 216  0000 0000 0001 0001.
		    0,     0, 0x0110,  // 217  0000 0000 0001 0010.
		    0,     0, 0x0603,  // 218  0000 0000 0001 0100.
		    0,     0, 0x0b02,  // 219  0000 0000 0001 1010.
		    0,     0, 0x0e02,  // 220  0000 0000 0001 0111.
		    0,     0, 0x0d02,  // 221  0000 0000 0001 1000.
		    0,     0, 0x0c02,  // 222  0000 0000 0001 1001.
		    0,     0, 0x0f02   // 223  0000 0000 0001 0110.
	]),
	
	PICTURE_TYPE_I = 1,
	PICTURE_TYPE_P = 2,
	PICTURE_TYPE_B = 3,
	PICTURE_TYPE_D = 4,
	
	START_SEQUENCE = 0xB3,
	START_SLICE_FIRST = 0x01,
	START_SLICE_LAST = 0xAF,
	START_PICTURE = 0x00,
	START_EXTENSION = 0xB5,
	START_USER_DATA = 0xB2;
	
var MACROBLOCK_TYPE_TABLES = [
	null,
	MACROBLOCK_TYPE_I,
	MACROBLOCK_TYPE_P,
	MACROBLOCK_TYPE_B
];



// ----------------------------------------------------------------------------
// Bit Reader 

var BitReader = function(arrayBuffer) {
	this.bytes = new Uint8Array(arrayBuffer);
	this.length = this.bytes.length;
	this.writePos = this.bytes.length;
	this.index = 0;
};

BitReader.NOT_FOUND = -1;

BitReader.prototype.findNextMPEGStartCode = function() {	
	for( var i = (this.index+7 >> 3); i < this.writePos; i++ ) {
		if(
			this.bytes[i] == 0x00 &&
			this.bytes[i+1] == 0x00 &&
			this.bytes[i+2] == 0x01
		) {
			this.index = (i+4) << 3;
			return this.bytes[i+3];
		}
	}
	this.index = (this.writePos << 3);
	return BitReader.NOT_FOUND;
};

BitReader.prototype.nextBytesAreStartCode = function() {
	var i = (this.index+7 >> 3);
	return (
		i >= this.writePos || (
			this.bytes[i] == 0x00 && 
			this.bytes[i+1] == 0x00 &&
			this.bytes[i+2] == 0x01
		)
	);
};

BitReader.prototype.nextBits = function(count) {
	var 
		byteOffset = this.index >> 3,
		room = (8 - this.index % 8);

	if( room >= count ) {
		return (this.bytes[byteOffset] >> (room - count)) & (0xff >> (8-count));
	}

	var 
		leftover = (this.index + count) % 8, // Leftover bits in last byte
		end = (this.index + count -1) >> 3,
		value = this.bytes[byteOffset] & (0xff >> (8-room)); // Fill out first byte

	for( byteOffset++; byteOffset < end; byteOffset++ ) {
		value <<= 8; // Shift and
		value |= this.bytes[byteOffset]; // Put next byte
	}

	if (leftover > 0) {
		value <<= leftover; // Make room for remaining bits
		value |= (this.bytes[byteOffset] >> (8 - leftover));
	}
	else {
		value <<= 8;
		value |= this.bytes[byteOffset];
	}
	
	return value;
};

BitReader.prototype.getBits = function(count) {
	var value = this.nextBits(count);
	this.index += count;
	return value;
};

BitReader.prototype.advance = function(count) {
	return (this.index += count);
};

BitReader.prototype.rewind = function(count) {
	return (this.index -= count);
};
	
})(window);


});
require.register("openautomation/lib/rest.js", function(exports, require, module){

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
});
require.register("openautomation/lib/sprite.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var events = require('events');
var Emitter = require('emitter');
var inherit = require('inherit');

/**
 * Expose `Sprite`.
 */

module.exports = Sprite;

/**
 * Instantiate a new `Sprite`.
 *
 * A "sprite" is just a generic UI game-like component.
 *
 * @param {Object} opts Default properties on the sprite.
 * @param {SVG} parent The parent SVG element.
 */

function Sprite(parent, opts) {
  opts = opts || {};
  this.parent = parent;

  for (var name in opts) {
    if (opts.hasOwnProperty(name)) {
      this[name] = opts[name];
    }
  }

  this.draw();
  this.bind();
}

/**
 * Mixin `Emitter`.
 */

Emitter(Sprite.prototype);

/**
 * Setup the drawing.
 */

Sprite.prototype.draw = function(){
  throw new Error('Subclass must implement');
};

/**
 * Setup event handlers.
 */

Sprite.prototype.bind = function(){

};
});
require.register("openautomation/lib/microplate.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var events = require('events');
var Emitter = require('emitter');

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
  group.attr('class', 'microplate');

  // draw rectangle
  var rect = this.rect = this.parent.rect(100, 100);
  rect.radius(10);
  rect.fill({ opacity: 0 });
  rect.stroke({ width: 2 });
  rect.attr('class', 'microplate-box');
  group.add(rect);

  // draw wells
  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.columns; j++) {
      this.drawWell(i, j);
    }
  }

  this.size(this.bounds.width, this.bounds.height);
};

/**
 * Draw well.
 */

Microplate.prototype.drawWell = function(row, column){
  var x = this.padding.left + (column * (this.wellRadius + 1));
  var y = this.padding.top + (row * (this.wellRadius + 1));

  var circle = this.parent.circle(this.wellRadius);
  circle.attr('class', 'microplate-well');
  circle.fill({ opacity: 0 });
  circle.stroke({ width: 1 });
  circle.move(x, y);
  // XXX: all svg objects should be tied to formal data models with schemas eventually
  circle.node.__data__ = { row: row, column: column };
  this.group.add(circle);
};

/**
 * Bind event listeners.
 */

Microplate.prototype.bind = function(){
  this.events = events(this.group.node, this);
  this.events.bind('click .microplate-well');
  //this.group.click(this.onclick.bind(this));
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
  this.emit('select', e.target.__data__);
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
require.register("openautomation/lib/liquid-container.js", function(exports, require, module){

/**
 * Expose `LiquidContainer`.
 */

module.exports = LiquidContainer;

/**
 * Instantiate a new `LiquidContainer`.
 */

function LiquidContainer(parent, opts) {
  this.parent = parent;
  this.opts = opts || {};
  this.draw();
}

/**
 * Draw.
 */

LiquidContainer.prototype.draw = function(){
  this.drawing = this.parent.circle(this.opts.radius || 40);
  this.drawing.fill({ color: 'blue' });
};
});
require.register("openautomation/lib/petri-dish.js", function(exports, require, module){

});
require.register("openautomation/lib/steps.js", function(exports, require, module){

/**
 * Expose `parser`.
 */

exports = module.exports = parser;

/**
 * Hooks.
 */

exports.callbacks = [];

/**
 * Parse step into data.
 */

function parser(str) {
  var match, callback;

  exports.callbacks.forEach(function(arr){
    callback = arr;
    match = str.match(callback[0]);
    if (match) return false;
  });

  return callback[1].apply(null, match);
}

/**
 * Add parser hook.
 */

exports.use = function(pattern, fn){
  exports.callbacks.push([ pattern, fn ]);
};
});
require.register("openautomation/index.js", function(exports, require, module){

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
require('./lib/jsmpg');
console.log('after');
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

//require('live-css').start();

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
    { title: 'Microscopy',
      icon: 'microscope',
      variables: [
        { name: 'Zoom level', value: 400, type: 'number' } ] },
    { title: 'Shake',
      icon: 'shaker',
      variables: [
        { name: 'Intensity', value: 20, type: 'number' } ] }
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

//var video = document.getElementById('webcam');
var canvas = document.getElementById('canvas');
canvas.style.zIndex = 0;
//canvas.width = document.body.clientWidth;
//canvas.height = document.body.clientHeight;

// Setup the WebSocket connection and start the player
var client = new WebSocket('ws://192.168.34.168:8084/');		//TODO: get local/external IP address
console.log('created websocket client', client instanceof WebSocket);
var player = new jsmpeg(client, {canvas:canvas});

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
    //video.play();
  } else {
    //video.pause();
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

/*navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

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
});*/

function start() {
  //video.play();
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
/*
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
*/

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

  /*if (video.readyState === video.HAVE_ENOUGH_DATA) {
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
  }*/
}

});




















































require.alias("juliangruber-get-user-media/index.js", "openautomation/deps/get-user-media/index.js");
require.alias("juliangruber-get-user-media/index.js", "openautomation/deps/get-user-media/index.js");
require.alias("juliangruber-get-user-media/index.js", "get-user-media/index.js");
require.alias("juliangruber-get-user-media/index.js", "juliangruber-get-user-media/index.js");
require.alias("brighthas-window2canvas/index.js", "openautomation/deps/window2canvas/index.js");
require.alias("brighthas-window2canvas/index.js", "openautomation/deps/window2canvas/index.js");
require.alias("brighthas-window2canvas/index.js", "window2canvas/index.js");
require.alias("brighthas-window2canvas/index.js", "brighthas-window2canvas/index.js");
require.alias("component-event/index.js", "openautomation/deps/event/index.js");
require.alias("component-event/index.js", "event/index.js");

require.alias("component-events/index.js", "openautomation/deps/events/index.js");
require.alias("component-events/index.js", "events/index.js");
require.alias("component-event/index.js", "component-events/deps/event/index.js");

require.alias("component-delegate/index.js", "component-events/deps/delegate/index.js");
require.alias("discore-closest/index.js", "component-delegate/deps/closest/index.js");
require.alias("discore-closest/index.js", "component-delegate/deps/closest/index.js");
require.alias("component-matches-selector/index.js", "discore-closest/deps/matches-selector/index.js");
require.alias("component-query/index.js", "component-matches-selector/deps/query/index.js");

require.alias("discore-closest/index.js", "discore-closest/index.js");
require.alias("component-event/index.js", "component-delegate/deps/event/index.js");

require.alias("component-emitter/index.js", "openautomation/deps/emitter/index.js");
require.alias("component-emitter/index.js", "emitter/index.js");

require.alias("intron-transform-bounds/index.js", "openautomation/deps/transform-bounds/index.js");
require.alias("intron-transform-bounds/index.js", "transform-bounds/index.js");

require.alias("visionmedia-superagent/lib/client.js", "openautomation/deps/superagent/lib/client.js");
require.alias("visionmedia-superagent/lib/client.js", "openautomation/deps/superagent/index.js");
require.alias("visionmedia-superagent/lib/client.js", "superagent/index.js");
require.alias("component-emitter/index.js", "visionmedia-superagent/deps/emitter/index.js");

require.alias("component-reduce/index.js", "visionmedia-superagent/deps/reduce/index.js");

require.alias("visionmedia-superagent/lib/client.js", "visionmedia-superagent/index.js");
require.alias("wout-svg.js/dist/svg.js", "openautomation/deps/svg.js/dist/svg.js");
require.alias("wout-svg.js/dist/svg.js", "openautomation/deps/svg.js/index.js");
require.alias("wout-svg.js/dist/svg.js", "svg.js/index.js");
require.alias("wout-svg.js/dist/svg.js", "wout-svg.js/index.js");
require.alias("component-inherit/index.js", "openautomation/deps/inherit/index.js");
require.alias("component-inherit/index.js", "inherit/index.js");

require.alias("tower-resource/index.js", "openautomation/deps/tower-resource/index.js");
require.alias("tower-resource/lib/static.js", "openautomation/deps/tower-resource/lib/static.js");
require.alias("tower-resource/lib/proto.js", "openautomation/deps/tower-resource/lib/proto.js");
require.alias("tower-resource/index.js", "openautomation/deps/tower-resource/index.js");
require.alias("tower-resource/index.js", "tower-resource/index.js");
require.alias("tower-emitter/index.js", "tower-resource/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-resource/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-stream/index.js", "tower-resource/deps/tower-stream/index.js");
require.alias("tower-stream/lib/static.js", "tower-resource/deps/tower-stream/lib/static.js");
require.alias("tower-stream/lib/proto.js", "tower-resource/deps/tower-stream/lib/proto.js");
require.alias("tower-stream/lib/api.js", "tower-resource/deps/tower-stream/lib/api.js");
require.alias("tower-stream/index.js", "tower-resource/deps/tower-stream/index.js");
require.alias("tower-emitter/index.js", "tower-stream/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-stream/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-param/index.js", "tower-stream/deps/tower-param/index.js");
require.alias("tower-param/lib/validators.js", "tower-stream/deps/tower-param/lib/validators.js");
require.alias("tower-emitter/index.js", "tower-param/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-param/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-param/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-param/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-param/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-param/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-param/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-array/index.js", "tower-param/deps/part-is-array/index.js");

require.alias("tower-attr/index.js", "tower-stream/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-stream/deps/tower-attr/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-attr/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-attr/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-attr/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-blank/index.js", "tower-attr/deps/part-is-blank/index.js");

require.alias("part-async-series/index.js", "tower-attr/deps/part-async-series/index.js");

require.alias("component-type/index.js", "tower-attr/deps/type/index.js");

require.alias("tower-load/index.js", "tower-stream/deps/tower-load/index.js");

require.alias("tower-stream/index.js", "tower-stream/index.js");
require.alias("tower-query/index.js", "tower-resource/deps/tower-query/index.js");
require.alias("tower-query/lib/constraint.js", "tower-resource/deps/tower-query/lib/constraint.js");
require.alias("tower-query/lib/validate.js", "tower-resource/deps/tower-query/lib/validate.js");
require.alias("tower-query/lib/validate-constraints.js", "tower-resource/deps/tower-query/lib/validate-constraints.js");
require.alias("tower-query/lib/filter.js", "tower-resource/deps/tower-query/lib/filter.js");
require.alias("tower-query/lib/subscriber.js", "tower-resource/deps/tower-query/lib/subscriber.js");
require.alias("tower-validator/index.js", "tower-query/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-query/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-query/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-program/index.js", "tower-query/deps/tower-program/index.js");
require.alias("tower-program/lib/proto.js", "tower-query/deps/tower-program/lib/proto.js");
require.alias("tower-program/lib/statics.js", "tower-query/deps/tower-program/lib/statics.js");
require.alias("tower-emitter/index.js", "tower-program/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-program/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-stream/index.js", "tower-program/deps/tower-stream/index.js");
require.alias("tower-stream/lib/static.js", "tower-program/deps/tower-stream/lib/static.js");
require.alias("tower-stream/lib/proto.js", "tower-program/deps/tower-stream/lib/proto.js");
require.alias("tower-stream/lib/api.js", "tower-program/deps/tower-stream/lib/api.js");
require.alias("tower-stream/index.js", "tower-program/deps/tower-stream/index.js");
require.alias("tower-emitter/index.js", "tower-stream/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-stream/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-param/index.js", "tower-stream/deps/tower-param/index.js");
require.alias("tower-param/lib/validators.js", "tower-stream/deps/tower-param/lib/validators.js");
require.alias("tower-emitter/index.js", "tower-param/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-param/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-param/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-param/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-param/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-param/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-param/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-array/index.js", "tower-param/deps/part-is-array/index.js");

require.alias("tower-attr/index.js", "tower-stream/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-stream/deps/tower-attr/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-attr/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-attr/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-attr/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-blank/index.js", "tower-attr/deps/part-is-blank/index.js");

require.alias("part-async-series/index.js", "tower-attr/deps/part-async-series/index.js");

require.alias("component-type/index.js", "tower-attr/deps/type/index.js");

require.alias("tower-load/index.js", "tower-stream/deps/tower-load/index.js");

require.alias("tower-stream/index.js", "tower-stream/index.js");
require.alias("part-each-array/index.js", "tower-query/deps/part-each-array/index.js");

require.alias("part-is-array/index.js", "tower-query/deps/part-is-array/index.js");

require.alias("tower-attr/index.js", "tower-resource/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-resource/deps/tower-attr/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-attr/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-attr/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-attr/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-blank/index.js", "tower-attr/deps/part-is-blank/index.js");

require.alias("part-async-series/index.js", "tower-attr/deps/part-async-series/index.js");

require.alias("component-type/index.js", "tower-attr/deps/type/index.js");

require.alias("tower-validator/index.js", "tower-resource/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-resource/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-resource/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-text/index.js", "tower-resource/deps/tower-text/index.js");
require.alias("tower-text/index.js", "tower-resource/deps/tower-text/index.js");
require.alias("tower-text/index.js", "tower-text/index.js");
require.alias("tower-load/index.js", "tower-resource/deps/tower-load/index.js");

require.alias("part-async-series/index.js", "tower-resource/deps/part-async-series/index.js");

require.alias("tower-resource/index.js", "tower-resource/index.js");
require.alias("tower-query/index.js", "openautomation/deps/tower-query/index.js");
require.alias("tower-query/lib/constraint.js", "openautomation/deps/tower-query/lib/constraint.js");
require.alias("tower-query/lib/validate.js", "openautomation/deps/tower-query/lib/validate.js");
require.alias("tower-query/lib/validate-constraints.js", "openautomation/deps/tower-query/lib/validate-constraints.js");
require.alias("tower-query/lib/filter.js", "openautomation/deps/tower-query/lib/filter.js");
require.alias("tower-query/lib/subscriber.js", "openautomation/deps/tower-query/lib/subscriber.js");
require.alias("tower-query/index.js", "tower-query/index.js");
require.alias("tower-validator/index.js", "tower-query/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-query/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-query/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-program/index.js", "tower-query/deps/tower-program/index.js");
require.alias("tower-program/lib/proto.js", "tower-query/deps/tower-program/lib/proto.js");
require.alias("tower-program/lib/statics.js", "tower-query/deps/tower-program/lib/statics.js");
require.alias("tower-emitter/index.js", "tower-program/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-program/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-stream/index.js", "tower-program/deps/tower-stream/index.js");
require.alias("tower-stream/lib/static.js", "tower-program/deps/tower-stream/lib/static.js");
require.alias("tower-stream/lib/proto.js", "tower-program/deps/tower-stream/lib/proto.js");
require.alias("tower-stream/lib/api.js", "tower-program/deps/tower-stream/lib/api.js");
require.alias("tower-stream/index.js", "tower-program/deps/tower-stream/index.js");
require.alias("tower-emitter/index.js", "tower-stream/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-stream/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-param/index.js", "tower-stream/deps/tower-param/index.js");
require.alias("tower-param/lib/validators.js", "tower-stream/deps/tower-param/lib/validators.js");
require.alias("tower-emitter/index.js", "tower-param/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-param/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-param/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-param/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-param/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-param/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-param/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-array/index.js", "tower-param/deps/part-is-array/index.js");

require.alias("tower-attr/index.js", "tower-stream/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-stream/deps/tower-attr/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-attr/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-attr/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-attr/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-blank/index.js", "tower-attr/deps/part-is-blank/index.js");

require.alias("part-async-series/index.js", "tower-attr/deps/part-async-series/index.js");

require.alias("component-type/index.js", "tower-attr/deps/type/index.js");

require.alias("tower-load/index.js", "tower-stream/deps/tower-load/index.js");

require.alias("tower-stream/index.js", "tower-stream/index.js");
require.alias("part-each-array/index.js", "tower-query/deps/part-each-array/index.js");

require.alias("part-is-array/index.js", "tower-query/deps/part-is-array/index.js");

require.alias("tower-adapter/index.js", "openautomation/deps/tower-adapter/index.js");
require.alias("tower-adapter/index.js", "tower-adapter/index.js");
require.alias("tower-emitter/index.js", "tower-adapter/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-adapter/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-stream/index.js", "tower-adapter/deps/tower-stream/index.js");
require.alias("tower-stream/lib/static.js", "tower-adapter/deps/tower-stream/lib/static.js");
require.alias("tower-stream/lib/proto.js", "tower-adapter/deps/tower-stream/lib/proto.js");
require.alias("tower-stream/lib/api.js", "tower-adapter/deps/tower-stream/lib/api.js");
require.alias("tower-stream/index.js", "tower-adapter/deps/tower-stream/index.js");
require.alias("tower-emitter/index.js", "tower-stream/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-stream/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-param/index.js", "tower-stream/deps/tower-param/index.js");
require.alias("tower-param/lib/validators.js", "tower-stream/deps/tower-param/lib/validators.js");
require.alias("tower-emitter/index.js", "tower-param/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-param/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-param/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-param/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-param/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-param/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-param/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-array/index.js", "tower-param/deps/part-is-array/index.js");

require.alias("tower-attr/index.js", "tower-stream/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-stream/deps/tower-attr/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-attr/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-attr/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-attr/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-blank/index.js", "tower-attr/deps/part-is-blank/index.js");

require.alias("part-async-series/index.js", "tower-attr/deps/part-async-series/index.js");

require.alias("component-type/index.js", "tower-attr/deps/type/index.js");

require.alias("tower-load/index.js", "tower-stream/deps/tower-load/index.js");

require.alias("tower-stream/index.js", "tower-stream/index.js");
require.alias("tower-query/index.js", "tower-adapter/deps/tower-query/index.js");
require.alias("tower-query/lib/constraint.js", "tower-adapter/deps/tower-query/lib/constraint.js");
require.alias("tower-query/lib/validate.js", "tower-adapter/deps/tower-query/lib/validate.js");
require.alias("tower-query/lib/validate-constraints.js", "tower-adapter/deps/tower-query/lib/validate-constraints.js");
require.alias("tower-query/lib/filter.js", "tower-adapter/deps/tower-query/lib/filter.js");
require.alias("tower-query/lib/subscriber.js", "tower-adapter/deps/tower-query/lib/subscriber.js");
require.alias("tower-validator/index.js", "tower-query/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-query/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-query/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-program/index.js", "tower-query/deps/tower-program/index.js");
require.alias("tower-program/lib/proto.js", "tower-query/deps/tower-program/lib/proto.js");
require.alias("tower-program/lib/statics.js", "tower-query/deps/tower-program/lib/statics.js");
require.alias("tower-emitter/index.js", "tower-program/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-program/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-stream/index.js", "tower-program/deps/tower-stream/index.js");
require.alias("tower-stream/lib/static.js", "tower-program/deps/tower-stream/lib/static.js");
require.alias("tower-stream/lib/proto.js", "tower-program/deps/tower-stream/lib/proto.js");
require.alias("tower-stream/lib/api.js", "tower-program/deps/tower-stream/lib/api.js");
require.alias("tower-stream/index.js", "tower-program/deps/tower-stream/index.js");
require.alias("tower-emitter/index.js", "tower-stream/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-stream/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-param/index.js", "tower-stream/deps/tower-param/index.js");
require.alias("tower-param/lib/validators.js", "tower-stream/deps/tower-param/lib/validators.js");
require.alias("tower-emitter/index.js", "tower-param/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-param/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-param/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-param/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-param/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-param/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-param/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-array/index.js", "tower-param/deps/part-is-array/index.js");

require.alias("tower-attr/index.js", "tower-stream/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-stream/deps/tower-attr/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-attr/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-attr/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-attr/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-blank/index.js", "tower-attr/deps/part-is-blank/index.js");

require.alias("part-async-series/index.js", "tower-attr/deps/part-async-series/index.js");

require.alias("component-type/index.js", "tower-attr/deps/type/index.js");

require.alias("tower-load/index.js", "tower-stream/deps/tower-load/index.js");

require.alias("tower-stream/index.js", "tower-stream/index.js");
require.alias("part-each-array/index.js", "tower-query/deps/part-each-array/index.js");

require.alias("part-is-array/index.js", "tower-query/deps/part-is-array/index.js");

require.alias("tower-resource/index.js", "tower-adapter/deps/tower-resource/index.js");
require.alias("tower-resource/lib/static.js", "tower-adapter/deps/tower-resource/lib/static.js");
require.alias("tower-resource/lib/proto.js", "tower-adapter/deps/tower-resource/lib/proto.js");
require.alias("tower-resource/index.js", "tower-adapter/deps/tower-resource/index.js");
require.alias("tower-emitter/index.js", "tower-resource/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-resource/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-stream/index.js", "tower-resource/deps/tower-stream/index.js");
require.alias("tower-stream/lib/static.js", "tower-resource/deps/tower-stream/lib/static.js");
require.alias("tower-stream/lib/proto.js", "tower-resource/deps/tower-stream/lib/proto.js");
require.alias("tower-stream/lib/api.js", "tower-resource/deps/tower-stream/lib/api.js");
require.alias("tower-stream/index.js", "tower-resource/deps/tower-stream/index.js");
require.alias("tower-emitter/index.js", "tower-stream/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-stream/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-param/index.js", "tower-stream/deps/tower-param/index.js");
require.alias("tower-param/lib/validators.js", "tower-stream/deps/tower-param/lib/validators.js");
require.alias("tower-emitter/index.js", "tower-param/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-param/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-param/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-param/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-param/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-param/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-param/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-array/index.js", "tower-param/deps/part-is-array/index.js");

require.alias("tower-attr/index.js", "tower-stream/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-stream/deps/tower-attr/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-attr/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-attr/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-attr/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-blank/index.js", "tower-attr/deps/part-is-blank/index.js");

require.alias("part-async-series/index.js", "tower-attr/deps/part-async-series/index.js");

require.alias("component-type/index.js", "tower-attr/deps/type/index.js");

require.alias("tower-load/index.js", "tower-stream/deps/tower-load/index.js");

require.alias("tower-stream/index.js", "tower-stream/index.js");
require.alias("tower-query/index.js", "tower-resource/deps/tower-query/index.js");
require.alias("tower-query/lib/constraint.js", "tower-resource/deps/tower-query/lib/constraint.js");
require.alias("tower-query/lib/validate.js", "tower-resource/deps/tower-query/lib/validate.js");
require.alias("tower-query/lib/validate-constraints.js", "tower-resource/deps/tower-query/lib/validate-constraints.js");
require.alias("tower-query/lib/filter.js", "tower-resource/deps/tower-query/lib/filter.js");
require.alias("tower-query/lib/subscriber.js", "tower-resource/deps/tower-query/lib/subscriber.js");
require.alias("tower-validator/index.js", "tower-query/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-query/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-query/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-program/index.js", "tower-query/deps/tower-program/index.js");
require.alias("tower-program/lib/proto.js", "tower-query/deps/tower-program/lib/proto.js");
require.alias("tower-program/lib/statics.js", "tower-query/deps/tower-program/lib/statics.js");
require.alias("tower-emitter/index.js", "tower-program/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-program/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-stream/index.js", "tower-program/deps/tower-stream/index.js");
require.alias("tower-stream/lib/static.js", "tower-program/deps/tower-stream/lib/static.js");
require.alias("tower-stream/lib/proto.js", "tower-program/deps/tower-stream/lib/proto.js");
require.alias("tower-stream/lib/api.js", "tower-program/deps/tower-stream/lib/api.js");
require.alias("tower-stream/index.js", "tower-program/deps/tower-stream/index.js");
require.alias("tower-emitter/index.js", "tower-stream/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-stream/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-param/index.js", "tower-stream/deps/tower-param/index.js");
require.alias("tower-param/lib/validators.js", "tower-stream/deps/tower-param/lib/validators.js");
require.alias("tower-emitter/index.js", "tower-param/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-param/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-param/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-param/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-param/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-param/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-param/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-array/index.js", "tower-param/deps/part-is-array/index.js");

require.alias("tower-attr/index.js", "tower-stream/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-stream/deps/tower-attr/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-attr/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-attr/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-attr/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-blank/index.js", "tower-attr/deps/part-is-blank/index.js");

require.alias("part-async-series/index.js", "tower-attr/deps/part-async-series/index.js");

require.alias("component-type/index.js", "tower-attr/deps/type/index.js");

require.alias("tower-load/index.js", "tower-stream/deps/tower-load/index.js");

require.alias("tower-stream/index.js", "tower-stream/index.js");
require.alias("part-each-array/index.js", "tower-query/deps/part-each-array/index.js");

require.alias("part-is-array/index.js", "tower-query/deps/part-is-array/index.js");

require.alias("tower-attr/index.js", "tower-resource/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-resource/deps/tower-attr/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-attr/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-attr/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-type/index.js", "tower-attr/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-attr/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("part-is-blank/index.js", "tower-attr/deps/part-is-blank/index.js");

require.alias("part-async-series/index.js", "tower-attr/deps/part-async-series/index.js");

require.alias("component-type/index.js", "tower-attr/deps/type/index.js");

require.alias("tower-validator/index.js", "tower-resource/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-resource/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-resource/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("tower-text/index.js", "tower-resource/deps/tower-text/index.js");
require.alias("tower-text/index.js", "tower-resource/deps/tower-text/index.js");
require.alias("tower-text/index.js", "tower-text/index.js");
require.alias("tower-load/index.js", "tower-resource/deps/tower-load/index.js");

require.alias("part-async-series/index.js", "tower-resource/deps/part-async-series/index.js");

require.alias("tower-resource/index.js", "tower-resource/index.js");
require.alias("tower-type/index.js", "tower-adapter/deps/tower-type/index.js");
require.alias("tower-type/lib/types.js", "tower-adapter/deps/tower-type/lib/types.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-type/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("tower-validator/lib/validators.js", "tower-type/deps/tower-validator/lib/validators.js");
require.alias("tower-validator/index.js", "tower-type/deps/tower-validator/index.js");
require.alias("component-indexof/index.js", "tower-validator/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-validator/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-validator/index.js", "tower-validator/index.js");
require.alias("part-is-array/index.js", "tower-type/deps/part-is-array/index.js");

require.alias("tower-load/index.js", "tower-adapter/deps/tower-load/index.js");


require.alias("component-live-css/index.js", "openautomation/deps/live-css/index.js");
require.alias("component-live-css/index.js", "live-css/index.js");
require.alias("visionmedia-superagent/lib/client.js", "component-live-css/deps/superagent/lib/client.js");
require.alias("visionmedia-superagent/lib/client.js", "component-live-css/deps/superagent/index.js");
require.alias("component-emitter/index.js", "visionmedia-superagent/deps/emitter/index.js");

require.alias("component-reduce/index.js", "visionmedia-superagent/deps/reduce/index.js");

require.alias("visionmedia-superagent/lib/client.js", "visionmedia-superagent/index.js");
require.alias("visionmedia-debug/debug.js", "component-live-css/deps/debug/debug.js");
require.alias("visionmedia-debug/debug.js", "component-live-css/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "visionmedia-debug/index.js");
require.alias("component-each/index.js", "component-live-css/deps/each/index.js");
require.alias("component-to-function/index.js", "component-each/deps/to-function/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");

require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("component-url/index.js", "component-live-css/deps/url/index.js");

require.alias("ftlabs-fastclick/lib/fastclick.js", "openautomation/deps/fastclick/lib/fastclick.js");
require.alias("ftlabs-fastclick/lib/fastclick.js", "openautomation/deps/fastclick/index.js");
require.alias("ftlabs-fastclick/lib/fastclick.js", "fastclick/index.js");
require.alias("ftlabs-fastclick/lib/fastclick.js", "ftlabs-fastclick/index.js");
require.alias("openautomation/index.js", "openautomation/index.js");