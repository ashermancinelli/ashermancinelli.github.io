---
layout: post
title: Spack for Package Development (1 of N)
---

[Spack](https://spack.readthedocs.io/en/latest/) is typically used 
To facilitate rapid development of our packages, we maintain a private repository of our package descriptions.

Modify spack repo config:

```yaml
repos:
  - $spack/var/spack/repos/builtin
  - /qfs/projects/exasgd/src/ExaSGD_Spack/
```

Packages under /qfs/projects/exasgd/src/ExaSGD_Spack/packages are now usable with the prefix `exasgd`. The order matters here - if a package exists in both repos (eg hiop), the first one found will be used if the namespace is omitted.

Example usage:

```console
$ # uses upstream hiop package, very out of date
$ spack install hiop
$ # uses our hiop package, totally up to date
$ spack install exasgd.hiop
$ # installs exago using our hiop instead of upstream hiop package
$ spack install exago@master ^exasgd.hiop@develop
```

Based on spack documentation, this seems to be the canonical way to maintain private forks of packages. Additionally, maintaining this repository will allow us to track build environments in version control (see following section on environments). We currently maintain a set of scripts inside each repository for buildsystem variables, but this does not get us far when reproducing an environment.

Pros of maintaining our own repo:
Iterate very quickly; don’t have to wait for upstream spack team to accept every pull request or maintain a fork of the entire spack repository to have access to versions of packages we need
This will become key as we migrate to target platforms

Pros of creating PRs against upstream spack repo:
Available to users globally
Very stable
Options don’t frequently change; users can get used to one set of options

Possible plan forward:
Use pnnl repo in the short term to iterate quickly on internally developed packages and forks of external packages for target platforms
Quarterly create pull requests for packages upstream so our options are available to more users

This should maintain the flexibility we currently have while not being blocked on other teams.

The spack documentation also mentions keeping site-local repos to enable very intuitive use of locally installed packages, like so:

```console
$ spack install hiop+mpi ^pnnl.marianas.openmpi@3.1.3
```

However, this requires

