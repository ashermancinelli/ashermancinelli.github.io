# Preprocessing and Macros

As I mentioned in the *Value Proposition* section, when users are not given appropriate compiler tools, they more or less invent their own compiler tools.
This is the usually origin of a preprocessor.
Users don't have the capabilities they need to write effective software, so they have some other software consume the code they prefer to write as input and produce the code they would rather not write by hand as output.

I would argue that preprocessors represent the gap between the metaprogramming capabilities that users need and the capabilities the compiler/language/runtime provides.

For example, you would never use a preprocessor for your Racket code because of how mature Racket's (and most lisp/scheme's) metaprogramming capabilities are.
C++ codebases make heavy use of macros at times, even though it has mature metaprogramming, but it's notoriously difficult for mortal C++ users to metaprogram C++.

Fortran is a particularly unfortunate case.

By nature of its integration with the C ecosystem, many Fortran codebases rely on the C preprocessor, and require invoking the Fortran compiler with the `-cpp` flag, indicating that a C preprocessor must be run on the source before it can be compiled.
And then you have tools like FYPP that intend to fill the gap, effectively adding a layer of Python scripting on top of the Fortran codebase:

~~~admonish quote title="FYPP"
[fypp] generally tries to extend the modern Fortran language with metaprogramming capabilities without tempting you to use it for tasks which could/should be done in Fortran itself.
~~~

These tools often taken a generic implementation, interface, and a list of types which the interface should be generic over, and produces a bunch of subroutines with the type stringified and added to the generic subroutine as a suffix.
Generic programming is *the* use case for metaprogramming, and with this (extremely common) use case not being supported in ISO standard Fortran makes the use of FYPP and other tools entirely unsurprising to me.

I don't mean to denegrate the work of the developers of FYPP or the Fortran users that use it; they're just doing the best with what they have, inventing their own compiler layer on top of Fortran (as users will always do when the language doesn't see to their needs).

I'm not denigrating the wonderful people that sit on the ISO committee for Fortran either - they've made wonderful progress advancing one of the first programming languages ever conceived of (save a few critical mistakes[^pklausler_j3]).
This Python scripting layer on top of Fortran simply demonstrates the gap between *modern* users' needs and *modern* Fortran - the language has still come a tremendously long way.

~~~admonish quote title="Dennis Ritchie, *Development of C*"
Many other changes occurred around 1972-3, but the most important was the introduction
of the preprocessor, partly at the urging of Alan Snyder [Snyder 74], but also in recognition of the
utility of the the file-inclusion mechanisms available in BCPL and PL/I. Its original version was
exceedingly simple, and provided only included files and simple string replacements: #include
and #define of parameterless macros. Soon thereafter, it was extended, mostly by Mike Lesk
and then by John Reiser, to incorporate macros with arguments and conditional compilation. The
preprocessor was originally considered an optional adjunct to the language itself. Indeed, for
some years, it was not even invoked unless the source program contained a special signal at its
beginning. This attitude persisted, and explains both the incomplete integration of the syntax of
the preprocessor with the rest of the language and the imprecision of its description in early reference manuals.
~~~

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
[^fypp]: [Fypp documentation](https://fypp.readthedocs.io/en/stable/fypp.html#general-syntax)
[^pklausler_j3]: [Do Concurrent is Fundamentally Broken](https://j3-fortran.org/doc/year/19/19-134.txt)
