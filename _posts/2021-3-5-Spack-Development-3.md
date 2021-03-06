---
layout: post
title: Spack for Package Development (3 of N): Extending Environments
---

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


### Continuous Integration/Testing


[Previous in this Series](/Spack-Development-2)

[Next in this Series](/Spack-Development-4)
