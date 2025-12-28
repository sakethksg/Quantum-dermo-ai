import { MainLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="container p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <Settings className="h-8 w-8 text-primary" />
            <span>Settings</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure your QuantumHealth platform preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Settings Coming Soon</CardTitle>
            <CardDescription>
              Advanced configuration options will be available here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page is under development. Settings functionality will include:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-sm text-muted-foreground">
              <li>User preferences and profile management</li>
              <li>Security and encryption settings</li>
              <li>API configuration and access keys</li>
              <li>Notification preferences</li>
              <li>Data export and backup options</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}