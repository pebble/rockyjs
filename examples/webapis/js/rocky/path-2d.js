function Path2D() {}

var rounded = function(v) {
  return Math.round(v * 8) / 8;
};

// TODO: implement this correctly
Path2D.prototype.moveTo = function(x, y) {
  this.p0 = [rounded(x), rounded(y)];
};

Path2D.prototype.lineTo = function(x, y) {
  this.p1 = [rounded(x), rounded(y)];
};

module.exports = Path2D;
