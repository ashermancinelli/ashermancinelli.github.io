#!/usr/bin/env python3
from mdbookpp import MdBookPreprocessor

TOC = '''
~~~admonish tip title="Table of Contents"
<!-- toc -->
~~~
'''

class DoNothingPP(MdBookPreprocessor):
    def process_content(self, content: str) -> str:
        return content.replace('{{ TOC }}', TOC)

if __name__ == "__main__":
    DoNothingPP().run()
