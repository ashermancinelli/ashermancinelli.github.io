# Key Analyses

Lots of optimizations are not really all that difficult to implement, but the
analyses they rely on can be tricky.

## Use-Def Analysis

## Alias Analysis

One of the biggest reasons vectorizable C and C++ code does not get auto-vectorized is because of possible aliasing.

Consider the following two code snippets([godbolt link](https://godbolt.org/z/4h8v6P36r)):
```c
void foo(int * a, int * b, int * c, int n) {
    for (int i=0; i < n; i++)
        a[i] = a[i] * b[i] + c[i];
}
```

If you look at the opt pipeline for this function, you'll find a *tremendous* amount
of llvm ir generated (>100 lines) from this simple two line loop.
Why is this?

Well the loop body itself has been rewritten several times by the compiler,
each to be executed a different number of times depending on the inputs.
The compiler generated a check to make sure `a` `b` and `c` don't overlap, and then
another set of checks to make sure `n` is large enough that vectorization is possible and worthwhile.
If these checks pass, then a vectorized/widened *version* of the loop is run,
and the original sequential loop remains in case the number of iterations is not
an even multiple of the hardware's vector width, or in case of memory clashes.

This transformation is called *loop versioning*, meaning several *versions* of the
same loop are generated, each to be run a different number of iterations depending
on the results of some tests on the inputs.

You will find the same loop-versioning done in Fortran to check that `n` is large enough to run
the vector loop, but you may notice that the check for overlapping memory is missing.

Contrast this with the same loop rewritten in Fortran([godbolt](https://godbolt.org/z/vejeM1P5z)):
```fortran
subroutine foo(a, b, c, n)
    implicit none
    integer, dimension(n), intent(inout) :: a, b, c
    integer, intent(in) :: n
    integer :: i
    do i=1, n
        a(i) = a(i) * b(i) + c(i)
    enddo
end subroutine foo
```

~~~admonish important
Why is the check for overlapping memory not needed in Fortran?
~~~

Arrays are a different beast in Fortran, and this affords the compiler many more
opportunities for optimization, specifically related to loops and array accesses.
An array in C is nothing more than a pointer to some memory.
The compiler does not *usually* know anything about this memory that the user does not
explicitly tell the compiler (we'll come back to this).
This means that for the compiler to be able to vectorize the loop above, it has
to make sure that the memory pointed to by `a` `b` and `c` are far enough apart
(or ideally non-overlapping) that the vectorized version of the code will not produce any bugs.

One could conceivably pass these arrays to the C version of the above function:
```c
void bar() {
    int * a = malloc(64);
    initialize(a, 64);
    int * b = a;
    int * c = a + 1;
    foo(a, b, c, 32);
}
```
In this case, `a` `b` and `c` all share the same memory and `c` is at a different
offset into the same memory.
Turning this into a vectorized loop assuming a vector width of 4 `int`s would
unsurprisingly cause issues:

```c
void foo(int * a, int * b, int * c, int n) {
    // vectorized version
    const int VW = 4; // vector width
    for (int i=0; i < n / VW; i++)
        a[i*VW:i*VW+VW] = a[i*VW:i*VW+VW] * b[i*VW:i*VW+VW] + c[i*VW:i*VW+VW];
}
```

An array in Fortran is an entirely different beast:
it's (usually) an *array descriptor* (sometimes called a *dopevector*).
To understand what this means, we'll look at the structural representation of array
descriptors exposed by the header `ISO_Fortran_binding.h`[^iso_ftn_bind].

You can read the headers shipped with any fortran compiler for yourself if you like[^flang_iso_ftn]
or you can read the section of the standard[^iso_ftn_bind], but I'll give you the gist here.

```c
struct DopeVectorDimension {
    size_t lower_bound, extent, stride;
};

struct DopeVector {
    void * storage;
    size_t bytes_in_data_type;
    DopeVectorDimension dimensions[];
};
```

The Fortran compiler manages these objects for you and converts complicated array 
operations into the more basic operations you would need to use in C.
In fact, for this loop example we can actually use an array assignment expression 
in Fortran:

```fortran
a(:) = a(:) * b(:) + c(:)
```

And the compiler actually knows that the arrays can't alias
(unless the user went out of their way to create `pointer`/`target` or `bind(c)` arrays)
and can vectorize this assignment right away!
This is one thing Fortran is excellent at: if you're writing optimizations
for a Fortran compiler, the language itself helps the user and the compiler writer
work together to produce really nice code.

~~~admonish note title="For C++ devs"
This means the arrays built in to the Fortran language are roughly equivalent
to C++'s `std::mdspan`, except the language is also able to optimize the allocation
in many cases, as if the C++ compiler also managed the underlying memory with
`std::unique_ptr` or `alloca` for your `mdspan` object.
Fortran compilers can do lots of interesting tricks around these array descriptor objects,
and they aren't necessarily like the example `struct`s above if you were to examine the assembly;
that's just what the standard mandates that the compiler exposes to users wanting to use
the arrays via the C-Fortran interface, but internally their representation differ.
~~~

An experienced C or C++ developer may know a way around these limitations:
you can in fact tell the compiler exactly what you need it to know in this case
with the `restrict` keyword (or the nonstandard C++ version: `__restrict__`).
```c
void foo(int * restrict a, int * restrict b, int * restrict c, int n) {
               ^^^^^^^^
```

This tells the compiler that the memory `a` points to doesn't share it's memory with
anyone else (*or at least that the compiler can pretend it doesn't for the sake of optimization!*).
This works, and if you look into well-optimized libraries you're likely to find little tricks
like this to work around the constraints of the language.

But fundamentally, this looks like a language-design issue to me.
Not to say that C is fundamentally flawed, C and C++ may be the right tools
for lots of different workloads.
From the optimizer's perspective however, the constraints given to the optimizer
by the language work against certain optimizations.
Alias analysis is one such case.

~~~admonish todo
- array descriptors in rust?
- how does their compiler deal with internal representations of arrays when
    lowering to llvm
    - maybe don't do much high level opts?
    - borrow checker can give better info to optimizer+alias analysis
~~~

---

~~~admonish todo
- many of the optimizations rely on reuaseble analyses
    - most compilers have infrastructure to perform these analyses and reuse them between passes
    - most passes then tell the infrastructure/pass manager which analyses they
        require and *which ones they invalidate* so the compiler infrastructure
        knows what it must run before the pass and re-run after the pass (if another
        pass requires the invalidated analysis).
- dependence testing
    - kennedy
- alias analysis
    - TBAA
    - Fortran
    - Functional Programming's utility for alias analysis
~~~

---

[^iso_ftn_bind]: [J3 ISO Fortran Binding Header](https://j3-fortran.org/doc/year/18/18-007r1.pdf)
[^iso_ftn]: [ISO Fortran Environment](https://fortranwiki.org/fortran/show/iso_fortran_env)
[^flang_iso_ftn]: [ISO Fortran bindings shipped with flang](https://github.com/llvm/llvm-project/blob/main/flang/include/flang/ISO_Fortran_binding.h)
