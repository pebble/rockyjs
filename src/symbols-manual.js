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

    obj.GEdgeInsets = function(top, right, bottom, left) {
        if (arguments.length == 1 && typeof top === "object") {
            var obj = top;
            return {
                top: typeof(obj[0]) != "undefined" ? obj[0] : obj.top,
                right: typeof(obj[1]) != "undefined" ? obj[1] : obj.right,
                bottom: typeof(obj[2]) != "undefined" ? obj[2] : obj.bottom,
                left: typeof(obj[3]) != "undefined" ? obj[3] : obj.left
            };
        }
        right = arguments.length <= 1 ? top : right;
        bottom = arguments.length <= 2 ? top : bottom;
        left = arguments.length <= 3 ? right : left;
        return {top:top, right:right, bottom:bottom, left:left};
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

};

// export to enable unit tests
if (typeof module !== 'undefined' && module.exports !== null) {
    exports.addManualSymbols = Rocky.addManualSymbols;
    exports.symbols = {};
    Rocky.addManualSymbols(exports.symbols);
}
