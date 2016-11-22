requirejs.config({
   config: {
    text: {
      useXhr: function (url, protocol, hostname, port) {
        return true;
      }
    }
   }
});

requirejs(['mediator', 'examples'], function(Mediator, Examples) {
  var editorElementIds = {
    'rocky': 'rocky-editor',
    'pkjs': 'pkjs-editor',
    'console': 'console-editor'
  };
  var editors = {};
  for (var key in editorElementIds) {
    var elementId = editorElementIds[key];
    var editor = ace.edit(elementId);
    editors[key] = editor;
    editor.setTheme("ace/theme/monokai");
    if (key === 'console') {
      editors['console'].setReadOnly(true);
      editor.getSession().setMode("ace/mode/plain_text");
      editor.commands.addCommand({
        name: 'Clear',
        bindKey: {
          win: 'Ctrl-K',
          mac: 'Command-K'
        },
        exec: function(ed) {
          ed.setValue('');
        },
        // false if this command should not apply in readOnly mode:
        readOnly: true
      });

    } else {
      editor.getSession().setMode("ace/mode/javascript");
      ['Return', 'S'].forEach(function(key) {
        editor.commands.addCommand({
          name: 'Run',
          bindKey: {
            win: 'Ctrl-' + key,
            mac: 'Command-' + key
          },
          exec: reloadSimulators,
          // false if this command should not apply in readOnly mode:
          readOnly: true
        });
      });
    }
  }

  var mediator = new Mediator();
  mediator.addWindowEventListeners(window);

  var platforms = ['aplite', 'basalt', 'chalk', 'diorite', 'emery'];
  var simulatorsRowDiv = document.getElementById('simulators-row');
  for (var i = 0; i < platforms.length; i++) {
    var platform = platforms[i];
    mediator.setupIFrame(platform, function(createdIFrame, options) {
      var div = document.createElement('div');
      div.className = 'col-md-2 rocky-column';
      createdIFrame.id = platform;
      createdIFrame.width = options.size.width;
      createdIFrame.height = options.size.height;
      createdIFrame.style.cssText = 'border: none;';

      div.appendChild(createdIFrame);
      simulatorsRowDiv.appendChild(div);
    });
  }

  // Pick from which platform to use for I/O:
  mediator.selectPlatform('basalt');

  mediator.setHandlers({
    consoleMessage: handleConsoleMessage
  });

  var consoleEditor = editors['console'];
  consoleEditor.renderer.setShowGutter(false);
  var consoleClearButton = document.getElementById('console-clear-button');
  consoleClearButton.onclick = function() {
    consoleEditor.setValue('');
  };

  var runButton = document.getElementById('run-button');
  runButton.onclick = reloadSimulators;


  var form = document.getElementById("controls-form");
  form.addEventListener('submit', function(e) {
    e.preventDefault();
  });

  var timestampInput = document.getElementById("timestamp-input");
  timestampInput.addEventListener('change', function(e) {
    mediator.setTime(Number(e.target.value) * 1000);
  });

  var timezoneSlider = document.getElementById("timezone-offset-input");
  var timezoneSpan = document.getElementById("timezone-offset-span");
  var timezoneSliderOnChange = function() {
    var offset = timezoneSlider.value;
    mediator.setTimezoneOffset(offset);
    var sign;
    if (offset > 0) {
      sign = '+';
    } else if (offset < 0) {
      sign = '-';
    } else {
      sign = '';
    }
    var offsetMinutes = (offset % 60);
    var absOffsetHours = Math.abs((offset - offsetMinutes) / 60);
    var gmtText = 'GMT ' + sign + absOffsetHours;
    if (offsetMinutes) {
      var absOffsetMinutes = Math.abs(offsetMinutes);
      gmtText += ':' + (absOffsetMinutes < 10 ? '0' : '') + absOffsetMinutes;
    }
    timezoneSpan.innerText = gmtText;
  };
  timezoneSlider.addEventListener('change', timezoneSliderOnChange);
  timezoneSlider.addEventListener('input', timezoneSliderOnChange);

  // After loading the page, set the slider to the local TZ:
  var localTimezoneOffset = new Date().getTimezoneOffset();
  timezoneSlider.value = localTimezoneOffset;
  timezoneSliderOnChange();

  var time24hStyle = document.getElementById("24h-style-input");
  time24hStyle.addEventListener('change', function(e) {
    mediator.set24hStyle(e.target.checked);
  });
  time24hStyle.checked = mediator.is24hStyle();

  var pkjsConnectedCheckbox = document.getElementById("pkjs-connected-input");
  pkjsConnectedCheckbox.addEventListener('change', function(e) {
    mediator.pkjsSetConnected(e.target.checked);
  });

  function handleConsoleMessage(msg) {
    var prefix = (msg.options.isPkjs ? 'pkjs>  ' : 'rocky> ');
    consoleEditor.navigateFileEnd();
    consoleEditor.insert(prefix + msg.msg + '\n');
  }

  function stringToDataURI(s) {
    return URL.createObjectURL(new Blob([s], {type: 'text/javascript'}));
  }

  function reloadSimulators() {
    var sourceDataURIs = ['rocky', 'pkjs'].map(function(sourceEditorName) {
      var source = editors[sourceEditorName].getValue();
      return stringToDataURI(source);
    });
    mediator.load.apply(mediator, sourceDataURIs);
  }

  var emptyDataURI = 'data:text/plain;charset=utf-8;base64,'
  var examples = new Examples([
    {
      displayName: 'Hello, World!',
      rockySrcURL: '//raw.githubusercontent.com/martijnthe/pebble-rocky-hello-world/master/src/rocky/index.js',
      pkjsSrcURL: '//raw.githubusercontent.com/martijnthe/pebble-rocky-hello-world/master/src/pkjs/index.js'
    },
    {
      displayName: 'Watchface Tutorial Part 1',
      rockySrcURL: '//raw.githubusercontent.com/pebble-examples/rocky-watchface-tutorial-part1/master/src/rocky/index.js',
      pkjsSrcURL: '//raw.githubusercontent.com/pebble-examples/rocky-watchface-tutorial-part1/master/src/pkjs/index.js'
    },
    {
      displayName: 'Watchface Tutorial Part 2',
      rockySrcURL: '//raw.githubusercontent.com/pebble-examples/rocky-watchface-tutorial-part2/master/src/rocky/index.js',
      pkjsSrcURL: '//raw.githubusercontent.com/pebble-examples/rocky-watchface-tutorial-part2/master/src/pkjs/index.js'
    },
    {
      displayName: 'Simplicity',
      rockySrcURL: '//raw.githubusercontent.com/orviwan/simplicity-rockyjs/master/src/rocky/index.js',
      pkjsSrcURL: emptyDataURI
    },
    {
      displayName: 'Strider',
      rockySrcURL: '//raw.githubusercontent.com/orviwan/Strider-RockyJS/master/src/rocky/index.js',
      pkjsSrcURL: emptyDataURI
    },
    {
      displayName: 'Leco Weather',
      rockySrcURL: '//raw.githubusercontent.com/orviwan/rocky-leco-weather/master/src/rocky/index.js',
      pkjsSrcURL: '//raw.githubusercontent.com/orviwan/rocky-leco-weather/master/src/pkjs/index.js'
    }
  ]);
  var examplesSelectElem = document.getElementById('example-select');
  examples.bindToSelectElem(examplesSelectElem);
  examples.setChangeHandler(function(example) {
    var rockySrcRequire = 'text!' + example.rockySrcURL;
    var pkjsSrcRequire = 'text!' + example.pkjsSrcURL;
    require([rockySrcRequire, pkjsSrcRequire], function(rockySrcText, pkjsSrcText) {
      editors['rocky'].setValue(rockySrcText);
      editors['rocky'].navigateFileStart();
      editors['pkjs'].setValue(pkjsSrcText);
      editors['pkjs'].navigateFileStart();
      reloadSimulators();
    });
  });
  examples.setSelectedIndex(0);

  // TODO: handle window size changes
  // editor.resize();
});
