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
    body: "This is the body of the card. It has lots of text or whatever :)",
    bodyColor: GColorWhite
  });

  card.show();
})();
