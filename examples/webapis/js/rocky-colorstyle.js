/*global Rocky:true */

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

(function() {
  var colorNames = {
    black: 0xC0,
    red: 0xF0,
    white: 0xFF
  };

  Rocky.GColorFromStyle = function(style) {
    // TODO: implement fully
    return colorNames[style];
  };
})();
