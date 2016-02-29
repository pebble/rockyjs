/*global Rocky:true */

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

(function() {

  Rocky.CanvasRenderingContext2D = function(rocky, ctx, bounds) {
    this.rocky = rocky;
    this.cPtr = ctx;
    this.canvas = {
      clientWidth: bounds.w,
      clientHeight: bounds.h
    };
    this.beginPath();
  };

  Rocky.CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
    var rect = this.rocky.GRect(x, y, width, height);
    this.rocky.graphics_fill_rect(this.cPtr, rect, 0, 0);
  };

  Object.defineProperties(Rocky.CanvasRenderingContext2D.prototype, {
    'fillStyle': {
      get: function() {
        return 'not implement, yet';
      },
      set: function(value) {
        var color = Rocky.GColorFromStyle(value);
        this.rocky.graphics_context_set_fill_color(this.cPtr, color);
      }
    },
    'strokeStyle': {
      get: function() {
        return 'not implement, yet';
      },
      set: function(value) {
        var color = Rocky.GColorFromStyle(value);
        this.rocky.graphics_context_set_stroke_color(this.cPtr, color);
      }
    },
    'lineWidth': {
      get: function() {
        return 'not implement, yet';
      },
      set: function(value) {
        this.rocky.graphics_context_set_stroke_width(this.cPtr, value);
      }
    }
  });

  Rocky.CanvasRenderingContext2D.prototype.beginPath = function() {
    this.currentPath = new Rocky.Path2D();
  };

  Rocky.CanvasRenderingContext2D.prototype.stroke = function(path) {
    path = path || this.currentPath;
    // TODO: implement this fully
    this.rocky.graphics_draw_line(this.cPtr, path.p0, path.p1);
  };

  // forward path calls to current Path2D instance
  ['moveTo', 'lineTo'].forEach(function(s) {
    Rocky.CanvasRenderingContext2D.prototype[s] = function() {
      var f = this.currentPath[s];
      f.apply(this.currentPath, arguments);
    };
  });
})();

