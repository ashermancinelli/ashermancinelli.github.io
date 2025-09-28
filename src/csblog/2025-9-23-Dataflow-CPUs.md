# Dataflow CPUs
*9/27/2025*

CPUs today innovate in a few ways:

* More cores
* Specialized cores
* Wider vectors, different vector schemes (SVE/SME)
* Power consumption

But there are more fundamental innovations possible. Dataflow architectures are one such innovation.

## Dataflow vs Von Neumann

In von Neumann CPUs (read: all of them, basically), instructions are fetched from memory and executed sequentially (or in pipelines/threads (or prefetched and executed speculatively)) with a program counter dictating what comes next.
Dependencies between instructions and their operands are managed directly (registers and stack space are often allocated by the compiler, for example), which can lead to bottlenecks (the hardware might be idle when waiting for data).

A dataflow architecture flips this dependency: instructions are *always ready*; execution fires when input data is available.
There is no central program counter; instead, data _tokens_ carry dependencies and trigger computation.

## The _Linda Model_

One of my favorite references on parallel programming uses the _Linda model_ to explain parallel programming concepts.
This model is very a good fit for understanding dataflow architectures.

~~~admonish tip title=""

<br>
<i>
The Linda model is a <strong>memory</strong> model. Linda memory (called <strong>tuple space</strong>) consists of of a collection of logical tuples. There are two kidns of tuples. Process tuples are under active evaluation; data tuples are passive. The process tuples (which are all executing simultaneously) exchange data by generating, reading and consuming data tuples. A process tuples that is finished executing turns into a data tuple, indistinguishable from other data tuples.
</i>

From _How to Write Parallel Programs: A First Course_, Chapter 3, page 46.
~~~

In the _Linda model_, programs are not strictly sequences of instructions, but rather a collection of instructions with data dependencies and data itself.



---

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
