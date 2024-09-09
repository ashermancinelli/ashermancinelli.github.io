<!--
layout: post
title: Linux Perf Notes
permalink: /perf
category: linux, c++, perfanalysis
wip: false
cat: cs
-->

~~~admonish example title="TOC"
[[_TOC_]]
~~~

# Linux Performance Analysis

Perf analysis is _super_ interesting to me - why does an application run faster or slower under certain conditions?
Why does one compiler (or compiler switch) produce a faster application than any other?
I want to know what tricks my compiler is doing to speed up my app.

This post is an example performance analysis of an application called _POV-Ray_.
I explain my benchmark choice in the [section on POV-Ray](#pov-ray).

## Approaches

There are two ways I think about approaching performance analysis:
a _top-down_ approach and a _bottom-up_ approach.
I use perf for both of these approaches, so we'll start with an overview of perf
and then apply these approaches to povray.

~~~admonish tip title="Key Terms"
**Top-down approach:** look at the application starting at the root of the call stack.
What does `main()` look like? What is the application doing at an extremely high level?

**Bottom-up approach:** Look at the fine-grained details of the application.
What instructions are being executed? Is the application memory-, network-, or compute-bound?
Where are these instructions coming from in the source?
~~~

# The Linux Perf Tool

So how do we see into the guts of this app as it's running?

IMO the best place to start (and often finish) is with the `perf` tool[^man_perf].
Perf is a part of the linux project, so it's supported on all linux platforms.

~~~admonish tip title=""
If you don't already have it, you can _probably_ install it from your package manager as `linux-tools-common`:
```bash
sudo apt install linux-tools-common linux-tools-`uname -r`
```
~~~

Perf has lots of commands, but the main two you'll need to interact with are `perf-record` and `perf-report`.
The workflow is generally:

```bash
; perf stat -- ./a.out

# This leaves the recorded data in ./perf.data
; perf record -- ./a.out
; perf report
```

Perf report helps you drill into the call stack to see **where samples were recorded** in the application,
even down to the assembly instructions that corresponded to samples.


## Perf Events and Perf List

Note that in the previous section I said `perf report` helps you view
_where samples were recorded_ and not _where time was spent_;
perf watches for _events_ and takes periodic samples of what's happening on the system when it wakes up.
These samples do not necessarily indicate where user-time is being spent.

Depending on your system, kernel configuration, and the configuration of perf itself, you'll have different events available to profile.

Run `perf list`[^man_perf_list] to get a view of all the sampling events you can use on your system:
```bash
; perf list
List of pre-defined events (to be used in -e):

  branch-instructions OR branches                    [Hardware event]
  branch-misses                                      [Hardware event]
  bus-cycles                                         [Hardware event]
  cache-misses                                       [Hardware event]
...
```
The list of samplable events is rather long and often has architecture- and cpu-specific entries,
so I'll leave it as an excercise for the reader to see what perf events are
available to you on _your_ system, and learn what they all mean.

The `-F` flag tells perf what observation frequency it should use when recording samples -
often `-F 99` (for 99 hertz) is a good place to start; you get enough data to gain insights without being overwhelmed.
You can always turn it down for longer-running applications or when you're sampling many different events.

## Perf Stat

The best place to start with perf is often `perf stat`.
This command gives a brief overview of total samples of events.
If something from perf stat's report stands out, you can use perf record with that
event to drill into the sources of those samples.

A perf stat run might look like this:
```bash
; perf stat -- ./a.out
 Performance counter stats for './a.out':

         21,829.89 msec task-clock                #    0.963 CPUs utilized          
             7,097      context-switches          #  325.105 /sec                   
                 1      cpu-migrations            #    0.046 /sec                   
             5,062      page-faults               #  231.884 /sec                   
    70,001,621,188      cycles                    #    3.207 GHz                    
   155,086,020,805      instructions              #    2.22  insn per cycle         
     9,013,464,722      branches                  #  412.896 M/sec                  
        49,795,347      branch-misses             #    0.55% of all branches        

      22.661088635 seconds time elapsed

      21.785643000 seconds user
       0.051956000 seconds sys
```

## Perf Record

`perf record` is the primary command for recording samples about your application or system.

My perf record commands usually look like this:
```bash
; export \
    APP=./a.out \
    FREQ=99 \
    EVENTS="cycles,instructions,branches,loads,task-clock"
; perf record \
    --output perf-$APP.data \
    --call-graph fp \
    -F $FREQ -e $EVENTS \
    -- taskset 0x2 ./a.out >/dev/null
```

I'm using `--call-graph fp` because I want perf to record callgraph information
using the frame pointer - this is why you must often build your application with
the `-fno-omit-frame-pointer` compiler flag (more on that later).

I'm also using `taskset 0x2` because I only want the app to run on a single core
in this example; perf can also record data for _everything running on your entire system_
if you would like it to - or just on a specific core or for a specific application.

## Perf Report

`perf report` will give you a TUI report like this by default:
```bash
Samples: 88K of event 'cycles', Event count (approx.): 72137516526
  Children      Self  Command  Shared Object              Symbol
+   99.61%     0.00%  povray   libboost_thread.so.1.74.0  [.] 0x00007f61e2d6f0cb
+   99.54%     0.00%  povray   povray                     [.] pov::Task::TaskThread
+   97.41%     0.03%  povray   povray                     [.] pov::Trace::ComputeTextureColour
+   97.40%     0.06%  povray   povray                     [.] pov::Trace::ComputeOneTextureColour
...
```

Notice the event used for the report is given in the first line.

`perf report --stdio` gives the same information initially, but with all the call stacks expanded;
this may get overwhelming.
For a the 20 second recording I took for this example, the stdio output of
perf report was over 10k lines long:
```bash
; perf report --stdio|wc -l
10010
```

From inside the TUI you can press `h` to get a list of all the available commands,
so I won't enumerate them here.

I usually run perf report with the `-G` flag, which is shorthand for `--inverted`,
meaning the callgraph representation is inverted.

You may have noticed that the snippet from perf report I pasted above starts
with two columns: `Self` and `Children`.

~~~admonish important title="The `Self` and `Children` columns"
The _Children_ indicates the percentage of samples taken in that stack frame
_or any of its children_ - meaning any samples recorded while in this stack
frame or that of any functions called from the current stack frame.

The _Self_ column is more significant: it indicates what percentage of samples
were taken _in the given stack frame only_ - meaning instructions coming from
that function alone, and not any functions it calls.

The `main()` function is always at the top, since it calls all other function.
However, unless your entire program was inlined into the main routine, its _Self_
column is likely very low since most of the work being done is probably happening
elsewhere.
~~~

## FlameGraph

I mention Brendan Gregg[^brendan_gregg_blog] a few times in this post, and you should get familiar with
him and his work.
His blog has many pearls and he might have a one-liner for exactly your use case.

One of his other contributions is the FlameGraph repo[^brendan_gregg_flamegraph].

Remember how our perf report contains over 10k lines of reporting for just a single application running for ~20 seconds?
His flamegraph repo gives us a way to visualize and gain insights from _all_ of that data at a very high level
by creating a flamegraph from perf's recorded data.

~~~admonish tip title="Note"
The FlameGraph repo actually knows how to deal with other profilers too, like DTrace and SystemTap.
~~~

A workflow for generating a flamegraph might look like this:

```bash
# build and profile your application
; make
; perf record --call-graph fp -- ./a.out

; git clone https://github.com/brendangregg/FlameGraph ../FlameGraph

; perf script \
    | ../FlameGraph/stackcollapse-perf.pl \
    | ../FlameGraph/flamegraph.pl \
    > flamegraph.svg
```

~~~admonish tip title="Note"
The FlameGraph scripts have actally been merged into the linux kernel's repo,
so perf built for a newer kernel has FlameGraph as a built-in script, used like so:

```bash
; perf script flamegraph -- ./a.out

# alternatively...
; perf record -- ./a.out
; perf script report flamegraph
```

This requires python scripting support built into perf, which my perf build does
not have, so I can't test it myself. I still use the scripts from Brendan's repo.
~~~

# POV-Ray

Povray[^povray] is a 3d graphics code commonly used for benchmarking - it's part of CPU benchmarking suites from OpenBenchmarking[^openbench_povray] and spec2017[^spec2017_povray], which means a few things:

1. It's reasonably well-optimized.
    
    Compiler writers and hardware vendors don't care too much about benchmarking
    silly code that doesn't represent what users will actually be running.

1. It's cross-platform

    Part of its utility is that we can compare performance across hardware vendors

1. It's well-supported by most/all compilers

    compiler authors and hardware vendors care about how well POV-Ray runs on their tech,
    so we can assume they've put effort into handling povray's code well and ensuring
    it builds with their compilers.

1. It doesn't rely _too_ much on libraries.

    OpenBenchmarking and SPEC suites are especially useful for benchmarking
    because they are mostly self-contained.

## Building POV-Ray

POV-Ray is opensource, so we can download it and built it ourselves:
```bash
; git clone --branch latest-stable git@github.com:POV-Ray/povray.git
; cd povray
; (cd unix; ./preinstall.sh)
```

We will build the app with come debug information enabled so we have more visibility into the app's behavior as it runs:
```bash
; ./configure \
    --disable-strip \
    --prefix=$PWD/../povray-gcc-12/ \
    COMPILED_BY="Asher Mancinelli on $(date)" \
    CFLAGS='-fno-omit-frame-pointer' CXXFLAGS='-fno-omit-frame-pointer' \
    CC=gcc-12 CXX=g++-12
; ./unix/povray --version |& grep flags
  Compiler flags:      -pipe -Wno-multichar -Wno-write-strings -fno-enforce-eh-specs -Wno-non-template-friend -g -pg -O3 -ffast-math -march=native -fno-omit-frame-pointer
```

~~~admonish tip title="Frame Pointer"
You'll notice I used the unfortunately-named `-fno-omit-frame-pointer`.
This tells the compiler to maintain the frame pointer in the frame pointer register (`ebp` on x86_64 systems);
the compiler might otherwise reuse the register as a general-purpose register,
but we're going to tell the perf tool to use the frame pointer register for building analyses,
so we need to keep it around.
~~~

Once we have the app built, we can run the standard benchmark (this takes a while):

```bash
; make -j `nproc` install
; ./unix/povray --benchmark </dev/null
...
Render Options
  Quality:  9
  Bounding boxes.......On   Bounding threshold: 3
  Antialiasing.........On  (Method 1, Threshold 0.300, Depth 3, Jitter 0.30,
 Gamma 2.50)
==== [Rendering...] ========================================================
Rendered 15360 of 262144 pixels (5%)
```

<!--

This script watches most of the events I care about and generates all the reports in one place.

```bash
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

```bash
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

```admonish note
`perf-diff` is worse when name mangling is different (e.g. with Fortran apps) because perf can't match the events up.
```

```bash
make FLAGS="-O0"
perf record ...
make FLAGS="-O3"
perf record ...
perf diff
```

-->

# Further Reading

Truly, read the manpages.
The perf man pages could be more thorough and some commands are not exceptionally
well-documented (looking at you, `perf diff`), but they are invaluable resources.

Search for Brendan Gregg on YouTube, he has plenty of great talks there.
For example: 
[_Give me 15 minutes and I'll change your view of Linux tracing_](https://www.youtube.com/watch?v=GsMs3n8CB6g)

## References

[^brendan_gregg_blog]: [Brendan Gregg's blog post with perf one-liners. Reread this list several times. What you want is probably already here.](https://www.brendangregg.com/perf.html)
[^brendan_gregg_flamegraph]: [FlameGraph repo](https://github.com/brendangregg/FlameGraph). [See also: his blog post on flamegraphs](https://www.brendangregg.com/FlameGraphs/cpuflamegraphs.html)
[^povray]: [  POVRay.org: Benchmarking with POV-Ray  ](https://www.povray.org/download/benchmark.php)
[^openbench_povray]: [OpenBenchmarking POV-Ray](https://openbenchmarking.org/test/system/povray)
[^spec2017_povray]: [511.povray_r: SPEC CPU®2017 Benchmark Description](https://www.spec.org/cpu2017/Docs/benchmarks/511.povray_r.html)
[^man_perf]: [man perf](https://www.man7.org/linux/man-pages/man1/perf.1.html)
[^man_perf_list]: [man perf-list](https://www.man7.org/linux/man-pages/man1/perf-list.1.html)
[^man_perf_diff]: [man perf-diff](https://www.man7.org/linux/man-pages/man1/perf-diff.1.html)
[^redhat_flamegraph]: [RedHat blog post on flamegraphs](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/monitoring_and_managing_system_status_and_performance/getting-started-with-flamegraphs_monitoring-and-managing-system-status-and-performance#creating-flamegraphs-over-the-entire-system_getting-started-with-flamegraphs)
