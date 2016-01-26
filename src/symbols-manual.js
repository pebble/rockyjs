/*

  Copyright © 2015-2016 Pebble Technology Corp.,
  All Rights Reserved. http://pebble.github.io/rockyjs/LICENSE

  This files contains various symbols that were manually written to match
  the behavior of the Pebble firmware code base.

  Most of code below translates and normalizes JS values so that they
  can be used in other routines.

  Functions that normalize structured values such as GPoint() are considered
  to be idempotent so that they can be used to sanitize arguments.

 */

/*global Rocky:true, XMLHttpRequest:true */

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

Rocky.addManualSymbols = function(obj) {
  // #define DEG_TO_TRIGANGLE(angle) (((angle) * TRIG_MAX_ANGLE) / 360)
  obj.DEG_TO_TRIGANGLE = function(deg) {
    return deg * 2 * Math.PI / 360;
  };

  // #define GPoint(x, y) ((GPoint){(x), (y)})
  obj.GPoint = function(x, y) {
    if (arguments.length === 1 && typeof (arguments[0]) === 'object') {
      var obj = (typeof (x[0]) === 'undefined') ? x : {};
      obj.y = typeof (x[1]) !== 'undefined' ? x[1] : x.y;
      obj.x = typeof (x[0]) !== 'undefined' ? x[0] : x.x;
      return obj;
    }
    return {x: x, y: y};
  };

  // #define GSize(w, h) ((GSize){(w), (h)})
  obj.GSize = function(w, h) {
    if (arguments.length === 1 && typeof (arguments[0]) === 'object') {
      var obj = (typeof (w[0]) === 'undefined') ? w : {};
      obj.h = typeof (w[1]) !== 'undefined' ? w[1] : w.h;
      obj.w = typeof (w[0]) !== 'undefined' ? w[0] : w.w;
      return obj;
    }
    return {w: w, h: h};
  };

  // #define GRect(x, y, w, h) ((GRect){{(x), (y)}, {(w), (h)}})
  obj.GRect = function(x, y, w, h) {
    if (arguments.length === 1 && typeof (arguments[0]) === 'object') {
      var obj = (typeof (x[0]) === 'undefined') ? x : {};
      obj.y = typeof (x[1]) !== 'undefined' ? x[1] : x.y;
      obj.w = typeof (x[2]) !== 'undefined' ? x[2] : x.w;
      obj.h = typeof (x[3]) !== 'undefined' ? x[3] : x.h;
      obj.x = typeof (x[0]) !== 'undefined' ? x[0] : x.x;
      return obj;
    }
    return {x: x, y: y, w: w, h: h};
  };

  obj.GRectZero = obj.GRect(0, 0, 0, 0);

  obj.GEdgeInsets = function(top, right, bottom, left) {
    if (arguments.length === 1 && typeof (top) === 'object') {
      var obj = top;
      return {
        top: typeof (obj[0]) !== 'undefined' ? obj[0] : obj.top,
        right: typeof (obj[1]) !== 'undefined' ? obj[1] : obj.right,
        bottom: typeof (obj[2]) !== 'undefined' ? obj[2] : obj.bottom,
        left: typeof (obj[3]) !== 'undefined' ? obj[3] : obj.left
      };
    }
    right = arguments.length <= 1 ? top : right;
    bottom = arguments.length <= 2 ? top : bottom;
    left = arguments.length <= 3 ? right : left;
    return {top: top, right: right, bottom: bottom, left: left};
  };

  obj.grect_inset = function(rect, insets) {
    rect = obj.GRect(rect);
    insets = obj.GEdgeInsets(insets);
    var w = rect.w - insets.left - insets.right;
    var h = rect.h - insets.top - insets.bottom;
    if (w < 0 || h < 0) {
      return obj.GRectZero;
    }
    return obj.GRect(rect.x + insets.left, rect.y + insets.top, w, h);
  };

  obj.Resources = {
    status: {
      loading: 'loading', error: 'error', loaded: 'loaded'
    },

    load: function(url, cb) {
      if (!url || typeof cb !== 'function') {
        return this.status.error;
      }

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function(e) {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          var success = (xhr.status === 200);
          if (success) {
            var data = new Int8Array(xhr.response);
            cb(this.status.loaded, data);
          } else {
            cb(this.status.error);
          }
        }
      }.bind(this);
      xhr.send();

      return this.status.loading;
    }
  };

  obj.Data = {
    captureCPointerWithData: function(data) {
      if (!data) {
        return 0;
      }
      var length = data.length;
      var ptr = obj.module._malloc(length);
      if (!ptr) {
        return ptr;
      }

      for (var i = 0; i < data.length; i++) {
        obj.module.setValue(ptr + i, data[i], 'i8');
      }

      return ptr;
    },
    releaseCPointer: function(ptr) {
      obj.module._free(ptr);
    }
  };

  var gbitmapSetStatusAndData = function(bmp, status, data) {
    bmp.status = status;
    bmp.data = data;
    if (status === obj.Resources.status.loaded && bmp.onload) {
      bmp.onload();
    } else
    if (status === obj.Resources.status.error && bmp.onerror) {
      bmp.onerror();
    }
    return bmp.status;
  };

  var gbitmapCreate = function(obtainData) {
    var result = {
      obtainData: obtainData,
      captureCPointer: function() {
        this.dataPtr = obj.Data.captureCPointerWithData(this.data);
        if (!this.dataPtr) {
          return 0;
        }
        this.bmpPtr = obj.module.ccall('gbitmap_create_with_data', 'number',
                                      ['number'], [this.dataPtr]);
        return this.bmpPtr;
      },
      releaseCPointer: function() {
        obj.module.ccall('gbitmap_destroy', 'void', ['number'], [this.bmpPtr]);
        delete this.bmpPtr;
        obj.Data.releaseCPointer(this.dataPtr);
        delete this.dataPtr;
      }
    };

    result.status = result.obtainData();

    return result;
  };

  obj.gbitmap_create = function(url) {
    return gbitmapCreate(function() {
      var bmp = this;
      return obj.Resources.load(url, function(status, data) {
        return gbitmapSetStatusAndData(bmp, status, data);
      });
    });
  };

  obj.gbitmap_create_with_data = function(data) {
    return gbitmapCreate(function() {
      return gbitmapSetStatusAndData(this, obj.Resources.status.loaded, data);
    });
  };

};

// export to enable unit tests
if (typeof (module) !== 'undefined' && module.exports !== null) {
  exports.addManualSymbols = Rocky.addManualSymbols;
  exports.symbols = {};
  Rocky.addManualSymbols(exports.symbols);
}
