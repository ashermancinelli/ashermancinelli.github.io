
# Ideal Array Language

What do I think the ideal array language should look like?

- [Ideal Array Language](#ideal-array-language)
- [Why does this matter?](#why-does-this-matter)
- [User-Extensible Rank Polymorphism](#user-extensible-rank-polymorphism)
- [Value Semantics and Automatic Bufferization](#value-semantics-and-automatic-bufferization)
  - [Fortran's Array Semantics](#fortrans-array-semantics)
  - [Comparison with MLIR Types and Concepts](#comparison-with-mlir-types-and-concepts)
  - [Fortran Array Semantics in MLIR](#fortran-array-semantics-in-mlir)
  - [Aside: Dependent Types in Fortran](#aside-dependent-types-in-fortran)
- [Compilation Step](#compilation-step)
  - [Offline vs Online Compilation](#offline-vs-online-compilation)
- [Compiler Transparency and Inspectability](#compiler-transparency-and-inspectability)
  - [Example: NVHPC's User-Facing Optimization Reporting](#example-nvhpcs-user-facing-optimization-reporting)
- [SIMT and Automatic Parallelization](#simt-and-automatic-parallelization)
  - [Why Parallelism Matters](#why-parallelism-matters)
  - [SIMT vs SIMD](#simt-vs-simd)
  - [Default Modes of Parallelism](#default-modes-of-parallelism)
- [Array-Aware Type System](#array-aware-type-system)

# Why does this matter?

Hardware is changing very quickly, and programming languages and runtimes need to designed with these changes in mind.
See section [Why Parallelism Matters](#why-parallelism-matters) for more thoughts.

# User-Extensible Rank Polymorphism

IMO this is what makes something an array language.
No language can be an array language without rank polymorphism.

Some languages have rank polymorphism, but I wouldn't necessarily call them array languages.

Numpy provides _some_ rank polymorphism, but it's not a first-class _language_ feature.
Numpy also needs to be paired with a JIT compiler to make python a real array language, so NUMBA or another kernel language is required for Python to make the list.
Otherwise, users would not be able to write their own polymorphic kernels (`ufunc`s).

Similarly, JAX provides an array language base, but without a kernel language like Pallas it's not extensible enough.

# Value Semantics and Automatic Bufferization

Most of the major ML frameworks have value semantics for arrays by default, and it gives the compiler much more leeway when it comes to memory.
Not only is manual memory management a huge pain and a source of bugs, if the ownership semantics are not sufficiently represented in the language or the language defaults are not ammenable to optimization, the compiler will have a much harder time generating performant code.

My understanding of the Rust borrow checker is that its purpose is to handle the intersection of manual memory management and strict ownership.
Value semantics allows the compiler to decide when to copy or borrow for the vast majority of cases, with the convenient knock-on effect that the user does not need to keep ownership semantics in their head (unless they opt in to it).

## Fortran's Array Semantics

In a way, value semantics and automatic bufferization of arrays is part of why Fortran compilers are able to generate such performant code.

When you use an array in Fortran, you are not just getting a pointer to a contiguous block of memory.
If you access an array from C FFI, you get access to an _array descriptor_ or a _dopevector_ which contains not only the memory backing the array, but also rich shape, stride, and bounds information.

This is not always how the array is represented in the final program however; because the low level representation of the array is only revealed to the user if they ask for it, the compiler is able to optimize around it in a way that is not possible with C.

In C, the compiler _must assume arrays alias each other_ unless the user provides explicit aliasing information.
In Fortran, it is exactly the opposite: unless the user informs the compiler that they formed a pointer to an array, the compiler can assume that the array has exclusive ownership.
The language rules dictate that function arguments may not alias unless the user explicitly declares them to be aliasing.
This means the compiler can optimize around array operations in a way that is only possible in C with lots of extra effort from the user.

Additionally, Fortran represents rank polymorphism natively.
Just like Numpy universal functions (`ufunc`s), Fortran has the concept of `ELEMENTAL` procedures which can be called on arrays of any rank.

## Comparison with MLIR Types and Concepts

[MLIR](https://mlir.llvm.org/) is the compiler infrastructure backing many of the major ML frameworks.
I won't go too deep into MLIR here, but many of the components of MLIR are designed to handle array descriptors and their associated shape, stride, and bounds information in various intermediate representations.

~~~admonish note title="Intermediate Representations"
An intermediate representation (IR) is the language used inside of a compiler to represent the program.
There are often several IRs in a compiler, each with a different purpose and possibly different semantics.

MLIR provides infrastructure for heterogeneous IRs, meaning many different IRs can co-exist in the same program.
These IRs are called dialects, and each dialect defines its own operations and types, and often conforms with semantics defined in the core of MLIR so they can compose with other dialects that are not specific to the project.
~~~

MLIR has a few array representations, most prominently the `memref` and `tensor` types, `tensor` being the more abstract, unbufferized version of a `memref`.
The process of _bufferizing_, or converting ops with tensor semantics to ops with memref semantics ([described here](https://mlir.llvm.org/docs/Bufferization/)) is how abstract operations on arrays are converted to a more concrete representation with explicit memory backing.

One might consider the `tensor` dialect to be a purely functional, un-bufferized array programming language that is primarily _internal_ to the compiler.
In fact, [see this quote from Chris Lattner](https://pldb.io/blog/chrisLattner.html):

~~~admonish quote
_What languages changed the way you think?_

I would put in some of the classics like Prolog and APL. APL and Prolog are like a completely different way of looking at problems and thinking about them.

I love that, even though it's less practical in certain ways. Though all the ML compilers today are basically reinventing APL.
~~~

Array languages lend themselves to compilation for a few reasons:
- The lack of bufferization is a great match for compiler optimizations; if the buffers do not exist in the user's program, the compiler can optimize them and sometimes get rid of them entirely.
- Functional array langauges are a closer match to the internal representation of array programs in many compilers, particularly MLIR-based ones.
    - The buffers are left entirely up to the compiler
    - Most modern compilers use [SSA form for their internal representation](https://en.wikipedia.org/wiki/Static_single-assignment_form), meaning every "value" (virtual register) is assigned to exactly once.
    - For example, to set an element in `tensor`-land, one must create an entirely new tensor. Which operations actually result in a new buffer being created is left up to the compiler.

Take this example from the MLIR docs:

```mlir
%r = tensor.insert %f into %t[%idx] : tensor<5xf32>
```

The the tensor with `%f` inserted into the `%t` tensor at index `%idx` is `%r`: an entirely new tensor.
Compare this with the bufferized version in the `memref` dialect:
```mlir
memref.store %f, %t[%idx] : memref<5xf32>
```

The `memref.store` operation has _side effects_ and the backing memory is modified in place.
This is a lower-level representation, and typically harder to reason about.
The compiler may have to consider if the memory escaped the current scope before modifying it in place, for example.
The higher-level `tensor` dialect is much closer to function array programming languages, so a functional array language is a great match for an optimizing compiler.

<!-- ~~~admonish todo
- lattner apl mlir https://pldb.io/chrisLattner.html
- An interview with Chris Lattner
- Why compilers lend themselves to functional? Bc ssa format, can only deal with values, but then have special language for loads/stores, sorta like refs in ocaml where you got special language for interacting with memory in that way
- Why pointer chasing so much more expensive?
~~~ -->

## Fortran Array Semantics in MLIR

The LLVM Flang Fortran compiler was one of the first users of MLIR in the world outside of ML frameworks.
Flang has two primary MLIR dialects for representing Fortran programs: `hlfir` and `fir`, or high-level Fortran intermediate representation and Fortran intermediate representation, respectively.

`hlfir` initially represents Fortran programs that are _not bufferized_, meaning the compiler can optimize around array operations without considering the details of memory management, except when required by the user's program.

Take this Fortran program:
```fortran
subroutine axpy(a, b, c, n)
  implicit none
  integer, intent(in)    :: n
  real,    intent(in)    :: a(n,n), b(n,n)
  real,    intent(inout)   :: c(n,n)
  c = a * b + c
end subroutine
```

[At this godbolt link](https://godbolt.org/z/sMWvMoo5M), we can see the IR for this program after every compiler pass in the bottom-right panel, which is MLIR in the `hlfir` and `fir` dialects.

A savy reader might notice that the `hlfir` dialect is not bufferized, meaning the memory backing the arrays is not represented in the IR.
The language semantics give the compiler this freedom.

After each pass, the IR is dumped with this message: `IR Dump After <pass name>`.
If you search for `IR Dump After BufferizeHLFIR`, you can see the IR after the compiler pass that introduces memory to back a temporary array used to calculate the result.

If you then turn the optimization level up to `-O3` by changing the compiler flags in the top-right, you can search for the pass `OptimizedBufferization` which leverages the language semantics to reduce and reuse memory in the program, and you'll notice that the temporary array is no longer present in the IR.

An ideal array language should be able to represent this kind of dynamic shape information in the type system and leave space for the compiler to perform these sorts of optimizations.

## Aside: Dependent Types in Fortran

You may have also noticed that the shapes of the matrices passed to the function are dynamic - the parameter `n` is used to determine the shape of the arrays.

In the IR dumps, you can see that the shapes are used to determine the types of the arrays _at runtime_; the types of the arrays depends on the parameter passed into the function.

This is represented in the IR like this:
```mlir
func.func @_QPaxpy(
    %arg0: !fir.ref<!fir.array<?x?xf32>> {fir.bindc_name = "a"}, // ...
    ) {
    // ...
    %12 = fir.shape %6, %11 : (index, index) -> !fir.shape<2>
    %13:2 = hlfir.declare %arg0(%12)
                {fortran_attrs = #fir.var_attrs<intent_in>, uniq_name = "_QFaxpyEa"}
                : (!fir.ref<!fir.array<?x?xf32>>, !fir.shape<2>, !fir.dscope)
                -> (!fir.box<!fir.array<?x?xf32>>, !fir.ref<!fir.array<?x?xf32>>)
```

# Compilation Step

Whether offline or online compilation, there needs to be a compilation step.
Part of the beauty of array languages is the language semantics, but the real power comes from the _ability to optimize_ around those semantics.

If a user adds two arrays together, it's imperative that a compiler is able to see the high-level information in the user's program and optimize around it.

## Offline vs Online Compilation

One might argue for either offline compilation (like Fortran, with an explicit compilation step) or online compilation (like Python, where the compiler is invoked at runtime).
For workloads with very heavy compute, it is likely that the process driving the computation can outpace the hardware, meaning it is not very costly to have the compiler invoked while the program is running.

It can be quite a downside to have the compiler on the hotpath, especially for smaller programs where it might become a bottleneck.
Compilers built for offline compilation can often get away with suboptimal performance.
As long as users can lauch `make -j` and get their program back after grabbing a coffee, it's not usually a big deal.
Online compilation introduces an entirely new set of challanges, but the lower barrier to entry for users may be worth it.

All major ML frameworks driven by Python make this tradeoff, for example.

<!-- ```admonish todo
- Offline v online compilation. As long as you can drive your heavy units of compute, it doesnt matter which model you use, but you do get the downside of putting the compiler on the hotpath with online compilation. Can sorta get away with a lot in offline. Users will make and forget unless its egregious.
``` -->

# Compiler Transparency and Inspectability

Compiler optimizations are notoriously unreliable.
If there were a library that was as unreliable and opaque as most compilers, I do not believe users would be willing to adopt it.
In addition, most compiler reporting is built for compiler engineers, not users.
For a user to have any understanding of why their program is slow, they need to be able to understand the optimizations that the compiler is _not_ performing, and be able to inspect compiler logs.

A good example of this is the LLVM remarks framework - I find this framework indispensible for debugging performance issues, especially when paired with a profiling tool like linux `perf`.
Pairing up the hot paths in the profile with the remarks from the compiler gives a good indication of what the compiler is _not_ optimizing and why - but again this is built for compiler engineers, not users.

If a user finds that their C program is slow, they might look at Clang's optimization remarks and find that a function in their hot loop was not inlined because of the cost of the stack space taken up by the a function in the inner loop, or that dependence analysis failed because the user did not provide enough aliasing information to the compiler.
Even if they manage to dump the logs and use LLVM's remarks-to-html tool and generate a readable report of their program, they may still have problems finding actionable information in that report.
***User-facing optimization reports and hints are a must.***

## Example: NVHPC's User-Facing Optimization Reporting

This is one of my favorite features of the NVHPC compilers - they all have a user-facing optimization reporting framework.
Adding `-Minfo=all` and `-Mneginfo=all` to the command line gives a detailed report of the optimizations that the compiler is performing, optimizations that were missed, and why.

[Take this C code for example](https://godbolt.org/z/b4ePMK7zo):

```c
void add_float_arrays(const float *a,
                      const float *b,
                            float *c,
                      size_t n)
{
    for (size_t i = 0; i < n; ++i) {
        c[i] = a[i] + b[i];
    }
}

// -Minfo output:
// add_float_arrays:
//       8, Loop versioned for possible aliasing
//          Generated vector simd code for the loop
//          Vectorized loop was interleaved
//          Loop unrolled 4 times
```

It doesn't take too savy of a user to see the `Loop versioned for possible aliasing` remark and wonder _"Well, how do I tell the compiler that these arrays are not aliasing?"_

Of course, annotating the arrays with `restrict` gives the compiler this information:
```c
void add_float_arrays(const float *restrict a,
                      const float *restrict b,
                            float *restrict c,
                      size_t                n)
{
    for (size_t i = 0; i < n; ++i) {
        c[i] = a[i] + b[i];
    }
}

// -Minfo output:
// add_float_arrays_restrict:
//      20, Generated vector simd code for the loop
//          Vectorized loop was interleaved
```

Of course, the language semantics should be enough to tell the compiler that arrays in a function like this do not alias, but this is an example of what friendly user-facing compiler reporting looks like, in my opinion.

# SIMT and Automatic Parallelization

## Why Parallelism Matters

The fundamental units of computation available to users today are not the same as they were 20 years ago.
When users had at most a few cores on a single CPU, it made complete sense that every program was written with the assumption that it would only run on a single core.

Even in a high-performance computing (HPC) context, the default mode of parallelism was (for a long time) the Message Passing Interface (MPI), which is a _descriptive_ model of multi-core and multi-node parallelism.
Most code was still basically written with the same assumtions: all units of computation were assumed to be uniform.

Hardware has trended towards heterogeneity in several ways:

- More cores per node
- More nodes per system
- More kinds of subsystems (GPUs, FPGAs, etc.)
- More kinds of computational units on a single subsystem
    - CPUs have lots of vector units and specialized instructions
    - NVIDIA GPUs have lots of tensor cores specialized for matrix operations
- New paradigms at the assembly level
    - Scalable Vector Extensions (SVE) and Scalable Matrix Extensions (SMEs) on Arm
- Tight hardware release schedules, meaning less and less time in between changes in hardware and more and more rewrites required for hand-written code at the lowest level

The old assumptions do not hold true anymore, and programming languages need to be aware of these changes and able to optimize around them.

Imagine the units of computation available in 2025 as a spectrum from SIMD units, to tensor cores, to CUDA cores, to small power-efficient Arm CPU cores, to large beefy AMD CPUs.
It is easy to imagine this spectrum filling in with more specialized hardware pushing the upper and lower boundaries and filling in the gaps.
One day it might be as natural to share work between nodes as it is between individual SIMD lanes on a single CPU core.
This level of heterogeneity is not something that can be ignored by a programming language or a programming language ecosystem.
I believe languages and compilers that do not consider the trajectory of hardware development will be left behind to some degree.

## SIMT vs SIMD

SIMT is a programming model that allows for parallel execution of the same instruction on multiple threads.
Users typically write a function which recieves a thread identifier, performs operations on data, and writes to an output parameter.
It is nearly impossible to _not_ achieve parallelism with SIMT; once you have described your function in this way, the compiler has to do not other work in order to achieve **parallelism**.
SIMT kernels often operate in _lockstep_, meaning that every instruction in a SIMT kernel is executed _by every thread_, but instructions in a thread that is not _active_ are not committed to memory.

In this example, _every thread_ executes _both_ the `if` and the `else` branches, but only threads that are active in either region will actually write to `pointer`.

```python
if thread_id < 2:           # [1, 1, 1, 1] - all threads active
    pointer[thread_id] = 1  # [1, 1, 0, 0] - 2 active threads
else:
    pointer[thread_id] = 2  # [0, 0, 1, 1] - 2 active threads
```

So, the user may write a _divergent_ (meaning lots of `if`/`else` branches that differ between threads) or otherwise suboptimal program, but they do not have to worry about whether parallelism was achieved or not.

SIMD is a programming model that allows for parallel execution of the *S*ame *I*nstruction on *M*ultiple *D*ata elements.

Unless users achieve SIMD by writing platform-specific intrinsics directly by specifying they want to use a particular assembly instruction to add two vectors of 8 32-bit floats together, they are relying on the compiler to generate the SIMD code for them.

The lack of trust in compiler to generate near-optimal SIMD code was a major hurdle to adoption.
Users savy enough to write their own assembly were always able to take advantage of the latest hardware, but this basically necessitates rewriting their code each time they want to leverage a new hardware target.

I believe SIMT was a part of the success of the CUDA programming model in part because of how reliably it achieves parallelism ([Stephen Jones discusses this in his 2025 GTC talk](https://youtu.be/GmNkYayuaA4?si=7ZDmisps4eHxMgr3), [and this talk on scaling ML workloads had some interesting points too](https://www.youtube.com/watch?v=139UPjoq7Kw)).
With CUDA, users described their programs in terms of SIMT kernels, functions which execute in parallel.

With that in mind, in my ideal array language, users must be able to _opt in to SIMT programming_, but _achieve_ SIMT programming through automatic parallelization.

## Default Modes of Parallelism

In this ideal language, a _descriptive_ paradigm for parallelism should be the default while allowing users to opt in to a more _prescriptive_ paradigm if they desire.
A descriptive model should be the default because it gives the compiler a huge amount of flexibility without putting a large burden on the user.

Users should be able to write SIMT kernels with really specific information about how the compiler should map the code to the hardware, while relying on automatic parallelization for most cases.

# Array-Aware Type System

The type system should be able to represent the shape, stride, and bounds of an array with automatic type inference.
I think the flexibility of OCaml's type system would be a nice match.
Type annotations are not needed, but they are available if users or library authors would like to opt in to stricter constraints.
Some Hindley-Milner style type inference giving users the ability to opt in to type declarations while allowing the compiler to infer types and optimizer around array information when it's available would be ideal.
This may be paired with a high-level LTO compilation system that allows the compiler to perform whole-program optimizations and infer more array information in the type system may allow for more aggressive optimizations.

[This PLDI 2025 talk on representing array information in the type system](https://www.youtube.com/watch?v=3Lbs0pJ_OHI) was really interesting - I don't know if it's my ideal, but it was fun to watch someone explore the space.

<!-- Opt-out features:
- Automatic parallelization
- Automatic bufferization

Opt-in features:
- SIMT parallelism
- Manual memory management -->
