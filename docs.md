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

RockyJS currently implements a subset of Pebble's C-Style API - this section of the documentation indicates what sections of the API are implemented, and what should be used in place of sections of the API that are not implemented. 

