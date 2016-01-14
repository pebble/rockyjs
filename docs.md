# API Documentation

This document is split into two major sections:

- [RockyJS Web API](#rockyjs-web-api) - The APIs used to create and update an instance of RockyJS on a webpage.
- [RockyJS Pebble API](#rockyjs-pebble-api) - A subset of Pebble's [C-style API](https://developer.pebble.com/docs/c) that can invoked through JavaScript.

## RockyJS Web API

RockyJS exposes a number of helper functions outside Pebble's C-Style API to help you work with RockyJS in a browser based environment. 

### Rocky.bindCanvas(el)

The `bindCanvas` method creates an instance of RockyJS, binds that instance to the supplied canvas element, then returns the instance to be used later in code. 

```js
// Create an instance of RockyJS and bind it to a canvas with id="pebble"
var rocky = Rocky.bindCanvas(document.getElementById("pebble"));
```

### rocky.export_global_c_symbols()

The `export_global_c_symbos` will pollute the global namespace with the subset of available APIs calls from Pebble's C-style API. This allows you to invoke (the implemented) functions from Pebble's C API without having to preface every call with `rocky.functionName`.

This method should typically not be used if there are multiple instances of RockyJS on the same page. See the two exampls below for 

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

```
// Calling a C-Style API without rocky.export_global_c_symbols
var rocky = Rocky.bindCanvas(document.getElementById("pebble"));

rocky.update_proc = function (ctx, bounds) {
    rocky.graphics_context_set_stroke_color(ctx, rocky.GColorRed);
    rocky.graphics_context_set_stroke_width(ctx, 10);
    rocky.graphics_draw_line(ctx, [50, 0], [100, 50]);
};

```

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

Instances of RockyJS include a property, `update_proc`, that will be invoked each time the instance is marked dirty with `rocky.mark_dirty`. The update_proc method should be set to a callback function with parameters: 

- ctx: A JavaScript version of the [GContext](https://developer.pebble.com/docs/c/Graphics/Graphics_Context/) object.
- bounds: A JavaScript version of the [GRect](https://developer.pebble.com/docs/c/Graphics/Graphics_Types/#GRect) object indicating the bounds of the virtual display.

See [rocky.mark_dirty](#rocky_mark_dirty) for sample usage.

## RockyJS Pebble API

RockyJS currently implements a subset of Pebble's C-Style API. This section of the document outlines what methods have been implemented, as well as recommendations for how to manage some of the sections of the API that are not implemented.

### Implemented APIs

The following APIs have already been implemented in RockyJS:

- [Graphics](https://developer.pebble.com/docs/c/Graphics/) (partial)
    + [Basic Types](https://developer.pebble.com/docs/c/Graphics/Graphics_Types/):
        * GColor (partial)
        * GPoint
        * GRect
    + [GContext](https://developer.pebble.com/docs/c/Graphics/Graphics_Context/)
    + [Drawing Primitives](https://developer.pebble.com/docs/c/Graphics/Drawing_Primitives/)
    + [Drawing Text](https://developer.pebble.com/docs/c/Graphics/Drawing_Text/)

### APIs replaced with standard JavaScript APIs

The following APIs have had their functionality replaced with existing JavaScript APIs:

-  Handling Date/Time: [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [Accelerometer](https://developer.pebble.com/docs/c/Foundation/Event_Service/AccelerometerService/) & [Compass](https://developer.pebble.com/docs/c/Foundation/Event_Service/CompassService/): [Device Motion and Orientation APIs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [Tick Service](https://developer.pebble.com/docs/c/Foundation/Event_Service/TickTimerService/): [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval)
- [Timer](https://developer.pebble.com/docs/c/Foundation/Timer/): [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval), [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout)
- [Logging](https://developer.pebble.com/docs/c/Foundation/Logging/): [console.log](https://developer.mozilla.org/en-US/docs/Web/API/Console/log)
- [Dictation Service](https://developer.pebble.com/docs/c/Foundation/Dictation/): [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Persistant Storage](https://developer.pebble.com/docs/c/Foundation/Storage/): [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Animation](https://developer.pebble.com/docs/c/User_Interface/Animation/): [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval), [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout)

### Planned APIs 

The following APIs are on the roadmap for RockyJS, but have not yet been implemented:

- [AppFocus](https://developer.pebble.com/docs/c/Foundation/Event_Service/AppFocusService/)
- [AppMessage](https://developer.pebble.com/docs/c/Foundation/AppMessage/) + [Dictionary](https://developer.pebble.com/docs/c/Foundation/Dictionary/) - *will be replaced with [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) semantics*.
- [Battery Service](https://developer.pebble.com/docs/c/Foundation/Event_Service/BatteryStateService/)
- [Bitmap](https://developer.pebble.com/docs/c/Graphics/Graphics_Types/#gbitmap_get_bytes_per_row) / [BitmapSequence](https://developer.pebble.com/docs/c/Graphics/Graphics_Types/#gbitmap_sequence_create_with_resource)
- [ConnectionService](https://developer.pebble.com/docs/c/Foundation/Event_Service/ConnectionService/)
- [DrawCommand](https://developer.pebble.com/docs/c/Graphics/Draw_Commands/)
- [Fonts](https://developer.pebble.com/docs/c/Graphics/Fonts/)
- [Frame Buffer](https://developer.pebble.com/docs/c/Graphics/Drawing_Primitives/#graphics_capture_frame_buffer)
- [GPath](https://developer.pebble.com/docs/c/Graphics/Drawing_Paths/#GPath)
- [Light](https://developer.pebble.com/docs/c/User_Interface/Light/)
- [WatchInfo](https://developer.pebble.com/docs/c/Foundation/WatchInfo/)
- [Layer](https://developer.pebble.com/docs/c/User_Interface/Layers/)/[Window](https://developer.pebble.com/docs/c/User_Interface/Window/)/[WindowStack](https://developer.pebble.com/docs/c/User_Interface/Window_Stack/)
- [Vibes](https://developer.pebble.com/docs/c/User_Interface/Vibes/)

### Unplanned APIs

The following APIs are not currently on the roadmap for RockyJS:

- [Worker](https://developer.pebble.com/docs/c/Worker/)
- [Clicks](https://developer.pebble.com/docs/c/User_Interface/Clicks/)
- [DataLogging](https://developer.pebble.com/docs/c/Foundation/DataLogging/)
- [Memory Management / Heap](https://developer.pebble.com/docs/c/Foundation/Memory_Management/)
- [SmartStraps](https://developer.pebble.com/docs/c/Smartstrap/)
- [Wakeup](https://developer.pebble.com/docs/c/Foundation/Wakeup/) / [Launch Reason](https://developer.pebble.com/docs/c/Foundation/Launch_Reason/)

