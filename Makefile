PREFIX :=
MDBOOK := $(shell type -p mdbook)
CARGO := $(shell type -p CARGO)

ifeq ($(PREFIX),)
PREFIX := $(shell pwd)/../ashermancinelli.github.io-build
endif

all:
	$(MDBOOK) build --dest-dir $(PREFIX)

serve:
	$(MDBOOK) serve --dest-dir $(PREFIX)

dep:
	$(CARGO) install mdbook
	$(CARGO) install mdbook-admonish

install:
	$(MDBOOX) build --dest-dir $(PREFIX)
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
