
~~~admonish example title="Table of Contents"

I tried to sesibly order these subsections, so if you're not at all familiar with
compiler optimizations I suggest you read them straight through.

[[_TOC_]]
~~~

# Tour of Optimizations

~~~admonish important
The most relevant and thorough source of information I've been able to find on
this subject is *Optimizing compilers for modern architectures: a dependence-based approach*
by Kennedy and Allen.

Your time may be better spent reading that book than reading this blog.
~~~

There are two categories I'll break the optimizations into:
some classic and more straightforward optimizations, and some trickier, more nuanced optimizations.
The latter are much more interesting to me, so I'll give them much more time in this article.
We'll take a tour of the simpler optimizations, but not deeper than what an introductory compilers course might give you.
Grabbing a compilers textbook off the shelf will likely tell you about the first category,
but the latter are usually found only in more specific resources or in the documentation of a specific compiler.

~~~admonish todo
- need to better categorize these
    - would like to make distinction between textbook opts, upstream type opts and downstream type opts
    - want to categorize in a theoretical sense, but also categorize similar to llvm so I can
        reuse llvm resources
~~~

## Generic Optimizations

You are likely to find these optimizations covered in great detail in 

### CFG (Control-Flow Graph) Simplification
### Forwarding + CSE (Common Subexpression Elimination)
### Compile-Time Unrolling

Notice that there's another 

### DCE (Dead Code Elimination)

## Optimization on Core Abstractions

In one of Chandler Carruth's talks on the LLVM optimizer[^carruth_opt], he points out three core abstractions used in software today.
We will use this as our delimiter between the well-studied, tranditional optimizations and the more nuanced
(and load-bearing, I would argue) optimizations.
This section is about the latter.

### Good-Neighbor Opts

I've further categorized these optimizations into *good-neighbor* optimizations and *true* optimizations;
the disctinction being the good-neighbor optimizations are really just making way for another optimization

Good-neighbor optimizations do not usually improve the performance or size of the generated code all that much,
but they are really good at enabling downstream optimizations (optimizations that run *latter*) at doing a better job.

#### Mem2Reg

***TODO***

#### Loop Canonicalization

This is not really an optimization, but it *is* a critical part of the optimization pipeline as a whole.
Generally, there are lots and lots of ways to express the exact same program.
If optimizations are looking for specific patterns however,
it's really useful to have one form that the optimizations know they can look for.

For example, you could write any comparison as an equality check `eq` or a not-equality check `neq`,
but nearly all optimizations are going to look out for `eq` and not all the combinations of boolean logic logically equivilant to an `eq`.
Putting the intermediate representation of the program into some regularized format
that the rest of the compiler optimization pipeline can rely on is critical
for getting the optimizations to trigger as frequently as is possible.

~~~admonish todo
- Loop canonicalization specifically
    - canonical preheader and backedge
~~~

#### LICM (Loop Invariant Code Motion)

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

This is a great example of why it's not necessarily difficult to *perform* many of these operations;
the lions share of the work is in determining whether it's *legal* and *profitable* to perform them.
Simply moving a pointer load out of a loop and into the preheader is not difficult;
checking to make sure it's legal may be!

This has a key side effect of making loop bodies as simple as possible.
The vectorizer, loop fusion, the unroller, and all kinds of ops will do a better job
the simpler the loop bodies are.

#### Inlining

~~~admonish quote title="Nikita Popov, lead maintainer of LLVM"
[Inlining] is the single most important optimization, really.[^nikic_opt]
~~~

### Vectorization

#### Versioning
***TODO***

#### VLA vs VLS
***TODO***

### Loop Fusion
***TODO***

### Loop Unrolling

~~~admonish todo
- distinction between runtime and compile time unrolling
- why is it harder to do other optimizations downstream?
~~~

<!--In the introductory section, I claimed that this is an exciting era to be working on compilers-->
<!--because the *free lunch* of direct hardware improvements-->
<!--(specifically per-core CPU improvements year-over-year(see Moore's Law)) is tapering off,-->
<!--and we need more advanced compiler and programming language technology to leverage today's-->
<!--hardware advances.-->
<!---->
<!--Exploiting the parallelism available in the user's program given the constraints of the-->
<!--programming langauge and the way the user described their program is how compilers and programming languages-->
<!--can and will leverage hardware advancement.-->

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
    - used to be more of an art, but becoming more of a science

- nature of an optimizer
    - pass structure
    - given ability to specify passes etc
    - big job of optimizer is to break code into easily recognizable patterns so rest of opts can know what to look for
        - pattern matching?


- HW/SW co-design
    - we want programming languages with abstractions that collapse down to really efficient code
    - everyone could write python where we have a struct representing a generic object with specialized calls for every operation you can conceive of,
    - or we can have a model for objects (and object lifetimes) that boils down to something closer to what the hardware expects
    - most software relies on a few abstractions
        - functions (func calls and the call graph)
        - memory (loads/stores)
        - iteration/loops
    - how to design langs and optimizers to boil those abstractions down to hardware

- break opts into categories?
    - show ops in godbolt on simple examples taken from test suite
    - fundamental well-known optimizations (roughly solved problems).
        most/all compilers need them at some level for the rest of the optimizations to work,
        but they're so well-studied and relatively straightforward to implement that they are less interesting to me

        - list:
            - GVN
            - DCE
            - Forwarding
            - CSE
            - constprop, GVN

        - many of the ops are less interesting to an optimizer that uses SSA internally
        - once the ir is in ssa, dataflow analysis and lots of other trickier
            optimizer issues become far more straightforward

    - more interesting opts work on those key abstractions.
        Ideally these abstractions are useful to the programmer but not to the program,
        and they can wiped away by the optimizer. no longer present in the program. Not always possible.
        - each of these opts has entire textbooks and fields of research dedicated to them.
        - function calls/call graph -> inliner
            - also: partial inlining, function specialization
            - very tough to tune, enables nearly every other optimization
            - loops with function calls can go from black boxes to vectorized/versioned/unrolled/unswitched/constprop'ed speedy things
            - issues with recursive funcs and cycles in the call graph more generally
            - becomes a graph problem on the callgraph
                - llvm uses bottom-up SCC based walk of the callgraph, GCC uses top-down approach
                - leverage graph theory to break the problem into smaller parts
            - once it's been decided that inlining can+should take place, it's sorta like textual substitution
            - compare this to the graphs a user builds in tensorflow, then passed to some TF compiler
                - that's how TF is sorta an AOT-compiled DSL within python
            - ***CONTEXT*** is key for many optimizations,
                inlining ideally gives them the context when possible
        - loops/iteration -> vectorizer
            - relies on inlining lot of the time
        - memory -> also vectorizer? sorta
            - SSA form abstracts this away from the optimizer SORTA
            - offers opter ability to pretend we have infinite registers to use,
                FE builds this abstraction for us, BE boils it down to actual registers and stack space
            - example llvm eliding alloca and memcpy etc
            - destructuring
                - *AFTER* you inline, might see that one field of the structure is never actually used! so can just get rid of it

~~~

---

[^kennedy]: [Optimizing compilers for modern architectures: a dependence-based approach, by Kennedy and Allen](https://dl.acm.org/doi/10.5555/502981)
[^racecar]: [High Performance Compilers for Parallel Computing](https://dl.acm.org/doi/10.5555/572937)
[^cs6120]: [Cornell CS 6120: Advanced Compilers](https://www.cs.cornell.edu/courses/cs6120/2023fa/)
[^rustc]: [Rust MIR](https://blog.rust-lang.org/2016/04/19/MIR.html)
[^ee663]: [EE663: Optimizing Compilers](https://engineering.purdue.edu/~eigenman/ECE663/Handouts/ece663slides.pdf)
[^mwolfe_blog]: [Detecting Divergence Using PCAST to Compare GPU to CPU Results](https://developer.nvidia.com/blog/detecting-divergence-using-pcast-to-compare-gpu-to-cpu-results/)
[^compilerres]: [gist.github.com/chiehwen: Compiler Learning Resources](https://gist.github.com/chiehwen/6c1872fc687a4b198ec9)
[^llvm_licm]: [LICM.cpp - Loop Invariant Code Motion Pass](https://llvm.org/doxygen/LICM_8cpp_source.html)
[^llvm_pass_ordering]: [LLVM: The middle-end optimization pipeline by @nikic](https://www.npopov.com/2023/04/07/LLVM-middle-end-pipeline.html)
[^cmu]: [CMU: 15-745 Optimizing Compilers for Modern Architectures](https://www.cs.cmu.edu/afs/cs/academic/class/15745-s19/www/index.html)
[^carruth_opt]: [Understanding Compiler Optimization - Chandler Carruth - Opening Keynote Meeting C++ 2015](https://www.youtube.com/watch?v=FnGCDLhaxKU&list=WL&index=1)
    - inlining at 28m
[^plres]: [PL resources from a personal blog](https://bernsteinbear.com/pl-resources/)
[^nikic]: [Nikita Popov's Blog (nikic)](https://www.npopov.com/)
    - Nikita is the primary reviewer for LLVM's optimizer. His blog is a great resource.
    - [^nikic_2023]: [Nikita's 2023 Year in Review blog](https://www.npopov.com/2024/01/01/This-year-in-LLVM-2023.html)
    - [^nikic_opt]: [2023 EuroLLVM - Tutorial: A whirlwind tour of the LLVM optimizer](https://youtu.be/7GHXDEIMGIY?si=34z8FA0M4b5Cr6ym)
    - [^nikic_canon]: [LLVM: Canonicalization and target-independence](https://www.npopov.com/2023/04/10/LLVM-Canonicalization-and-target-independence.html)
