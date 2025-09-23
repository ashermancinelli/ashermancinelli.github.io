# The Earliest Hours

The very beginning is, in many ways, a good place to start because we are immediately confronted the philisophical question of *what is a compiler?*

While the term *compiler* often encompasses a wide variety of tools that transform data from one representation to another, we will view compilers solely through the lens of programming languages.
This excludes tools like the *Tex* compiler and focuses on tools for which the data being transformed is a *program*.

In the 1950s, shortly after Bell Labs' invention (discovery?) of the transistor, programmers were already in need of tools to accomplish two tasks:

1. transform a more human-readable representation of computation into a format that could be executed by a machine, and
2. make programs written for one platform usable on another.

Grace Hopper, commonly credited with creating the first compiler, worked for Univac in the early 1950s.
This deserves a heavy caveat: Hopper's notion of a *compiler* was much closer to our modern notion of a linker.
Her notion of a compiler consisted of a tool that produced a program for some particular problem from a set of subroutines.
Nonetheless, the software Hopper developed were the first to be called *compilers*.

*Automatic Programming* was her term for the development cycle involving a compiler.
The A-0, A-1 and A-2 programs were ostensibly the first compilers delivered to customers for commercial use on the UNIVAC I in 1953.

~~~admonish quote title=""
*Scientific users drove the development and adoption for ambitious program tools, called compilers. Whereas as assemblers made writing machine instructions faster and more convenient, compilers could translate mathematical equations… into code that the computer could execute.*

*A New History of Modern Computing*, Chapter 2, *The Computer Becomes a Scientific Supertool*
~~~

Laning and Zierler developed a compiler for the MIT Whirlwind computer in 1953-1954.
This program produced machine code from equations in algebraic form, which was ahead of its time.
Later on, in the paper *The Next 700 Programming Languages*, Peter Landin would plot the future of programming language design, and his prescription would go on to sound similar to the principles that Laning and Zierler applied in their compiler.

---

* [*The Next 700 Programming Languages*](https://www.cs.cmu.edu/~crary/819-f09/Landin66.pdf)
* [*A New History of Modern Computing*](https://www.goodreads.com/book/show/56354936-a-new-history-of-modern-computing?ref=nav_sb_ss_2_27)
* [*History of Compilers* from U Wisconson-Madison](https://pages.cs.wisc.edu/~fischer/cs536.s05/lectures/Lecture02.pdf)
* [Did Grace Hopper Create the First Compiler?](https://cacm.acm.org/blogcacm/did-grace-hopper-create-the-first-compiler/)
* [*Notation as a Tool of Thought*](https://www.eecg.utoronto.ca/~jzhu/csc326/readings/iverson.pdf)
