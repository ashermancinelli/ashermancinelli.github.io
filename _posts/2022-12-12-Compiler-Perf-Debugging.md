---
layout: post
title: Debugging Performance in Compilers
permalink: /comp-debug-perf
category: c++, llvm, compilers
wip: false
cat: cs
---

Overview of how I debug performance regressions when developing a compiler.
I don't claim this is the best way to do it, email me if you've got better ideas😉

{% include disclaimer.html %}

## Starting Point

Compilers are very complicated and the results can be surprising.
Sometimes performance issues only show up in large scale real-world applications.
How do you go about debugging such an issue?

As you might expect, narrowing down the issue to be minimal and reproducible is the first task.
Ideally, we narrow the performance regression down to a single translation unit, though sometimes this isn't enough.
For this post, we'll assume that the bulk of the performance regression you see in your application is coming from one translation unit, and that you know which patch is causing the regression.

## Bisecting the Object Files

Assume we have two compilers: compiler A which doesn't have the "bad" changes (the "good" compiler), and compiler B which does (the "bad" compiler).
We'll start by building the application with both compilers, building half of the object files with compiler A and half with compiler B.
Say we have 100 object files that are linked into the application; we'd build the first 50 with compiler A and the second 50 with compiler B.

If the perf regression isn't observed after you re-link all the object files into the application, then we know the bulk of the issue is in the object files that were just built with compiler A.
We can then rebuild all the object files in the second 50 with compiler A and build object files 26-50 or 1-25 with compiler B.
In this way, we bisect all the translation units until we find the single TU with the largest impact on performance.

This can be really tedious and manual, but it's not too hard to script😉.

## Bisecting the Source File

Now that we've narrowed our regression down to a single TU, our work gets a little more complicated.
We can use the same bisection process as before, but this time we'll have to do it on a single file.
To acomplish this, we'll have to figure out which parts of the source file depend on each other so we can break it into two new source files, one to be built with compiler A and one to be built with compiler B (all other TUs being built with the "good" compiler).

Depending on the situation you may create two source files, each with half of the content of the original, or maybe you'll use the same source file but use macro guards so each compiler only builds half of the source, eg:

```c++
/* includes, declarations, and global defs up here */

#ifdef COMPILERA
// stuff built with the good compiler...
#else /* COMPILERB */
// stuff built with the bad compiler...
#endif
```

You may then add `-DCOMPILERA` to the invokation of compiler A so each compiler only builds half of the TU in question.
Again, if we don't see the perf regression, we swap the macro guards and try again.
We then have compiler B build a quarter of the original TU and have compiler A build the other 3/4ths, and see if we observe the regression, etc etc.
Ideally, at the end of this process we know exactly which function(s) are causing the regression.

<!--
## What Next?

After we've narrowed the regression down to a single function (🤞) things can get tricky, and very much depends on the nature of the changes that caused the regression.

At this point I think it's best to ask some questions:

- Was the patch in question related to a specific pass?
  - Can the effects of that pass be seen in the function(s) we found to be causing the regression?
- Do you notice any obvious differences between the IR the compilers generate?
  - 

## Why Might This Not Work?

Sometimes the effects only occur in a short function that is always inlined, in which case you might not find a specific TU or set of functions at the root of the regression; for this reason, you might want to crank the inlining pass down as low as it goes to help you narrow down the issue.
It's often best to use the fewest optimizations possible while still observing the behavior.
-->
