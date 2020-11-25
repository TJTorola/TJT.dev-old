STATIC_FILES := $(shell ./scripts/ls-static-targets.sh)

static: $(STATIC_FILES)

all: build build/index.css static

build:
	mkdir build

build/index.css: src/css/index.css
	yarn postcss $< -o $@

install:
	yarn install

$(STATIC_FILES): build/% : src/static/%
	mkdir -p $(@D)
	cp $< $@

static-watch:
	./scripts/static-watch.sh

watch: static-watch

serve:
	cd build/ && http-server -c-1

dev: serve watch

clean:
	rm -rf build
	rm -rf node_modules
