#!/bin/sh
echo "" > tictoc.js
cat js/rocky-WebAPIBinding.js >> tictoc.js
cat js/rocky-CanvasRenderingContext2D.js >> tictoc.js
cat js/rocky-colorstyle.js >> tictoc.js
cat js/rocky-Path2D.js >> tictoc.js
cat js/rocky-WatchfaceHelper.js >> tictoc.js
cat js/rocky-TickService.js >> tictoc.js

echo "var rocky = new Rocky.WebAPIBinding();" >> tictoc.js
cat js/tictoc.js >> tictoc.js

cat tictoc.js | pbcopy