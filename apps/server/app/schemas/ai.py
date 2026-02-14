from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class AiProvider(str, Enum):
    OPENAI = "openai"
    OLLAMA = "ollama"
    ANTHROPIC = "anthropic"


class AiChatMessage(BaseModel):
    role: str
    content: str
    images: Optional[List[str]] = None


class AiChatOptions(BaseModel):
    messages: List[AiChatMessage]
    model: Optional[str] = None
    temperature: float = 0.7
    max_tokens: int = 2048
    stream: bool = False


class AiChatResponse(BaseModel):
    id: str
    content: str
    model: str
    usage: Dict[str, int]
    finish_reason: str


class AiSummaryOptions(BaseModel):
    input_path: str
    style: str = "brief"
    language: Optional[str] = None
    max_length: Optional[int] = None


class AiSummaryResult(BaseModel):
    success: bool
    summary: str
    key_points: List[str]
    topics: List[str]
    reading_time: int


class AiTranslateOptions(BaseModel):
    text: str
    source_language: str
    target_language: str
    preserve_formatting: bool = True


class AiTranslateResult(BaseModel):
    success: bool
    translated_text: str
    detected_language: Optional[str] = None
    confidence: float


class AiExtractOptions(BaseModel):
    input_path: str
    extract_type: str
    custom_pattern: Optional[str] = None


class ExtractedEntity(BaseModel):
    type: str
    value: str
    position: Dict[str, Any]
    confidence: float


class AiExtractResult(BaseModel):
    success: bool
    entities: List[ExtractedEntity]


class AiRewriteOptions(BaseModel):
    text: str
    style: str = "neutral"
    tone: str = "neutral"
    preserve_meaning: bool = True


class AiRewriteResult(BaseModel):
    success: bool
    rewritten_text: str
    changes: List[str]


class AiClassifyOptions(BaseModel):
    input_path: str
    categories: List[str]
    multi_label: bool = False


class AiClassifyResult(BaseModel):
    success: bool
    categories: List[Dict[str, Any]]
    suggested_category: str


class AiEmbeddingOptions(BaseModel):
    texts: List[str]
    model: Optional[str] = None


class AiEmbeddingResult(BaseModel):
    success: bool
    embeddings: List[List[float]]
    model: str
    dimensions: int
