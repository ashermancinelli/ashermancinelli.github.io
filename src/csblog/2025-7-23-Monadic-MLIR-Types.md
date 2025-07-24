# Monadic Operations on MLIR's `FailureOr`

_7/23/2025_

While working on my toy [MLIR-based OCaml compiler](https://github.com/ashermancinelli/ocamlc2), I found myself wishing I had a way to use the monadic operations I'm familiar with in functional languages, but with the primitive types in MLIR (and C++ more generally).
This is not an uncommon desire, but this particular case was painful enough get me to write some utilities.

# LLVM and MLIR Types

There are a few types used _all over_ MLIR that are ripe for monadic operations in my opinion, the [`llvm::FailureOr` and `llvm::LogicalResult` types](https://llvm.org/docs/doxygen/LogicalResult_8h.html) being the most obvious.
In fact, the C++ standard library [already has some monadic operations](https://en.cppreference.com/w/cpp/utility/optional.html) for the `std::expected` and `std::optional` types in the form of member functions taking callables.

```cpp
mlir::FailureOr<mlir::Value> MLIRGen3::genInfixExpression(const Node node) {
  const auto children = getNamedChildren(node);
  const auto lhs = children[0];
  const auto rhs = children[2];
  const auto op = children[1];
  auto l = loc(node);
  return genCallee(op) |
    and_then([&](auto callee) -> mlir::FailureOr<mlir::Value> {
    return gen(lhs) |
        and_then([&](auto lhsValue) -> mlir::FailureOr<mlir::Value> {
        return gen(rhs) |
            and_then([&](auto rhsValue) {
                return genApplication(l, callee, {lhsValue, rhsValue});
            });
        });
    });
}
```

# Sugar for Monadic Bind

[As I detaild in this post,](2025-7-22-Functional-Programming-Compilers) functional programming is uniquely suited to the task of writing compilers.

```c++
// Wrapper that stores the continuation for a successful value.
template <typename F>
struct AndThenWrapper {
  F func;
};

template <typename F>
auto and_then(F &&f) -> AndThenWrapper<std::decay_t<F>> {
  return {std::forward<F>(f)};
}

template <typename T, typename F,
          typename R = decltype(std::declval<F &&>()(*std::declval<mlir::FailureOr<T>>() ))>
auto operator|(mlir::FailureOr<T> value, AndThenWrapper<F> wrapper) -> R {
  if (mlir::failed(value)) {
    return mlir::failure();
  }
  return wrapper.func(*value);
}
```

---

* [ocaml result type](https://ocaml.org/manual/5.3/api/Result.html)
