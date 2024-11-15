# Intermediate Representations

Recall the most brief description of a compiler thus far: *a translator between two textual formats*.

The *intermediate representation* is one step along the way from the source format to the target format.

Another way to think of an IR is a textual representation of the AST at that point in the compiler.
It's often useful for an optimizer to be able to produce and consume a textual format instead of just an AST.
For example, the LLVM Opt optimizer runs passes over LLVM IR files (in bitcode/binary format, or in the readable IR textual format), making it really easy to narrow down problems, and GCC uses Gimple for it's primary intermediate representation, which looks a lot like C.

Both of those codebases use various other IRs better-suited for different parts of the compiler's pipeline.

## SSA form

- what?
    - static single assignment
    - not how the programmer usually thinks/operates, but much nicer for the optimizer
- why
    - a whole suite of traditional compiler optimizations become entirely trivial to implement with ssa
    - used to not be available to compilers because it took up so much more memory
    - instead of variables just like source code you have a new "register"
        for every time a value is assigned to
    - now that we don't have the same memory constraints we can just put it in a nicer format
        - don't have to track use-def analysis on variables during optimization once it's in SSA format
        - much nice for the optimizer to work on

## LLVM IR and MLIR's Utility

- extremely modular
- the json of IRs
- progressive lowering
    - at the start, you can have a nice relatively faithful representation of the source code
    - as you take steps towards llvm ir and then MIR and machine code, each step looks more like what certain optimizations are expecting
    - optimizations get to work on what the expect
        - example of working with loops in scf dialect vs llvm ir

- overview of using an IR like LLVM and the pros and cons
    - can point out loops by finding PHI nodes at top of block doing some work (probably loop bodies) and their predecessors (loop preheaders and backedges)
        - analysis needed for induction vars and step sizes etc
    - and then look at scf and affine dialects
        - not much analysis is needed to construct the loops, they exist in the source code
        - ISel and later optimizations don't need to know this, so the constructs aren't as readily available in the IR at that point in the compiler
    - phi nodes
    - that's basically it, only has SSAs, function calls+defs, loads/stores, math ops, basic blocks and phi nodes
        - LLVM LangRef[^langref] is really all you have. It's basically done.
    - not very extensible
        - every new thing you want to model essentially HAS to be modeled as a new llvm intrinsic
            - e.g. better vectorizer support results in `@llvm.vp.exp.v4f32(...)`
        - to add functionality you need basically *ALL* stakeholders to sign off
            - representatives from Google, Meta, Intel, Qualcomm, etc all need to agree with you if you want to add something to langref.
            - alternative is keeping a downstream fork of llvm
                - Huge maintenance burden for that company, harder to contribute things
    - these constraints (while restrictive in certain ways) also makes it relatively straightforward to work with
        - you can probably just crack open the compiler and understand the IR at any point in the compiler and know what's happening.
            - optimizer can dump the IR before and after every single pass
            - can just read over all the code. if the IR at the end has a bug and it doesn't at the start, well you can just go backwards until you don't see the bug before a pass and you *DO* see it after, then you know the bug is made manifest in that pass.
    - use opaqueptr transition as an example of how tough it is to move everything over

~~~admonish tip
Note that MLIR's developers have written an unusually large amount of
documentation about their design decisions[^mlir_rat].
Please take advantage of this resource, as it summarizes lots of discussion
across several mediums (LLVM discourse, discord, etc).
~~~


## Other uses of high-level IRs

Some IRs are +/- normalized representations of the source language, and not much optimization is performed on them.
Mostly just desugaring.

In the LLVM project, you have:

- hlfir dialect, part of the Flang project
- clangir dialect, part of the ClangIR project (still mostly in incubation at time of writing)

Glasgow Haskell Compiler uses Core IR, which is mostly a desugared version of regular Haskell, and Rust has a similar IR called MIR.
Swift and many other languages have this concept since some optimizations make more sense at a higher level, and it's nice when adding a new frontend feature to have an agreed-upon textual representation of the program you can target.
For example, if you have an idea for a new feature for a programming language with a high-level IR and you already know what you want the new feature to do in terms of the present-day version of the programming language, you can compile the code in present-day `$LANGUAGE` and look at the high-level IR, and then add the feature to the lexer/parser/semantic analysis, and ensure that it produces roughly the same high-level IR.
Without this, you have to rely on behavioral tests or reading a lower-level IR which might not correspond to the language feature as directly.

## Chez-Scheme's Nanopass Architecture with ♾️ small IRs

~~~admonish todo
- why mlir is so useful in so many domains
    - modular IR description/parser/ast manipulation tools
- how IRs look in other languages
- most newer languages have a higher-level IR to target first
    - (GHC Core, Rust MIR, Swift SIR, Clang CIR, Flang HLFir/Fir, GCC gimple)
- notes on how IRs can be constraints on the compiler, or how a compiler can outgrow its IR
    - example of llvm ir being too similar/tied to C, making it more difficult for other FEs
- description of SSA, examples in llvm ir
    - drawbacks being very heavyweight at times. takes way more memory at times
    - with non-ssa, IR takes less memory, can just reassign like (most) source code
    - plusses being every assignment is the *ONLY* assignment
    - point out how true functional programming is almost in ssa format already,
        makes some optimizations more straightforward now that we have the memory to
        handle (nearly) arbitrarily large program units
~~~

---

[^carruth_opt]: [Understanding Compiler Optimization - Chandler Carruth - Opening Keynote Meeting C++ 2015](https://www.youtube.com/watch?v=FnGCDLhaxKU&list=WL&index=1)
    - starts talking about IRs at 9m in
[^langref]: [LLVM Language Reference](https://llvm.org/docs/LangRef.html)
[^ssa_construction]: [Simple and Efficient Construction of Static Single Assignment Form](https://bernsteinbear.com/assets/img/braun13cc.pdf)
[^proglangdoc]: [Blog post on PL development](https://docs.google.com/document/d/e/2PACX-1vSPUfmDiniZy0yn9wjqag8lWOg4Kei_3EXy03EB_pQ-5elwacy0IBZjFyOsjrehIldvhUq0_odDY0Ft/pub)
[^mlir_rat]: [MLIR Rationale Root Document](https://mlir.llvm.org/docs/Rationale/Rationale/)
    - The MLIR developers have documented their rationale for design decisions quite well.
        Please take advantage of this resource.
