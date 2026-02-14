import os
import time
import asyncio
from typing import List, Optional, Dict, Any, Callable
from pathlib import Path

from ..core.convert_engine.engine import ConvertEngine
from ..schemas.convert import (
    ConvertOptions, ConvertResult, ConvertProgress, ConvertFormat,
    ConvertBatchOptions, ConvertBatchResult
)


class ConvertService:
    def __init__(self):
        self.engine = ConvertEngine()
        self._progress_callbacks: Dict[str, List[Callable]] = {}
        self._tasks: Dict[str, ConvertProgress] = {}

    async def convert(self, options: ConvertOptions, progress_callback: Optional[Callable] = None) -> ConvertResult:
        task_id = f"convert-{int(time.time() * 1000)}"
        self._tasks[task_id] = ConvertProgress(
            task_id=task_id,
            status="pending",
            progress=0,
            current_page=0,
            total_pages=0
        )

        if progress_callback:
            self._progress_callbacks[task_id] = [progress_callback]

        try:
            self._update_progress(task_id, "processing", 10)
            
            result = await asyncio.to_thread(
                self.engine.convert,
                options.input_path,
                options.output_path,
                options.format.value,
                {
                    "quality": options.quality.value,
                    "dpi": options.dpi,
                    "pages": options.pages,
                    "preserve_formatting": options.preserve_formatting,
                    "extract_images": options.extract_images,
                    "ocr_enabled": options.ocr_enabled,
                    "ocr_language": options.ocr_language
                }
            )

            self._update_progress(task_id, "completed", 100)
            
            return ConvertResult(
                success=True,
                output_path=options.output_path,
                format=options.format,
                page_count=result.get("page_count"),
                file_size=os.path.getsize(options.output_path) if os.path.exists(options.output_path) else None,
                processing_time=result.get("processing_time", 0)
            )
        except Exception as e:
            self._update_progress(task_id, "failed", 0, str(e))
            raise
        finally:
            self._cleanup_task(task_id)

    async def convert_batch(self, options: ConvertBatchOptions) -> ConvertBatchResult:
        results: List[ConvertResult] = []
        failed: List[str] = []
        start_time = time.time()

        for input_path in options.input_paths:
            try:
                output_path = self._generate_output_path(
                    input_path,
                    options.output_dir,
                    options.format
                )
                
                convert_options = ConvertOptions(
                    input_path=input_path,
                    output_path=output_path,
                    format=options.format,
                    **(options.options or {})
                )
                
                result = await self.convert(convert_options)
                results.append(result)
            except Exception as e:
                failed.append(input_path)
                print(f"Failed to convert {input_path}: {e}")

        return ConvertBatchResult(
            success=len(failed) == 0,
            results=results,
            failed=failed,
            total_time=time.time() - start_time
        )

    async def pdf_to_image(
        self,
        input_path: str,
        output_dir: str,
        image_format: str = "png",
        dpi: int = 150,
        pages: Optional[List[int]] = None
    ) -> List[str]:
        return await asyncio.to_thread(
            self.engine.pdf_to_image,
            input_path,
            output_dir,
            image_format,
            dpi,
            pages
        )

    async def image_to_pdf(
        self,
        input_paths: List[str],
        output_path: str,
        page_size: str = "a4",
        margin: int = 0
    ) -> str:
        return await asyncio.to_thread(
            self.engine.image_to_pdf,
            input_paths,
            output_path,
            page_size,
            margin
        )

    async def pdf_to_word(
        self,
        input_path: str,
        output_path: str,
        preserve_formatting: bool = True
    ) -> str:
        return await asyncio.to_thread(
            self.engine.pdf_to_word,
            input_path,
            output_path,
            preserve_formatting
        )

    async def pdf_to_excel(
        self,
        input_path: str,
        output_path: str,
        detect_tables: bool = True
    ) -> str:
        return await asyncio.to_thread(
            self.engine.pdf_to_excel,
            input_path,
            output_path,
            detect_tables
        )

    async def word_to_pdf(self, input_path: str, output_path: str) -> str:
        return await asyncio.to_thread(
            self.engine.word_to_pdf,
            input_path,
            output_path
        )

    async def html_to_pdf(
        self,
        input_path: str,
        output_path: str,
        page_size: str = "a4"
    ) -> str:
        return await asyncio.to_thread(
            self.engine.html_to_pdf,
            input_path,
            output_path,
            page_size
        )

    def get_supported_formats(self) -> List[Dict[str, Any]]:
        return [
            {"format": "pdf-to-word", "name": "PDF to Word", "input_ext": [".pdf"], "output_ext": ".docx"},
            {"format": "pdf-to-excel", "name": "PDF to Excel", "input_ext": [".pdf"], "output_ext": ".xlsx"},
            {"format": "pdf-to-ppt", "name": "PDF to PPT", "input_ext": [".pdf"], "output_ext": ".pptx"},
            {"format": "pdf-to-image", "name": "PDF to Image", "input_ext": [".pdf"], "output_ext": ".png"},
            {"format": "pdf-to-html", "name": "PDF to HTML", "input_ext": [".pdf"], "output_ext": ".html"},
            {"format": "pdf-to-txt", "name": "PDF to Text", "input_ext": [".pdf"], "output_ext": ".txt"},
            {"format": "word-to-pdf", "name": "Word to PDF", "input_ext": [".doc", ".docx"], "output_ext": ".pdf"},
            {"format": "excel-to-pdf", "name": "Excel to PDF", "input_ext": [".xls", ".xlsx"], "output_ext": ".pdf"},
            {"format": "ppt-to-pdf", "name": "PPT to PDF", "input_ext": [".ppt", ".pptx"], "output_ext": ".pdf"},
            {"format": "image-to-pdf", "name": "Image to PDF", "input_ext": [".jpg", ".png", ".tiff"], "output_ext": ".pdf"},
            {"format": "html-to-pdf", "name": "HTML to PDF", "input_ext": [".html"], "output_ext": ".pdf"},
        ]

    def get_progress(self, task_id: str) -> Optional[ConvertProgress]:
        return self._tasks.get(task_id)

    def _update_progress(
        self,
        task_id: str,
        status: str,
        progress: float,
        message: Optional[str] = None
    ):
        if task_id in self._tasks:
            self._tasks[task_id].status = status
            self._tasks[task_id].progress = progress
            if message:
                self._tasks[task_id].message = message
            
            for callback in self._progress_callbacks.get(task_id, []):
                try:
                    callback(self._tasks[task_id])
                except Exception as e:
                    print(f"Progress callback error: {e}")

    def _generate_output_path(
        self,
        input_path: str,
        output_dir: str,
        format: ConvertFormat
    ) -> str:
        input_name = Path(input_path).stem
        format_extensions = {
            ConvertFormat.PDF_TO_WORD: ".docx",
            ConvertFormat.PDF_TO_EXCEL: ".xlsx",
            ConvertFormat.PDF_TO_PPT: ".pptx",
            ConvertFormat.PDF_TO_IMAGE: ".png",
            ConvertFormat.PDF_TO_HTML: ".html",
            ConvertFormat.PDF_TO_TXT: ".txt",
            ConvertFormat.WORD_TO_PDF: ".pdf",
            ConvertFormat.EXCEL_TO_PDF: ".pdf",
            ConvertFormat.PPT_TO_PDF: ".pdf",
            ConvertFormat.IMAGE_TO_PDF: ".pdf",
            ConvertFormat.HTML_TO_PDF: ".pdf",
            ConvertFormat.MARKDOWN_TO_PDF: ".pdf",
        }
        ext = format_extensions.get(format, ".pdf")
        return os.path.join(output_dir, f"{input_name}{ext}")

    def _cleanup_task(self, task_id: str):
        if task_id in self._progress_callbacks:
            del self._progress_callbacks[task_id]
        if task_id in self._tasks:
            del self._tasks[task_id]


convert_service = ConvertService()
