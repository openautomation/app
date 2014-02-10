
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
require.register("juliangruber-get-user-media/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Detect getUserMedia implementation.\n\
 */\n\
\n\
var getUserMedia = navigator.getUserMedia\n\
  || navigator.webkitGetUserMedia\n\
  || navigator.mozGetUserMedia\n\
  || navigator.msGetUserMedia;\n\
\n\
/**\n\
 * Node style getUserMedia.\n\
 *\n\
 * @param {Object} constraints\n\
 * @param {Function} fn\n\
 */\n\
\n\
module.exports = function(constraints, fn) {\n\
  getUserMedia.call(navigator, constraints, success, error);\n\
  \n\
  function success(stream) {\n\
    fn(null, stream);\n\
  }\n\
  \n\
  function error(err) {\n\
    fn(err);\n\
  }\n\
};\n\
//@ sourceURL=juliangruber-get-user-media/index.js"
));
require.register("brighthas-window2canvas/index.js", Function("exports, require, module",
"module.exports = function(canvas,windowX,windowY){\n\
    var bbox = canvas.getBoundingClientRect(),\n\
        w_scale = canvas.width/bbox.width,\n\
        h_scale = canvas.height/bbox.height;\n\
        \n\
    return {\n\
        x:windowX * w_scale - bbox.left * w_scale,\n\
        y:windowY * h_scale -bbox.top * h_scale\n\
    }\n\
}//@ sourceURL=brighthas-window2canvas/index.js"
));
require.register("component-event/index.js", Function("exports, require, module",
"var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',\n\
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',\n\
    prefix = bind !== 'addEventListener' ? 'on' : '';\n\
\n\
/**\n\
 * Bind `el` event `type` to `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.bind = function(el, type, fn, capture){\n\
  el[bind](prefix + type, fn, capture || false);\n\
  return fn;\n\
};\n\
\n\
/**\n\
 * Unbind `el` event `type`'s callback `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.unbind = function(el, type, fn, capture){\n\
  el[unbind](prefix + type, fn, capture || false);\n\
  return fn;\n\
};//@ sourceURL=component-event/index.js"
));
require.register("component-query/index.js", Function("exports, require, module",
"function one(selector, el) {\n\
  return el.querySelector(selector);\n\
}\n\
\n\
exports = module.exports = function(selector, el){\n\
  el = el || document;\n\
  return one(selector, el);\n\
};\n\
\n\
exports.all = function(selector, el){\n\
  el = el || document;\n\
  return el.querySelectorAll(selector);\n\
};\n\
\n\
exports.engine = function(obj){\n\
  if (!obj.one) throw new Error('.one callback required');\n\
  if (!obj.all) throw new Error('.all callback required');\n\
  one = obj.one;\n\
  exports.all = obj.all;\n\
  return exports;\n\
};\n\
//@ sourceURL=component-query/index.js"
));
require.register("component-matches-selector/index.js", Function("exports, require, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var query = require('query');\n\
\n\
/**\n\
 * Element prototype.\n\
 */\n\
\n\
var proto = Element.prototype;\n\
\n\
/**\n\
 * Vendor function.\n\
 */\n\
\n\
var vendor = proto.matches\n\
  || proto.webkitMatchesSelector\n\
  || proto.mozMatchesSelector\n\
  || proto.msMatchesSelector\n\
  || proto.oMatchesSelector;\n\
\n\
/**\n\
 * Expose `match()`.\n\
 */\n\
\n\
module.exports = match;\n\
\n\
/**\n\
 * Match `el` to `selector`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} selector\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
function match(el, selector) {\n\
  if (vendor) return vendor.call(el, selector);\n\
  var nodes = query.all(selector, el.parentNode);\n\
  for (var i = 0; i < nodes.length; ++i) {\n\
    if (nodes[i] == el) return true;\n\
  }\n\
  return false;\n\
}\n\
//@ sourceURL=component-matches-selector/index.js"
));
require.register("discore-closest/index.js", Function("exports, require, module",
"var matches = require('matches-selector')\n\
\n\
module.exports = function (element, selector, checkYoSelf, root) {\n\
  element = checkYoSelf ? {parentNode: element} : element\n\
\n\
  root = root || document\n\
\n\
  // Make sure `element !== document` and `element != null`\n\
  // otherwise we get an illegal invocation\n\
  while ((element = element.parentNode) && element !== document) {\n\
    if (matches(element, selector))\n\
      return element\n\
    // After `matches` on the edge case that\n\
    // the selector matches the root\n\
    // (when the root is not the document)\n\
    if (element === root)\n\
      return  \n\
  }\n\
}//@ sourceURL=discore-closest/index.js"
));
require.register("component-delegate/index.js", Function("exports, require, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var closest = require('closest')\n\
  , event = require('event');\n\
\n\
/**\n\
 * Delegate event `type` to `selector`\n\
 * and invoke `fn(e)`. A callback function\n\
 * is returned which may be passed to `.unbind()`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} selector\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.bind = function(el, selector, type, fn, capture){\n\
  return event.bind(el, type, function(e){\n\
    var target = e.target || e.srcElement;\n\
    e.delegateTarget = closest(target, selector, true, el);\n\
    if (e.delegateTarget) fn.call(el, e);\n\
  }, capture);\n\
};\n\
\n\
/**\n\
 * Unbind event `type`'s callback `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @api public\n\
 */\n\
\n\
exports.unbind = function(el, type, fn, capture){\n\
  event.unbind(el, type, fn, capture);\n\
};\n\
//@ sourceURL=component-delegate/index.js"
));
require.register("component-events/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var events = require('event');\n\
var delegate = require('delegate');\n\
\n\
/**\n\
 * Expose `Events`.\n\
 */\n\
\n\
module.exports = Events;\n\
\n\
/**\n\
 * Initialize an `Events` with the given\n\
 * `el` object which events will be bound to,\n\
 * and the `obj` which will receive method calls.\n\
 *\n\
 * @param {Object} el\n\
 * @param {Object} obj\n\
 * @api public\n\
 */\n\
\n\
function Events(el, obj) {\n\
  if (!(this instanceof Events)) return new Events(el, obj);\n\
  if (!el) throw new Error('element required');\n\
  if (!obj) throw new Error('object required');\n\
  this.el = el;\n\
  this.obj = obj;\n\
  this._events = {};\n\
}\n\
\n\
/**\n\
 * Subscription helper.\n\
 */\n\
\n\
Events.prototype.sub = function(event, method, cb){\n\
  this._events[event] = this._events[event] || {};\n\
  this._events[event][method] = cb;\n\
};\n\
\n\
/**\n\
 * Bind to `event` with optional `method` name.\n\
 * When `method` is undefined it becomes `event`\n\
 * with the \"on\" prefix.\n\
 *\n\
 * Examples:\n\
 *\n\
 *  Direct event handling:\n\
 *\n\
 *    events.bind('click') // implies \"onclick\"\n\
 *    events.bind('click', 'remove')\n\
 *    events.bind('click', 'sort', 'asc')\n\
 *\n\
 *  Delegated event handling:\n\
 *\n\
 *    events.bind('click li > a')\n\
 *    events.bind('click li > a', 'remove')\n\
 *    events.bind('click a.sort-ascending', 'sort', 'asc')\n\
 *    events.bind('click a.sort-descending', 'sort', 'desc')\n\
 *\n\
 * @param {String} event\n\
 * @param {String|function} [method]\n\
 * @return {Function} callback\n\
 * @api public\n\
 */\n\
\n\
Events.prototype.bind = function(event, method){\n\
  var e = parse(event);\n\
  var el = this.el;\n\
  var obj = this.obj;\n\
  var name = e.name;\n\
  var method = method || 'on' + name;\n\
  var args = [].slice.call(arguments, 2);\n\
\n\
  // callback\n\
  function cb(){\n\
    var a = [].slice.call(arguments).concat(args);\n\
    obj[method].apply(obj, a);\n\
  }\n\
\n\
  // bind\n\
  if (e.selector) {\n\
    cb = delegate.bind(el, e.selector, name, cb);\n\
  } else {\n\
    events.bind(el, name, cb);\n\
  }\n\
\n\
  // subscription for unbinding\n\
  this.sub(name, method, cb);\n\
\n\
  return cb;\n\
};\n\
\n\
/**\n\
 * Unbind a single binding, all bindings for `event`,\n\
 * or all bindings within the manager.\n\
 *\n\
 * Examples:\n\
 *\n\
 *  Unbind direct handlers:\n\
 *\n\
 *     events.unbind('click', 'remove')\n\
 *     events.unbind('click')\n\
 *     events.unbind()\n\
 *\n\
 * Unbind delegate handlers:\n\
 *\n\
 *     events.unbind('click', 'remove')\n\
 *     events.unbind('click')\n\
 *     events.unbind()\n\
 *\n\
 * @param {String|Function} [event]\n\
 * @param {String|Function} [method]\n\
 * @api public\n\
 */\n\
\n\
Events.prototype.unbind = function(event, method){\n\
  if (0 == arguments.length) return this.unbindAll();\n\
  if (1 == arguments.length) return this.unbindAllOf(event);\n\
\n\
  // no bindings for this event\n\
  var bindings = this._events[event];\n\
  if (!bindings) return;\n\
\n\
  // no bindings for this method\n\
  var cb = bindings[method];\n\
  if (!cb) return;\n\
\n\
  events.unbind(this.el, event, cb);\n\
};\n\
\n\
/**\n\
 * Unbind all events.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
Events.prototype.unbindAll = function(){\n\
  for (var event in this._events) {\n\
    this.unbindAllOf(event);\n\
  }\n\
};\n\
\n\
/**\n\
 * Unbind all events for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @api private\n\
 */\n\
\n\
Events.prototype.unbindAllOf = function(event){\n\
  var bindings = this._events[event];\n\
  if (!bindings) return;\n\
\n\
  for (var method in bindings) {\n\
    this.unbind(event, method);\n\
  }\n\
};\n\
\n\
/**\n\
 * Parse `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function parse(event) {\n\
  var parts = event.split(/ +/);\n\
  return {\n\
    name: parts.shift(),\n\
    selector: parts.join(' ')\n\
  }\n\
}\n\
//@ sourceURL=component-events/index.js"
));
require.register("component-emitter/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `Emitter`.\n\
 */\n\
\n\
module.exports = Emitter;\n\
\n\
/**\n\
 * Initialize a new `Emitter`.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function Emitter(obj) {\n\
  if (obj) return mixin(obj);\n\
};\n\
\n\
/**\n\
 * Mixin the emitter properties.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function mixin(obj) {\n\
  for (var key in Emitter.prototype) {\n\
    obj[key] = Emitter.prototype[key];\n\
  }\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Listen on the given `event` with `fn`.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.on =\n\
Emitter.prototype.addEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
  (this._callbacks[event] = this._callbacks[event] || [])\n\
    .push(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Adds an `event` listener that will be invoked a single\n\
 * time then automatically removed.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.once = function(event, fn){\n\
  var self = this;\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  function on() {\n\
    self.off(event, on);\n\
    fn.apply(this, arguments);\n\
  }\n\
\n\
  on.fn = fn;\n\
  this.on(event, on);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove the given callback for `event` or all\n\
 * registered callbacks.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.off =\n\
Emitter.prototype.removeListener =\n\
Emitter.prototype.removeAllListeners =\n\
Emitter.prototype.removeEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  // all\n\
  if (0 == arguments.length) {\n\
    this._callbacks = {};\n\
    return this;\n\
  }\n\
\n\
  // specific event\n\
  var callbacks = this._callbacks[event];\n\
  if (!callbacks) return this;\n\
\n\
  // remove all handlers\n\
  if (1 == arguments.length) {\n\
    delete this._callbacks[event];\n\
    return this;\n\
  }\n\
\n\
  // remove specific handler\n\
  var cb;\n\
  for (var i = 0; i < callbacks.length; i++) {\n\
    cb = callbacks[i];\n\
    if (cb === fn || cb.fn === fn) {\n\
      callbacks.splice(i, 1);\n\
      break;\n\
    }\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Emit `event` with the given args.\n\
 *\n\
 * @param {String} event\n\
 * @param {Mixed} ...\n\
 * @return {Emitter}\n\
 */\n\
\n\
Emitter.prototype.emit = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  var args = [].slice.call(arguments, 1)\n\
    , callbacks = this._callbacks[event];\n\
\n\
  if (callbacks) {\n\
    callbacks = callbacks.slice(0);\n\
    for (var i = 0, len = callbacks.length; i < len; ++i) {\n\
      callbacks[i].apply(this, args);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return array of callbacks for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.listeners = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  return this._callbacks[event] || [];\n\
};\n\
\n\
/**\n\
 * Check if this emitter has `event` handlers.\n\
 *\n\
 * @param {String} event\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.hasListeners = function(event){\n\
  return !! this.listeners(event).length;\n\
};\n\
//@ sourceURL=component-emitter/index.js"
));
require.register("intron-transform-bounds/index.js", Function("exports, require, module",
"module.exports = function(x, y, source, target) {\n\
  var newX = (x / source.width) * target.width;\n\
  var newY = (y / source.height) * target.height;\n\
  return { x: newX, y: newY };\n\
}\n\
//@ sourceURL=intron-transform-bounds/index.js"
));
require.register("component-reduce/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Reduce `arr` with `fn`.\n\
 *\n\
 * @param {Array} arr\n\
 * @param {Function} fn\n\
 * @param {Mixed} initial\n\
 *\n\
 * TODO: combatible error handling?\n\
 */\n\
\n\
module.exports = function(arr, fn, initial){  \n\
  var idx = 0;\n\
  var len = arr.length;\n\
  var curr = arguments.length == 3\n\
    ? initial\n\
    : arr[idx++];\n\
\n\
  while (idx < len) {\n\
    curr = fn.call(null, curr, arr[idx], ++idx, arr);\n\
  }\n\
  \n\
  return curr;\n\
};//@ sourceURL=component-reduce/index.js"
));
require.register("visionmedia-superagent/lib/client.js", Function("exports, require, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require('emitter');\n\
var reduce = require('reduce');\n\
\n\
/**\n\
 * Root reference for iframes.\n\
 */\n\
\n\
var root = 'undefined' == typeof window\n\
  ? this\n\
  : window;\n\
\n\
/**\n\
 * Noop.\n\
 */\n\
\n\
function noop(){};\n\
\n\
/**\n\
 * Check if `obj` is a host object,\n\
 * we don't want to serialize these :)\n\
 *\n\
 * TODO: future proof, move to compoent land\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Boolean}\n\
 * @api private\n\
 */\n\
\n\
function isHost(obj) {\n\
  var str = {}.toString.call(obj);\n\
\n\
  switch (str) {\n\
    case '[object File]':\n\
    case '[object Blob]':\n\
    case '[object FormData]':\n\
      return true;\n\
    default:\n\
      return false;\n\
  }\n\
}\n\
\n\
/**\n\
 * Determine XHR.\n\
 */\n\
\n\
function getXHR() {\n\
  if (root.XMLHttpRequest\n\
    && ('file:' != root.location.protocol || !root.ActiveXObject)) {\n\
    return new XMLHttpRequest;\n\
  } else {\n\
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}\n\
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}\n\
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}\n\
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}\n\
  }\n\
  return false;\n\
}\n\
\n\
/**\n\
 * Removes leading and trailing whitespace, added to support IE.\n\
 *\n\
 * @param {String} s\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
var trim = ''.trim\n\
  ? function(s) { return s.trim(); }\n\
  : function(s) { return s.replace(/(^\\s*|\\s*$)/g, ''); };\n\
\n\
/**\n\
 * Check if `obj` is an object.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Boolean}\n\
 * @api private\n\
 */\n\
\n\
function isObject(obj) {\n\
  return obj === Object(obj);\n\
}\n\
\n\
/**\n\
 * Serialize the given `obj`.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function serialize(obj) {\n\
  if (!isObject(obj)) return obj;\n\
  var pairs = [];\n\
  for (var key in obj) {\n\
    if (null != obj[key]) {\n\
      pairs.push(encodeURIComponent(key)\n\
        + '=' + encodeURIComponent(obj[key]));\n\
    }\n\
  }\n\
  return pairs.join('&');\n\
}\n\
\n\
/**\n\
 * Expose serialization method.\n\
 */\n\
\n\
 request.serializeObject = serialize;\n\
\n\
 /**\n\
  * Parse the given x-www-form-urlencoded `str`.\n\
  *\n\
  * @param {String} str\n\
  * @return {Object}\n\
  * @api private\n\
  */\n\
\n\
function parseString(str) {\n\
  var obj = {};\n\
  var pairs = str.split('&');\n\
  var parts;\n\
  var pair;\n\
\n\
  for (var i = 0, len = pairs.length; i < len; ++i) {\n\
    pair = pairs[i];\n\
    parts = pair.split('=');\n\
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);\n\
  }\n\
\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Expose parser.\n\
 */\n\
\n\
request.parseString = parseString;\n\
\n\
/**\n\
 * Default MIME type map.\n\
 *\n\
 *     superagent.types.xml = 'application/xml';\n\
 *\n\
 */\n\
\n\
request.types = {\n\
  html: 'text/html',\n\
  json: 'application/json',\n\
  xml: 'application/xml',\n\
  urlencoded: 'application/x-www-form-urlencoded',\n\
  'form': 'application/x-www-form-urlencoded',\n\
  'form-data': 'application/x-www-form-urlencoded'\n\
};\n\
\n\
/**\n\
 * Default serialization map.\n\
 *\n\
 *     superagent.serialize['application/xml'] = function(obj){\n\
 *       return 'generated xml here';\n\
 *     };\n\
 *\n\
 */\n\
\n\
 request.serialize = {\n\
   'application/x-www-form-urlencoded': serialize,\n\
   'application/json': JSON.stringify\n\
 };\n\
\n\
 /**\n\
  * Default parsers.\n\
  *\n\
  *     superagent.parse['application/xml'] = function(str){\n\
  *       return { object parsed from str };\n\
  *     };\n\
  *\n\
  */\n\
\n\
request.parse = {\n\
  'application/x-www-form-urlencoded': parseString,\n\
  'application/json': JSON.parse\n\
};\n\
\n\
/**\n\
 * Parse the given header `str` into\n\
 * an object containing the mapped fields.\n\
 *\n\
 * @param {String} str\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function parseHeader(str) {\n\
  var lines = str.split(/\\r?\\n\
/);\n\
  var fields = {};\n\
  var index;\n\
  var line;\n\
  var field;\n\
  var val;\n\
\n\
  lines.pop(); // trailing CRLF\n\
\n\
  for (var i = 0, len = lines.length; i < len; ++i) {\n\
    line = lines[i];\n\
    index = line.indexOf(':');\n\
    field = line.slice(0, index).toLowerCase();\n\
    val = trim(line.slice(index + 1));\n\
    fields[field] = val;\n\
  }\n\
\n\
  return fields;\n\
}\n\
\n\
/**\n\
 * Return the mime type for the given `str`.\n\
 *\n\
 * @param {String} str\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function type(str){\n\
  return str.split(/ *; */).shift();\n\
};\n\
\n\
/**\n\
 * Return header field parameters.\n\
 *\n\
 * @param {String} str\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function params(str){\n\
  return reduce(str.split(/ *; */), function(obj, str){\n\
    var parts = str.split(/ *= */)\n\
      , key = parts.shift()\n\
      , val = parts.shift();\n\
\n\
    if (key && val) obj[key] = val;\n\
    return obj;\n\
  }, {});\n\
};\n\
\n\
/**\n\
 * Initialize a new `Response` with the given `xhr`.\n\
 *\n\
 *  - set flags (.ok, .error, etc)\n\
 *  - parse header\n\
 *\n\
 * Examples:\n\
 *\n\
 *  Aliasing `superagent` as `request` is nice:\n\
 *\n\
 *      request = superagent;\n\
 *\n\
 *  We can use the promise-like API, or pass callbacks:\n\
 *\n\
 *      request.get('/').end(function(res){});\n\
 *      request.get('/', function(res){});\n\
 *\n\
 *  Sending data can be chained:\n\
 *\n\
 *      request\n\
 *        .post('/user')\n\
 *        .send({ name: 'tj' })\n\
 *        .end(function(res){});\n\
 *\n\
 *  Or passed to `.send()`:\n\
 *\n\
 *      request\n\
 *        .post('/user')\n\
 *        .send({ name: 'tj' }, function(res){});\n\
 *\n\
 *  Or passed to `.post()`:\n\
 *\n\
 *      request\n\
 *        .post('/user', { name: 'tj' })\n\
 *        .end(function(res){});\n\
 *\n\
 * Or further reduced to a single call for simple cases:\n\
 *\n\
 *      request\n\
 *        .post('/user', { name: 'tj' }, function(res){});\n\
 *\n\
 * @param {XMLHTTPRequest} xhr\n\
 * @param {Object} options\n\
 * @api private\n\
 */\n\
\n\
function Response(req, options) {\n\
  options = options || {};\n\
  this.req = req;\n\
  this.xhr = this.req.xhr;\n\
  this.text = this.xhr.responseText;\n\
  this.setStatusProperties(this.xhr.status);\n\
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());\n\
  // getAllResponseHeaders sometimes falsely returns \"\" for CORS requests, but\n\
  // getResponseHeader still works. so we get content-type even if getting\n\
  // other headers fails.\n\
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');\n\
  this.setHeaderProperties(this.header);\n\
  this.body = this.req.method != 'HEAD'\n\
    ? this.parseBody(this.text)\n\
    : null;\n\
}\n\
\n\
/**\n\
 * Get case-insensitive `field` value.\n\
 *\n\
 * @param {String} field\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
Response.prototype.get = function(field){\n\
  return this.header[field.toLowerCase()];\n\
};\n\
\n\
/**\n\
 * Set header related properties:\n\
 *\n\
 *   - `.type` the content type without params\n\
 *\n\
 * A response of \"Content-Type: text/plain; charset=utf-8\"\n\
 * will provide you with a `.type` of \"text/plain\".\n\
 *\n\
 * @param {Object} header\n\
 * @api private\n\
 */\n\
\n\
Response.prototype.setHeaderProperties = function(header){\n\
  // content-type\n\
  var ct = this.header['content-type'] || '';\n\
  this.type = type(ct);\n\
\n\
  // params\n\
  var obj = params(ct);\n\
  for (var key in obj) this[key] = obj[key];\n\
};\n\
\n\
/**\n\
 * Parse the given body `str`.\n\
 *\n\
 * Used for auto-parsing of bodies. Parsers\n\
 * are defined on the `superagent.parse` object.\n\
 *\n\
 * @param {String} str\n\
 * @return {Mixed}\n\
 * @api private\n\
 */\n\
\n\
Response.prototype.parseBody = function(str){\n\
  var parse = request.parse[this.type];\n\
  return parse\n\
    ? parse(str)\n\
    : null;\n\
};\n\
\n\
/**\n\
 * Set flags such as `.ok` based on `status`.\n\
 *\n\
 * For example a 2xx response will give you a `.ok` of __true__\n\
 * whereas 5xx will be __false__ and `.error` will be __true__. The\n\
 * `.clientError` and `.serverError` are also available to be more\n\
 * specific, and `.statusType` is the class of error ranging from 1..5\n\
 * sometimes useful for mapping respond colors etc.\n\
 *\n\
 * \"sugar\" properties are also defined for common cases. Currently providing:\n\
 *\n\
 *   - .noContent\n\
 *   - .badRequest\n\
 *   - .unauthorized\n\
 *   - .notAcceptable\n\
 *   - .notFound\n\
 *\n\
 * @param {Number} status\n\
 * @api private\n\
 */\n\
\n\
Response.prototype.setStatusProperties = function(status){\n\
  var type = status / 100 | 0;\n\
\n\
  // status / class\n\
  this.status = status;\n\
  this.statusType = type;\n\
\n\
  // basics\n\
  this.info = 1 == type;\n\
  this.ok = 2 == type;\n\
  this.clientError = 4 == type;\n\
  this.serverError = 5 == type;\n\
  this.error = (4 == type || 5 == type)\n\
    ? this.toError()\n\
    : false;\n\
\n\
  // sugar\n\
  this.accepted = 202 == status;\n\
  this.noContent = 204 == status || 1223 == status;\n\
  this.badRequest = 400 == status;\n\
  this.unauthorized = 401 == status;\n\
  this.notAcceptable = 406 == status;\n\
  this.notFound = 404 == status;\n\
  this.forbidden = 403 == status;\n\
};\n\
\n\
/**\n\
 * Return an `Error` representative of this response.\n\
 *\n\
 * @return {Error}\n\
 * @api public\n\
 */\n\
\n\
Response.prototype.toError = function(){\n\
  var req = this.req;\n\
  var method = req.method;\n\
  var path = req.path;\n\
\n\
  var msg = 'cannot ' + method + ' ' + path + ' (' + this.status + ')';\n\
  var err = new Error(msg);\n\
  err.status = this.status;\n\
  err.method = method;\n\
  err.path = path;\n\
\n\
  return err;\n\
};\n\
\n\
/**\n\
 * Expose `Response`.\n\
 */\n\
\n\
request.Response = Response;\n\
\n\
/**\n\
 * Initialize a new `Request` with the given `method` and `url`.\n\
 *\n\
 * @param {String} method\n\
 * @param {String} url\n\
 * @api public\n\
 */\n\
\n\
function Request(method, url) {\n\
  var self = this;\n\
  Emitter.call(this);\n\
  this._query = this._query || [];\n\
  this.method = method;\n\
  this.url = url;\n\
  this.header = {};\n\
  this._header = {};\n\
  this.on('end', function(){\n\
    var res = new Response(self);\n\
    if ('HEAD' == method) res.text = null;\n\
    self.callback(null, res);\n\
  });\n\
}\n\
\n\
/**\n\
 * Mixin `Emitter`.\n\
 */\n\
\n\
Emitter(Request.prototype);\n\
\n\
/**\n\
 * Set timeout to `ms`.\n\
 *\n\
 * @param {Number} ms\n\
 * @return {Request} for chaining\n\
 * @api public\n\
 */\n\
\n\
Request.prototype.timeout = function(ms){\n\
  this._timeout = ms;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Clear previous timeout.\n\
 *\n\
 * @return {Request} for chaining\n\
 * @api public\n\
 */\n\
\n\
Request.prototype.clearTimeout = function(){\n\
  this._timeout = 0;\n\
  clearTimeout(this._timer);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Abort the request, and clear potential timeout.\n\
 *\n\
 * @return {Request}\n\
 * @api public\n\
 */\n\
\n\
Request.prototype.abort = function(){\n\
  if (this.aborted) return;\n\
  this.aborted = true;\n\
  this.xhr.abort();\n\
  this.clearTimeout();\n\
  this.emit('abort');\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Set header `field` to `val`, or multiple fields with one object.\n\
 *\n\
 * Examples:\n\
 *\n\
 *      req.get('/')\n\
 *        .set('Accept', 'application/json')\n\
 *        .set('X-API-Key', 'foobar')\n\
 *        .end(callback);\n\
 *\n\
 *      req.get('/')\n\
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })\n\
 *        .end(callback);\n\
 *\n\
 * @param {String|Object} field\n\
 * @param {String} val\n\
 * @return {Request} for chaining\n\
 * @api public\n\
 */\n\
\n\
Request.prototype.set = function(field, val){\n\
  if (isObject(field)) {\n\
    for (var key in field) {\n\
      this.set(key, field[key]);\n\
    }\n\
    return this;\n\
  }\n\
  this._header[field.toLowerCase()] = val;\n\
  this.header[field] = val;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Get case-insensitive header `field` value.\n\
 *\n\
 * @param {String} field\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
Request.prototype.getHeader = function(field){\n\
  return this._header[field.toLowerCase()];\n\
};\n\
\n\
/**\n\
 * Set Content-Type to `type`, mapping values from `request.types`.\n\
 *\n\
 * Examples:\n\
 *\n\
 *      superagent.types.xml = 'application/xml';\n\
 *\n\
 *      request.post('/')\n\
 *        .type('xml')\n\
 *        .send(xmlstring)\n\
 *        .end(callback);\n\
 *\n\
 *      request.post('/')\n\
 *        .type('application/xml')\n\
 *        .send(xmlstring)\n\
 *        .end(callback);\n\
 *\n\
 * @param {String} type\n\
 * @return {Request} for chaining\n\
 * @api public\n\
 */\n\
\n\
Request.prototype.type = function(type){\n\
  this.set('Content-Type', request.types[type] || type);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Set Accept to `type`, mapping values from `request.types`.\n\
 *\n\
 * Examples:\n\
 *\n\
 *      superagent.types.json = 'application/json';\n\
 *\n\
 *      request.get('/agent')\n\
 *        .accept('json')\n\
 *        .end(callback);\n\
 *\n\
 *      request.get('/agent')\n\
 *        .accept('application/json')\n\
 *        .end(callback);\n\
 *\n\
 * @param {String} accept\n\
 * @return {Request} for chaining\n\
 * @api public\n\
 */\n\
\n\
Request.prototype.accept = function(type){\n\
  this.set('Accept', request.types[type] || type);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Set Authorization field value with `user` and `pass`.\n\
 *\n\
 * @param {String} user\n\
 * @param {String} pass\n\
 * @return {Request} for chaining\n\
 * @api public\n\
 */\n\
\n\
Request.prototype.auth = function(user, pass){\n\
  var str = btoa(user + ':' + pass);\n\
  this.set('Authorization', 'Basic ' + str);\n\
  return this;\n\
};\n\
\n\
/**\n\
* Add query-string `val`.\n\
*\n\
* Examples:\n\
*\n\
*   request.get('/shoes')\n\
*     .query('size=10')\n\
*     .query({ color: 'blue' })\n\
*\n\
* @param {Object|String} val\n\
* @return {Request} for chaining\n\
* @api public\n\
*/\n\
\n\
Request.prototype.query = function(val){\n\
  if ('string' != typeof val) val = serialize(val);\n\
  if (val) this._query.push(val);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Send `data`, defaulting the `.type()` to \"json\" when\n\
 * an object is given.\n\
 *\n\
 * Examples:\n\
 *\n\
 *       // querystring\n\
 *       request.get('/search')\n\
 *         .end(callback)\n\
 *\n\
 *       // multiple data \"writes\"\n\
 *       request.get('/search')\n\
 *         .send({ search: 'query' })\n\
 *         .send({ range: '1..5' })\n\
 *         .send({ order: 'desc' })\n\
 *         .end(callback)\n\
 *\n\
 *       // manual json\n\
 *       request.post('/user')\n\
 *         .type('json')\n\
 *         .send('{\"name\":\"tj\"})\n\
 *         .end(callback)\n\
 *\n\
 *       // auto json\n\
 *       request.post('/user')\n\
 *         .send({ name: 'tj' })\n\
 *         .end(callback)\n\
 *\n\
 *       // manual x-www-form-urlencoded\n\
 *       request.post('/user')\n\
 *         .type('form')\n\
 *         .send('name=tj')\n\
 *         .end(callback)\n\
 *\n\
 *       // auto x-www-form-urlencoded\n\
 *       request.post('/user')\n\
 *         .type('form')\n\
 *         .send({ name: 'tj' })\n\
 *         .end(callback)\n\
 *\n\
 *       // defaults to x-www-form-urlencoded\n\
  *      request.post('/user')\n\
  *        .send('name=tobi')\n\
  *        .send('species=ferret')\n\
  *        .end(callback)\n\
 *\n\
 * @param {String|Object} data\n\
 * @return {Request} for chaining\n\
 * @api public\n\
 */\n\
\n\
Request.prototype.send = function(data){\n\
  var obj = isObject(data);\n\
  var type = this.getHeader('Content-Type');\n\
\n\
  // merge\n\
  if (obj && isObject(this._data)) {\n\
    for (var key in data) {\n\
      this._data[key] = data[key];\n\
    }\n\
  } else if ('string' == typeof data) {\n\
    if (!type) this.type('form');\n\
    type = this.getHeader('Content-Type');\n\
    if ('application/x-www-form-urlencoded' == type) {\n\
      this._data = this._data\n\
        ? this._data + '&' + data\n\
        : data;\n\
    } else {\n\
      this._data = (this._data || '') + data;\n\
    }\n\
  } else {\n\
    this._data = data;\n\
  }\n\
\n\
  if (!obj) return this;\n\
  if (!type) this.type('json');\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Invoke the callback with `err` and `res`\n\
 * and handle arity check.\n\
 *\n\
 * @param {Error} err\n\
 * @param {Response} res\n\
 * @api private\n\
 */\n\
\n\
Request.prototype.callback = function(err, res){\n\
  var fn = this._callback;\n\
  if (2 == fn.length) return fn(err, res);\n\
  if (err) return this.emit('error', err);\n\
  fn(res);\n\
};\n\
\n\
/**\n\
 * Invoke callback with x-domain error.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
Request.prototype.crossDomainError = function(){\n\
  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');\n\
  err.crossDomain = true;\n\
  this.callback(err);\n\
};\n\
\n\
/**\n\
 * Invoke callback with timeout error.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
Request.prototype.timeoutError = function(){\n\
  var timeout = this._timeout;\n\
  var err = new Error('timeout of ' + timeout + 'ms exceeded');\n\
  err.timeout = timeout;\n\
  this.callback(err);\n\
};\n\
\n\
/**\n\
 * Enable transmission of cookies with x-domain requests.\n\
 *\n\
 * Note that for this to work the origin must not be\n\
 * using \"Access-Control-Allow-Origin\" with a wildcard,\n\
 * and also must set \"Access-Control-Allow-Credentials\"\n\
 * to \"true\".\n\
 *\n\
 * @api public\n\
 */\n\
\n\
Request.prototype.withCredentials = function(){\n\
  this._withCredentials = true;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Initiate request, invoking callback `fn(res)`\n\
 * with an instanceof `Response`.\n\
 *\n\
 * @param {Function} fn\n\
 * @return {Request} for chaining\n\
 * @api public\n\
 */\n\
\n\
Request.prototype.end = function(fn){\n\
  var self = this;\n\
  var xhr = this.xhr = getXHR();\n\
  var query = this._query.join('&');\n\
  var timeout = this._timeout;\n\
  var data = this._data;\n\
\n\
  // store callback\n\
  this._callback = fn || noop;\n\
\n\
  // state change\n\
  xhr.onreadystatechange = function(){\n\
    if (4 != xhr.readyState) return;\n\
    if (0 == xhr.status) {\n\
      if (self.aborted) return self.timeoutError();\n\
      return self.crossDomainError();\n\
    }\n\
    self.emit('end');\n\
  };\n\
\n\
  // progress\n\
  if (xhr.upload) {\n\
    xhr.upload.onprogress = function(e){\n\
      e.percent = e.loaded / e.total * 100;\n\
      self.emit('progress', e);\n\
    };\n\
  }\n\
\n\
  // timeout\n\
  if (timeout && !this._timer) {\n\
    this._timer = setTimeout(function(){\n\
      self.abort();\n\
    }, timeout);\n\
  }\n\
\n\
  // querystring\n\
  if (query) {\n\
    query = request.serializeObject(query);\n\
    this.url += ~this.url.indexOf('?')\n\
      ? '&' + query\n\
      : '?' + query;\n\
  }\n\
\n\
  // initiate request\n\
  xhr.open(this.method, this.url, true);\n\
\n\
  // CORS\n\
  if (this._withCredentials) xhr.withCredentials = true;\n\
\n\
  // body\n\
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {\n\
    // serialize stuff\n\
    var serialize = request.serialize[this.getHeader('Content-Type')];\n\
    if (serialize) data = serialize(data);\n\
  }\n\
\n\
  // set header fields\n\
  for (var field in this.header) {\n\
    if (null == this.header[field]) continue;\n\
    xhr.setRequestHeader(field, this.header[field]);\n\
  }\n\
\n\
  // send stuff\n\
  xhr.send(data);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Expose `Request`.\n\
 */\n\
\n\
request.Request = Request;\n\
\n\
/**\n\
 * Issue a request:\n\
 *\n\
 * Examples:\n\
 *\n\
 *    request('GET', '/users').end(callback)\n\
 *    request('/users').end(callback)\n\
 *    request('/users', callback)\n\
 *\n\
 * @param {String} method\n\
 * @param {String|Function} url or callback\n\
 * @return {Request}\n\
 * @api public\n\
 */\n\
\n\
function request(method, url) {\n\
  // callback\n\
  if ('function' == typeof url) {\n\
    return new Request('GET', method).end(url);\n\
  }\n\
\n\
  // url first\n\
  if (1 == arguments.length) {\n\
    return new Request('GET', method);\n\
  }\n\
\n\
  return new Request(method, url);\n\
}\n\
\n\
/**\n\
 * GET `url` with optional callback `fn(res)`.\n\
 *\n\
 * @param {String} url\n\
 * @param {Mixed|Function} data or fn\n\
 * @param {Function} fn\n\
 * @return {Request}\n\
 * @api public\n\
 */\n\
\n\
request.get = function(url, data, fn){\n\
  var req = request('GET', url);\n\
  if ('function' == typeof data) fn = data, data = null;\n\
  if (data) req.query(data);\n\
  if (fn) req.end(fn);\n\
  return req;\n\
};\n\
\n\
/**\n\
 * HEAD `url` with optional callback `fn(res)`.\n\
 *\n\
 * @param {String} url\n\
 * @param {Mixed|Function} data or fn\n\
 * @param {Function} fn\n\
 * @return {Request}\n\
 * @api public\n\
 */\n\
\n\
request.head = function(url, data, fn){\n\
  var req = request('HEAD', url);\n\
  if ('function' == typeof data) fn = data, data = null;\n\
  if (data) req.send(data);\n\
  if (fn) req.end(fn);\n\
  return req;\n\
};\n\
\n\
/**\n\
 * DELETE `url` with optional callback `fn(res)`.\n\
 *\n\
 * @param {String} url\n\
 * @param {Function} fn\n\
 * @return {Request}\n\
 * @api public\n\
 */\n\
\n\
request.del = function(url, fn){\n\
  var req = request('DELETE', url);\n\
  if (fn) req.end(fn);\n\
  return req;\n\
};\n\
\n\
/**\n\
 * PATCH `url` with optional `data` and callback `fn(res)`.\n\
 *\n\
 * @param {String} url\n\
 * @param {Mixed} data\n\
 * @param {Function} fn\n\
 * @return {Request}\n\
 * @api public\n\
 */\n\
\n\
request.patch = function(url, data, fn){\n\
  var req = request('PATCH', url);\n\
  if ('function' == typeof data) fn = data, data = null;\n\
  if (data) req.send(data);\n\
  if (fn) req.end(fn);\n\
  return req;\n\
};\n\
\n\
/**\n\
 * POST `url` with optional `data` and callback `fn(res)`.\n\
 *\n\
 * @param {String} url\n\
 * @param {Mixed} data\n\
 * @param {Function} fn\n\
 * @return {Request}\n\
 * @api public\n\
 */\n\
\n\
request.post = function(url, data, fn){\n\
  var req = request('POST', url);\n\
  if ('function' == typeof data) fn = data, data = null;\n\
  if (data) req.send(data);\n\
  if (fn) req.end(fn);\n\
  return req;\n\
};\n\
\n\
/**\n\
 * PUT `url` with optional `data` and callback `fn(res)`.\n\
 *\n\
 * @param {String} url\n\
 * @param {Mixed|Function} data or fn\n\
 * @param {Function} fn\n\
 * @return {Request}\n\
 * @api public\n\
 */\n\
\n\
request.put = function(url, data, fn){\n\
  var req = request('PUT', url);\n\
  if ('function' == typeof data) fn = data, data = null;\n\
  if (data) req.send(data);\n\
  if (fn) req.end(fn);\n\
  return req;\n\
};\n\
\n\
/**\n\
 * Expose `request`.\n\
 */\n\
\n\
module.exports = request;\n\
//@ sourceURL=visionmedia-superagent/lib/client.js"
));
require.register("wout-svg.js/dist/svg.js", Function("exports, require, module",
"/* svg.js v1.0rc2-15-g3754d89 - svg regex default color array pointarray patharray number viewbox bbox rbox element parent container fx relative event defs group arrange mask clip gradient doc shape use rect ellipse line poly path image text textpath nested hyperlink sugar set data memory loader - svgjs.com/license */\n\
;(function() {\n\
\n\
  this.SVG = function(element) {\n\
    if (!SVG.parser)\n\
      SVG.prepare()\n\
  \n\
    if (SVG.supported)\n\
      return new SVG.Doc(element)\n\
  }\n\
  \n\
  // Default namespaces\n\
  SVG.ns    = 'http://www.w3.org/2000/svg'\n\
  SVG.xmlns = 'http://www.w3.org/2000/xmlns/'\n\
  SVG.xlink = 'http://www.w3.org/1999/xlink'\n\
  \n\
  // Element id sequence\n\
  SVG.did  = 1000\n\
  \n\
  // Get next named element id\n\
  SVG.eid = function(name) {\n\
    return 'Svgjs' + name.charAt(0).toUpperCase() + name.slice(1) + (SVG.did++)\n\
  }\n\
  \n\
  // Method for element creation\n\
  SVG.create = function(name) {\n\
    /* create element */\n\
    var element = document.createElementNS(this.ns, name)\n\
    \n\
    /* apply unique id */\n\
    element.setAttribute('id', this.eid(name))\n\
    \n\
    return element\n\
  }\n\
  \n\
  // Method for extending objects\n\
  SVG.extend = function() {\n\
    var modules, methods, key, i\n\
    \n\
    /* get list of modules */\n\
    modules = [].slice.call(arguments)\n\
    \n\
    /* get object with extensions */\n\
    methods = modules.pop()\n\
    \n\
    for (i = modules.length - 1; i >= 0; i--)\n\
      if (modules[i])\n\
        for (key in methods)\n\
          modules[i].prototype[key] = methods[key]\n\
  \n\
    /* make sure SVG.Set inherits any newly added methods */\n\
    if (SVG.Set && SVG.Set.inherit)\n\
      SVG.Set.inherit()\n\
  }\n\
  \n\
  // Method for getting an element by id\n\
  SVG.get = function(id) {\n\
    var node = document.getElementById(id)\n\
    if (node) return node.instance\n\
  }\n\
  \n\
  // Initialize parsing element\n\
  SVG.prepare = function() {\n\
    /* select document body and create svg element*/\n\
    var body = document.getElementsByTagName('body')[0] || document.getElementsByTagName('svg')[0]\n\
      , draw = new SVG.Doc(body).size(2, 2).style('opacity:0;position:fixed;left:100%;top:100%;')\n\
  \n\
    /* create parser object */\n\
    SVG.parser = {\n\
      body: body\n\
    , draw: draw\n\
    , poly: draw.polygon().node\n\
    , path: draw.path().node\n\
    }\n\
  }\n\
  \n\
  // svg support test\n\
  SVG.supported = (function() {\n\
    return !! document.createElementNS &&\n\
           !! document.createElementNS(SVG.ns,'svg').createSVGRect\n\
  })()\n\
  \n\
  if (!SVG.supported) return false\n\
\n\
  SVG.regex = {\n\
    /* test a given value */\n\
    test: function(value, test) {\n\
      return this[test].test(value)\n\
    }\n\
    \n\
    /* parse unit value */\n\
  , unit:         /^(-?[\\d\\.]+)([a-z%]{0,2})$/\n\
    \n\
    /* parse hex value */\n\
  , hex:          /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i\n\
    \n\
    /* parse rgb value */\n\
  , rgb:          /rgb\\((\\d+),(\\d+),(\\d+)\\)/\n\
  \n\
    /* test hex value */\n\
  , isHex:        /^#[a-f0-9]{3,6}$/i\n\
    \n\
    /* test rgb value */\n\
  , isRgb:        /^rgb\\(/\n\
    \n\
    /* test css declaration */\n\
  , isCss:        /[^:]+:[^;]+;?/\n\
    \n\
    /* test css property */\n\
  , isStyle:      /^font|text|leading|cursor/\n\
    \n\
    /* test for blank string */\n\
  , isBlank:      /^(\\s+)?$/\n\
    \n\
    /* test for numeric string */\n\
  , isNumber:     /^-?[\\d\\.]+$/\n\
  \n\
    /* test for percent value */\n\
  , isPercent:    /^-?[\\d\\.]+%$/\n\
    \n\
  }\n\
\n\
  SVG.defaults = {\n\
    // Default matrix\n\
    matrix:       '1 0 0 1 0 0'\n\
    \n\
    // Default attribute values\n\
  , attrs: {\n\
      /* fill and stroke */\n\
      'fill-opacity':     1\n\
    , 'stroke-opacity':   1\n\
    , 'stroke-width':     0\n\
    , 'stroke-linejoin':  'miter'\n\
    , 'stroke-linecap':   'butt'\n\
    , fill:               '#000000'\n\
    , stroke:             '#000000'\n\
    , opacity:            1\n\
      /* position */\n\
    , x:                  0\n\
    , y:                  0\n\
    , cx:                 0\n\
    , cy:                 0\n\
      /* size */  \n\
    , width:              0\n\
    , height:             0\n\
      /* radius */  \n\
    , r:                  0\n\
    , rx:                 0\n\
    , ry:                 0\n\
      /* gradient */  \n\
    , offset:             0\n\
    , 'stop-opacity':     1\n\
    , 'stop-color':       '#000000'\n\
    }\n\
    \n\
    // Default transformation values\n\
  , trans: function() {\n\
      return {\n\
        /* translate */\n\
        x:        0\n\
      , y:        0\n\
        /* scale */\n\
      , scaleX:   1\n\
      , scaleY:   1\n\
        /* rotate */\n\
      , rotation: 0\n\
        /* skew */\n\
      , skewX:    0\n\
      , skewY:    0\n\
        /* matrix */\n\
      , matrix:   this.matrix\n\
      , a:        1\n\
      , b:        0\n\
      , c:        0\n\
      , d:        1\n\
      , e:        0\n\
      , f:        0\n\
      }\n\
    }\n\
    \n\
  }\n\
\n\
  SVG.Color = function(color) {\n\
    var match\n\
    \n\
    /* initialize defaults */\n\
    this.r = 0\n\
    this.g = 0\n\
    this.b = 0\n\
    \n\
    /* parse color */\n\
    if (typeof color == 'string') {\n\
      if (SVG.regex.isRgb.test(color)) {\n\
        /* get rgb values */\n\
        match = SVG.regex.rgb.exec(color.replace(/\\s/g,''))\n\
        \n\
        /* parse numeric values */\n\
        this.r = parseInt(match[1])\n\
        this.g = parseInt(match[2])\n\
        this.b = parseInt(match[3])\n\
        \n\
      } else if (SVG.regex.isHex.test(color)) {\n\
        /* get hex values */\n\
        match = SVG.regex.hex.exec(this._fullHex(color))\n\
  \n\
        /* parse numeric values */\n\
        this.r = parseInt(match[1], 16)\n\
        this.g = parseInt(match[2], 16)\n\
        this.b = parseInt(match[3], 16)\n\
  \n\
      }\n\
      \n\
    } else if (typeof color == 'object') {\n\
      this.r = color.r\n\
      this.g = color.g\n\
      this.b = color.b\n\
      \n\
    }\n\
      \n\
  }\n\
  \n\
  SVG.extend(SVG.Color, {\n\
    // Default to hex conversion\n\
    toString: function() {\n\
      return this.toHex()\n\
    }\n\
    // Build hex value\n\
  , toHex: function() {\n\
      return '#'\n\
        + this._compToHex(this.r)\n\
        + this._compToHex(this.g)\n\
        + this._compToHex(this.b)\n\
    }\n\
    // Build rgb value\n\
  , toRgb: function() {\n\
      return 'rgb(' + [this.r, this.g, this.b].join() + ')'\n\
    }\n\
    // Calculate true brightness\n\
  , brightness: function() {\n\
      return (this.r / 255 * 0.30)\n\
           + (this.g / 255 * 0.59)\n\
           + (this.b / 255 * 0.11)\n\
    }\n\
    // Make color morphable\n\
  , morph: function(color) {\n\
      this.destination = new SVG.Color(color)\n\
  \n\
      return this\n\
    }\n\
    // Get morphed color at given position\n\
  , at: function(pos) {\n\
      /* make sure a destination is defined */\n\
      if (!this.destination) return this\n\
  \n\
      /* normalise pos */\n\
      pos = pos < 0 ? 0 : pos > 1 ? 1 : pos\n\
  \n\
      /* generate morphed color */\n\
      return new SVG.Color({\n\
        r: ~~(this.r + (this.destination.r - this.r) * pos)\n\
      , g: ~~(this.g + (this.destination.g - this.g) * pos)\n\
      , b: ~~(this.b + (this.destination.b - this.b) * pos)\n\
      })\n\
    }\n\
    // Private: ensure to six-based hex \n\
  , _fullHex: function(hex) {\n\
      return hex.length == 4 ?\n\
        [ '#',\n\
          hex.substring(1, 2), hex.substring(1, 2)\n\
        , hex.substring(2, 3), hex.substring(2, 3)\n\
        , hex.substring(3, 4), hex.substring(3, 4)\n\
        ].join('') : hex\n\
    }\n\
    // Private: component to hex value\n\
  , _compToHex: function(comp) {\n\
      var hex = comp.toString(16)\n\
      return hex.length == 1 ? '0' + hex : hex\n\
    }\n\
    \n\
  })\n\
  \n\
  // Test if given value is a color string\n\
  SVG.Color.test = function(color) {\n\
    color += ''\n\
    return SVG.regex.isHex.test(color)\n\
        || SVG.regex.isRgb.test(color)\n\
  }\n\
  \n\
  // Test if given value is a rgb object\n\
  SVG.Color.isRgb = function(color) {\n\
    return color && typeof color.r == 'number'\n\
                 && typeof color.g == 'number'\n\
                 && typeof color.b == 'number'\n\
  }\n\
  \n\
  // Test if given value is a color\n\
  SVG.Color.isColor = function(color) {\n\
    return SVG.Color.isRgb(color) || SVG.Color.test(color)\n\
  }\n\
\n\
  SVG.Array = function(array, fallback) {\n\
    array = (array || []).valueOf()\n\
  \n\
    /* if array is empty and fallback is provided, use fallback */\n\
    if (array.length == 0 && fallback)\n\
      array = fallback.valueOf()\n\
  \n\
    /* parse array */\n\
    this.value = this.parse(array)\n\
  }\n\
  \n\
  SVG.extend(SVG.Array, {\n\
    // Make array morphable\n\
    morph: function(array) {\n\
      this.destination = this.parse(array)\n\
  \n\
      /* normalize length of arrays */\n\
      if (this.value.length != this.destination.length) {\n\
        var lastValue       = this.value[this.value.length - 1]\n\
          , lastDestination = this.destination[this.destination.length - 1]\n\
  \n\
        while(this.value.length > this.destination.length)\n\
          this.destination.push(lastDestination)\n\
        while(this.value.length < this.destination.length)\n\
          this.value.push(lastValue)\n\
      }\n\
  \n\
      return this\n\
    }\n\
    // Clean up any duplicate points\n\
  , settle: function() {\n\
      /* find all unique values */\n\
      for (var i = 0, il = this.value.length, seen = []; i < il; i++)\n\
        if (seen.indexOf(this.value[i]) == -1)\n\
          seen.push(this.value[i])\n\
  \n\
      /* set new value */\n\
      return this.value = seen\n\
    }\n\
    // Get morphed array at given position\n\
  , at: function(pos) {\n\
      /* make sure a destination is defined */\n\
      if (!this.destination) return this\n\
  \n\
      /* generate morphed array */\n\
      for (var i = 0, il = this.value.length, array = []; i < il; i++)\n\
        array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos)\n\
  \n\
      return new SVG.Array(array)\n\
    }\n\
    // Convert array to string\n\
  , toString: function() {\n\
      return this.value.join(' ')\n\
    }\n\
    // Real value\n\
  , valueOf: function() {\n\
      return this.value\n\
    }\n\
    // Parse whitespace separated string\n\
  , parse: function(array) {\n\
      array = array.valueOf()\n\
  \n\
      /* if already is an array, no need to parse it */\n\
      if (Array.isArray(array)) return array\n\
  \n\
      return this.split(array)\n\
    }\n\
    // Strip unnecessary whitespace\n\
  , split: function(string) {\n\
      return string.replace(/\\s+/g, ' ').replace(/^\\s+|\\s+$/g,'').split(' ') \n\
    }\n\
  \n\
  })\n\
  \n\
\n\
\n\
  SVG.PointArray = function() {\n\
    this.constructor.apply(this, arguments)\n\
  }\n\
  \n\
  // Inherit from SVG.Array\n\
  SVG.PointArray.prototype = new SVG.Array\n\
  \n\
  SVG.extend(SVG.PointArray, {\n\
    // Convert array to string\n\
    toString: function() {\n\
      /* convert to a poly point string */\n\
      for (var i = 0, il = this.value.length, array = []; i < il; i++)\n\
        array.push(this.value[i].join(','))\n\
  \n\
      return array.join(' ')\n\
    }\n\
    // Get morphed array at given position\n\
  , at: function(pos) {\n\
      /* make sure a destination is defined */\n\
      if (!this.destination) return this\n\
  \n\
      /* generate morphed point string */\n\
      for (var i = 0, il = this.value.length, array = []; i < il; i++)\n\
        array.push([\n\
          this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos\n\
        , this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos\n\
        ])\n\
  \n\
      return new SVG.PointArray(array)\n\
    }\n\
    // Parse point string\n\
  , parse: function(array) {\n\
      array = array.valueOf()\n\
  \n\
      /* if already is an array, no need to parse it */\n\
      if (Array.isArray(array)) return array\n\
  \n\
      /* split points */\n\
      array = this.split(array)\n\
  \n\
      /* parse points */\n\
      for (var i = 0, il = array.length, p, points = []; i < il; i++) {\n\
        p = array[i].split(',')\n\
        points.push([parseFloat(p[0]), parseFloat(p[1])])\n\
      }\n\
  \n\
      return points\n\
    }\n\
    // Move point string\n\
  , move: function(x, y) {\n\
      var box = this.bbox()\n\
  \n\
      /* get relative offset */\n\
      x -= box.x\n\
      y -= box.y\n\
  \n\
      /* move every point */\n\
      if (!isNaN(x) && !isNaN(y))\n\
        for (var i = this.value.length - 1; i >= 0; i--)\n\
          this.value[i] = [this.value[i][0] + x, this.value[i][1] + y]\n\
  \n\
      return this\n\
    }\n\
    // Resize poly string\n\
  , size: function(width, height) {\n\
      var i, box = this.bbox()\n\
  \n\
      /* recalculate position of all points according to new size */\n\
      for (i = this.value.length - 1; i >= 0; i--) {\n\
        this.value[i][0] = ((this.value[i][0] - box.x) * width)  / box.width  + box.x\n\
        this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.x\n\
      }\n\
  \n\
      return this\n\
    }\n\
    // Get bounding box of points\n\
  , bbox: function() {\n\
      if (this._cachedBBox) return this._cachedBBox\n\
  \n\
      SVG.parser.poly.setAttribute('points', this.toString())\n\
  \n\
      return SVG.parser.poly.getBBox()\n\
    }\n\
  \n\
  })\n\
\n\
  SVG.PathArray = function(array, fallback) {\n\
    this.constructor.call(this, array, fallback)\n\
  }\n\
  \n\
  // Inherit from SVG.Array\n\
  SVG.PathArray.prototype = new SVG.Array\n\
  \n\
  SVG.extend(SVG.PathArray, {\n\
    // Convert array to string\n\
    toString: function() {\n\
      for (var s, i = 0, il = this.value.length, array = []; i < il; i++) {\n\
        s = [this.value[i].type]\n\
        \n\
        switch(this.value[i].type) {\n\
          case 'H':\n\
            s.push(this.value[i].x)\n\
          break\n\
          case 'V':\n\
            s.push(this.value[i].y)\n\
          break\n\
          case 'M':\n\
          case 'L':\n\
          case 'T':\n\
          case 'S':\n\
          case 'Q':\n\
          case 'C':\n\
            if (/[QC]/.test(this.value[i].type))\n\
              s.push(this.value[i].x1, this.value[i].y1)\n\
            if (/[CS]/.test(this.value[i].type))\n\
              s.push(this.value[i].x2, this.value[i].y2)\n\
  \n\
            s.push(this.value[i].x, this.value[i].y)\n\
  \n\
          break\n\
          case 'A':\n\
            s.push(\n\
              this.value[i].rx\n\
            , this.value[i].ry\n\
            , this.value[i].angle\n\
            , this.value[i].largeArcFlag\n\
            , this.value[i].sweepFlag\n\
            , this.value[i].x\n\
            , this.value[i].y\n\
            )\n\
          break\n\
        }\n\
  \n\
        /* add to array */\n\
        array.push(s.join(' '))\n\
      }\n\
      \n\
      return array.join(' ')\n\
    }\n\
    // Move path string\n\
  , move: function(x, y) {\n\
  \t\t/* get bounding box of current situation */\n\
  \t\tvar box = this.bbox()\n\
  \t\t\n\
      /* get relative offset */\n\
      x -= box.x\n\
      y -= box.y\n\
  \n\
      if (!isNaN(x) && !isNaN(y)) {\n\
        /* move every point */\n\
        for (var i = this.value.length - 1; i >= 0; i--) {\n\
          switch (this.value[i].type) {\n\
            case 'H':\n\
              /* move along x axis only */\n\
              this.value[i].x += x\n\
            break\n\
            case 'V':\n\
              /* move along y axis only */\n\
              this.value[i].y += y\n\
            break\n\
            case 'M':\n\
            case 'L':\n\
            case 'T':\n\
            case 'S':\n\
            case 'Q':\n\
            case 'C':\n\
              /* move first point along x and y axes */\n\
              this.value[i].x += x\n\
              this.value[i].y += y\n\
  \n\
              /* move third points along x and y axes */\n\
              if (/[CQ]/.test(this.value[i].type)) {\n\
                this.value[i].x1 += x\n\
                this.value[i].y1 += y\n\
              }\n\
  \n\
              /* move second points along x and y axes */\n\
              if (/[CS]/.test(this.value[i].type)) {\n\
                this.value[i].x2 += x\n\
                this.value[i].y2 += y\n\
              }\n\
  \n\
            break\n\
            case 'A':\n\
              /* only move position values */\n\
              this.value[i].x += x\n\
              this.value[i].y += y\n\
            break\n\
          }\n\
        }\n\
      }\n\
  \n\
      return this\n\
    }\n\
    // Resize path string\n\
  , size: function(width, height) {\n\
  \t\t/* get bounding box of current situation */\n\
  \t\tvar box = this.bbox()\n\
  \n\
      /* recalculate position of all points according to new size */\n\
      for (var i = this.value.length - 1; i >= 0; i--) {\n\
        switch (this.value[i].type) {\n\
          case 'H':\n\
            /* move along x axis only */\n\
            this.value[i].x = ((this.value[i].x - box.x) * width)  / box.width  + box.x\n\
          break\n\
          case 'V':\n\
            /* move along y axis only */\n\
            this.value[i].y = ((this.value[i].y - box.y) * height) / box.height + box.y\n\
          break\n\
          case 'M':\n\
          case 'L':\n\
          case 'T':\n\
          case 'S':\n\
          case 'Q':\n\
          case 'C':\n\
            this.value[i].x = ((this.value[i].x - box.x) * width)  / box.width  + box.x\n\
            this.value[i].y = ((this.value[i].y - box.y) * height) / box.height + box.y\n\
  \n\
            /* move third points along x and y axes */\n\
            if (/[CQ]/.test(this.value[i].type)) {\n\
              this.value[i].x1 = ((this.value[i].x1 - box.x) * width)  / box.width  + box.x\n\
              this.value[i].y1 = ((this.value[i].y1 - box.y) * height) / box.height + box.y\n\
            }\n\
  \n\
            /* move second points along x and y axes */\n\
            if (/[CS]/.test(this.value[i].type)) {\n\
              this.value[i].x2 = ((this.value[i].x2 - box.x) * width)  / box.width  + box.x\n\
              this.value[i].y2 = ((this.value[i].y2 - box.y) * height) / box.height + box.y\n\
            }\n\
  \n\
          break\n\
          case 'A':\n\
            /* resize radii */\n\
            this.value[i].values.rx = (this.value[i].values.rx * width)  / box.width\n\
            this.value[i].values.ry = (this.value[i].values.ry * height) / box.height\n\
  \n\
            /* move position values */\n\
            this.value[i].values.x = ((this.value[i].values.x - box.x) * width)  / box.width  + box.x\n\
            this.value[i].values.y = ((this.value[i].values.y - box.y) * height) / box.height + box.y\n\
          break\n\
        }\n\
      }\n\
  \n\
      return this\n\
    }\n\
    // Absolutize and parse path to array\n\
  , parse: function(array) {\n\
      array = array.valueOf()\n\
  \n\
      /* if already is an array, no need to parse it */\n\
      if (Array.isArray(array)) return array\n\
  \n\
      /* prepare for parsing */\n\
      var i, il, x0, y0, x1, y1, x2, y2, s, seg, segs\n\
        , x = 0\n\
        , y = 0\n\
      \n\
      /* populate working path */\n\
      SVG.parser.path.setAttribute('d', array)\n\
      \n\
      /* get segments */\n\
      segs = SVG.parser.path.pathSegList\n\
  \n\
      for (i = 0, il = segs.numberOfItems; i < il; ++i) {\n\
        seg = segs.getItem(i)\n\
        s = seg.pathSegTypeAsLetter\n\
  \n\
        if (/[MLHVCSQTA]/.test(s)) {\n\
          if ('x' in seg) x = seg.x\n\
          if ('y' in seg) y = seg.y\n\
  \n\
        } else {\n\
          if ('x1' in seg) x1 = x + seg.x1\n\
          if ('x2' in seg) x2 = x + seg.x2\n\
          if ('y1' in seg) y1 = y + seg.y1\n\
          if ('y2' in seg) y2 = y + seg.y2\n\
          if ('x'  in seg) x += seg.x\n\
          if ('y'  in seg) y += seg.y\n\
  \n\
          switch(s){\n\
            case 'm': \n\
              segs.replaceItem(SVG.parser.path.createSVGPathSegMovetoAbs(x, y), i)\n\
            break\n\
            case 'l': \n\
              segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoAbs(x, y), i)\n\
            break\n\
            case 'h': \n\
              segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoHorizontalAbs(x), i)\n\
            break\n\
            case 'v': \n\
              segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoVerticalAbs(y), i)\n\
            break\n\
            case 'c': \n\
              segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i)\n\
            break\n\
            case 's': \n\
              segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i)\n\
            break\n\
            case 'q': \n\
              segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i)\n\
            break\n\
            case 't': \n\
              segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i)\n\
            break\n\
            case 'a': \n\
              segs.replaceItem(SVG.parser.path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i) \n\
            break\n\
            case 'z':\n\
            case 'Z':\n\
              x = x0\n\
              y = y0\n\
            break\n\
          }\n\
        }\n\
  \n\
        /* record the start of a subpath */\n\
        if (/[Mm]/.test(s)) {\n\
          x0 = x\n\
          y0 = y\n\
        }\n\
      }\n\
  \n\
      /* build internal representation */\n\
      array = []\n\
      segs = SVG.parser.path.pathSegList\n\
      \n\
      for (i = 0, il = segs.numberOfItems; i < il; ++i) {\n\
        seg = segs.getItem(i)\n\
        s = {}\n\
  \n\
        switch (seg.pathSegTypeAsLetter) {\n\
          case 'M':\n\
          case 'L':\n\
          case 'T':\n\
          case 'S':\n\
          case 'Q':\n\
          case 'C':\n\
            if (/[QC]/.test(seg.pathSegTypeAsLetter)) {\n\
              s.x1 = seg.x1\n\
              s.y1 = seg.y1\n\
            }\n\
  \n\
            if (/[SC]/.test(seg.pathSegTypeAsLetter)) {\n\
              s.x2 = seg.x2\n\
              s.y2 = seg.y2\n\
            }\n\
  \n\
          break\n\
          case 'A':\n\
            s = {\n\
              r1: seg.r1\n\
            , r2: seg.r2\n\
            , a:  seg.angle\n\
            , l:  seg.largeArcFlag\n\
            , s:  seg.sweepFlag\n\
            }\n\
          break\n\
        }\n\
  \n\
        /* make the letter, x and y values accessible as key/values */\n\
        s.type = seg.pathSegTypeAsLetter\n\
        s.x = seg.x\n\
        s.y = seg.y\n\
  \n\
        /* store segment */\n\
        array.push(s)\n\
      }\n\
      \n\
      return array\n\
    }\n\
    // Get bounding box of path\n\
  , bbox: function() {\n\
  \t\tif (this._cachedBBox) return this._cachedBBox\n\
  \n\
      SVG.parser.path.setAttribute('d', this.toString())\n\
  \n\
      return SVG.parser.path.getBBox()\n\
    }\n\
  \n\
  })\n\
\n\
  SVG.Number = function(value) {\n\
  \n\
    /* initialize defaults */\n\
    this.value = 0\n\
    this.unit = ''\n\
  \n\
    /* parse value */\n\
    switch(typeof value) {\n\
      case 'number':\n\
        /* ensure a valid numeric value */\n\
        this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value\n\
      break\n\
      case 'string':\n\
        var match = value.match(SVG.regex.unit)\n\
  \n\
        if (match) {\n\
          /* make value numeric */\n\
          this.value = parseFloat(match[1])\n\
      \n\
          /* normalize percent value */\n\
          if (match[2] == '%')\n\
            this.value /= 100\n\
      \n\
          /* store unit */\n\
          this.unit = match[2]\n\
        }\n\
        \n\
      break\n\
      default:\n\
        if (value instanceof SVG.Number) {\n\
          this.value = value.value\n\
          this.unit  = value.unit\n\
        }\n\
      break\n\
    }\n\
  }\n\
  \n\
  SVG.extend(SVG.Number, {\n\
    // Stringalize\n\
    toString: function() {\n\
      return (this.unit == '%' ? ~~(this.value * 1e8) / 1e6 : this.value) + this.unit\n\
    }\n\
  , // Convert to primitive\n\
    valueOf: function() {\n\
      return this.value\n\
    }\n\
    // Add number\n\
  , plus: function(number) {\n\
      this.value = this + new SVG.Number(number)\n\
  \n\
      return this\n\
    }\n\
    // Subtract number\n\
  , minus: function(number) {\n\
      return this.plus(-new SVG.Number(number))\n\
    }\n\
    // Multiply number\n\
  , times: function(number) {\n\
      this.value = this * new SVG.Number(number)\n\
  \n\
      return this\n\
    }\n\
    // Divide number\n\
  , divide: function(number) {\n\
      this.value = this / new SVG.Number(number)\n\
  \n\
      return this\n\
    }\n\
    // Convert to different unit\n\
  , to: function(unit) {\n\
      if (typeof unit === 'string')\n\
        this.unit = unit\n\
  \n\
      return this\n\
    }\n\
    // Make number morphable\n\
  , morph: function(number) {\n\
      this.destination = new SVG.Number(number)\n\
  \n\
      return this\n\
    }\n\
    // Get morphed number at given position\n\
  , at: function(pos) {\n\
      /* make sure a destination is defined */\n\
      if (!this.destination) return this\n\
  \n\
      /* generate morphed number */\n\
      return new SVG.Number(this.destination)\n\
          .minus(this)\n\
          .times(pos)\n\
          .plus(this)\n\
    }\n\
  \n\
  })\n\
\n\
  SVG.ViewBox = function(element) {\n\
    var x, y, width, height\n\
      , wm   = 1 /* width multiplier */\n\
      , hm   = 1 /* height multiplier */\n\
      , box  = element.bbox()\n\
      , view = (element.attr('viewBox') || '').match(/-?[\\d\\.]+/g)\n\
  \n\
    /* get dimensions of current node */\n\
    width  = new SVG.Number(element.width())\n\
    height = new SVG.Number(element.height())\n\
  \n\
    /* find nearest non-percentual dimensions */\n\
    while (width.unit == '%') {\n\
      wm *= width.value\n\
      width = new SVG.Number(element instanceof SVG.Doc ? element.parent.offsetWidth : element.width())\n\
    }\n\
    while (height.unit == '%') {\n\
      hm *= height.value\n\
      height = new SVG.Number(element instanceof SVG.Doc ? element.parent.offsetHeight : element.height())\n\
    }\n\
    \n\
    /* ensure defaults */\n\
    this.x      = box.x\n\
    this.y      = box.y\n\
    this.width  = width  * wm\n\
    this.height = height * hm\n\
    this.zoom   = 1\n\
    \n\
    if (view) {\n\
      /* get width and height from viewbox */\n\
      x      = parseFloat(view[0])\n\
      y      = parseFloat(view[1])\n\
      width  = parseFloat(view[2])\n\
      height = parseFloat(view[3])\n\
      \n\
      /* calculate zoom accoring to viewbox */\n\
      this.zoom = ((this.width / this.height) > (width / height)) ?\n\
        this.height / height :\n\
        this.width  / width\n\
  \n\
      /* calculate real pixel dimensions on parent SVG.Doc element */\n\
      this.x      = x\n\
      this.y      = y\n\
      this.width  = width\n\
      this.height = height\n\
      \n\
    }\n\
    \n\
  }\n\
  \n\
  //\n\
  SVG.extend(SVG.ViewBox, {\n\
    // Parse viewbox to string\n\
    toString: function() {\n\
      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height\n\
    }\n\
    \n\
  })\n\
\n\
  SVG.BBox = function(element) {\n\
    var box\n\
  \n\
    /* initialize zero box */\n\
    this.x      = 0\n\
    this.y      = 0\n\
    this.width  = 0\n\
    this.height = 0\n\
    \n\
    /* get values if element is given */\n\
    if (element) {\n\
      try {\n\
        /* actual, native bounding box */\n\
        box = element.node.getBBox()\n\
      } catch(e) {\n\
        /* fallback for some browsers */\n\
        box = {\n\
          x:      element.node.clientLeft\n\
        , y:      element.node.clientTop\n\
        , width:  element.node.clientWidth\n\
        , height: element.node.clientHeight\n\
        }\n\
      }\n\
      \n\
      /* include translations on x an y */\n\
      this.x = box.x + element.trans.x\n\
      this.y = box.y + element.trans.y\n\
      \n\
      /* plain width and height */\n\
      this.width  = box.width  * element.trans.scaleX\n\
      this.height = box.height * element.trans.scaleY\n\
    }\n\
    \n\
    /* add the center */\n\
    this.cx = this.x + this.width / 2\n\
    this.cy = this.y + this.height / 2\n\
    \n\
  }\n\
  \n\
  //\n\
  SVG.extend(SVG.BBox, {\n\
    // merge bounding box with another, return a new instance\n\
    merge: function(box) {\n\
      var b = new SVG.BBox()\n\
  \n\
      /* merge box */\n\
      b.x      = Math.min(this.x, box.x)\n\
      b.y      = Math.min(this.y, box.y)\n\
      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x\n\
      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y\n\
  \n\
      /* add the center */\n\
      b.cx = b.x + b.width / 2\n\
      b.cy = b.y + b.height / 2\n\
  \n\
      return b\n\
    }\n\
  \n\
  })\n\
\n\
  SVG.RBox = function(element) {\n\
    var e, zoom\n\
      , box = {}\n\
  \n\
    /* initialize zero box */\n\
    this.x      = 0\n\
    this.y      = 0\n\
    this.width  = 0\n\
    this.height = 0\n\
    \n\
    if (element) {\n\
      e = element.doc().parent\n\
      zoom = element.doc().viewbox().zoom\n\
      \n\
      /* actual, native bounding box */\n\
      box = element.node.getBoundingClientRect()\n\
      \n\
      /* get screen offset */\n\
      this.x = box.left\n\
      this.y = box.top\n\
      \n\
      /* subtract parent offset */\n\
      this.x -= e.offsetLeft\n\
      this.y -= e.offsetTop\n\
      \n\
      while (e = e.offsetParent) {\n\
        this.x -= e.offsetLeft\n\
        this.y -= e.offsetTop\n\
      }\n\
      \n\
      /* calculate cumulative zoom from svg documents */\n\
      e = element\n\
      while (e = e.parent) {\n\
        if (e.type == 'svg' && e.viewbox) {\n\
          zoom *= e.viewbox().zoom\n\
          this.x -= e.x() || 0\n\
          this.y -= e.y() || 0\n\
        }\n\
      }\n\
    }\n\
    \n\
    /* recalculate viewbox distortion */\n\
    this.x /= zoom\n\
    this.y /= zoom\n\
    this.width  = box.width  /= zoom\n\
    this.height = box.height /= zoom\n\
    \n\
    /* add the center */\n\
    this.cx = this.x + this.width  / 2\n\
    this.cy = this.y + this.height / 2\n\
    \n\
  }\n\
  \n\
  //\n\
  SVG.extend(SVG.RBox, {\n\
    // merge rect box with another, return a new instance\n\
    merge: function(box) {\n\
      var b = new SVG.RBox()\n\
  \n\
      /* merge box */\n\
      b.x      = Math.min(this.x, box.x)\n\
      b.y      = Math.min(this.y, box.y)\n\
      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x\n\
      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y\n\
  \n\
      /* add the center */\n\
      b.cx = b.x + b.width / 2\n\
      b.cy = b.y + b.height / 2\n\
  \n\
      return b\n\
    }\n\
  \n\
  })\n\
\n\
  SVG.Element = function(node) {\n\
    /* make stroke value accessible dynamically */\n\
    this._stroke = SVG.defaults.attrs.stroke\n\
    \n\
    /* initialize style store */\n\
    this.styles = {}\n\
    \n\
    /* initialize transformation store with defaults */\n\
    this.trans = SVG.defaults.trans()\n\
    \n\
    /* keep reference to the element node */\n\
    if (this.node = node) {\n\
      this.type = node.nodeName\n\
      this.node.instance = this\n\
    }\n\
  }\n\
  \n\
  //\n\
  SVG.extend(SVG.Element, {\n\
    // Move over x-axis\n\
    x: function(x) {\n\
      if (x) {\n\
        x = new SVG.Number(x)\n\
        x.value /= this.trans.scaleX\n\
      }\n\
      return this.attr('x', x)\n\
    }\n\
    // Move over y-axis\n\
  , y: function(y) {\n\
      if (y) {\n\
        y = new SVG.Number(y)\n\
        y.value /= this.trans.scaleY\n\
      }\n\
      return this.attr('y', y)\n\
    }\n\
    // Move by center over x-axis\n\
  , cx: function(x) {\n\
      return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)\n\
    }\n\
    // Move by center over y-axis\n\
  , cy: function(y) {\n\
      return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2)\n\
    }\n\
    // Move element to given x and y values\n\
  , move: function(x, y) {\n\
      return this.x(x).y(y)\n\
    }\n\
    // Move element by its center\n\
  , center: function(x, y) {\n\
      return this.cx(x).cy(y)\n\
    }\n\
    // Set width of element\n\
  , width: function(width) {\n\
      return this.attr('width', width)\n\
    }\n\
    // Set height of element\n\
  , height: function(height) {\n\
      return this.attr('height', height)\n\
    }\n\
    // Set element size to given width and height\n\
  , size: function(width, height) {\n\
      var p = this._proportionalSize(width, height)\n\
  \n\
      return this.attr({\n\
        width:  new SVG.Number(p.width)\n\
      , height: new SVG.Number(p.height)\n\
      })\n\
    }\n\
    // Clone element\n\
  , clone: function() {\n\
      var clone , attr\n\
        , type = this.type\n\
      \n\
      /* invoke shape method with shape-specific arguments */\n\
      clone = type == 'rect' || type == 'ellipse' ?\n\
        this.parent[type](0,0) :\n\
      type == 'line' ?\n\
        this.parent[type](0,0,0,0) :\n\
      type == 'image' ?\n\
        this.parent[type](this.src) :\n\
      type == 'text' ?\n\
        this.parent[type](this.content) :\n\
      type == 'path' ?\n\
        this.parent[type](this.attr('d')) :\n\
      type == 'polyline' || type == 'polygon' ?\n\
        this.parent[type](this.attr('points')) :\n\
      type == 'g' ?\n\
        this.parent.group() :\n\
        this.parent[type]()\n\
      \n\
      /* apply attributes attributes */\n\
      attr = this.attr()\n\
      delete attr.id\n\
      clone.attr(attr)\n\
      \n\
      /* copy transformations */\n\
      clone.trans = this.trans\n\
      \n\
      /* apply attributes and translations */\n\
      return clone.transform({})\n\
    }\n\
    // Remove element\n\
  , remove: function() {\n\
      if (this.parent)\n\
        this.parent.removeElement(this)\n\
      \n\
      return this\n\
    }\n\
    // Replace element\n\
  , replace: function(element) {\n\
      this.after(element).remove()\n\
  \n\
      return element\n\
    }\n\
    // Add element to given container and return self\n\
  , addTo: function(parent) {\n\
      return parent.put(this)\n\
    }\n\
    // Add element to given container and return container\n\
  , putIn: function(parent) {\n\
      return parent.add(this)\n\
    }\n\
    // Get parent document\n\
  , doc: function(type) {\n\
      return this._parent(type || SVG.Doc)\n\
    }\n\
    // Set svg element attribute\n\
  , attr: function(a, v, n) {\n\
      if (a == null) {\n\
        /* get an object of attributes */\n\
        a = {}\n\
        v = this.node.attributes\n\
        for (n = v.length - 1; n >= 0; n--)\n\
          a[v[n].nodeName] = SVG.regex.test(v[n].nodeValue, 'isNumber') ? parseFloat(v[n].nodeValue) : v[n].nodeValue\n\
        \n\
        return a\n\
        \n\
      } else if (typeof a == 'object') {\n\
        /* apply every attribute individually if an object is passed */\n\
        for (v in a) this.attr(v, a[v])\n\
        \n\
      } else if (v === null) {\n\
          /* remove value */\n\
          this.node.removeAttribute(a)\n\
        \n\
      } else if (v == null) {\n\
        /* act as a getter for style attributes */\n\
        if (this._isStyle(a)) {\n\
          return a == 'text' ?\n\
                   this.content :\n\
                 a == 'leading' && this.leading ?\n\
                   this.leading() :\n\
                   this.style(a)\n\
        \n\
        /* act as a getter if the first and only argument is not an object */\n\
        } else {\n\
          v = this.node.getAttribute(a)\n\
          return v == null ? \n\
            SVG.defaults.attrs[a] :\n\
          SVG.regex.test(v, 'isNumber') ?\n\
            parseFloat(v) : v\n\
        }\n\
      \n\
      } else if (a == 'style') {\n\
        /* redirect to the style method */\n\
        return this.style(v)\n\
      \n\
      } else {\n\
        /* treat x differently on text elements */\n\
        if (a == 'x' && Array.isArray(this.lines))\n\
          for (n = this.lines.length - 1; n >= 0; n--)\n\
            this.lines[n].attr(a, v)\n\
        \n\
        /* BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0 */\n\
        if (a == 'stroke-width')\n\
          this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)\n\
        else if (a == 'stroke')\n\
          this._stroke = v\n\
        \n\
        /* ensure full hex color */\n\
        if (SVG.Color.test(v) || SVG.Color.isRgb(v))\n\
          v = new SVG.Color(v)\n\
  \n\
        /* ensure correct numeric values */\n\
        else if (typeof v === 'number')\n\
          v = new SVG.Number(v)\n\
  \n\
        /* parse array values */\n\
        else if (Array.isArray(v))\n\
          v = new SVG.Array(v)\n\
  \n\
        /* set give attribute on node */\n\
        n != null ?\n\
          this.node.setAttributeNS(n, a, v.toString()) :\n\
          this.node.setAttribute(a, v.toString())\n\
        \n\
        /* if the passed argument belongs in the style as well, add it there */\n\
        if (this._isStyle(a)) {\n\
          a == 'text' ?\n\
            this.text(v) :\n\
          a == 'leading' && this.leading ?\n\
            this.leading(v) :\n\
            this.style(a, v)\n\
          \n\
          /* rebuild if required */\n\
          if (this.rebuild)\n\
            this.rebuild(a, v)\n\
        }\n\
      }\n\
      \n\
      return this\n\
    }\n\
    // Manage transformations\n\
  , transform: function(o, v) {\n\
      \n\
      if (arguments.length == 0) {\n\
        /* act as a getter if no argument is given */\n\
        return this.trans\n\
        \n\
      } else if (typeof o === 'string') {\n\
        /* act as a getter if only one string argument is given */\n\
        if (arguments.length < 2)\n\
          return this.trans[o]\n\
        \n\
        /* apply transformations as object if key value arguments are given*/\n\
        var transform = {}\n\
        transform[o] = v\n\
        \n\
        return this.transform(transform)\n\
      }\n\
      \n\
      /* ... otherwise continue as a setter */\n\
      var transform = []\n\
      \n\
      /* parse matrix */\n\
      o = this._parseMatrix(o)\n\
      \n\
      /* merge values */\n\
      for (v in o)\n\
        if (o[v] != null)\n\
          this.trans[v] = o[v]\n\
      \n\
      /* compile matrix */\n\
      this.trans.matrix = this.trans.a\n\
                  + ' ' + this.trans.b\n\
                  + ' ' + this.trans.c\n\
                  + ' ' + this.trans.d\n\
                  + ' ' + this.trans.e\n\
                  + ' ' + this.trans.f\n\
      \n\
      /* alias current transformations */\n\
      o = this.trans\n\
      \n\
      /* add matrix */\n\
      if (o.matrix != SVG.defaults.matrix)\n\
        transform.push('matrix(' + o.matrix + ')')\n\
      \n\
      /* add rotation */\n\
      if (o.rotation != 0)\n\
        transform.push('rotate(' + o.rotation + ' ' + (o.cx == null ? this.bbox().cx : o.cx) + ' ' + (o.cy == null ? this.bbox().cy : o.cy) + ')')\n\
      \n\
      /* add scale */\n\
      if (o.scaleX != 1 || o.scaleY != 1)\n\
        transform.push('scale(' + o.scaleX + ' ' + o.scaleY + ')')\n\
      \n\
      /* add skew on x axis */\n\
      if (o.skewX != 0)\n\
        transform.push('skewX(' + o.skewX + ')')\n\
      \n\
      /* add skew on y axis */\n\
      if (o.skewY != 0)\n\
        transform.push('skewY(' + o.skewY + ')')\n\
      \n\
      /* add translation */\n\
      if (o.x != 0 || o.y != 0)\n\
        transform.push('translate(' + new SVG.Number(o.x / o.scaleX) + ' ' + new SVG.Number(o.y / o.scaleY) + ')')\n\
      \n\
      /* update transformations, even if there are none */\n\
      if (transform.length == 0)\n\
        this.node.removeAttribute('transform')\n\
      else\n\
        this.node.setAttribute('transform', transform.join(' '))\n\
      \n\
      return this\n\
    }\n\
    // Dynamic style generator\n\
  , style: function(s, v) {\n\
      if (arguments.length == 0) {\n\
        /* get full style */\n\
        return this.attr('style') || ''\n\
      \n\
      } else if (arguments.length < 2) {\n\
        /* apply every style individually if an object is passed */\n\
        if (typeof s == 'object') {\n\
          for (v in s) this.style(v, s[v])\n\
        \n\
        } else if (SVG.regex.isCss.test(s)) {\n\
          /* parse css string */\n\
          s = s.split(';')\n\
  \n\
          /* apply every definition individually */\n\
          for (var i = 0; i < s.length; i++) {\n\
            v = s[i].split(':')\n\
  \n\
            if (v.length == 2)\n\
              this.style(v[0].replace(/\\s+/g, ''), v[1].replace(/^\\s+/,'').replace(/\\s+$/,''))\n\
          }\n\
        } else {\n\
          /* act as a getter if the first and only argument is not an object */\n\
          return this.styles[s]\n\
        }\n\
      \n\
      } else if (v === null || SVG.regex.test(v, 'isBlank')) {\n\
        /* remove value */\n\
        delete this.styles[s]\n\
        \n\
      } else {\n\
        /* store value */\n\
        this.styles[s] = v\n\
      }\n\
      \n\
      /* rebuild style string */\n\
      s = ''\n\
      for (v in this.styles)\n\
        s += v + ':' + this.styles[v] + ';'\n\
      \n\
      /* apply style */\n\
      if (s == '')\n\
        this.node.removeAttribute('style')\n\
      else\n\
        this.node.setAttribute('style', s)\n\
      \n\
      return this\n\
    }\n\
    // Get bounding box\n\
  , bbox: function() {\n\
      return new SVG.BBox(this)\n\
    }\n\
    // Get rect box\n\
  , rbox: function() {\n\
      return new SVG.RBox(this)\n\
    }\n\
    // Checks whether the given point inside the bounding box of the element\n\
  , inside: function(x, y) {\n\
      var box = this.bbox()\n\
      \n\
      return x > box.x\n\
          && y > box.y\n\
          && x < box.x + box.width\n\
          && y < box.y + box.height\n\
    }\n\
    // Show element\n\
  , show: function() {\n\
      return this.style('display', '')\n\
    }\n\
    // Hide element\n\
  , hide: function() {\n\
      return this.style('display', 'none')\n\
    }\n\
    // Is element visible?\n\
  , visible: function() {\n\
      return this.style('display') != 'none'\n\
    }\n\
    // Return id on string conversion\n\
  , toString: function() {\n\
      return this.attr('id')\n\
    }\n\
    // Private: find svg parent by instance\n\
  , _parent: function(parent) {\n\
      var element = this\n\
      \n\
      while (element != null && !(element instanceof parent))\n\
        element = element.parent\n\
  \n\
      return element\n\
    }\n\
    // Private: tester method for style detection\n\
  , _isStyle: function(a) {\n\
      return typeof a == 'string' ? SVG.regex.test(a, 'isStyle') : false\n\
    }\n\
    // Private: parse a matrix string\n\
  , _parseMatrix: function(o) {\n\
      if (o.matrix) {\n\
        /* split matrix string */\n\
        var m = o.matrix.replace(/\\s/g, '').split(',')\n\
        \n\
        /* pasrse values */\n\
        if (m.length == 6) {\n\
          o.a = parseFloat(m[0])\n\
          o.b = parseFloat(m[1])\n\
          o.c = parseFloat(m[2])\n\
          o.d = parseFloat(m[3])\n\
          o.e = parseFloat(m[4])\n\
          o.f = parseFloat(m[5])\n\
        }\n\
      }\n\
      \n\
      return o\n\
    }\n\
    // Private: calculate proportional width and height values when necessary\n\
  , _proportionalSize: function(width, height) {\n\
      if (width == null || height == null) {\n\
        var box = this.bbox()\n\
  \n\
        if (height == null)\n\
          height = box.height / box.width * width\n\
        else if (width == null)\n\
          width = box.width / box.height * height\n\
      }\n\
      \n\
      return {\n\
        width:  width\n\
      , height: height\n\
      }\n\
    }\n\
    \n\
  })\n\
\n\
  SVG.Parent = function(element) {\n\
    this.constructor.call(this, element)\n\
  }\n\
  \n\
  // Inherit from SVG.Element\n\
  SVG.Parent.prototype = new SVG.Element\n\
  \n\
  //\n\
  SVG.extend(SVG.Parent, {\n\
  \t// Returns all child elements\n\
    children: function() {\n\
      return this._children || (this._children = [])\n\
    }\n\
    // Add given element at a position\n\
  , add: function(element, i) {\n\
      if (!this.has(element)) {\n\
        /* define insertion index if none given */\n\
        i = i == null ? this.children().length : i\n\
        \n\
        /* remove references from previous parent */\n\
        if (element.parent)\n\
          element.parent.children().splice(element.parent.index(element), 1)\n\
        \n\
        /* add element references */\n\
        this.children().splice(i, 0, element)\n\
        this.node.insertBefore(element.node, this.node.childNodes[i] || null)\n\
        element.parent = this\n\
      }\n\
  \n\
      /* reposition defs */\n\
      if (this._defs) {\n\
        this.node.removeChild(this._defs.node)\n\
        this.node.appendChild(this._defs.node)\n\
      }\n\
      \n\
      return this\n\
    }\n\
    // Basically does the same as `add()` but returns the added element instead\n\
  , put: function(element, i) {\n\
      this.add(element, i)\n\
      return element\n\
    }\n\
    // Checks if the given element is a child\n\
  , has: function(element) {\n\
      return this.index(element) >= 0\n\
    }\n\
    // Gets index of given element\n\
  , index: function(element) {\n\
      return this.children().indexOf(element)\n\
    }\n\
    // Get a element at the given index\n\
  , get: function(i) {\n\
      return this.children()[i]\n\
    }\n\
    // Get first child, skipping the defs node\n\
  , first: function() {\n\
      return this.children()[0]\n\
    }\n\
    // Get the last child\n\
  , last: function() {\n\
      return this.children()[this.children().length - 1]\n\
    }\n\
    // Iterates over all children and invokes a given block\n\
  , each: function(block, deep) {\n\
      var i, il\n\
        , children = this.children()\n\
      \n\
      for (i = 0, il = children.length; i < il; i++) {\n\
        if (children[i] instanceof SVG.Element)\n\
          block.apply(children[i], [i, children])\n\
  \n\
        if (deep && (children[i] instanceof SVG.Container))\n\
          children[i].each(block, deep)\n\
      }\n\
    \n\
      return this\n\
    }\n\
    // Remove a child element at a position\n\
  , removeElement: function(element) {\n\
      this.children().splice(this.index(element), 1)\n\
      this.node.removeChild(element.node)\n\
      element.parent = null\n\
      \n\
      return this\n\
    }\n\
    // Remove all elements in this container\n\
  , clear: function() {\n\
      /* remove children */\n\
      for (var i = this.children().length - 1; i >= 0; i--)\n\
        this.removeElement(this.children()[i])\n\
  \n\
      /* remove defs node */\n\
      if (this._defs)\n\
        this._defs.clear()\n\
  \n\
      return this\n\
    }\n\
   , // Get defs\n\
    defs: function() {\n\
      return this.doc().defs()\n\
    }\n\
  })\n\
\n\
  SVG.Container = function(element) {\n\
    this.constructor.call(this, element)\n\
  }\n\
  \n\
  // Inherit from SVG.Parent\n\
  SVG.Container.prototype = new SVG.Parent\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Get the viewBox and calculate the zoom value\n\
    viewbox: function(v) {\n\
      if (arguments.length == 0)\n\
        /* act as a getter if there are no arguments */\n\
        return new SVG.ViewBox(this)\n\
      \n\
      /* otherwise act as a setter */\n\
      v = arguments.length == 1 ?\n\
        [v.x, v.y, v.width, v.height] :\n\
        [].slice.call(arguments)\n\
      \n\
      return this.attr('viewBox', v)\n\
    }\n\
    \n\
  })\n\
\n\
  SVG.FX = function(element) {\n\
    /* store target element */\n\
    this.target = element\n\
  }\n\
  \n\
  SVG.extend(SVG.FX, {\n\
    // Add animation parameters and start animation\n\
    animate: function(d, ease, delay) {\n\
      var akeys, tkeys, skeys, key\n\
        , element = this.target\n\
        , fx = this\n\
      \n\
      /* dissect object if one is passed */\n\
      if (typeof d == 'object') {\n\
        delay = d.delay\n\
        ease = d.ease\n\
        d = d.duration\n\
      }\n\
  \n\
      /* ensure default duration and easing */\n\
      d = d == null ? 1000 : d\n\
      ease = ease || '<>'\n\
  \n\
      /* process values */\n\
      fx.to = function(pos) {\n\
        var i\n\
  \n\
        /* normalise pos */\n\
        pos = pos < 0 ? 0 : pos > 1 ? 1 : pos\n\
  \n\
        /* collect attribute keys */\n\
        if (akeys == null) {\n\
          akeys = []\n\
          for (key in fx.attrs)\n\
            akeys.push(key)\n\
  \n\
          /* make sure morphable elements are scaled, translated and morphed all together */\n\
          if (element.morphArray && (fx._plot || akeys.indexOf('points') > -1)) {\n\
            /* get destination */\n\
            var box\n\
              , p = new element.morphArray(fx._plot || fx.attrs.points || element.array)\n\
  \n\
            /* add size */\n\
            if (fx._size) p.size(fx._size.width.to, fx._size.height.to)\n\
  \n\
            /* add movement */\n\
            box = p.bbox()\n\
            if (fx._x) p.move(fx._x.to, box.y)\n\
            else if (fx._cx) p.move(fx._cx.to - box.width / 2, box.y)\n\
  \n\
            box = p.bbox()\n\
            if (fx._y) p.move(box.x, fx._y.to)\n\
            else if (fx._cy) p.move(box.x, fx._cy.to - box.height / 2)\n\
  \n\
            /* delete element oriented changes */\n\
            delete fx._x\n\
            delete fx._y\n\
            delete fx._cx\n\
            delete fx._cy\n\
            delete fx._size\n\
  \n\
            fx._plot = element.array.morph(p)\n\
          }\n\
        }\n\
  \n\
        /* collect transformation keys */\n\
        if (tkeys == null) {\n\
          tkeys = []\n\
          for (key in fx.trans)\n\
            tkeys.push(key)\n\
        }\n\
  \n\
        /* collect style keys */\n\
        if (skeys == null) {\n\
          skeys = []\n\
          for (key in fx.styles)\n\
            skeys.push(key)\n\
        }\n\
  \n\
        /* apply easing */\n\
        pos = ease == '<>' ?\n\
          (-Math.cos(pos * Math.PI) / 2) + 0.5 :\n\
        ease == '>' ?\n\
          Math.sin(pos * Math.PI / 2) :\n\
        ease == '<' ?\n\
          -Math.cos(pos * Math.PI / 2) + 1 :\n\
        ease == '-' ?\n\
          pos :\n\
        typeof ease == 'function' ?\n\
          ease(pos) :\n\
          pos\n\
        \n\
        /* run plot function */\n\
        if (fx._plot) {\n\
          element.plot(fx._plot.at(pos))\n\
  \n\
        } else {\n\
          /* run all x-position properties */\n\
          if (fx._x)\n\
            element.x(at(fx._x, pos))\n\
          else if (fx._cx)\n\
            element.cx(at(fx._cx, pos))\n\
  \n\
          /* run all y-position properties */\n\
          if (fx._y)\n\
            element.y(at(fx._y, pos))\n\
          else if (fx._cy)\n\
            element.cy(at(fx._cy, pos))\n\
  \n\
          /* run all size properties */\n\
          if (fx._size)\n\
            element.size(at(fx._size.width, pos), at(fx._size.height, pos))\n\
        }\n\
  \n\
        /* run all viewbox properties */\n\
        if (fx._viewbox)\n\
          element.viewbox(\n\
            at(fx._viewbox.x, pos)\n\
          , at(fx._viewbox.y, pos)\n\
          , at(fx._viewbox.width, pos)\n\
          , at(fx._viewbox.height, pos)\n\
          )\n\
  \n\
        /* animate attributes */\n\
        for (i = akeys.length - 1; i >= 0; i--)\n\
          element.attr(akeys[i], at(fx.attrs[akeys[i]], pos))\n\
  \n\
        /* animate transformations */\n\
        for (i = tkeys.length - 1; i >= 0; i--)\n\
          element.transform(tkeys[i], at(fx.trans[tkeys[i]], pos))\n\
  \n\
        /* animate styles */\n\
        for (i = skeys.length - 1; i >= 0; i--)\n\
          element.style(skeys[i], at(fx.styles[skeys[i]], pos))\n\
  \n\
        /* callback for each keyframe */\n\
        if (fx._during)\n\
          fx._during.call(element, pos, function(from, to) {\n\
            return at({ from: from, to: to }, pos)\n\
          })\n\
      }\n\
      \n\
      if (typeof d === 'number') {\n\
        /* delay animation */\n\
        this.timeout = setTimeout(function() {\n\
          var start = new Date().getTime()\n\
  \n\
          /* initialize situation object */\n\
          fx.situation = {\n\
            interval: 1000 / 60\n\
          , start:    start\n\
          , play:     true\n\
          , finish:   start + d\n\
          , duration: d\n\
          }\n\
  \n\
          /* render function */\n\
          fx.render = function(){\n\
            \n\
            if (fx.situation.play === true) {\n\
              // This code was borrowed from the emile.js micro framework by Thomas Fuchs, aka MadRobby.\n\
              var time = new Date().getTime()\n\
                , pos = time > fx.situation.finish ? 1 : (time - fx.situation.start) / d\n\
              \n\
              /* process values */\n\
              fx.to(pos)\n\
              \n\
              /* finish off animation */\n\
              if (time > fx.situation.finish) {\n\
                if (fx._plot)\n\
                  element.plot(new SVG.PointArray(fx._plot.destination).settle())\n\
  \n\
                if (fx._loop === true || (typeof fx._loop == 'number' && fx._loop > 1)) {\n\
                  if (typeof fx._loop == 'number')\n\
                    --fx._loop\n\
                  fx.animate(d, ease, delay)\n\
                } else {\n\
                  fx._after ? fx._after.apply(element, [fx]) : fx.stop()\n\
                }\n\
  \n\
              } else {\n\
                requestAnimFrame(fx.render)\n\
              }\n\
            } else {\n\
              requestAnimFrame(fx.render)\n\
            }\n\
            \n\
          }\n\
  \n\
          /* start animation */\n\
          fx.render()\n\
          \n\
        }, delay || 0)\n\
      }\n\
      \n\
      return this\n\
    }\n\
    // Get bounding box of target element\n\
  , bbox: function() {\n\
      return this.target.bbox()\n\
    }\n\
    // Add animatable attributes\n\
  , attr: function(a, v) {\n\
      if (typeof a == 'object') {\n\
        for (var key in a)\n\
          this.attr(key, a[key])\n\
      \n\
      } else {\n\
        var from = this.target.attr(a)\n\
  \n\
        this.attrs[a] = SVG.Color.isColor(from) ?\n\
          new SVG.Color(from).morph(v) :\n\
        SVG.regex.unit.test(from) ?\n\
          new SVG.Number(from).morph(v) :\n\
          { from: from, to: v }\n\
      }\n\
      \n\
      return this\n\
    }\n\
    // Add animatable transformations\n\
  , transform: function(o, v) {\n\
      if (arguments.length == 1) {\n\
        /* parse matrix string */\n\
        o = this.target._parseMatrix(o)\n\
        \n\
        /* dlete matrixstring from object */\n\
        delete o.matrix\n\
        \n\
        /* store matrix values */\n\
        for (v in o)\n\
          this.trans[v] = { from: this.target.trans[v], to: o[v] }\n\
        \n\
      } else {\n\
        /* apply transformations as object if key value arguments are given*/\n\
        var transform = {}\n\
        transform[o] = v\n\
        \n\
        this.transform(transform)\n\
      }\n\
      \n\
      return this\n\
    }\n\
    // Add animatable styles\n\
  , style: function(s, v) {\n\
      if (typeof s == 'object')\n\
        for (var key in s)\n\
          this.style(key, s[key])\n\
      \n\
      else\n\
        this.styles[s] = { from: this.target.style(s), to: v }\n\
      \n\
      return this\n\
    }\n\
    // Animatable x-axis\n\
  , x: function(x) {\n\
      this._x = { from: this.target.x(), to: x }\n\
      \n\
      return this\n\
    }\n\
    // Animatable y-axis\n\
  , y: function(y) {\n\
      this._y = { from: this.target.y(), to: y }\n\
      \n\
      return this\n\
    }\n\
    // Animatable center x-axis\n\
  , cx: function(x) {\n\
      this._cx = { from: this.target.cx(), to: x }\n\
      \n\
      return this\n\
    }\n\
    // Animatable center y-axis\n\
  , cy: function(y) {\n\
      this._cy = { from: this.target.cy(), to: y }\n\
      \n\
      return this\n\
    }\n\
    // Add animatable move\n\
  , move: function(x, y) {\n\
      return this.x(x).y(y)\n\
    }\n\
    // Add animatable center\n\
  , center: function(x, y) {\n\
      return this.cx(x).cy(y)\n\
    }\n\
    // Add animatable size\n\
  , size: function(width, height) {\n\
      if (this.target instanceof SVG.Text) {\n\
        /* animate font size for Text elements */\n\
        this.attr('font-size', width)\n\
        \n\
      } else {\n\
        /* animate bbox based size for all other elements */\n\
        var box = this.target.bbox()\n\
  \n\
        this._size = {\n\
          width:  { from: box.width,  to: width  }\n\
        , height: { from: box.height, to: height }\n\
        }\n\
      }\n\
      \n\
      return this\n\
    }\n\
    // Add animatable plot\n\
  , plot: function(p) {\n\
      this._plot = p\n\
  \n\
      return this\n\
    }\n\
    // Add animatable viewbox\n\
  , viewbox: function(x, y, width, height) {\n\
      if (this.target instanceof SVG.Container) {\n\
        var box = this.target.viewbox()\n\
        \n\
        this._viewbox = {\n\
          x:      { from: box.x,      to: x      }\n\
        , y:      { from: box.y,      to: y      }\n\
        , width:  { from: box.width,  to: width  }\n\
        , height: { from: box.height, to: height }\n\
        }\n\
      }\n\
      \n\
      return this\n\
    }\n\
    // Add animateable gradient update\n\
  , update: function(o) {\n\
      if (this.target instanceof SVG.Stop) {\n\
        if (o.opacity != null) this.attr('stop-opacity', o.opacity)\n\
        if (o.color   != null) this.attr('stop-color', o.color)\n\
        if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))\n\
      }\n\
  \n\
      return this\n\
    }\n\
    // Add callback for each keyframe\n\
  , during: function(during) {\n\
      this._during = during\n\
      \n\
      return this\n\
    }\n\
    // Callback after animation\n\
  , after: function(after) {\n\
      this._after = after\n\
      \n\
      return this\n\
    }\n\
    // Make loopable\n\
  , loop: function(times) {\n\
      this._loop = times || true\n\
  \n\
      return this\n\
    }\n\
    // Stop running animation\n\
  , stop: function() {\n\
      /* stop current animation */\n\
      clearTimeout(this.timeout)\n\
      clearInterval(this.interval)\n\
      \n\
      /* reset storage for properties that need animation */\n\
      this.attrs     = {}\n\
      this.trans     = {}\n\
      this.styles    = {}\n\
      this.situation = {}\n\
  \n\
      delete this._x\n\
      delete this._y\n\
      delete this._cx\n\
      delete this._cy\n\
      delete this._size\n\
      delete this._plot\n\
      delete this._loop\n\
      delete this._after\n\
      delete this._during\n\
      delete this._viewbox\n\
  \n\
      return this\n\
    }\n\
    // Pause running animation\n\
  , pause: function() {\n\
      if (this.situation.play === true) {\n\
        this.situation.play  = false\n\
        this.situation.pause = new Date().getTime()\n\
      }\n\
  \n\
      return this\n\
    }\n\
    // Play running animation\n\
  , play: function() {\n\
      if (this.situation.play === false) {\n\
        var pause = new Date().getTime() - this.situation.pause\n\
        \n\
        this.situation.finish += pause\n\
        this.situation.start  += pause\n\
        this.situation.play    = true\n\
      }\n\
  \n\
      return this\n\
    }\n\
    \n\
  })\n\
  \n\
  SVG.extend(SVG.Element, {\n\
    // Get fx module or create a new one, then animate with given duration and ease\n\
    animate: function(d, ease, delay) {\n\
      return (this.fx || (this.fx = new SVG.FX(this))).stop().animate(d, ease, delay)\n\
    }\n\
    // Stop current animation; this is an alias to the fx instance\n\
  , stop: function() {\n\
      if (this.fx)\n\
        this.fx.stop()\n\
      \n\
      return this\n\
    }\n\
    // Pause current animation\n\
  , pause: function() {\n\
      if (this.fx)\n\
        this.fx.pause()\n\
  \n\
      return this\n\
    }\n\
    // Play paused current animation\n\
  , play: function() {\n\
      if (this.fx)\n\
        this.fx.play()\n\
  \n\
      return this\n\
    }\n\
    \n\
  })\n\
  \n\
  // Calculate position according to from and to\n\
  function at(o, pos) {\n\
    /* number recalculation (don't bother converting to SVG.Number for performance reasons) */\n\
    return typeof o.from == 'number' ?\n\
      o.from + (o.to - o.from) * pos :\n\
    \n\
    /* instance recalculation */\n\
    o instanceof SVG.Color || o instanceof SVG.Number ? o.at(pos) :\n\
    \n\
    /* for all other values wait until pos has reached 1 to return the final value */\n\
    pos < 1 ? o.from : o.to\n\
  }\n\
  \n\
  // Shim layer with setTimeout fallback by Paul Irish\n\
  window.requestAnimFrame = (function(){\n\
    return  window.requestAnimationFrame       ||\n\
            window.webkitRequestAnimationFrame ||\n\
            window.mozRequestAnimationFrame    ||\n\
            window.msRequestAnimationFrame     ||\n\
            function (c) { window.setTimeout(c, 1000 / 60) }\n\
  })()\n\
\n\
  SVG.extend(SVG.Element, SVG.FX, {\n\
    // Relative methods\n\
    relative: function() {\n\
      var b, e = this\n\
  \n\
      return {\n\
        // Move over x axis\n\
        x: function(x) {\n\
          b = e.bbox()\n\
  \n\
          return e.x(b.x + (x || 0))\n\
        }\n\
        // Move over y axis\n\
      , y: function(y) {\n\
          b = e.bbox()\n\
  \n\
          return e.y(b.y + (y || 0))\n\
        }\n\
        // Move over x and y axes\n\
      , move: function(x, y) {\n\
          this.x(x)\n\
          return this.y(y)\n\
        }\n\
      }\n\
    }\n\
  \n\
  })\n\
\n\
  ;[  'click'\n\
    , 'dblclick'\n\
    , 'mousedown'\n\
    , 'mouseup'\n\
    , 'mouseover'\n\
    , 'mouseout'\n\
    , 'mousemove'\n\
    , 'mouseenter'\n\
    , 'mouseleave' ].forEach(function(event) {\n\
    \n\
    /* add event to SVG.Element */\n\
    SVG.Element.prototype[event] = function(f) {\n\
      var self = this\n\
      \n\
      /* bind event to element rather than element node */\n\
      this.node['on' + event] = typeof f == 'function' ?\n\
        function() { return f.apply(self, arguments) } : null\n\
      \n\
      return this\n\
    }\n\
    \n\
  })\n\
  \n\
  // Add event binder in the SVG namespace\n\
  SVG.on = function(node, event, listener) {\n\
    if (node.addEventListener)\n\
      node.addEventListener(event, listener, false)\n\
    else\n\
      node.attachEvent('on' + event, listener)\n\
  }\n\
  \n\
  // Add event unbinder in the SVG namespace\n\
  SVG.off = function(node, event, listener) {\n\
    if (node.removeEventListener)\n\
      node.removeEventListener(event, listener, false)\n\
    else\n\
      node.detachEvent('on' + event, listener)\n\
  }\n\
  \n\
  //\n\
  SVG.extend(SVG.Element, {\n\
    // Bind given event to listener\n\
    on: function(event, listener) {\n\
      SVG.on(this.node, event, listener)\n\
      \n\
      return this\n\
    }\n\
    // Unbind event from listener\n\
  , off: function(event, listener) {\n\
      SVG.off(this.node, event, listener)\n\
      \n\
      return this\n\
    }\n\
  })\n\
\n\
  SVG.Defs = function() {\n\
    this.constructor.call(this, SVG.create('defs'))\n\
  }\n\
  \n\
  // Inherits from SVG.Container\n\
  SVG.Defs.prototype = new SVG.Container\n\
\n\
  SVG.G = function() {\n\
    this.constructor.call(this, SVG.create('g'))\n\
  }\n\
  \n\
  // Inherit from SVG.Container\n\
  SVG.G.prototype = new SVG.Container\n\
  \n\
  //\n\
  SVG.extend(SVG.G, {\n\
    // Move over x-axis\n\
    x: function(x) {\n\
      return x == null ? this.trans.x : this.transform('x', x)\n\
    }\n\
    // Move over y-axis\n\
  , y: function(y) {\n\
      return y == null ? this.trans.y : this.transform('y', y)\n\
    }\n\
    // Move by center over x-axis\n\
  , cx: function(x) {\n\
      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)\n\
    }\n\
    // Move by center over y-axis\n\
  , cy: function(y) {\n\
      return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)\n\
    }\n\
    \n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create a group element\n\
    group: function() {\n\
      return this.put(new SVG.G)\n\
    }\n\
    \n\
  })\n\
\n\
  SVG.extend(SVG.Element, {\n\
    // Get all siblings, including myself\n\
    siblings: function() {\n\
      return this.parent.children()\n\
    }\n\
    // Get the curent position siblings\n\
  , position: function() {\n\
      return this.parent.index(this)\n\
    }\n\
    // Get the next element (will return null if there is none)\n\
  , next: function() {\n\
      return this.siblings()[this.position() + 1]\n\
    }\n\
    // Get the next element (will return null if there is none)\n\
  , previous: function() {\n\
      return this.siblings()[this.position() - 1]\n\
    }\n\
    // Send given element one step forward\n\
  , forward: function() {\n\
      var i = this.position()\n\
      return this.parent.removeElement(this).put(this, i + 1)\n\
    }\n\
    // Send given element one step backward\n\
  , backward: function() {\n\
      var i = this.position()\n\
      \n\
      if (i > 0)\n\
        this.parent.removeElement(this).add(this, i - 1)\n\
  \n\
      return this\n\
    }\n\
    // Send given element all the way to the front\n\
  , front: function() {\n\
      return this.parent.removeElement(this).put(this)\n\
    }\n\
    // Send given element all the way to the back\n\
  , back: function() {\n\
      if (this.position() > 0)\n\
        this.parent.removeElement(this).add(this, 0)\n\
      \n\
      return this\n\
    }\n\
    // Inserts a given element before the targeted element\n\
  , before: function(element) {\n\
      element.remove()\n\
  \n\
      var i = this.position()\n\
      \n\
      this.parent.add(element, i)\n\
  \n\
      return this\n\
    }\n\
    // Insters a given element after the targeted element\n\
  , after: function(element) {\n\
      element.remove()\n\
      \n\
      var i = this.position()\n\
      \n\
      this.parent.add(element, i + 1)\n\
  \n\
      return this\n\
    }\n\
  \n\
  })\n\
\n\
  SVG.Mask = function() {\n\
    this.constructor.call(this, SVG.create('mask'))\n\
  \n\
    /* keep references to masked elements */\n\
    this.targets = []\n\
  }\n\
  \n\
  // Inherit from SVG.Container\n\
  SVG.Mask.prototype = new SVG.Container\n\
  \n\
  //\n\
  SVG.extend(SVG.Mask, {\n\
    // Unmask all masked elements and remove itself\n\
    remove: function() {\n\
      /* unmask all targets */\n\
      for (var i = this.targets.length - 1; i >= 0; i--)\n\
        if (this.targets[i])\n\
          this.targets[i].unmask()\n\
      delete this.targets\n\
  \n\
      /* remove mask from parent */\n\
      this.parent.removeElement(this)\n\
      \n\
      return this\n\
    }\n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Element, {\n\
    // Distribute mask to svg element\n\
    maskWith: function(element) {\n\
      /* use given mask or create a new one */\n\
      this.masker = element instanceof SVG.Mask ? element : this.parent.mask().add(element)\n\
  \n\
      /* store reverence on self in mask */\n\
      this.masker.targets.push(this)\n\
      \n\
      /* apply mask */\n\
      return this.attr('mask', 'url(\"#' + this.masker.attr('id') + '\")')\n\
    }\n\
    // Unmask element\n\
  , unmask: function() {\n\
      delete this.masker\n\
      return this.attr('mask', null)\n\
    }\n\
    \n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create masking element\n\
    mask: function() {\n\
      return this.defs().put(new SVG.Mask)\n\
    }\n\
    \n\
  })\n\
\n\
  SVG.Clip = function() {\n\
    this.constructor.call(this, SVG.create('clipPath'))\n\
  \n\
    /* keep references to clipped elements */\n\
    this.targets = []\n\
  }\n\
  \n\
  // Inherit from SVG.Container\n\
  SVG.Clip.prototype = new SVG.Container\n\
  \n\
  //\n\
  SVG.extend(SVG.Clip, {\n\
    // Unclip all clipped elements and remove itself\n\
    remove: function() {\n\
      /* unclip all targets */\n\
      for (var i = this.targets.length - 1; i >= 0; i--)\n\
        if (this.targets[i])\n\
          this.targets[i].unclip()\n\
      delete this.targets\n\
  \n\
      /* remove clipPath from parent */\n\
      this.parent.removeElement(this)\n\
      \n\
      return this\n\
    }\n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Element, {\n\
    // Distribute clipPath to svg element\n\
    clipWith: function(element) {\n\
      /* use given clip or create a new one */\n\
      this.clipper = element instanceof SVG.Clip ? element : this.parent.clip().add(element)\n\
  \n\
      /* store reverence on self in mask */\n\
      this.clipper.targets.push(this)\n\
      \n\
      /* apply mask */\n\
      return this.attr('clip-path', 'url(\"#' + this.clipper.attr('id') + '\")')\n\
    }\n\
    // Unclip element\n\
  , unclip: function() {\n\
      delete this.clipper\n\
      return this.attr('clip-path', null)\n\
    }\n\
    \n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create clipping element\n\
    clip: function() {\n\
      return this.defs().put(new SVG.Clip)\n\
    }\n\
  \n\
  })\n\
\n\
  SVG.Gradient = function(type) {\n\
    this.constructor.call(this, SVG.create(type + 'Gradient'))\n\
    \n\
    /* store type */\n\
    this.type = type\n\
  }\n\
  \n\
  // Inherit from SVG.Container\n\
  SVG.Gradient.prototype = new SVG.Container\n\
  \n\
  //\n\
  SVG.extend(SVG.Gradient, {\n\
    // From position\n\
    from: function(x, y) {\n\
      return this.type == 'radial' ?\n\
        this.attr({ fx: new SVG.Number(x), fy: new SVG.Number(y) }) :\n\
        this.attr({ x1: new SVG.Number(x), y1: new SVG.Number(y) })\n\
    }\n\
    // To position\n\
  , to: function(x, y) {\n\
      return this.type == 'radial' ?\n\
        this.attr({ cx: new SVG.Number(x), cy: new SVG.Number(y) }) :\n\
        this.attr({ x2: new SVG.Number(x), y2: new SVG.Number(y) })\n\
    }\n\
    // Radius for radial gradient\n\
  , radius: function(r) {\n\
      return this.type == 'radial' ?\n\
        this.attr({ r: new SVG.Number(r) }) :\n\
        this\n\
    }\n\
    // Add a color stop\n\
  , at: function(stop) {\n\
      return this.put(new SVG.Stop(stop))\n\
    }\n\
    // Update gradient\n\
  , update: function(block) {\n\
      /* remove all stops */\n\
      this.clear()\n\
      \n\
      /* invoke passed block */\n\
      block(this)\n\
      \n\
      return this\n\
    }\n\
    // Return the fill id\n\
  , fill: function() {\n\
      return 'url(#' + this.attr('id') + ')'\n\
    }\n\
    // Alias string convertion to fill\n\
  , toString: function() {\n\
      return this.fill()\n\
    }\n\
    \n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Defs, {\n\
    // define gradient\n\
    gradient: function(type, block) {\n\
      var element = this.put(new SVG.Gradient(type))\n\
      \n\
      /* invoke passed block */\n\
      block(element)\n\
      \n\
      return element\n\
    }\n\
    \n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create gradient element in defs\n\
    gradient: function(type, block) {\n\
      return this.defs().gradient(type, block)\n\
    }\n\
    \n\
  })\n\
  \n\
  \n\
  SVG.Stop = function(stop) {\n\
    this.constructor.call(this, SVG.create('stop'))\n\
    \n\
    /* immediatelly build stop */\n\
    this.update(stop)\n\
  }\n\
  \n\
  // Inherit from SVG.Element\n\
  SVG.Stop.prototype = new SVG.Element\n\
  \n\
  //\n\
  SVG.extend(SVG.Stop, {\n\
    // add color stops\n\
    update: function(o) {\n\
      /* set attributes */\n\
      if (o.opacity != null) this.attr('stop-opacity', o.opacity)\n\
      if (o.color   != null) this.attr('stop-color', o.color)\n\
      if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))\n\
  \n\
      return this\n\
    }\n\
    \n\
  })\n\
  \n\
\n\
\n\
  SVG.Doc = function(element) {\n\
    /* ensure the presence of a html element */\n\
    this.parent = typeof element == 'string' ?\n\
      document.getElementById(element) :\n\
      element\n\
    \n\
    /* If the target is an svg element, use that element as the main wrapper.\n\
       This allows svg.js to work with svg documents as well. */\n\
    this.constructor\n\
      .call(this, this.parent.nodeName == 'svg' ? this.parent : SVG.create('svg'))\n\
    \n\
    /* set svg element attributes */\n\
    this\n\
      .attr({ xmlns: SVG.ns, version: '1.1', width: '100%', height: '100%' })\n\
      .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)\n\
    \n\
    /* create the <defs> node */\n\
    this._defs = new SVG.Defs\n\
    this._defs.parent = this\n\
    this.node.appendChild(this._defs.node)\n\
  \n\
    /* turno of sub pixel offset by default */\n\
    this.doSubPixelOffsetFix = false\n\
    \n\
    /* ensure correct rendering */\n\
    if (this.parent.nodeName != 'svg')\n\
      this.stage()\n\
  }\n\
  \n\
  // Inherits from SVG.Container\n\
  SVG.Doc.prototype = new SVG.Container\n\
  \n\
  //\n\
  SVG.extend(SVG.Doc, {\n\
    // Hack for safari preventing text to be rendered in one line.\n\
    // Basically it sets the position of the svg node to absolute\n\
    // when the dom is loaded, and resets it to relative a few milliseconds later.\n\
    // It also handles sub-pixel offset rendering properly.\n\
    stage: function() {\n\
      var check\n\
        , element = this\n\
        , wrapper = document.createElement('div')\n\
  \n\
      /* set temporary wrapper to position relative */\n\
      wrapper.style.cssText = 'position:relative;height:100%;'\n\
  \n\
      /* put element into wrapper */\n\
      element.parent.appendChild(wrapper)\n\
      wrapper.appendChild(element.node)\n\
  \n\
      /* check for dom:ready */\n\
      check = function() {\n\
        if (document.readyState === 'complete') {\n\
          element.style('position:absolute;')\n\
          setTimeout(function() {\n\
            /* set position back to relative */\n\
            element.style('position:relative;overflow:hidden;')\n\
  \n\
            /* remove temporary wrapper */\n\
            element.parent.removeChild(element.node.parentNode)\n\
            element.node.parentNode.removeChild(element.node)\n\
            element.parent.appendChild(element.node)\n\
  \n\
            /* after wrapping is done, fix sub-pixel offset */\n\
            element.subPixelOffsetFix()\n\
            \n\
            /* make sure sub-pixel offset is fixed every time the window is resized */\n\
            SVG.on(window, 'resize', function() {\n\
              element.subPixelOffsetFix()\n\
            })\n\
            \n\
          }, 5)\n\
        } else {\n\
          setTimeout(check, 10)\n\
        }\n\
      }\n\
  \n\
      check()\n\
  \n\
      return this\n\
    }\n\
  \n\
    // Creates and returns defs element\n\
  , defs: function() {\n\
      return this._defs\n\
    }\n\
  \n\
    // Fix for possible sub-pixel offset. See:\n\
    // https://bugzilla.mozilla.org/show_bug.cgi?id=608812\n\
  , subPixelOffsetFix: function() {\n\
      if (this.doSubPixelOffsetFix) {\n\
        var pos = this.node.getScreenCTM()\n\
        \n\
        if (pos)\n\
          this\n\
            .style('left', (-pos.e % 1) + 'px')\n\
            .style('top',  (-pos.f % 1) + 'px')\n\
      }\n\
      \n\
      return this\n\
    }\n\
  \n\
  , fixSubPixelOffset: function() {\n\
      this.doSubPixelOffsetFix = true\n\
  \n\
      return this\n\
    }\n\
    \n\
  })\n\
\n\
  SVG.Shape = function(element) {\n\
    this.constructor.call(this, element)\n\
  }\n\
  \n\
  // Inherit from SVG.Element\n\
  SVG.Shape.prototype = new SVG.Element\n\
\n\
  SVG.Use = function() {\n\
    this.constructor.call(this, SVG.create('use'))\n\
  }\n\
  \n\
  // Inherit from SVG.Shape\n\
  SVG.Use.prototype = new SVG.Shape\n\
  \n\
  //\n\
  SVG.extend(SVG.Use, {\n\
    // Use element as a reference\n\
    element: function(element) {\n\
      /* store target element */\n\
      this.target = element\n\
  \n\
      /* set lined element */\n\
      return this.attr('href', '#' + element, SVG.xlink)\n\
    }\n\
    \n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create a use element\n\
    use: function(element) {\n\
      return this.put(new SVG.Use).element(element)\n\
    }\n\
  \n\
  })\n\
\n\
  SVG.Rect = function() {\n\
    this.constructor.call(this, SVG.create('rect'))\n\
  }\n\
  \n\
  // Inherit from SVG.Shape\n\
  SVG.Rect.prototype = new SVG.Shape\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create a rect element\n\
    rect: function(width, height) {\n\
      return this.put(new SVG.Rect().size(width, height))\n\
    }\n\
  \n\
  })\n\
\n\
  SVG.Ellipse = function() {\n\
    this.constructor.call(this, SVG.create('ellipse'))\n\
  }\n\
  \n\
  // Inherit from SVG.Shape\n\
  SVG.Ellipse.prototype = new SVG.Shape\n\
  \n\
  //\n\
  SVG.extend(SVG.Ellipse, {\n\
    // Move over x-axis\n\
    x: function(x) {\n\
      return x == null ? this.cx() - this.attr('rx') : this.cx(x + this.attr('rx'))\n\
    }\n\
    // Move over y-axis\n\
  , y: function(y) {\n\
      return y == null ? this.cy() - this.attr('ry') : this.cy(y + this.attr('ry'))\n\
    }\n\
    // Move by center over x-axis\n\
  , cx: function(x) {\n\
      return x == null ? this.attr('cx') : this.attr('cx', new SVG.Number(x).divide(this.trans.scaleX))\n\
    }\n\
    // Move by center over y-axis\n\
  , cy: function(y) {\n\
      return y == null ? this.attr('cy') : this.attr('cy', new SVG.Number(y).divide(this.trans.scaleY))\n\
    }\n\
    // Set width of element\n\
  , width: function(width) {\n\
      return width == null ? this.attr('rx') * 2 : this.attr('rx', new SVG.Number(width).divide(2))\n\
    }\n\
    // Set height of element\n\
  , height: function(height) {\n\
      return height == null ? this.attr('ry') * 2 : this.attr('ry', new SVG.Number(height).divide(2))\n\
    }\n\
    // Custom size function\n\
  , size: function(width, height) {\n\
      var p = this._proportionalSize(width, height)\n\
  \n\
      return this.attr({\n\
        rx: new SVG.Number(p.width).divide(2)\n\
      , ry: new SVG.Number(p.height).divide(2)\n\
      })\n\
    }\n\
    \n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create circle element, based on ellipse\n\
    circle: function(size) {\n\
      return this.ellipse(size, size)\n\
    }\n\
    // Create an ellipse\n\
  , ellipse: function(width, height) {\n\
      return this.put(new SVG.Ellipse).size(width, height).move(0, 0)\n\
    }\n\
    \n\
  })\n\
  \n\
  // Usage:\n\
  \n\
  //     draw.ellipse(200, 100)\n\
\n\
  SVG.Line = function() {\n\
    this.constructor.call(this, SVG.create('line'))\n\
  }\n\
  \n\
  // Inherit from SVG.Shape\n\
  SVG.Line.prototype = new SVG.Shape\n\
  \n\
  // Add required methods\n\
  SVG.extend(SVG.Line, {\n\
    // Move over x-axis\n\
    x: function(x) {\n\
      var b = this.bbox()\n\
      \n\
      return x == null ? b.x : this.attr({\n\
        x1: this.attr('x1') - b.x + x\n\
      , x2: this.attr('x2') - b.x + x\n\
      })\n\
    }\n\
    // Move over y-axis\n\
  , y: function(y) {\n\
      var b = this.bbox()\n\
      \n\
      return y == null ? b.y : this.attr({\n\
        y1: this.attr('y1') - b.y + y\n\
      , y2: this.attr('y2') - b.y + y\n\
      })\n\
    }\n\
    // Move by center over x-axis\n\
  , cx: function(x) {\n\
      var half = this.bbox().width / 2\n\
      return x == null ? this.x() + half : this.x(x - half)\n\
    }\n\
    // Move by center over y-axis\n\
  , cy: function(y) {\n\
      var half = this.bbox().height / 2\n\
      return y == null ? this.y() + half : this.y(y - half)\n\
    }\n\
    // Set width of element\n\
  , width: function(width) {\n\
      var b = this.bbox()\n\
  \n\
      return width == null ? b.width : this.attr(this.attr('x1') < this.attr('x2') ? 'x2' : 'x1', b.x + width)\n\
    }\n\
    // Set height of element\n\
  , height: function(height) {\n\
      var b = this.bbox()\n\
  \n\
      return height == null ? b.height : this.attr(this.attr('y1') < this.attr('y2') ? 'y2' : 'y1', b.y + height)\n\
    }\n\
    // Set line size by width and height\n\
  , size: function(width, height) {\n\
      var p = this._proportionalSize(width, height)\n\
  \n\
      return this.width(p.width).height(p.height)\n\
    }\n\
    // Set path data\n\
  , plot: function(x1, y1, x2, y2) {\n\
      return this.attr({\n\
        x1: x1\n\
      , y1: y1\n\
      , x2: x2\n\
      , y2: y2\n\
      })\n\
    }\n\
    \n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create a line element\n\
    line: function(x1, y1, x2, y2) {\n\
      return this.put(new SVG.Line().plot(x1, y1, x2, y2))\n\
    }\n\
    \n\
  })\n\
\n\
\n\
  SVG.Polyline = function() {\n\
    this.constructor.call(this, SVG.create('polyline'))\n\
  }\n\
  \n\
  // Inherit from SVG.Shape\n\
  SVG.Polyline.prototype = new SVG.Shape\n\
  \n\
  SVG.Polygon = function() {\n\
    this.constructor.call(this, SVG.create('polygon'))\n\
  }\n\
  \n\
  // Inherit from SVG.Shape\n\
  SVG.Polygon.prototype = new SVG.Shape\n\
  \n\
  // Add polygon-specific functions\n\
  SVG.extend(SVG.Polyline, SVG.Polygon, {\n\
    // Define morphable array\n\
    morphArray:  SVG.PointArray\n\
    // Plot new path\n\
  , plot: function(p) {\n\
      return this.attr('points', (this.array = new SVG.PointArray(p, [[0,0]])))\n\
    }\n\
    // Move by left top corner\n\
  , move: function(x, y) {\n\
      return this.attr('points', this.array.move(x, y))\n\
    }\n\
    // Move by left top corner over x-axis\n\
  , x: function(x) {\n\
      return x == null ? this.bbox().x : this.move(x, this.bbox().y)\n\
    }\n\
    // Move by left top corner over y-axis\n\
  , y: function(y) {\n\
      return y == null ? this.bbox().y : this.move(this.bbox().x, y)\n\
    }\n\
    // Set width of element\n\
  , width: function(width) {\n\
      var b = this.bbox()\n\
  \n\
      return width == null ? b.width : this.size(width, b.height)\n\
    }\n\
    // Set height of element\n\
  , height: function(height) {\n\
      var b = this.bbox()\n\
  \n\
      return height == null ? b.height : this.size(b.width, height) \n\
    }\n\
    // Set element size to given width and height\n\
  , size: function(width, height) {\n\
      var p = this._proportionalSize(width, height)\n\
  \n\
      return this.attr('points', this.array.size(p.width, p.height))\n\
    }\n\
  \n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create a wrapped polyline element\n\
    polyline: function(p) {\n\
      return this.put(new SVG.Polyline).plot(p)\n\
    }\n\
    // Create a wrapped polygon element\n\
  , polygon: function(p) {\n\
      return this.put(new SVG.Polygon).plot(p)\n\
    }\n\
  \n\
  })\n\
\n\
  SVG.Path = function() {\n\
    this.constructor.call(this, SVG.create('path'))\n\
  }\n\
  \n\
  // Inherit from SVG.Shape\n\
  SVG.Path.prototype = new SVG.Shape\n\
  \n\
  SVG.extend(SVG.Path, {\n\
    // Plot new poly points\n\
    plot: function(p) {\n\
      return this.attr('d', (this.array = new SVG.PathArray(p, [{ type:'M',x:0,y:0 }])))\n\
    }\n\
    // Move by left top corner\n\
  , move: function(x, y) {\n\
      return this.attr('d', this.array.move(x, y))\n\
    }\n\
    // Move by left top corner over x-axis\n\
  , x: function(x) {\n\
      return x == null ? this.bbox().x : this.move(x, this.bbox().y)\n\
    }\n\
    // Move by left top corner over y-axis\n\
  , y: function(y) {\n\
      return y == null ? this.bbox().y : this.move(this.bbox().x, y)\n\
    }\n\
    // Set element size to given width and height\n\
  , size: function(width, height) {\n\
      var p = this._proportionalSize(width, height)\n\
      \n\
      return this.attr('d', this.array.size(p.width, p.height))\n\
    }\n\
    // Set width of element\n\
  , width: function(width) {\n\
      return width == null ? this.bbox().width : this.size(width, this.bbox().height)\n\
    }\n\
    // Set height of element\n\
  , height: function(height) {\n\
      return height == null ? this.bbox().height : this.size(this.bbox().width, height)\n\
    }\n\
  \n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create a wrapped path element\n\
    path: function(d) {\n\
      return this.put(new SVG.Path).plot(d)\n\
    }\n\
  \n\
  })\n\
\n\
  SVG.Image = function() {\n\
    this.constructor.call(this, SVG.create('image'))\n\
  }\n\
  \n\
  // Inherit from SVG.Element\n\
  SVG.Image.prototype = new SVG.Shape\n\
  \n\
  //\n\
  SVG.extend(SVG.Image, {\n\
    // (re)load image\n\
    load: function(url) {\n\
      return (url ? this.attr('href', (this.src = url), SVG.xlink) : this)\n\
    }\n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create image element, load image and set its size\n\
    image: function(source, width, height) {\n\
      width = width != null ? width : 100\n\
      return this.put(new SVG.Image().load(source).size(width, height != null ? height : width))\n\
    }\n\
  \n\
  })\n\
\n\
  var _styleAttr = ('size family weight stretch variant style').split(' ')\n\
  \n\
  SVG.Text = function() {\n\
    this.constructor.call(this, SVG.create('text'))\n\
    \n\
    /* define default style */\n\
    this.styles = {\n\
      'font-size':    16\n\
    , 'font-family':  'Helvetica, Arial, sans-serif'\n\
    , 'text-anchor':  'start'\n\
    }\n\
    \n\
    this._leading = new SVG.Number('1.2em')\n\
    this._rebuild = true\n\
  }\n\
  \n\
  // Inherit from SVG.Element\n\
  SVG.Text.prototype = new SVG.Shape\n\
  \n\
  //\n\
  SVG.extend(SVG.Text, {\n\
    // Move over x-axis\n\
    x: function(x, a) {\n\
      /* act as getter */\n\
      if (x == null)\n\
        return a ? this.attr('x') : this.bbox().x\n\
      \n\
      /* set x taking anchor in mind */\n\
      if (!a) {\n\
        a = this.style('text-anchor')\n\
        x = a == 'start' ? x : a == 'end' ? x + this.bbox().width : x + this.bbox().width / 2\n\
      }\n\
  \n\
      /* move lines as well if no textPath si present */\n\
      if (!this.textPath)\n\
        this.lines.each(function() { if (this.newLined) this.x(x) })\n\
  \n\
      return this.attr('x', x)\n\
    }\n\
    // Move center over x-axis\n\
  , cx: function(x, a) {\n\
      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)\n\
    }\n\
    // Move center over y-axis\n\
  , cy: function(y, a) {\n\
      return y == null ? this.bbox().cy : this.y(a ? y : y - this.bbox().height / 2)\n\
    }\n\
    // Move element to given x and y values\n\
  , move: function(x, y, a) {\n\
      return this.x(x, a).y(y)\n\
    }\n\
    // Move element by its center\n\
  , center: function(x, y, a) {\n\
      return this.cx(x, a).cy(y, a)\n\
    }\n\
    // Set the text content\n\
  , text: function(text) {\n\
      /* act as getter */\n\
      if (text == null)\n\
        return this.content\n\
      \n\
      /* remove existing lines */\n\
      this.clear()\n\
      \n\
      if (typeof text === 'function') {\n\
        this._rebuild = false\n\
  \n\
        text.call(this, this)\n\
  \n\
      } else {\n\
        this._rebuild = true\n\
  \n\
        /* make sure text is not blank */\n\
        text = SVG.regex.isBlank.test(text) ? 'text' : text\n\
        \n\
        var i, il\n\
          , lines = text.split('\\n\
')\n\
        \n\
        /* build new lines */\n\
        for (i = 0, il = lines.length; i < il; i++)\n\
          this.tspan(lines[i]).newLine()\n\
  \n\
        this.rebuild()\n\
      }\n\
      \n\
      return this\n\
    }\n\
    // Create a tspan\n\
  , tspan: function(text) {\n\
      var node  = this.textPath ? this.textPath.node : this.node\n\
        , tspan = new SVG.TSpan().text(text)\n\
        , style = this.style()\n\
      \n\
      /* add new tspan */\n\
      node.appendChild(tspan.node)\n\
      this.lines.add(tspan)\n\
  \n\
      /* add style if any */\n\
      if (!SVG.regex.isBlank.test(style))\n\
        tspan.style(style)\n\
  \n\
      /* store content */\n\
      this.content += text\n\
  \n\
      /* store text parent */\n\
      tspan.parent = this\n\
  \n\
      return tspan\n\
    }\n\
    // Set font size\n\
  , size: function(size) {\n\
      return this.attr('font-size', size)\n\
    }\n\
    // Set / get leading\n\
  , leading: function(value) {\n\
      /* act as getter */\n\
      if (value == null)\n\
        return this._leading\n\
      \n\
      /* act as setter */\n\
      value = new SVG.Number(value)\n\
      this._leading = value\n\
      \n\
      /* apply leading */\n\
      this.lines.each(function() {\n\
        if (this.newLined)\n\
          this.attr('dy', value)\n\
      })\n\
  \n\
      return this\n\
    }\n\
    // rebuild appearance type\n\
  , rebuild: function() {\n\
      var self = this\n\
  \n\
      /* define position of all lines */\n\
      if (this._rebuild) {\n\
        this.lines.attr({\n\
          x:      this.attr('x')\n\
        , dy:     this._leading\n\
        , style:  this.style()\n\
        })\n\
      }\n\
  \n\
      return this\n\
    }\n\
    // Clear all lines\n\
  , clear: function() {\n\
      var node = this.textPath ? this.textPath.node : this.node\n\
  \n\
      /* remove existing child nodes */\n\
      while (node.hasChildNodes())\n\
        node.removeChild(node.lastChild)\n\
      \n\
      /* refresh lines */\n\
      delete this.lines\n\
      this.lines = new SVG.Set\n\
      \n\
      /* initialize content */\n\
      this.content = ''\n\
  \n\
      return this\n\
    }\n\
    \n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create text element\n\
    text: function(text) {\n\
      return this.put(new SVG.Text).text(text)\n\
    }\n\
    \n\
  })\n\
  \n\
  // tspan class\n\
  SVG.TSpan = function() {\n\
    this.constructor.call(this, SVG.create('tspan'))\n\
  }\n\
  \n\
  // Inherit from SVG.Shape\n\
  SVG.TSpan.prototype = new SVG.Shape\n\
  \n\
  // Include the container object\n\
  SVG.extend(SVG.TSpan, {\n\
    // Set text content\n\
    text: function(text) {\n\
      this.node.appendChild(document.createTextNode(text))\n\
      \n\
      return this\n\
    }\n\
    // Shortcut dx\n\
  , dx: function(dx) {\n\
      return this.attr('dx', dx)\n\
    }\n\
    // Shortcut dy\n\
  , dy: function(dy) {\n\
      return this.attr('dy', dy)\n\
    }\n\
    // Create new line\n\
  , newLine: function() {\n\
      this.newLined = true\n\
      this.parent.content += '\\n\
'\n\
      this.dy(this.parent._leading)\n\
      return this.attr('x', this.parent.x())\n\
    }\n\
  \n\
  })\n\
\n\
\n\
  SVG.TextPath = function() {\n\
    this.constructor.call(this, SVG.create('textPath'))\n\
  }\n\
  \n\
  // Inherit from SVG.Element\n\
  SVG.TextPath.prototype = new SVG.Element\n\
  \n\
  //\n\
  SVG.extend(SVG.Text, {\n\
    // Create path for text to run on\n\
    path: function(d) {\n\
      /* create textPath element */\n\
      this.textPath = new SVG.TextPath\n\
  \n\
      /* move lines to textpath */\n\
      while(this.node.hasChildNodes())\n\
        this.textPath.node.appendChild(this.node.firstChild)\n\
  \n\
      /* add textPath element as child node */\n\
      this.node.appendChild(this.textPath.node)\n\
  \n\
      /* create path in defs */\n\
      this.track = this.doc().defs().path(d, true)\n\
  \n\
      /* create circular reference */\n\
      this.textPath.parent = this\n\
  \n\
      /* link textPath to path and add content */\n\
      this.textPath.attr('href', '#' + this.track, SVG.xlink)\n\
  \n\
      return this\n\
    }\n\
    // Plot path if any\n\
  , plot: function(d) {\n\
      if (this.track) this.track.plot(d)\n\
      return this\n\
    }\n\
  \n\
  })\n\
\n\
  SVG.Nested = function() {\n\
    this.constructor.call(this, SVG.create('svg'))\n\
    \n\
    this.style('overflow', 'visible')\n\
  }\n\
  \n\
  // Inherit from SVG.Container\n\
  SVG.Nested.prototype = new SVG.Container\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create nested svg document\n\
    nested: function() {\n\
      return this.put(new SVG.Nested)\n\
    }\n\
    \n\
  })\n\
\n\
  SVG.A = function() {\n\
    this.constructor.call(this, SVG.create('a'))\n\
  }\n\
  \n\
  // Inherit from SVG.Parent\n\
  SVG.A.prototype = new SVG.Container\n\
  \n\
  //\n\
  SVG.extend(SVG.A, {\n\
    // Link url\n\
    to: function(url) {\n\
      return this.attr('href', url, SVG.xlink)\n\
    }\n\
    // Link show attribute\n\
  , show: function(target) {\n\
      return this.attr('show', target, SVG.xlink)\n\
    }\n\
    // Link target attribute\n\
  , target: function(target) {\n\
      return this.attr('target', target)\n\
    }\n\
  \n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create a hyperlink element\n\
    link: function(url) {\n\
      return this.put(new SVG.A).to(url)\n\
    }\n\
    \n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Element, {\n\
    // Create a hyperlink element\n\
    linkTo: function(url) {\n\
      var link = new SVG.A\n\
  \n\
      if (typeof url == 'function')\n\
        url.call(link, link)\n\
      else\n\
        link.to(url)\n\
  \n\
      return this.parent.put(link).put(this)\n\
    }\n\
    \n\
  })\n\
\n\
  SVG._stroke = ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']\n\
  SVG._fill   = ['color', 'opacity', 'rule']\n\
  \n\
  \n\
  // Prepend correct color prefix\n\
  var _colorPrefix = function(type, attr) {\n\
    return attr == 'color' ? type : type + '-' + attr\n\
  }\n\
  \n\
  /* Add sugar for fill and stroke */\n\
  ;['fill', 'stroke'].forEach(function(method) {\n\
    var extension = {}\n\
    \n\
    extension[method] = function(o) {\n\
      var indexOf\n\
      \n\
      if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))\n\
        this.attr(method, o)\n\
  \n\
      else\n\
        /* set all attributes from _fillAttr and _strokeAttr list */\n\
        for (index = SVG['_' + method].length - 1; index >= 0; index--)\n\
          if (o[SVG['_' + method][index]] != null)\n\
            this.attr(_colorPrefix(method, SVG['_' + method][index]), o[SVG['_' + method][index]])\n\
      \n\
      return this\n\
    }\n\
    \n\
    SVG.extend(SVG.Element, SVG.FX, extension)\n\
    \n\
  })\n\
  \n\
  SVG.extend(SVG.Element, SVG.FX, {\n\
    // Rotation\n\
    rotate: function(deg, x, y) {\n\
      return this.transform({\n\
        rotation: deg || 0\n\
      , cx: x\n\
      , cy: y\n\
      })\n\
    }\n\
    // Skew\n\
  , skew: function(x, y) {\n\
      return this.transform({\n\
        skewX: x || 0\n\
      , skewY: y || 0\n\
      })\n\
    }\n\
    // Scale\n\
  , scale: function(x, y) {\n\
      return this.transform({\n\
        scaleX: x\n\
      , scaleY: y == null ? x : y\n\
      })\n\
    }\n\
    // Translate\n\
  , translate: function(x, y) {\n\
      return this.transform({\n\
        x: x\n\
      , y: y\n\
      })\n\
    }\n\
    // Matrix\n\
  , matrix: function(m) {\n\
      return this.transform({ matrix: m })\n\
    }\n\
    // Opacity\n\
  , opacity: function(value) {\n\
      return this.attr('opacity', value)\n\
    }\n\
  \n\
  })\n\
  \n\
  //\n\
  SVG.extend(SVG.Rect, SVG.Ellipse, {\n\
    // Add x and y radius\n\
    radius: function(x, y) {\n\
      return this.attr({ rx: x, ry: y || x })\n\
    }\n\
  \n\
  })\n\
  \n\
  \n\
  if (SVG.Text) {\n\
    SVG.extend(SVG.Text, SVG.FX, {\n\
      // Set font \n\
      font: function(o) {\n\
        for (var key in o)\n\
          key == 'anchor' ?\n\
            this.attr('text-anchor', o[key]) :\n\
          _styleAttr.indexOf(key) > -1 ?\n\
            this.attr('font-'+ key, o[key]) :\n\
            this.attr(key, o[key])\n\
        \n\
        return this\n\
      }\n\
      \n\
    })\n\
  }\n\
  \n\
\n\
\n\
  SVG.Set = function() {\n\
    /* set initial state */\n\
    this.clear()\n\
  }\n\
  \n\
  // Set FX class\n\
  SVG.SetFX = function(set) {\n\
    /* store reference to set */\n\
    this.set = set\n\
  }\n\
  \n\
  //\n\
  SVG.extend(SVG.Set, {\n\
    // Add element to set\n\
    add: function() {\n\
      var i, il, elements = [].slice.call(arguments)\n\
  \n\
      for (i = 0, il = elements.length; i < il; i++)\n\
        this.members.push(elements[i])\n\
      \n\
      return this\n\
    }\n\
    // Remove element from set\n\
  , remove: function(element) {\n\
      var i = this.index(element)\n\
      \n\
      /* remove given child */\n\
      if (i > -1)\n\
        this.members.splice(i, 1)\n\
  \n\
      return this\n\
    }\n\
    // Iterate over all members\n\
  , each: function(block) {\n\
      for (var i = 0, il = this.members.length; i < il; i++)\n\
        block.apply(this.members[i], [i, this.members])\n\
  \n\
      return this\n\
    }\n\
    // Restore to defaults\n\
  , clear: function() {\n\
      /* initialize store */\n\
      this.members = []\n\
  \n\
      return this\n\
    }\n\
    // Checks if a given element is present in set\n\
  , has: function(element) {\n\
      return this.index(element) >= 0\n\
    }\n\
    // retuns index of given element in set\n\
  , index: function(element) {\n\
      return this.members.indexOf(element)\n\
    }\n\
    // Get member at given index\n\
  , get: function(i) {\n\
      return this.members[i]\n\
    }\n\
    // Default value\n\
  , valueOf: function() {\n\
      return this.members\n\
    }\n\
    // Get the bounding box of all members included or empty box if set has no items\n\
  , bbox: function(){\n\
      var box = new SVG.BBox()\n\
  \n\
      /* return an empty box of there are no members */\n\
      if (this.members.length == 0)\n\
        return box\n\
  \n\
      /* get the first rbox and update the target bbox */\n\
      var rbox = this.members[0].rbox()\n\
      box.x      = rbox.x\n\
      box.y      = rbox.y\n\
      box.width  = rbox.width\n\
      box.height = rbox.height\n\
  \n\
      this.each(function() {\n\
        /* user rbox for correct position and visual representation */\n\
        box = box.merge(this.rbox())\n\
      })\n\
  \n\
      return box\n\
    }\n\
  \n\
  })\n\
  \n\
  \n\
  \n\
  // Alias methods\n\
  SVG.Set.inherit = function() {\n\
    var m\n\
      , methods = []\n\
    \n\
    /* gather shape methods */\n\
    for(var m in SVG.Shape.prototype)\n\
      if (typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')\n\
        methods.push(m)\n\
  \n\
    /* apply shape aliasses */\n\
    methods.forEach(function(method) {\n\
      SVG.Set.prototype[method] = function() {\n\
        for (var i = 0, il = this.members.length; i < il; i++)\n\
          if (this.members[i] && typeof this.members[i][method] == 'function')\n\
            this.members[i][method].apply(this.members[i], arguments)\n\
  \n\
        return method == 'animate' ? (this.fx || (this.fx = new SVG.SetFX(this))) : this\n\
      }\n\
    })\n\
  \n\
    /* clear methods for the next round */\n\
    methods = []\n\
  \n\
    /* gather fx methods */\n\
    for(var m in SVG.FX.prototype)\n\
      if (typeof SVG.FX.prototype[m] == 'function' && typeof SVG.SetFX.prototype[m] != 'function')\n\
        methods.push(m)\n\
  \n\
    /* apply fx aliasses */\n\
    methods.forEach(function(method) {\n\
      SVG.SetFX.prototype[method] = function() {\n\
        for (var i = 0, il = this.set.members.length; i < il; i++)\n\
          this.set.members[i].fx[method].apply(this.set.members[i].fx, arguments)\n\
  \n\
        return this\n\
      }\n\
    })\n\
  }\n\
  \n\
  //\n\
  SVG.extend(SVG.Container, {\n\
    // Create a new set\n\
    set: function() {\n\
      return new SVG.Set\n\
    }\n\
  \n\
  })\n\
  \n\
  \n\
  \n\
\n\
\n\
  SVG.extend(SVG.Element, {\n\
  \t// Store data values on svg nodes\n\
    data: function(a, v, r) {\n\
    \tif (typeof a == 'object') {\n\
    \t\tfor (v in a)\n\
    \t\t\tthis.data(v, a[v])\n\
  \n\
      } else if (arguments.length < 2) {\n\
        try {\n\
          return JSON.parse(this.attr('data-' + a))\n\
        } catch(e) {\n\
          return this.attr('data-' + a)\n\
        }\n\
        \n\
      } else {\n\
        this.attr(\n\
          'data-' + a\n\
        , v === null ?\n\
            null :\n\
          r === true || typeof v === 'string' || typeof v === 'number' ?\n\
            v :\n\
            JSON.stringify(v)\n\
        )\n\
      }\n\
      \n\
      return this\n\
    }\n\
  })\n\
\n\
  SVG.extend(SVG.Element, {\n\
    // Remember arbitrary data\n\
    remember: function(k, v) {\n\
      /* remember every item in an object individually */\n\
      if (typeof arguments[0] == 'object')\n\
        for (var v in k)\n\
          this.remember(v, k[v])\n\
  \n\
      /* retrieve memory */\n\
      else if (arguments.length == 1)\n\
        return this.memory()[k]\n\
  \n\
      /* store memory */\n\
      else\n\
        this.memory()[k] = v\n\
  \n\
      return this\n\
    }\n\
  \n\
    // Erase a given memory\n\
  , forget: function() {\n\
      if (arguments.length == 0)\n\
        this._memory = {}\n\
      else\n\
        for (var i = arguments.length - 1; i >= 0; i--)\n\
          delete this.memory()[arguments[i]]\n\
  \n\
      return this\n\
    }\n\
  \n\
    // Initialize or return local memory object\n\
  , memory: function() {\n\
      return this._memory || (this._memory = {})\n\
    }\n\
  \n\
  })\n\
\n\
  if (typeof define === 'function' && define.amd)\n\
    define(function() { return SVG })\n\
  else if (typeof exports !== 'undefined')\n\
    exports.SVG = SVG\n\
\n\
}).call(this);\n\
//@ sourceURL=wout-svg.js/dist/svg.js"
));
require.register("component-inherit/index.js", Function("exports, require, module",
"\n\
module.exports = function(a, b){\n\
  var fn = function(){};\n\
  fn.prototype = b.prototype;\n\
  a.prototype = new fn;\n\
  a.prototype.constructor = a;\n\
};//@ sourceURL=component-inherit/index.js"
));
require.register("component-indexof/index.js", Function("exports, require, module",
"module.exports = function(arr, obj){\n\
  if (arr.indexOf) return arr.indexOf(obj);\n\
  for (var i = 0; i < arr.length; ++i) {\n\
    if (arr[i] === obj) return i;\n\
  }\n\
  return -1;\n\
};//@ sourceURL=component-indexof/index.js"
));
require.register("tower-emitter/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var index = require('indexof');\n\
var slice = [].slice;\n\
\n\
/**\n\
 * Expose `Emitter`.\n\
 */\n\
\n\
module.exports = Emitter;\n\
\n\
/**\n\
 * Initialize a new `Emitter`.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function Emitter(obj) {\n\
  if (obj) return mixin(obj);\n\
};\n\
\n\
/**\n\
 * Mixin the emitter properties.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function mixin(obj) {\n\
  for (var key in Emitter.prototype) {\n\
    obj[key] = Emitter.prototype[key];\n\
  }\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Listen on the given `event` with `fn`.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.on = function(event, fn){\n\
  this._callbacks || (this._callbacks = {});\n\
  (this._callbacks[event] || (this._callbacks[event] = []))\n\
    .push(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Adds an `event` listener that will be invoked a single\n\
 * time then automatically removed.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.once = function(event, fn){\n\
  var self = this;\n\
  this._callbacks || (this._callbacks = {});\n\
\n\
  function on() {\n\
    self.off(event, on);\n\
    fn.apply(this, arguments);\n\
  }\n\
\n\
  fn._off = on;\n\
  this.on(event, on);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove the given callback for `event` or all\n\
 * registered callbacks.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.off =\n\
Emitter.prototype.removeListener =\n\
Emitter.prototype.removeAllListeners = function(event, fn){\n\
  if (!this._callbacks) return this;\n\
\n\
  // all\n\
  if (0 === arguments.length) {\n\
    this._callbacks = {};\n\
    return this;\n\
  }\n\
\n\
  // specific event\n\
  var callbacks = this._callbacks[event];\n\
  if (!callbacks) return this;\n\
\n\
  // remove all handlers\n\
  if (1 === arguments.length) {\n\
    delete this._callbacks[event];\n\
    return this;\n\
  }\n\
\n\
  // remove specific handler\n\
  var i = index(callbacks, fn._off || fn);\n\
  if (~i) callbacks.splice(i, 1);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Emit `event` with the given args.\n\
 *\n\
 * @param {String} event\n\
 * @param {Mixed} ...\n\
 * @return {Emitter}\n\
 */\n\
\n\
Emitter.prototype.emit = function(event){\n\
  if (!this._callbacks) return this;\n\
\n\
  this._callbacks || (this._callbacks || {});\n\
\n\
  var callbacks = this._callbacks[event];\n\
\n\
  if (callbacks) {\n\
    var args = slice.call(arguments, 1);\n\
    callbacks = callbacks.slice(0);\n\
    for (var i = 0, n = callbacks.length; i < n; ++i) {\n\
      callbacks[i].apply(this, args);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return array of callbacks for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.listeners = function(event){\n\
  this._callbacks || (this._callbacks = {});\n\
  return this._callbacks[event] || [];\n\
};\n\
\n\
/**\n\
 * Check if this emitter has `event` handlers.\n\
 *\n\
 * @param {String} event\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.hasListeners = function(event){\n\
  return !!this.listeners(event).length;\n\
};//@ sourceURL=tower-emitter/index.js"
));
require.register("tower-type/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require('tower-emitter');\n\
var validator = require('tower-validator');\n\
var types = require('./lib/types');\n\
\n\
/**\n\
 * Expose `type`.\n\
 */\n\
\n\
exports = module.exports = type;\n\
\n\
/**\n\
 * Expose `Type`.\n\
 */\n\
\n\
exports.Type = Type;\n\
\n\
/**\n\
 * Expose `collection`.\n\
 */\n\
\n\
exports.collection = [];\n\
\n\
/**\n\
 * Expose `validator`.\n\
 */\n\
\n\
exports.validator = validator.ns('type');\n\
\n\
/**\n\
 * Define or get a type.\n\
 *\n\
 * @param {String} name Type name.\n\
 * @param {Function} fn A function added to a list of sanitizers that sanitizes the type.\n\
 * @return {Type} A type instance.\n\
 * @api public\n\
 */\n\
\n\
function type(name, fn) {\n\
  if (undefined === fn && exports.collection[name])\n\
      return exports.collection[name];\n\
\n\
  var instance = new Type(name, fn);\n\
  exports.collection[name] = instance;\n\
  exports.collection.push(instance);\n\
  exports.emit('define', name, instance);\n\
  return instance;\n\
}\n\
\n\
/**\n\
 * Mixin `Emitter`.\n\
 */\n\
\n\
Emitter(exports);\n\
\n\
/**\n\
 * Check if validator exists.\n\
 *\n\
 * @param {String} name Type name.\n\
 * @return {Boolean} true if `Type` exists, else false.\n\
 * @api public\n\
 */\n\
\n\
exports.defined = function(name){\n\
  return exports.collection.hasOwnProperty(name);\n\
};\n\
\n\
/**\n\
 * Scope validators to a namespace.\n\
 *\n\
 * @param {String} ns A namespace\n\
 * @return {Function} A function that returns a namespaced exports object.\n\
 * @api public\n\
 */\n\
\n\
exports.ns = function(ns){\n\
  return function type(name, fn) {\n\
    return exports(ns + '.' + name, fn);\n\
  }\n\
};\n\
\n\
/**\n\
 * Remove all validators.\n\
 *\n\
 * @chainable\n\
 * @return {Function} exports The main `type` function.\n\
 * @api public\n\
 */\n\
\n\
exports.clear = function(){\n\
  var collection = exports.collection;\n\
\n\
  exports.off();\n\
  for (var key in collection) {\n\
    if (collection.hasOwnProperty(key)) {\n\
      delete collection[key];\n\
    }\n\
  }\n\
  collection.length = 0;\n\
  return exports;\n\
};\n\
\n\
/**\n\
 * Class representing a type.\n\
 *\n\
 * @class\n\
 * @param {String} name A type name.\n\
 * @param {Function} fn A function added to a list of sanitizers that sanitizes the type.\n\
 * @api public\n\
 */\n\
\n\
function Type(name, fn) {\n\
  // XXX: name or path? maybe both.\n\
  this.name = name;\n\
  // XXX: or maybe just delegate:\n\
  // this.validator = type.validator.ns(name);\n\
  // that might reduce memory quite a bit.\n\
  // even though it's still only a tiny bit of it.\n\
  this.validators = [];\n\
  // serialization/sanitization function.\n\
  if (fn) this.use(fn);\n\
}\n\
\n\
/**\n\
 * Add a validator function to a type.\n\
 *\n\
 * @chainable\n\
 * @param {String} name A validator name.\n\
 * @param {Function} fn A validator function.\n\
 * @returns {Type}.\n\
 * @api public\n\
 */\n\
\n\
Type.prototype.validator = function(name, fn){\n\
  // XXX: see above, this should probably just\n\
  // be happening in `validator.ns(this.name)`.\n\
  exports.validator(this.name + '.' + name, fn);\n\
  this.validators.push(this.validators[name] = fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Sanitize functions to pass value through.\n\
 *\n\
 * @chainable\n\
 * @param {Function} fn A sanitizor function.\n\
 * @return {Type}\n\
 * @api public\n\
 */\n\
\n\
Type.prototype.use = function(fn){\n\
  (this.sanitizers || (this.sanitizers = [])).push(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Sanitize (or maybe `serialize`).\n\
 *\n\
 * XXX: maybe rename to `cast`?\n\
 *\n\
 * @param {Mixed} val A value to sanitize.\n\
 * @return {Mixed} The value sanitized.\n\
 * @api public\n\
 */\n\
\n\
Type.prototype.sanitize = function(val, obj){\n\
  if (!this.sanitizers) return val;\n\
\n\
  for (var i = 0, n = this.sanitizers.length; i < n; i++) {\n\
    val = this.sanitizers[i](val, obj);\n\
  }\n\
\n\
  return val;\n\
};\n\
\n\
/**\n\
 * Seralizer object by name.\n\
 *\n\
 * XXX: Maybe refactor into `tower/serializer` module.\n\
 *\n\
 * @chainable\n\
 * @param {String} name Object name.\n\
 * @return {Type}\n\
 * @api public\n\
 */\n\
\n\
Type.prototype.serializer = function(name){\n\
  this.context = (this.serializers || (this.serializers = {}))[name] = {};\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Define how to serialize type from\n\
 * JavaScript to external API/service request format.\n\
 *\n\
 * XXX: to/out/request/serialize/format/use\n\
 *\n\
 * @chainable\n\
 * @param {Function} fn Function to handle serialization.\n\
 * @return {Type}\n\
 * @api public\n\
 */\n\
\n\
Type.prototype.to = function(fn){\n\
  // XXX: some way to set a default serializer.\n\
  if (!this.context) this.serializer('default');\n\
  this.context.to = fn;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Define how to deserialize type from \n\
 * external API/service request format to JavaScript.\n\
 *\n\
 * XXX: from/in/response/deserialize\n\
 *\n\
 * @chainable\n\
 * @param {Function} fn Function to handle deserialization.\n\
 * @return {Type}\n\
 * @api public\n\
 */\n\
\n\
Type.prototype.from = function(fn){\n\
  if (!this.context) this.serializer('default');\n\
  this.context.from = fn;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Bring back to parent context.\n\
 *\n\
 * XXX: need more robust way to do this across modules.\n\
 *\n\
 * @param {String} name A type name.\n\
 */\n\
\n\
Type.prototype.type = function(name){\n\
\n\
};\n\
\n\
types(exports);//@ sourceURL=tower-type/index.js"
));
require.register("tower-type/lib/types.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var isArray = require('part-is-array');\n\
\n\
/**\n\
 * Expose `types`.\n\
 */\n\
\n\
module.exports = types;\n\
\n\
/**\n\
 * Define basic types and type validators.\n\
 *\n\
 * @param {Function} The type module.\n\
 */\n\
\n\
function types(type) {\n\
  // XXX: type('string').validator('lte')\n\
  // would default to `validator('gte')` if not explicitly defined.\n\
  type('string')\n\
    .use(String)\n\
    .validator('gte', function gte(a, b){\n\
      return a.length >= b.length;\n\
    })\n\
    .validator('gt', function gt(a, b){\n\
      return a.length > b.length;\n\
    });\n\
\n\
  type('id');\n\
\n\
  type('integer')\n\
    .use(parseInt);\n\
\n\
  type('object');\n\
\n\
  type('float')\n\
    .use(parseFloat);\n\
\n\
  type('decimal')\n\
    .use(parseFloat);\n\
\n\
  type('number')\n\
    .use(parseFloat);\n\
    \n\
  type('date')\n\
    .use(parseDate);\n\
\n\
  type('boolean')\n\
    .use(parseBoolean);\n\
\n\
  type('array')\n\
    // XXX: test? test('asdf') // true/false if is type.\n\
    // or `validate`\n\
    .use(function(val){\n\
      // XXX: handle more cases.\n\
      return isArray(val)\n\
        ? val\n\
        : val.split(/,\\s*/);\n\
    })\n\
    .validator('lte', function lte(a, b){\n\
      return a.length <= b.length;\n\
    });\n\
\n\
  function parseDate(val) {\n\
    return isDate(val)\n\
      ? val\n\
      : new Date(val);\n\
  }\n\
\n\
  function parseBoolean(val) {\n\
    // XXX: can be made more robust\n\
    var kind = typeof(val);\n\
    switch (kind) {\n\
      case 'string':\n\
        return '1' === val;\n\
      case 'number':\n\
        return 1 === val;\n\
      default:\n\
        return !!val;\n\
    }\n\
  }\n\
}\n\
\n\
// XXX: refactor to `part`\n\
function isDate(val) {\n\
  return '[object Date]' === Object.prototype.toString.call(val);\n\
}//@ sourceURL=tower-type/lib/types.js"
));
require.register("part-is-array/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `isArray`.\n\
 */\n\
\n\
module.exports = Array.isArray || isArray;\n\
\n\
function isArray(obj) {\n\
  return '[object Array]' === toString.call(obj);\n\
}//@ sourceURL=part-is-array/index.js"
));
require.register("tower-param/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require('tower-emitter');\n\
var validator = require('tower-validator');\n\
var type = require('tower-type');\n\
var isArray = require('part-is-array');\n\
var validators = require('./lib/validators');\n\
\n\
/**\n\
 * Expose `param`.\n\
 */\n\
\n\
exports = module.exports = param;\n\
\n\
/**\n\
 * Expose `Param`.\n\
 */\n\
\n\
exports.Param = Param;\n\
\n\
/**\n\
 * Expose `collection`.\n\
 */\n\
\n\
exports.collection = [];\n\
\n\
/**\n\
 * Expose `validator`.\n\
 */\n\
\n\
exports.validator = validator.ns('param');\n\
\n\
/**\n\
 * Get a `Param`.\n\
 */\n\
\n\
function param(name, type, options) {\n\
  if (exports.collection[name])\n\
    return exports.collection[name];\n\
\n\
  var instance = new Param(name, type, options);\n\
  exports.collection[name] = instance;\n\
  exports.collection.push(instance);\n\
  exports.emit('define', name, instance);\n\
  return instance;\n\
}\n\
\n\
/**\n\
 * Mixin `Emitter`.\n\
 */\n\
\n\
Emitter(exports);\n\
\n\
/**\n\
 * Instantiate a new `Param`.\n\
 */\n\
\n\
function Param(name, type, options){\n\
  if (!type) {\n\
    options = { type: 'string' };\n\
  } else if (isArray(type)) {\n\
    options = { type: 'array' };\n\
    options.itemType = type[0] || 'string';\n\
  } else if ('object' === typeof type) {\n\
    options = type;\n\
  } else {\n\
    options || (options = {});\n\
    options.type = type;\n\
  }\n\
\n\
  this.name = name;\n\
  this.type = options.type || 'string';\n\
\n\
  if (options.validators) this.validators = [];\n\
  if (options.alias) this.aliases = [ options.alias ];\n\
  else if (options.aliases) this.aliases = options.aliases;\n\
\n\
  // XXX: lazily create validators/operators?\n\
  // this.validators = options.validators || [];\n\
  // this.operators = options.operators || [];\n\
}\n\
\n\
/**\n\
 * Add validator to stack.\n\
 */\n\
\n\
Param.prototype.validator = function(key, val){\n\
  var assert = exports.validator(key);\n\
\n\
  (this.validators || (this.validators = []))\n\
    .push(function validate(self, query, constraint){ // XXX: fn callback later\n\
      if (!assert(self, constraint.right.value, val))\n\
        query.errors.push('Invalid Constraint something...');\n\
    });\n\
};\n\
\n\
/**\n\
 * Append operator to stack.\n\
 */\n\
\n\
Param.prototype.operator = function(name){\n\
  if (!this.operators) {  \n\
    this.operators = [];\n\
\n\
    var assert = validator('in');\n\
\n\
    (this.validators || (this.validators = []))\n\
      .push(function validate(self, query, constraint){\n\
        if (!assert(self, constraint.operator, self.operators)) {\n\
          query.errors.push('Invalid operator ' + constraint.operator);\n\
        } else {\n\
          // XXX: typecast\n\
        }\n\
      });\n\
  }\n\
\n\
  this.operators.push(name);\n\
};\n\
\n\
Param.prototype.validate = function(query, constraint, fn){\n\
  if (!this.validators) return true;\n\
\n\
  for (var i = 0, n = this.validators.length; i < n; i++) {\n\
    this.validators[i](this, query, constraint);\n\
  }\n\
\n\
  return !(query.errors && query.errors.length);\n\
};\n\
\n\
Param.prototype.alias = function(key){\n\
  (this.aliases || (this.aliases = [])).push(key);\n\
};\n\
\n\
// XXX: this might be too specific, trying it out for now.\n\
Param.prototype.format = function(type, name){\n\
  this.serializer = { type: type, name: name };\n\
};\n\
\n\
/**\n\
 * Convert a value into a proper form.\n\
 *\n\
 * Typecasting.\n\
 *\n\
 * @param {Mixed} val\n\
 */\n\
 \n\
Param.prototype.typecast = function(val, fn){\n\
  // XXX: handle for whether or not it's a constraint or simple equality.\n\
  // XXX: handle async parsing too, in tower-type (for things like streams)\n\
  var res = type(this.type).sanitize(val);\n\
  if (fn) fn(null, res);\n\
  return res;\n\
};\n\
\n\
/**\n\
 * Expression for param.\n\
 */\n\
\n\
Param.prototype.expression = function(name){\n\
  this._expression = name;\n\
  return this;\n\
};\n\
\n\
validators(exports);//@ sourceURL=tower-param/index.js"
));
require.register("tower-param/lib/validators.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var validator = require('tower-validator');\n\
\n\
/**\n\
 * Expose `validators`.\n\
 */\n\
\n\
module.exports = validators;\n\
\n\
/**\n\
 * Define default validators.\n\
 */\n\
\n\
function validators(param) {\n\
  // XXX: todo\n\
  param.validator('present', function(self, obj){\n\
    return null != obj;\n\
  });\n\
\n\
\tfunction define(key) {\n\
    param.validator(key, function(self, obj, val){\n\
      return validator(key)(obj, val);\n\
    });\n\
  }\n\
\n\
  define('eq');\n\
  define('neq');\n\
  define('in');\n\
  define('nin');\n\
  define('contains');\n\
  define('gte');\n\
  define('gt');\n\
  define('lt');\n\
  define('lte');\n\
  define('match');\n\
}//@ sourceURL=tower-param/lib/validators.js"
));
require.register("tower-stream/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var load = require('tower-load');\n\
var proto = require('./lib/proto');\n\
var statics = require('./lib/static');\n\
var api = require('./lib/api');\n\
\n\
/**\n\
 * Expose `stream`.\n\
 */\n\
\n\
exports = module.exports = stream;\n\
\n\
/**\n\
 * Find or create a stream by `name`.\n\
 *\n\
 * @param {String} name A stream name.\n\
 * @param {Function} fn Function called on stream execution.\n\
 * @api public\n\
 */\n\
\n\
function stream(name, fn) {\n\
  if (exports.collection[name]) return exports.collection[name];\n\
  if (exports.load(name)) return exports.collection[name];\n\
\n\
  /**\n\
   * Class representing a stream.\n\
   *\n\
   * @class\n\
   * @param {Object} options Stream options.\n\
   * @api public\n\
   */\n\
\n\
  function Stream(options) {\n\
    options || (options = {});\n\
\n\
    for (var key in options) this[key] = options[key];\n\
\n\
    this.name = name;\n\
    this.inputs = options.inputs || [];\n\
    this.outputs = options.outputs || [];\n\
    Stream.emit('init', this);\n\
  }\n\
\n\
  api.init(name, Stream, statics, proto, stream);\n\
\n\
  Stream.action = function(x, fn){\n\
    return stream(Stream.ns + '.' + x, fn);\n\
  }\n\
\n\
  if ('function' === typeof fn) Stream.on('exec', fn);\n\
\n\
  api.dispatch(stream, name, Stream);\n\
\n\
  return Stream;\n\
}\n\
\n\
/**\n\
 * Mixin API behavior.\n\
 */\n\
\n\
api(exports, statics, proto);\n\
\n\
/**\n\
 * Extend the `stream` API under a namespace.\n\
 *\n\
 * @param {String} ns A namespace.\n\
 * @return {Function} The `stream` API function extended under a namespace.\n\
 * @api public\n\
 */\n\
\n\
exports.ns = function(ns){\n\
  function stream(name, fn) {\n\
    return exports(ns + '.' + name, fn);\n\
  }\n\
\n\
  api.extend(stream, exports);\n\
\n\
  stream.exists = function(name){\n\
    return exports.exists(ns + '.' + name);\n\
  }\n\
\n\
  return stream;\n\
};\n\
\n\
/**\n\
 * Lazy-load.\n\
 * \n\
 * @param {String} name A unique key such as a stream name.\n\
 * @param {Path} path Full `require.resolve(x)` path.\n\
 * @return {Function} A module.\n\
 * @api public\n\
 */\n\
\n\
exports.load = function(name, path){\n\
  return 1 === arguments.length\n\
    ? load(exports, name)\n\
    : load.apply(load, [exports].concat(Array.prototype.slice.call(arguments)));\n\
};\n\
\n\
/**\n\
 * Check if `stream` exists by `name`.\n\
 *\n\
 * @param {String} name A stream name.\n\
 * @return {Boolean} true if the stream exists, else false.\n\
 * @api public\n\
 */\n\
\n\
exports.exists = function(name){\n\
  // try lazy loading\n\
  if (undefined === exports.collection[name])\n\
    return !!exports.load(name);\n\
\n\
  return !!exports.collection[name];\n\
};//@ sourceURL=tower-stream/index.js"
));
require.register("tower-stream/lib/static.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Param = require('tower-param').Param;\n\
var Attr = require('tower-attr').Attr;\n\
\n\
/**\n\
 * Instantiate a new `Stream`.\n\
 *\n\
 * XXX: rename to `init`.\n\
 *\n\
 * @param {Object} options Stream options.\n\
 * @return {Stream} A `Stream` instance.\n\
 * @api public\n\
 */\n\
\n\
exports.create = function(options){\n\
  return new this(options);\n\
};\n\
exports.init = exports.create;\n\
\n\
/**\n\
 * Instantiate a new `Param`.\n\
 *\n\
 * @param {String} name Param name.\n\
 * @param {String} type Param type.\n\
 * @param {Object} options Param options.\n\
 * @return {Param} A `Param` instance.\n\
 * @api public.\n\
 */\n\
\n\
exports.param = function(name, type, options){\n\
  this.params || (this.params = []);\n\
  this.context = this.params[name] = new Param(name, type, options);\n\
  this.params.push(this.context);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Instantiate a new `Attr`.\n\
 *\n\
 * @param {String} name Attr name.\n\
 * @param {Type} type Attr type.\n\
 * @param {Object} options Attr options.\n\
 * @return {Attr} A `Attr` instance.\n\
 * @api public.\n\
 */\n\
\n\
exports.attr = function(name, type, options){\n\
  this.attrs || (this.attrs = []);\n\
  this.context = this.attrs[name] = new Attr(name, type, options);\n\
  this.attrs.push(this.context);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Add an alias.\n\
 *\n\
 * @param {String} name An alias name.\n\
 * @return {Object} The instance object.\n\
 */\n\
\n\
exports.alias = function(name){\n\
  this.context.alias(name);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Define a validator.\n\
 *\n\
 * @param {String} key Name of the operator for assertion.\n\
 * @param {Mixed} val\n\
 * @return {Object} The instance object.\n\
 */\n\
\n\
exports.validate = function(key, val){\n\
  if (this === this.context)\n\
    // key is a function\n\
    this.validator(key, val)\n\
  else\n\
    // param or attr\n\
    this.context.validator(key, val);\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Append a validator function to the stack.\n\
 *\n\
 * @param {Function} fn A validator function.\n\
 * @return {Object} The instance object.\n\
 */\n\
\n\
exports.validator = function(fn){\n\
  // XXX: just a function in this case, but could handle more.\n\
  this.validators.push(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Reset the `context` to `this`.\n\
 *\n\
 * @return {Object} The instance object.\n\
 */\n\
\n\
exports.self = function(){\n\
  return this.context = this;\n\
};//@ sourceURL=tower-stream/lib/static.js"
));
require.register("tower-stream/lib/proto.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var noop = function(){}; // XXX: temp until async emitter.\n\
\n\
/**\n\
 * Execute the stream.\n\
 * \n\
 * @param {Object} data The stream data.\n\
 * @param {Function} fn Function called on executing stream.\n\
 */\n\
\n\
exports.exec = function(data, fn){\n\
  this.constructor.emit('exec', this, data, fn || noop);\n\
  // XXX: need to handle with/without cases.\n\
  //if (fn) fn();\n\
};\n\
\n\
/**\n\
 * Open the stream.\n\
 *\n\
 * @param {Object} data The stream data.\n\
 * @param {Function} fn Function called on opening stream.\n\
 */\n\
\n\
exports.open = function(data, fn){\n\
  // XXX: refactor\n\
  if (this.constructor.hasListeners('open'))\n\
    this.constructor.emit('open', this, data, fn || noop);\n\
  if (this.hasListeners('open'))\n\
    this.emit('open', fn || noop);\n\
\n\
  if (!this.hasListeners('open') && !this.constructor.hasListeners('open'))\n\
    fn();\n\
};\n\
\n\
/**\n\
 * Close the stream.\n\
 *\n\
 * @param {Function} fn Function called on closing stream.\n\
 */\n\
\n\
exports.close = function(fn){\n\
  this.constructor.emit('close', this, fn);\n\
  this.emit('close', fn);\n\
};//@ sourceURL=tower-stream/lib/proto.js"
));
require.register("tower-stream/lib/api.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require('tower-emitter');\n\
\n\
/**\n\
 * Expose `constructorFn`\n\
 */\n\
\n\
exports = module.exports = api;\n\
\n\
/**\n\
 * Setup the DSL API for a library.\n\
 *\n\
 * This is called once per \"apiFn method\".\n\
 *\n\
 * @param {Function} apiFn An api.\n\
 * @param {Function} statics Module containing static functions to attach to `apiFn`.\n\
 * @param {Function} proto Module containing instance functions to attach to `apiFn`.\n\
 * @return {Function} The api `apiFn`.\n\
 */\n\
\n\
function api(apiFn, statics, proto){\n\
  apiFn.collection = [];\n\
\n\
  // mixin `Emitter`\n\
\n\
  Emitter(apiFn);\n\
  Emitter(statics);\n\
  Emitter(proto);\n\
\n\
  apiFn.clear = clear;//clear.bind(apiFn);\n\
  apiFn.remove = remove;//remove.bind(apiFn);\n\
\n\
  return apiFn;\n\
}\n\
\n\
/**\n\
 * Add base behavior to a `Function`.\n\
 *\n\
 * This is called inside the API method.\n\
 *\n\
 * @param {String} name `fn` id.\n\
 * @param {Function} fn A function.\n\
 * @param {Function} statics Module containing static functions to attach to `fn`.\n\
 * @param {Function} proto Module containing instance functions to attach to `fn`.\n\
 * @param {Function} apiFn An api.\n\
 * @return {Function} The api `apiFn`.\n\
 */\n\
\n\
exports.init = function(name, fn, statics, proto, apiFn){\n\
  fn.id = name;\n\
\n\
  // namespace\n\
\n\
  fn.ns = name.replace(/\\.\\w+$/, '');\n\
\n\
  // statics\n\
\n\
  for (var key in statics) fn[key] = statics[key];\n\
\n\
  // prototype\n\
\n\
  fn.prototype = {};\n\
  fn.prototype.constructor = fn;\n\
  \n\
  for (var key in proto) fn.prototype[key] = proto[key];\n\
\n\
  apiFn.collection[name] = fn;\n\
  apiFn.collection.push(fn);\n\
\n\
  return apiFn;\n\
};\n\
\n\
/**\n\
 * Emit events for the `name`,\n\
 * so that external libraries can add extensions.\n\
 *\n\
 * @param {Function} apiFn An api.\n\
 * @param {String} name A name.\n\
 * @param {Function} fn Function called on `apiFn` define event.\n\
 * @return {Function} The api `apiFn`.\n\
 */\n\
\n\
exports.dispatch = function(apiFn, name, fn){\n\
  var parts = name.split('.');\n\
\n\
  for (var i = 1, n = parts.length + 1; i < n; i++) {\n\
    apiFn.emit('define ' + parts.slice(0, i).join('.'), fn);\n\
  }\n\
\n\
  apiFn.emit('define', fn);\n\
\n\
  return apiFn;\n\
};\n\
\n\
/**\n\
 * Scope the `constructorFn` names under a namespace.\n\
 *\n\
 * @param {Function} childApi The api to copy functions to.\n\
 * @param {Function} parentApi The api to copy functions from.\n\
 * @return {Function} The api `childApi`.\n\
 */\n\
\n\
exports.extend = function(childApi, parentApi){\n\
  // XXX: copy functions?\n\
  for (var key in parentApi) {\n\
    if ('function' === typeof parentApi[key])\n\
      childApi[key] = parentApi[key];\n\
  }\n\
  return childApi;\n\
};\n\
\n\
/**\n\
 * Clear API behavior.\n\
 */\n\
\n\
function clear(){\n\
  // remove all listeners\n\
  this.off();\n\
\n\
  while (this.collection.length)\n\
    this.remove(this.collection.pop());\n\
\n\
  return this;\n\
}\n\
\n\
function remove(val, i){\n\
  var emitter = this.collection[val] || val;\n\
  emitter.off();\n\
  delete this.collection[emitter.id];\n\
  // XXX: delete from collection array.\n\
}//@ sourceURL=tower-stream/lib/api.js"
));
require.register("part-is-blank/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
module.exports = function isBlank(obj){\n\
  if (null == obj || '' === obj) return true;\n\
  if (obj.length) return !obj.length;\n\
  if ('object' === typeof obj) {\n\
    for (var key in obj) return false;\n\
    return true;\n\
  }\n\
  return false;\n\
};//@ sourceURL=part-is-blank/index.js"
));
require.register("component-type/index.js", Function("exports, require, module",
"/**\n\
 * toString ref.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Return the type of `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(val){\n\
  switch (toString.call(val)) {\n\
    case '[object Date]': return 'date';\n\
    case '[object RegExp]': return 'regexp';\n\
    case '[object Arguments]': return 'arguments';\n\
    case '[object Array]': return 'array';\n\
    case '[object Error]': return 'error';\n\
  }\n\
\n\
  if (val === null) return 'null';\n\
  if (val === undefined) return 'undefined';\n\
  if (val !== val) return 'nan';\n\
  if (val && val.nodeType === 1) return 'element';\n\
\n\
  return typeof val.valueOf();\n\
};\n\
//@ sourceURL=component-type/index.js"
));
require.register("tower-attr/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var validator = require('tower-validator').ns('attr');\n\
var types = require('tower-type');\n\
var kindof = 'undefined' === typeof window ? require('type-component') : require('type');\n\
var each = require('part-async-series');\n\
var isBlank = require('part-is-blank');\n\
var validators = require('./lib/validators');\n\
\n\
/**\n\
 * Expose `attr`.\n\
 */\n\
\n\
exports = module.exports = attr;\n\
\n\
/**\n\
 * Expose `Attr`.\n\
 */\n\
\n\
exports.Attr = Attr;\n\
\n\
/**\n\
 * Expose `validator`.\n\
 */\n\
\n\
exports.validator = validator;\n\
\n\
/**\n\
 * Get an `Attr` instance.\n\
 */\n\
\n\
function attr(name, type, options, path) {\n\
  return new Attr(name, type, options, path);\n\
}\n\
\n\
/**\n\
 * Instantiate a new `Attr`.\n\
 */\n\
\n\
function Attr(name, type, options, path){\n\
  if (undefined === type) {\n\
    // .attr('title')\n\
    options = { type: 'string' };\n\
  } else {\n\
    var kind = kindof(type);\n\
\n\
    if ('object' === kind) {\n\
      // .attr('title', { value: 'Hello World', type: 'string' })\n\
      options = type;\n\
    } else if ('function' === kind) {\n\
      // .attr('title', function(){})\n\
      options = { value: type };\n\
      // XXX: array too\n\
    } else if ('array' === kind) {\n\
      options = { type: 'array', value: type };\n\
    } else {\n\
      if ('object' !== kindof(options)) {\n\
        options = { value: options };\n\
      } else {\n\
        options || (options = {});\n\
      }\n\
\n\
      // if `type` isn't in the list,\n\
      // it's a default value.\n\
      if (undefined !== options.value || types.defined(type))\n\
        options.type = type;\n\
      else\n\
        options.value = type;\n\
    }\n\
  }\n\
\n\
  this.name = name;\n\
  this.path = path || 'attr.' + name;\n\
\n\
  for (var key in options) this[key] = options[key];\n\
  if (!this.type) this.type = 'string';\n\
  \n\
  // override `.apply` for complex types\n\
  this.valueType = kindof(this.value);\n\
\n\
  switch (this.valueType) {\n\
    case 'function':\n\
      this.apply = functionType;\n\
      break;\n\
    case 'array':\n\
      this.apply = arrayType;\n\
      break;\n\
    case 'date':\n\
      this.apply = dateType;\n\
      break;\n\
  }\n\
}\n\
\n\
/**\n\
 * Add validator to stack.\n\
 */\n\
\n\
Attr.prototype.validator = function(key, val){\n\
  var self = this;\n\
  var assert = validator(key);\n\
  this.validators || (this.validators = []);\n\
  var validate;\n\
\n\
  if (4 === assert.length) {\n\
    validate = function(obj, errors, fn){\n\
      assert(self, obj, val, function(err){\n\
        if (err) errors[key] = false;\n\
      });\n\
    };\n\
  } else {\n\
    validate = function(obj, errors, fn){\n\
      if (!assert(self, obj, val))\n\
        errors[key] = false;\n\
      fn();\n\
    }\n\
  }\n\
\n\
  this.validators.push(validate);\n\
};\n\
\n\
Attr.prototype.alias = function(key){\n\
  (this.aliases || (this.aliases = [])).push(key);\n\
};\n\
\n\
Attr.prototype.validate = function(data, errors, fn){\n\
  if (!this.validators) return fn();\n\
\n\
  var validators = this.validators;\n\
  var i = 0;\n\
  var validator;\n\
  \n\
  function next() {\n\
    validator = validators[i++];\n\
    if (validator) {\n\
      validator(data, errors, next); \n\
    } else {\n\
      if (isBlank(errors))\n\
        fn();\n\
      else\n\
        fn(errors);\n\
    }\n\
  }\n\
\n\
  next();\n\
\n\
  return errors;\n\
};\n\
\n\
/**\n\
 * Convert a value into a proper form.\n\
 *\n\
 * Typecasting.\n\
 *\n\
 * @param {Mixed} val\n\
 * @param {Mixed} obj The object instance this attr value is relative to.\n\
 */\n\
\n\
Attr.prototype.typecast = function(val, obj){\n\
  return types(this.type).sanitize(val, obj);\n\
};\n\
\n\
/**\n\
 * Get default value.\n\
 *\n\
 * @param {Mixed} obj the object/record/instance to use\n\
 *    in computing the default value (if it's a function).\n\
 */\n\
\n\
Attr.prototype.apply = function(obj){\n\
  return this.value;\n\
};\n\
\n\
/**\n\
 * Types for applying default values.\n\
 */\n\
\n\
function functionType(obj, val) {\n\
  return this.value(obj, val);\n\
}\n\
\n\
function arrayType(obj) {\n\
  return this.value.concat();\n\
}\n\
\n\
function dateType(obj) {\n\
  return new Date(this.value.getTime());\n\
}\n\
\n\
/**\n\
 * Define basic validators.\n\
 */\n\
\n\
validators(exports);//@ sourceURL=tower-attr/index.js"
));
require.register("tower-attr/lib/validators.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var validator = require('tower-validator');\n\
\n\
/**\n\
 * Expose `validators`.\n\
 */\n\
\n\
module.exports = validators;\n\
\n\
/**\n\
 * Define default validators.\n\
 */\n\
\n\
function validators(attr) {\n\
  // XXX: maybe this goes into a separate module.\n\
  attr.validator('present', function(self, obj){\n\
    return null != obj[self.name];\n\
  });\n\
\n\
  function define(key) {\n\
    attr.validator(key, function(self, obj, val){\n\
      return validator(key)(obj[self.name], val);\n\
    });\n\
  }\n\
\n\
  define('eq');\n\
  define('neq');\n\
  define('in');\n\
  define('nin');\n\
  define('contains');\n\
  define('gte');\n\
  define('gt');\n\
  define('lt');\n\
  define('lte');\n\
\n\
  validator('string.gte', function(a, b){\n\
    return a.length >= b;\n\
  });\n\
\n\
  validator('string.lte', function(a, b){\n\
    return a.length <= b;\n\
  });\n\
\n\
  define('string.gte');\n\
  define('string.lte');\n\
\n\
  attr.validator('min', attr.validator('string.gte'));\n\
  attr.validator('max', attr.validator('string.lte'));\n\
}//@ sourceURL=tower-attr/lib/validators.js"
));
require.register("tower-validator/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require('tower-emitter');\n\
var validators = require('./lib/validators');\n\
\n\
/**\n\
 * Expose `validator`.\n\
 */\n\
\n\
exports = module.exports = validator;\n\
\n\
/**\n\
 * All validators in the order they were defined.\n\
 */\n\
\n\
exports.collection = [];\n\
\n\
/**\n\
 * Get or set a validator function.\n\
 *\n\
 * @param {String} name Validator name.\n\
 * @param {Function} fn Validator function.\n\
 * @return {Function} Validator function.\n\
 * @api public\n\
 */\n\
\n\
function validator(name, fn) {\n\
  if (undefined === fn) return exports.collection[name];\n\
\n\
  exports.collection[name] = fn;\n\
  exports.collection.push(fn);\n\
  exports.emit('define', name, fn);\n\
  \n\
  return fn;\n\
}\n\
\n\
/**\n\
 * Mixin `Emitter`.\n\
 */\n\
\n\
Emitter(exports);\n\
\n\
/**\n\
 * Check if validator exists.\n\
 *\n\
 * @param {String} name Validator name.\n\
 * @return {Boolean} true if the validator exists in the current list of validators, else false.\n\
 * @api public\n\
 */\n\
\n\
exports.defined = function(name){\n\
  return exports.collection.hasOwnProperty(name);\n\
};\n\
\n\
/**\n\
 * Scope validators to a namespace.\n\
 *\n\
 * @param {String} ns A namespace.\n\
 * @return {Function} Function to get or set a validator under a namespace.\n\
 * @api public\n\
 */\n\
\n\
exports.ns = function(ns){\n\
  return function validator(name, fn) {\n\
    return exports(ns + '.' + name, fn);\n\
  }\n\
};\n\
\n\
/**\n\
 * Remove all validators.\n\
 *\n\
 * @chainable\n\
 * @return {Function} exports The main `validator` function.\n\
 * @api public\n\
 */\n\
\n\
exports.clear = function(){\n\
  var collection = exports.collection;\n\
\n\
  exports.off('define');\n\
  for (var key in collection) {\n\
    if (collection.hasOwnProperty(key)) {\n\
      delete collection[key];\n\
    }\n\
  }\n\
  collection.length = 0;\n\
  return exports;\n\
};\n\
\n\
validators(exports);//@ sourceURL=tower-validator/index.js"
));
require.register("tower-validator/lib/validators.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var indexof = require('indexof');\n\
\n\
/**\n\
 * Expose `validators`.\n\
 */\n\
\n\
module.exports = validators;\n\
\n\
/**\n\
 * Define basic operators/validators.\n\
 *\n\
 * @param {Function} The validator module.\n\
 */\n\
\n\
function validators(validator) {\n\
  validator('eq', function eq(a, b){\n\
    return a === b;\n\
  });\n\
\n\
  validator('neq', function neq(a, b){\n\
    return a !== b;\n\
  });\n\
\n\
  validator('contains', function contains(a, b){\n\
    return !!~indexof(b, a);\n\
  });\n\
\n\
  validator('in', validator('contains'));\n\
\n\
  validator('excludes', function nin(a, b){\n\
    return !~indexof(b, a);\n\
  });\n\
\n\
  validator('nin', validator('excludes'));\n\
\n\
  validator('gte', function gte(a, b){\n\
    return a >= b;\n\
  });\n\
\n\
  validator('gt', function gt(a, b){\n\
    return a > b;\n\
  });\n\
\n\
  validator('lte', function gte(a, b){\n\
    return a <= b;\n\
  });\n\
\n\
  validator('lt', function gt(a, b){\n\
    return a < b;\n\
  });\n\
\n\
  validator('match', function match(a, b){\n\
    return !!a.match(b);\n\
  });\n\
}//@ sourceURL=tower-validator/lib/validators.js"
));
require.register("tower-text/index.js", Function("exports, require, module",
"\n\
/**\n\
 * DSL context.\n\
 */\n\
\n\
var context;\n\
\n\
/**\n\
 * Current language.\n\
 */\n\
\n\
var locale;\n\
\n\
/**\n\
 * Expose `text`.\n\
 */\n\
\n\
exports = module.exports = text;\n\
\n\
/**\n\
 * Example:\n\
 *\n\
 *    text('messages')\n\
 *\n\
 * @param {String} key\n\
 * @api public\n\
 */\n\
\n\
function text(key, val) {\n\
  return undefined === val\n\
    ? (locale[key] || (locale[key] = new Text))\n\
    : (locale[key] = new Text).one(val);\n\
}\n\
\n\
exports.has = function(key){\n\
  return !!locale[key];\n\
};\n\
\n\
/**\n\
 * Set locale.\n\
 */\n\
\n\
exports.locale = function(val){\n\
  locale = exports[val] || (exports[val] = {});\n\
  return exports;\n\
};\n\
\n\
/**\n\
 * Default locale is `en`.\n\
 */\n\
\n\
exports.locale('en');\n\
\n\
/**\n\
 * Instantiate a new `Text`.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
function Text() {\n\
  this.inflections = [];\n\
}\n\
\n\
/**\n\
 * @param {String} string\n\
 * @api public\n\
 */\n\
\n\
Text.prototype.past = function(string){\n\
  return this.inflection(string, context.count, 'past');\n\
};\n\
\n\
/**\n\
 * @param {String} string\n\
 * @api public\n\
 */\n\
\n\
Text.prototype.present = function(string){\n\
  return this.inflection(string, context.count, 'present');\n\
};\n\
\n\
/**\n\
 * @param {String} string\n\
 * @api public\n\
 */\n\
\n\
Text.prototype.future = function(string){\n\
  return this.inflection(string, context.count, 'future');\n\
};\n\
\n\
/**\n\
 * @param {String} string\n\
 * @param {String} tense\n\
 * @param {String} count\n\
 * @api public\n\
 */\n\
\n\
Text.prototype.tense = function(string, tense, count){\n\
  return this.inflection(string, count, tense);\n\
};\n\
\n\
/**\n\
 * @param {String} string\n\
 * @api public\n\
 */\n\
\n\
Text.prototype.none = function(string){\n\
  return this.inflection(string, 'none');\n\
};\n\
\n\
/**\n\
 * @param {String} string\n\
 * @api public\n\
 */\n\
\n\
Text.prototype.one = function(string){\n\
  return this.inflection(string, 'one');\n\
};\n\
\n\
/**\n\
 * @param {String} string\n\
 * @api public\n\
 */\n\
\n\
Text.prototype.other = function(string){\n\
  return this.inflection(string, 'other');\n\
};\n\
\n\
/**\n\
 * @param {String} string\n\
 * @param {String} count\n\
 * @param {String} tense\n\
 * @api public\n\
 */\n\
\n\
Text.prototype.inflection = function(string, count, tense){\n\
  // this isn't quite correct...\n\
  this.inflections.push(context = {\n\
    string: string,\n\
    count: count == null ? 'all' : count,\n\
    tense: tense || 'present'\n\
  });\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * This could be a view on the client.\n\
 *\n\
 * @param {Object} options\n\
 * @api public\n\
 */\n\
\n\
Text.prototype.render = function(options){\n\
  options || (options = {});\n\
\n\
  var count = (options.count ? (1 === options.count ? 'one' : 'other') : 'none')\n\
    , tense = options.tense || 'present'\n\
    , key = tense + '.' + count\n\
    , inflections = this.inflections\n\
    , inflection = inflections[0]\n\
    , currScore = 0\n\
    , prevScore = 0;\n\
\n\
  for (var i = 0, n = inflections.length; i < n; i++) {\n\
    currScore = 0\n\
      + (count === inflections[i].count ? 1 : 0)\n\
      + (tense === inflections[i].tense ? 1 : 0);\n\
\n\
    if (currScore > prevScore) {\n\
      inflection = inflections[i];\n\
      prevScore = currScore; \n\
    }\n\
  }\n\
\n\
  return inflection.string.replace(/\\{\\{(\\w+)\\}\\}/g, function(_, $1){\n\
    return options[$1];\n\
  });\n\
};//@ sourceURL=tower-text/index.js"
));
require.register("tower-load/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `load`.\n\
 */\n\
\n\
exports = module.exports = load;\n\
\n\
/**\n\
 * Map of `api + '.' + key` to absolute module path.\n\
 */\n\
\n\
exports.paths = {};\n\
\n\
/**\n\
 * Map of path to array of `api + '.' + key`.\n\
 */\n\
\n\
exports.keys = {};\n\
\n\
/**\n\
 * Map of path to `fn`.\n\
 */\n\
\n\
exports.fns = {};\n\
\n\
/**\n\
 * Lazy-load a module.\n\
 *\n\
 * This is something like an IoC container.\n\
 * Make sure the `api.toString()` is unique.\n\
 *\n\
 * @param {Function} api An api.\n\
 * @param {String} key A unique key.\n\
 * @param {Path} path Full `require.resolve(x)` path.\n\
 * @return {Function} A module.\n\
 * @api public\n\
 */\n\
\n\
function load(api, key, path) {\n\
  return undefined === path\n\
    ? exports.get(api, key)\n\
    : exports.set.apply(exports, arguments);\n\
}\n\
\n\
/**\n\
 * Get a module.\n\
 *\n\
 * @param {Function} api An api.\n\
 * @param {String} key A unique key\n\
 * @return {Function} A module.\n\
 * @api public\n\
 */\n\
\n\
exports.get = function(api, key){\n\
  var path = exports.paths[api.name + '.' + key];\n\
  if (path) {\n\
    var fn = exports.fns[path];\n\
    if (fn) return fn();\n\
  }\n\
}\n\
\n\
/**\n\
 * Define how to lazy-load a module.\n\
 *\n\
 * @chainable\n\
 * @param {Function} api An api.\n\
 * @param {String} key A unique key.\n\
 * @param {Path} path Full `require.resolve(x)` path.\n\
 * @return {Function} exports The main `load` function.\n\
 * @api public\n\
 */\n\
\n\
exports.set = function(api, key, path){\n\
  var pathKey = api.name + '.' + key;\n\
  if (!exports.paths[pathKey]) {\n\
    exports.paths[pathKey] = path;\n\
    (exports.keys[path] || (exports.keys[path] = [])).push(pathKey);\n\
    if (!exports.fns[path]) {\n\
      exports.fns[path] = requireFn(path, Array.prototype.slice.call(arguments, 3));\n\
    }\n\
  }\n\
  return exports;\n\
};\n\
\n\
/**\n\
 * Clear all modules.\n\
 *\n\
 * @param {Path} path Full `require.resolve(x)` path.\n\
 * @api public\n\
 */\n\
\n\
exports.clear = function(path){\n\
  for (var i = 0, n = exports.keys[path].length; i < n; i++) {\n\
    delete exports.paths[exports.keys[path][i]];\n\
  }\n\
  exports.keys[path].length = 0;\n\
  delete exports.keys[path];\n\
  delete exports.fns[path];\n\
};\n\
\n\
/**\n\
 * Return module function results.\n\
 *\n\
 * @param {Path} path Full `require.resolve(x)` path.\n\
 * @param {Array} args Module function arguments array.\n\
 * @return {Mixed} Module function return value.\n\
 */\n\
\n\
function requireFn(path, args) {\n\
  return function(obj) {\n\
    // remove all listeners\n\
    exports.clear(path);\n\
\n\
    var result = require(path);\n\
\n\
    if ('function' === typeof result) {\n\
      //args.unshift(obj);\n\
      result.apply(result, args);\n\
    }\n\
    \n\
    args = undefined;\n\
    return result;\n\
  }\n\
}//@ sourceURL=tower-load/index.js"
));
require.register("part-async-series/index.js", Function("exports, require, module",
"module.exports = function(fns, val, done, binding){\n\
  var i = 0, fn;\n\
\n\
  function handle(err) {\n\
    if (err) return done(err);\n\
    next();\n\
  }\n\
\n\
  function next() {\n\
    if (fn = fns[i++]) {\n\
      if (2 === fn.length) {\n\
        fn.call(binding, val, handle);\n\
      } else {\n\
        if (false === fn.call(binding, val))\n\
          done(new Error('haulted'));\n\
        else\n\
          next();\n\
      }\n\
    } else {\n\
      if (done) done();\n\
    }\n\
  }\n\
\n\
  next();\n\
}//@ sourceURL=part-async-series/index.js"
));
require.register("tower-resource/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require('tower-emitter');\n\
var stream = require('tower-stream');\n\
var validator = require('tower-validator').ns('resource');\n\
var load = require('tower-load');\n\
var proto = require('./lib/proto');\n\
var statics = require('./lib/static');\n\
var slice = [].slice;\n\
\n\
/**\n\
 * Expose `resource`.\n\
 */\n\
\n\
exports = module.exports = resource;\n\
\n\
/**\n\
 * Expose `collection`\n\
 */\n\
\n\
exports.collection = [];\n\
\n\
/**\n\
 * Expose `validator`.\n\
 */\n\
\n\
exports.validator = validator;\n\
\n\
/**\n\
 * Create a new resource constructor with the given `name`.\n\
 *\n\
 * @param {String} name Resource name.\n\
 * @return {Function} The `Resource` class constructor.\n\
 * @api public\n\
 */\n\
\n\
function resource(name) {\n\
  if (exports.collection[name]) return exports.collection[name];\n\
  if (exports.load(name)) return exports.collection[name];\n\
\n\
  /**\n\
   * Initialize a new resource with the given `attrs`.\n\
   *\n\
   * @class\n\
   * @param {Object} attrs An object with attributes.\n\
   * @param {Boolean} storedAttrs Attributes that should not be dirtied.\n\
   * @api public\n\
   */\n\
\n\
  function Resource(attrs, storedAttrs) {\n\
    // XXX: if storedAttrs, don't set to dirty\n\
    this.attrs = {};\n\
    this.dirty = {};\n\
    this._callbacks = {};\n\
    attrs = Resource._defaultAttrs(attrs, this);\n\
\n\
    for (var key in attrs) {\n\
      if (attrs.hasOwnProperty(key))\n\
        this.set(key, attrs[key], true);\n\
    }\n\
\n\
    Resource.emit('init', this);\n\
  }\n\
\n\
  Resource.toString = function toString(){\n\
    return 'resource(\"' + name + '\")';\n\
  }\n\
\n\
  // statics\n\
\n\
  Resource.className = name;\n\
  Resource.id = name;\n\
  Resource.attrs = [];\n\
  // optimization\n\
  Resource.attrs.__default__ = {};\n\
  Resource.validators = [];\n\
  Resource.prototypes = [];\n\
  Resource.relations = [];\n\
  Resource._callbacks = {};\n\
  // starting off context\n\
  Resource.context = Resource;\n\
\n\
  for (var key in statics) Resource[key] = statics[key];\n\
\n\
  // prototype\n\
\n\
  Resource.prototype = {};\n\
  Resource.prototype.constructor = Resource;\n\
  \n\
  for (var key in proto) Resource.prototype[key] = proto[key];\n\
\n\
  Resource.action = stream.ns(name);\n\
  Resource.id();\n\
\n\
  exports.collection[name] = Resource;\n\
  exports.collection.push(Resource);\n\
  exports.emit('define', Resource);\n\
  exports.emit('define ' + name, Resource);\n\
\n\
  return Resource;\n\
}\n\
\n\
/**\n\
 * Mixin `Emitter`.\n\
 */\n\
\n\
Emitter(resource);\n\
Emitter(statics);\n\
Emitter(proto);\n\
\n\
/**\n\
 * Mixins.\n\
 */\n\
\n\
exports.use = function(obj){\n\
  if ('function' === typeof obj) {\n\
    obj.call(exports, statics, proto, exports);\n\
  } else {\n\
    for (var key in obj) statics[key] = obj[key]\n\
  }\n\
};\n\
\n\
/**\n\
 * Lazy-load stuff for a particular constructor.\n\
 *\n\
 * Example:\n\
 *\n\
 *    resource.load('user', require.resolve('./lib/user'));\n\
 *\n\
 * @param {String} name Resource name.\n\
 * @param {String} path Resource path.\n\
 * @api public\n\
 */\n\
\n\
exports.load = function(name, path){\n\
  return 1 === arguments.length\n\
    ? load(exports, name)\n\
    : load.apply(load, [exports].concat(Array.prototype.slice.call(arguments)));\n\
};\n\
\n\
/**\n\
 * Create a `resource` function that\n\
 * just prepends a namespace to every key.\n\
 *\n\
 * This is used to make the DSL simpler,\n\
 * check out the `tower-adapter` code for an example.\n\
 *\n\
 * @param {String} ns The namespace.\n\
 * @return {Resource} The resource.\n\
 * @api public\n\
 */\n\
\n\
exports.ns = function(ns){\n\
  function resource(name) {\n\
    return exports(ns + '.' + name);\n\
  }\n\
\n\
  // XXX: copy functions?\n\
  for (var key in exports) {\n\
    if ('function' === typeof exports[key])\n\
      resource[key] = exports[key];\n\
  }\n\
  return resource;\n\
};\n\
\n\
/**\n\
 * Check object is a `Resource` object.\n\
 * XXX: maybe remove \"resource('name')\" as toString.\n\
 *\n\
 * @param {Object} obj A JavaScript object.\n\
 * @return {Boolean} true if obj is a `Resource` object, otherwise false.\n\
 * @api public\n\
 */\n\
\n\
exports.is = function(obj){\n\
  return obj && obj.constructor.toString().indexOf('resource(') === 0;\n\
};\n\
\n\
/**\n\
 * Clear resources.\n\
 *\n\
 * @return {Function} exports The main `resource` function.\n\
 * @api public\n\
 */\n\
\n\
exports.clear = function(){\n\
  exports.collection.forEach(function(emitter){\n\
    emitter.off('define');\n\
    delete exports.collection[emitter.className];\n\
  });\n\
\n\
  exports.collection.length = 0;\n\
\n\
  return exports;\n\
};//@ sourceURL=tower-resource/index.js"
));
require.register("tower-resource/lib/static.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var attr = require('tower-attr');\n\
var validator = require('tower-validator').ns('resource');\n\
var text = require('tower-text'); // XXX: rename `tower-text`?\n\
var query = require('tower-query');\n\
var series = require('part-async-series');\n\
\n\
text('resource.error', 'Resource validation failed');\n\
\n\
/**\n\
 * Instantiate a new `Resource`.\n\
 *\n\
 * @constructor Resource\n\
 * @param {Object} attrs Resource attributes.\n\
 * @param {Boolean} storedAttrs Boolean to enable caching attributes.\n\
 * @return {Object} instance.\n\
 */\n\
\n\
exports.init = function(attrs, storedAttrs){\n\
  return new this(attrs, storedAttrs);\n\
};\n\
\n\
/**\n\
 * Check if this resource is new.\n\
 *\n\
 * @constructor Resource\n\
 * @param {Object} data The attributes to test.\n\
 * @return {Boolean} true if resource is new, else false.\n\
 * @api public\n\
 */\n\
\n\
exports.isNew = function(data){\n\
  return !has(data, this.primaryKey);\n\
};\n\
\n\
/**\n\
 * Use the given plugin `fn()`.\n\
 *\n\
 * @constructor Resource\n\
 * @chainable\n\
 * @param {Function} fn Plugin function.\n\
 * @return {Function} exports The main `resource` function.\n\
 * @api public\n\
 */\n\
\n\
exports.use = function(fn){\n\
  fn(this);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Add validation `fn()`.\n\
 *\n\
 * @constructor Resource\n\
 * @chainable\n\
 * @param {Function} fn Validation function.\n\
 * @return {Function} exports The main `resource` function.\n\
 * @api public\n\
 */\n\
\n\
exports.validate = function(key, val){\n\
  // XXX: add validator to validate attributes.\n\
  if (!this.validators.attrs && this !== this.context) {\n\
    var self = this;\n\
    this.validators.attrs = true;\n\
    this.validator(function validateAttributes(obj, fn){\n\
      var validators = [];\n\
\n\
      self.attrs.forEach(function(attr){\n\
        if (attr.validators && attr.validators.length) {\n\
          validators.push(function validate(obj){\n\
            attr.validate(obj);\n\
          });\n\
        }\n\
      });\n\
\n\
      series(validators, obj, fn);\n\
    });\n\
  }\n\
  \n\
  if ('function' === typeof key)\n\
    this.validator(key);\n\
  else\n\
    this.context.validator(key, val);\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Add a validation function to a list of validators.\n\
 *\n\
 * @constructor Resource\n\
 * @chainable\n\
 * @param key Resource property.\n\
 * @param val Resource property value.\n\
 * @return {Function} exports The main `resource` function.\n\
 * @api public\n\
 */\n\
\n\
exports.validator = function(key, val){\n\
  if ('function' === typeof key) {\n\
    // XXX: needs to handle pushing errors.\n\
    this.validators.push(key);\n\
  } else {\n\
    var assert = validator(key);\n\
    // XXX: should be set somewhere earlier.\n\
    var path = this.path || 'resource.' + this.className + '.' + key;\n\
\n\
    this.validators.push(function validate(obj, fn){\n\
      if (!assert(obj, val)) {\n\
        // XXX: hook into `tower-text` for I18n\n\
        var error = text.has(path)\n\
          ? text(path).render(obj)\n\
          : text('resource.error').render(obj);\n\
\n\
        obj.errors[attr.name] = error;\n\
        obj.errors.push(error);\n\
      }\n\
    });\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Define an `id`.\n\
 *\n\
 * @constructor Resource\n\
 * @chainable\n\
 * @param {String} name\n\
 * @param {Object} options\n\
 * @return {Function} exports The main `resource` function.\n\
 * @api public\n\
 */\n\
\n\
exports.id = function(name, type, options){\n\
  options || (options = {});\n\
  return this.attr(name || 'id', type || 'id', options);\n\
};\n\
\n\
/**\n\
 * Define attr with the given `name` and `options`.\n\
 *\n\
 * @constructor Resource\n\
 * @chainable\n\
 * @param {String} name\n\
 * @param {Object} options\n\
 * @return {Function} exports The main `resource` function.\n\
 * @api public\n\
 */\n\
\n\
exports.attr = function(name, type, options){\n\
  var obj = this.context = attr(name, type, options, this.id + '.' + name);\n\
\n\
  // set?\n\
  this.attrs[name] = obj;\n\
  this.attrs.push(obj);\n\
  // optimization\n\
  if (obj.hasDefaultValue) this.attrs.__default__[name] = obj;\n\
\n\
  // implied pk\n\
  if ('id' === name) {\n\
    options.primaryKey = true;\n\
    this.primaryKey = name;\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Insert/POST/create a new record.\n\
 *\n\
 * @constructor Resource\n\
 * @param {Object} attrs Initial record attribute values.\n\
 * @param {Function} fn Function called on record creation.\n\
 * @return {Topology} A stream object.\n\
 * @api public\n\
 */\n\
\n\
exports.create = function(attrs, fn){\n\
  if ('function' === typeof attrs) {\n\
    fn = attrs;\n\
    attrs = undefined;\n\
  }\n\
  return this.init(attrs).save(fn);\n\
};\n\
\n\
/**\n\
 * Save/PUT/update an existing record.\n\
 *\n\
 * @constructor Resource\n\
 * @param {Object} attrs Record attribute values to be updated to.\n\
 * @param {Function} fn Function called on record update.\n\
 * @return {Topology} A stream object.\n\
 * @api public\n\
 */\n\
\n\
exports.save = function(attrs, fn){\n\
  if ('function' === typeof attrs) {\n\
    fn = attrs;\n\
    attrs = undefined;\n\
  }\n\
  return this.init(attrs).save(fn);\n\
};\n\
\n\
/**\n\
 * Make a SELECT query on className and name.\n\
 *\n\
 * @param {String} name An appended namespace.\n\
 * @return {Query} Query object containing query results.\n\
 * @api public\n\
 */\n\
\n\
exports.query = function(name){\n\
  return null == name\n\
    ? query().select(this.className)\n\
    // XXX: this should only happen first time.\n\
    : query(this.className + '.' + name).select(this.className);\n\
};\n\
\n\
/**\n\
 * Execute find query with `fn`.\n\
 *\n\
 * @constructor Resource\n\
 * @param {Function} fn Function executed on query `find` call.\n\
 * @return {Query} Query object containing query results.\n\
 */\n\
\n\
exports.find = function(fn){\n\
  return this.query().find(fn);\n\
};\n\
\n\
/**\n\
 * Remove all records of this type.\n\
 *\n\
 * @constructor Resource\n\
 * @param {Function} fn Function executed on query `remove` call.\n\
 * @return {Query} Query object containing query results.\n\
 * @api public\n\
 */\n\
\n\
exports.remove = function(fn){\n\
  return this.query().remove(fn);\n\
};\n\
\n\
/**\n\
 * Updates a list of records.\n\
 *\n\
 * @constructor Resource\n\
 * @param {Array} updates List of record attributes to update.\n\
 * @param {Function} fn Function executed on record update.\n\
 * @api public\n\
 */\n\
\n\
exports.update = function(updates, fn){\n\
  return this.query().update(updates, fn);\n\
};\n\
\n\
/**\n\
 * Begin defining a query.\n\
 *\n\
 * @constructor Resource\n\
 * @param {String} key Attribute path\n\
 * @return {Query} Query object.\n\
 * @api public\n\
 */\n\
\n\
exports.where = function(key){\n\
  return this.query().where(key);\n\
};\n\
\n\
/**\n\
 * Get all records.\n\
 *\n\
 * @constructor Resource\n\
 * @param {Function} fn Function executed on query `all` call.\n\
 * @return {Query} Query object containing query results.\n\
 */\n\
\n\
exports.all = function(fn){\n\
  return this.query().all(fn);\n\
};\n\
\n\
/**\n\
 * XXX: Load data into store.\n\
 *\n\
 * @constructor Resource\n\
 * @param {Object} Data to load into store.\n\
 */\n\
\n\
exports.load = function(data){\n\
  // XXX require('tower-memory-adapter').load(data);\n\
};\n\
\n\
/**\n\
 * Returns the default model attributes with their values.\n\
 *\n\
 * @constructor Resource\n\
 * @return {Object} The default model attributes with their values.\n\
 * @api private\n\
 */\n\
\n\
exports._defaultAttrs = function(attrs, binding){\n\
  // XXX: this can be optimized further.\n\
  var defaultAttrs = this.attrs.__default__;\n\
  attrs || (attrs = {});\n\
  for (var name in defaultAttrs) {\n\
    if (undefined === attrs[name])\n\
      attrs[name] = defaultAttrs[name].apply(binding);\n\
  }\n\
  return attrs;\n\
};//@ sourceURL=tower-resource/lib/static.js"
));
require.register("tower-resource/lib/proto.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var query = require('tower-query');\n\
var each = require('part-async-series');\n\
\n\
/**\n\
 * Save and invoke `fn(err)`.\n\
 *\n\
 * Events:\n\
 *\n\
 *  - `save` on updates and saves\n\
 *  - `saving` pre-update or save, after validation\n\
 *\n\
 * @constructor Resource\n\
 * @param {Function} fn Function invoked on resource creation.\n\
 * @api public\n\
 */\n\
\n\
exports.save = function(fn){\n\
  var self = this;\n\
  this.constructor.emit('saving', this);\n\
  this.emit('saving');\n\
  // XXX: needs to somehow set default properties\n\
  // XXX: this itself should probably be\n\
  //      bundled into a topology/stream/action.\n\
  this.validate(function(err){\n\
    if (err) {\n\
      fn(err);\n\
    } else {\n\
      query()\n\
        .select(self.constructor.className)\n\
        .create(self, function(){\n\
          self.dirty = {};\n\
          self.constructor.emit('save', self);\n\
          self.emit('save');\n\
          if (fn) fn(null, self);\n\
        });\n\
    }\n\
  });\n\
};\n\
\n\
/**\n\
 * Update and invoke `fn(err)`.\n\
 *\n\
 * @constructor Resource\n\
 * @param {Function} fn Function executed on resource update.\n\
 * @return {Mixed} fn return value.\n\
 * @api private\n\
 */\n\
\n\
exports.update = function(fn){\n\
  return query()\n\
    .select(this.constructor.className)\n\
    .action('update', this).exec(fn);\n\
};\n\
\n\
/**\n\
 * Remove the resource and mark it as `.removed`\n\
 * and invoke `fn(err)`.\n\
 *\n\
 * Events:\n\
 *\n\
 *  - `removing` before deletion\n\
 *  - `remove` on deletion\n\
 *\n\
 * @constructor Resource\n\
 * @param {Function} fn Function executed on resource removal.\n\
 * @return {Mixed} fn return value.\n\
 * @api public\n\
 */\n\
\n\
exports.remove = function(fn){\n\
  return query()\n\
    .select(this.constructor.className)\n\
    .where('id').eq(this.get('id'))\n\
    .action('remove').exec(fn);\n\
};\n\
\n\
/**\n\
 * Validate the resource and return a boolean.\n\
 *\n\
 * @constructor Resource\n\
 * @param {Function} fn Validation function.\n\
 * @return {Boolean} true if there were errors, else false.\n\
 * @api public\n\
 */\n\
\n\
exports.isValid = function(fn){\n\
  this.validate(fn);\n\
  return 0 === this.errors.length;\n\
};\n\
\n\
/**\n\
 * Perform validations.\n\
 *\n\
 * @constructor Resource\n\
 * @param {Function} fn Validation function.\n\
 * @return {Boolean} true if there were errors, else false.\n\
 * @api private\n\
 */\n\
\n\
exports.validate = function(fn){\n\
  var self = this;\n\
  this.errors = [];\n\
  this.emit('validating', this);\n\
  // XXX: need single `validateAttributes`\n\
  // XXX: need to store validators by key.\n\
  each(this.constructor.validators, this, function(){\n\
    // self.emit('after-validate', self);\n\
    // self.emit('validated', self);\n\
    self.emit('validate', self);\n\
\n\
    if (fn) {\n\
      if (self.errors.length)\n\
        fn(new Error('Validation Error'));\n\
      else\n\
        fn(); \n\
    }\n\
  });\n\
  return 0 === this.errors.length;\n\
};\n\
\n\
/**\n\
 * Set attribute value.\n\
 *\n\
 * @constructor Resource\n\
 * @chainable\n\
 * @param {String} name Attribute name.\n\
 * @param {Mixed} val Attribute value.\n\
 * @param {Boolean} quiet If true, won't dispatch change events.\n\
 * @return {Resource}\n\
 * @api public\n\
 */\n\
\n\
exports.set = function(name, val, quiet){\n\
  var attr = this.constructor.attrs[name];\n\
  if (!attr) return; // XXX: throw some error, or dynamic property flag?\n\
  if (undefined === val && attr.hasDefaultValue)\n\
    val = attr.apply(this);\n\
  val = attr.typecast(val);\n\
  var prev = this.attrs[name];\n\
  this.dirty[name] = val;\n\
  this.attrs[name] = val;\n\
\n\
  // XXX: this `quiet` functionality could probably be implemented\n\
  //   in a less ad-hoc way. It is currently only used when setting\n\
  //   properties passed in through `init`, such as from a db/adapter\n\
  //   serializing data into a resource, doesn't need to dispatch changes.\n\
  if (!quiet) {\n\
    this.constructor.emit('change ' + name, this, val, prev);\n\
    this.emit('change ' + name, val, prev); \n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Get `name` value.\n\
 *\n\
 * @constructor Resource\n\
 * @param {String} name Attribute name.\n\
 * @return {Mixed} Attribute value.\n\
 * @api public\n\
 */\n\
\n\
exports.get = function(name){\n\
  // XXX: need a better way to do this\n\
  if ('id' === name && this.__id__) return this.__id__;\n\
  if (undefined === this.attrs[name]) {\n\
    var attr = this.defaultAttr(name)\n\
    if (attr)\n\
      return this.attrs[name] = attr.apply(this);\n\
  } else {\n\
    return this.attrs[name];\n\
  }\n\
};\n\
\n\
/**\n\
 * Check if `attr` is present (not `null` or `undefined`).\n\
 *\n\
 * @constructor Resource\n\
 * @param {String} attr Attribute name.\n\
 * @return {Boolean} true if attribute exists, else false.\n\
 * @api public\n\
 */\n\
\n\
exports.has = function(attr){\n\
  return null != this.attrs[attr];\n\
};\n\
\n\
/**\n\
 * Return the JSON representation of the resource.\n\
 *\n\
 * @constructor Resource\n\
 * @return {Object} Resource attributes.\n\
 * @api public\n\
 */\n\
\n\
exports.toJSON = function(){\n\
  return this.attrs;\n\
};\n\
\n\
/**\n\
 * Returns `Attr` definition if it has a default value.\n\
 *\n\
 * @constructor Resource\n\
 * @param {String} name Attribute name.\n\
 * @return {Boolean|Function} Attr definition if it exists, else.\n\
 * @api private\n\
 */\n\
\n\
exports.defaultAttr = function(name){\n\
  var defaultAttrs = this.constructor.attrs.__default__;\n\
  return defaultAttrs.hasOwnProperty(name) && defaultAttrs[name];\n\
};//@ sourceURL=tower-resource/lib/proto.js"
));
require.register("tower-program/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require('tower-emitter');\n\
var stream = require('tower-stream').ns('program');\n\
var proto = require('./lib/proto');\n\
var statics = require('./lib/statics');\n\
\n\
/**\n\
 * Expose `program`.\n\
 */\n\
\n\
exports = module.exports = program;\n\
\n\
/**\n\
 * Expose `collection`.\n\
 */\n\
\n\
exports.collection = [];\n\
\n\
/**\n\
 * Get/set `Program`.\n\
 */\n\
\n\
function program(name) {\n\
  if (exports.collection[name])\n\
    return exports.collection[name];\n\
\n\
  function Program(name) {\n\
    this.inputs = initStreams(Program.inputs);\n\
    this.outputs = initStreams(Program.outputs);\n\
  }\n\
\n\
  // statics\n\
\n\
  for (var key in statics) Program[key] = statics[key];\n\
\n\
  Program.id = name;\n\
  Program.inputs = [];\n\
  Program.outputs = [];\n\
  Program.stream = stream.ns(name);\n\
\n\
  // prototype\n\
\n\
  Program.prototype = {};\n\
  Program.prototype.constructor = Program;\n\
  \n\
  for (var key in proto) Program.prototype[key] = proto[key];\n\
\n\
  exports.collection[name] = Program;\n\
  exports.collection.push(Program);\n\
\n\
  return Program;\n\
}\n\
\n\
function initStreams(streams) {\n\
  var result = [];\n\
  for (var name in streams) {\n\
    result.push(streams[name].create());\n\
  }\n\
  return result;\n\
}//@ sourceURL=tower-program/index.js"
));
require.register("tower-program/lib/proto.js", Function("exports, require, module",
"\n\
exports.input = function(name, fn){\n\
  if (undefined === fn) return this.inputs[name];\n\
  this.inputs[name] = fn;\n\
  this.inputs.push(fn);\n\
  return this;\n\
};\n\
\n\
exports.output = function(name, fn){\n\
  if (undefined === fn) return this.outputs[name];\n\
  this.outputs[name] = fn;\n\
  this.outputs.push(fn);\n\
  return this;\n\
};//@ sourceURL=tower-program/lib/proto.js"
));
require.register("tower-program/lib/statics.js", Function("exports, require, module",
"\n\
/**\n\
 * Instantiate a new `Program`.\n\
 *\n\
 * @param {Object} options\n\
 * @return {Program}\n\
 */\n\
\n\
exports.init = function(options){\n\
  return new this(options);\n\
};\n\
\n\
/**\n\
 * Define input by `name`.\n\
 *\n\
 * @param {String} name\n\
 * @param {Mixed} obj Function or stream constructor.\n\
 */\n\
\n\
exports.input = function(name, obj){\n\
  // XXX: 'function' === typeof obj ...\n\
  this.inputs[name] = obj = this.stream(name, obj);\n\
  // this.inputs.push(obj);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Define output by `name`.\n\
 *\n\
 * @param {String} name\n\
 * @param {Mixed} obj Function or stream constructor.\n\
 */\n\
\n\
exports.output = function(name, obj){\n\
  this.outputs[name] = obj = this.stream(name, obj);\n\
  //this.outputs.push(obj);\n\
  return this;\n\
};//@ sourceURL=tower-program/lib/statics.js"
));
require.register("part-each-array/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var nativeForEach = [].forEach;\n\
\n\
/**\n\
 * Expose `each`.\n\
 */\n\
\n\
module.exports = each;\n\
\n\
/**\n\
 * Array iterator.\n\
 */\n\
\n\
function each(arr, iterator, context) {\n\
  if (null == arr) return;\n\
  if (nativeForEach && arr.forEach === nativeForEach) {\n\
    arr.forEach(iterator, context);\n\
  } else {\n\
    for (var i = 0, n = arr.length; i < n; i++) {\n\
      if (false === iterator.call(context, arr[i], i, arr)) return;\n\
    }\n\
  }\n\
}\n\
//@ sourceURL=part-each-array/index.js"
));
require.register("tower-query/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var each = require('part-each-array');\n\
var isArray = require('part-is-array');\n\
var Constraint = require('./lib/constraint');\n\
var validate = require('./lib/validate');\n\
var validateConstraints = require('./lib/validate-constraints');\n\
var filter = require('./lib/filter');\n\
var subscriber = require('./lib/subscriber');\n\
\n\
/**\n\
 * Expose `query`.\n\
 */\n\
\n\
exports = module.exports = query;\n\
\n\
/**\n\
 * Expose `Query`.\n\
 */\n\
\n\
exports.Query = Query;\n\
\n\
/**\n\
 * Expose `Constraint`.\n\
 */\n\
\n\
exports.Constraint = Constraint;\n\
\n\
/**\n\
 * Wrap an array for chaining query criteria.\n\
 *\n\
 * @param {String} name A query name.\n\
 * @return {Query} A query.\n\
 * @api public\n\
 */\n\
\n\
function query(name) {\n\
  return null == name\n\
    ? new Query\n\
    : exports.collection[name]\n\
      ? exports.collection[name].clone()\n\
      : (exports.collection[name] = new Query(name));\n\
}\n\
\n\
/**\n\
 * Named queries.\n\
 */\n\
\n\
exports.collection = {};\n\
\n\
/**\n\
 * Queryable adapters.\n\
 */\n\
\n\
exports.adapters = [];\n\
\n\
/**\n\
 * Expose `filter`.\n\
 */\n\
\n\
exports.filter = filter;\n\
\n\
/**\n\
 * Validate query constraints.\n\
 */\n\
\n\
exports.validate = validateConstraints;\n\
\n\
/**\n\
 * Make an adapter queryable.\n\
 *\n\
 * XXX: The main reason for doing it this way\n\
 *      is to not create circular dependencies.\n\
 *\n\
 * @chainable\n\
 * @param {Adapter} adapter An adapter object.\n\
 * @return {Function} exports The main `query` function.\n\
 * @api public\n\
 */\n\
\n\
exports.use = function(adapter){\n\
  exports.adapters[adapter.name] = adapter;\n\
  exports.adapters.push(adapter);\n\
  return exports;\n\
};\n\
\n\
/**\n\
 * Class representing a query.\n\
 *\n\
 * @class\n\
 * @param {String} name A query instance's name.\n\
 * @api public\n\
 */\n\
\n\
function Query(name) {\n\
  this.name = name;\n\
  this.constraints = [];\n\
  this.resources = [];\n\
  this.sorting = [];\n\
  this.paging = {};\n\
  // XXX: accomplish both joins and graph traversals.\n\
  this.relations = [];\n\
  // this.starts = []\n\
  // this.groupings = {}\n\
}\n\
\n\
/**\n\
 * Explicitly tell the query what adapters to use.\n\
 *\n\
 * If not specified, it will do its best to find\n\
 * the adapter. If one or more are specified, the\n\
 * first specified will be the default, and its namespace\n\
 * can be left out of the resources used in the query\n\
 * (e.g. `user` vs. `facebook.user` if `query().use('facebook').select('user')`).\n\
 *\n\
 * @chainable\n\
 * @param {Mixed} name Name of the adapter, or the adapter object itself.\n\
 *   In `package.json`, maybe this is under a `\"key\": \"memory\"` property.\n\
 * @return {Query}\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.use = function(name){\n\
  (this.adapters || (this.adapters = []))\n\
    .push('string' === typeof name ? exports.adapters[name] : name);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * The starting table or record for the query.\n\
 *\n\
 * @chainable\n\
 * @param {String} key The starting table or record name.\n\
 * @param {Object} val\n\
 * @return {Query}\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.start = function(key, val){\n\
  this._start = key;\n\
  (this.starts || (this.starts = [])).push(queryModel(key));\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Add a query pattern to be returned.\n\
 * XXX: http://docs.neo4j.org/chunked/stable/query-return.html\n\
 *\n\
 * @param {String} key A query pattern that you want to be returned.\n\
 * @return {Query}\n\
 */\n\
\n\
Query.prototype.returns = function(key){\n\
  this.resources.push(queryAttr(key, this._start));\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Start a SELECT query.\n\
 *\n\
 * @chainable\n\
 * @param {String} key A record or table name.\n\
 * @return {Query}\n\
 * @api public\n\
 */\n\
Query.prototype.resource = function(key){\n\
  this._start = this._start || key;\n\
  this.resources.push(queryModel(key, this._start));\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Add a WHERE clause.\n\
 *\n\
 * @param {String} key A record or table property/column name.\n\
 * @return {Query}\n\
 * @api public\n\
 */\n\
Query.prototype.where = function(key){\n\
  this.context = key;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * In a graph database, the data pointing _to_ this node.\n\
 * In a relational/document database, the records with\n\
 * a foreign key pointing to this record or set of records.\n\
 *\n\
 * Example:\n\
 *\n\
 *    query().start('users')\n\
 *      .incoming('friends')\n\
 *      .incoming('friends');\n\
 *\n\
 * @chainable\n\
 * @param {String} key Name of the data coming to the start node.\n\
 * @return {Query}\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.incoming = function(key){\n\
  return this.relation('incoming', key);\n\
};\n\
\n\
/**\n\
 * In a graph database, the data pointing _from_ this node.\n\
 * In a relational/document database, the record this\n\
 * record points to via its foreign key.\n\
 *\n\
 * Example:\n\
 *\n\
 *    query().start('users')\n\
 *      .outgoing('friends')\n\
 *      .outgoing('friends');\n\
 *\n\
 * @chainable\n\
 * @param {String} key Name of the data going out from the start node.\n\
 * @return {Query}\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.outgoing = function(key){\n\
  return this.relation('outgoing', key);\n\
};\n\
\n\
/**\n\
 * What the variable should be called for the data returned.\n\
 * References the previous item in the query.\n\
 *\n\
 * Example:\n\
 *\n\
 *    query().start('users').as('people');\n\
 *\n\
 * @param {String} key The data's new variable name.\n\
 * @return {Query}\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.as = function(key){\n\
  // XXX: todo\n\
  this.resources[this.resources.length - 1].alias = key;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Append constraint to query.\n\
 *\n\
 * Example:\n\
 *\n\
 *    query().start('users').where('likeCount').lte(200);\n\
 *\n\
 * @param {String} key The property to compare `val` to.\n\
 * @param {Number|Date} val The number or date value.\n\
 * @api public\n\
 */\n\
\n\
each(['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'nin', 'match'], function(operator){\n\
  Query.prototype[operator] = function(val){\n\
    return this.constraint(this.context, operator, val);\n\
  }\n\
});\n\
\n\
/**\n\
 * Check if the value exists within a set of values.\n\
 *\n\
 * @chainable\n\
 * @param {Object} val The constraint value.\n\
 * @return {Query}\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.contains = function(val){\n\
  return this.constraint(this.context, 'in', val);\n\
};\n\
\n\
/**\n\
 * Append action to query, then execute.\n\
 *\n\
 * Example:\n\
 *\n\
 *    query().start('users')\n\
 *      .insert({ email: 'john.smith@gmail.com' });\n\
 *\n\
 *    query().start('users').query(fn);\n\
 *\n\
 * @api public\n\
 */\n\
\n\
each([\n\
    'select'\n\
  , 'pipe'\n\
  , 'stream'\n\
  , 'count'\n\
  , 'exists'\n\
], function(action){\n\
  Query.prototype[action] = function(fn){\n\
    return this.action(action).exec(fn);\n\
  }\n\
});\n\
\n\
/**\n\
 * Create one or more records.\n\
 *\n\
 * This is different from the other actions \n\
 * in that it can take data (records) as arguments.\n\
 *\n\
 * Example:\n\
 *\n\
 *    query()\n\
 *      .use('memory')\n\
 *      .select('post')\n\
 *      .create({ title: 'Foo' }, function(err, post){\n\
 *\n\
 *      });\n\
 *\n\
 * @param {Object} data Data record.\n\
 * @param {Function} fn Function to be executed on record creation.\n\
 * @return {Mixed} Whatever `fn` returns on the `create` action.\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.create = function(data, fn){\n\
  return this.action('create', data).exec(fn);\n\
};\n\
\n\
/**\n\
 * Update one or more records.\n\
 *\n\
 * This is different from the other actions\n\
 * in that it can take data (records) as arguments.\n\
 *\n\
 * Example:\n\
 *\n\
 *    query()\n\
 *      .use('memory')\n\
 *      .select('post')\n\
 *      .update({ title: 'Foo' }, function(err, post){\n\
 *\n\
 *      });\n\
 *\n\
 * @param {Object} data Data record.\n\
 * @param {Function} fn Function to be executed on record update.\n\
 * @return {Mixed} Whatever `fn` returns on the `update` action.\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.update = function(data, fn){\n\
  return this.action('update', data).exec(fn);\n\
};\n\
\n\
Query.prototype.remove = function(data, fn){\n\
  return 2 === arguments.length\n\
    ? this.action('remove', data).exec(fn)\n\
    : this.action('remove').exec(data);\n\
};\n\
\n\
/**\n\
 * Return the first record that matches the query pattern.\n\
 *\n\
 * @param {Function} fn Function to execute on records after `find` action finishes.\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.first = function(fn){\n\
  this.limit(1).action('find').exec(function(err, records){\n\
    if (err) return fn(err);\n\
    fn(err, records[0]);\n\
  });\n\
};\n\
\n\
/**\n\
 * Return the last record that matches the query pattern.\n\
 *\n\
 * @param {Function} fn Function to execute on records after `find` action finishes.\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.last = function(fn){\n\
  this.limit(1).action('find').exec(function(err, records){\n\
    if (err) return fn(err);\n\
    fn(err, records[0]);\n\
  });\n\
};\n\
\n\
/**\n\
 * Add a record query LIMIT.\n\
 *\n\
 * @chainable\n\
 * @param {Integer} val The record limit.\n\
 * @return {Query}\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.limit = function(val){\n\
  this.paging.limit = val;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Specify the page number.\n\
 *\n\
 * Use in combination with `limit` for calculating `offset`.\n\
 *\n\
 * @chainable\n\
 * @param {Integer} val The page number.\n\
 * @return {Query}\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.page = function(val){\n\
  this.paging.page = val;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Specify the offset.\n\
 *\n\
 * @chainable\n\
 * @param {Integer} val The offset value.\n\
 * @return {Query}\n\
 * @api public\n\
 */\n\
Query.prototype.offset = function(val){\n\
  this.paging.offset = val;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Sort ascending by `key`.\n\
 *\n\
 * If the key is a property name, it will\n\
 * be combined with the table/collection name\n\
 * defined somewhere earlier in the query.\n\
 *\n\
 * Example:\n\
 *\n\
 *    query().start('users').asc('createdAt');\n\
 *\n\
 * @chainable\n\
 * @param {String} key A property name.\n\
 * @return {Query}\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.asc = function(key){\n\
  return this.sort(key, 1);\n\
};\n\
\n\
/**\n\
 * Sort descending by `key`.\n\
 *\n\
 * If the key is a property name, it will\n\
 * be combined with the table/collection name\n\
 * defined somewhere earlier in the query.\n\
 *\n\
 * Example:\n\
 *\n\
 *    query().start('users').desc('createdAt');\n\
 *\n\
 * @chainable\n\
 * @param {String} key A property name.\n\
 * @return {Query}\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.desc = function(key){\n\
  return this.sort(key, -1);\n\
};\n\
\n\
/**\n\
 * Pushes a `\"relation\"` onto the query.\n\
 *\n\
 * @chainable\n\
 * @param {String} dir The direction.\n\
 * @param {String} key The key.\n\
 * @return {Query}\n\
 * @api private\n\
 */\n\
\n\
Query.prototype.relation = function(dir, key){\n\
  var attr = queryAttr(key, this._start);\n\
  attr.direction = dir;\n\
  this.relations.push(attr);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Pushes a `\"constraint\"` onto the query.\n\
 *\n\
 * @chainable\n\
 * @param {String} key The constraint key.\n\
 * @param {String} op Operator string\n\
 * @param {Object} val The constraint value.\n\
 * @return {Query}\n\
 * @api public\n\
 *\n\
 * @see http://en.wikipedia.org/wiki/Lagrange_multiplier\n\
 */\n\
\n\
Query.prototype.constraint = function(key, op, val){\n\
  this.constraints.push(new Constraint(key, op, val, this._start));\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Pushes an `\"action\"` onto the query.\n\
 *\n\
 * Example:\n\
 *\n\
 *    query().action('insert', { message: 'Test' });\n\
 *    query().action('insert', [ { message: 'one.' }, { message: 'two.' } ]);\n\
 *\n\
 * @chainable\n\
 * @param {String} type The action type.\n\
 * @param {Object|Array} data The data to act on.\n\
 * @return {Query}\n\
 * @api private\n\
 */\n\
\n\
Query.prototype.action = function(type, data){\n\
  this.type = type\n\
  this.data = data ? isArray(data) ? data : [data] : undefined;\n\
  return this;\n\
};\n\
\n\
// XXX: only do if it decreases final file size\n\
// each(['find', 'create', 'update', 'delete'])\n\
\n\
/**\n\
 * Pushes a sort direction onto the query.\n\
 *\n\
 * @chainable\n\
 * @param {String} key The property to sort on.\n\
 * @param {Integer} dir Direction it should point (-1, 1, 0).\n\
 * @return {Query}\n\
 * @api private\n\
 */\n\
\n\
Query.prototype.sort = function(key, dir){\n\
  var attr = queryAttr(key, this._start);\n\
  attr.direction = key;\n\
  this.sorting.push(attr);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * A way to log the query criteria,\n\
 * so you can see if the adapter supports it.\n\
 *\n\
 * @chainable\n\
 * @param {Function} fn The query criteria logging function\n\
 * @return {Query}\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.explain = function(fn){\n\
  this._explain = fn;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Clone the current `Query` object.\n\
 *\n\
 * @return {Query} A cloned `Query` object.\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.clone = function(){\n\
  return new Query(this.name);\n\
};\n\
\n\
/**\n\
 * Execute the query.\n\
 * XXX: For now, only one query per adapter.\n\
 *      Later, you can query across multiple adapters\n\
 *\n\
 * @see http://en.wikipedia.org/wiki/Query_optimizer\n\
 * @see http://en.wikipedia.org/wiki/Query_plan\n\
 * @see http://homepages.inf.ed.ac.uk/libkin/teach/dbs12/set5.pdf\n\
 * @param {Function} fn Function that gets called on adapter execution.\n\
 * @return {Mixed} Whatever `fn` returns on execution.\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.exec = function(fn){\n\
  this.context = this._start = undefined;\n\
  var adapter = this.adapters && this.adapters[0] || exports.adapters[0];\n\
  this.validate(function(){});\n\
  if (this.errors && this.errors.length) return fn(this.errors);\n\
  if (!this.resources[0]) throw new Error('Must `.select(resourceName)`');\n\
  return adapter.exec(this, fn);\n\
};\n\
\n\
/**\n\
 * Validate the query on all adapters.\n\
 *\n\
 * @param {Function} fn Function called on query validation.\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.validate = function(fn){\n\
  var adapter = this.adapters && this.adapters[0] || exports.adapters[0];\n\
  validate(this, adapter, fn);\n\
};\n\
\n\
/**\n\
 * Subscribe to a type of query.\n\
 *\n\
 * @param {Function} fn Function executed on each subscriber output.\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.subscribe = function(fn){\n\
  var self = this;\n\
  subscriber.output(this.type, function(record){\n\
    if (self.test(record)) fn(record);\n\
  });\n\
};\n\
\n\
/**\n\
 * Define another query on the parent scope.\n\
 *\n\
 * XXX: wire this up with the resource (for todomvc).\n\
 *\n\
 * @param {String} name A query name.\n\
 * @return {Query} A `Query` object.\n\
 * @api public\n\
 */\n\
\n\
Query.prototype.query = function(name) {\n\
  return query(name);\n\
};\n\
\n\
function queryModel(key) {\n\
  key = key.split('.');\n\
\n\
  if (2 === key.length)\n\
    return { adapter: key[0], resource: key[1], ns: key[0] + '.' + key[1] };\n\
  else\n\
    return { resource: key[0], ns: key[0] }; // XXX: adapter: adapter.default()\n\
}\n\
\n\
/**\n\
 * Variables used in query.\n\
 */\n\
\n\
function queryAttr(val, start){\n\
  var variable = {};\n\
\n\
  val = val.split('.');\n\
\n\
  switch (val.length) {\n\
    case 3:\n\
      variable.adapter = val[0];\n\
      variable.resource = val[1];\n\
      variable.attr = val[2];\n\
      variable.ns = variable.adapter + '.' + variable.resource;\n\
      break;\n\
    case 2:\n\
      variable.adapter = 'memory'; // XXX: adapter.default();\n\
      variable.resource = val[0];\n\
      variable.attr = val[1];\n\
      variable.ns = variable.resource;\n\
      break;\n\
    case 1:\n\
      variable.adapter = 'memory'; // XXX: adapter.default();\n\
      variable.resource = start;\n\
      variable.attr = val[0];\n\
      variable.ns = variable.resource;\n\
      break;\n\
  }\n\
\n\
  variable.path = variable.ns + '.' + variable.attr;\n\
\n\
  return variable;\n\
}\n\
\n\
function queryValue(val) {\n\
  // XXX: eventually handle relations/joins.\n\
  return { value: val, type: typeof(val) };\n\
}//@ sourceURL=tower-query/index.js"
));
require.register("tower-query/lib/constraint.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `Constraint`.\n\
 */\n\
\n\
module.exports = Constraint;\n\
\n\
/**\n\
 * Class representing a query constraint.\n\
 *\n\
 * @class\n\
 *\n\
 * @param {String} a The left constraint.\n\
 * @param {String} operator The constraint.\n\
 * @param {String} b The right constraint.\n\
 * @param {Object} start The starting object.\n\
 * @api public\n\
 */\n\
\n\
function Constraint(a, operator, b, start) {\n\
  this.left = left(a, start);\n\
  this.operator = operator;\n\
  this.right = right(b);\n\
}\n\
\n\
function left(val, start) {\n\
  var variable = {};\n\
\n\
  val = val.split('.');\n\
\n\
  switch (val.length) {\n\
    case 3:\n\
      variable.adapter = val[0];\n\
      variable.resource = val[1];\n\
      variable.attr = val[2];\n\
      variable.ns = variable.adapter + '.' + variable.resource;\n\
      break;\n\
    case 2:\n\
      variable.adapter = 'memory'; // XXX: adapter.default();\n\
      variable.resource = val[0];\n\
      variable.attr = val[1];\n\
      variable.ns = variable.resource;\n\
      break;\n\
    case 1:\n\
      variable.adapter = 'memory'; // XXX: adapter.default();\n\
      variable.resource = start;\n\
      variable.attr = val[0];\n\
      variable.ns = variable.resource;\n\
      break;\n\
  }\n\
  \n\
  variable.path = variable.ns + '.' + variable.attr;\n\
\n\
  return variable;\n\
}\n\
\n\
function right(val) {\n\
  // XXX: eventually handle relations/joins.\n\
  return { value: val, type: typeof(val) };\n\
}//@ sourceURL=tower-query/lib/constraint.js"
));
require.register("tower-query/lib/validate.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `validate`.\n\
 */\n\
\n\
module.exports = validate;\n\
\n\
/**\n\
 * Add validations to perform before this is executed.\n\
 *\n\
 * XXX: not implemented.\n\
 *\n\
 * @param {Query} query A query object.\n\
 * @param {Adapter} adapter An adapter object.\n\
 * @param {Function} fn Function executed at the end of validation.\n\
 */\n\
\n\
function validate(query, adapter, fn) {\n\
  // XXX: only supports one action at a time atm.\n\
  var constraints = query.constraints;\n\
  var type = query.type;\n\
  query.errors = [];\n\
  // XXX: collect validators for resource and for each attribute.\n\
  // var resourceValidators = resource(criteria[0][1].ns).validators;\n\
  for (var i = 0, n = constraints.length; i < n; i++) {\n\
    var constraint = constraints[i];\n\
\n\
    if (!adapter.action.exists(constraint.left.resource + '.' + type))\n\
      continue;\n\
\n\
    var stream = adapter.action(constraint.left.resource + '.' + type);\n\
    var param = stream.params && stream.params[constraint.left.attr];\n\
    if (param && param.validate(query, constraint)) {\n\
      // $ tower list ec2:group --name 'hello-again-again,hello-again'\n\
      constraint.right.value = param.typecast(constraint.right.value);\n\
    }\n\
  }\n\
\n\
  query.errors.length ? fn(query.errors) : fn();\n\
}//@ sourceURL=tower-query/lib/validate.js"
));
require.register("tower-query/lib/validate-constraints.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var validator = require('tower-validator');\n\
\n\
/**\n\
 * Expose `validate`.\n\
 */\n\
\n\
module.exports = validate;\n\
\n\
/**\n\
 * Validate an object against an array of constraints.\n\
 *\n\
 * To define validations, use the `tower-validator` module.\n\
 * XXX: that isn't implemented yet, they're in here.\n\
 *\n\
 * @param {Object} obj Record or other simple JavaScript object.\n\
 * @param {Array} constraints Array of constraints.\n\
 * @return {Boolean} true if obj passes all constraints, otherwise false.\n\
 */\n\
\n\
function validate(obj, constraints) {\n\
  for (var i = 0, n = constraints.length; i < n; i++) {\n\
    // XXX: obj vs. obj.get\n\
    var constraint = constraints[i]\n\
      , left = obj.get ? obj.get(constraint.left.attr) : obj[constraint.left.attr]\n\
      , right = constraint.right.value;\n\
\n\
    if (!validator(constraint.operator)(left, right))\n\
      return false;\n\
  }\n\
\n\
  return true;\n\
}//@ sourceURL=tower-query/lib/validate-constraints.js"
));
require.register("tower-query/lib/filter.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var validateConstraints = require('./validate-constraints');\n\
\n\
/**\n\
 * Expose `filter`.\n\
 */\n\
\n\
module.exports = filter;\n\
\n\
/**\n\
 * Filter records based on a set of constraints.\n\
 *\n\
 * This is a robust solution, hooking into an\n\
 * extendable validation system. If you just need\n\
 * something simple, use the built-in `array.filter`.\n\
 *\n\
 * @param {Array} array Array of plain objects (such as records).\n\
 * @param {Array} constraints Array of constraints.\n\
 * @return {Array} The filtered records.\n\
 */\n\
\n\
function filter(array, constraints) {\n\
  if (!constraints.length) return array;\n\
\n\
  var result = [];\n\
\n\
  // XXX: is there a more optimal algorithm?\n\
  for (var i = 0, n = array.length; i < n; i++) {\n\
    if (validateConstraints(array[i], constraints))\n\
      result.push(array[i]);\n\
  }\n\
\n\
  return result;\n\
}//@ sourceURL=tower-query/lib/filter.js"
));
require.register("tower-query/lib/subscriber.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var program = require('tower-program');\n\
\n\
/**\n\
 * Expose `query-subscriber` program.\n\
 */\n\
\n\
module.exports = subscriber();\n\
\n\
/**\n\
 * Define a query subscribing program.\n\
 *\n\
 * @return {Program} A query subscriber program.\n\
 */\n\
\n\
function subscriber() {\n\
  program('query-subscriber')\n\
    .input('create')\n\
    .input('update')\n\
    .input('remove');\n\
\n\
  return program('query-subscriber').init();\n\
}//@ sourceURL=tower-query/lib/subscriber.js"
));
require.register("tower-adapter/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require('tower-emitter');\n\
var stream = require('tower-stream');\n\
var resource = require('tower-resource');\n\
var query = require('tower-query');\n\
var type = require('tower-type');\n\
var load = require('tower-load');\n\
\n\
/**\n\
 * Expose `adapter`.\n\
 */\n\
\n\
exports = module.exports = adapter;\n\
\n\
/**\n\
 * Expose `collection`.\n\
 */\n\
\n\
exports.collection = [];\n\
\n\
/**\n\
 * Expose `Adapter` constructor.\n\
 */\n\
\n\
exports.Adapter = Adapter;\n\
\n\
/**\n\
 * Lazily get an adapter instance by `name`.\n\
 *\n\
 * @param {String} name An adapter name.\n\
 * @return {Adapter} An adapter.\n\
 * @api public\n\
 */\n\
\n\
function adapter(name) {\n\
  if (exports.collection[name]) return exports.collection[name];\n\
  if (exports.load(name)) return exports.collection[name];\n\
\n\
  var obj = new Adapter(name);\n\
  exports.collection[name] = obj;\n\
  // exports.collection.push(obj);\n\
  // XXX: if has any event listeners...\n\
  exports.emit('define', obj);\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Mixin `Emitter`.\n\
 */\n\
\n\
Emitter(exports);\n\
\n\
/**\n\
 * Lazy-load adapters.\n\
 *\n\
 * @param {String} name An adapter name.\n\
 * @return {Adapter} An adapter.\n\
 * @api public\n\
 */\n\
\n\
exports.load = function(name, path){\n\
  return 1 === arguments.length\n\
    ? load(exports, name)\n\
    : load.apply(load, [exports].concat(Array.prototype.slice.call(arguments)));\n\
};\n\
\n\
/**\n\
 * Check if adapter `name` exists.\n\
 *\n\
 * @param {String} name An adapter name.\n\
 * @return {Boolean} true if adapter exists, otherwise false.\n\
 * @api public\n\
 */\n\
\n\
exports.exists = function(name){\n\
  return !!exports.collection[name];\n\
};\n\
\n\
// XXX: remove `exists` in favor of `has`.\n\
exports.has = exports.exists;\n\
\n\
/**\n\
 * Class representing an abstraction over remote services and databases.\n\
 *\n\
 * @class\n\
 *\n\
 * @param {String} name An adapter name.\n\
 * @api public\n\
 */\n\
\n\
function Adapter(name) {\n\
  this.name = name;\n\
  this.context = this;\n\
  this.types = {};\n\
  this.settings = {};\n\
  // XXX\n\
  this.resources = {};\n\
  this.connections = {};\n\
  //this.resource = this.resource.bind(this);\n\
  // XXX: refactor, should handle namespacing.\n\
  this.resource = resource.ns(name);\n\
  this.action = stream.ns(name);\n\
  // XXX: todo\n\
  // this.type = type.ns(name);\n\
\n\
  // make queryable.\n\
  // XXX: add to `clear` for both (or something like).\n\
  query.use(this);\n\
}\n\
\n\
/**\n\
 * Start a query against this adapter.\n\
 *\n\
 * @return {Mixed} Whatever the implementation of the use function attribute returns.\n\
 * @api public\n\
 */\n\
\n\
Adapter.prototype.query = function(){\n\
  return query().use(this);\n\
};\n\
\n\
/**\n\
 * Use database/connection (config).\n\
 *\n\
 * @param {String} name An adapter name.\n\
 * @api public\n\
 */\n\
\n\
Adapter.prototype.use = function(name){\n\
  throw new Error('Adapter#use not implemented');\n\
};\n\
\n\
/**\n\
 * Define connection settings.\n\
 *\n\
 * @param {String} name An adapter name.\n\
 * @param {Object} options Adapter options.\n\
 * @api public\n\
 */\n\
\n\
Adapter.prototype.connection = function(name, options){\n\
  if (1 === arguments.length && 'string' == typeof name) {\n\
    setting = this.context = settings[name]\n\
    return this;\n\
  }\n\
\n\
  if ('object' === typeof name) options = name;\n\
  options || (options = {});\n\
  options.name || (options.name = name);\n\
  setting = this.context = settings[options.name] = options;\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Datatype serialization.\n\
 *\n\
 * @chainable\n\
 * @param {String} name An adapter name.\n\
 * @return {Adapter}\n\
 * @api public\n\
 */\n\
\n\
Adapter.prototype.type = function(name){\n\
  this.context =\n\
    this.types[name] || (this.types[name] = type(this.name + '.' + name));\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Delegate to `type`.\n\
 *\n\
 * XXX: This may just actually become the `type` object itself.\n\
 *\n\
 * @chainable\n\
 * @param {String} name An adapter name.\n\
 * @return {Adapter}\n\
 * @api public\n\
 */\n\
\n\
Adapter.prototype.serializer = function(name){\n\
  // `this.types[x] === this.context`\n\
  this.context.serializer(name);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Set a `to` relationship.\n\
 *\n\
 * @chainable\n\
 * @param {Function} fn Function executed on `to` query.\n\
 * @return {Adapter}\n\
 * @api public\n\
 */\n\
\n\
Adapter.prototype.to = function(fn){\n\
  this.context.to(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Set a `from` relationship.\n\
 *\n\
 * @chainable\n\
 * @param {Function} fn Function executed on `from` query.\n\
 * @return {Adapter}\n\
 * @api public\n\
 */\n\
\n\
Adapter.prototype.from = function(fn){\n\
  this.context.from(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Main Adapter function the query object executes which you need to implement on your own adapter.\n\
 *\n\
 * @chainable\n\
 * @param {Query} query A query object.\n\
 * @param {Function} fn Adapter implementation function.\n\
 * @return {Adapter}\n\
 * @api public\n\
 */\n\
\n\
Adapter.prototype.exec = function(query, fn){\n\
  throw new Error('Adapter#exec not implemented.');\n\
};\n\
\n\
/**\n\
 * Reset the context to `this`.\n\
 *\n\
 * @chainable\n\
 * @return {Adapter}\n\
 * @api public\n\
 */\n\
\n\
Adapter.prototype.self = function(){\n\
  return this.context = this;\n\
};\n\
\n\
var methods = [ 'connect', 'disconnect', 'query', 'use', 'type', 'to', 'from' ];\n\
\n\
Adapter.prototype.api = function(){\n\
  if (this._api) return this._api;\n\
\n\
  var self = this;\n\
\n\
  function fn(name) {\n\
    return name\n\
      ? self.query().select(name)\n\
      : self;\n\
  }\n\
\n\
  var i = methods.length;\n\
  while (i--)\n\
    api(fn, methods[i], this);\n\
\n\
  return this._api = fn;\n\
};\n\
\n\
function api(fn, method, adapter) {\n\
  fn[method] = function(){\n\
    return adapter[method].apply(adapter, arguments);\n\
  }\n\
}//@ sourceURL=tower-adapter/index.js"
));

require.register("tower-expression/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var slice = [].slice;\n\
var toString = Object.prototype.toString;\n\
var isFunction = function(val) {\n\
  return '[object Function]' === toString.call(val);\n\
};\n\
var isRegExp = function(val) {\n\
  return '[object RegExp]' === toString.call(val);\n\
};\n\
\n\
/**\n\
 * Expose `expression`.\n\
 */\n\
\n\
exports = module.exports = expression;\n\
\n\
/**\n\
 * Expose `collection`.\n\
 */\n\
\n\
exports.collection = {};\n\
\n\
/**\n\
 * Get or define an expression.\n\
 *\n\
 * @param {String} name\n\
 * @return {Expression}\n\
 * @api public\n\
 */\n\
\n\
function expression(name) {\n\
  return exports.has(name)\n\
    ? exports.collection[name]\n\
    : exports.collection[name] = new Expression(name);\n\
}\n\
\n\
/**\n\
 * Check if expression exists.\n\
 *\n\
 * @param {String} name\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
exports.has = function(name) {\n\
  return exports.collection.hasOwnProperty(name);\n\
};\n\
\n\
/**\n\
 * Instantiate a new `Expression`.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
function Expression(name) {\n\
  this.name = name;\n\
  this.matchers = [];\n\
}\n\
\n\
/**\n\
 * Patterns to match against.\n\
 *\n\
 * @chainable\n\
 * @api public\n\
 */\n\
\n\
Expression.prototype.match = function(){\n\
  var args = slice.call(arguments);\n\
  \n\
  // function to return match result\n\
  var fn = isFunction(args[args.length - 1])\n\
    ? args.pop()\n\
    : identityFn;\n\
\n\
  args = normalize(args);\n\
\n\
  // final function\n\
\n\
  function exec(str, data) {\n\
    var result = [];\n\
    // going to set back to initial pos if it doesn't match.\n\
    var pos = data.pos;\n\
    for (var i = 0, n = args.length; i < n; i++) {\n\
      var val = args[i](str, data);\n\
      if (null == val) {\n\
        // set it back to original since it failed.\n\
        data.pos = pos;\n\
        return;\n\
      }\n\
      result.push(val);\n\
    }\n\
    return fn.apply(this, result);\n\
  }\n\
\n\
  this.matchers.push(exec);\n\
  \n\
  return this;\n\
};\n\
\n\
/**\n\
 * Parse input string into object\n\
 * using all of the expression's matchers.\n\
 *\n\
 * @param {String} str Input string.\n\
 * @param {Function} [fn] Callback function.\n\
 * @api public\n\
 */\n\
\n\
Expression.prototype.parse = function(str, fn){\n\
  var data = { pos: 0, failures: 0 };\n\
  var result = this._parse(str, data);\n\
  if (data.pos < str.length) {\n\
    var val = str.length > 20 ? str.substr(data.pos, 20) + '...' : str;\n\
    var msg = 'Expected end of input but \"' + val + '\" found';\n\
    var err = new SyntaxError(msg);\n\
    if (fn) return fn(err);\n\
    throw err;\n\
  }\n\
  return result;\n\
};\n\
\n\
/**\n\
 * Internal parse.\n\
 *\n\
 * @param {String} str Input string.\n\
 * @param {Object} [data] Parent (starting) expression data.\n\
 * @api private\n\
 */\n\
\n\
Expression.prototype._parse = function(str, data){\n\
  var matchers = this.matchers;\n\
  var result;\n\
\n\
  for (var i = 0, n = matchers.length; i < n; i++) {\n\
    result = matchers[i](str, data);\n\
    // blank string '' also counts\n\
    if (result != null) return result;\n\
  }\n\
};\n\
\n\
/**\n\
 * Function returning its parameter.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {Mixed} val\n\
 * @api private\n\
 */\n\
\n\
function identityFn(val) {\n\
  // return slice.call(arguments);\n\
  return val;\n\
}\n\
\n\
/**\n\
 * Return's a function to match exact\n\
 * string against input string starting at \n\
 * parser's current position.\n\
 *\n\
 * @param {String} val\n\
 * @return {Function} exec\n\
 * @api private\n\
 */\n\
\n\
function stringFn(val) {\n\
  var len = val.length;\n\
\n\
  function exec(str, data) {\n\
    if (val === str.substr(data.pos, len)) {\n\
      data.pos += len;\n\
      return val;\n\
    }\n\
  }\n\
\n\
  return exec;\n\
}\n\
\n\
/**\n\
 * RegExp function.\n\
 *\n\
 * @param {String} val\n\
 * @return {Function} exec\n\
 * @api private\n\
 */\n\
\n\
function regExpFn(val) {\n\
  var val = val.source;\n\
  var oneOrMore = '+' === val.substr(val.length - 1);\n\
  var zeroOrMore = '*' === val.substr(val.length - 1);\n\
  var many = oneOrMore || zeroOrMore;\n\
  //var optional = '?' === val.substr(val.length - 1);\n\
  if (many) val = val.substr(0, val.length - 1);\n\
  var pattern = new RegExp(val);\n\
\n\
  if (many) {\n\
    var exec = function exec(str, data) {\n\
      var result = [];\n\
      while (pattern.test(str.charAt(data.pos))) {\n\
        result.push(str.charAt(data.pos));\n\
        data.pos++;\n\
      }\n\
\n\
      return result.length\n\
        ? result.join('')\n\
        : (zeroOrMore ? '' : undefined);\n\
    }\n\
  } else {\n\
    var exec = function exec(str, data) {\n\
      if (pattern.test(str.charAt(data.pos))) {\n\
        data.pos++;\n\
        return str.charAt(data.pos - 1);\n\
      }\n\
    }\n\
  }\n\
\n\
  return exec;\n\
}\n\
\n\
/**\n\
 * Return's a function to execute a named expression\n\
 * on the input string.\n\
 *\n\
 * @param {String} val Name of expression\n\
 * @return {Function} exec\n\
 * @api private\n\
 */\n\
\n\
function namedFn(val) {\n\
  var name = val.split(':')[1];\n\
  var oneOrMore = '+' === name.substr(name.length - 1);\n\
  var zeroOrMore = '*' === name.substr(name.length - 1);\n\
  var many = oneOrMore || zeroOrMore;\n\
  var optional = '?' === name.substr(name.length - 1);\n\
  if (many || optional)\n\
    name = name.substr(0, name.length - 1);\n\
  \n\
  if (many) {\n\
    return function exec(str, data) {\n\
      var results = [];\n\
      var result = expression(name)._parse(str, data);\n\
      \n\
      while (result != null) {\n\
        results.push(result);\n\
        result = expression(name)._parse(str, data);\n\
      }\n\
\n\
      return results;\n\
      // XXX: 1 or more, but length is zero case.\n\
    }\n\
  } else {\n\
    return function exec(str, data) {\n\
      var result = expression(name)._parse(str, data);\n\
      return result;\n\
      //return result\n\
      //  ? result\n\
      //  : (optional ? '' : result);\n\
    }\n\
  }\n\
}\n\
\n\
/**\n\
 * Convert `.match` arguments into a standard format.\n\
 *\n\
 * @param {Array} args\n\
 * @api private\n\
 */\n\
\n\
function normalize(args) {\n\
  for (var i = 0, n = args.length; i < n; i++) {\n\
    var val = args[i];\n\
    \n\
    // XXX: here we go through all the parsing expression types:\n\
    // https://github.com/dmajda/pegjs#parsing-expression-types\n\
\n\
    if (val.source) {\n\
      // val instanceof RegExp\n\
      val = regExpFn(val);\n\
    } else if (/^:\\w/.test(val)) {\n\
      // :named-expression\n\
      val = namedFn(val);\n\
    } else {\n\
      // exact match\n\
      val = stringFn(val);\n\
    }\n\
\n\
    // set it to the compiled val\n\
    args[i] = val;\n\
  }\n\
\n\
  return args;\n\
}//@ sourceURL=tower-expression/index.js"
));
require.register("tower-js-expressions/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var expression = require('tower-expression');\n\
var isArray = require('part-is-array');\n\
\n\
/**\n\
 * Expose `expression`.\n\
 *\n\
 * list\n\
 * assignment\n\
 * conditional\n\
 * unary\n\
 * postfix\n\
 * binary\n\
 * binding\n\
 * undefined\n\
 * null\n\
 * boolean\n\
 * regexp\n\
 * number\n\
 * string\n\
 * float\n\
 * integer\n\
 * interpolation\n\
 * property-assignment\n\
 * attr\n\
 * bracket-accessor\n\
 * dot-accessor\n\
 * function\n\
 */\n\
\n\
module.exports = expression;\n\
\n\
/**\n\
 * Code expressions.\n\
 *\n\
 * The go from most-to-least complex.\n\
 *\n\
 * For now not implementing bitwise operations for directives.\n\
 */\n\
\n\
expression('call')\n\
  .match(':chain');\n\
\n\
expression('chain')\n\
  .match(':literal')\n\
  .match(':function')\n\
  .match(':accessor-chain', function($1){\n\
    return { type: 'chain', value: isArray($1) ? $1 : [$1] };\n\
  });\n\
\n\
expression('accessor-chain')\n\
  .match(':accessor', ':accessors*', argsExpression);\n\
\n\
expression('assignment')\n\
  .match(':conditional', ':ws', ':assignment-operator', ':ws', ':assignment', function(l, $2, op, $4, r){\n\
    return { type: 'assignment', left: l, operator: op, right: r };\n\
  })\n\
  .match(':conditional');\n\
\n\
expression('conditional') // ternary ? yes : no\n\
  .match(':logical-or', ':ws', \n\
    '?', ':ws', ':call', ':ws',\n\
    ':', ':ws', ':call', function(condition, $2, $3, $4, yes, $6, $7, $8, no){\n\
      return { type: 'conditional', condition: condition, 'true': yes, 'false': no };\n\
    })\n\
  .match(':logical-or', function($1){\n\
    if (!isArray($1) || $1.type === 'chain')\n\
      return $1;\n\
    else\n\
      return { type: 'relational', value: isArray($1) ? $1 : [$1] };\n\
  });\n\
\n\
expression('logical-or')\n\
  .match(':logical-and', ':logical-or-end*', argsExpression);\n\
\n\
expression('logical-or-end')\n\
  .match(':ws', ':logical-or-operator', ':ws', ':logical-and', binaryExpression);\n\
\n\
expression('logical-and')\n\
  .match(':equality', ':logical-and-end*', argsExpression);\n\
\n\
expression('logical-and-end')\n\
  .match(':ws', ':logical-and-operator', ':ws', ':equality', binaryExpression);\n\
\n\
expression('equality')\n\
  .match(':relational', ':equality-end*', argsExpression);\n\
\n\
expression('equality-end')\n\
  .match(':ws', ':equality-operator', ':ws', ':relational', binaryExpression);\n\
\n\
expression('relational')\n\
  .match(':additive', ':relational-end*', argsExpression);\n\
\n\
expression('relational-end')\n\
  .match(':ws', ':relational-operator', ':ws', ':additive', binaryExpression);\n\
\n\
expression('additive')\n\
  .match(':multiplicative', ':additive-end*', argsExpression);\n\
\n\
expression('additive-end')\n\
  .match(':ws', ':additive-operator', ':ws', ':multiplicative', binaryExpression);\n\
\n\
expression('multiplicative')\n\
  .match(':unary', ':multiplicative-end*', argsExpression);\n\
\n\
expression('multiplicative-end')\n\
  .match(':ws', ':multiplicative-operator', ':ws', ':unary', binaryExpression);\n\
\n\
expression('unary')\n\
  .match(':unary-operator', ':ws', ':conditional', function(op, ws, exp){\n\
    return { type: 'unary', operator: op, value: exp };\n\
  })\n\
  .match(':postfix');\n\
\n\
expression('postfix')\n\
  .match(':call', ':ws', ':postfix-operator', function(exp, _, op){\n\
    return { type: 'postfix', operator: op, value: exp };\n\
  })\n\
  .match(':call');\n\
\n\
function argsExpression(left, args) {\n\
  if (!args.length) return left;\n\
  args.unshift(left);\n\
  return args;\n\
}\n\
\n\
function binaryExpression($1, op, $3, exp) {\n\
  return { type: 'binary', operator: op, value: exp };\n\
}\n\
\n\
/**\n\
 * Operator expressions.\n\
 */\n\
\n\
expression('assignment-operator')\n\
  .match('=', /*/[^=]/,*/ function(){\n\
    return '=';\n\
  })\n\
  .match('*=')\n\
  .match('/=')\n\
  .match('%=')\n\
  .match('+=')\n\
  .match('-=');\n\
\n\
expression('logical-or-operator')\n\
  .match('||', /*/[^=]/,*/ function(){\n\
    return '||';\n\
  });\n\
\n\
expression('logical-and-operator')\n\
  .match('&&', /*/[^=]/,*/ function(){\n\
    return '&&';\n\
  });\n\
\n\
expression('equality-operator')\n\
  .match('===')\n\
  .match('!==')\n\
  .match('==')\n\
  .match('!=');\n\
\n\
expression('additive-operator')\n\
  // XXX: handle NOT case\n\
  .match('+', /*/[^+=]/,*/ function(){\n\
    return '+';\n\
  })\n\
  .match(' - ', /*/[^-=]/,*/ function(){\n\
    return '-';\n\
  })\n\
  //.match('-', /*/[^-=]/,*/ function(){\n\
\n\
expression('multiplicative-operator')\n\
  .match('*')\n\
  .match('/')\n\
  .match('%');\n\
\n\
expression('relational-operator')\n\
  .match('<=')\n\
  .match('>=')\n\
  .match('<')\n\
  .match('>');\n\
\n\
expression('unary-operator')\n\
  .match('++')\n\
  .match('--')\n\
  .match('!');\n\
\n\
expression('postfix-operator')\n\
  .match('++')\n\
  .match('--');\n\
\n\
/**\n\
 * Literals.\n\
 */\n\
\n\
expression('literal')\n\
  .match(':undefined', literal('undefined'))\n\
  .match(':null', literal('null'))\n\
  .match(':boolean', literal('boolean'))\n\
  .match(':float', literal('float'))\n\
  .match(':integer', literal('integer'))\n\
  .match(':string', literal('string'))\n\
  .match(':regexp', literal('regexp'));\n\
\n\
expression('undefined')\n\
  .match('undefined', function(){\n\
    return undefined;\n\
  });\n\
\n\
expression('null')\n\
  .match('null', function(){\n\
    return null;\n\
  });\n\
\n\
expression('boolean')\n\
  .match('true', function(){\n\
    return true;\n\
  })\n\
  .match('false', function(){\n\
    return false;\n\
  });\n\
\n\
expression('string')\n\
  .match(':quote', ':non-quote', ':quote', function(left, string, right){\n\
    return string;\n\
  });\n\
\n\
expression('number')\n\
  .match(':float')\n\
  .match(':integer');\n\
\n\
expression('float')\n\
  .match(':integer', '.', ':integer', function(left, dot, right){\n\
    return parseFloat(left + dot + right);\n\
  });\n\
\n\
expression('integer')\n\
  .match(/[0-9]+/, function(digits){\n\
    return parseInt(digits, 10);\n\
  });\n\
\n\
// XXX\n\
expression('regexp');\n\
\n\
expression('hex-integer')\n\
  .match('0', /[xX]/, ':hex-digit+', function($1, $2, digits){\n\
    return parseInt('0x' + digits);\n\
  });\n\
\n\
expression('hex-digit')\n\
  .match(/[0-9a-fA-F]/);\n\
\n\
expression('string-better')\n\
  .match('\"', ':double-quoted-string', '\"', function(l, val, r){\n\
    return val;\n\
  })\n\
  .match(\"'\", ':single-quoted-string', \"'\", function(l, val, r){\n\
    return val;\n\
  });\n\
\n\
expression('double-quoted-string')\n\
  .match(':double-quoted-string-character+');\n\
\n\
expression('single-quoted-string')\n\
  .match(':single-quoted-string-character+');\n\
\n\
expression('double-quoted-string-character')\n\
  .match('!:invalid-double-quoted-string-character', ':source-character', function($1, $2){\n\
    return $2;\n\
  })\n\
  .match('line-continuation');\n\
\n\
expression('invalid-double-quoted-string-character')\n\
  .match('\"', \"\\\\\", ':line-terminator');\n\
\n\
expression('single-quoted-string-character')\n\
  .match('!:invalid-single-quoted-string-character', ':source-character', function($1, $2){\n\
    return $2;\n\
  })\n\
  .match('line-continuation');\n\
\n\
expression('invalid-single-quoted-string-character')\n\
  .match(\"'\", \"\\\\\", ':line-terminator');\n\
\n\
expression('source-character')\n\
  .match(/./);\n\
\n\
function literal(type) {\n\
  return function(val) {\n\
    return { type: type, value: val };\n\
  }\n\
}\n\
\n\
/**\n\
 * Whitespace expressions.\n\
 */\n\
\n\
expression('ws')\n\
  .match(/[ \\r\\t]*/);\n\
\n\
expression('line-terminator')\n\
  .match(/[\\n\
\\r\\u2028\\u2029]/);\n\
\n\
expression('end-of-line')\n\
  .match(\"\\n\
\")\n\
  .match(\"\\r\\n\
\")\n\
  .match(\"\\r\")\n\
  .match(/\\r/)\n\
  .match(\"\\u2028\") // line separator\n\
  .match(\"\\u2029\"); // paragraph separator\n\
\n\
expression('line-continuation')\n\
  .match(\"\\\\\", ':end-of-line', function($1, $2){\n\
    return $2;\n\
  });\n\
  \n\
/**\n\
 * Basic expressions.\n\
 *\n\
 * @see https://github.com/dmajda/pegjs\n\
 * @see http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf\n\
 */\n\
\n\
expression('non-quote')\n\
  .match(/[^'\"]+/);\n\
\n\
expression('quote')\n\
  .match(/['\"]/);\n\
\n\
// XXX\n\
expression('hash')\n\
  .match(':key-value-list', function(exp){\n\
    return { type: 'hash', value: exp };\n\
  });\n\
\n\
expression('key-value-list') // PropertyNameAndValueList\n\
  .match(':property-assignment', ':key-value-list-end*', argsExpression);\n\
\n\
expression('key-value-list-end')\n\
  .match(':ws', ',', ':ws', ':property-assignment', function($1, $2, $3, exp){\n\
    return exp;\n\
  });\n\
\n\
expression('property-assignment')\n\
  .match(':key-name', ':ws', ':', ':ws', ':conditional', function(name, $2, $3, $4, value){\n\
    return { type: 'property-assignment', name: name, value: value };\n\
  });\n\
\n\
expression('attr')\n\
  .match(':property-name', function(name){\n\
    return { type: 'attr', name: name };\n\
  });\n\
\n\
expression('key-name')\n\
  .match(/[\\w-]+/);\n\
\n\
expression('property-name')\n\
  .match(':identifier')\n\
  .match(':string')\n\
  .match(':number');\n\
\n\
expression('identifier')\n\
  .match(/\\w+/);\n\
\n\
expression('accessors')\n\
  .match(':dot-accessor')\n\
  .match(':bracket-accessor');\n\
\n\
expression('bracket-accessor')\n\
  .match(':ws', '[', ':ws', ':conditional', ':ws', ']', function($1, $2, $3, exp){\n\
    return { type: 'bracket-accessor', value: exp };\n\
  });\n\
\n\
expression('dot-accessor')\n\
  .match(':ws', '.', ':ws', ':accessor', function($1, $2, $3, exp){\n\
    return { type: 'dot-accessor', value: exp };\n\
  });\n\
  \n\
expression('accessor')\n\
  .match(':literal')\n\
  .match(':attr');\n\
\n\
expression('function')\n\
  .match(':property-name', ':arguments', function(name, args){\n\
    return { type: 'function', name: name, arguments: args };\n\
  })\n\
  .match(':property-name', '()', function(name, args){\n\
    return { type: 'function', name: name, arguments: [] };\n\
  });\n\
\n\
expression('arguments')\n\
  .match('(', ':ws', ':argument-list', ':ws', ')', function(l, _, args, __, r){\n\
    return { type: 'arguments', value: args };\n\
  });\n\
  \n\
expression('argument-list')\n\
  .match(':conditional', ':argument-list-end*', function(first, rest){\n\
    rest.unshift(first);\n\
    return rest;\n\
  });\n\
\n\
expression('argument-list-end')\n\
  .match(':ws', ',', ':ws', ':conditional', function($1, $2, $3, arg){\n\
    return arg;\n\
  });//@ sourceURL=tower-js-expressions/index.js"
));
require.register("tower-filter/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `filter`.\n\
 */\n\
\n\
exports = module.exports = filter;\n\
\n\
/**\n\
 * Expose `collection`.\n\
 */\n\
\n\
exports.collection = {};\n\
\n\
/**\n\
 * Filter for DOM directives.\n\
 *\n\
 * @param {String} name\n\
 * @param {Function} fn\n\
 */\n\
\n\
function filter(name, fn) {\n\
  if (!fn && exports.collection[name])\n\
    return exports.collection[name];\n\
\n\
  return exports.collection[name] = fn;\n\
}//@ sourceURL=tower-filter/index.js"
));
require.register("tower-directive-expression/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var expression = require('tower-expression');\n\
// XXX: maybe there is a way to ignore this if you've precompiled?\n\
var Compiler = require('./lib/compiler');\n\
var Path = require('./lib/path');\n\
require('./lib/expressions');\n\
\n\
/**\n\
 * Expose `Path`.\n\
 */\n\
\n\
exports.Path = Path;\n\
\n\
/**\n\
 * Expose `compile`.\n\
 */\n\
\n\
exports = module.exports = compile;\n\
\n\
/**\n\
 * Compile a directive expression.\n\
 *\n\
 * If you precompile them, you can \n\
 * write them to the hash manually.\n\
 *\n\
 *    compile('data-value', 'post[attr.name]', precompiledFn, [ 'post', 'attr', 'attr.name' ]);\n\
 *    compile('data-text', 'post.title', precompiledFn, [ 'post', 'post.title' ]);\n\
 *\n\
 * @param {String} name\n\
 */\n\
\n\
function compile(name, val, opts) {\n\
  if (!opts) {\n\
    var exp = compileExpression(name, val);\n\
  } else {\n\
    var exp = new DirectiveExpression(name, val, opts); \n\
  }\n\
  return exp;\n\
}\n\
\n\
function compileListNode(name, val, node) {\n\
  var exp = new DirectiveExpression(name, val);\n\
\n\
  switch (node.object.type) {\n\
    case 'key-val':\n\
      var obj = node.object.val;\n\
      exp.key = compileNode('attr', null, obj.key);\n\
      exp.val = compileNode('attr', null, obj.val);\n\
      break;\n\
    default:\n\
      exp.val = node.object.name;\n\
      break;\n\
  }\n\
\n\
  exp.col = compileNode('data-value', null, node.array);\n\
  exp.edges = exp.col.edges;\n\
  // exp.edges = exp.col.edges.concat(exp.val.edges);\n\
  // if (exp.key) exp.edges = exp.edges.concat(exp.key.edges);\n\
\n\
  return exp;\n\
}\n\
\n\
function compileNode(name, val, node) {\n\
  var compiler = (new Compiler(node)).compile();\n\
  return new DirectiveExpression(name, val, compiler);\n\
}\n\
\n\
function compileExpression(name, val) {\n\
  var node = expression(name).parse(val);\n\
  var exp;\n\
\n\
  switch (node.type) {\n\
    case 'list':\n\
      exp = compileListNode(name, val, node);\n\
      break;\n\
    //case 'hash':\n\
    //  break;\n\
    default:\n\
      exp = compileNode(name, val, node);\n\
      break;\n\
  }\n\
\n\
  return exp;\n\
}\n\
\n\
/**\n\
 * Instantiate a new `DirectiveExpression`.\n\
 */\n\
\n\
function DirectiveExpression(name, val, opts) {\n\
  for (var key in opts) {\n\
    if (opts.hasOwnProperty(key))\n\
      this[key] = opts[key];\n\
  }\n\
  this.name = name;\n\
  this.val = val;\n\
  this.edges = this.edges || [];\n\
  this.paths = [];\n\
  \n\
  for (var i = 0, n = this.edges.length; i < n; i++) {\n\
    this.paths.push(new Path(this.edges[i]));\n\
  }\n\
}\n\
\n\
/**\n\
 * Watch a scope based on expression dependencies.\n\
 */\n\
\n\
DirectiveExpression.prototype.watch = function(scope, fn){\n\
  var fns = [];\n\
\n\
  for (var i = 0, n = this.paths.length; i < n; i++) {\n\
    fns.push(this.paths[i].watch(scope, fn));\n\
  }\n\
\n\
  // function to unwatch all children.\n\
\n\
  function unwatch() {\n\
    for (var i = 0, n = fns.length; i < n; i++) {\n\
      fns[i]();\n\
    }\n\
  }\n\
\n\
  return unwatch;\n\
};//@ sourceURL=tower-directive-expression/index.js"
));
require.register("tower-directive-expression/lib/compiler.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
require('tower-js-expressions'); // parsing expression grammar\n\
var filter = require('tower-filter');\n\
var isArray = require('part-is-array');\n\
\n\
/**\n\
 * Expose `Compiler`.\n\
 */\n\
\n\
module.exports = Compiler;\n\
\n\
/**\n\
 * Compiler helper.\n\
 */\n\
\n\
var access = \"2 === arguments.length ? 'set' : 'get'\";\n\
\n\
/**\n\
 * Instantiate a new `Compiler`.\n\
 */\n\
\n\
function Compiler(node) {\n\
  this.node = node;\n\
}\n\
\n\
/**\n\
 * Compile parse tree to JavaScript.\n\
 */\n\
\n\
Compiler.prototype.compile = function(){\n\
  try {\n\
    this.buf = [];\n\
    this.chain = [];\n\
    this.filters = [];\n\
    this.indent = '  ';\n\
    this.visit(this.node, true, true);\n\
    // maybe do it so it's `this.filter`\n\
    var internalFn = Function('scope, val', this.indent + 'return ' + this.buf.join('') + ';');\n\
    var self = this;\n\
\n\
    function fn(scope, val) {\n\
      var res = valFn.apply(this, arguments);\n\
      if (self.filters.length) {\n\
        for (var i = 0, n = self.filters.length; i < n; i++) {\n\
          res = self.filters[i].fn(scope, res);\n\
        }\n\
      }\n\
      return res;\n\
    }\n\
\n\
    function valFn(scope, val) {\n\
      if (2 === arguments.length)\n\
        return internalFn(filter, scope, val);\n\
      else\n\
        return internalFn(filter, scope);\n\
    }\n\
\n\
    var fn = internalFn;\n\
\n\
    fn.bindTo = !!this.bindTo;\n\
    fn.bindFrom = !!this.bindFrom;\n\
    fn.deps = this.deps;\n\
\n\
    this.edges = this.chain;\n\
    // clean up memory.\n\
    //delete this.node;\n\
    //delete this.buf;\n\
    delete this.indent;\n\
    this.fn = fn;\n\
    return this;\n\
  } catch (err) {\n\
    console.log('Compiler error: ' + this.buf.join(''));\n\
    throw err;\n\
  }\n\
};\n\
\n\
/**\n\
 * Visit `node`.\n\
 *\n\
 * @param {Node} node\n\
 * @api public\n\
 */\n\
\n\
Compiler.prototype.visit = function(node, terminal){\n\
  // XXX: should make into { type: 'chain' };\n\
  // b.c there is type \"chain\" and type \"multi\"\n\
  // where chain is for user.x.y.z(), while multi\n\
  // is for filters, like user.x.y.z() | sort...\n\
\n\
  switch (node.type) {\n\
    case 'string':\n\
      return this.visitStringLiteral(node, terminal);\n\
    case 'float':\n\
    case 'integer':\n\
    case 'boolean':\n\
    case 'regnode':\n\
    case 'null':\n\
    case 'undefined':\n\
      return this.visitLiteral(node);\n\
    case 'filter':\n\
      return this.visitFilter(node);\n\
    case 'filters':\n\
      return this.visitFilters(node);\n\
    case 'helper':\n\
      return this.visitHelper(node);\n\
    case 'attr':\n\
      return this.visitAttr(node, terminal);\n\
    case 'chain':\n\
      return this.visitChain(node.value, terminal);\n\
    // unary and postfix just work with operator\n\
    case 'postfix':\n\
      return this.visitPostfix(node);\n\
    case 'unary':\n\
      return this.visitUnary(node, terminal);\n\
    case 'binary':\n\
      return this.visitBinary(node, terminal);\n\
    case 'binding':\n\
      return this.visitBinding(node, terminal);\n\
    case 'function':\n\
      return this.visitFunction(node, terminal);\n\
    case 'bracket-accessor':\n\
      return this.visitBracket(node.value, terminal);\n\
    case 'dot-accessor':\n\
      return this.visitDot(node.value, terminal);\n\
    case 'conditional':\n\
      return this.visitTernary(node, terminal);\n\
    case 'relational':\n\
      return this.visitRelational(node.value, terminal);\n\
    case 'interpolation':\n\
      return this.visitInterpolation(node, false);\n\
    case 'interpolated-hash':\n\
    case 'hash':\n\
      return this.visitHash(node, terminal);\n\
    case 'interpolated-string':\n\
      return this.visitInterpolatedString(node, terminal);\n\
    case 'list':\n\
      return this.visitList(node, terminal);\n\
  }\n\
};\n\
\n\
Compiler.prototype.visitChain = function(nodes, terminal){\n\
  if (terminal)\n\
    this.buf.push('scope[' + access + ']');\n\
  else\n\
    this.buf.push('scope.get');\n\
\n\
  this.buf.push('(');\n\
  var chain = [];\n\
  var parent = this.chain;\n\
  this.chain.push(chain);\n\
  this.chain = chain;\n\
  \n\
  for (var i = 0, n = nodes.length; i < n; i++) {\n\
    this.visit(nodes[i]);\n\
  }\n\
\n\
  //this.chains.pop();\n\
  this.chain = parent;\n\
\n\
  if (terminal)\n\
    this.buf.push(', val');\n\
  this.buf.push(')');\n\
};\n\
\n\
/**\n\
 * Visit literal `node`.\n\
 *\n\
 * @param {Literal} node\n\
 * @api public\n\
 */\n\
\n\
Compiler.prototype.visitLiteral = function(node){\n\
  this.buf.push(node.value);\n\
};\n\
\n\
Compiler.prototype.visitRelational = function(nodes, terminal){\n\
  for (var i = 0, n = nodes.length; i < n; i++) {\n\
    this.visit(nodes[i]);\n\
  }\n\
};\n\
\n\
Compiler.prototype.visitStringLiteral = function(node, terminal){\n\
  this.buf.push('\"' + node.value + '\"');\n\
};\n\
\n\
Compiler.prototype.visitAttr = function(node, terminal){\n\
  this.chain.push(node.name);\n\
  this.buf.push(\"'\" + node.name + \"'\");\n\
};\n\
\n\
Compiler.prototype.visitPostfix = function(node){\n\
  this.visit(node.value);\n\
  this.buf.push('++');\n\
};\n\
\n\
Compiler.prototype.visitUnary = function(node, terminal){\n\
  this.buf.push('!');\n\
  this.visit(node.value, terminal);\n\
};\n\
\n\
Compiler.prototype.visitBinary = function(node, terminal){\n\
  this.buf.push(' ' + node.operator + ' ');\n\
  this.visit(node.value, terminal);\n\
};\n\
\n\
Compiler.prototype.visitTernary = function(node, terminal){\n\
  var indent = this.indent;\n\
  this.indent += '  ';\n\
  this.buf.push('(');\n\
  this.visit(node.condition, false)\n\
  this.buf.push('\\n\
' + this.indent + '? ');\n\
  this.visit(node['true'], terminal);\n\
  this.buf.push('\\n\
' + this.indent + ': ');\n\
  this.visit(node['false'], terminal);\n\
  this.buf.push(')');\n\
  this.indent = indent;\n\
};\n\
\n\
Compiler.prototype.visitBracket = function(node, terminal){\n\
  this.buf.push(\" + '.' + \");\n\
  this.visit(node);\n\
};\n\
\n\
Compiler.prototype.visitDot = function(node){\n\
  this.chain.push(node.name);\n\
  this.buf.push(\" + '.\" + node.name + \"'\");\n\
};\n\
\n\
Compiler.prototype.visitInterpolation = function(node, terminal){\n\
  this.buf.push('(');\n\
  this.visit(node.value, false);\n\
  this.buf.push(')');\n\
};\n\
\n\
Compiler.prototype.visitBinding = function(node){\n\
  this.visit(node.value, true);\n\
\n\
  switch (node.operator) {\n\
    case '+':\n\
      this.bindTo = true;\n\
      break\n\
    case '-':\n\
      this.bindFrom = true;\n\
      break;\n\
    case '=':\n\
      this.bindTo = this.bindFrom = true;\n\
      break;\n\
  }\n\
};\n\
\n\
Compiler.prototype.visitHash = function(node){\n\
  // XXX: normalize these to always be array\n\
  var indent = this.indent;\n\
  this.indent += '  ';\n\
  this.buf.push('{\\n\
');\n\
\n\
  if (node.value.length) {\n\
    for (var i = 0, n = node.value.length; i < n; i++) {\n\
      var exp = node.value[i];\n\
      this.buf.push(this.indent + propName(exp.name) + ': ');\n\
      this.visit(exp.value, true);\n\
      if (i !== n - 1)\n\
        this.buf.push(',\\n\
');\n\
      else\n\
        this.buf.push('\\n\
');\n\
    }\n\
  } else {\n\
    var exp = node.value;\n\
    this.buf.push(this.indent + propName(exp.name) + ': ');\n\
    this.visit(exp.value, true);\n\
    this.buf.push('\\n\
');\n\
  }\n\
  this.indent = indent;\n\
  this.buf.push(this.indent + '}');\n\
};\n\
\n\
Compiler.prototype.visitInterpolatedString = function(node){\n\
  var nodes = node.value;\n\
  for (var i = 0, n = nodes.length; i < n; i++) {\n\
    this.visit(nodes[i], true, true);\n\
    if (i !== n - 1)\n\
      this.buf.push(' + ');\n\
  }\n\
};\n\
\n\
// XXX: vs. a helper function.\n\
Compiler.prototype.visitMethod = function(){\n\
\n\
};\n\
\n\
Compiler.prototype.visitFunction = function(node){\n\
  // { type: 'function', name: 'getTitle', arguments: [] }\n\
  this.buf.push(\"scope.call('\" + node.name + \"'\");\n\
  var args = node.arguments;\n\
  if (args.type) args = args.value;\n\
  if (args.length) {\n\
    for (var i = 0, n = args.length; i < n; i++) {\n\
      this.buf.push(', ');\n\
      this.visit(args[i], true);\n\
    }\n\
  }\n\
  this.buf.push(')');\n\
};\n\
\n\
Compiler.prototype.visitFilter = function(node){\n\
  // { type: 'filter', value: { ... } }\n\
  this.filters.push(new Compiler(node.value).compile());\n\
};\n\
\n\
Compiler.prototype.visitFilters = function(node){\n\
  this.visit(node.value);\n\
\n\
  for (var i = 0, n = node.filters.length; i < n; i++) {\n\
    this.visitFilter(node.filters[i]);\n\
  }\n\
};\n\
\n\
Compiler.prototype.visitHelper = function(node){\n\
  this.buf.push(\"filter('\" + node.value + \"')(val\");\n\
  \n\
  var args = null != node.arguments\n\
    ? isArray(node.arguments)\n\
      ? node.arguments\n\
      : [node.arguments]\n\
    : [];\n\
\n\
  if (args.length) {\n\
    for (var i = 0, n = args.length; i < n; i++) {\n\
      this.buf.push(', ');\n\
      this.visit(args[i], true);\n\
    }\n\
  }\n\
\n\
  this.buf.push(')');\n\
};\n\
\n\
function propName(name) {\n\
  return !/^\\w+$/.test(name)\n\
    ? \"'\" + name + \"'\"\n\
    : name;\n\
}//@ sourceURL=tower-directive-expression/lib/compiler.js"
));
require.register("tower-directive-expression/lib/expressions.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var expression = require('tower-expression');\n\
var isArray = require('part-is-array');\n\
\n\
/**\n\
 * Filter expressions.\n\
 */\n\
\n\
expression('directive-value')\n\
  .match(':conditional', ':directive-filters', function($1, $2){\n\
    return { type: 'filters', value: $1, filters: isArray($2) ? $2 : [$2] };\n\
  });\n\
\n\
expression('directive-filters')\n\
  .match(':directive-filter', ':directive-filter*', argsExpression);\n\
\n\
expression('directive-filter')\n\
  .match(':ws', '|', ':ws', ':directive-filter-expression', function($1, $2, $3, $4){\n\
    return { type: 'filter', value: $4 };\n\
  });\n\
\n\
expression('directive-filter-expression')\n\
  .match(':directive-helper');\n\
\n\
expression('directive-helper')\n\
  // XXX: to robustify, make `:conditional` to `:interpolated-hash`\n\
  .match(':attr', ':ws', ':', ':ws', ':conditional', function($1, $2, $3, $4, $5){\n\
    return { type: 'helper', value: $1.name, arguments: $5 };\n\
  })\n\
  .match(':attr', function($1){\n\
    return { type: 'helper', value: $1.name };\n\
  });\n\
\n\
/**\n\
 * Interpolation Expressions.\n\
 */\n\
\n\
expression('interpolated-hash')\n\
  .match(':interpolated-key-value-list', function($1){\n\
    return { type: 'interpolated-hash', value: $1 };\n\
  })\n\
  .match(':hash');\n\
\n\
expression('interpolated-key-value-list') // PropertyNameAndValueList\n\
  .match(':interpolated-property-assignment', ':interpolated-key-value-list-end*', argsExpression)\n\
  .match(':interpolated-property-assignment');\n\
\n\
expression('interpolated-key-value-list-end')\n\
  .match(':ws', /[,;]/, ':ws', ':interpolated-property-assignment', function($1, $2, $3, exp){\n\
    return exp;\n\
  });\n\
\n\
expression('interpolated-property-assignment')\n\
  .match(':key-name', ':ws', ':', ':ws', ':interpolated-string', function(name, $2, $3, $4, value){\n\
    return { type: 'interpolated-property-assignment', name: name, value: value };\n\
  });\n\
\n\
expression('interpolated-string')\n\
  // XXX: handle blank\n\
  .match(':interpolated-statement', ':interpolated-statement*', function($1, $2){\n\
    if ($2) {\n\
      for (var i = 0, n = $2.length; i < n; i++) {\n\
        $1 = $1.concat($2[i]);\n\
      }\n\
    }\n\
\n\
    return { type: 'interpolated-string', value: isArray($1) ? $1 : [$1] };\n\
  });\n\
\n\
expression('interpolated-statement')\n\
  //.match(/[^\\{]+/, '{{', /[^\\}]+/, '}}', function($1, $2, $3, $4){\n\
  .match(':non-interpolation', ':interpolation', ':non-interpolation', function($1, $2, $3){\n\
    var arr = [ { type: 'string', value: $1 }, $2 ];\n\
    if ($3) arr.push({ type: 'string', value: $3 });\n\
    return arr;\n\
  });\n\
\n\
expression('interpolation')\n\
  // XXX: maybe should be ':call'\n\
  .match('{{', ':ws', ':conditional', ':ws', '}}', function($1, $2, exp, $4, $5){\n\
    return { type: 'interpolation', value: exp };\n\
  });\n\
\n\
expression('non-interpolation')\n\
  .match(/[^\\{,]*/);\n\
\n\
/**\n\
 * Iterator expressions.\n\
 */\n\
\n\
expression('for-in')\n\
  .match(':attr', ':ws', ',', ':ws', ':attr', function($1, $2, $3, $4, $5){\n\
    return { type: 'key-val', val: { key: $1, val: $5 } };\n\
  })\n\
  .match(':attr');\n\
\n\
expression('data-list')\n\
  .match(':for-in', ':ws', 'in', ':ws', ':conditional', function(obj, $2, $3, $4, arr){\n\
    return { type: 'list', object: obj, array: arr };\n\
  });\n\
\n\
expression('directive-options')\n\
  .match('[', ':ws', ':key-value-list', ':ws', ']', function($1, $2, opts, $4, $5){\n\
    return opts;\n\
  });\n\
\n\
/**\n\
 * Basic attribute expressions.\n\
 */\n\
\n\
expression('data-value')\n\
  .match(':directive-binding', ':conditional', bindingExpression)\n\
  .match(':interpolated-string')\n\
  .match(':conditional');\n\
\n\
expression('data-style')\n\
  .match(':interpolated-hash')\n\
  // XXX: comma separated\n\
  //.match(':conditionals')\n\
  .match(':conditional')\n\
  .match(':interpolated-string');\n\
\n\
expression('data-class')\n\
  .match(':hash')\n\
  // XXX: comma separated\n\
  //.match(':conditionals')\n\
  .match(':conditional')\n\
  .match(':interpolated-string');\n\
\n\
expression('conditionals')\n\
  .match(':conditional', ':conditionals-end*', function($1, $2){\n\
    $2.unshift($1);\n\
    return { type: 'array', val: $2 };\n\
  });\n\
\n\
expression('conditionals-end')\n\
  .match(':ws', ',', ':ws', ':conditional', function($1, $2, $3, $4){\n\
    return $4;\n\
  });\n\
\n\
expression('directive-class')\n\
  .match(':directive-binding', ':key-value-list', bindingObjectExpression)\n\
  .match(':key-value-list', hashExpression);\n\
  \n\
// [+], [-], [=]\n\
expression('directive-binding')\n\
  .match('[', /[\\+-=]/, ']', ':ws', function(l, op, r){\n\
    return op;\n\
  });\n\
\n\
function bindingExpression(op, exp) {\n\
  return { type: 'binding', operator: op, value: exp };\n\
}\n\
\n\
function bindingObjectExpression(op, exp) {\n\
  return { type: 'binding', operator: op, props: exp };\n\
}\n\
\n\
function hashExpression(exp) {\n\
  return { type: 'hash', value: exp };\n\
}\n\
\n\
function argsExpression(left, args) {\n\
  if (!args.length) return left;\n\
  args.unshift(left);\n\
  return args;\n\
}//@ sourceURL=tower-directive-expression/lib/expressions.js"
));
require.register("tower-directive-expression/lib/path.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var isArray = require('part-is-array');\n\
\n\
/**\n\
 * Expose `Path`.\n\
 */\n\
\n\
module.exports = Path;\n\
\n\
/**\n\
 * Watch path.\n\
 */\n\
\n\
function Path(edges) {\n\
  // this thing listens for changes on scope, and then\n\
  // updates the top-most edges.\n\
  // this doesn't trigger DOM/UI updates, it just triggers\n\
  // property updates, which might trigger DOM updates.\n\
  for (var i = 0, n = edges.length; i < n; i++) {\n\
    if (isArray(edges[i]))\n\
      edges[i] = new Path(edges[i]);\n\
  }\n\
  this.edges = edges;\n\
}\n\
\n\
// XXX: this should return a function so you can unwatch for this specific scope.\n\
Path.prototype.watch = function(scope, fn){\n\
  var self = this;\n\
  var edge;\n\
  var childrenToUnwatch = [];\n\
  var child;\n\
\n\
  // watch edges\n\
  for (var i = 0, n = this.edges.length; i < n; i++) {\n\
    if (self.edges[i] instanceof Path) {\n\
      child = self.edges[i].watch(scope, update);\n\
      childrenToUnwatch.push(child);\n\
      edge = edge + '.' + scope.get(child.edge);\n\
    } else {\n\
      edge = edge ? edge + '.' + self.edges[i] : self.edges[i];\n\
    }\n\
  }\n\
\n\
  var prev = edge;\n\
\n\
  function update() {\n\
    edge = self.compute(scope);\n\
    if (prev) {\n\
      if (prev === edge) return edge;\n\
      scope.edge(prev).off('change', fn);\n\
      scope.edge(edge).on('change', fn);\n\
      fn();\n\
    }\n\
  }\n\
\n\
  scope.edge(edge).on('change', fn);\n\
\n\
  function unwatch() {\n\
    scope.edge(edge).off('change', fn);\n\
    for (var i = 0, n = childrenToUnwatch.length; i < n; i++) {\n\
      childrenToUnwatch[i]();\n\
    }\n\
  }\n\
\n\
  unwatch.edge = edge;\n\
\n\
  return unwatch;\n\
};\n\
\n\
Path.prototype.compute = function(scope){\n\
  var edge;\n\
  for (var i = 0, n = this.edges.length; i < n; i++) {\n\
    if (this.edges[i] instanceof Path) {\n\
      edge = edge + '.' + scope.get(this.edges[i].compute(scope));\n\
    } else {\n\
      edge = edge ? edge + '.' + this.edges[i] : this.edges[i];\n\
    }\n\
  }\n\
  return edge;\n\
};//@ sourceURL=tower-directive-expression/lib/path.js"
));
require.register("component-value/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var typeOf = require('type');\n\
\n\
/**\n\
 * Set or get `el`'s' value.\n\
 *\n\
 * @param {Element} el\n\
 * @param {Mixed} val\n\
 * @return {Mixed}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(el, val){\n\
  if (2 == arguments.length) return set(el, val);\n\
  return get(el);\n\
};\n\
\n\
/**\n\
 * Get `el`'s value.\n\
 */\n\
\n\
function get(el) {\n\
  switch (type(el)) {\n\
    case 'checkbox':\n\
    case 'radio':\n\
      if (el.checked) {\n\
        var attr = el.getAttribute('value');\n\
        return null == attr ? true : attr;\n\
      } else {\n\
        return false;\n\
      }\n\
    case 'radiogroup':\n\
      for (var i = 0, radio; radio = el[i]; i++) {\n\
        if (radio.checked) return radio.value;\n\
      }\n\
      break;\n\
    case 'select':\n\
      for (var i = 0, option; option = el.options[i]; i++) {\n\
        if (option.selected) return option.value;\n\
      }\n\
      break;\n\
    default:\n\
      return el.value;\n\
  }\n\
}\n\
\n\
/**\n\
 * Set `el`'s value.\n\
 */\n\
\n\
function set(el, val) {\n\
  switch (type(el)) {\n\
    case 'checkbox':\n\
    case 'radio':\n\
      if (val) {\n\
        el.checked = true;\n\
      } else {\n\
        el.checked = false;\n\
      }\n\
      break;\n\
    case 'radiogroup':\n\
      for (var i = 0, radio; radio = el[i]; i++) {\n\
        radio.checked = radio.value === val;\n\
      }\n\
      break;\n\
    case 'select':\n\
      for (var i = 0, option; option = el.options[i]; i++) {\n\
        option.selected = option.value === val;\n\
      }\n\
      break;\n\
    default:\n\
      el.value = val;\n\
  }\n\
}\n\
\n\
/**\n\
 * Element type.\n\
 */\n\
\n\
function type(el) {\n\
  var group = 'array' == typeOf(el) || 'object' == typeOf(el);\n\
  if (group) el = el[0];\n\
  var name = el.nodeName.toLowerCase();\n\
  var type = el.getAttribute('type');\n\
\n\
  if (group && type && 'radio' == type.toLowerCase()) return 'radiogroup';\n\
  if ('input' == name && type && 'checkbox' == type.toLowerCase()) return 'checkbox';\n\
  if ('input' == name && type && 'radio' == type.toLowerCase()) return 'radio';\n\
  if ('select' == name) return 'select';\n\
  return name;\n\
}\n\
//@ sourceURL=component-value/index.js"
));
require.register("tower-directive/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require('tower-emitter');\n\
var compile = require('tower-directive-expression');\n\
var content = require('tower-content');\n\
var statics = require('./lib/statics');\n\
var proto = require('./lib/proto');\n\
\n\
/**\n\
 * Global document (for client and server).\n\
 */\n\
\n\
var document = 'undefined' === typeof document\n\
  ? undefined // tower/server-dom\n\
  : window.document;\n\
\n\
/**\n\
 * Expose `directive`.\n\
 */\n\
\n\
exports = module.exports = directive;\n\
\n\
/**\n\
 * Expose `collection`.\n\
 */\n\
\n\
exports.collection = [];\n\
\n\
/**\n\
 * Get/set directive function.\n\
 * \n\
 * @param {String} name The directive's name.\n\
 * @param {Function} fn Function called on directive definition.\n\
 * @return {Directive} A `Directive` object.\n\
 * @api public\n\
 */\n\
\n\
function directive(name, fn, manualCompile) {\n\
  if (undefined === fn && exports.collection[name])\n\
    return exports.collection[name];\n\
\n\
  /**\n\
   * Class representing the extensions to HTML.\n\
   *\n\
   * @class\n\
   *\n\
   * @param {String} name The directive's name.\n\
   * @param {Function} The directive function to be executed.\n\
   * @api private\n\
   */\n\
\n\
  function Directive(el, attrs) {\n\
    this.name = name;\n\
    this.attrs = attrs;\n\
    this.document = document;\n\
\n\
    // attribute, text, element, comment\n\
    if (1 === el.nodeType) {\n\
      if (this.element) {\n\
        // XXX: compile attributes for element?\n\
      } else if (this.attribute) {\n\
        var val = el.getAttribute(this.name);\n\
        if (val) {\n\
          attrs[this.name] = exports.expression(Directive._expression, val);\n\
        }\n\
      }\n\
    }\n\
  }\n\
\n\
  Directive.id = name;\n\
  Directive.expressions = {};\n\
  Directive.prototype.attribute = true;\n\
  Directive.prototype.processChildren = true;\n\
\n\
  if (fn) {\n\
    if (manualCompile || 1 === fn.length) {\n\
      Directive._compile = fn;\n\
    } else {\n\
      Directive._exec = fn;\n\
    }\n\
  }\n\
\n\
  for (var key in statics) Directive[key] = statics[key];\n\
  for (var key in proto) Directive.prototype[key] = proto[key];\n\
\n\
  exports.collection[name] = Directive;\n\
  exports.collection.push(Directive);\n\
  exports.emit('define', Directive);\n\
  return Directive;\n\
}\n\
\n\
/**\n\
 * Mixin `Emitter`.\n\
 */\n\
\n\
Emitter(exports);\n\
\n\
/**\n\
 * Get/compile directive expression.\n\
 */\n\
\n\
exports.expression = function(name, val, opts, fn){\n\
  var Directive = exports(name);\n\
  return Directive.expressions[val]\n\
    = Directive.expressions[val]\n\
    || compile.apply(null, arguments);\n\
};\n\
\n\
/**\n\
 * Check if a directive is defined.\n\
 *\n\
 * @param {String} name A directive name.\n\
 * @return {Boolean} true if the `Directive` has been defined, but false otherwise\n\
 * @api public\n\
 */\n\
\n\
exports.defined = function(name){\n\
  return exports.collection.hasOwnProperty(name);\n\
};\n\
\n\
/**\n\
 * Clear all directives.\n\
 *\n\
 * @chainable\n\
 * @return {Function} exports The main `directive` function.\n\
 * @api public\n\
 */\n\
\n\
exports.clear = function(){\n\
  exports.off();\n\
  exports.collection = [];\n\
  return exports;\n\
};//@ sourceURL=tower-directive/index.js"
));
require.register("tower-directive/lib/statics.js", Function("exports, require, module",
"\n\
/**\n\
 * XXX: The only types of els this can be defined on.\n\
 *\n\
 * Comment/Script/el/Text\n\
 *\n\
 * @chainable\n\
 * @return {Function} exports The main `directive` function.\n\
 */\n\
\n\
exports.type = function(name){\n\
  this.prototype[name] = true;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * @chainable\n\
 */\n\
\n\
exports.meta = function(val){\n\
  this.prototype.meta = null == val ? true : val;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Custom expression name.\n\
 * @chainable\n\
 */\n\
\n\
exports.expression = function(name){\n\
  this._expression = name;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Default expression.\n\
 */\n\
\n\
exports._expression = 'data-value';\n\
\n\
/**\n\
 * Sorting priority.\n\
 *\n\
 * Higher means it gets moved toward the front.\n\
 *\n\
 * @chainable\n\
 * @param {Integer} val Defaults to 0.\n\
 * @return {Function} exports The main `directive` function.\n\
 */\n\
\n\
exports.priority = function(val){\n\
  this.prototype.priority = val;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Tells template whether it should continue\n\
 * and process childNodes of element.\n\
 */\n\
\n\
exports.processChildren = function(val){\n\
  this.prototype.processChildren = false === val ? false : true;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Terminal.\n\
 *\n\
 * If set to true, it will stop processing the template right there.\n\
 * Then it is up to the directive itself to handling creating sub-templates.\n\
 * This is used mainly for creating iterators.\n\
 *\n\
 * @chainable\n\
 * @param {Boolean} [val]\n\
 * @return {Directive} this\n\
 */\n\
\n\
exports.terminal = function(val){\n\
  this.prototype.terminal = false === val ? false : true;\n\
  return this;\n\
};//@ sourceURL=tower-directive/lib/statics.js"
));
require.register("tower-directive/lib/proto.js", Function("exports, require, module",
"\n\
/**\n\
 * Return optimized function for use in templates.\n\
 *\n\
 * @param {DOMNode} el el used for template.\n\
 * @param {Function} nodeFn The template function used for transclusion.\n\
 * @return {Object} A scope.\n\
 * @api private\n\
 */\n\
\n\
exports.compile = function(el, nodeFn){\n\
  var obj = this;\n\
  var attrs = this.attrs;\n\
  var exp = attrs[this.name];\n\
\n\
  var fn = this.constructor._exec\n\
    || this.constructor._compile.call(this, el, exp, nodeFn, attrs);\n\
\n\
  // executed every time template is rendered.\n\
  obj.exec = function(scope, el){\n\
    return fn.call(obj, scope, el, exp, nodeFn, attrs) || scope;\n\
  }\n\
\n\
  return obj.exec;\n\
};//@ sourceURL=tower-directive/lib/proto.js"
));
require.register("tower-template/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var directive = require('tower-directive');\n\
var content = require('tower-content');\n\
\n\
/**\n\
 * Expose `template`.\n\
 */\n\
\n\
exports = module.exports = template;\n\
\n\
/**\n\
 * Expose `compile`.\n\
 */\n\
\n\
exports.compile = compile;\n\
\n\
/**\n\
 * Expose `collection`.\n\
 */\n\
\n\
exports.collection = {};\n\
\n\
/**\n\
 * Expose `document`.\n\
 *\n\
 * For server-side use.\n\
 */\n\
\n\
exports.document = 'undefined' == typeof document\n\
  ? {} // XXX: tower/server-dom\n\
  : window.document;\n\
\n\
/**\n\
 * Client-side reactive templates (just plain DOM node manipulation, no strings).\n\
 *\n\
 * @module template\n\
 *\n\
 * @param {String} name The template's name.\n\
 * @param {HTMLNode} node The HTML node.\n\
 * @return {Function} The compiled template function.\n\
 * @api public\n\
 */\n\
\n\
function template(name, node) {\n\
  if ('function' === typeof node)\n\
    return exports.collection[name] = node;\n\
\n\
  // if `name` is a DOM node, arguments are shifted by 1\n\
  if ('string' !== typeof name) return compile(name);\n\
  // only 1 argument\n\
  if (undefined === node) return exports.collection[name];\n\
  // compile it\n\
  return exports.collection[name] = compile(node);\n\
}\n\
\n\
/**\n\
 * Check if template with `name` exists.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
exports.defined = function(name){\n\
  return !!exports.collection.hasOwnProperty(name);\n\
};\n\
\n\
/**\n\
 * Traverse `node` and children recursively,\n\
 * and collect and execute directives.\n\
 *\n\
 * @param {HTMLNode} node\n\
 * @param {Array} start Directives to start.\n\
 * @return {Function} The compiled template function.\n\
 */\n\
\n\
function compile(node, start) {\n\
  // http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object\n\
  // XXX: if node gets replaced here, needs to be reflected\n\
  // use nodeList[i] in case it gets compiled beneath\n\
  // XXX: therefore, it must always be on arrays\n\
  if (node.nodeType) {\n\
    // find nodeList and index;\n\
    var nodeList;\n\
    var index;\n\
    if (node.parentNode) {\n\
      nodeList = node.parentNode.childNodes;\n\
      for (var i = 0; i < nodeList.length; i++) {\n\
        if (node == nodeList[i]) {\n\
          index = i;\n\
          break;\n\
        }\n\
      }\n\
    } else {\n\
      var frag = document.createDocumentFragment();\n\
      frag.appendChild(node);\n\
      nodeList = frag.childNodes;\n\
      index = 0;\n\
    }\n\
  }\n\
\n\
  var nodeFn = node.nodeType\n\
    ? compileNode(node, index, nodeList, start)\n\
    : compileEach(node);\n\
\n\
  function fn(scope, el) {\n\
    if (!content.is(scope))\n\
      scope = content('anonymous').init(scope);\n\
\n\
    return nodeFn(scope, el);\n\
  }\n\
\n\
  return fn;\n\
}\n\
\n\
// XXX: compileNode(node, nodeList, directiveIndex)\n\
function compileNode(node, index, nodeList, start) {\n\
  var directivesFn = compileDirectives(node, nodeFn, start);\n\
  var terminal = directivesFn && directivesFn.terminal;\n\
  \n\
  // recursive\n\
  var eachFn = !terminal && node.childNodes\n\
    ? compileEach(node.childNodes)\n\
    : undefined;\n\
\n\
  // `returnNode` is used for recursively \n\
  // passing children. this is used for cloning, \n\
  // where it should apply the directives to \n\
  // the new children, not the original \n\
  // template's children.\n\
\n\
  function nodeFn(scope, returnNode) {\n\
    returnNode || (returnNode = node);\n\
\n\
    // apply directives to node.\n\
    if (directivesFn) scope = directivesFn(scope, returnNode);\n\
\n\
    // recurse, apply directives to children.\n\
    //if (eachFn && returnNode.childNodes)\n\
    if (eachFn && returnNode.childNodes)\n\
      eachFn(scope, returnNode.childNodes, returnNode);\n\
\n\
    return returnNode;\n\
  }\n\
\n\
  return nodeFn;\n\
}\n\
\n\
function compileEach(nodeList) {\n\
  var fns = [];\n\
  // doesn't cache `length` b/c items can be removed\n\
  //for (var i = 0, n = children.length; i < n; i++) {\n\
  for (var i = 0; i < nodeList.length; i++) {\n\
    fns.push(compileNode(nodeList[i], i, nodeList));\n\
  }\n\
\n\
  return createEachFn(fns);\n\
}\n\
\n\
function compileDirectives(node, nodeFn, start) {\n\
  var directives = getDirectives(node, start);\n\
  if (!directives.length) return; // don't execute function if unnecessary.\n\
\n\
  var terminal = false;\n\
  var fns = [];\n\
  var obj;\n\
\n\
  for (var i = start || 0, n = directives.length; i < n; i++) {\n\
    obj = directives[i];\n\
\n\
    // XXX: if obj.element\n\
    if (obj.template) {\n\
      var templateEl = obj.templateEl.cloneNode(true);\n\
      // XXX: replace <content> tags with the stuff from the current `node`.\n\
\n\
      if (obj.replace) {\n\
        node.parentNode.replaceChild(templateEl, node);\n\
        node = templateEl;\n\
        directives = directives.concat(getDirectives(node));\n\
        n = directives.length;\n\
        terminal = true;\n\
      } else {\n\
        node.appendChild(templateEl);\n\
      }\n\
    }\n\
\n\
    // meta node (such as `data-each` or `data-if`)\n\
    if (obj.meta) {\n\
      obj.terminal = true;\n\
      // you have to replace nodes, not remove them, to keep order.\n\
      var val = node.getAttribute(obj.name);\n\
      var comment = exports.document.createComment(' ' + obj.name + ':' + val + ' ');\n\
      if (node.parentNode)\n\
        node.parentNode.replaceChild(comment, node);\n\
      // XXX: should skip already processed directives\n\
      // <profile data-each=\"user in users\"></profile>\n\
      // template(el, [ 'profile', 'data-each' ]);\n\
      nodeFn = compile(node, i + 1);\n\
      //node = comment;\n\
    }\n\
\n\
    var fn = obj.compile(node, nodeFn);\n\
    fns.push(fn);\n\
    terminal = obj.terminal;\n\
    if (terminal) break;\n\
  }\n\
\n\
  var directivesFn = createDirectivesFn(fns);\n\
  directivesFn.terminal = terminal;\n\
  return directivesFn;\n\
}\n\
\n\
function getDirectives(node, start) {\n\
  var directives = [];\n\
  var attrs = {};\n\
\n\
  // https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType\n\
  switch (node.nodeType) {\n\
    case 1: // element node (visible tags plus <style>, <meta>)\n\
      // first, appendDirective directive named after node, if it exists.\n\
      var tag = node.nodeName.toLowerCase();\n\
      appendDirective(tag, 'element', node, directives, attrs);\n\
      appendAttributeDirectives(node, directives, attrs, tag);\n\
      break;\n\
    case 3: // text node\n\
      // node.nodeValue\n\
      appendDirective('interpolation', 'attribute', directives, node, attrs);\n\
      break;\n\
    case 8: // comment node\n\
      break;\n\
  }\n\
\n\
  return directives.length\n\
    ? directives.sort(priority)\n\
    : directives;\n\
}\n\
\n\
function appendAttributeDirectives(node, directives, attrs, tag) {\n\
  var attr;\n\
  for (var i = 0, n = node.attributes.length; i < n; i++) {\n\
    attr = node.attributes[i];\n\
    // http://www.w3schools.com/dom/prop_attr_specified.asp\n\
    if (!attr.specified || attrs[attr.name]) continue;\n\
    appendDirective(attr.name, 'attribute', node, directives, attrs, tag);\n\
    // if the expression wasn't added\n\
    if (!attrs[attr.name]) attrs[attr.name] = attr.value;\n\
  }\n\
}\n\
\n\
/**\n\
 * Add directive.\n\
 *\n\
 * @param {String} name The directive's name.\n\
 * @param {Array} directives The list of directives.\n\
 */\n\
\n\
function appendDirective(name, type, node, directives, attrs, tag) {\n\
  var Directive = directive.collection[name];\n\
  if (Directive && Directive.prototype[type]) {\n\
    if (!tag || !Directive.tag || (tag === Directive.tag)) {\n\
      directives.push(new Directive(node, attrs)); \n\
    }\n\
  }\n\
}\n\
\n\
/**\n\
 * Creates a template function for node children\n\
 * in an isolated JS scope.\n\
 */\n\
\n\
function createEachFn(fns) {\n\
  var n = fns.length, i;\n\
\n\
  function eachFn(scope, children, returnNode) {\n\
    var current = [];\n\
    for (i = 0; i < n; i++) {\n\
      current.push(children[i]);\n\
    }\n\
\n\
    for (i = 0; i < n; i++) {\n\
      // XXX: not sure this is correct.\n\
      // XXX: should pass in `children` and `i` instead,\n\
      //      in case something is replaced\n\
      // if (current[i] !== children[i]) XXX: search for it, so we know the index\n\
      fns[i](scope, current[i]);\n\
    }\n\
  }\n\
\n\
  return eachFn;\n\
}\n\
\n\
/**\n\
 * Creates a template function for node directives\n\
 * in an isolated JS scope.\n\
 *\n\
 * @param {Array} fns Array of directive functions.\n\
 * @return {Function} A template function for node directives.\n\
 */\n\
\n\
function createDirectivesFn(fns) {\n\
  var n = fns.length, i;\n\
\n\
  function directivesFn(scope, node, childNodes, i) {\n\
    // if we've moved this node around, then\n\
    // it should still have access to the original scope.\n\
    if (node.__scope__)\n\
      scope = node.__scope__;\n\
    \n\
    for (i = 0; i < n; i++) {\n\
      // XXX: instead of `node`, do something like `childNodes[i]`\n\
      scope = fns[i](scope, node);\n\
    }\n\
\n\
    return scope;\n\
  }\n\
\n\
  return directivesFn;\n\
}\n\
\n\
/**\n\
 * Sort by priority.\n\
 */\n\
\n\
function priority(a, b) {\n\
  return b.priority - a.priority;\n\
}//@ sourceURL=tower-template/index.js"
));
require.register("tower-oid/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Check if we need to do an IE hack.\n\
 *\n\
 * If we need to do an IE hack, see if we\n\
 * really can by seeing if we can override `toLocaleString`.\n\
 *\n\
 * @see http://stackoverflow.com/questions/3705383/ie8-bug-in-for-in-javascript-statement\n\
 * @see http://stackoverflow.com/questions/17934888/how-to-add-non-enumerable-property-in-javascript-for-ie8/17935125#17935125\n\
 */\n\
\n\
var bug = false;\n\
\n\
try {\n\
  bug = !({ toLocaleString: 3 }.propertyIsEnumerable('toLocaleString'));\n\
} catch (e) {}\n\
\n\
/**\n\
 * get/set id.\n\
 */\n\
\n\
if (bug) {\n\
  var get = function get(obj){\n\
    return primitive(obj) || ('function' === typeof obj.toLocaleString\n\
      ? set(obj)\n\
      : obj.toLocaleString);\n\
  };\n\
\n\
  var set = function set(obj){\n\
    return obj.toLocaleString = get.id++;\n\
  };\n\
} else {\n\
  var get = function get(obj){\n\
    return (obj && obj.__id__) || primitive(obj) || set(obj);\n\
  };\n\
\n\
  var set = function set(obj){\n\
    return Object.defineProperty(obj, '__id__', { enumerable: false, value: get.id++ }) && obj.__id__;\n\
  };\n\
}\n\
\n\
function primitive(obj) {\n\
  if (undefined === obj) return 'undefined';\n\
  if (null === obj) return 'null';\n\
\n\
  switch(typeof obj) {\n\
    case 'number':\n\
    case 'string':\n\
    case 'boolean':\n\
      return String(obj);\n\
  }\n\
}\n\
\n\
/**\n\
 * Incremented `id`.\n\
 */\n\
\n\
get.id = 1;\n\
\n\
/**\n\
 * Expose `get`.\n\
 */\n\
\n\
module.exports = get;//@ sourceURL=tower-oid/index.js"
));
require.register("tower-accessor/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require('tower-emitter');\n\
var oid = require('tower-oid');\n\
\n\
/**\n\
 * Expose `accessor`.\n\
 */\n\
\n\
exports = module.exports = accessor;\n\
\n\
/**\n\
 * Expose `Accessor`.\n\
 */\n\
\n\
exports.Accessor = Accessor;\n\
\n\
/**\n\
 * Map of accessors to object + property.\n\
 */\n\
\n\
exports.collection = {};\n\
\n\
/**\n\
 * Get a new `Accessor`.\n\
 *\n\
 * @param {Object} obj Object where property is defined.\n\
 * @param {String} path Path to property.\n\
 * @api public\n\
 */\n\
\n\
function accessor(obj, path) {\n\
  if (!path) {\n\
    var id = oid(obj);\n\
    var attrs = exports.collection[id] || (exports.collection[id] = {});\n\
    var name = 'undefined';\n\
    if (attrs[name]) {\n\
      obj = attrs[name];\n\
    } else {\n\
      obj = new Accessor(obj);\n\
      attrs[name] = obj;\n\
    }\n\
    return obj;\n\
  }\n\
\n\
  var parts = path.split('.');\n\
\n\
  // XXX: super messy, but works.\n\
  while (parts.length) {\n\
    var name = parts.shift();\n\
    if (obj instanceof Accessor) {\n\
      var id = oid(obj.get());\n\
      var attrs = exports.collection[id] || (exports.collection[id] = {});\n\
      if (attrs[name]) {\n\
        obj = attrs[name];\n\
      } else {\n\
        obj = obj.child(name);\n\
        attrs[name] = obj;\n\
      }\n\
    } else {\n\
      var id = oid(obj);\n\
      var attrs = exports.collection[id] || (exports.collection[id] = {});\n\
      if (attrs[name]) {\n\
        obj = attrs[name];\n\
      } else {\n\
        obj = new Accessor(obj, name);\n\
        attrs[name] = obj;\n\
      }\n\
    }\n\
  }\n\
\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Instantiate a new `Accessor`.\n\
 */\n\
\n\
function Accessor(obj, name) {\n\
  this.obj = obj;\n\
  this.name = name;\n\
}\n\
\n\
/**\n\
 * Mixin `Emitter`.\n\
 */\n\
\n\
Emitter(Accessor.prototype);\n\
\n\
/**\n\
 * Get property.\n\
 */\n\
\n\
Accessor.prototype.get = function(){\n\
  return this.name ? this.obj[this.name] : this.obj;\n\
};\n\
\n\
/**\n\
 * Set property.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return val\n\
 */\n\
\n\
Accessor.prototype.set = function(val){\n\
  var prev = this.get();\n\
  if (prev === val) return val;\n\
  this.obj[this.name] = val;\n\
  if (this.children) {\n\
    for (var name in this.children) {\n\
      if (this.children.hasOwnProperty(name))\n\
        this.children[name].replace(val);\n\
    }\n\
  }\n\
  \n\
  this.emit('change', val, prev, this.obj);\n\
  return val;\n\
};\n\
\n\
/**\n\
 * Replace property object with new object.\n\
 *\n\
 * @param {Mixed} obj\n\
 */\n\
\n\
Accessor.prototype.replace = function(obj){\n\
  this.obj = obj;\n\
  var val = this.get();\n\
\n\
  if (this.children) {\n\
    for (var name in this.children) {\n\
      if (this.children.hasOwnProperty(name))\n\
        this.children[name].replace(val);\n\
    }\n\
  }\n\
\n\
  this.emit('change', val);\n\
};\n\
\n\
/**\n\
 * Child accessor.\n\
 *\n\
 * @param {String} path Property to create child accessor from.\n\
 */\n\
\n\
Accessor.prototype.accessor = function(path){\n\
  return accessor(this, path);\n\
};\n\
\n\
Accessor.prototype.child = function(name){\n\
  this.children || (this.children = {});\n\
  return this.children[name] || (this.children[name] = accessor(this.get(), name));\n\
};//@ sourceURL=tower-accessor/index.js"
));
require.register("tower-content/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require('tower-emitter');\n\
var accessor = require('tower-accessor');\n\
var proto = require('./lib/proto');\n\
var statics = require('./lib/statics');\n\
var root;\n\
\n\
/**\n\
 * Expose `content`.\n\
 */\n\
\n\
exports = module.exports = content;\n\
\n\
/**\n\
 * Expose `collection`.\n\
 */\n\
\n\
exports.collection = [];\n\
\n\
/**\n\
 * Public API. Gets an existing content or creates a new one.\n\
 *\n\
 * @param {String} name The content's name.\n\
 * @param {Function} fn Function called on content initialization.\n\
 * @return {Content} A `Content` object.\n\
 * @api public\n\
 */\n\
\n\
function content(name, fn) {\n\
  if (exports.collection[name]) return exports.collection[name];\n\
\n\
  /**\n\
   * Class representing a specific data segment in the DOM.\n\
   *\n\
   * @class\n\
   *\n\
   * @param {Object} data The content's data.\n\
   * @api public\n\
   */\n\
\n\
  function Content(data, parent) {\n\
    this.name = name;\n\
    // all actual attributes/values\n\
    this.data = {};\n\
    this.edges = {};\n\
    this.children = [];\n\
    this.root = 'root' === name ? this : exports.root();\n\
    this.setParent(parent);\n\
    this.accessor = accessor(this, 'data');\n\
    data = Content._defaultAttrs(data, this);\n\
    if (data) this.update(data);\n\
    // for being able to emit events to instances from class.\n\
    Content.instances.push(this);\n\
    Content.emit('init', this);\n\
  }\n\
\n\
  Content.prototype = {};\n\
  Content.prototype.constructor = Content;\n\
  Content.id = name;\n\
  Content.attrs = [];\n\
  Content.attrs.__default__ = {};\n\
  Content.methods = {};\n\
  Content.instances = [];\n\
  Content.accessor = accessor(Content);\n\
\n\
  // statics\n\
\n\
  for (var key in statics) Content[key] = statics[key];\n\
\n\
  // proto\n\
\n\
  for (var key in proto) Content.prototype[key] = proto[key];\n\
\n\
  /**\n\
   * Standard `toString`.\n\
   *\n\
   * @constructor Content\n\
   * @see http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/\n\
   * @return {String} A specifically formatted String.\n\
   * @api public\n\
   */\n\
\n\
  Content.prototype.toString = function(){\n\
    return '[object Content]';\n\
  };\n\
\n\
  if (fn) Content.on('init', fn);\n\
\n\
  exports.collection.push(Content);\n\
  exports.collection[name] = Content;\n\
  exports.emit('define', Content);\n\
  return Content;\n\
}\n\
\n\
// XXX: not sure where this should go yet.\n\
proto.serialize = function(){\n\
  var json = {};\n\
  var data = this.data;\n\
  for (var key in data) {\n\
    if (content.is(data[key])) {\n\
      json[key] = data[key].serialize();\n\
    } else if (this.constructor.attrs[key]) {\n\
      json[key] = data[key];\n\
    }\n\
  }\n\
  return json;\n\
};\n\
\n\
/**\n\
 * Define a nested scope.\n\
 */\n\
\n\
statics.scope = function(name){\n\
  // only define once.\n\
  var childName = this.id + '.' + name;\n\
  if (content.defined(childName))\n\
    return content(childName);\n\
\n\
  var scope = content(childName);\n\
  scope._parent = this;\n\
  scope.scopeName = name;\n\
  \n\
  this.attr(name, 'object', function(parent, val){\n\
    var obj = scope.init(val, parent);\n\
    // XXX: tmp hack!\n\
    obj.data.name = name;\n\
    return obj.data;\n\
  });\n\
\n\
  return scope;\n\
};\n\
\n\
/**\n\
 * Mixin `Emitter`.\n\
 */\n\
\n\
Emitter(exports);\n\
Emitter(proto);\n\
Emitter(statics);\n\
\n\
/**\n\
 * Clear the collections.\n\
 * Used for testing.\n\
 *\n\
 * @chainable\n\
 * @return {Function} exports The main `content` function.\n\
 * @api public\n\
 */\n\
\n\
exports.clear = function(){\n\
  exports.off();\n\
  exports.root().remove();\n\
  exports.collection = [];\n\
  root = undefined;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Check if a content has been defined.\n\
 *\n\
 * @param {String} name The content's name.\n\
 * @return {Boolean} true if the `Content` has been defined, but false otherwise.\n\
 * @api public\n\
 */\n\
\n\
exports.defined = function(name){\n\
  return exports.collection.hasOwnProperty(name);\n\
};\n\
\n\
/**\n\
 * Check if `obj` is a `Content` object\n\
 *\n\
 * @param {Content} obj A content object.\n\
 * @return {Boolean} true if `obj` is a Content object, but false otherwise.\n\
 * @api public\n\
 */\n\
\n\
exports.is = function(obj){\n\
  return obj && '[object Content]' === obj.toString();\n\
};\n\
\n\
/**\n\
 * Get the initiated root content.\n\
 *\n\
 * @return {Content} The root content.\n\
 * @api public\n\
 */\n\
\n\
exports.root = function(){\n\
  if (root) return root;\n\
  return root = content('root').init();\n\
};//@ sourceURL=tower-content/index.js"
));
require.register("tower-content/lib/proto.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var accessor = require('tower-accessor');\n\
var indexOf = require('indexof');\n\
var slice = [].slice;\n\
\n\
/**\n\
 * Get attr.\n\
 *\n\
 * Attributes can be functions.\n\
 * However, an `action` can not be called through `get`.\n\
 *\n\
 * @constructor Content\n\
 * @param {String} str A path delimited by periods `.`.\n\
 * @return {Mixed} An attribute.\n\
 * @api public\n\
 */\n\
\n\
exports.get = function(str){\n\
  return this.edge(str).get();\n\
};\n\
\n\
/**\n\
 * Set attr.\n\
 *\n\
 * @constructor Content\n\
 * @param {String} name The attribute's name.\n\
 * @param {Mixed} val The attribute's value.\n\
 * @return {Object} The attribute's value.\n\
 * @api public\n\
 */\n\
\n\
exports.set = function(name, val){\n\
  return this.edge(name).set(val);\n\
};\n\
\n\
/**\n\
 * Create an edge to an property in the scope tree.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
exports.edge = function(str){\n\
  if (this.edges[str]) return this.edges[str];\n\
\n\
  var path = str.split('.');\n\
  var name = path.shift();\n\
\n\
  if (this.data.hasOwnProperty(name)) {\n\
    return this.edges[str] = this.accessor.accessor(str);\n\
  }\n\
\n\
  // XXX: need to clean this up\n\
  if (name === 'constructor') {\n\
    return this.edges[str] = this.constructor.accessor.accessor(path.join('.'));\n\
  }\n\
\n\
  // XXX: this should be refactored too\n\
  if (this.constructor.attrs.hasOwnProperty(name)) {\n\
    this.data[name] = undefined;\n\
    return this.edges[str] = this.accessor.accessor(str);\n\
  }\n\
\n\
  if (this.parent) {\n\
    return this.edges[str] = this.parent.edge(str);\n\
  }\n\
\n\
  console.log(this.parent)\n\
\n\
  return {\n\
    get: function(){},\n\
    set: function(){}\n\
  };\n\
  //error(this.constructor.id, 'attr', name);\n\
};\n\
\n\
exports.attr = function(path){\n\
  if (this.edges[path]) return this.edges[path];\n\
  return this.edges[path] = this.accessor.accessor(path);\n\
};\n\
\n\
/**\n\
 * Traverse content tree to find action `fn`.\n\
 *\n\
 * @param {Content} content The starting content.\n\
 * @param {String} name The action's name.\n\
 * @return {Function} The named action.\n\
 */\n\
\n\
exports.method = function(name){\n\
  if (this.constructor.methods[name])\n\
    return this.constructor.methods[name];\n\
  if (this.parent)\n\
    return this.parent.method(name);\n\
\n\
  error(this.constructor.id, 'method', name);\n\
};\n\
\n\
/**\n\
 * Update attribute value.\n\
 *\n\
 * @constructor Content\n\
 * @chainable\n\
 * @param {Object} data The new attribute value.\n\
 * @return {Function} exports The main `content` function.\n\
 * @api public\n\
 */\n\
\n\
exports.update = function(data){\n\
  this.data = data;\n\
  //for (var key in data) {\n\
  //  this.set(key, data[key]);\n\
  //}\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Notify self and all children of event.\n\
 *\n\
 * @param {String} name The attribute's name.\n\
 * @api public\n\
 */\n\
\n\
exports.broadcast = function(){\n\
  this.emit.apply(this, arguments);\n\
\n\
  if (!this.children.length) return this;\n\
\n\
  for (var i = 0, n = this.children.length; i < n; i++)\n\
    this.children[i].broadcast.apply(this.children[i], arguments);\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Apply an action.\n\
 *\n\
 * @constructor Content\n\
 * @param {String} name The action's name.\n\
 * @param {Array} args The action's list of parameters.\n\
 * @return {Function} The named action.\n\
 * @api public\n\
 */\n\
\n\
exports.apply = function(name, args){\n\
  return this.method(name).apply(this, args);\n\
};\n\
\n\
/**\n\
 * Call an action.\n\
 *\n\
 * @constructor Content\n\
 * @param {String} name The action's name.\n\
 * @return {Function} The named action.\n\
 * @api public\n\
 */\n\
\n\
exports.call = function(name){\n\
  return this.method(name).apply(this, slice.call(arguments, 1));\n\
};\n\
\n\
/**\n\
 * Emit `'remove'` event for directives\n\
 * to teardown custom functionality for their element.\n\
 *\n\
 * @constructor Content\n\
 * @chainable\n\
 * @return {Function} exports The main `content` function.\n\
 * @api public\n\
 */\n\
\n\
exports.remove = function(){\n\
  for (var i = 0, n = this.children.length; i < n; i++) {\n\
    this.children[i].remove();\n\
  }\n\
  this.emit('remove');\n\
  // XXX: not sure this is necessary\n\
  this.constructor.emit('remove', this);\n\
\n\
  var i = indexOf(this.constructor.instances, this);\n\
  if (i >= 0) this.constructor.instances.splice(i, 1);\n\
\n\
  this.root = undefined;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Standard `toString`.\n\
 *\n\
 * @constructor Content\n\
 * @see http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/\n\
 * @return {String} A specifically formatted String.\n\
 * @api public\n\
 */\n\
\n\
exports.toString = function(){\n\
  return '[object Content]';\n\
};\n\
\n\
/**\n\
 * Properly set the parent content.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
exports.setParent = function(parent){\n\
  if (!parent && 'root' !== this.name)\n\
    this.parent = this.root;\n\
  else\n\
    this.parent = parent;\n\
\n\
  if (this.parent) {\n\
    this.parent.children.push(this);\n\
    this.parent.children[this.constructor.scopeName] = this;\n\
  }\n\
};\n\
\n\
/**\n\
 * Get nested scope if exists.\n\
 */\n\
\n\
exports.scope = function(name){\n\
  return this.children[name];\n\
};\n\
\n\
function error(id, type, name) {\n\
  throw new Error(\"content('\" + id + \"') \" + type + \" [\" + name + \"] not found.\");\n\
}\n\
//@ sourceURL=tower-content/lib/proto.js"
));
require.register("tower-content/lib/statics.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var attr = require('tower-attr');\n\
\n\
/**\n\
 * Instantiate a new `Content`.\n\
 *\n\
 * @constructor Content\n\
 * @param {Object} data The content's data to proxy.\n\
 * @param {Parent} [parent] Parent content (defaults to the root content scope).\n\
 * @return {Content} self\n\
 * @api public\n\
 */\n\
\n\
exports.init = function(data, parent){\n\
  return new this(data, parent);\n\
};\n\
\n\
/**\n\
 * Go up the scope chain to the parent-defining scope.\n\
 */\n\
\n\
exports.parent = function(){\n\
  return this._parent || this;\n\
};\n\
\n\
/**\n\
 * Define attr with the given `name` and `options`.\n\
 *\n\
 * @constructor Content\n\
 * @chainable\n\
 * @param {String} name\n\
 * @param {Object} options\n\
 * @return {Function} exports The main `content` function.\n\
 * @api public\n\
 */\n\
\n\
exports.attr = function(name, type, options){\n\
  var obj = this.context = attr(name, type, options, this.id + '.' + name);\n\
  this.attrs[name] = obj;\n\
  this.attrs.push(obj);\n\
  if (undefined !== obj.value) this.attrs.__default__[name] = obj;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Define a method.\n\
 *\n\
 * @constructor Content\n\
 * @chainable\n\
 * @param {String} name The action's name.\n\
 * @param {Function} fn The action's function definition.\n\
 * @return {Function} exports The main `content` function.\n\
 * @api public\n\
 */\n\
\n\
exports.method = function(name, fn){\n\
  this.methods[name] = fn;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Define an action.\n\
 */\n\
\n\
exports.action = exports.method;\n\
\n\
/**\n\
 * Define a helper.\n\
 *\n\
 * This exists purely to make code easier to separate/distinguish.\n\
 */\n\
\n\
exports.helper = exports.method;\n\
\n\
/**\n\
 * Returns the default model attributes with their values.\n\
 *\n\
 * @constructor Content\n\
 * @return {Object} The default model attributes with their values.\n\
 * @api private\n\
 */\n\
\n\
exports._defaultAttrs = function(attrs, binding){\n\
  // XXX: this can be optimized further.\n\
  var defaultAttrs = this.attrs.__default__;\n\
  attrs || (attrs = {});\n\
  for (var name in defaultAttrs) {\n\
    if (null == attrs[name] || 'function' === defaultAttrs[name].valueType) {\n\
      attrs[name] = defaultAttrs[name].apply(binding, attrs[name]);\n\
    }\n\
  }\n\
  return attrs;\n\
};//@ sourceURL=tower-content/lib/statics.js"
));
require.register("ftlabs-fastclick/lib/fastclick.js", Function("exports, require, module",
"/**\n\
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.\n\
 *\n\
 * @version 0.6.11\n\
 * @codingstandard ftlabs-jsv2\n\
 * @copyright The Financial Times Limited [All Rights Reserved]\n\
 * @license MIT License (see LICENSE.txt)\n\
 */\n\
\n\
/*jslint browser:true, node:true*/\n\
/*global define, Event, Node*/\n\
\n\
\n\
/**\n\
 * Instantiate fast-clicking listeners on the specificed layer.\n\
 *\n\
 * @constructor\n\
 * @param {Element} layer The layer to listen on\n\
 */\n\
function FastClick(layer) {\n\
\t'use strict';\n\
\tvar oldOnClick, self = this;\n\
\n\
\n\
\t/**\n\
\t * Whether a click is currently being tracked.\n\
\t *\n\
\t * @type boolean\n\
\t */\n\
\tthis.trackingClick = false;\n\
\n\
\n\
\t/**\n\
\t * Timestamp for when when click tracking started.\n\
\t *\n\
\t * @type number\n\
\t */\n\
\tthis.trackingClickStart = 0;\n\
\n\
\n\
\t/**\n\
\t * The element being tracked for a click.\n\
\t *\n\
\t * @type EventTarget\n\
\t */\n\
\tthis.targetElement = null;\n\
\n\
\n\
\t/**\n\
\t * X-coordinate of touch start event.\n\
\t *\n\
\t * @type number\n\
\t */\n\
\tthis.touchStartX = 0;\n\
\n\
\n\
\t/**\n\
\t * Y-coordinate of touch start event.\n\
\t *\n\
\t * @type number\n\
\t */\n\
\tthis.touchStartY = 0;\n\
\n\
\n\
\t/**\n\
\t * ID of the last touch, retrieved from Touch.identifier.\n\
\t *\n\
\t * @type number\n\
\t */\n\
\tthis.lastTouchIdentifier = 0;\n\
\n\
\n\
\t/**\n\
\t * Touchmove boundary, beyond which a click will be cancelled.\n\
\t *\n\
\t * @type number\n\
\t */\n\
\tthis.touchBoundary = 10;\n\
\n\
\n\
\t/**\n\
\t * The FastClick layer.\n\
\t *\n\
\t * @type Element\n\
\t */\n\
\tthis.layer = layer;\n\
\n\
\tif (!layer || !layer.nodeType) {\n\
\t\tthrow new TypeError('Layer must be a document node');\n\
\t}\n\
\n\
\t/** @type function() */\n\
\tthis.onClick = function() { return FastClick.prototype.onClick.apply(self, arguments); };\n\
\n\
\t/** @type function() */\n\
\tthis.onMouse = function() { return FastClick.prototype.onMouse.apply(self, arguments); };\n\
\n\
\t/** @type function() */\n\
\tthis.onTouchStart = function() { return FastClick.prototype.onTouchStart.apply(self, arguments); };\n\
\n\
\t/** @type function() */\n\
\tthis.onTouchMove = function() { return FastClick.prototype.onTouchMove.apply(self, arguments); };\n\
\n\
\t/** @type function() */\n\
\tthis.onTouchEnd = function() { return FastClick.prototype.onTouchEnd.apply(self, arguments); };\n\
\n\
\t/** @type function() */\n\
\tthis.onTouchCancel = function() { return FastClick.prototype.onTouchCancel.apply(self, arguments); };\n\
\n\
\tif (FastClick.notNeeded(layer)) {\n\
\t\treturn;\n\
\t}\n\
\n\
\t// Set up event handlers as required\n\
\tif (this.deviceIsAndroid) {\n\
\t\tlayer.addEventListener('mouseover', this.onMouse, true);\n\
\t\tlayer.addEventListener('mousedown', this.onMouse, true);\n\
\t\tlayer.addEventListener('mouseup', this.onMouse, true);\n\
\t}\n\
\n\
\tlayer.addEventListener('click', this.onClick, true);\n\
\tlayer.addEventListener('touchstart', this.onTouchStart, false);\n\
\tlayer.addEventListener('touchmove', this.onTouchMove, false);\n\
\tlayer.addEventListener('touchend', this.onTouchEnd, false);\n\
\tlayer.addEventListener('touchcancel', this.onTouchCancel, false);\n\
\n\
\t// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)\n\
\t// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick\n\
\t// layer when they are cancelled.\n\
\tif (!Event.prototype.stopImmediatePropagation) {\n\
\t\tlayer.removeEventListener = function(type, callback, capture) {\n\
\t\t\tvar rmv = Node.prototype.removeEventListener;\n\
\t\t\tif (type === 'click') {\n\
\t\t\t\trmv.call(layer, type, callback.hijacked || callback, capture);\n\
\t\t\t} else {\n\
\t\t\t\trmv.call(layer, type, callback, capture);\n\
\t\t\t}\n\
\t\t};\n\
\n\
\t\tlayer.addEventListener = function(type, callback, capture) {\n\
\t\t\tvar adv = Node.prototype.addEventListener;\n\
\t\t\tif (type === 'click') {\n\
\t\t\t\tadv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {\n\
\t\t\t\t\tif (!event.propagationStopped) {\n\
\t\t\t\t\t\tcallback(event);\n\
\t\t\t\t\t}\n\
\t\t\t\t}), capture);\n\
\t\t\t} else {\n\
\t\t\t\tadv.call(layer, type, callback, capture);\n\
\t\t\t}\n\
\t\t};\n\
\t}\n\
\n\
\t// If a handler is already declared in the element's onclick attribute, it will be fired before\n\
\t// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and\n\
\t// adding it as listener.\n\
\tif (typeof layer.onclick === 'function') {\n\
\n\
\t\t// Android browser on at least 3.2 requires a new reference to the function in layer.onclick\n\
\t\t// - the old one won't work if passed to addEventListener directly.\n\
\t\toldOnClick = layer.onclick;\n\
\t\tlayer.addEventListener('click', function(event) {\n\
\t\t\toldOnClick(event);\n\
\t\t}, false);\n\
\t\tlayer.onclick = null;\n\
\t}\n\
}\n\
\n\
\n\
/**\n\
 * Android requires exceptions.\n\
 *\n\
 * @type boolean\n\
 */\n\
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;\n\
\n\
\n\
/**\n\
 * iOS requires exceptions.\n\
 *\n\
 * @type boolean\n\
 */\n\
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);\n\
\n\
\n\
/**\n\
 * iOS 4 requires an exception for select elements.\n\
 *\n\
 * @type boolean\n\
 */\n\
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && (/OS 4_\\d(_\\d)?/).test(navigator.userAgent);\n\
\n\
\n\
/**\n\
 * iOS 6.0(+?) requires the target element to be manually derived\n\
 *\n\
 * @type boolean\n\
 */\n\
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && (/OS ([6-9]|\\d{2})_\\d/).test(navigator.userAgent);\n\
\n\
\n\
/**\n\
 * Determine whether a given element requires a native click.\n\
 *\n\
 * @param {EventTarget|Element} target Target DOM element\n\
 * @returns {boolean} Returns true if the element needs a native click\n\
 */\n\
FastClick.prototype.needsClick = function(target) {\n\
\t'use strict';\n\
\tswitch (target.nodeName.toLowerCase()) {\n\
\n\
\t// Don't send a synthetic click to disabled inputs (issue #62)\n\
\tcase 'button':\n\
\tcase 'select':\n\
\tcase 'textarea':\n\
\t\tif (target.disabled) {\n\
\t\t\treturn true;\n\
\t\t}\n\
\n\
\t\tbreak;\n\
\tcase 'input':\n\
\n\
\t\t// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)\n\
\t\tif ((this.deviceIsIOS && target.type === 'file') || target.disabled) {\n\
\t\t\treturn true;\n\
\t\t}\n\
\n\
\t\tbreak;\n\
\tcase 'label':\n\
\tcase 'video':\n\
\t\treturn true;\n\
\t}\n\
\n\
\treturn (/\\bneedsclick\\b/).test(target.className);\n\
};\n\
\n\
\n\
/**\n\
 * Determine whether a given element requires a call to focus to simulate click into element.\n\
 *\n\
 * @param {EventTarget|Element} target Target DOM element\n\
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.\n\
 */\n\
FastClick.prototype.needsFocus = function(target) {\n\
\t'use strict';\n\
\tswitch (target.nodeName.toLowerCase()) {\n\
\tcase 'textarea':\n\
\t\treturn true;\n\
\tcase 'select':\n\
\t\treturn !this.deviceIsAndroid;\n\
\tcase 'input':\n\
\t\tswitch (target.type) {\n\
\t\tcase 'button':\n\
\t\tcase 'checkbox':\n\
\t\tcase 'file':\n\
\t\tcase 'image':\n\
\t\tcase 'radio':\n\
\t\tcase 'submit':\n\
\t\t\treturn false;\n\
\t\t}\n\
\n\
\t\t// No point in attempting to focus disabled inputs\n\
\t\treturn !target.disabled && !target.readOnly;\n\
\tdefault:\n\
\t\treturn (/\\bneedsfocus\\b/).test(target.className);\n\
\t}\n\
};\n\
\n\
\n\
/**\n\
 * Send a click event to the specified element.\n\
 *\n\
 * @param {EventTarget|Element} targetElement\n\
 * @param {Event} event\n\
 */\n\
FastClick.prototype.sendClick = function(targetElement, event) {\n\
\t'use strict';\n\
\tvar clickEvent, touch;\n\
\n\
\t// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)\n\
\tif (document.activeElement && document.activeElement !== targetElement) {\n\
\t\tdocument.activeElement.blur();\n\
\t}\n\
\n\
\ttouch = event.changedTouches[0];\n\
\n\
\t// Synthesise a click event, with an extra attribute so it can be tracked\n\
\tclickEvent = document.createEvent('MouseEvents');\n\
\tclickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);\n\
\tclickEvent.forwardedTouchEvent = true;\n\
\ttargetElement.dispatchEvent(clickEvent);\n\
};\n\
\n\
FastClick.prototype.determineEventType = function(targetElement) {\n\
\t'use strict';\n\
\n\
\t//Issue #159: Android Chrome Select Box does not open with a synthetic click event\n\
\tif (this.deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {\n\
\t\treturn 'mousedown';\n\
\t}\n\
\n\
\treturn 'click';\n\
};\n\
\n\
\n\
/**\n\
 * @param {EventTarget|Element} targetElement\n\
 */\n\
FastClick.prototype.focus = function(targetElement) {\n\
\t'use strict';\n\
\tvar length;\n\
\n\
\t// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.\n\
\tif (this.deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {\n\
\t\tlength = targetElement.value.length;\n\
\t\ttargetElement.setSelectionRange(length, length);\n\
\t} else {\n\
\t\ttargetElement.focus();\n\
\t}\n\
};\n\
\n\
\n\
/**\n\
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.\n\
 *\n\
 * @param {EventTarget|Element} targetElement\n\
 */\n\
FastClick.prototype.updateScrollParent = function(targetElement) {\n\
\t'use strict';\n\
\tvar scrollParent, parentElement;\n\
\n\
\tscrollParent = targetElement.fastClickScrollParent;\n\
\n\
\t// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the\n\
\t// target element was moved to another parent.\n\
\tif (!scrollParent || !scrollParent.contains(targetElement)) {\n\
\t\tparentElement = targetElement;\n\
\t\tdo {\n\
\t\t\tif (parentElement.scrollHeight > parentElement.offsetHeight) {\n\
\t\t\t\tscrollParent = parentElement;\n\
\t\t\t\ttargetElement.fastClickScrollParent = parentElement;\n\
\t\t\t\tbreak;\n\
\t\t\t}\n\
\n\
\t\t\tparentElement = parentElement.parentElement;\n\
\t\t} while (parentElement);\n\
\t}\n\
\n\
\t// Always update the scroll top tracker if possible.\n\
\tif (scrollParent) {\n\
\t\tscrollParent.fastClickLastScrollTop = scrollParent.scrollTop;\n\
\t}\n\
};\n\
\n\
\n\
/**\n\
 * @param {EventTarget} targetElement\n\
 * @returns {Element|EventTarget}\n\
 */\n\
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {\n\
\t'use strict';\n\
\n\
\t// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.\n\
\tif (eventTarget.nodeType === Node.TEXT_NODE) {\n\
\t\treturn eventTarget.parentNode;\n\
\t}\n\
\n\
\treturn eventTarget;\n\
};\n\
\n\
\n\
/**\n\
 * On touch start, record the position and scroll offset.\n\
 *\n\
 * @param {Event} event\n\
 * @returns {boolean}\n\
 */\n\
FastClick.prototype.onTouchStart = function(event) {\n\
\t'use strict';\n\
\tvar targetElement, touch, selection;\n\
\n\
\t// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).\n\
\tif (event.targetTouches.length > 1) {\n\
\t\treturn true;\n\
\t}\n\
\n\
\ttargetElement = this.getTargetElementFromEventTarget(event.target);\n\
\ttouch = event.targetTouches[0];\n\
\n\
\tif (this.deviceIsIOS) {\n\
\n\
\t\t// Only trusted events will deselect text on iOS (issue #49)\n\
\t\tselection = window.getSelection();\n\
\t\tif (selection.rangeCount && !selection.isCollapsed) {\n\
\t\t\treturn true;\n\
\t\t}\n\
\n\
\t\tif (!this.deviceIsIOS4) {\n\
\n\
\t\t\t// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):\n\
\t\t\t// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched\n\
\t\t\t// with the same identifier as the touch event that previously triggered the click that triggered the alert.\n\
\t\t\t// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an\n\
\t\t\t// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.\n\
\t\t\tif (touch.identifier === this.lastTouchIdentifier) {\n\
\t\t\t\tevent.preventDefault();\n\
\t\t\t\treturn false;\n\
\t\t\t}\n\
\n\
\t\t\tthis.lastTouchIdentifier = touch.identifier;\n\
\n\
\t\t\t// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:\n\
\t\t\t// 1) the user does a fling scroll on the scrollable layer\n\
\t\t\t// 2) the user stops the fling scroll with another tap\n\
\t\t\t// then the event.target of the last 'touchend' event will be the element that was under the user's finger\n\
\t\t\t// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check\n\
\t\t\t// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).\n\
\t\t\tthis.updateScrollParent(targetElement);\n\
\t\t}\n\
\t}\n\
\n\
\tthis.trackingClick = true;\n\
\tthis.trackingClickStart = event.timeStamp;\n\
\tthis.targetElement = targetElement;\n\
\n\
\tthis.touchStartX = touch.pageX;\n\
\tthis.touchStartY = touch.pageY;\n\
\n\
\t// Prevent phantom clicks on fast double-tap (issue #36)\n\
\tif ((event.timeStamp - this.lastClickTime) < 200) {\n\
\t\tevent.preventDefault();\n\
\t}\n\
\n\
\treturn true;\n\
};\n\
\n\
\n\
/**\n\
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.\n\
 *\n\
 * @param {Event} event\n\
 * @returns {boolean}\n\
 */\n\
FastClick.prototype.touchHasMoved = function(event) {\n\
\t'use strict';\n\
\tvar touch = event.changedTouches[0], boundary = this.touchBoundary;\n\
\n\
\tif (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {\n\
\t\treturn true;\n\
\t}\n\
\n\
\treturn false;\n\
};\n\
\n\
\n\
/**\n\
 * Update the last position.\n\
 *\n\
 * @param {Event} event\n\
 * @returns {boolean}\n\
 */\n\
FastClick.prototype.onTouchMove = function(event) {\n\
\t'use strict';\n\
\tif (!this.trackingClick) {\n\
\t\treturn true;\n\
\t}\n\
\n\
\t// If the touch has moved, cancel the click tracking\n\
\tif (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {\n\
\t\tthis.trackingClick = false;\n\
\t\tthis.targetElement = null;\n\
\t}\n\
\n\
\treturn true;\n\
};\n\
\n\
\n\
/**\n\
 * Attempt to find the labelled control for the given label element.\n\
 *\n\
 * @param {EventTarget|HTMLLabelElement} labelElement\n\
 * @returns {Element|null}\n\
 */\n\
FastClick.prototype.findControl = function(labelElement) {\n\
\t'use strict';\n\
\n\
\t// Fast path for newer browsers supporting the HTML5 control attribute\n\
\tif (labelElement.control !== undefined) {\n\
\t\treturn labelElement.control;\n\
\t}\n\
\n\
\t// All browsers under test that support touch events also support the HTML5 htmlFor attribute\n\
\tif (labelElement.htmlFor) {\n\
\t\treturn document.getElementById(labelElement.htmlFor);\n\
\t}\n\
\n\
\t// If no for attribute exists, attempt to retrieve the first labellable descendant element\n\
\t// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label\n\
\treturn labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');\n\
};\n\
\n\
\n\
/**\n\
 * On touch end, determine whether to send a click event at once.\n\
 *\n\
 * @param {Event} event\n\
 * @returns {boolean}\n\
 */\n\
FastClick.prototype.onTouchEnd = function(event) {\n\
\t'use strict';\n\
\tvar forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;\n\
\n\
\tif (!this.trackingClick) {\n\
\t\treturn true;\n\
\t}\n\
\n\
\t// Prevent phantom clicks on fast double-tap (issue #36)\n\
\tif ((event.timeStamp - this.lastClickTime) < 200) {\n\
\t\tthis.cancelNextClick = true;\n\
\t\treturn true;\n\
\t}\n\
\n\
\t// Reset to prevent wrong click cancel on input (issue #156).\n\
\tthis.cancelNextClick = false;\n\
\n\
\tthis.lastClickTime = event.timeStamp;\n\
\n\
\ttrackingClickStart = this.trackingClickStart;\n\
\tthis.trackingClick = false;\n\
\tthis.trackingClickStart = 0;\n\
\n\
\t// On some iOS devices, the targetElement supplied with the event is invalid if the layer\n\
\t// is performing a transition or scroll, and has to be re-detected manually. Note that\n\
\t// for this to function correctly, it must be called *after* the event target is checked!\n\
\t// See issue #57; also filed as rdar://13048589 .\n\
\tif (this.deviceIsIOSWithBadTarget) {\n\
\t\ttouch = event.changedTouches[0];\n\
\n\
\t\t// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null\n\
\t\ttargetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;\n\
\t\ttargetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;\n\
\t}\n\
\n\
\ttargetTagName = targetElement.tagName.toLowerCase();\n\
\tif (targetTagName === 'label') {\n\
\t\tforElement = this.findControl(targetElement);\n\
\t\tif (forElement) {\n\
\t\t\tthis.focus(targetElement);\n\
\t\t\tif (this.deviceIsAndroid) {\n\
\t\t\t\treturn false;\n\
\t\t\t}\n\
\n\
\t\t\ttargetElement = forElement;\n\
\t\t}\n\
\t} else if (this.needsFocus(targetElement)) {\n\
\n\
\t\t// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.\n\
\t\t// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).\n\
\t\tif ((event.timeStamp - trackingClickStart) > 100 || (this.deviceIsIOS && window.top !== window && targetTagName === 'input')) {\n\
\t\t\tthis.targetElement = null;\n\
\t\t\treturn false;\n\
\t\t}\n\
\n\
\t\tthis.focus(targetElement);\n\
\n\
\t\t// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.\n\
\t\tif (!this.deviceIsIOS4 || targetTagName !== 'select') {\n\
\t\t\tthis.targetElement = null;\n\
\t\t\tevent.preventDefault();\n\
\t\t}\n\
\n\
\t\treturn false;\n\
\t}\n\
\n\
\tif (this.deviceIsIOS && !this.deviceIsIOS4) {\n\
\n\
\t\t// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled\n\
\t\t// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).\n\
\t\tscrollParent = targetElement.fastClickScrollParent;\n\
\t\tif (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {\n\
\t\t\treturn true;\n\
\t\t}\n\
\t}\n\
\n\
\t// Prevent the actual click from going though - unless the target node is marked as requiring\n\
\t// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.\n\
\tif (!this.needsClick(targetElement)) {\n\
\t\tevent.preventDefault();\n\
\t\tthis.sendClick(targetElement, event);\n\
\t}\n\
\n\
\treturn false;\n\
};\n\
\n\
\n\
/**\n\
 * On touch cancel, stop tracking the click.\n\
 *\n\
 * @returns {void}\n\
 */\n\
FastClick.prototype.onTouchCancel = function() {\n\
\t'use strict';\n\
\tthis.trackingClick = false;\n\
\tthis.targetElement = null;\n\
};\n\
\n\
\n\
/**\n\
 * Determine mouse events which should be permitted.\n\
 *\n\
 * @param {Event} event\n\
 * @returns {boolean}\n\
 */\n\
FastClick.prototype.onMouse = function(event) {\n\
\t'use strict';\n\
\n\
\t// If a target element was never set (because a touch event was never fired) allow the event\n\
\tif (!this.targetElement) {\n\
\t\treturn true;\n\
\t}\n\
\n\
\tif (event.forwardedTouchEvent) {\n\
\t\treturn true;\n\
\t}\n\
\n\
\t// Programmatically generated events targeting a specific element should be permitted\n\
\tif (!event.cancelable) {\n\
\t\treturn true;\n\
\t}\n\
\n\
\t// Derive and check the target element to see whether the mouse event needs to be permitted;\n\
\t// unless explicitly enabled, prevent non-touch click events from triggering actions,\n\
\t// to prevent ghost/doubleclicks.\n\
\tif (!this.needsClick(this.targetElement) || this.cancelNextClick) {\n\
\n\
\t\t// Prevent any user-added listeners declared on FastClick element from being fired.\n\
\t\tif (event.stopImmediatePropagation) {\n\
\t\t\tevent.stopImmediatePropagation();\n\
\t\t} else {\n\
\n\
\t\t\t// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)\n\
\t\t\tevent.propagationStopped = true;\n\
\t\t}\n\
\n\
\t\t// Cancel the event\n\
\t\tevent.stopPropagation();\n\
\t\tevent.preventDefault();\n\
\n\
\t\treturn false;\n\
\t}\n\
\n\
\t// If the mouse event is permitted, return true for the action to go through.\n\
\treturn true;\n\
};\n\
\n\
\n\
/**\n\
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring\n\
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or\n\
 * an actual click which should be permitted.\n\
 *\n\
 * @param {Event} event\n\
 * @returns {boolean}\n\
 */\n\
FastClick.prototype.onClick = function(event) {\n\
\t'use strict';\n\
\tvar permitted;\n\
\n\
\t// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.\n\
\tif (this.trackingClick) {\n\
\t\tthis.targetElement = null;\n\
\t\tthis.trackingClick = false;\n\
\t\treturn true;\n\
\t}\n\
\n\
\t// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.\n\
\tif (event.target.type === 'submit' && event.detail === 0) {\n\
\t\treturn true;\n\
\t}\n\
\n\
\tpermitted = this.onMouse(event);\n\
\n\
\t// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.\n\
\tif (!permitted) {\n\
\t\tthis.targetElement = null;\n\
\t}\n\
\n\
\t// If clicks are permitted, return true for the action to go through.\n\
\treturn permitted;\n\
};\n\
\n\
\n\
/**\n\
 * Remove all FastClick's event listeners.\n\
 *\n\
 * @returns {void}\n\
 */\n\
FastClick.prototype.destroy = function() {\n\
\t'use strict';\n\
\tvar layer = this.layer;\n\
\n\
\tif (this.deviceIsAndroid) {\n\
\t\tlayer.removeEventListener('mouseover', this.onMouse, true);\n\
\t\tlayer.removeEventListener('mousedown', this.onMouse, true);\n\
\t\tlayer.removeEventListener('mouseup', this.onMouse, true);\n\
\t}\n\
\n\
\tlayer.removeEventListener('click', this.onClick, true);\n\
\tlayer.removeEventListener('touchstart', this.onTouchStart, false);\n\
\tlayer.removeEventListener('touchmove', this.onTouchMove, false);\n\
\tlayer.removeEventListener('touchend', this.onTouchEnd, false);\n\
\tlayer.removeEventListener('touchcancel', this.onTouchCancel, false);\n\
};\n\
\n\
\n\
/**\n\
 * Check whether FastClick is needed.\n\
 *\n\
 * @param {Element} layer The layer to listen on\n\
 */\n\
FastClick.notNeeded = function(layer) {\n\
\t'use strict';\n\
\tvar metaViewport;\n\
\tvar chromeVersion;\n\
\n\
\t// Devices that don't support touch don't need FastClick\n\
\tif (typeof window.ontouchstart === 'undefined') {\n\
\t\treturn true;\n\
\t}\n\
\n\
\t// Chrome version - zero for other browsers\n\
\tchromeVersion = +(/Chrome\\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];\n\
\n\
\tif (chromeVersion) {\n\
\n\
\t\tif (FastClick.prototype.deviceIsAndroid) {\n\
\t\t\tmetaViewport = document.querySelector('meta[name=viewport]');\n\
\t\t\t\n\
\t\t\tif (metaViewport) {\n\
\t\t\t\t// Chrome on Android with user-scalable=\"no\" doesn't need FastClick (issue #89)\n\
\t\t\t\tif (metaViewport.content.indexOf('user-scalable=no') !== -1) {\n\
\t\t\t\t\treturn true;\n\
\t\t\t\t}\n\
\t\t\t\t// Chrome 32 and above with width=device-width or less don't need FastClick\n\
\t\t\t\tif (chromeVersion > 31 && window.innerWidth <= window.screen.width) {\n\
\t\t\t\t\treturn true;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t// Chrome desktop doesn't need FastClick (issue #15)\n\
\t\t} else {\n\
\t\t\treturn true;\n\
\t\t}\n\
\t}\n\
\n\
\t// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)\n\
\tif (layer.style.msTouchAction === 'none') {\n\
\t\treturn true;\n\
\t}\n\
\n\
\treturn false;\n\
};\n\
\n\
\n\
/**\n\
 * Factory method for creating a FastClick object\n\
 *\n\
 * @param {Element} layer The layer to listen on\n\
 */\n\
FastClick.attach = function(layer) {\n\
\t'use strict';\n\
\treturn new FastClick(layer);\n\
};\n\
\n\
\n\
if (typeof define !== 'undefined' && define.amd) {\n\
\n\
\t// AMD. Register as an anonymous module.\n\
\tdefine(function() {\n\
\t\t'use strict';\n\
\t\treturn FastClick;\n\
\t});\n\
} else if (typeof module !== 'undefined' && module.exports) {\n\
\tmodule.exports = FastClick.attach;\n\
\tmodule.exports.FastClick = FastClick;\n\
} else {\n\
\twindow.FastClick = FastClick;\n\
}\n\
//@ sourceURL=ftlabs-fastclick/lib/fastclick.js"
));
require.register("tower-event-directive/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var directive = require('tower-directive');\n\
var fastclick = require('fastclick');\n\
var event = require('event');\n\
\n\
/**\n\
 * Expose `eventDirective`.\n\
 */\n\
\n\
exports = module.exports = eventDirective;\n\
\n\
/**\n\
 * Events supported.\n\
 */\n\
\n\
exports.events = [\n\
  'change',\n\
  'click',\n\
  'mousedown',\n\
  'mouseup',\n\
  'blur',\n\
  'focus',\n\
  'input',\n\
  'keydown',\n\
  'keypress',\n\
  'keyup'\n\
];\n\
\n\
/**\n\
 * Define event directive.\n\
 *\n\
 * @param {String} name Event name.\n\
 */\n\
\n\
function eventDirective(name) {\n\
  if (!name) return all();\n\
  if (directive.defined('on-' + name)) return;\n\
\n\
  if ('click' == name) {\n\
    // add fast click.\n\
    event.bind(window, 'load', onload);\n\
\n\
    function onload() {\n\
      event.unbind(window, 'load', onload);\n\
      fastclick(document.body);\n\
    }\n\
  }\n\
\n\
  directive('on-' + name, function(scope, el, exp){\n\
\n\
    // make link clickable\n\
\n\
    if ('a' === el.tagName.toLowerCase() && !el.getAttribute('href'))\n\
      el.setAttribute('href', '#');\n\
\n\
    // listen\n\
\n\
    event.bind(el, name, handle);\n\
\n\
    // unlisten\n\
\n\
    scope.on('remove', function(){\n\
      event.unbind(el, name, handle);\n\
    });\n\
\n\
    function handle(e) {\n\
      // so they can be used by expression\n\
      scope.data.event = e;\n\
      scope.data['this'] = el;\n\
      var res = exp.fn(scope);\n\
      delete scope.data.event;\n\
      delete scope.data['this'];\n\
      \n\
      if (false === res) {\n\
        e.preventDefault();\n\
        e.stopPropagation();\n\
        e.stopImmediatePropagation();\n\
      }\n\
    }\n\
  });\n\
}\n\
\n\
/**\n\
 * Define all event directives.\n\
 */\n\
\n\
function all() {\n\
  for (var i = 0, n = exports.events.length; i < n; i++) {\n\
    exports(exports.events[i]);\n\
  }\n\
}//@ sourceURL=tower-event-directive/index.js"
));
require.register("tower-text-directive/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var directive = require('tower-directive');\n\
\n\
/**\n\
 * Define `data-text` directive.\n\
 */\n\
\n\
directive('data-text', function(scope, el, exp){\n\
  bind() && exp.watch(scope, bind);\n\
\n\
  function bind() {\n\
    var val = exp.fn(scope);\n\
    el.textContent = undefined === val ? '' : val;\n\
    return exp;\n\
  }\n\
});//@ sourceURL=tower-text-directive/index.js"
));
require.register("tower-observable-array/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require('tower-emitter');\n\
\n\
/**\n\
 * Define property method.\n\
 */\n\
\n\
var defineProperty;\n\
\n\
try {\n\
  // IE8 has it but it only works on DOM elements.\n\
  Object.defineProperty({}, 'foo', { value: true });\n\
  defineProperty = Object.defineProperty;\n\
} catch (err) {\n\
  defineProperty = function(obj, prop, desc){\n\
    obj[prop] = desc.value;\n\
  };\n\
}\n\
\n\
var slice = Array.prototype.slice;\n\
var proto = [];\n\
\n\
/**\n\
 * Define methods.\n\
 */\n\
\n\
var methods = {\n\
  pop: pop,\n\
  push: push, \n\
  reverse: reverse,\n\
  shift: shift,\n\
  sort: sort,\n\
  splice: splice,\n\
  unshift: unshift\n\
};\n\
\n\
/**\n\
 * Mixin `Emitter`.\n\
 */\n\
\n\
Emitter(methods);\n\
\n\
for (var method in methods)\n\
  defineMethod(method, methods[method]);\n\
\n\
function defineMethod(name, fn) {\n\
  defineProperty(proto, name, { value: fn });\n\
}\n\
\n\
// if a modern browser\n\
if ({}.__proto__) {\n\
  var wrap = function wrap(arr) {\n\
    if (arr.__observable__) return arr;\n\
    arr.__observable__ = true;\n\
    arr.__proto__ = proto;\n\
    return arr;\n\
  }\n\
\n\
  var unwrap = function unwrap(arr) {\n\
    delete arr.__observable__;\n\
    arr.__proto__ = Array.prototype;\n\
    return arr;\n\
  }\n\
} else {\n\
  var wrap = function wrap(arr) {\n\
    if (arr.__observable__) return arr;\n\
    arr.__observable__ = true;\n\
    for (var name in methods) {\n\
      defineProperty(arr, name, {\n\
        value: proto[name],\n\
        configurable: true\n\
      });\n\
    }\n\
    return arr;\n\
  };\n\
\n\
  var unwrap = function unwrap(arr) {\n\
    for (var name in methods) {\n\
      delete arr[name];\n\
    }\n\
    delete arr.__observable__;\n\
    return arr;\n\
  };\n\
}\n\
\n\
/**\n\
 * Expose `wrap`.\n\
 */\n\
\n\
exports = module.exports = wrap;\n\
\n\
/**\n\
 * Expose `unwrap`.\n\
 */\n\
\n\
exports.unwrap = unwrap;\n\
\n\
/**\n\
 * Add an element to the end of the collection.\n\
 *\n\
 * @return {Integer} The collection length.\n\
 * @api public\n\
 */\n\
\n\
function push() {\n\
  var startIndex = this.length;\n\
  var result = Array.prototype.push.apply(this, arguments);\n\
  if (this.hasListeners('add'))\n\
    this.emit('add', this.slice(startIndex, this.length), startIndex);\n\
  return result;\n\
}\n\
\n\
/**\n\
 * Remove the last element from the collection.\n\
 *\n\
 * @return {Integer} The collection length.\n\
 * @api public\n\
 */\n\
\n\
function pop() {\n\
  var startIndex = this.length;\n\
  var result = Array.prototype.pop.apply(this, arguments);\n\
  if (this.hasListeners('remove'))\n\
    this.emit('remove', [result], startIndex - 1);\n\
  return result;\n\
}\n\
\n\
/**\n\
 * Remove the first element from the collection.\n\
 *\n\
 * @return {Integer} The collection length.\n\
 * @api public\n\
 */\n\
\n\
function shift() {\n\
  var startIndex = this.length;\n\
  var result = Array.prototype.shift.apply(this, arguments);\n\
  if (this.hasListeners('remove'))\n\
    this.emit('remove', [result], 0);\n\
  return result;\n\
}\n\
\n\
/**\n\
 * Add an element to the beginning of the collection.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function unshift() {\n\
  var length = this.length;\n\
  var result = Array.prototype.unshift.apply(this, arguments);\n\
  if (this.hasListeners('add'))\n\
    this.emit('add', this.slice(0, this.length - length), 0);\n\
  return result;\n\
}\n\
\n\
// XXX: maybe it emits a `replace` event if \n\
// it both adds and removes at the same time.\n\
function splice(index, length) {\n\
  var startIndex = this.length;\n\
  var removed = Array.prototype.splice.apply(this, arguments);\n\
  this.length = this.length;\n\
  if (removed.length && this.hasListeners('remove')) {\n\
    this.emit('remove', removed, index);\n\
  }\n\
  if (arguments.length > 2 && this.hasListeners('add')) {\n\
    this.emit('add', slice.call(arguments, 2), index);\n\
  }\n\
  return removed;\n\
}\n\
\n\
function reverse() {\n\
  var result = Array.prototype.reverse.apply(this, arguments);\n\
  this.emit('sort');\n\
  return result;\n\
}\n\
\n\
function sort() {\n\
  var result = Array.prototype.sort.apply(this, arguments);\n\
  this.emit('sort');\n\
  return result;\n\
}\n\
\n\
/**\n\
 * Reset the collection's data with a new set of data.\n\
 *\n\
 * @param {Array} arr The data to store on the collection.\n\
 * @api public\n\
 */\n\
\n\
function reset(arr) {\n\
  this.emit('reset', arr);\n\
}\n\
\n\
/**\n\
 * Apply an array function on the collection's data array.\n\
 * \n\
 * @param {String} name An array method property. Example: 'shift', 'push'.\n\
 * @param {Array} args Method argument list.\n\
 * @return {Mixed} Whatever the array method returns.\n\
 * @api private\n\
 */\n\
\n\
function apply(name, args) {\n\
  //this.__updating__ = true;\n\
  return Array.prototype[name].apply(this, args);\n\
  //delete this.__updating__;\n\
};//@ sourceURL=tower-observable-array/index.js"
));
require.register("tower-list-directive/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var directive = require('tower-directive');\n\
var content = require('tower-content');\n\
var template = require('tower-template');\n\
var oid = require('tower-oid');\n\
var observable = require('tower-observable-array');\n\
\n\
/**\n\
 * Expose `document`.\n\
 *\n\
 * This makes it so you can set the `document` on the server,\n\
 * for server-side templates.\n\
 */\n\
\n\
exports.document = 'undefined' !== typeof document && document;\n\
\n\
/**\n\
 * Define the list directive.\n\
 */\n\
\n\
directive('data-each', function(templateEl, exp, nodeFn){\n\
  var name = exp.val;\n\
\n\
  /**\n\
   * List directive.\n\
   *\n\
   * 1. compute new items added that are not visible (so, have array of visible items)\n\
   * 2. compute which new items will be visible if inserted\n\
   *    (remove ones that won't be visible)\n\
   * 3. for each new item\n\
   *  - if (buffer.length) pop element from buffer, then apply scope\n\
   *  - else templateFn.clone(scope)\n\
   * 4. insert new item into DOM at correct position.\n\
   *    (so, basically it has a sorted collection, listening for events)\n\
   */\n\
\n\
  function exec(scope, el, exp) {\n\
    var cursor = el;\n\
    var cache = el.cache || (el.cache = {});\n\
    var scopeCache = {};\n\
\n\
    // e.g. todos\n\
\n\
    var array = exp.col.fn(scope) || []; // exp.col === collection (array or object)\n\
\n\
    // update DOM with [possibly] new array\n\
    change(array);\n\
\n\
    // XXX: if (exp.bindTo)\n\
\n\
    observable(array);\n\
\n\
    // watch for changes in array\n\
\n\
    watch(array);\n\
\n\
    // reeval when column changes.\n\
    // watch for changes in expression,\n\
    // which means the array has been reset.\n\
    exp.col.watch(scope, function(){\n\
      unwatch(array);\n\
      array = exp.col.fn(scope);\n\
      cursor = el;\n\
      observable(array);\n\
      resetHandler(array);\n\
    });\n\
\n\
    /**\n\
     * When items have been added to array.\n\
     */\n\
\n\
    function change(arr, index) {\n\
      if (!arr) return;\n\
      if (null == index) {\n\
        // find index;\n\
        index = 0;\n\
        for (var i = 0; i < cursor.parentNode.childNodes.length; i++) {\n\
          if (cursor == cursor.parentNode.childNodes[i]) {\n\
            index = i;\n\
            break;\n\
          }\n\
        } \n\
      }\n\
      \n\
      // starting place for adding.\n\
      cursor = cursor.parentNode.childNodes[index];\n\
\n\
      for (var i = 0, n = arr.length; i < n; i++) {\n\
        // XXX: should allow tracking by custom tracking function\n\
        // (such as by `id`), but for now just by index.\n\
        var displacedIndex = i + index;\n\
        var id = getId(arr[i], displacedIndex);\n\
\n\
        // if it's already been processed, then continue.\n\
        if (cache[id]) continue;\n\
\n\
        var attrs = {\n\
          index: displacedIndex,\n\
          first: 0 === displacedIndex,\n\
          last: (displacedIndex + n - 1) === displacedIndex\n\
        };\n\
\n\
        attrs.middle = !(attrs.first || attrs.last);\n\
        //attrs.even = 0 === attrs.index % 2;\n\
        //attrs.odd = !attrs.even;\n\
\n\
        attrs[name] = arr[i];\n\
        var childScope = content(name || 'anonymous').init(attrs, scope);\n\
        var childEl = templateEl.cloneNode(true);\n\
        cache[id] = childEl;\n\
        cursor.parentNode.insertBefore(childEl, cursor.nextSibling);\n\
        scopeCache[id] = childScope;\n\
        cursor = childEl;\n\
        nodeFn(childScope, childEl);\n\
      }\n\
    }\n\
\n\
    /**\n\
     * Item removed from array.\n\
     */\n\
\n\
    function remove(id) {\n\
      if (cache[id]) {\n\
        cursor = cache[id].previousSibling || el;\n\
        cache[id].parentNode.removeChild(cache[id]);\n\
        scopeCache[id].remove();\n\
        delete cache[id];\n\
        delete scopeCache[id];\n\
      }\n\
    }\n\
\n\
    /**\n\
     * Observe array.\n\
     */\n\
\n\
    function watch(arr) {\n\
      arr.on('add', addHandler);\n\
      arr.on('remove', removeHandler);\n\
      arr.on('reset', resetHandler);\n\
      arr.on('sort', sortHandler);\n\
    }\n\
\n\
    /**\n\
     * Stop observing array.\n\
     */\n\
\n\
    function unwatch(arr) {\n\
      arr.off('add', addHandler);\n\
      arr.off('remove', removeHandler);\n\
      arr.off('reset', resetHandler);\n\
      arr.off('sort', sortHandler);\n\
    }\n\
\n\
    /**\n\
     * When items are added to array.\n\
     */\n\
\n\
    function addHandler(arr, index) {\n\
      change(arr, index);\n\
    }\n\
\n\
    /**\n\
     * When items are removed from array.\n\
     */\n\
\n\
    function removeHandler(arr, index) {\n\
      for (var i = 0, n = arr.length; i < n; i++) {\n\
        remove(getId(arr[i], i + index));\n\
      }\n\
    }\n\
\n\
    /**\n\
     * When array is reset.\n\
     */\n\
\n\
    function resetHandler(arr) {\n\
      for (var id in cache) {\n\
        remove(id);\n\
      }\n\
      change(arr);\n\
    }\n\
\n\
    // https://github.com/component/sort/blob/master/index.js\n\
    function sortHandler() {\n\
      // sort the elements\n\
      for (var i = 0, n = array.length; i < n; i++) {\n\
        var id = getId(array[i]);\n\
        var childEl = cache[id];\n\
        // XXX: handle when there's 10 items showing but 100 items in the array\n\
        // XXX: also, maybe optimize by detaching and adding once?\n\
        childEl.parentNode.appendChild(childEl);\n\
      }\n\
    }\n\
\n\
    // XXX: needs to handle tracking by custom properties.\n\
    function getId(record, index) {\n\
      return oid(record) || index;\n\
    }\n\
\n\
    // when scope is removed, clean up all listeners.\n\
    scope.on('remove', function(){\n\
      for (var id in cache) {\n\
        delete cache[id];\n\
        delete scopeCache[id];\n\
      }\n\
      unwatch(array);\n\
    });\n\
  }\n\
\n\
  return exec;\n\
}, true).terminal().meta().priority(10000).expression('data-list');//@ sourceURL=tower-list-directive/index.js"
));
require.register("visionmedia-debug/index.js", Function("exports, require, module",
"if ('undefined' == typeof window) {\n\
  module.exports = require('./lib/debug');\n\
} else {\n\
  module.exports = require('./debug');\n\
}\n\
//@ sourceURL=visionmedia-debug/index.js"
));
require.register("visionmedia-debug/debug.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `debug()` as the module.\n\
 */\n\
\n\
module.exports = debug;\n\
\n\
/**\n\
 * Create a debugger with the given `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {Type}\n\
 * @api public\n\
 */\n\
\n\
function debug(name) {\n\
  if (!debug.enabled(name)) return function(){};\n\
\n\
  return function(fmt){\n\
    fmt = coerce(fmt);\n\
\n\
    var curr = new Date;\n\
    var ms = curr - (debug[name] || curr);\n\
    debug[name] = curr;\n\
\n\
    fmt = name\n\
      + ' '\n\
      + fmt\n\
      + ' +' + debug.humanize(ms);\n\
\n\
    // This hackery is required for IE8\n\
    // where `console.log` doesn't have 'apply'\n\
    window.console\n\
      && console.log\n\
      && Function.prototype.apply.call(console.log, console, arguments);\n\
  }\n\
}\n\
\n\
/**\n\
 * The currently active debug mode names.\n\
 */\n\
\n\
debug.names = [];\n\
debug.skips = [];\n\
\n\
/**\n\
 * Enables a debug mode by name. This can include modes\n\
 * separated by a colon and wildcards.\n\
 *\n\
 * @param {String} name\n\
 * @api public\n\
 */\n\
\n\
debug.enable = function(name) {\n\
  try {\n\
    localStorage.debug = name;\n\
  } catch(e){}\n\
\n\
  var split = (name || '').split(/[\\s,]+/)\n\
    , len = split.length;\n\
\n\
  for (var i = 0; i < len; i++) {\n\
    name = split[i].replace('*', '.*?');\n\
    if (name[0] === '-') {\n\
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));\n\
    }\n\
    else {\n\
      debug.names.push(new RegExp('^' + name + '$'));\n\
    }\n\
  }\n\
};\n\
\n\
/**\n\
 * Disable debug output.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
debug.disable = function(){\n\
  debug.enable('');\n\
};\n\
\n\
/**\n\
 * Humanize the given `ms`.\n\
 *\n\
 * @param {Number} m\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
debug.humanize = function(ms) {\n\
  var sec = 1000\n\
    , min = 60 * 1000\n\
    , hour = 60 * min;\n\
\n\
  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';\n\
  if (ms >= min) return (ms / min).toFixed(1) + 'm';\n\
  if (ms >= sec) return (ms / sec | 0) + 's';\n\
  return ms + 'ms';\n\
};\n\
\n\
/**\n\
 * Returns true if the given mode name is enabled, false otherwise.\n\
 *\n\
 * @param {String} name\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
debug.enabled = function(name) {\n\
  for (var i = 0, len = debug.skips.length; i < len; i++) {\n\
    if (debug.skips[i].test(name)) {\n\
      return false;\n\
    }\n\
  }\n\
  for (var i = 0, len = debug.names.length; i < len; i++) {\n\
    if (debug.names[i].test(name)) {\n\
      return true;\n\
    }\n\
  }\n\
  return false;\n\
};\n\
\n\
/**\n\
 * Coerce `val`.\n\
 */\n\
\n\
function coerce(val) {\n\
  if (val instanceof Error) return val.stack || val.message;\n\
  return val;\n\
}\n\
\n\
// persist\n\
\n\
try {\n\
  if (window.localStorage) debug.enable(localStorage.debug);\n\
} catch(e){}\n\
//@ sourceURL=visionmedia-debug/debug.js"
));
require.register("component-props/index.js", Function("exports, require, module",
"/**\n\
 * Global Names\n\
 */\n\
\n\
var globals = /\\b(Array|Date|Object|Math|JSON)\\b/g;\n\
\n\
/**\n\
 * Return immediate identifiers parsed from `str`.\n\
 *\n\
 * @param {String} str\n\
 * @param {String|Function} map function or prefix\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(str, fn){\n\
  var p = unique(props(str));\n\
  if (fn && 'string' == typeof fn) fn = prefixed(fn);\n\
  if (fn) return map(str, p, fn);\n\
  return p;\n\
};\n\
\n\
/**\n\
 * Return immediate identifiers in `str`.\n\
 *\n\
 * @param {String} str\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function props(str) {\n\
  return str\n\
    .replace(/\\.\\w+|\\w+ *\\(|\"[^\"]*\"|'[^']*'|\\/([^/]+)\\//g, '')\n\
    .replace(globals, '')\n\
    .match(/[a-zA-Z_]\\w*/g)\n\
    || [];\n\
}\n\
\n\
/**\n\
 * Return `str` with `props` mapped with `fn`.\n\
 *\n\
 * @param {String} str\n\
 * @param {Array} props\n\
 * @param {Function} fn\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function map(str, props, fn) {\n\
  var re = /\\.\\w+|\\w+ *\\(|\"[^\"]*\"|'[^']*'|\\/([^/]+)\\/|[a-zA-Z_]\\w*/g;\n\
  return str.replace(re, function(_){\n\
    if ('(' == _[_.length - 1]) return fn(_);\n\
    if (!~props.indexOf(_)) return _;\n\
    return fn(_);\n\
  });\n\
}\n\
\n\
/**\n\
 * Return unique array.\n\
 *\n\
 * @param {Array} arr\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function unique(arr) {\n\
  var ret = [];\n\
\n\
  for (var i = 0; i < arr.length; i++) {\n\
    if (~ret.indexOf(arr[i])) continue;\n\
    ret.push(arr[i]);\n\
  }\n\
\n\
  return ret;\n\
}\n\
\n\
/**\n\
 * Map with prefix `str`.\n\
 */\n\
\n\
function prefixed(str) {\n\
  return function(_){\n\
    return str + _;\n\
  };\n\
}\n\
//@ sourceURL=component-props/index.js"
));
require.register("component-to-function/index.js", Function("exports, require, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
try {\n\
  var expr = require('props');\n\
} catch(e) {\n\
  var expr = require('props-component');\n\
}\n\
\n\
/**\n\
 * Expose `toFunction()`.\n\
 */\n\
\n\
module.exports = toFunction;\n\
\n\
/**\n\
 * Convert `obj` to a `Function`.\n\
 *\n\
 * @param {Mixed} obj\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function toFunction(obj) {\n\
  switch ({}.toString.call(obj)) {\n\
    case '[object Object]':\n\
      return objectToFunction(obj);\n\
    case '[object Function]':\n\
      return obj;\n\
    case '[object String]':\n\
      return stringToFunction(obj);\n\
    case '[object RegExp]':\n\
      return regexpToFunction(obj);\n\
    default:\n\
      return defaultToFunction(obj);\n\
  }\n\
}\n\
\n\
/**\n\
 * Default to strict equality.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function defaultToFunction(val) {\n\
  return function(obj){\n\
    return val === obj;\n\
  }\n\
}\n\
\n\
/**\n\
 * Convert `re` to a function.\n\
 *\n\
 * @param {RegExp} re\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function regexpToFunction(re) {\n\
  return function(obj){\n\
    return re.test(obj);\n\
  }\n\
}\n\
\n\
/**\n\
 * Convert property `str` to a function.\n\
 *\n\
 * @param {String} str\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function stringToFunction(str) {\n\
  // immediate such as \"> 20\"\n\
  if (/^ *\\W+/.test(str)) return new Function('_', 'return _ ' + str);\n\
\n\
  // properties such as \"name.first\" or \"age > 18\" or \"age > 18 && age < 36\"\n\
  return new Function('_', 'return ' + get(str));\n\
}\n\
\n\
/**\n\
 * Convert `object` to a function.\n\
 *\n\
 * @param {Object} object\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function objectToFunction(obj) {\n\
  var match = {}\n\
  for (var key in obj) {\n\
    match[key] = typeof obj[key] === 'string'\n\
      ? defaultToFunction(obj[key])\n\
      : toFunction(obj[key])\n\
  }\n\
  return function(val){\n\
    if (typeof val !== 'object') return false;\n\
    for (var key in match) {\n\
      if (!(key in val)) return false;\n\
      if (!match[key](val[key])) return false;\n\
    }\n\
    return true;\n\
  }\n\
}\n\
\n\
/**\n\
 * Built the getter function. Supports getter style functions\n\
 *\n\
 * @param {String} str\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function get(str) {\n\
  var props = expr(str);\n\
  if (!props.length) return '_.' + str;\n\
\n\
  var val;\n\
  for(var i = 0, prop; prop = props[i]; i++) {\n\
    val = '_.' + prop;\n\
    val = \"('function' == typeof \" + val + \" ? \" + val + \"() : \" + val + \")\";\n\
    str = str.replace(new RegExp(prop, 'g'), val);\n\
  }\n\
\n\
  return str;\n\
}\n\
//@ sourceURL=component-to-function/index.js"
));
require.register("component-each/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var toFunction = require('to-function');\n\
var type;\n\
\n\
try {\n\
  type = require('type-component');\n\
} catch (e) {\n\
  type = require('type');\n\
}\n\
\n\
/**\n\
 * HOP reference.\n\
 */\n\
\n\
var has = Object.prototype.hasOwnProperty;\n\
\n\
/**\n\
 * Iterate the given `obj` and invoke `fn(val, i)`.\n\
 *\n\
 * @param {String|Array|Object} obj\n\
 * @param {Function} fn\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(obj, fn){\n\
  fn = toFunction(fn);\n\
  switch (type(obj)) {\n\
    case 'array':\n\
      return array(obj, fn);\n\
    case 'object':\n\
      if ('number' == typeof obj.length) return array(obj, fn);\n\
      return object(obj, fn);\n\
    case 'string':\n\
      return string(obj, fn);\n\
  }\n\
};\n\
\n\
/**\n\
 * Iterate string chars.\n\
 *\n\
 * @param {String} obj\n\
 * @param {Function} fn\n\
 * @api private\n\
 */\n\
\n\
function string(obj, fn) {\n\
  for (var i = 0; i < obj.length; ++i) {\n\
    fn(obj.charAt(i), i);\n\
  }\n\
}\n\
\n\
/**\n\
 * Iterate object keys.\n\
 *\n\
 * @param {Object} obj\n\
 * @param {Function} fn\n\
 * @api private\n\
 */\n\
\n\
function object(obj, fn) {\n\
  for (var key in obj) {\n\
    if (has.call(obj, key)) {\n\
      fn(key, obj[key]);\n\
    }\n\
  }\n\
}\n\
\n\
/**\n\
 * Iterate array-ish.\n\
 *\n\
 * @param {Array|Object} obj\n\
 * @param {Function} fn\n\
 * @api private\n\
 */\n\
\n\
function array(obj, fn) {\n\
  for (var i = 0; i < obj.length; ++i) {\n\
    fn(obj[i], i);\n\
  }\n\
}\n\
//@ sourceURL=component-each/index.js"
));
require.register("component-url/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Parse the given `url`.\n\
 *\n\
 * @param {String} str\n\
 * @return {Object}\n\
 * @api public\n\
 */\n\
\n\
exports.parse = function(url){\n\
  var a = document.createElement('a');\n\
  a.href = url;\n\
  return {\n\
    href: a.href,\n\
    host: a.host || location.host,\n\
    port: ('0' === a.port || '' === a.port) ? port(a.protocol) : a.port,\n\
    hash: a.hash,\n\
    hostname: a.hostname || location.hostname,\n\
    pathname: a.pathname.charAt(0) != '/' ? '/' + a.pathname : a.pathname,\n\
    protocol: !a.protocol || ':' == a.protocol ? location.protocol : a.protocol,\n\
    search: a.search,\n\
    query: a.search.slice(1)\n\
  };\n\
};\n\
\n\
/**\n\
 * Check if `url` is absolute.\n\
 *\n\
 * @param {String} url\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
exports.isAbsolute = function(url){\n\
  return 0 == url.indexOf('//') || !!~url.indexOf('://');\n\
};\n\
\n\
/**\n\
 * Check if `url` is relative.\n\
 *\n\
 * @param {String} url\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
exports.isRelative = function(url){\n\
  return !exports.isAbsolute(url);\n\
};\n\
\n\
/**\n\
 * Check if `url` is cross domain.\n\
 *\n\
 * @param {String} url\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
exports.isCrossDomain = function(url){\n\
  url = exports.parse(url);\n\
  return url.hostname !== location.hostname\n\
    || url.port !== location.port\n\
    || url.protocol !== location.protocol;\n\
};\n\
\n\
/**\n\
 * Return default port for `protocol`.\n\
 *\n\
 * @param  {String} protocol\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
function port (protocol){\n\
  switch (protocol) {\n\
    case 'http:':\n\
      return 80;\n\
    case 'https:':\n\
      return 443;\n\
    default:\n\
      return location.port;\n\
  }\n\
}\n\
//@ sourceURL=component-url/index.js"
));
require.register("component-live-css/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var request = require('superagent')\n\
  , debug = require('debug')('live-css')\n\
  , each = require('each')\n\
  , url = require('url');\n\
\n\
/**\n\
 * Poll timer.\n\
 */\n\
\n\
var timer;\n\
\n\
/**\n\
 * Poll interval.\n\
 */\n\
\n\
var interval = 1000;\n\
\n\
/**\n\
 * Etag map.\n\
 */\n\
\n\
var etags = {};\n\
\n\
/**\n\
 * Last-Modified map.\n\
 */\n\
\n\
var mtimes = {};\n\
\n\
/**\n\
 * Start live.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
exports.start = function(){\n\
  timer = setTimeout(function(){\n\
    checkAll();\n\
    exports.start();\n\
  }, interval);\n\
};\n\
\n\
/**\n\
 * Stop live.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
exports.stop = function(){\n\
  clearTimeout(timer);\n\
};\n\
\n\
/**\n\
 * Check styles.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
function checkAll() {\n\
  var styles = getStyles();\n\
  each(styles, check);\n\
}\n\
\n\
/**\n\
 * Check `style`.\n\
 *\n\
 * @param {Element} style\n\
 * @api private\n\
 */\n\
\n\
function check(style) {\n\
  var href = style.getAttribute('href');\n\
  var prevEtag = etags[href];\n\
  var prevMtime = mtimes[href];\n\
\n\
  request\n\
  .head(href)\n\
  .query({ bust: new Date })\n\
  .end(function(res){\n\
    var etag = res.header.etag;\n\
    if (etag) etags[href] = etag;\n\
\n\
    var mtime = res.header['last-modified'];\n\
    if (mtime) mtimes[href] = mtime;\n\
\n\
    if (etag && etag != prevEtag) {\n\
      debug('etag mismatch');\n\
      debug('old \"%s\"', prevEtag);\n\
      debug('new \"%s\"', etag);\n\
      debug('changed %s', href);\n\
      return refresh(style);\n\
    }\n\
\n\
    if (mtime && mtime != prevMtime) {\n\
      debug('mtime mismatch');\n\
      debug('old \"%s\"', prevMtime);\n\
      debug('new \"%s\"', mtime);\n\
      debug('changed %s', href);\n\
      return refresh(style);\n\
    }\n\
  });\n\
}\n\
\n\
/**\n\
 * Refresh `style`.\n\
 *\n\
 * @param {Element} style\n\
 * @api private\n\
 */\n\
\n\
function refresh(style) {\n\
  var parent = style.parentNode;\n\
  var sibling = style.nextSibling;\n\
  var clone = style.cloneNode(true);\n\
\n\
  // insert\n\
  if (sibling) {\n\
    parent.insertBefore(clone, sibling);\n\
  } else {\n\
    parent.appendChild(clone);\n\
  }\n\
\n\
  // remove prev\n\
  clone.onload = function(){\n\
    parent.removeChild(style);\n\
  };\n\
}\n\
\n\
/**\n\
 * Return stylesheet links.\n\
 *\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function getStyles() {\n\
  var links = document.getElementsByTagName('link');\n\
  var styles = [];\n\
\n\
  each(links, function(link){\n\
    if ('stylesheet' != link.getAttribute('rel')) return;\n\
    if (url.isAbsolute(link.getAttribute('href'))) return;\n\
    styles.push(link);\n\
  });\n\
\n\
  return styles;\n\
}//@ sourceURL=component-live-css/index.js"
));
require.register("openautomation/lib/rest.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var adapter = require('tower-adapter')('openautomation');\n\
var agent = require('superagent');\n\
\n\
/**\n\
 * Map of model names to REST API names.\n\
 */\n\
\n\
var names = {\n\
  action: 'actions',\n\
  user: 'users',\n\
  experiment: 'experiments'\n\
};\n\
\n\
/**\n\
 * Map of query actions to HTTP methods.\n\
 */\n\
\n\
var methods = {\n\
  select: 'GET',\n\
  create: 'POST',\n\
  update: 'PUT',\n\
  remove: 'DELETE'\n\
};\n\
\n\
var calls = {\n\
  get: 'get',\n\
  post: 'post',\n\
  put: 'put',\n\
  'delete': 'del'\n\
};\n\
\n\
/**\n\
 * Expose `adapter`.\n\
 */\n\
\n\
exports = module.exports = adapter;\n\
\n\
/**\n\
 * API Version.\n\
 */\n\
\n\
exports.v = 'v1';\n\
exports.url = window.location.protocol + '//' + window.location.host;\n\
\n\
/**\n\
 * XXX: way to specify headers for all requests.\n\
 */\n\
\n\
exports.header = function(name, val){\n\
\n\
};\n\
\n\
exports.params = [];\n\
exports.param = function(name, val){\n\
  exports.params.push({ name: name, val: val });\n\
  return exports;\n\
};\n\
\n\
/**\n\
 * Convert query into REST API request.\n\
 *\n\
 * @param {Query} query A `Query` object.\n\
 * @param {Function} fn Callback function.\n\
 */\n\
\n\
adapter.exec = function(query, fn){\n\
  var name = query.resources[0].resource;\n\
  name = names[name] || name + 's';\n\
  var method = methods[query.type];\n\
  var call = calls[method.toLowerCase()];\n\
  var params = serializeParams(query);\n\
\n\
  var url = exports.url + '/api/' + exports.v + '/' + name;\n\
\n\
  var req = agent[call](url)\n\
    .set('Content-Type', 'application/json')\n\
    .set('Accept', 'application/json');\n\
\n\
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {\n\
    req.send(query.data || {});\n\
  }\n\
\n\
  req.query(params);\n\
\n\
  req.end(function(res){\n\
    if (fn) fn(res.error ? res.text : null, res.body);\n\
  });\n\
};\n\
\n\
/**\n\
 * Convert query constraints into query parameters.\n\
 *\n\
 * @param {Query} query\n\
 * @api private\n\
 */\n\
\n\
function serializeParams(query) {\n\
  var constraints = query.constraints;\n\
  var params = {};\n\
\n\
  constraints.forEach(function(constraint){\n\
    params[constraint.left.attr] = constraint.right.value;\n\
  });\n\
\n\
  return params;\n\
}//@ sourceURL=openautomation/lib/rest.js"
));
require.register("openautomation/lib/sprite.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var events = require('events');\n\
var Emitter = require('emitter');\n\
var inherit = require('inherit');\n\
\n\
/**\n\
 * Expose `Sprite`.\n\
 */\n\
\n\
module.exports = Sprite;\n\
\n\
/**\n\
 * Instantiate a new `Sprite`.\n\
 *\n\
 * A \"sprite\" is just a generic UI game-like component.\n\
 *\n\
 * @param {Object} opts Default properties on the sprite.\n\
 * @param {SVG} parent The parent SVG element.\n\
 */\n\
\n\
function Sprite(parent, opts) {\n\
  opts = opts || {};\n\
  this.parent = parent;\n\
\n\
  for (var name in opts) {\n\
    if (opts.hasOwnProperty(name)) {\n\
      this[name] = opts[name];\n\
    }\n\
  }\n\
\n\
  this.draw();\n\
  this.bind();\n\
}\n\
\n\
/**\n\
 * Mixin `Emitter`.\n\
 */\n\
\n\
Emitter(Sprite.prototype);\n\
\n\
/**\n\
 * Setup the drawing.\n\
 */\n\
\n\
Sprite.prototype.draw = function(){\n\
  throw new Error('Subclass must implement');\n\
};\n\
\n\
/**\n\
 * Setup event handlers.\n\
 */\n\
\n\
Sprite.prototype.bind = function(){\n\
\n\
};//@ sourceURL=openautomation/lib/sprite.js"
));
require.register("openautomation/lib/microplate.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var events = require('events');\n\
var Emitter = require('emitter');\n\
\n\
/**\n\
 * Expose `Microplate`.\n\
 */\n\
\n\
module.exports = Microplate;\n\
\n\
/**\n\
 * Radius of well.\n\
 */\n\
\n\
Microplate.prototype.wellRadius = null;\n\
\n\
/**\n\
 * Microplate dimensions.\n\
 */\n\
\n\
Microplate.prototype.bounds = null;\n\
\n\
/**\n\
 * Outer padding on microplate.\n\
 */\n\
\n\
Microplate.prototype.padding = null;\n\
\n\
/**\n\
 * Instantiate a new `Microplate` sprite.\n\
 */\n\
\n\
function Microplate(drawing, opts) {\n\
  opts = opts || {};\n\
  this.parent = drawing;\n\
\n\
  this.opts = opts; // { rows: 6, columns: 3 };\n\
  this.rows = opts.rows || 8;\n\
  this.columns = opts.columns || 12;\n\
  // Hard-Shell 96-well Skirted Bio-Rad plate.\n\
  // in millimeters\n\
  this.bounds = { width: millimetersToPixels(127.76), height: millimetersToPixels(85.48) };\n\
  this.padding = { top: millimetersToPixels(11.35 - 4.5), left: millimetersToPixels(14.45 - 4.5) };\n\
  // center-to-center spacing of wells is 9mm\n\
  // XXX: there is a border there to account for too.\n\
  this.wellRadius = millimetersToPixels(9);\n\
\n\
  this.draw();\n\
  this.bind();\n\
}\n\
\n\
/**\n\
 * Mixin `Emitter`.\n\
 */\n\
\n\
Emitter(Microplate.prototype);\n\
\n\
/**\n\
 * Draw.\n\
 */\n\
\n\
Microplate.prototype.draw = function(){\n\
  // draw group\n\
  var group = this.group = this.parent.group();\n\
  group.attr('class', 'microplate');\n\
\n\
  // draw rectangle\n\
  var rect = this.rect = this.parent.rect(100, 100);\n\
  rect.radius(10);\n\
  rect.fill({ opacity: 0 });\n\
  rect.stroke({ width: 2 });\n\
  rect.attr('class', 'microplate-box');\n\
  group.add(rect);\n\
\n\
  // draw wells\n\
  for (var i = 0; i < this.rows; i++) {\n\
    for (var j = 0; j < this.columns; j++) {\n\
      this.drawWell(i, j);\n\
    }\n\
  }\n\
\n\
  this.size(this.bounds.width, this.bounds.height);\n\
};\n\
\n\
/**\n\
 * Draw well.\n\
 */\n\
\n\
Microplate.prototype.drawWell = function(row, column){\n\
  var x = this.padding.left + (column * (this.wellRadius + 1));\n\
  var y = this.padding.top + (row * (this.wellRadius + 1));\n\
\n\
  var circle = this.parent.circle(this.wellRadius);\n\
  circle.attr('class', 'microplate-well');\n\
  circle.fill({ opacity: 0 });\n\
  circle.stroke({ width: 1 });\n\
  circle.move(x, y);\n\
  // XXX: all svg objects should be tied to formal data models with schemas eventually\n\
  circle.node.__data__ = { row: row, column: column };\n\
  this.group.add(circle);\n\
};\n\
\n\
/**\n\
 * Bind event listeners.\n\
 */\n\
\n\
Microplate.prototype.bind = function(){\n\
  this.events = events(this.group.node, this);\n\
  this.events.bind('click .microplate-well');\n\
  //this.group.click(this.onclick.bind(this));\n\
};\n\
\n\
/**\n\
 * Move to position.\n\
 */\n\
\n\
Microplate.prototype.move = function(x, y){\n\
  this.group.move(x, y);\n\
};\n\
\n\
/**\n\
 * Resize.\n\
 */\n\
\n\
Microplate.prototype.size = function(w, h){\n\
  // XXX: should do sizing from group somehow.\n\
  this.rect.size(w, h);\n\
};\n\
\n\
/**\n\
 * Click handler.\n\
 */\n\
\n\
Microplate.prototype.onclick = function(e){\n\
  this.emit('select', e.target.__data__);\n\
};\n\
\n\
/**\n\
 * Millimeter to pixel conversion.\n\
 *\n\
 * XXX: need to think about more.\n\
 */\n\
\n\
var mmRatio = 72/25.4;\n\
\n\
function millimetersToPixels(mm) {\n\
  // 1 mm = 72/25.4 = 2.8346\n\
  return mm * mmRatio;\n\
}//@ sourceURL=openautomation/lib/microplate.js"
));
require.register("openautomation/lib/liquid-container.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `LiquidContainer`.\n\
 */\n\
\n\
module.exports = LiquidContainer;\n\
\n\
/**\n\
 * Instantiate a new `LiquidContainer`.\n\
 */\n\
\n\
function LiquidContainer(parent, opts) {\n\
  this.parent = parent;\n\
  this.opts = opts || {};\n\
  this.draw();\n\
}\n\
\n\
/**\n\
 * Draw.\n\
 */\n\
\n\
LiquidContainer.prototype.draw = function(){\n\
  this.drawing = this.parent.circle(this.opts.radius || 40);\n\
  this.drawing.fill({ color: 'blue' });\n\
};//@ sourceURL=openautomation/lib/liquid-container.js"
));
require.register("openautomation/lib/petri-dish.js", Function("exports, require, module",
"//@ sourceURL=openautomation/lib/petri-dish.js"
));
require.register("openautomation/lib/steps.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `parser`.\n\
 */\n\
\n\
exports = module.exports = parser;\n\
\n\
/**\n\
 * Hooks.\n\
 */\n\
\n\
exports.callbacks = [];\n\
\n\
/**\n\
 * Parse step into data.\n\
 */\n\
\n\
function parser(str) {\n\
  var match, callback;\n\
\n\
  exports.callbacks.forEach(function(arr){\n\
    callback = arr;\n\
    match = str.match(callback[0]);\n\
    if (match) return false;\n\
  });\n\
\n\
  return callback[1].apply(null, match);\n\
}\n\
\n\
/**\n\
 * Add parser hook.\n\
 */\n\
\n\
exports.use = function(pattern, fn){\n\
  exports.callbacks.push([ pattern, fn ]);\n\
};//@ sourceURL=openautomation/lib/steps.js"
));
require.register("openautomation/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var adapter = require('./lib/rest');\n\
var template = require('tower-template');\n\
require('tower-list-directive');\n\
require('tower-text-directive');\n\
var event = require('tower-event-directive');\n\
event('click');\n\
var content = require('tower-content');\n\
var query = require('tower-query');\n\
query.use(adapter);\n\
var resource = require('tower-resource');\n\
var getUserMedia = require('get-user-media');\n\
var canvasPosition = require('window2canvas');\n\
var transformBounds = require('transform-bounds');\n\
var events = require('event');\n\
var agent = require('superagent');\n\
var SVG = require('svg.js').SVG;\n\
var drawing = SVG('sprites').fixSubPixelOffset();\n\
\n\
/**\n\
 * Lab equipment.\n\
 */\n\
\n\
var Microplate = require('./lib/microplate');\n\
var LiquidContainer = require('./lib/liquid-container');\n\
var PetriDish = require('./lib/petri-dish');\n\
\n\
require('live-css').start();\n\
\n\
content('root')\n\
  .action('run', function(){\n\
    \n\
  })\n\
  .action('edit', function(){\n\
\n\
  });\n\
\n\
/**\n\
 * Add :volume of :solution to :containers\n\
  - Incubate :container at :temperature for :duration\n\
  - Measure :property at :constraints (Read absorbance...)\n\
  - Discard :solution from :containers\n\
 */\n\
/**\n\
 * \n\
 */\n\
var steps = [\n\
  'Add 100ul of negative or positive control or sample to each well',\n\
  'Incubate the plate at 37C for 60min',\n\
  'Discard the solution in each well (aspirating or decanting)',\n\
  'Repeat 4-6 times (this is a \"wash\" recipe):',\n\
  '  - Add 200-300ul washing buffer to each well',\n\
  '  - Discard solution in each well',\n\
  'Aspirate or decant each well to ensure no fluid',\n\
  'Invert plate and blot on paper towel',\n\
  'Add 100ul Enzyme Conjugate to each well',\n\
  'Incubate plate at 37C for 30min',\n\
  'Repeat 4-6 times (this is a \"wash\" recipe again):',\n\
  '  - Add 200-300ul washing buffer to each well',\n\
  '  - Discard solution in each well',\n\
  'Add 100ul of Substrate (TMB) Solution to each well',\n\
  'Incubate at 37C for 15min (protect from light)',\n\
  'Add 100ul of Stop Solution to each well and mix *well*',\n\
  'Read absorbance at 450nm within 30min after adding '\n\
];\n\
\n\
var parser = require('./lib/steps');\n\
parser.use(/(\\w+)\\s(\\w+)[^\\d]+(\\d+C)[^\\d]+(\\d+min)/, function(_, action, object, temperature, duration){\n\
  return {\n\
    action: action, \n\
    object: object, \n\
    temperature: temperature,\n\
    duration: duration\n\
  }\n\
});\n\
\n\
console.log(parser(steps[0]));\n\
\n\
/**\n\
 * Template.\n\
 */\n\
\n\
template(document.body)({\n\
  steps: steps\n\
});\n\
\n\
/**\n\
 * Canvas.\n\
 */\n\
\n\
var video = document.getElementById('webcam');\n\
var canvas = document.getElementById('canvas');\n\
canvas.style.zIndex = 0;\n\
\n\
/**\n\
 * Hardcoded lab box dimensions.\n\
 */\n\
\n\
var labBox = {\n\
  width: 20000,\n\
  height: 20000\n\
};\n\
\n\
document.querySelector('.viewport').style.display = 'none';\n\
var paused = false;\n\
var videostream;\n\
var gif = 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7';\n\
document.querySelector('.snapshot').src = gif;\n\
events.bind(window, 'click', function(e){\n\
  if (paused) {\n\
    document.querySelector('.snapshot').src = gif;\n\
    document.querySelector('.viewport').style.display = 'none';\n\
    //canvas.style.webkitFilter = '';\n\
    video.play();\n\
  } else {\n\
    video.pause();\n\
    //document.querySelector('.snapshot').style.backgroundImage = 'url(' + canvas.toDataURL() + ');';\n\
    document.querySelector('.snapshot').src = canvas.toDataURL('image/jpeg', 0.01);\n\
    document.querySelector('.viewport').style.display = 'block';\n\
    //canvas.style.webkitFilter = 'blur(13px)';\n\
  }\n\
  paused = !paused;\n\
  return;\n\
  // get position relative to canvas\n\
  var local = canvasPosition(canvas, e.clientX, e.clientY);\n\
  // convert to coordinates of lab box\n\
  var remote = transformBounds(local.x, local.y, canvas.getBoundingClientRect(), labBox);\n\
\n\
  sendMove(remote);\n\
});\n\
\n\
function sendMove(remote) {\n\
  // resource('action').create(remote, function(){\n\
  //   console.log('done', arguments);\n\
  // });\n\
  document.querySelector('#log').appendChild(\n\
    document.createTextNode('selected ' + JSON.stringify(remote))\n\
  );\n\
\n\
  agent.post('/actions')\n\
    .send({ type: 'move', position: remote })\n\
    .end(function(res){\n\
      console.log(res);\n\
    });\n\
}\n\
\n\
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;\n\
\n\
// http://inspirit.github.io/jsfeat/js/compatibility.js\n\
navigator.getUserMedia({ video: true }, function(stream){\n\
  videostream = stream;\n\
  try {\n\
    video.src = webkitURL.createObjectURL(stream);\n\
  } catch (err) {\n\
    video.src = stream;\n\
  }\n\
\n\
  setTimeout(start, 500);\n\
}, function(){\n\
  console.log(arguments);\n\
});\n\
\n\
function start() {\n\
  video.play();\n\
  demo_app();\n\
  requestAnimationFrame(tick);\n\
  return;\n\
  // add lab equipment\n\
  var microplate = new Microplate(drawing);\n\
  microplate.move(100, 100);\n\
  //microplate.size(100, 200);\n\
  microplate.on('select', function(well){\n\
    // XXX: somehow get position from microplate.\n\
    sendMove(well);\n\
  });\n\
\n\
  var liquid = new LiquidContainer(drawing);\n\
}\n\
\n\
function success(stream) {\n\
  try {\n\
    video.src = webkitURL.createObjectURL(stream);\n\
  } catch (err) {\n\
    video.src = stream;\n\
  }\n\
}\n\
\n\
function failure(err) {\n\
  $('#canvas').hide();\n\
  $('#log').hide();\n\
  $('#no_rtc').html('<h4>WebRTC not available.</h4>');\n\
  $('#no_rtc').show();\n\
}\n\
\n\
var gui,options,ctx,canvasWidth,canvasHeight;\n\
var img_u8;\n\
\n\
function demo_app() {\n\
  var content = document.querySelector('.content');\n\
  var ratio = 480 / 640;\n\
  canvas.width = content.offsetWidth\n\
  canvas.height = content.offsetWidth * ratio;\n\
  canvasWidth  = canvas.width;\n\
  canvasHeight = canvas.height;\n\
  ctx = canvas.getContext('2d');\n\
  img_u8 = new jsfeat.matrix_t(canvas.width, canvas.height, jsfeat.U8C1_t);\n\
}\n\
\n\
var imageData;\n\
function tick() {\n\
  requestAnimationFrame(tick);\n\
\n\
  if (video.readyState === video.HAVE_ENOUGH_DATA) {\n\
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);\n\
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);\n\
    return;\n\
    jsfeat.imgproc.grayscale(imageData.data, img_u8.data);\n\
\n\
    var r = options.blur_radius|0;\n\
    var kernel_size = (r+1) << 1;\n\
    jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);\n\
    jsfeat.imgproc.canny(img_u8, img_u8, options.low_threshold|0, options.high_threshold|0);\n\
\n\
    // render result back to canvas\n\
    var data_u32 = new Uint32Array(imageData.data.buffer);\n\
    var alpha = (0xff << 24);\n\
    var i = img_u8.cols*img_u8.rows, pix = 0;\n\
    while(--i >= 0) {\n\
      pix = img_u8.data[i];\n\
      data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;\n\
    }\n\
    \n\
    ctx.putImageData(imageData, 0, 0);\n\
  }\n\
}//@ sourceURL=openautomation/index.js"
));


































































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


require.alias("tower-template/index.js", "openautomation/deps/tower-template/index.js");
require.alias("tower-template/index.js", "tower-template/index.js");
require.alias("tower-directive/index.js", "tower-template/deps/tower-directive/index.js");
require.alias("tower-directive/lib/statics.js", "tower-template/deps/tower-directive/lib/statics.js");
require.alias("tower-directive/lib/proto.js", "tower-template/deps/tower-directive/lib/proto.js");
require.alias("tower-emitter/index.js", "tower-directive/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-directive/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-directive-expression/index.js", "tower-directive/deps/tower-directive-expression/index.js");
require.alias("tower-directive-expression/lib/compiler.js", "tower-directive/deps/tower-directive-expression/lib/compiler.js");
require.alias("tower-directive-expression/lib/expressions.js", "tower-directive/deps/tower-directive-expression/lib/expressions.js");
require.alias("tower-directive-expression/lib/path.js", "tower-directive/deps/tower-directive-expression/lib/path.js");
require.alias("tower-expression/index.js", "tower-directive-expression/deps/tower-expression/index.js");

require.alias("tower-js-expressions/index.js", "tower-directive-expression/deps/tower-js-expressions/index.js");
require.alias("tower-expression/index.js", "tower-js-expressions/deps/tower-expression/index.js");

require.alias("part-is-array/index.js", "tower-js-expressions/deps/part-is-array/index.js");

require.alias("tower-filter/index.js", "tower-directive-expression/deps/tower-filter/index.js");

require.alias("part-is-array/index.js", "tower-directive-expression/deps/part-is-array/index.js");

require.alias("tower-content/index.js", "tower-directive/deps/tower-content/index.js");
require.alias("tower-content/lib/proto.js", "tower-directive/deps/tower-content/lib/proto.js");
require.alias("tower-content/lib/statics.js", "tower-directive/deps/tower-content/lib/statics.js");
require.alias("tower-content/index.js", "tower-directive/deps/tower-content/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-attr/index.js", "tower-content/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-content/deps/tower-attr/lib/validators.js");
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

require.alias("tower-accessor/index.js", "tower-content/deps/tower-accessor/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-oid/index.js", "tower-accessor/deps/tower-oid/index.js");

require.alias("component-indexof/index.js", "tower-content/deps/indexof/index.js");

require.alias("tower-content/index.js", "tower-content/index.js");
require.alias("component-event/index.js", "tower-directive/deps/event/index.js");

require.alias("component-value/index.js", "tower-directive/deps/value/index.js");
require.alias("component-value/index.js", "tower-directive/deps/value/index.js");
require.alias("component-type/index.js", "component-value/deps/type/index.js");

require.alias("component-value/index.js", "component-value/index.js");
require.alias("tower-content/index.js", "tower-template/deps/tower-content/index.js");
require.alias("tower-content/lib/proto.js", "tower-template/deps/tower-content/lib/proto.js");
require.alias("tower-content/lib/statics.js", "tower-template/deps/tower-content/lib/statics.js");
require.alias("tower-content/index.js", "tower-template/deps/tower-content/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-attr/index.js", "tower-content/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-content/deps/tower-attr/lib/validators.js");
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

require.alias("tower-accessor/index.js", "tower-content/deps/tower-accessor/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-oid/index.js", "tower-accessor/deps/tower-oid/index.js");

require.alias("component-indexof/index.js", "tower-content/deps/indexof/index.js");

require.alias("tower-content/index.js", "tower-content/index.js");
require.alias("tower-content/index.js", "openautomation/deps/tower-content/index.js");
require.alias("tower-content/lib/proto.js", "openautomation/deps/tower-content/lib/proto.js");
require.alias("tower-content/lib/statics.js", "openautomation/deps/tower-content/lib/statics.js");
require.alias("tower-content/index.js", "openautomation/deps/tower-content/index.js");
require.alias("tower-content/index.js", "tower-content/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-attr/index.js", "tower-content/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-content/deps/tower-attr/lib/validators.js");
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

require.alias("tower-accessor/index.js", "tower-content/deps/tower-accessor/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-oid/index.js", "tower-accessor/deps/tower-oid/index.js");

require.alias("component-indexof/index.js", "tower-content/deps/indexof/index.js");

require.alias("tower-content/index.js", "tower-content/index.js");
require.alias("tower-event-directive/index.js", "openautomation/deps/tower-event-directive/index.js");
require.alias("tower-event-directive/index.js", "tower-event-directive/index.js");
require.alias("component-event/index.js", "tower-event-directive/deps/event/index.js");

require.alias("tower-directive/index.js", "tower-event-directive/deps/tower-directive/index.js");
require.alias("tower-directive/lib/statics.js", "tower-event-directive/deps/tower-directive/lib/statics.js");
require.alias("tower-directive/lib/proto.js", "tower-event-directive/deps/tower-directive/lib/proto.js");
require.alias("tower-emitter/index.js", "tower-directive/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-directive/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-directive-expression/index.js", "tower-directive/deps/tower-directive-expression/index.js");
require.alias("tower-directive-expression/lib/compiler.js", "tower-directive/deps/tower-directive-expression/lib/compiler.js");
require.alias("tower-directive-expression/lib/expressions.js", "tower-directive/deps/tower-directive-expression/lib/expressions.js");
require.alias("tower-directive-expression/lib/path.js", "tower-directive/deps/tower-directive-expression/lib/path.js");
require.alias("tower-expression/index.js", "tower-directive-expression/deps/tower-expression/index.js");

require.alias("tower-js-expressions/index.js", "tower-directive-expression/deps/tower-js-expressions/index.js");
require.alias("tower-expression/index.js", "tower-js-expressions/deps/tower-expression/index.js");

require.alias("part-is-array/index.js", "tower-js-expressions/deps/part-is-array/index.js");

require.alias("tower-filter/index.js", "tower-directive-expression/deps/tower-filter/index.js");

require.alias("part-is-array/index.js", "tower-directive-expression/deps/part-is-array/index.js");

require.alias("tower-content/index.js", "tower-directive/deps/tower-content/index.js");
require.alias("tower-content/lib/proto.js", "tower-directive/deps/tower-content/lib/proto.js");
require.alias("tower-content/lib/statics.js", "tower-directive/deps/tower-content/lib/statics.js");
require.alias("tower-content/index.js", "tower-directive/deps/tower-content/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-attr/index.js", "tower-content/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-content/deps/tower-attr/lib/validators.js");
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

require.alias("tower-accessor/index.js", "tower-content/deps/tower-accessor/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-oid/index.js", "tower-accessor/deps/tower-oid/index.js");

require.alias("component-indexof/index.js", "tower-content/deps/indexof/index.js");

require.alias("tower-content/index.js", "tower-content/index.js");
require.alias("component-event/index.js", "tower-directive/deps/event/index.js");

require.alias("component-value/index.js", "tower-directive/deps/value/index.js");
require.alias("component-value/index.js", "tower-directive/deps/value/index.js");
require.alias("component-type/index.js", "component-value/deps/type/index.js");

require.alias("component-value/index.js", "component-value/index.js");
require.alias("ftlabs-fastclick/lib/fastclick.js", "tower-event-directive/deps/fastclick/lib/fastclick.js");
require.alias("ftlabs-fastclick/lib/fastclick.js", "tower-event-directive/deps/fastclick/index.js");
require.alias("ftlabs-fastclick/lib/fastclick.js", "ftlabs-fastclick/index.js");
require.alias("tower-text-directive/index.js", "openautomation/deps/tower-text-directive/index.js");
require.alias("tower-text-directive/index.js", "tower-text-directive/index.js");
require.alias("tower-directive/index.js", "tower-text-directive/deps/tower-directive/index.js");
require.alias("tower-directive/lib/statics.js", "tower-text-directive/deps/tower-directive/lib/statics.js");
require.alias("tower-directive/lib/proto.js", "tower-text-directive/deps/tower-directive/lib/proto.js");
require.alias("tower-emitter/index.js", "tower-directive/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-directive/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-directive-expression/index.js", "tower-directive/deps/tower-directive-expression/index.js");
require.alias("tower-directive-expression/lib/compiler.js", "tower-directive/deps/tower-directive-expression/lib/compiler.js");
require.alias("tower-directive-expression/lib/expressions.js", "tower-directive/deps/tower-directive-expression/lib/expressions.js");
require.alias("tower-directive-expression/lib/path.js", "tower-directive/deps/tower-directive-expression/lib/path.js");
require.alias("tower-expression/index.js", "tower-directive-expression/deps/tower-expression/index.js");

require.alias("tower-js-expressions/index.js", "tower-directive-expression/deps/tower-js-expressions/index.js");
require.alias("tower-expression/index.js", "tower-js-expressions/deps/tower-expression/index.js");

require.alias("part-is-array/index.js", "tower-js-expressions/deps/part-is-array/index.js");

require.alias("tower-filter/index.js", "tower-directive-expression/deps/tower-filter/index.js");

require.alias("part-is-array/index.js", "tower-directive-expression/deps/part-is-array/index.js");

require.alias("tower-content/index.js", "tower-directive/deps/tower-content/index.js");
require.alias("tower-content/lib/proto.js", "tower-directive/deps/tower-content/lib/proto.js");
require.alias("tower-content/lib/statics.js", "tower-directive/deps/tower-content/lib/statics.js");
require.alias("tower-content/index.js", "tower-directive/deps/tower-content/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-attr/index.js", "tower-content/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-content/deps/tower-attr/lib/validators.js");
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

require.alias("tower-accessor/index.js", "tower-content/deps/tower-accessor/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-oid/index.js", "tower-accessor/deps/tower-oid/index.js");

require.alias("component-indexof/index.js", "tower-content/deps/indexof/index.js");

require.alias("tower-content/index.js", "tower-content/index.js");
require.alias("component-event/index.js", "tower-directive/deps/event/index.js");

require.alias("component-value/index.js", "tower-directive/deps/value/index.js");
require.alias("component-value/index.js", "tower-directive/deps/value/index.js");
require.alias("component-type/index.js", "component-value/deps/type/index.js");

require.alias("component-value/index.js", "component-value/index.js");
require.alias("tower-list-directive/index.js", "openautomation/deps/tower-list-directive/index.js");
require.alias("tower-list-directive/index.js", "tower-list-directive/index.js");
require.alias("tower-directive/index.js", "tower-list-directive/deps/tower-directive/index.js");
require.alias("tower-directive/lib/statics.js", "tower-list-directive/deps/tower-directive/lib/statics.js");
require.alias("tower-directive/lib/proto.js", "tower-list-directive/deps/tower-directive/lib/proto.js");
require.alias("tower-emitter/index.js", "tower-directive/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-directive/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-directive-expression/index.js", "tower-directive/deps/tower-directive-expression/index.js");
require.alias("tower-directive-expression/lib/compiler.js", "tower-directive/deps/tower-directive-expression/lib/compiler.js");
require.alias("tower-directive-expression/lib/expressions.js", "tower-directive/deps/tower-directive-expression/lib/expressions.js");
require.alias("tower-directive-expression/lib/path.js", "tower-directive/deps/tower-directive-expression/lib/path.js");
require.alias("tower-expression/index.js", "tower-directive-expression/deps/tower-expression/index.js");

require.alias("tower-js-expressions/index.js", "tower-directive-expression/deps/tower-js-expressions/index.js");
require.alias("tower-expression/index.js", "tower-js-expressions/deps/tower-expression/index.js");

require.alias("part-is-array/index.js", "tower-js-expressions/deps/part-is-array/index.js");

require.alias("tower-filter/index.js", "tower-directive-expression/deps/tower-filter/index.js");

require.alias("part-is-array/index.js", "tower-directive-expression/deps/part-is-array/index.js");

require.alias("tower-content/index.js", "tower-directive/deps/tower-content/index.js");
require.alias("tower-content/lib/proto.js", "tower-directive/deps/tower-content/lib/proto.js");
require.alias("tower-content/lib/statics.js", "tower-directive/deps/tower-content/lib/statics.js");
require.alias("tower-content/index.js", "tower-directive/deps/tower-content/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-attr/index.js", "tower-content/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-content/deps/tower-attr/lib/validators.js");
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

require.alias("tower-accessor/index.js", "tower-content/deps/tower-accessor/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-oid/index.js", "tower-accessor/deps/tower-oid/index.js");

require.alias("component-indexof/index.js", "tower-content/deps/indexof/index.js");

require.alias("tower-content/index.js", "tower-content/index.js");
require.alias("component-event/index.js", "tower-directive/deps/event/index.js");

require.alias("component-value/index.js", "tower-directive/deps/value/index.js");
require.alias("component-value/index.js", "tower-directive/deps/value/index.js");
require.alias("component-type/index.js", "component-value/deps/type/index.js");

require.alias("component-value/index.js", "component-value/index.js");
require.alias("tower-content/index.js", "tower-list-directive/deps/tower-content/index.js");
require.alias("tower-content/lib/proto.js", "tower-list-directive/deps/tower-content/lib/proto.js");
require.alias("tower-content/lib/statics.js", "tower-list-directive/deps/tower-content/lib/statics.js");
require.alias("tower-content/index.js", "tower-list-directive/deps/tower-content/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-attr/index.js", "tower-content/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-content/deps/tower-attr/lib/validators.js");
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

require.alias("tower-accessor/index.js", "tower-content/deps/tower-accessor/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-oid/index.js", "tower-accessor/deps/tower-oid/index.js");

require.alias("component-indexof/index.js", "tower-content/deps/indexof/index.js");

require.alias("tower-content/index.js", "tower-content/index.js");
require.alias("tower-template/index.js", "tower-list-directive/deps/tower-template/index.js");
require.alias("tower-directive/index.js", "tower-template/deps/tower-directive/index.js");
require.alias("tower-directive/lib/statics.js", "tower-template/deps/tower-directive/lib/statics.js");
require.alias("tower-directive/lib/proto.js", "tower-template/deps/tower-directive/lib/proto.js");
require.alias("tower-emitter/index.js", "tower-directive/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-directive/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-directive-expression/index.js", "tower-directive/deps/tower-directive-expression/index.js");
require.alias("tower-directive-expression/lib/compiler.js", "tower-directive/deps/tower-directive-expression/lib/compiler.js");
require.alias("tower-directive-expression/lib/expressions.js", "tower-directive/deps/tower-directive-expression/lib/expressions.js");
require.alias("tower-directive-expression/lib/path.js", "tower-directive/deps/tower-directive-expression/lib/path.js");
require.alias("tower-expression/index.js", "tower-directive-expression/deps/tower-expression/index.js");

require.alias("tower-js-expressions/index.js", "tower-directive-expression/deps/tower-js-expressions/index.js");
require.alias("tower-expression/index.js", "tower-js-expressions/deps/tower-expression/index.js");

require.alias("part-is-array/index.js", "tower-js-expressions/deps/part-is-array/index.js");

require.alias("tower-filter/index.js", "tower-directive-expression/deps/tower-filter/index.js");

require.alias("part-is-array/index.js", "tower-directive-expression/deps/part-is-array/index.js");

require.alias("tower-content/index.js", "tower-directive/deps/tower-content/index.js");
require.alias("tower-content/lib/proto.js", "tower-directive/deps/tower-content/lib/proto.js");
require.alias("tower-content/lib/statics.js", "tower-directive/deps/tower-content/lib/statics.js");
require.alias("tower-content/index.js", "tower-directive/deps/tower-content/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-attr/index.js", "tower-content/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-content/deps/tower-attr/lib/validators.js");
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

require.alias("tower-accessor/index.js", "tower-content/deps/tower-accessor/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-oid/index.js", "tower-accessor/deps/tower-oid/index.js");

require.alias("component-indexof/index.js", "tower-content/deps/indexof/index.js");

require.alias("tower-content/index.js", "tower-content/index.js");
require.alias("component-event/index.js", "tower-directive/deps/event/index.js");

require.alias("component-value/index.js", "tower-directive/deps/value/index.js");
require.alias("component-value/index.js", "tower-directive/deps/value/index.js");
require.alias("component-type/index.js", "component-value/deps/type/index.js");

require.alias("component-value/index.js", "component-value/index.js");
require.alias("tower-content/index.js", "tower-template/deps/tower-content/index.js");
require.alias("tower-content/lib/proto.js", "tower-template/deps/tower-content/lib/proto.js");
require.alias("tower-content/lib/statics.js", "tower-template/deps/tower-content/lib/statics.js");
require.alias("tower-content/index.js", "tower-template/deps/tower-content/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-content/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-attr/index.js", "tower-content/deps/tower-attr/index.js");
require.alias("tower-attr/lib/validators.js", "tower-content/deps/tower-attr/lib/validators.js");
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

require.alias("tower-accessor/index.js", "tower-content/deps/tower-accessor/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-accessor/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("tower-oid/index.js", "tower-accessor/deps/tower-oid/index.js");

require.alias("component-indexof/index.js", "tower-content/deps/indexof/index.js");

require.alias("tower-content/index.js", "tower-content/index.js");
require.alias("tower-oid/index.js", "tower-list-directive/deps/tower-oid/index.js");

require.alias("tower-observable-array/index.js", "tower-list-directive/deps/tower-observable-array/index.js");
require.alias("tower-emitter/index.js", "tower-observable-array/deps/tower-emitter/index.js");
require.alias("tower-emitter/index.js", "tower-observable-array/deps/tower-emitter/index.js");
require.alias("component-indexof/index.js", "tower-emitter/deps/indexof/index.js");

require.alias("tower-emitter/index.js", "tower-emitter/index.js");
require.alias("component-live-css/index.js", "openautomation/deps/live-css/index.js");
require.alias("component-live-css/index.js", "live-css/index.js");
require.alias("visionmedia-superagent/lib/client.js", "component-live-css/deps/superagent/lib/client.js");
require.alias("visionmedia-superagent/lib/client.js", "component-live-css/deps/superagent/index.js");
require.alias("component-emitter/index.js", "visionmedia-superagent/deps/emitter/index.js");

require.alias("component-reduce/index.js", "visionmedia-superagent/deps/reduce/index.js");

require.alias("visionmedia-superagent/lib/client.js", "visionmedia-superagent/index.js");
require.alias("visionmedia-debug/index.js", "component-live-css/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "component-live-css/deps/debug/debug.js");

require.alias("component-each/index.js", "component-live-css/deps/each/index.js");
require.alias("component-to-function/index.js", "component-each/deps/to-function/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");
require.alias("component-props/index.js", "component-props/index.js");
require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("component-url/index.js", "component-live-css/deps/url/index.js");

require.alias("openautomation/index.js", "openautomation/index.js");