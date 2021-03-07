---
layout: post
title: GTests Type and Value Parameterized Tests
permalink: /gtest-type-val-param
---

GTest exposes clean interfaces for parameterizing your tests by value and by
type - but what if you want both?

## Getting Started

Let's start with an interface to test:

```cpp
// addone.hpp
#pragma once

template<typename T>
auto addOne(T t) {
  return t + 1;
}
```

Our first test might look like this:

```cpp
#include <gtest/gtest.h>
#include "addone.hpp"

TEST(AddOneTests, doAddTo5) {
  ASSERT_EQ(addOne(5), 6) << "addOne(5) != 6!";
}
```

What if we want to test multiple values without repeating code?
Instead of something like this:

```cpp
TEST(AddOneTests, doAddTo5) {
  ASSERT_EQ(addOne(5), 6) << "addOne(5) != 6!";
  ASSERT_EQ(addOne(6), 7) << "addOne(6) != 7!";
  ...
}
```

## Value Parameterized Tests

We can parameterize our test by value with a fixture:

```cpp
struct AddOneTestsFixture
    : public testing::TestWithParam<std::tuple<int, int>> {};

TEST_P(AddOneTestsFixture, doAdd) {
  int input = std::get<0>(GetParam());
  int expect = std::get<1>(GetParam());
  ASSERT_EQ(addOne(input), expect)
      << "addOne(" << input << ") != " << expect << "!";
}

INSTANTIATE_TEST_SUITE_P(
    AddOneTests,
    AddOneTestsFixture,
    testing::Values(
      std::make_tuple(1, 2),
      std::make_tuple(3, 4),
      std::make_tuple(9, 10)));
```

This way, our tests run over all values we pass in at the end:

```console
$ ./tests
Running main() from /tmp/googletest-20201214-81667-fx54ix/googletest-release-1.10.0/googletest/src/gtest_main.cc
[==========] Running 3 tests from 1 test suite.
[----------] Global test environment set-up.
[----------] 3 tests from AddOneTests/AddOneTestsFixture
[ RUN      ] AddOneTests/AddOneTestsFixture.doAdd/0
[       OK ] AddOneTests/AddOneTestsFixture.doAdd/0 (0 ms)
[ RUN      ] AddOneTests/AddOneTestsFixture.doAdd/1
[       OK ] AddOneTests/AddOneTestsFixture.doAdd/1 (0 ms)
[ RUN      ] AddOneTests/AddOneTestsFixture.doAdd/2
[       OK ] AddOneTests/AddOneTestsFixture.doAdd/2 (0 ms)
[----------] 3 tests from AddOneTests/AddOneTestsFixture (0 ms total)

[----------] Global test environment tear-down
[==========] 3 tests from 1 test suite ran. (0 ms total)
[  PASSED  ] 3 tests.
```

## Type Parameterized Tests

Our interface `addOne` takes a template parameter - what if we want to test this
on multiple types?

First, we'll want our fixture to take template parameters and we'll have to
declare the fixture as templated in GTest:

```cpp
template<typename T>
struct AddOneTestsFixture : public ::testing::Test {};
TYPED_TEST_SUITE_P(AddOneTestsFixture);
```

And keep the first iteration of our test, but this time using the `TypeParam`
type exposed by the GTest `TYPED_TEST_SUITE` api:

```cpp
TYPED_TEST_P(AddOneTestsFixture, doAddOne) {
  ASSERT_EQ(addOne<TypeParam>(5), 6) << "addOne(5) != 6!";
}
```

We'll also have to register each test with our typed test suite:
```cpp
REGISTER_TYPED_TEST_SUITE_P(AddOneTestsFixture, doAddOne);
```

If we had more tests, you would register them in the same statement as above:
```cpp
REGISTER_TYPED_TEST_SUITE_P(AddOneTestsFixture, doAddOne, doAddTwo, ...);
```

We are then able to instantiate our templated test suite with all the types we
intend to use with our test suite:
```cpp
using Types = testing::Types<int, long long, std::size_t>;
INSTANTIATE_TYPED_TEST_SUITE_P(TestPrefix, AddOneTestsFixture, Types);
```

And our type-parameterized tests are working!
```console
$ ./tests
Running main() from /tmp/googletest-20201214-81667-fx54ix/googletest-release-1.10.0/googletest/src/gtest_main.cc
[==========] Running 4 tests from 4 test suites.
[----------] Global test environment set-up.
[----------] 1 test from TestPrefix/AddOneTestsFixture/0, where TypeParam = int
[ RUN      ] TestPrefix/AddOneTestsFixture/0.doAddOne
[       OK ] TestPrefix/AddOneTestsFixture/0.doAddOne (0 ms)
[----------] 1 test from TestPrefix/AddOneTestsFixture/0 (0 ms total)

[----------] 1 test from TestPrefix/AddOneTestsFixture/2, where TypeParam = long long
[ RUN      ] TestPrefix/AddOneTestsFixture/2.doAddOne
[       OK ] TestPrefix/AddOneTestsFixture/2.doAddOne (0 ms)
[----------] 1 test from TestPrefix/AddOneTestsFixture/2 (0 ms total)

[----------] 1 test from TestPrefix/AddOneTestsFixture/3, where TypeParam = unsigned long
[ RUN      ] TestPrefix/AddOneTestsFixture/3.doAddOne
[       OK ] TestPrefix/AddOneTestsFixture/3.doAddOne (0 ms)
[----------] 1 test from TestPrefix/AddOneTestsFixture/3 (0 ms total)

[----------] Global test environment tear-down
[==========] 4 tests from 4 test suites ran. (0 ms total)
[  PASSED  ] 4 tests.
```

## Type ***and*** Value Parameterized Tests

Now is the tricky part - GTest doesn't expose an API for parameterizing tests
over values and types so we have to do some work ourselves.

First, let's define the types and input data we'll be parameterizing our tests over:
```cpp
template <typename T>
using ParamT = std::vector<std::tuple<T, T>>;

static std::tuple<ParamT<int>, ParamT<long long>, ParamT<std::size_t>> allParams{
  { // Test cases for int
    std::make_tuple(1, 2),
    std::make_tuple(5, 6),
    std::make_tuple(9, 10),
  },
  { // Test cases for long long
    std::make_tuple(1, 2),
    std::make_tuple(5, 6),
    std::make_tuple(9, 10),
  },
  { // Test cases for size_t
    std::make_tuple(1, 2),
    std::make_tuple(5, 6),
    std::make_tuple(9, 10),
  },
};
```

This structure assumes you may want to add test inputs later on that may be
different depending on the type.
If this is not the case and you know your `make_tuple` calls are `static_cast`-able
into your parameter type, you may do the following to reduce code duplication:

```cpp
#define ADDONE_TESTPARAMS                                                      \
  { std::make_tuple(1, 2), std::make_tuple(5, 6), std::make_tuple(9, 10), }
static std::tuple<ParamT<int>, ParamT<long long>, ParamT<std::size_t>> allParams{
        ADDONE_TESTPARAMS, ADDONE_TESTPARAMS, ADDONE_TESTPARAMS, };
```

Now, let's refactor our fixture to take the types and values we just defined:
```cpp
template <typename T>
struct AddOneTestsFixture : public testing::Test {
  AddOneTestsFixture() : params{std::get<ParamT<T>>(allParams)} {}
  ParamT<T> params;
};
```

You may notice we set `params` to `std::get< ParamT<T> >(allParams)` - this is how
we accomplish type *and* value parameterized tests.
We use the infrastructure of a type parameterized test, and leverage `std::tuple`
to do the value parameterization.

For the actual test code, we again reuse most of the test from our first type-
parameterized test, this time using the `params` field of our test fixture:
```cpp
TYPED_TEST_P(AddOneTestsFixture, doAddOne) {

  // Iterate over the parameters configred by our fixture
  for(auto const& [input, expect] : this->params) {

    // The assertions stay the same as in our original type-parameterized test
    ASSERT_EQ(addOne(input), expect)
      << "addOne(" << input << ") != " << expect << "!";
  }
}
```

And voilà! our tests are parameterized over values and types:
```console
$ ./tests
Running main() from /tmp/googletest-20201214-81667-fx54ix/googletest-release-1.10.0/googletest/src/gtest_main.cc
[==========] Running 3 tests from 3 test suites.
[----------] Global test environment set-up.
[----------] 1 test from TestPrefix/AddOneTestsFixture/0, where TypeParam = int
[ RUN      ] TestPrefix/AddOneTestsFixture/0.doAddOne
[       OK ] TestPrefix/AddOneTestsFixture/0.doAddOne (0 ms)
[----------] 1 test from TestPrefix/AddOneTestsFixture/0 (0 ms total)

[----------] 1 test from TestPrefix/AddOneTestsFixture/1, where TypeParam = long long
[ RUN      ] TestPrefix/AddOneTestsFixture/1.doAddOne
[       OK ] TestPrefix/AddOneTestsFixture/1.doAddOne (0 ms)
[----------] 1 test from TestPrefix/AddOneTestsFixture/1 (0 ms total)

[----------] 1 test from TestPrefix/AddOneTestsFixture/2, where TypeParam = unsigned long
[ RUN      ] TestPrefix/AddOneTestsFixture/2.doAddOne
[       OK ] TestPrefix/AddOneTestsFixture/2.doAddOne (0 ms)
[----------] 1 test from TestPrefix/AddOneTestsFixture/2 (0 ms total)

[----------] Global test environment tear-down
[==========] 3 tests from 3 test suites ran. (0 ms total)
[  PASSED  ] 3 tests.
```

## Full Code Listing

```cpp
// addone.hpp
#pragma once
template<typename T>
auto addOne(T t) {
  return t + 1;
}
```

```cpp
// addone_test.cpp
#include "addone.hpp"
#include <gtest/gtest.h>
#include <tuple>
#include <vector>

template <typename T>
using ParamT = std::vector<std::tuple<T, T>>;

static std::tuple<ParamT<int>, ParamT<long long>, ParamT<std::size_t>> allParams{
  {
    // Test cases for int
    std::make_tuple(1, 2),
    std::make_tuple(5, 6),
    std::make_tuple(9, 10),
  },
  {
    // Test cases for long long
    std::make_tuple(1, 2),
    std::make_tuple(5, 6),
    std::make_tuple(9, 10),
  },
  {
    // Test cases for size_t
    std::make_tuple(1, 2),
    std::make_tuple(5, 6),
    std::make_tuple(9, 10),
  },
};

template <typename T>
struct AddOneTestsFixture : public testing::Test {
  AddOneTestsFixture() : params{std::get<ParamT<T>>(allParams)} {}
  ParamT<T> params;
};

TYPED_TEST_SUITE_P(AddOneTestsFixture);

TYPED_TEST_P(AddOneTestsFixture, doAddOne) {
  for(auto const& [input, expect] : this->params) {
    ASSERT_EQ(addOne(input), expect)
      << "addOne(" << input << ") != " << expect << "!";
  }
}

REGISTER_TYPED_TEST_SUITE_P(AddOneTestsFixture, doAddOne);

using Types = testing::Types<int, long long, std::size_t>;
INSTANTIATE_TYPED_TEST_SUITE_P(TestPrefix, AddOneTestsFixture, Types);
```

Makefile used for this post:
```make
CFLAGS := -I/usr/local/Cellar/googletest/1.10.0/include
CFLAGS += -L/usr/local/Cellar/googletest/1.10.0/lib -lgtest -lgtest_main
CFLAGS += -lpthread -std=c++17
CXX    =  clang++

all:
	$(CXX) addone_test.cpp $(CFLAGS) -o tests
```

## References

- [Blog Post: Parameterized testing with GTest](https://www.sandordargo.com/blog/2019/04/24/parameterized-testing-with-gtest)
- [SO Question: Is there a way to combine a test which is both type parameterized and value parameterized?](https://stackoverflow.com/questions/8507385/google-test-is-there-a-way-to-combine-a-test-which-is-both-type-parameterized-a)
- [GTest advanced docs](https://github.com/google/googletest/blob/master/docs/advanced.md)
- [Flang unittests](https://github.com/llvm/llvm-project/tree/main/flang/unittests)
