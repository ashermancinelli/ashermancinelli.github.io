# Representing VOLATILE in Flang's IR
_2025-07-22_

~~~admonish tip title="_TL;DR_"
We represent volatile variables in the Flang compiler differently than some other compilers.
This post discusses why.

Folks working on the frontend also contributed to volatile support in the compiler; this post is just about the middle-end.
~~~

Prior to Spring of 2025, the LLVM Flang Fortran compiler did not support the `VOLATILE` keyword.
Some uses would result in a _Not Yet Implemented_ error, and others would silently produce code that treated the entities as non-volatile.
[This is the RFC](https://discourse.llvm.org/t/rfc-volatile-representation-in-flang/85404) where myself and some other Flang folks discussed our strategy for adding support for `VOLATILE`.

Lots of other compilers and IRs even within the MLIR project don't represent `VOLATILE` in the same way.
Most IRs use a an attribute on the _operations_ on a volatile entity to represent volatility.
This is a great match for the C++ standard library's `std::atomic` types, which wrap some memory with atomic access operations:

```cpp
std::atomic<int> x;
x += 5; // atomic read, atomic write
```

_Note: an atomic variable is not the same thing as a volatile variable, but the semantics are close enough that the comparison is helpful for this discussion._

With `std::atomic`, the atomicity is a wrapping type which guards access to the underlying memory.

Contrast this with out the MLIR dialects for ClangIR, LLVM IR and others represent volatility; [ the _operations_ have an attribute indicating volatility ](https://mlir.llvm.org/docs/Dialects/LLVM/#llvmstore-llvmstoreop):

```mlir
// A volatile store of a float variable.
llvm.store volatile %val, %ptr : f32, !llvm.ptr
```

Why was this not the right choice for Flang?

# The Cost of Representing Volatility on Operations

We decided to represent volatility on the _type_ of the _entity_ rather than the operations modifying that memory.
As I've discussed before, the IRs inside Flang are (at times) very high-level.
We have unbufferized Fortran entities and we perform high-level analyses on them.

[Say we perform a matrix-multiply on an array:](https://godbolt.org/z/EW34394KM)
```fortran
subroutine s(a,b,n)
  integer::n
  real,dimension(n,n),intent(inout)::a
  real,dimension(n,n),intent(in)::b
  a=matmul(a,b)
end subroutine
```

This is represented in the IR as (simplified):
```mlir
func.func @_QPs(%arg0: !fir.ref<!fir.array<?x?xf32>> {fir.bindc_name = "a"}, %arg1: !fir.ref<!fir.array<?x?xf32>> {fir.bindc_name = "b"}, %arg2: !fir.ref<i32> {fir.bindc_name = "n"}) {
    %n = hlfir.declare %arg2 {uniq_name = "_QFsEn"} : (!fir.ref<i32>) -> (!fir.ref<i32>, !fir.ref<i32>)
    %nxn_shape = fir.shape (%n, %n) -> (index, index)
    %a = hlfir.declare %arg0(%nxn_shape) : (!fir.ref<!fir.array<?x?xf32>>) -> (!fir.box<!fir.array<?x?xf32>>, !fir.ref<!fir.array<?x?xf32>>)
    %b = hlfir.declare %arg1(%nxn_shape) : (!fir.ref<!fir.array<?x?xf32>>) -> (!fir.box<!fir.array<?x?xf32>>, !fir.ref<!fir.array<?x?xf32>>)
    %temp = hlfir.matmul %a %b : (!fir.box<!fir.array<?x?xf32>>, !fir.box<!fir.array<?x?xf32>>) -> !hlfir.expr<?x?xf32>
    hlfir.assign %temp to %a : !hlfir.expr<?x?xf32>, !fir.box<!fir.array<?x?xf32>>
    return
}
```

If we introduced volatility as a bit on the operations themselves, would we then need to add a bit to _every operation_ that reads or writes to a volatile entity?
In the LLVM dialect, the authors only needed to add a bit to the `store` and `load` operations.
Because Flang has such high-level representations of Fortran operations and entities, representing volatile in this way would incur a cost on _every single_ new high-level operation.

Imagine how fragile this would be in the compiler; it would be extremely easy for a developer to add a new operation for their needs and forget to add volatility to it.

Consider also the cost of representing volatility on the operations themselves during lowering; every single operation that produces new (typically lower-level) operations would need to check for the volatility attribute and set the appropriate attributes on the new operations.

# The Safety of Representing Volatility on Operations

How can we be sure that after introducing volatility handling, we don't silently forget to propagate the semantics to lower-level code?
There are loads of conversion routines in Flang and upstream dialects that Flang uses, and we need some level of assurance that when we introduce a volatile variable, the lowest-level code (the LLVM IR) has the appropriate semantics.
Even if we represent volatility is an attribute on every single HLFIR-level operation, it would be extremely easy accidentally forget to propagate these semantics to LLVM IR.

# The Benefits of Representing Volatility on Types

The solution we eventually settled on was to represent volatility on the _type_ of the entity rather than the operations modifying that memory.

[Let's take another look at our matrix-multiply example, but this time, `a` will be volatile:](https://godbolt.org/z/n4z6YxEa9)
```fortran
subroutine s(a,b,n)
  integer::n
  real,dimension(n,n),intent(inout),volatile::a
  real,dimension(n,n),intent(in)::b
  a=matmul(a,b)
end subroutine
```

This is represented in the IR as (simplified):
```mlir
    %temp = hlfir.matmul %a %b
        : (!fir.box<!fir.array<?x?xf32>, volatile>, !fir.box<!fir.array<?x?xf32>>)
        -> !hlfir.expr<?x?xf32>
    hlfir.assign %temp to %a : !hlfir.expr<?x?xf32>, !fir.box<!fir.array<?x?xf32>, volatile>
```

See the `volatile` attribute on the SSA value representing `a`.
Rather than having an attribute on the `matmul` operation, we can simply check the type of the entity during lowering to see if one of our operands was volatile.
Developers do not need to consider volatile in the _construction_ of their operations, however they are forced to consider it during lowering and conversion patterns.

We forced operations to consider volatility in lowering and conversion patterns by adding a check in their verifiers.
When an operation in Fir or HLFIR is created, a verification checks that the volatility of the input and output types are consistent.

This went a long way in enforcing safety and correct behavior in the compiler: after enabling the initial volatile support _without_ verification enabled, I would run the test suite with the extra verification enabled and each time a test would fail, we would get an error message indicating that an operation was created with input operands with types that did not match the output type's volatility.
The obvious next step was to walk through the optimization pass that created the operation and look for where it was created.
This iterative process of opt-in type safety checks made the development process extremely smooth.

# Representing Volatility in MLIR Memory Effects

In MLIR, operations have _memory effects_, which inform other components of the compiler how a given operation interacts with different memory _resources_.

An interesting property of volatile entities is that they _can_ be reordered with respect to other operations, just _not other volatile_ operations.
[My colleague pointed this out on the pull request for initial volatile support in the optimizer.](https://github.com/llvm/llvm-project/pull/132486#discussion_r2010515969)

We handled this by adding a new [_memory resource_](https://mlir.llvm.org/docs/Rationale/SideEffectsAndSpeculation) to Flang.

Typically, memory effects are considered in relation to the memory they effect.
For example, it may be completely safe to reorder a load operation and a store operation so long as they don't access the same memory.
For example, a `memref.load` indicates that it reads from the memory given as its operand.

Volatile is handled differently in Flang though - not only do operations on volatile types have memory effects in relation to the memory they access, but they also have memory effects in relation to other volatile operations.
This was modeled by _also_ reporting read/write effects to the abstract volatile memory resource.
One may imagine the volatile memory resource as a far-off chunk of memory that the compiler does not have access to, and therefore can't reason about in optimization passes.
This means whenever some operations interact with memory and one of their operands is volatile, the compiler must assume that the operations touch the far-off chunk of memory, and therefore they may not be reordered with respect to each other.

[The full memory effects that LLVM considers volatile memory to have are actually quite interesting.](https://llvm.org/docs/LangRef.html#volatile-memory-accesses)

<!--  
TODO: conversion routines, optimization passes, runtime calls, communication of memory effects
-->
