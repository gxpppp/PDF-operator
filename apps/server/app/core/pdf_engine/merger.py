import fitz
from typing import List
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=4)


class PdfMerger:
    @staticmethod
    async def merge(input_paths: List[str], output_path: str) -> str:
        def _merge():
            result = fitz.open()
            
            for path in input_paths:
                try:
                    doc = fitz.open(path)
                    result.insert_pdf(doc)
                    doc.close()
                except Exception as e:
                    print(f"Error merging {path}: {e}")
            
            result.save(output_path)
            result.close()
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _merge)
    
    @staticmethod
    async def merge_with_bookmarks(
        input_paths: List[str],
        output_path: str,
        bookmark_names: List[str] = None
    ) -> str:
        def _merge():
            result = fitz.open()
            
            for i, path in enumerate(input_paths):
                try:
                    doc = fitz.open(path)
                    start_page = result.page_count
                    result.insert_pdf(doc)
                    
                    if bookmark_names and i < len(bookmark_names):
                        result.set_page_text(
                            start_page,
                            bookmark_names[i]
                        )
                    
                    doc.close()
                except Exception as e:
                    print(f"Error merging {path}: {e}")
            
            result.save(output_path)
            result.close()
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _merge)
