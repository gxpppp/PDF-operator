from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Optional
from pydantic import BaseModel
import uuid

from app.core.batch_engine.engine import BatchEngine

router = APIRouter()
batch_engine = BatchEngine()


class BatchTask(BaseModel):
    task_id: str
    input_paths: list[str]
    operation: str
    output_dir: str
    status: str = "pending"
    progress: int = 0
    results: list = []


class BatchRequest(BaseModel):
    input_paths: list[str]
    operation: str
    output_dir: str
    output_format: Optional[str] = None
    options: Optional[dict] = None


tasks_store = {}


@router.post("/create")
async def create_batch_task(request: BatchRequest, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())
    
    task = BatchTask(
        task_id=task_id,
        input_paths=request.input_paths,
        operation=request.operation,
        output_dir=request.output_dir
    )
    tasks_store[task_id] = task
    
    background_tasks.add_task(
        process_batch,
        task_id,
        request.input_paths,
        request.operation,
        request.output_dir,
        request.output_format,
        request.options
    )
    
    return {"task_id": task_id, "status": "created"}


async def process_batch(
    task_id: str,
    input_paths: list[str],
    operation: str,
    output_dir: str,
    output_format: Optional[str],
    options: Optional[dict]
):
    task = tasks_store[task_id]
    task.status = "processing"
    
    try:
        results = await batch_engine.process(
            input_paths,
            operation,
            output_dir,
            output_format,
            options,
            lambda p: update_progress(task_id, p)
        )
        task.results = results
        task.status = "completed"
        task.progress = 100
    except Exception as e:
        task.status = "failed"
        task.results = [{"error": str(e)}]


def update_progress(task_id: str, progress: int):
    if task_id in tasks_store:
        tasks_store[task_id].progress = progress


@router.get("/status/{task_id}")
async def get_task_status(task_id: str):
    if task_id not in tasks_store:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks_store[task_id]
    return {
        "task_id": task.task_id,
        "status": task.status,
        "progress": task.progress,
        "total": len(task.input_paths),
        "results": task.results if task.status == "completed" else None
    }


@router.get("/list")
async def list_tasks():
    return {
        "tasks": [
            {
                "task_id": task.task_id,
                "status": task.status,
                "progress": task.progress,
                "operation": task.operation,
                "total": len(task.input_paths)
            }
            for task in tasks_store.values()
        ]
    }


@router.delete("/cancel/{task_id}")
async def cancel_task(task_id: str):
    if task_id not in tasks_store:
        raise HTTPException(status_code=404, detail="Task not found")
    
    tasks_store[task_id].status = "cancelled"
    return {"success": True}


@router.get("/operations")
async def get_operations():
    return {
        "operations": [
            {"name": "convert", "description": "格式转换"},
            {"name": "compress", "description": "压缩PDF"},
            {"name": "watermark", "description": "添加水印"},
            {"name": "encrypt", "description": "加密PDF"},
            {"name": "decrypt", "description": "解密PDF"},
            {"name": "ocr", "description": "OCR识别"},
            {"name": "rotate", "description": "旋转页面"},
            {"name": "extract_text", "description": "提取文本"},
            {"name": "extract_images", "description": "提取图片"},
        ]
    }
