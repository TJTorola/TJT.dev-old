#!/usr/bin/env bash

make --no-print-directory all;
make --no-print-directory watch & make --no-print-directory serve;
