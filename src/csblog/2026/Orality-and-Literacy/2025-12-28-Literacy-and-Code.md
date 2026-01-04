<!-- %jinja% -->
# Literacy and Code

{{ TOC }}

Orality and code have a surprising number of characteristics in common.
However, the more natural comparison is, of course, literature.

Literature leaves a physical trace in the world, while orality does not.
Programming languages are unique because they do leave a trace on the world
(the source code of the program is stored _somewhere_), but the physical record
is only part of the program, unlike literature.
Programs are inherently _actions_, like the oral arts, yet they are
cast in text.
Literature simply describes or prescribes; code both describes and performs,
closer to a magic spell than a textbook.
Code is impotent and incomplete without being executed.

<!-- An exception to this is comments; they are pure literature embedded in programs, -->
<!-- typically leaving no trace on the resultant program. -->
<!-- They are like spells; they are described in words and characters, but they are -->
<!-- impotent and incomplete without being cast (or ran). -->

## Syntax and Cognition

Some aspects of programming language design are purely literate concepts, such as syntax.
In _Notation as a Tool of Thought_ (Iverson79), Iverson considers how syntax shapes cognition.
He begins with his philosophical foundations:

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

He points out some of the advantages programming languages have over
regular literature:

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

Programming languages are executable, deterministic, and unambiguous.
These characteristics offer cognitive tools that literature does not.

### APL, Glyphs, Ideographs

Iverson's thesis is that the most useful concepts of mathematical notation and
programming languages come together in his programming language APL.
Those unfamiliar with APL's syntax may consider it a cognitive inhibitor
rather than an aid, yet the language's terse syntax does provide an interesting
study of the capability of a language's syntax to affect the thought process
of its users.

APL's dictionary is comprised of glyphs glyphs that provide visual hints to
their function instead of English words.

```
      ⌈0.5
1
      ⌊0.5
0
```

The glyph ⌊ visually suggests taking its operand from midpoint down to the floor,
reminding the programmer of its function ("round down").
With two operands, these glyphs compute minimum and maximum,
evoking similar imagery:

```
      1⌊2
1
      1⌈2
2
```

The transpose operator ⍉ suggests spinning the matrix around its diagonal.
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

In this way, APL provides a dictionary of flexible hieroglyphs that give
the programmer visual hints as to their function.
APL's glyphs function like ideographs like "1" and "2":
a Chinese speaker and an English speaker will not understand each other's
explanations of transposition, but both visually understand the meaning of "⍉".
The characters communicate meaning independent of spoken language.
Gesture serves a similar function in oral peoples;
neighboring communities may not be mutually comprehensible, but they
can point and motion with their hands to communicate.

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

## Semantic Editing

Modern programming environments offer editing tools with no comparison
in a typical written setting, thanks in particular to the _determinability_
of code.
Formally defined grammars allow procedural analysis of code that is not possible
in prose.
The earliest examples of this are seen in the Lisp community, where the
editing environment was an early focus.

~~~admonish quote title="Ong82"
As the experience of working with text as text
matures, the maker of the text, now properly an ‘author’, acquires
a feeling for expression and organization notably different from
that of the oral performer before a live audience...
The writer finds his written words
accessible for reconsideration, revision, and other manipulation
until they are finally released to do their work. Under the author’s
eyes the text lays out the beginning, the middle and the end, so
that the writer is encouraged to think of his work as a selfcontained,
discrete unit, defined by closure.
~~~

Just as the transition from orality to literacy offered new tools for construction
of thought, so too do modern editors.
In particular, _language servers_ make the entire semantic context of a program
available to the programmer directly, freely searchable and modifiable.
In prose, the best we have is tools to look up the definitions of words, but there
is nothing like an English language server that would allow an author to navigate
text as a semantic tree.
Authors can construct the semantic information _themselves_ by organizing their
work into chapters or files, but the burden is on the author to maintain the
structure.
Editors understand the full technical context and update continuously.

~~~admonish quote
Print, as has been seen, mechanically as well as psychologically
locked words into space and thereby established a firmer sense of
closure than writing could.
~~~

As print "locked words into space," editors bring programs to life.


## Literature in Programming

Two subsets of programming are unique in their relation to literacy.
***Comments*** and ***literate programming*** are both inherently works of
literature embedded in or combined with code.

Comments exist in an interesting overlap of literacy and code.
They are (usually) strictly literary devices embedded in code, with no effect
on the resultant program.
In this case, code completely subsumes the category
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

For a more literature-forward analysis of programs, _Literate Programming_
is a must-read.
Knuth dealt with the specifics of typesetting documents in great detail
across several volumes, such as his 1999 work, _Digital Typography_.

~~~admonish note title="Sidenote on Unix"
Digital typography was even the titular motivation for Dennis Ritchie to
begin work on the Unix operating system at Bell Labs;
although he probably just wanted an excuse to work on his own OS after the
failure of the Minix operating system, developing a proper digital typesetting
program for the Lab was at least the rationale for funding his effort.
~~~

Programs are inherently social and embedded in a _social and technical context_.
If the program is to be of use to anyone other than the author, some portion of the
technical context required to run the program must be communicated to other people.
If the program is to be extended for any purpose other than the original one,
the logic the program follows must be interpretable to someone else.
All but the simplest programs require communication between people to be useful.

## Effects on Cognition

Ong avoids moralizing the distinction between oral and literate
people, avoiding even implicitly moral terms like "illiterate".
Nonetheless, he does not shy away from the benefits of literacy:

~~~admonish quote title="Ong82"
Writing, as has been seen, is essentially a consciousness-raising activity.
~~~

And elsewhere:

~~~admonish quote title="Ong82"
Orality is not an ideal, and never was. To approach it positively
is not to advocate it as a permanent state for any culture. Literacy
opens possibilities to the word and to human existence
unimaginable without writing. Oral cultures today value their oral
traditions and agonize over the loss of these traditions, but I have
never encountered or heard of an oral culture that does not want
to achieve literacy as soon as possible.
Yet orality is not despicable. It can produce creations beyond thereach
of literates, for example, the Odyssey. Nor is orality ever
completely eradicable: reading a text oralizes it. Both orality and
the growth of literacy out of orality are necessary for the evolution
of consciousness.
~~~

If literacy changed cognition by enabling abstract thought,
hierarchical organization, and precise specification, what might code do?

Rather than manipulating text alone, the programmer
works on semantic structure with immediate feedback.
Thought experiments are executable directly and provide instant feedback.
Programmers learn to build on top of abstractions and communicate with other
people in new ways.

Compare the history of programming languages to the history of literacy.
Literacy is at the very least several thousand years old while
programming languages are about one hundred years old, at most.
The difference between the Automatic Programming of John Backus and Grace Hopper
and modern programming languages is astounding.
What differences might we see in the next thousand years?
What effects might those differences have on our cognition?
