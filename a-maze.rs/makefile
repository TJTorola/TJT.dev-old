SHELL := /bin/bash
MAKE := ${MAKE} --no-print-directory

STATIC_FILES := $(shell find -L src/static -type f | sed -e 's/src\/static/www/g')

all: www/pkg/* $(STATIC_FILES)

$(STATIC_FILES) : www/% : src/static/%
	mkdir -p $(@D)
	cp $< $@

www/pkg/* : src/rust/* Cargo.toml
	cargo build --target wasm32-unknown-unknown
	wasm-bindgen target/wasm32-unknown-unknown/debug/a_maze.wasm \
			--no-modules \
			--no-modules-global pkg \
			--no-typescript \
			--out-dir www/pkg 

dev:
	${MAKE} serve & ${MAKE} watch

clean:
	rm -rf www

serve:
	${MAKE} && cd www/ && http-server -c-1

watch:
	${SHELL} ./scripts/watch.sh
