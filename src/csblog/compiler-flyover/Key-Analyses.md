# Key Analyses

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
