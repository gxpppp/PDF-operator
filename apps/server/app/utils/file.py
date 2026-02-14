import os
import hashlib
import shutil
import mimetypes
from pathlib import Path
from typing import Optional, List, Dict, Any, BinaryIO


def get_file_info(path: str) -> Dict[str, Any]:
    """Get file information"""
    path_obj = Path(path)
    
    if not path_obj.exists():
        raise FileNotFoundError(f"File not found: {path}")
    
    stat = path_obj.stat()
    
    return {
        "path": str(path_obj.absolute()),
        "name": path_obj.name,
        "size": stat.st_size,
        "is_dir": path_obj.is_dir(),
        "is_file": path_obj.is_file(),
        "extension": path_obj.suffix.lower(),
        "mime_type": get_mime_type(path),
        "created": stat.st_ctime,
        "modified": stat.st_mtime,
        "accessed": stat.st_atime,
    }


def get_mime_type(path: str) -> str:
    """Get MIME type of file"""
    mime_type, _ = mimetypes.guess_type(path)
    return mime_type or "application/octet-stream"


def get_file_hash(path: str, algorithm: str = "sha256") -> str:
    """Calculate file hash"""
    hash_func = hashlib.new(algorithm)
    
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            hash_func.update(chunk)
    
    return hash_func.hexdigest()


def read_file(path: str, encoding: Optional[str] = None) -> Any:
    """Read file content"""
    path_obj = Path(path)
    
    if encoding:
        return path_obj.read_text(encoding=encoding)
    
    return path_obj.read_bytes()


def write_file(path: str, content: Any, encoding: Optional[str] = None) -> None:
    """Write content to file"""
    path_obj = Path(path)
    path_obj.parent.mkdir(parents=True, exist_ok=True)
    
    if isinstance(content, str):
        path_obj.write_text(content, encoding=encoding or "utf-8")
    else:
        path_obj.write_bytes(content)


def delete_file(path: str) -> bool:
    """Delete file or directory"""
    path_obj = Path(path)
    
    if not path_obj.exists():
        return False
    
    if path_obj.is_dir():
        shutil.rmtree(path_obj)
    else:
        path_obj.unlink()
    
    return True


def copy_file(src: str, dst: str) -> str:
    """Copy file to destination"""
    src_path = Path(src)
    dst_path = Path(dst)
    
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    
    if src_path.is_dir():
        shutil.copytree(src_path, dst_path)
    else:
        shutil.copy2(src_path, dst_path)
    
    return str(dst_path.absolute())


def move_file(src: str, dst: str) -> str:
    """Move file to destination"""
    src_path = Path(src)
    dst_path = Path(dst)
    
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(src_path), str(dst_path))
    
    return str(dst_path.absolute())


def list_directory(path: str, pattern: Optional[str] = None) -> List[Dict[str, Any]]:
    """List directory contents"""
    path_obj = Path(path)
    
    if not path_obj.is_dir():
        raise NotADirectoryError(f"Not a directory: {path}")
    
    items = []
    
    for item in path_obj.iterdir():
        if pattern and not item.match(pattern):
            continue
        
        items.append({
            "name": item.name,
            "path": str(item.absolute()),
            "is_dir": item.is_dir(),
            "is_file": item.is_file(),
            "extension": item.suffix.lower() if item.is_file() else None,
        })
    
    return items


def create_directory(path: str) -> str:
    """Create directory"""
    path_obj = Path(path)
    path_obj.mkdir(parents=True, exist_ok=True)
    return str(path_obj.absolute())


def file_exists(path: str) -> bool:
    """Check if file exists"""
    return Path(path).exists()


def get_file_size(path: str) -> int:
    """Get file size in bytes"""
    return Path(path).stat().st_size


def get_temp_directory() -> str:
    """Get temporary directory path"""
    import tempfile
    return tempfile.gettempdir()


def create_temp_file(suffix: Optional[str] = None, prefix: Optional[str] = None) -> str:
    """Create temporary file"""
    import tempfile
    
    fd, path = tempfile.mkstemp(suffix=suffix, prefix=prefix)
    os.close(fd)
    
    return path


def create_temp_directory(prefix: Optional[str] = None) -> str:
    """Create temporary directory"""
    import tempfile
    return tempfile.mkdtemp(prefix=prefix)


def get_unique_filename(directory: str, filename: str) -> str:
    """Get unique filename in directory"""
    path = Path(directory) / filename
    
    if not path.exists():
        return str(path)
    
    stem = path.stem
    suffix = path.suffix
    counter = 1
    
    while path.exists():
        path = path.parent / f"{stem} ({counter}){suffix}"
        counter += 1
    
    return str(path)


def split_file(path: str, chunk_size: int) -> List[str]:
    """Split file into chunks"""
    chunks = []
    chunk_num = 0
    
    with open(path, "rb") as f:
        while True:
            chunk_data = f.read(chunk_size)
            if not chunk_data:
                break
            
            chunk_path = f"{path}.part{chunk_num}"
            with open(chunk_path, "wb") as chunk_file:
                chunk_file.write(chunk_data)
            
            chunks.append(chunk_path)
            chunk_num += 1
    
    return chunks


def join_files(file_paths: List[str], output_path: str) -> str:
    """Join multiple files into one"""
    with open(output_path, "wb") as output_file:
        for file_path in file_paths:
            with open(file_path, "rb") as input_file:
                shutil.copyfileobj(input_file, output_file)
    
    return output_path
