from dataclasses import dataclass

@dataclass
class Bib:
    author: str
    title: str
    url: str
    year: int | None = None
    subtext: str | None = None


Backus78 = Bib(
    author="John Backus",
    title="Can Programming Be Liberated from the von Neumann Style?",
    year=1978,
    url="https://dl.acm.org/doi/10.1145/359576.359579",
)

Boole54 = Bib(
    author="George Boole",
    title="An Investigation of the Laws of Thought",
    year=1954,
    url="https://www.gutenberg.org/files/15114/15114-pdf.pdf",
)

Ong82 = Bib(
    author="Walter J. Ong",
    title="Orality and Literacy: The Technologizing of the Word",
    url="https://www.taylorfrancis.com/books/mono/10.4324/9780203103258/orality-literacy-walter-ong-john-hartley-john-hartley",
    year=1982,
    subtext="[pdf](https://monoskop.org/images/d/db/Ong_Walter_J_Orality_and_Literacy_2nd_ed.pdf)",
)

Fettes23 = Bib(
    author="Caleb Fettes",
    title="Book Review: Orality and Literacy: The Technologizing of the Word",
    url="https://forum.effectivealtruism.org/posts/ZtpPSnnZuheEXxPwa/book-review-orality-and-literacy-the-technologizing-of-the",
    year=2023,
)

Iverson79 = Bib(
    author="Kenneth E. Iverson",
    title="Notation as a Tool of Thought",
    year=1979,
    url="https://dl.acm.org/doi/pdf/10.1145/1283920.1283935",
)

Knuth84 = Bib(
    author="Donald E. Knuth",
    title="Literate Programming",
    url="https://academic.oup.com/comjnl/article-abstract/27/2/97/343244",
    subtext="[pdf](https://www.cs.tufts.edu/~nr/cs257/archive/literate-programming/01-knuth-lp.pdf)",
    year=1984,
)

Perlis = Bib(
    author="Alan J. Perlis",
    title="Epigrams in Programming",
    url="https://www.cs.yale.edu/homes/perlis-alan/quotes.html",
)

Raymond99 = Bib(
    author="Eric S. Raymond",
    title="The Cathedral and the Bazaar",
    url="https://monoskop.org/images/e/e0/Raymond_Eric_S_The_Cathedral_and_the_Bazaar_rev_ed.pdf",
)

Sturgill12 = Bib(
    author="Joshua Sturgill",
    title="Review: Orality and Literacy by Walter J. Ong",
    url="https://circeinstitute.org/blog/2012-12-review-orality-and-literacy-by-walter-j-ong/",
)

Tao08 = Bib(
    author="Terence Tao",
    title="Use Good Notation",
    url="https://terrytao.wordpress.com/advice-on-writing-papers/use-good-notation/",
)

Whitehead11 = Bib(
    author="Alfred North Whitehead",
    title="An Introduction to Mathematics",
    url="https://archive.org/details/introductiontoma00whituoft",
)

refs = [
    Ong82,
    Backus78,
    Iverson79,
    Knuth84,
    Boole54,
    Whitehead11,
    Tao08,
    Perlis,
    Raymond99,
    Fettes23,
    Sturgill12,
]

def register(env):
    env.globals.update({
        "Ong82": Ong82,
        "Backus78": Backus78,
        "Iverson79": Iverson79,
        "Knuth84": Knuth84,
        "Boole54": Boole54,
        "Whitehead11": Whitehead11,
        "Tao08": Tao08,
        "Perlis": Perlis,
        "Raymond99": Raymond99,
        "Fettes23": Fettes23,
        "Sturgill12": Sturgill12,
        "refs": refs,
    })

    env.globals["author"] = lambda bib: bib.author
    env.globals["title"] = lambda bib: f"_{bib.title}_"
    def year(bib):
        if bib.year is not None:
            return bib.year
        return ""
    env.globals['year'] = year
