from typing import Optional, Dict, List
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor
from loguru import logger

executor = ThreadPoolExecutor(max_workers=2)


class SecurityEngine:
    def __init__(self):
        pass
    
    async def encrypt(
        self,
        input_path: str,
        output_path: str,
        user_password: str,
        owner_password: Optional[str] = None,
        permissions: Dict = None
    ) -> str:
        def _encrypt():
            import pikepdf
            
            if permissions is None:
                permissions = {
                    "print": True,
                    "copy": False,
                    "modify": False,
                    "annotate": True,
                }
            
            with pikepdf.open(input_path) as pdf:
                encryption = pikepdf.Encryption(
                    owner=owner_password or user_password,
                    user=user_password,
                    R=6,
                    allow=pikepdf.Permissions(
                        print=permissions.get("print", True),
                        extract=permissions.get("copy", False),
                        modify=permissions.get("modify", False),
                        modify_annotations=permissions.get("annotate", True),
                    )
                )
                pdf.save(output_path, encryption=encryption)
            
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _encrypt)
    
    async def decrypt(
        self,
        input_path: str,
        output_path: str,
        password: str
    ) -> str:
        def _decrypt():
            import pikepdf
            
            with pikepdf.open(input_path, password=password) as pdf:
                pdf.save(output_path)
            
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _decrypt)
    
    async def sign(
        self,
        input_path: str,
        output_path: str,
        certificate_path: str,
        certificate_password: str,
        reason: Optional[str] = None,
        location: Optional[str] = None
    ) -> str:
        def _sign():
            try:
                from endesive import pdf
                
                with open(input_path, 'rb') as f:
                    data = f.read()
                
                with open(certificate_path, 'rb') as f:
                    cert_data = f.read()
                
                signature = pdf.cms.sign(
                    data,
                    {
                        'sigflags': 3,
                        'contact': 'PDF Master',
                        'location': location or 'Unknown',
                        'signingdate': 'D:20240101120000+08\'00\'',
                        'reason': reason or 'Document signed by PDF Master',
                    },
                    cert_data,
                    certificate_password.encode(),
                    'sha256'
                )
                
                with open(output_path, 'wb') as f:
                    f.write(data)
                    f.write(signature)
                
                return output_path
            except ImportError:
                logger.warning("endesive not installed")
                raise RuntimeError("Digital signature requires endesive package")
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _sign)
    
    async def verify_signature(self, file_path: str) -> Dict:
        def _verify():
            try:
                from endesive import pdf
                
                with open(file_path, 'rb') as f:
                    data = f.read()
                
                result = pdf.verify(data)
                
                return {
                    "valid": result.get('valid', False),
                    "signer": result.get('signer', 'Unknown'),
                    "signed_at": result.get('signingdate', None),
                    "reason": result.get('reason', None),
                    "location": result.get('location', None),
                }
            except ImportError:
                return {
                    "valid": False,
                    "error": "Signature verification requires endesive package"
                }
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _verify)
    
    async def get_permissions(
        self,
        file_path: str,
        password: Optional[str] = None
    ) -> Dict:
        def _get_permissions():
            import pikepdf
            
            try:
                with pikepdf.open(file_path, password=password or '') as pdf:
                    if pdf.is_encrypted:
                        return {
                            "encrypted": True,
                            "permissions": {
                                "print": pdf.allow.print,
                                "copy": pdf.allow.extract,
                                "modify": pdf.allow.modify,
                                "annotate": pdf.allow.modify_annotations,
                            }
                        }
                    else:
                        return {
                            "encrypted": False,
                            "permissions": {
                                "print": True,
                                "copy": True,
                                "modify": True,
                                "annotate": True,
                            }
                        }
            except pikepdf.PasswordError:
                return {
                    "encrypted": True,
                    "permissions": None,
                    "error": "Incorrect password"
                }
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _get_permissions)
    
    async def redact(
        self,
        input_path: str,
        output_path: str,
        redactions: List[Dict]
    ) -> str:
        def _redact():
            import fitz
            
            doc = fitz.open(input_path)
            
            for redaction in redactions:
                page_num = redaction.get("page", 1) - 1
                rect = fitz.Rect(
                    redaction["x"],
                    redaction["y"],
                    redaction["x"] + redaction["width"],
                    redaction["y"] + redaction["height"]
                )
                
                if 0 <= page_num < doc.page_count:
                    page = doc[page_num]
                    page.add_redact_annot(rect, fill=(0, 0, 0))
                    page.apply_redactions()
            
            doc.save(output_path)
            doc.close()
            
            return output_path
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, _redact)
