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

