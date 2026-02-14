from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel

from app.core.ocr_engine.engine import OcrEngine

router = APIRouter()
ocr_engine = OcrEngine()


class OcrRequest(BaseModel):
    input_path: str
    output_path: str
    language: str = "chi_sim+eng"
    output_format: str = "text"


class OcrBatchRequest(BaseModel):
    input_paths: list[str]
    output_dir: str
    language: str = "chi_sim+eng"


@router.post("/recognize")
async def ocr_recognize(request: OcrRequest):
    try:
        result = await ocr_engine.recognize(
            request.input_path,
            request.output_path,
            request.language,
            request.output_format
        )
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch")
async def ocr_batch(request: OcrBatchRequest):
    try:
        results = await ocr_engine.batch_recognize(
            request.input_paths,
            request.output_dir,
            request.language
        )
        return {"success": True, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/languages")
async def get_supported_languages():
    return {
        "languages": [
            {"code": "chi_sim", "name": "简体中文"},
            {"code": "chi_tra", "name": "繁体中文"},
            {"code": "eng", "name": "英文"},
            {"code": "jpn", "name": "日文"},
            {"code": "kor", "name": "韩文"},
            {"code": "fra", "name": "法文"},
            {"code": "deu", "name": "德文"},
            {"code": "spa", "name": "西班牙文"},
        ]
    }


@router.post("/pdf/searchable")
async def make_searchable_pdf(
    input_path: str,
    output_path: str,
    language: str = "chi_sim+eng"
):
    try:
        result = await ocr_engine.make_searchable_pdf(
            input_path,
            output_path,
            language
        )
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
