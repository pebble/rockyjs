/*global rocky, Rocky:false */

// book keeping so that we can easily animate the two hands for the watchface
// .radius/.angle are updated by tween/event handler (see below)
var renderState = {
  minute: {style: 'white', radius: 0, angle: 0},
  hour: {style: 'red', radius: 0, angle: 0}
};

rocky.ondraw = function(drawEvent) {
  var ctx = drawEvent.context;

  // clear canvas on each render
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, this.innerWidth, this.innerHeight);

  // center point
  var cx = this.innerWidth / 2;
  var cy = this.innerHeight / 2;

  var drawHand = function(state) {
    ctx.lineWidth = 8;
    ctx.strokeStyle = state.style;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.sin(state.angle) * state.radius,
               cy + Math.cos(state.angle) * state.radius);
    ctx.stroke();
  };

  drawHand(renderState.minute);
  drawHand(renderState.hour);
};

rocky.once('visibilitychange', function() {
  // assumes this.visibilitystate === 'visible' on first and hence only call (.once)
  var maxRadius = Math.min(this.innerWidth, this.innerHeight) / 2;

  // micro implementation of TweenJS
  this.tween(renderState, {override: true, requestDraw: true})
      .to({'minute.radius': maxRadius - 7,
             'hour.radius': maxRadius - 28}, 500, 'easeOutQuart');
});

// calls handler on each full minute and once immediately
rocky.on('minutechange', function(e) {
  var wfh = new Rocky.WatchfaceHelper(e.date);
  renderState.minute.angle = wfh.minuteAngle;
  renderState.hour.angle = wfh.hourAngle;
  rocky.requestDraw();
});
