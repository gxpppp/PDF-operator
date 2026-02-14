import os
import json
import yaml
import toml
from pathlib import Path
from typing import Dict, Any, Optional, Union


def read_json(path: str) -> Dict[str, Any]:
    """Read JSON file"""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_json(path: str, data: Dict[str, Any], indent: int = 2) -> None:
    """Write JSON file"""
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=indent, ensure_ascii=False)


def read_yaml(path: str) -> Dict[str, Any]:
    """Read YAML file"""
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def write_yaml(path: str, data: Dict[str, Any]) -> None:
    """Write YAML file"""
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        yaml.dump(data, f, default_flow_style=False, allow_unicode=True)


def read_toml(path: str) -> Dict[str, Any]:
    """Read TOML file"""
    with open(path, "r", encoding="utf-8") as f:
        return toml.load(f)


def write_toml(path: str, data: Dict[str, Any]) -> None:
    """Write TOML file"""
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        toml.dump(data, f)


def read_text(path: str, encoding: str = "utf-8") -> str:
    """Read text file"""
    with open(path, "r", encoding=encoding) as f:
        return f.read()


def write_text(path: str, content: str, encoding: str = "utf-8") -> None:
    """Write text file"""
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding=encoding) as f:
        f.write(content)


def read_lines(path: str, encoding: str = "utf-8") -> list:
    """Read file as lines"""
    with open(path, "r", encoding=encoding) as f:
        return f.readlines()


def write_lines(path: str, lines: list, encoding: str = "utf-8") -> None:
    """Write lines to file"""
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding=encoding) as f:
        f.writelines(lines)


def append_text(path: str, content: str, encoding: str = "utf-8") -> None:
    """Append text to file"""
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, "a", encoding=encoding) as f:
        f.write(content)


def read_csv(path: str, delimiter: str = ",") -> list:
    """Read CSV file"""
    import csv
    with open(path, "r", encoding="utf-8", newline="") as f:
        reader = csv.reader(f, delimiter=delimiter)
        return list(reader)


def write_csv(path: str, data: list, delimiter: str = ",") -> None:
    """Write CSV file"""
    import csv
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f, delimiter=delimiter)
        writer.writerows(data)


def detect_encoding(path: str) -> str:
    """Detect file encoding"""
    import chardet
    
    with open(path, "rb") as f:
        result = chardet.detect(f.read())
    
    return result.get("encoding", "utf-8")


def get_file_format(path: str) -> str:
    """Get file format from extension"""
    ext = Path(path).suffix.lower()
    
    formats = {
        ".json": "json",
        ".yaml": "yaml",
        ".yml": "yaml",
        ".toml": "toml",
        ".txt": "text",
        ".csv": "csv",
        ".xml": "xml",
        ".ini": "ini",
    }
    
    return formats.get(ext, "unknown")


def parse_file(path: str) -> Dict[str, Any]:
    """Parse file based on format"""
    format_type = get_file_format(path)
    
    if format_type == "json":
        return read_json(path)
    elif format_type == "yaml":
        return read_yaml(path)
    elif format_type == "toml":
        return read_toml(path)
    elif format_type == "text":
        return {"content": read_text(path)}
    else:
        return {"content": read_text(path)}
