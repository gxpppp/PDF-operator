from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from loguru import logger


class BasePlugin(ABC):
    name: str = ""
    version: str = "1.0.0"
    description: str = ""
    author: str = ""
    
    def __init__(self):
        self.enabled = True
        self.config: Dict[str, Any] = {}
    
    @abstractmethod
    def initialize(self) -> bool:
        pass
    
    @abstractmethod
    def shutdown(self) -> None:
        pass
    
    def configure(self, config: Dict[str, Any]) -> None:
        self.config = config
    
    def get_info(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "version": self.version,
            "description": self.description,
            "author": self.author,
            "enabled": self.enabled
        }


class PluginManager:
    def __init__(self):
        self.plugins: Dict[str, BasePlugin] = {}
        self.hooks: Dict[str, List[callable]] = {}
    
    def register(self, plugin: BasePlugin) -> bool:
        if plugin.name in self.plugins:
            logger.warning(f"Plugin {plugin.name} already registered")
            return False
        
        try:
            if plugin.initialize():
                self.plugins[plugin.name] = plugin
                logger.info(f"Plugin {plugin.name} registered successfully")
                return True
        except Exception as e:
            logger.error(f"Failed to initialize plugin {plugin.name}: {e}")
        
        return False
    
    def unregister(self, name: str) -> bool:
        if name not in self.plugins:
            return False
        
        try:
            self.plugins[name].shutdown()
            del self.plugins[name]
            logger.info(f"Plugin {name} unregistered")
            return True
        except Exception as e:
            logger.error(f"Failed to shutdown plugin {name}: {e}")
            return False
    
    def get_plugin(self, name: str) -> Optional[BasePlugin]:
        return self.plugins.get(name)
    
    def get_all_plugins(self) -> List[Dict[str, Any]]:
        return [plugin.get_info() for plugin in self.plugins.values()]
    
    def enable(self, name: str) -> bool:
        if name in self.plugins:
            self.plugins[name].enabled = True
            return True
        return False
    
    def disable(self, name: str) -> bool:
        if name in self.plugins:
            self.plugins[name].enabled = False
            return True
        return False
    
    def register_hook(self, hook_name: str, callback: callable) -> None:
        if hook_name not in self.hooks:
            self.hooks[hook_name] = []
        self.hooks[hook_name].append(callback)
    
    def execute_hook(self, hook_name: str, *args, **kwargs) -> List[Any]:
        results = []
        if hook_name in self.hooks:
            for callback in self.hooks[hook_name]:
                try:
                    result = callback(*args, **kwargs)
                    results.append(result)
                except Exception as e:
                    logger.error(f"Hook {hook_name} callback failed: {e}")
        return results


plugin_manager = PluginManager()
