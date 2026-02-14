import subprocess
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from scripts.port_manager import ensure_port_available
from loguru import logger

def start_server(port: int = 8080, host: str = "127.0.0.1"):
    logger.info(f"Preparing to start server on {host}:{port}")
    
    if not ensure_port_available(port, host, auto_kill=True):
        logger.error(f"Failed to free port {port}")
        sys.exit(1)
    
    os.environ["DEBUG"] = "true"
    os.environ["LOG_LEVEL"] = "DEBUG"
    
    logger.info(f"Starting FastAPI server on {host}:{port}")
    
    subprocess.run([
        sys.executable, "-m", "uvicorn",
        "app.main:app",
        "--host", host,
        "--port", str(port),
        "--reload",
        "--log-level", "debug"
    ])

if __name__ == "__main__":
    port = 8080
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    
    start_server(port)
