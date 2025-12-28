import { MainLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Activity, 
  Brain, 
  Users, 
  Shield, 
  TrendingUp, 
  CheckCircle,
  Clock
} from "lucide-react"

export default function DashboardPage() {
  const systemStats = [
    {
      title: "Total Predictions",
      value: "2,847",
      change: "+12.5%",
      icon: Brain,
      color: "text-blue-600"
    },
    {
      title: "Active Patients",
      value: "1,234",
      change: "+5.2%",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "System Uptime",
      value: "99.9%",
      change: "Last 30 days",
      icon: Activity,
      color: "text-purple-600"
    },
    {
      title: "Security Score",
      value: "A+",
      change: "Quantum Ready",
      icon: Shield,
      color: "text-orange-600"
    }
  ]

  const recentPredictions = [
    {
      id: "P-2847",
      patient: "Patient #12345",
      type: "Skin Cancer Detection",
      result: "Benign",
      confidence: 89,
      timestamp: "2 minutes ago",
      status: "completed"
    },
    {
      id: "P-2846",
      patient: "Patient #12344",
      type: "Risk Assessment", 
      result: "Low Risk",
      confidence: 94,
      timestamp: "5 minutes ago",
      status: "completed"
    },
    {
      id: "P-2845",
      patient: "Patient #12343",
      type: "Health Screening",
      result: "Suspicious",
      confidence: 76,
      timestamp: "8 minutes ago",
      status: "review"
    }
  ]

  return (
    <MainLayout>
      <div className="container p-6 space-y-6">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to QuantumHealth AI Healthcare Platform
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
            <Button>
              <Brain className="mr-2 h-4 w-4" />
              New Prediction
            </Button>
          </div>
        </div>

        {/* System Status Alert */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>All Systems Operational</AlertTitle>
          <AlertDescription>
            Quantum encryption active • Model accuracy: 94.2% • Cache hit ratio: 87%
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStats.map((stat) => {
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
                  <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Predictions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Predictions</CardTitle>
              <CardDescription>
                Latest AI-powered health assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPredictions.map((prediction) => (
                  <div key={prediction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{prediction.id}</span>
                          <Badge variant={prediction.status === 'completed' ? 'default' : 'secondary'}>
                            {prediction.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{prediction.patient}</p>
                        <p className="text-sm">{prediction.type}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{prediction.result}</span>
                        <Badge variant="outline">{prediction.confidence}%</Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {prediction.timestamp}
                      </div>
                      <Progress value={prediction.confidence} className="w-20 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>
                Real-time system monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* API Health */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">API Server</span>
                </div>
                <Badge variant="secondary">Online</Badge>
              </div>

              {/* Database Health */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Database</span>
                </div>
                <Badge variant="secondary">Connected</Badge>
              </div>

              {/* Cache Health */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Redis Cache</span>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>

              {/* Model Health */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">AI Model</span>
                </div>
                <Badge variant="secondary">Loaded</Badge>
              </div>

              {/* Security Status */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Security Level</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Maximum
                  </Badge>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>✓ Post-quantum encryption active</div>
                  <div>✓ Digital signatures verified</div>
                  <div>✓ HIPAA compliance maintained</div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </MainLayout>
  )
}