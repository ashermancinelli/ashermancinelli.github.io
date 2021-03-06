---
layout: post
title: Spack for Package Development (3 of N)
permalink: /spack3
---

Third in an N part series, this post focuses on *leveraging environments for additional use cases*.

In the [previous post about package development with Spack](/Spack-Development-2), we discussed environment management with Spack, particularly integration with a private repository.
What are some of the benefits of this, other than onboarding new developers?

As we've developed our private spack repository, we've also added some spack environments along the way:

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

In this post, we're going to look at using this configuration to reproduce errors and integrate with continuous integration.

### Reproducing Finicky Errors

Bugs relating to interfaces between libraries are sometimes the most difficult to track down.
To use an example from my experience with the [ExaSGD project](https://www.exascaleproject.org/research-project/exasgd/), one of my teams was developing a library that builds on the optimization solver [HiOp](https://github.com/LLNL/hiop), which leverages CUDA, MAGMA, and many BLAS/LAPACK routines.
After developing some functionality tests to ensure our library was performing as expected, we noticed that on some platforms with certain CUDA devices and CUDA versions, our library was failing to converge within our expected tolerance.
For weeks we stepped through debuggers and discussed possibile issues with our codebase and the various libraries we depend on to no avail.
After losing hope, I decided it might be worthwhile to rebuild some dependencies installed by our system administrators from source, just to be sure the issue wasn't in our codebase.

We eventually enlisted the help of collaborators from another laboratory to build and test our codebase under similar conditions on their platforms to ensure they were able to reproduce the bug.
In order to ensure our collaborators were able to accurately reproduce the environments in which we found the bug, we created and distributed spack environments specific to that development snapshot.

Continuing with our `FloodSimulation` example, let us imagine we found a bug when running with a particular version of CUDA v11.0.104 through 11.1 and HiOp v0.3.0 on our imaginary Jupiter cluster, and would like other teammembers to reproduce the bug on differrent platforms but using the same stack.
We might create an environment file like so:

```yaml

# reproduce-error.yaml
spack:
  specs:
  - floodsimulation ^floodsimulationrepo.petsc ^floodsimulationrepo.hiop
    ^cuda@11.0.104 ^hiop@0.3.0
  view: true
  packages:
    cuda:
      versions: [11.0.104, 11.1.0]
    hiop:
      versions: [0.3.0]

```

You can see we've established the exact matrix of libraries in which our bug manifests.
We then asked our collaborators to install all versions of this spack environment and attempt to reproduce our bug, with all certainty that they will accurately reproduce the environment.

We also tend to track these environments in our repository like so:

```

floodsimulationrepo
├── environments
│   ├── jupiter
│   │   ├── env.yaml
│   │   └── reproduce-error.yaml <---
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

so that in future threads we are able to refer back to the exact configurations which caused bugs in the past.

With this strategy, we are able to maintain a reproducible and consistent software stack with robust coordination between teams.

### Continuous Integration/Testing

todo

[Previous in this Series](/Spack-Development-2)

[Next in this Series](/Spack-Development-4)
