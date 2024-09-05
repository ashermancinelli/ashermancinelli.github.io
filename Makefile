MDBOOK := $(shell type -p mdbook)
CARGO := $(shell type -p CARGO)
HOST := localhost
PORT := 3000

RED:=\e[41m
YELLOW:=\e[33m
CYAN:=\e[36m
GREEN:=\e[32m
CLR:=\e[0m
CLRNL:=$(CLR)\n
INFO:=printf "\t\t$(CYAN)%s$(CLRNL)"

all:
	@$(INFO) "Building"
	$(MDBOOK) build

serve:
	@$(INFO) "Serving on $(HOST):$(PORT)"
	$(MDBOOK) serve -n $(HOST) -p $(PORT)

dep:
	@$(INFO) "Installing dependencies"
	$(CARGO) install mdbook
	$(CARGO) install mdbook-admonish

# https://github.com/rust-lang/mdBook/wiki/Automated-Deployment%3A-GitHub-Actions
deploy: all
	(test -d gh-pages || git worktree add gh-pages)
	git config user.name "Asher Mancinelli"
	git config user.email "<ashermancinelli@gmail.com>"
	cd gh-pages && \
		$(INFO) "Deleting the ref to prevent history" && \
		git update-ref -d refs/heads/gh-pages && \
		rm -rf * && \
		$(INFO) "Copying the build directory into gh-pages worktree" && \
		mv ../book/* . && \
		cp ../CNAME . && \
		git add . && \
		$(INFO) "Pushing to gh-pages branch" && \
		git commit -m "Deploy to gh-pages" && \
		git push --force --set-upstream origin gh-pages && \
		$(INFO) "Done!"

# Sometimes I forget which one
publish: deploy
