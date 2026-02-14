from typing import Optional, Dict, Any


class PDFMasterError(Exception):
    """Base exception for PDF Master"""
    
    def __init__(
        self,
        message: str,
        code: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.code = code or "UNKNOWN_ERROR"
        self.details = details or {}
        super().__init__(self.message)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "code": self.code,
            "message": self.message,
            "details": self.details
        }


class FileNotFoundError(PDFMasterError):
    """File not found error"""
    
    def __init__(self, path: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"File not found: {path}",
            code="FILE_NOT_FOUND",
            details={"path": path, **(details or {})}
        )


class InvalidFileFormatError(PDFMasterError):
    """Invalid file format error"""
    
    def __init__(self, path: str, expected_format: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"Invalid file format. Expected: {expected_format}",
            code="INVALID_FILE_FORMAT",
            details={"path": path, "expected_format": expected_format, **(details or {})}
        )


class FileTooLargeError(PDFMasterError):
    """File too large error"""
    
    def __init__(self, size: int, max_size: int, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"File too large. Maximum size: {max_size} bytes",
            code="FILE_TOO_LARGE",
            details={"size": size, "max_size": max_size, **(details or {})}
        )


class PasswordRequiredError(PDFMasterError):
    """Password required error"""
    
    def __init__(self, path: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message="Password required to open this file",
            code="PASSWORD_REQUIRED",
            details={"path": path, **(details or {})}
        )


class IncorrectPasswordError(PDFMasterError):
    """Incorrect password error"""
    
    def __init__(self, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message="Incorrect password",
            code="INCORRECT_PASSWORD",
            details=details
        )


class ProcessingError(PDFMasterError):
    """Processing error"""
    
    def __init__(self, operation: str, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"Processing failed during {operation}: {message}",
            code="PROCESSING_ERROR",
            details={"operation": operation, **(details or {})}
        )


class ConversionError(PDFMasterError):
    """Conversion error"""
    
    def __init__(self, source_format: str, target_format: str, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"Conversion from {source_format} to {target_format} failed: {message}",
            code="CONVERSION_ERROR",
            details={"source_format": source_format, "target_format": target_format, **(details or {})}
        )


class OCRError(PDFMasterError):
    """OCR error"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"OCR processing failed: {message}",
            code="OCR_ERROR",
            details=details
        )


class AIError(PDFMasterError):
    """AI service error"""
    
    def __init__(self, provider: str, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"AI service error ({provider}): {message}",
            code="AI_ERROR",
            details={"provider": provider, **(details or {})}
        )


class SecurityError(PDFMasterError):
    """Security error"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"Security error: {message}",
            code="SECURITY_ERROR",
            details=details
        )


class EncryptionError(PDFMasterError):
    """Encryption error"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"Encryption error: {message}",
            code="ENCRYPTION_ERROR",
            details=details
        )


class DecryptionError(PDFMasterError):
    """Decryption error"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"Decryption error: {message}",
            code="DECRYPTION_ERROR",
            details=details
        )


class PermissionDeniedError(PDFMasterError):
    """Permission denied error"""
    
    def __init__(self, resource: str, action: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"Permission denied for {action} on {resource}",
            code="PERMISSION_DENIED",
            details={"resource": resource, "action": action, **(details or {})}
        )


class ValidationError(PDFMasterError):
    """Validation error"""
    
    def __init__(self, field: str, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"Validation error for {field}: {message}",
            code="VALIDATION_ERROR",
            details={"field": field, **(details or {})}
        )


class ConfigurationError(PDFMasterError):
    """Configuration error"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"Configuration error: {message}",
            code="CONFIGURATION_ERROR",
            details=details
        )


class PluginError(PDFMasterError):
    """Plugin error"""
    
    def __init__(self, plugin_id: str, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"Plugin error ({plugin_id}): {message}",
            code="PLUGIN_ERROR",
            details={"plugin_id": plugin_id, **(details or {})}
        )


class WorkflowError(PDFMasterError):
    """Workflow error"""
    
    def __init__(self, workflow_id: str, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"Workflow error ({workflow_id}): {message}",
            code="WORKFLOW_ERROR",
            details={"workflow_id": workflow_id, **(details or {})}
        )


class BatchError(PDFMasterError):
    """Batch processing error"""
    
    def __init__(self, batch_id: str, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"Batch processing error ({batch_id}): {message}",
            code="BATCH_ERROR",
            details={"batch_id": batch_id, **(details or {})}
        )
