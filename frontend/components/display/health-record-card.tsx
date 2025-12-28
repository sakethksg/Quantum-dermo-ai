"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  User, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Edit,
  Download,
  Share,
  Trash2,
  Eye,
  Heart,
  Pill
} from "lucide-react"

interface HealthRecord {
  record_id: string
  patient_id: string
  patient_data: {
    name: string
    age: number
    medical_history: string
    current_medications: string[]
    allergies: string[]
    last_checkup: string
    diagnosis: string
    treatment_plan: string
  }
  timestamp: string
  verification_status: 'verified' | 'pending' | 'failed'
  storage_status: 'encrypted_and_stored' | 'processing' | 'failed'
  signature?: string
  public_key?: string
}

interface HealthRecordCardProps {
  record: HealthRecord
  onView?: (recordId: string) => void
  onEdit?: (recordId: string) => void
  onDownload?: (recordId: string) => void
  onShare?: (recordId: string) => void
  onDelete?: (recordId: string) => void
  compact?: boolean
}

export function HealthRecordCard({
  record,
  onView,
  onEdit,
  onDownload,
  onShare,
  onDelete,
  compact = false
}: HealthRecordCardProps) {
  
  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'failed': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'failed': return <AlertTriangle className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (compact) {
    return (
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{record.patient_data.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {record.patient_data.diagnosis}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={getVerificationColor(record.verification_status)}>
                {getVerificationIcon(record.verification_status)}
                <span className="ml-1">{record.verification_status}</span>
              </Badge>
              
              {onView && (
                <Button variant="ghost" size="sm" onClick={() => onView(record.record_id)}>
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Health Record</span>
                <Badge variant="outline">{record.record_id}</Badge>
              </CardTitle>
              <CardDescription>
                Last updated: {formatDate(record.timestamp)}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={getVerificationColor(record.verification_status)}>
              {getVerificationIcon(record.verification_status)}
              <span className="ml-1">{record.verification_status}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Patient Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Patient Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-sm font-medium">{record.patient_data.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Age</label>
              <p className="text-sm">{record.patient_data.age} years</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Patient ID</label>
              <p className="text-sm font-mono">{record.patient_id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Checkup</label>
              <p className="text-sm">{formatDate(record.patient_data.last_checkup)}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Medical Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Medical Information</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Current Diagnosis</label>
              <p className="text-sm mt-1 p-3 bg-muted/50 rounded-lg">
                {record.patient_data.diagnosis}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Medical History</label>
              <p className="text-sm mt-1 p-3 bg-muted/50 rounded-lg">
                {record.patient_data.medical_history}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Treatment Plan</label>
              <p className="text-sm mt-1 p-3 bg-muted/50 rounded-lg">
                {record.patient_data.treatment_plan}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Medications and Allergies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Pill className="h-4 w-4" />
              <span>Current Medications</span>
            </h4>
            <div className="space-y-1">
              {record.patient_data.current_medications.length > 0 ? (
                record.patient_data.current_medications.map((medication, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-1">
                    {medication}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No current medications</p>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Allergies</span>
            </h4>
            <div className="space-y-1">
              {record.patient_data.allergies.length > 0 ? (
                record.patient_data.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="mr-2 mb-1">
                    {allergy}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No known allergies</p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Security Information */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security & Verification</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Storage Status:</span>
                <Badge variant="outline">{record.storage_status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Digital Signature:</span>
                <span className="font-medium">{record.signature ? 'Present' : 'None'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Public Key:</span>
                <span className="font-medium">{record.public_key ? 'Verified' : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Encryption:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          {onView && (
            <Button variant="outline" onClick={() => onView(record.record_id)}>
              <Eye className="h-4 w-4 mr-2" />
              View Full
            </Button>
          )}
          
          {onEdit && (
            <Button variant="outline" onClick={() => onEdit(record.record_id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          
          {onDownload && (
            <Button variant="outline" onClick={() => onDownload(record.record_id)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
          
          {onShare && (
            <Button variant="outline" onClick={() => onShare(record.record_id)}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
          
          {onDelete && (
            <Button variant="destructive" onClick={() => onDelete(record.record_id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>

      {/* Verification Alert */}
      {record.verification_status !== 'verified' && (
        <div className="px-6 pb-6">
          <Alert variant={record.verification_status === 'failed' ? 'destructive' : 'default'}>
            {getVerificationIcon(record.verification_status)}
            <AlertDescription>
              {record.verification_status === 'pending' && 
                'Record verification is in progress. Digital signature validation pending.'}
              {record.verification_status === 'failed' && 
                'Record verification failed. Please check digital signature and try again.'}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  )
}

export type { HealthRecord }