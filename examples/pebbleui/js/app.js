(function() {
  var rocky = Rocky.bindCanvas(document.getElementById("pebble"));
  rocky.export_global_c_symbols();

  var UI = new PebbleUI(rocky);

  var graphics = new UI.Window({ 
    backgroundColor: GColorBlack 
  }).add(new UI.Circle({
    bounds: [0,0,144,168], 
    backgroundColor: GColorRed 
  })).add(new UI.Line({
    color: GColorGreen,
    width: 2,
    bounds: [10,10, 60, 50]
  })).add(new UI.Rect({ 
    bounds: [70,125,60,30],
    backgroundColor: GColorBlue 
  })).add(new UI.Text({ 
    bounds: [30,30, 104, 108], 
    text: "This is some text or whatever, blah blah blah.. press back to go back a screen", 
    color: GColorYellow 
  })).add(new UI.Image({
    bounds: [10,10,25,25], 
    url: "https://www.ciee.org/high-school-summer-abroad/images/sitewide/homeBtn25x25.png",
    z: -1
  }));

  var menu = new UI.Menu({
    title: "Fruit List",
  }).onSelected(function(item) {
    // Dynamically create a card
    new UI.Card({
      title: item.title,
      subtitle: item.details
    }).show();
  });

  menu.push({
    title: "Apple",
    details: "Green and Crisp"
  }).push({
    title: "Orange",
    details: "Peel first!"
  }).push({
    title: "Melon",
    details: "Only three left"
  });

  var card = new UI.Card({ 
    backgroundColor: GColorBlack,
    title: "Pebble.js",
    titleColor: GColorRed,
    subtitle: "Press a button",
    subtitleColor: GColorYellow,
    body: "... and see what happens!",
    bodyColor: GColorWhite,
    onUp: function(event) { this.body("You Pressed Up!"); },
    onDown: function(event) { graphics.show(); },
    onSelect: function(event) { menu.show(); },
    // Override the onBack handler so it doesn't pop the window
    onBack: function(event) { /* Do Nothing */ }
  }).show();
})();
