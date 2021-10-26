---
layout: post
title: Using the Most Popular Programming Languages of the '60s
permalink: /pop-langs-1960s
---

We use the 6 most popular programming languages of the 1960's to solve a leetcode problem!

Most of these languages have changed a lot since the 1960s, so the way I'm using these languages won't be quite the same as they were used back then.
For example, I couldn't find a way to compile and/or run an ALGOL50 program, so I'll have to use Algol68, a later standard of the language.
Similarly, the first APLs were intended for use on a blackboard, and the first actual implementations were all proprietary.
For the most part, I made some attempt to use an older version of each language to get a better feel for what it would be like to use the language back in the day - except for APL.

I'll stick to using the APL derivative BQN since I'm not interested in learning a new version of APL.
I'll be looking at the languages in ascending order based on their popularity in 1965.

Along with my solution for each language, I'll give a little bit of history and a quote from Edsger Dijkstra (whether I agree with it or not :smile:).

<a target="_blank" href="https://github.com/ashermancinelli/algorithm-testbed">All these solutions and the build system needed to compile the examples can be found in this repository.</a>

## Problem

[Find the element that is greater than both neighbors, aka the peak element.
](https://leetcode.com/problems/find-peak-element/)

#### Example 1:

**Input**: `nums = [1,2,3,1]`

**Output**: `2`

**Explanation**: `3` is a peak element and your function should return the index number `2`.

#### Example 2:

**Input**: `nums = [1,2,1,3,5,6,4]`

**Output**: `1` or `5`

**Explanation**: Your function can return either index number `1` where the peak element is `2`, or index number `5` where the peak element is `6`.

#### Constraints:

* `1 <= nums.length <= 1000`
* `-231 <= nums[i] <= 231 - 1`
* `nums[i] != nums[i + 1]` for all valid `i`.

## Content

Here's how the various languages stack up.
We'll start at the bottom with APL and work our way up to Fortran.

1. [Fortran](#fortran)
1. [COBOL](#cobol)
1. [ALGOL](#algol)
1. [BASIC](#basic)
1. [Lisp](#lisp)
1. [APL](#apl)

### [APL](#content)

> APL is a mistake, carried through to perfection. It is the language of the future for the programming techniques of the past: it creates a new generation of coding bums.
>
> Edsger Dijkstra

APL was originally designed by Ken Iverson in 1957 as a mathematical notation to be used on blackboards[[ref](#ref_hist_apl_computer_history)].
Kev Iverson was hired by IBM in 1960 to further develop the notation, at that point still just a mathematical notation and not a programming language.
Finally in 1966 the IBM released APL360 written in a bit under 40,000 lines of 360 assembly, called APL after Iverson's famous paper *A Programming Language*.

Just before leaving IBM, in 1979 Iverson gave his famous *ACM Turing Award Lecture* titled *Notation as a tool of Thought* where he builds up algorithm intuition in the reader using the APL language[[ref](#ref_ntot)].
In 1980, Iverson left IBM for I. P. Sharp Associates where he developed SHARP APL [[ref](#ref_wiki_iverson)].
It was just after this in 1981 that Dyalog APL was born, potentially the most popular APL implementation today and a significant force in the APL community[[ref](#ref_hist_dyalog)].
Ken Iverson moved on from IPSharp in 1990 to JSoftware to write the J programming language along with Roger Hui, a colleague from I.P. SHARP, who sadly passed away earlier this month (October 2021).

I used the BQN language as my APL variant, as it's very actively developed and I believe in the developers behind the project.
APL is the only language where I opted for a newer implementation instead of finding the oldest one possible.
Marshall Lochbaum began designing BQN in collaboration with his colleagues at Dyalog before taking it on as a personal project in 2020[[ref](#ref_bqn_hist)].

Here's my BQN solution:
```
   i0 ← 1‿2‿3‿1
   i1 ← 1‿2‿1‿3‿5‿6‿4
   i2 ← 2‿1‿2‿3‿1
   F ← ({0∾((2-˜≠𝕩)⥊1)∾0}∧(«<⊢)∧(⊢>»))⊐(1˙)
   F ¨ i0‿i1‿i2
┌─
· ┌·    ┌·    ┌·
  · 2   · 1   · 3
      ┘     ┘     ┘
                    ┘
```

And here's the image explanation of the solution.
These diagrams are meant to be read from top to bottom as the BQN program executes.
You can generate diagrams like these on your own by clicking the *Explain* button before running your code on the <a href="https://mlochbaum.github.io/BQN/try.html" target="_blank">Try BQN page linked here.</a>

<center>
<img 
  src="/images/lc-peak-element/bqn.png"
  alt="Here's an explanation of each part of this solution"
  width=600/>
</center>

These two <a href="https://github.com/mlochbaum/BQN/blob/master/doc/train.md" target="_blank">three-trains</a> give us a bit map indicating positions where the input is greater than the right-shift (the first train) or the left-shift (the second train). `∧`-ing these together gives us a mask to get the peak element.
```
   (⊢>») 1‿2‿3‿1
⟨ 1 1 1 0 ⟩

   («<⊢) 1‿2‿3‿1
⟨ 0 0 1 1 ⟩

   # another 3-train!
   ((⊢>»)∧(«<⊢)) 1‿2‿3‿1
⟨ 0 0 1 0 ⟩
```

If our first or last element is greater than the inner element however, this will give us a wrong answer:
```
   ((⊢>»)∧(«<⊢)) 2‿1‿2‿3‿1
⟨ 1 0 0 1 0 ⟩
```

So we'll make another bitmap to not select the first or last elements, and `∧` the two together.
```
   {0∾((2-˜≠𝕩)⥊1)∾0} 2‿1‿2‿3‿1
⟨ 0 1 1 1 0 ⟩

   ({0∾((2-˜≠𝕩)⥊1)∾0}∧(«<⊢)∧(⊢>»)) 2‿1‿2‿3‿1
⟨ 0 0 0 1 0 ⟩
```

Now we just grab the first true index and we have our answer:
```
   (({0∾((2-˜≠𝕩)⥊1)∾0}∧(«<⊢)∧(⊢>»))⊐(1˙)) 1‿2‿1‿3‿5‿6‿4
┌·   
· 1  
    ┘
```

### [Lisp](#content)

> LISP has been jokingly described as "the most intelligent way to misuse a computer". I think that description a great compliment because it transmits the full flavor of liberation: it has assisted a number of our most gifted fellow humans in thinking previously impossible thoughts.
>
> Edsger Dijkstra

The 5th most popular programming language in 1965 was Lisp.

Lisp was invented by John McCarthy in 1958 at MIT with his paper *Recursive Functions of Symbolic Expressions and Their Computation by Machine, Part I*, paralleling Ken Iverson's paper *A Programming Language*.[[ref](#ref_hist_scheme)].

I used MIT Scheme for my Lisp since it seems like the oldest lisp implementation that I can still install.

Although Scheme is such an old language, it felt very futuristic and clean.
I've used other lisps before, but I'm nowhere near an expert.
Scheme felt like a wonderful and comprehensible tool.
I really loved using it and I think I'll be spending some more quality time with Scheme in these videos.

If you have a better scheme solution, please let me know, I'd love to see it.
```scheme
(define shl
  (lambda (v l)
    (reverse (cons v (reverse (cdr l))))
    ))

(define shr
  (lambda (v l)
    (cons v (reverse (cdr (reverse l))))
    ))

(define solve
  (lambda (input)
    (reduce max 0
            (map
              (lambda (a b)
                (if a b -1))
              (map >
                   input
                   (map max
                        (shl 0 input)
                        (shr 0 input)))
              (iota (length input))))))

(for-each
  (lambda (l)
    (newline)
    (display (solve l))
    (newline))
  (list
    '(1 2 3 1)
    '(1 2 1 3 5 6 4)
    '(2 1 2 3 2 1)))
```

I did find that the builtin functions for Scheme were a bit lacking.
For example I had to write my own functions to shift a value into a list.
```scheme
(define shl
  (lambda (v l)
    (reverse (cons v (reverse (cdr l))))
    ))

(define shr
  (lambda (v l)
    (cons v (reverse (cdr (reverse l))))
    ))
```

Here's what it looks like to use them.
Although I had to write my own, it did come easily.
```scheme
1 ]=> (shl 0 '(1 2 3))

;Value: (2 3 0)

1 ]=> (shr 0 '(1 2 3))

;Value: (0 1 2)
```

Let's walk through this solution inside-out.
```scheme
(define solve
  (lambda (input)
    (reduce max 0
            (map
              (lambda (a b)
                (if a b -1))
              (map >
                   input
                   (map max
                        (shl 0 input)
                        (shr 0 input)))
              (iota (length input))))))
```

For an input `(1 2 3 1)`, we'll find the max of shifting left and right.
If a number is greater than the max of the left and right, we know it's greater than both the left and the right value.
```scheme
1 ]=> (define input '(1 2 3 1))

;Value: a

1 ]=> (map max
        (shl 0 input)
        (shr 0 input))

;Value: (2 3 2 3)
```

Now we just have to find the indices in the input where the input is greater than the last return value, the greater of either shift.
```scheme
      (map >
           input
           (map max
                (shl 0 input)
                (shr 0 input)))

;Value: (#f #f #t #f)
```

Then we can just take the index if the previous map gave us a `#t` true value, or -1 otherwise.
We then take the max of these values to find the peak element.
```scheme
1 ]=> (map
        (lambda (a b)
          (if a b -1))
        (map >
             input
             (map max
                  (shl 0 input)
                  (shr 0 input)))
        (iota (length input)))

;Value: (-1 -1 2 -1)
```

Here's the same code as before, we've just wrapped it in a max reduce to get our final answer.
```scheme
1 ]=> (reduce max 0
              (map
                (lambda (a b)
                  (if a b -1))
                (map >
                     input
                     (map max
                          (shl 0 input)
                          (shr 0 input)))
                (iota (length input))))
;Value: 2
```

Of course now we can just wrap all that code in a function:
```scheme
1 ]=> (define solve
        (lambda (input)
          (reduce max 0
                  (map
                    (lambda (a b)
                      (if a b -1))
                    (map >
                         input
                         (map max
                              (shl 0 input)
                              (shr 0 input)))
                    (iota (length input))))))
      
1 ]=> (solve '(1 2 3 1))

;Value: 2
```

And we can run it on a few inputs to verify our solution:
```scheme
1 ]=> (for-each
        (lambda (l)
          (newline)
          (display (solve l))
        (list
          '(1 2 3 1)
          '(1 2 1 3 5 6 4)
          '(2 1 2 3 2 1)))

2
5
3
```

### [BASIC](#content)

> It is practically impossible to teach good programming to students that have had a prior exposure to BASIC: as potential programmers they are mentally mutilated beyond hope of regeneration.
>
> Edsger Dijkstra

BASIC stands for *Beginner’s All-Purpose Symbolic Instruction Code*[[ref](#ref_time_basic)].
BASIC was designed by two math professors at Dartmouth College in 1964.
John Kemeny, one of the co-creators of BASIC attended lectures from  John von Neumann and worked as Albert Einstein’s mathematical assistant for a time[[ref](#ref_time_basic)], and Tom Kurtz, the other co-creator, first proposed the concept of time-sharing[[ref](#ref_early_timesharing)].
These guys were clearly pretty bright.
BASIC was probably the first beginner-oriented language, with the goal of getting students started writing programs as quickly as possible.

> We needed a language that could be ‘taught’ to virtually all students (and faculty) without their having to take a course.
>
> Thomas Kurtz, co-inventor of BASIC

Visual Basic, a descendent of BASIC used in Excel and other Microsoft products, was actually one of the first languages I ever learned when I wrote Excel macros when I worked in the finance department of [Micron](https://www.micron.com/).

Although it was a programming on-ramp for me, I still have to side with Dijkstra on BASIC (although maybe not so harshly).
BASIC was the product of some brilliant folks and it had a huge impact on the history of programming, but I can't say I recommend it today.

This solution is pretty much the same solution I used for the rest of the programming languages: I iterate from one greater than the lower bound to one less than the upper bound and check both neighbors to see if we have a peak element.

I used FreeBASIC to run this example:
```basic
         dim i0(1 to 4) as Integer
         i0(1) = 1
         i0(2) = 2
         i0(3) = 3
         i0(4) = 1

         dim i1(1 to 7) as Integer
         i1(1) = 1
         i1(2) = 2
         i1(3) = 1
         i1(4) = 3
         i1(5) = 5
         i1(6) = 6
         i1(7) = 4

         function solve(prob() as Integer) as Integer
             for i as Integer = lbound(prob)+1 to ubound(prob)-1
                 if (prob(i)>prob(i+1) and prob(i)>prob(i-1)) then solve=i-1
             next
         end function

         print solve(i0())
         print solve(i1())
```

### [ALGOL](#content)

You may notice that Algol is the only language that does not have a scathing quote from Dijkstra.
This is probably in part because Dijkstra was a significant contributor to Algol![[ref](#ref_cwi_dijkstra)]

> In 1958-1959, Dijkstra was involved in a number of meetings that culminated in the publication of the report defining the ALGOL 60 language. Ironically, Dijkstra’s name does not appear in the list of 13 authors of the final report: it seems he left the committee prematurely because he could not agree with the majority opinions.[[ref](#ref_cwi_dijkstra)]

Algol/Fortran family tree:
<center>
<img 
  src="./images/lc-peak-element/algol-fortran-fam-tree.png"
  alt="Algol/Fortran Family Tree"
  width=600/>
</center>

> Here is a language so far ahead of its time that it was not only an improvement on its predecessors but also on nearly all its successors.
>
>  Tony Hoare[[ref](https://en.wikipedia.org/wiki/ALGOL)]

I'm using the Algol68 Genie compiler-interpreter for this code.
I honestly found Algol pretty usable!
I saw some code that used function pointers, and it looked pretty clean.
It seems like Algol has some pretty modern first-class-function capabilities.
I can see why it was the language in which computer algorithms were published for many years[[ref](#ref_britannica_algol)].
ALGOL was actually designed by an international committee of the ACM during 1958–60 for this purpose.

```algol
PROC solve = ([]INT elements)INT: (
  INT found := -1;
  FOR i FROM 1+(LWB elements) TO (UPB elements)-1
  DO
    IF elements[i] > elements[i+1] AND elements[i] > elements[i-1]
      THEN
        found := i-1
      FI
  OD;
  found 
);
```

I honestly wouldn't mind writing more Algol down the line.

### [COBOL](#content)

> The use of COBOL cripples the mind; its teaching should, therefore, be regarded as a criminal offense.
>
> Edsger Dijkstra

The history behind COBOL is extremely inspiring and exciting, however I have to side with Dijkstra.
COBOL was *very* painful to use.
And I only learned the most shallow bit of COBOL - in order to read more like plain English, COBOL has **over 300 keywords**. 
I can only imagine what it feels like to maintain a 500k line COBOL codebase.

I used the GNUCobol compiler for this example.
You'll notice that everything is indented - COBOL, like several of the other languages I'm covering here, was originally used on a punchcard [as explained in this article from opensource.com](#ref_os_wac).
Each puncard represented *a single line of code*, and the first six and final eight columns of each card were reserved for sequence numbers and identifiers

```cobol
       ID DIVISION.
       PROGRAM-ID. ARRAYTEST.
       ENVIRONMENT DIVISION.
       DATA DIVISION. 
       WORKING-STORAGE SECTION.
      * Store both problems and their sizes and answers in one
      * structure
       01 SIZES PIC 9(3) OCCURS 2 TIMES VALUE 0.
       01 OFFSETS PIC 9(3) OCCURS 2 TIMES VALUE 0.
       01 PROBLEMS PIC 9(3) OCCURS 12 TIMES VALUE 0.
       01 CURRENT-PROBLEM PIC 9(3) VALUE 0.
       01 TMP PIC 9(3) VALUE 0.
       01 IDX PIC 9(3) VALUE 1.
       01 NPROBLEMS PIC 9(3) VALUE 2.
       01 ANSWERS PIC S9(3) OCCURS 2 TIMES VALUE -1.
       PROCEDURE DIVISION.

       100-MAIN.

      *    Set up problem [1,2,3,1]
           MOVE 4 TO SIZES(1).
           MOVE 0 TO OFFSETS(1).

           MOVE 1 TO PROBLEMS(1).
           MOVE 2 TO PROBLEMS(2).
           MOVE 3 TO PROBLEMS(3).
           MOVE 1 TO PROBLEMS(4).

      *    Set up problem [1,2,1,3,5,6,4]
           MOVE 7 TO SIZES(2).
           MOVE 4 TO OFFSETS(2).

           MOVE 1 TO PROBLEMS(5).
           MOVE 2 TO PROBLEMS(6).
           MOVE 1 TO PROBLEMS(7).
           MOVE 3 TO PROBLEMS(8).
           MOVE 5 TO PROBLEMS(9).
           MOVE 6 TO PROBLEMS(10).
           MOVE 4 TO PROBLEMS(11).

      *    Run solve procedure on both problems
           PERFORM VARYING CURRENT-PROBLEM FROM 1 BY 1 UNTIL CURRENT-PRO
      -BLEM > NPROBLEMS
             MOVE OFFSETS(CURRENT-PROBLEM) TO IDX
             PERFORM SOLVE
             DISPLAY ANSWERS(CURRENT-PROBLEM) END-DISPLAY
           END-PERFORM.

           STOP RUN.

       SOLVE.
           PERFORM VARYING IDX FROM 2 BY 1 UNTIL IDX>SIZES(CURRENT-PROBL
      -EM)
             COMPUTE TMP = IDX + OFFSETS(CURRENT-PROBLEM) END-COMPUTE
             IF PROBLEMS(TMP) > PROBLEMS(TMP - 1)
      -AND PROBLEMS(TMP) > PROBLEMS(TMP + 1)
               COMPUTE TMP = IDX - 1 END-COMPUTE
               MOVE TMP TO ANSWERS(CURRENT-PROBLEM)
             END-IF
           END-PERFORM.

       PRINT-AR.
           DISPLAY "IDX=" IDX " VALUE=" PROBLEMS(IDX) END-DISPLAY.
```

I certainly felt the weight of this when I tried to write this function:
Every time I had to change a condition that wrapped a line, I would join the lines together and figure out where the new line break should be, and make sure to get the `-` character in the 7th column.
I'm sure there are some more modern conventions around COBOL considering *5 billion lines of new COBOL code are written every year*[[ref](#ref_os_wac)], but I'm pretty content not to write any COBOL for a while.
```cobol
       SOLVE.
           PERFORM VARYING IDX FROM 2 BY 1 UNTIL IDX>SIZES(CURRENT-PROBL
      -EM)
             COMPUTE TMP = IDX + OFFSETS(CURRENT-PROBLEM) END-COMPUTE
             IF PROBLEMS(TMP) > PROBLEMS(TMP - 1)
      -AND PROBLEMS(TMP) > PROBLEMS(TMP + 1)
               COMPUTE TMP = IDX - 1 END-COMPUTE
               MOVE TMP TO ANSWERS(CURRENT-PROBLEM)
             END-IF
           END-PERFORM.
```

Now on to the inspiring stuff: TLDR COBOL was designed by a consensus-driven committee with a huge focus on portability, and led by women.

In 1959 Grace Hopper, a retired Navy officer, organized a meeting of users and manufacturers to conceive of a programming language in response to Mary Hawes's call for a portable programming language, a language that could be compiled and ran on computers from multiple manufacturers.
[You can read more about the history of COBOL on this Twitter thread from Bryce Lelbach which you should *definitely* check out.](#ref_twitter_bryce_cobol)

I think we have a lot to learn from COBOL, a lot to be thankful for.
[The ISO](#ref_iso_homepage) didn't come along until 1988, long after Grace Hopper initiated the committee for the development of COBOL.
I'm sure we owe a huge debt to COBOL and the women-led consensus-driven model, and I want to learn all I can from that history.

I still don't want to write COBOL though :smile:.

### [Fortran](#content)

> FORTRAN, 'the infantile disorder', by now nearly 20 years old, is hopelessly inadequate for whatever computer application you have in mind today: it is now too clumsy, too risky, and too expensive to use.
>
> Edsger Dijkstra

Fortran, the grand finale, #1 on our list.
I *completely* disagree with Dijkstra on this one - I love Fortran's history and I occasionally write it professionally.

In 1953, John Backus submitted a proposal to his bosses at IBM to develop a more practical alternative to assembly language[[ref](#ref_ftn_start)].
The first compiler didn't come around until 1957.
The name "Fortran" is derived from [FORmula TRANslation](#ref_ftn_start), and very quickly became the lingua franca for scientific computing.

Fortran still is one of the most used programming languages in high performance computing (HPC), and it's not going away any time soon.
[The Flang project, part of the LLVM project,](https://github.com/llvm/llvm-project/tree/main/flang#flang) is a modern Fortran compiler targeting the 2018 standard with support for OpenACC, OpenMP and other cool optimization stuff.
It's written in wonderfully modern and well-maintained C++, and I use the C++ style guide from Flang for my technical teams at my day job.
Flang is definitely worth keeping an eye on, I think it will become a significant force in HPC in the coming years.

I used the GNU gfortran compiler in fixed-form F77 mode for this example to get a better feel for historical Fortran:

```fortran
c     Comments require a 'c'in the first column
      program main
        integer :: ret
        integer, dimension(4) :: i0 = (/1, 2, 3, 1/)
        integer, dimension(7) :: i1 = (/1,2,1,3,5,6,4/)
        ret = -1
        call solve(i0, size(i0), ret)
        print*,ret
        call solve(i1, size(i1), ret)
        print*,ret
      end program

      subroutine solve(input, len, ret)
        integer, intent(in) :: len
        integer, intent(out) :: ret
        integer, dimension(len) :: input

        integer :: i

        do i = 2, (len-1)
          if (input(i) > input(i+1) .and. input(i) > input(i-1)) then
            ret = i-1
            return
          endif
        enddo
      end subroutine
```

GNU/GCC's GFortran is also very actively maintained, [the newest NVIDIA HPC SDK has fantastic Fortran support](https://developer.nvidia.com/hpc-sdk), [the new US Dept. of Energy Exascale supercomputer *Frontier*](https://www.olcf.ornl.gov/frontier/) will use AMD GPUs which have [hipfort, a Fortran interface to AMD GPU libraries](https://github.com/ROCmSoftwarePlatform/hipfort), and [Intel's GPU platform and Fortran compiler are widely used as well](https://www.intel.com/content/www/us/en/develop/documentation/get-started-with-cpp-fortran-compiler-openmp/top.html).
Fortran has a wonderfully rich history, and it's certainly a part of our future.

> Much of my work has come from being lazy. I didn't like writing programs, and so, when I was working on the IBM 701, writing programs for computing missile trajectories, I started work on a programming system to make it easier to write programs.
>
> John Backus

## Conclusion

I hope you all enjoyed foray into the history of programming languages (and computing in general)!

{% include footer.html %}

## References

* <a target="_blank" name="ref_ftn_start" href="https://en.wikipedia.org/wiki/Fortran#History">Fortran history</a>
* <a target="_blank" name="ref_pop_langs" href="https://statisticsanddata.org/most-popular-programming-languages/">Most Popular Programming Languages</a>
* <a target="_blank" name="ref_hist_apl_computer_history" href="https://computerhistory.org/blog/the-apl-programming-language-source-code/">The Apl Programming Language Source Code</a>
* <a target="_blank" name="ref_wiki_iverson">[Kenneth Iverson Wikipedia](https://en.wikipedia.org/wiki/Kenneth_E._Iverson)</a>
* <a target="_blank" name="ref_ntot" href="https://www.jsoftware.com/papers/tot.htm">*Notation as a Tool of Thought*, Ken Iverson</a>
* <a target="_blank" name="ref_hist_dyalog" href="https://www.dyalog.com/uploads/files/apl50/Dyalog%20APL%20A%20Personal%20History.pdf">History of Dyalog</a>
* <a target="_blank" name="ref_gnuapl_stallman" href="https://en.wikipedia.org/wiki/APL_(programming_language)#GNU_APL">GNU APL</a>
* <a target="_blank" name="ref_pnnl" href="https://www.pnnl.gov/">Pacific Northwest National Laboratory</a>
* <a target="_blank" name="ref_bqn_hist" href="https://mlochbaum.github.io/BQN/commentary/history.html">BQN's Development History</a>
* <a target="_blank" name="ref_hist_scheme" href="https://en.wikipedia.org/wiki/History_of_the_Scheme_programming_language">History of the Scheme Programming Language</a>
* <a target="_blank" name="ref_apl_wiki" href="https://aplwiki.com/wiki/Main_Page">APL Wiki</a>
* <a target="_blank" name="ref_apl_wiki_dyalog" href="https://aplwiki.com/wiki/Dyalog_APL">APL Wiki: Dyalog</a>
* <a target="_blank" name="ref_apl_wiki_logos" href="https://aplwiki.com/wiki/APL_logo">APL Wiki: Logos</a>
* <a target="_blank" name="ref_alg_testbed_repo" href="https://github.com/ashermancinelli/algorithm-testbed">Repository for all the solutions</a>
* <a target="_blank" name="ref_time_basic" href="https://time.com/69316/basic/">Fifty Years of BASIC, the Programming Language That Made Computers Personal</a>
* <a target="_blank" name="ref_cwi_dijkstra" href="https://www.cwi.nl/about/history/e-w-dijkstra-brilliant-colourful-and-opinionated">Edsger W. Dijkstra: Brilliant, Colourful, and Opinionated</a>
* <a target="_blank" name="ref_si_cobol" href="https://americanhistory.si.edu/cobol/introduction">National Museum of American History</a>
* <a target="_blank" name="ref_wiki_cobol" href="https://en.wikipedia.org/wiki/COBOL#:~:text=To%20support%20this%20English%2Dlike,ARE%20%2C%20and%20VALUE%20and%20VALUES%20.">Wikipedia: COBOL</a>
* <a target="_blank" name="ref_os_wac" href="https://opensource.com/article/17/8/what-about-cobol">opensource.com: Don't hate COBOL until you've tried it</a>
* <a target="_blank" name="ref_twitter_bryce_cobol" href="https://twitter.com/blelbach/status/1259313973318451200">Bryce Lelbach Twitter Thread on COBOL</a>
* <a target="_blank" name="ref_iso_homepage" href="https://www.iso.org/technical-committees.html">International Organization for Standardization (ISO)</a>
* <a target="_blank" name="ref_flang" href="https://github.com/llvm/llvm-project/tree/main/flang#flang">Flang Fortran Compiler</a>
* <a target="_blank" name="ref_ecp_frontier" href="https://www.olcf.ornl.gov/frontier/">US DOE Frontier Supercomputer at ORNL</a>
* <a target="_blank" name="ref_britannica_algol" href="https://www.britannica.com/technology/ALGOL-computer-language">Britannica: ALGOL computer language</a>
* <a target="_blank" name="ref_early_timesharing" href="https://www.cs.cornell.edu/wya/AcademicComputing/text/earlytimesharing.html">Cornell University: Early Timesharing</a>

