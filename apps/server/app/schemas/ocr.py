from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class OcrEngine(str, Enum):
    PADDLEOCR = "paddleocr"
    TESSERACT = "tesseract"
    EASYOCR = "easyocr"


class OcrOutputFormat(str, Enum):
    TEXT = "text"
    JSON = "json"
    PDF = "pdf"
    PDF_WITH_TEXT = "pdf-with-text"


class OcrOptions(BaseModel):
    input_path: str
    output_path: Optional[str] = None
    language: str = "zh"
    engine: OcrEngine = OcrEngine.PADDLEOCR
    dpi: int = 300
    enhance: bool = False
    deskew: bool = False
    denoise: bool = False
    binarize: bool = False
    output_format: OcrOutputFormat = OcrOutputFormat.TEXT


class OcrTextBlock(BaseModel):
    text: str
    bbox: List[float]
    confidence: float
    font_size: Optional[float] = None
    font_family: Optional[str] = None


class OcrPageResult(BaseModel):
    page_number: int
    text: str
    blocks: List[OcrTextBlock]
    confidence: float


class OcrResult(BaseModel):
    success: bool
    text: str
    pages: List[OcrPageResult]
    confidence: float
    processing_time: float


class OcrProgress(BaseModel):
    task_id: str
    status: str
    progress: float
    current_page: int
    total_pages: int
    message: Optional[str] = None


class OcrBatchOptions(BaseModel):
    input_paths: List[str]
    output_dir: str
    options: OcrOptions


class OcrBatchResult(BaseModel):
    success: bool
    results: List[OcrResult]
    failed: List[str]
    total_time: float
