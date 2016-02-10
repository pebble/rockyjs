var buttonHandler = {};

window.onPress = function onPress(type, callback) {
  if (['back', 'up', 'select', 'down'].indexOf(type) >= 0) {
    buttonHandler[type] = callback;
  } else { console.log('Invalid type passed to onPress.');}
};

document.addEventListener('keydown', function(event) {
  if (event.keyCode === 37 && buttonHandler.back) {
    event.preventDefault();
    buttonHandler['back']();
  } else if (event.keyCode === 38 && buttonHandler.up) {
    event.preventDefault();
    buttonHandler['up']();
  } else if (event.keyCode === 39 && buttonHandler.select) {
    event.preventDefault();
    buttonHandler['select']();
  } else if (event.keyCode === 40 && buttonHandler.down) {
    event.preventDefault();
    buttonHandler['down']();
  }
});
