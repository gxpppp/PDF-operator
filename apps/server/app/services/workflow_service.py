import os
import uuid
import asyncio
from datetime import datetime
from typing import List, Optional, Dict, Any

from ..schemas.workflow import (
    Workflow, WorkflowNode, WorkflowEdge, WorkflowRun, WorkflowStatus,
    WorkflowRunStatus, NodeExecution, WorkflowCreateOptions,
    WorkflowUpdateOptions, WorkflowRunOptions, WorkflowListResult
)


class WorkflowService:
    def __init__(self):
        self._workflows: Dict[str, Workflow] = {}
        self._runs: Dict[str, WorkflowRun] = {}

    async def create(self, options: WorkflowCreateOptions) -> Workflow:
        workflow_id = str(uuid.uuid4())
        now = datetime.now()
        
        workflow = Workflow(
            id=workflow_id,
            name=options.name,
            description=options.description,
            status=WorkflowStatus.DRAFT,
            nodes=options.nodes,
            edges=options.edges,
            variables=options.variables or [],
            triggers=options.triggers or [],
            created_at=now,
            updated_at=now,
            run_count=0
        )
        
        self._workflows[workflow_id] = workflow
        return workflow

    async def get(self, workflow_id: str) -> Optional[Workflow]:
        return self._workflows.get(workflow_id)

    async def update(self, workflow_id: str, options: WorkflowUpdateOptions) -> Optional[Workflow]:
        workflow = self._workflows.get(workflow_id)
        if not workflow:
            return None
        
        update_data = options.dict(exclude_unset=True)
        for key, value in update_data.items():
            if value is not None:
                setattr(workflow, key, value)
        
        workflow.updated_at = datetime.now()
        return workflow

    async def delete(self, workflow_id: str) -> bool:
        if workflow_id in self._workflows:
            del self._workflows[workflow_id]
            return True
        return False

    async def list(self, page: int = 1, page_size: int = 20, 
                   search: Optional[str] = None) -> WorkflowListResult:
        workflows = list(self._workflows.values())
        
        if search:
            search_lower = search.lower()
            workflows = [
                w for w in workflows
                if search_lower in w.name.lower() or
                   (w.description and search_lower in w.description.lower())
            ]
        
        workflows.sort(key=lambda x: x.created_at, reverse=True)
        
        total = len(workflows)
        start = (page - 1) * page_size
        end = start + page_size
        
        return WorkflowListResult(
            workflows=workflows[start:end],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=(total + page_size - 1) // page_size
        )

    async def run(self, options: WorkflowRunOptions) -> WorkflowRun:
        workflow = self._workflows.get(options.workflow_id)
        if not workflow:
            raise ValueError(f"Workflow {options.workflow_id} not found")
        
        run_id = str(uuid.uuid4())
        run = WorkflowRun(
            id=run_id,
            workflow_id=options.workflow_id,
            status=WorkflowRunStatus.PENDING,
            started_at=datetime.now(),
            inputs=options.inputs or {},
            outputs={},
            node_executions=[]
        )
        
        self._runs[run_id] = run
        
        if options.async_exec:
            asyncio.create_task(self._execute_workflow(run, workflow))
        else:
            await self._execute_workflow(run, workflow)
        
        workflow.run_count += 1
        workflow.last_run_at = datetime.now()
        
        return run

    async def get_run(self, run_id: str) -> Optional[WorkflowRun]:
        return self._runs.get(run_id)

    async def cancel_run(self, run_id: str) -> bool:
        run = self._runs.get(run_id)
        if not run or run.status not in [WorkflowRunStatus.PENDING, WorkflowRunStatus.RUNNING]:
            return False
        
        run.status = WorkflowRunStatus.CANCELLED
        run.completed_at = datetime.now()
        return True

    async def _execute_workflow(self, run: WorkflowRun, workflow: Workflow):
        run.status = WorkflowRunStatus.RUNNING
        
        try:
            node_map = {node.id: node for node in workflow.nodes}
            executed = set()
            
            start_nodes = [n for n in workflow.nodes if n.type == "start"]
            if not start_nodes:
                raise ValueError("No start node found")
            
            queue = list(start_nodes)
            
            while queue:
                node = queue.pop(0)
                
                if node.id in executed:
                    continue
                
                if not self._can_execute_node(node, executed, workflow.edges):
                    queue.append(node)
                    continue
                
                execution = await self._execute_node(node, run.inputs)
                run.node_executions.append(execution)
                executed.add(node.id)
                
                if execution.status == "failed":
                    run.status = WorkflowRunStatus.FAILED
                    run.error = execution.error
                    run.completed_at = datetime.now()
                    return
                
                for edge in workflow.edges:
                    if edge.source == node.id:
                        target_node = node_map.get(edge.target)
                        if target_node and target_node.id not in executed:
                            queue.append(target_node)
            
            run.status = WorkflowRunStatus.COMPLETED
            run.completed_at = datetime.now()
            
        except Exception as e:
            run.status = WorkflowRunStatus.FAILED
            run.error = str(e)
            run.completed_at = datetime.now()

    def _can_execute_node(self, node: WorkflowNode, executed: set, edges: List[WorkflowEdge]) -> bool:
        incoming_edges = [e for e in edges if e.target == node.id]
        
        if not incoming_edges:
            return True
        
        sources_executed = all(e.source in executed for e in incoming_edges)
        return sources_executed

    async def _execute_node(self, node: WorkflowNode, inputs: Dict[str, Any]) -> NodeExecution:
        execution = NodeExecution(
            node_id=node.id,
            status="running",
            started_at=datetime.now(),
            inputs=inputs,
            outputs={}
        )
        
        try:
            await asyncio.sleep(0.1)
            
            execution.status = "completed"
            execution.outputs = {"result": f"Processed by {node.type}"}
            
        except Exception as e:
            execution.status = "failed"
            execution.error = str(e)
        
        execution.completed_at = datetime.now()
        return execution


workflow_service = WorkflowService()
