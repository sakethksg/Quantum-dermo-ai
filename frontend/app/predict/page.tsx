"use client"

import React, { useState } from "react"
import { MainLayout } from "@/components/layout"
import { PatientDataForm, ImageUpload, type PatientData } from "@/components/forms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { usePrediction } from "@/lib/hooks/use-api"
import { PredictionRequest, PredictionResponse } from "@/lib/api/types"
import { toast } from "sonner"
import { 
  Brain, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Shield,
  Lock,
  Download
} from "lucide-react"

type PredictionStep = 'clinical-data' | 'image-upload' | 'review' | 'results'

interface PredictionState {
  clinicalData: PatientData | null
  imageBase64: string | null
  results: PredictionResponse | null
  error: string | null
}

export default function PredictPage() {
  const [currentStep, setCurrentStep] = useState<PredictionStep>('clinical-data')
  const [state, setState] = useState<PredictionState>({
    clinicalData: null,
    imageBase64: null,
    results: null,
    error: null
  })

  // API hooks
  const predictionMutation = usePrediction()

  const steps = [
    { id: 'clinical-data', title: 'Clinical Data', description: 'Patient health information' },
    { id: 'image-upload', title: 'Medical Image', description: 'Upload diagnostic image' },
    { id: 'review', title: 'Review', description: 'Verify information' },
    { id: 'results', title: 'Results', description: 'AI prediction results' }
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleClinicalDataSubmit = (data: PatientData) => {
    setState(prev => ({ ...prev, clinicalData: data }))
    setCurrentStep('image-upload')
  }

  const handleImageSelect = (base64: string) => {
    setState(prev => ({ ...prev, imageBase64: base64 }))
    // Auto-advance to review step
    setTimeout(() => {
      setCurrentStep('review')
    }, 1000)
  }

  const handleSubmitPrediction = async () => {
    if (!state.clinicalData || !state.imageBase64) return

    setState(prev => ({ ...prev, error: null }))

    // Map form data to API format (matching backend expectations)
    const requestData: PredictionRequest = {
      clinical_data: {
        age: parseFloat(state.clinicalData.age.toString()),
        gender: state.clinicalData.gender, // 0 = Female, 1 = Male
        bmi: state.clinicalData.bmi,
        blood_pressure_systolic: state.clinicalData.blood_pressure_systolic,
        blood_pressure_diastolic: state.clinicalData.blood_pressure_diastolic,
        cholesterol: state.clinicalData.cholesterol,
        glucose: state.clinicalData.glucose,
        smoking: state.clinicalData.smoking,
        family_history: state.clinicalData.family_history,
        symptoms_severity: state.clinicalData.symptoms_severity
      },
      image_base64: state.imageBase64
    }

    try {
      const results = await predictionMutation.mutateAsync(requestData)
      setState(prev => ({ ...prev, results }))
      setCurrentStep('results')
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to get prediction'
      }))
    }
  }

  const handleReset = () => {
    setState({
      clinicalData: null,
      imageBase64: null,
      results: null,
      error: null
    })
    setCurrentStep('clinical-data')
    predictionMutation.reset()
  }

  const handleExportResults = () => {
    if (!state.results || !state.clinicalData) {
      toast.error('No results to export')
      return
    }

    try {
      // Create comprehensive export data
      const exportData = {
        exportInfo: {
          timestamp: new Date().toISOString(),
          platform: 'QuantumHealth AI Platform',
          version: '1.0.0',
          reportType: 'AI Health Risk Assessment'
        },
        patientData: {
          demographics: {
            age: state.clinicalData.age,
            gender: state.clinicalData.gender === 1 ? 'Male' : 'Female',
            bmi: state.clinicalData.bmi
          },
          vitalSigns: {
            bloodPressure: {
              systolic: state.clinicalData.blood_pressure_systolic,
              diastolic: state.clinicalData.blood_pressure_diastolic
            }
          },
          laboratoryValues: {
            cholesterol: `${state.clinicalData.cholesterol} mg/dL`,
            glucose: `${state.clinicalData.glucose} mg/dL`
          },
          riskFactors: {
            smoking: state.clinicalData.smoking === 1 ? 'Current smoker' : 'Non-smoker',
            familyHistory: state.clinicalData.family_history === 1 ? 'Positive family history' : 'No family history',
            symptomsSeverity: `${state.clinicalData.symptoms_severity}/10`,
            // Include comprehensive risk factors
            alcoholConsumption: state.clinicalData.alcohol_consumption !== undefined ? 
              ['None', 'Moderate (1-2 drinks/week)', 'Heavy (3+ drinks/week)'][state.clinicalData.alcohol_consumption] : 'Not assessed',
            exerciseFrequency: state.clinicalData.exercise_frequency !== undefined ?
              ['Sedentary (No exercise)', 'Low (1-2 times/week)', 'Moderate (3-4 times/week)', 'High (5+ times/week)'][state.clinicalData.exercise_frequency] : 'Not assessed',
            stressLevel: state.clinicalData.stress_level ? `${state.clinicalData.stress_level}/5` : 'Not assessed',
            diabetesHistory: state.clinicalData.diabetes_history === 1 ? 'Present' : 'Not present',
            heartDiseaseHistory: state.clinicalData.heart_disease_history === 1 ? 'Present' : 'Not present',
            medicationUsage: state.clinicalData.medication_usage !== undefined ?
              ['No medications', '1-3 medications', '4+ medications'][state.clinicalData.medication_usage] : 'Not assessed'
          }
        },
        aiAnalysisResults: {
          prediction: {
            classification: state.results.prediction.predicted_class,
            riskLevel: state.results.prediction.risk_level,
            overallConfidence: `${Math.round(state.results.confidence * 100)}%`
          },
          probabilityBreakdown: {
            benign: `${Math.round(state.results.prediction.probabilities.Benign * 100)}%`,
            malignant: `${Math.round(state.results.prediction.probabilities.Malignant * 100)}%`,
            suspicious: `${Math.round(state.results.prediction.probabilities.Suspicious * 100)}%`
          },
          recommendations: [
            state.results.prediction.predicted_class === 'Malignant' ? 
              'Immediate medical consultation recommended' :
            state.results.prediction.predicted_class === 'Suspicious' ? 
              'Follow-up examination recommended within 30 days' :
              'Routine monitoring recommended'
          ]
        },
        securityAndCompliance: {
          encryption: 'Post-quantum cryptographic protection applied',
          dataProcessing: 'HIPAA-compliant secure analysis',
          cacheStatus: state.results.cache_hit ? 'Retrieved from secure cache' : 'Fresh analysis performed',
          analysisTimestamp: new Date().toISOString()
        },
        disclaimer: 'This AI-generated analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment.'
      }

      // Convert to JSON string with formatting
      const jsonString = JSON.stringify(exportData, null, 2)
      
      // Create and download file
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      link.download = `QuantumHealth-Analysis-Report-${timestamp}.json`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Analysis Report Exported!', {
        description: 'Comprehensive health analysis downloaded as JSON report'
      })
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export Failed', {
        description: 'Unable to generate report. Please try again.'
      })
    }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 'clinical-data': return !!state.clinicalData
      case 'image-upload': return !!state.imageBase64
      case 'review': return !!state.clinicalData && !!state.imageBase64
      default: return false
    }
  }

  return (
    <MainLayout>
      <div className="container p-6 max-w-6xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <Brain className="h-8 w-8 text-primary" />
                <span>AI Health Prediction</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Advanced multimodal AI analysis for accurate health assessments
              </p>
            </div>
            
            {currentStep !== 'clinical-data' && (
              <Button variant="outline" onClick={handleReset}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Start Over
              </Button>
            )}
          </div>

          {/* Progress Indicator */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
                
                <div className="grid grid-cols-4 gap-4">
                  {steps.map((step, index) => {
                    const isActive = step.id === currentStep
                    const isCompleted = index < currentStepIndex
                    
                    return (
                      <div 
                        key={step.id}
                        className={`text-center p-3 rounded-lg border transition-colors ${
                          isActive ? 'border-primary bg-primary/5' : 
                          isCompleted ? 'border-green-500 bg-green-50' : 
                          'border-muted'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : isActive ? (
                            <div className="h-5 w-5 rounded-full bg-primary" />
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-muted" />
                          )}
                        </div>
                        <h3 className="text-sm font-medium">{step.title}</h3>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          
          {/* Clinical Data Step */}
          {currentStep === 'clinical-data' && (
            <PatientDataForm 
              onSubmit={handleClinicalDataSubmit}
              isLoading={predictionMutation.isPending}
              defaultValues={state.clinicalData || undefined}
            />
          )}

          {/* Image Upload Step */}
          {currentStep === 'image-upload' && (
            <div className="space-y-6">
              <ImageUpload 
                onImageSelect={handleImageSelect}
                isLoading={predictionMutation.isPending}
              />
              
              {state.clinicalData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Clinical Data Summary</CardTitle>
                    <CardDescription>Previously entered patient information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Age:</span>
                        <span className="ml-2 font-medium">{state.clinicalData.age} years</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Gender:</span>
                        <span className="ml-2 font-medium">{state.clinicalData.gender === 1 ? 'Male' : 'Female'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">BMI:</span>
                        <span className="ml-2 font-medium">{state.clinicalData.bmi}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">BP:</span>
                        <span className="ml-2 font-medium">{state.clinicalData.blood_pressure_systolic}/{state.clinicalData.blood_pressure_diastolic}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Review Step */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Review Information</span>
                  </CardTitle>
                  <CardDescription>
                    Please review all information before submitting for AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Clinical Data Review */}
                  {state.clinicalData && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Clinical Data</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div><span className="text-muted-foreground">Age:</span> {state.clinicalData.age} years</div>
                        <div><span className="text-muted-foreground">Gender:</span> {state.clinicalData.gender === 1 ? 'Male' : 'Female'}</div>
                        <div><span className="text-muted-foreground">BMI:</span> {state.clinicalData.bmi}</div>
                        <div><span className="text-muted-foreground">Blood Pressure:</span> {state.clinicalData.blood_pressure_systolic}/{state.clinicalData.blood_pressure_diastolic}</div>
                        <div><span className="text-muted-foreground">Cholesterol:</span> {state.clinicalData.cholesterol} mg/dL</div>
                        <div><span className="text-muted-foreground">Glucose:</span> {state.clinicalData.glucose} mg/dL</div>
                        <div><span className="text-muted-foreground">Smoking:</span> {state.clinicalData.smoking ? 'Yes' : 'No'}</div>
                        <div><span className="text-muted-foreground">Family History:</span> {state.clinicalData.family_history ? 'Yes' : 'No'}</div>
                        <div><span className="text-muted-foreground">Symptoms Severity:</span> {state.clinicalData.symptoms_severity}/10</div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Image Review */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Medical Image</h3>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Medical image uploaded and processed successfully</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Security Notice */}
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      All data will be encrypted using post-quantum cryptography before analysis. 
                      Your information is secure and HIPAA compliant.
                    </AlertDescription>
                  </Alert>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-4">
                    <Button 
                      size="lg" 
                      onClick={handleSubmitPrediction}
                      disabled={predictionMutation.isPending || !canProceedToNext()}
                      className="min-w-[200px]"
                    >
                      {predictionMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Analyzing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4" />
                          <span>Start AI Analysis</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Step */}
          {currentStep === 'results' && state.results && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Analysis Results
                  </CardTitle>
                  <CardDescription>
                    Quantum-enhanced health risk assessment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Prediction Results */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Prediction Classification</h3>
                    <div className="flex items-center justify-between">
                      <span>Predicted Class:</span>
                      <Badge 
                        variant={
                          state.results.prediction.predicted_class === 'Malignant' ? 'destructive' :
                          state.results.prediction.predicted_class === 'Suspicious' ? 'secondary' :
                          'default'
                        }
                        className="text-sm"
                      >
                        {state.results.prediction.predicted_class}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Risk Level:</span>
                      <Badge 
                        variant={
                          state.results.prediction.risk_level === 'High' ? 'destructive' :
                          state.results.prediction.risk_level === 'Medium' ? 'secondary' :
                          'default'
                        }
                        className="text-sm"
                      >
                        {state.results.prediction.risk_level}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Confidence Score:</span>
                        <span className="font-medium">
                          {(state.results.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={state.results.confidence * 100} className="h-2" />
                    </div>
                  </div>

                  <Separator />

                  {/* Probability Breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Probability Analysis</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Benign:</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={state.results.prediction.probabilities.Benign * 100} 
                            className="w-32 h-2" 
                          />
                          <span className="text-sm font-medium">
                            {(state.results.prediction.probabilities.Benign * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Malignant:</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={state.results.prediction.probabilities.Malignant * 100} 
                            className="w-32 h-2" 
                          />
                          <span className="text-sm font-medium">
                            {(state.results.prediction.probabilities.Malignant * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Suspicious:</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={state.results.prediction.probabilities.Suspicious * 100} 
                            className="w-32 h-2" 
                          />
                          <span className="text-sm font-medium">
                            {(state.results.prediction.probabilities.Suspicious * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Security Information */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Security & Encryption
                    </h3>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Quantum Encrypted Analysis
                        </span>
                      </div>
                      <div className="text-xs text-green-700 space-y-1">
                        <div>• Post-quantum cryptographic protection</div>
                        <div>• Secure prediction transmission</div>
                        <div>• Cache status: {state.results.cache_hit ? 'Retrieved from secure cache' : 'Fresh analysis performed'}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-center gap-3">
                <Button onClick={handleReset} size="lg">
                  New Prediction
                </Button>
                <Button variant="outline" size="lg" onClick={handleExportResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </MainLayout>
  )
}