var Module = Rocky.Module();

function _bindCanvas(canvas) {
    var w = canvas.width;
    var h = canvas.height;
    var canvasCtx = canvas.getContext("2d");
    var canvasPixelData = canvasCtx.createImageData(w, h);
    var canvasPixels = canvasPixelData.data;
    var pebblePixelPTR = Module.ccall("emx_graphics_get_pixels", "number", []);
    var result = {
        markDirty: function() {
            for (var y = 0; y < h; y++) {
                for(var x = 0; x < w; x++) {
                    var pebbleOffset = y * w + x;
                    var in_values = Module.getValue(pebblePixelPTR + pebbleOffset, 'i8');
                    var r = ((in_values >> 4) & 0x3) * 85;
                    var g = ((in_values >> 2) & 0x3) * 85;
                    var b = ((in_values >> 0) & 0x3) * 85;
                    var canvasOffset = pebbleOffset * 4;
                    canvasPixels[canvasOffset  ] = r;
                    canvasPixels[canvasOffset+1] = g;
                    canvasPixels[canvasOffset+2] = b;
                    canvasPixels[canvasOffset+3] = 255;
                }
            }
            canvasCtx.putImageData(canvasPixelData, 0, 0);
        },
        clear: function() {
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var pebbleOffset = y * w + x;
                    Module.setValue(pebblePixelPTR + pebbleOffset, 0xff, 'i8');
                }
            }
        }
    };
    return result;
}


function PblGraphics() {
    gCtx = Module.ccall("app_state_get_graphics_context", "number", []);
    framebuffer = this.framebuffer = _bindCanvas(document.getElementById("pebble"));

    scheduleAnimation = function(options) {
        options = options || {};
        var msDelay = options.delay || 0;
        var msDuration = options.duration || 0;
        var updateHandler = options.update || function () {
        };
        var stopHandler = options.stop || function () {
        };

        // todo: remove these globals by fixing jswrap_interactive.c
        _timeout = setTimeout(function () {
            var msPassed = 0;
            var msPerStep = 1000 / 30;

            _intervalId = setInterval(function () {
                msPassed += msPerStep;
                var progress = Math.min(1, msPassed / msDuration);
                updateHandler(progress);
                if (progress >= 1) {
                    stopHandler();
                    clearInterval(_intervalId);
                }
            }, msPerStep);
            updateHandler(0);
        }, msDelay);
    };

    this.GPoint = function(x,y) {
        if (arguments.length != 2) {
            y = typeof(x[1]) != "undefined" ? x[1] : x.y;
            x = typeof(x[0]) != "undefined" ? x[0] : x.x;
        }
        return {x: x, y: y};
    };

    this.GSize = function(w,h) {
        if (arguments.length != 2) {
            y = typeof(w[1]) != "undefined" ? w[1] : w.h;
            w = typeof(w[0]) != "undefined" ? w[0] : w.w;
        }
        return {w: w, h: h};
    };

    this.GRect = function(x, y, w, h) {
        var origin, size;
        if (arguments.length == 1) {
            // array or single object
            h = typeof(x[3]) != "undefined" ? x[3] : x.h;
            w = typeof(x[2]) != "undefined" ? x[2] : x.w;
            y = typeof(x[1]) != "undefined" ? x[1] : x.y;
            x = typeof(x[0]) != "undefined" ? x[0] : x.x;
            origin = this.GPoint(x, y);
            size = this.GSize(w, h);
        } else if (arguments.length == 2) {
            // origin and size
            origin = this.GPoint(x);
            size = this.GSize(y);
        } else {
            // all four arguments provided
            origin = this.GPoint(x, y);
            size = this.GSize(w, h);
        }
        return {origin: origin, size:size}
    };

    this.drawPixel = function(point) {
        var pt = this.GPoint(point);
        Module.ccall('emx_graphics_draw_pixel',
                     null,
                     ['number', 'number', 'number'],
                     [gCtx, pt.x, pt.y]);
    };

    this.drawLine = function(p0, p1) {
        var pt0 = this.GPoint(p0);
        var pt1 = this.GPoint(p1);
        Module.ccall('emx_graphics_draw_line',
                     null,
                     ['number', 'number', 'number', 'number', 'number'],
                     [gCtx, pt0.x, pt0.y, pt1.x, pt1.y]);
    };

    this.drawCircle = function(point, radius) {
        var pt = this.GPoint(point);
        Module.ccall('emx_graphics_draw_circle',
                     null,
                     ['number', 'number', 'number', 'number'],
                     [gCtx, pt.x, pt.y, radius]);

    };

    this.setStrokeColor = function(color) {
        Module.ccall("emx_graphics_context_set_stroke_color",
                     null,
                     ["number", "number"],
                     [gCtx, color]);
    };

    this.drawPDC = function(resource_id, point) {
        var pt = this.GPoint(point);
        var gdciPtr = Module.ccall('gdraw_command_image_create_with_resource',
                                   'number',
                                   ['number'],
                                   [resource_id]);
        Module.ccall('emx_gdci_draw',
                     null,
                     ['number', 'number', 'number', 'number'],
                     [gCtx, gdciPtr, pt.x, pt.y]);
    };

    this.playPDCS = function(resource_id, point) {
        var pt = this.GPoint(point);
        var PDCSPtr = Module.ccall('gdraw_command_sequence_create_with_resource',
                                   'number',
                                   ['number'],
                                   [resource_id]);

        var PDCSDuration = Module.ccall('gdraw_command_sequence_get_total_duration',
                                    'number',
                                    ['number'],
                                    [PDCSPtr]);
        scheduleAnimation({
            delay: 0,
            duration: PDCSDuration,
            update: function(progress) {
                framebuffer.clear();
                elapsed = (PDCSDuration * progress) >> 0;
                var PDCFPtr = Module.ccall('gdraw_command_sequence_get_frame_by_elapsed',
                        'number',
                        ['number', 'number'],
                        [PDCSPtr, elapsed]);
                Module.ccall('emx_gdcf_draw',
                        null,
                        ['number', 'number', 'number', 'number', 'number'],
                        [gCtx, PDCSPtr, PDCFPtr, pt.x, pt.y]);
                framebuffer.markDirty();
            },
            stop: function() {
            }
        });
    };

    this.drawText = function(text, font, box) {
        var rect = this.GRect(box);
        var fontPTR = Module.ccall('fonts_get_system_font',
                                   'number',
                                   ['string'],
                                   [font]);
        Module.ccall('emx_graphics_draw_text',
                     null,
                     ['number', 'string', 'number',
                      'number', 'number', 'number', 'number',
                      'number', 'number', 'number'],
                     [gCtx, text, fontPTR,
                      rect.origin.x, rect.origin.y, rect.size.w, rect.size.h,
                      0, /* OverflowModeWrap */
                      0, /* GTextAlignmentCenter */
                      0]); /* Attributes */
    };

    this.framebuffer.markDirty();
}
pblGraphics = new PblGraphics();

