(function() {
  var rocky = Rocky.bindCanvas(document.getElementById("pebble"));
  rocky.export_global_c_symbols();

  var UI = new PebbleUI(rocky);
  var main = new UI.Window({ 
    backgroundColor: GColorBlack 
  });
  var image = new UI.Image({
    bounds: [0, 0, 25, 25], 
    url: "https://www.ciee.org/high-school-summer-abroad/images/sitewide/homeBtn25x25.png",
    z: -1
  }); 
  main.add(image);
  main.show();

  var stages = [
    [0, 0, 25, 25],
    [144 - 25, 0, 25, 25],
    [144 - 25, 168 - 25, 25, 25],
    [0, 168 - 25, 25, 25]
  ];

  var currentTarget = 1;
  function nextAnimation() {
    image.animateBounds(stages[currentTarget], 500, 0, nextAnimation);

    currentTarget += (currentTarget == 3) ? -3 : 1;
  }
  nextAnimation();
})();
