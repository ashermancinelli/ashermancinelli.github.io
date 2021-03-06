---
layout: post
title: Spack for Package Development (2 of N)
---

Second in an N part series, this post focuses on *getting stared with environments*.

In the [previous post about package development with Spack](/Spack-Development-1), we discussed the following points:

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
An environment is a file describing a package or set of packages you wish to install, along with all of the spack configuration options you wish to use (see documentation linked above for more information).
In the previous post, we used an example package `FloodSimulation` and a corresponding repository - we'll continue with this example here.

When managing a complex and mutable set of dependencies, reproducibility is *extremely* important.
Spack environments allow the development team to document ***every single option*** they used to install a particular package or set of packages.
For example, let's say `FloodSimulation` has a few more dependencies: [HiOp](https://github.com/LLNL/hiop), [MAGMA](https://icl.cs.utk.edu/projectsfiles/magma/doxygen/index.html), CUDA > 10.1, and [PETSc](https://gitlab.com/petsc/petsc).
Each of these packages has many configuration and installation options, and you may even want to use versions of these packages installed by your system administrator.

Our `FloodSimulation` package may have a `package.py` file that looks like this:

```python

from spack import *
import os

class FloodSimulation(CMakePackage):
    homepage = "https://github.com/your-username/flood-simulation"
    git = "https://github.com/your-username/flood-simulation.git"
    version('1.0.0', tag='v1.0.0')
    depends_on('petsc')
    depends_on('hiop')
    depends_on('cuda@10.1:', when='+cuda')
    depends_on('magma', when='+cuda')

    def cmake_args(self):
        args = []
        if '+cuda' in self.spec:
            args.append('-DFLOODSIMULATION_ENABLE_CUDA=ON')
        return args

```

Let us also assume you *need* to install with your fork of the PETSc and HiOp spack packages, and that you'd like to use the MAGMA and CUDA installations provided by your system administrator or package manager.
In this case, you might have an environment file like this:

```yaml

# example-env.yaml
spack:
  specs:
  - floodsimulation ^floodsimulationrepo.petsc ^floodsimulationrepo.hiop
  view: true
  packages:
    magma:
      externals:
      - spec: magma@2.5.4
        prefix: /path/to/magma
      buildable: false
    cuda:
      externals:
      - spec: cuda@10.2.89
        prefix: /path/to/cuda
      buildable: false

```

Constructing your spack environment from this file is easy as:

```

$ spack env create my-environment ./example-env.yaml
$ spack install

$ # To locate your new installation:
$ spack location -i floodsimulation

```

This way, if another developer needs to reproduce your development environment, you may distribute the environment file to perfectly recreate your installation.
I reccommend tracking your environments in version control along with the rest of your private spack repository with the following example directory layout:

```

floodsimulationrepo
├── environments
│   └── example-env.yaml
├── packges
│   ├── ipopt
│   │   └── package.py
│   └── floodsimulation
│       └── package.py
└── repo.yaml

```

## Using Spack Environments

In my opinion, the three most significant use cases for spack environments are:

1. Reproducible environments for development
1. Reproducing finicky errors
1. Continuous integration/testing

### Reproducible Environments for Development

With a complex codebase, onboarding often requires significant resources for new developers.
Gettings started with a new codebase can be challanging, especially when building the software stack in the first place can take up to several days.
I have found distributing a spack environment which is known to instantiate your software stack on a particular development machine to be a mostly frictionless method of getting new developers started on a codebase.
With the example environment file above, we specify instructions to instatiate the `FloodSimulation` software stack on a particular machine with a couple pre-installed packages.
If you are developing on many platforms and you need developers up and running on all platforms with a short turnaround time, distributing spack environments will likely be a suitable solution.

Extending the example above, the following directory structure is a suitable way to maintain spack environments to instatiate the `FloodSimulation` stack on multiple platforms.
Let's assume you want developers up and running on two clusters, Jupiter and Saturn, as well as OSX for local development:

```

floodsimulationrepo
├── environments
│   ├── jupiter
│   │   └── env.yaml
│   ├── saturn
│   │   └── env.yaml
│   └── osx
│       └── env.yaml
├── packges
│   ├── ipopt
│   │   └── package.py
│   └── floodsimulation
│       └── package.py
└── repo.yaml

```

In this way, you may simply instruct a new developer to run the following to get started with local development on a Mac:

```console

$ # in the directory `floodsimulationrepo`:
$ spack env create local-development ./environments/osx/env.yaml
$ spack install

$ # Any time the developer logs in to develop locally:
$ spack env activate local-development

```

And when they need to get started developing on the institutional cluster Jupiter:

```console

$ spack env create remote-development ./environments/jupiter/env.yaml
$ spack install

```

#### An Aside on Spack Views

If you didn't notice earlier, our environment file contains the line:

```yaml
  view: true
```

This means that when you activate your spack environment (`spack env activate <environment name>`), spack will use a "view" by defaul.
A view is a single installation prefix into which all packages installed via the environment are symbolically linked.

By default, spack views are installed to:
```
$SPACK_ROOT/var/spack/environments/<environment name>/.spack-env/
```
and the environment file is installed to 
```
$SPACK_ROOT/var/spack/environments/<environment name>/spack.yaml
```

If our new developer activates her spack environment like so:

```console

$ spack env activate local-development
$ ls $SPACK_ROOT/var/spack/environments/local-development/.spack-env/lib
libmagma.so libhiop.so ...

```

she will have access to all of her newly installed libraries in a single installation prefix, automatically added to her `LD_LIBRARY_PATH` and `DYLD_LIBRARY_PATH`.

[The Spack command reference on views](https://spack.readthedocs.io/en/latest/command_index.html?highlight=view#spack-view) contains further information on this topic.

#### Back to Using Environments

Now that we have a feel for creating, using, and distributing spack environments, how do we develop with them?

As we saw in the aside on views above, activating a spack environment with the view option enabled (which is the default) adds the view to the user's path, library path, etc.
Assuming `FloodSimulation` is a CMake project (as we specified in the example spack package above) and we have written clean enough CMake to find external libraries, the workflow for building `FloodSimulation` should be relatively straightforward:

```console

$ git clone https://github.com/your-username/flood-simulation.git
$ mkdir build install
$ cd build

$ # At this step, cmake should be able to find all of your libraries in the
$ # spack view:
$ cmake ../flood-simulation -DCMAKE_INSTALL_PREFIX=$PWD/../insatll

$ # If some libraries are not found, simply run `spack location -i package`
$ # to find the prefix for the package, and add it manually with ccmake:

$ # Assuming magma is the package cmake failed to find, run this command and
$ # copy the path:
$ spack location -i magma

$ # Manually add the path to the magma installtion to cmake:
$ ccmake

$ make install

```

From here, developers may continue the edit-build-test cycle for `FloodSimulation`, knowing they are using the correct set of dependencies.

Read on for discussion on additional uses for environments you should consider incorporating into your workflow.

[Previous in this Series](/Spack-Development-1)

[Next in this Series](/Spack-Development-3)
