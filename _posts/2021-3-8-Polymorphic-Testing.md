---
layout: post
title: Some Polymorphism for your Test Suite
permalink: /poly-testing
---

Design principles apply to your tests more often then you might think!

## Intro

When designing tests, qualities like code reuse, readability, and execution time
are not often considered.
In this post, I'll look at how we designed the test suite for
[HiOp](https://github.com/LLNL/hiop), a high performance optimization solver.
Credit for the design goes to [Slaven Peles](https://www.linkedin.com/in/slavenpeles/)
and the [Sundials](https://github.com/LLNL/sundials) team.

HiOp's unit test suite was crucial for the following reasons:

1. We needed to be sure our linear algebra library would perform as expected
  after porting the entire thing to use [RAJA](https://github.com/LLNL/RAJA)
  portability library, and
1. Our timelines were quite aggressive, considering the size of our team and
  the scope of our porting efforts.

For these reasons, we needed to develop a thorough suite of unit tests to
*verify execution* of our linear algebra kernels after porting to leverage GPU
devices with an extremely quick turnaround time.
*Code reuse and readability were crucial to our development effort*.

## Problem Domain and Design Decisions

HiOp's linear algebra library uses a clean inheritance structure.
Looking at the `hiopVector` abstract interface for example, there are two
implementations, `hiopVectorRajaPar` and `hiopVectorPar`, as seen below:

```mermaid!
classDiagram
  hiopVector <|-- hiopVectorPar
  hiopVector <|-- hiopVectorRajaPar
```

Before we had written the `hiopVectorRajaPar` implementation, we had to establish
success criterea for our implementation in the form of unit tests and integration
tests.
When we began, we had exactly zero unit tests, so again, code reuse and
developer productivity would be very important.

We settled on a unit testing structure that would mimick the inheritance
design already in place with the linear algebra library.
Test classes would mirror the system under test such that tests for concrete
classes would inherit from test classes for the abstract interfaces.

Let's use the `hiopMatrix` class as an example.

## `hiopMatrix` Example

The top-level interface for HiOp matrices is the `hiopMatrix` pure virtual class.
The `hiopMatrixDense` and `hiopMatrixSparse` pure virtual classes are children
of `hiopMatrix`.

```mermaid!
classDiagram
  hiopMatrix <|-- hiopMatrixDense
  hiopMatrix <|-- hiopMatrixSparse

  class hiopMatrix {
    <<interface>>
  }
  class hiopMatrixDense {
    <<interface>>
  }
  class hiopMatrixSparse {
    <<interface>>
  }
```

From there, each of the two abstract children have regular CPU-bound
implementations and RAJA-based GPU/OpenMP implementations:

```mermaid!
classDiagram
  hiopMatrix <|-- hiopMatrixDense
  hiopMatrix <|-- hiopMatrixSparse

  hiopMatrixSparse <|-- hiopMatrixSparseTriplet
  hiopMatrixSparse <|-- hiopMatrixRajaSparseTriplet

  hiopMatrixDense <|-- hiopMatrixRajaDense
  hiopMatrixDense <|-- hiopMatrixDenseRowMajor

  class hiopMatrix {
    <<interface>>
  }
  class hiopMatrixDense {
    <<interface>>
  }
  class hiopMatrixSparse {
    <<interface>>
  }
```

At each level in this inheritance structure, new methods are added to the interfaces.
For example, due to memory layout constraints, some methods are feasable only with a
`hiopMatrixDense` and do not make much sense in a sparse matrix.
Thus not all tests for `hiopMatrixDense` apply to `hiopMatrixSparse`.

To maximize code reuse, we developed the following inheritance structure for our tests:
`TestBase` was the

## References

1. [Slaven Peles's GitHub profile](https://github.com/pelesh)
1. [Original PR for HiOp's polymorphic test suite](https://github.com/LLNL/hiop/pull/41)
1. [HiOp](https://github.com/LLNL/hiop)
1. [HiOp's current linear algebra test suite](https://github.com/LLNL/hiop/tree/master/tests/LinAlg)
1. [Sundials test suite](https://github.com/LLNL/sundials/tree/master/test/unit_tests/arkode)
