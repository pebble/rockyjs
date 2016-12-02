[![Build Status](https://travis-ci.org/pebble/rockyjs.svg?branch=master)](https://travis-ci.org/pebble/rockyjs)

# Rocky.js

Rocky.js is Pebble's JavaScript framework for building watchfaces for Pebble smartwatches. As of [Pebble SDK 4.1](https://developer.pebble.com/blog/2016/08/15/introducing-rockyjs-watchfaces/), Rocky.js has been integrated into the [Pebble SDK](https://developer.pebble.com/sdk/) as well as [CloudPebble](https://cloudpebble.net/). As such, Rocky.js can officially be used to create and publish watchfaces written in JavaScript!

Check out the [Rocky.js guides](https://developer.pebble.com/tutorials/js-watchface-tutorial/part1/) or [Rocky.js API reference](https://developer.pebble.com/docs/rockyjs/) if you want to learn more about developing with Rocky.js.

While this repository used to serve as the breeding ground for Rocky.js, it has now become the home of the [Rocky.js Playground](http://pebble.github.io/rockyjs/playground/) and the simulator library the Playground is built on.

## Rocky.js Playground

The [Rocky.js Playground](http://pebble.github.io/rockyjs/playground/) is an in-browser "scratchpad" for Rocky.js development. It features simulated Pebble smartwatches to run your app as you develop it, all running locally in your browser:

[<img src="img/rockyjs-playground-screenshot.png" alt="Rocky.js Playground Screenshot" style="width: 850px; box-shadow: 0px 2px 5px 0px #C4C4C4; margin: 20px 0;"/>](http://pebble.github.io/rockyjs/playground/)

### Rocky.js Simulator

<!-- build:template
<script type="text/javascript" src="<%= rockyjs_path %>"></script>
/build -->
<canvas id="pebble" class="rocky" width="168" height="144"></canvas>
<script type="text/javascript">
// Create a new simulator and bind it to the canvas:
var rockySimulator = new RockySimulator({
	canvas: document.getElementById("pebble"),
	src: {
	  rocky: 'http://raw.githubusercontent.com/pebble-examples/rocky-watchface-tutorial-part1/master/src/rocky/index.js',
	  pkjs: 'http://raw.githubusercontent.com/pebble-examples/rocky-watchface-tutorial-part1/master/src/pkjs/index.js'
	}
});
</script>

The Rocky.js Simulator is a library that anyone can use to embed a simulated Pebble on a web page. The simplest way to embed a simulator takes just a few lines of code:

<pre>
&lt;canvas id="pebble" class="rocky" width="432" height="504"/&gt;
&lt;script type="text/javascript" src="http://pebble.github.io/rockyjs/dist/rocky-1.0.js"&gt;
&lt;script type="text/javascript"&gt;
  // Create a new simulator and bind it to the canvas:
  var rockySimulator =  new RockySimulator({
    canvas: document.getElementById("pebble"),
    src: {
      rocky: 'https://url.to/app/rocky/index.js',
      pkjs: 'https://url.to/app/pkjs/index.js'
    }
  });
&lt;script&gt;
</pre>

To learn more about the Rocky.js Simulator library and its API, check out [the documentation](docs/). We've also put together a [simple example page](/simple). For a more complex example of using the library, check out the [source code of the Rocky.js Playground](https://github.com/pebble/rockyjs/tree/master/playground).

### Learn More

If you're interested in staying up to date with our Rocky.js development efforts, join us on [Discord](http://discord.gg/aRUAYFN) and follow [@pebbledev](https://twitter.com/pebbledev) (or simply star this repository).

## History

In April 2016, we shipped a firmware update for our smartwatches that included an embedded [JerryScript](https://github.com/pebble/jerryscript) engine, and a JavaScript implementation of TicToc, our default watchface.

A little later that year, in August 2016, we [shipped the first Pebble SDK with Rocky.js](https://developer.pebble.com/blog/2016/08/15/introducing-rockyjs-watchfaces/) support.

This repository also contains some of our previous explorations with JavaScript, in which we transpiled our smartwatch firmware to JavaScript, and ran virtual smartwatches in the browser. You can still find the [outdated examples](examples-legacy/) and [deprecated documentation](docs-legacy/) in this repository.


## LICENSE

Rocky.js is licensed under the [PEBBLE JAVASCRIPT LICENSE AGREEMENT](https://github.com/pebble/rockyjs/blob/master/LICENSE).
