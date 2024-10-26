# Code Generation

~~~admonish quote title="Dennis Ritchie, *Development of C*"
As described in [Johnson 78a], we
discovered that the hardest problems in propagating Unix tools lay not in the interaction of the C
language with new hardware, but in adapting to the existing software of other operating systems.
Thus Steve Johnson began to work on pcc, a C compiler intended to be easy to retarget to new
machines [Johnson 78b], while he, Thompson, and I began to move the Unix system itself to the
Interdata 8/32 computer.
~~~

~~~admonish todo

1. Target specific
2. Target not necessarily asm
3. Ptx again
4. Regalloc
    1. Animation of touching memory vs touching registers vs each cache level
5. Isel

~~~
