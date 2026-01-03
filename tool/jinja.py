#!/usr/bin/env python3
import json, sys
from pathlib import Path
from mdbookpp import MdBookPreprocessor
from jinja2 import Environment, FileSystemLoader, PackageLoader, select_autoescape

COOKIE = "<!-- %jinja% -->"

TOC = '''
~~~admonish tip title="Table of Contents"
<!-- toc -->
~~~
'''

class JinjaPP(MdBookPreprocessor):
    def root(self):
        assert self.context is not None
        proot = Path(self.context['root'])
        psrc = proot / self.context['config']['book']['src']
        return psrc

    def render(self, template):
        return template.render(
            TOC=TOC,
        )

    def process_content(self, book, chapter, content: str) -> str:
        if COOKIE not in content:
            return content

        r = self.root()
        c = chapter['path']
        chapter_path = r / c
        # sys.stderr.write(f'{r=} {c=} {chapter_path=}')
        assert chapter_path.exists()
        chapter_dir = chapter_path.parent
        # json.dump(self.context, sys.stderr, indent=4)
        # json.dump(chapter, sys.stderr, indent=4)
        loader = FileSystemLoader(chapter_dir)
        env = Environment(loader=loader)
        template = env.from_string(content)
        return self.render(template)


if __name__ == "__main__":
    JinjaPP().run()
