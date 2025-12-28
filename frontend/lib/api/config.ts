// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001',
  TIMEOUT: 30000, // 30 seconds for AI predictions
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const

// API Endpoints
export const API_ENDPOINTS = {
  // Health and System
  HEALTH: '/health',
  
  // AI Predictions
  PREDICT: '/predict',
  
  // Health Records
  UPLOAD_RECORD: '/upload_record',
  GET_RECORDS: '/records',
  
  // Authentication (future endpoints)
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  
  // User Management (future endpoints)
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  
  // System Analytics (future endpoints)
  ANALYTICS: '/analytics',
  PERFORMANCE: '/performance',
  DATA_SOURCES: '/data-sources',
} as const

// Request timeout configuration by endpoint type
export const ENDPOINT_TIMEOUTS = {
  [API_ENDPOINTS.PREDICT]: 60000, // 60 seconds for AI predictions
  [API_ENDPOINTS.UPLOAD_RECORD]: 30000, // 30 seconds for file uploads
  [API_ENDPOINTS.HEALTH]: 5000, // 5 seconds for health checks
  DEFAULT: 15000, // 15 seconds default
} as const