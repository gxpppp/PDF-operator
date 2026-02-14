from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class ConvertFormat(str, Enum):
    PDF_TO_WORD = "pdf-to-word"
    PDF_TO_EXCEL = "pdf-to-excel"
    PDF_TO_PPT = "pdf-to-ppt"
    PDF_TO_IMAGE = "pdf-to-image"
    PDF_TO_HTML = "pdf-to-html"
    PDF_TO_TXT = "pdf-to-txt"
    WORD_TO_PDF = "word-to-pdf"
    EXCEL_TO_PDF = "excel-to-pdf"
    PPT_TO_PDF = "ppt-to-pdf"
    IMAGE_TO_PDF = "image-to-pdf"
    HTML_TO_PDF = "html-to-pdf"
    MARKDOWN_TO_PDF = "markdown-to-pdf"


class ConvertQuality(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    LOSSLESS = "lossless"


class ConvertOptions(BaseModel):
    input_path: str
    output_path: str
    format: ConvertFormat
    quality: ConvertQuality = ConvertQuality.MEDIUM
    dpi: int = 150
    pages: Optional[List[int]] = None
    preserve_formatting: bool = True
    extract_images: bool = False
    ocr_enabled: bool = False
    ocr_language: str = "zh"


class PdfToImageOptions(BaseModel):
    input_path: str
    output_path: str
    image_format: str = "png"
    dpi: int = 150
    pages: Optional[List[int]] = None
    background_color: str = "#FFFFFF"


class ImageToPdfOptions(BaseModel):
    input_paths: List[str]
    output_path: str
    page_size: str = "a4"
    custom_width: Optional[float] = None
    custom_height: Optional[float] = None
    orientation: str = "portrait"
    margin: int = 0
    align: str = "center"


class ConvertResult(BaseModel):
    success: bool
    output_path: str
    format: ConvertFormat
    page_count: Optional[int] = None
    file_size: Optional[int] = None
    processing_time: float


class ConvertProgress(BaseModel):
    task_id: str
    status: str
    progress: float
    current_page: int
    total_pages: int
    message: Optional[str] = None


class ConvertBatchOptions(BaseModel):
    input_paths: List[str]
    output_dir: str
    format: ConvertFormat
    options: Optional[Dict[str, Any]] = None


class ConvertBatchResult(BaseModel):
    success: bool
    results: List[ConvertResult]
    failed: List[str]
    total_time: float
