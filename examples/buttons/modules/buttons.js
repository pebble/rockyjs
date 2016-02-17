var buttonHandler = {};

var buttonMap = {
  back: 37,
  up: 38,
  select: 39,
  down: 40
};

window.onPress = function onPress(type, callback) {
  if (Object.keys(buttonMap).indexOf(type) >= 0) {
    buttonHandler[type] = callback;
  } else { console.log('Invalid type passed to onPress.');}
};

document.addEventListener('keydown', function(event) {
  for (var button in buttonMap) {
    if (event.keyCode === buttonMap[button] && buttonHandler[button]) {
      event.preventDefault();
      buttonHandler[button]();
    }
  }
});
