#!/usr/bin/env python3
import json, sys
import importlib.util
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

    def load_registry(self, reg: Path, template):
        m = reg.stem
        spec = importlib.util.spec_from_file_location(m, reg)
        if spec is None:
            raise ImportError(f'Could not load jinja registry from {reg=}')
        mod = importlib.util.module_from_spec(spec)
        assert spec.loader is not None
        spec.loader.exec_module(mod)
        register = getattr(mod, 'register', None)
        if register is None:
            sys.stderr.write(str(dir(mod)))
            raise ImportError(f'jinja registry {reg=} has no register() function')
        register(template)


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
        reg = chapter_dir / 'jinja_registry.py'
        if reg.exists():
            self.load_registry(reg, template)
        new_content = template.render(
            TOC=TOC,
        )
        return new_content


if __name__ == "__main__":
    JinjaPP().run()
