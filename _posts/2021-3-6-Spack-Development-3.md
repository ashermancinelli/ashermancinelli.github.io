---
layout: post
title: Spack for Package Development Part 3
permalink: /spack3
cat: cs
---

Third in this series, this post focuses on *leveraging environments for debugging and reproducing errors*.

{% include disclaimer.html %}

In the [previous post about package development with Spack](/spack2), we discussed environment management with Spack, particularly integration with a private repository.
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

In this post, we're going to look at using this configuration to reproduce errors and coordinate development and debugging within a large team.

### Reproducing Finicky Errors

Bugs relating to interfaces between libraries are sometimes the most difficult to track down.
To use an example from my experience, one of my teams was developing a library that builds on the optimization solver [HiOp](https://github.com/LLNL/hiop), which leverages CUDA, MAGMA, and many BLAS/LAPACK routines.
After developing some functionality tests to ensure our library was performing as expected, we noticed that on some platforms with certain CUDA devices and CUDA versions, our library was failing to converge within our expected tolerance.
For weeks we stepped through debuggers and discussed possibile issues with our codebase and the various libraries we depend on to no avail.

We eventually enlisted the help of collaborators from another laboratory to build and test our codebase under similar conditions on their platforms to ensure they were able to reproduce the bug.
In order to ensure our collaborators were able to accurately reproduce the environments in which we found the bug, we created and distributed spack environments specific to that development snapshot.

Continuing with our `FloodSimulation` example, let us imagine we found a bug when running with CUDA versions v11.0.104 through 11.1 and HiOp v0.3.0 on our imaginary cluster Jupiter, and would like other teammembers to reproduce the bug on differrent platforms but using the same stack.
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
Another potential use-case of this strategy is to coordinate profiling efforts - each month or so a spack environment which instantiates a development snapshot of the development stack may be distributed to profiling teams.
This way, the profiling team may work on a known working configuration of the software stack to identify performance bottlenecks while the core development team continues developing.

[Previous in this Series](/spack2)

[Next in this Series](/spack4)

{% include footer.html %}
