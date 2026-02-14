import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.pdf_service import pdf_service
from app.services.ocr_service import ocr_service
from app.services.ai_service import ai_service
from app.services.convert_service import convert_service
from app.services.security_service import security_service
from app.services.batch_service import batch_service
from app.services.workflow_service import workflow_service
from app.services.plugin_service import plugin_service


class TestPDFService:
    def test_get_metadata_nonexistent_file(self):
        import asyncio
        with pytest.raises(FileNotFoundError):
            asyncio.run(pdf_service.get_metadata("/nonexistent/file.pdf"))
    
    def test_supported_operations(self):
        operations = pdf_service.get_supported_operations()
        assert isinstance(operations, list)
        assert "merge" in operations
        assert "split" in operations


class TestConvertService:
    def test_get_supported_formats(self):
        formats = convert_service.get_supported_formats()
        assert isinstance(formats, list)
        assert len(formats) > 0
    
    def test_format_structure(self):
        formats = convert_service.get_supported_formats()
        for fmt in formats:
            assert "format" in fmt
            assert "name" in fmt
            assert "input_ext" in fmt
            assert "output_ext" in fmt


class TestOCRService:
    @pytest.mark.asyncio
    async def test_get_languages(self):
        languages = await ocr_service.get_languages()
        assert isinstance(languages, list)
        assert len(languages) > 0
    
    @pytest.mark.asyncio
    async def test_get_engines(self):
        engines = await ocr_service.get_engines()
        assert isinstance(engines, list)
        assert len(engines) > 0


class TestAIService:
    @pytest.mark.asyncio
    async def test_get_models(self):
        models = await ai_service.get_models()
        assert isinstance(models, list)
    
    @pytest.mark.asyncio
    async def test_get_providers(self):
        providers = await ai_service.get_providers()
        assert isinstance(providers, list)


class TestBatchService:
    @pytest.mark.asyncio
    async def test_list_empty_tasks(self):
        from app.schemas.batch import BatchTaskStatus
        result = await batch_service.list(status=[BatchTaskStatus.PENDING])
        assert result.total >= 0


class TestWorkflowService:
    @pytest.mark.asyncio
    async def test_list_empty_workflows(self):
        result = await workflow_service.list()
        assert result.total >= 0
    
    @pytest.mark.asyncio
    async def test_create_workflow(self):
        from app.schemas.workflow import WorkflowCreateOptions, WorkflowNode, WorkflowNodeType
        options = WorkflowCreateOptions(
            name="Test Workflow",
            nodes=[
                WorkflowNode(
                    id="start-1",
                    type=WorkflowNodeType.START,
                    name="Start",
                    position={"x": 0, "y": 0},
                    config={},
                    inputs=[],
                    outputs=[]
                )
            ],
            edges=[]
        )
        workflow = await workflow_service.create(options)
        assert workflow.name == "Test Workflow"
        assert workflow.status.value == "draft"


class TestPluginService:
    @pytest.mark.asyncio
    async def test_list_plugins(self):
        result = await plugin_service.list()
        assert result.total >= 0


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
