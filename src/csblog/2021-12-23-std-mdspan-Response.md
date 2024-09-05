<!--
layout: post
title: A Look at std::mdspan
permalink: /std-mdspan-tensors
cat: cs
-->

New library feature coming to C++23


## Tensors

A YouTuber by the name of [Context Free](https://www.youtube.com/c/ContextFree/videos) posted a few videos about tensors in various programming languages, including C++ ([first video](https://youtu.be/WbpbEilgQBc), [second video](https://youtu.be/ICxxKeE4GuA)).
I loved these videos, but I noticed ContextFree failed to mention `std::mdspan`, a new library feature coming to C++23.

## `std::mdspan`

`std::mdspan` (or `std::experimental::mdspan` until the proposal is accepted-I'll be using `stdex::mdspan`, as `stdex` is a common alias for `std::experimental`) is an alias for a more complex type, but at it's core it is a pointer plus some number of _extents_.
_Extents_ are either sizes of a given dimension on an `mdspan`, or the sentinal `std::dynamic_extent`, which indicates the extent is _dynamic_, and doesn't have to be supplied at compile-time.
These extents and the sentinal `dynamic_extent` can be mixed and matched.
This powerful capability allows users to work with data as if it were a complex matrix structure while the underlying data remain linear.

For example, given raw data, an `mdspan` may be constructed and passed to some library that expects a matrix with rank 3:
```cpp
// https://godbolt.org/z/eWKev9nas
template<T>
using mat_3d = std::mdspan<
                 T,
                 std::extents<
                     std::dynamic_extent
                   , std::dynamic_extent
                   , std::dynamic_extent
                 >
               >;

template<typename T> void work(mat_3d<T> mat);

int main() {
  int raw[500] = {};

  work(stdex::mdspan(raw, 100, 5, 1));
  work(stdex::mdspan(raw, 4, 5, 5));
  work(stdex::mdspan(raw, 10, 1, 50));
}
```

Note that we will have to be more careful if we mix-and-match compile-time and run-time extents.

```cpp
// https://godbolt.org/z/Phr1vh9zs
template<typename T> using mat_3d = stdex::mdspan<
  T,
  stdex::extents<
    stdex::dynamic_extent,
    3,
    stdex::dynamic_extent
  >
>;

template<typename T> void work(mat_3d<T> mat) {}

int main() {
  int raw[27] = {};
  work(mat_3d<int>(raw, 3, 3, 3));
  work(mat_3d<int>(raw, 9, 3, 0));
  // work(mat_3d<int>(raw, 3, 0, 9)) will fail bc extents don't match!
  return 0;
}
```

After supplying a dummy implementation of `work` to print the shape, we get
```console
mat has shape [100, 5, 1]
mat has shape [4, 5, 5]
mat has shape [10, 1, 50]
```

In either case, the underlying data is the same, though it's _viewed_ differently in each of the invocations of `work`.
It's no coincidence that _view_ seems like a natural name for `mdspan` - `mdspan` was developed by the authors of the portable execution library Kokkos and inspired by the `Kokkos::View` type.

## Subspans

Just like `std::span`, `mdspan` has support for taking subspans of a given span.
This is more complicated with `mdspan` however, due to `mdspan`'s variadic extents.

There are three ways to take a slice of an `mdspan`:

1. An integer index into the respective dimension
1. A `std::tuple` or `std::pair` begin/end pair of indices
1. The special value `std::full_extent` indicating all elements of the dimension should be selected in the subspan

For example:
```cpp
// https://godbolt.org/z/Wrr4dhEs8
int main() {
  int raw[27] = {};
  std::iota(raw, raw+27, 0);

  // full will have shape [3,3,3]
  auto full = stdex::mdspan(raw, 3, 3, 3);

  // sub will have shape [1,3] and values [18,19,20]
  auto sub = stdex::submdspan(full, 2, std::pair{0, 1}, stdex::full_extent);
}
```

Note that using a single value as an extent passed to `submdspan` squashes the dimension to 0, while passing a `pair` or `tuple` will keep the dimension around, even if that dimension is 1.
`pair`/`tuple` do not effect rank, while passing an index as an extent does.

I hope this article was enough to get you interested in `mdspan` and the future of C++!
Make sure to check out Daisy Hollman's appearance on CppCast, Context Free's YouTube channel, and the reference implementation of C++23's `std::mdspan`.

{% include footer.html %}

## Links

* [`mdspan` paper, revision 14](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2021/p0009r14.html)
* Godbolt links:
    * [Example 1](https://godbolt.org/z/eWKev9nas)
    * [Example 2](https://godbolt.org/z/Phr1vh9zs)
    * [Example 3](https://godbolt.org/z/Wrr4dhEs8)
* [ContextFree's YouTube channel](https://www.youtube.com/c/ContextFree/videos)
* [Kokkos mdspan implementation](https://github.com/kokkos/mdspan)
* [Intro to mdspan wiki article](https://github.com/kokkos/mdspan/wiki/A-Gentle-Introduction-to-mdspan)
* [`std::mdspan` on compiler explorer](https://godbolt.org/z/KMT3G9Ese)
* [CppCast episode with Daisy Hollman](https://cppcast.com/too-cute-mdspan/)
