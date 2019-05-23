SHELL := /bin/bash
MAKE := ${MAKE} --no-print-directory

PKG_FILES := www/pkg/index_bg.d.ts
PKG_FILES += www/pkg/index_bg.wasm
PKG_FILES += www/pkg/index.d.ts
PKG_FILES += www/pkg/index.js
PKG_FILES += www/pkg/LICENSE.txt
PKG_FILES += www/pkg/package.json
STATIC_FILES := $(shell find -L src/static -type f | sed -e 's/src\/static/www/g')

all: ${PKG_FILES} $(STATIC_FILES)

$(STATIC_FILES) : www/% : src/static/%
	mkdir -p $(@D)
	cp $< $@

${PKG_FILES} : src/rust/*.rs
	wasm-pack build --out-dir www/pkg --out-name index --target web --debug

dev:
	${MAKE} serve & ${MAKE} watch

clean:
	rm -rf www

serve:
	${MAKE} && cd www/ && http-server -c-1

watch:
	${SHELL} ./scripts/watch.sh
