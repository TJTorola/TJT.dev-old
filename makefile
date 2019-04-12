SHELL := /bin/bash

static_files = $(shell find src/static -type f | sed -e 's/src\/static/build/g')

all: $(static_files)

$(static_files) : build/% : src/static/%
	mkdir -p $(@D)
	cp $< $@

clean:
	rm -rf build
