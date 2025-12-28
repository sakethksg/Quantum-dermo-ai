"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  HealthService, 
  PredictionService, 
  HealthRecordsService,
} from '../api/services'
import { 
  PredictionRequest,
  PredictionResponse,
  UploadRecordRequest 
} from '../api/types'
import { toast } from 'sonner'

// Query Keys - centralized for consistency
export const queryKeys = {
  health: ['health'],
  predictions: ['predictions'],
  predictionHistory: (patientId?: string) => ['predictions', 'history', patientId],
  records: ['records'],
  recordsByPatient: (patientId: string) => ['records', 'patient', patientId],
  recordsSearch: (query: Record<string, unknown>) => ['records', 'search', query],
}

// Health Check Hooks
export function useHealthCheck() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: HealthService.checkHealth,
    refetchInterval: 30000, // Check every 30 seconds
    retry: false, // Don't retry health checks
  })
}

export function useApiStatus() {
  return useQuery({
    queryKey: ['api-status'],
    queryFn: HealthService.isApiReachable,
    refetchInterval: 15000, // Check every 15 seconds
    retry: false,
  })
}

// Prediction Hooks
export function usePrediction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: PredictionRequest) => PredictionService.predict(request),
    onSuccess: (data: PredictionResponse) => {
      // Show success message
      toast.success('AI Analysis Complete', {
        description: `Prediction: ${data.prediction.predicted_class} (${data.prediction.risk_level} Risk)`
      })

      // Invalidate prediction history to refetch updated data
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.predictionHistory() 
      })
    },
    onError: (error: unknown) => {
      // Show error message
      toast.error('Prediction Failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    }
  })
}

export function usePredictionHistory(patientId?: string) {
  return useQuery({
    queryKey: queryKeys.predictionHistory(patientId),
    queryFn: () => PredictionService.getPredictionHistory(),
    enabled: true, // Always enabled since we have mock data
  })
}

// Health Records Hooks
export function useUploadRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UploadRecordRequest) => HealthRecordsService.uploadRecord(request),
    onSuccess: (data: unknown, variables: UploadRecordRequest) => {
      // Show success message
      toast.success('Record Uploaded Successfully', {
        description: `Patient: ${variables.patient_name}`
      })

      // Invalidate records queries to refetch updated data
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.records 
      })
    },
    onError: (error: unknown) => {
      // Show error message
      toast.error('Upload Failed', {
        description: error instanceof Error ? error.message : 'Failed to upload record'
      })
    }
  })
}

export function useHealthRecords(patientId?: string) {
  return useQuery({
    queryKey: patientId ? queryKeys.recordsByPatient(patientId) : queryKeys.records,
    queryFn: () => HealthRecordsService.getRecords(patientId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export function useSearchRecords(query: {
  patient_name?: string
  date_from?: string
  date_to?: string
  record_type?: string
}) {
  return useQuery({
    queryKey: queryKeys.recordsSearch(query),
    queryFn: () => HealthRecordsService.searchRecords(query),
    enabled: Object.values(query).some(value => Boolean(value)), // Only run if there's a search term
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Error handling hook
export function useApiError() {
  const handleError = (error: unknown, fallbackMessage = 'An unexpected error occurred') => {
    let message = fallbackMessage
    let description = ''

    if (error instanceof Error) {
      message = error.message
    }

    // Check for network errors
    if (message.includes('Network error') || message.includes('fetch')) {
      message = 'Connection Error'
      description = 'Unable to connect to the server. Please check your connection and try again.'
    }

    toast.error(message, {
      description,
      duration: 5000,
    })
  }

  return { handleError }
}

// Loading states hook
export function useApiLoadingStates() {
  const healthQuery = useHealthCheck()
  const apiStatusQuery = useApiStatus()

  return {
    isHealthLoading: healthQuery.isLoading,
    isApiStatusLoading: apiStatusQuery.isLoading,
    isApiConnected: apiStatusQuery.data === true,
    healthData: healthQuery.data,
    healthError: healthQuery.error,
  }
}