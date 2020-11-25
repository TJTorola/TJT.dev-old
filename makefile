SHELL := /bin/bash
MAKE := ${MAKE} --no-print-directory

STATIC_FILES := $(shell find -L public -type f | sed -e 's/public/build/g')

all: build $(STATIC_FILES)

build:
	mkdir build

$(STATIC_FILES) : build/% : public/%
	mkdir -p $(@D)
	cp $< $@

serve: all
	${MAKE} && cd build/ && http-server -c-1

clean:
	rm -rf build
