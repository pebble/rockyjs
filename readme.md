[![Build Status](https://travis-ci.com/pebble/rockyjs.svg?token=u4rPSjFthB3eVsUfx8As&branch=master)](https://travis-ci.com/pebble/rockyjs)

# RockyJS

At [Pebble](https://pebble.com), we are currently exploring the possibility of including a JavaScript runtime in our OS and enabling developers to create JavaScript apps that can run natively on the watch.

To date, we have [transpiled](https://en.wikipedia.org/wiki/Source-to-source_compiler) our firmware to JavaScript, and enabled it to be attached to a canvas. This allows developers to play with a hybrid C/JavaScript Pebble API - using JavaScript syntax, and loose typing with Pebble's existing [C functionality](https://developer.getpebble.com/docs/c/). 

## Contributing

JavaScript is somewhat new territory for Pebble, and we're excited to hear what you have to say about this project. We are planning to release early versions of RockyJS so we can easily explore what native JavaScript APIs for Pebble could look like, as well as gather feedback from the JavaScript community and incorporate it into our work.

We're interested in seeing what kinds of tools developers create when they have access to a browser-based and pixel-perfect Pebble, as well as how developers wrap our C-style APIs to make them more JavaScript friendly!

If you create something interesting with RockyJS, submit a PR with the example (or a link to your example) and we'll take a look. This is a great opportunity to *directly* influence how Pebble approaches JavaScript documentation and API design.

## Learn More

If you're interested in staying up to date with our RockyJS development efforts, you can subscribe to our [JSApps newsletter](pbl.io/jsapps), and follow [@pebbledev](https://twitter.com/pebbledev) (or simply star this repo).

# Development

## Dependencies

RockyJS uses [Grunt](http://gruntjs.com) as a build system and [npm](https://www.npmjs.com) for dependency management. If you are unfamiliar with these technologies, we recommend you read their respective guides.

## Getting Started 

To begin working with the RockyJS repository, run the following commands:

```bash
> git clone git@github.com:pebble/rockyjs.git
> cd rockyjs
> npm install -g grunt-cli
> npm install
> grunt
```

The default build task (`grunt`) will combine all JavaScript, render markdown, and replace file references. 

## Working with the Examples

The [examples](examples/) are designed to be run directly from the file system without needing to build them, and demonstrate some of the things that can be accomplished with the current implementation.

More information about each example can be found on the example's webpage.

# Miscellaneous

## A Note on RockyJS and Pebble.js

If you're familiar with Pebble and JavaScript, you may also be familiar with [Pebble.js](https://developer.getpebble.com/docs/pebblejs). 

It's worth noting that RockyJS is significantly different from Pebble.js. Pebble.js allows you to write your *application logic* in JavaScript, and interfaces with a C application (that the developer does not modify) through [AppMessages](https://developer.getpebble.com/docs/c/Foundation/AppMessage/). The AppMessages indicate what to render on the watch, and pass event information such as button presses, accelerometer data, etc between the C app and the JS logic.

## Transpiling the Pebble Firmware

**NOTE:** If you are *not* a Pebble employee, you should ignore this section of the README.

If you have access to the [Pebble firmware repository](https://github.com/pebble/tintin), 
make sure you build applib with `-target emscripten`.
The default Grunt task of this repository will replace the file `src/transpiled.js` with 
`${tintin_root}/build/applib/applib-targets/emscripten/applib.js` if it exists. 
Run `grunt newer:uglify:applib --verbose` to debug this step if necessary (be aware that the minification task might take a while).
