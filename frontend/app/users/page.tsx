"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Edit,
  Trash2,
  Download,
  Upload
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "doctor" | "nurse" | "technician" | "analyst"
  department: string
  status: "active" | "inactive" | "pending"
  lastLogin: string
  permissions: string[]
  phone: string
  avatar?: string
  joinDate: string
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const users: User[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@quantumhealth.com",
      role: "doctor",
      department: "Cardiology",
      status: "active",
      lastLogin: "2 hours ago",
      permissions: ["read_records", "write_records", "ai_predictions", "patient_management"],
      phone: "+1 (555) 123-4567",
      joinDate: "2023-01-15"
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@quantumhealth.com",
      role: "admin",
      department: "IT Operations",
      status: "active",
      lastLogin: "30 minutes ago",
      permissions: ["full_access", "user_management", "system_config", "data_export"],
      phone: "+1 (555) 234-5678",
      joinDate: "2022-08-20"
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@quantumhealth.com",
      role: "nurse",
      department: "Emergency",
      status: "active",
      lastLogin: "1 hour ago",
      permissions: ["read_records", "patient_monitoring", "medication_admin"],
      phone: "+1 (555) 345-6789",
      joinDate: "2023-03-10"
    },
    {
      id: "4",
      name: "David Park",
      email: "david.park@quantumhealth.com",
      role: "technician",
      department: "Radiology",
      status: "inactive",
      lastLogin: "2 days ago",
      permissions: ["read_records", "imaging_access", "equipment_management"],
      phone: "+1 (555) 456-7890",
      joinDate: "2023-06-05"
    },
    {
      id: "5",
      name: "Dr. Lisa Wang",
      email: "lisa.wang@quantumhealth.com",
      role: "doctor",
      department: "Oncology",
      status: "active",
      lastLogin: "15 minutes ago",
      permissions: ["read_records", "write_records", "ai_predictions", "research_access"],
      phone: "+1 (555) 567-8901",
      joinDate: "2022-11-30"
    },
    {
      id: "6",
      name: "James Wilson",
      email: "james.wilson@quantumhealth.com",
      role: "analyst",
      department: "Data Analytics",
      status: "pending",
      lastLogin: "Never",
      permissions: ["analytics_access", "report_generation"],
      phone: "+1 (555) 678-9012",
      joinDate: "2025-09-28"
    }
  ]

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "doctor":
        return "bg-blue-100 text-blue-800"
      case "nurse":
        return "bg-green-100 text-green-800"
      case "technician":
        return "bg-yellow-100 text-yellow-800"
      case "analyst":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: User["status"]) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      pending: "outline"
    } as const

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    )
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const roleStats = {
    admin: users.filter(u => u.role === "admin").length,
    doctor: users.filter(u => u.role === "doctor").length,
    nurse: users.filter(u => u.role === "nurse").length,
    technician: users.filter(u => u.role === "technician").length,
    analyst: users.filter(u => u.role === "analyst").length
  }

  const statusStats = {
    active: users.filter(u => u.status === "active").length,
    inactive: users.filter(u => u.status === "inactive").length,
    pending: users.filter(u => u.status === "pending").length
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage healthcare staff and system access permissions
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Users
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import Users
            </Button>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Pending Users Alert */}
        {statusStats.pending > 0 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              {statusStats.pending} user{statusStats.pending > 1 ? "s" : ""} pending approval. Review and approve new user registrations.
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusStats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doctors</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{roleStats.doctor}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nurses</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{roleStats.nurse}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statusStats.pending}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filter Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select 
                className="px-3 py-2 border rounded-md bg-background"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="technician">Technician</option>
                <option value="analyst">Analyst</option>
              </select>
              
              <select 
                className="px-3 py-2 border rounded-md bg-background"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Healthcare staff members and their access permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>{user.department}</TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(user.status)}
                        {getStatusBadge(user.status)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {user.lastLogin}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Role Permissions Matrix */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Role Permissions Matrix</CardTitle>
            <CardDescription>
              Standard permissions by user role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-red-800">Admin</h4>
                <div className="text-sm space-y-1">
                  <div>✓ Full System Access</div>
                  <div>✓ User Management</div>
                  <div>✓ System Configuration</div>
                  <div>✓ Data Export/Import</div>
                  <div>✓ Audit Logs</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800">Doctor</h4>
                <div className="text-sm space-y-1">
                  <div>✓ Patient Records</div>
                  <div>✓ AI Predictions</div>
                  <div>✓ Prescription Management</div>
                  <div>✓ Clinical Notes</div>
                  <div>✓ Research Access</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-green-800">Nurse</h4>
                <div className="text-sm space-y-1">
                  <div>✓ Patient Monitoring</div>
                  <div>✓ Medication Admin</div>
                  <div>✓ Vital Signs</div>
                  <div>✓ Care Plans</div>
                  <div>✗ AI Predictions</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-yellow-800">Technician</h4>
                <div className="text-sm space-y-1">
                  <div>✓ Equipment Management</div>
                  <div>✓ Imaging Access</div>
                  <div>✓ Lab Results</div>
                  <div>✗ Patient Records</div>
                  <div>✗ AI Predictions</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-purple-800">Analyst</h4>
                <div className="text-sm space-y-1">
                  <div>✓ Analytics Dashboard</div>
                  <div>✓ Report Generation</div>
                  <div>✓ Data Visualization</div>
                  <div>✗ Patient Records</div>
                  <div>✗ Clinical Data</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}