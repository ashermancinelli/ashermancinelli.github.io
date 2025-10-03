# Dataflow CPUs
*9/27/2025*

<i font="-3">
An exploration of dataflow architectures, initially inspired by <a href="https://pages.cs.wisc.edu/~markhill/restricted/ieeecomputer94_dataflow.pdf">this paper</a>.
</i>

~~~admonish note title="Table of Contents"
<!-- toc -->
~~~

These days, _most_ CPUs vendors differentiate themselves in a few ways:

* More cores,
* Specialized cores,
* Wider vectors, different vector schemes (SVE/SME),
* Lower power consumption

(Arm's scalable vector extensions are probably my favorite from this list.)

None of these, though, actually breaks the basic assumption behind the machines: a program is (conceptually) a sequence of instructions executed in some order.
<!--None of these differentiators really break free from the fundamental paradigm of programs being essentially a list of data and instructions that (at least conceptually) are executed sequentially.-->
<!--This is not intrinsic to computers though; why couldn't instructions be intrinsically parallel?-->
<!--As long as their data are ready, we shouldn't necessarily expect them to be executed sequentially.-->
<!--***But*** there are more fundamental innovations possible. Like dataflow architectures!-->
That assumption is convenient.
It maps directly to how we think about writing code and how compilers and OSes are organized.
But it’s not the only way to organize computation. Enter: dataflow architectures.

## Dataflow vs Von Neumann

In a von Neumann machine you have a program counter, you fetch instructions, and you execute them (with pipelines, speculation, out-of-order tricks, etc.).
Dependencies are enforced by registers, memory and the compiler’s choices.
The result: when the hardware waits for data, you get wasted cycles.
<!--In von Neumann CPUs (aka all modern CPUs, basically), instructions are fetched from memory and executed sequentially (or in pipelines/threads (or prefetched and executed speculatively)) with a program counter dictating what comes next.
Dependencies between instructions and their operands are managed directly (registers and stack space are often allocated by the compiler, for example), which can lead to bottlenecks (the hardware might be idle when waiting for data).-->

Dataflow flips the control model.
Instructions don’t wait for a program counter — they fire when their inputs arrive.
Computation is driven by data tokens; tokens carry the readiness that triggers work.
You can think of it like a kitchen where dishes get cooked whenever their ingredients show up, not when some head chef calls the next order.
<!--A dataflow architecture flips this dependency: instructions are *always ready*; they fire when input data is available.
There is no central program counter; instead, data _tokens_ carry dependencies and trigger computation.-->

A pretty good mental model for this can be found in an old parallel programming workbook:

## The _Linda Model_

_How to Write Parallel Programs_, a charming little workbook on parallel programming, uses the _Linda model_ to explain parallel programming concepts.
This model is a very good fit for understanding dataflow architectures, I think:

~~~admonish tip title="_How to Write Parallel Programs: A First Course_, Chapter 3, page 46"
<br>
<i>
The Linda model is a <strong>memory</strong> model.
Linda memory (called <strong>tuple space</strong>) consists of a collection of logical tuples.

There are two kinds of tuples.
Process tuples are under active evaluation; data tuples are passive.
The process tuples (which are all executing simultaneously) exchange data by generating, reading and consuming data tuples.
A process tuples that is finished executing turns into a data tuple, indistinguishable from other data tuples.

</i>
~~~

_Linda_ exposes a shared tuple space: data tuples sit in the space, and process tuples (the active things) consume and produce them.
<!--In the _Linda model_, programs are not strictly sequences of instructions, but rather a collection of instructions with data dependencies and data itself.-->
<!--Instructions trigger when their dependencies are ready.-->

Parallelism is more naturally exposed; you might imagine _Linda_ as a giant bowl of soup with data and instructions floating around, and when an instruction's data are ready, it triggers the instruction to execute, which might then generate more data and trigger more instructions.
That maps very naturally onto dataflow: tokens in, tokens out; no central program counter; execution happens opportunistically.

## Challenges

Why haven't dataflow processors eaten the market?
There are some challenges. Namely:

- Matching data with their instructions and the instruction lifecycle can be pretty expensive,
- resource allocation is hard, and
- handling data structures is also hard.

A fully pure dataflow processor sorta assumes instruction purity and idempotency, which doesn't mesh well with immutability.

~~~admonish quote title="[_Dataflow Architectures and Multithreading_, Lee and Hurson](https://pages.cs.wisc.edu/~markhill/restricted/ieeecomputer94_dataflow.pdf)"
<br>
<i>
Another formidable problem is the management of data structures The dataflow functionality principle implies that all operations are side-effect free;
that is, when a scalar operation is performed, new tokens are generated after the input tokens have been consumed.
However, absence of side effects implies that if tokens are allowed to carry vectors, arrays, or other complex structures, an operation on a structure element must result in an entirely new structure.
</i>
~~~

This poses a bit of a challenge, to put it lightly.
The paper suggests hybrid approaches that seem far more plausible to me.

This hybrid model involves grouping elements of programs into _grains_ (or _macroactors_).
Within a single grain, operations are performed as sequentially (to the extent that you consider modern CPUs to execute instructions sequentially), and each grain itself is scheduled in a dataflow manner.

~~~admonish quote title="_Hybrid Model_"
<br>
<i>
This convergence combines the power of the dataflow model for exposing parallelism with the execution efficiency of the control-flow model. Although the spectrum of dataflowlvon Neumann hybrid is very broad, two key features supporting this shift are sequential scheduling and use of registers to temporarily buffer the results between instructions.

[H]ybrid dataflow architectures can be viewed as von Neumann machines extended to support fine-grained interleaving of multiple threads.
</i>
~~~

In either approach, you need lots of coprocessors to do things like match up data and instruction tags and move memory around, since there may not be registers outside the local scope of a grain or microactor.
Consequently, this addresses another downside of the dataflow model; exceptions/interrupts are not well-ordered.
If exceptions are well-ordered within the context that the user expects, then the parallel execution is transparent to the user.
In a full dataflow model, exceptions may fire unreliably.
This is also an issue with the control-flow model when the user opts-in to additional out-of-order execution, like vectorization.

<!--Some of these concepts might feel familiar; co-routines, channels and generators are relatively common today, and they offer an API for describing units of computation similar to grains.
Placing sequential functions in an execution context like a threadpool where each function reads from channels-->

## Visualization

You can sort-of imagine instructions and grains in dataflow processors to work like coroutines which await on values corresponding to puts on the instruction/grain's input ports.
You might think _this sounds like plain 'ol out-of-order execution on the CPU in my phone. What's so special?_ Great question!

I think _register scheduling_ is probably the biggest difference.
In your phone's A19 for example, Apple's compiler has already decided which registers will be used to render the animations for this website.
In a dataflow processor however, the compiler can pretend it has infinite registers like an SSA IR and they'll all get mapped to the ports available on the processor and scheduled dynamically.
This is much closer to the _Linda_ model with an infinitely large tuple space.

Take this animation:

<video width="800" height="600" controls preload="metadata">
  <source src="videos/dataflow-animation.mp4" type="video/mp4">
  Your browser does not support the HTML5 video tag. Download the video <a href="videos/dataflow-animation.mp4">here</a>.
</video>

The input data are ready when the program starts.
Once each input datum for an instruction is ready, the hardware can pick up the instruction and fire, no matter the physical location of the instruction's data dependencies.
The ports are really just data, not dictated by a static register file.

In a von Neumann architecture, the compiler may well reorder some of your instructions depending on the flags you used, but those decisions are statically determined; nearly everything is out-of-order and potentially parallel in a dataflow architecture.

## Links

- [_The Dataflow Abstract Machine Simulator Framework_](https://fredrikbk.com/publications/dam.pdf)
- [Dataflow Architectures and Multithreading](https://pages.cs.wisc.edu/~markhill/restricted/ieeecomputer94_dataflow.pdf)
- [HPC Gets A Reconfigurable Dataflow Engine To Take On CPUs And GPUs](https://www.nextplatform.com/2024/10/29/hpc-gets-a-reconfigurable-dataflow-engine-to-take-on-cpus-and-gpus/)
- [Startup Claims up to 100x Better Embedded Computing Efficiency](https://spectrum.ieee.org/efficient-computer-dataflow-architecture)
- [Wikipedia: Dataflow architecture](https://en.wikipedia.org/wiki/Dataflow_architecture)
- [How to Write Parallel Programs: A First Course](https://www.goodreads.com/book/show/1142709.How_to_Write_Parallel_Programs)
- [MIT Tagged-Token Dataflow Architecture - SpringerLink](https://link.springer.com/chapter/10.1007/3-540-17945-3_1)
- [Executing a Program on the MIT Tagged-Token Dataflow Architecture - IEEE](https://ieeexplore.ieee.org/document/48862)
- [MIT CSG Dataflow Research Papers](https://csg.csail.mit.edu/pubs/memos/Memo-271/Memo-271.pdf)
- [Dataflow: Passing the Token - Arvind's Research](https://csg.csail.mit.edu/Users/arvind/ISCAfinal.pdf)
- [Resource Management for Tagged Token Dataflow Architecture - MIT](https://dspace.mit.edu/handle/1721.1/149603)
- [SambaNova Reconfigurable Dataflow Architecture Whitepaper](https://sambanova.ai/hubfs/23945802/SambaNova_Accelerated-Computing-with-a-Reconfigurable-Dataflow-Architecture_Whitepaper_English-1.pdf)
- [SambaNova Architecture Documentation](https://docs.sambanova.ai/developer/latest/sambaflow-intro.html)
- [Accelerating Scientific Applications with SambaNova RDA](https://sambanova.ai/blog/accelerating-scientific-applications-with-sambanova-reconfigurable-dataflow-architecture)
- [SambaNova vs Nvidia Architecture Comparison](https://sambanova.ai/blog/the-purpose-built-architecture)
- [SambaNova SN10 RDU: A 7nm Dataflow Architecture - IEEE](https://ieeexplore.ieee.org/document/9731612)
- [Ultra-fast RNNs with SambaNova's RDA](https://sambanova.ai/blog/ultra-fast-recurrent-neural-networks-with-sambanovas-reconfigurable-dataflow-architecture)
- [SambaNova SN40L: Scaling AI Memory Wall - ArXiv](https://arxiv.org/html/2405.07518v1)
- [Design and Implementation of the TRIPS EDGE Architecture](https://www.cs.utexas.edu/~cart/trips/talks/trips_tutorial_6up.pdf)
- [Simulator for heterogeneous dataflow architectures](https://ntrs.nasa.gov/citations/19940009324)
