
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

  // draw rectangle
  var rect = this.rect = this.parent.rect(100, 100);
  rect.radius(10);
  rect.fill({ opacity: 0 });
  rect.stroke({ width: 2 });
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
  this.emit('visit', e.target.__data__);
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