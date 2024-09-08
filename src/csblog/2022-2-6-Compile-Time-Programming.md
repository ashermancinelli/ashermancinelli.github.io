<!--
layout: post
title: Mental Model for Compile-Time Programming
permalink: /compile-time-programming
category: c++
wip: true
cat: cs
-->

<!-- {% include mermaid.html %} -->

My mental model for compile-time programming.


# Compile-Time Programming

The most powerful and compelling features of modern C++ revolve around compile-time programming in my opinion.

Consider the following code snippet ([godbolt](https://godbolt.org/z/axj4f4Tz9)):

```cpp
bool enable_bar = true;

int foo(int i) {
  return i + 1;
}

int bar(int i) {
  if (enable_bar)
    return i + 1;
  return i;
}

int main() {
  int value = 42;
  return bar(foo(value));
}
```

Let the following graph depict the program above, where blue boxes represent runtime code and arrows depict dependencies.
This graph is a simplified depiction of the dependencies between elements in the abstract syntax tree of the program.

<center>
<div class="mermaid">
graph LR
    A(Return Value) --> B(bar)
    B --> C(foo)
    B --> D(enable_bar)
    C --> E(value)
</div>
</center>

At the end of the day, the program _really_ only depends on `enable_bar` and `value`, and we know the values of both of these at compile-time.
There are no runtime dependencies of this program, yet the compiler will still emit runtime instructions (even with `-O3`) because it doesn't know for a fact that the dependencies can be resolved at compile time.

Consider this altered version of the code snippet above ([godbolt](https://godbolt.org/z/s1Ycahn56)):

```cpp
bool enable_bar = true;

consteval int foo(int i) {
  return i + 1;
}

int bar(int i) {
  if (enable_bar)
    return i + 1;
  return i;
}

int main() {
  constexpr int value = 42;
  return bar(foo(value));
}
```

The graphical depiction of this program may now look like this, with the addition that green boxes represent compile-time code:

<center>
<div class="mermaid">
graph LR
    ret(Return Value) --> B(bar)
    B --> F(foo)
    B --> E(enable_bar)
    F --> V(value)

    style V fill:#66ff99,stroke:#00cc66
    style F fill:#66ff99,stroke:#00cc66
</div>
</center>

The dependency-tree representation of the program now contains several nodes that _do not require any runtime instructions_ because we've used the `consteval` and `constexpr` specifiers to inform the compiler that we know everything we need to know in order to call those functions/use those variables at compile-time.

We can take this further:

```cpp
constexpr bool enable_bar = true;

consteval int foo(int i) {
  return i + 1;
}

consteval int bar(int i) {
  if constexpr (enable_bar)
    return i + 1;
  return i;
}

int main() {
  constexpr int value = 42;
  return bar(foo(value));
}
```

The graph now looks like this:

<center>
<div class="mermaid">
graph LR
    ret(Return Value) --> B(bar)
    B --> F(foo)
    B --> E(enable_bar)
    F --> V(value)

    style V fill:#66ff99,stroke:#00cc66
    style F fill:#66ff99,stroke:#00cc66
    style ret fill:#66ff99,stroke:#00cc66
    style B fill:#66ff99,stroke:#00cc66
    style E fill:#66ff99,stroke:#00cc66
</div>
</center>

Because we've informed the compiler that our code can all be called at compile-time, the instructions emitted by the compiler are now very few; there are only _three instructions and one label_ emitted by the compiler:

```assembly
main:
 mov $0x2c,%eax
 retq 
 nopw %cs:0x0(%rax,%rax,1)
```

Of course, the assembly emitted by Compiler Explorer is cleaned up and the true assembly is not three instructions long, but hopefully you get the point.

When you do introduce a runtime dependency into your codebase, it's helpful to keep this in mind; shift _as much_ of the computation in your program as is (reasonably) possible to compile-time code, and you can potentially remove a _huge_ number of instructions that would otherwise be executed every time you run your program.

<br>

Compile-time programming is one of the most compelling reasons to adopt the newest possible C++ standard you are able to.
You'll notice that in our code snippets, we used the `consteval` specifier on our functions `bar` and `foo`.
This means the result of the function _must_ be a compile-time constant; or, the node in the syntax tree _must_ be green.

In C++ standards older than C++20, `consteval` was not available, and `constexpr` was the only option (besides preprocessor code).
Before C++17, `constexpr` was weaker, and could not perform as much work.

`constexpr` only tells the compiler that _it is possible_ to evaluate the value of the function or variable at compile time, but the compiler is not _mandated_ to do so.
Assuming we only have `constexpr` available to us, our graph could only really look like the following, where orange boxes represent _potentially_ compile-time code:

<center>
<div class="mermaid">
graph LR
    R(Return Value) --> B(bar)
    B --> F(foo)
    B --> E(enable_bar)
    F --> V(value)

    style V fill:#66ff99,stroke:#00cc66
    style E fill:#66ff99,stroke:#00cc66

    style F fill:#ff9933,stroke:#cc660
    style R fill:#ff9933,stroke:#cc660
    style B fill:#ff9933,stroke:#cc660
</div>
</center>

Imagine one of your coworkers isn't as privy to compile-time constructs in C++, and adds a potentially runtime-dependent value into this graph.
The majority of your code may fall back to runtime code simply because one potentially-runtime value was introduced!

<center>
<div class="mermaid">
graph LR
    R(Return Value) --> B(bar)
    B --> F(foo)
    B --> E(enable_bar)
    F --> V(value)
    F --> Ba(baz)

    style V fill:#66ff99,stroke:#00cc66
    style E fill:#66ff99,stroke:#00cc66
</div>
</center>

# Links

* [ISO C++ post: _When does a constexpr function get evaluated at compile time?_](https://isocpp.org/blog/2013/01/when-does-a-constexpr-function-get-evaluated-at-compile-time-stackoverflow)

