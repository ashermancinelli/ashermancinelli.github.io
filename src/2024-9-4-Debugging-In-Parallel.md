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
```

```bash
$ cat >test.sh <<EDO
#!/usr/bin/env bash
start=$PWD
pushd $(mktemp -d)
USE_NEW_CODE=$1 $start/build/bin/clang $start/bug.c -O3
./a.out && echo pass || echo fail
EOD
```

You can first run the app with `USE_NEW_CODE=0` to just get the print out of the total number of times your code is hit.

Then you can test all of them in parallel:

```bash
$ seq 1000 | parallel --bar -j `nproc` ./test.sh {} '&>' logs/{}.txt
$ grep -r fail logs/
```

This gives you every individual instance in which your new code caused the failure (in case there were multiple).
You can also bisect the failures by using a minimum and maximum instead of only enabling your new code for one single instance, in case this does not work.
