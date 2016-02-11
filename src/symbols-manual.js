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

/*global Rocky:true, XMLHttpRequest:false, atob:false */

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
    defaultProxy: 'http://butkus.pebbledev.com',
    status: {
      loading: 'loading', error: 'error', loaded: 'loaded'
    },
    config: function(config, convertPath, proxyArgs) {
      var isObject = (typeof config === 'object');
      config = isObject ? config : {url: config};
      config.convertPath = config.convertPath || convertPath;
      if (proxyArgs) {
        proxyArgs = proxyArgs.filter(function(arg) {
          return arg in config;
        }).map(function(arg) {
          return [arg, config[arg]];
        });
      }
      config.proxyArgs = config.proxyArgs || proxyArgs || [];

      return config;
    },
    constructURL: function(config) {
      if (!config) {
        return undefined;
      }

      if (config.dataURL) {
        return config.dataURL;
      }

      if (!config.url) {
        return undefined;
      }

      var proxy = config.proxy || this.defaultProxy;
      if (!proxy) {
        return config.url;
      }

      var path = proxy;
      if (config.convertPath) {
        path += config.convertPath;
      }

      var args = [['url', config.url]].concat(config.proxyArgs || []);
      args = args.map(function(arg) {
        return '' + arg[0] + '=' + encodeURIComponent(arg[1]);
      }).join('&');

      return path + '?' + args;
    },

    load: function(config, cb) {
      config = obj.Resources.config(config);
      var url = this.constructURL(config);

      if (!url || typeof cb !== 'function') {
        return this.status.error;
      }

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'json';
      xhr.onload = function(e) {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          var success = (xhr.status === 200);
          if (success) {
            var data = xhr.response;
            cb(this.status.loaded, data);
          } else {
            cb(this.status.error);
          }
        }
      }.bind(this);
      xhr.onerror = function() {
        cb(this.status.error);
      }.bind(this);
      xhr.send();

      return this.status.loading;
    }
  };

  obj.Data = {
    byteAt: function(data, i) {
      return (typeof data === 'string') ? data.charCodeAt(i) : data[i];
    },
    captureCPointerWithData: function(data) {
      if (!data) {
        return [0, 0];
      }
      var length = data.length;
      var ptr = obj.module._malloc(length);
      if (!ptr) {
        return ptr;
      }

      for (var i = 0; i < data.length; i++) {
        var byte = obj.Data.byteAt(data, i);
        obj.module.setValue(ptr + i, byte, 'i8');
      }

      return [ptr, length];
    },
    releaseCPointer: function(ptr, numReadBytes) {
      if (!ptr) {
        return undefined;
      }
      var result = [];
      numReadBytes = numReadBytes || 0;
      for (var i = 0; i < numReadBytes; i++) {
        var byte = obj.module.getValue(ptr + i, 'i8');
        result.push(byte);
      }
      obj.module._free(ptr);
      return result;
    }
  };

  var resourceObjectSetStatusAndCallEvents = function(resObj, status) {
    resObj.status = status;
    if (status === obj.Resources.status.loaded && resObj.onload) {
      resObj.onload();
    } else
    if (status === obj.Resources.status.error && resObj.onerror) {
      resObj.onerror();
    }
    return resObj.status;
  };

  var gbitmapCreate = function(obtainData) {
    var result = {
      obtainData: obtainData,
      captureCPointer: function() {

        var dataAndSize = obj.Data.captureCPointerWithData(this.data);
        this.dataPtr = dataAndSize[0];
        var size = dataAndSize[1];
        if (!this.dataPtr || !size) {
          return 0;
        }
        if (this.dataFormat === 'png') {
          this.bmpPtr = obj.module.ccall('gbitmap_create_from_png_data', 'number',
            ['number', 'number'], [this.dataPtr, size]);
        } else {
          this.bmpPtr = obj.module.ccall('gbitmap_create_with_data', 'number',
            ['number'], [this.dataPtr]);
        }
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

  obj.gbitmap_create = function(config) {
    config = obj.Resources.config(config, '/convert/image');
    return gbitmapCreate(function() {
      var bmp = this;
      return obj.Resources.load(config, function(status, data) {
        var hasData = (data && data.output);
        bmp.data = hasData ? atob(data.output.data) : undefined;
        bmp.dataFormat = hasData ? data.output.outputFormat : undefined;
        return resourceObjectSetStatusAndCallEvents(bmp, status);
      });
    });
  };

  obj.gbitmap_create_with_data = function(data) {
    return gbitmapCreate(function() {
      this.data = data;
      this.dataFormat = 'pbi';
      return resourceObjectSetStatusAndCallEvents(this, obj.Resources.status.loaded);
    });
  };

  obj.gpath_create = function(config) {
    // handle case where config is an array
    if (!('points' in config)) {
      config = {points: config};
    }
    config.points = config.points.map(function(pt) {return obj.GPoint(pt);});
    config.offset = obj.GPoint(config.offset || [0, 0]);
    config.rotation = config.rotation || 0;
    config.captureCPointer = function() {
      // we're describing a GPath structure followed by the actual points
      // typedef struct GPath {
      //   uint32_t num_points; // 0
      //   GPoint *points;      // 4
      //   int32_t rotation;    // 8
      //   GPoint offset;       // 12
      // } GPath;               // 16+ actual points
      var needed_bytes = 16 + this.points.length * 4;
      var ptr = obj.module._malloc(needed_bytes);
      obj.module.setValue(ptr + 0, this.points.length, 'i32');
      obj.module.setValue(ptr + 4, ptr + 16, 'i32');
      var TRIG_MAX_ANGLE = 0x10000;
      var rotation = (this.rotation * TRIG_MAX_ANGLE) / (Math.PI * 2);
      obj.module.setValue(ptr + 8, rotation, 'i32');
      obj.module.setValue(ptr + 12 + 0, this.offset.x, 'i16');
      obj.module.setValue(ptr + 12 + 2, this.offset.y, 'i16');
      for (var i = 0; i < this.points.length; i++) {
        var pt = this.points[i];
        obj.module.setValue(ptr + 16 + i * 4 + 0, pt.x, 'i16');
        obj.module.setValue(ptr + 16 + i * 4 + 2, pt.y, 'i16');
      }
      return ptr;
    };
    config.releaseCPointer = function(ptr) {
      obj.module._free(ptr);
    };

    return config;
  };

  // void gpath_rotate_to(GPath *path, int32_t angle);
  obj.gpath_rotate_to = function(path, angle) {
    path.rotation = angle;
  };

  // void gpath_move_to(GPath *path, GPoint point);
  obj.gpath_move_to = function(path, point) {
    path.offset = obj.GPoint(point);
  };

  obj.fonts_get_system_font = function(name) {
    if (!name) {
      return null;
    }
    var sysFont = obj.module.ccall('fonts_get_system_font', 'number',
                                  ['string'], [name]);
    if (!sysFont) {
      return null;
    }

    return {
      status: obj.Resources.status.loaded,
      captureCPointer: function() {
        return sysFont;
      },
      releaseCPointer: function() {
        // nothing to do
      }
    };
  };

  var resourceObjectCreate = function(funcs) {
    var result = {
      obtainData: funcs.obtainData,
      captureCPointer: function() {
        if (this.status !== obj.Resources.status.loaded || !this.data) {
          return 0;
        }

        this.read_cb = obj.module.Runtime.addFunction(
          function(offset, buf, numBytes) {
            for (var i = 0; (i < numBytes) && (i + offset < this.data.length); i++) {
              var byte = obj.Data.byteAt(this.data, offset + i);
              obj.module.setValue(buf + i, byte, 'i8');
            }
            return i;
          }.bind(this)
        );
        this.get_size_cb = obj.module.Runtime.addFunction(function() {
          return this.data.length;
        }.bind(this));

        // uint32_t emx_resources_register_custom(ResourceReadCb read_cb,
        //                                        ResourceGetSizeCb get_size_cb);
        this.resourceId = obj.module.ccall(
          'emx_resources_register_custom', 'number',
          ['number', 'number'], [this.read_cb, this.get_size_cb]);

        return funcs.captureCPointer.call(this, this.resourceId);
      },
      releaseCPointer: function(ptr) {
        if (!ptr) {
          return;
        }
        funcs.releaseCPointer.call(this, ptr);

        // void emx_resources_remove_custom(uint32_t resource_id);
        obj.module.ccall('emx_resources_remove_custom', 'void',
          ['number'], [this.resourceId]);
        delete this.resourceId;

        obj.module.Runtime.removeFunction(this.read_cb);
        delete this.read_cb;

        obj.module.Runtime.removeFunction(this.get_size_cb);
        delete this.get_size_cb;
      }
    };
    result.status = result.obtainData();
    return result;
  };

  var customFontCreate = function(obtainData) {
    return resourceObjectCreate({
      obtainData: obtainData,
      captureCPointer: function(resId) {
        // GFont fonts_load_custom_font(ResHandle handle);
        return obj.module.ccall('fonts_load_custom_font',
          'number', ['number'], [resId]);
      },
      releaseCPointer: function(fontId) {
        // void fonts_unload_custom_font(GFont font);
        obj.module.ccall('fonts_unload_custom_font', 'void',
          ['number'], [fontId]);
      }
    });
  };

  obj.fonts_load_custom_font_with_data = function(data) {
    return customFontCreate(function() {
      this.data = data;
      return resourceObjectSetStatusAndCallEvents(this, obj.Resources.status.loaded);
    });
  };

  obj.fonts_load_custom_font = function(config) {
    config = obj.Resources.config(config, '/convert/font', ['height']);
    return customFontCreate(function() {
      var font = this;
      return obj.Resources.load(config, function(status, data) {
        var hasData = (data && data.output);
        font.data = hasData ? atob(data.output.data) : undefined;
        return resourceObjectSetStatusAndCallEvents(font, status);
      });
    });
  };

  var memoryMappedObjectCreate = function(obtainData) {
    var result = {
      obtainData: obtainData,
      captureCPointer: function() {
        var dataAndSize = obj.Data.captureCPointerWithData(this.data);
        var dataPtr = dataAndSize[0];
        var size = dataAndSize[1];
        if (!dataPtr || !size) {
          return 0;
        }
        return dataPtr;
      },
      releaseCPointer: function(ptr) {
        this.data = obj.Data.releaseCPointer(ptr, this.data ? this.data.length : 0);
      }
    };

    result.status = result.obtainData();

    return result;
  };

  obj.gdraw_command_image_create_with_data = function(data) {
    return memoryMappedObjectCreate(function() {
      // first 8 bytes of a PDC are a file header ('PDCx' + size)
      this.data = data.slice(8);
      return resourceObjectSetStatusAndCallEvents(this, obj.Resources.status.loaded);
    });
  };

  obj.gdraw_command_sequence_create_with_data =
    obj.gdraw_command_image_create_with_data;

  obj.gdraw_command_image_create = function(config) {
    config = obj.Resources.config(config, '/convert/vector');
    return memoryMappedObjectCreate(function() {
      var pdc = this;
      return obj.Resources.load(config, function(status, data) {
        var hasData = (data && data.output);
        // first 8 bytes of a PDC are a file header ('PDCx' + size)
        pdc.data = hasData ? atob(data.output.data).slice(8) : undefined;
        return resourceObjectSetStatusAndCallEvents(pdc, status);
      });
    });
  };

  function gbitmapSequenceCaptureState(sequence, ptr, replaceAll) {
    if (replaceAll || !('currentFrameIdx' in sequence)) {
      // int32_t gbitmap_sequence_get_current_frame_idx(
      //   GBitmapSequence *bitmap_sequence);
      sequence.currentFrameIdx = obj.module.ccall(
        'gbitmap_sequence_get_current_frame_idx',
        'number', ['number'], [ptr]);
    }
    if (replaceAll || !('playCount' in sequence)) {
      // uint32_t gbitmap_sequence_get_play_count(
      //   GBitmapSequence *bitmap_sequence);
      sequence.playCount = obj.module.ccall(
        'gbitmap_sequence_get_play_count',
        'number', ['number'], [ptr]);
    }
  }

  function gbitmapSequencePtrSeekToFrame(cPtr, newFrameIdx) {
    // bool emx_gbitmap_sequence_seek_to_frame(
    //          GBitmapSequence *bitmap_sequence, int32_t frameIdx,
    //          GBitmap **rendered_bmp);
    return !!obj.module.ccall(
      'emx_gbitmap_sequence_seek_to_frame',
      'number', ['number', 'number', 'number'], [cPtr, newFrameIdx, 0]);
  }

  function gbitmapSequenceCreate(obtainData) {
    return resourceObjectCreate({
      obtainData: obtainData,
      captureCPointer: function(resId) {
        // GBitmapSequence *gbitmap_sequence_create_with_resource(
        //     uint32_t resource_id);
        var result = obj.module.ccall(
          'gbitmap_sequence_create_with_resource',
          'number', ['number'], [resId]);

        // as our C objects are short-lived
        // we need to recreate their state each time we need a pointer
        gbitmapSequenceCaptureState(this, result, false);

        // void gbitmap_sequence_set_play_count(
        //   GBitmapSequence *bitmap_sequence, uint32_t play_count)
        obj.module.ccall('gbitmap_sequence_set_play_count',
          'void', ['number', 'number'], [result, this.playCount]);
        if (this.currentFrameIdx > 0) {
          gbitmapSequencePtrSeekToFrame(result, this.currentFrameIdx);
        }

        return result;
      },
      releaseCPointer: function(ptr) {
        // store the state of the C object so we can re-apply it
        // when we call .captureCPointer() the next time
        gbitmapSequenceCaptureState(this, ptr, true);

        // void gbitmap_sequence_destroy(GBitmapSequence *bitmap_sequence);
        return obj.module.ccall('gbitmap_sequence_destroy',
          'number', ['number'], [ptr]);
      }
    });
  }

  obj.gbitmap_sequence_create_with_data = function(data) {
    return gbitmapSequenceCreate(function() {
      this.data = data;
      return resourceObjectSetStatusAndCallEvents(this, obj.Resources.status.loaded);
    });
  };

  obj.gbitmap_sequence_create = function(config) {
    config = obj.Resources.config(config, '/convert/imagesequence');
    return gbitmapSequenceCreate(function() {
      var sequence = this;
      return obj.Resources.load(config, function(status, data) {
        var hasData = (data && data.output);
        sequence.data = hasData ? atob(data.output.data) : undefined;
        return resourceObjectSetStatusAndCallEvents(sequence, status);
      });
    });
  };

  obj.gbitmap_sequence_update_bitmap_next_frame = function(sequence) {
    var cPtr = sequence.captureCPointer();
    try {
      var newFrameIdx = sequence.currentFrameIdx + 1;
      return gbitmapSequencePtrSeekToFrame(cPtr, newFrameIdx);
    } finally {
      sequence.releaseCPointer(cPtr);
    }
  };

  obj.gbitmap_sequence_set_play_count = function(sequence, playCount) {
    // this implementation will not call anything in C-land
    // instead it stores the desired value in the JS object so it will be
    // applied as soon as .captureCPointer() is being called next time.
    sequence.playCount = playCount;
  };

  obj.gbitmap_sequence_get_current_frame_idx = function(sequence) {
    // by capturing and releasing the C object
    // the state of the JS object will be updated
    var cPtr = sequence.captureCPointer();
    sequence.releaseCPointer(cPtr);
    return sequence.currentFrameIdx;
  };

  obj.graphics_draw_bitmap_sequence = function(ctx, sequence, point) {
    var cPtr = sequence.captureCPointer();
    try {
      point = obj.GPoint(point);
      //  void emx_graphics_draw_bitmap_sequence(GContext *ctx,
      //           GBitmapSequence *bitmap_sequence,
      //           int16_t point_x, int16_t point_y)
      obj.module.ccall('emx_graphics_draw_bitmap_sequence',
        'void', ['number', 'number', 'number', 'number'],
        [ctx, cPtr, point.x, point.y]);
    } finally {
      sequence.releaseCPointer(cPtr);
    }
  };

  return ['Data', 'Resources'];
};

// export to enable unit tests
if (typeof (module) !== 'undefined' && module.exports !== null) {
  exports.addManualSymbols = Rocky.addManualSymbols;
  exports.symbols = {};
  Rocky.addManualSymbols(exports.symbols);
}
