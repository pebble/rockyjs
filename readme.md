[![Build Status](https://travis-ci.org/pebble/rockyjs.svg?branch=master)](https://travis-ci.org/pebble/rockyjs)

# Rocky.js

Pebble is developing a framework for building embedded JavaScript watchapps. In April, we shipped a firmware update for our smartwatches that included an embedded [JerryScript](https://github.com/pebble/jerryscript) engine, and a JavaScript implementation of TicToc, our default watchface.

This repository currently contains some of our previous explorations with JavaScript, in which we transpiled our smartwatch firmware to JavaScript, and ran virtual smartwatches in the browser.

We will be updating this repository as we progress towards enabling developers to write embedded JavaScript applications.

## Next Steps

We are now in the process of implementing JavaScript APIs for our developers, and creating the tools and resources developers will need to create and test embedded JavaScript applications for Pebble smartwatches.

We are planning to release a preview SDK later this summer, with everything developers will need to create watchfaces written in JavaScript!

## APIs

Pebble is designing its JavaScript APIs with the existing JavaScript ecosystem in mind. Wherever possible, standard web APIs will be used - the display will be treated as a [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API), the compass and accelerometer will be queried with the [device orientation API](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation), and you'll interact with your PebbleKit JS code by passing messages in a manner similar to [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

### Learn More

If you're interested in staying up to date with our Rocky.js development efforts, you can subscribe to our [JSApps newsletter](http://pbl.io/jsapps), and follow [@pebbledev](https://twitter.com/pebbledev) (or simply star this repository).

## LICENSE

Rocky.js is licensed under the [PEBBLE JAVASCRIPT LICENSE AGREEMENT](https://github.com/pebble/rockyjs/blob/master/LICENSE).
