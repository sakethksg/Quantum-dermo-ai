"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Brain, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Copy,
  Download,
  Share,
  Eye,
  Lock
} from "lucide-react"

interface PredictionResultsProps {
  prediction: {
    predicted_class: string
    probabilities: {
      Benign: number
      Malignant: number
      Suspicious: number
    }
    risk_level: string
  }
  confidence: number
  encrypted_prediction: string
  cache_hit: boolean
  timestamp?: string
  patientId?: string
  onViewDetails?: () => void
  onDownloadReport?: () => void
  onShareResults?: () => void
}

export function PredictionResults({ 
  prediction,
  confidence,
  encrypted_prediction,
  cache_hit,
  timestamp,
  patientId,
  onViewDetails,
  onDownloadReport,
  onShareResults
}: PredictionResultsProps) {
  
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getClassColor = (className: string) => {
    switch (className.toLowerCase()) {
      case 'benign': return 'text-green-600'
      case 'malignant': return 'text-red-600'
      case 'suspicious': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const getClassIcon = (className: string) => {
    switch (className.toLowerCase()) {
      case 'benign': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'malignant': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'suspicious': return <Eye className="h-5 w-5 text-orange-600" />
      default: return <Brain className="h-5 w-5 text-gray-600" />
    }
  }

  const handleCopyEncryption = async () => {
    try {
      await navigator.clipboard.writeText(encrypted_prediction)
      // You would typically show a toast notification here
    } catch (err) {
      console.error('Failed to copy encrypted data:', err)
    }
  }

  const confidencePercentage = Math.round(confidence * 100)

  return (
    <div className="space-y-6">
      {/* Main Results Card */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>AI Prediction Results</CardTitle>
                <CardDescription>
                  Quantum-secure analysis powered by multimodal AI
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {cache_hit && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Cached
                </Badge>
              )}
              <Badge className={getRiskColor(prediction.risk_level)}>
                {prediction.risk_level} Risk
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Primary Prediction */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              {getClassIcon(prediction.predicted_class)}
              <h2 className={`text-3xl font-bold ${getClassColor(prediction.predicted_class)}`}>
                {prediction.predicted_class}
              </h2>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg text-muted-foreground">
                Confidence: {confidencePercentage}%
              </p>
              <Progress value={confidencePercentage} className="h-3 max-w-md mx-auto" />
            </div>
          </div>

          <Separator />

          {/* Probability Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Detailed Probabilities</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(prediction.probabilities).map(([className, probability]) => {
                const percentage = Math.round(probability * 100)
                const isHighest = className === prediction.predicted_class
                
                return (
                  <div 
                    key={className}
                    className={`p-4 rounded-lg border ${isHighest ? 'border-primary bg-primary/5' : 'border-border'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${getClassColor(className)}`}>
                        {className}
                      </span>
                      {isHighest && (
                        <Badge variant="secondary" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Probability</span>
                        <span className="font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Security Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security & Encryption</span>
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Post-Quantum Encrypted</span>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    {encrypted_prediction.substring(0, 100)}...
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyEncryption}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Encrypted Data
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Algorithm:</span>
                    <span className="font-medium">Quantum-Resistant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Encryption:</span>
                    <span className="font-medium">AES-256 + PQC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compliance:</span>
                    <span className="font-medium">HIPAA Ready</span>
                  </div>
                  {timestamp && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Generated:</span>
                      <span className="font-medium">{new Date(timestamp).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {onViewDetails && (
              <Button variant="outline" onClick={onViewDetails}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            )}
            
            {onDownloadReport && (
              <Button variant="outline" onClick={onDownloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            )}
            
            {onShareResults && (
              <Button variant="outline" onClick={onShareResults}>
                <Share className="h-4 w-4 mr-2" />
                Share Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Results generated using FDA-validated AI models with {confidencePercentage}% confidence. 
          {patientId && ` Patient ID: ${patientId}.`}
          Always consult with healthcare professionals for final diagnosis.
        </AlertDescription>
      </Alert>
    </div>
  )
}