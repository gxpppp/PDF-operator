import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAppStore } from '@/stores/app'
import { useNotificationStore } from '@/stores/notification'

export interface RequestConfig extends InternalAxiosRequestConfig {
  retryCount?: number
}

export const setupInterceptors = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config: RequestConfig) => {
      const appStore = useAppStore()
      
      if (appStore.authToken) {
        config.headers.Authorization = `Bearer ${appStore.authToken}`
      }
      
      config.headers['X-Request-ID'] = generateRequestId()
      config.metadata = { startTime: Date.now() }
      
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  client.interceptors.response.use(
    (response) => {
      const duration = Date.now() - (response.config.metadata?.startTime || 0)
      logRequest(response.config, duration)
      return response
    },
    (error: AxiosError) => {
      const notificationStore = useNotificationStore()
      const config = error.config as RequestConfig
      
      if (shouldRetry(error, config)) {
        config.retryCount = (config.retryCount || 0) + 1
        return client.request(config)
      }
      
      const errorMessage = getErrorMessage(error)
      
      if (error.response?.status === 401) {
        const appStore = useAppStore()
        appStore.clearAuth()
      } else if (error.response?.status && error.response.status >= 500) {
        notificationStore.error(errorMessage)
      }
      
      return Promise.reject(error)
    }
  )
}

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function shouldRetry(error: AxiosError, config?: RequestConfig): boolean {
  if (!config) return false
  
  const maxRetries = 3
  const retryCount = config.retryCount || 0
  
  if (retryCount >= maxRetries) return false
  
  if (!error.response) return true
  
  const status = error.response.status
  return status === 429 || (status >= 500 && status < 600)
}

function getErrorMessage(error: AxiosError): string {
  if (error.response) {
    const data = error.response.data as any
    return data?.message || data?.detail || `请求失败 (${error.response.status})`
  }
  
  if (error.request) {
    return '网络连接失败，请检查网络设置'
  }
  
  return error.message || '未知错误'
}

function logRequest(config: any, duration: number): void {
  if (import.meta.env.DEV) {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url} - ${duration}ms`)
  }
}

export default setupInterceptors
