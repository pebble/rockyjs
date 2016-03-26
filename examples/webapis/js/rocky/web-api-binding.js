/*eslint max-len: [2, 100, 4]*/

(function() {
  var CanvasRenderingContext2D = require('./canvas-rendering-context-2d');
  var EventEmitter = require('./event-emitter');
  var Rocky = require('rocky');

  function WebAPIBinding(canvasElement) {
    var _private = {};
    this._private = _private;

    _private.emitter = new EventEmitter();
    _private.callRender = function(ctx) {
      var emitter = _private.emitter;
      var event = {context: ctx};
      emitter.emit(WebAPIBinding.Events.BeforeDraw, event);
      emitter.emit(WebAPIBinding.Events.Draw, event);
      emitter.emit(WebAPIBinding.Events.AfterDraw, event);
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
      _private.callRender(ctx2D, bounds);
    };
    this.requestDraw = function() {
      _private.binding.mark_dirty();
    };

    // iterate over all known event services
    _private.eventServices = [];
    ([require('./tick-service')]).forEach(function(EventService) {
      _private.eventServices.push(new EventService(_private));
    });

    // TODO: derive this form binding
    this.innerWidth = 144;
    this.innerHeight = 168;

    // TODO: make this for real
    setTimeout(function() {_private.emitter.emit('visibilitychange');});
    // -----------------
  };

  // delegate a subset of the EventEmitter API
  ['addListener', 'on', 'addOnceListener', 'once', 'removeListener', 'off'].forEach(
    function(n) {
      WebAPIBinding.prototype[n] = function(event, callback) {
        // TODO: find a better way to refer to the emitter
        //       without creating a leak or exposing _private
        var emitter = this._private.emitter;
        emitter[n](event, callback.bind(this));
        if (event !== WebAPIBinding.Events.EventListenerChange) {
          emitter.emit(WebAPIBinding.Events.EventListenerChange, emitter);
        }
      };
    }
  );

  // replicate EventTarget APIs
  WebAPIBinding.prototype.addEventListener = WebAPIBinding.prototype.addListener;
  WebAPIBinding.prototype.removeEventListener = WebAPIBinding.prototype.removeListener;

  WebAPIBinding.Events = {
    BeforeDraw: 'beforedraw',
    Draw: 'draw',
    AfterDraw: 'afterdraw',
    EventListenerChange: 'eventlistenerchange'
  };

  module.exports = WebAPIBinding;
})();
