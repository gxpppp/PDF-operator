import socket
import subprocess
import sys
import time
from loguru import logger

def is_port_in_use(port: int, host: str = "127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind((host, port))
            return False
        except OSError:
            return True

def find_process_using_port(port: int) -> int | None:
    try:
        result = subprocess.run(
            ["netstat", "-ano"],
            capture_output=True,
            text=True,
            creationflags=subprocess.CREATE_NO_WINDOW
        )
        
        for line in result.stdout.split('\n'):
            if f":{port}" in line and "LISTENING" in line:
                parts = line.split()
                if len(parts) >= 5:
                    try:
                        return int(parts[-1])
                    except ValueError:
                        continue
        return None
    except Exception as e:
        logger.error(f"Error finding process: {e}")
        return None

def kill_process(pid: int) -> bool:
    try:
        subprocess.run(
            ["taskkill", "/F", "/PID", str(pid)],
            capture_output=True,
            creationflags=subprocess.CREATE_NO_WINDOW
        )
        logger.info(f"Killed process {pid}")
        time.sleep(0.5)
        return True
    except Exception as e:
        logger.error(f"Failed to kill process {pid}: {e}")
        return False

def ensure_port_available(port: int, host: str = "127.0.0.1", auto_kill: bool = True) -> bool:
    if not is_port_in_use(port, host):
        logger.info(f"Port {port} is available")
        return True
    
    if not auto_kill:
        logger.error(f"Port {port} is already in use")
        return False
    
    pid = find_process_using_port(port)
    if pid is None:
        logger.error(f"Port {port} is in use but could not find the process")
        return False
    
    logger.warning(f"Port {port} is in use by process {pid}, attempting to kill...")
    
    if kill_process(pid):
        time.sleep(0.5)
        if not is_port_in_use(port, host):
            logger.info(f"Port {port} is now available")
            return True
        else:
            logger.error(f"Port {port} is still in use after killing process")
            return False
    
    return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python port_manager.py <port> [--kill]")
        sys.exit(1)
    
    port = int(sys.argv[1])
    auto_kill = "--kill" in sys.argv
    
    if ensure_port_available(port, auto_kill=auto_kill):
        print(f"Port {port} is ready")
        sys.exit(0)
    else:
        print(f"Port {port} is not available")
        sys.exit(1)
