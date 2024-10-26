# Overview

A compiler is, in the simplest terms, a *translator between two textual formats*.

We will return to this core description several times.
As complicated as compilers can be, forget not that we're simply going from one textual format to another.

There are usually 3 other attributes expected of a compiler:
- Some level of optimization
    - e.g. we're going from one textual format to *the most ideal version* of the content in the target format.
- The target language is "lower-level" than the source language
    - compilers between lateral languages (at a similar level of abstraction) are often called *transpilers*, [though the distinction is moot, I would argue.](Asides.md#transpilers)
- The semantics/intents of the programmer are preserved

## Not Just C

When a programmer thinks of a compiler, they often think of a source-to-machine-code compiler, such as a program that takes your C code and gives you a program that you can run directly on your machine.
While this is the primary topic to be discussed here, it's worth noting that compilers have other purposes.

For example, if you've ever written LaTeX, you've probably also used a *LaTeX compiler*.

The input format in this case is some text marked up with text indicating how the text itself ought to be formatted, which other files ought to be brought into the final document, and so on.
The target format in this case is the binary PDF format Adobe decided on.

Another use-case is *Domain-Specific Languages*, or DSLs.
These are not usually what one might consider "fully-fledged" programming languages (whatever threshold one might have for that).
A regular expression is a domain-specific language, for example, and is often compiled into a program that matches text.
Maybe you've used [Mermaid.js](https://mermaid.js.org/) for creating graphs.
This is a DSL for describing graphs, which is compiled into the graph itself.

This is all to say nothing of tech like Tensorflow, whereby the user describes a computational graph in Python which is bytecode-compiled in CPython, after which the computational graph is AOT-compiled into something that trains a neural network model for example... things get messy from here on out.

The clean and precise categories of *interpreter*, *transpiler*, and *compiler* get very fuzzy when you pull back the covers.
The distinctions between them are relatively non-existent (though you can usually name one when you see one 😁).
