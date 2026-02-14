from app.core.ocr_engine.engine import OcrEngine
from typing import List, Optional
import os


class OcrService:
    def __init__(self):
        self.engine = OcrEngine()
    
    async def recognize(
        self,
        input_path: str,
        output_path: str,
        language: str = "chi_sim+eng",
        output_format: str = "text"
    ) -> str:
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"File not found: {input_path}")
        
        return await self.engine.recognize(
            input_path,
            output_path,
            language,
            output_format
        )
    
    async def batch_recognize(
        self,
        input_paths: List[str],
        output_dir: str,
        language: str = "chi_sim+eng"
    ) -> List[str]:
        os.makedirs(output_dir, exist_ok=True)
        
        results = []
        for input_path in input_paths:
            if os.path.exists(input_path):
                filename = os.path.basename(input_path)
                output_name = os.path.splitext(filename)[0] + "_ocr.txt"
                output_path = os.path.join(output_dir, output_name)
                
                result = await self.engine.recognize(
                    input_path,
                    output_path,
                    language
                )
                results.append(result)
        
        return results
    
    async def make_searchable_pdf(
        self,
        input_path: str,
        output_path: str,
        language: str = "chi_sim+eng"
    ) -> str:
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"File not found: {input_path}")
        
        return await self.engine.make_searchable_pdf(
            input_path,
            output_path,
            language
        )
