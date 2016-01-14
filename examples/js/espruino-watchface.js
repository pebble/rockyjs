// some library code, could be extracted into some JS files

function scheduleAnimation(options) {
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
}

function interpolate(f, a, b) {
    return a * (1 - f) + f * b;
}

var SECOND_UNIT = 1 << 0;
var MINUTE_UNIT = 1 << 1;
var HOUR_UNIT = 1 << 2;
var DAY_UNIT = 1 << 3;
var MONTH_UNIT = 1 << 4;
var YEAR_UNIT = 1 << 5;

var win = new Window();
var angle_funny = 0;
win.setWindowHandlers({
    load: function () {
        var MINUTE_HAND_MARGIN = 7;
        var HOUR_HAND_MARGIN = 7 * 4;
        var GColorWhite = 255;
        var GColorBlack = 192;
        var GColorRed = 240;
        var STROKE_WIDTH = 8;
        var CLOCK_RADIUS = 65;
        var DOT_Y = 8;


        var canvasLayer = this.rootLayer;
        var bounds = canvasLayer.bounds;

        var data = {
            clockRadius: 0,
            center: {x: bounds.size.w / 2, y: bounds.size.h / 2},
            dotY: bounds.size.h / 2,
            dotY2: bounds.size.h / 2
        };

        TimerService.subscribe(SECOND_UNIT, function (tick_time, changed) {
            data.lastTime = {
                hours: tick_time.hour % 12,
                minutes: tick_time.min
            };
            canvasLayer.mark_dirty();

            function romanize (num) {
                if (!+num) // jshint ignore:line
                    return false;
                var digits = String(+num).split(""),
                    key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                        "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                        "","I","II","III","IV","V","VI","VII","VIII","IX"],
                    roman = "",
                    i = 3;
                while (i--)
                    roman = (key[+digits.pop() + (i * 10)] || "") + roman;
                return Array(+digits.join("") + 1).join("M") + roman;
            }

            var values = [
                romanize(tick_time.hour),
                romanize(tick_time.min),
                romanize(tick_time.sec)
            ];


            console.log(values.join(":"));
        }, true);

        var bgcolor = 0;
        canvasLayer.setUpdateProc(function (ctx) {
            ctx.setFillColor(192 | bgcolor);
            ctx.setStrokeWidth(STROKE_WIDTH);
            var bounds = this.bounds;
            ctx.fillRect(bounds);

            var modeTime = data.lastTime;
            var minuteAngle = modeTime.minutes / 60;
            var hourAngle = (modeTime.hours + minuteAngle) / 12;

            var pt = function (ratioAngle, margin, funny) {
                var radAngle = ratioAngle * 2 * Math.PI;
                radAngle += funny;
                var len = data.clockRadius - margin;
                return {
                    x: Math.sin(radAngle) * len + data.center.x,
                    y: -Math.cos(radAngle) * len + data.center.y
                };
            };

            var minuteHand = pt(minuteAngle, MINUTE_HAND_MARGIN, angle_funny);
            var hourHand = pt(hourAngle, HOUR_HAND_MARGIN, -angle_funny);

            if (data.clockRadius > MINUTE_HAND_MARGIN) {
                ctx.setStrokeColor(GColorWhite);
                ctx.drawLine(data.center, minuteHand);
            }

            if (data.clockRadius > HOUR_HAND_MARGIN) {
                ctx.setStrokeColor(GColorRed);
                ctx.drawLine(data.center, hourHand);
                // fill a circle to make a cleaner center
                ctx.setFillColor(GColorRed);
                ctx.fillCircle(data.center, STROKE_WIDTH / 2);
            }

            // draw a 12 o clock indicator
            ctx.setStrokeColor(GColorWhite);
            ctx.drawLine({
                x: bounds.size.w / 2,
                y: data.dotY
            }, {
                x: bounds.size.w / 2,
                y: data.dotY2
            });

            //console.log("data", data);
        });

        scheduleAnimation({
            delay: 0,
            duration: 1550,
            update: function (progress) {
                function f(prop, max) {
                    data[prop] = interpolate(progress, data[prop], max);
                }

                f("clockRadius", CLOCK_RADIUS + 1);
                f("dotY", DOT_Y);
                f("dotY2", DOT_Y);
                canvasLayer.mark_dirty();
            },
            stop: function () {
                data.dotY = DOT_Y;
                data.dotY2 = DOT_Y;
                canvasLayer.mark_dirty();

                scheduleAnimation({
                    delay: 1000,
                    duration: 3000,
                    update: function (progress) {
                        angle_funny = progress * 2 * Math.PI;
                        canvasLayer.mark_dirty();
                    }
                });

            }
        });

    }
});

win.push();
console.log("Hello, JSConf!");