---
layout: post
title: BQN and Reflections on the Joy of Programming
permalink: /bqn-reflections
category: BQN, c++
wip: false
---

Solve a leetcode problem in BQN and I rant about the joy of programming.

## Leetcode

<a href="https://leetcode.com/problems/set-matrix-zeroes" target="blank">
  The Leetcode problem is "Set Matrix Zeroes"
</a>
where we're tasked with setting rows and columns of a matrix that contain zero to be all zeroes.

## BQN Solution

```
   i←⟨
     3‿4⥊⟨0,1,3,0,3,4,5,2,1,3,1,5⟩
     3‿3⥊⟨1,1,1,1,0,1,1,1,1⟩
   ⟩

   Z ← {
     bm←0=𝕩
     a←∨` ∨`⌾⌽ bm
     b←(∨`˘) ((∨`˘)⌾(⌽˘)) bm
     𝕩×a¬∘∨b
   }
   
   ⟨"#1","#2"⟩∾i≍Z¨i
┌─                       
╵ "#1"        "#2"       
  ┌─          ┌─         
  ╵ 0 1 3 0   ╵ 1 1 1    
    3 4 5 2     1 0 1    
    1 3 1 5     1 1 1    
            ┘         ┘  
  ┌─          ┌─         
  ╵ 0 0 0 0   ╵ 1 0 1    
    0 4 5 0     0 0 0    
    0 3 1 0     1 0 1    
            ┘         ┘  
                        ┘
```

Some other solutions from the BQN Matrix chat room:
```
   ⊢×0≠∧˝˘∧⌜∧˝           # Marshall & Dzaima (tacit!)
   (≠⥊∧´)˘{𝕩×(𝔽⌾⍉∧𝔽)0≠𝕩} # Dzaima & Rampoina
   {𝕩×(∧˝˘∧≢⥊∧˝)0≠𝕩}     # Dzaima
```

## On the Joy of Programming

I stumbled upon this thread on twitter describing how Kurt Vonnegut responded to a letter from a high school English student asking for life advice.
In short, his response was to do art and enjoy the process of becoming who you are.

<center>
  <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Tear it up into teeny-weeny pieces, and discard them into widely separated trash receptacles. You will find that you have already been gloriously rewarded for your poem. You have experienced becoming, learned a lot more about what’s inside you, and you have made your soul grow.</p>&mdash; Gabe Hudson (@gabehudson) <a href="https://twitter.com/gabehudson/status/1521139749322477569?ref_src=twsrc%5Etfw">May 2, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>

Creating art seems to be central to the importance of life as far as I can tell.

<a href="https://www.arraycast.com/episodes/episode26-stevan-apter" target="blank">
  The most recent episode of ArrayCast with Stevan Apter dipped into this as well when the panelists discussed the aesthetic of writing APL.
</a>
In some ways they were a little reserved about saying they enjoy APL at least in part due to the aesthetic of the language.
I don't think this is something to shy away from - if we can't appreciate the beauty of what we do, why are we doing it at all?

I loved working through this rather simple problem.

I loved the process of visualizing the inputs, of thinking through possible solutions while going about my day.

I loved taking my solution to the BQN forum for more gifted and practiced BQN-ers to find far simpler and more elegant solutions than mine.

The whole process felt like writing a poem, and at the end I'm rewarded by sharing this poem with others, seeing what they come up with, and comparing their thoughts with mine.

There is a unique joy and beauty I find in BQN (and APL more broadly), and that's what keeps me coming back.

As Kurt Vonnegut pointed out, what else could be a more worthwhile way to spend my time?

<!---
## C++ Solution

I'll also include my C++ solution for kicks and giggles:

```cpp
void setZeroes(vector<vector<int>>& m) {
  const auto rs = m.size(), cs = m[0].size();
  vector<int> rows, cols;
  for (int i=0; i<rs; i++)
    for (int j=0; j<cs; j++)
      if (0 == m[i][j]) {
        rows.push_back(i);
        cols.push_back(j);
      }
  for (const auto r : rows)
    std::fill(m[r].begin(), m[r].end(), 0);
  for (const auto c : cols)
    for (auto& r : m)
      r[c] = 0;
}
```
-->
