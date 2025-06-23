"use client"

import { useEffect, useState, useTransition } from "react"
import { AdminSidebar, AdminTopBar, AdminMobileSidebar } from "./_components/admin-sidebar"
import { getCurrentAdminUser, logoutAdminUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, startTransition] = useTransition();
  const [user, setUser] = useState<any>(null);
  const [userChecked, setUserChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    startTransition(async () => {
      const fetchUser = async () => {
        const userResult = await getCurrentAdminUser();
        if (userResult.success) {
          setUser(userResult.user);
        } else {
          setUser(null);
        }
        setUserChecked(true);
      }
      fetchUser();
    });
  }, []);

  useEffect(() => {
    console.log("User", user);
  }, [user]);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (userChecked && !user) {
      router.push("/login");
    }
  }, [user, userChecked, router]);

  if (isLoading || !userChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} user={user} logout={logoutAdminUser}/>
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
          user={user}
          logout={logoutAdminUser}
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