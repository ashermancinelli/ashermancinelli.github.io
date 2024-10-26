
[[_TOC_]]

# Common Optimizations

## LICM

LICM identifies instructions that produce the same result each time the loop is executed
and moves them to the loop preheader block, so they are only executed once rather than on every loop iteration.

In this example, the load of %A is loop invariant because %A is never modified inside the loop.
LICM would hoist this load out of the loop into the preheader block:

```llvm
define i32 @foo(i32 %n, i32* %A) {
entry:
  br label %loop

loop:
  %i = phi i32 [0, %entry], [%i.next, %loop]

  %x = load i32, i32* %A
  ^^^^^^^^^^^^^^^^^^^^^^ can be *hoisted*

  %y = add i32 %x, %i
  store i32 %y, i32* %A
  %i.next = add i32 %i, 1
  %cond = icmp slt i32 %i.next, %n
  br i1 %cond, label %loop, label %exit

exit:
  ret i32 %y
}
```

case when it's not safe:
```c
void foo(int * arr, int N, int * ptr, int default) {
    for (int i=0; i < N; i++) {
        if (flag) {
            arr[i] = *ptr
            //       ^    This load happens on every loop iteration.
            //            Is it safe to hoist? No!
        } else {
            arr[i] = default;
        }
    }
}
```


## CFG Simplification

## Inlining

## Forwarding + CSE

## Vectorization

## Unrolling

## DCE

## Parallelism

In the introductory section, I claimed that this is an exciting era to be working on compilers
because the *free lunch* of direct hardware improvements
(specifically per-core CPU improvements year-over-year(see Moore's Law)) is tapering off,
and we need more advanced compiler and programming language technology to leverage today's
hardware advances.

Exploiting the parallelism available in the user's program given the constraints of the
programming langauge and the way the user described their program is how compilers and programming languages
can and will leverage hardware advancement.

<!--Some amount of *lowering* is often also implied, meaning the code gets a bit lower-level as it flows through the compiler.-->
<!--This is necessarily true for some optimizations (...).-->

~~~admonish todo
4. ME
    1. Most reusable component
    1. Look at all the llvm fes and bes; its bc the me is so reusable
    1. IRs
    1. Parts
        1. Passes
            1. Factorio/dsp metaphore
            2. Program flows downstream, some factory is filtering for certain operations and transforming the matches
        2. Progressive lowering?
            1. Mlir
    1. Go through textbook optimizations 
        1. LICM
        1. SimplifyCFG
        1. Inliner
        1. Forwarding + CSE
        1. Vectorization
        1. Unrolling
        1. DCE
        1. Fusion
            1. Look at perf profile of code with and without each optimization

- example of factorio/dyson sphere project pickers/sorters for ast matchers
    - sorters watching the input ir on a belt
    - picking matching asts out of the program, performing some optimization

- how are passes ordered?
    - mostly just what seems to work well, and some intuition
    - e.g. the compiler engineer is given some user code that doesn't run as fast as they
        want it to. The compiler engineer notices that an optimization isn't being
        triggered because it relies on another optimization running first, so it's moved to the end.
        and so on.

- nature of an optimizer
    - pass structure
    - given ability to specify passes etc

~~~

---

[^cs6120]: [Cornell CS 6120: Advanced Compilers](https://www.cs.cornell.edu/courses/cs6120/2023fa/)
[^rustc]: [Rust MIR](https://blog.rust-lang.org/2016/04/19/MIR.html)
[^ee663]: [EE663: Optimizing Compilers](https://engineering.purdue.edu/~eigenman/ECE663/Handouts/ece663slides.pdf)
[^racecar]: [High Performance Compilers for Parallel Computing](https://dl.acm.org/doi/10.5555/572937)
[^mwolfe_blog]: [Detecting Divergence Using PCAST to Compare GPU to CPU Results](https://developer.nvidia.com/blog/detecting-divergence-using-pcast-to-compare-gpu-to-cpu-results/)
[^compilerres]: [gist.github.com/chiehwen: Compiler Learning Resources](https://gist.github.com/chiehwen/6c1872fc687a4b198ec9)
[^llvm_licm]: [LICM.cpp - Loop Invariant Code Motion Pass](https://llvm.org/doxygen/LICM_8cpp_source.html)
