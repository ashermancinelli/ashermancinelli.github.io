# Unix

~~~admonish quote
_The development of Unix shifted gradually from assembler to a new higher-level language..._
_Instead of writing, a whole operating system, all that was needed was a C compiler able to generate code in the new machines language, and some work to tweak the Unix kernel and standard libraries to accommodate its quirks._

_A New History of Modern Computing_
~~~

* Bell Labs folks needed a way to reuse OS work between machines as they upgraded
* ARPA funding networking stuff
    * each center was doing its own thing including compilers, wanted to centralize/standardize
* Early intel work; Kildall working on a PL/M compiler
* Intel 8087 included support for IEEE floast in an FP coprocessor; compilers needed to support it
* UI era with Xerox and Apple. Compilers didn't only improve/get better to use; Apple's Lisa had to reboot into text-based OS to compiler code.
* Early 1980s: RISC
    * DEC machines were classic CISC, instructions for absolutely everything (at the time)
    * magnet core memory replaced by transistor memory, allowed for better RISC performance, reloading new instructions became less expensive
    * Idea was: when code is produced by compilers and memory is inexpensive, makes sense to have smarter compilers and simpler hardware surface area
    * MIPS started shortly after at standford 1981, John Hennessy
* Bryan Cantrill's comment about how Sun was partially responsible for paid compilers persisting because Sun operated pieces of their company as separate companies which had to purchase software and hardware from each other.
* BASIC, MatLab became more ubiquitous; interpretation was lower barrier to entry, esp for scientific programming and where users were otherwise not trained in programming.
* "compiler of the week" "compiler of the day" COW COD
* "GNU is not unix" chapter 12 (125/176)
    * Stallman 1983 Unsenet post announcing GNU
