---
layout: post
title: "HPC 101: Distributed Matrix-Vector Product"
permalink: /dist-matvec
category: c, c++, cuda, HPC
wip: true
---

{% include latex.html %}
{% include mermaid.html %}

The backbone of all scientific computing is linear algebra, often distributed and often using acceleration hardware and software such as OpenMP, CUDA, etc.
This post takes you from basic principles to a multi-node, GPU-accelerated example that calculates a matrix-vector product.

{% include disclaimer.html %}

# Key Takeaways

These are the key takeaways from this post.
If you don't read the entire post, at least take these points:

1. Correctness precedes parallelism and performance
2. Identify and understand the underlying algorithms at play

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

<a href="https://godbolt.org/z/qoG7cebno" target="blank">(minimal version here)</a>
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

Feel free to verify these results and play around with other values using <a href="https://keisan.casio.com/exec/system/15052033860538" target="blank">online software like this CASIO calculator website.</a>

Ensuring that we have a _correct_ algorithm is a precondition for optimizing and parallelizing an algorithm:

> Correctness precedes parallelism or performance

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

<!---

For the following definitions:

<center>
$$
  \\
  M \gets   \left[ {\begin{array}{cc}
    0 & 1 & 2 \\
    3 & 4 & 5 \\
    6 & 7 & 8 \\
  \end{array} } \right] ,
  v \gets \left[ {\begin{array}{cc} 2 \\ 2 \\ 2  \end{array} } \right]
  \\
$$
</center>

--->

Let `p` be the result of the dot product of matrix `Mat` and vector `v`.
The dot product is calculated like so:

<center>
$$
\\
  p \gets Mat \cdot v =
  \left[ {\begin{array}{cc}
    (Mat_{0,0} \cdot v_0) + (Mat_{0,1} \cdot v_1) + (Mat_{0,2} \cdot v_2) \\
    (Mat_{1,0} \cdot v_0) + (Mat_{1,1} \cdot v_1) + (Mat_{1,2} \cdot v_2) \\
    (Mat_{2,0} \cdot v_0) + (Mat_{2,1} \cdot v_1) + (Mat_{2,2} \cdot v_2) \\
  \end{array} } \right]
\\
$$
<!---
  =   \left[ {\begin{array}{cc}
    6 \\ 24 \\ 42
  \end{array} } \right]
  --->
</center>

Notice how values of `v` are broadcast to match the shape of `Mat`:

<center>
$$
\\
  \left[ {\begin{array}{c}
    v_{0} & v_{1} & \cdots & v_{n}\\
    v_{0} & v_{1} & \cdots & v_{n}\\
    \vdots & \vdots & \ddots & \vdots\\
    v_{0} & v_{1} & \cdots & v_{n}\\
  \end{array} } \right]
\\
$$
</center>

We can now overlay the matrix obtained by broadcasting values of `v` into columns onto the matrix `Mat`, creating a matrix of tuples (or a 3d matrix if you prefer):

<center>
$$
\\
  tuplespace \gets
  \left[ {\begin{array}{cc}
    (Mat_{0,0}, v_0) & (Mat_{0,1}, v_1) & (Mat_{0,2}, v_2) \\
    (Mat_{1,0}, v_0) & (Mat_{1,1}, v_1) & (Mat_{1,2}, v_2) \\
    (Mat_{2,0}, v_0) & (Mat_{2,1}, v_1) & (Mat_{2,2}, v_2) \\
  \end{array} } \right]
\\
$$
</center>

This is sometimes called a _tuple space_, or the _domain_ of our algorithm.
The book <a href="https://www.worldcat.org/title/how-to-write-parallel-programs-a-first-course/oclc/912171709&referer=brief_results" target="blank">_How to Write Parallel Programs: A First Course_</a> covers tuple spaces in great detail.

Now that we have constructed our tuple space, we might group our computations into self-contained units of work along each row.

Partitioning our tuple space row-wise gives:
<center>
$$
\\
  tuplespace \gets
  \left[ {\begin{array}{ccc}
    (Mat_{0,0}, v_0) & (Mat_{0,1}, v_1) & (Mat_{0,2}, v_2) \\
    \hline \\
    (Mat_{1,0}, v_0) & (Mat_{1,1}, v_1) & (Mat_{1,2}, v_2) \\
    \hline \\
    (Mat_{2,0}, v_0) & (Mat_{2,1}, v_1) & (Mat_{2,2}, v_2) \\
  \end{array} } \right]
\\
$$
</center>

Let _tuplespace_ be the 2 dimensional matrix tuple space given above.
We then may form a vector with units of work yielding indices of the output vector:

<center>
$$
\\
  \left[ {\begin{array}{cccc}
    w(0) \gets \sum_{i \gets 0}^{N} tuple_{i, 0} \cdot tuple_{i, 1} \\
    w(1) \gets \sum_{i \gets 0}^{N} tuple_{i, 0} \cdot tuple_{i, 1} \\
    \vdots \\
    w(M) \gets \sum_{i \gets 0}^{N} tuple_{i, 0} \cdot tuple_{i, 1} \\
  \end{array} } \right]
\\
$$
</center>

Equivalently:

<center>
$$
\\
  \left[ {\begin{array}{cccc}
    w(0) \gets \sum_{i \gets 0}^{N} Mat_{0,i} \cdot v_{i} \\
    w(1) \gets \sum_{i \gets 0}^{N} Mat_{1,i} \cdot v_{i} \\
    \vdots \\
    w(M) \gets \sum_{i \gets 0}^{N} Mat_{M,i} \cdot v_{i} \\
  \end{array} } \right]
\\
$$
</center>

Our units of work may independently operate on subsets (rows) of our tuple space.

The algorithm each unit of work performs is called _transform-reduce_ (or sometimes _map-reduce_).

Although _transform-reduce_ might seem like two algorithms (it kinda is!), it is such a universal operation that it is often considered it's own algorithm (or at least it's packaged as its own algorithm in libraries).
For example, <a href="https://thrust.github.io/doc/group__transformed__reductions_ga0d4232a9685675f488c3cc847111e48d.html" target="blank">the Thrust abstraction library that ships with NVIDIA's CUDA Toolkit has the _transform-reduce_ algorithm built-in.</a>

In this case, we would like to _transform_ our input tuples by multiplying two elements together, and then _reduce_ our input using the sum operator.

In Python, a given unit of work might look like this:

```python
from functools import reduce
tuplespace_row0 = [
    (0, 2),
    (1, 2),
    (2, 2),
    ]

def work(tupl):
    return reduce(
            lambda a, b: a + b,        # use + to reduce
            map(lambda x: x[0] * x[1], # use * to transform
                tupl                   # input tuple
                )
            )

# Input to map is mat_row
# Input to reduce is [0, 2, 4]
# Final value is 6
print(work(tuplespace_row0)) # yields 6
```

The following formula is a more formal definition of a single unit of work in our example:

<center>
$$
\\
  r \gets current rank \\
  W_{r} \gets \sum_{i \gets 0}^{N} M_{r,i} \cdot v_{i} \\
\\
$$
</center>

In the above case, the summation is the _reduce_ operation, and the multiplication of the matrix elements and vector elements is the _transform_ operation, applied before the reduction.

The key insight about this reduction is that no unit of work depends on another unit of work.
The domains of each unit of work are non-overlapping.
In other words, this algorithm is _loop independent_ and can be parallelized along the rows of our tuplespace, again given by:

<center>
$$
\\
  \left[ {\begin{array}{ccc}
    (Mat_{0,0}, v_0) & (Mat_{0,1}, v_1) & (Mat_{0,2}, v_2) \\
    \hline \\
    (Mat_{1,0}, v_0) & (Mat_{1,1}, v_1) & (Mat_{1,2}, v_2) \\
    \hline \\
    (Mat_{2,0}, v_0) & (Mat_{2,1}, v_1) & (Mat_{2,2}, v_2) \\
  \end{array} } \right]
\\
$$
</center>

It was by identifying and understanding the underlying algorithms (_broadcast_ and _transform-reduce_) of `dgemv` that we are able to determine if and how the algorithm is parallelizable and loop independent.

> Identify and understand the underlying algorithms

_NOTE: Even if your operation seems to be loop dependent, there are sometimes clever tricks you can use to parallelize your code. Perhaps you just haven't been exposed to the correct algorithm yet!_

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

#### C++ Example

full version: https://godbolt.org/z/TcGshqj65
stripped version: 

```cpp
typedef std::span<double, 3> vec_t;
typedef stdex::mdspan<double, stdex::extents<3, 3>> mat_t;

void dgemv(mat_t m, vec_t v, vec_t out) {
  std::fill_n(out.data(), out.size(), 0);
  for (int i=0; i < m.extent(0); i++)
    for (int j=0; j < m.extent(1); j++)
      out[i] += v[j] * m(i, j);
}
```

<hr>

We now hopefully understand that a matrix-vector product is formally _a broadcasted multiply followed by a series of sum-reductions_, and can move on to parallelizing the algorithm.

# Parallelizing `DGEMV`

We now know that a given index in our output vector can be computed independently of any other indices in the output vector from the respective row in our tuple space.
We can now perform the first step in parallelizing our algorithm: performing the same operations on separate data.
When work is parallelized at the _instruction_ level, it is called _SIMD_, or Same Instruction Multiple Data.

todo: talk about mpi x-way parallelism

<!---
<center>
<div class="mermaid">
graph TD
  T(tests) -- > C(correctness)
  I(initial impl) -- > C
  C -- > P(perf analysis)
  P -- > A(algorithm analysis)
  P -- > CC(code generation)
  A -- > D(distribution)
</div>
</center>
--->

# Links and References

* <a href="https://mlochbaum.github.io/BQN/try.html#code=4oCiU2hvdyBtYXQg4oaQIDPigL8z4qWK4oaVMTAK4oCiU2hvdyB2ZWMg4oaQIDPipYoyCivLneKOiTEgbWF0w5d2ZWMK" target="blank">BQN dgemv example</a>
* <a href="https://hadrienj.github.io/posts/Deep-Learning-Book-Series-2.2-Multiplying-Matrices-and-Vectors/" target="blank">Matrix-Vector Product image</a>
* <a href="https://www.cs.utexas.edu/~lin/cs380c/handout27.pdf" target="blank">UT Austin slides on loop-carried dependencies and parallelism</a>
* <a href="https://www.worldcat.org/title/how-to-write-parallel-programs-a-first-course/oclc/912171709&referer=brief_results" target="blank">_How to Write Parallel Programs: A First Course_</a>
* <a href="https://thrust.github.io/doc/group__transformed__reductions_ga0d4232a9685675f488c3cc847111e48d.html" target="blank">Thrust parallel algorithms library</a>


{% include disclaimer.html %}
