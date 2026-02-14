import os
import time
import asyncio
from typing import Dict, Any, List, Optional

from ..core.ai_engine.engine import AiEngine
from ..schemas.ai import (
    AiChatOptions, AiChatResponse, AiSummaryOptions, AiSummaryResult,
    AiTranslateOptions, AiTranslateResult, AiExtractOptions, AiExtractResult,
    AiRewriteOptions, AiRewriteResult, AiClassifyOptions, AiClassifyResult,
    AiEmbeddingOptions, AiEmbeddingResult
)


class AiService:
    def __init__(self):
        self.engine = AiEngine()

    async def chat(self, options: AiChatOptions) -> AiChatResponse:
        result = await asyncio.to_thread(
            self.engine.chat,
            [m.dict() for m in options.messages],
            model=options.model,
            temperature=options.temperature,
            max_tokens=options.max_tokens,
            stream=options.stream
        )
        
        return AiChatResponse(
            id=result.get("id", ""),
            content=result.get("content", ""),
            model=result.get("model", ""),
            usage=result.get("usage", {}),
            finish_reason=result.get("finish_reason", "")
        )

    async def summarize(self, options: AiSummaryOptions) -> AiSummaryResult:
        result = await asyncio.to_thread(
            self.engine.summarize,
            options.input_path,
            style=options.style,
            language=options.language,
            max_length=options.max_length
        )
        
        return AiSummaryResult(
            success=True,
            summary=result.get("summary", ""),
            key_points=result.get("key_points", []),
            topics=result.get("topics", []),
            reading_time=result.get("reading_time", 0)
        )

    async def translate(self, options: AiTranslateOptions) -> AiTranslateResult:
        result = await asyncio.to_thread(
            self.engine.translate,
            options.text,
            options.source_language,
            options.target_language,
            preserve_formatting=options.preserve_formatting
        )
        
        return AiTranslateResult(
            success=True,
            translated_text=result.get("translated_text", ""),
            detected_language=result.get("detected_language"),
            confidence=result.get("confidence", 0)
        )

    async def extract(self, options: AiExtractOptions) -> AiExtractResult:
        result = await asyncio.to_thread(
            self.engine.extract,
            options.input_path,
            options.extract_type,
            custom_pattern=options.custom_pattern
        )
        
        return AiExtractResult(
            success=True,
            entities=result.get("entities", [])
        )

    async def rewrite(self, options: AiRewriteOptions) -> AiRewriteResult:
        result = await asyncio.to_thread(
            self.engine.rewrite,
            options.text,
            style=options.style,
            tone=options.tone,
            preserve_meaning=options.preserve_meaning
        )
        
        return AiRewriteResult(
            success=True,
            rewritten_text=result.get("rewritten_text", ""),
            changes=result.get("changes", [])
        )

    async def classify(self, options: AiClassifyOptions) -> AiClassifyResult:
        result = await asyncio.to_thread(
            self.engine.classify,
            options.input_path,
            options.categories,
            multi_label=options.multi_label
        )
        
        return AiClassifyResult(
            success=True,
            categories=result.get("categories", []),
            suggested_category=result.get("suggested_category", "")
        )

    async def embed(self, options: AiEmbeddingOptions) -> AiEmbeddingResult:
        result = await asyncio.to_thread(
            self.engine.embed,
            options.texts,
            model=options.model
        )
        
        return AiEmbeddingResult(
            success=True,
            embeddings=result.get("embeddings", []),
            model=result.get("model", ""),
            dimensions=result.get("dimensions", 0)
        )

    async def get_models(self) -> List[Dict[str, Any]]:
        return [
            {"id": "gpt-4", "name": "GPT-4", "provider": "openai", "context_window": 8192},
            {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo", "provider": "openai", "context_window": 4096},
            {"id": "claude-3", "name": "Claude 3", "provider": "anthropic", "context_window": 100000},
            {"id": "llama2", "name": "Llama 2", "provider": "ollama", "context_window": 4096},
        ]

    async def get_providers(self) -> List[Dict[str, Any]]:
        return [
            {"id": "openai", "name": "OpenAI", "requires_api_key": True},
            {"id": "anthropic", "name": "Anthropic", "requires_api_key": True},
            {"id": "ollama", "name": "Ollama (Local)", "requires_api_key": False},
        ]


ai_service = AiService()
