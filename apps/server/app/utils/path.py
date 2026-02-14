import os
from pathlib import Path
from typing import Optional, List


def get_absolute_path(path: str) -> str:
    """Get absolute path"""
    return str(Path(path).absolute())


def get_relative_path(path: str, base: str) -> str:
    """Get relative path from base"""
    return str(Path(path).relative_to(base))


def join_paths(*paths: str) -> str:
    """Join multiple paths"""
    return str(Path(*paths))


def get_parent_path(path: str) -> str:
    """Get parent directory path"""
    return str(Path(path).parent)


def get_filename(path: str) -> str:
    """Get filename from path"""
    return Path(path).name


def get_file_stem(path: str) -> str:
    """Get filename without extension"""
    return Path(path).stem


def get_file_extension(path: str) -> str:
    """Get file extension"""
    return Path(path).suffix.lower()


def change_extension(path: str, new_extension: str) -> str:
    """Change file extension"""
    path_obj = Path(path)
    return str(path_obj.with_suffix(new_extension))


def remove_extension(path: str) -> str:
    """Remove file extension"""
    path_obj = Path(path)
    return str(path_obj.with_suffix(""))


def is_absolute_path(path: str) -> bool:
    """Check if path is absolute"""
    return Path(path).is_absolute()


def is_relative_path(path: str) -> bool:
    """Check if path is relative"""
    return not Path(path).is_absolute()


def normalize_path(path: str) -> str:
    """Normalize path"""
    return str(Path(path).resolve())


def ensure_directory(path: str) -> str:
    """Ensure directory exists"""
    path_obj = Path(path)
    path_obj.mkdir(parents=True, exist_ok=True)
    return str(path_obj)


def get_home_directory() -> str:
    """Get user home directory"""
    return str(Path.home())


def get_documents_directory() -> str:
    """Get documents directory"""
    home = Path.home()
    
    docs_paths = [
        home / "Documents",
        home / "documents",
        home / "docs",
    ]
    
    for docs_path in docs_paths:
        if docs_path.exists():
            return str(docs_path)
    
    return str(home)


def get_downloads_directory() -> str:
    """Get downloads directory"""
    home = Path.home()
    
    downloads_paths = [
        home / "Downloads",
        home / "downloads",
    ]
    
    for downloads_path in downloads_paths:
        if downloads_path.exists():
            return str(downloads_path)
    
    return str(home)


def get_desktop_directory() -> str:
    """Get desktop directory"""
    home = Path.home()
    
    desktop_paths = [
        home / "Desktop",
        home / "desktop",
    ]
    
    for desktop_path in desktop_paths:
        if desktop_path.exists():
            return str(desktop_path)
    
    return str(home)


def get_app_data_directory(app_name: str = "pdf-master") -> str:
    """Get application data directory"""
    if os.name == "nt":
        base = Path(os.environ.get("APPDATA", Path.home()))
    elif os.name == "darwin":
        base = Path.home() / "Library" / "Application Support"
    else:
        base = Path.home() / ".local" / "share"
    
    app_dir = base / app_name
    app_dir.mkdir(parents=True, exist_ok=True)
    
    return str(app_dir)


def get_cache_directory(app_name: str = "pdf-master") -> str:
    """Get cache directory"""
    if os.name == "nt":
        base = Path(os.environ.get("LOCALAPPDATA", Path.home()))
    elif os.name == "darwin":
        base = Path.home() / "Library" / "Caches"
    else:
        base = Path.home() / ".cache"
    
    cache_dir = base / app_name
    cache_dir.mkdir(parents=True, exist_ok=True)
    
    return str(cache_dir)


def get_temp_directory(app_name: str = "pdf-master") -> str:
    """Get temp directory for app"""
    import tempfile
    
    temp_dir = Path(tempfile.gettempdir()) / app_name
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    return str(temp_dir)


def find_files(directory: str, pattern: str, recursive: bool = True) -> List[str]:
    """Find files matching pattern"""
    dir_path = Path(directory)
    
    if recursive:
        return [str(p) for p in dir_path.rglob(pattern)]
    else:
        return [str(p) for p in dir_path.glob(pattern)]


def is_subdirectory(path: str, parent: str) -> bool:
    """Check if path is subdirectory of parent"""
    try:
        Path(path).relative_to(parent)
        return True
    except ValueError:
        return False


def get_common_path(paths: List[str]) -> Optional[str]:
    """Get common path prefix"""
    if not paths:
        return None
    
    path_objs = [Path(p) for p in paths]
    common = Path(os.path.commonpath([str(p) for p in path_objs]))
    
    return str(common)
