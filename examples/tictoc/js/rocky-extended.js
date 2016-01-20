/*eslint "no-unused-vars": [2, { "args": "none", "vars": "local" }]*/
/*global Rocky:true, TimerService:true, Window:true*/

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

TimerService = {
  'subscribe': function(granularity, cb) {
    function timer_loop() {
      var date = new Date();
      var dt = {
        hour: date.getHours(),
        min: date.getMinutes(),
        sec: date.getSeconds()
      };
      cb(dt);
    }
    setInterval(timer_loop, 1000);
    timer_loop();
  }
};

Window = function() {
  var that = this;
  this.rootLayer = {
    'bounds': {'origin': {'x': 0, 'y': 0}, 'size': {'w': 144, 'h': 168}},
    'markDirty': function() {
      var rocky = Rocky.activeBinding;
      rocky.mark_dirty();
    },
    'setUpdateProc': function(proc) {
      var rocky = Rocky.activeBinding;
      rocky.update_proc = function(ctx, bounds) {
        var enhanced_context = {
          setFillColor: function(color) {
            var rocky = Rocky.activeBinding;
            rocky.graphics_context_set_fill_color(ctx, color);
          },
          setStrokeColor: function(color) {
            var rocky = Rocky.activeBinding;
            rocky.graphics_context_set_stroke_color(ctx, color);
          },
          setStrokeWidth: function(color) {
            var rocky = Rocky.activeBinding;
            rocky.graphics_context_set_stroke_width(ctx, color);
          },
          drawLine: function(p0, p1) {
            var rocky = Rocky.activeBinding;
            rocky.graphics_draw_line(ctx, [p0.x, p0.y], [p1.x, p1.y]);
          },
          fillRect: function(rect) {
            var rocky = Rocky.activeBinding;
            rocky.graphics_fill_rect(ctx,
                [rect.origin.x, rect.origin.y, rect.size.w, rect.size.h]);
          },
          fillCircle: function(center, radius) {
            var rocky = Rocky.activeBinding;
            var rect = rocky.GRect(center.x - radius, center.y - radius,
                                   radius * 2, radius * 2);
            rocky.graphics_fill_radial(ctx, rect, rocky.GOvalScaleModeFillCircle,
                                       radius * 2, 0, Math.PI * 2);
          }
        };
        proc.apply(that.rootLayer, [enhanced_context]);
      };
    }
  };

  this.push = function() {
    if (typeof (this.handlers.load) === 'function') {
      this.handlers.load.apply(this);
    }
  };

  this.setWindowHandlers = function(handlers) {
    this.handlers = handlers;
  };
};
