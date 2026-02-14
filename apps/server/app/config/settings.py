from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache


class Settings(BaseSettings):
    APP_NAME: str = "PDF Master"
    DEBUG: bool = True
    VERSION: str = "0.1.0"
    
    CORS_ORIGINS: List[str] = ["http://localhost:1420", "http://localhost:3000", "tauri://localhost"]
    
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/pdf_master.db"
    
    REDIS_URL: str = "redis://localhost:6379/0"
    
    UPLOAD_DIR: str = "./uploads"
    OUTPUT_DIR: str = "./outputs"
    TEMP_DIR: str = "./temp"
    MAX_UPLOAD_SIZE: int = 100 * 1024 * 1024
    
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4"
    
    OCR_LANGUAGE: str = "chi_sim+eng"
    OCR_USE_GPU: bool = False
    
    LOG_LEVEL: str = "DEBUG" if DEBUG else "INFO"
    LOG_FILE: str = "logs/app.log"
    LOG_FORMAT: str = "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
    LOG_ROTATION: str = "10 MB"
    LOG_RETENTION: str = "7 days"
    
    PROFILING_ENABLED: bool = False
    PROFILING_OUTPUT: str = "logs/profile"
    
    SENTRY_DSN: Optional[str] = None
    
    DEBUGPY_ENABLED: bool = False
    DEBUGPY_PORT: int = 5678
    DEBUGPY_WAIT_FOR_DEBUGGER: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
