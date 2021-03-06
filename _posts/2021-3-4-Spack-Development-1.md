---
layout: post
title: Spack for Package Development (1 of N)
---

[Spack](https://spack.readthedocs.io/en/latest/) is typically used for package deployment, however this post will be about package *development* with Spack.
First in an N part series, this post focuses on *motivation and introduction*.

## Intro

Most upstream Spack packages are quite stable.
In my experience, the majority of Spack packages are based on packages that have already existed for a long time, and a member of the community created a Spack package to install it (eg OpenMPI).
In this case, the options and versions for the package are probably set-in-stone.
There are likely very few PRs submitted for these packages, and users can rely on the dependencies and installation process staying mostly the same.

For a package under extremely heavy development however, this is not the case.
To use a package manager *and* iterate rapidly on a package, I think there are roughly 3 criteria for that package manager:

1. Adding a new *dependency* should be easy and fast
1. Adding new *versions* should be easy and fast
1. Adding new *options* should be easy and fast

In my opinion, using the typical Spack workflow of submitting a pull request to the upstream Spack repository for every meaningful change meets none of these critera.

## Configuring Spack Repositories

An alternative strategy is to use Spack's support for external repositories.
A repository is simply a directory which contains a `repo.yaml` file and a `packages/` directory
under which Spack packages reside.

For example, creating the file

```yaml
# repo.yaml
repo:
  namespace: examplerepo
```

in a directory with a `packages` subdirectory like so:

```
examplerepo
├── packges
│   └── examplepackage
│       └── package.py
└── repo.yaml
```

is a valid repository.

Running `spack repo add .` in this directory will add the path to that repository to your Spack configuration:

```yaml
# ~/.spack/repos.yaml
repos:
  - $spack/var/spack/repos/builtin
  - /path/to/examplerepo
```

After configuring your example repository, you are able to install packages from it directly!
If your package conflicts with a builtin package, you may install it using the namespace set in `examplerepo/repo.yaml`:

```console

$ # If examplepackage is unique:
$ spack install examplepackage

$ # If examplepackage conflicts with a builtin package:
$ spack install examplerepo.examplepackage

```

## 3rd Party Packages in Your Spack Repo

The most common case that I have found of a package conflicting with a builtin is when one of your packages relies on a fork of an upstream package, so you maintain a modified version of the upstream package (in `examplerepo/packages/forked-package/package.py`, for example).
This allows developers to iterate quickly and modify dependencies without attempting to maintain a fork of the entire spack repository.

For example, let's say you're developing a package FloodSimulation which relies on OpenMPI and Ipopt.
As you develop your software, you realize the Ipopt Spack package doesn't expose all of Ipopt's configuration options, and you need to make rather significant edits to the Ipopt Spack package.
You could go through the pull request process upstream, however if you have many similar edits to many other packages, you may want to maintain an Ipopt fork in your spack repository:

```
floodsimulationrepo
├── packges
│   ├── ipopt
│   │   └── package.py
│   └── floodsimulation
│       └── package.py
└── repo.yaml
```

You may then install FloodSimulation with your fork of Ipopt like so:

```console

$ spack install floodsimulation ^floodsimulationrepo.ipopt

```

If you track your private spack repository with source control, it is quite easy to maintain your small package repository while your key packages are under heavy development.
Each release of your package may serve as a time to submit all of your modifications to forked packages as well as the spack package descriptions to upstream spack such that end users are able to fully take advantage of your configuration.

This strategy alone has the potential to save a significant amount of developer time when heavily developing a package.
The next post will go further into managing environments and multi-platform configurations.

[Next in this Series](/Spack-Development-2)
