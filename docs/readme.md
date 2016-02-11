# API Documentation

This document is split into two major sections:

- [Rocky.js Web API](#rockyjs-web-api) - The APIs used to create and update an instance of Rocky.js on a webpage.
- [Pebble API Compatibility](#pebble-api-compatibility) - A subset of Pebble's [C-style API](https://developer.pebble.com/docs/c) that can invoked through JavaScript.

## Rocky.js Web API

Rocky.js exposes a number of helper functions outside Pebble's C-Style API to help you work with Rocky.js in a browser based environment. 

### Rocky.bindCanvas(el)

The `bindCanvas` method creates an instance of Rocky.js, binds that instance to the supplied canvas element, then returns the instance to be used later in code. 

```js
// Create an instance of Rocky.js and bind it to a canvas with id="pebble"
var rocky = Rocky.bindCanvas(document.getElementById("pebble"));
```

### rocky.export_global_c_symbols()

Rocky exposes a [subset of Pebble's C-Style](#pebble-api-compatibility) that can be invoked with `rocky.c_api_function_name(...)`. The `export_global_c_symbols` adds all of the available methods from the C-Style API to the global namespace, removing the need to preface each API call with `rocky.`.

The following two examples demonstrate how `rocky.export_global_c_symbols()` affects a simple implementation:

```
// Calling a C-Style API without rocky.export_global_c_symbols
var rocky = Rocky.bindCanvas(document.getElementById("pebble"));

rocky.update_proc = function (ctx, bounds) {
    rocky.graphics_context_set_stroke_color(ctx, rocky.GColorRed);
    rocky.graphics_context_set_stroke_width(ctx, 10);
    rocky.graphics_draw_line(ctx, [50, 0], [100, 50]);
};

```

```
// Calling a C-Style API after rocky.export_global_c_symbols
var rocky = Rocky.bindCanvas(document.getElementById("pebble"));
rocky.export_global_c_symbols();

rocky.update_proc = function (ctx, bounds) {
    graphics_context_set_stroke_color(ctx, GColorRed);
    graphics_context_set_stroke_width(ctx, 10);
    graphics_draw_line(ctx, [50, 0], [100, 50]);
};
```

**NOTE 1:** This method should *only* be invoked in isolated playgrounds when there is a single instance of Rocky.

**NOTE 2:** Adding functions to the global namespace is generally considered an anti-pattern. The `export_global_c_symbols` may be invoked with an optional parameter (a namespace object) - when invoked in this way, the functions will be bound to the namespace object rather than the window.

### rocky.mark_dirty()

The `mark_dirty` method indicates to the specified instance of Rocky that `rocky.update_proc` should be invoked. 

```
var rocky = Rocky.bindCanvas(document.getElementById("pebble"));

var value = 0;

rocky.update_proc = function(ctx, bounds)  {
    graphics_context_set_stroke_color(ctx, GColorRed);
    graphics_context_set_stroke_width(ctx, 10);
    graphics_draw_line(ctx, [value, 0], [100, value]);
};

// Update value and mark the canvas as dirty 20/sec
setInterval(function() {
    value += 1;
    rocky.mark_dirty();
}, 1000 / 20);
```

### rocky.update_proc

Instances of Rocky.js include a property, `update_proc`, that will be invoked each time the instance is marked dirty with `rocky.mark_dirty`. The update_proc method should be set to a callback function with parameters: 

- `ctx`: A JavaScript version of the [GContext](https://developer.pebble.com/docs/c/Graphics/Graphics_Context/) object.
- `bounds`: A JavaScript version of the [GRect](https://developer.pebble.com/docs/c/Graphics/Graphics_Types/#GRect) object indicating the bounds of the virtual display.

See [rocky.mark_dirty](#rocky-mark_dirty) for sample usage.

## <a name="api-compatibility"></a>Pebble API Compatibility

Rocky.js currently implements a subset of Pebble's C-Style API. This section of the document outlines what methods have been implemented, as well as recommendations for how to manage some of the sections of the API that are not implemented.

<table class="table table-bordered table-compatibility">
    <thead><tr>
        <th>C API</th> 
        <th>Status</th>
        <th>Notes</th>
    </tr></thead>
    <tbody>

    <tr class="standard">
        <td>[Accelerometer Service](https://developer.pebble.com/docs/c/Foundation/Event_Service/AccelerometerService/)</td>
        <td>Standard JS/HTML5 API</td>
        <td>Use [Device Motion and Orientation APIs](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation)</td>
    </tr>
    <tr class="standard">
        <td>[Animation](https://developer.pebble.com/docs/c/User_Interface/Animation/)</td>
        <td>Standard JS/HTML5 API</td>
        <td>Use [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval)</td>
    </tr>
    <tr class="planned">
        <td>[AppFocus Service](https://developer.pebble.com/docs/c/Foundation/Event_Service/AppFocusService/)</td>
        <td>Planned</td>
        <td></td>
    </tr>
    <tr class="planned">
        <td>[AppMessage](https://developer.pebble.com/docs/c/Foundation/AppMessage/)</td>
        <td>Planned</td>
        <td>Will use [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) semantics</td>
    </tr>
    <tr class="not-planned">
        <td>[AppSync](https://developer.pebble.com/docs/c/Foundation/AppSync/)</td>
        <td>Not Currently Planned</td>
        <td></td>
    </tr>
    <tr class="standard">
        <td>[Battery Service](https://developer.pebble.com/docs/c/Foundation/Event_Service/BatteryStateService/)</td>
        <td>Standard JS/HTML5 API</td>
        <td>Use [BatteryStatus API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API)</td>
    </tr>
    <tr class="implemented">
        <td>[Bitmap](https://developer.pebble.com/docs/c/Graphics/Graphics_Types/#gbitmap_get_bytes_per_row)</td>
        <td>Implemented</td>
        <td></td>
    </tr>
    <tr class="implemented">
        <td>[BitmapSequence](https://developer.pebble.com/docs/c/Graphics/Graphics_Types/#gbitmap_sequence_create_with_resource)</td>
        <td>Implemented</td>
        <td></td>
    </tr>
    <tr class="not-planned">
        <td>[Clicks](https://developer.pebble.com/docs/c/User_Interface/Clicks/)</td>
        <td>Not Currently Planned</td>
        <td></td>
    </tr>
    <tr class="standard">
        <td>[Compass Service](https://developer.pebble.com/docs/c/Foundation/Event_Service/CompassService/)</td>
        <td>Standard JS/HTML5 API</td>
        <td>Use [Device Motion and Orientation APIs](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation)</td>
    </tr>
    <tr class="planned">
        <td>[Connection Service](https://developer.pebble.com/docs/c/Foundation/Event_Service/ConnectionService/)</td>
        <td>Planned</td>
        <td></td>
    </tr>
    <tr class="not-planned">
        <td>[DataLogging](https://developer.pebble.com/docs/c/Foundation/DataLogging/)</td>
        <td>Not Currently Planned</td>
        <td></td>
    </tr>
    <tr class="standard">
        <td>Date/Time</td>
        <td>Standard JS/HTML5 API</td>
        <td>Use [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)</td>
    </tr>
    <tr class="standard">
        <td>[Dictation](https://developer.pebble.com/docs/c/Foundation/Dictation/)</td>
        <td>Standard JS/HTML5 API</td>
        <td>Use [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)</td>
    </tr>
    <tr class="implemented">
        <td>[DrawCommand](https://developer.pebble.com/docs/c/Graphics/Draw_Commands/)</td>
        <td>Implemented</td>
        <td></td>
    </tr>
    <tr class="implemented">
        <td>[Drawing Paths](https://developer.pebble.com/docs/c/Graphics/Drawing_Paths/)</td>
        <td>Implemented</td>
        <td></td>
    </tr>
    <tr class="implemented">
        <td>[Drawing Primitives](https://developer.pebble.com/docs/c/Graphics/Drawing_Primitives/)</td>
        <td>Implemented</td>
        <td>Framebuffer APIs will not be part of Rocky.js</td>
    </tr>
    <tr class="implemented">
        <td>[Drawing Text](https://developer.pebble.com/docs/c/Graphics/Drawing_Text/)</td>
        <td>Implemented</td>
        <td></td>
    </tr>
    <tr class="implemented">
        <td>[Fonts](https://developer.pebble.com/docs/c/Graphics/Fonts/)</td>
        <td>Implemented</td>
        <td></td>
    </tr>
    <tr class="implemented">
        <td>[Graphics Context](https://developer.pebble.com/docs/c/Graphics/Graphics_Context/)</td>
        <td>Implemented</td>
        <td></td>
    </tr>
    <tr class="implemented">
        <td>[Graphics Types](https://developer.pebble.com/docs/c/Graphics/Graphics_Types/)</td>
        <td>Implemented</td>
        <td></td>
    </tr>
    <tr class="not-planned">
        <td>[Heap](https://developer.pebble.com/docs/c/Foundation/Memory_Management/)</td>
        <td>Not Currently Planned</td>
        <td>Still investigating memory management</td>
    </tr>
    <tr class="not-planned">
        <td>[Launch Reason](https://developer.pebble.com/docs/c/Foundation/Launch_Reason/)</td>
        <td>Not Currently Planned</td>
        <td></td>
    </tr>
    <tr class="not-planned">
        <td>[Layer](https://developer.pebble.com/docs/c/User_Interface/Layers/)</td>
        <td>Not Currently Planned</td>
        <td></td>
    </tr>
    <tr class="standard">
        <td>[Logging](https://developer.pebble.com/docs/c/Foundation/Logging/)</td>
        <td>Standard JS/HTML5 API</td>
        <td>Use [console.log](https://developer.mozilla.org/en-US/docs/Web/API/Console/log)</td>
    </tr>
    <tr class="planned">
        <td>[Light](https://developer.pebble.com/docs/c/User_Interface/Light/)</td>
        <td>Planned</td>
        <td></td>
    </tr>

    <tr class="standard">
        <td>[Persistant Storage](https://developer.pebble.com/docs/c/Foundation/Storage/)</td>
        <td>Standard JS/HTML5 API</td>
        <td>Use [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)</td>
    </tr>
    <tr class="not-planned">
        <td>[SmartStraps](https://developer.pebble.com/docs/c/Smartstrap/)</td>
        <td>Not Currently Planned</td>
        <td></td>
    </tr>
    <tr class="standard">
        <td>[TickService](https://developer.pebble.com/docs/c/Foundation/Event_Service/TickTimerService/)</td>
        <td>Standard JS/HTML5 API</td>
        <td>Use [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval)</td>
    </tr>
    <tr class="standard">
        <td>[Timer](https://developer.pebble.com/docs/c/Foundation/Timer/)</td>
        <td>Standard JS/HTML5 API</td>
        <td>Use [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval), and [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout)</td>
    </tr>
    <tr class="standard">
        <td>[Vibes](https://developer.pebble.com/docs/c/User_Interface/Vibes/)</td>
        <td>Standard JS/HTML5 API</td>
        <td>Use [Navigator.vibrate](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate)</td>
    </tr>
    <tr class="not-planned">
        <td>[Wakeup](https://developer.pebble.com/docs/c/Foundation/Wakeup/)</td>
        <td>Not Currently Planned</td>
        <td></td>
    </tr>
    <tr class="planned">
        <td>[WatchInfo](https://developer.pebble.com/docs/c/Foundation/WatchInfo/)</td>
        <td>Planned</td>
        <td></td>
    </tr>
    <tr class="not-planned">
        <td>[Window](https://developer.pebble.com/docs/c/User_Interface/Window/)</td>
        <td>Not Currently Planned</td>
        <td></td>
    </tr>
    <tr class="not-planned">
        <td>[WindowStack](https://developer.pebble.com/docs/c/User_Interface/Window_Stack/)</td>
        <td>Not Currently Planned</td>
        <td>Or similar functionality</td>
    </tr>
    <tr class="not-planned">
        <td>[Worker](https://developer.pebble.com/docs/c/Worker/)</td>
        <td>Not Currently Planned</td>
        <td></td>
    </tr>
    </tbody>
</table>
