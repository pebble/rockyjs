# Examples

There are [several examples](examples/) that demonstrate how RockyJS could be used.

# Development

RockyJS uses [Grunt](http://gruntjs.com) as a build system and [npm](https://www.npmjs.com) for dependency management.
If you are unfamiliar with these technologies, we recommend you read their respective guides. 
Otherwise, `npm install -g grunt-cli` followed by `npm install` should do the trick.

All examples should work directly from the file system without building them. 
The default task (simply run `grunt`) will combine all JavaScript, render markdown, and replace file references.

## Transpile Pebble Firmware

If you have access to the [Pebble firmware repository](https://github.com/pebble/tintin), 
make sure you build applib with `-target emscripten`.
The default Grunt task of this repository will replace the file `src/transpiled.js` with 
`${tintin_root}/build/applib/applib-targets/emscripten/applib.js` if it exists. 
Run `grunt newer:uglify:applib --verbose` to debug this step if necessary (be aware that the minification task might take a while).