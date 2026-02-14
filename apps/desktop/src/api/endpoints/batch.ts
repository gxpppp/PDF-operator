import client from './client'

export interface BatchTask {
  task_id: string
  input_paths: string[]
  operation: string
  output_dir: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  progress: number
  results: any[]
}

export const batchApi = {
  async createTask(
    inputPaths: string[],
    operation: string,
    outputDir: string,
    outputFormat?: string,
    options?: Record<string, any>
  ): Promise<{ task_id: string; status: string }> {
    return client.post('/batch/create', {
      input_paths: inputPaths,
      operation,
      output_dir: outputDir,
      output_format: outputFormat,
      options
    })
  },

  async getStatus(taskId: string): Promise<BatchTask> {
    return client.get(`/batch/status/${taskId}`)
  },

  async listTasks(): Promise<{ tasks: BatchTask[] }> {
    return client.get('/batch/list')
  },

  async cancelTask(taskId: string): Promise<{ success: boolean }> {
    return client.delete(`/batch/cancel/${taskId}`)
  },

  async getOperations(): Promise<{
    operations: Array<{ name: string; description: string }>
  }> {
    return client.get('/batch/operations')
  }
}

export default batchApi
