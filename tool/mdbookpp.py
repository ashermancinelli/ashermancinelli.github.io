import sys
import json
import sys
import json
from typing import Any, Dict, List, Optional
from abc import ABC, abstractmethod


class MdBookPreprocessor(ABC):
    """Base class for mdBook preprocessors that handle the JSON recursion."""

    def process_content(self, content: str) -> str:
        return content

    def process_chapter(self, chapter: Dict[str, Any]) -> None:
        # Process the content if it exists
        if "Chapter" in chapter:
            chapter_data = chapter["Chapter"]
            if "content" in chapter_data:
                chapter_data["content"] = self.process_content(chapter_data["content"])

            # Recursively process sub-items
            if "sub_items" in chapter_data:
                for sub_item in chapter_data["sub_items"]:
                    self.process_chapter(sub_item)

    def process_book(self, book: Dict[str, Any]) -> Dict[str, Any]:
        if "sections" in book:
            for section in book["sections"]:
                self.process_chapter(section)
        return book

    def run(self) -> int:
        """
        Main entry point for the preprocessor.

        Returns:
            Exit code (0 for success)
        """
        # Handle the 'supports' command
        if len(sys.argv) > 1:
            if sys.argv[1] == "supports":
                return 0

        context, book = json.load(sys.stdin)
        processed_book = self.process_book(book)
        json.dump(processed_book, sys.stdout)
        return 0
