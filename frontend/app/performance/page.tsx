"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Server,
  RefreshCw,
  Download,
  Settings
} from "lucide-react"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface SystemMetric {
  id: string
  name: string
  value: number
  unit: string
  status: "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  target: number
  description: string
}

export default function PerformancePage() {
  const performanceData = [
    { time: "00:00", cpu: 45, memory: 62, network: 23, storage: 78 },
    { time: "04:00", cpu: 52, memory: 58, network: 31, storage: 79 },
    { time: "08:00", cpu: 78, memory: 71, network: 67, storage: 82 },
    { time: "12:00", cpu: 85, memory: 79, network: 89, storage: 84 },
    { time: "16:00", cpu: 73, memory: 66, network: 45, storage: 86 },
    { time: "20:00", cpu: 61, memory: 59, network: 32, storage: 88 },
    { time: "24:00", cpu: 48, memory: 55, network: 28, storage: 89 }
  ]

  const responseTimeData = [
    { time: "00:00", prediction: 120, upload: 250, query: 45 },
    { time: "04:00", prediction: 135, upload: 280, query: 52 },
    { time: "08:00", prediction: 180, upload: 420, query: 78 },
    { time: "12:00", prediction: 195, upload: 450, query: 89 },
    { time: "16:00", prediction: 165, upload: 380, query: 67 },
    { time: "20:00", prediction: 145, upload: 320, query: 55 },
    { time: "24:00", prediction: 125, upload: 260, query: 48 }
  ]

  const throughputData = [
    { service: "AI Predictions", requests: 1247, avgTime: 180 },
    { service: "File Uploads", requests: 523, avgTime: 320 },
    { service: "Database Queries", requests: 3452, avgTime: 45 },
    { service: "User Authentication", requests: 892, avgTime: 25 },
    { service: "Health Records", requests: 2156, avgTime: 78 },
    { service: "Analytics", requests: 445, avgTime: 120 }
  ]

  const systemMetrics: SystemMetric[] = [
    {
      id: "cpu",
      name: "CPU Usage",
      value: 68,
      unit: "%",
      status: "warning",
      trend: "up",
      target: 80,
      description: "Average CPU utilization across all nodes"
    },
    {
      id: "memory",
      name: "Memory Usage",
      value: 72,
      unit: "%",
      status: "good",
      trend: "stable",
      target: 85,
      description: "RAM consumption including cache and buffers"
    },
    {
      id: "storage",
      name: "Storage Usage",
      value: 89,
      unit: "%",
      status: "critical",
      trend: "up",
      target: 90,
      description: "Disk space utilization across data volumes"
    },
    {
      id: "network",
      name: "Network I/O",
      value: 45,
      unit: "Mbps",
      status: "good",
      trend: "down",
      target: 100,
      description: "Combined ingress and egress traffic"
    },
    {
      id: "response",
      name: "Avg Response Time",
      value: 165,
      unit: "ms",
      status: "good",
      trend: "down",
      target: 200,
      description: "Average response time across all endpoints"
    },
    {
      id: "uptime",
      name: "System Uptime",
      value: 99.8,
      unit: "%",
      status: "good",
      trend: "stable",
      target: 99.9,
      description: "Service availability over the last 30 days"
    }
  ]

  const getStatusColor = (status: SystemMetric["status"]) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
    }
  }

  const getStatusIcon = (status: SystemMetric["status"]) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getTrendIcon = (trend: SystemMetric["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case "stable":
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const getMetricIcon = (id: string) => {
    switch (id) {
      case "cpu":
        return <Cpu className="h-5 w-5" />
      case "memory":
        return <Server className="h-5 w-5" />
      case "storage":
        return <HardDrive className="h-5 w-5" />
      case "network":
        return <Wifi className="h-5 w-5" />
      case "response":
        return <Clock className="h-5 w-5" />
      case "uptime":
        return <Zap className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  const criticalAlerts = systemMetrics.filter(metric => metric.status === "critical")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">System Performance</h1>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring and performance analytics
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Critical performance issues detected: {criticalAlerts.map(alert => alert.name).join(", ")}. 
              Immediate action may be required to maintain system stability.
            </AlertDescription>
          </Alert>
        )}

        {/* System Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {systemMetrics.map((metric) => (
            <Card key={metric.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {getMetricIcon(metric.id)}
                  {metric.name}
                </CardTitle>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(metric.trend)}
                  {getStatusIcon(metric.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2 mb-2">
                  <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}
                  </div>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
                <Progress 
                  value={(metric.value / metric.target) * 100} 
                  className="h-2 mb-2" 
                />
                <p className="text-xs text-muted-foreground">{metric.description}</p>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="text-muted-foreground">Target: {metric.target}{metric.unit}</span>
                  <Badge variant={metric.status === "good" ? "default" : metric.status === "warning" ? "secondary" : "destructive"}>
                    {metric.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* System Resource Usage */}
          <Card>
            <CardHeader>
              <CardTitle>System Resource Usage (24h)</CardTitle>
              <CardDescription>
                Real-time monitoring of CPU, memory, network, and storage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU %" />
                  <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory %" />
                  <Line type="monotone" dataKey="network" stroke="#ffc658" name="Network %" />
                  <Line type="monotone" dataKey="storage" stroke="#ff7300" name="Storage %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Response Time Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Response Time Trends (24h)</CardTitle>
              <CardDescription>
                Average response times by service type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="prediction" stackId="1" stroke="#8884d8" fill="#8884d8" name="AI Predictions (ms)" />
                  <Area type="monotone" dataKey="upload" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="File Uploads (ms)" />
                  <Area type="monotone" dataKey="query" stackId="1" stroke="#ffc658" fill="#ffc658" name="DB Queries (ms)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Service Throughput */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Service Throughput & Performance</CardTitle>
            <CardDescription>
              Request volume and average response times by service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={throughputData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="requests" fill="#8884d8" name="Requests/hour" />
                <Bar yAxisId="right" dataKey="avgTime" fill="#82ca9d" name="Avg Time (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Recommendations</CardTitle>
            <CardDescription>
              AI-powered insights and optimization suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium text-yellow-800">Storage Optimization</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Storage usage is approaching capacity (89%). Consider implementing data archiving for records older than 2 years or adding additional storage capacity.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-blue-800">CPU Load Balancing</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Peak CPU usage occurs during business hours (8 AM - 5 PM). Consider implementing auto-scaling or load balancing to distribute AI prediction workloads.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-green-800">Database Query Optimization</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Database queries are performing well with an average response time of 45ms. Current indexing strategy is effective for the workload.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-purple-800">Network Optimization</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Consider implementing CDN for static assets and image compression for medical imaging uploads to reduce bandwidth usage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health Summary */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium">Overall System Health: Good</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Last updated: 2 minutes ago</span>
              <span>Next maintenance: Sunday 2:00 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}