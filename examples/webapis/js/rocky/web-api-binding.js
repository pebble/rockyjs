/*eslint max-len: [2, 100, 4]*/

var CanvasRenderingContext2D = require('./canvas-rendering-context-2d');
var TickService = require('./tick-service');
var Rocky = require('rocky');

function WebAPIBinding(canvasElement) {
  var _private = {};
  this._private = _private;

  _private.subscriptions = {
    emit: function(name, event) {
      var f = this[name];
      if (typeof f === 'function') {
        f(event);
      }
    }
  };

  // -----------------
  if (typeof Rocky.bindCanvas === 'function') {
    _private.binding = Rocky.bindCanvas(canvasElement);
  } else if (typeof Rocky.bindNative === 'function') {
    _private.binding = Rocky.bindNative(canvasElement);
  } else {
    throw new Error('cannot create a binding');
  }
  _private.binding.update_proc = function(ctx, bounds) {
    var ctx2D = new CanvasRenderingContext2D(_private.binding, ctx, bounds);
    _private.subscriptions.emit('draw', {context: ctx2D});
  };
  this.requestDraw = function() {
    _private.binding.mark_dirty();
  };
  // -----------------
}

WebAPIBinding.prototype.on = function(event, callback) {
  // workaround for speed reasons: this is a poor shadow of a real event emitter…
  if (['draw', 'minutechange'].indexOf(event) < 0) {
    throw new Error('unknown event ' + event);
  }
  if (typeof this._private.subscriptions[event] !== 'undefined') {
    throw new Error('event can only be bound once ' + event);
  }

  this._private.subscriptions[event] = callback.bind(this);

  if (event === 'minutechange') {
    var tickService = new TickService(callback);
    tickService.schedule();
  }
};

module.exports = WebAPIBinding;
