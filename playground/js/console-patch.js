define(function() {
  function ConsolePatch(console, targetWindow, options) {
    this.console = console;
    this.real = {}; 
    function sendLog(type) {
      var msg = Array.prototype.reduce.call(arguments, function(acc, val, idx) {
        // Skip 'type' arg:
        if (idx === 0) {
          return acc;
        }
        return acc + String(val)
      }, '');
      targetWindow.postMessage({
        cmd: 'console',
        type: type,
        msg: msg,
        options: options
      }, targetWindow.location.origin);
    } 
    var props = Object.getOwnPropertyNames(console);
    var supportedProps = ['log', 'warn', 'error']; 
    for (var i = 0; i < props.length; i++) {
      var propName = props[i];
      this.real[propName] = console[propName];
      if (supportedProps.indexOf(propName) === -1) {
        console[propName] = function() {
          sendLog.bind(this, 'error')(
            'console.' + propName + 'is not supported!');
        };
      } else {
        console[propName] = sendLog.bind(this, propName);
      }
    }
  }
  return ConsolePatch;
});
