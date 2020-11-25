STATIC_FILES := $(shell ./scripts/ls-static-targets.sh)

# COMMANDS:

clean:
	rm -rf build

dev:
	./scripts/dev.sh

install:
	yarn install

serve:
	cd build/ && http-server -c-1

static-watch:
	./scripts/static-watch.sh

watch: static-watch

# TARGETS:

$(STATIC_FILES): build/% : src/static/%
	mkdir -p $(@D)
	cp $< $@

all: build build/index.css static

build:
	mkdir build

build/index.css: src/css/index.css
	yarn postcss $< -o $@

static: $(STATIC_FILES)
