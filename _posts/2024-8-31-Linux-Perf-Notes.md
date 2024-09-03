---
layout: post
title: Linux Perf Notes
permalink: /perf
category: linux, c++, perfanalysis
wip: false
cat: cs
---

How do I use perf again?

{% include disclaimer.html %}

## RTFM

* [Brendan Gregg perf one-liners. Reread these every time. What you want is probably here.](https://www.brendangregg.com/perf.html)
* [man perf](https://www.man7.org/linux/man-pages/man1/perf.1.html)
* [man perf-list](https://www.man7.org/linux/man-pages/man1/perf-list.1.html)
* [man perf-diff](https://www.man7.org/linux/man-pages/man1/perf-diff.1.html)

## What is my app doing?

This script watches most of the events I care about and generates all the reports in one place.

```
set -x

events="cycles:u,instructions,user_time,cache-misses,branch-misses,task-clock"
freq=99 # sampling frequency
app=$PWD/a.out
config="$*"
name=$(echo "$*" | sed -e 's/ /_/g')

ulimit -Ss unlimited
test -d $name || mkdir $name
pushd $name

perf record \
    --output perf.data \
    --call-graph fp \
    -F $freq -e "$events" \
    -- taskset 0x2 $app >/dev/null

perf report \
    --stdio -G \
    --inline --itrace=i \
    > perf.report

perf stat record \
    -o perf-stat.data \
    -e "$events" \
    -- taskset 0x2 $app >/dev/null

# --stdio much preferred to --stdio2
perf annotate -i perf.data --stdio > perf.annotate

popd
```

I like to create separate directories for all the data on a per-flag basis because I'm trying lots of different flags when investigating a performance change.
This way, each time I want to try another combination of flags, my history is preserved in its own directory and I don't have to wait to look at any reports:

```
# whatever directory was created by the above script
d="flags"
perf report -i $d/perf.data
perf stat report $d/perf-stat.data
$PAGER $d/perf.annotate
$PAGER $d/perf.report
```

NOTE: make sure you build with `-fno-omit-frame-pointer` so perf can give you reasonable traces.
Debug info works _okayyy_ but you'll end up with _massive_ data dumps that take forever to load into perf-report and other tools.

## Why is my app slower when I X?

NOTE: perf-diff is worse when name mangling is different (e.g. with Fortran apps) because perf can't match the events up.

```
make FLAGS="-O0"
perf record ...
make FLAGS="-O3"
perf record ...
perf diff
```
