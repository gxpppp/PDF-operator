import os
import uuid
import asyncio
from datetime import datetime
from typing import List, Optional, Dict, Any

from ..schemas.plugin import (
    Plugin, PluginStatus, PluginInstallOptions, PluginInstallResult,
    PluginUpdateResult, PluginListResult, PluginConfig
)


class PluginService:
    def __init__(self):
        self._plugins: Dict[str, Plugin] = {}
        self._configs: Dict[str, PluginConfig] = {}

    async def list(self, status: Optional[List[PluginStatus]] = None,
                   page: int = 1, page_size: int = 20) -> PluginListResult:
        plugins = list(self._plugins.values())
        
        if status:
            plugins = [p for p in plugins if p.status in status]
        
        plugins.sort(key=lambda x: x.name)
        
        total = len(plugins)
        start = (page - 1) * page_size
        end = start + page_size
        
        return PluginListResult(
            plugins=plugins[start:end],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=(total + page_size - 1) // page_size
        )

    async def get(self, plugin_id: str) -> Optional[Plugin]:
        return self._plugins.get(plugin_id)

    async def install(self, options: PluginInstallOptions) -> PluginInstallResult:
        try:
            plugin_id = options.id
            
            if plugin_id in self._plugins and self._plugins[plugin_id].installed_version:
                return PluginInstallResult(
                    success=False,
                    error="Plugin already installed"
                )
            
            plugin = Plugin(
                id=plugin_id,
                name=plugin_id.replace("-", " ").title(),
                version=options.version or "1.0.0",
                description="Installed plugin",
                author="Unknown",
                license="MIT",
                status=PluginStatus.INSTALLED,
                installed_version=options.version or "1.0.0",
                enabled=options.enable_after_install,
                settings=[],
                permissions=[],
                installed_at=datetime.now()
            )
            
            self._plugins[plugin_id] = plugin
            self._configs[plugin_id] = PluginConfig(plugin_id=plugin_id, settings={})
            
            return PluginInstallResult(success=True, plugin=plugin)
            
        except Exception as e:
            return PluginInstallResult(success=False, error=str(e))

    async def uninstall(self, plugin_id: str) -> bool:
        if plugin_id not in self._plugins:
            return False
        
        del self._plugins[plugin_id]
        if plugin_id in self._configs:
            del self._configs[plugin_id]
        
        return True

    async def update(self, plugin_id: str, version: Optional[str] = None) -> PluginUpdateResult:
        plugin = self._plugins.get(plugin_id)
        if not plugin:
            return PluginUpdateResult(
                success=False,
                previous_version="",
                new_version="",
                error="Plugin not found"
            )
        
        previous_version = plugin.version
        new_version = version or "1.0.1"
        
        plugin.version = new_version
        plugin.installed_version = new_version
        plugin.updated_at = datetime.now()
        
        return PluginUpdateResult(
            success=True,
            previous_version=previous_version,
            new_version=new_version
        )

    async def enable(self, plugin_id: str) -> bool:
        plugin = self._plugins.get(plugin_id)
        if not plugin:
            return False
        
        plugin.enabled = True
        return True

    async def disable(self, plugin_id: str) -> bool:
        plugin = self._plugins.get(plugin_id)
        if not plugin:
            return False
        
        plugin.enabled = False
        return True

    async def get_config(self, plugin_id: str) -> Optional[PluginConfig]:
        return self._configs.get(plugin_id)

    async def update_config(self, plugin_id: str, settings: Dict[str, Any]) -> bool:
        if plugin_id not in self._plugins:
            return False
        
        if plugin_id not in self._configs:
            self._configs[plugin_id] = PluginConfig(plugin_id=plugin_id, settings={})
        
        self._configs[plugin_id].settings.update(settings)
        return True

    async def check_updates(self) -> List[Dict[str, str]]:
        updates = []
        for plugin in self._plugins.values():
            if plugin.latest_version and plugin.latest_version != plugin.version:
                updates.append({
                    "id": plugin.id,
                    "current_version": plugin.version,
                    "latest_version": plugin.latest_version
                })
        return updates

    async def update_all(self) -> List[PluginUpdateResult]:
        results = []
        updates = await self.check_updates()
        
        for update in updates:
            result = await self.update(update["id"], update["latest_version"])
            results.append(result)
        
        return results


plugin_service = PluginService()
