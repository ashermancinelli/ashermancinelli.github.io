# Ideal Array Language 7/20/2025

What would the ideal array language look like?

## User-Extensible Rank Polymorphism

IMO this is what makes something an array language.
No language can be an array language without rank polymorphism.

Some languages have rank polymorphism, but I wouldn't necessarily call them array languages.

Numpy provides _some_ rank polymorphism, but it's not a first-class feature.
Numpy really needs to be paired with a JIT compiler to make python a real array language, so NUMBA or another kernel language is required for Python to make the list.
Otherwise, users would not be able to write their own polymorphic kernels (`ufunc`s).

Similarly, JAX provides an array language base, but without a kernel language like Pallas it's not extensible enough.

## Automatic Bufferization

Automatic bufferization - most of the major ML frameworks have this, and it gives the compiler much more leeway.

## Compilation Step

Whether offline or online compilation, there needs to be a compilation step.
Part of the beauty of array languages is the language semantics, but the real power comes from the _ability to optimize_ around those semantics.

If a user adds two arrays together, it's imperative that a compiler is able to see the high-level information in the user's program and optimize around it.

## Value Semantics

## Compiler Reporting

Compiler optimizations are notoriously unreliable.
If there were a library that was as unreliable and opaque as most compilers, I do not believe users would be willing to adopt it.
In addition, most compiler reporting is built for compiler engineers, not users.
For a user to have any understanding of why their program is slow, they need to be able to understand the optimizations that the compiler is _not_ performing, and be able to inspect compiler logs.

A good example of this is the LLVM remarks framework - I find this framework indispensible for debugging performance issues, especially when paired with a profiling tool like linux `perf`.
Pairing up the hot paths in the profile with the remarks from the compiler gives a good indication of what the compiler is _not_ optimizing and why - but again this is built for compiler engineers, not users.

If a user finds that their C program is slow, they might look at Clang's optimization remarks and find that a function in their hot loop was not inlined because of the cost of the stack space taken up by the a function in the inner loop, or that dependence analysis failed because the user did not provide enough aliasing information to the compiler.
Even if they manage to dump the logs and use LLVM's remarks-to-html tool and generate a readable report of their program, they may still have problems finding actionable information in that report.
***User-facing optimization reports and hints are a must.***


<!-- Opt-out features:
- Automatic parallelization
- Automatic bufferization

Opt-in features:
- SIMT parallelism
- Manual memory management -->
