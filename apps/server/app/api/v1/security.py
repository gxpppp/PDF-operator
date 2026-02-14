from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel

from app.core.security_engine.engine import SecurityEngine

router = APIRouter()
security_engine = SecurityEngine()


class EncryptRequest(BaseModel):
    input_path: str
    output_path: str
    user_password: str
    owner_password: Optional[str] = None
    permissions: dict = {
        "print": True,
        "copy": False,
        "modify": False,
        "annotate": True,
    }


class DecryptRequest(BaseModel):
    input_path: str
    output_path: str
    password: str


class SignRequest(BaseModel):
    input_path: str
    output_path: str
    certificate_path: str
    certificate_password: str
    reason: Optional[str] = None
    location: Optional[str] = None


@router.post("/encrypt")
async def encrypt_pdf(request: EncryptRequest):
    try:
        result = await security_engine.encrypt(
            request.input_path,
            request.output_path,
            request.user_password,
            request.owner_password,
            request.permissions
        )
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/decrypt")
async def decrypt_pdf(request: DecryptRequest):
    try:
        result = await security_engine.decrypt(
            request.input_path,
            request.output_path,
            request.password
        )
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sign")
async def sign_pdf(request: SignRequest):
    try:
        result = await security_engine.sign(
            request.input_path,
            request.output_path,
            request.certificate_path,
            request.certificate_password,
            request.reason,
            request.location
        )
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/verify")
async def verify_signature(file_path: str):
    try:
        result = await security_engine.verify_signature(file_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/permissions/{file_path:path}")
async def get_permissions(file_path: str, password: Optional[str] = None):
    try:
        permissions = await security_engine.get_permissions(file_path, password)
        return permissions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/redact")
async def redact_pdf(
    input_path: str,
    output_path: str,
    redactions: list[dict]
):
    try:
        result = await security_engine.redact(input_path, output_path, redactions)
        return {"success": True, "output_path": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
