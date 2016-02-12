(function() {
  var rocky = Rocky.bindCanvas(document.getElementById("pebble"));
  var UI = new PebbleUI(rocky);
  
  var main = new UI.Window({ backgroundColor: rocky.GColorBlack });

  var image = new UI.Image("https://www.ciee.org/high-school-summer-abroad/images/sitewide/homeBtn25x25.png", [10,10,25,25]);
  var circle = new UI.Circle([0,0,144,168], { backgroundColor: rocky.GColorRed });
  var rect = new UI.Rect([70,125,60,30], { backgroundColor: rocky.GColorBlue });
  var text = new UI.Text([30,80, 104, 108], "This is some text or whatever, blah blah blah", { color: rocky.GColorYellow });

  main.add(image);
  main.add(circle);
  main.add(rect)
  main.add(text);

  main.show();
})();
