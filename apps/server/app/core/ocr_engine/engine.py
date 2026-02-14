from typing import List, Optional
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor
from loguru import logger

executor = ThreadPoolExecutor(max_workers=2)


class OcrEngine:
    def __init__(self):
        self._ocr = None
    
    def _get_ocr(self):
        if self._ocr is None:
            try:
                from paddleocr import PaddleOCR
                self._ocr = PaddleOCR(use_angle_cls=True, lang='ch', use_gpu=False)
            except ImportError:
                logger.warning("PaddleOCR not installed, OCR features will be limited")
        return self._ocr
    
    async def recognize(
        self,
        input_path: str,
        output_path: str,
        language: str = "chi_sim+eng",
        output_format: str = "text"
    ) -> str:
        def _recognize():
            ocr = self._get_ocr()
            if ocr is None:
                raise RuntimeError("OCR engine not available")
            
            if input_path.lower().endswith('.pdf'):
                import fitz
                doc = fitz.open(input_path)
                all_text = []
                
                for page in doc:
                    pix = page.get_pixmap(dpi=150)
                    img_data = pix.tobytes("png")
                    
                    import tempfile
                    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
                        tmp.write(img_data)
                        tmp_path = tmp.name
                    
                    result = ocr.ocr(tmp_path, cls=True)
                    os.unlink(tmp_path)
                    
                    page_text = []
                    if result and result[0]:
                        for line in result[0]:
                            page_text.append(line[1][0])
                    
                    all_text.append('\n'.join(page_text))
                
                doc.close()
                text = '\n\n'.join(all_text)
            
            else:
                result = ocr.ocr(input_path, cls=True)
                text_lines = []
                if result and result[0]:
                    for line in result[0]:
                        text_lines.append(line[1][0])
                text = '\n'.join(text_lines)
            
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(text)
            
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _recognize)
    
    async def batch_recognize(
        self,
        input_paths: List[str],
        output_dir: str,
        language: str = "chi_sim+eng"
    ) -> List[str]:
        results = []
        for input_path in input_paths:
            filename = os.path.basename(input_path)
            output_name = os.path.splitext(filename)[0] + "_ocr.txt"
            output_path = os.path.join(output_dir, output_name)
            
            result = await self.recognize(input_path, output_path, language)
            results.append(result)
        
        return results
    
    async def make_searchable_pdf(
        self,
        input_path: str,
        output_path: str,
        language: str = "chi_sim+eng"
    ) -> str:
        def _make_searchable():
            ocr = self._get_ocr()
            if ocr is None:
                raise RuntimeError("OCR engine not available")
            
            import fitz
            
            doc = fitz.open(input_path)
            
            for page in doc:
                pix = page.get_pixmap(dpi=150)
                img_data = pix.tobytes("png")
                
                import tempfile
                with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
                    tmp.write(img_data)
                    tmp_path = tmp.name
                
                result = ocr.ocr(tmp_path, cls=True)
                os.unlink(tmp_path)
                
                if result and result[0]:
                    for line in result[0]:
                        box = line[0]
                        text = line[1][0]
                        
                        rect = fitz.Rect(box[0][0], box[0][1], box[2][0], box[2][1])
                        
                        fontsize = 12
                        page.insert_text(
                            rect.bl,
                            text,
                            fontsize=fontsize,
                            fontname="helv"
                        )
            
            doc.save(output_path)
            doc.close()
            
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _make_searchable)
    
    async def recognize_region(
        self,
        input_path: str,
        region: tuple,
        language: str = "chi_sim+eng"
    ) -> str:
        def _recognize_region():
            ocr = self._get_ocr()
            if ocr is None:
                raise RuntimeError("OCR engine not available")
            
            from PIL import Image
            
            img = Image.open(input_path)
            cropped = img.crop(region)
            
            import tempfile
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
                cropped.save(tmp.name)
                tmp_path = tmp.name
            
            result = ocr.ocr(tmp_path, cls=True)
            os.unlink(tmp_path)
            
            if result and result[0]:
                return '\n'.join([line[1][0] for line in result[0]])
            return ""
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _recognize_region)
