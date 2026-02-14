import fitz
from typing import List, Optional, Tuple
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=4)


class PdfSplitter:
    @staticmethod
    async def split_all(input_path: str, output_dir: str) -> List[str]:
        def _split():
            doc = fitz.open(input_path)
            output_files = []
            
            for i in range(doc.page_count):
                new_doc = fitz.open()
                new_doc.insert_pdf(doc, from_page=i, to_page=i)
                output_file = os.path.join(output_dir, f"page_{i+1}.pdf")
                new_doc.save(output_file)
                new_doc.close()
                output_files.append(output_file)
            
            doc.close()
            return output_files
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _split)
    
    @staticmethod
    async def split_by_range(
        input_path: str,
        output_dir: str,
        ranges: List[Tuple[int, int]]
    ) -> List[str]:
        def _split():
            doc = fitz.open(input_path)
            output_files = []
            
            for i, (start, end) in enumerate(ranges):
                new_doc = fitz.open()
                new_doc.insert_pdf(
                    doc,
                    from_page=start - 1,
                    to_page=end - 1
                )
                output_file = os.path.join(output_dir, f"range_{i+1}.pdf")
                new_doc.save(output_file)
                new_doc.close()
                output_files.append(output_file)
            
            doc.close()
            return output_files
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _split)
    
    @staticmethod
    async def split_by_count(
        input_path: str,
        output_dir: str,
        pages_per_file: int
    ) -> List[str]:
        def _split():
            doc = fitz.open(input_path)
            output_files = []
            total_pages = doc.page_count
            file_index = 1
            
            for start in range(0, total_pages, pages_per_file):
                end = min(start + pages_per_file, total_pages)
                new_doc = fitz.open()
                new_doc.insert_pdf(doc, from_page=start, to_page=end - 1)
                output_file = os.path.join(output_dir, f"part_{file_index}.pdf")
                new_doc.save(output_file)
                new_doc.close()
                output_files.append(output_file)
                file_index += 1
            
            doc.close()
            return output_files
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _split)
    
    @staticmethod
    async def extract_pages(
        input_path: str,
        output_path: str,
        pages: List[int]
    ) -> str:
        def _extract():
            doc = fitz.open(input_path)
            new_doc = fitz.open()
            
            for page_num in pages:
                if 1 <= page_num <= doc.page_count:
                    new_doc.insert_pdf(doc, from_page=page_num - 1, to_page=page_num - 1)
            
            new_doc.save(output_path)
            new_doc.close()
            doc.close()
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _extract)
