/*

  Copyright © 2015-2016 Pebble Technology Corp.,
  All Rights Reserved. http://pebble.github.io/rockyjs/LICENSE

  This files contains various symbols that are automatically derived
  (or will be, eventually) from the Pebble firmware code base.

  It contains constants such as GOvalScaleModeFitCircle or GColorRed.

  The second set of symbols are functions that overcome Emscripten's lack
  of support for structs. During the transpilation process we generated
  additional C code that takes multiple values instead of a single struct.
  As an example:

    original C:

      void graphics_draw_pixel(GContext *ctx, GPoint pt);

    generated C to be transpiled by Emscripten:

      void emx_graphics_draw_pixel(GContext *ctx, int16_t pt_x, int16_t pt_y);

   In order to expose the original signature to JS clients,
   this file contains yet another wrapper that calls the emx_ variant

    generated JS wrapper in this file:

      var graphics_draw_pixel = function(ctx, point) {
      var pt = obj.GPoint(point);
      emx_graphics_draw_pixel(ctx, pt.x, pt.y);
      };
*/

/*global Rocky:true*/

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

Rocky.addGeneratedSymbols = function(obj) {

  // GOvalScaleMode
  obj.GOvalScaleModeFitCircle = 0;
  obj.GOvalScaleModeFillCircle = 1;

  // void graphics_draw_pixel(GContext* ctx, GPoint point);
  // void emx_graphics_draw_pixel(GContext *ctx, int16_t point_x, int16_t point_y);
  var emx_graphics_draw_pixel = obj.module.cwrap('emx_graphics_draw_pixel', 'void',
                                                ['number', 'number', 'number']);
  obj.graphics_draw_pixel = function(ctx, point) {
    point = obj.GPoint(point);
    return emx_graphics_draw_pixel(ctx, point.x, point.y);
  };

  // void graphics_draw_line(GContext* ctx, GPoint p0, GPoint p1);
  // void emx_graphics_draw_line(GContext* ctx, int16_t p0_x, int16_t p0_y,
  //                             int16_t p1_x, int16_t p1_y,);
  var emx_graphics_draw_line = obj.module.cwrap('emx_graphics_draw_line', 'void',
                                               ['number', 'number', 'number',
                                                'number', 'number']);
  obj.graphics_draw_line = function(ctx, p0, p1) {
    p0 = obj.GPoint(p0);
    p1 = obj.GPoint(p1);
    return emx_graphics_draw_line(ctx, p0.x, p0.y, p1.x, p1.y);
  };

  // void graphics_context_set_stroke_width(GContext* ctx, uint8_t stroke_width);
  obj.graphics_context_set_stroke_width =
      obj.module.cwrap('graphics_context_set_stroke_width', 'void',
                      ['number', 'number']);

  // void graphics_context_set_stroke_color(GContext* ctx, GColor color);
  // void emx_graphics_context_set_stroke_color(GContext* ctx, uint8_t color);
  obj.graphics_context_set_stroke_color =
      obj.module.cwrap('emx_graphics_context_set_stroke_color', 'void',
                      ['number', 'number']);

  // void graphics_context_set_fill_color(GContext* ctx, GColor color);
  // void emx_graphics_context_set_fill_color(GContext* ctx, uint8_t color);
  obj.graphics_context_set_fill_color =
      obj.module.cwrap('emx_graphics_context_set_fill_color', 'void',
                      ['number', 'number']);

  // void graphics_context_set_antialiased(GContext* ctx, bool enable);
  obj.graphics_context_set_antialiased =
      obj.module.cwrap('graphics_context_set_antialiased', 'void',
                      ['number', 'number']);

  // void graphics_context_set_text_color(GContext* ctx, GColor color);
  // void emx_graphics_context_set_text_color(GContext* ctx, uint8_t color);
  obj.graphics_context_set_text_color =
    obj.module.cwrap('emx_graphics_context_set_text_color', 'void',
      ['number', 'number']);

  // GColor definitions
  obj.GColorClear = 0x00;
  obj.GColorBlack = 0xC0;
  obj.GColorOxfordBlue = 0xC1;
  obj.GColorDukeBlue = 0xC2;
  obj.GColorBlue = 0xC3;
  obj.GColorDarkGreen = 0xC4;
  obj.GColorMidnightGreen = 0xC5;
  obj.GColorCobaltBlue = 0xC6;
  obj.GColorBlueMoon = 0xC7;
  obj.GColorIslamicGreen = 0xC8;
  obj.GColorJaegerGreen = 0xC9;
  obj.GColorTiffanyBlue = 0xCA;
  obj.GColorVividCerulean = 0xCB;
  obj.GColorGreen = 0xCC;
  obj.GColorMalachite = 0xCD;
  obj.GColorMediumSpringGreen = 0xCE;
  obj.GColorCyan = 0xCF;
  obj.GColorBulgarianRose = 0xD0;
  obj.GColorImperialPurple = 0xD1;
  obj.GColorIndigo = 0xD2;
  obj.GColorElectricUltramarine = 0xD3;
  obj.GColorArmyGreen = 0xD4;
  obj.GColorDarkGray = 0xD5;
  obj.GColorLiberty = 0xD6;
  obj.GColorVeryLightBlue = 0xD7;
  obj.GColorKellyGreen = 0xD8;
  obj.GColorMayGreen = 0xD9;
  obj.GColorCadetBlue = 0xDA;
  obj.GColorPictonBlue = 0xDB;
  obj.GColorBrightGreen = 0xDC;
  obj.GColorScreaminGreen = 0xDD;
  obj.GColorMediumAquamarine = 0xDE;
  obj.GColorElectricBlue = 0xDF;
  obj.GColorDarkCandyAppleRed = 0xE0;
  obj.GColorJazzberryJam = 0xE1;
  obj.GColorPurple = 0xE2;
  obj.GColorVividViolet = 0xE3;
  obj.GColorWindsorTan = 0xE4;
  obj.GColorRoseVale = 0xE5;
  obj.GColorPurpureus = 0xE6;
  obj.GColorLavenderIndigo = 0xE7;
  obj.GColorLimerick = 0xE8;
  obj.GColorBrass = 0xE9;
  obj.GColorLightGray = 0xEA;
  obj.GColorBabyBlueEyes = 0xEB;
  obj.GColorSpringBud = 0xEC;
  obj.GColorInchworm = 0xED;
  obj.GColorMintGreen = 0xEE;
  obj.GColorCeleste = 0xEF;
  obj.GColorRed = 0xF0;
  obj.GColorFolly = 0xF1;
  obj.GColorFashionMagenta = 0xF2;
  obj.GColorMagenta = 0xF3;
  obj.GColorOrange = 0xF4;
  obj.GColorSunsetOrange = 0xF5;
  obj.GColorBrilliantRose = 0xF6;
  obj.GColorShockingPink = 0xF7;
  obj.GColorChromeYellow = 0xF8;
  obj.GColorRajah = 0xF9;
  obj.GColorMelon = 0xFA;
  obj.GColorRichBrilliantLavender = 0xFB;
  obj.GColorYellow = 0xFC;
  obj.GColorIcterine = 0xFD;
  obj.GColorPastelYellow = 0xFE;
  obj.GColorWhite = 0xFF;

  // void graphics_fill_radial(GContext *ctx, GRect rect,
  //                           GOvalScaleMode scale_mode, uint16_t inset_thickness,
  //                           int32_t angle_start, int32_t angle_end);
  // void emx_graphics_fill_radial(GContext *ctx,
  //     int16_t rect_x, int16_t rect_y, int16_t rect_w, int16_t rect_h,
  //     GOvalScaleMode scale_mode, uint16_t inset_thickness,
  //     int32_t angle_start, int32_t angle_end);
  var emx_graphics_fill_radial = obj.module.cwrap('emx_graphics_fill_radial', 'void',
                           ['number', 'number', 'number', 'number', 'number',
                          'number', 'number', 'number', 'number']);
  obj.graphics_fill_radial = function(ctx, rect, scale_mode,
                                      inset_thickness, angle_start, angle_end) {
    rect = obj.GRect(rect);
    var TRIG_MAX_ANGLE = 0x10000;
    angle_start = (angle_start * TRIG_MAX_ANGLE) / (Math.PI * 2);
    angle_end = (angle_end * TRIG_MAX_ANGLE) / (Math.PI * 2);
    return emx_graphics_fill_radial(ctx, rect.x, rect.y, rect.w, rect.h,
                                    scale_mode, inset_thickness,
                                    angle_start, angle_end);
  };

  // void graphics_draw_arc(GContext *ctx, GRect rect, GOvalScaleMode scale_mode,
  //                        int32_t angle_start, int32_t angle_end);
  // void emx_graphics_draw_arc(GContext *ctx,
  //     int16_t rect_x, int16_t rect_y, int16_t rect_w, int16_t rect_h,
  //     GOvalScaleMode scale_mode,int32_t angle_start, int32_t angle_end);
  var emx_graphics_draw_arc = obj.module.cwrap('emx_graphics_draw_arc', 'void',
                        ['number', 'number', 'number', 'number', 'number',
                         'number', 'number', 'number']);
  obj.graphics_draw_arc = function(ctx, rect, scale_mode, angle_start, angle_end) {
    rect = obj.GRect(rect);
    var TRIG_MAX_ANGLE = 0x10000;
    angle_start = (angle_start * TRIG_MAX_ANGLE) / (Math.PI * 2);
    angle_end = (angle_end * TRIG_MAX_ANGLE) / (Math.PI * 2);
    return emx_graphics_draw_arc(ctx, rect.x, rect.y, rect.w, rect.h,
                                 scale_mode, angle_start, angle_end);
  };

  // GCornerMask
  obj.GCornerNone = 0;
  obj.GCornerTopLeft = 1 << 0;
  obj.GCornerTopRight = 1 << 1;
  obj.GCornerBottomLeft = 1 << 2;
  obj.GCornerBottomRight = 1 << 3;
  obj.GCornersAll = obj.GCornerTopLeft |
                    obj.GCornerTopRight |
                    obj.GCornerBottomLeft |
                    obj.GCornerBottomRight;
  obj.GCornersTop = obj.GCornerTopLeft | obj.GCornerTopRight;
  obj.GCornersBottom = obj.GCornerBottomLeft | obj.GCornerBottomRight;
  obj.GCornersLeft = obj.GCornerTopLeft | obj.GCornerBottomLeft;
  obj.GCornersRight = obj.GCornerTopRight | obj.GCornerBottomRight;

  // void graphics_fill_rect(GContext *ctx, const GRect rect,
  //                         uin16_t radius, GCornerMask corner_mask);
  // void emx_fill_rect(GContext* ctx, int16_t rect_origin_x, int16_t rect_origin_y,
  //                    int16_t rect_size_w, int16_t rect_size_h,
  //                    uint16_t radius, GCornerMask corner_mask) {
  var emx_graphics_fill_rect = obj.module.cwrap('emx_graphics_fill_rect', 'void',
                         ['number', 'number', 'number', 'number', 'number',
                          'number', 'number']);
  obj.graphics_fill_rect = function(ctx, rect, radius, corner_mask) {
    rect = obj.GRect(rect);
    return emx_graphics_fill_rect(ctx, rect.x, rect.y, rect.w, rect.h,
                                  radius, corner_mask);
  };

  // void graphics_draw_rect(GContext *ctx, const GRect rect);
  // void emx_graphics_draw_rect(GContext *ctx,
  //     int16_t rect_x, int16_t rect_y, int16_t rect_w, int16_t rect_h);
  var emx_draw_rect = obj.module.cwrap('emx_graphics_draw_rect', 'void',
                    ['number', 'number', 'number', 'number', 'number']);
  obj.graphics_draw_rect = function(ctx, rect) {
    rect = obj.GRect(rect);
    return emx_draw_rect(ctx, rect.x, rect.y, rect.w, rect.h);
  };

  // bool gcolor_legible_over(GColor8 background_color);
  var emx_gcolor_legible_over = obj.module.cwrap('emx_gcolor_legible_over', 'number',
                                                ['number']);
  obj.gcolor_legible_over = function(color) {
    return emx_gcolor_legible_over(color);
  };

  // bool gpoint_equal(GPoint *a, GPoint *b);
  // bool emx_gpoint_equal(int16_t a_x, int16_t a_y, int16_t b_x, int16_t b_y);
  var emx_gpoint_equal = obj.module.cwrap('emx_gpoint_equal', 'number',
                                         ['number', 'number', 'number', 'number']);
  obj.gpoint_equal = function(a, b) {
    a = obj.GPoint(a);
    b = obj.GPoint(b);
    return emx_gpoint_equal(a.x, a.y, b.x, b.y) !== 0;
  };

  // bool grect_equal(GRect *r0, GRect *r1);
  // bool emx_grect_equal(int16_t r0_x, int16_t r0_y, int16_t r0_w, int16_t r0_h
  //            int16_t r1_x, int16_t r1_y, int16_t r1_w, int16_t r1_h);
  var emx_grect_equal = obj.module.cwrap('emx_grect_equal', 'number',
                      ['number', 'number', 'number', 'number',
                       'number', 'number', 'number', 'number']);
  obj.grect_equal = function(r0, r1) {
    r0 = obj.GRect(r0);
    r1 = obj.GRect(r1);
    return emx_grect_equal(r0.x, r0.y, r0.w, r0.h, r1.x, r1.y, r1.w, r1.h) !== 0;
  };

  // bool grect_is_empty(GRect *rect);
  // bool emx_grect_is_empty(int16_t rect_origin_x, int16_t rect_origin_y,
  //               int16_t rect_size_w, int16_t rect_size_h);
  var emx_grect_is_empty = obj.module.cwrap('emx_grect_is_empty', 'number',
                       ['number', 'number', 'number', 'number']);
  obj.grect_is_emtpy = function(rect) {
    rect = obj.GRect(rect);
    return emx_grect_is_empty(rect.x, rect.y, rect.w, rect.h) !== 0;
  };

  // void grect_standardize(GRect *rect);
  // GRect *emx_grect_standardize(int16_t rect_origin_x, int16_t rect_origin_y,
  //                              int16_t rect_size_w, int16_t rect_size_h);
  var emx_grect_standardize = obj.module.cwrap('emx_grect_standardize', 'number',
                                               []);
  obj.grect_standardize = function(rect) {
    rect = obj.GRect(rect);
    var returnRectPTR = emx_grect_standardize(rect.x, rect.y, rect.w, rect.h);
    rect.x = obj.module.getValue(returnRectPTR, 'i16');
    rect.y = obj.module.getValue(returnRectPTR + 2, 'i16');
    rect.w = obj.module.getValue(returnRectPTR + 4, 'i16');
    rect.h = obj.module.getValue(returnRectPTR + 6, 'i16');
  };

  // void grect_clip(GRect *rect_to_clip, GRect *rect_clipper);
  // GRect *emx_grect_clip(int16_t to_clip_x, int16_t to_clip_y,
  //                       int16_t to_clip_w, int16_t to_clip_h,
  //                       int16_t clipper_x, int16_t clipper_y,
  //                       int16_t clipper_w, int16_t clipper_h);
  var emx_grect_clip = obj.module.cwrap('emx_grect_clip', 'number',
                     ['number', 'number', 'number', 'number',
                      'number', 'number', 'number', 'number']);
  obj.grect_clip = function(rect_to_clip, rect_clipper) {
    rect_to_clip = obj.GRect(rect_to_clip);
    rect_clipper = obj.GRect(rect_clipper);
    var returnRectPTR = emx_grect_clip(rect_to_clip.x, rect_to_clip.y,
                                       rect_to_clip.w, rect_to_clip.h,
                                       rect_clipper.x, rect_clipper.y,
                                       rect_clipper.w, rect_clipper.h);
    rect_to_clip.x = obj.module.getValue(returnRectPTR, 'i16');
    rect_to_clip.y = obj.module.getValue(returnRectPTR + 2, 'i16');
    rect_to_clip.w = obj.module.getValue(returnRectPTR + 4, 'i16');
    rect_to_clip.h = obj.module.getValue(returnRectPTR + 6, 'i16');
  };

  // bool grect_contains_point(GRect *rect, GPoint *point):
  // bool emx_grect_contains_point(int16_t r_x, int16_t r_y,
  //                               int16_t r_w, int16_t r_h,
  //                               int16_t p_x, int16_t p_y);
  var emx_grect_contains_point =
      obj.module.cwrap('emx_grect_contains_point', 'number',
                      ['number', 'number', 'number', 'number', 'number', 'number']);
  obj.grect_contains_point = function(rect, point) {
    rect = obj.GRect(rect);
    point = obj.GPoint(point);
    return emx_grect_contains_point(rect.x, rect.y, rect.w, rect.h,
                                    point.x, point.y) !== 0;
  };

  // GPoint grect_center_point(GRect *rect);
  // GPoint *emx_grect_center_point(int16_t r_x, int16_t r_y,
  //                                int16_t r_w, int16_t r_h);
  var emx_grect_center_point = obj.module.cwrap('emx_grect_center_point', 'number',
                         ['number', 'number', 'number', 'number']);
  obj.grect_center_point = function(rect) {
    rect = obj.GRect(rect);
    var returnPointPTR = emx_grect_center_point(rect.x, rect.y, rect.w, rect.h);
    var returnPoint = obj.GPoint(obj.module.getValue(returnPointPTR, 'i16'),
                   obj.module.getValue(returnPointPTR + 2, 'i16'));
    return returnPoint;
  };

  // GRect grect_crop(GRect rect, const int32_t crop_size_px)
  // GRect *emx_grect_crop(int16_t r_x, int16_t r_y, int16_t r_w, int16_t r_h,
  //                       int32_t crop_size_px) {
  var emx_grect_crop = obj.module.cwrap('emx_grect_crop', 'number',
                     ['number', 'number', 'number', 'number',
                      'number']);
  obj.grect_crop = function(rect, crop_size_px) {
    rect = obj.GRect(rect);
    var returnRectPTR = emx_grect_crop(rect.x, rect.y, rect.w, rect.h, crop_size_px);
    var returnRect = obj.GRect(obj.module.getValue(returnRectPTR, 'i16'),
                   obj.module.getValue(returnRectPTR + 2, 'i16'),
                   obj.module.getValue(returnRectPTR + 4, 'i16'),
                   obj.module.getValue(returnRectPTR + 6, 'i16'));
    return returnRect;
  };

  // GAlign
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
  // GRect* emx_grect_align(int16_t rect_x, int16_t rect_y,
  //                        int16_t rect_w, int16_t rect_h,
  //                        int16_t inside_x, int16_t inside_y,
  //                        int16_t inside_w, int16_t inside_h,
  //                        const GAlign alignment, const bool clip);
  var emx_grect_align = obj.module.cwrap('emx_grect_align', 'number',
                                        ['number', 'number', 'number', 'number',
                                         'number', 'number', 'number', 'number',
                                         'number', 'number']);
  obj.grect_align = function(rect, inside_rect, alignment, clip) {
    rect = obj.GRect(rect);
    inside_rect = obj.GRect(inside_rect);
    var returnRectPTR = emx_grect_align(rect.x, rect.y, rect.w, rect.h,
                      inside_rect.x, inside_rect.y, inside_rect.w, inside_rect.h,
                      alignment, clip);
    rect.x = obj.module.getValue(returnRectPTR, 'i16');
    rect.y = obj.module.getValue(returnRectPTR + 2, 'i16');
    rect.w = obj.module.getValue(returnRectPTR + 4, 'i16');
    rect.h = obj.module.getValue(returnRectPTR + 6, 'i16');
  };

  // void graphics_draw_circle(GContext *ctx, GPoint center, uin16_t radius);
  // void emx_graphics_draw_circle(GContext *ctx,
  //                 int16_t point_x, int16_t point_y,
  //                 uint16_t radius) {
  var emx_graphics_draw_circle = obj.module.cwrap('emx_graphics_draw_circle', 'void',
                                                 ['number', 'number', 'number']);
  obj.graphics_draw_circle = function(ctx, center, radius) {
    center = obj.GPoint(center);
    return emx_graphics_draw_circle(ctx, center.x, center.y, radius);
  };

  // void graphics_fill_circle(GCOntext *ctx, GPoint center, uin16_t radius);
  // void emx_graphics_fill_circle(GContext *ctx,
  //                               int16_t center_x, int16_t center_y,
  //                               uint16_t radius);
  var emx_graphics_fill_circle = obj.module.cwrap('emx_graphics_fill_circle', 'void',
                                                 ['number', 'number', 'number']);
  obj.graphics_fill_circle = function(ctx, center, radius) {
    center = obj.GPoint(center);
    return emx_graphics_fill_circle(ctx, center.x, center.y, radius);
  };

  // void graphics_draw_round_rect(GContext *ctx, GRect rect, uint16_t radius)
  // void emx_graphics_draw_round_rect(GContext* ctx,
  //                   int16_t rect_origin_x, int16_t rect_origin_y,
  //                   int16_t rect_size_w, int16_t rect_size_h,
  //                   uint16_t radius) {
  var emx_graphics_draw_round_rect =
      obj.module.cwrap('emx_graphics_draw_round_rect', 'void',
                      ['number', 'number', 'number', 'number', 'number']);
  obj.graphics_draw_round_rect = function(ctx, rect, radius) {
    rect = obj.GRect(rect);
    return emx_graphics_draw_round_rect(ctx, rect.x, rect.y, rect.w, rect.h, radius);
  };

  // GOvalScaleMode
  obj.GOvalScaleModeFitCircle = 0;
  obj.GOvalScaleModeFillCircle = 1;

  // GPoint gpoint_from_polar(GRect rect, GOvalScaleMode scale_mode, int32_t angle);
  // GPoint *emx_gpoint_from_polar(int16_t rect_x, int16_t rect_y,
  //                               int16_t rect_w, int16_t rect_h,
  //                               GOvalScaleMode scale_mode, int32_t angle);
  var emx_gpoint_from_polar = obj.module.cwrap('emx_gpoint_from_polar', 'number',
                         ['number', 'number', 'number', 'number',
                          'number', 'number']);
  obj.gpoint_from_polar = function(rect, scale_mode, angle) {
    rect = obj.GRect(rect);
    var TRIG_MAX_ANGLE = 0x10000;
    angle = (angle * TRIG_MAX_ANGLE) / (Math.PI * 2);
    var returnPointPTR = emx_gpoint_from_polar(rect.x, rect.y, rect.w, rect.h,
                                               scale_mode, angle);
    var returnPoint = obj.GPoint(obj.module.getValue(returnPointPTR, 'i16'),
                                 obj.module.getValue(returnPointPTR + 2, 'i16'));
    return returnPoint;
  };

  // GRect grect_centered_from_polar(GRect rect, GOvalScaleMode scale_mode,
  //                                 int32_t angle, GSize size);
  // GRect *emx_grect_centered_from_polar(int16_t rect_x, int16_t rect_y,
  //                                      int16_t rect_w, int16_t rect_h,
  //                                      GOvalScaleMode scale_mode, int32_t angle,
  //                                      int16_t size_w, int16_t size_h);
  var emx_grect_centered_from_polar =
      obj.module.cwrap('emx_grect_centered_from_polar', 'number',
                      ['number', 'number', 'number', 'number', 'number', 'number',
                       'number', 'number']);
  obj.grect_centered_from_polar = function(rect, scale_mode, angle, size) {
    rect = obj.GRect(rect);
    var TRIG_MAX_ANGLE = 0x10000;
    angle = (angle * TRIG_MAX_ANGLE) / (Math.PI * 2);
    size = obj.GSize(size);

    var returnRectPTR = emx_grect_centered_from_polar(rect.x, rect.y, rect.w, rect.h,
                              scale_mode, angle, size.w, size.h);
    var returnRect = obj.GRect(obj.module.getValue(returnRectPTR, 'i16'),
                               obj.module.getValue(returnRectPTR + 2, 'i16'),
                               obj.module.getValue(returnRectPTR + 4, 'i16'),
                               obj.module.getValue(returnRectPTR + 6, 'i16'));
    return returnRect;
  };

  // GCompOp
  obj.GCompOpAssign = 0;
  obj.GCompOpAssignInverted = 1;
  obj.GCompOpOr = 2;
  obj.GCompOpAnd = 3;
  obj.GCompOpClear = 4;
  obj.GCompOpSet = 5;

  // void graphics_context_set_compositing_mode(GContext* ctx, GCompOp mode);
  obj.graphics_context_set_compositing_mode =
      obj.module.cwrap('graphics_context_set_compositing_mode', 'void',
                      ['number', 'number']);

  // GBitmapFormat
  obj.GBitmapFormat1Bit = 0;
  obj.GBitmapFormat8Bit = 1;
  obj.GBitmapFormat1BitPalette = 2;
  obj.GBitmapFormat2BitPalette = 3;
  obj.GBitmapFormat4BitPalette = 4;
  obj.GBitmapFormat8BitCircular = 5;

  // GBitmapFormat gbitmap_get_format(const GBitmap *bitmap);
  var gbitmap_get_format = obj.module.cwrap('gbitmap_get_format', 'number',
                                           ['number']);
  obj.gbitmap_get_format = function(bitmap) {
    try {
      var cPtr = bitmap.captureCPointer();
      if (!cPtr) {
        return 0xff;
      }
      return gbitmap_get_format(cPtr);
    } finally {
      bitmap.releaseCPointer(cPtr);
    }
  };

  // GRect gbitmap_get_bounds(const GBitmap *bitmap);
  // GRect *emx_gbitmap_get_bounds(GBitmap *bitmap);
  var emx_gbitmap_get_bounds = obj.module.cwrap('emx_gbitmap_get_bounds', 'number',
                                               ['number']);
  obj.gbitmap_get_bounds = function(bitmap) {
    try {
      var cPtr = bitmap.captureCPointer();
      if (!cPtr) {
        return obj.GRect([0, 0, 0, 0]);
      }
      var returnRectPTR = emx_gbitmap_get_bounds(cPtr);
      return obj.GRect(obj.module.getValue(returnRectPTR, 'i16'),
                       obj.module.getValue(returnRectPTR + 2, 'i16'),
                       obj.module.getValue(returnRectPTR + 4, 'i16'),
                       obj.module.getValue(returnRectPTR + 6, 'i16'));
    } finally {
      bitmap.releaseCPointer(cPtr);
    }
  };

  // void emx_graphics_draw_bitmap_in_rect(GContext *ctx, const GBitmap *bitmap,
  //                                       int16_t rect_x, int16_t rect_y,
  //                                       int16_t rect_w, int16_t rect_h);
  var emx_graphics_draw_bitmap_in_rect =
      obj.module.cwrap('emx_graphics_draw_bitmap_in_rect', 'void',
                      ['number', 'number', 'number', 'number', 'number', 'number']);

  obj.graphics_draw_bitmap_in_rect = function(ctx, bitmap, rect) {
    rect = obj.GRect(rect);
    try {
      var cPtr = bitmap.captureCPointer();
      if (!cPtr) {
        return;
      }
      emx_graphics_draw_bitmap_in_rect(ctx, cPtr, rect.x, rect.y, rect.w, rect.h);
    } finally {
      bitmap.releaseCPointer(cPtr);
    }
  };

  // void graphics_draw_rotated_bitmap(GContext* ctx, GBitmap *src,
  //                                   GPoint src_ic, int rotation, GPoint dest_ic);
  // void emx_graphics_draw_rotated_bitmap(GContext *ctx, GBitmap *src,
  //                                       int16_t src_x, int16_t src_y,
  //                                       int rotation,
  //                                       int16_t dest_x, int16_t dest_y);
  var emx_graphics_draw_rotated_bitmap =
      obj.module.cwrap('emx_graphics_draw_rotated_bitmap', 'void',
                      ['number', 'number', 'number', 'number',
                       'number', 'number', 'number']);
  obj.graphics_draw_rotated_bitmap = function(ctx, bitmap, src, rotation, dest) {
    src = obj.GPoint(src);
    dest = obj.GPoint(dest);
    try {
      var cPtr = bitmap.captureCPointer();
      if (!cPtr) {
        return;
      }
      var TRIG_MAX_ANGLE = 0x10000;
      rotation = (rotation * TRIG_MAX_ANGLE) / (Math.PI * 2);
      emx_graphics_draw_rotated_bitmap(ctx, cPtr, src.x, src.y, rotation,
                                       dest.x, dest.y);
    } finally {
      bitmap.releaseCPointer(cPtr);
    }
  };

  // void gpath_draw_filled(GContext* ctx, GPath *path);
  var gpath_draw_filled = obj.module.cwrap('gpath_draw_filled',
                                           'void', ['number', 'number']);

  // void gpath_draw_outline(GContext* ctx, GPath *path);
  var gpath_draw_outline = obj.module.cwrap('gpath_draw_outline', 'void',
                                            ['number', 'number']);

  // void gpath_draw_outline_open(GContext* ctx, GPath* path);
  var gpath_draw_outline_open = obj.module.cwrap('gpath_draw_outline_open', 'void',
                                                 ['number', 'number']);

  var create_gpath_func = function(func) {
    return function(ctx, path) {
      var cPtr = path.captureCPointer();
      try {
        func(ctx, cPtr);
      } finally {
        path.releaseCPointer(cPtr);
      }
    };
  };

  obj.gpath_draw_filled = create_gpath_func(gpath_draw_filled);
  obj.gpath_draw_outline = create_gpath_func(gpath_draw_outline);
  obj.gpath_draw_outline_open = create_gpath_func(gpath_draw_outline_open);

  // system font identifiers
  obj.FONT_KEY_FONT_FALLBACK_INTERNAL = 'RESOURCE_ID_FONT_FALLBACK_INTERNAL';
  obj.FONT_KEY_GOTHIC_18_BOLD = 'RESOURCE_ID_GOTHIC_18_BOLD';
  obj.FONT_KEY_GOTHIC_24 = 'RESOURCE_ID_GOTHIC_24';
  obj.FONT_KEY_GOTHIC_09 = 'RESOURCE_ID_GOTHIC_09';
  obj.FONT_KEY_GOTHIC_14 = 'RESOURCE_ID_GOTHIC_14';
  obj.FONT_KEY_GOTHIC_14_EMOJI = 'RESOURCE_ID_GOTHIC_14_EMOJI';
  obj.FONT_KEY_GOTHIC_14_BOLD = 'RESOURCE_ID_GOTHIC_14_BOLD';
  obj.FONT_KEY_GOTHIC_18 = 'RESOURCE_ID_GOTHIC_18';
  obj.FONT_KEY_GOTHIC_18_EMOJI = 'RESOURCE_ID_GOTHIC_18_EMOJI';
  obj.FONT_KEY_GOTHIC_24_BOLD = 'RESOURCE_ID_GOTHIC_24_BOLD';
  obj.FONT_KEY_GOTHIC_24_EMOJI = 'RESOURCE_ID_GOTHIC_24_EMOJI';
  obj.FONT_KEY_GOTHIC_28 = 'RESOURCE_ID_GOTHIC_28';
  obj.FONT_KEY_GOTHIC_28_BOLD = 'RESOURCE_ID_GOTHIC_28_BOLD';
  obj.FONT_KEY_GOTHIC_28_EMOJI = 'RESOURCE_ID_GOTHIC_28_EMOJI';
  obj.FONT_KEY_BITHAM_30_BLACK = 'RESOURCE_ID_BITHAM_30_BLACK';
  obj.FONT_KEY_BITHAM_42_BOLD = 'RESOURCE_ID_BITHAM_42_BOLD';
  obj.FONT_KEY_BITHAM_42_LIGHT = 'RESOURCE_ID_BITHAM_42_LIGHT';
  obj.FONT_KEY_BITHAM_42_MEDIUM_NUMBERS = 'RESOURCE_ID_BITHAM_42_MEDIUM_NUMBERS';
  obj.FONT_KEY_BITHAM_34_MEDIUM_NUMBERS = 'RESOURCE_ID_BITHAM_34_MEDIUM_NUMBERS';
  obj.FONT_KEY_BITHAM_34_LIGHT_SUBSET = 'RESOURCE_ID_BITHAM_34_LIGHT_SUBSET';
  obj.FONT_KEY_BITHAM_18_LIGHT_SUBSET = 'RESOURCE_ID_BITHAM_18_LIGHT_SUBSET';
  obj.FONT_KEY_ROBOTO_CONDENSED_21 = 'RESOURCE_ID_ROBOTO_CONDENSED_21';
  obj.FONT_KEY_ROBOTO_BOLD_SUBSET_49 = 'RESOURCE_ID_ROBOTO_BOLD_SUBSET_49';
  obj.FONT_KEY_DROID_SERIF_28_BOLD = 'RESOURCE_ID_DROID_SERIF_28_BOLD';
  obj.FONT_KEY_LECO_20_BOLD_NUMBERS = 'RESOURCE_ID_LECO_20_BOLD_NUMBERS';
  obj.FONT_KEY_LECO_26_BOLD_NUMBERS_AM_PM = 'RESOURCE_ID_LECO_26_BOLD_NUMBERS_AM_PM';
  obj.FONT_KEY_LECO_32_BOLD_NUMBERS = 'RESOURCE_ID_LECO_32_BOLD_NUMBERS';
  obj.FONT_KEY_LECO_36_BOLD_NUMBERS = 'RESOURCE_ID_LECO_36_BOLD_NUMBERS';
  obj.FONT_KEY_LECO_38_BOLD_NUMBERS = 'RESOURCE_ID_LECO_38_BOLD_NUMBERS';
  obj.FONT_KEY_LECO_42_NUMBERS = 'RESOURCE_ID_LECO_42_NUMBERS';
  obj.FONT_KEY_LECO_28_LIGHT_NUMBERS = 'RESOURCE_ID_LECO_28_LIGHT_NUMBERS';
  obj.FONT_KEY_FONT_FALLBACK = 'RESOURCE_ID_GOTHIC_14';

  // GTextOverflowMode
  obj.GTextOverflowModeWordWrap = 0;
  obj.GTextOverflowModeTrailingEllipsis = 1;
  obj.GTextOverflowModeFill = 2;

  // GTextAlignment
  obj.GTextAlignmentLeft = 0;
  obj.GTextAlignmentCenter = 1;
  obj.GTextAlignmentRight = 2;

  // void graphics_draw_text(GContext *ctx, const char *text,
  //   GFont const font, const GRect box,
  //   const GTextOverflowMode overflow_mode, const GTextAlignment alignment,
  //   GTextAttributes *text_attributes);
  // void emx_graphics_draw_text(GContext *ctx, const char *text, GFont const font,
  //   int16_t box_x, int16_t box_y, int16_t box_w, int16_t box_h,
  //   const GTextOverflowMode overflow_mode, const GTextAlignment alignment,
  //   GTextAttributes *text_attributes;
  var emx_graphics_draw_text =
    obj.module.cwrap('emx_graphics_draw_text', 'void',
                     ['number', 'string', 'number', 'number', 'number',
                      'number', 'number', 'number', 'number', 'number']);

  obj.graphics_draw_text = function(ctx, text, font, box, overflowMode,
                                    alignment) {
    box = obj.GRect(box);
    var cPtr = font.captureCPointer();
    if (!cPtr) {
      return;
    }
    try {
      return emx_graphics_draw_text(ctx, text, cPtr, box.x, box.y, box.w, box.h,
                                    overflowMode, alignment, null);
    } finally {
      font.releaseCPointer(cPtr);
    }
  };

  // GSize graphics_text_layout_get_content_size(const char *text,
  //   GFont const font, const GRect box, const GTextOverflowMode overflow_mode,
  //   const GTextAlignment alignment);
  // GSize *emx_graphics_text_layout_get_content_size_with_attributes(
  //   char *text, GFont const font, int16_t box_x, int16_t box_y, int16_t box_w,
  //   int16_t box_h, GTextOverflowMode overflow_mode, GTextAlignment alignment,
  //   GTextAttributes *text_attributes);
  var emx_graphics_text_layout_get_content_size_with_attributes =
    obj.module.cwrap('emx_graphics_text_layout_get_content_size_with_attributes',
      'void', ['string', 'number', 'number', 'number',
        'number', 'number', 'number', 'number', 'number']);

  obj.graphics_text_layout_get_content_size = function(
      text, font, box, overflowMode, alignment) {
    box = obj.GRect(box);
    var cPtr = font.captureCPointer();
    if (!cPtr) {
      return {w: 0, h: 0};
    }
    try {
      var returnSizePtr = emx_graphics_text_layout_get_content_size_with_attributes(
        text, cPtr, box.x, box.y, box.w, box.h, overflowMode, alignment, null);

      return {
        w: obj.module.getValue(returnSizePtr, 'i16'),
        h: obj.module.getValue(returnSizePtr + 2, 'i16')
      };
    } finally {
      font.releaseCPointer(cPtr);
    }
  };

  // GDrawCommandType
  obj.GDrawCommandTypeInvalid = 0;
  obj.GDrawCommandTypePath = 1;
  obj.GDrawCommandTypeCircle = 2;
  obj.GDrawCommandTypePrecisePath = 3;

  // constructs a function that captures the C pointer of its first argument:
  //   var f = firstArgCaptured(func)
  //   f(a, b, c) === func(aCapturedAsCPtr, b, c)
  // if you provide a function for wrap, if will call that instead:
  //   var f = firstArgCaptured(func, process)
  //   f(a,b, c) === process(func, aCapturedAsCPtr, b, c)
  function firstArgCaptured(func, wrap) {
    return function(obj) {
      var args = Array.prototype.slice.call(arguments, 1);
      var cPtr = obj.captureCPointer();
      try {
        args.unshift(cPtr);
        if (wrap) {
          args.unshift(func);
          return wrap.apply(undefined, args);
        }
        return func.apply(undefined, args);
      } finally {
        obj.releaseCPointer(cPtr);
      }
    };
  }

  function firstArgCapturedCWrap(funcName, returnType, argTypes, processResult) {
    var func = obj.module.cwrap(funcName, returnType, argTypes);
    return firstArgCaptured(func, processResult);
  }

  function addFirstArgCapturedCWrap(
    funcName, returnType, argTypes, processResult) {
    obj[funcName] = firstArgCapturedCWrap(
      funcName, returnType, argTypes, processResult);
  }

  // creates and "inner" object that responds to .captureCPointer, .releaseCPointer
  // that's dependent on a given outerObject. It assumes that the inner object
  // has constant offset to the offset of the outer one.
  var createNestedObject = function(outerObject, outerPtr, innerPtr) {
    if (!innerPtr) {
      return null;
    }
    var offset = innerPtr - outerPtr;
    return {
      outerObject: outerObject,
      outerPtr: outerPtr,
      captureCPointer: function() {
        var ptr = outerObject.captureCPointer();
        if (!ptr) {
          return 0;
        }
        return ptr + offset;
      },
      releaseCPointer: function(ptr) {
        return outerObject.releaseCPointer(ptr - offset);
      }
    };
  };

  // void gdraw_command_image_draw(GContext * ctx,
  //                               GDrawCommandImage *image, GPoint offset)
  // void emx_gdraw_command_image_draw(GContext * ctx,
  //                                   GDrawCommandImage * image,
  //                                   int16_t offset_x, int16_t offset_y)
  var emx_gdraw_command_image_draw =
    obj.module.cwrap('emx_gdraw_command_image_draw', 'void',
      ['number', 'number', 'number', 'number']);

  obj.gdraw_command_image_draw = function(ctx, image, offset) {
    offset = obj.GRect(offset);
    var cPtr = image.captureCPointer();
    try {
      emx_gdraw_command_image_draw(ctx, cPtr, offset.x, offset.y);
    } finally {
      image.releaseCPointer(cPtr);
    }
  };

  // GSize gdraw_command_image_get_bounds_size(GDrawCommandImage * image)
  // GSize *emx_gdraw_command_image_get_bounds_size(GDrawCommandImage *image);
  obj.gdraw_command_image_get_bounds_size = firstArgCapturedCWrap(
    'emx_gdraw_command_image_get_bounds_size',
    'number', ['number'],
    function(get_bounds_size, imagePtr) {
      if (!imagePtr) {
        return obj.GSize(0, 0);
      }
      var returnSizePtr = get_bounds_size(imagePtr);
      return {
        w: obj.module.getValue(returnSizePtr, 'i16'),
        h: obj.module.getValue(returnSizePtr + 2, 'i16')
      };
    }
  );

  // void gdraw_command_image_set_bounds_size(GDrawCommandImage *image, GSize size)
  // void emx_gdraw_command_image_set_bounds_size(GDrawCommandImage *image,
  //                                              int16_t size_w, int16_t size_h)
  obj.gdraw_command_image_set_bounds_size = firstArgCapturedCWrap(
    'emx_gdraw_command_image_set_bounds_size', 'number',
    ['number', 'number', 'number'],
    function(set_bounds_size, imagePtr, size) {
      size = obj.GSize(size);
      set_bounds_size(imagePtr, size.w, size.h);
    }
  );

  // GDrawCommandList *gdraw_command_image_get_command_list(
  //     GDrawCommandImage *image)
  var gdraw_command_image_get_command_list =
    obj.module.cwrap('gdraw_command_image_get_command_list', 'number',
      ['number', 'number']);
  obj.gdraw_command_image_get_command_list = function(image) {
    var cPtr = image.captureCPointer();
    try {
      return createNestedObject(image, cPtr,
        gdraw_command_image_get_command_list(cPtr)
      );
    } finally {
      image.releaseCPointer(cPtr);
    }
  };

  // uint32_t gdraw_command_list_get_num_commands(GDrawCommandList * command_list)
  addFirstArgCapturedCWrap('gdraw_command_list_get_num_commands',
    'number', ['number']);

  // GDrawCommand *gdraw_command_list_get_command(
  //     GDrawCommandList * command_list, uint16_t command_idx)
  var gdraw_command_list_get_command =
    obj.module.cwrap('gdraw_command_list_get_command', 'number',
                     ['number', 'number']);
  obj.gdraw_command_list_get_command = function(list, idx) {
    var cPtr = list.captureCPointer();
    try {
      return createNestedObject(list, cPtr,
        gdraw_command_list_get_command(cPtr, idx)
      );
    } finally {
      list.releaseCPointer(cPtr);
    }
  };

  // GDrawCommandType gdraw_command_get_type(GDrawCommand *command)
  addFirstArgCapturedCWrap('gdraw_command_get_type',
    'number', ['number']);

  // void gdraw_command_set_stroke_width(
  //     GDrawCommand *command, uint8_t stroke_width)
  addFirstArgCapturedCWrap('gdraw_command_set_stroke_width',
    'void', ['number', 'number']);

  // uint8_t gdraw_command_get_stroke_width(
  //     GDrawCommand *command)
  addFirstArgCapturedCWrap('gdraw_command_get_stroke_width',
    'number', ['number']);

  // void gdraw_command_set_path_open(GDrawCommand *command,
  //     bool path_open)
  addFirstArgCapturedCWrap('gdraw_command_set_path_open',
    'void', ['number', 'number']);

  // bool gdraw_command_get_path_open(GDrawCommand * command)
  addFirstArgCapturedCWrap('gdraw_command_get_path_open',
    'bool', ['number'],
    function(f, command) {return !!f(command);}
  );

  // void gdraw_command_set_hidden(GDrawCommand *command,
  //     bool hidden)
  addFirstArgCapturedCWrap('gdraw_command_set_hidden',
    'void', ['number', 'number']);

  // bool gdraw_command_get_hidden(GDrawCommand *command)
  addFirstArgCapturedCWrap('gdraw_command_get_hidden',
    'number', ['number'],
    function(f, command) {return !!f(command);}
  );

  // uint16_t gdraw_command_get_num_points(GDrawCommand *command)
  addFirstArgCapturedCWrap('gdraw_command_get_num_points',
    'number', ['number']);

  // void gdraw_command_set_radius(GDrawCommand * command, uint16_t radius)
  addFirstArgCapturedCWrap('gdraw_command_set_radius',
    'void', ['number', 'number']);

  // uint16_t gdraw_command_get_radius(GDrawCommand * command)
  addFirstArgCapturedCWrap('gdraw_command_get_radius',
    'number', ['number']);

  // void gdraw_command_set_fill_color(GDrawCommand * command, GColor fill_color)
  // void emx_gdraw_command_set_fill_color(GDrawCommand *command,
  //                                       uint8_t color_argb);
  obj.gdraw_command_set_fill_color = firstArgCapturedCWrap(
    'emx_gdraw_command_set_fill_color', 'void', ['number', 'number']);

  // GColor gdraw_command_get_fill_color(GDrawCommand * command)
  // unsigned emx_gdraw_command_get_fill_color(GDrawCommand *command);
  obj.gdraw_command_get_fill_color = firstArgCapturedCWrap(
    'emx_gdraw_command_get_fill_color', 'number', ['number']);

  // void gdraw_command_set_stroke_color(GDrawCommand * command, GColor stroke_color)
  // void emx_gdraw_command_set_stroke_color(GDrawCommand *command,
  //                                         uint8_t stroke_color_argb);
  obj.gdraw_command_set_stroke_color = firstArgCapturedCWrap(
    'emx_gdraw_command_set_stroke_color', 'void', ['number', 'number']);

  // GColor gdraw_command_get_stroke_color(GDrawCommand * command)
  // unsigned emx_gdraw_command_get_stroke_color(GDrawCommand *command);
  obj.gdraw_command_get_stroke_color = firstArgCapturedCWrap(
    'emx_gdraw_command_get_stroke_color', 'number', ['number']);

  // void gdraw_command_set_point(GDrawCommand * command,
  //                              uint16_t point_idx, GPoint point)
  // void emx_gdraw_command_set_point(GDrawCommand *command, uint16_t point_idx,
  //                                  int16_t point_x, int16_t point_y);
  obj.gdraw_command_set_point = firstArgCapturedCWrap(
    'emx_gdraw_command_set_point ', 'void', ['number', 'number', 'number'],
    function(f, command, point_idx, point) {
      point = obj.GPoint(point);
      return f(command, point_idx, point.x, point.y);
    }
  );

  // GPoint gdraw_command_get_point(GDrawCommand * command, uint16_t point_idx)
  // GPoint *emx_gdraw_command_get_point(GDrawCommand *command, uint16_t point_idx);
  obj.gdraw_command_get_point = firstArgCapturedCWrap(
    'emx_gdraw_command_get_point', 'number', ['number', 'number'],
    function(get_point, command, point_idx) {
      var resultPtr = get_point(command, point_idx);
      return {
        x: obj.module.getValue(resultPtr, 'i16'),
        y: obj.module.getValue(resultPtr + 2, 'i16')
      };
    }
  );

  // GSize gdraw_command_sequence_get_bounds_size(GDrawCommandSequence *sequence)
  // GSize *emx_gdraw_command_sequence_get_bounds_size(
  //     GDrawCommandSequence *sequence)
  obj.gdraw_command_sequence_get_bounds_size = firstArgCapturedCWrap(
    'emx_gdraw_command_sequence_get_bounds_size', 'number', ['number'],
    function(get_bounds_size, sequencePtr) {
      var resultPtr = get_bounds_size(sequencePtr);
      return {
        w: obj.module.getValue(resultPtr, 'i16'),
        h: obj.module.getValue(resultPtr + 2, 'i16')
      };
    }
  );

  // void gdraw_command_sequence_set_bounds_size(GDrawCommandSequence *sequence,
  //                                             GSize size)
  // void emx_gdraw_command_sequence_set_bounds_size(GDrawCommandSequence *sequence,
  //                                                 int16_t size_x, int16_t size_y)
  obj.gdraw_command_sequence_set_bounds_size = firstArgCapturedCWrap(
    'emx_gdraw_command_sequence_set_bounds_size', 'void',
    ['number', 'number', 'number'],
    function(set_bounds_size, sequencePtr, size) {
      size = obj.GSize(size);
      return set_bounds_size(sequencePtr, size.w, size.h);
    }
  );

  // uint32_t gdraw_command_sequence_get_play_count(GDrawCommandSequence *sequence)
  addFirstArgCapturedCWrap('gdraw_command_sequence_get_play_count',
    'number', ['number']);

  // void gdraw_command_sequence_set_play_count(GDrawCommandSequence *sequence,
  //                                            uint32_t play_count)
  addFirstArgCapturedCWrap('gdraw_command_sequence_set_play_count',
    'void', ['number', 'number']);

  // uint32_t gdraw_command_sequence_get_total_duration(
  //     GDrawCommandSequence *sequence)
  addFirstArgCapturedCWrap('gdraw_command_sequence_get_total_duration',
    'number', ['number']);

  // uint32_t gdraw_command_sequence_get_num_frames(GDrawCommandSequence *sequence)
  addFirstArgCapturedCWrap('gdraw_command_sequence_get_num_frames',
    'number', ['number']);

  // void gdraw_command_frame_set_duration(
  //     GDrawCommandFrame * frame, uint32_t duration)
  addFirstArgCapturedCWrap('gdraw_command_frame_set_duration',
    'void', ['number', 'number']);

  // uint32_t gdraw_command_frame_get_duration(GDrawCommandFrame * frame)
  addFirstArgCapturedCWrap('gdraw_command_frame_get_duration',
    'number', ['number']);

  // GDrawCommandFrame * gdraw_command_sequence_get_frame_by_index(
  //     GDrawCommandSequence * sequence, uint32_t index)
  var gdraw_command_sequence_get_frame_by_index =
    obj.module.cwrap('gdraw_command_sequence_get_frame_by_index',
      'number', ['number', 'number']);
  obj.gdraw_command_sequence_get_frame_by_index = function(sequence, index) {
    var cPtr = sequence.captureCPointer();
    try {
      return createNestedObject(sequence, cPtr,
        gdraw_command_sequence_get_frame_by_index(cPtr, index)
      );
    } finally {
      sequence.releaseCPointer(cPtr);
    }
  };

  // GDrawCommandFrame * gdraw_command_sequence_get_frame_by_elapsed(
  //     GDrawCommandSequence * sequence, uint32_t elapsed_ms)
  var gdraw_command_sequence_get_frame_by_elapsed =
    obj.module.cwrap('gdraw_command_sequence_get_frame_by_elapsed',
      'number', ['number', 'number']);
  obj.gdraw_command_sequence_get_frame_by_elapsed = function(sequence, elapsed_ms) {
    var cPtr = sequence.captureCPointer();
    try {
      return createNestedObject(sequence, cPtr,
        gdraw_command_sequence_get_frame_by_elapsed(cPtr, elapsed_ms)
      );
    } finally {
      sequence.releaseCPointer(cPtr);
    }
  };

  // GDrawCommandList *gdraw_command_frame_get_command_list(
  //     GDrawCommandFrame *frame);
  var gdraw_command_frame_get_command_list =
    obj.module.cwrap('gdraw_command_frame_get_command_list',
      'number', ['number']);
  obj.gdraw_command_frame_get_command_list = function(frame) {
    var cPtr = frame.captureCPointer();
    try {
      return createNestedObject(frame, cPtr,
        gdraw_command_frame_get_command_list(cPtr)
      );
    } finally {
      frame.releaseCPointer(cPtr);
    }
  };

  // void gdraw_command_frame_draw(GContext * ctx, GDrawCommandSequence *sequence,
  //     GDrawCommandFrame* frame, GPoint offset)
  // void emx_gdraw_command_frame_draw(GContext *ctx, GDrawCommandSequence *sequence,
  //     GDrawCommandFrame *frame, int16_t point_x, int16_t point_y)
  var emx_gdraw_command_frame_draw = obj.module.cwrap('emx_gdraw_command_frame_draw',
      'void', ['number', 'number', 'number', 'number', 'number']);
  obj.gdraw_command_frame_draw = function(ctx, sequence, frame, offset) {
    var framePtr = frame.captureCPointer();
    try {
      offset = obj.GPoint(offset);
      var sequencePtr = frame.outerPtr;
      emx_gdraw_command_frame_draw(ctx, sequencePtr, framePtr, offset.x, offset.y);
    } finally {
      frame.releaseCPointer(framePtr);
    }
  };

  // uint32_t gbitmap_sequence_get_current_frame_delay_ms(
  //     GBitmapSequence *bitmap_sequence);
  addFirstArgCapturedCWrap('gbitmap_sequence_get_current_frame_delay_ms',
    'number', ['number']);

  // uint32_t gbitmap_sequence_get_total_num_frames(
  //     GBitmapSequence *bitmap_sequence);
  addFirstArgCapturedCWrap('gbitmap_sequence_get_total_num_frames',
    'number', ['number']);

  // uint32_t gbitmap_sequence_get_play_count(GBitmapSequence *bitmap_sequence);
  addFirstArgCapturedCWrap('gbitmap_sequence_get_play_count',
    'number', ['number']);

  // uint32_t gbitmap_sequence_get_play_count(GBitmapSequence *bitmap_sequence);
  addFirstArgCapturedCWrap('gbitmap_sequence_get_play_count',
    'number', ['number']);

  // bool emx_gbitmap_sequence_seek_to_elapsed(GBitmapSequence *bitmap_sequence,
  //          uint32_t elapsed);
  obj.gbitmap_sequence_seek_to_elapsed = firstArgCapturedCWrap(
    'emx_gbitmap_sequence_seek_to_elapsed',
    'number', ['number', 'number'],
    function(seek_to_elapsed, cPtr, elapsed) {
      return !!seek_to_elapsed(cPtr, elapsed);
    }
  );

  // GSize gbitmap_sequence_get_bitmap_size(
  //     GBitmapSequence *bitmap_sequence)
  // GSize *emx_gbitmap_sequence_get_bitmap_size(
  //     GBitmapSequence *bitmap_sequence)
  obj.gbitmap_sequence_get_bitmap_size = firstArgCapturedCWrap(
    'emx_gbitmap_sequence_get_bitmap_size', 'number', ['number'],
    function(get_bitmap_size, sequencePtr) {
      var resultPtr = get_bitmap_size(sequencePtr);
      return {
        w: obj.module.getValue(resultPtr, 'i16'),
        h: obj.module.getValue(resultPtr + 2, 'i16')
      };
    }
  );

  return [];
};

// export to enable unit tests
if (typeof (module) !== 'undefined' && module.exports !== null) {
  exports.addGeneratedSymbols = Rocky.addGeneratedSymbols;
}
