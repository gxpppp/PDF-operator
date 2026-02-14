import os
import re
import uuid
import hashlib
import secrets
from typing import Optional, List, Dict, Any


def generate_uuid() -> str:
    """Generate UUID"""
    return str(uuid.uuid4())


def generate_short_id(length: int = 8) -> str:
    """Generate short ID"""
    return secrets.token_hex(length // 2 + 1)[:length]


def hash_password(password: str, salt: Optional[str] = None) -> str:
    """Hash password with salt"""
    if salt is None:
        salt = secrets.token_hex(16)
    
    hashed = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000
    )
    
    return f"{salt}:{hashed.hex()}"


def verify_password(password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    try:
        salt, hash_value = hashed_password.split(":")
        
        new_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            100000
        )
        
        return new_hash.hex() == hash_value
    except:
        return False


def encrypt_data(data: str, key: str) -> str:
    """Encrypt data with key"""
    from cryptography.fernet import Fernet
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    import base64
    
    salt = b"pdf_master_salt"
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    
    key_bytes = kdf.derive(key.encode())
    fernet_key = base64.urlsafe_b64encode(key_bytes)
    fernet = Fernet(fernet_key)
    
    return fernet.encrypt(data.encode()).decode()


def decrypt_data(encrypted_data: str, key: str) -> str:
    """Decrypt data with key"""
    from cryptography.fernet import Fernet
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    import base64
    
    salt = b"pdf_master_salt"
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    
    key_bytes = kdf.derive(key.encode())
    fernet_key = base64.urlsafe_b64encode(key_bytes)
    fernet = Fernet(fernet_key)
    
    return fernet.decrypt(encrypted_data.encode()).decode()


def calculate_hash(data: str, algorithm: str = "sha256") -> str:
    """Calculate hash of data"""
    hash_func = hashlib.new(algorithm)
    hash_func.update(data.encode("utf-8"))
    return hash_func.hexdigest()


def calculate_file_hash(path: str, algorithm: str = "sha256") -> str:
    """Calculate hash of file"""
    hash_func = hashlib.new(algorithm)
    
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            hash_func.update(chunk)
    
    return hash_func.hexdigest()


def generate_api_key(length: int = 32) -> str:
    """Generate API key"""
    return secrets.token_urlsafe(length)


def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))


def validate_password_strength(password: str) -> Dict[str, Any]:
    """Validate password strength"""
    result = {
        "valid": True,
        "score": 0,
        "messages": []
    }
    
    if len(password) < 8:
        result["valid"] = False
        result["messages"].append("Password must be at least 8 characters")
    else:
        result["score"] += 1
    
    if not re.search(r"[a-z]", password):
        result["messages"].append("Password should contain lowercase letters")
    else:
        result["score"] += 1
    
    if not re.search(r"[A-Z]", password):
        result["messages"].append("Password should contain uppercase letters")
    else:
        result["score"] += 1
    
    if not re.search(r"\d", password):
        result["messages"].append("Password should contain numbers")
    else:
        result["score"] += 1
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        result["messages"].append("Password should contain special characters")
    else:
        result["score"] += 1
    
    return result


def mask_sensitive_data(data: str, visible_chars: int = 4) -> str:
    """Mask sensitive data"""
    if len(data) <= visible_chars:
        return "*" * len(data)
    
    return data[:visible_chars] + "*" * (len(data) - visible_chars)
