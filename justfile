set positional-arguments

MDBOOK := `which mdbook`
CARGO := `which cargo`
HOST := "localhost"
PORT := "3000"

CYAN := ""
CLR := ""
DEPS := "mdbook mdbook-admonish mdbook-mermaid mdbook-graphviz"

default: all

all:
	@printf "\t\t%s%s%s\n" "{{CYAN}}" "Building" "{{CLR}}"
	{{MDBOOK}} build

serve:
	@printf "\t\t%sServing on %s:%s%s\n" "{{CYAN}}" "{{HOST}}" "{{PORT}}" "{{CLR}}"
	{{MDBOOK}} serve -n {{HOST}} -p {{PORT}}

deps:
    echo 'Installing dependencies...'
    cargo install {{DEPS}}

deploy: all
	test -d gh-pages || git worktree add gh-pages
	git config user.name "Asher Mancinelli"
	git config user.email "<ashermancinelli@gmail.com>"
	cd gh-pages && \
		printf "\t\t%sDeleting the ref to prevent history%s\n" "{{CYAN}}" "{{CLR}}" && \
		git update-ref -d refs/heads/gh-pages && \
		rm -rf * && \
		printf "\t\t%sCopying the build directory into gh-pages worktree%s\n" "{{CYAN}}" "{{CLR}}" && \
		mv ../book/* . && \
		cp ../CNAME . && \
		git add . && \
		printf "\t\t%sPushing to gh-pages branch%s\n" "{{CYAN}}" "{{CLR}}" && \
		git commit -m "Deploy to gh-pages" && \
		git push --force --set-upstream origin gh-pages && \
		printf "\t\t%sDone!%s\n" "{{CYAN}}" "{{CLR}}"

publish: deploy
