SHELL := /bin/bash
MAKE := ${MAKE} --no-print-directory

STATIC_FILES := $(shell find -L src/static -type f | sed -e 's/src\/static/build/g')

static: $(STATIC_FILES)

all: build static

build:
	mkdir build

install:
	yarn install

$(STATIC_FILES): build/% : src/static/%
	mkdir -p $(@D)
	cp $< $@

static-watch:
	${SHELL} ./scripts/static-watch.sh

watch:
	${MAKE} static-watch

serve: all
	${MAKE} && cd build/ && http-server -c-1

dev: serve watch

clean:
	rm -rf build
	rm -rf node_modules
