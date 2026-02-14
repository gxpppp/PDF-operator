from fastapi import APIRouter
from app.api.v1 import pdf, ocr, ai, convert, security, batch, workflow, system

api_router = APIRouter()

api_router.include_router(pdf.router, prefix="/pdf", tags=["PDF"])
api_router.include_router(ocr.router, prefix="/ocr", tags=["OCR"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])
api_router.include_router(convert.router, prefix="/convert", tags=["Convert"])
api_router.include_router(security.router, prefix="/security", tags=["Security"])
api_router.include_router(batch.router, prefix="/batch", tags=["Batch"])
api_router.include_router(workflow.router, prefix="/workflow", tags=["Workflow"])
api_router.include_router(system.router, prefix="/system", tags=["System"])
