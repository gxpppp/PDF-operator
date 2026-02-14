from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from loguru import logger


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except HTTPException as e:
            logger.error(f"HTTP Exception: {e.status_code} - {e.detail}")
            return JSONResponse(
                status_code=e.status_code,
                content={
                    "error": True,
                    "message": e.detail,
                    "status_code": e.status_code
                }
            )
        except Exception as e:
            logger.exception(f"Unhandled exception: {str(e)}")
            return JSONResponse(
                status_code=500,
                content={
                    "error": True,
                    "message": "Internal server error",
                    "detail": str(e) if request.app.debug else None
                }
            )
