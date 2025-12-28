"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Activity, 
  Brain, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut, 
  User, 
  Shield,
  Moon,
  Sun
} from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const navigation = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Activity,
      description: "Overview and system status"
    },
    {
      title: "Predict",
      href: "/predict",
      icon: Brain,
      description: "AI-powered health predictions"
    },
    {
      title: "Records",
      href: "/records",
      icon: FileText,
      description: "Patient records management"
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      description: "Data insights and reports"
    }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-6">
        
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none">QuantumHealth</span>
              <span className="text-xs text-muted-foreground">AI Healthcare Platform</span>
            </div>
          </Link>
          <Badge variant="secondary" className="ml-2">
            v1.0.0
          </Badge>
        </div>

        {/* Main Navigation */}
        <NavigationMenu className="mx-6 hidden md:flex">
          <NavigationMenuList>
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={`
                      group inline-flex h-10 w-max items-center justify-center rounded-md 
                      px-4 py-2 text-sm font-medium transition-colors
                      hover:bg-accent hover:text-accent-foreground 
                      focus:bg-accent focus:text-accent-foreground 
                      focus:outline-none disabled:pointer-events-none disabled:opacity-50
                      ${isActive ? 'bg-accent text-accent-foreground' : ''}
                    `}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center space-x-4">
          
          {/* System Status Indicator */}
          <div className="hidden items-center space-x-2 lg:flex">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">All Systems Online</span>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/01.png" alt="Dr. Sarah Johnson" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Dr. Sarah Johnson</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    sarah.johnson@quantumhealth.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}