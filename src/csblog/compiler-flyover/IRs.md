# Intermediate Representations

Recall the most brief description of a compiler thus far: *a translator between two textual formats*.

The *intermediate representation* is one step along the way from the source format to the target format.

Another way to think of an IR is a textual representation of the AST at that point in the compiler.
It's often useful for an optimizer to be able to produce and consume a textual format instead of just an AST.
For example, the LLVM Opt optimizer runs passes over LLVM IR files (in bitcode/binary format, or in the readable IR textual format), making it really easy to narrow down problems, and GCC uses Gimple for it's primary intermediate representation, which looks a lot like C.

Both of those codebases use various other IRs better-suited for different parts of the compiler's pipeline.

## MLIR's Novelty

- extremely modular
- the json of IRs

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
~~~
