"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Video,
  Stethoscope
} from "lucide-react"

interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  doctorName: string
  department: string
  type: "consultation" | "follow-up" | "surgery" | "emergency" | "telemedicine"
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show"
  date: string
  time: string
  duration: number
  location: string
  notes?: string
  priority: "low" | "medium" | "high" | "urgent"
}

export default function AppointmentsPage() {
  const [view, setView] = useState<"day" | "week" | "month">("day")
  const [searchTerm, setSearchTerm] = useState("")

  const appointments: Appointment[] = [
    {
      id: "1",
      patientName: "John Smith",
      patientEmail: "john.smith@email.com",
      doctorName: "Dr. Sarah Johnson",
      department: "Cardiology",
      type: "consultation",
      status: "confirmed",
      date: "2025-09-30",
      time: "09:00",
      duration: 30,
      location: "Room 301A",
      notes: "Annual cardiac checkup",
      priority: "medium"
    },
    {
      id: "2",
      patientName: "Maria Garcia",
      patientEmail: "maria.garcia@email.com",
      doctorName: "Dr. Lisa Wang",
      department: "Oncology",
      type: "follow-up",
      status: "in-progress",
      date: "2025-09-30",
      time: "09:30",
      duration: 45,
      location: "Room 205B",
      notes: "Post-treatment follow-up",
      priority: "high"
    },
    {
      id: "3",
      patientName: "Robert Brown",
      patientEmail: "robert.brown@email.com",
      doctorName: "Dr. Michael Chen",
      department: "Emergency",
      type: "emergency",
      status: "scheduled",
      date: "2025-09-30",
      time: "10:15",
      duration: 60,
      location: "ER Bay 3",
      notes: "Chest pain evaluation",
      priority: "urgent"
    },
    {
      id: "4",
      patientName: "Jennifer Lee",
      patientEmail: "jennifer.lee@email.com",
      doctorName: "Dr. Sarah Johnson",
      department: "Cardiology",
      type: "telemedicine",
      status: "confirmed",
      date: "2025-09-30",
      time: "11:00",
      duration: 30,
      location: "Virtual - Room 1",
      notes: "Medication adjustment consultation",
      priority: "medium"
    },
    {
      id: "5",
      patientName: "David Wilson",
      patientEmail: "david.wilson@email.com",
      doctorName: "Dr. Emily Rodriguez",
      department: "Surgery",
      type: "surgery",
      status: "scheduled",
      date: "2025-09-30",
      time: "14:00",
      duration: 120,
      location: "OR 2",
      notes: "Arthroscopic knee surgery",
      priority: "high"
    },
    {
      id: "6",
      patientName: "Sarah Davis",
      patientEmail: "sarah.davis@email.com",
      doctorName: "Dr. James Park",
      department: "Radiology",
      type: "consultation",
      status: "no-show",
      date: "2025-09-30",
      time: "08:30",
      duration: 30,
      location: "Room 102",
      notes: "MRI results review",
      priority: "low"
    }
  ]

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: Appointment["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: Appointment["type"]) => {
    switch (type) {
      case "consultation":
        return <Stethoscope className="h-4 w-4" />
      case "follow-up":
        return <Clock className="h-4 w-4" />
      case "surgery":
        return <AlertTriangle className="h-4 w-4" />
      case "emergency":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "telemedicine":
        return <Video className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "no-show":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <CalendarIcon className="h-4 w-4 text-blue-500" />
    }
  }

  const todaysAppointments = appointments.filter(apt => apt.date === "2025-09-30")
  const filteredAppointments = todaysAppointments.filter(apt =>
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const appointmentStats = {
    total: todaysAppointments.length,
    confirmed: todaysAppointments.filter(apt => apt.status === "confirmed").length,
    inProgress: todaysAppointments.filter(apt => apt.status === "in-progress").length,
    completed: todaysAppointments.filter(apt => apt.status === "completed").length,
    cancelled: todaysAppointments.filter(apt => apt.status === "cancelled").length,
    noShow: todaysAppointments.filter(apt => apt.status === "no-show").length
  }

  const upcomingUrgent = todaysAppointments.filter(apt => 
    apt.priority === "urgent" && 
    (apt.status === "scheduled" || apt.status === "confirmed")
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground mt-1">
              Schedule and manage patient appointments
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Urgent Appointments Alert */}
        {upcomingUrgent.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {upcomingUrgent.length} urgent appointment{upcomingUrgent.length > 1 ? "s" : ""} scheduled for today. 
              Review emergency cases and ensure adequate preparation.
            </AlertDescription>
          </Alert>
        )}

        {/* Date Navigation */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">September 30, 2025</h2>
                  <p className="text-sm text-muted-foreground">Monday</p>
                </div>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant={view === "day" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setView("day")}
                >
                  Day
                </Button>
                <Button 
                  variant={view === "week" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setView("week")}
                >
                  Week
                </Button>
                <Button 
                  variant={view === "month" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setView("month")}
                >
                  Month
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointmentStats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{appointmentStats.confirmed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{appointmentStats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{appointmentStats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{appointmentStats.cancelled}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No Shows</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{appointmentStats.noShow}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments by patient, doctor, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAppointments
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((appointment) => (
            <Card key={appointment.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-1 h-16 rounded ${getPriorityColor(appointment.priority)}`} />
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(appointment.type)}
                      <div>
                        <CardTitle className="text-lg">{appointment.patientName}</CardTitle>
                        <CardDescription>
                          {appointment.doctorName} • {appointment.department}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(appointment.status)}
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Time and Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{appointment.time}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.duration} minutes
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{appointment.location}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.type}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Contact */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.patientEmail}</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Notes */}
                {appointment.notes && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm">{appointment.notes}</p>
                  </div>
                )}

                <Separator />

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    Priority: {appointment.priority}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    {appointment.status === "scheduled" || appointment.status === "confirmed" ? (
                      <>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm">
                          Start Appointment
                        </Button>
                      </>
                    ) : appointment.status === "in-progress" ? (
                      <Button size="sm">
                        Complete
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common appointment management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Plus className="h-6 w-6 mb-2" />
                Schedule New
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Clock className="h-6 w-6 mb-2" />
                Reschedule
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Video className="h-6 w-6 mb-2" />
                Virtual Consult
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <AlertTriangle className="h-6 w-6 mb-2" />
                Emergency Slot
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}