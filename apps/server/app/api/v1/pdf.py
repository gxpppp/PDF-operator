from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from typing import List, Optional
from pydantic import BaseModel
import os
import tempfile
import aiofiles

from app.core.pdf_engine.engine import PdfEngine
from app.schemas.pdf import (
    PdfMergeRequest,
    PdfSplitRequest,
    PdfMetadataResponse,
    PdfPageResponse,
    WatermarkRequest,
    CompressRequest,
)

router = APIRouter()
pdf_engine = PdfEngine()


class MergeTask(BaseModel):
    input_paths: List[str]
    output_path: str


class SplitTask(BaseModel):
    input_path: str
    output_dir: str
    mode: str = "all"
    page_ranges: Optional[str] = None
    pages_per_file: Optional[int] = 1


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    temp_dir = tempfile.mkdtemp()
    file_path = os.path.join(temp_dir, file.filename)
    
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    metadata = await pdf_engine.get_metadata(file_path)
    
    return {
        "path": file_path,
        "filename": file.filename,
        "metadata": metadata
    }


@router.post("/merge")
async def merge_pdfs(task: MergeTask):
    try:
        result = await pdf_engine.merge(task.input_paths, task.output_path)
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/split")
async def split_pdf(task: SplitTask):
    try:
        results = await pdf_engine.split(
            task.input_path,
            task.output_dir,
            task.mode,
            task.page_ranges,
            task.pages_per_file
        )
        return {"success": True, "output_files": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/metadata/{file_path:path}")
async def get_metadata(file_path: str):
    try:
        metadata = await pdf_engine.get_metadata(file_path)
        return metadata
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/rotate")
async def rotate_pages(
    input_path: str,
    output_path: str,
    pages: List[int],
    degrees: int = 90
):
    try:
        result = await pdf_engine.rotate_pages(input_path, output_path, pages, degrees)
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/watermark")
async def add_watermark(request: WatermarkRequest):
    try:
        result = await pdf_engine.add_watermark(
            request.input_path,
            request.output_path,
            request.watermark_type,
            request.watermark_text,
            request.watermark_image,
            request.font_size,
            request.font_color,
            request.opacity,
            request.rotation,
            request.position
        )
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/compress")
async def compress_pdf(request: CompressRequest):
    try:
        result = await pdf_engine.compress(
            request.input_path,
            request.output_path,
            request.level
        )
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract/text")
async def extract_text(input_path: str):
    try:
        text = await pdf_engine.extract_text(input_path)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract/images")
async def extract_images(input_path: str, output_dir: str):
    try:
        images = await pdf_engine.extract_images(input_path, output_dir)
        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract/tables")
async def extract_tables(input_path: str):
    try:
        tables = await pdf_engine.extract_tables(input_path)
        return {"tables": tables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/download/{file_path:path}")
async def download_file(file_path: str):
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)
