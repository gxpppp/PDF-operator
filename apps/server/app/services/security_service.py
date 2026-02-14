import os
import time
import asyncio
from typing import List, Optional, Dict, Any

from ..core.security_engine.engine import SecurityEngine
from ..schemas.security import (
    EncryptOptions, DecryptOptions, DecryptResult, PermissionInfo,
    SignatureOptions, SignatureInfo, WatermarkOptions,
    RedactionOptions, AutoRedactOptions
)


class SecurityService:
    def __init__(self):
        self.engine = SecurityEngine()

    async def encrypt(self, options: EncryptOptions) -> Dict[str, Any]:
        return await asyncio.to_thread(
            self.engine.encrypt,
            options.input_path,
            options.output_path,
            options.owner_password,
            user_password=options.user_password,
            permissions=[p.value for p in options.permissions],
            algorithm=options.algorithm.value
        )

    async def decrypt(self, options: DecryptOptions) -> DecryptResult:
        result = await asyncio.to_thread(
            self.engine.decrypt,
            options.input_path,
            options.output_path,
            options.password
        )
        return DecryptResult(
            success=result.get("success", False),
            output_path=options.output_path,
            was_encrypted=result.get("was_encrypted", False)
        )

    async def get_permissions(self, file_path: str) -> PermissionInfo:
        result = await asyncio.to_thread(
            self.engine.get_permissions,
            file_path
        )
        return PermissionInfo(**result)

    async def sign(self, options: SignatureOptions) -> Dict[str, Any]:
        return await asyncio.to_thread(
            self.engine.sign,
            options.input_path,
            options.output_path,
            options.certificate_path,
            options.certificate_password,
            reason=options.reason,
            location=options.location,
            contact=options.contact,
            page_number=options.page_number,
            position=options.position,
            appearance=options.appearance.dict() if options.appearance else None
        )

    async def verify_signature(self, file_path: str) -> SignatureInfo:
        result = await asyncio.to_thread(
            self.engine.verify_signature,
            file_path
        )
        return SignatureInfo(**result)

    async def add_watermark(self, options: WatermarkOptions) -> Dict[str, Any]:
        return await asyncio.to_thread(
            self.engine.add_watermark,
            options.input_path,
            options.output_path,
            options.type.value,
            text=options.text,
            image_path=options.image_path,
            font_size=options.font_size,
            font_family=options.font_family,
            color=options.color,
            opacity=options.opacity,
            rotation=options.rotation,
            position=options.position.value,
            pages=options.pages,
            layer=options.layer
        )

    async def redact(self, options: RedactionOptions) -> Dict[str, Any]:
        redactions = [r.dict() for r in options.redactions]
        return await asyncio.to_thread(
            self.engine.redact,
            options.input_path,
            options.output_path,
            redactions
        )

    async def auto_redact(self, options: AutoRedactOptions) -> Dict[str, Any]:
        patterns = [p.dict() for p in options.patterns]
        return await asyncio.to_thread(
            self.engine.auto_redact,
            options.input_path,
            options.output_path,
            patterns,
            color=options.color
        )

    async def remove_watermark(
        self,
        input_path: str,
        output_path: str,
        watermark_type: str = "all"
    ) -> Dict[str, Any]:
        return await asyncio.to_thread(
            self.engine.remove_watermark,
            input_path,
            output_path,
            watermark_type
        )

    async def generate_certificate(
        self,
        common_name: str,
        output_path: str,
        organization: Optional[str] = None,
        country: Optional[str] = None,
        validity_years: int = 1,
        key_size: int = 2048
    ) -> Dict[str, Any]:
        return await asyncio.to_thread(
            self.engine.generate_certificate,
            common_name,
            output_path,
            organization=organization,
            country=country,
            validity_years=validity_years,
            key_size=key_size
        )

    async def get_certificate_info(self, certificate_path: str) -> Dict[str, Any]:
        return await asyncio.to_thread(
            self.engine.get_certificate_info,
            certificate_path
        )


security_service = SecurityService()
