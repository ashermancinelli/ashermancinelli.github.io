# Use an SMT solver for your next interview 7/21/2025

~~~admonish quote title="Alan Perlis"
_A language that doesn't affect the way you think about programming, is not worth knowing._
~~~

[Let's use this leetcode problem as an example:](https://leetcode.com/problems/minimum-number-of-flips-to-make-binary-grid-palindromic-ii/description/)

~~~admonish quote title="3240. Minimum Number of Flips to Make Binary Grid Palindromic II"
* You are given an `m x n` binary matrix grid.
* A row or column is considered palindromic if its values read the same forward and backward.
* You can flip any number of cells in grid from 0 to 1, or from 1 to 0.
* Return the minimum number of cells that need to be flipped to make all rows and columns palindromic, and the total number of 1's in grid divisible by 4.
~~~

I'll be using the Python bindings to the Z3 SMT solver.

When using an SMT or SAT solver, you don't conceptualize _how to solve_ the problem, you just describe the problem in a way that the solver can understand, and then ask it if your description is satisfiable.
If it is, you can extract a _model_ from the solver that can evaluate inputs in the context of your solution.

```python
def solve(grid: List[List[int]]) -> int | None:
    ...

def test():
    assert solve([[1,0,0],[0,1,0],[0,0,1]]) == 3
    assert solve([[0,1],[0,1],[0,0]]) == 2
    assert solve([[1],[1]]) == 2
```

The first thing we need to do is represent the grid in the solver.
We will create an optimizer and a grid of z3 length-1 bit vectors with unspecified values.

```python
s = z3.Optimize()
n = len(grid)
m = len(grid[0])
zgrid = [[z3.BitVec(f'grid_{i}_{j}', 1) for j in range(m)] for i in range(n)]
```

Then we create constraints on this grid and ask Z3 to find us an optimal solution, and then we can evaluate the properties of the model that we are interested in.

```python
# Add a constraint that each cell matches its mirror image
for i in range(n):
    for j in range(m):
        s.add(zgrid[i][j] == zgrid[n-i-1][m-j-1])
```

Notice that we are using `==` between actual numeric values and symbolic values that we defined as z3 objects.
The z3 bindings do not so much as perform operations themselves, but they provide a DSL for describing constraints that are then consumed by the actual solver.

```python
# Create z3 objects for the sum of all bits in the grid
# and the sum of the differences between the grid z3
# will solve for and the original grid
sum = z3.IntVal(0)
diff = z3.IntVal(0)
for i in range(n):
    for j in range(m):
        sum += z3.If(zgrid[i][j] == 1, 1, 0)
        diff += zgrid[i][j] != grid[i][j]

# Constrain the sum of the grid to be divisible by 4
s.add(sum % 4 == 0)

# Minimize the number of differences between the grid z3
# will solve for and the original grid
objective = s.minimize(diff)
```

At this point, we have provided enough information to the solver to find the optimal solution:

```python
# If the solver is able to find a solution, we can
# extract the model and evaluate the objective function.
if s.check() == z3.sat:
    return int(objective.value())
```

The `s.check()` call will return `z3.sat` if the provided constraints are satisfiable, and `z3.unsat` if they are not.

Once we're done, we can also look at the representation used by the underlying solver, which uses s-expressions to represent the constraints.
These are the sexprs for the last solution we looked at:

```python
print(s.sexpr())
```

```lisp
(declare-fun grid_0_0 () (_ BitVec 1))
(declare-fun grid_1_0 () (_ BitVec 1))
(assert (and (= grid_0_0 grid_1_0) (= grid_1_0 grid_0_0)))
(assert (let ((a!1 (mod (+ 0 (ite (= grid_0_0 #b1) 1 0) (ite (= grid_1_0 #b1) 1 0)) 4)))
  (= a!1 0)))
(minimize (+ 0 (ite (distinct grid_0_0 #b1) 1 0) (ite (distinct grid_1_0 #b1) 1 0)))
(check-sat)

(declare-fun grid_0_0 () (_ BitVec 1))
(declare-fun grid_1_0 () (_ BitVec 1))
(assert (and (= grid_0_0 grid_1_0) (= grid_1_0 grid_0_0)))
(assert (let ((a!1 (mod (+ 0 (ite (= grid_0_0 #b1) 1 0) (ite (= grid_1_0 #b1) 1 0)) 4)))
  (= a!1 0)))
(minimize (+ 0 (ite (distinct grid_0_0 #b1) 1 0) (ite (distinct grid_1_0 #b1) 1 0)))
(check-sat)
```


---

* [Alan Perlis, _EPIGRAMS IN PROGRAMMING_](https://www.cs.yale.edu/homes/perlis-alan/quotes.html)
