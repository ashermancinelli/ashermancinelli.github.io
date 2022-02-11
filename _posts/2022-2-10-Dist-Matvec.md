---
layout: post
title: "HPC 101: Distributed Matrix-Vector Product"
permalink: /dist-matvec
category: c, c++, cuda, HPC
wip: true
---

The backbone of all scientific computing is linear algebra, often distributed and often using acceleration hardware and software such as OpenMP, CUDA, etc.
This post takes you from basic principles to a multi-node, GPU-accelerated example that calculates a matrix-vector product.

# Ground Work

_NOTE: This post assumes you have access to a computing cluster with multiple GPU nodes._

We'll be performing a matrix-vector dot product several ways in this post.
The operation is depicted below.

<center>
<img
  src="/images/hpc-101-matvec/matvec.png"
  alt="Matvec dot product, credit this post: https://hadrienj.github.io/posts/Deep-Learning-Book-Series-2.2-Multiplying-Matrices-and-Vectors/"
  >
</center>

<a href="https://godbolt.org/z/Y54Gqafff" target="blank">The code for such a calculation might look like this in C</a>, assuming you're not using any BLAS or LAPACK routines:

```c
typedef struct {
  double* d;
  int M;
  int N;
} mat_t;

typedef struct {
  double* d;
  int M;
} vec_t;

void dgemv(mat_t m, vec_t v, vec_t out) {

  // Ensure the output is all set to zero
  memset(out.d, 0.0, out.M);

  // For each column
  for (int i=0; i < m.M; i++)

    // For each row
    for (int j=0; j < m.N; j++)

      // Sum the products into the output vector
      out.d[i] += v.d[j] * m.d[j+(i*m.N)];
}
```

Here's some example data fed into our matrix vector product:
```c
int main() {
  mat_t m;
  m.d = malloc(sizeof(double[9]));
  m.M = 3;
  m.N = 3;
  for (int i=0; i < 9; i++)
    m.d[i] = (double)i;

  vec_t v;
  v.d = malloc(sizeof(double[3]));
  v.M = 3;
  for (int i=0; i < 3; i++)
    v.d[i] = 2.;
  
  vec_t out;
  out.d = malloc(sizeof(double[3]));
  out.M = 3;

  dgemv(m, v, out);

  free(m.d);
  free(v.d);
  free(out.d);

  return 0;
}
```

The output of this program (with some printing code added in):
```console
Matrix:
0.0 1.0 2.0 
3.0 4.0 5.0 
6.0 7.0 8.0 

Vector:
2.0 2.0 2.0 

Final vec:
6.0 24.0 42.0 
```

Feel free to verify these results and play around with other values using <a href="https://keisan.casio.com/exec/system/15052033860538" target="blank">online software like this casio calculator website.</a>

Now to parallelism: how might we go about parallelizing this algorithm?

The first part of the code to analyze is the _inner loop_, particularly for _loop dependence_.

# Algorithm Analysis

Let's return to the body of our `dgemv` function:

```c
void dgemv(mat_t m, vec_t v, vec_t out) {
  memset(out.d, 0.0, out.M);
  for (int i=0; i < m.M; i++)
    for (int j=0; j < m.N; j++)
      out.d[i] += v.d[j] * m.d[j+(i*m.N)];
}
```

The first question we must ask ourselves is this: _are any iterations of this loop dependent on values calculated in other iterations of the loop? Is iteration `N` dependent on calculations in iteration `N-1`?_
In other words, _are the loop bodies entirely_ ***independent*** _of each other?_

If so, our algorithm is _loop independent_ and _trivially parallelizable_.
<a href="https://www.cs.utexas.edu/~lin/cs380c/handout27.pdf" target="blank">These slides from a UT Austin lecture</a> are helpful additional reading on this topic.

## Loop Dependence

Let us return to the core loops in `dgemv`:
```c
  for (int i=0; i < m.M; i++) // loop A
    for (int j=0; j < m.N; j++) // loop B
      out.d[i] += v.d[j] * m.d[j+(i*m.N)];
```

The fundamental algorithm at play here is a _reduction_ or a _fold_.
If you see these terms elsewhere in literature, documentation, or algorithms in libraries or programming languages, they almost certainly mean the same thing.
Some collection of values are _reduced_ or _folded_ into a single value.

You might be thinking to yourself, _we are starting with a collection of values (a matrix) and yet we end up with a collection of values (a vector). How is this a reduction/fold?_

This is a good question: the reduction is not performed over the entire matrix, but only the _rows_ of the matrix.
Each row of the matrix is _reduced_ into a single value.
If we can thoroughly understand the underlying algorithms at play, parallelizing the algorithm will become much simpler.

<hr>

##### BQN Example

I'll briefly use BQN, a descendent of APL, to look at the fundamental algorithms at play; you don't have to know an APL in order to understand this, but it might be helpful 😁.
Feel free to skip this section; it is not critical to understanding the concepts.

<a href="https://mlochbaum.github.io/BQN/try.html#code=4oCiU2hvdyBtYXQg4oaQIDPigL8z4qWK4oaVMTAK4oCiU2hvdyB2ZWMg4oaQIDPipYoyCivLneKOiTEgbWF0w5d2ZWMK" target="blank">Here's a permalink to the BQN snippet.</a>

```
   # Same matrix as in our C example
   mat ← 3‿3⥊↕10
┌─       
╵ 0 1 2  
  3 4 5  
  6 7 8  
        ┘
   # Same vector as in our C example
   vec ← 3⥊2
⟨ 2 2 2 ⟩

   +˝⎉1 mat×vec
⟨ 6 24 42 ⟩
```

The core algorithm is seen in the final expression:

```
+˝⎉1 mat×vec
▲    ▲
│    │     ┌───────────────────────────┐
│    └─────┤Multiply rows of mat by vec│
│          │        element-wise       │
│          └───────────────────────────┘
│     ┌─────────────────────────┐
│     │Sum-reduce rows of matrix│
└─────┤ resulting from mat×vec  │
      └─────────────────────────┘
```

Alternatively:

<center>
<img height=300 src="/images/hpc-101-matvec/bqn-dgemv-explain.png" alt="Try BQN explanation of dgemv"/>
</center>

<hr>

We now hopefully understand that a matrix-vector product is formally _an array-extended multiply followed by a series of sum-reductions_ we can move on to parallelizing the algorithm.


# Links and References

* <a href="https://mlochbaum.github.io/BQN/try.html#code=4oCiU2hvdyBtYXQg4oaQIDPigL8z4qWK4oaVMTAK4oCiU2hvdyB2ZWMg4oaQIDPipYoyCivLneKOiTEgbWF0w5d2ZWMK" target="blank">BQN dgemv example</a>
* <a href="https://hadrienj.github.io/posts/Deep-Learning-Book-Series-2.2-Multiplying-Matrices-and-Vectors/" target="blank">Matrix-Vector Product image</a>
* <a href="https://www.cs.utexas.edu/~lin/cs380c/handout27.pdf" target="blank">UT Austin slides on loop-carried dependencies and parallelism</a>
