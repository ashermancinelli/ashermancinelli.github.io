
PREFIX :=
JEKYLL := /usr/local/bin/jekyll #$(shell command -v jekyll)

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
		if [ ! -d .git ]; then \
			git remote add \
				origin git@github.com:ashermancinelli/ashermancinelli.github.io; \
		fi
	cd $(PREFIX) && \
		if [ ! $(git branch | cut -f2 -d' ') = "gh-pages" ]; then \
			echo 'must be on branch gh-pages'; \
			exit 1; \
		fi
	cd $(PREFIX) && \
		rm -rf pres && \
		git add . && \
		git commit -m 'Publish' && \
		git push

# Sometimes I forget which one
publish: deploy
