
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
 * Instantiate a new `Microplate` sprite.
 */

function Microplate(drawing) {
  this.parent = drawing;
  this.group = drawing.group();
  var rect = this.rect = drawing.rect(100, 100);
  rect.radius(10);
  this.group.add(rect);
  this.bind();
}

/**
 * Mixin `Emitter`.
 */

Emitter(Microplate.prototype);

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