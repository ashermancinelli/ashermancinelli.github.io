---
layout: post
title: JAABIBP (Just Another ABI Blog Post)
permalink: /jaabibp
category: c, c++
wip: true
---

Going on the offensive.

***NOTE: These thoughts are just taken from other people that know more than me. You should probably just read their articles instead 🙃 See the end of the article for better posts than this one.***

{% include disclaimer.html %}

## What is the ABI?

## Why do some want to break it?

> Q: Why don't you just rebuild after an ABI change?
> A1: Are you rebuilding the standard library too?
> Many people will recommend not passing standard library types around, and not throwing exceptions across shared library boundaries. They often forget that at least one very commonly used shared library does exactly that... your C++ standard library.
> 
> On many platforms, there is usually a system C++ standard library. If you want to use that, then you need to deal with standard library types and exceptions going across shared library boundaries. If OS version N+1 breaks ABI in the system C++ standard library, the program you shipped and tested with for OS version N will not work on the upgraded OS until you rebuild.


## Links

1. [Titus Winters paper on ABI](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2020/p2028r0.pdf)
1. [Ben Craig's Reddit post on ABI breakage](https://www.reddit.com/r/cpp/comments/fc2qqv/abi_breaks_not_just_about_rebuilding/)
1. [Johnathan Wakely's comment about ABI on Reddit](https://www.reddit.com/r/cpp/comments/fc2qqv/abi_breaks_not_just_about_rebuilding/fj9dfg1/)
1. [Corentin's blog post on ABI](https://cor3ntin.github.io/posts/abi/)
1. [C++ Weekly - Ep 270 - Break ABI to Save C++](https://www.youtube.com/watch?v=By7b19YIv8Q&ab_channel=C%E1%90%A9%E1%90%A9WeeklyWithJasonTurner)
