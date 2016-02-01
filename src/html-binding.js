/*

  Copyright © 2015-2016 Pebble Technology Corp.,
  All Rights Reserved. http://pebble.github.io/rockyjs/LICENSE

  This describes functionality to create an instance of Rocky and
  bind it to an HTML canvas element.

 */

/*global Rocky:true*/

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

Rocky.bindCanvas = function(canvas, options) {
  options = options || {};

  // instance of the Emscripten module
  var module = this.Module();

  // in a future version, these values should adapt automatically
  // also, we want the ability to create framebuffers of larger sizes
  var canvasW = canvas.width;
  var canvasH = canvas.height;
  var framebufferW = 144;
  var framebufferH = 168;

  // scale gives us the ability to do a nearest-neighbor scaling
  var scale = options.scale ||
              Math.min(canvasW / framebufferW, canvasH / framebufferH);

  // pixel access to read (framebuffer) and write to (canvas)
  var canvasCtx = canvas.getContext('2d');
  var canvasPixelData = canvasCtx.createImageData(canvasW, canvasH);
  var canvasPixels = canvasPixelData.data;
  var framebufferPixelPTR = module.ccall('emx_graphics_get_pixels', 'number', []);
  var framebufferPixels = new Uint8Array(module.HEAPU8.buffer,
                                         framebufferPixelPTR,
                                         canvasW * canvasH);
  var graphicsContext = module.ccall('app_state_get_graphics_context', 'number', []);

  // result of this function
  var binding = {
    module: module,
    update_proc: function(ctx, bounds) {
      // meant to be override by clients
      // will be called whenever a clients calls #mark_dirty()
    },
    mark_dirty: function() {
      // initializes the graphics context and framebuffer with default values
      // before rendering
      var bounds = binding.GRect(0, 0, framebufferW, framebufferH);
      binding.graphics_context_set_fill_color(graphicsContext, binding.GColorWhite);
      binding.graphics_fill_rect(graphicsContext, bounds);

      binding.graphics_context_set_fill_color(graphicsContext, binding.GColorBlack);
      binding.graphics_context_set_stroke_color(graphicsContext,
                                                binding.GColorBlack);
      binding.graphics_context_set_stroke_width(graphicsContext, 1);
      binding.graphics_context_set_antialiased(graphicsContext, true);

      binding.graphics_context_set_text_color(graphicsContext, binding.GColorBlack);

      binding.graphics_context_set_compositing_mode(graphicsContext,
                                                    binding.GCompOpSet);

      binding.update_proc(graphicsContext, bounds);
      binding.render_framebuffer(canvasCtx);
    },
    render_framebuffer: function() {
      // renders current state of the framebuffer to the bound canvas
      // respecting the passed scale
      for (var y = 0; y < canvasH; y++) {
        var pebbleY = (y / scale) >> 0;
        if (pebbleY >= framebufferH) {
          break;
        }
        for (var x = 0; x < canvasW; x++) {
          var pebbleX = (x / scale) >> 0;
          if (pebbleX >= framebufferW) {
            break;
          }
          var pebbleOffset = pebbleY * framebufferW + pebbleX;
          var in_values = framebufferPixels[pebbleOffset];
          var r = ((in_values >> 4) & 0x3) * 85;
          var g = ((in_values >> 2) & 0x3) * 85;
          var b = ((in_values >> 0) & 0x3) * 85;
          var canvasOffset = (y * canvasW + x) * 4;
          canvasPixels[canvasOffset + 0] = r;
          canvasPixels[canvasOffset + 1] = g;
          canvasPixels[canvasOffset + 2] = b;
          canvasPixels[canvasOffset + 3] = 255;
        }
      }
      canvasCtx.putImageData(canvasPixelData, 0, 0);
    },
    export_global_c_symbols: function(global) {
      // meant for simple scenarios where all C-like
      // functions can live outside of this binding object
      if (typeof (global) === 'undefined') {
        global = window;
      }

      for (var key in binding) {
        if (non_c_binding_keys.indexOf(key) < 0 && binding.hasOwnProperty(key)) {
          var value = binding[key];
          global[key] = (typeof (value) === 'function') ?
                        value.bind(binding) : value;
        }
      }
    }
  };

  // collect all functions of `binding` here
  // so we can filter them out in export_global_c_symbols()
  var non_c_binding_keys = [];
  for (var key in binding) {
    if (binding.hasOwnProperty(key)) {
      non_c_binding_keys.push(key);
    }
  }

  // will enhance the binding object by various function
  // from ./symbols-*.js of this folder
  non_c_binding_keys = non_c_binding_keys.concat(Rocky.addGeneratedSymbols(binding));
  non_c_binding_keys = non_c_binding_keys.concat(Rocky.addManualSymbols(binding));

  // useful if clients only have a single Rocky instance
  Rocky.activeBinding = binding;

  // schedule one render pass for the next run iteration of the run loop
  setTimeout(function() { binding.mark_dirty(); }, 0);

  return binding;
};
