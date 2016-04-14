/*global Rocky:true */

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

(function() {
  Rocky.Path2D = function() {
  };

  var rounded = function(v) {
    return Math.round(v * 8) / 8;
  };

  // TODO: implement this correctly
  Rocky.Path2D.prototype.moveTo = function(x, y) {
    this.p0 = [rounded(x), rounded(y)];
  };
  Rocky.Path2D.prototype.lineTo = function(x, y) {
    this.p1 = [rounded(x), rounded(y)];
  };

})();
