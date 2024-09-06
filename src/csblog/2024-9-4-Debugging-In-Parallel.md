# Debugging in Parallel

Let's say you have a compiler pass that performs some transformation.
You check in a change to the compiler...

```c++
void my_pass(ast_t *ast) {
    // perform some transformation
}
```

...and you get a bug report back.

Something is broken, but it only shows up in a huge translation unit, and your pass runs thousands of times.
How do you reduce the problem?

## Constrain the Problem

I break the code before and after my patch into two new functions, each called from the old depending on some environment variable:

```c++
void old_pass(ast_t *ast) { /* ... */ }
void new_pass(ast_t *ast) { /* ... */ }

void my_pass(ast_t *ast) {
    static int num_calls = 1;
    char *env;
    fprintf(stderr, "num_calls=%d\n", num_calls);

    if (num_calls == std::atoi(std::getenv("USE_NEW_CODE"))) {
        new_pass(ast);
    } else {
        old_pass(ast);
    }

    num_calls++;
}
```

I can then change from the command line which code path the compiler will use when my pass is run:
```bash
# Disable my new change
USE_NEW_CODE=0 build/bin/clang ./bug.c -O3

# Enable my new change only on the first call
USE_NEW_CODE=1 build/bin/clang ./bug.c -O3
```

~~~admonish tip
Rather than using environment variables, the same can be accomplished with clang's `cl::opt` command line options.
`opt` has the command line flag `-opt-bisect-limit=<limit>` for bisecting LLVM passes, and you can do the same thing in your own pass.
~~~

If we then turn this build and run step into a script that runs in a temporary directory,
we're almost ready to test the entire problem space in parallel:
```bash
$ cat >test.sh <<EDO
#!/usr/bin/env bash
start=$PWD
pushd $(mktemp -d)
USE_NEW_CODE=$1 $start/build/bin/clang $start/bug.c -O3
./a.out && echo $* pass || echo $* fail
EOD
```

Now, we could run this script from `1` up to the number of times your optimization kicks in for the failing test case, but we can do better.
We can use GNU parallel[^gnu_par] to test the entire problem space on all our cores:

```bash
$ seq 1000 | parallel --bar -j `nproc` ./test.sh {} '&>' logs/{}.txt
100% 400:0=0s 400
$ grep -r fail logs/
out-314.sh:314: fail
out-501.sh:501: fail
```

This gives you every individual instance in which your new code caused the failure (in case there were multiple).
You can also bisect the failures by using a minimum and maximum instead of only enabling your new code for one single instance, in case this does not work.

~~~admonish tip
`creduce` along with LLVM's `bugpoint` and `llvm-reduce` can also be helpful, but not when your test application is segfaulting.
`creduce` tends to create all kinds of segfaults and works best when you have more specific output in the failure case you can grep for.
~~~

[^gnu_par]: [GNU parallel is a shell tool for executing jobs in parallel using one or more computers. A job can be a single command or a small script that has to be run for each of the lines in the input.](https://www.gnu.org/software/parallel/)
