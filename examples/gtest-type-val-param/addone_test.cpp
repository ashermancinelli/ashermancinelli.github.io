#include "addone.hpp"
#include <gtest/gtest.h>
#include <tuple>
#include <vector>

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

/*
TEST_P(AddOneTestsFixture, doAdd) {
  int input = std::get<0>(GetParam());
  int expect = std::get<1>(GetParam());
  ASSERT_EQ(addOne(input), expect)
      << "addOne(" << input << ") != " << expect << "!";
}

INSTANTIATE_TEST_SUITE_P(
    AddOneTests,
    AddOneTestsFixture,
    ::testing::Values(
      std::make_tuple(1, 2),
      std::make_tuple(3, 4),
      std::make_tuple(9, 10)));
*/
