import sys
import os
from loguru import logger
from typing import Optional
from ..config.settings import settings


def setup_logging(
    log_level: Optional[str] = None,
    log_file: Optional[str] = None,
    json_format: bool = False
):
    logger.remove()
    
    log_level = log_level or settings.LOG_LEVEL
    log_file = log_file or settings.LOG_FILE
    
    log_dir = os.path.dirname(log_file)
    if log_dir and not os.path.exists(log_dir):
        os.makedirs(log_dir, exist_ok=True)
    
    console_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{extra[module]}</cyan>:<cyan>{extra[function]}</cyan>:<cyan>{extra[line]}</cyan> | "
        "<level>{message}</level>"
    )
    
    if settings.DEBUG:
        console_format = (
            "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan>\n"
            "    └── <level>{message}</level>"
        )
    
    logger.add(
        sys.stderr,
        format=console_format,
        level=log_level,
        colorize=True,
        backtrace=True,
        diagnose=settings.DEBUG,
    )
    
    file_format = (
        "{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | "
        "{name}:{function}:{line} | {message}"
    )
    
    if json_format:
        file_format = "{{\"timestamp\": \"{time:YYYY-MM-DDTHH:mm:ss.SSSZ}\", " \
                      "\"level\": \"{level}\", " \
                      "\"logger\": \"{name}\", " \
                      "\"function\": \"{function}\", " \
                      "\"line\": {line}, " \
                      "\"message\": \"{message}\"}}"
    
    logger.add(
        log_file,
        format=file_format,
        level=log_level,
        rotation=settings.LOG_ROTATION,
        retention=settings.LOG_RETENTION,
        compression="zip",
        backtrace=True,
        diagnose=settings.DEBUG,
        enqueue=True,
    )
    
    if settings.DEBUG:
        debug_log_file = log_file.replace(".log", "_debug.log")
        logger.add(
            debug_log_file,
            format=file_format,
            level="DEBUG",
            rotation=settings.LOG_ROTATION,
            retention="3 days",
            backtrace=True,
            diagnose=True,
            enqueue=True,
            filter=lambda record: record["level"].name == "DEBUG"
        )
    
    logger = logger.bind(module="unknown", function="unknown", line=0)
    
    return logger


def get_logger(module_name: str):
    return logger.bind(module=module_name)


class LogContext:
    def __init__(self, module: str, function: str, line: int = 0):
        self.module = module
        self.function = function
        self.line = line
        self.logger = logger.bind(module=module, function=function, line=line)
    
    def debug(self, message: str, **kwargs):
        self.logger.debug(message, **kwargs)
    
    def info(self, message: str, **kwargs):
        self.logger.info(message, **kwargs)
    
    def warning(self, message: str, **kwargs):
        self.logger.warning(message, **kwargs)
    
    def error(self, message: str, **kwargs):
        self.logger.error(message, **kwargs)
    
    def critical(self, message: str, **kwargs):
        self.logger.critical(message, **kwargs)
    
    def exception(self, message: str, **kwargs):
        self.logger.exception(message, **kwargs)


def log_function_call(func):
    import functools
    
    @functools.wraps(func)
    async def async_wrapper(*args, **kwargs):
        logger.debug(
            f"Calling {func.__name__} with args={args[:2]}..., kwargs={list(kwargs.keys())}"
        )
        try:
            result = await func(*args, **kwargs)
            logger.debug(f"{func.__name__} returned successfully")
            return result
        except Exception as e:
            logger.exception(f"{func.__name__} raised {type(e).__name__}: {e}")
            raise
    
    @functools.wraps(func)
    def sync_wrapper(*args, **kwargs):
        logger.debug(
            f"Calling {func.__name__} with args={args[:2]}..., kwargs={list(kwargs.keys())}"
        )
        try:
            result = func(*args, **kwargs)
            logger.debug(f"{func.__name__} returned successfully")
            return result
        except Exception as e:
            logger.exception(f"{func.__name__} raised {type(e).__name__}: {e}")
            raise
    
    import asyncio
    if asyncio.iscoroutinefunction(func):
        return async_wrapper
    return sync_wrapper


setup_logging()
