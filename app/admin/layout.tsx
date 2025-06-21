"use client"

import { useState } from "react"
import { AdminSidebar, AdminTopBar, AdminMobileSidebar } from "./_components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      <AdminMobileSidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: isCollapsed ? 80 : 280 }}
      >
        {/* Top Bar */}
        <AdminTopBar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Page Content */}
        <main className="flex-1 pt-16 p-6 lg:p-8 mt-[3rem]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}