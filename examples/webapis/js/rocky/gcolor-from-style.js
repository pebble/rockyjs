(function() {
  var colorNames = {
    black: 0xC0,
    red: 0xF0,
    white: 0xFF
  };

  module.exports = function GColorFromStyle(style) {
    // TODO: implement fully
    return colorNames[style];
  };
})();
