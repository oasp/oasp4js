#!/bin/bash
if [ -z "$1" ]
  then
    echo "Please call ./releaseOasp versionToRelease"
    exit
fi
cd ../../
rm -rf ./dist
git clone https://github.com/oasp/oasp4js.git dist
cd dist
shopt -s extglob dotglob
rm -rf !(.git)
cd ..
gulp build:oasp
git add *
git commit -m "$1"
