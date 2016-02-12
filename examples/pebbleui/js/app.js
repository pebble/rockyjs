(function() {
  var rocky = Rocky.bindCanvas(document.getElementById("pebble"));
  var UI = new PebbleUI(rocky);
  
  var imageUrl = "https://www.ciee.org/high-school-summer-abroad/images/sitewide/homeBtn25x25.png";

  var main = new UI.Window({ backgroundColor: rocky.GColorBlack });

  var circle = new UI.Circle([0,0,144,168], { backgroundColor: rocky.GColorRed });
  var rect = new UI.Rect([70,125,60,30], { backgroundColor: rocky.GColorBlue });
  var text = new UI.Text([30,80, 104, 108], "This is some text or whatever, blah blah blah", { color: rocky.GColorYellow });
  
  // Set z-index to -1 to ensure it's in the back
  var image = new UI.Image(imageUrl, [10,10,25,25], { z: -1 }); 

  main.add(circle);
  main.add(rect)
  main.add(text);
  main.add(image);

  main.show();
})();
