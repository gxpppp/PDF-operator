from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime


class WorkflowStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"


class WorkflowRunStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class WorkflowNodeType(str, Enum):
    START = "start"
    END = "end"
    CONDITION = "condition"
    PARALLEL = "parallel"
    MERGE = "merge"
    DELAY = "delay"
    PDF_MERGE = "pdf-merge"
    PDF_SPLIT = "pdf-split"
    PDF_CONVERT = "pdf-convert"
    PDF_COMPRESS = "pdf-compress"
    PDF_WATERMARK = "pdf-watermark"
    PDF_ENCRYPT = "pdf-encrypt"
    PDF_DECRYPT = "pdf-decrypt"
    OCR_PROCESS = "ocr-process"
    AI_SUMMARY = "ai-summary"
    AI_TRANSLATE = "ai-translate"
    AI_EXTRACT = "ai-extract"
    FILE_READ = "file-read"
    FILE_WRITE = "file-write"
    HTTP_REQUEST = "http-request"
    EMAIL_SEND = "email-send"
    SCRIPT = "script"


class NodePort(BaseModel):
    id: str
    name: str
    type: str
    required: bool
    description: Optional[str] = None


class WorkflowNode(BaseModel):
    id: str
    type: WorkflowNodeType
    name: str
    position: Dict[str, float]
    config: Dict[str, Any]
    inputs: List[NodePort]
    outputs: List[NodePort]


class EdgeCondition(BaseModel):
    type: str
    value: Any
    variable: Optional[str] = None


class WorkflowEdge(BaseModel):
    id: str
    source: str
    source_port: str
    target: str
    target_port: str
    label: Optional[str] = None
    condition: Optional[EdgeCondition] = None


class WorkflowVariable(BaseModel):
    name: str
    type: str
    value: Any
    description: Optional[str] = None
    is_input: bool
    is_output: bool


class WorkflowTrigger(BaseModel):
    id: str
    type: str
    config: Dict[str, Any]
    enabled: bool


class Workflow(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    status: WorkflowStatus
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]
    variables: List[WorkflowVariable]
    triggers: List[WorkflowTrigger]
    created_at: datetime
    updated_at: datetime
    last_run_at: Optional[datetime] = None
    run_count: int = 0


class NodeExecution(BaseModel):
    node_id: str
    status: str
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    inputs: Dict[str, Any]
    outputs: Dict[str, Any]
    error: Optional[str] = None


class WorkflowRun(BaseModel):
    id: str
    workflow_id: str
    status: WorkflowRunStatus
    started_at: datetime
    completed_at: Optional[datetime] = None
    inputs: Dict[str, Any]
    outputs: Dict[str, Any]
    node_executions: List[NodeExecution]
    error: Optional[str] = None


class WorkflowCreateOptions(BaseModel):
    name: str
    description: Optional[str] = None
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]
    variables: Optional[List[WorkflowVariable]] = None
    triggers: Optional[List[WorkflowTrigger]] = None


class WorkflowUpdateOptions(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[WorkflowStatus] = None
    nodes: Optional[List[WorkflowNode]] = None
    edges: Optional[List[WorkflowEdge]] = None
    variables: Optional[List[WorkflowVariable]] = None
    triggers: Optional[List[WorkflowTrigger]] = None


class WorkflowRunOptions(BaseModel):
    workflow_id: str
    inputs: Optional[Dict[str, Any]] = None
    async_exec: bool = True


class WorkflowListOptions(BaseModel):
    status: Optional[List[WorkflowStatus]] = None
    page: int = 1
    page_size: int = 20
    sort_by: str = "created_at"
    sort_order: str = "desc"
    search: Optional[str] = None


class WorkflowListResult(BaseModel):
    workflows: List[Workflow]
    total: int
    page: int
    page_size: int
    total_pages: int
