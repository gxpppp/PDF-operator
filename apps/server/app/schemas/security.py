from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class EncryptionAlgorithm(str, Enum):
    AES_128 = "aes-128"
    AES_256 = "aes-256"
    RC4 = "rc4"


class Permission(str, Enum):
    PRINT = "print"
    COPY = "copy"
    MODIFY = "modify"
    ANNOTATE = "annotate"
    FILL_FORMS = "fill-forms"
    EXTRACT = "extract"
    ASSEMBLE = "assemble"
    PRINT_HQ = "print-hq"


class EncryptOptions(BaseModel):
    input_path: str
    output_path: str
    user_password: Optional[str] = None
    owner_password: str
    algorithm: EncryptionAlgorithm = EncryptionAlgorithm.AES_256
    permissions: List[Permission] = []
    allow_screen_readers: bool = True


class DecryptOptions(BaseModel):
    input_path: str
    output_path: str
    password: str


class DecryptResult(BaseModel):
    success: bool
    output_path: str
    was_encrypted: bool


class PermissionInfo(BaseModel):
    is_encrypted: bool
    permissions: Dict[str, bool]
    algorithm: Optional[EncryptionAlgorithm] = None
    owner_password_set: bool
    user_password_set: bool


class SignatureAppearance(BaseModel):
    show_name: bool = True
    show_date: bool = True
    show_reason: bool = True
    show_location: bool = True
    show_logo: bool = False
    logo_path: Optional[str] = None
    background_color: Optional[str] = None
    border_color: Optional[str] = None


class SignatureOptions(BaseModel):
    input_path: str
    output_path: str
    certificate_path: str
    certificate_password: str
    reason: Optional[str] = None
    location: Optional[str] = None
    contact: Optional[str] = None
    page_number: int = 1
    position: Optional[Dict[str, float]] = None
    appearance: Optional[SignatureAppearance] = None


class SignatureDetail(BaseModel):
    name: str
    date: str
    reason: Optional[str] = None
    location: Optional[str] = None
    is_valid: bool
    certificate_info: Dict[str, str]


class SignatureInfo(BaseModel):
    has_signature: bool
    signatures: List[SignatureDetail]


class WatermarkType(str, Enum):
    TEXT = "text"
    IMAGE = "image"


class WatermarkPosition(str, Enum):
    CENTER = "center"
    TILE = "tile"
    TOP_LEFT = "top-left"
    TOP_RIGHT = "top-right"
    BOTTOM_LEFT = "bottom-left"
    BOTTOM_RIGHT = "bottom-right"


class WatermarkOptions(BaseModel):
    input_path: str
    output_path: str
    type: WatermarkType
    text: Optional[str] = None
    image_path: Optional[str] = None
    font_size: int = 48
    font_family: str = "Arial"
    color: str = "#808080"
    opacity: float = 0.3
    rotation: int = -45
    position: WatermarkPosition = WatermarkPosition.CENTER
    pages: str = "all"
    layer: str = "over"


class RedactionArea(BaseModel):
    page_number: int
    bbox: List[float]
    color: str = "#000000"


class RedactionOptions(BaseModel):
    input_path: str
    output_path: str
    redactions: List[RedactionArea]


class RedactionPattern(BaseModel):
    type: str
    pattern: str
    case_sensitive: bool = False
    pages: str = "all"


class AutoRedactOptions(BaseModel):
    input_path: str
    output_path: str
    patterns: List[RedactionPattern]
    color: str = "#000000"


class CertificateGenerateOptions(BaseModel):
    common_name: str
    organization: Optional[str] = None
    organizational_unit: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    locality: Optional[str] = None
    email_address: Optional[str] = None
    validity_years: int = 1
    key_size: int = 2048


class CertificateInfo(BaseModel):
    subject: Dict[str, str]
    issuer: Dict[str, str]
    serial_number: str
    valid_from: str
    valid_to: str
    is_expired: bool
    is_self_signed: bool
