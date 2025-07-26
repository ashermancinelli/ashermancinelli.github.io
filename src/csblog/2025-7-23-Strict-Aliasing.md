# Why UB is Good (When It Comes to Strict Aliasing)

_7/23/2025_

Follow up to [the blog on `poison`](2025-7-22-Poison.md), this time about when undefined behavior can be a good thing.

~~~admonish tip title="_Undefined Behavior_"
Undefined behavior (UB) is when a program has violated the expectations or preconditions of the language.
This often means each implementation of the language has free-reign to do whatever it wants.

Sometimes, this means [LLVM will turn your relative-error calculation into a pile of garbage](csblog/2025-7-22-Poison.md#only-on-some-architectures).
Some languages make it easier or harder to create a program with UB.
It is nearly impossible to evoke UB in Python ([but still possible](https://github.com/python/cpython/issues/96678#issuecomment-1240508545)),
and it is nearly unavoidable in C.
~~~

UB is _useful_ because it means that implementations of a language are not overly burdened by the rules of the language.
For example, accessing the same memory at the same time from multiple threads in UB in C.
It would be nearly impossible for a C compiler to adhere to the rules of the language if this weren't the case - the compiler would need to guard every access to memory with a global lock, [not unlike Python's GIL](https://wiki.python.org/moin/GlobalInterpreterLock).
Instead, the compiler is allowed by the language specification to assume that if a user is accessing the same memory at the same time, they either know what they are getting into or they deserve the consequences.
Many languages (C and C++) are specified in terms of an _abstract machine_, a machine that does not exist in the real world, but is close enough to the actual hardware that the ISO standard can be adequately specific without being too bound to today's hardware.
Volatile variables are a great example of this.

Other languages make UB much more difficult to encounter.
Rust is a key example of an offline-compiled language with no garbage collector that prevents many cases of UB, but lots of other languages are far more safe for different reasons.
Python is a great example - unless you run into UB in a particular implementation of the language, you are unlikely to encounter it.

There are some cases where UB is not just unavoidable due to the language specification, but it is also useful for optimization purposes.

# Strict Aliasing

When a function is called from somewhere outside the current translation unit, most compilers are unable to make very many assumptions about the function's arguments.
For example, in C, the compiler has to assume that the arguments may be pointing to the same memory:
```c
void foo(int *x, int *y, int n) {
    for (int i = 0; i < n; i++) {
        x[i] = y[i];
    }
}
```

If these two pointers point to the same chunk of memory, than performing any iterations of this loop out of order would potentially result in incorrect answers.
[LLVM _versions_ this loop](https://godbolt.org/z/zoMs5M8x8), meaning it performs an overlap check on the pointers before jumping into a vectorized loop if they don't alias within the loop's tripcount, and it falls back on a sequential loop if they do.
If the compiler can assume that `x` and `y` do not alias, it can vectorize that loop or replace it with a memcpy.

One way to inform your C compiler that your pointers do not alias is to use the `restrict` keyword.

```c
void foo(int *restrict x, int *restrict y, int n) {
    for (int i = 0; i < n; i++) {
        x[i] = y[i];
    }
}
```

[Clang will indeed turn this loop into a memcpy](https://godbolt.org/z/dMEvhvzjx) without versioning.

# Strict Aliasing in C and C++

There are some additional rules where strict-aliasing applies, in particular _type-based aliasing_.
[See the _Strict Aliasing_ section of C++ reference](https://en.cppreference.com/w/c/language/object.html).
Essentially, this means that pointers to different types of objects are not allowed to alias in most situations, and if a user breaks this rule, the program contains undefined behavior.
Why is this useful?

As we saw before, in order to communicate to the compiler that two pointers do not alias, we need to use the `restrict` keyword explicitly; it is opt-in, and many users to not know to do this, even if they know a priori that the pointers do not alias.

It is not so with strict-aliasing.

Let's revisit the original example, but this time we'll pass an int-pointer and a float-pointer instead of two pointers to values of the same type.
```c
void foo(int *x, float *y, int n) {
    for (int i = 0; i < n; i++) {
        x[i] = y[i];
    }
}
```

In this case, the compiler _does not need to version_ the loop for aliasing.
The loop is still versioned in a less expensive way to check that the tripcount is large enough for vectorization, but the checks are now much less onerous because the compiler can now assume that the pointers will not run into each other.

If a user broke this rule on purpose, the result would be undefined behavior:
```c
int x[10];
foo(x, (float*)x, 10);
```

The compiler will not be able to catch this case unless the user opts-out of the strict-aliasing rules with a flag like `-fno-strict-aliasing`.
The situation is much improved over the `restrict` keyword, at the very least because it is opt-out!
Users will get performant code by default, so long as they aren't breaking the language rules.
The fact that the compiler can make this assumption is beneficial for performance, and if the user breaking the strict-aliasing rules were _not_ UB, the compiler would have to guard against the possibility of overlapping memory all the time.

There are lots of gotchas with strict aliasing rules in C and C++.
For example, the two arguments passed here _are allowed to alias_:
```c
struct { int x[10]; } s;
int x[10];
foo(s.x, x, 10);
```

Members of structs are usually _not_ allowed to alias however.
To make matters worse, C and C++ differ in some of their strict aliasing rules.
[Shafik Yaghmour wrote a great blog post: _What is the Strict Aliasing Rule and Why do we care?_](https://gist.github.com/shafik/848ae25ee209f698763cffee272a58f8)
It's specific to C and C++, but it gives you an idea of when and why strict aliasing rules may kick in.

# Strict Aliasing in Fortran

Fortran has additional rules for strict aliasing which help Fortran compilers generate _much_ better code.
As I've discussed before, arrays in Fortran are not simply handles to memory like they are in C.
They do not decay to pointers.
They contain shape information unlike arrays-of-arrays in C.

Here's our original example in Fortran:
```fortran
subroutine foo(x,y,n)
  integer::n
  integer,dimension(n)::x,y
  x=y
end subroutine
```

[The LLVM Flang compiler will give us the same code as when we used `restrict` in C](https://godbolt.org/z/7xqdz5xzG).
This is because the two arrays are treated _as if they are of different types_.

LLVM expresses the concept of strict-aliasing in its IR via _type-based aliasing metadata_.
This metadata attaches information about the types of values in memory being loaded from or stored to, and then analyses passes in LLVM are able to determine if the values are allowed to alias or not.
[In this link, I've dumped the LLVM IR for this Fortran example with metadata enabled](https://godbolt.org/z/W39sx8aEs).

This is the body of the vectorized loop with the metadata enabled:
```llvm
define void @foo_(
    ptr writeonly captures(none) %0,
    ptr readonly captures(none) %1,
    ptr readonly captures(none) %2
) {
  ; ...
vector.body:                                      ; preds = %vector.body, %vector.ph
  %index = phi i64 [ 0, %vector.ph ], [ %index.next, %vector.body ]
  %8 = getelementptr i32, ptr %1, i64 %index
  %9 = getelementptr i8, ptr %8, i64 16
  %wide.load = load <4 x i32>, ptr %8, align 4, !tbaa !10
  %wide.load2 = load <4 x i32>, ptr %9, align 4, !tbaa !10
  %10 = getelementptr i32, ptr %0, i64 %index
  %11 = getelementptr i8, ptr %10, i64 16
  store <4 x i32> %wide.load, ptr %10, align 4, !tbaa !12
  store <4 x i32> %wide.load2, ptr %11, align 4, !tbaa !12
  %index.next = add nuw i64 %index, 8
  %12 = icmp eq i64 %index.next, %n.vec
  br i1 %12, label %middle.block, label %vector.body, !llvm.loop !14
  ; ...
}
!0 = !{!"flang version 22.0.0 (https://github.com/llvm/llvm-project.git 7dc9b433673e28f671894bd22c65f406ba9bea6f)"}
!4 = !{!5, !5, i64 0}
!5 = !{!"dummy arg data/_QFfooEn", !6, i64 0}
!6 = !{!"dummy arg data", !7, i64 0}
!7 = !{!"any data access", !8, i64 0}
!8 = !{!"any access", !9, i64 0}
!9 = !{!"Flang function root _QPfoo"}
!10 = !{!11, !11, i64 0}
!11 = !{!"dummy arg data/_QFfooEy", !6, i64 0}
!12 = !{!13, !13, i64 0}
!13 = !{!"dummy arg data/_QFfooEx", !6, i64 0}
```

Notice the metadata present on the loads and stores:
```llvm
  %wide.load = load <4 x i32>, ptr %8, align 4, !tbaa !10
  store <4 x i32> %wide.load, ptr %10, align 4, !tbaa !12
; ...
!10 = !{!11, !11, i64 0}
!11 = !{!"dummy arg data/_QFfooEy", !6, i64 0}
!12 = !{!13, !13, i64 0}
!13 = !{!"dummy arg data/_QFfooEx", !6, i64 0}
```

The metadata here is indicating via type-based aliasing metadata that the LLVM optimizer may treat the two chunks of memory accessed by those loads and stores as belonging to entirely different types!
This is, [along with other reasons I discussed in my blog on my ideal array language](csblog/2025-7-20-Ideal-Array-Language.md#fortrans-array-semantics), why I think Fortran is so amenable to performance and optimizations.
Compilers have such rich information available to them by default.

# Strict Aliasing in Rust

I'm not a Rust expert, but from my understanding, Rust has far stricter aliasing rules than C and C++, and the borrow checker goes a fairly long way to help enforce non-aliasing by default, even for memory of the same type.
This is summarized as _"aliasing xor mutability"_.

Just for comparison, the equivalent loop in Rust generated the same LLVM IR as the Fortran example did.
```
fn foo(x: &mut [i32], y: &[i32], n: usize) {
    for i in 0..n {
        x[i] = y[i];
    }
}
```

# Conclusion

Ultimately UB is dangerous to the extent that languages expose it to their users without their opting-in.
The UB surface area exposed to C and C++ users is massive, and it's nearly impossible to avoid.
I consider myself quite proficient in C++; I'm careful to use `std::unique_ptr`s when I need to convey ownership semantics with raw memory, and container types like `std::vector` convey similar aliasing information to Fortran's array types (but without all the array-polymorphism ☹️).
I still find it extremely difficult to write correct and performant code in C++ without loads of tooling to support me.

~~~admonish tip title="_We Can Do Better_"
UB is *not* an inevitability of programming languages, and as programming language developers and compiler implementers, we are able to do better and we _should_ do better.
In some cases, it can be useful to express UB to _optimizers_ for the purpose of optimizing code that is already more or less known to be correct.

As a large part of the surface area of popular programming languages however, I think it's a disaster, and we who have a say in programming language design should aspire for more.
~~~

---

* John Regehr
    * [_UB Canaries_](https://blog.regehr.org/archives/1234)
    * [_Aggressive UB Optimizations_](https://blog.regehr.org/archives/761)
