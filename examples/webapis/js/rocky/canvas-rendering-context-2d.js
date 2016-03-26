var GColorFromStyle = require('./gcolor-from-style');
var Path2D = require('./path-2d');

function CanvasRenderingContext2D(rockyBinding, ctx, bounds) {
  this.binding = rockyBinding;
  this.cPtr = ctx;
  this.canvas = {
    clientWidth: bounds.w,
    clientHeight: bounds.h
  };
  this.beginPath();
}

CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
  var rect = this.binding.GRect(x, y, width, height);
  this.binding.graphics_fill_rect(this.cPtr, rect, 0, 0);
};

Object.defineProperties(CanvasRenderingContext2D.prototype, {
  'fillStyle': {
    get: function() {
      return 'not implement, yet';
    },
    set: function(value) {
      var color = GColorFromStyle(value);
      this.binding.graphics_context_set_fill_color(this.cPtr, color);
    }
  },
  'strokeStyle': {
    get: function() {
      return 'not implement, yet';
    },
    set: function(value) {
      var color = GColorFromStyle(value);
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

CanvasRenderingContext2D.prototype.beginPath = function() {
  this.currentPath = new Path2D();
};

CanvasRenderingContext2D.prototype.stroke = function(path) {
  path = path || this.currentPath;
  // TODO: implement this fully
  this.binding.graphics_draw_line(this.cPtr, path.p0, path.p1);
};

// forward path calls to current Path2D instance
['moveTo', 'lineTo'].forEach(function(s) {
  CanvasRenderingContext2D.prototype[s] = function() {
    var f = this.currentPath[s];
    f.apply(this.currentPath, arguments);
  };
});

module.exports = CanvasRenderingContext2D;
