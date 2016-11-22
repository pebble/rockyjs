define(function() {
  var Mediator = function() {
    var iframeByPlatform = {};
    var selectedPlatform;
    var selectedContentWindow;
    var delegateHandlers = {};

    function getSizeForPlatform(platform) {
      // FIXME: Add a helper function that's a property of RockySimulator constructor?
      return { width: 144, height: 168 };
    }

    function onConsole(e) {
      if (e.source !== selectedContentWindow) {
        // TODO: actually capture ALL logs for each simulator and buffer them
        // so we can toggle between them.
        return;
      }
      var prefix = (e.data.options.isPkjs ? 'pkjs>  ' : 'rocky> '); 
      console[e.data.type](prefix + e.data.msg);

      if (delegateHandlers.consoleMessage) {
        delegateHandlers.consoleMessage(e.data);
      }
    }

    function onIFrameMessage(e) {
      var dispatch = {
        console: onConsole,
      };
      var handler = dispatch[e.data.cmd];
      if (!handler) {
        throw new Error('Unknown IFrame cmd: ' + e.data.cmd);
      }
      handler(e);
    };

    this.addWindowEventListeners = function(window) {
      this.window = window;
      window.addEventListener('message', onIFrameMessage);
    };

    this.selectPlatform = function(platform) {
      selectedPlatform = platform;
      selectedContentWindow = iframeByPlatform[platform].contentWindow;
    };

    this.setHandlers = function(handlers) {
      delegateHandlers = handlers;
    };

    this.load = function(rockySrcURL, pkjsSrcURL) {
      for (var platform in iframeByPlatform) {
        var iframe = iframeByPlatform[platform];
        var urlStr = 'simulator-iframe.html?';
        urlStr += 'rocky-src=' + rockySrcURL + '&';
        urlStr += 'pkjs-src=' + pkjsSrcURL + '&';
        urlStr += 'platform=' + platform;
        iframe.contentWindow.location = urlStr;
      }
    };

    this.setupIFrame = function setupIFrame(platform, handleCreatedIFrame) {
      var size = getSizeForPlatform(platform);
      var iframe = document.createElement('iframe');
      iframeByPlatform[platform] = iframe;
      handleCreatedIFrame(iframe, { size: size });
    };

    function doSimulatorFunctionCall(func, args) {
      var args = Array.prototype.slice.call(arguments, 1);
      for (var platform in iframeByPlatform) {
        var iframe = iframeByPlatform[platform];
        iframe.contentWindow.postMessage({
          cmd: 'simulatorFunctionCall',
          func: func,
          args: args
        }, window.location.origin);
      }
    }

    this.setTime = function(timestamp) {
      doSimulatorFunctionCall('setTime', timestamp);
    };

    this.setTimezoneOffset = function(offset) {
      doSimulatorFunctionCall('setTimezoneOffset', offset);
    };

    this.set24hStyle = function(_24hStyle) {
      is24hStyle = _24hStyle;
      doSimulatorFunctionCall('set24hStyle', _24hStyle);
    };

    var is24hStyle;
    this.is24hStyle = function() {
      return is24hStyle;
    };

    this.pkjsSetConnected = function(connected) {
      doSimulatorFunctionCall('pkjsSetConnected', connected);
    };
  };
  return Mediator;
});
