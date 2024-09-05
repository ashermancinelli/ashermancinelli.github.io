<!--
layout: post
title: Understanding VLA
permalink: /vla-c
cat: cs
tags: c++
-->

Scattered notes from learning about the implementation of VLA.


## What is VLA?

Variable-length arrays are dynamic, stack-allocated arrays.
The compiler needs to increase the stack size in the current stack frame to allocate enough space for the array.
Assuming negative stack-growth like on x86, the compiler will decrease the stack pointer sufficiently to store the array.

This is almost identical to `alloca`.
Both `alloca` and VLAs are essentially primitives to modify the stack pointer.

Eg:
```c
  // Subtracts N from current stack pointer returns sp 
  int *curr_sp = alloca(N * sizeof(int));

  // equivilant to
  int curr_sp[N];
```

[One key difference between the two:](https://stackoverflow.com/questions/3488821/is-alloca-completely-replaceable)
> The memory alloca() returns is valid as long as the current function persists. The lifetime of the memory occupied by a VLA is valid as long as the VLA's identifier remains in scope. You can `alloca` memory in a loop for example and use the memory outside the loop, a VLA would be gone because the identifier goes out of scope when the loop terminates.

## Memory Layout

Because the stack grows down on most platforms, the stack pointer after an `alloca` or VLA allocation but arrays are addressed sequentially upwards, the address of the first element of a VLA array (or the pointer returned by `alloca`) will be the value of the stack pointer *after* it's modified.

<center>
  <img
    style="background-color:#240057;"
    src="/images/vla/vla-stack-pointer-viz.drawio.png"
    />
</center>

Element 0 of the array or `alloca`-allocated memory is therefore immediately above the stack pointer after allocation, and is addressed by increasing sequentially until the end of the array.
Accessing past the array will then run into previously declared stack variables.

When the function returns, the stack space will be available for subsequent function calls to use automatically, so there is no need to explicitly free memory allocated by VLA/`alloca`.

## Examples

GCC docs:
>  These arrays are declared like any other automatic arrays, but with a length that is not a constant expression. The storage is allocated at the point of declaration and deallocated when the block scope containing the declaration exits.

```c
// ./vla <size>
int main(int argc, char** argv) {
  int len = atoi(argv[1]);
  int array[len];
  for (int i=0; i<len; i++)
    array[i] = i;
}
```

Declaring the array decrements the stack pointer enough to provide memory for the array:
<!--
gcc _includes/vla/inspect-stack.c && LEN=10 IDX=4 ./a.out
-->
```c
{% include vla/inspect-stack.c %}
```
```shell
$ uname -a
Linux carbon 5.15.0-71-generic #78-Ubuntu SMP Tue Apr 18 09:00:29 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
$ gcc inspect-stack-vla.c && LEN=10 IDX=4 ./a.out
&vla[0]: 140737151458112
before: 140737151458160
after: 140737151458112
diff: 48
```

Notice that the address stored in the stack pointer after declaring the VLA array is the same as the address of the first element of the VLA array as depicted in the diagram above.

## `alloca`

Instead of declaring a VLA array, we can create a pointer to memory allocated by `alloca` to produce the same effect:
<!--
gcc _includes/vla/inspect-stack-alloca.c && LEN=10 IDX=4 ./a.out
-->
```c
{% include vla/inspect-stack-alloca.c %}
```
```shell
$ gcc inspect-stack-alloca.c && LEN=10 IDX=4 ./a.out
&vla[0]: 140728646054592
before: 140728646054640
after: 140728646054592
diff: 48
```

Compare the GCC docs for `alloca` with that of variable length arrays and notice the similarities:

> The function alloca supports a kind of half-dynamic allocation in which blocks are allocated dynamically but freed automatically.
>
> Allocating a block with alloca is an explicit action; you can allocate as many blocks as you wish, and compute the size at run time. But all the blocks are freed when you exit the function that alloca was called from, just as if they were automatic variables declared in that function. There is no way to free the space explicitly. 

## Why Might This Be a Bad Idea?

The dynamic nature of VLAs means the offset of stack variables declared after the VLA into the stack frame of the function is **also dynamic** - which means the function will need extra instructions to calculate the address of these variables whenever they are referenced in the body of the function.

This *may* be a worthwhile tradeoff, but know that use of VLAs means your code may need a few extra instructions every time you use stack variables.

<!--
## LLVM IR

Docs explanation of alloca:

> The ‘alloca’ instruction allocates memory on the stack frame of the currently executing function, to be automatically released when this function returns to its caller

< !--
clang -S -emit-llvm -o - _includes/vla/simple.c
-- >
```c
{% include vla/simple.c %}
```
```llvm
@.str = private unnamed_addr constant [4 x i8] c"LEN\00", align 1
@.str.1 = private unnamed_addr constant [4 x i8] c"IDX\00", align 1

define dso_local i32 @main(i32 noundef %0, i8** noundef %1) #0 {
  %3 = alloca i32, align 4
  %4 = alloca i32, align 4
  %5 = alloca i8**, align 8
  %6 = alloca i32, align 4
  %7 = alloca i32, align 4
  %8 = alloca i8*, align 8
  %9 = alloca i64, align 8
  store i32 0, i32* %3, align 4
  store i32 %0, i32* %4, align 4
  store i8** %1, i8*** %5, align 8
  %10 = call i8* @getenv(i8* noundef getelementptr inbounds ([4 x i8], [4 x i8]* @.str, i64 0, i64 0)) #4
  %11 = call i32 @atoi(i8* noundef %10) #5
  store i32 %11, i32* %6, align 4
  %12 = call i8* @getenv(i8* noundef getelementptr inbounds ([4 x i8], [4 x i8]* @.str.1, i64 0, i64 0)) #4
  %13 = call i32 @atoi(i8* noundef %12) #5
  store i32 %13, i32* %7, align 4
  %14 = load i32, i32* %6, align 4
  %15 = zext i32 %14 to i64

  %16 = call i8* @llvm.stacksave()

  store i8* %16, i8** %8, align 8
  %17 = alloca i32, i64 %15, align 16
        ^^^^^^^^^^ Dynamically allocate more memory on the stack by decrementing
                   the stack pointer, giving sufficient space for the array

  store i64 %15, i64* %9, align 8
  %18 = load i32, i32* %7, align 4
  %19 = sext i32 %18 to i64
  %20 = getelementptr inbounds i32, i32* %17, i64 %19
  %21 = load i32, i32* %20, align 4
  store i32 %21, i32* %3, align 4
  %22 = load i8*, i8** %8, align 8
  call void @llvm.stackrestore(i8* %22)
  %23 = load i32, i32* %3, align 4
  ret i32 %23
}
```
-->

## Conclusion & Links

1. [GCC VLA docs](https://gcc.gnu.org/onlinedocs/gcc/Variable-Length.html)
1. [GCC `alloca` docs](https://www.gnu.org/software/libc/manual/html_node/Alloca-Example.html)
1. [LLVM IR docs for `alloca` instruction](https://llvm.org/docs/LangRef.html#alloca-instruction)
1. [LLVM source for `alloca` instruction](https://llvm.org/doxygen/Instructions_8cpp_source.html)
1. [cppreference docs on VLA](https://en.cppreference.com/w/c/language/array)
1. [Buffer overflow and stack frame visualization](https://www.tenouk.com/Bufferoverflowc/Bufferoverflow2a.html)

