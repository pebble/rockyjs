/*global Rocky:true */

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

(function() {
  Rocky.WebAPIBinding = function(canvasElement) {
    this._binding = Rocky.bindCanvas(canvasElement);
    this._emitter = new Rocky.EventEmitter();

    this._callRender = function(ctx, bounds) {
      var ctx2D = new Rocky.CanvasRenderingContext2D(this._binding, ctx, bounds);

      this._emitter.emit(Rocky.WebAPIBinding.Events.BeforeRender, ctx2D);
      this._emitter.emit(Rocky.WebAPIBinding.Events.Render, ctx2D, bounds);
      this._emitter.emit(Rocky.WebAPIBinding.Events.AfterRender, ctx2D);
    };

    this._binding.update_proc = function(ctx, bounds) {
      this._callRender(ctx, bounds);
    }.bind(this);

    // iterate over all known event services
    (Rocky.eventServices || []).forEach(function(EventService) {
      this._eventServices = new EventService(this);
    }.bind(this));
  };

  // delegate a subset of the EventEmitter API
  ['addListener', 'on', 'addOnceListener', 'once', 'removeListener', 'off'].forEach(
    function(n) {
      Rocky.WebAPIBinding.prototype[n] = function(event, callback) {
        this._emitter[n].apply(this._emitter, arguments);
        if (event !== Rocky.WebAPIBinding.Events.EventListenerChange) {
          this._emitter.emit(Rocky.WebAPIBinding.Events.EventListenerChange,
                             this._emitter);
        }
      };
    }
  );

  Rocky.WebAPIBinding.Events = {
    BeforeRender: 'beforerender',
    Render: 'render',
    AfterRender: 'afterrender',
    EventListenerChange: 'eventlistenerchange'
  };

  Rocky.WebAPIBinding.prototype.requestRender = function() {
    this._binding.mark_dirty();
  };
})();

