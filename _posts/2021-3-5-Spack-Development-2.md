---
layout: post
title: Spack for Package Development (2 of N)
---

In the [previous post about package development with Spack](/_posts/2021-3-4-Spack-Development-1.md), we discussed the following points:

* Creating a private spack repository
* Maintaining private packages
* Maintaining forks of upstream packages

In the following post(s), we'll discuss the following in greater detail:

* Managing environments for reproducibility
* Using environments for development
* Using environments for continuous integration
* Managing configurations for distributed and multi-platform development

## Managing Environments

One of the most useful features of Spack is it's support for [environments](https://spack.readthedocs.io/en/latest/environments.html).
An environment is a file describing a package or set of packages you wish to install, along with all of the spack configuration options you wish to use.
In the previous post, we used an example package `FloodSimulation` - we'll continue with this example here.

