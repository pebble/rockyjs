requirejs.config({
});

requirejs(['console-patch'], function(ConsolePatch) {
  function getSizeForPlatform(platform) {
    // FIXME: Add a helper function that's a property of RockySimulator constructor?
    return { width: 144, height: 168 };
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
  }

  // Forward our own logs to the parent window:
  var consolePatch = new ConsolePatch(console, window.parent, {isPkjs: false});
  window.addEventListener('message', function(e) {
    if (e.data.cmd === 'console') {
      // Listen for console logs from pkjs child iframe and fwd to our parent:
      window.parent.postMessage({
        cmd: 'console',
        type: e.data.type,
        msg: e.data.msg,
        options: e.data.options
      }, window.parent.location.origin);
    } else if (e.data.cmd === 'simulatorFunctionCall') {
      rockySimulator[e.data.func].apply(rockySimulator, e.data.args);
    }
  });

  var platform = getQueryVariable('platform');

  var body = document.getElementsByTagName('body');
  var canvas = document.getElementById('pebble');
  var size = getSizeForPlatform(platform);
  canvas.width = size.width;
  canvas.height = size.height;
  body.width = size.width;
  body.height = size.height;

  // Create a new simulator and bind it to the canvas:
  var rockySimulator = new RockySimulator({
    canvas: canvas,
    src: {
      rocky: getQueryVariable('rocky-src'),
      pkjs: getQueryVariable('pkjs-src'),
      pkjsPostLoad: ['js/require.js', 'js/pkjs-postload.js']
    },
    // We start the pkjs code from pkjs-postload.js 
    pkjsRunFunctionName: 'PkjsRun'
  });
});