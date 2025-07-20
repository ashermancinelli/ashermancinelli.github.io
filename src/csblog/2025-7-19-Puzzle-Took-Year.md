# Quarters on a Chessboard
**The Puzzle that Took Me 18 Months**

~~~admonish note title="Problem"

You have a chessboard, and on each square sits a quarter, showing either heads or tails at random. A prize is hidden under one random square.

- **Player 1** enters the room, inspects the board, and is allowed to flip **exactly one** coin of their choosing. Then Player 1 leaves.
- **Player 2** enters the room (without knowing which coin was flipped) and must select the square they believe hides the prize.

How can Player 1 and Player 2 agree on a strategy so that Player 2 always finds the prize, no matter where it is hidden or how the coins are initially arranged?

~~~

Since fall of 2024, I've been thinking about this puzzle on and off since a friend explained it to me.
I've come up with a few solutions, but I was finally able to settle on a solution that I'm happy with, with the aid of the Z3 theorem prover.

## Step 1: Prove Exhaustively for 2x2 Boards

My goal was to formulate a proof of a much smaller problem using the Python bindings to the [Z3 theorem prover](https://github.com/Z3Prover/z3) that looked like this:

There exists functions F and G such that for all possible chessboards `board` and prize locations `prize`:
- `F(board, prize) = i'`
- `board' = board ⊕ i'`
- `G(board') = prize`

Assuming whatever properties of an 8x8 board that make this problem tractable also hold for a 2x2 board, I could analyze the proof of the smaller board and extrapolate the solution to the 8x8 board.

I communicated this to the Z3 theorem prover through the python bindings, and it returned exhaustive lookup table solutions for F and G.

This is a snippet of how I described the problem to Z3 (full code linked at the bottom):

```python
board_size = 2
power = board_size.bit_length()
cell_sort = BitVecSort(power)
board_sort = BitVecSort(board_size)
a_board = BitVec('a_board', board_sort)
a_cell = BitVec('a_cell', cell_sort)

flip = Function('flip', board_sort, cell_sort, board_sort)

# assert that only a single bit has been flipped by the flip function.
# The input board xor-ed with the output board must yield a power of two.
s.add(
    ForAll(
        [a_board, a_cell],
        Or(
            [
                (flip(a_board, a_cell) ^ a_board) == BitVecVal(2**i, board_size)
                for i in range(board_size)
            ]
        ),
    )
)

# Guess function always returns a number corresopnding to the chess square
# that the flipper intended to communicate.
guesser = Function('guesser', board_sort, cell_sort)
s.add(
    ForAll(
        [a_board, a_cell],
        guesser(flip(a_board, a_cell)) == a_cell,
    )
)
```

I then fed in every possible 2x2 board and verified that the generated solutions were correct.

```python
board_size = 2
all_boards = list(itertools.product([0, 1], repeat=board_size*board_size))
for flat_board in all_boards:
    board = np.array(flat_board, dtype=np.uint).reshape((board_size, board_size))
    for money in range(board_size*board_size):
        zboard = board_to_bitvec(board)
        ztarget = BitVecVal(money, cell_sort)
        s.add(guesser(flip(zboard, ztarget)) == ztarget)

        # Ensure we found a solution
        assert s.check() == sat
        m = s.model()

        # Verify the model gives the correct solution
        flipped = m.evaluate(flip(zboard, ztarget))
        guess = m.evaluate(guesser(flipped))
        print(pbv(zboard), pbv(flipped), guess, ztarget)
        assert guess.as_long() == ztarget.as_long(), 'Guess does not match target'
```

I then had a table of solutions for the 2x2 board to analyze:

| board | flipped | target | guess |
|-------|---------|--------|-------|
| 0000  | 1000    | 0      | 0     |
| 0000  | 0100    | 1      | 1     |
| 0000  | 0001    | 2      | 2     |
| 0000  | 0010    | 3      | 3     |

It started to look eerily similar to a solution I came up with in November 2024.
This is what I texted my friend:

~~~admonish quote title="Solution"
person1: pos = xor all the positions together and then flips the coin at position pos ^ prize index. person2 xors all the indices of heads together and the result is the prize location
~~~

I was too busy to check at the time, but this looked exactly like the solution z3 arrived at.

## Step 2: Prove by Counterexample for 8x8 Boards

I then tried to give the solution to z3 and see if it could find a counterexample.
With some AI help I was able to express the solution in z3 constraints:

```python
board_size = 8
bits = board_size.bit_length()
s = Solver()

board, prize_index = BitVec('board', board_size), BitVec('prize_index', bits)
original_parity = xor_sum_z3(board, board_size)
flip_index = original_parity ^ prize_index
s.add(
    ULT(prize_index, BitVecVal(board_size, bits))
)
s.add(
    ULT(flip_index, BitVecVal(board_size, bits))
)
flip_mask = BitVecVal(1, board_size) << ZeroExt(board_size - bits, flip_index)
board_prime = board ^ flip_mask
guess = xor_sum_z3(board_prime, board_size)

counterexample = Not(guess == prize_index)
s.add(counterexample)
```

And upon checking the solver, I got `unsat`, meaning that the solution was correct (so long as I correctly expressed the solution to z3).
