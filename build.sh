#!/usr/bin/env bash

for tool in pandoc perl; do
  type -p $tool || exit 1
done

HTML=$HOME/workspace/ashermancinelli.github.io-build

[ -d $HTML ] || mkdir -p $HTML

perl \
  -MPod::Simple::HTMLBatch \
  -e Pod::Simple::HTMLBatch::go . $HTML

set -x 

declare -a posts=($(find ./_posts -name '*.md' -o -name '*.pod' | sort -r))

for post in ${posts[@]}; do
  name=$(basename -s '.md' $post)
  in=$name.md
  html=$name.html

  if [[ "$name" =~ ^_ ]]; then continue; fi

  # 2021-3-4-Spack-Development.md
  if [[ "$name" =~ ^\d{4}-\d{1,2}-\d{1,2} ]]; then
    echo $name
    exit
  fi

  sed -i "" "s#</dl>#<dt><a name=\"$name\">$name</a></dt>\n</dl>#" $HTML/index.html
  sed -i "" "s#</dl>#<dd><a href=\"./$html\">$name</a></dd>\n</dl>#" $HTML/index.html
done

sed -i '' 's/Perl Documentation/Asher Mancinelli/g'
