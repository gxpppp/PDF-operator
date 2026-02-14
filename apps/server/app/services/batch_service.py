import os
import time
import uuid
import asyncio
from datetime import datetime
from typing import List, Optional, Dict, Any

from ..schemas.batch import (
    BatchTask, BatchTaskType, BatchTaskStatus, BatchProgress,
    BatchCreateOptions, BatchResult, BatchError, BatchListResult
)


class BatchService:
    def __init__(self):
        self._tasks: Dict[str, BatchTask] = {}
        self._running = False

    async def create(self, options: BatchCreateOptions) -> BatchTask:
        task_id = str(uuid.uuid4())
        task = BatchTask(
            id=task_id,
            name=options.name,
            type=options.type,
            status=BatchTaskStatus.PENDING,
            input_files=options.input_files,
            output_dir=options.output_dir,
            options=options.options,
            progress=BatchProgress(
                total=len(options.input_files),
                completed=0,
                failed=0,
                percentage=0
            ),
            created_at=datetime.now()
        )
        self._tasks[task_id] = task

        if options.auto_start:
            asyncio.create_task(self._run_task(task_id, options))

        return task

    async def get(self, task_id: str) -> Optional[BatchTask]:
        return self._tasks.get(task_id)

    async def list(self, status: Optional[List[BatchTaskStatus]] = None, 
                   page: int = 1, page_size: int = 20) -> BatchListResult:
        tasks = list(self._tasks.values())
        
        if status:
            tasks = [t for t in tasks if t.status in status]
        
        tasks.sort(key=lambda x: x.created_at, reverse=True)
        
        total = len(tasks)
        start = (page - 1) * page_size
        end = start + page_size
        
        return BatchListResult(
            tasks=tasks[start:end],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=(total + page_size - 1) // page_size
        )

    async def start(self, task_id: str) -> bool:
        task = self._tasks.get(task_id)
        if not task or task.status != BatchTaskStatus.PENDING:
            return False
        
        task.status = BatchTaskStatus.RUNNING
        task.started_at = datetime.now()
        
        asyncio.create_task(self._run_task(task_id, BatchCreateOptions(
            name=task.name,
            type=task.type,
            input_files=task.input_files,
            output_dir=task.output_dir,
            options=task.options
        )))
        
        return True

    async def pause(self, task_id: str) -> bool:
        task = self._tasks.get(task_id)
        if not task or task.status != BatchTaskStatus.RUNNING:
            return False
        
        task.status = BatchTaskStatus.PENDING
        return True

    async def cancel(self, task_id: str) -> bool:
        task = self._tasks.get(task_id)
        if not task or task.status not in [BatchTaskStatus.PENDING, BatchTaskStatus.RUNNING]:
            return False
        
        task.status = BatchTaskStatus.CANCELLED
        task.completed_at = datetime.now()
        return True

    async def delete(self, task_id: str) -> bool:
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False

    async def retry(self, task_id: str) -> bool:
        task = self._tasks.get(task_id)
        if not task or task.status != BatchTaskStatus.FAILED:
            return False
        
        task.status = BatchTaskStatus.PENDING
        task.progress = BatchProgress(
            total=len(task.input_files),
            completed=0,
            failed=0,
            percentage=0
        )
        task.result = None
        
        return True

    async def _run_task(self, task_id: str, options: BatchCreateOptions):
        task = self._tasks.get(task_id)
        if not task:
            return

        task.status = BatchTaskStatus.RUNNING
        task.started_at = datetime.now()
        
        output_files: List[str] = []
        failed_files: List[str] = []
        errors: List[BatchError] = []
        start_time = time.time()

        try:
            for i, input_file in enumerate(task.input_files):
                if task.status == BatchTaskStatus.CANCELLED:
                    break

                task.progress.current_file = input_file
                
                try:
                    output_path = await self._process_file(
                        input_file,
                        task.output_dir,
                        task.type,
                        task.options
                    )
                    output_files.append(output_path)
                    task.progress.completed += 1
                except Exception as e:
                    failed_files.append(input_file)
                    errors.append(BatchError(
                        file=input_file,
                        error=str(e)
                    ))
                    task.progress.failed += 1

                task.progress.percentage = ((i + 1) / len(task.input_files)) * 100

            task.result = BatchResult(
                success=len(failed_files) == 0,
                output_files=output_files,
                failed_files=failed_files,
                errors=errors,
                total_processing_time=time.time() - start_time
            )
            
            task.status = BatchTaskStatus.COMPLETED if len(failed_files) == 0 else BatchTaskStatus.FAILED
            
        except Exception as e:
            task.status = BatchTaskStatus.FAILED
            task.result = BatchResult(
                success=False,
                output_files=output_files,
                failed_files=task.input_files,
                errors=[BatchError(file="task", error=str(e))],
                total_processing_time=time.time() - start_time
            )
        
        task.completed_at = datetime.now()

    async def _process_file(
        self,
        input_file: str,
        output_dir: str,
        task_type: BatchTaskType,
        options: Dict[str, Any]
    ) -> str:
        input_name = os.path.splitext(os.path.basename(input_file))[0]
        
        if task_type == BatchTaskType.MERGE:
            output_path = os.path.join(output_dir, f"{input_name}_merged.pdf")
        elif task_type == BatchTaskType.SPLIT:
            output_path = os.path.join(output_dir, f"{input_name}_split")
        elif task_type == BatchTaskType.CONVERT:
            output_path = os.path.join(output_dir, f"{input_name}.docx")
        elif task_type == BatchTaskType.COMPRESS:
            output_path = os.path.join(output_dir, f"{input_name}_compressed.pdf")
        elif task_type == BatchTaskType.OCR:
            output_path = os.path.join(output_dir, f"{input_name}_ocr.pdf")
        elif task_type == BatchTaskType.WATERMARK:
            output_path = os.path.join(output_dir, f"{input_name}_watermarked.pdf")
        elif task_type == BatchTaskType.ENCRYPT:
            output_path = os.path.join(output_dir, f"{input_name}_encrypted.pdf")
        elif task_type == BatchTaskType.DECRYPT:
            output_path = os.path.join(output_dir, f"{input_name}_decrypted.pdf")
        else:
            output_path = os.path.join(output_dir, input_name)

        await asyncio.sleep(0.1)
        
        return output_path


batch_service = BatchService()
