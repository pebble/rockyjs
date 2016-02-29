/*global Rocky:true */

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

(function() {
  function clockwiseRad(fraction) {
    // TODO: figure out if this is actually correct orientation for Canvas APIs
    return (1.5 - fraction) * 2 * Math.PI;
  }

  Rocky.WatchfaceHelper = function(date) {
    date = date || new Date();
    // TODO: test me against overflows, e.g. 12:00:00 must align all hands perfectly
    this.secondAngle = clockwiseRad(date.getSeconds() / 60);
    this.minuteAngle = clockwiseRad(date.getMinutes() / 60) + this.secondAngle / 60;
    this.hourAngle = clockwiseRad(date.getHours() % 12 / 12) + this.minuteAngle / 60;
  };
})();
