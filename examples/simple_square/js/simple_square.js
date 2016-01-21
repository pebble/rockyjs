/*eslint no-undef: 0*/

var rocky = Rocky.bindCanvas(document.getElementById('pebble'));
rocky.export_global_c_symbols();

// Array that describes how to draw the 3x5 digits
// 1 means draw a square - 0 means don't
var digits = ['111101101101111',
              '001001001001001',
              '111001111100111',
              '111001111001111',
              '101101111001001',
              '111100111001111',
              '111100111101111',
              '111001001001001',
              '111101111101111',
              '111101111001111'];

// Function to draw a digit in the graphics context at a given co-ordinate
function draw_digit(ctx, d, x, y) {

  // Set the drawing fill colour
  graphics_context_set_fill_color(ctx, GColorWhite);

  // loop through the 5 rows
  for (var ii = 0; ii < 5; ii++) {
    // loop through the 3 columns
    for (var jj = 0; jj < 3; jj++) {
      // use the 1 or 0 to decide if we need to draw a square or not
      if (digits[d].substring((ii * 3) + jj, (ii * 3) + jj + 1) === '1') {
        graphics_fill_rect(ctx, GRect((jj * 15) + x, (ii * 15) + y, 14, 14));
      }
    }
  }
}

rocky.update_proc = function(ctx, bounds) {

  // set fill color to black and draw a rectangle to clear the screen
  graphics_context_set_fill_color(ctx, GColorBlack);
  graphics_fill_rect(ctx, GRect(0, 0, bounds.w, bounds.h), 0, 0);

  // get the current date/time
  var d = new Date();

  // get the hours
  var tm_hour = d.getHours();

  // get the minutes
  var tm_min = d.getMinutes();

  // get the center of the screen co-ordinates
  s_main_window_center = grect_center_point(bounds);

  // DRAW THE HOURS
  // divide by 10 to get first hour digit and draw it
  draw_digit(ctx, Math.floor(tm_hour / 10),
             s_main_window_center.x - 52, s_main_window_center.y - 82);

  // get the remainder of dividing by 10 to get second hour digit and draw it
  draw_digit(ctx, Math.floor(tm_hour % 10),
             s_main_window_center.x + 8, s_main_window_center.y - 82);

  // DRAW THE MINUTES
  // divide by 10 to get first minute digit and draw it
  draw_digit(ctx, Math.floor(tm_min / 10),
             s_main_window_center.x - 52, s_main_window_center.y + 8);

  // get the remainder of dividing by 10 to get second minute digit and draw it
  draw_digit(ctx, Math.floor(tm_min % 10),
            s_main_window_center.x + 8, s_main_window_center.y + 8);
};

// Set how often the screen needs to update
setInterval(function() {rocky.mark_dirty();}, 60 * 1000);
