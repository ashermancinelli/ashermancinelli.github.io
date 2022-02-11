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
1. Identify and understand the underlying algorithms at play
1. Speed is not the same as efficiency

***NOTE: This post is geared towards those without significant experience in linear algebra, high performance computing, and GPU programming.***

# Outline

1. Mathematical Understanding of Algorithm
    1. Short Example in Python
1. Example in C on Host
1. Example in CUDA C
1. Example in C++ on Host
1. Example in CUDA C++
1. Example in BQN
1. Links, References, Additional Reading

# Mathematical Understanding of Algorithm

We'll be performing a matrix-vector dot product several ways in this post.
I may refer to the operation as `dgemv` as that's the official name for a matrix-vector product on data of type `double` in the BLAS interface, though we will not make any attempt to make our code conformant with BLAS - it's just a helpful shorthand.

The operation is depicted below:

<center>
<img
  src="/images/hpc-101-matvec/matvec.png"
  alt="Matvec dot product, credit this post: https://hadrienj.github.io/posts/Deep-Learning-Book-Series-2.2-Multiplying-Matrices-and-Vectors/"
  >
</center>

Let `p` be the result of the dot product of matrix `Mat` and vector `v`.
The dot product is calculated like so:

<center>
$$
\\
  p \gets Mat \cdot v

  \\

  =

  v_0 \cdot
  \left[ {\begin{array}{c}
    Mat_{0, 0} \\
    Mat_{1, 0} \\
    Mat_{2, 0} \\
  \end{array} } \right]
  +
  v_1 \cdot
  \left[ {\begin{array}{c}
    Mat_{0, 1} \\
    Mat_{1, 1} \\
    Mat_{2, 1} \\
  \end{array} } \right]
  +
  v_2 \cdot
  \left[ {\begin{array}{c}
    Mat_{0, 2} \\
    Mat_{1, 2} \\
    Mat_{2, 2} \\
  \end{array} } \right]

  \\

  =

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

We can broadcast values of `v` into columns of a matrix with the same shape as the matrix `Mat`, and then pair the `Mat` and `v` element-wise, creating a matrix of tuples (or a 3d matrix if you prefer):

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

Now to parallelism: how might we go about parallelizing this algorithm?

The first part of the code to analyze is the _inner loop_, particularly for _loop dependence_.

# Algorithm Analysis

The first question we must ask ourselves is this: _are any iterations of the algorithm dependent on values calculated in other iterations? Is iteration `N` dependent on calculations in iteration `N-1`?_
In other words, _are the loop bodies entirely_ ***independent*** _of each other?_

If so, our algorithm is _loop independent_ and _trivially parallelizable_.
<a href="https://www.cs.utexas.edu/~lin/cs380c/handout27.pdf" target="blank">These slides from a UT Austin lecture</a> are helpful additional reading on this topic.

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

In the above case, the summation is the _reduce_ operation, and the multiplication of the matrix elements and vector elements is the _transform_ operation, transforming each tuple into a scalar before the reduction.

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

It was by identifying and understanding the underlying algorithms (_broadcast_ and _transform-reduce_) of our higher-level algorithm that we are able to determine if and how it is parallelizable and loop independent.

> Identify and understand the underlying algorithms

_NOTE: Even if your operation seems to be loop dependent, there are sometimes clever tricks you can use to parallelize your code. Perhaps you just haven't been exposed to the correct algorithm yet!_

We now hopefully understand that a matrix-vector product is formally _a broadcasted multiply followed by a series of sum-reductions_ and that we can parallelize our algorithm by breaking it up into self-contained units of work.
We can now move on to implementing and parallelizing the algorithm.

# C on the Host

<a href="https://godbolt.org/z/KqnfKvc4h" target="blank">The code for such a calculation might look like this in C</a>, assuming you're not using any BLAS or LAPACK routines:
```c
typedef struct {
  double* d;
  int M;
  int N;
} mat_t;

typedef struct {
  double* d;
  int size;
} vec_t;

void dgemv(mat_t m, vec_t v, vec_t out) {

  // Ensure the output is all set to zero
  memset(out.d, 0.0, out.size);

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
  double dm[9];
  m.d = dm;
  m.M = m.N = 3;
  for (int i=0; i < m.M*m.N; i++)
      m.d[i] = (double)i;

  vec_t v;
  v.d = (double[]) { 2., 2., 2. };
  v.size = 3;

  vec_t out;
  out.d = (double[]) { 0, 0, 0 };
  out.size = 3;
  
  dgemv(m, v, out);

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

Demonstrating that we have a _correct_ algorithm with tests is a precondition for optimizing and parallelizing an algorithm:

> Testing for correctness precedes parallelism and performance


We know that a given index in our output vector can be computed independently of any other indices in the output vector from the respective row in our tuple space.
We can then perform the first step in parallelizing our algorithm: pulling out a function that performs a _single unit of work_ as identified above.

In our C example, we might use the following structs to encapsulate our data:
```c
typedef struct {
    double matval;
    double vecval;
} tuple_t;

typedef struct {
    tuple_t* tuples;
    int size;
} tuplespace_t;
```

A struct of type `tuplespace_t` may then hold the domain of a single unit of work.
This is important as we start to parallelize our code: the domain of a unit of work may need to be sent over the network to another computer entirely if we distribute our computation (say with MPI), or it may need to be copied to another component of the current machine if we are to use a GPU.

Our single unit of work then takes a `tuplespace_t` struct and returns a `double`, which is the value of the output vector at a given index:

```c
double unit_of_work(tuplespace_t ts) {
  double sum = 0;
  for (int i=0; i < ts.size; i++)
    sum += ts.tuples[i].matval * ts.tuples[i].vecval;
  return sum;
}
```

Compare this now with the single unit of work we described above:
<center>
$$
\\
w(row) \gets \sum_{i \gets 0}^{N} tuple_{i, 0} \cdot tuple_{i, 1} \\
\\
$$
</center>

Our `dgemv` function now must first construct the tuplespace before passing a segment of the tuplespace to the single unit of work:
```c
void dgemv_on_tuplespace(mat_t m, vec_t v, vec_t out) {
  // allocate memory for our tuplespace
  // one tuple per entry in the matrix
  tuple_t* ts = malloc(sizeof(tuple_t[m.M*m.N]));

  // set up tuplespace

  // for each row in matrix
  for (int i=0; i < m.M; i++)

    // for each column in matrix
    for (int j=0; j < m.N; j++)

      // elements of vector are broadcast to columns of matrix
      ts[j+(i*m.N)] = (tuple_t) {
        .matval = m.d[j+(i*m.N)],
        .vecval = v.d[i]
      };

  // dispatch calculations to unit_of_work for each row of mat
  for (int i=0; i < m.M; i++)

    // element in output vector is determined by passing a row of tuplespace
    // into our unit of work
    out.d[i] = unit_of_work((tuplespace_t) {
      .tuples = &ts[i*m.N],
      .size = m.N,
    });

  free(ts);
}
```

You might have noticed that our new algorithm has significantly more code than our original implementation.
This is okay, and it gets at an important point:

> Speed is not the same as efficiency

<a href="https://adspthepodcast.com/2021/11/12/Episode-51.html" target="blank">
This excellent podcast episode from the lead HPC architect at NVIDIA explains this point in detail.
</a>

If our code performs _more work overall_ it is less _efficient_.
If that additional work means we can perform calculations on multiple threads or additional devices resulting in lower runtime, it is _faster_ and we've increased its _speed_.
The key difference between speed and efficiency is this: speed is a factor of _time_ and efficiency is a factor of _work_.
Sometimes optimizing code means improving speed, other times efficiency.
Most of the time, to run code on a GPU, you do have to perform more work to set up the calculation, so strictly speaking our code will be faster and less efficient.

# CUDA C

todo

# C++ on the Host

There are many layers of abstraction commonly used in HPC for running code on a GPU.
The abstractions used in this post will be limited to those shipped with the most recent stable distribution of the NVIDIA CUDA Toolkit at the time of writing (11.5) along with the abstractions recommended by the lead HPC programming models architect at NVIDIA, Bryce Adelstein Lelbach.
These abstractions are almost entirely _compile-time_ abstractions, which means they incur no runtime cost over the raw C equivilant.
In particular, we will use the structure template `mdspan`, which is likely going to be a part of standard ISO C++23.
`mdspan` is extremely useful on the host as well, so we'll use it in our C++ host example.
<a href="https://youtu.be/KK3JXvSiJG4" target="blank"> See Bryce's talk on C++ standard parallelism here.  </a>

In our C++ examples, we'll use the following type aliases for matrices and vectors:
```cpp
#include <mdspan.hpp> // single-header version from github
namespace stdex = std::experimental;
using mat_t = stdex::mdspan<
    double,
    stdex::extents<3, 3>
  >;
using vec_t = stdex::mdspan<
    double,
    stdex::extents<3>
  >;
```

Our setup is then as follows:
```cpp
int main() {
  double dm[9];
  const auto m = mat_t(dm);
  std::iota(m.data(), m.data()+9, 0);

  double dv[] = { 2., 2., 2. };
  const auto v = vec_t(dv);

  double dout[3] = {0};
  const auto out = vec_t(dout);

  dgemv(m, v, out);

  return 0;
}
```

If we only compute the solution on the host, everything works the same way:
```cuda
void dgemv(mat_t m, vec_t v, vec_t out) {
  for (int i=0; i < m.static_extent(0); i++)
    for (int j=0; j < m.static_extent(1); j++)
      out(i) += v(j) * m(i, j);
}
```

Notice how we can index our matrix as we would expect to: with multidimensional indexing.
Notice also how we can call `static_extent` on our matrix - this determines the length of our matrix in a given dimension at _compile time_, which means we perform _less work at runtime then in the pure C version_ while getting nicer indexing and extent calculations.
The compile-time and zero-cost abstractions are significant reasons why developers opt for C++ over C.
For example, compare <a href="https://godbolt.org/z/ssrnz71hs" target="blank">the assembly in this C example</a> to <a href="https://godbolt.org/z/ra8d6arMf" target="blank"> the assembly in this C++ example.  </a>
This is one reason that most compiler vendors choose to write their compilers in C++ over C (eg GNU's GCC, LLVM, Cray CC, IBM XL, Intel compiler suite, etc).

Let's now compute our `dgemv` with the work broken up into isolated units, just as before.

We'll use the following additional type aliases:
```cpp
using stdex::full_extent;
using stdex::submdspan;
using tuplespace_t = stdex::mdspan<
    double,
    stdex::extents<3, 3, 2>
  >;
using tuplespace_row_t = stdex::mdspan<
    double,
    stdex::extents<3, 2>
  >;
```

The setup for the tuplespace and the units of work also look just about the same:
```cpp
double unit_of_work(tuplespace_row_t tsr) {
  double sum = 0;
  for (int i=0; i < tsr.static_extent(0); i++)
    sum += tsr(i, 0) * tsr(i, 1);
  return sum;
}

void dgemv_on_tuplespace(mat_t m, vec_t v, vec_t out) {
  double tuplespace_data[2 * m.static_extent(0) * m.static_extent(1)];
  const auto ts = tuplespace_t(tuplespace_data);

  for (int i=0; i < m.static_extent(0); i++)
    for (int j=0; j < m.static_extent(1); j++) {
      ts(i, j, 0) = m(i, j);
      ts(i, j, 1) = v(i);
    }

  for (int i=0; i < m.static_extent(0); i++)
    out(i) = unit_of_work(submdspan(ts, i, full_extent, full_extent));
}
```

# CUDA C++

```cpp

__global__
void unit_of_work(tuplespace_t ts, vec_t out) {
  // row of tuplespace, and index in output
  const auto tid = threadIdx.x;
  const auto tsr = submdspan(ts, tid, full_extent, full_extent);
  double sum = 0;
  for (int i=0; i < tsr.static_extent(0); i++)
    sum += tsr(i, 0) * tsr(i, 1);
  out(tid) = sum;
}

void dgemv_on_tuplespace(mat_t m, vec_t v, vec_t out) {
  constexpr std::size_t ts_size = 2 * m.static_extent(0) * m.static_extent(1);
  double tuplespace_data[ts_size];
  const auto ts = tuplespace_t(tuplespace_data);

  for (int i=0; i < m.static_extent(0); i++)
    for (int j=0; j < m.static_extent(1); j++) {
      ts(i, j, 0) = m(i, j);
      ts(i, j, 1) = v(i);
    }

  // Allocate memory for tuplespace on device, copy to device
  double *dev_tuplespace_data = nullptr;
  cudaMalloc(&dev_tuplespace_data, ts_size * sizeof(double));
  cudaMemcpy(dev_tuplespace_data, tuplespace_data,
    ts_size * sizeof(double), cudaMemcpyHostToDevice);
  const auto dev_ts = tuplespace_t(dev_tuplespace_data);

  // Allocate memory for output vector on device
  double *dev_out_data = nullptr;
  cudaMalloc(&dev_out_data, m.static_extent(0) * sizeof(double));
  const auto dev_out = vec_t(dev_out_data);

  // Perform units of work on m.static_extent(0) GPU threads
  cu::unit_of_work<<<m.static_extent(0), 1>>>(dev_ts, dev_out);

  // Copy output vector from device to host
  cudaMemcpy(out.data(), dev_out.data(), ts_size * sizeof(double), cudaMemcpyDeviceToHost);
}
```

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

# BQN Example

Personally, I use BQN to prototype solutions to problems and to better understand the fundamental algorithms at play; you don't have to know an APL in order to understand this, but it might be helpful.
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

# Links, References, Additional Reading

* <a href="https://godbolt.org/z/45j4hedq8" target="blank"> C dgemv and dgemv on tuplespace example on godbolt </a>
* <a href="https://mlochbaum.github.io/BQN/try.html#code=4oCiU2hvdyBtYXQg4oaQIDPigL8z4qWK4oaVMTAK4oCiU2hvdyB2ZWMg4oaQIDPipYoyCivLneKOiTEgbWF0w5d2ZWMK" target="blank">BQN dgemv example</a>
* <a href="https://hadrienj.github.io/posts/Deep-Learning-Book-Series-2.2-Multiplying-Matrices-and-Vectors/" target="blank">Matrix-Vector Product image</a>
* <a href="https://www.cs.utexas.edu/~lin/cs380c/handout27.pdf" target="blank">UT Austin slides on loop-carried dependencies and parallelism</a>
* <a href="https://www.worldcat.org/title/how-to-write-parallel-programs-a-first-course/oclc/912171709&referer=brief_results" target="blank">_How to Write Parallel Programs: A First Course_</a>
* <a href="https://thrust.github.io/doc/group__transformed__reductions_ga0d4232a9685675f488c3cc847111e48d.html" target="blank">Thrust parallel algorithms library</a>
* <a href="https://adspthepodcast.com/2021/11/12/Episode-51.html" target="blank"> ADSP podcast episode from the lead HPC architect at NVIDIA discussing speed vs efficiency</a>
* <a href="https://youtu.be/KK3JXvSiJG4" target="blank"> Bryce Adelstein Lelbach's talk on C++ standard parallelism </a>
* <a href="https://github.com/kokkos/mdspan/blob/single-header/mdspan.hpp" target="blank"> Kokkos `mdspan` single header </a>


{% include disclaimer.html %}
