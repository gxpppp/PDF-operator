import os
import time
import asyncio
from typing import Dict, Any, Optional
from datetime import datetime

from ..core.ocr_engine.engine import OcrEngine
from ..schemas.ocr import (
    OcrOptions, OcrResult, OcrPageResult, OcrTextBlock, OcrProgress
)


class OcrService:
    def __init__(self):
        self.engine = OcrEngine()
        self._progress: Dict[str, OcrProgress] = {}

    async def process(self, options: OcrOptions) -> OcrResult:
        task_id = f"ocr-{int(time.time() * 1000)}"
        start_time = time.time()
        
        self._progress[task_id] = OcrProgress(
            task_id=task_id,
            status="processing",
            progress=0,
            current_page=0,
            total_pages=0
        )
        
        try:
            result = await asyncio.to_thread(
                self.engine.process,
                options.input_path,
                options.output_path,
                language=options.language,
                engine=options.engine.value,
                dpi=options.dpi,
                enhance=options.enhance,
                deskew=options.deskew,
                denoise=options.denoise,
                binarize=options.binarize,
                output_format=options.output_format.value
            )
            
            pages = [
                OcrPageResult(
                    page_number=p["page_number"],
                    text=p["text"],
                    blocks=[
                        OcrTextBlock(
                            text=b["text"],
                            bbox=b["bbox"],
                            confidence=b["confidence"],
                            font_size=b.get("font_size"),
                            font_family=b.get("font_family")
                        )
                        for b in p.get("blocks", [])
                    ],
                    confidence=p.get("confidence", 0)
                )
                for p in result.get("pages", [])
            ]
            
            return OcrResult(
                success=True,
                text=result.get("text", ""),
                pages=pages,
                confidence=result.get("confidence", 0),
                processing_time=time.time() - start_time
            )
            
        except Exception as e:
            raise RuntimeError(f"OCR processing failed: {str(e)}")
        finally:
            if task_id in self._progress:
                del self._progress[task_id]

    async def process_image(self, image_path: str, language: str = "zh") -> Dict[str, Any]:
        return await asyncio.to_thread(
            self.engine.process_image,
            image_path,
            language=language
        )

    async def get_languages(self) -> list:
        return [
            {"code": "zh", "name": "Chinese", "native_name": "中文"},
            {"code": "en", "name": "English", "native_name": "English"},
            {"code": "ja", "name": "Japanese", "native_name": "日本語"},
            {"code": "ko", "name": "Korean", "native_name": "한국어"},
            {"code": "fr", "name": "French", "native_name": "Français"},
            {"code": "de", "name": "German", "native_name": "Deutsch"},
            {"code": "es", "name": "Spanish", "native_name": "Español"},
        ]

    async def get_engines(self) -> list:
        return [
            {"id": "paddleocr", "name": "PaddleOCR", "version": "2.7.0"},
            {"id": "tesseract", "name": "Tesseract", "version": "5.3.0"},
            {"id": "easyocr", "name": "EasyOCR", "version": "1.7.0"},
        ]

    def get_progress(self, task_id: str) -> Optional[OcrProgress]:
        return self._progress.get(task_id)


ocr_service = OcrService()
