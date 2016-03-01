/*global rocky, Rocky:false */

// book keeping so that we can easily animate the two hands for the watchface
// .scale/.angle are updated by tween/event handler (see below)
var renderState = {
  minute: {style: 'white', scale: 0, angle: 0},
  hour: {style: 'red', scale: 0, angle: 0}
};

rocky.ondraw = function(drawEvent) {
  var ctx = drawEvent.context;
  var w = this.innerWidth;
  var h = this.innerHeight;

  // clear canvas on each render
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, w, h);

  // center point
  var cx = w / 2;
  var cy = h / 2;
  var maxRadius = Math.min(w, h) / 2;

  var drawHand = function(state) {
    ctx.lineWidth = 8;
    ctx.strokeStyle = state.style;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.sin(state.angle) * state.scale * maxRadius,
               cy + Math.cos(state.angle) * state.scale * maxRadius);
    ctx.stroke();
  };

  drawHand(renderState.minute);
  drawHand(renderState.hour);
};

rocky.once('visibilitychange', function() {
  // assumes this.visibilitystate === 'visible' on first and hence only call (.once)

  // micro implementation of TweenJS
  this.tween(renderState, {eachStep: 'requestDraw'})
      .to({'minute.scale': 0.95,
             'hour.scale': 0.8}, 500, 'easeOutQuart');
});

// calls handler on each full minute and once immediately
rocky.on('minutechange', function(e) {
  var wfh = new Rocky.WatchfaceHelper(e.date);
  renderState.minute.angle = wfh.minuteAngle;
  renderState.hour.angle = wfh.hourAngle;
  rocky.requestDraw();
});
