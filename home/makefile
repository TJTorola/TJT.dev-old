SHELL := /bin/bash

all: $(static_files)

$(static_files) : build/% : src/static/%
	mkdir -p $(@D)
	cp $< $@

