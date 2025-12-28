import { API_CONFIG, API_ENDPOINTS, ENDPOINT_TIMEOUTS } from './config'
import { ApiResponse } from './types'

// Custom API Error class
export class ApiClientError extends Error {
  public status: number
  public response?: Response
  public data?: unknown

  constructor(message: string, status: number, response?: Response, data?: unknown) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.response = response
    this.data = data
  }
}

// Request options interface
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
}

// API Client class
export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
    this.defaultHeaders = { ...API_CONFIG.HEADERS }
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.defaultHeaders.Authorization = `Bearer ${token}`
  }

  // Remove authentication token
  clearAuthToken() {
    delete this.defaultHeaders.Authorization
  }

  // Get timeout for specific endpoint
  private getTimeout(endpoint: string): number {
    return ENDPOINT_TIMEOUTS[endpoint as keyof typeof ENDPOINT_TIMEOUTS] || ENDPOINT_TIMEOUTS.DEFAULT
  }

  // Create request with timeout
  private async requestWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiClientError(`Request timeout after ${timeout}ms`, 408)
      }
      throw error
    }
  }

  // Main request method
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const timeout = options.timeout || this.getTimeout(endpoint)

    const requestOptions: RequestInit = {
      method: options.method || 'GET',
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    }

    // Add body for non-GET requests
    if (options.body && options.method !== 'GET') {
      if (options.body instanceof FormData) {
        // Don't set Content-Type for FormData, let browser set it
        const headers = requestOptions.headers as Record<string, string>
        delete headers['Content-Type']
        requestOptions.body = options.body
      } else {
        requestOptions.body = JSON.stringify(options.body)
      }
    }

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`)
      
      const response = await this.requestWithTimeout(url, requestOptions, timeout)
      
      console.log(`📡 API Response: ${response.status} ${response.statusText}`)

      // Handle non-JSON responses (like health check that might return plain text)
      const contentType = response.headers.get('content-type')
      let data: unknown

      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        data = { message: text }
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = data as { error?: string; message?: string; detail?: string; errors?: unknown }
        
        // Enhanced error handling for different status codes
        let errorMessage = `HTTP ${response.status}`
        
        if (response.status === 422) {
          // Validation error - provide detailed information
          const detail = errorData?.detail || errorData?.message || errorData?.error
          const errors = errorData?.errors
          
          errorMessage = 'Validation Error: '
          if (detail) {
            errorMessage += detail
          }
          if (errors) {
            errorMessage += ` Details: ${JSON.stringify(errors)}`
          }
          
          console.error('🔍 422 Validation Error Details:', {
            endpoint,
            status: response.status,
            errorData,
            requestBody: options.body
          })
        } else {
          errorMessage = errorData?.error || errorData?.message || errorMessage
        }
        
        throw new ApiClientError(errorMessage, response.status, response, data)
      }

      // Return standardized response
      return {
        success: true,
        data: data as T,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, error)

      if (error instanceof ApiClientError) {
        throw error
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiClientError(
          'Network error - please check your connection and ensure the API server is running',
          0
        )
      }

      // Handle unknown errors
      throw new ApiClientError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      )
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, headers })
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers })
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', headers })
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get(API_ENDPOINTS.HEALTH)
      return response.success
    } catch (error) {
      console.warn('Health check failed:', error)
      return false
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Export default instance
export default apiClient