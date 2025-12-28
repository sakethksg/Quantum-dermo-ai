"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LucideIcon } from "lucide-react"
import {
  Activity,
  Brain,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Shield,
  Database,
  TrendingUp,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

interface SidebarProps {
  className?: string
}

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | null;
  description: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const mainNavigation = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Activity,
      badge: null,
      description: "System overview and metrics"
    },
    {
      title: "AI Predictions",
      href: "/predict",
      icon: Brain,
      badge: "AI",
      description: "Quantum-powered health analysis"
    },
    {
      title: "Patient Records",
      href: "/records",
      icon: FileText,
      badge: null,
      description: "Secure patient data management"
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      badge: "Pro",
      description: "Advanced data insights"
    }
  ]

  const secondaryNavigation = [
    {
      title: "Data Sources",
      href: "/data-sources",
      icon: Database,
      description: "Connected data systems"
    },
    {
      title: "Performance",
      href: "/performance",
      icon: TrendingUp,
      description: "System performance metrics"
    },
    {
      title: "User Management",
      href: "/users",
      icon: Users,
      description: "Manage healthcare staff"
    },
    {
      title: "Appointments",
      href: "/appointments",
      icon: Calendar,
      description: "Schedule and calendar"
    }
  ]

  const bottomNavigation = [
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Application preferences"
    },
    {
      title: "Help & Support",
      href: "/help",
      icon: HelpCircle,
      description: "Documentation and support"
    }
  ]

  const NavItem = ({ item }: { item: NavItem }) => {
    const Icon = item.icon
    const isActive = pathname === item.href
    
    return (
      <Link href={item.href}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 h-10",
            isActive && "bg-secondary text-secondary-foreground",
            isCollapsed && "px-2"
          )}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="truncate">{item.title}</span>
              {item.badge && (
                <Badge variant="outline" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </Button>
      </Link>
    )
  }

  return (
    <div className={cn(
      "flex flex-col border-r bg-background",
      isCollapsed ? "w-16" : "w-64",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">QuantumHealth</span>
              <span className="text-xs text-muted-foreground">Healthcare AI</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator />

      {/* Main Navigation */}
      <div className="flex-1 p-3">
        <nav className="space-y-1">
          {!isCollapsed && (
            <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Main
            </p>
          )}
          {mainNavigation.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>

        <Separator className="my-4" />

        {/* Secondary Navigation */}
        <nav className="space-y-1">
          {!isCollapsed && (
            <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Tools
            </p>
          )}
          {secondaryNavigation.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-1">
        <Separator className="mb-3" />
        {bottomNavigation.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </div>

      {/* System Status Footer */}
      {!isCollapsed && (
        <div className="p-3 bg-muted/50">
          <div className="flex items-center space-x-2 text-xs">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">System Online</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Quantum encryption active
          </div>
        </div>
      )}
    </div>
  )
}