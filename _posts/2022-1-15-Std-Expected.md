---
layout: post
title: std::expected And Why It's Awesome
permalink: /std-expected
cat: cs
---

`std::expected` and some spectacular extensions are hopefully coming to C++23.

{% include disclaimer.html %}

## Existing Practice

I'm used to seeing code that looks like this, not just in C but in C++ codebases too:

```c++
int main() {
  int ierr;
  double * mat = (double*)malloc(sizeof(double[100]));

  ierr = dowork(mat, 10, 10);
  check_error(ierr);

  ierr = domorework(mat, 10, 10);
  check_error(ierr);

  free(mat);
}
```

Integers represent error conditions, and these usually map to an error message like so:
```c++
const char* error_messages[] = {
    "success",
    "got some failure",
    "another kind of failure",
};
enum error_types {
    success,
    some_failure,
    some_other_failure,
};

void check_error(int ierr) {
    if (ierr) {
        printf("got error '%s'\n", error_messages[ierr]);
        exit(ierr);
    }
}
```

This way when you encounter an error condition in some function, you just return the corresponding error code like so:
```c++
int dowork(double* matrix, int M, int N) {
  // do some work here

  if (/*some error condition*/)
      return some_failure;

  // success state
  return success;
}
```

And the error handler reports the failures:
```console
  Program returned: 1
got error 'got some failure'
```

On one hand, there's a sense of security to writing code like this.
You always check your error conditions, your code never throws exceptions, and the range of possible failures is very clear.
I don't mind this pattern in C, but in C++ we have some goodies that are far nicer to use in my opinion (especially in C++23).

## Why `std::expected` is Awesome

I'll be using [`mdspan` from the Kokkos implementation](https://github.com/kokkos/mdspan) and [`expected` from Sy Brand's implementation](https://github.com/TartanLlama/expected) for this section.

In the last year, 3 papers have come through the ISO C++ mailing lists for `std::expected`, and [the most recent paper from Jeff Garland](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2021/p2505r0.html) proposes some of Sy Brand's wonderful extensions to `std::expected` which allow you to chain together monadic operations on expected values:

1. `and_then`
2. `or_else`
3. `transform`

I think these extensions are _extremely_ elegant, and I think some folks that are more used to the C-style error handling could be won over.
Using `std::expected` means your errors have _value semantics_, which is something I like about the C-stlye error handling.
Chaining together these operations makes the programmer's intent so much clearer.

Let's look at another example using matrices, but this time using `expected` and `mdspan`.

### `expected` Example

I'll get some `using` statements out of the way:
```c++
namespace stdex = std::experimental;
using mat_t = stdex::mdspan<double, 
    stdex::extents<
      stdex::dynamic_extent,
      stdex::dynamic_extent
    >
  >;
using expect_mat = tl::expected<mat_t, std::string>;
```

I can't help but marvel at how nice and readable this looks:
The intent of the programmer is very clear in my opinion, even without seeing the rest of the code.
```cpp
int main() {
  auto raw = std::make_unique<double[]>(25);
  auto mat = mat_t(raw.get(), 5, 5);
  setup(mat)                  // zero initialize
    .and_then(set_diag)       // set the diagonal of the matrix
    .and_then(print)          // print out some values
    .or_else(report_errors);  // if unexpected, print the error and quit
}

/*
 * Program returned: 0
 * 1.0 0.0 0.0 0.0 0.0 
 * 0.0 1.0 0.0 0.0 0.0 
 * 0.0 0.0 1.0 0.0 0.0 
 * 0.0 0.0 0.0 1.0 0.0 
 * 0.0 0.0 0.0 0.0 1.0 
 */
```

This leads to some nice and/or interesting patterns.
Say we want to check that the matrix passed to `set_diag` is square;
we could perform our check and return an error message if the check fails, much like we could throw an exception:
```cpp
auto set_diag(mat_t mat) {
  if (mat.extent(0) != mat.extent(1))
    return make_unexpected("expected square matrix!");

  for (int i=0; i < mat.extent(0); i++)
    mat(i, i) = 1.0;

  return expect_mat(mat);
} 
```

I also like using an immediatly invoked lambda for this, but I'm not sure how readable/maintainable this is long-term:
```cpp
auto set_diag(mat_t mat) {
  return mat.extent(0) == mat.extent(1)
    ? [=] {
      for (int i=0; i < mat.extent(0); i++)
        mat(i, i) = 1.0;
      return expect_mat(mat);
    }()
    : make_unexpected("expected square matrix!");
} 
```

Either way, the error is handled as expected (no pun intended):
```cpp
auto report_errors(std::string_view err) {
  fmt::print("got error: '{}'\n", err);
  std::exit(EXIT_FAILURE);
}
int main() {
  auto raw = std::make_unique<double[]>(25);
  // It's not square!
  auto mat = mat_t(raw.get(), 25, 1);
  setup(mat)
    .and_then(set_diag)
    .and_then(print)
    .or_else(report_errors);
}
/*
 * Program returned: 1
 * got error: 'expected square matrix!'
 */
```

### 3 Ways to use the Monadic Functions on an Expected Value

#### 1. Functor

We can use functors in the expected chain like so:
```cpp
struct SetRow {
  std::size_t row;
  double value;
  expect_mat operator()(mat_t mat) {
    for (int i=0; i<mat.extent(1); i++)
      mat(row, i) = value;
    return mat;
  }
};
int main() {
  auto raw = std::make_unique<double[]>(25);
  auto mat = mat_t(raw.get(), 5, 5);
  setup(mat)
    .and_then(set_diag)
    .and_then(SetRow{1, 3.5})
    .and_then(print)
    .or_else(report_errors);
}
/*
 * Program returned: 0
 * 1.0 0.0 0.0 0.0 0.0 
 * 3.5 3.5 3.5 3.5 3.5 
 * 0.0 0.0 1.0 0.0 0.0 
 * 0.0 0.0 0.0 1.0 0.0 
 * 0.0 0.0 0.0 0.0 1.0 
 */
```

#### 2. Binding Args to a Function that Takes Multiple Arguments

Using `std::bind` on a function taking more arguments would also acomplish this:

```cpp
auto set_row(mat_t mat, std::size_t row, double value) {
    for (int i=0; i<mat.extent(1); i++)
        mat(row, i) = value;
    return expect_mat(mat);
}
int main() {
  auto raw = std::make_unique<double[]>(25);
  auto mat = mat_t(raw.get(), 5, 5);
  setup(mat)
    .and_then(set_diag)
    .and_then(std::bind(set_row, /*mat=*/_1, /*row=*/1, /*value=*/3.5))
    .and_then(print)
    .or_else(report_errors);
}
/*
 * Program returned: 0
 * 1.0 0.0 0.0 0.0 0.0 
 * 3.5 3.5 3.5 3.5 3.5 
 * 0.0 0.0 1.0 0.0 0.0 
 * 0.0 0.0 0.0 1.0 0.0 
 * 0.0 0.0 0.0 0.0 1.0 
 */
```

#### 3. Lambdas

And of course, lambdas:

```cpp
int main() {
  auto raw = std::make_unique<double[]>(25);
  auto mat = mat_t(raw.get(), 5, 5);
  setup(mat)
    .and_then(set_diag)
    .and_then([] (auto mat) {
      for (int i=0; i < mat.extent(1); i++)
        mat(3, i) = 2.0;
      return expect_mat(mat);
    })
    .and_then(print)
    .or_else(report_errors);
}
/*
 * Program returned: 0
 * 1.0 0.0 0.0 0.0 0.0 
 * 0.0 1.0 0.0 0.0 0.0 
 * 0.0 0.0 1.0 0.0 0.0 
 * 2.0 2.0 2.0 2.0 2.0 
 * 0.0 0.0 0.0 0.0 1.0
 */
```

## Conclusion

Hopefully you've been won over by the elegance of `expected` and `mdspan`.
Godbolt links can be found for these examples in the links below:

1. [YouTube version of this content](https://youtu.be/uj9ozuzZy6g)
1. [C-style example](https://godbolt.org/z/jPqdYPEv9)
1. [Full `expected`+`mdspan` example](https://godbolt.org/z/hWYj34EcW)
1. [Jeff Garland's 12/2022 `expected` paper](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2021/p2505r0.html)
1. [Sy Brand's `tl::expected`](https://github.com/TartanLlama)
1. [Kokkos `mdspan` impl](https://github.com/kokkos/mdspan)

{% include disclaimer.html %}
