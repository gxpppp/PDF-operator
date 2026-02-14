from fastapi import APIRouter, HTTPException
from typing import Optional, List
from pydantic import BaseModel
import uuid
from datetime import datetime

router = APIRouter()


class WorkflowStep(BaseModel):
    id: str
    type: str
    name: str
    config: dict


class Workflow(BaseModel):
    id: str
    name: str
    description: str
    steps: List[WorkflowStep]
    created_at: datetime
    updated_at: datetime
    status: str = "active"


class WorkflowRun(BaseModel):
    id: str
    workflow_id: str
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    results: List[dict] = []


workflows_store = {}
runs_store = {}


@router.get("/list")
async def list_workflows():
    return {
        "workflows": [
            {
                "id": wf.id,
                "name": wf.name,
                "description": wf.description,
                "steps_count": len(wf.steps),
                "status": wf.status,
                "updated_at": wf.updated_at.isoformat()
            }
            for wf in workflows_store.values()
        ]
    }


@router.post("/create")
async def create_workflow(
    name: str,
    description: str = "",
    steps: List[dict] = []
):
    workflow_id = str(uuid.uuid4())
    now = datetime.now()
    
    workflow = Workflow(
        id=workflow_id,
        name=name,
        description=description,
        steps=[WorkflowStep(**step) for step in steps],
        created_at=now,
        updated_at=now
    )
    workflows_store[workflow_id] = workflow
    
    return {"id": workflow_id, "status": "created"}


@router.get("/{workflow_id}")
async def get_workflow(workflow_id: str):
    if workflow_id not in workflows_store:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return workflows_store[workflow_id].model_dump()


@router.put("/{workflow_id}")
async def update_workflow(
    workflow_id: str,
    name: Optional[str] = None,
    description: Optional[str] = None,
    steps: Optional[List[dict]] = None
):
    if workflow_id not in workflows_store:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    workflow = workflows_store[workflow_id]
    
    if name:
        workflow.name = name
    if description is not None:
        workflow.description = description
    if steps is not None:
        workflow.steps = [WorkflowStep(**step) for step in steps]
    
    workflow.updated_at = datetime.now()
    
    return {"status": "updated"}


@router.delete("/{workflow_id}")
async def delete_workflow(workflow_id: str):
    if workflow_id not in workflows_store:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    del workflows_store[workflow_id]
    return {"status": "deleted"}


@router.post("/{workflow_id}/run")
async def run_workflow(workflow_id: str, input_files: List[str]):
    if workflow_id not in workflows_store:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    run_id = str(uuid.uuid4())
    run = WorkflowRun(
        id=run_id,
        workflow_id=workflow_id,
        status="running",
        started_at=datetime.now()
    )
    runs_store[run_id] = run
    
    return {"run_id": run_id, "status": "started"}


@router.get("/runs/{run_id}")
async def get_run_status(run_id: str):
    if run_id not in runs_store:
        raise HTTPException(status_code=404, detail="Run not found")
    
    return runs_store[run_id].model_dump()


@router.get("/step-types")
async def get_step_types():
    return {
        "step_types": [
            {"type": "merge", "name": "合并PDF", "category": "basic"},
            {"type": "split", "name": "拆分PDF", "category": "basic"},
            {"type": "convert", "name": "格式转换", "category": "basic"},
            {"type": "compress", "name": "压缩PDF", "category": "basic"},
            {"type": "watermark", "name": "添加水印", "category": "edit"},
            {"type": "encrypt", "name": "加密PDF", "category": "security"},
            {"type": "decrypt", "name": "解密PDF", "category": "security"},
            {"type": "ocr", "name": "OCR识别", "category": "advanced"},
            {"type": "extract_text", "name": "提取文本", "category": "extract"},
            {"type": "extract_images", "name": "提取图片", "category": "extract"},
            {"type": "rename", "name": "重命名", "category": "file"},
            {"type": "move", "name": "移动文件", "category": "file"},
            {"type": "email", "name": "发送邮件", "category": "output"},
        ]
    }
