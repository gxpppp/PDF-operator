from typing import Optional, List
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor
from loguru import logger

executor = ThreadPoolExecutor(max_workers=2)


class AiEngine:
    def __init__(self):
        self._client = None
    
    def _get_client(self):
        if self._client is None:
            try:
                from openai import OpenAI
                from app.config.settings import settings
                
                if settings.OPENAI_API_KEY:
                    self._client = OpenAI(api_key=settings.OPENAI_API_KEY)
                else:
                    logger.warning("OpenAI API key not configured")
            except ImportError:
                logger.warning("OpenAI package not installed")
        return self._client
    
    async def summarize(self, text: str, max_length: int = 200) -> str:
        def _summarize():
            client = self._get_client()
            if client is None:
                return "AI service not configured"
            
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "你是一个专业的文档摘要助手。请用简洁的语言总结以下内容。"},
                    {"role": "user", "content": f"请用不超过{max_length}字总结以下内容：\n\n{text}"}
                ],
                max_tokens=max_length * 2
            )
            
            return response.choices[0].message.content
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _summarize)
    
    async def translate(
        self,
        text: str,
        source_lang: str = "auto",
        target_lang: str = "zh"
    ) -> str:
        def _translate():
            client = self._get_client()
            if client is None:
                return "AI service not configured"
            
            lang_map = {
                "zh": "中文",
                "en": "英文",
                "ja": "日文",
                "ko": "韩文",
                "fr": "法文",
                "de": "德文",
                "es": "西班牙文",
            }
            
            target = lang_map.get(target_lang, target_lang)
            
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": f"你是一个专业的翻译助手。请将以下内容翻译成{target}。"},
                    {"role": "user", "content": text}
                ]
            )
            
            return response.choices[0].message.content
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _translate)
    
    async def chat(
        self,
        message: str,
        context: Optional[str] = None,
        conversation_id: Optional[str] = None
    ) -> str:
        def _chat():
            client = self._get_client()
            if client is None:
                return "AI service not configured"
            
            messages = [
                {"role": "system", "content": "你是PDF Master的AI助手，可以帮助用户处理PDF相关的问题。"}
            ]
            
            if context:
                messages.append({"role": "system", "content": f"文档上下文：\n{context}"})
            
            messages.append({"role": "user", "content": message})
            
            response = client.chat.completions.create(
                model="gpt-4",
                messages=messages
            )
            
            return response.choices[0].message.content
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _chat)
    
    async def extract(self, text: str, extract_type: str = "keywords") -> List[str]:
        def _extract():
            client = self._get_client()
            if client is None:
                return []
            
            prompts = {
                "keywords": "请从以下内容中提取关键词，用逗号分隔：",
                "entities": "请从以下内容中提取实体（人名、地名、组织名等），用逗号分隔：",
                "dates": "请从以下内容中提取日期，用逗号分隔：",
                "numbers": "请从以下内容中提取数字和金额，用逗号分隔：",
            }
            
            prompt = prompts.get(extract_type, prompts["keywords"])
            
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": text}
                ]
            )
            
            result = response.choices[0].message.content
            return [item.strip() for item in result.split(',')]
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _extract)
    
    async def summarize_pdf(self, file_path: str, max_length: int = 500) -> str:
        from app.core.pdf_engine.engine import PdfEngine
        
        pdf_engine = PdfEngine()
        text = await pdf_engine.extract_text(file_path)
        
        if len(text) > 10000:
            text = text[:10000]
        
        return await self.summarize(text, max_length)
    
    async def pdf_qa(self, file_path: str, question: str) -> str:
        from app.core.pdf_engine.engine import PdfEngine
        
        pdf_engine = PdfEngine()
        text = await pdf_engine.extract_text(file_path)
        
        if len(text) > 10000:
            text = text[:10000]
        
        return await self.chat(question, context=text)
    
    async def classify_pdf(self, file_path: str) -> str:
        from app.core.pdf_engine.engine import PdfEngine
        
        pdf_engine = PdfEngine()
        metadata = await pdf_engine.get_metadata(file_path)
        text = await pdf_engine.extract_text(file_path)
        
        sample_text = text[:2000] if text else ""
        
        def _classify():
            client = self._get_client()
            if client is None:
                return "unknown"
            
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "请分析以下PDF内容，判断其文档类型。可能的类型包括：合同、报告、论文、发票、简历、手册、其他。只返回类型名称。"},
                    {"role": "user", "content": f"标题：{metadata.get('title', '无')}\n内容摘要：{sample_text}"}
                ]
            )
            
            return response.choices[0].message.content
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _classify)
