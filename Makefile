
PREFIX :=
JEKYLL := $(shell command -v jekyll)

ifeq ($(PREFIX),)
PREFIX := $(shell pwd)/../ashermancinelli.github.io-build
endif

all:
	$(JEKYLL) build --verbose

serve:
	$(JEKYLL) serve --verbose

install:
	$(JEKYLL) build -d $(PREFIX) --verbose
	cp ./CNAME $(PREFIX)

deploy: install
	cd $(PREFIX) && \
		rm -rf pres && \
		git add . && \
		git commit -m 'Publish' && \
		git push

# Sometimes I forget which one
publish: deploy
