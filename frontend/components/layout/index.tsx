"use client"

import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { Footer } from "./footer"

interface MainLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  showFooter?: boolean
}

export function MainLayout({ 
  children, 
  showSidebar = true, 
  showFooter = true 
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Main Content Area */}
      <div className="flex">
        {/* Sidebar */}
        {showSidebar && <Sidebar />}
        
        {/* Page Content */}
        <main className="flex-1 flex flex-col min-h-[calc(100vh-4rem)]">
          <div className="flex-1">
            {children}
          </div>
          
          {/* Footer */}
          {showFooter && <Footer />}
        </main>
      </div>
    </div>
  )
}

// Export individual components for flexibility
export { Header, Sidebar, Footer }