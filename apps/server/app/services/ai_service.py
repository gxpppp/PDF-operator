from app.core.ai_engine.engine import AiEngine
from typing import List, Optional


class AiService:
    def __init__(self):
        self.engine = AiEngine()
    
    async def summarize(self, text: str, max_length: int = 200) -> str:
        if not text.strip():
            raise ValueError("Text cannot be empty")
        
        return await self.engine.summarize(text, max_length)
    
    async def translate(
        self,
        text: str,
        source_lang: str = "auto",
        target_lang: str = "zh"
    ) -> str:
        if not text.strip():
            raise ValueError("Text cannot be empty")
        
        return await self.engine.translate(text, source_lang, target_lang)
    
    async def chat(
        self,
        message: str,
        context: Optional[str] = None,
        conversation_id: Optional[str] = None
    ) -> str:
        if not message.strip():
            raise ValueError("Message cannot be empty")
        
        return await self.engine.chat(message, context, conversation_id)
    
    async def extract(
        self,
        text: str,
        extract_type: str = "keywords"
    ) -> List[str]:
        if not text.strip():
            raise ValueError("Text cannot be empty")
        
        return await self.engine.extract(text, extract_type)
    
    async def summarize_pdf(self, file_path: str, max_length: int = 500) -> str:
        import os
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        return await self.engine.summarize_pdf(file_path, max_length)
    
    async def pdf_qa(self, file_path: str, question: str) -> str:
        import os
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if not question.strip():
            raise ValueError("Question cannot be empty")
        
        return await self.engine.pdf_qa(file_path, question)
    
    async def classify_pdf(self, file_path: str) -> str:
        import os
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        return await self.engine.classify_pdf(file_path)
