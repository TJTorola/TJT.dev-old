SHELL := /bin/bash
MAKE := ${MAKE} --no-print-directory

STATIC_FILES := $(shell find -L src/static -type f | sed -e 's/src\/static/build/g')

all: build $(STATIC_FILES)

build:
	mkdir build

install:
	yarn install

$(STATIC_FILES) : build/% : src/static/%
	mkdir -p $(@D)
	cp $< $@

watch:
	${SHELL} ./scripts/watch.sh

serve: all
	${MAKE} && cd build/ && http-server -c-1

dev:
	${MAKE} serve & ${MAKE} watch

clean:
	rm -rf build
	rm -rf node_modules
