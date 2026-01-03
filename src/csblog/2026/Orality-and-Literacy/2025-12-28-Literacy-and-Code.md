# Literacy and Code

{{ TOC }}

Literature leaves a physical trace in the world, while orality does not.
Programming languages are unique because they do leave a trace on the world
(the source code of the program is stored _somewhere_), but the physical record
is only part of the program, unlike literature.
Programs are inherently _actions_, like the oral arts, and yet they are
cast in literature.
Literature simply describes or prescribes; code both describes and performs,
closer to a magic spell than static text.
They are impotent and incomplete without being executed.
An exception to this is comments; they are pure literature embedded in programs,
typically leaving no trace on the resultant program.
<!-- They are like spells; they are described in words and characters, but they are -->
<!-- impotent and incomplete without being cast (or ran). -->

## Syntax and Cognition

Some aspects of programming language design are purely literate concepts, such
as syntax.
Iverson's _Notation as a Tool of Thought_ (Iverson79) considers the cognitive effects
of the syntax of programs.
His paper begins with philosophical foundations rather than technical, evoking the words
of Charles Babbage and Alfred North Whitehead, rather than jumping straight to the
technical reasons for choosing one syntax over another (Whitehead11, Iverson79):

~~~admonish quote title="Whitehead11"
By relieving the brain of all unnecessary work,
a good notation sets it free to concentrate on
more advanced problems, and in effect increases
the mental power of the race.
~~~

~~~admonish quote title="Boole54"
That Language is an instrument of human reason, and not merely a medium
for the expression of thought, is a truth generally admitted.
~~~

~~~admonish quote title="Iverson79"
Nevertheless, mathematical notation has serious deficiencies.
In particular, it lacks universality, and must be interpreted differently according
to the topic, according to the author, and even
according to the immediate context. Programming
languages, because they were designed for the purpose of directing computers, offer
important advantages as tools of thought. Not only are they
universal (general-purpose), but they are also executable and unambiguous.
Executability makes it
possible to use computers to perform extensive
experiments on ideas expressed in a programming
language, and the lack of ambiguity makes possible
precise thought experiments. In other respects,
however, most programming languages are decidedly inferior to
mathematical notation and are little
used as tools of thought in ways that would be
considered significant by, say, an applied mathematician.
~~~

Iverson's thesis is that the most useful concepts of mathematical notation and
programming languages come together in his programming language APL.
Those unfamiliar with APL's syntax may consider it a cognitive inhibitor
rather than an aid, yet the language's terse syntax does provide an interesting
study of the capability of a language's syntax to affect the thought process
of its users.

APL's dictionary is comprised of glyphs instead of English words.
These glyphs often give the programmer some visual clue as to what operation
it represents.
The glyphs for rounding floating-point numbers are perhaps the most straightforward
examples:

```
      ⌈0.5
1
      ⌊0.5
0
```

The glyph `⌊` seems to take its operand from the midpoint down to the floor, reminding the
programmer of its function ("round down").
When given two operands (or "invoked dyadically"), the exact same glyphs
take the minimum or maximum of the two operands, and the glyphs serve similar visual functions:

```
      1⌊2
1
      1⌈2
2
```

The following constructs a three-by-three matrix and demonstrates use of the
`⍉` glyph, which transposes its operand.
One imagines themselves holding both ends of the diagonal line and spinning
the circular part of the glyph around it, swapping the rows and columns:

```
      M ← 3 3 ⍴ ⍳9
      M
1 2 3
4 5 6
7 8 9
      ⍉M
1 4 7
2 5 8
3 6 9
```

In this way, APL provides a dictionary of flexible hieroglyphics that give
the programmer visual hints as to their function.
Oral persons may make heavy use of gesture and other physical manifestations of
their message if a physical or visual aid is needed, but the precision,
permanence, and recognizability of glyph is unique to literacy.
Glyphs like `⍉` might be closer to ideographs like "1" and "2"--
readers of different languages might have very different words for "1" and "2",
but the concepts are largely the same and their meanings are in some small way
communicated by their visual renditions.
The oral rendition of the concept is incomprehensible to listeners of other languages,
but they can all understand the glyph.

Proponents of APL (myself included) can only hope for adoption to branch out
as presently popular forms of writing have:

~~~admonish quote title="Ong82"
When a fully formed script of any sort, aphabetic or other, first makes its way
from outside into a particular society, it does so necessarily at first in restricted
sectors and with varying effects and implications.
Writing is often regarded at first as an instrument of secret and magic power.
~~~

If the declining popularity of Chinese pictographic scripts is any indicator,
a simple alphabet is an aid to adoption and modern offshoots of APL are not
well-positioned to achieve widespread adoption.

<!-- Perhaps APL will remain a form of "craft literacy": -->

<!-- ~~~admonish quote title="Ong82" -->
<!-- ... shortly after the introduction of writing a 'craft literacy' develops. -->
<!-- At this stage writing is a trade practiced by craftsmen, whom others hire to write -->
<!-- a letter or document as they might hire a stone-mason to build a house, or a -->
<!-- shipwright to build a boat. -->
<!-- ~~~ -->

<!-- Such a concept could only be constructed by the literate mind, because such glyphs -->
<!-- would be useless to an oral person. -->
<!-- In this respect, literacy and programming appear to overlap perfectly in notation, -->
<!-- except that code implies execution; glyphs do not just convey ideas, they convey -->
<!-- behavior. -->

## Text that _Does_

Code is different from plain 'ol literature describing or prescribing action;
it _is_ action, (via a translator).
It is not a call-to-action, it fundamentally _is_ action.

## Comments

Comments exist in an interesting overlap of literacy, orality, and code.
They are (usually) strictly literary devices embedded in code, with no effect
on the resultant program. In this case, code completely subsumes the category
of literature, since any work of literature can theoretically exist inside
a program.
Yet, they are not typically meaningful outside the technical context they
physically reside in.
Donald Knuth studied the boundary between code and literature in
_Literate Programming_:

~~~admonish quote title="Knuth84"
I believe that the time is ripe
for significantly better documentation of programs, and
that we can best achieve this by considering programs
to be _works of literature_.

Let us change our traditional attitude to the construction of programs:
Instead of imagining that our
main task is to instruct a computer what to do, let us
concentrate rather on explaining to human beings what
we want a computer to do.
~~~

Programs are inherently social and embedded in a social _and technical_ context.
If the program is to be of use to anyone other than the author, some portion of the
technical context required to run the program must be communicated to other people.
If the program is to be extended for any purpose other than the original one,
the logic the program follows must be interpretable to someone else.
All but the simplest programs require communication between people to be useful.

## Literate Programming

~~~admonish todo
- Literate programming: mention Knuth's Typesetting books, Jupyter notebooks, doctest, and Org mode
~~~

## Editors

## Memory and Narrative in Code

