"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Database,
  Server,
  Cloud,
  Wifi,
  WifiOff,
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  RefreshCw,
  Plus,
  MoreHorizontal
} from "lucide-react"

interface DataSource {
  id: string
  name: string
  type: "database" | "api" | "cloud" | "local"
  status: "connected" | "disconnected" | "error" | "syncing"
  health: number
  lastSync: string
  recordCount: number
  latency: string
  description: string
}

export default function DataSourcesPage() {
  const dataSources: DataSource[] = [
    {
      id: "1",
      name: "Electronic Health Records",
      type: "database",
      status: "connected",
      health: 98,
      lastSync: "2 minutes ago",
      recordCount: 45782,
      latency: "12ms",
      description: "Primary EHR system containing patient medical history"
    },
    {
      id: "2",
      name: "Medical Imaging Archive",
      type: "cloud",
      status: "connected",
      health: 95,
      lastSync: "5 minutes ago",
      recordCount: 23456,
      latency: "45ms",
      description: "DICOM images and radiology reports"
    },
    {
      id: "3",
      name: "Laboratory Information System",
      type: "api",
      status: "syncing",
      health: 87,
      lastSync: "1 hour ago",
      recordCount: 78923,
      latency: "23ms",
      description: "Lab results and pathology data"
    },
    {
      id: "4",
      name: "Pharmacy Management",
      type: "database",
      status: "error",
      health: 45,
      lastSync: "6 hours ago",
      recordCount: 12345,
      latency: "timeout",
      description: "Prescription and medication history"
    },
    {
      id: "5",
      name: "Patient Monitoring Devices",
      type: "local",
      status: "connected",
      health: 92,
      lastSync: "30 seconds ago",
      recordCount: 5678,
      latency: "8ms",
      description: "Real-time patient vital signs and monitoring data"
    },
    {
      id: "6",
      name: "Insurance Claims Database",
      type: "cloud",
      status: "disconnected",
      health: 0,
      lastSync: "2 days ago",
      recordCount: 34567,
      latency: "offline",
      description: "Claims processing and billing information"
    }
  ]

  const getStatusIcon = (status: DataSource["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "disconnected":
        return <WifiOff className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: DataSource["status"]) => {
    const variants = {
      connected: "default",
      syncing: "secondary",
      error: "destructive",
      disconnected: "outline"
    } as const

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    )
  }

  const getTypeIcon = (type: DataSource["type"]) => {
    switch (type) {
      case "database":
        return <Database className="h-4 w-4" />
      case "api":
        return <Server className="h-4 w-4" />
      case "cloud":
        return <Cloud className="h-4 w-4" />
      case "local":
        return <Activity className="h-4 w-4" />
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-green-500"
    if (health >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const totalRecords = dataSources.reduce((sum, source) => sum + source.recordCount, 0)
  const connectedSources = dataSources.filter(source => source.status === "connected").length
  const avgHealth = Math.round(dataSources.reduce((sum, source) => sum + source.health, 0) / dataSources.length)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data Sources</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor connected healthcare data systems
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh All
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          </div>
        </div>

        {/* System Status Alert */}
        {dataSources.some(source => source.status === "error") && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Some data sources are experiencing connectivity issues. Check the status below and contact your system administrator if problems persist.
            </AlertDescription>
          </Alert>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dataSources.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{connectedSources}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRecords.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Health</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getHealthColor(avgHealth)}`}>
                {avgHealth}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Sources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dataSources.map((source) => (
            <Card key={source.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(source.type)}
                    <div>
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {source.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(source.status)}
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Health Indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Health Status</span>
                    <span className={`font-medium ${getHealthColor(source.health)}`}>
                      {source.health}%
                    </span>
                  </div>
                  <Progress value={source.health} className="h-2" />
                </div>

                <Separator />

                {/* Status Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(source.status)}
                        <span className="capitalize">{source.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Records</span>
                      <span className="font-medium">{source.recordCount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Latency</span>
                      <span className="font-medium">{source.latency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Sync</span>
                      <span className="font-medium">{source.lastSync}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  {source.status === "disconnected" || source.status === "error" ? (
                    <Button size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reconnect
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm">
                      <Activity className="h-4 w-4 mr-2" />
                      Monitor
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connection Guide */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Setup Guide</CardTitle>
            <CardDescription>
              Learn how to connect new data sources to QuantumHealth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium mb-1">Database</h3>
                <p className="text-sm text-muted-foreground">
                  Connect SQL/NoSQL databases with secure credentials
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Server className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium mb-1">API Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Integrate REST/GraphQL APIs with authentication
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Cloud className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium mb-1">Cloud Services</h3>
                <p className="text-sm text-muted-foreground">
                  Connect AWS, Azure, or GCP healthcare services
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Activity className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium mb-1">Real-time Data</h3>
                <p className="text-sm text-muted-foreground">
                  Stream live data from monitoring devices
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}