from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Generic, TypeVar
from datetime import datetime


T = TypeVar('T')


class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[Dict[str, Any]] = None
    meta: Optional[Dict[str, Any]] = None


class ApiError(BaseModel):
    code: str
    message: str
    details: Optional[Dict[str, Any]] = None


class ResponseMeta(BaseModel):
    timestamp: datetime
    request_id: str
    processing_time: Optional[float] = None


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_more: bool


class FileUploadResult(BaseModel):
    path: str
    filename: str
    size: int
    mime_type: str
    hash: str


class FileDownloadOptions(BaseModel):
    path: str
    filename: Optional[str] = None


class GpuInfo(BaseModel):
    name: str
    vendor: str
    memory: int
    driver: str


class SystemInfo(BaseModel):
    version: str
    platform: str
    arch: str
    cpu_cores: int
    total_memory: int
    free_memory: int
    gpu_available: bool
    gpu_info: Optional[GpuInfo] = None


class AppSettings(BaseModel):
    theme: str = "system"
    language: str = "zh-CN"
    auto_update: bool = True
    check_update_interval: int = 86400000
    default_output_dir: str = ""
    max_concurrent_jobs: int = 4
    enable_gpu: bool = True
    enable_telemetry: bool = False


class UpdateInfo(BaseModel):
    current_version: str
    latest_version: str
    has_update: bool
    release_notes: Optional[str] = None
    release_date: Optional[datetime] = None
    download_url: Optional[str] = None
    file_size: Optional[int] = None


class UpdateProgress(BaseModel):
    status: str
    progress: float
    downloaded_bytes: Optional[int] = None
    total_bytes: Optional[int] = None
    error: Optional[str] = None


class Shortcut(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    category: str
    default_key: str
    current_key: str
    enabled: bool


class ShortcutCategory(BaseModel):
    id: str
    name: str
    shortcuts: List[Shortcut]


class HealthCheck(BaseModel):
    status: str
    version: str
    uptime: float
    services: Dict[str, bool]
