"use client"

import React, { useState } from "react"
import { MainLayout } from "@/components/layout"
import { HealthRecordCard, type HealthRecord } from "@/components/display"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2
} from "lucide-react"

// Mock data for demonstration
const mockRecords: HealthRecord[] = [
  {
    record_id: "record_67890",
    patient_id: "patient_12345",
    patient_data: {
      name: "John Doe",
      age: 35,
      medical_history: "No significant medical history",
      current_medications: ["Vitamin D3", "Multivitamin"],
      allergies: [],
      last_checkup: "2025-09-01",
      diagnosis: "Routine checkup",
      treatment_plan: "Continue current lifestyle"
    },
    timestamp: "2025-09-29T10:30:00Z",
    verification_status: "verified",
    storage_status: "encrypted_and_stored",
    signature: "digital_signature_hash_example_12345",
    public_key: "public_key_for_verification_example"
  },
  {
    record_id: "record_67891",
    patient_id: "patient_12346",
    patient_data: {
      name: "Jane Smith",
      age: 42,
      medical_history: "Hypertension, managed with medication",
      current_medications: ["Lisinopril 10mg", "Aspirin 81mg"],
      allergies: ["Penicillin"],
      last_checkup: "2025-09-15",
      diagnosis: "Hypertension - well controlled",
      treatment_plan: "Continue current medications, follow-up in 3 months"
    },
    timestamp: "2025-09-28T14:20:00Z",
    verification_status: "verified",
    storage_status: "encrypted_and_stored",
    signature: "digital_signature_hash_example_12346",
    public_key: "public_key_for_verification_example"
  },
  {
    record_id: "record_67892",
    patient_id: "patient_12347",
    patient_data: {
      name: "Michael Johnson",
      age: 28,
      medical_history: "Asthma since childhood",
      current_medications: ["Albuterol inhaler"],
      allergies: ["Tree pollen", "Dust mites"],
      last_checkup: "2025-09-20",
      diagnosis: "Asthma - stable",
      treatment_plan: "Continue rescue inhaler as needed, allergy management"
    },
    timestamp: "2025-09-27T09:15:00Z",
    verification_status: "pending",
    storage_status: "encrypted_and_stored",
    signature: "digital_signature_hash_example_12347"
  }
]

export default function RecordsPage() {
  const [records, setRecords] = useState<HealthRecord[]>(mockRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.patient_data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.record_id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || record.verification_status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleViewRecord = (recordId: string) => {
    console.log('Viewing record:', recordId)
  }

  const handleEditRecord = (recordId: string) => {
    console.log('Editing record:', recordId)
  }

  const handleDeleteRecord = (recordId: string) => {
    setRecords(records.filter(record => record.record_id !== recordId))
    console.log('Deleted record:', recordId)
  }

  const handleDownloadRecord = (recordId: string) => {
    console.log('Downloading record:', recordId)
  }

  const handleShareRecord = (recordId: string) => {
    console.log('Sharing record:', recordId)
  }

  const handleUploadRecord = () => {
    console.log('Upload new record')
  }

  const statsData = [
    {
      title: "Total Records",
      value: records.length.toString(),
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Verified",
      value: records.filter(r => r.verification_status === 'verified').length.toString(),
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Pending",
      value: records.filter(r => r.verification_status === 'pending').length.toString(),
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "This Month",
      value: records.filter(r => new Date(r.timestamp).getMonth() === new Date().getMonth()).length.toString(),
      icon: Upload,
      color: "text-purple-600"
    }
  ]

  return (
    <MainLayout>
      <div className="container p-6 space-y-6">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <span>Patient Records</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Secure patient health record management with digital verification
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}>
              {viewMode === 'grid' ? 'Table View' : 'Grid View'}
            </Button>
            <Button onClick={handleUploadRecord}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Record
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient name, patient ID, or record ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records Display */}
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No records found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start by uploading your first patient record.'
                }
              </p>
              <Button onClick={handleUploadRecord}>
                <Plus className="h-4 w-4 mr-2" />
                Upload First Record
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredRecords.map((record) => (
                  <HealthRecordCard
                    key={record.record_id}
                    record={record}
                    onView={handleViewRecord}
                    onEdit={handleEditRecord}
                    onDownload={handleDownloadRecord}
                    onShare={handleShareRecord}
                    onDelete={handleDeleteRecord}
                  />
                ))}
              </div>
            ) : (
              /* Table View */
              <Card>
                <CardHeader>
                  <CardTitle>Records Table</CardTitle>
                  <CardDescription>
                    Showing {filteredRecords.length} of {records.length} records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Record ID</TableHead>
                        <TableHead>Diagnosis</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.record_id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{record.patient_data.name}</div>
                              <div className="text-sm text-muted-foreground">{record.patient_id}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{record.record_id}</TableCell>
                          <TableCell>{record.patient_data.diagnosis}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(record.verification_status)}>
                              {getStatusIcon(record.verification_status)}
                              <span className="ml-1">{record.verification_status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(record.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewRecord(record.record_id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditRecord(record.record_id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteRecord(record.record_id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Security Notice */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            All patient records are encrypted using post-quantum cryptography and stored securely. 
            Digital signatures ensure data integrity and authenticity.
          </AlertDescription>
        </Alert>
      </div>
    </MainLayout>
  )
}