[![Build Status](https://travis-ci.org/pebble/rockyjs.svg?branch=master)](https://travis-ci.com/pebble/rockyjs)

# Rocky.js

Rocky.js is a version of Pebble's firmware that has been [transpiled](https://en.wikipedia.org/wiki/Source-to-source_compiler) to JavaScript, and that can be attached to an HTML canvas. This is our first step towards exploring the possibility of including a JavaScript runtime in our operating system.

<a class="jsbin-embed" href="///jsbin.com/jucetom/embed?js,output&height=300px">Interactive Rocky.js example on jsbin.com</a>
<script src="https://static.jsbin.com/js/embed.min.js?3.35.9"></script>

[More examples in this repository](examples/)

### That's a weird first step!

You're right! Typically when people want to include a JavaScript runtime on some hardware they begin by evaluating various JavaScript runtimes (or writing their own), and getting one of those running on their hardware.

We're doing this in parallel - but by first creating (and publishing) a transpiled version of our firmware that can be run in the browser, we're enabling ourselves, and the wonderful JavaScript community, to rapidly experiment with what things could look like when JavaScript is a first-class language on our platform.

We're interested in seeing how you approach JavaScript watchface development, as well as how you interact with (and wrap) our existing [C-style API](http://developer.pebble.com/docs/c/) to make it look and feel more like JavaScript.

### What about Pebble.js?

If you're familiar with Pebble and JavaScript, there's a good chance you may also be familiar with [Pebble.js](https://developer.pebble.com/docs/pebblejs/).

Pebble.js allows you to write your *application logic* in JavaScript (which is executed on the phone with [PebbleKit JS](https://developer.pebble.com/docs/js/)). Pebble.js also includes a significant amount of C and JavaScript code that interacts with your application logic and passes messages between the phone (where the application logic takes place), and the watchapp (where the UI is displayed, and events occur).

The goal of Rocky.js is to include a JS runtime in Pebble's firmware, which would allow us to run JavaScript applications *directly on the watch*.

# Contributing

We're interested in seeing what kinds of tools developers create when they have access to a browser-based and pixel-perfect Pebble, as well as how developers wrap our C-style APIs to make them more JavaScript friendly!

If you create something interesting with Rocky.js, add it to the examples folder, submit a PR, and we'll take a look. This is a great opportunity to *directly* influence how Pebble approaches JavaScript documentation and API design.

## Learn More

If you're interested in staying up to date with our Rocky.js development efforts, you can subscribe to our [JSApps newsletter](http://pbl.io/jsapps), and follow [@pebbledev](https://twitter.com/pebbledev) (or simply star this repo).

# Development

## Dependencies

Rocky.js uses [Grunt](http://gruntjs.com) as a build system and [npm](https://www.npmjs.com) for dependency management. If you are unfamiliar with these technologies, we recommend you read their respective guides.

## Getting Started 

To begin working with the Rocky.js repository, run the following commands:

```bash
> git clone git@github.com:pebble/rockyjs.git
> cd rockyjs
> npm install -g grunt-cli
> npm install
> grunt
```

The default build task (`grunt`) will combine all JavaScript, render markdown, and replace file references. 

## Rocky.js API / Functionality

One of the main goals of Rocky.js is to better understand how JavaScript developers approach the Pebble API, and Pebble development in general. 

The initial version of Rocky.js uses Pebble's existing C-style API and JavaScript syntax, though at the moment not *all* APIs are implemented.

See [Rocky Documentation](docs/) for more details.

## Working with the Examples

The [examples](examples/) are designed to be run directly from the file system without needing to build them, and demonstrate some of the things that can be accomplished with the current implementation.

More information about each example can be found on the example's webpage.

# Transpiling the Pebble Firmware

**NOTE:** If you are *not* a Pebble employee, you should ignore this section of the README. If you would like to be a Pebble employee, take a look at [Pebble's jobs page](https://pebble.com/jobs).

If you have access to the [Pebble firmware repository](https://github.com/pebble/tintin), 
make sure you build applib with `-target emscripten`.
The default Grunt task of this repository will replace the file `src/transpiled.js` with 
`${tintin_root}/build/applib/applib-targets/emscripten/applib.js` if it exists. 
Run `grunt newer:uglify:applib --verbose` to debug this step if necessary (be aware that the minification task might take a while).

# LICENSE

Rocky.js is licensed under the [PEBBLE JAVASCRIPT LICENSE AGREEMENT](https://github.com/pebble/rockyjs/blob/master/LICENSE).
