/*global rocky, Rocky:false */

// book keeping so that we can easily animate the two hands for the watchface
// .scale/.angle are updated by tween/event handler (see below)
var renderState = {
  minute: {style: 'white', scale: 0, angle: 0},
  hour: {style: 'red', scale: 0, angle: 0}
};

// helper function for the draw function (see below)
// extracted as a standalone function to satisfy common believe in efficient JS code
// TODO: verify that this has actually any effect on byte code level
var drawHand = function(handState, ctx, cx, cy, maxRadius) {
  ctx.lineWidth = 8;
  ctx.strokeStyle = handState.style;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.sin(handState.angle) * handState.scale * maxRadius,
             cy + Math.cos(handState.angle) * handState.scale * maxRadius);
  ctx.stroke();
};

// the 'draw' event is being emitted after each call to rocky.requestDraw() but
// at most once for each screen update, even if .requestDraw() is called frequently
// the 'draw' event might also fire at other meaningful times (e.g. upon launch)
rocky.on('draw', function(drawEvent) {
  var ctx = drawEvent.context;
  var w = this.innerWidth;
  var h = this.innerHeight;

  // clear canvas on each render
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, w, h);

  // center point
  var cx = w / 2;
  var cy = h / 2;
  var maxRadius = Math.min(w, h - 2 * 10) / 2;
  drawHand(renderState.minute, ctx, cx, cy, maxRadius);
  drawHand(renderState.hour, ctx, cx, cy, maxRadius);

  // Draw a 12 o clock indicator
  drawHand({style: 'white', scale: 0, angle: 0}, ctx, cx, 8, 0);
});

// animates the watchface by expanding the hands
// after we completely transitioned to the app.
// we don't use .on('ready', f) as this would be too early
// for the desired visual effect.
rocky.once('visibilitychange', function() {
  // https://developer.mozilla.org/en-US/docs/Web/Events/visibilitychange
  // assumes this.visibilitystate === 'visible' on first and hence only call (.once)

  // micro implementation of TweenJS (will later be an npm Module)
  // http://www.createjs.com/docs/tweenjs/modules/TweenJS.html
  // TODO: this is still WIP, see rocky-TweenJS.js
  Rocky.tween(renderState, {onChange: rocky.requestDraw})
       .to({'minute.scale': 0.85, 'hour.scale': 0.6}, 700, 'easeOutQuart');
});

// listener is called on each full minute and once immediately after registration
rocky.on('minutechange', function(e) {
  // WatchfaceHelper will later be extracted as npm module
  var wfh = new Rocky.WatchfaceHelper(e.date);
  renderState.minute.angle = wfh.minuteAngle;
  renderState.hour.angle = wfh.hourAngle;
  rocky.requestDraw();
});
