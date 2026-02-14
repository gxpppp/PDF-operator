import fitz
import pikepdf
import pdfplumber
from typing import List, Optional, Dict, Any
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor
from loguru import logger

executor = ThreadPoolExecutor(max_workers=4)


class PdfEngine:
    def __init__(self):
        pass
    
    async def get_metadata(self, file_path: str) -> Dict[str, Any]:
        def _get_metadata():
            doc = fitz.open(file_path)
            metadata = doc.metadata
            return {
                "title": metadata.get("title", ""),
                "author": metadata.get("author", ""),
                "subject": metadata.get("subject", ""),
                "keywords": metadata.get("keywords", ""),
                "creator": metadata.get("creator", ""),
                "producer": metadata.get("producer", ""),
                "creation_date": metadata.get("creationDate", ""),
                "modification_date": metadata.get("modDate", ""),
                "page_count": doc.page_count,
                "file_size": os.path.getsize(file_path),
            }
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _get_metadata)
    
    async def merge(self, input_paths: List[str], output_path: str) -> str:
        def _merge():
            result = fitz.open()
            for path in input_paths:
                doc = fitz.open(path)
                result.insert_pdf(doc)
                doc.close()
            result.save(output_path)
            result.close()
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _merge)
    
    async def split(
        self,
        input_path: str,
        output_dir: str,
        mode: str = "all",
        page_ranges: Optional[str] = None,
        pages_per_file: int = 1
    ) -> List[str]:
        def _split():
            doc = fitz.open(input_path)
            output_files = []
            
            if mode == "all":
                for i in range(doc.page_count):
                    new_doc = fitz.open()
                    new_doc.insert_pdf(doc, from_page=i, to_page=i)
                    output_file = os.path.join(output_dir, f"page_{i+1}.pdf")
                    new_doc.save(output_file)
                    new_doc.close()
                    output_files.append(output_file)
            
            elif mode == "range" and page_ranges:
                ranges = self._parse_page_ranges(page_ranges)
                for i, (start, end) in enumerate(ranges):
                    new_doc = fitz.open()
                    new_doc.insert_pdf(doc, from_page=start-1, to_page=end-1)
                    output_file = os.path.join(output_dir, f"range_{i+1}.pdf")
                    new_doc.save(output_file)
                    new_doc.close()
                    output_files.append(output_file)
            
            elif mode == "pages":
                total_pages = doc.page_count
                file_index = 1
                for start in range(0, total_pages, pages_per_file):
                    end = min(start + pages_per_file, total_pages)
                    new_doc = fitz.open()
                    new_doc.insert_pdf(doc, from_page=start, to_page=end-1)
                    output_file = os.path.join(output_dir, f"part_{file_index}.pdf")
                    new_doc.save(output_file)
                    new_doc.close()
                    output_files.append(output_file)
                    file_index += 1
            
            doc.close()
            return output_files
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _split)
    
    def _parse_page_ranges(self, ranges_str: str) -> List[tuple]:
        ranges = []
        for part in ranges_str.split(','):
            part = part.strip()
            if '-' in part:
                start, end = part.split('-')
                ranges.append((int(start), int(end)))
            else:
                page = int(part)
                ranges.append((page, page))
        return ranges
    
    async def rotate_pages(
        self,
        input_path: str,
        output_path: str,
        pages: List[int],
        degrees: int = 90
    ) -> str:
        def _rotate():
            doc = fitz.open(input_path)
            for page_num in pages:
                if 1 <= page_num <= doc.page_count:
                    page = doc[page_num - 1]
                    page.set_rotation((page.rotation + degrees) % 360)
            doc.save(output_path)
            doc.close()
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _rotate)
    
    async def add_watermark(
        self,
        input_path: str,
        output_path: str,
        watermark_type: str,
        watermark_text: Optional[str] = None,
        watermark_image: Optional[str] = None,
        font_size: int = 48,
        font_color: str = "#CCCCCC",
        opacity: float = 0.3,
        rotation: int = -45,
        position: str = "center"
    ) -> str:
        def _add_watermark():
            doc = fitz.open(input_path)
            
            for page in doc:
                rect = page.rect
                
                if watermark_type == "text" and watermark_text:
                    text_point = fitz.Point(rect.width / 2, rect.height / 2)
                    
                    shape = page.new_shape()
                    shape.insert_text(
                        text_point,
                        watermark_text,
                        fontsize=font_size,
                        color=self._hex_to_rgb(font_color),
                        rotate=rotation
                    )
                    shape.commit()
                
                elif watermark_type == "image" and watermark_image:
                    img_rect = fitz.Rect(
                        rect.width / 4,
                        rect.height / 4,
                        rect.width * 3 / 4,
                        rect.height * 3 / 4
                    )
                    page.insert_image(img_rect, filename=watermark_image)
            
            doc.save(output_path)
            doc.close()
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _add_watermark)
    
    def _hex_to_rgb(self, hex_color: str) -> tuple:
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) / 255 for i in (0, 2, 4))
    
    async def compress(
        self,
        input_path: str,
        output_path: str,
        level: str = "medium"
    ) -> str:
        def _compress():
            quality_map = {
                "low": 50,
                "medium": 70,
                "high": 90
            }
            quality = quality_map.get(level, 70)
            
            doc = fitz.open(input_path)
            
            for page in doc:
                images = page.get_images()
                for img in images:
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    
                    if base_image["ext"] in ["jpeg", "jpg", "png"]:
                        from PIL import Image
                        import io
                        
                        image_data = base_image["image"]
                        pil_image = Image.open(io.BytesIO(image_data))
                        
                        output_buffer = io.BytesIO()
                        pil_image.save(output_buffer, format="JPEG", quality=quality)
                        
                        doc.update_object(xref, doc.xref_object(xref))
            
            doc.save(output_path, garbage=4, deflate=True)
            doc.close()
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _compress)
    
    async def extract_text(self, input_path: str) -> str:
        def _extract():
            doc = fitz.open(input_path)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _extract)
    
    async def extract_images(self, input_path: str, output_dir: str) -> List[str]:
        def _extract():
            doc = fitz.open(input_path)
            output_files = []
            
            for page_num, page in enumerate(doc):
                images = page.get_images()
                for img_index, img in enumerate(images):
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_data = base_image["image"]
                    image_ext = base_image["ext"]
                    
                    output_file = os.path.join(
                        output_dir,
                        f"page_{page_num+1}_img_{img_index+1}.{image_ext}"
                    )
                    
                    with open(output_file, "wb") as f:
                        f.write(image_data)
                    
                    output_files.append(output_file)
            
            doc.close()
            return output_files
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _extract)
    
    async def extract_tables(self, input_path: str) -> List[List[List[str]]]:
        def _extract():
            tables = []
            with pdfplumber.open(input_path) as pdf:
                for page in pdf.pages:
                    page_tables = page.extract_tables()
                    tables.extend(page_tables)
            return tables
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _extract)
    
    async def get_page_info(self, input_path: str) -> List[Dict]:
        def _get_info():
            doc = fitz.open(input_path)
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
        return await loop.run_in_executor(executor, _get_info)
    
    async def render_page(
        self,
        input_path: str,
        page_number: int,
        zoom: float = 1.0,
        rotation: int = 0
    ) -> bytes:
        def _render():
            doc = fitz.open(input_path)
            page = doc[page_number - 1]
            
            mat = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=mat, rotate=rotation)
            
            img_data = pix.tobytes("png")
            doc.close()
            return img_data
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _render)
