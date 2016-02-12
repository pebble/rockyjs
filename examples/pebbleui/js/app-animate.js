(function() {
  var rocky = Rocky.bindCanvas(document.getElementById("pebble"));
  rocky.export_global_c_symbols();

  var UI = new PebbleUI(rocky);
  var main = new UI.Window({ 
    backgroundColor: GColorWhite 
  });
  var imgSize = 48;
  var image = new UI.Image({
    bounds: [0, 0, imgSize, imgSize], 
    url: "https://cdn0.iconfinder.com/data/icons/black-48x48-icons/48/Bee.png"
  }); 
  main.add(image);
  main.show();

  function random(max) {
    return Math.floor(Math.random() * (max - 0)) + 0;
  }

  var currentTarget = 1;
  function nextAnimation() {
    var to = [random(144 - imgSize), random(168 - imgSize), imgSize, imgSize];
    image.animateBounds(to, 500, 0, nextAnimation);

    currentTarget += (currentTarget == 3) ? -3 : 1;
  }
  nextAnimation();
})();
