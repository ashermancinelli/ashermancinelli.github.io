#!/usr/bin/env bash

declare -a posts=($(ls | grep -E '^\d{4}' | sort -r))

# echo '# CS Stuff'

for post in "${posts[@]}"; do
  if grep -q -E '^cat:\s*cs' $post && ! grep -q 'wip:\s*true' $post; then
    title=$(grep ^title $post|sed -e 's/^title://' -e 's/"//g')
    date=$(basename $post .md | perl -pe 's#(\d+)-(\d+)-(\d+).+#\2/\3/\1#')
    # echo $date
    echo "- [$title $date]($post)"
  fi
done

