// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp?: string
}

// Health Check Types
export interface HealthCheckResponse {
  status: "healthy" | "unhealthy"
  timestamp: string
  version: string
  dependencies: {
    database: "connected" | "disconnected"
    redis: "connected" | "disconnected"
    ml_model: "loaded" | "error"
  }
  uptime: number
}

// Prediction Types
export interface PredictionRequest {
  clinical_data: {
    age: number
    gender: number // 0 = Female, 1 = Male
    bmi: number
    blood_pressure_systolic: number
    blood_pressure_diastolic: number
    cholesterol: number
    glucose: number
    smoking: number // 0 = No, 1 = Yes
    family_history: number // 0 = No, 1 = Yes
    symptoms_severity: number // 1.0-10.0
  }
  image_base64: string // base64 encoded image
}

export interface PredictionResponse {
  prediction: {
    predicted_class: "Benign" | "Malignant" | "Suspicious"
    probabilities: {
      Benign: number
      Malignant: number
      Suspicious: number
    }
    risk_level: "Low" | "Medium" | "High"
  }
  confidence: number
  encrypted_prediction: string
  cache_hit: boolean
}

// Health Record Types
export interface HealthRecord {
  id: string
  patient_id: string
  patient_name: string
  date_of_birth: string
  medical_record_number: string
  record_type: "image" | "clinical" | "lab" | "imaging"
  upload_timestamp: string
  file_data?: {
    filename: string
    file_size: number
    content_type: string
    file_content: string // base64 encoded
  }
  clinical_data?: {
    diagnosis: string[]
    treatments: string[]
    medications: string[]
    allergies: string[]
    vital_signs: {
      blood_pressure?: string
      heart_rate?: number
      temperature?: number
      respiratory_rate?: number
    }
  }
  encryption_status: {
    encrypted: boolean
    encryption_algorithm: string
  }
  access_log: Array<{
    accessed_by: string
    access_timestamp: string
    access_type: "read" | "write" | "delete"
  }>
}

export interface UploadRecordRequest {
  patient_name: string
  date_of_birth: string
  medical_record_number: string
  record_type: "image" | "clinical" | "lab" | "imaging"
  file_data?: {
    filename: string
    content_type: string
    file_content: string // base64 encoded
  }
  clinical_data?: {
    diagnosis: string[]
    treatments: string[]
    medications: string[]
    allergies: string[]
    vital_signs: {
      blood_pressure?: string
      heart_rate?: number
      temperature?: number
      respiratory_rate?: number
    }
  }
}

export interface UploadRecordResponse {
  record_id: string
  patient_id: string
  upload_status: "success" | "partial" | "failed"
  message: string
  encryption_status: {
    encrypted: boolean
    encryption_algorithm: string
  }
  timestamp: string
}

// User Types (for future implementation)
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "doctor" | "nurse" | "technician" | "analyst"
  department: string
  permissions: string[]
  created_at: string
  last_login?: string
  status: "active" | "inactive" | "pending"
}

// Error Types
export interface ApiError {
  error: string
  message: string
  status_code: number
  timestamp: string
  details?: unknown
}

// Analytics Types (for future implementation)
export interface AnalyticsData {
  predictions: {
    total: number
    by_risk_level: Record<string, number>
    accuracy_metrics: {
      precision: number
      recall: number
      f1_score: number
    }
  }
  system_performance: {
    average_response_time: number
    throughput: number
    error_rate: number
  }
  user_activity: {
    active_users: number
    total_sessions: number
    peak_usage_hours: number[]
  }
}