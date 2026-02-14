from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel

from app.core.convert_engine.engine import ConvertEngine

router = APIRouter()
convert_engine = ConvertEngine()


class ConvertRequest(BaseModel):
    input_path: str
    output_path: str
    output_format: str
    quality: str = "high"


@router.post("/pdf/to/word")
async def pdf_to_word(request: ConvertRequest):
    try:
        result = await convert_engine.pdf_to_word(
            request.input_path,
            request.output_path,
            request.quality
        )
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pdf/to/excel")
async def pdf_to_excel(request: ConvertRequest):
    try:
        result = await convert_engine.pdf_to_excel(
            request.input_path,
            request.output_path
        )
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pdf/to/ppt")
async def pdf_to_ppt(request: ConvertRequest):
    try:
        result = await convert_engine.pdf_to_ppt(
            request.input_path,
            request.output_path
        )
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pdf/to/image")
async def pdf_to_image(
    input_path: str,
    output_dir: str,
    image_format: str = "png",
    dpi: int = 150
):
    try:
        results = await convert_engine.pdf_to_image(
            input_path,
            output_dir,
            image_format,
            dpi
        )
        return {"success": True, "images": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pdf/to/html")
async def pdf_to_html(request: ConvertRequest):
    try:
        result = await convert_engine.pdf_to_html(
            request.input_path,
            request.output_path
        )
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/word/to/pdf")
async def word_to_pdf(request: ConvertRequest):
    try:
        result = await convert_engine.word_to_pdf(
            request.input_path,
            request.output_path
        )
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/excel/to/pdf")
async def excel_to_pdf(request: ConvertRequest):
    try:
        result = await convert_engine.excel_to_pdf(
            request.input_path,
            request.output_path
        )
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/image/to/pdf")
async def image_to_pdf(
    input_paths: list[str],
    output_path: str
):
    try:
        result = await convert_engine.images_to_pdf(input_paths, output_path)
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/html/to/pdf")
async def html_to_pdf(request: ConvertRequest):
    try:
        result = await convert_engine.html_to_pdf(
            request.input_path,
            request.output_path
        )
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/formats")
async def get_supported_formats():
    return {
        "input_formats": ["pdf", "docx", "doc", "xlsx", "xls", "pptx", "ppt", "png", "jpg", "jpeg", "html"],
        "output_formats": ["pdf", "docx", "xlsx", "pptx", "png", "jpg", "html", "txt"]
    }
