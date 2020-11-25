#!/usr/bin/env bash

find -L src/static -type f | sed -e 's/src\/static/build/g';
