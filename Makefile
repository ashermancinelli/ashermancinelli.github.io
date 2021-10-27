
PREFIX :=

ifeq ($(PREFIX),)
PREFIX := $(shell pwd)/../ashermancinelli.github.io-build
endif

all:
	jekyll build --verbose

serve:
	jekyll serve --verbose

install:
	jekyll build -d $(PREFIX) --verbose
	cp ./CNAME $(PREFIX)

deploy: install
	cd $(PREFIX) && \
		git add . && \
		git commit -m 'Publish' && \
		git push

# Sometimes I forget which one
publish: deploy
