function clockwiseRad(fraction) {
  // TODO: figure out if this is actually correct orientation for Canvas APIs
  return (1.5 - fraction) * 2 * Math.PI;
}

module.exports = function WatchfaceHelper(date) {
  date = date || new Date();
  var secondFraction = date.getSeconds() / 60;
  var minuteFraction = (date.getMinutes() + secondFraction) / 60;
  var hourFraction = (date.getHours() % 12 + minuteFraction) / 12;
  this.secondAngle = clockwiseRad(secondFraction);
  this.minuteAngle = clockwiseRad(minuteFraction);
  this.hourAngle = clockwiseRad(hourFraction);
};
