# BQN & Julia battle to the death!

_2022-01-26_

BQN and Julia battle to the death!


## Why?

Raz (@miguelraz_ on Twitter) suggested we work through some problems in BQN and Julia, each in the language we know less about, guiding each other through the problems.

## BQN

In our first call, Raz and I went through a couple BQN primitives to get him started with the language.
These are my notes from getting him set up:

```
   3‿3⥊↕10 # set up a matrix
┌─
╵ 0 1 2
  3 4 5
  6 7 8
        ┘
   ⌽3‿3⥊↕10 # reverse it
┌─
╵ 6 7 8
  3 4 5
  0 1 2
        ┘

   # transpose it and marvel at the
   # relationship between the ⌽ and ⍉ glyphs
   ⍉3‿3⥊↕10 
┌─
╵ 0 3 6
  1 4 7
  2 5 8
        ┘
```

When looking at the keyboard in the JS repl, it's helpful to note that:

* Functions are in green
* 1 Mod are in purple/pink
* 2 Mod are in yellow

Try to get a good feel for ¨, ⌜, and ´ as these are oft-used modifiers.

Note also that the following glyphs are special: `𝕤𝕩𝕨𝕣𝕗𝕘`.
These have special meaning inside function and modifier blocks.
For example:

```
   _Hi_←{(𝕨𝔽𝕩)+(𝕨𝔾𝕩)}
(2-modifier block)
   5 + _Hi_ × 3
23
```

Within the `_Hi_` block:
```
𝕤←{(𝕨+𝕩)+(𝕨×𝕩)}
𝕨←5
𝕩←3
𝕣←{(𝕨𝔽𝕩)+(𝕨𝔾𝕩)}
𝔽←+
𝔾←×
```

![Image explanation of this](/images/bqn-julia/2modifblock.png)

## Warming up with BQN, Julia, and C++

Leetcode problem: [_Maximum Gap_](https://leetcode.com/problems/maximum-gap/).

As C++ is my primary language, that's where I started with this problem.

This was my first pass to see if I understood the problem well enough:
```c++
int maximum_gap(vector<int>& nums) {
  if (nums.size() < 2)
    return 0;
  std::sort(nums.begin(), nums.end());
  int m=0;
  for (int i=1; i < nums.size(); i++) {
    m = std::max(m, std::abs(nums[i]-nums[i-1]));
  }
  return m;
}
```

This cleaned up version that uses Range V3 ([godbolt link](https://godbolt.org/z/4Pzfr1z1E)), however it may not use linear time and linear extra space. If you want to be a stickler about the time and space requirements, you can refer to Raz's final Julia solution or my previous C++ solution.
```c++
int solve(auto& v) {
    if (v.size() < 2) return 0;
    sort(v);
    return max(views::transform(v, v | views::drop(1),
        [] (auto a, auto b) {
            return std::abs(a-b);
        }));
}
```

This uses a suggestion in an issue in the [Range V3 github](https://github.com/ericniebler/range-v3/issues/243#issuecomment-157419542).
I would rather have an adjacent difference view I could pipe to.

I then moved on to BQN:
```
   i←⟨
     3‿6‿9‿1 # Real test case, answer is 3
     1       # Len 1, ans 0
     @       # Len 0, ans 0
   ⟩
   F1←(2>≠)◶{⊑∨|-˝⍉2↕∧𝕩}‿0
   F3←(2>≠)◶(⊑∘∨(|-˝∘⍉∘(2⊸↕∘∧)))‿0 # Tacit version
   F1¨i
⟨ 3 0 0 ⟩
   F2¨i
⟨ 3 0 0 ⟩
```

My first Julia solution felt very inelegant - I would have written almost the same code verbatim if I were writing Fortran, which Julia is hoping to replace in many instances.
I look forward to seeing what other solutions the Julia experts could show me.

I don't think this solution uses linear time either.
```julia
function solve(nums)
  if length(nums) < 2
    return 0
  end
  nums = sort(nums)
  m = -1
  n = nothing
  for i in nums
    if n == nothing
      n = i
      continue
    end
    m = max(m, abs(n-i))
    n = i
  end
  return m
end
```

Raz's solution:
```julia
function sol(arr)
    # Bail early if too short
    length(arr) < 2 && return 0
    # take the maximum of the diff
    mini = minimum(arr)
    # Use in-place RadixSort to modify `arr`
    sort!(arr, alg = RadixSort)
    # Take the max of the diff
    maximum(diff(arr))
end
```

