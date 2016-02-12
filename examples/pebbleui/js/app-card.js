// Better example with a card
(function() {
  var rocky = Rocky.bindCanvas(document.getElementById("pebble"));
  rocky.export_global_c_symbols();

  var UI = new PebbleUI(rocky);
  
  var card = new UI.Card({ 
    backgroundColor: GColorBlack,
    title: "Pebble.js",
    titleColor: GColorRed,
    subtitle: "This is some text",
    subtitleColor: GColorYellow,
    body: "Press a button :)",
    bodyColor: GColorWhite
  });

  card.onUp(function(event) {
    console.log("Up: " + event.type);
  });

  card.onDown(function(event) {
    console.log("Down: " + event.type);
  });

  card.onSelect(function(event) {
    console.log("Select: " + event.type); 
  });

  card.show();

})();
