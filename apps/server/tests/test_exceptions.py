import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils.exceptions import (
    PDFMasterError, FileNotFoundError, InvalidFileFormatError,
    FileTooLargeError, PasswordRequiredError, IncorrectPasswordError,
    ProcessingError, ConversionError, OCRError, AIError,
    SecurityError, ValidationError, PluginError, WorkflowError
)


class TestExceptions:
    def test_base_exception(self):
        exc = PDFMasterError("Test error", code="TEST_ERROR", details={"key": "value"})
        
        assert exc.message == "Test error"
        assert exc.code == "TEST_ERROR"
        assert exc.details == {"key": "value"}
        
        result = exc.to_dict()
        assert result["code"] == "TEST_ERROR"
        assert result["message"] == "Test error"
    
    def test_file_not_found_error(self):
        exc = FileNotFoundError("/path/to/file.pdf")
        
        assert exc.code == "FILE_NOT_FOUND"
        assert "/path/to/file.pdf" in exc.message
        assert exc.details["path"] == "/path/to/file.pdf"
    
    def test_invalid_file_format_error(self):
        exc = InvalidFileFormatError("/path/to/file.txt", "PDF")
        
        assert exc.code == "INVALID_FILE_FORMAT"
        assert exc.details["expected_format"] == "PDF"
    
    def test_file_too_large_error(self):
        exc = FileTooLargeError(size=1000000, max_size=500000)
        
        assert exc.code == "FILE_TOO_LARGE"
        assert exc.details["size"] == 1000000
        assert exc.details["max_size"] == 500000
    
    def test_password_required_error(self):
        exc = PasswordRequiredError("/encrypted.pdf")
        
        assert exc.code == "PASSWORD_REQUIRED"
        assert exc.details["path"] == "/encrypted.pdf"
    
    def test_incorrect_password_error(self):
        exc = IncorrectPasswordError()
        
        assert exc.code == "INCORRECT_PASSWORD"
    
    def test_processing_error(self):
        exc = ProcessingError("merge", "Failed to merge files")
        
        assert exc.code == "PROCESSING_ERROR"
        assert exc.details["operation"] == "merge"
    
    def test_conversion_error(self):
        exc = ConversionError("PDF", "Word", "Conversion failed")
        
        assert exc.code == "CONVERSION_ERROR"
        assert exc.details["source_format"] == "PDF"
        assert exc.details["target_format"] == "Word"
    
    def test_ocr_error(self):
        exc = OCRError("OCR processing failed")
        
        assert exc.code == "OCR_ERROR"
    
    def test_ai_error(self):
        exc = AIError("openai", "API rate limit exceeded")
        
        assert exc.code == "AI_ERROR"
        assert exc.details["provider"] == "openai"
    
    def test_security_error(self):
        exc = SecurityError("Invalid encryption key")
        
        assert exc.code == "SECURITY_ERROR"
    
    def test_validation_error(self):
        exc = ValidationError("email", "Invalid email format")
        
        assert exc.code == "VALIDATION_ERROR"
        assert exc.details["field"] == "email"
    
    def test_plugin_error(self):
        exc = PluginError("plugin-123", "Plugin initialization failed")
        
        assert exc.code == "PLUGIN_ERROR"
        assert exc.details["plugin_id"] == "plugin-123"
    
    def test_workflow_error(self):
        exc = WorkflowError("workflow-456", "Node execution failed")
        
        assert exc.code == "WORKFLOW_ERROR"
        assert exc.details["workflow_id"] == "workflow-456"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
