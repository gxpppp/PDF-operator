import pytest
import asyncio
from httpx import AsyncClient
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
async def async_client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


class TestHealthCheck:
    def test_health_endpoint(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data


class TestPDFEndpoints:
    def test_get_pdf_info_not_found(self, client):
        response = client.get("/api/v1/pdf/info/nonexistent.pdf")
        assert response.status_code in [404, 400]
    
    def test_merge_pdf_no_files(self, client):
        response = client.post("/api/v1/pdf/merge", json={
            "input_paths": [],
            "output_path": "test_output.pdf"
        })
        assert response.status_code in [400, 422]


class TestOCREndpoints:
    def test_get_languages(self, client):
        response = client.get("/api/v1/ocr/languages")
        assert response.status_code == 200
    
    def test_get_engines(self, client):
        response = client.get("/api/v1/ocr/engines")
        assert response.status_code == 200


class TestAIEndpoints:
    def test_get_models(self, client):
        response = client.get("/api/v1/ai/models")
        assert response.status_code == 200
    
    def test_get_providers(self, client):
        response = client.get("/api/v1/ai/providers")
        assert response.status_code == 200


class TestConvertEndpoints:
    def test_get_supported_formats(self, client):
        response = client.get("/api/v1/convert/formats")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestBatchEndpoints:
    def test_list_tasks(self, client):
        response = client.get("/api/v1/batch/tasks")
        assert response.status_code == 200


class TestWorkflowEndpoints:
    def test_list_workflows(self, client):
        response = client.get("/api/v1/workflow/list")
        assert response.status_code == 200


class TestPluginEndpoints:
    def test_list_plugins(self, client):
        response = client.get("/api/v1/plugins")
        assert response.status_code == 200


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
