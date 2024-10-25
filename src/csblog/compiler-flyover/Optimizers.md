# Middle End

~~~admonish todo

4. ME
    1. Most reusable component
    2. Look at all the llvm fes and bes; its bc the me is so reusable
    3. IRs
    4. Parts
        1. Passes
            1. Factorio/dsp metaphore
            2. Program flows downstream, some factory is filtering for certain operations and transforming the matches
        2. Progressive lowering?
            1. Mlir
    5. Go through textbook optimizations 
        1. LICM
        2. SimplifyCFG
        3. Inliner
        4. Vectorization
        5. Unrolling
        6. Fusion
            1. Look at perf profile of code with and without each optimization

- example of factorio/dyson sphere project pickers/sorters for ast matchers
    - sorters watching the input ir on a belt
    - picking matching asts out of the program, performing some optimization

~~~
