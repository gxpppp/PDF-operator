import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAppStore } from '@/stores/app'

const config: AxiosRequestConfig = {
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

const client: AxiosInstance = axios.create(config)

client.interceptors.request.use(
  (config) => {
    const appStore = useAppStore()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

client.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.message || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

export default client
