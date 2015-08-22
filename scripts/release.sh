#!/bin/sh

VERSION=`cat package.json | grep -oEi '[0-9]+.[0-9]+.[0-9]+' | head -1`

echo "Releasing selected.js v$VERSION"


echo "Building dist/"
scripts/build.sh

echo "Commiting dist/"
git add dist/
git commit -m "Distribution files for v$VERSION"
git push

echo "Git tag..."
git tag -a v$VERSION -m v$VERSION
git push --tags

echo "Npm..."
npm publish

echo "selected.js v$VERSION released!"
