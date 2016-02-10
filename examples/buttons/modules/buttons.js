var buttonHandler = {};

window.onPress = function onPress(type, callback) {
  if (['back', 'up', 'select', 'down'].indexOf(type) >= 0) {
    buttonHandler[type] = callback;
  } else { console.log('Invalid button called.');}
};

document.addEventListener('keydown', function(event) {
  if (event.keyCode === 37 && buttonHandler.back) {
    buttonHandler['back']();
  } else if (event.keyCode === 38 && buttonHandler.up) {
    buttonHandler['up']();
  } else if (event.keyCode === 39 && buttonHandler.select) {
    buttonHandler['select']();
  } else if (event.keyCode === 40 && buttonHandler.down) {
    buttonHandler['down']();
  }
});
