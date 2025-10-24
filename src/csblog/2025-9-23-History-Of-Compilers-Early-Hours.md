# The Earliest Hours

The very beginning is, in many ways, a good place to start because we are immediately confronted the philisophical question of *what is a compiler?*

## What is a Compiler?

~~~admonish tip title="_Brian Kernighan, UNIX: A History and a Memoir_"
<br>
<i>
A compiler is a program that translates something written in one language into something semantically equivalent in another language.
For example, compilers for high-level languages like C and Fortran might translate into assembly language for a particular kind of computer; some compilers translate from other languages such as Ratfor into Fortran.
</i>
~~~

While the term *compiler* often encompasses a wide variety of tools that transform data from one representation to another, we will view compilers solely through the lens of programming languages.
<!--This excludes tools like the *Tex* compiler and focuses on tools for which the data being transformed is a *program*.-->

In the 1950s, shortly after Bell Labs' invention (discovery?) of the transistor, programmers were already in need of tools to accomplish two tasks:

1. transform a more human-readable representation of computation into a format that could be executed by a machine, and
2. make programs written for one platform usable on another.

Fundamentally, a compiler stands between a human-readable representation of a program and a machine-executable representation of that program.
Were someone to convert a Fortran program into x86 assembly by hand, they would be performing the task of a compiler.

Grace Hopper, commonly credited with creating the first compiler, worked for Univac in the early 1950s.
This deserves a heavy caveat: Hopper's notion of a *compiler* was much closer to our modern notion of a linker.
Her notion of a compiler consisted of a tool that produced a program for some particular problem from a set of subroutines.
Nonetheless, the software Hopper developed were the first to be called *compilers*.

Herbert Bruderer summarizes the contest genesis of compilers in his article _[Did Grace Hopper Create the First Compiler?](https://cacm.acm.org/blogcacm/did-grace-hopper-create-the-first-compiler/)_:

~~~admonish tip title="Herbert Bruderer on Grace Hopper and Early Compilers"
*These elucidations can be summarized as follows: Heinz Rutishauser was the first to propose automatic programming (machine translation with the aid of the computer, 1951/52) and Grace Hopper developed the first utility programs for the management of subprograms (1952). Alick Glennie lays claim to the first true compiler that actually operated on a computer (1952).*
~~~

*Automatic Programming* was Hopper's term for the development cycle involving a compiler.

~~~admonish quote title=""
*Scientific users drove the development and adoption for ambitious program tools, called compilers. Whereas as assemblers made writing machine instructions faster and more convenient, compilers could translate mathematical equations… into code that the computer could execute.*

*A New History of Modern Computing*, Chapter 2, *The Computer Becomes a Scientific Supertool*
~~~

Laning and Zierler developed a compiler for the MIT Whirlwind computer in 1953-1954.
This program produced machine code from equations in algebraic form, which was ahead of its time.
Later on, in the paper *The Next 700 Programming Languages*, Peter Landin would plot the future of programming language design, and his prescription would go on to sound similar to the principles that Laning and Zierler applied in their compiler.

Addressing point 2, compiling the same programs for different architectures was still a challenge due to the lack of standardization around programming languages.
This changed in 1960 due to a government mandate that procured systems must support COBOL:

~~~admonish quote title=""
The next year, the US government announced that it would not purchase or lease computer equipment, unless it could handle COBOL.
As a result, COBOL became one of the first languages to be sufficiently standardized that the program could be compiled on computers from different vendors and run to produce the same results.
That occurred in December 1960, when almost identical programs ran on a Univac II and an RCA 501.
~~~

## Locality

One of the primary concerns of the early compilers was _locality_, meaning the the compiler could only concern itself with only a few lines of code at a time.

This is even the reason why compilers originally adopted separable compilation, which allowed for compiling parts of the program independently;
the entire program could not be fit into the memory of the computer at one time.

Today, memory is so readily available that many programming languages and compilers opt to process the entire program at once; for example, the Zig programming languages [drops the entire program into one module](https://kristoff.it/blog/zig-new-relationship-llvm/) before native code is generated.

Consider the `eqn` program, which was an early preprocessor for `troff` typesetting commands:

~~~admonish tip title="_Memory Constraints, UNIX: A History and a Memoir_"
<br>
<i>
Eqn was implemented as a preprocessor for Troff...
Eqn recognized mathematical constructs and translated those into Troff commands, while passing everything else through untouched.

Lorinda and I had been forced into a good idea by the physical limitations of the PDP-11.
There simply wasn't enough memory to include mathematical processing in Troff, which was already about as big as a program could be.
</i>
~~~

The typesetting program `troff` already reached the memory constraints of the PDP-11, so any additional features would have to be implemented outside of `troff`.
Similarly, compilers could only really consider a small chunk of any given program at a time.


## TODO

* 1962 Honeywell _A Few Quick Facts on Software_, _"Generally there are three basic categories of software: 1) Assembly Systems, 2) Compiler Systems, and 3) Operating Systems."_
* 1968 NATO _Conference on Software Engineering_

---

* _Compiling Routines_, Grace Hopper, 1953
* [*The Next 700 Programming Languages*](https://www.cs.cmu.edu/~crary/819-f09/Landin66.pdf)
* [*A New History of Modern Computing*](https://www.goodreads.com/book/show/56354936-a-new-history-of-modern-computing?ref=nav_sb_ss_2_27)
* [*History of Compilers* from U Wisconson-Madison](https://pages.cs.wisc.edu/~fischer/cs536.s05/lectures/Lecture02.pdf)
* [*Notation as a Tool of Thought*](https://www.eecg.utoronto.ca/~jzhu/csc326/readings/iverson.pdf)
<!--* [Did Grace Hopper Create the First Compiler?](https://cacm.acm.org/blogcacm/did-grace-hopper-create-the-first-compiler/)-->
