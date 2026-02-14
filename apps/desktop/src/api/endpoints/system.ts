import client from './client'

export const systemApi = {
  async getInfo(): Promise<{
    app_name: string
    version: string
    python_version: string
    platform: string
    platform_version: string
    architecture: string
  }> {
    return client.get('/system/info')
  },

  async getResources(): Promise<{
    cpu_percent: number
    memory: {
      total: number
      available: number
      percent: number
    }
    disk: {
      total: number
      free: number
      percent: number
    }
  }> {
    return client.get('/system/resources')
  },

  async getDependencies(): Promise<{
    dependencies: Array<{
      name: string
      version: string | null
      status: 'ok' | 'missing'
    }>
  }> {
    return client.get('/system/dependencies')
  },

  async getConfig(): Promise<{
    upload_dir: string
    output_dir: string
    temp_dir: string
    max_upload_size: number
    ocr_language: string
    log_level: string
  }> {
    return client.get('/system/config')
  }
}

export default systemApi
