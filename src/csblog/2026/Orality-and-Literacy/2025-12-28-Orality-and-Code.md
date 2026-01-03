<!-- %jinja% -->

# Orality and Code

How do programming languages relate to orality?
At first glance, code might seem to belong entirely to literature,
having little in common with orality.
It's written, stored, and used as text, so it must be literature.
While I mostly agree that code is an extension of and companion to literature,
I was surprised by the connections with orality.
Code is more difficult to separate from its context than literature,
it's inherently active, and it relies on formulaic patterns
for communication between communities.

## Cognitive Tech in Orality and Code

Programmers use cognitive technologies similar to oral formulas.
Design patterns, comments, and naming conventions are shared devices that
make programs interpretable.
A future generation with different tools and more advanced programming
literacy might look at our tools and ask:
"Why all the repetition? Why the mythology?
Just tell the computer what you want it to do."
But these metaphors and repetitive structures can and do help us manage
complexity and communicate our intent.

Consider object-oriented programming.
OOP is a metaphor we use to reason about programs:
we talk about objects having attributes and behaviors, but those are conceptual tools,
not facts about the machine or its behavior.
We use the metaphor because it helps us model complexity and communicate with others.
This says nothing about how useful OOP is relative to the other tools at our
disposal as programmers, only that it is _a_ tool of cognition in use today.
This mirrors the patterns used in the oral arts that allow
the artists to memorize and communicate for more nuanced and voluminous
information to their audience.

In his famous paper _Can programming be liberated from the von Neumann style?_ (Backus78),
John Backus questions the popular contemporary cognitive technologies used for
describing programs, which he ironically had a hand in forming.
Backus argues that the prevailing mental models are intellectually limiting
and that a more functional model would be more effective:

~~~admonish quote title="Backus78"
Conventional programming languages are growing ever more enormous, but not stronger.
Inherent defects at the most basic level cause them to be both fat and weak:
their primitive word-at-a-time style of programming inherited from their common ancestor --
the von Neumann computer, ...
their division of programming into a world of expressions and a world of statements,
their inability to effectively use powerful combining forms for building new programs
from existing ones, and their lack of useful mathematical properties for reasoning about programs.
~~~

He describes two concepts as particularly limiting:

- _Storing_ data to particular _locations_, and
- sharp distinctions between _statements_ (which have effects and do not have results),
  and _expressions_ (which have conceptual results but typically not effects).

He argues that these noetic structures hold us back from effective construction
of programs.
They are related to the behavior of machines, but are not inherent to programming
languages, so as people working on programming languages, we should not
be bound by them.

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
Just as oral people cannot effectively and hierarchically organize
knowledge without writing, neither can programmers constrained by a
von Neumann model of programming effectively organize programs.
Backus essentially argues that different cognitive technologies
(like functional programming and expression-oriented semantics) should be made
available to programmers, and these technologies should shape our cognition.

~~~admonish quote title="Alan Perlis"
A language that doesn't affect the way you think about programming, is not worth knowing.
~~~

## The Social Nature of Code

~~~admonish quote title="Ong82"
To speak, you have to address another or others.
People in their right minds do not stray through the woods just talking at random
to nobody. Even to talk to yourself you have to pretend that you are two people...
I avoid sending quite the same message to and adult and to a small child.
To speak, I have to be somehow already in communication with the mind I am to address
before I start speaking...
I have to sense something in the other's midn to which my own utterance can relate.
Human communication is never one-way.
~~~

Although it's tempting to consider programming at least as individual an activity
as reading and writing, I argue it is far more social.
Some programs are written and used in isolation, but the vast majority of useful
programs are written by one person or group and used by many others.
For programs and libraries to be successful, they need people to use them
and technical contexts to facilitate them.

Most programs exist in a social and technical context.
People must be able to communicate with each other about them.
Physical infrastructure must be provided to facilitate their use.
In this sense, programs resemble the town-square.
I'm reminded of _The Cathedral and the Bazaar: Musings on Linux and Open Source_ (Raymond99).
In contrast, literature can be constructed entirely in isolation (and consumed
in a similar manner), as was the case with 19th century philosophers like Kierkegaard.

Because speech is inherently temporary and active,
it is also inherently context-bound.
Prior to technologies like radio and TV, speech could only be delivered
and consumed in-person, in a specific context, with other people.
This inherently contextualizes speech, far more than literature or programs,
though I argue here that programs are more context-bound than literature.

## A Hybrid of Artifact and Action

Code has remnants of both oral art and literacy:
it is an artifact of thought with a physical representation,
but it inherently describes an action,
almost like a spell,
and always embedded in a technical context in which the code functions.

***Like orality***, it requires context and (usually) community to be meaningful.
It exists as performance/action, not just description.
Programmers use mythology and metaphor to structure their thoughts.

***Like literacy***, it is written, stored, and transmitted as text.
It can be organized hierarchically and precisely, and it _can_ lend itself
to isolation.
These points are discussed in the following post.

I believe this has something to do with the difficulties some people
have with learning to program.
New engineers must build mental models _ex nihilo_--
there are not always metaphors that map the machine's behavior
to the physical world.
Appropriate mental models must be built up through time and exposure.

This hybrid nature suggests programming is a genuinely new form human cognition.
The next post explores the literary characteristics of programs and how they
extend beyond traditional reading and writing.
