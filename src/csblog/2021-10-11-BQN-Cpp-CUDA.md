<!--
layout: post
title: BQN and CUDA C++ LeetCode Solutions
permalink: /bqn-cuda-cpp-lc-longest-valid-parens
category: bqn, c++, cuda, leetcode
wip: false
cat: cs
-->

Solving a hard leetcode problem in the BQN APL dialect and CUDA C++!

*NOTE: This post is a transcript of [the youtube video linked here](https://youtu.be/3D7sfXzBBXE).*


## Problem

Hello everyone, today I'd like to go through two solutions to a LeetCode problem.
We'll first look at the solution with the BQN array language, and then we'll look at a GPU-capable solution in CUDA that uses the Thrust template library.


[Link here](https://leetcode.com/problems/longest-valid-parentheses/).

Given a string containing just the characters '(' and ')', find the length of the longest valid parentheses substring.

For example, for the string `")()())"` the expected answer is 4, and for this string the expected answer is two: `"())"`. Of course, for an empty string the answer is 0.

We'll be looking at the solution in BQN first.

## BQN/APL Solution

Here is the full solution:
```
   F ← {0⌈1+⌈´⌈´¨∾¨1↓¨⊔¨0=+`¨1-˜¨2×¨↓")("⊸⊐ 𝕩}
   F ")()())"
4
   F "(()"
2
   F ""
0
```

I take the index into the string `")("` to convert to integers and I take all the prefixes of that array.
```
   {↓")("⊸⊐ 𝕩} "(()"
⟨ ⟨ 1 1 0 ⟩ ⟨ 1 0 ⟩ ⟨ 0 ⟩ ⟨⟩ ⟩
```

I then multiply by two and subtract one so each index represents the change in the level of nesting at that index.
```
   {1-˜¨2×¨↓")("⊸⊐ 𝕩} "(()"
⟨ ⟨ 1 1 ¯1 ⟩ ⟨ 1 ¯1 ⟩ ⟨ ¯1 ⟩ ⟨⟩ ⟩
```

I then plus-scan to find the cumulative level of nesting up to that index for each prefix of the array:
```
   {+`¨1-˜¨2×¨↓")("⊸⊐ 𝕩} "(()"
⟨ ⟨ 1 2 1 ⟩ ⟨ 1 0 ⟩ ⟨ ¯1 ⟩ ⟨⟩ ⟩
```

Find the zeros in each prefix, since these are the locations where the substring is balanced:
```
   {0=+`¨1-˜¨2×¨↓")("⊸⊐ 𝕩} "(()"
⟨ ⟨ 0 0 0 ⟩ ⟨ 0 1 ⟩ ⟨ 0 ⟩ ⟨⟩ ⟩
```

We can then group the results to find the indices which are nonbalanced and balanced for each prefix:
```
   {⊔¨0=+`¨1-˜¨2×¨↓")("⊸⊐ 𝕩} "(()"
┌─                                            
· ⟨ ⟨ 0 1 2 ⟩ ⟩ ⟨ ⟨ 0 ⟩ ⟨ 1 ⟩ ⟩ ⟨ ⟨ 0 ⟩ ⟩ ⟨⟩  
                                             ┘
   {⊔¨0=+`¨1-˜¨2×¨↓")("⊸⊐ 𝕩} ")()())" # Longer problem
┌─                                                                                                              
· ⟨ ⟨ 0 2 4 5 ⟩ ⟨ 1 3 ⟩ ⟩ ⟨ ⟨ 0 2 4 ⟩ ⟨ 1 3 ⟩ ⟩ ⟨ ⟨ 0 2 3 ⟩ ⟨ 1 ⟩ ⟩ ⟨ ⟨ 0 2 ⟩ ⟨ 1 ⟩ ⟩ ⟨ ⟨ 0 1 ⟩ ⟩ ⟨ ⟨ 0 ⟩ ⟩ ⟨⟩  
                                                                                                               ┘  
```

We can then of course drop the first list in each prefix so we only have the balanced indices. I'll switch to the longer problem here so it's a little easier to see what's happening:
```
   {1↓¨⊔¨0=+`¨1-˜¨2×¨↓")("⊸⊐ 𝕩} ")()())"
┌─                                                      
· ⟨ ⟨ 1 3 ⟩ ⟩ ⟨ ⟨ 1 3 ⟩ ⟩ ⟨ ⟨ 1 ⟩ ⟩ ⟨ ⟨ 1 ⟩ ⟩ ⟨⟩ ⟨⟩ ⟨⟩  
                                                       ┘
```

We can then flatten the sublists together and find the largest element, which represents the index in a given prefix with the longest valid substring:
```
   {⌈´⌈´¨∾¨1↓¨⊔¨0=+`¨1-˜¨2×¨↓")("⊸⊐ 𝕩} ")()())"
3
```

Because we are using 0-based indices as God intended, we'll have to add one to the result.
We'll also take the maximum of our result and 0 in case no balanced substrings were found, which would otherwise give us `¯∞`:
```
   {0⌈1+⌈´⌈´¨∾¨1↓¨⊔¨0=+`¨1-˜¨2×¨↓")("⊸⊐ 𝕩} ")()())"
4
```

Finally, let's look at all the test cases:
```
   F ← {0⌈1+⌈´⌈´¨∾¨1↓¨⊔¨0=+`¨1-˜¨2×¨↓")("⊸⊐ 𝕩}
   F ")()())"
4
   F "(()"
2
   F ""
0
```

Now that we've gone through the BQN solution, let's take a look at the CUDA and Thrust solution

## CUDA/Thrust Solution

Here is the full solution, minus some includes and using statements:
```cpp
auto solve(const string& problem) -> int {
  const int N = problem.size();
  if (0 == N)
    return 0;

  host_vector<int> mapping;
  mapping.reserve(N);
  std::transform(problem.begin(), problem.end(), std::back_inserter(mapping),
                 [=](const char &c) { return c == '(' ? 1 : -1; });
  device_vector<int> d_mapping = mapping;

  vector<int> starts(N - 1);
  std::iota(starts.begin(), starts.end(), 0);

  int max_len = std::accumulate(
      starts.begin(), starts.end(), 0,
      [&d_mapping, N](int max_so_far, int i) {
        device_vector<int> prefix(N-i);
        thrust::inclusive_scan(d_mapping.begin()+i, d_mapping.end(), prefix.begin());

        device_vector<int> indices(N - i);
        thrust::sequence(indices.begin(), indices.end(), 0);

        auto zip_start = thrust::make_zip_iterator(
            thrust::make_tuple(prefix.begin(), indices.begin()));
        auto zip_end = thrust::make_zip_iterator(
            thrust::make_tuple(prefix.end(), indices.end()));

        int max_for_prefix = thrust::transform_reduce(
            zip_start, zip_end,
            [=] __device__(const auto &tup) -> int {
              return thrust::get<0>(tup) == 0 ? 1 + thrust::get<1>(tup) : 0;
            },
            0, thrust::maximum<int>());

        return std::max(max_so_far, max_for_prefix);
      });

  return max_len;
}

int main() {
  for (const string &problem : { ")()())", "(()", "" })
    std::cout << solve(problem) << "\n";
  return 0;
}
```

This is quite a lot to take in, so let's break it down.


First I grab the problem size so I don't have to keep repeating myself, and I check to make sure our problem size is greater than zero.
I then transform the string into integers and copy the data to the GPU device.
This step is just like the bqn solution up until this point.
```cpp
  const int N = problem.size();
  if (0 == N)
    return 0;

  host_vector<int> mapping;
  mapping.reserve(N);
  std::transform(problem.begin(), problem.end(), std::back_inserter(mapping),
                 [=](const char &c) { return c == '(' ? 1 : -1; });
  device_vector<int> d_mapping = mapping;
```
In BQN:
```
{1-˜¨2×¨↓")("⊸⊐ 𝕩}
```

I then create an STL vector to hold the starting positions for each prefix.
I'm using the STL here instead of Thrust because I'll otherwise have to nest my CUDA calls, and not all of the Thrust API is callable on the GPU device.
Ideally, we fit as much of our algorithm onto the GPU device to minimize any data transfer between memory spaces, but I still ended up using a mixture of the STL and Thrust.
```cpp
  vector<int> starts(N - 1);
  std::iota(starts.begin(), starts.end(), 0);
```

Because of how the stl algorithms are used, we have to now go to the end of our
BQN solution. This call to accumulate corresponds to our outter reduction in our BQN solution here:
```cpp
  // BQN) F ← {0⌈1+⌈´⌈´¨∾¨1↓¨⊔¨0=+`¨1-˜¨2×¨↓")("⊸⊐ 𝕩}
  //               ^
  //              here

  int max_len = std::accumulate(
      starts.begin(), starts.end(), 0,
      [&d_mapping, N](int max_so_far, int i) {
        // ...
      });
```

We're reducing over the maximum balanced substring for each prefix of the input string.

Next I create a device vector for the given prefix, and take the prefix sum of the current prefix.
```cpp
  // BQN) +`
  int max_len = std::accumulate(...
        device_vector<int> prefix(N-i);
        thrust::inclusive_scan(d_mapping.begin()+i, d_mapping.end(), prefix.begin());
```

I then create an *iota* to zip with our prefix-summed substring (or a *range* in BQN parlance, or a *sequence* in Thrust parlance (can't we all just agree on a term here...)):
```cpp
        device_vector<int> indices(N - i);
        thrust::sequence(indices.begin(), indices.end(), 0);

        auto zip_start = thrust::make_zip_iterator(
            thrust::make_tuple(prefix.begin(), indices.begin()));
        auto zip_end = thrust::make_zip_iterator(
            thrust::make_tuple(prefix.end(), indices.end()));        
```

This corresponds to the *couple* dyad in BQN or the *zip* function in Python and lots of functional languages.

I then perform two algorithms in this one step. If the given position in the prefix-summed substring is zero, that means it's balanced and I want to keep the index.
Otherwise, I can just throw it out.
After performing this transform or map algorithm, I take the max reduction of the substring to find the greatest index at which the substring is balanced.
If there are multiple points in the substring where the parens are balanced, this will find the greatest one.
```cpp
        int max_for_prefix = thrust::transform_reduce(
            zip_start, zip_end,
            [=] __device__(const auto &tup) -> int {
              return thrust::get<0>(tup) == 0 ? 1 + thrust::get<1>(tup) : 0;
            },
            0, thrust::maximum<int>());
```

I then return the maximum balanced substring for the current prefix, which is then folded in the outter `std::accumulate` to find the greatest balanced substring for all prefixes in the original string.
```cpp
  int max_len = std::accumulate(...
        [...](int max_so_far, int i) {
            int max_for_prefix = ...
            return std::max(max_so_far, max_for_prefix);
        });
```

I then return the maximum length I found, and we have our answer!
```cpp
auto solve(const string& problem) -> int {
  ...
  int max_len = std::accumulate(...);
  return max_len;
}
```

I ran this with the same test cases like so:
```cpp
int main() {
  for (const string &problem : { ")()())", "(()", "" })
    std::cout << solve(problem) << "\n";
  return 0;
}
```

And running gave me:
```console
$ ./src/thrust/lc-longest-valid-parens
4
2
0
```

Just like we expected!

## YouTube Video Description

We solve a hard leetcode problem in both BQN and CUDA C++ with the Thrust library.

## Conclusion

Thanks for tuning in and I hope you enjoyed this example program.
You can find all the GPU examples I used in the links below.
Connor Hoekstra, if you're reading or watching this, I hope to see you out-do my BQN and CUDA solutions in another video :).

{% include footer.html %}

## Links

* [Repo for GPU Examples](https://github.com/ashermancinelli/portable-alg-testbed)
* [Repo for BQN/APL Examples](https://github.com/ashermancinelli/apl-snippets)
* [YouTube Channel](https://www.youtube.com/channel/UCZ5sL4E662VP1ZwC4h85ttQ)
* [Blog](http://www.ashermancinelli.com/)
* [LinkedIn](https://www.linkedin.com/in/asher-mancinelli-bb4a56144/)
* [LeetCode Problem](https://leetcode.com/problems/longest-valid-parentheses/)
