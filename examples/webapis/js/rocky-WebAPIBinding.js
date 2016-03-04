/*global Rocky:true */
/*eslint max-len: [2, 100, 4]*/

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

(function() {
  Rocky.WebAPIBinding = function(canvasElement) {
    var _private = {};
    this._private = _private;

    _private.emitter = new Rocky.EventEmitter();
    _private.callRender = function(ctx) {
      var emitter = _private.emitter;
      var event = {context: ctx};
      emitter.emit(Rocky.WebAPIBinding.Events.BeforeDraw, event);
      emitter.emit(Rocky.WebAPIBinding.Events.Draw, event);
      emitter.emit(Rocky.WebAPIBinding.Events.AfterDraw, event);
    };

    // -----------------
    // TODO: extract so that this core is separate from Rocky.js
    _private.binding = Rocky.bindCanvas(canvasElement);
    _private.binding.update_proc = function(ctx, bounds) {
      var ctx2D = new Rocky.CanvasRenderingContext2D(_private.binding, ctx, bounds);
      _private.callRender(ctx2D, bounds);
    };
    this.requestDraw = function() {
      _private.binding.mark_dirty();
    };

    // iterate over all known event services
    _private.eventServices = [];
    (Rocky.eventServices || []).forEach(function(EventService) {
      _private.eventServices.push(new EventService(_private));
    });
    // derive this form binding
    this.innerWidth = 144;
    this.innerHeight = 168;

    // make this for real
    setTimeout(function() {_private.emitter.emit('visibilitychange');});
    // -----------------
  };

  // delegate a subset of the EventEmitter API
  ['addListener', 'on', 'addOnceListener', 'once', 'removeListener', 'off'].forEach(
    function(n) {
      Rocky.WebAPIBinding.prototype[n] = function(event, callback) {
        // TODO: find a better way to refer to the emitter
        //       without creating a leak or exposing _private
        var emitter = this._private.emitter;
        emitter[n](event, callback.bind(this));
        if (event !== Rocky.WebAPIBinding.Events.EventListenerChange) {
          emitter.emit(Rocky.WebAPIBinding.Events.EventListenerChange, emitter);
        }
      };
    }
  );

  // replicate EventTarget APIs
  Rocky.WebAPIBinding.prototype.addEventListener = Rocky.WebAPIBinding.prototype.addListener;
  Rocky.WebAPIBinding.prototype.removeEventListener = Rocky.WebAPIBinding.prototype.removeListener;

  Rocky.WebAPIBinding.Events = {
    BeforeDraw: 'beforedraw',
    Draw: 'draw',
    AfterDraw: 'afterdraw',
    EventListenerChange: 'eventlistenerchange'
  };
})();

