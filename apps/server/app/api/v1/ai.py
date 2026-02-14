from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel

from app.core.ai_engine.engine import AiEngine

router = APIRouter()
ai_engine = AiEngine()


class SummaryRequest(BaseModel):
    text: str
    max_length: int = 200


class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "auto"
    target_lang: str = "zh"


class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None
    conversation_id: Optional[str] = None


class ExtractRequest(BaseModel):
    text: str
    extract_type: str = "keywords"


@router.post("/summary")
async def summarize(request: SummaryRequest):
    try:
        summary = await ai_engine.summarize(request.text, request.max_length)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/translate")
async def translate(request: TranslateRequest):
    try:
        translated = await ai_engine.translate(
            request.text,
            request.source_lang,
            request.target_lang
        )
        return {"translated_text": translated}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = await ai_engine.chat(
            request.message,
            request.context,
            request.conversation_id
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract")
async def extract_info(request: ExtractRequest):
    try:
        result = await ai_engine.extract(request.text, request.extract_type)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pdf/summary")
async def summarize_pdf(file_path: str, max_length: int = 500):
    try:
        summary = await ai_engine.summarize_pdf(file_path, max_length)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pdf/qa")
async def pdf_qa(file_path: str, question: str):
    try:
        answer = await ai_engine.pdf_qa(file_path, question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pdf/classify")
async def classify_pdf(file_path: str):
    try:
        category = await ai_engine.classify_pdf(file_path)
        return {"category": category}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
