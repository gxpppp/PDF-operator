import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Workflow {
  id: string
  name: string
  description?: string
  status: 'draft' | 'active' | 'paused' | 'archived'
  nodes: any[]
  edges: any[]
  createdAt: string
  updatedAt: string
  lastRunAt?: string
  runCount: number
}

export interface WorkflowRun {
  id: string
  workflowId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt: string
  completedAt?: string
  inputs: Record<string, any>
  outputs: Record<string, any>
  error?: string
}

export const useWorkflowStore = defineStore('workflow', () => {
  const workflows = ref<Workflow[]>([])
  const currentWorkflow = ref<Workflow | null>(null)
  const currentRun = ref<WorkflowRun | null>(null)
  const isLoading = ref(false)
  const isRunning = ref(false)
  const error = ref<string | null>(null)

  const activeWorkflows = computed(() => 
    workflows.value.filter(w => w.status === 'active')
  )
  const draftWorkflows = computed(() => 
    workflows.value.filter(w => w.status === 'draft')
  )
  const totalWorkflows = computed(() => workflows.value.length)

  function getWorkflow(id: string): Workflow | undefined {
    return workflows.value.find(w => w.id === id)
  }

  function addWorkflow(workflow: Workflow): void {
    const existing = getWorkflow(workflow.id)
    if (existing) {
      Object.assign(existing, workflow)
    } else {
      workflows.value.push(workflow)
    }
  }

  function removeWorkflow(id: string): void {
    const index = workflows.value.findIndex(w => w.id === id)
    if (index !== -1) {
      workflows.value.splice(index, 1)
    }
    if (currentWorkflow.value?.id === id) {
      currentWorkflow.value = null
    }
  }

  function updateWorkflow(id: string, updates: Partial<Workflow>): void {
    const workflow = getWorkflow(id)
    if (workflow) {
      Object.assign(workflow, updates, { updatedAt: new Date().toISOString() })
    }
  }

  function selectWorkflow(workflow: Workflow | null): void {
    currentWorkflow.value = workflow
  }

  function createNewWorkflow(): Workflow {
    const workflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      status: 'draft',
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      runCount: 0
    }
    addWorkflow(workflow)
    return workflow
  }

  function duplicateWorkflow(id: string): Workflow | null {
    const original = getWorkflow(id)
    if (!original) return null

    const duplicate: Workflow = {
      ...original,
      id: `workflow-${Date.now()}`,
      name: `${original.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      runCount: 0
    }
    addWorkflow(duplicate)
    return duplicate
  }

  function setCurrentRun(run: WorkflowRun | null): void {
    currentRun.value = run
  }

  function clearWorkflows(): void {
    workflows.value = []
    currentWorkflow.value = null
    currentRun.value = null
  }

  return {
    workflows,
    currentWorkflow,
    currentRun,
    isLoading,
    isRunning,
    error,
    activeWorkflows,
    draftWorkflows,
    totalWorkflows,
    getWorkflow,
    addWorkflow,
    removeWorkflow,
    updateWorkflow,
    selectWorkflow,
    createNewWorkflow,
    duplicateWorkflow,
    setCurrentRun,
    clearWorkflows
  }
})

export default useWorkflowStore
