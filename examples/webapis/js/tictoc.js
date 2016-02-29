/*global rocky, Rocky:false */

// book keeping so that we can easily animate the two hands for the watchface
// .radius/.angle are updated by tween/event handler
var renderState = {
  minute: {style: 'white', radius: 0, angle: 0},
  hour: {style: 'red', radius: 0, angle: 0}
};

rocky.on('render', function(ctx) {
  // clear canvas on each render
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  // center point
  var cx = ctx.canvas.clientWidth / 2;
  var cy = ctx.canvas.clientHeight / 2;

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
});

// one could implement this based on setInterval()/setTimeout()
// we use this small wrapper for convenience
rocky.tween({
  duration: 500,
  easing: 'easeOutQuart',
  step: function(t, ctx) {
    var maxRadius = Math.min(ctx.canvas.clientWidth, ctx.canvas.clientHeight) / 2;
    renderState.minute.radius = t * (maxRadius - 7);
    renderState.hour.radius = t * (maxRadius - 28);
    // animations trigger .requestRender() automatically
    // in fact, .step() handlers are running on the context of .on('beforerender')
  }
});

// calls handler on each full minute and once immediately
rocky.on('minutechange', function(e) {
  var wfh = new Rocky.WatchfaceHelper(e.date);
  renderState.minute.angle = wfh.minuteAngle;
  renderState.hour.angle = wfh.hourAngle;
  rocky.requestRender();
});
