from typing import List, Optional, Callable
import os
import asyncio
from loguru import logger

from app.core.pdf_engine.engine import PdfEngine
from app.core.ocr_engine.engine import OcrEngine
from app.core.convert_engine.engine import ConvertEngine
from app.core.security_engine.engine import SecurityEngine


class BatchEngine:
    def __init__(self):
        self.pdf_engine = PdfEngine()
        self.ocr_engine = OcrEngine()
        self.convert_engine = ConvertEngine()
        self.security_engine = SecurityEngine()
    
    async def process(
        self,
        input_paths: List[str],
        operation: str,
        output_dir: str,
        output_format: Optional[str] = None,
        options: Optional[dict] = None,
        progress_callback: Optional[Callable[[int], None]] = None
    ) -> List[dict]:
        results = []
        total = len(input_paths)
        
        for i, input_path in enumerate(input_paths):
            try:
                result = await self._process_single(
                    input_path,
                    operation,
                    output_dir,
                    output_format,
                    options or {}
                )
                results.append({
                    "input": input_path,
                    "output": result,
                    "status": "success"
                })
            except Exception as e:
                logger.error(f"Failed to process {input_path}: {e}")
                results.append({
                    "input": input_path,
                    "output": None,
                    "status": "failed",
                    "error": str(e)
                })
            
            if progress_callback:
                progress = int((i + 1) / total * 100)
                progress_callback(progress)
        
        return results
    
    async def _process_single(
        self,
        input_path: str,
        operation: str,
        output_dir: str,
        output_format: Optional[str],
        options: dict
    ) -> str:
        filename = os.path.basename(input_path)
        name, ext = os.path.splitext(filename)
        
        if operation == "convert":
            output_ext = self._get_extension(output_format or "pdf")
            output_path = os.path.join(output_dir, f"{name}.{output_ext}")
            
            if ext.lower() == ".pdf":
                if output_format == "word":
                    return await self.convert_engine.pdf_to_word(input_path, output_path)
                elif output_format == "excel":
                    return await self.convert_engine.pdf_to_excel(input_path, output_path)
                elif output_format == "image":
                    images = await self.convert_engine.pdf_to_image(input_path, output_dir)
                    return images[0] if images else output_path
                else:
                    return input_path
            else:
                if output_format == "pdf":
                    return await self.convert_engine.images_to_pdf([input_path], output_path)
                else:
                    raise ValueError(f"Unsupported conversion: {ext} to {output_format}")
        
        elif operation == "compress":
            output_path = os.path.join(output_dir, f"{name}_compressed.pdf")
            level = options.get("level", "medium")
            return await self.pdf_engine.compress(input_path, output_path, level)
        
        elif operation == "watermark":
            output_path = os.path.join(output_dir, f"{name}_watermarked.pdf")
            return await self.pdf_engine.add_watermark(
                input_path,
                output_path,
                options.get("watermark_type", "text"),
                options.get("watermark_text"),
                options.get("watermark_image"),
                options.get("font_size", 48),
                options.get("font_color", "#CCCCCC"),
                options.get("opacity", 0.3),
                options.get("rotation", -45),
                options.get("position", "center")
            )
        
        elif operation == "encrypt":
            output_path = os.path.join(output_dir, f"{name}_encrypted.pdf")
            return await self.security_engine.encrypt(
                input_path,
                output_path,
                options.get("password", ""),
                options.get("owner_password"),
                options.get("permissions")
            )
        
        elif operation == "decrypt":
            output_path = os.path.join(output_dir, f"{name}_decrypted.pdf")
            return await self.security_engine.decrypt(
                input_path,
                output_path,
                options.get("password", "")
            )
        
        elif operation == "ocr":
            output_path = os.path.join(output_dir, f"{name}_ocr.txt")
            return await self.ocr_engine.recognize(
                input_path,
                output_path,
                options.get("language", "chi_sim+eng")
            )
        
        elif operation == "rotate":
            output_path = os.path.join(output_dir, f"{name}_rotated.pdf")
            pages = options.get("pages", [])
            degrees = options.get("degrees", 90)
            return await self.pdf_engine.rotate_pages(input_path, output_path, pages, degrees)
        
        elif operation == "extract_text":
            text = await self.pdf_engine.extract_text(input_path)
            output_path = os.path.join(output_dir, f"{name}.txt")
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(text)
            return output_path
        
        elif operation == "extract_images":
            img_dir = os.path.join(output_dir, name)
            os.makedirs(img_dir, exist_ok=True)
            return await self.pdf_engine.extract_images(input_path, img_dir)
        
        else:
            raise ValueError(f"Unknown operation: {operation}")
    
    def _get_extension(self, format_name: str) -> str:
        format_map = {
            "pdf": "pdf",
            "word": "docx",
            "excel": "xlsx",
            "ppt": "pptx",
            "image": "png",
            "html": "html",
            "text": "txt",
        }
        return format_map.get(format_name.lower(), format_name)
