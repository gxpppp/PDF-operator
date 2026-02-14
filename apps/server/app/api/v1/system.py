from fastapi import APIRouter
import platform
import psutil
import os

router = APIRouter()


@router.get("/info")
async def get_system_info():
    return {
        "app_name": "PDF Master",
        "version": "0.1.0",
        "python_version": platform.python_version(),
        "platform": platform.system(),
        "platform_version": platform.version(),
        "architecture": platform.machine(),
    }


@router.get("/resources")
async def get_resources():
    return {
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory": {
            "total": psutil.virtual_memory().total,
            "available": psutil.virtual_memory().available,
            "percent": psutil.virtual_memory().percent,
        },
        "disk": {
            "total": psutil.disk_usage('/').total if os.name != 'nt' else psutil.disk_usage('C:\\').total,
            "free": psutil.disk_usage('/').free if os.name != 'nt' else psutil.disk_usage('C:\\').free,
            "percent": psutil.disk_usage('/').percent if os.name != 'nt' else psutil.disk_usage('C:\\').percent,
        }
    }


@router.get("/dependencies")
async def get_dependencies():
    dependencies = []
    
    try:
        import fitz
        dependencies.append({"name": "PyMuPDF", "version": fitz.__version__, "status": "ok"})
    except ImportError:
        dependencies.append({"name": "PyMuPDF", "version": None, "status": "missing"})
    
    try:
        import pikepdf
        dependencies.append({"name": "pikepdf", "version": pikepdf.__version__, "status": "ok"})
    except ImportError:
        dependencies.append({"name": "pikepdf", "version": None, "status": "missing"})
    
    try:
        import pdfplumber
        dependencies.append({"name": "pdfplumber", "version": pdfplumber.__version__, "status": "ok"})
    except ImportError:
        dependencies.append({"name": "pdfplumber", "version": None, "status": "missing"})
    
    try:
        import paddleocr
        dependencies.append({"name": "PaddleOCR", "version": "installed", "status": "ok"})
    except ImportError:
        dependencies.append({"name": "PaddleOCR", "version": None, "status": "missing"})
    
    try:
        import openai
        dependencies.append({"name": "OpenAI", "version": openai.__version__, "status": "ok"})
    except ImportError:
        dependencies.append({"name": "OpenAI", "version": None, "status": "missing"})
    
    return {"dependencies": dependencies}


@router.get("/config")
async def get_config():
    from app.config.settings import settings
    
    return {
        "upload_dir": settings.UPLOAD_DIR,
        "output_dir": settings.OUTPUT_DIR,
        "temp_dir": settings.TEMP_DIR,
        "max_upload_size": settings.MAX_UPLOAD_SIZE,
        "ocr_language": settings.OCR_LANGUAGE,
        "log_level": settings.LOG_LEVEL,
    }
