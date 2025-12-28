"use client"

import React, { useState } from "react"
import { MainLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Activity, 
  Shield,
  Brain,
  Calendar,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

// Mock analytics data
const predictionAccuracyData = [
  { month: 'Jan', accuracy: 92.3, predictions: 245 },
  { month: 'Feb', accuracy: 93.1, predictions: 289 },
  { month: 'Mar', accuracy: 94.2, predictions: 312 },
  { month: 'Apr', accuracy: 93.8, predictions: 298 },
  { month: 'May', accuracy: 94.7, predictions: 356 },
  { month: 'Jun', accuracy: 95.1, predictions: 389 },
  { month: 'Jul', accuracy: 94.9, predictions: 412 },
  { month: 'Aug', accuracy: 95.3, predictions: 445 },
  { month: 'Sep', accuracy: 94.2, predictions: 423 }
]

const riskDistributionData = [
  { name: 'Low Risk', value: 1847, color: '#10b981' },
  { name: 'Medium Risk', value: 892, color: '#f59e0b' },
  { name: 'High Risk', value: 324, color: '#ef4444' }
]

const classificationData = [
  { category: 'Benign', count: 1456, percentage: 67.2 },
  { category: 'Suspicious', count: 512, percentage: 23.6 },
  { category: 'Malignant', count: 198, percentage: 9.2 }
]

const systemPerformanceData = [
  { time: '00:00', cpu: 45, memory: 62, cache_hit: 87 },
  { time: '04:00', cpu: 42, memory: 58, cache_hit: 89 },
  { time: '08:00', cpu: 78, memory: 71, cache_hit: 85 },
  { time: '12:00', cpu: 85, memory: 76, cache_hit: 82 },
  { time: '16:00', cpu: 92, memory: 81, cache_hit: 78 },
  { time: '20:00', cpu: 76, memory: 69, cache_hit: 84 }
]

const securityMetrics = [
  { metric: 'Encryption Success Rate', value: 99.98, trend: 'up' },
  { metric: 'Signature Verification', value: 99.95, trend: 'up' },
  { metric: 'Access Control Violations', value: 0.02, trend: 'down' },
  { metric: 'Data Integrity Checks', value: 100, trend: 'stable' }
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  const keyMetrics = [
    {
      title: "Total Predictions",
      value: "3,847",
      change: "+12.5%",
      trend: "up",
      icon: Brain,
      color: "text-blue-600"
    },
    {
      title: "Accuracy Rate",
      value: "94.2%",
      change: "+0.8%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Active Users",
      value: "127",
      change: "+5.2%",
      trend: "up",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "System Uptime",
      value: "99.9%",
      change: "0.0%",
      trend: "stable",
      icon: Shield,
      color: "text-orange-600"
    }
  ]

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1']

  return (
    <MainLayout>
      <div className="container p-6 space-y-6">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <span>Analytics Dashboard</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive insights into system performance and prediction analytics
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center space-x-1 text-sm">
                    {getTrendIcon(metric.trend)}
                    <span className={
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 
                      'text-muted-foreground'
                    }>
                      {metric.change}
                    </span>
                    <span className="text-muted-foreground">from last period</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Prediction Accuracy Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Prediction Accuracy Trend</CardTitle>
              <CardDescription>Model accuracy over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={predictionAccuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Accuracy (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Level Distribution</CardTitle>
              <CardDescription>Patient risk assessment breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Predictions Volume */}
          <Card>
            <CardHeader>
              <CardTitle>Prediction Volume</CardTitle>
              <CardDescription>Monthly prediction requests</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={predictionAccuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="predictions" fill="#10b981" name="Predictions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* System Performance */}
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>Real-time system metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={systemPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="cpu" 
                    stackId="1" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.6}
                    name="CPU %"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="memory" 
                    stackId="2" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                    fillOpacity={0.6}
                    name="Memory %"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cache_hit" 
                    stackId="3" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                    name="Cache Hit %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Classification Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Classification Breakdown</CardTitle>
            <CardDescription>Distribution of prediction classifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classificationData.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">{item.count.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                    </div>
                    <div className="w-32">
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Metrics</span>
            </CardTitle>
            <CardDescription>Post-quantum security performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {securityMetrics.map((metric) => (
                <div key={metric.metric} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="text-2xl font-bold">
                    {metric.value}
                    {metric.metric.includes('Rate') || metric.metric.includes('Checks') ? '%' : ''}
                  </div>
                  <Progress 
                    value={metric.value} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>System Alerts</span>
            </CardTitle>
            <CardDescription>Recent system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">System Health Check Passed</p>
                  <p className="text-xs text-muted-foreground">All components operating normally - 2 minutes ago</p>
                </div>
                <Badge variant="secondary">INFO</Badge>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Activity className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Cache Performance Optimized</p>
                  <p className="text-xs text-muted-foreground">Cache hit ratio improved to 87% - 15 minutes ago</p>
                </div>
                <Badge variant="secondary">SUCCESS</Badge>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Calendar className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Scheduled Maintenance</p>
                  <p className="text-xs text-muted-foreground">Database maintenance scheduled for tonight at 2 AM EST</p>
                </div>
                <Badge variant="outline">SCHEDULED</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}