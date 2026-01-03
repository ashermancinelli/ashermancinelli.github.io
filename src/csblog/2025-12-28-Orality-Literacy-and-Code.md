# Orality, Literacy, and Code

_1/1/2026_

{{ TOC }}

## Intro

Walter Ong, in _Orality and Literacy_ (Ong82),
argues that the medium of thought profoundly shapes how we think.
Ong focuses on the transition from oral cultures to literate ones.
While he later considered digital media, computer programs were not central to _Orality and Literacy_;
programming languages are not considered at all:

~~~admonish quote title="Ong82"
Although the full relationship of the electronically procesed word
to the orality-literacy polarity with which this book concerns itself is too vast
a subject to be considered in its totality here, some few points need to be made...
~~~

Programming languages are of course a small subset of the electronically processed
word, but this was the first place my mind went to.
When we consider the impact of literature on human history and how comparatively brief
of a time computers have been around, I have to imagine the full scope of the impact
of programming languages on human cognition has yet to be imagined.
At first, I thought programming languages either sit outside Ong's oral/literate spectrum
or are simply another form of literature entirely.
I now believe that they _do_ belong on the same spectrum, but _are not_ wholly subsumed
by literature.
I begin by examining some notable contrasts between orality and literacy before
attempting to extend Ong's analysis to programming languages.

~~~admonish note title="Note on Terminology"
We will call people that primarily speak and do not know how to read or write
_primarily oral_ (or just _oral_) people,
and those raised with literacy _literate_ people.
This is not a value judgment.
~~~

## Orality and Literacy

### Action and Artifact

Consider an oral person with a novel idea, who wants to spread this idea to as many people as possible.
What are their options? They could either:

1. go to far-away places and speak in front of many people, or
1. teach it to people who will spread it by word-of-mouth.

There is no way for them to _record_ their thoughts and _send_ them elsewhere;
nothing remains of the thought except the traces in the minds of those who heard it.
The thought exists as sound and event; it survives only as it is shared.
Oral thought is inherently social, contextual, and temporary.

Ong notes that oral cultures rely on formulaic devices
(like cliches, narratives, rhymes and rituals)
to more reliably transmit ideas.
These are _cognitive technologies_ which extend memory and enable transmission.
Literate people use different technologies (like line breaks, paragraphs, and mathematical notation)
to preserve and organize thought.
What looks like dull or onerous repetition in the oral arts
(Homeric hexameter, oral histories, mnemonic formulas)
is better interpreted as technology applicable to a particular medium of communication
rather than evidence of intellectual inferiority.
A scribe might use dark ink on sturdy paper to ensure their ideas are accurately transmitted
to someone in another country. So too do oral artists leverage the technology at their
disposal to communicate as clearly as possible.
Translation is difficult; tools useful in one medium may be useless, strange, or redundant in another.

<!-- Homeric poems may strike the literate reader as repetitive and dull because oral technologies -->
<!-- have been transliterated and no longer serve their original purpose. -->
<!-- Instead of concluding the oral arts are less-than, perhaps we should -->
<!-- instead conclude that it is difficult to faithfully translate between the mediums. -->

<!-- ritual, formulae -->

<!-- Ong points highlights Homeric poetry, Yugoslav orally recited songs and stories, Old English poetic -->
<!-- narratives (like _Beowulf_), and the many African oral traditions as key examples. -->

<!-- ~~~admonish quote -->

<!-- ~~~ -->

## Orality and Code

Programmers use cognitive technologies similar to oral formulas.
Design patterns, comments, and naming conventions are shared devices that
make programs interpretable and transmissible across culture and time.
Perhaps a super-literate mind from two centuries in the future will
look down on those patterns and ask, “Why all the repetition? Why the mythology?"
But metaphors and repetitive structures are tools that help people reason and coordinate.

Consider object-oriented programming.
OOP is a metaphor we use to reason about programs:
we talk about objects having attributes and behaviors, but those are conceptual tools,
not facts about the machine or its behavior.
We use the metaphor because it helps us model complexity and communicate with others.
This says nothing about how useful OOP is relative to the other tools at our
disposal as programmers, only that we observe its use.

In his famous paper _Can programming be liberated from the von Neumann style?_ (Backus78),
John Backus questions the popular contemporary cognitive technologies used for
describing programs, which he ironically had a hand in forming.
Backus argues that the prevailing mental models are intellectually limiting
and a more functional model would be more effective:

~~~admonish quote title="Backus78"
Conventional programming languages are growing ever more enormous, but not stronger.
Inherent defects at the most basic level cause them to be both fat and weak:
their primitive word-at-a-time style of programming inherited from their common ancestor --
the von Neumann computer, ...
their division of programming into a world of expressions and a world of statements,
their inability to effectively use powerful combining forms for building new programs
from existing ones, and their lack of useful mathematical properties for reasoning about programs.
~~~

Particularly limiting are the concepts of _storing_ data
to particular _locations_ and sharp distinctions between _statements_
which have effects and do not have results,
and _expressions_ which have conceptual results but typically not effects.
These are not directly related to the physical components of a computer,
but the noetic structures that sit in between us and the machine.

~~~admonish quote title="Backus78 (emphasis mine)"
Surely there must be a less primitive way of making big changes in the store than by
pushing vast numbers of words back and forth through the von Neumann bottleneck.
Not only is the tube a literal bottleneck for the data traffic of a problem, but,
more importantly, it is an ***intellectual bottleneck*** that has kept us tied
to word-at-a-time thinking instead of encouraging us to
***think in terms of the larger conceptual units*** of the task at hand.
~~~

Note that the technology Backus refers to is not _really_ about programming
languages as they are transcribed, but the noetic structures they presume.
Backus does not mention syntax, but is focused on how the semantics
permit the programmer to model the possible operations in their mind.
Just as oral cultures are constrained by the cognitive tools at their disposal,
so too are programmers limited by the cognitive tools available to them
in their programming environment.
Just as an oral culture couldn't easily organize knowledge hierarchically without writing,
programmers constrained by imperative, statement-based thinking cannot easily
express certain computational ideas.
Backus essentially argues that different cognitive technologies
(like functional programming and expression-oriented semantics) should be made
available to programmers.

## Literacy and Code

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

### Syntax

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
Perhaps APL will remain a form of "craft literacy":

~~~admonish quote title="Ong82"
... shortly after the introduction of writing a 'craft literacy' develops.
At this stage writing is a trade practiced by craftsmen, whom others hire to write
a letter or document as they might hire a stone-mason to build a house, or a
shipwright to build a boat.
~~~

<!-- Such a concept could only be constructed by the literate mind, because such glyphs -->
<!-- would be useless to an oral person. -->
<!-- In this respect, literacy and programming appear to overlap perfectly in notation, -->
<!-- except that code implies execution; glyphs do not just convey ideas, they convey -->
<!-- behavior. -->

### Comments

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

### Literate Programming

~~~admonish todo
- Literate programming: mention Knuth's Typesetting books, Jupyter notebooks, doctest, and Org mode
~~~

## Conclusion

Programming languages exhibit characteristics of both orality and literacy.
The are artifacts (like literature) and actions (like speech).
They could only have been designed by a literate mind, yet are not fully
subsumed by literature.
People who write code employ cognitive technologies that do not belong to literacy
in addition to those literacy provides.
Reading Ong alongside Backus, Knuth and Iverson provides anthropological, social, technical,
historical and philosophical context for how programming languages came to be,
and how we might design new ones.

Debates about programming languages and paradigms are not solely technical disagreements,
but reflections of genuinely different ways of organizing thought and extending cognition,
analogous to the shift from orality to literacy itself.
Programming language design is about communication and human cognition.
When we design a new language or choose between paradigms, we are not arbitrarily choosing
how to tell computers what to do; we are building a cognitive toolbox that shapes
how programmers think and how communities coordinate.


## Links

- Backus78: [Can Programming Be Liberated from the von Neumann Style?](https://dl.acm.org/doi/10.1145/359576.359579)
- Boole54: [Laws of Thought](https://www.gutenberg.org/files/15114/15114-pdf.pdf)
- Ong82: [Orality and Literacy](https://www.taylorfrancis.com/books/mono/10.4324/9780203103258/orality-literacy-walter-ong-john-hartley-john-hartley)
  - [pdf](https://monoskop.org/images/d/db/Ong_Walter_J_Orality_and_Literacy_2nd_ed.pdf)
- Fettes23: [Book Review: Orality and Literacy: The Technologizing of the Word](https://forum.effectivealtruism.org/posts/ZtpPSnnZuheEXxPwa/book-review-orality-and-literacy-the-technologizing-of-the)
- Iverson79: [Notation as a Tool of Thought](https://dl.acm.org/doi/pdf/10.1145/1283920.1283935)
- Knuth84: [Literate Programming](https://academic.oup.com/comjnl/article-abstract/27/2/97/343244)
  - [pdf](https://www.cs.tufts.edu/~nr/cs257/archive/literate-programming/01-knuth-lp.pdf)
- Sturgill12: [Review: Orality and Literacy by Walter J. Ong](https://circeinstitute.org/blog/2012-12-review-orality-and-literacy-by-walter-j-ong/)
- Tao08: [Use good notation](https://terrytao.wordpress.com/advice-on-writing-papers/use-good-notation/#:~:text=By%20relieving%20the%20brain%20of%20all%20unnecessary%20work%2C%20a%20good%20notation%20sets%20it%20free&text=(Alfred%20North%20Whitehead%2C%20%22An%20Introduction%20to%20Mathematics%22)%20Good%20notation)
- Whitehead11: [An Introduction to Mathematics](https://archive.org/details/introductiontoma00whituoft)

---


<!--
https://monoskop.org/images/d/db/Ong_Walter_J_Orality_and_Literacy_2nd_ed.pdf
https://www.supersummary.com/orality-and-literacy/summary/
-->

<style>
p {
    text-indent: 2em;
    margin-bottom: 1em;
}
</style>
