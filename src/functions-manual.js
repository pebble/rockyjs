/* Copyright © 2015-2016 Pebble Technology Corp., All Rights Reserved. http://pebble.github.io/rockyjs/LICENSE */

if (typeof(Rocky) == "undefined") {
    Rocky = {};
}

Rocky.addManualFunctions = function (obj) {
    obj.DEG_TO_TRIGANGLE = function (deg) {
        return deg * 2 * Math.PI / 360;
    };

    obj.GPoint = function (x, y) {
        if (arguments.length != 2) {
            y = typeof(x[1]) != "undefined" ? x[1] : x.y;
            x = typeof(x[0]) != "undefined" ? x[0] : x.x;
        }
        return {x: x, y: y};
    };

    obj.GRect = function (x, y, w, h) {
        if (arguments.length == 1) {
            y = typeof(x[1]) != "undefined" ? x[1] : x.y;
            w = typeof(x[2]) != "undefined" ? x[2] : x.w;
            h = typeof(x[3]) != "undefined" ? x[3] : x.h;
            x = typeof(x[0]) != "undefined" ? x[0] : x.x;
        }
        return {x: x, y: y, w: w, h: h};
    };

    obj.GRectZero = obj.GRect(0, 0, 0, 0);

    obj.GEdgeInsets = function(t, r, b, l) {
        r = arguments.length <= 1 ? t : r;
        b = arguments.length <= 2 ? t : b;
        l = arguments.length <= 3 ? r : l;
        return {t:t, r:r, b:b, l:l};
    };

    obj.grect_inset = function(rect, insets) {
        rect = obj.GRect(rect);
        insets = GEdgeInsets(insets);
        var w = rect.w - insets.l - insets.r;
        var h = rect.h - insets.t - insets.b;
        if (w < 0 || h < 0) {
            return obj.GRectZero;
        }
        return GRect(rect.x + insets.l, rect.y + insets.t, w, h);
    }
};