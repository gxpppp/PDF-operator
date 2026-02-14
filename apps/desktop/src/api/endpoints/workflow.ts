import client from './client'

export interface WorkflowStep {
  id: string
  type: string
  name: string
  config: Record<string, any>
}

export interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  created_at: string
  updated_at: string
  status: 'active' | 'inactive'
}

export const workflowApi = {
  async list(): Promise<{ workflows: Workflow[] }> {
    return client.get('/workflow/list')
  },

  async create(
    name: string,
    description: string = '',
    steps: WorkflowStep[] = []
  ): Promise<{ id: string; status: string }> {
    return client.post('/workflow/create', { name, description, steps })
  },

  async get(workflowId: string): Promise<Workflow> {
    return client.get(`/workflow/${workflowId}`)
  },

  async update(
    workflowId: string,
    data: { name?: string; description?: string; steps?: WorkflowStep[] }
  ): Promise<{ status: string }> {
    return client.put(`/workflow/${workflowId}`, data)
  },

  async delete(workflowId: string): Promise<{ status: string }> {
    return client.delete(`/workflow/${workflowId}`)
  },

  async run(workflowId: string, inputFiles: string[]): Promise<{ run_id: string; status: string }> {
    return client.post(`/workflow/${workflowId}/run`, { input_files: inputFiles })
  },

  async getRunStatus(runId: string): Promise<{
    id: string
    workflow_id: string
    status: string
    started_at: string
    completed_at?: string
    results: any[]
  }> {
    return client.get(`/workflow/runs/${runId}`)
  },

  async getStepTypes(): Promise<{
    step_types: Array<{ type: string; name: string; category: string }>
  }> {
    return client.get('/workflow/step-types')
  }
}

export default workflowApi
