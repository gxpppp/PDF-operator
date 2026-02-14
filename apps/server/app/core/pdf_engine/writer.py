import fitz
from typing import List, Dict, Any
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=4)


class PdfWriter:
    @staticmethod
    async def create_from_images(image_paths: List[str], output_path: str) -> str:
        def _write():
            doc = fitz.open()
            
            for img_path in image_paths:
                img_doc = fitz.open(img_path)
                rect = img_doc[0].rect
                pdf_bytes = img_doc.convert_to_pdf()
                img_doc.close()
                
                img_pdf = fitz.open("pdf", pdf_bytes)
                page = doc.new_page(width=rect.width, height=rect.height)
                page.show_pdf_page(rect, img_pdf, 0)
                img_pdf.close()
            
            doc.save(output_path)
            doc.close()
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _write)
    
    @staticmethod
    async def create_from_text(
        text: str,
        output_path: str,
        font_size: int = 12,
        page_size: tuple = (595, 842)
    ) -> str:
        def _write():
            doc = fitz.open()
            page = doc.new_page(width=page_size[0], height=page_size[1])
            
            text_writer = fitz.TextWriter(page.rect)
            text_writer.fill_textbox(
                fitz.Rect(50, 50, page_size[0] - 50, page_size[1] - 50),
                text,
                fontsize=font_size
            )
            text_writer.write_text(page)
            
            doc.save(output_path)
            doc.close()
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _write)
    
    @staticmethod
    async def add_page(
        file_path: str,
        output_path: str,
        width: float = 595,
        height: float = 842
    ) -> str:
        def _write():
            doc = fitz.open(file_path)
            doc.new_page(width=width, height=height)
            doc.save(output_path)
            doc.close()
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _write)
    
    @staticmethod
    async def insert_pages(
        source_path: str,
        target_path: str,
        output_path: str,
        position: int = -1,
        pages: List[int] = None
    ) -> str:
        def _write():
            source_doc = fitz.open(source_path)
            target_doc = fitz.open(target_path)
            
            if pages is None:
                pages = list(range(source_doc.page_count))
            
            if position < 0 or position > target_doc.page_count:
                position = target_doc.page_count
            
            for i, page_num in enumerate(pages):
                if 0 <= page_num < source_doc.page_count:
                    target_doc.insert_pdf(
                        source_doc,
                        from_page=page_num,
                        to_page=page_num,
                        start_at=position + i
                    )
            
            target_doc.save(output_path)
            source_doc.close()
            target_doc.close()
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _write)
    
    @staticmethod
    async def delete_pages(
        file_path: str,
        output_path: str,
        pages: List[int]
    ) -> str:
        def _write():
            doc = fitz.open(file_path)
            
            for page_num in sorted(pages, reverse=True):
                if 0 <= page_num < doc.page_count:
                    doc.delete_page(page_num)
            
            doc.save(output_path)
            doc.close()
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _write)
