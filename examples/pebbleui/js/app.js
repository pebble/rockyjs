(function() {
  var rocky = Rocky.bindCanvas(document.getElementById("pebble"));
  rocky.export_global_c_symbols();

  var UI = new PebbleUI(rocky);
  
  var graphicsDemoWindow = new UI.Window({ 
    backgroundColor: GColorBlack 
  }).add(new UI.Circle({
    bounds: [0,0,144,168], 
    backgroundColor: GColorRed 
  })).add(new UI.Rect({ 
    bounds: [70,125,60,30],
    backgroundColor: GColorBlue 
  })).add(new UI.Text({ 
    bounds: [30,80, 104, 108], 
    text: "This is some text or whatever, blah blah blah", 
    color: GColorYellow 
  })).add(new UI.Image({
    bounds: [10,10,25,25], 
    url: "https://www.ciee.org/high-school-summer-abroad/images/sitewide/homeBtn25x25.png",
    z: -1
  }));

  var cardDemoWindow = new UI.Card({ 
    backgroundColor: GColorBlack,
    title: "Pebble.js",
    titleColor: GColorRed,
    subtitle: "Press a button",
    subtitleColor: GColorYellow,
    body: "... and see what happens!",
    bodyColor: GColorWhite,
    onUp: function(event) { this.body("You Pressed Up!"); },
    onDown: function(event) { this.body("You Pressed Down!"); },
    onSelect: function(event) { graphicsDemoWindow.show(); },
    // Override the onBack handler so it doesn't quit the app
    onBack: function(event) { /* Do Nothing */ }
  }).show();

})();
