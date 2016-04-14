
/*global Rocky:true */
/*eslint max-len: [2, 100, 4]*/

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

(function() {
  Rocky.WebAPIBinding = function(canvasElement) {
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
      var ctx2D = new Rocky.CanvasRenderingContext2D(_private.binding, ctx, bounds);
      _private.subscriptions.emit('draw', {context: ctx2D});
    };
    this.requestDraw = function() {
      _private.binding.mark_dirty();
    };

    // TODO: derive this form binding
    this.innerWidth = 144;
    this.innerHeight = 168;

    // -----------------
  };

  Rocky.WebAPIBinding.prototype.on = function(event, callback) {
    // workaround for speed reasons: this is a poor shadow of a real event emitter…
    if (['draw', 'minutechange'].indexOf(event) < 0) {
      throw new Error('unknown event ' + event);
    }
    if (typeof this._private.subscriptions[event] !== 'undefined') {
      throw new Error('event can only be bound once ' + event);
    }

    this._private.subscriptions[event] = callback.bind(this);

    if (event === 'minutechange') {
      var tickService = new Rocky.TickService(callback);
      tickService.schedule();
    }
  };

})();

/*global Rocky:true */

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

(function() {

  Rocky.CanvasRenderingContext2D = function(rockyBinding, ctx, bounds) {
    this.binding = rockyBinding;
    this.cPtr = ctx;
    this.canvas = {
      clientWidth: bounds.w,
      clientHeight: bounds.h
    };
    this.beginPath();
  };

  Rocky.CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
    this.binding.graphics_fill_rect(this.cPtr, [x, y, width, height], 0, 0);
  };

  Object.defineProperties(Rocky.CanvasRenderingContext2D.prototype, {
    'fillStyle': {
      get: function() {
        return 'not implement, yet';
      },
      set: function(value) {
        var color = Rocky.GColorFromStyle(value);
        this.binding.graphics_context_set_fill_color(this.cPtr, color);
      }
    },
    'strokeStyle': {
      get: function() {
        return 'not implement, yet';
      },
      set: function(value) {
        var color = Rocky.GColorFromStyle(value);
        this.binding.graphics_context_set_stroke_color(this.cPtr, color);
      }
    },
    'lineWidth': {
      get: function() {
        return 'not implement, yet';
      },
      set: function(value) {
        this.binding.graphics_context_set_stroke_width(this.cPtr, value);
      }
    }
  });

  Rocky.CanvasRenderingContext2D.prototype.beginPath = function() {
    this.currentPath = new Rocky.Path2D();
  };

  Rocky.CanvasRenderingContext2D.prototype.stroke = function(path) {
    path = path || this.currentPath;
    // TODO: implement this fully
    this.binding.graphics_draw_line(this.cPtr, path.p0, path.p1);
  };

  // forward path calls to current Path2D instance
  ['moveTo', 'lineTo'].forEach(function(s) {
    Rocky.CanvasRenderingContext2D.prototype[s] = function() {
      var f = this.currentPath[s];
      f.apply(this.currentPath, arguments);
    };
  });
})();

/*global Rocky:true */

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

(function() {
  var colorNames = {
    black: 0xC0,
    red: 0xF0,
    white: 0xFF
  };

  Rocky.GColorFromStyle = function(style) {
    // TODO: implement fully
    return colorNames[style];
  };
})();
/*global Rocky:true */

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

(function() {
  Rocky.Path2D = function() {
  };

  var rounded = function(v) {
    return Math.round(v * 8) / 8;
  };

  // TODO: implement this correctly
  Rocky.Path2D.prototype.moveTo = function(x, y) {
    this.p0 = [rounded(x), rounded(y)];
  };
  Rocky.Path2D.prototype.lineTo = function(x, y) {
    this.p1 = [rounded(x), rounded(y)];
  };

})();
/*global Rocky:true */

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

(function() {
  function clockwiseRad(fraction) {
    // TODO: figure out if this is actually correct orientation for Canvas APIs
    return (1.5 - fraction) * 2 * Math.PI;
  }

  Rocky.WatchfaceHelper = function(date) {
    date = date || new Date();
    var secondFraction = date.getSeconds() / 60;
    var minuteFraction = (date.getMinutes()) / 60;
    var hourFraction = (date.getHours() % 12 + minuteFraction) / 12;
    this.secondAngle = clockwiseRad(secondFraction);
    this.minuteAngle = clockwiseRad(minuteFraction);
    this.hourAngle = clockwiseRad(hourFraction);
  };
})();
/*global Rocky:true */

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

(function() {
  Rocky.TickService = function(listener) {
    this.listener = listener;
  };

  Rocky.TickService.Events = {
    SecondChange: 'secondchange',
    MinuteChange: 'minutechange',
    HourChange: 'hourchange',
    DayChange: 'daychange'
  };

  var segmentSizes = [
    ['secondchange', 1000],
    ['minutechange', 1000 * 60],
    ['hourchange', 1000 * 60 * 60],
    ['daychange', 1000 * 60 * 60 * 24]
  ];

  Rocky.TickService.prototype.eventObject = function(date) {
    var now = date.getTime();
    var result = {date: date};
    for (var i = 0; i < segmentSizes.length; i++) {
      var segment = segmentSizes[i];
      var eventName = segment[0];
      var segmentSize = segment[1];
      var msUntilEndOfSegment = segmentSize - now % segmentSize;
      result[eventName] = msUntilEndOfSegment === 0;
    }

    return result;
  };

  Rocky.TickService.prototype.schedule = function() {
    var now = new Date();

    var event = this.eventObject(now);
    this.listener(event);

    // we're iterating from the smaller to the larger segments
    // which is ok (as they are multiples)
    // we fire an event for the smallest segment
    var nowMs = now.getTime();
    // HACK! always assumes minute minute change!

    var segment = segmentSizes[1];
    var eventName = segment[0];
    var segmentSize = segment[1];

    var msUntilEndOfSegment = segmentSize - nowMs % segmentSize;

    // prepare the passed date object to reflect the future date
    var futureDate = new Date(nowMs + msUntilEndOfSegment);
    this.timeoutId = setTimeout(function() {
      this.listener(eventName, this.eventObject(futureDate));
      this.schedule();
    }.bind(this), msUntilEndOfSegment);
  };
})();
var rocky = new Rocky.WebAPIBinding();
/*global rocky, Rocky:false */
// in the future, we will replace the singleton
// `rocky` as well as the namespace `Rocky`, e.g.
// `Rocky.tween` and `Rocky.WatchfaceHelper` with modules

// book keeping so that we can easily animate the two hands for the watchface
// .scale/.angle are updated by tween/event handler (see below)
var renderState = {
  minute: {style: 'white', scale: 0.85, angle: 0},
  hour: {style: 'red', scale: 0.6, angle: 0}
};

// helper function for the draw function (see below)
// extracted as a standalone function to satisfy common believe in efficient JS code
// TODO: verify that this has actually any effect on byte code level
var drawHand = function(handState, ctx, cx, cy, maxRadius) {
  ctx.lineWidth = 8;
  ctx.strokeStyle = handState.style;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.sin(handState.angle) * handState.scale * maxRadius,
             cy + Math.cos(handState.angle) * handState.scale * maxRadius);
  ctx.stroke();
};

// the 'draw' event is being emitted after each call to rocky.requestDraw() but
// at most once for each screen update, even if .requestDraw() is called frequently
// the 'draw' event might also fire at other meaningful times (e.g. upon launch)
rocky.on('draw', function(drawEvent) {
  var ctx = drawEvent.context;
  var w = this.innerWidth;
  var h = this.innerHeight;

  // clear canvas on each render
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, w, h);

  // center point
  var cx = w / 2;
  var cy = h / 2;
  var maxRadius = Math.min(w, h - 2 * 10) / 2;
  drawHand(renderState.minute, ctx, cx, cy, maxRadius);
  drawHand(renderState.hour, ctx, cx, cy, maxRadius);

  // Draw a 12 o clock indicator
  drawHand({style: 'white', scale: 0, angle: 0}, ctx, cx, 8, 0);
});

// listener is called on each full minute and once immediately after registration
rocky.on('minutechange', function(e) {
  // WatchfaceHelper will later be extracted as npm module
  var wfh = new Rocky.WatchfaceHelper(e.date);
  renderState.minute.angle = wfh.minuteAngle;
  renderState.hour.angle = wfh.hourAngle;
  rocky.requestDraw();
});
