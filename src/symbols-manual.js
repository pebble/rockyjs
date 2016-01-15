/*

    Copyright © 2015-2016 Pebble Technology Corp., All Rights Reserved. http://pebble.github.io/rockyjs/LICENSE

    This files contains various symbols that were manually written to match the behavior of the
    Pebble firmware code base.

    Most of code below translates and normalizes JS values so that they can be used in other routines.

    Functions that normalize structured values such as GPoint() are considered to be idempotent so that
    they can be used to sanitize arguments.

 */

if (typeof(Rocky) == "undefined") {
    Rocky = {};
}

Rocky.addManualSymbols = function (obj) {
    // #define DEG_TO_TRIGANGLE(angle) (((angle) * TRIG_MAX_ANGLE) / 360)
    obj.DEG_TO_TRIGANGLE = function (deg) {
        return deg * 2 * Math.PI / 360;
    };

    // #define GPoint(x, y) ((GPoint){(x), (y)})
    obj.GPoint = function (x, y) {
        if (arguments.length == 1 && typeof(arguments[0]) === "object") {
            y = typeof(x[1]) != "undefined" ? x[1] : x.y;
            x = typeof(x[0]) != "undefined" ? x[0] : x.x;
        }
        return {x: x, y: y};
    };

    // #define GRect(x, y, w, h) ((GRect){{(x), (y)}, {(w), (h)}})
    obj.GRect = function (x, y, w, h) {
        if (arguments.length == 1 && typeof(arguments[0]) === "object") {
            y = typeof(x[1]) != "undefined" ? x[1] : x.y;
            w = typeof(x[2]) != "undefined" ? x[2] : x.w;
            h = typeof(x[3]) != "undefined" ? x[3] : x.h;
            x = typeof(x[0]) != "undefined" ? x[0] : x.x;
        }
        return {x: x, y: y, w: w, h: h};
    };

    obj.GRectZero = obj.GRect(0, 0, 0, 0);

    obj.GEdgeInsets = function(t, r, b, l) {
        if (arguments.length == 1 && typeof t === "object") {
            return {
                t: typeof(t[0]) != "undefined" ? t[0] : t.t,
                r: typeof(t[1]) != "undefined" ? t[1] : t.r,
                b: typeof(t[2]) != "undefined" ? t[2] : t.b,
                l: typeof(t[3]) != "undefined" ? t[3] : t.l
            };
        }
        r = arguments.length <= 1 ? t : r;
        b = arguments.length <= 2 ? t : b;
        l = arguments.length <= 3 ? r : l;
        return {t:t, r:r, b:b, l:l};
    };

    obj.grect_inset = function(rect, insets) {
        rect = obj.GRect(rect);
        insets = obj.GEdgeInsets(insets);
        var w = rect.w - insets.l - insets.r;
        var h = rect.h - insets.t - insets.b;
        if (w < 0 || h < 0) {
            return obj.GRectZero;
        }
        return obj.GRect(rect.x + insets.l, rect.y + insets.t, w, h);
    };

};

// export to enable unit tests
if (typeof module !== 'undefined' && module.exports !== null) {
    exports.addManualSymbols = Rocky.addManualSymbols;
    exports.symbols = {};
    Rocky.addManualSymbols(exports.symbols);
}
