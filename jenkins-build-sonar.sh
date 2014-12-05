#!/bin/bash
npm install
grunt build:ci
grunt sonarRunner --login $1 --password $2