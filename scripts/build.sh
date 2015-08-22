#!/bin/sh

echo "# Building selected.js"

echo "# Compiling Less..."
lessc selected/selected.less | cleancss -o dist/selected.min.css
echo "  --> dist/selected.min.css"
lessc selected/selected-light.less | cleancss -o dist/selected-light.min.css
echo "  --> dist/selected-light.min.css"

echo "# Minifying JS..."
cat selected/selected.js | uglifyjs -o dist/selected.min.js
echo "  --> dist/selected.min.js"

echo "# Done!"
