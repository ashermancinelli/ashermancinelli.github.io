
PREFIX :=
JEKYLL := $(shell type -p jekyll)
RBVER  := 3.3.4

ifeq ($(PREFIX),)
PREFIX := $(shell pwd)/../ashermancinelli.github.io-build
endif

all:
	$(JEKYLL) build --verbose --trace

serve:
	$(JEKYLL) serve --verbose

dep:
	for prog in bundler rbenv; do \
		type -p $$prog || false Needs program $$prog; \
	done
	rbenv versions | grep -q "$(RBVER)" || rbenv install $(RBVER)
	rbenv global $(RBVER)
	eval "$$(rbenv init)"
	: This should be the rbenv install location
	gem env home
	bundler install

install:
	$(JEKYLL) build -d $(PREFIX) --verbose --trace
	cp ./CNAME $(PREFIX)

deploy: install
	cd $(PREFIX) && \
		if [ ! -d .git ]; then \
			git init; \
			git remote add \
				origin git@github.com:ashermancinelli/ashermancinelli.github.io; \
		fi
	cd $(PREFIX) && \
		if [ ! $$(git branch | cut -f2 -d' ') = "gh-pages" ]; then \
			echo 'must be on branch gh-pages'; \
			git fetch --all; \
			git checkout -f gh-pages; \
		fi
	cd $(PREFIX) && \
		rm -rf pres && \
		git add . && \
		git commit -m 'Publish' && \
		git push

# Sometimes I forget which one
publish: deploy
