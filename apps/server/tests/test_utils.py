import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils.file import (
    get_file_info, file_exists, create_directory, get_temp_directory,
    create_temp_file, get_unique_filename
)
from app.utils.path import (
    get_absolute_path, get_filename, get_file_extension,
    join_paths, get_home_directory
)
from app.utils.crypto import (
    generate_uuid, generate_short_id, hash_password, verify_password,
    calculate_hash, generate_api_key, validate_email
)


class TestFileUtils:
    def test_file_exists_false(self):
        assert file_exists("/nonexistent/path/file.txt") == False
    
    def test_create_temp_file(self):
        path = create_temp_file(suffix=".txt", prefix="test_")
        assert file_exists(path) == True
        os.remove(path)
    
    def test_get_temp_directory(self):
        temp_dir = get_temp_directory()
        assert os.path.exists(temp_dir) == True
    
    def test_get_unique_filename(self):
        import tempfile
        with tempfile.TemporaryDirectory() as tmpdir:
            filename = get_unique_filename(tmpdir, "test.txt")
            assert filename.endswith("test.txt")
    
    def test_create_directory(self):
        import tempfile
        with tempfile.TemporaryDirectory() as tmpdir:
            new_dir = os.path.join(tmpdir, "new_folder")
            result = create_directory(new_dir)
            assert os.path.exists(new_dir) == True


class TestPathUtils:
    def test_get_filename(self):
        assert get_filename("/path/to/file.txt") == "file.txt"
    
    def test_get_file_extension(self):
        assert get_file_extension("/path/to/file.txt") == ".txt"
        assert get_file_extension("/path/to/file.PDF") == ".pdf"
    
    def test_join_paths(self):
        result = join_paths("/path", "to", "file.txt")
        assert "path" in result
        assert "file.txt" in result
    
    def test_get_home_directory(self):
        home = get_home_directory()
        assert os.path.exists(home) == True


class TestCryptoUtils:
    def test_generate_uuid(self):
        uuid = generate_uuid()
        assert len(uuid) == 36
        assert uuid.count("-") == 4
    
    def test_generate_short_id(self):
        id8 = generate_short_id(8)
        assert len(id8) == 8
        
        id16 = generate_short_id(16)
        assert len(id16) == 16
    
    def test_hash_and_verify_password(self):
        password = "test_password_123"
        hashed = hash_password(password)
        
        assert hashed != password
        assert verify_password(password, hashed) == True
        assert verify_password("wrong_password", hashed) == False
    
    def test_calculate_hash(self):
        data = "test data"
        hash1 = calculate_hash(data)
        hash2 = calculate_hash(data)
        
        assert hash1 == hash2
        assert len(hash1) == 64
    
    def test_generate_api_key(self):
        key = generate_api_key(32)
        assert len(key) > 30
    
    def test_validate_email(self):
        assert validate_email("test@example.com") == True
        assert validate_email("invalid-email") == False
        assert validate_email("test@") == False


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
