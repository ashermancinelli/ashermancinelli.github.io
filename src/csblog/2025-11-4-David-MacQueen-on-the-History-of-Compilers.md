# David MacQueen on the History of Compilers
_11/4/2025_

[In this interview](https://youtu.be/gS8ou4uCHKE), David MacQueen and I discuss
the history of compilers, especially as it relates to the evolution of Standard ML,
but also discussing changes he would like to make to the language, the influence
of Peter Landin and the λ-calculus, and modern compiler technologies.

I really enjoyed this conversation and I'm thankful to David for taking the time to chat.
[See this post](2025-10-23-History-of-Compilers.md) for the motivation for this interview.

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/gS8ou4uCHKE?si=WyO_h6Qg7R_Lh2Sr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</center>

This is transcript was originally AI-generated, but I'm editing it by hand as I review
pieces of it. Apologies for any errors.

```
with uh these two voice all right well i'm recording on my side too and you're 
you got yours so i think we can just uh hop back in i'm thinking that uh maybe 
we'll do a little five to ten minute intro on some of your background how you 
got into working on ml and then you know maybe a 30 35 minute maybe a 45 minute 
total conversation and the most of it we'll just be chatting about the history 
of compilers maybe we'll talk a bit about you know the logic for computable 
functions and how that led to ml as this i can give you a bit of ml background 
sure yeah yeah so yeah so my name is dave mcqueen i was trained as a 
mathematical logician in computability theory at mit i was in the air force for 
a while then i went to edinburgh as a postdoc in 1975 and spent almost five 
years in edinburgh and that's where i turned into a computer scientist and i 
worked with people like rob burstle who was my boss and rob miller and 
basically the theory of programming languages uh my background in mathematic 
mathematical logic was uh relevant and useful anyway so um edinburgh was a kind 
of special place in the 70s in the 70s and since then in terms of european uh 
theoretical computer science which is quite different from american theoretical 
computer science in the sense instead of focusing on algorithms and complexity 
theory in the u.s uh european theoretical computer science tended to uh look at 
um connections between logic and and computer science and in particular uh uh 
the theoretical foundations of programming languages and um so the lambda 
calculus was a major inspiration source of ideas right back church around 1930 
and later ideas uh about types uh that were introduced by alonzo church and uh 
well introduced originally by uh russell and whitehead around 1911 uh as a 
defense against uh um paradoxes like russell's paradox and uh then uh turned 
into a kind of augmented version of the lambda calculus called the simply type 
lambda calculus by church in a paper in 1940 uh and uh and uh then kind of 
rediscovered and popularized by some computer scientists back in the uh 60s 
mostly uh christopher strachey uh and uh peter landon um both of whom had kind 
of uh non-standard informal kinds of education because there wasn't uh computer 
science discipline in the 1950s uh there were things going on at cambridge 
manchester uh around turing and and so on but uh and early at bletchley park 
earlier in bletchley on the code breaking uh technology mm-hmm so that was the 
kind of british context and there were people like tony hoar that were involved 
in this uh program language you know semantics and right uh really work on 
verification and applying logic to programming yeah and if if i can interject 
so you know around this time i'm i feel like today it's a little bit hard to 
overstate the influence of the development of algol had on all of these 
languages and there were you know called by name and called by value in these 
things and then a lot of landon and strachey's papers were a little more strict 
evaluation semantics is that right maybe you can speak to the development of 
algol and there was the algol group um there were uh i don't recall whether 
strachey or landon had direct connection one moment uh yeah no worries yeah 
he's getting a call from my wife i'm just hello i'm uh i'm in the midst of a 
remote discussion okay about compilers very quickly uh i'm at pedro's with sin 
we finished our shopping and we're eating lunch okay no problem right bye she's 
having lunch with her friends good to know good to glad we got that settled uh 
anyway um so i'm kind of vague about uh you know obviously um uh john bacchus 
uh peter norr from denmark um um uh the algol 68 guy uh so there was a group uh 
sure involved in in the algol development uh that was late 50s through early 
1960s and then there were some uh interesting there was probably the first book 
about compilers was the description of the algol 60 compiler mm-hmm but uh and 
strachey's work around the mid 1960s was part of it involved uh definition of a 
new kind of systems programming language she called cpl right right epl and 
that was an algol um 60 derived language uh and um uh it had i don't think 
peter landon was involved directly in cpl yeah i think he was not on the papers 
but i think around the same time he was uh busy translating he had a company it 
was a kind of software consulting company gotcha in london and he hired um uh 
peter landon and peter landon uh got very enthusiastic about the lambda 
calculus and wrote a burst of very important papers from about 64 to 66 uh one 
was uh the next 700 programming languages where he described a kind of uh 
syntactically sugar sugared lambda calculus that he called i swim if you and um 
then he wrote about uh a abstract machine for evaluating uh that language or 
the lambda calculus right uh and he also wrote a couple of papers about how to 
model the semantics of algol 60 by translating algol 60 into the lambda 
calculus with various right right devices and tricks and that machine was the 
was it landon's secd machine yeah the secd machine that's right right it had 
four components the store the stack the environment the control and the dump 
which was more stack right yeah anyway um so those papers uh had a huge impact 
and uh later on uh robin milner was interested in writing a uh uh proof 
assistant this would be an interactive system to help uh a person uh perform 
formal proofs in a in a particular logic which was called lcf or logic for 
computable functions and this is at stanford right he did that work initially 
at stanford and then came brought it back to edinburgh right right yeah around 
1973-74 and logic for computable functions was a logic for reasoning about 
functions and recursion and so on developed by um dana scott in the late um 
late 60s mid to late 60s and he developed that um because he was trying to find 
a mathematical model for the lambda calculus uh and he got frustrated he 
couldn't find a model because of the uh fundamental problem of self-application 
that the model of the lambda calculus had their support the idea of buying a 
function to itself and for a long time scott couldn't figure out how to build 
such a model and he decided to fall back on on a logic for reasoning about uh 
these kinds of functions but then he did discover a model around 1969 which is 
the scott domain model infinity model uh and uh so he never published that the 
earlier paper that described the lcf logic uh kooch um i swim and all that was 
the name title of the logic it it's since been published in uh logic and 
symbolic computation gotcha right uh as uh sort of uh retrospective uh 
publication and so now ml enters the picture because this lcf system yeah yeah 
uh robin milner had a a robin milner was another sort of self-taught british 
computer scientist he um had a good education uh good mathematical background 
and he was teaching at a public school you know private secondary school in 
britain and um he got interested in doing research and he um i think he had a 
position at swansea and he managed to get a kind of a research visit for a year 
or two at stanford around 1971 72 and at stanford he uh met with a guy named uh 
uh wyrock uh wyrock uh wyrock and uh they together uh thought they could write 
a theorem prover that would use this logic and so they the first first 
generation of that was uh it was called ml no it was called uh lcf theorem 
prover uh what didn't exist at that time that was at stanford they wrote the 
system in lisp and lisp and lisp was the meta language right right pro language 
if you like in the language for writing uh proof tactics but um he then got a 
position where miller then got a position to edinburgh and came to edinburgh 
sometime in late 73 mid i think and um brought in a couple postdocs over the 
next years got some funding and uh decided to do a proper lcf theorem prover 
and instead of using lisp which was uh insecure in the sense that it was not 
statically typed um he chose to use i swim as the meta language but added a 
type system and a static type checker and beyond that he um kind of 
rediscovered um the idea of inferring types and this was a a fairly old idea in 
the logic world but it wasn't known in computer science so no they essentially 
rediscovered it and the um ml metal language for the lcf theorem prover and 
that was in the mid to late 70s they kind of finished this theorem prover 
around 1978 and they published a uh a paper um on the theorem prover and then 
miller published a paper on the type system and so the the purpose of you know 
they had lisp and ice women landed his original papers dynamically typed right 
but the the issue was was a kind of thought experiment language uh although i 
swim uh after he left um working for strachey he went to new york and he worked 
at univac for a while but he also had a visiting position for a while at mit 
and so he taught people at mit about ice swim and there was actually an 
implementation effort led by evans and wolzencraft at mit in the late 60s and 
they called their implementation pal i forget what pal stands for but it was 
basically ice swim and so uh but i don't think uh the pal uh work had any 
visibility or influence in edinburgh um but the reason that lisp didn't work 
very well or even dynamic ice swim was because if you you know made some 
mistake in your list code you could get a a proof that was wrong right right so 
the point uh static type checking was that there would be an abstract type of 
theorem and the only way you could produce a value of type theorem um is to uh 
use inference rules that were strongly typed and uh the strong typing uh 
guaranteed in principle the correctness of the proof so you would be able to 
generate any unprovable or non-proved theorems other than by uh application of 
the proof rules the inference rule uh and so it was logical security that the 
type system was providing but in order to have some language that was um closer 
to lisp in in flexibility uh they'll never have the idea of introducing this uh 
automatic uh type inference system and as i said uh earliest uh work on 
something like that was uh 1934 by by um curry uh and then later on curry in 
the 50s when he was writing his book about uh um about uh combinator logic he 
had a chapter in that book about uh what he called functionalities for for 
conduct combinators which were essentially his term for types uh uh in the 1934 
paper he kind of then formally um described um described something that you 
would call type inference and then came back to that uh later on in in the 60s 
and then roger hindley a logician at uh swansea uh took that up and wrote a 
paper about it as well and this was before um milner knew about it so later on 
i mean had published his paper about it somebody had told him that there was 
this earlier work by curry and hindley but in fact there was the the first 
actually um published algorithm for type inference was uh produced by max 
newman in 1943 and max newman was turing's uh mentor at cambridge with 
professor of mathematics and uh uh uh was interested in things like goodless 
proof and foundational issues and uh he was the one who sent turing off to 
princeton to work with perch and get a phd and um later on he became the head 
of the manchester uh computing laboratory and hired turing there toward the end 
of his life anyway uh so max newman in a different context had thought about 
type inference and wrote a paper about it and he was his main target was type 
inference for coin's new foundation which was a kind of uh alternate 
formalization for sort of logic but he also had a section that did uh applied 
the ideas to lambda calculus anyway so that uh early work by newman was 
interesting but uh nobody knew about it and henley rediscovered it back many 
years later um anyway so this is a case where there was parallel work in logic 
and computer scientists but they weren't aware of each other well and at this 
point the lambda calculus and combinatory logic are sort of cousins right 
solving a lot of the same problems right they're equivalent right combinatorial 
logic is essentially the lambda calculus without variables and you have a bunch 
of uh combinator reproduction rules instead of the beta reduction that would 
calculate right right so um move my phone a little bit closer to make sure 
anyway um so that was the kind of background cultural um situation in edinburgh 
in the late 70s and i've arrived at 1975 um but i was working at that time 
there was a computer science department and rob milner and his group of 
postdocs and grad students were in the computer science department and they 
were at the king's buildings campus which was a kind of science campus three 
miles south of the rest of the university which was in the center of town uh 
and um there was a school of artificial intelligence uh so the early blossoming 
of artificial intelligence around edinburgh and i worked for ron burstle who 
was in the school of artificial intelligence and uh some of some of his other 
postdocs and students and uh um um we developed a kind of parallel language 
called hope which was a um language derived from or evolved from a rather 
simple first order uh functional language that kind of resembled girdle's uh 
generally recursive equations of uh 1930 uh which were part of the uh leading 
to the incompleteness still anyway um we developed this language called hope 
and we borrowed some ideas from ml in particular the general type system and 
the type inference and type checking uh approach and uh it had its own um 
special thing which was later called algebraic data types and uh so algebraic 
data types came came from hope um based on part of the evolution from this 
first order language and then um in the 80s uh there was a another effort to 
design uh a kind of first class uh functional programming language which uh 
robin initially called standard ml because it was trying to standardize and 
unify several um threads of work including the ml that was part of the lcf's 
theorem prover and the hope language that ron bristol and i had developed and 
um cambridge was off the people at cambridge and inria were off uh kind of 
evolving lcf and in in in the ml dialect there so uh so robin proposed this 
sort of unified standard ml that had uh aspects of hope and uh and lcf ml and 
through various meetings of mostly edinburgh people or people in the edinburgh 
culture like myself i was then bill labs um we designed the standard ml 
language from about 1983 to 86 and then robin's idea robin viewed it just as a 
kind of language design effort and a major goal was to produce a formal 
definition of the formal definition of the language using uh tools that had 
been developed at edinburgh for operational semantics so there was a kind of 
edinburgh style operational semantics and that was used to give a formal 
definition of the ml uh language standard ml language and that was published as 
a book by mit press 1990 um and um but raman's goal was essentially to produce 
produce that language design and the corresponding formal definition published 
as a book and uh as an actual programming language he had no intention of using 
it and he wasn't terribly interested in implementing it uh he had a kind of 
naive idea that uh uh once it was out there some commercial software house 
would say we should write write a compiler for this thing uh of course that 
didn't that eventually kind of happened there was a software house that uh 
harlequin limited uh later on in the 80s that uh had a project to implement a 
ml compiler because their boss at that time was interested in producing a lisp 
compiler a ml compiler and a dylan compiler where dylan was this uh language 
developed at apple that uh nobody remembers kind of a lisp dialect uh 
interesting anyway uh but uh uh uh i was at bell labs and i uh got together 
with the new young faculty member andrew appell at princeton who was interested 
in and writing compilers and uh so we got together and uh started working in 
spring of 1986 was working on a new compiler for standard ml and uh there were 
other kind of derivative compilers uh there was something called edinburgh 
standard ml which was kind of derived from an earlier edinburgh ml compiler 
which was derived from a uh compile that luca cardelli wrote when he was a 
graduate student um or dialect so the uh and then andrew was a real computer 
scientist with a real computer science degree from carnegie mellon and he knew 
about things like code generation runtime systems and garbage collection and so 
on um and uh you know before when we developed hope for instance and when uh 
the lcf ml was developed it was just piggybacking on in the lcf's case it was 
piggybacking on a lisp implementation and so the kind of nitty-gritty stuff was 
handled cogeneration garbage collection and so on were handled by the 
underlying lisp and uh the hope implementation that i worked on was uh hosted 
by a pop two which was uh an edinburgh developed uh cousin of lisp uh symbolic 
programming language um rather influenced by by landon landonism maybe you can 
speak to it i find it so interesting that you were at bell labs and appell at 
princeton and in a roughly similar time period um i think you also had aho at 
bell labs and ulman at princeton so we took very different approaches to 
compilers yeah after edinburgh i went to um well i i tried to get back to 
california so i had a kind of aborted so one year stay at isi in southern 
california and i went to bell labs and um uh there a guy named robbie seti who 
was one of the authors co-authors of the later edition of the dragon book on 
compilers um he was interested he had become interested in semantics of 
programming languages and so uh they hired me at bell labs and um um um aho was 
there he was a department head of the kind of theory department in the center 
this better way unix was developed and so there there was the hard hardcore 
unix group that uh richie and thompson and kernahan and pike and later on and 
uh and so on uh doug mcelroy who's my boss uh and uh uh that was the orthodox 
culture at bell labs of course by the time i got there in the beginning of 81 
uh unix was already a big success and well established and and so on and the 
unix people basically all worked in the communal terminal room up on the fifth 
floor um next to the pdp 70 right pdp 70 right right time sharing system and uh 
i was never part of that group and two doubt two doors down the hall there was 
this new guy um who joined bell labs a bit before i did probably 1980 or 79 
named bjarne stustrup and he was working at trying to make c into an 
object-oriented language because he had uh done his graduate work using simula 
simula 67 at cambridge right right and simula simula simula was originally also 
an extension of algol 60 but for parallel process simula was explicitly a 
derivative of algol 60 right the idea the class was just uh uh almost like cut 
and paste combination of blocks of algol code uh with weird control structures 
um anyway uh so there was that object-oriented stuff going on down the hall but 
uh uh we were on different bandwidths so there was better communication and uh 
um also not very much communication between me and and the sort of unix 
orthodox culture i you know used the unix system and uh one of the first things 
i i did when i first arrived at bell labs to like make my computing world a 
little bit more comfortable is first i ported a version of emacs to the uh 
which was alien culture and to the local unix system and i also wrote a version 
of yak in list so i had to figure out steve johnson's weird code for the yak um 
anyway but pretty soon after that i got involved in well first uh working on 
further development of hope and then starting in 83 and started working on 
standard ml why do you think there was so little mutual interest between what 
you were working on and the unix folks well it's kind of background and culture 
the unix approach was very seat-in-the-pants kind of hacking uh approach and uh 
they didn't think very formally about what they were doing basic express things 
at two levels one was vague pictures on a on a blackboard whiteboard where you 
had boxes and arrows between boxes and things like that and code so they they 
would translate between these sort of vague diagrams and uh and uh assembly or 
later c code and c is essentially a very high level pdp 11 assembly language if 
as far as they're concerned um and uh you know i had a more mathematical way of 
trying to understand what was going on and uh uh so it was not easy to 
communicate um dennis ritchie originally had a mathematical background but uh 
and as one point or another i tried to discuss concepts uh like the stream 
concept in in unix with him um but uh yeah one main reason i was at bell labs 
is because doug mcelroy who hired me had done some work relating to um stream 
like co-routining and i had worked on that at edinburgh with with gil khan um 
so that my first work in computer science so that involved functional 
programming and uh lazy evaluation a particular way of uh organizing that and 
it kind of connected conceptually with the notion of the stream in in in unix 
you know piping pipelines uh of essentially stream processing where you know 
the input and output were pipe streams um anyway um but uh srushe also didn't 
connect with this orthodox culture very strongly because uh he as i said wanted 
to turn c into an object-oriented language and he did that initially by writing 
a bunch of pre-processor macros to define a class-like mechanism and that 
evolved into c plus plus and much later c plus plus compilers it was because 
initially kind of pre-processor based he had he started with the um cpp unix uh 
pre-processor and evolved that into a more powerful pre-processing system was 
called c front right right and at some stage it was called c with classes um 
and later on c plus plus and uh and and it's interesting though now nowadays i 
mean i think i think i think it's herb sutter that's working on uh something 
called cpp front which is the the c front for c plus plus to to turn modern c 
plus plus into yeah very interesting uh yeah i'm not very keen on macro 
processing uh front ends especially if you if you're interested in types 
they're very problematical right if you want to define a language that has a uh 
well-defined uh provably sound type system macros are a huge mess right right 
well maybe we can return to ml so we've got some sort of standard ml but at 
inria there's the beginnings of what would be camel and then ocaml right so at 
the beginning so the first meeting was a kind of accidental uh uh gathering of 
people at edinburgh in april of 83 and robin wanted to present his uh proposed 
uh standard ml that he worked on a bit earlier and it turned out that uh one of 
the groups at inria that would have close connection with robin and uh research 
work at edinburgh was uh gerard wetz group at uh inria and as a member of that 
group there was a guy named guy kusino who worked on uh um was part of wetz 
group at uh inria and he happened to be in edinburgh and kind of was involved 
in these meetings as a kind of representative of the inria people and um he 
took the ideas made notes and took the ideas back to edinburgh and they they 
contributed a a critique or a you know feedback uh about the first uh iteration 
of the design uh so in fact uh the inria people were connected to the 
beginnings of standard ml through that connection and geek kusino and gerard 
wetz um in the next next following year we had a second major design meeting 
and um i believe kusino came to that one as well there were several people from 
edinburgh and people who just happened to be around i was around um luca 
cardelli was around of course rod burstall and robin milner and some postdocs 
and grad students and so on uh and uh we made a decision i swim had two 
alternative syntaxes for local declarations essentially a block structure one 
was let declaration in expression where the in expression defined the scope of 
the declarations and there was an alternate one that was used in in in i swim 
which was expression where declaration so you have the declaration coming after 
the expression and uh when they scale up for fairly obvious software 
engineering reasons uh it's better to have the declarations before the uh scope 
rather than after the scope because the scope might be uh uh you know you might 
have a 10 page expression followed by the declarations on page 11. right right 
it's kind of hard to understand the code and you have a kind of tug of war if 
you have uh let declaration in expression where declaration to you know prime 
or something which declaration applies first uh anyway so it seemed uh 
unnecessary to deal with these difficulties with the wear form and so we 
decided to drop the wear form and only have the let form in ml and uh this 
upset the inria people um they thought that where was wonderful and they wanted 
to keep wear so they decided you can't have let the anglo-saxons uh have 
control of this thing so they they did their french uh branch or fork of the 
design but they kept wear for a while and eventually dropped it anyway so 
that's the original connection and unfortunately they also made their own you 
know satisfied their own taste in terms of certain concrete syntaxes where you 
just said the same thing but the concrete syntax was slightly different in 
their dialect just making it um unnecessarily difficult to translate code back 
and forth um and in this time shortly after some of the first standardization 
efforts there was significant work done on the representation of modules is 
that right yeah so that was my contribution um i had been thinking about a 
module system for hope and i wrote a preliminary paper about that and it was 
kind of inspired by uh work in kind of modularizing formal specifications in 
software and there was kind of a school of algebraic specifications and ron 
burstle was connected with that joint work with joseph gogan um who was at ibm 
and later ucla um anyway so uh i was inspired by that party and also by work in 
uh um type systems as logics uh curry howard i've heard of the curry howard 
isomorphism things like that in the work of uh per martin luft the swedish 
logician um and so there were these sort of type theoretic logics and so part 
of the inspiration for module ideas came from that and part of it came from the 
parallel work on modularizing algebraic specifications and uh so i wrote up a 
when the first description of the first description of ml was published as a 
paper in the 1984 list conference and i had a another paper in parallel 
describing the module system and then over the next couple years we further 
refined that and um it became a major feature of standard ml and um i'm still 
thinking about that i would love to get that i would love to get to that once 
we cover some of the other history in between there and some of the changes 
you'd like to make because i think there's a lot of anyway implementation of 
standard ml okay so uh obviously the lcf implementation was a compiler but it 
compiled uh the ml code in the lcf system into lisp and then invoked the lisp 
evaluator to to do execution um so code generation was basically a translation 
to lisp and uh similarly that's the way i did the hope implementation by 
translating to pop two and then evaluating in pop two which i believe is still 
how to some extent the ocaml compiler today works i believe there's an option f 
lambda that gives you these big lisp expressions uh yeah well it's easy to to 
write an interpreter and right uh what happened with ocaml i won't try to 
represent them sure because i wasn't involved in that but uh originally the 
reason for the name camel c-a-m-l was that uh one of the researchers at inria 
whose name just in you know floating in my head but i can't pull it up uh he 
had been studying category category theoretic models of lambda calculus uh you 
know there's a certain adjoint situation that can be used to define what a 
function is and what function application is and out of that adjoint situation 
in category theory you can derive some equations and then you can interpret 
those equations as a kind of abstract machine and so he called that the 
categorical abstract machine language or machine and then camel was introduced 
as the categorical abstract machine language so there's no connection to ml as 
in meta language it's a right so that ml how funny yeah there is a connection i 
believe uh but uh another way of explaining the name is categorical abstract 
machine language interesting but i think they they like that because it had 
both ml and this other mathematical uh interpretation right right and so they 
actually you know implemented this uh abstract machine uh derived from these 
categorical equations but it was from an engineering point of view it didn't 
work very well wasn't performing as well as they would like and so they fell 
back at inria they had their own list uh that had been developed at lisp uh by 
inria researchers it's called lulisp uh and even spun off into a company but 
the lulisp people had uh developed infrastructure such as a runtime system with 
garbage collection and a uh kind of low-level abstract machine uh into which 
they compiled lisp and uh so after the the categorical abstract machine turned 
out to be not so good from an engineering standpoint they adopted the lisp 
infrastructure and uh translated the camel surface language into the uh lisp 
abstract machine and ran it on the lulisp operating system uh lulisp runtime 
system mm-hmm and um that was much better and um that was much better and um 
was considered a serious thing because it was commercial being commercialized 
mm-hmm better do with things like france lisp and and things like that at the 
time various uh interlisp uh france lisp uh lulisp and um um uh but then a guy 
named xavi lewar arrived as a young fresh researcher and he was a kind of 
wizard programmer and he uh implemented a uh his own implementation of camel 
which he called camel special light and because it was much more lightweight 
and uh accessible if you like and it beat the pants off of the lulisp 
implementation in terms of performance and so he became the kind of lead 
developer as camel evolved and he worked at did some research at the language 
level and also uh heroic work on the on the implementation and that's the 
original origin and then later on a a phd student of dda ramey at inria uh as a 
phd project developed an object system on top of camel and they thought that 
was uh a neat opportunity for marketing because of the great popularity of 
object-oriented programming and so it became whole camel but it was a good 
experiment in the sense that the old camel programming community had an option 
of using the intrinsic uh functional facilities of old camel as a essentially 
an ml dialect or they could use the object-oriented extension and it turned out 
nobody used the object-oriented extension and whether that's because it wasn't 
a really good object-oriented extension or because the functional model beats 
the object-oriented model which is my preferred explanation and so what did you 
you were working on an sml implementation at the time what did that compiler 
look like in right so we started uh and rappel arrived at princeton in early 
1986 and we got together fairly quickly after that and decided to build a 
compiler and um uh i knew the type system i had implemented uh similar stuff 
for the hope language and uh so i knew how to write the type checker and type 
inference and things of that sort and i had my ideas about the module system 
and how to implement that so i i took the front end where type checking type 
inference and module stuff was uh taken care of and uh andrew uh took the back 
end and the interface between those was essentially just lambda calculus there 
was a intermediate language produced by the front end which was untyped lambda 
calculus and then andrew wrote a optimization phase and uh code generation and 
built a runtime system with a a fairly straightforward copy garbage collector 
and the runtime system was written in c but one of the objectives uh from the 
beginning was that we had some a point to prove which was that ml was a good 
language for writing a compiler because a compiler is basically a symbolic 
processing process mm-hmm so a language that's good at symbolic processing like 
ml should be a good language for writing a compiler and so everything was 
written in quite quickly students at princeton produce a ml version of lex and 
an ml version of yak black and i i wrote the first lexers and parsers just you 
know by hand um but uh fairly soon we replaced those by generated lexers and 
parsers tools and um um so those tools probably came along in about 1987 uh and 
uh andrew had a number of students uh and we had some joint um kind of postdoc 
workers that were employed as summer interns at bell labs and or visitors at 
bell labs who worked on uh you know fairly hardcore compiler issues and of 
course uh there are interesting different problems for a compilation in a 
lambda calculus based language with true first class functions in comparison 
with fortran pascal c etc that's really great right stuff and uh there were 
also technical problems introduced by object-oriented programming like if you 
wanted to be able to be able to c plus plus compiler or something of that sort 
which uh we're not unconnected with functional programming because 
object-oriented programming is just one way of bolting on higher order features 
to a imperative language and objects and classes and so on are basically higher 
order things as they're uh elaborations of uh function closures right right 
anyway uh so uh andrew and his his students wrote a whole series of important 
papers about uh techniques for optimizing uh functional uh programs and of 
course there were other communities there was the haskell community that came 
along in the late 80s um and they were interested in the more doctrine so ml is 
a functional language in that functions of first class um which is as far as 
i'm concerned the main idea the big idea then there's uh if you take the lambda 
calculus or combinatorial logic seriously there's the issue of order of 
evaluation or alcohol 60 if you like mm-hmm and alcohol 60 and um so the the 
phenomena there is that you're compiling into a language that supports uh say 
lazy evaluation which is essentially called by name plus memorization right 
right and that was a hot topic in the mid 1970s there was a lot going on there 
was uh uh uh friedman and wise and uh ashcroft and wage and uh henderson and 
morris and there was a bunch of papers um occurring around 1975. and it's 
remarkable to the degree to which strict call by value semantics have just 
essentially worn out in nearly every major program well that's because um lazy 
evaluation is a nice piece of magical machinery um that you can do some really 
neat stuff with right the the applicability where they are big wins is rather 
narrow and uh so if you want to do you know series larger systems programming 
and you have lazy value operation you have to turn it off right right around it 
to get the kind of efficient so it's uh it's one of my principles in terms of 
language design is that magical things turn out to be things to avoid you don't 
want too much magic in your language now ml has the magic of automatic type 
inference and i think overall that's a clear win but from the experience of the 
haskell community where they introduce compiler pragmas to turn off laser 
evaluation and that sort of thing um so the idea is there's a trade-off they 
said we'll have lazy evaluation which we love and you can do all these 
interesting tricky things uh which i did earlier back in edinburgh working on 
the stream processing stuff so some of the big examples of cute things you can 
do with lazy evaluation geocon and i developed in our work at edinburgh but in 
return you you need to have purity as one of the trade-offs ml has impurity it 
has side effects it has variables or reference values that can be updated and 
mutated and arrays in standard ml and uh we don't have a very theoretically 
sophisticated way of explaining that it's just part of the semantics of the 
language allows you to do these side effects and in real life ml programming 
you tend to try to avoid those right programming a you know 99 percent 
functional style but in uh haskell that tentative purity is uh which is 
necessary it's going to have lazy evaluation because lazy evaluation makes it 
hard to tell when things are going to happen things that happen change the 
state it's more important to know when they're going to happen right right 
anyway uh so they they have lazy evaluation and they have purity except that uh 
in the real world you need some kind of state and so they introduce monads with 
monad various monads and they have them it's set so a haskell program is in 
some sense uh describing how to construct a monad it's sort of like can you 
know about continuation passing style right right but there the the programming 
model is that the what a program does is construct a continuation in fact the 
continuation representing the whole program and in um haskell you construct a 
monad representing the action of the whole program and then at the end you fire 
off that monad and uh compute the new state and that firing off the monad is a 
piece of extra magic right unsafe uh what is it called unsafe something other 
there's a magic operation for firing off the monad that you built right right 
anyway so i as you can tell i am happy with the impure slightly theoretically 
embarrassing situation in ml well and so the impurity is represented really 
just by those two type operators there's a reference type operator if you avoid 
the ref the ref type and the array type you're in a pure functional language 
exactly exactly and so other than modules after some of the initial sml 
standardization efforts there haven't been too many changes right in between 
them right so uh as i said we started in 86 and by summer of 87 we actually had 
a system that bootstrapped itself just barely made it to the bootstrapping 
milestone because we were using a kind of flaky prototype implementation called 
edinburgh standard ml which was this earlier system that had been modified to 
incorporate a certain number of ml features in early implementation in the 
module system etc and it was not robust but it got it fortunately it got us to 
the point where we could bootstrap our own compiler and that happened in in the 
spring of 87 and from then on we just had uh continuing work on these uh 
optimization techniques and uh i went through about three or four successive 
implementations of the module system and i'm contemplating a fifth right now uh 
but uh and then uh so andrew and his students published a bunch of papers we 
published a couple of papers describing the system as a whole and andrew and 
his students published a string of papers having to do with things like closure 
conversion how to represent closures register allocation things of that's right 
um specialized to the context of ml and uh uh in the mid to late late 90s and 
into the 2000s uh two main things happened one was um uh the flint group at 
with zong xiao at yale do you know do you know this group so they zong xiao was 
a phd student of andrews and he went and got a job at yale and he built built 
up a research group and they were collaborators with on standard ml of new 
jersey and their big project was to so as i mentioned earlier the interface 
between the front end and the back end and the back end originally was just a 
really straightforward untyped lambda calculus because there's this uh i guess 
it's the curry there's church and curry you can look up church and curry and 
they're different attitudes to what what the types role is in the language 
whether say type lambda calculus you do the type checking and then you throw 
away the types and you just execute the lambda calculus that's essentially the 
i think that's the curry's approach as opposed to the church approach which is 
the types are really there so the initial approach was the do the type checking 
throw away the types compile the lambda calculus and uh the flint group wanted 
to show that there was uh benefit from keeping the types and trying to exploit 
the types for various optimizations yeah mainly telling giving you more 
information about the representation of things machine representation and 
whether arguments are going to be passed in registers or on the stack or 
somehow uh as part of the continuation closure or something and uh so they 
pursued in a in this flint project at yale the idea of uh and because they we 
had modules which are kind of higher order types involve higher order types 
they used a fancy higher order version of the type lambda calculus called f 
omega i didn't heard of f omega but it's it's kind of the canonical higher 
order type lambda calculus where you have not only types but type functions 
type operators as uh as parameters and uh so you needed this higher order stuff 
in order to model uh length the uh module system which was kind of a module 
level lambda calculus uh a functional language and uh so on the static side you 
had to deal with uh higher order type constructs so they they developed their f 
omega based intermediate representation replacing the plain untyped lambda 
calculus that was used before confusingly using the same name for it p lambda 
uh and uh and uh they developed various optimizations and and a full kind of 
middle end with a series of uh uh optimizations uh uh some of which were fairly 
conventional some of which were were um special to this in trying to exploit 
the types and uh uh uh uh uh made somewhat more complicated by the way they 
implemented the this higher order type system this f omega like type system um 
and uh you know this is started in the early 90s and so you had the the kind of 
cycles and memory available for the technology of that era and they found that 
uh uh uh the compiler optimization computations they need to perform were 
expensive and so they made things more complicated in order to optimize uh for 
the technology and that's another theme you you find if you have a system that 
lasts long enough and of course this is in the middle of the uh more's law 
exponential race so um decisions that are made in the 1990s uh to save space or 
or time may not be the best decisions 30 years later yeah so that's one of the 
things i'm thinking about working on so to lead in i would love to maybe shift 
to that right now so i when i think about something like the module system in 
sml i'm also thinking about um other forms of you know higher order computing 
in c plus plus for example the template system is sort of like this pure 
functional language on top of the base language that's sort of different and 
separate may i have no idea because i don't talk to even when we were two doors 
down the hall uh but uh it seems to me that there there may have been some 
inspiration from the module system that led to the template system in c plus 
plus and so what do you think about having this higher ordered part of the 
language be such a fundamentally separate part of the language as opposed to 
you know well i view it as a fairly integral part myself and uh there is a 
choice in fact different implementations of standard ml uh take different 
approaches uh if you view the module system as simple simply first order that 
is not a full functional language of modules but just the first order language 
of models you can get away with treating it kind of like c plus plus templates 
or essentially an elaborate macro system you can essentially eliminate that 
stuff and then compile what you get after eliminating that and um the milton 
compiler which is an alternative implementation of standard ml takes that 
approach so they get rid of polymorphism they get rid of the module system and 
then they have a simpler type system to work it with and and it also requires 
them to do whole whole whole program uh compilation uh so if you're willing to 
take the hit of uh of doing whole program compilation and you restrict your 
view of the module system as being first order you can get away with treating 
the module system as a kind of macro level uh part of the language and uh uh uh 
so you can generate a language which is just sort of tight and functional sure 
tight um and um and with whole program analysis there's other things uh 
optimizations that become available uh so milton kind of went all out toward uh 
uh gaining performance optimal performance uh and they win some of the times uh 
not all the time uh and uh but uh i was interested in uh pursuing the model of 
uh the module system as a functional language including higher order functions 
so uh i spent a lot of time thinking and and working on uh first class functors 
or uh you have you have structures which are the basic modules which are just 
encapsulated pieces of environment if you like but both static and dynamic and 
uh then you have these functors which are functions over those those things and 
then you can the higher order things would be functors over functors or 
functors producing functors etc now my model handles that fine but uh it 
removes the or at least makes things much much more difficult if you wanted to 
pre-process away the module system and so what is that what do you what would 
you what would you like to change you've got we've got the gap between the 
module system as it stands today and sml and then where you would like to take 
things in uh uh nothing really drastic there are a couple features that i think 
were mistakes for instance we have a special declaration if you have a module 
or structure s you can declare open s and essentially what that does is dumps 
all the bindings inside the module s into the current environment environment 
and you can say open a b c d e f g you know a whole bunch of things and we used 
to do that a lot in the early days but it turns out to be bad software 
engineering in a concrete way in that you have a kind of polluted namespace and 
given the the name food you don't know which module it came from if you have a 
whole bunch of at the beginning of your your module you open a whole bunch of 
the stuff so anyway uh so i'd like to just get rid of this open declaration and 
get rid of it and we've come to over the years essentially eliminated from our 
own code generally by just introducing a one character abbreviation for some 
module that we would have opened in so it can say s dot foo instead of simply 
foo right do you think that hurts the extensibility at all like if you were to 
say have i don't know my list as a part of your code base that overrides the 
default list where you could open the list module and then you know override 
some things in there but yeah the problem is that if you open a module you may 
be accidentally overriding things that you didn't mean to override because the 
module you're opening might have 30 components and now you've possibly 
overridden anything whose name clashes with those 30 components so it improved 
it's a it's a hygiene thing better hygiene namespace hygiene if you like and 
there's other minor things like because of an edinburgh local practice in pop 
two it was possible to declare new infix operators in with a given binding 
power priority pressure precedence and this is a bad idea just in general in 
language of science so i i want to get rid of that um and um uh you know a few 
cleanups like that of features that turned out over the over the year and there 
that we had a a kind of uh partial and reluctant revision of the language in 
1997 so the original book was published at mit press by 1990 and then in 1997 
uh four of the principles rob milner and his student uh and bob harper from cmu 
and myself happen to be in cambridge for a a research program at the newton 
institute and so we started meeting and and discussing how how to fix various 
problems that we've discovered in standard ml since 1990 uh except that there 
was sort of kind of uh the radicals and the conservatives and conservatives 
kind of won out and um um so for instance um equality is a uh a perennial issue 
and what how do you treat equality uh you know and uh obviously quality of 
integers is pretty straightforward so it's kind of per types so equality of 
lists you know the lists may be to a billion element long so if you're 
comparing two lists that are a billion elements long it's going to take a long 
time so it's kind of not not a bounded fixed expense involves recursion if 
there's recursive types involved and so uh the mistake we made originally was 
extending polymorphism to handle equality so we introduced a special kind of 
polymorphic type variable called an equality variable which had tick tick a as 
its notation double tick at the beginning hyphen and uh these variables could 
only be instantiated by types uh that supported equality and so the notion of a 
type that supports equality is a kind of generic notion uh at least 
conservatively speaking because um certain primitive types like int has an 
equality string has an equality which compares character by character on the 
string and uh data types like list have an equality even though it's uh you 
have to generate a recursive function a particular type so this kind of generic 
uh notion of equality and so the polymorphic variables would range only over 
types that supported this generic equality and therefore you could apply 
equality to the values of the types even though the types were unknown and so 
so to implement such an idea there are two approaches uh the approach one 
approach is that implicitly anytime you parameterize over an equality type uh 
you silently pass an equality operation in as well and that leads to the notion 
of the notion of classes in haskell what they call classes technology i believe 
was because they were trying to borrow on the hype of object-oriented 
programming with classes right on the hype right anyway uh so uh so i don't 
like type classes in haskell and this is an example of a type class if you 
implement it that way it turns out that there's a tricky implementation that 
doesn't involve passing implicit uh equality operators which is that uh if a 
type is one of these generically you know one of these types that supports 
generic quality then we have enough it just so happens that we have enough 
information for the purpose of garbage collection in our runtime 
representations so you can interpret the runtime representations to do equality 
that's how we implement it we both we what uh one of andrew's graduate students 
did the type class style implementation just to show that it could be done but 
uh anyway so that's a kind of hack and it's kind of uh it works uh without 
having an actual type class like mechanism with implicit uh operators being 
passed um but it works because of a uh accidental that's not quite hello hi not 
quite okay right okay bye bye we can close it we can close up here if you want 
on uh i see we're getting it you know about our yeah so in terms of uh yeah let 
me try to summarize so there's all kinds of details i could go into sure the ml 
story and uh um the big thing is that in the functional programming community 
uh and some of this uh migrated a little bit to the object-oriented pro 
community because there are some common commonalities uh dealing with higher 
order stuff and dealing with types uh too but um um if you look at you know 
pascal c uh etc then um essentially you know python if you want to write python 
compiler or whatever this uh well lisp has its own peculiarities because of 
dynamic binding sure and so on and so on and dynamic typing as well um so 
there's type you know there's there's javascript and there's typescript uh 
anyway um but because of the computational model that based on the lambda 
calculus and the presence of higher order functions and uh also opportunities 
presented by static typing um there's some interesting um there's some 
interesting compilation programs problems that uh come up in that context that 
are different from the mainstream you know high performance computing and 
fortran or something or even c compilers or go compilers or what have you uh 
and um um so there's been an interesting interaction and of course uh there's a 
different kind of involvement of theory in these functional programming 
languages and particularly related to their type systems uh but also 
historically to the uh order of evaluation issue and that sort of thing uh so 
there's a kind of different line of things that i have never gone to a pldi 
conference i've been working on a compiler for many years but uh i i submitted 
one paper to pldi but it wasn't admitted it wasn't accepted because um the 
program committee had no idea what i was talking about probably um this was a 
when you have these algebraic data types uh and you do pattern matching over 
algebraic data types to do decomposition and dispatch at the same time uh that 
process can be automated so there's a notion of a match compiler pattern match 
compiler why is the code doing pattern matching and most many functions in in 
language like ml or haskell involve uh some kind of uh non-trivial pattern 
match and so writing a match compiler is kind of part of implementing a a 
functional language with algebraic data types and so i back in around 1980 81 i 
was thinking about that and i wrote a paper later with a summer intern and 
submitted to pldi but they had no idea what a match compiler would be useful 
didn't relate to you know conventional compilation technology yeah i think it 
reminds me of some of what they have in uh lvm for some peepholes when doing 
instruction selection and some of these small transforms that you know you 
could sort of describe transforms in a higher level description language which 
is interesting yeah yeah we have a current issue in standard ml because i have 
one continuing collaborator john reppi at university of chicago formerly bell 
labs and um um he recently you know facing you know we we did a lot of 
architectures back in the 90s mainly so we had a kind of architecture 
independent code generation framework called ml risk and we had a bunch of you 
know we uh spark uh mips um alpha uh ibm power blah blah blah so we had a whole 
bunch of and eventually x86 as well um but um we had this technology for 
writing uh code generators for risk architectures which uh was kind of uh a big 
thing in the 90s when there were still a lot of people selling risk 
architectures but and then it kind of they kind of died out and everything 
everything became x86 and then now there's arm you know big thing uh especially 
if you're using apple computers uh need an arm code generator so john um um 
decided and and john was the one who would have to write a new new code 
generator i've never written a code generator i could but i'm not it'd be a big 
big push for me right um and john decided he would just take an off the shelf 
solution and adopt llvm not to be straightforward for instance uh llvm off the 
shelf doesn't support the calling convention that we use in standard ml big 
things about the calling convention is that uh uh we don't have use a stack uh 
and instead you have essentially continuation closures that are play the role 
of the stack frame and this continuation closures are heap allocated and 
garbage collected and that makes certain things very easy like um concurrency 
or you know multiple threads uh are very easy when they don't have to share a 
stack and move stuff in and out of the stack closures allocated in the heap and 
uh llvm doesn't know about that sort of thing and so details the calling 
convention have to be hacked in to the generic llvm and then there's strange 
bugs that never occur in mainstream uses of llvm that turn up when we when john 
uh tried to apply so it turned out to be a multi-year non-trivial effort to get 
a llvm and of course then the the llvm community and who's ever in charge of 
that is not interested in and you know they probably don't know anything about 
the existence of ml and they're not interested in uh upstreaming uh changes to 
support us and it's you know hundred and some thousand year lines of uh c plus 
plus code so now the compiler is mostly c plus plus and don't program in c plus 
plus anyway so uh um john with great effort has come up with uh an x86 and an 
and an arm uh pair of code code code code generators based on and uh so this uh 
llvm code gets integrated into the runtime system so the compiler produces some 
kind of serialized piece of data and it gets passed over the runtime system and 
uh uses input to the llvm c plus plus code and it has to be stored again into 
the so in the run so the runtime system has passed some sort of thunk maybe 
with some lvm byte code and then that gets executed as opposed to it's just a 
bunch of bytes right it's not it's a uh because the runtime system doesn't know 
what a thunk is it just knows bytes right so it's a pic it's a pickle piece of 
llvm compatible input right so that i was saying it's they passed some llvm 
byte code some you know partially compiled as the the bytes format format of 
the llvm ir and then gets executed you know you know probably um over a dozen 
passes of optimization before you get to the stuff that's actually passed to 
the llvm and then presumably the llvm does its own stuff um and so exactly so 
this kind of violates one of our original principles when andrew and i started 
working on the compiler to show that you didn't need some other language or we 
didn't want to take off the shelf technology and stick it in uh we just wanted 
to have a pure sml solution i would i would really like to get back to that 
interesting well i think we're we're at about an hour and a half so i think we 
can probably wrap it up here but right so if you have any further questions as 
you try to digest this uh just let me know yeah i certainly will i will uh 
thank you so much for for taking the time i'm gonna stop the recording here but 
i appreciate you very much for for taking the time to to talk with me about 
this you're welcome yeah yeah it's fun
```
