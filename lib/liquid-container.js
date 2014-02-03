
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