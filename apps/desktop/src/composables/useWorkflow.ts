import { ref, computed, type Ref } from 'vue'
import { workflowApi } from '@/api'
import type {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  WorkflowRun,
  WorkflowCreateOptions,
  WorkflowUpdateOptions,
  WorkflowRunOptions,
  WorkflowListOptions,
  WorkflowListResult,
  WorkflowRunStatus
} from '@/api/types/workflow.types'

export interface UseWorkflowOptions {
  autoSave?: boolean
  autoSaveInterval?: number
  onRunComplete?: (run: WorkflowRun) => void
  onRunError?: (run: WorkflowRun, error: string) => void
}

export function useWorkflow(options: UseWorkflowOptions = {}) {
  const { autoSave = true, autoSaveInterval = 30000, onRunComplete, onRunError } = options

  const workflows = ref<Workflow[]>([])
  const currentWorkflow = ref<Workflow | null>(null)
  const currentRun = ref<WorkflowRun | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isRunning = ref(false)
  const error = ref<string | null>(null)

  const hasUnsavedChanges = ref(false)
  let autoSaveTimer: ReturnType<typeof setInterval> | null = null

  async function fetchWorkflows(listOptions?: WorkflowListOptions): Promise<WorkflowListResult> {
    isLoading.value = true
    error.value = null

    try {
      const result = await workflowApi.list(listOptions)
      workflows.value = result.workflows
      return result
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createWorkflow(createOptions: WorkflowCreateOptions): Promise<Workflow> {
    isLoading.value = true
    error.value = null

    try {
      const workflow = await workflowApi.create(createOptions)
      workflows.value.unshift(workflow)
      currentWorkflow.value = workflow
      return workflow
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function getWorkflow(workflowId: string): Promise<Workflow> {
    isLoading.value = true
    error.value = null

    try {
      const workflow = await workflowApi.get(workflowId)
      const index = workflows.value.findIndex(w => w.id === workflowId)
      if (index !== -1) {
        workflows.value[index] = workflow
      }
      currentWorkflow.value = workflow
      return workflow
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateWorkflow(workflowId: string, updateOptions: WorkflowUpdateOptions): Promise<Workflow> {
    isSaving.value = true
    error.value = null

    try {
      const workflow = await workflowApi.update(workflowId, updateOptions)
      const index = workflows.value.findIndex(w => w.id === workflowId)
      if (index !== -1) {
        workflows.value[index] = workflow
      }
      if (currentWorkflow.value?.id === workflowId) {
        currentWorkflow.value = workflow
      }
      hasUnsavedChanges.value = false
      return workflow
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function deleteWorkflow(workflowId: string): Promise<void> {
    try {
      await workflowApi.delete(workflowId)
      workflows.value = workflows.value.filter(w => w.id !== workflowId)
      if (currentWorkflow.value?.id === workflowId) {
        currentWorkflow.value = null
      }
    } catch (err) {
      error.value = (err as Error).message
      throw err
    }
  }

  async function duplicateWorkflow(workflowId: string): Promise<Workflow> {
    const original = workflows.value.find(w => w.id === workflowId)
    if (!original) throw new Error('Workflow not found')

    return createWorkflow({
      name: `${original.name} (Copy)`,
      description: original.description,
      nodes: original.nodes,
      edges: original.edges,
      variables: original.variables,
      triggers: original.triggers
    })
  }

  async function runWorkflow(runOptions: WorkflowRunOptions): Promise<WorkflowRun> {
    isRunning.value = true
    error.value = null

    try {
      const run = await workflowApi.run(runOptions)
      currentRun.value = run
      return run
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isRunning.value = false
    }
  }

  async function getRun(runId: string): Promise<WorkflowRun> {
    try {
      const run = await workflowApi.getRun(runId)
      currentRun.value = run

      if (run.status === 'completed') {
        onRunComplete?.(run)
      } else if (run.status === 'failed') {
        onRunError?.(run, run.error || 'Unknown error')
      }

      return run
    } catch (err) {
      error.value = (err as Error).message
      throw err
    }
  }

  async function cancelRun(runId: string): Promise<void> {
    try {
      await workflowApi.cancelRun(runId)
      if (currentRun.value?.id === runId) {
        currentRun.value = { ...currentRun.value, status: 'cancelled' }
      }
    } catch (err) {
      error.value = (err as Error).message
      throw err
    }
  }

  function addNode(node: WorkflowNode): void {
    if (!currentWorkflow.value) return

    currentWorkflow.value.nodes.push(node)
    hasUnsavedChanges.value = true
    triggerAutoSave()
  }

  function updateNode(nodeId: string, updates: Partial<WorkflowNode>): void {
    if (!currentWorkflow.value) return

    const index = currentWorkflow.value.nodes.findIndex(n => n.id === nodeId)
    if (index !== -1) {
      currentWorkflow.value.nodes[index] = {
        ...currentWorkflow.value.nodes[index],
        ...updates
      }
      hasUnsavedChanges.value = true
      triggerAutoSave()
    }
  }

  function removeNode(nodeId: string): void {
    if (!currentWorkflow.value) return

    currentWorkflow.value.nodes = currentWorkflow.value.nodes.filter(n => n.id !== nodeId)
    currentWorkflow.value.edges = currentWorkflow.value.edges.filter(
      e => e.source !== nodeId && e.target !== nodeId
    )
    hasUnsavedChanges.value = true
    triggerAutoSave()
  }

  function addEdge(edge: WorkflowEdge): void {
    if (!currentWorkflow.value) return

    currentWorkflow.value.edges.push(edge)
    hasUnsavedChanges.value = true
    triggerAutoSave()
  }

  function removeEdge(edgeId: string): void {
    if (!currentWorkflow.value) return

    currentWorkflow.value.edges = currentWorkflow.value.edges.filter(e => e.id !== edgeId)
    hasUnsavedChanges.value = true
    triggerAutoSave()
  }

  function triggerAutoSave(): void {
    if (!autoSave || !currentWorkflow.value) return

    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }

    autoSaveTimer = setTimeout(async () => {
      if (hasUnsavedChanges.value && currentWorkflow.value) {
        try {
          await updateWorkflow(currentWorkflow.value.id, {
            nodes: currentWorkflow.value.nodes,
            edges: currentWorkflow.value.edges
          })
        } catch (err) {
          console.error('Auto-save failed:', err)
        }
      }
    }, autoSaveInterval)
  }

  function selectWorkflow(workflow: Workflow | null): void {
    currentWorkflow.value = workflow
    hasUnsavedChanges.value = false
  }

  function newWorkflow(): void {
    currentWorkflow.value = {
      id: '',
      name: 'New Workflow',
      status: 'draft',
      nodes: [],
      edges: [],
      variables: [],
      triggers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      runCount: 0
    }
    hasUnsavedChanges.value = true
  }

  return {
    workflows,
    currentWorkflow,
    currentRun,
    isLoading,
    isSaving,
    isRunning,
    error,
    hasUnsavedChanges,
    fetchWorkflows,
    createWorkflow,
    getWorkflow,
    updateWorkflow,
    deleteWorkflow,
    duplicateWorkflow,
    runWorkflow,
    getRun,
    cancelRun,
    addNode,
    updateNode,
    removeNode,
    addEdge,
    removeEdge,
    selectWorkflow,
    newWorkflow
  }
}

export default useWorkflow
