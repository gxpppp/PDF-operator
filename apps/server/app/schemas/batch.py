from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime


class BatchTaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class BatchTaskType(str, Enum):
    MERGE = "merge"
    SPLIT = "split"
    CONVERT = "convert"
    COMPRESS = "compress"
    OCR = "ocr"
    WATERMARK = "watermark"
    ENCRYPT = "encrypt"
    DECRYPT = "decrypt"


class BatchProgress(BaseModel):
    total: int
    completed: int
    failed: int
    percentage: float
    current_file: Optional[str] = None
    estimated_time_remaining: Optional[int] = None


class BatchError(BaseModel):
    file: str
    error: str
    code: Optional[str] = None


class BatchResult(BaseModel):
    success: bool
    output_files: List[str]
    failed_files: List[str]
    errors: List[BatchError]
    total_processing_time: float


class BatchTask(BaseModel):
    id: str
    name: str
    type: BatchTaskType
    status: BatchTaskStatus
    input_files: List[str]
    output_dir: str
    options: Dict[str, Any]
    progress: BatchProgress
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[BatchResult] = None


class BatchCreateOptions(BaseModel):
    name: str
    type: BatchTaskType
    input_files: List[str]
    output_dir: str
    options: Dict[str, Any]
    auto_start: bool = True
    parallel_jobs: int = 4
    stop_on_error: bool = False


class BatchListOptions(BaseModel):
    status: Optional[List[BatchTaskStatus]] = None
    type: Optional[List[BatchTaskType]] = None
    page: int = 1
    page_size: int = 20
    sort_by: str = "created_at"
    sort_order: str = "desc"


class BatchListResult(BaseModel):
    tasks: List[BatchTask]
    total: int
    page: int
    page_size: int
    total_pages: int
