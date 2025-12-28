import { apiClient, ApiClientError } from './client'
import { API_ENDPOINTS } from './config'
import {
  HealthCheckResponse,
  PredictionRequest,
  PredictionResponse,
  UploadRecordRequest,
  UploadRecordResponse,
  HealthRecord
} from './types'

// Health Check Service
class HealthService {
  /**
   * Check system health status
   */
  static async checkHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await apiClient.get<HealthCheckResponse>(API_ENDPOINTS.HEALTH)
      return response.data!
    } catch (error) {
      if (error instanceof ApiClientError) {
        // Return a basic unhealthy status if the API is down
        return {
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          version: "unknown",
          dependencies: {
            database: "disconnected",
            redis: "disconnected",
            ml_model: "error"
          },
          uptime: 0
        }
      }
      throw error
    }
  }

  /**
   * Check if the API is reachable
   */
  static async isApiReachable(): Promise<boolean> {
    return await apiClient.healthCheck()
  }
}

// AI Prediction Service
class PredictionService {
  /**
   * Submit image and clinical data for AI analysis
   */
  static async predict(request: PredictionRequest): Promise<PredictionResponse> {
    try {
      console.log('🚀 Sending prediction request:', {
        endpoint: API_ENDPOINTS.PREDICT,
        imageSize: request.image_base64 ? `${request.image_base64.length} chars` : 'none',
        clinicalData: request.clinical_data
      })
      
      const response = await apiClient.post<PredictionResponse>(
        API_ENDPOINTS.PREDICT,
        request
      )
      return response.data!
    } catch (error) {
      if (error instanceof ApiClientError) {
        // Enhance error message for common prediction errors
        if (error.status === 400) {
          throw new Error('Invalid input data. Please check image format and clinical information.')
        } else if (error.status === 413) {
          throw new Error('Image file too large. Please use a smaller image (max 10MB).')
        } else if (error.status === 422) {
          // Validation errors - pass through the detailed message
          throw new Error(`Validation Error: ${error.message}`)
        } else if (error.status === 429) {
          throw new Error('Too many requests. Please wait a moment before trying again.')
        } else if (error.status === 503) {
          throw new Error('AI model temporarily unavailable. Please try again later.')
        }
      }
      throw error
    }
  }

  /**
   * Get prediction history (mock implementation for now)
   */
  static async getPredictionHistory(): Promise<PredictionResponse[]> {
    // This would be a real API endpoint in the future
    // For now, return empty array
    return []
  }
}

// Health Records Service
class HealthRecordsService {
  /**
   * Upload a health record
   */
  static async uploadRecord(request: UploadRecordRequest): Promise<UploadRecordResponse> {
    try {
      const response = await apiClient.post<UploadRecordResponse>(
        API_ENDPOINTS.UPLOAD_RECORD,
        request
      )
      return response.data!
    } catch (error) {
      if (error instanceof ApiClientError) {
        // Enhance error message for common upload errors
        if (error.status === 400) {
          throw new Error('Invalid record data. Please check all required fields.')
        } else if (error.status === 413) {
          throw new Error('File too large. Please use a smaller file (max 50MB).')
        } else if (error.status === 415) {
          throw new Error('Unsupported file type. Please use supported medical file formats.')
        }
      }
      throw error
    }
  }

  /**
   * Get health records (future implementation)
   */
  static async getRecords(patientId?: string): Promise<HealthRecord[]> {
    try {
      const endpoint = patientId 
        ? `${API_ENDPOINTS.GET_RECORDS}?patient_id=${patientId}`
        : API_ENDPOINTS.GET_RECORDS
      
      const response = await apiClient.get<HealthRecord[]>(endpoint)
      return response.data || []
    } catch (error) {
      console.warn('Failed to fetch records:', error)
      return [] // Return empty array if endpoint doesn't exist yet
    }
  }

  /**
   * Search records by criteria
   */
  static async searchRecords(query: {
    patient_name?: string
    date_from?: string
    date_to?: string
    record_type?: string
  }): Promise<HealthRecord[]> {
    try {
      const params = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const endpoint = `${API_ENDPOINTS.GET_RECORDS}/search?${params.toString()}`
      const response = await apiClient.get<HealthRecord[]>(endpoint)
      return response.data || []
    } catch (error) {
      console.warn('Failed to search records:', error)
      return [] // Return empty array if endpoint doesn't exist yet
    }
  }
}

// Analytics Service (future implementation)
class AnalyticsService {
  /**
   * Get system analytics data
   */
  static async getAnalytics(): Promise<unknown> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS)
      return response.data
    } catch (error) {
      console.warn('Analytics endpoint not available:', error)
      return null
    }
  }

  /**
   * Get performance metrics
   */
  static async getPerformanceMetrics(): Promise<unknown> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PERFORMANCE)
      return response.data
    } catch (error) {
      console.warn('Performance metrics endpoint not available:', error)
      return null
    }
  }
}

// Authentication Service (future implementation)
class AuthService {
  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<unknown> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email,
        password
      })
      
      // Store token if login successful
      const responseData = response.data as { token?: string }
      if (responseData?.token) {
        localStorage.setItem('auth_token', responseData.token)
        apiClient.setAuthToken(responseData.token)
      }
      
      return response.data
    } catch (error) {
      console.warn('Authentication endpoint not available:', error)
      throw new Error('Authentication not implemented yet')
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT)
    } catch (error) {
      console.warn('Logout endpoint not available:', error)
    } finally {
      // Clear local token regardless of API response
      localStorage.removeItem('auth_token')
      apiClient.clearAuthToken()
    }
  }

  /**
   * Get current user info
   */
  static async getCurrentUser(): Promise<unknown> {
    try {
      const response = await apiClient.get('/auth/me')
      return response.data
    } catch (error) {
      console.warn('User info endpoint not available:', error)
      return null
    }
  }

  /**
   * Initialize auth token from localStorage
   */
  static initializeAuth(): void {
    const token = localStorage.getItem('auth_token')
    if (token) {
      apiClient.setAuthToken(token)
    }
  }
}

// Export all services
export {
  HealthService,
  PredictionService,
  HealthRecordsService,
  AnalyticsService,
  AuthService
}

// Export convenience object with all services
export const api = {
  health: HealthService,
  predictions: PredictionService,
  records: HealthRecordsService,
  analytics: AnalyticsService,
  auth: AuthService,
}