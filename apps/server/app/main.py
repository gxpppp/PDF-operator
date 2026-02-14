from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.api.router import api_router
from app.api.middleware.logging import LoggingMiddleware
from app.api.middleware.error_handler import ErrorHandlerMiddleware
from loguru import logger
import sys

logger.remove()
logger.add(sys.stderr, level="INFO")
logger.add("logs/app.log", rotation="10 MB", retention="7 days", level="DEBUG")

app = FastAPI(
    title="PDF Master API",
    description="Enterprise-grade PDF Processing API",
    version="0.1.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)
app.add_middleware(ErrorHandlerMiddleware)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "0.1.0"}


@app.on_event("startup")
async def startup_event():
    logger.info("PDF Master Server starting up...")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("PDF Master Server shutting down...")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
