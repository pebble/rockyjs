if (typeof(Rocky) == "undefined") {
    Rocky = {};
}

Rocky.addGenericFunctions = function (obj) {

    obj.GOvalScaleModeFitCircle = 0;
    obj.GOvalScaleModeFillCircle = 1;
    var emx_graphics_draw_pixel = Module.cwrap("emx_graphics_draw_pixel", "void", ["number", "number", "number"]);

    obj.graphics_draw_pixel = function(ctx, point) {
        var pt = obj.GPoint(point);
        emx_graphics_draw_pixel(ctx, pt.x, pt.y);
    };

    var emx_draw_line = Module.cwrap("emx_graphics_draw_line", "void", ["number", "number", "number", "number", "number"]);
    obj.graphics_draw_line = function(ctx, p0, p1) {
        p0 = obj.GPoint(p0);
        p1 = obj.GPoint(p1);
        emx_draw_line(ctx, p0.x, p0.y, p1.x, p1.y);
    };
    obj.graphics_context_set_stroke_width = Module.cwrap("graphics_context_set_stroke_width", "void", ["number", "number"]);
    obj.graphics_context_set_stroke_color = Module.cwrap("emx_graphics_context_set_stroke_color", "void", ["number", "number"]);
    obj.graphics_context_set_fill_color = Module.cwrap("emx_graphics_context_set_fill_color", "void", ["number", "number"]);
    obj.graphics_context_set_antialiased = Module.cwrap("graphics_context_set_antialiased", "void", ["number", "number"]);

    obj.GColorRed = 0xF0;
    obj.GColorLightGray = 0xEA;
    obj.GColorYellow = 0xFC;
    obj.GColorWhite = 0xFF;
    obj.GColorBlack = 0xC0;


    var emx_fill_radial = Module.cwrap("emx_fill_radial", "void", ["number", "number", "number", "number", "number", "number", "number", "number", "number"]);
    obj.graphics_fill_radial = function(ctx, rect, scale_mode, inset_thickness, angle_start, angle_end) {
        rect = obj.GRect(rect);
        var TRIG_MAX_ANGLE = 0x10000;
        angle_start = (angle_start * TRIG_MAX_ANGLE) / (Math.PI * 2);
        angle_end = (angle_end * TRIG_MAX_ANGLE) / (Math.PI * 2);
        emx_fill_radial(ctx, rect.x, rect.y, rect.w, rect.h, scale_mode, inset_thickness, angle_start, angle_end);
    };

    var emx_fill_rect = Module.cwrap("emx_fill_rect", "void", ["number", "number", "number", "number", "number"]);
    obj.graphics_fill_rect = function(ctx, rect) {
        rect = obj.GRect(rect);
        emx_fill_rect(ctx, rect.x, rect.y, rect.w, rect.h);
    };


};