if (typeof(Rocky) == "undefined") {
    Rocky = {};
}

Rocky.bindCanvas= function(canvas, options) {
    options = options || {};

    var module = this.Module();

    var canvasW = canvas.width;
    var canvasH = canvas.height;
    var framebufferW = 144;
    var framebufferH = 168;

    var scale = options.scale || Math.min(canvasW/framebufferW, canvasH/framebufferH);

    var canvasCtx = canvas.getContext("2d");
    var canvasPixelData = canvasCtx.createImageData(canvasW, canvasH);
    var canvasPixels = canvasPixelData.data;
    var pebblePixelPTR = module.ccall("emx_graphics_get_pixels", "number", []);
    var pebblePixels = new Uint8Array(module.HEAPU8.buffer, pebblePixelPTR, canvasW*canvasH);
    var pebbleCtx = module.ccall("app_state_get_graphics_context", "number", []);

    var non_c_binding_keys = [];
    var binding = {
        module: module,
        update_proc: function(ctx, bounds) {
        },
        mark_dirty: function() {
            var bounds = binding.GRect(0, 0, framebufferW, framebufferH);
            binding.graphics_context_set_fill_color(pebbleCtx, binding.GColorWhite);
            binding.graphics_fill_rect(pebbleCtx, bounds);

            binding.graphics_context_set_fill_color(pebbleCtx, binding.GColorBlack);
            binding.graphics_context_set_stroke_color(pebbleCtx, binding.GColorBlack);
            binding.graphics_context_set_stroke_width(pebbleCtx, 1);
            binding.graphics_context_set_antialiased(pebbleCtx, true);

            binding.update_proc(pebbleCtx, bounds);
            binding.render_framebuffer(canvasCtx);
        },
        render_framebuffer: function() {
            // TODO: generalize this to render to other targets to enable better tooling
            for (var y = 0; y < canvasH; y++) {
                var pebbleY = (y / scale) >> 0;
                if (pebbleY >= framebufferH) {
                    break;
                }
                for(var x = 0; x < canvasW; x++) {
                    var pebbleX = (x / scale) >> 0;
                    if (pebbleX >= framebufferW) {
                        break;
                    }
                    var pebbleOffset = pebbleY * framebufferW + pebbleX;
                    var in_values = pebblePixels[pebbleOffset];
                    var r = ((in_values >> 4) & 0x3) * 85;
                    var g = ((in_values >> 2) & 0x3) * 85;
                    var b = ((in_values >> 0) & 0x3) * 85;
                    var canvasOffset = (y * canvasW + x) * 4;
                    canvasPixels[canvasOffset  ] = r;
                    canvasPixels[canvasOffset+1] = g;
                    canvasPixels[canvasOffset+2] = b;
                    canvasPixels[canvasOffset+3] = 255;
                }
            }
            canvasCtx.putImageData(canvasPixelData, 0, 0);
        },
        export_global_c_symbols: function(global) {
            if (typeof(global) == "undefined") {
                global = window;
            }

            for (var key in binding) {
                if (non_c_binding_keys.indexOf(key) < 0 && binding.hasOwnProperty(key)) {
                    var value = binding[key];
                    global[key] = (typeof(value) == "function") ? value.bind(binding) : value;
                }
            }
        }
    };

    // collect all functions of `binding` here so we can filter them out in export_global_c_symbols()
    for (var key in binding) {
        if (binding.hasOwnProperty(key)) {
            non_c_binding_keys.push(key);
        }
    }

    Rocky.addGenericFunctions(binding);
    Rocky.addManualFunctions(binding);

    // needed for Espruino compatibility (where functions are global and need a reference)
    Rocky.activeBinding = binding;
    return binding;
};

