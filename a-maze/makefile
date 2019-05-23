SHELL := /bin/bash

static_files = $(shell find -L src/static -type f | sed -e 's/src\/static/www/g')

all: pkg $(static_files)

$(static_files) : www/% : src/static/%
	mkdir -p $(@D)
	cp $< $@

pkg: src/rust
	wasm-pack build --out-dir ../../www/pkg --out-name index --target web --debug

clean:
	rm -rf www
