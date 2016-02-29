/*global Rocky:true */

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

(function() {
  Rocky.Path2D = function() {
  };

  // TODO: implement this correctly
  Rocky.Path2D.prototype.moveTo = function(x, y) {
    this.p0 = [x, y];
  };
  Rocky.Path2D.prototype.lineTo = function(x, y) {
    this.p1 = [x, y];
  };

})();
