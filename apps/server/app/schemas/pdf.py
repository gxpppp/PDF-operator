from pydantic import BaseModel
from typing import Optional, List, Dict


class PdfMergeRequest(BaseModel):
    input_paths: List[str]
    output_path: str


class PdfSplitRequest(BaseModel):
    input_path: str
    output_dir: str
    mode: str = "all"
    page_ranges: Optional[str] = None
    pages_per_file: Optional[int] = 1


class PdfMetadataResponse(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    subject: Optional[str] = None
    keywords: Optional[str] = None
    creator: Optional[str] = None
    producer: Optional[str] = None
    creation_date: Optional[str] = None
    modification_date: Optional[str] = None
    page_count: int
    file_size: int


class PdfPageResponse(BaseModel):
    number: int
    width: float
    height: float
    rotation: int


class WatermarkRequest(BaseModel):
    input_path: str
    output_path: str
    watermark_type: str = "text"
    watermark_text: Optional[str] = None
    watermark_image: Optional[str] = None
    font_size: int = 48
    font_color: str = "#CCCCCC"
    opacity: float = 0.3
    rotation: int = -45
    position: str = "center"


class CompressRequest(BaseModel):
    input_path: str
    output_path: str
    level: str = "medium"


class RotateRequest(BaseModel):
    input_path: str
    output_path: str
    pages: List[int]
    degrees: int = 90


class ExtractTextResponse(BaseModel):
    text: str


class ExtractImagesResponse(BaseModel):
    images: List[str]


class ExtractTablesResponse(BaseModel):
    tables: List[List[List[str]]]
