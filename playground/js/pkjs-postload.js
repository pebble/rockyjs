// This file is loaded inside a pkjs iframe, before the pkjs bootstrapper runs.
require.config({
  baseUrl: "js"
});

requirejs(['console-patch'], function(ConsolePatch) {
  // Redirect logs to parent.window (simulator-iframe.html):
  var consolePatch = new ConsolePatch(console, window.parent, {isPkjs: true});

  // Run pkjs app:
  PkjsRun(); 
});
