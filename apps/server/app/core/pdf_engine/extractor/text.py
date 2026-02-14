import fitz
from typing import List, Dict, Any
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=4)


class TextExtractor:
    @staticmethod
    async def extract_all(file_path: str) -> str:
        def _extract():
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _extract)
    
    @staticmethod
    async def extract_page(file_path: str, page_number: int) -> str:
        def _extract():
            doc = fitz.open(file_path)
            if 1 <= page_number <= doc.page_count:
                text = doc[page_number - 1].get_text()
            else:
                text = ""
            doc.close()
            return text
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _extract)
    
    @staticmethod
    async def extract_with_position(file_path: str) -> List[Dict]:
        def _extract():
            doc = fitz.open(file_path)
            results = []
            
            for page_num, page in enumerate(doc):
                blocks = page.get_text("dict")["blocks"]
                for block in blocks:
                    if "lines" in block:
                        for line in block["lines"]:
                            for span in line["spans"]:
                                results.append({
                                    "page": page_num + 1,
                                    "text": span["text"],
                                    "bbox": span["bbox"],
                                    "font": span["font"],
                                    "size": span["size"],
                                })
            
            doc.close()
            return results
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _extract)


class ImageExtractor:
    @staticmethod
    async def extract_all(file_path: str, output_dir: str) -> List[str]:
        def _extract():
            doc = fitz.open(file_path)
            output_files = []
            
            for page_num, page in enumerate(doc):
                images = page.get_images()
                for img_index, img in enumerate(images):
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_data = base_image["image"]
                    image_ext = base_image["ext"]
                    
                    output_file = f"{output_dir}/page_{page_num+1}_img_{img_index+1}.{image_ext}"
                    with open(output_file, "wb") as f:
                        f.write(image_data)
                    
                    output_files.append(output_file)
            
            doc.close()
            return output_files
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _extract)


class TableExtractor:
    @staticmethod
    async def extract_all(file_path: str) -> List[List[List[str]]]:
        def _extract():
            try:
                import pdfplumber
                
                tables = []
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        page_tables = page.extract_tables()
                        tables.extend(page_tables)
                
                return tables
            except ImportError:
                return []
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _extract)


class MetadataExtractor:
    @staticmethod
    async def extract(file_path: str) -> Dict[str, Any]:
        def _extract():
            import os
            
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
        return await loop.run_in_executor(executor, _extract)
