# Key Analyses

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

Why is this check not needed in Fortran?

Arrays are a different beast in Fortran, and this affords the compiler many more
opportunities for optimization, specifically related to loops and array accesses.
An array in C is nothing more than a pointer to some memory.
The compiler does not usually know anything about this memory that the user does not
explicitly tell the compiler (we'll come back to this).
This means that for the compiler to be able to vectorize the loop above, it has
to make sure that the memory pointed to by `a` `b` and `c` are far enough apart
(or ideally non-overlapping) that the vectorized version of the code will not produce any bugs.

A Fortran array is often actually an *array descriptor* (sometimes called a *dopevector*).

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
