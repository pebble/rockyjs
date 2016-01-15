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
};