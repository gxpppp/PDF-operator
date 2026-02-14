from app.core.pdf_engine.engine import PdfEngine
from app.schemas.pdf import (
    PdfMergeRequest,
    PdfSplitRequest,
    WatermarkRequest,
    CompressRequest,
)
from typing import List, Dict, Any, Optional
import os


class PdfService:
    def __init__(self):
        self.engine = PdfEngine()
    
    async def get_metadata(self, file_path: str) -> Dict[str, Any]:
        return await self.engine.get_metadata(file_path)
    
    async def merge_pdfs(
        self,
        input_paths: List[str],
        output_path: str
    ) -> str:
        for path in input_paths:
            if not os.path.exists(path):
                raise FileNotFoundError(f"File not found: {path}")
        
        return await self.engine.merge(input_paths, output_path)
    
    async def split_pdf(
        self,
        input_path: str,
        output_dir: str,
        mode: str = "all",
        page_ranges: Optional[str] = None,
        pages_per_file: int = 1
    ) -> List[str]:
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"File not found: {input_path}")
        
        os.makedirs(output_dir, exist_ok=True)
        
        return await self.engine.split(
            input_path,
            output_dir,
            mode,
            page_ranges,
            pages_per_file
        )
    
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
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"File not found: {input_path}")
        
        return await self.engine.add_watermark(
            input_path,
            output_path,
            watermark_type,
            watermark_text,
            watermark_image,
            font_size,
            font_color,
            opacity,
            rotation,
            position
        )
    
    async def compress_pdf(
        self,
        input_path: str,
        output_path: str,
        level: str = "medium"
    ) -> str:
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"File not found: {input_path}")
        
        return await self.engine.compress(input_path, output_path, level)
    
    async def extract_text(self, input_path: str) -> str:
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"File not found: {input_path}")
        
        return await self.engine.extract_text(input_path)
    
    async def extract_images(
        self,
        input_path: str,
        output_dir: str
    ) -> List[str]:
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"File not found: {input_path}")
        
        os.makedirs(output_dir, exist_ok=True)
        
        return await self.engine.extract_images(input_path, output_dir)
    
    async def extract_tables(self, input_path: str) -> List[List[List[str]]]:
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"File not found: {input_path}")
        
        return await self.engine.extract_tables(input_path)
    
    async def rotate_pages(
        self,
        input_path: str,
        output_path: str,
        pages: List[int],
        degrees: int = 90
    ) -> str:
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"File not found: {input_path}")
        
        return await self.engine.rotate_pages(input_path, output_path, pages, degrees)
