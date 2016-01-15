/*

    Copyright © 2015-2016 Pebble Technology Corp., All Rights Reserved. http://pebble.github.io/rockyjs/LICENSE

    This files contains various symbols that are automatically derived (or will be, eventually) from the
    Pebble firmware code base.

    It contains constants such as GOvalScaleModeFitCircle or GColorRed.

    The second set of symbols are functions that overcome Emscripten's lack of support for structs.
    During the transpilation process we generated additional C code that takes multiple values instead
    of a single struct. As an example:

        original C:

          void graphics_draw_pixel(GContext *ctx, GPoint pt);

        generated C to be transpiled by Emscripten:

          void emx_graphics_draw_pixel(GContext *ctx, int16_t pt_x, int16_t pt_y);

     In order to expose the original signature to JS clients, this file contains yet another wrapper
     that calls the emx_ variant

        generated JS wrapper in this file:

          var graphics_draw_pixel = function(ctx, point) {
            var pt = obj.GPoint(point);
            emx_graphics_draw_pixel(ctx, pt.x, pt.y);
          };
*/


if (typeof(Rocky) == "undefined") {
    Rocky = {};
}

Rocky.addGeneratedSymbols = function (obj) {

    // GOvalScaleMode
    obj.GOvalScaleModeFitCircle = 0;
    obj.GOvalScaleModeFillCircle = 1;

    // void graphics_draw_pixel(GContext* ctx, GPoint point);
    // void emx_graphics_draw_pixel(GContext *ctx, int16_t point_x, int16_t point_y);
    var emx_graphics_draw_pixel = obj.module.cwrap("emx_graphics_draw_pixel", "void", ["number", "number", "number"]);
    obj.graphics_draw_pixel = function(ctx, point) {
        point = obj.GPoint(point);
        return emx_graphics_draw_pixel(ctx, point.x, point.y);
    };

    // void graphics_draw_line(GContext* ctx, GPoint p0, GPoint p1);
    // void emx_graphics_draw_line(GContext* ctx, int16_t p0_x, int16_t p0_y, int16_t p1_x, int16_t p1_y,);
    var emx_graphics_draw_line = obj.module.cwrap("emx_graphics_draw_line", "void", ["number", "number", "number", "number", "number"]);
    obj.graphics_draw_line = function(ctx, p0, p1) {
        p0 = obj.GPoint(p0);
        p1 = obj.GPoint(p1);
        return emx_graphics_draw_line(ctx, p0.x, p0.y, p1.x, p1.y);
    };

    // void graphics_context_set_stroke_width(GContext* ctx, uint8_t stroke_width);
    obj.graphics_context_set_stroke_width = obj.module.cwrap("graphics_context_set_stroke_width", "void", ["number", "number"]);

    // void graphics_context_set_stroke_color(GContext* ctx, GColor color);
    // void emx_graphics_context_set_stroke_color(GContext* ctx, uint8_t color);
    obj.graphics_context_set_stroke_color = obj.module.cwrap("emx_graphics_context_set_stroke_color", "void", ["number", "number"]);

    // void graphics_context_set_fill_color(GContext* ctx, GColor color);
    // void emx_graphics_context_set_fill_color(GContext* ctx, uint8_t color);
    obj.graphics_context_set_fill_color = obj.module.cwrap("emx_graphics_context_set_fill_color", "void", ["number", "number"]);

    // void graphics_context_set_antialiased(GContext* ctx, bool enable);
    obj.graphics_context_set_antialiased = obj.module.cwrap("graphics_context_set_antialiased", "void", ["number", "number"]);

    // Color Definitions from gcolor_defitions.c (not complete, yet)
    obj.GColorRed = 0xF0;
    obj.GColorLightGray = 0xEA;
    obj.GColorYellow = 0xFC;
    obj.GColorWhite = 0xFF;
    obj.GColorBlack = 0xC0;
    obj.GColorBlueMoon = 0xC7;
    obj.GColorJaegerGreen = 0xC9;
    obj.GColorJazzberryJam = 0xE1;

    // void graphics_fill_radial(GContext *ctx, GRect rect, GOvalScaleMode scale_mode, uint16_t inset_thickness, int32_t angle_start, int32_t angle_end);
    // void emx_graphics_fill_radial(GContext *ctx, int16_t rect_x, int16_t rect_y, int16_t rect_w, int16_t rect_h, GOvalScaleMode scale_mode, uint16_t inset_thickness, int32_t angle_start, int32_t angle_end);
    var emx_graphics_fill_radial = obj.module.cwrap("emx_fill_radial", "void", ["number", "number", "number", "number", "number", "number", "number", "number", "number"]);
    obj.graphics_fill_radial = function(ctx, rect, scale_mode, inset_thickness, angle_start, angle_end) {
        rect = obj.GRect(rect);
        var TRIG_MAX_ANGLE = 0x10000;
        angle_start = (angle_start * TRIG_MAX_ANGLE) / (Math.PI * 2);
        angle_end = (angle_end * TRIG_MAX_ANGLE) / (Math.PI * 2);
        return emx_graphics_fill_radial(ctx, rect.x, rect.y, rect.w, rect.h, scale_mode, inset_thickness, angle_start, angle_end);
    };

    // void graphics_draw_arc(GContext *ctx, GRect rect, GOvalScaleMode scale_mode,int32_t angle_start, int32_t angle_end);
    // void emx_graphics_draw_arc(GContext *ctx, int16_t rect_x, int16_t rect_y, int16_t rect_w, int16_t rect_h, GOvalScaleMode scale_mode,int32_t angle_start, int32_t angle_end);
    var emx_graphics_draw_arc = obj.module.cwrap("emx_draw_arc", "void", ["number", "number", "number", "number", "number", "number", "number", "number"]);
    obj.graphics_draw_arc = function(ctx, rect, scale_mode, angle_start, angle_end) {
        rect = obj.GRect(rect);
        var TRIG_MAX_ANGLE = 0x10000;
        angle_start = (angle_start * TRIG_MAX_ANGLE) / (Math.PI * 2);
        angle_end = (angle_end * TRIG_MAX_ANGLE) / (Math.PI * 2);
        return emx_graphics_draw_arc(ctx, rect.x, rect.y, rect.w, rect.h, scale_mode, angle_start, angle_end);
    };

    // void graphics_fill_rect(GContext *ctx, const GRect rect);
    // void emx_graphics_fill_rect(GContext *ctx, int16_t rect_x, int16_t rect_y, int16_t rect_w, int16_t rect_h);
    var emx_graphics_fill_rect = obj.module.cwrap("emx_fill_rect", "void", ["number", "number", "number", "number", "number"]);
    obj.graphics_fill_rect = function(ctx, rect) {
        rect = obj.GRect(rect);
        return emx_graphics_fill_rect(ctx, rect.x, rect.y, rect.w, rect.h);
    };

    // void graphics_draw_rect(GContext *ctx, const GRect rect);
    // void emx_graphics_draw_rect(GContext *ctx, int16_t rect_x, int16_t rect_y, int16_t rect_w, int16_t rect_h);
    var emx_draw_rect = obj.module.cwrap("emx_draw_rect", "void", ["number", "number", "number", "number", "number"]);
    obj.graphics_draw_rect = function(ctx, rect) {
        rect = obj.GRect(rect);
        return emx_draw_rect(ctx, rect.x, rect.y, rect.w, rect.h);
    };
};