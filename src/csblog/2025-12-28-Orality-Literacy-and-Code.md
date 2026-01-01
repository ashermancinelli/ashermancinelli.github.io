# Orality, Literacy, and Code

_12/28/2025_

~~~admonish tip title="Table of Contents"
<!-- toc -->
~~~

Walter Ong, in _Orality and Literacy_ (Ong82),
argues that the medium of thought profoundly shapes how we think.
Ong focuses on the transition from oral cultures to literate ones.
While he later considered digital media, computer programs were not central to _Orality and Literacy_;
programming languages barely register in that book.
At first I thought programming languages either sit outside Ong’s oral/literate spectrum
or are simply another form of literature.
After reflection, I believe they _do_ belong on the same spectrum, but _are not_ wholly subsumed
by literature.
<!-- _Orality and Literacy_ has much to offer the programming language community. -->
I begin by contrasting orality and literacy, then
attempt to extend Ong's analysis to programming languages.

~~~admonish note
We will call people that primarily speak and do not know how to read or write _primarily oral_ (or just _oral_) people,
and those raised with literacy _literate_ people.
This is not a value judgment.
~~~

## Action and Artifact

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

Just as oral artists use cognitive technologies to give their ideas legs, so too
do programmers use design patterns to make their programs more interpretable to other
people.
The literate mind has a tendancy to look down on the oral arts.
They might ask: _"why is this poem so repetitive and full of myths and cliches?"_
and conclude that authors of that time period must have been less sophisticated.
What will future generations think of the code we write today?
Will they consider object oriented programming to be a complicated and unnecessary
mythology?

OOP is a metaphor and a cognitive technology we use to reason about programs.
"Objects" do not really exist; they do not have "behaviors" that act on other
objects, nor do they have attributes or conform to protocols.
We use these metaphors to understand and build upon large systems and communicate
with other people, but we are unable to examine to a transistor at a point in time and
conclude that it is an object.
This is not to say that OOP is the _best_ cognitive technology in use by programmers
(or even a _good_ one!), but only that it is _a_ cognitive technology in use.

In his famed paper _Can programming be liberated from the von Neumann style?_ (Backus78),
John Backus questions the popular contemporary cognitive technologies used for
describing programs, which he ironically had a hand in forming.
His thesis is that the models underpinning most programming languages
are insufficient, and that a more functional model would be more effective:

~~~admonish quote title="Backus78"
Conventional programming languages are growing ever more enormous, but not stronger.
Inherent defects at the most basic level cause them to be both fat and weak:
their primitive word-at-a-time style of programming inherited from their common ancestor --
the von Neumann computer, ...
their division of programming into a world of expressions and a world of statements,
their inability to effectively use powerful combining forms for building new programs
from existing ones, and their lack of useful mathematical properties for reasoning about programs.
~~~

In particular, programming languages that restrict themselves to concepts of _storing_ data
to particular _locations_ and distinguish between _statements_
which have effects and do not have results,
and _expressions_ that have conceptual results but typically not effects.
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

## Literacy and Code

Literature leaves a physical trace in the world, while orality does not.
Programming languages are unique because they do leave a trace on the world
(the source code of the program is stored _somewhere_), but the physical record
is only part of the program, unlike literature.
Programs are inherently _actions_, like the oral arts, and yet they are
cast in literature.
They are like spells; they are described in words and characters, but they are
impotent and incomplete without being cast (or ran).

An exception to this is comments; they are pure literature embedded in programs,
typically leaving no trace on the resultant program.

Some aspects of programming language design are purely literate concepts such
as syntax.
Iverson's _Notation as a Tool of Thought_ (Iverson79) considers the cognitive effects
of the syntax of programs.
His paper with philosophical foundations rather than technical, evoking the words
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

### Comments

Comments exist in an interesting overlap of literacy, orality, and code.
They are (usually) strictly literary devices embedded in code, with no effect
on the resultant program. In this case, code completely subsumes the category
of literature, since any work of literature can theoretically exist inside
a program.

Yet, they are not typically meaningful outside the technical context they
physically reside in.

Donald Knuth studied the boundary between code and literature in
(Knuth84):

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

## Links

- Backus78: [Can Programming Be Liberated from the von Neumann Style?](https://dl.acm.org/doi/10.1145/359576.359579)
- Boole54: [Laws of Thought](https://www.gutenberg.org/files/15114/15114-pdf.pdf)
- Ong82: [Orality and Literacy](https://www.taylorfrancis.com/books/mono/10.4324/9780203103258/orality-literacy-walter-ong-john-hartley-john-hartley)
- Iverson79: [Notation as a Tool of Thought](https://dl.acm.org/doi/pdf/10.1145/1283920.1283935)
- Knuth84: [Literate Programming](https://academic.oup.com/comjnl/article-abstract/27/2/97/343244)
  - [pdf](https://www.cs.tufts.edu/~nr/cs257/archive/literate-programming/01-knuth-lp.pdf)
- Tao08: [Use good notation](https://terrytao.wordpress.com/advice-on-writing-papers/use-good-notation/#:~:text=By%20relieving%20the%20brain%20of%20all%20unnecessary%20work%2C%20a%20good%20notation%20sets%20it%20free&text=(Alfred%20North%20Whitehead%2C%20%22An%20Introduction%20to%20Mathematics%22)%20Good%20notation)
- Whitehead11: [An Introduction to Mathematics](https://archive.org/details/introductiontoma00whituoft)

---

## Personal Notes

### mnemonics and formulas

- Does code remind me more or orality or literacy? Simply reading the technical text does not contain the full context required to interpret it, more similar to orality. The organizational and technical context are immediate and often required for interpretation.
- Orality is inherently active, non visual, and contextualized. It only ever exists as an event in a moment in a context, while literature is an artifact of thought, independent of a context. Code is a hybrid of both: an artifact of thought, but inherently describing an action, almost like a spell, and always embedded in a _technical context_ in which the code functions.
  - Sound only exists as it is going out of existence. There is no stopping or having sound. It is inherently perishing. Thoughts are conceived of in primarily oral cultures as such.
  - However complex and rigorous, primarily oral thoughts cannot be independent and purely logical, because as soon as the thought is had, it ceases to exist, absent some mechanism for committing the thought to memory and transferring it to others.
- Code is different from plain 'ol literature describing or prescribing action; it _is_ action, (via a translator). It is not a call-to-action, it _is_ action in some fundamental way.

### Characteristics of Orally Based Thought

- Additive rather than subordinative
- Orality favors the cliche because it's a memory aid and ensures the message will travel further.
  - there's lots of thematic repetition, and they must stay intact. Their persistence is evidence of the effectiveness
      of the cliche in allowing the moral to travel through time and space. It's not low-minded to use them, it's part of the medium.
      Analysis/deconstruction is risky-possible destroying the message forever if the analysis propagates through too many minds
      such that the message ceases to travel organically. The same can be said for "redundant" or "copious" continuity.
  - it's like the page numbers or paragraphs. it's not redundant to leave that extra space there, because it's really useful in
    helping the reader keep track of what's going on. Future iterations of humanity might look back at paragraph line breaks
    and other literary tools of thought and organization and consider them to be "silly" or "primitive" because they are no longer
    useful in whatever medium comes after writing.
  - sparse linearity is actually unnatural and recent, only able to persist in human communication in the presence of longstanding
    artifacts of thought.
  - repetition is particularly useful in live communication because of the nature of sound. It's easy to miss a word here and there,
    so repeating the message often helps the audience keep track and refine their understanding. It's not primitive at all.
    - also gives the speaker a chance to mindlessly repeat their message while they consider what to say next.
- characterized by conservatism/traditionalism
  - bc what is not actively conserved is immediately lost.
  - writing can also be conservative (laws were frozen in time as soon as they were written down)

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
