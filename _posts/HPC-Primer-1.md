---
layout: post
title: 'HPC Primer: Distribution Schemes'
permalink: /hpc-primer-1
---

The first lessons in distributed and high-performance computing.

### Intro

High-performance computing (HPC) is an exciting field with a rich history.
While its namesake is perhaps a bit daunting, most of the principles are more approachable than one might expect.
This series will look at some first lessons in HPC, seasoned with some interesting HPC history.

### Distribution Mechanisms

The first concept in HPC we'll look at is *distribution mechanisms*.
In layman's terms, this concept encapsulates *different strategies employed by
programs to split up computations and operations between different units of execution*.

For example, let's imagine a landscaping business has six lawns to mow and trim, four employees, and 3 lawnmowers.
How would you optimally divide the work between your equipment and employees?
This is very much like HPC jobs - you must determine how you would like to split
your computational work (lawns to mow) between your hardware resources (employees and equipment).

### References

1. [LLNL HPC Training Materials](https://hpc.llnl.gov/training/tutorials/introduction-parallel-computing-tutorial)
1. [LLNL Slurm & Moab Training Materials](https://computing.llnl.gov/tutorials/moab/)
1. [LLNL MPI Training Materials](https://computing.llnl.gov/tutorials/mpi/)
