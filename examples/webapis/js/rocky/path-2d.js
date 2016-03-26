function Path2D() {}

// TODO: implement this correctly
Path2D.prototype.moveTo = function(x, y) {
  this.p0 = [x, y];
};

Path2D.prototype.lineTo = function(x, y) {
  this.p1 = [x, y];
};

module.exports = Path2D;
