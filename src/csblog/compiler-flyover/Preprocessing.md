# Preprocessing and Macros

As I mentioned in the *Value Proposition* section, when users are not given appropriate compiler tools, they more or less invent their own compiler tools.
This is the usually origin of a preprocessor.
Users don't have the capabilities they need to write effective software, so they have some other software consume the code they prefer to write as input and produce the code they would rather not write by hand as output.

~~~admonish todo
- lisp+rust macros, hygenic macros not really in the same category
- function like compiler frontend plugins in some languages (rust) or more like metafunctions (lisp)
- fypp general-purpose preprocessor
    - fortran use of fypp to make up for lack of generics, rewriting subroutines with different extensions to handle different types just like with C
    - C added this with `_Generic` but arguably far too late, idk exact numbers but idt many people are using this yet.
        - most of C's generics are more `void*` flavored than `_Generic` flavored.
- development of c preprocessor
    - use in modern compilers not so much a separate process, integrated with lexing+parsing in C/C++ at this point
- macros and preprocessing are not always in the same sphere, macros sometimes more integrated with the compiler
- preprocessing and macros are IMO filling whatever metaprogramming gap the language leaves
    - C get's a bit of a free-pass, early compilers were not too much different from today's preprocessors
~~~

---

[^chist]: [The Development of the C Language](https://www.bell-labs.com/usr/dmr/www/chist.pdf)
