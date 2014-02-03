
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