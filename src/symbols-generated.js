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

    // Color definitions
    obj.GColorBlack =                 0xC0;
    obj.GColorOxfordBlue =            0xC1;
    obj.GColorDukeBlue =              0xC2;
    obj.GColorBlue =                  0xC3;
    obj.GColorDarkGreen =             0xC4;
    obj.GColorMidnightGreen =         0xC5;
    obj.GColorCobaltBlue =            0xC6;
    obj.GColorBlueMoon =              0xC7;
    obj.GColorIslamicGreen =          0xC8;
    obj.GColorJaegerGreen =           0xC9;
    obj.GColorTiffanyBlue =           0xCA;
    obj.GColorVividCerulean =         0xCB;
    obj.GColorGreen =                 0xCC;
    obj.GColorMalachite =             0xCD;
    obj.GColorMediumSpringGreen =     0xCE;
    obj.GColorCyan =                  0xCF;
    obj.GColorBulgarianRose =         0xD0;
    obj.GColorImperialPurple =        0xD1;
    obj.GColorIndigo =                0xD2;
    obj.GColorElectricUltramarine =   0xD3;
    obj.GColorArmyGreen =             0xD4;
    obj.GColorDarkGray =              0xD5;
    obj.GColorLiberty =               0xD6;
    obj.GColorVeryLightBlue =         0xD7;
    obj.GColorKellyGreen =            0xD8;
    obj.GColorMayGreen =              0xD9;
    obj.GColorCadetBlue =             0xDA;
    obj.GColorPictonBlue =            0xDB;
    obj.GColorBrightGreen =           0xDC;
    obj.GColorScreaminGreen =         0xDD;
    obj.GColorMediumAquamarine =      0xDE;
    obj.GColorElectricBlue =          0xDF;
    obj.GColorDarkCandyAppleRed =     0xE0;
    obj.GColorJazzberryJam =          0xE1;
    obj.GColorPurple =                0xE2;
    obj.GColorVividViolet =           0xE3;
    obj.GColorWindsorTan =            0xE4;
    obj.GColorRoseVale =              0xE5;
    obj.GColorPurpureus =             0xE6;
    obj.GColorLavenderIndigo =        0xE7;
    obj.GColorLimerick =              0xE8;
    obj.GColorBrass =                 0xE9;
    obj.GColorLightGray =             0xEA;
    obj.GColorBabyBlueEyes =          0xEB;
    obj.GColorSpringBud =             0xEC;
    obj.GColorInchworm =              0xED;
    obj.GColorMintGreen =             0xEE;
    obj.GColorCeleste =               0xEF;
    obj.GColorRed =                   0xF0;
    obj.GColorFolly =                 0xF1;
    obj.GColorFashionMagenta =        0xF2;
    obj.GColorMagenta =               0xF3;
    obj.GColorOrange =                0xF4;
    obj.GColorSunsetOrange =          0xF5;
    obj.GColorBrilliantRose =         0xF6;
    obj.GColorShockingPink =          0xF7;
    obj.GColorChromeYellow =          0xF8;
    obj.GColorRajah =                 0xF9;
    obj.GColorMelon =                 0xFA;
    obj.GColorRichBrilliantLavender = 0xFB;
    obj.GColorYellow =                0xFC;
    obj.GColorIcterine =              0xFD;
    obj.GColorPastelYellow =          0xFE;
    obj.GColorWhite =                 0xFF;

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

    // FIXME Signature
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

    // bool gcolor_legible_over(GColor8 background_color);
    obj.gcolor_legible_over = obj.module.cwrap("gcolor_legible_over", "number", ["number"]);

    // bool gpoint_equal(GPoint *a, GPoint *b);
    // bool emx_gpoint_equal(int16_t a_x, int16_t a_y, int16_t b_x, int16_t b_y);
    var emx_gpoint_equal = obj.module.cwrap("emx_gpoint_equal", "number", ["number", "number", "number", "number"]);
    obj.gpoint_equal = function(a, b) {
        a = obj.GPoint(a);
        b = obj.GPoint(b);
        return emx_gpoint_equal(a.x, pt_a. y, b.x, b.y);
    };

    // bool grect_equal(GRect *r0, GRect *r1);
    // bool emx_grect_equal(int16_t r0_x, int16_t r0_y, int16_t r0_w, int16_t r0_h
    //                      int16_t r1_x, int16_t r1_y, int16_t r1_w, int16_t r1_h);
    var emx_grect_equal = obj.module.cwrap("emx_grect_equal", "number",
                                          ["number", "number", "number", "number",
                                           "number", "number", "number", "number"]);
    obj.grect_equal = function(r0, r1) {
        r0 = obj.GRect(r0);
        r1 = obj.GRect(r1);
        return emx_grect_equal(r0,x, r0.y, r0.w, r0.h, r1.x, r1.y, r1.w, r1.h);
    };

    // bool grect_is_empty(GRect *rect);
    // bool emx_grect_is_empty(int16_t rect_origin_x, int16_t rect_origin_y,
    //                         int16_t rect_size_w, int16_t rect_size_h) {
    var emx_grect_is_empty = obj.module.cwrap("emx_grect_is_empty", "number",
                                             ["number", "number", "number", "number"]);
    obj.grect_is_emtpy = function(rect) {
        rect = obj.GRect(rect);
        return emx_grect_is_empty(rect.x, rect.y, rect.w, rect.h);
    };

    // void grect_standardize(GRect *rect);
    // void emx_grect_standardize(int16_t rect_origin_x, int16_t rect_origin_y,
    //                            int16_t rect_size_w, int16_t rect_size_h) {
    var emx_grect_standardize = obj.module.cwrap("emx_grect_standardize", "void", []);
    obj.grect_standardize = function(rect) {
        rect = obj.GRect(rect);
        return emx_grect_standardize(rect.x, rect.y, rect.w, rect.h);
    };

    // void grect_clip(GRect *rect_to_clip, GRect *rect_clipper);
    // void emx_grect_clip(int16_t to_clip_x, int16_t to_clip_y, int16_t to_clip_w, int16_t to_clip_h,
    //                     int16_t clipper_x, int16_t clipper_y, int16_t clipper_w, int16_t clipper_h) {
    var emx_grect_clip = obj.module.cwrap("emx_grect_clip", "void",
                                         ["number", "number", "number", "number",
                                          "number", "number", "number", "number"]);
    obj.grect_clip = function(rect_to_clip, rect_clipper) {
        rect_to_clip = obj.GRrect(rect_to_clip);
        rect_clipper = obj.GRect(rect_clipper);
        return emx_grect_clip(rect_to_clip.x, rect_to_clip.y, rect_to_clip.w, rect_to_clip.h,
                              rect_clipper.x, rect_clipper.y, rect_clipper.w, rect_clipper.h);
    };

    // bool grect_contains_point(GRect *rect, GPoint *point):
    //  bool emx_grect_contains_point(int16_t r_x, int16_t r_y, int16_t r_w, int16_t r_h,
    //                                int16_t p_x, int16_t p_y) {
    var emx_grect_contains_point = obj.module.cwrap("emx_grect_contains_point", "number",
                                                   ["number", "number", "number", "number",
                                                    "number", "number"]);
    obj.grect_contains_point = function(rect, point) {
        rect = obj.GRect(rect);
        point = obj.GPoint(point);
        return emx_grect_contains_point(rect.x, rect.y, rect.w, rect.h, point.x, point.y);
    };

    // GPoint grect_center_point(GRect *rect);
    // GPoint *emx_grect_center_point(int16_t r_x, int16_t r_y, int16_t r_w, int16_t r_h) {
    var emx_grect_center_point = obj.module.cwrap("emx_grect_center_point", "number",
                                                 ["number", "number", "number", "number"]);
    obj.grect_center_point = function(rect) {
        rect = obj.GRect(rect);
        var returnPointPTR = emx_grect_center_point(rect.x, rect.y, rect.h, rect.w);
        var returnPoint = obj.GPoint(getValue(returnPointPTR, i16), getValue(returnPointPTR + 2, i16));
        return returnPoint;
    };

    // GRect grect_crop(GRect *rect, int32_t crop_size_px)
    // GRect *emx_grect_crop(int16_t r_x, int16_t r_y, int16_t r_w, int16_t r_h, int32_t crop_size_px) {
    var emx_grect_crop = obj.module.cwrap("emx_grect_crop", "number",
                                         ["number", "number", "number", "number",
                                          "number"]);
    obj.grect_crop = function(rect, crop_size_px) {
        rect = obj.GRect(rect);
        var returnRectPTR = emx_grect_crop(rect.x, rect.y, rect.w, rect.h, crop_size_px);
        var returnRect = obj.GRect(getValue(returnRectPTR, i16),
                                   getValue(returnRectPTR + 2, i16),
                                   getValue(returnRectPTR + 4, i16),
                                   getValue(returnRectPTR + 6, i16));
        return returnRect;
    };

    obj.GAlignCenter = 0x0;
    obj.GAlignTopLeft = 0x1;
    obj.GAlignTopRight = 0x2;
    obj.GAlignTop = 0x3;
    obj.GAlignLeft = 0x4;
    obj.GAlignBottom = 0x5;
    obj.GAlignRight = 0x6;
    obj.GAlignBottomRight = 0x7;
    obj.GAlignBottomLeft = 0x8;

    // void grect_align(GRect *rect, GRect *inside_rect, GAlign alignment, bool clip);)
    // void emx_grect_align(int16_t rect_x, int16_t rect_y, int16_t rect_w, int16_t rect_h,
    //                     int16_t inside_x, int16_t inside_y, int16_t inside_w, int16_t inside_h,
    //                     const GAlign alignment, const bool clip) {
    var emx_grect_align = obj.module.cwrap("emx_grect_align", "void",
                                          ["number", "number", "number", "number",
                                           "number", "number", "number", "number",
                                           "number", "number"]);
    obj.grect_align = function(rect, inside_rect, alignment, clip) {
        rect = obj.GRect(rect);
        inside_rect = obj.GRect(inside_rect);
        emx_grect_align(rect, inside_rect, alignment, clip);
    };

    // void graphics_draw_circle(GContext *ctx, GPoint center, uin16_t radius);
    // void emx_graphics_draw_circle(GContext *ctx,
    //                               int16_t point_x, int16_t point_y,
    //                               uint16_t radius) {
    var emx_graphics_draw_circle = obj.module.cwrap("emx_graphics_draw_circle", "void",
                                                   ["number", "number", "number"]);
    obj.graphics_draw_circle = function(center, radius) {
        center = obj.GPoint(center);
        emx_graphics_draw_circle(center.x, center.y, radius);
    };


    // void graphics_fill_circle(GCOntext *ctx, GPoint center, uin16_t radius);
    // void emx_graphics_fill_circle(GContext *ctx, int16_t center_x, int16_t center_y, uint16_t radius) {
    var emx_graphics_fill_circle = obj.module.cwrap("emx_graphics_fill_circle", "void",
                                                   ["number", "number", "number"]);
    obj.graphics_fill_circle = function(center, radius) {
        center = obj.GPoint(center);
        emx_graphics_fill_circle(center.x, center.y, radius);
    };

    // void graphics_draw_round_rect(GContext *ctx, GRect *rect, uin16_t radius);
    // void emx_graphics_draw_round_rect(GContext* ctx,
    //                                   int16_t rect_origin_x, int16_t rect_origin_y,
    //                                   int16_t rect_size_w, int16_t rect_size_h,
    //                                   uint16_t radius) {
    var emx_graphics_draw_round_rect = obj.module.cwrap("emx_graphics_draw_round_rect", "void",
                                                       ["number", "number", "number", "number", "number"]);
    obj.graphics_draw_round_rect = function(ctx, rect, radius) {
        rect = obj.GRect(rect);
        emx_graphics_draw_round_rect(ctx, rect.x, rect.y, rect.w, rect.h, radius);
    };

    obj.GOvalScaleModeFitCircle = 0;
    obj.GOvalScaleModeFillCircle = 1;

    // GPoint gpoint_from_polar(GRect rect, GOvalScaleMode scale_mode, int32_t angle);
    // GPoint *emx_gpoint_from_polar(int16_t rect_x, int16_t rect_y, int16_t rect_w, int16_t rect_h,
    //                               GOvalScaleMode scale_mode, int32_t angle) {
    var emx_gpoint_from_polar = obj.module.cwrap("emx_gpoint_from_polar", "number",
                                                 ["number", "number", "number", "number",
                                                  "number", "number"]);
    obj.gpoint_from_polar =  function(rect, scale_mode, angle) {
        rect = obj.GRect(rect);
        var returnPointPTR = emx_gpoint_from_polar(rect.x, rect.y, rect.w, rect.y, scale_mode, angle);
        var returnPoint = obj.GPoint(getValue(returnPointPTR, i16), getValue(returnPointPTR + 2, i16));
        return returnPoint;
    };

    // GRect grect_centered_from_polar(GRect rect, GOvalScaleMode scale_mode, int32_t angle, GSize size);
    // GRect *emx_grect_centered_from_polar(int16_t rect_x, int16_t rect_y, int16_t rect_w, int16_t rect_h,
    //                                       GOvalScaleMode scale_mode, int32_t angle,
    //                                       int16_t size_w, int16_t size_h) {
    var emx_grect_centered_from_polar = obj.module.cwrap("emx_grect_centered_from_polar", "number",
                                                        ["number", "number", "number", "number",
                                                         "number", "number",
                                                         "number", "number"]);
    obj.grect_centered_from_polar = function(rect, scale_mode, angle, size) {
        rect = obj.GRect(rect);
        size = obj.GSize(size);
        var returnRectPTR = emx_grect_centered_from_polar(rect.x, rect.y, rect.w, rect.h,
                                                          scale_mode, angle, size.x, size.y);
        var returnRect = obj.GRect(getValue(returnRectPTR, i16),
                                   getValue(returnRectPTR + 2, i16),
                                   getValue(returnRectPTR + 4, i16),
                                   getValue(returnRectPTR + 6, i16));
        return returnRect;
    };
};