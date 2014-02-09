
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