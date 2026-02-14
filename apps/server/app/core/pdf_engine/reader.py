import fitz
from typing import List, Dict, Any, Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=4)


class PdfReader:
    @staticmethod
    async def get_page_count(file_path: str) -> int:
        def _read():
            doc = fitz.open(file_path)
            count = doc.page_count
            doc.close()
            return count
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _read)
    
    @staticmethod
    async def get_page_info(file_path: str) -> List[Dict]:
        def _read():
            doc = fitz.open(file_path)
            pages = []
            for i, page in enumerate(doc):
                pages.append({
                    "number": i + 1,
                    "width": page.rect.width,
                    "height": page.rect.height,
                    "rotation": page.rotation,
                })
            doc.close()
            return pages
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _read)
    
    @staticmethod
    async def get_text(file_path: str, page_number: Optional[int] = None) -> str:
        def _read():
            doc = fitz.open(file_path)
            if page_number is not None:
                if 1 <= page_number <= doc.page_count:
                    text = doc[page_number - 1].get_text()
                else:
                    text = ""
            else:
                text = ""
                for page in doc:
                    text += page.get_text()
            doc.close()
            return text
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _read)
    
    @staticmethod
    async def get_links(file_path: str) -> List[Dict]:
        def _read():
            doc = fitz.open(file_path)
            links = []
            for i, page in enumerate(doc):
                for link in page.get_links():
                    links.append({
                        "page": i + 1,
                        "rect": link["from"],
                        "uri": link.get("uri", ""),
                        "target_page": link.get("page", None)
                    })
            doc.close()
            return links
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _read)
    
    @staticmethod
    async def get_bookmarks(file_path: str) -> List[Dict]:
        def _read():
            doc = fitz.open(file_path)
            toc = doc.get_toc()
            bookmarks = []
            for item in toc:
                bookmarks.append({
                    "level": item[0],
                    "title": item[1],
                    "page": item[2]
                })
            doc.close()
            return bookmarks
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _read)
    
    @staticmethod
    async def render_page(
        file_path: str,
        page_number: int,
        zoom: float = 1.0,
        rotation: int = 0
    ) -> bytes:
        def _render():
            doc = fitz.open(file_path)
            if 1 <= page_number <= doc.page_count:
                page = doc[page_number - 1]
                mat = fitz.Matrix(zoom, zoom)
                pix = page.get_pixmap(matrix=mat, rotate=rotation)
                img_data = pix.tobytes("png")
            else:
                img_data = b""
            doc.close()
            return img_data
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _render)
