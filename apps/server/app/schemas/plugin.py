from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime


class PluginStatus(str, Enum):
    INSTALLED = "installed"
    AVAILABLE = "available"
    UPDATING = "updating"
    ERROR = "error"


class PluginPermissionType(str, Enum):
    FILESYSTEM = "filesystem"
    NETWORK = "network"
    SYSTEM = "system"
    CLIPBOARD = "clipboard"


class PluginPermissionAccess(str, Enum):
    READ = "read"
    WRITE = "write"
    EXECUTE = "execute"
    FULL = "full"


class PluginSettingOption(BaseModel):
    value: Any
    label: str


class PluginSettingValidation(BaseModel):
    min: Optional[float] = None
    max: Optional[float] = None
    pattern: Optional[str] = None
    message: Optional[str] = None


class PluginSetting(BaseModel):
    key: str
    type: str
    label: str
    description: Optional[str] = None
    default: Any
    options: Optional[List[PluginSettingOption]] = None
    required: Optional[bool] = None
    validation: Optional[PluginSettingValidation] = None


class PluginPermission(BaseModel):
    type: PluginPermissionType
    access: PluginPermissionAccess
    description: Optional[str] = None


class Plugin(BaseModel):
    id: str
    name: str
    version: str
    description: str
    author: str
    homepage: Optional[str] = None
    repository: Optional[str] = None
    license: str
    status: PluginStatus
    installed_version: Optional[str] = None
    latest_version: Optional[str] = None
    enabled: bool
    settings: List[PluginSetting]
    permissions: List[PluginPermission]
    installed_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    icon: Optional[str] = None
    screenshots: Optional[List[str]] = None
    downloads: Optional[int] = None
    rating: Optional[float] = None
    tags: Optional[List[str]] = None


class PluginInstallOptions(BaseModel):
    id: str
    version: Optional[str] = None
    source: str = "market"
    file_path: Optional[str] = None
    url: Optional[str] = None
    enable_after_install: bool = True


class PluginInstallResult(BaseModel):
    success: bool
    plugin: Optional[Plugin] = None
    error: Optional[str] = None


class PluginUpdateOptions(BaseModel):
    id: str
    version: Optional[str] = None


class PluginUpdateResult(BaseModel):
    success: bool
    previous_version: str
    new_version: str
    error: Optional[str] = None


class PluginListOptions(BaseModel):
    status: Optional[List[PluginStatus]] = None
    enabled: Optional[bool] = None
    search: Optional[str] = None
    tags: Optional[List[str]] = None
    sort_by: str = "name"
    sort_order: str = "asc"
    page: int = 1
    page_size: int = 20


class PluginListResult(BaseModel):
    plugins: List[Plugin]
    total: int
    page: int
    page_size: int
    total_pages: int


class PluginCategory(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    count: int


class PluginMarketOptions(BaseModel):
    category: Optional[str] = None
    search: Optional[str] = None
    sort_by: str = "popular"
    page: int = 1
    page_size: int = 20


class PluginMarketResult(BaseModel):
    plugins: List[Plugin]
    categories: List[PluginCategory]
    total: int
    page: int
    page_size: int
    total_pages: int


class PluginConfig(BaseModel):
    plugin_id: str
    settings: Dict[str, Any]


class PluginLog(BaseModel):
    id: str
    plugin_id: str
    level: str
    message: str
    timestamp: datetime
    details: Optional[Dict[str, Any]] = None


class PluginLogOptions(BaseModel):
    plugin_id: Optional[str] = None
    level: Optional[List[str]] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    page: int = 1
    page_size: int = 50
