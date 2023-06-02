---
layout: post
title: Understanding VLA
permalink: /vla-c
cat: cs
tags: c++
---

Scattered notes from learning about the implementation of VLA.

{% include disclaimer.html %}

## What is VLA?

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
before: 140726923074768
after: 140726923074720
diff: 48
```

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
before: 140726525735728
after: 140726525735680
diff: 48
```

Compare the GCC docs for `alloca` with that of variable length arrays and notice the similarities:

> The function alloca supports a kind of half-dynamic allocation in which blocks are allocated dynamically but freed automatically.
>
> Allocating a block with alloca is an explicit action; you can allocate as many blocks as you wish, and compute the size at run time. But all the blocks are freed when you exit the function that alloca was called from, just as if they were automatic variables declared in that function. There is no way to free the space explicitly. 

## LLVM IR

Docs explanation of alloca:

> The ‘alloca’ instruction allocates memory on the stack frame of the currently executing function, to be automatically released when this function returns to its caller

<!--
clang -S -emit-llvm -o - _includes/vla/simple.c
-->
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
                 ^^^^^^^^^^^^^^^^^ Save the stack frame pointer

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

## Conclusion & Links

1. [GCC VLA docs](https://gcc.gnu.org/onlinedocs/gcc/Variable-Length.html)
1. [GCC `alloca` docs](https://www.gnu.org/software/libc/manual/html_node/Alloca-Example.html)
1. [LLVM IR docs for `alloca` instruction](https://llvm.org/docs/LangRef.html#alloca-instruction)
1. [LLVM source for `alloca` instruction](https://llvm.org/doxygen/Instructions_8cpp_source.html)
1. [cppreference docs on VLA](https://en.cppreference.com/w/c/language/array)

{% include disclaimer.html %}
