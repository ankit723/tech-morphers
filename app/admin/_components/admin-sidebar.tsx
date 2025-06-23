"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Calculator,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  Bell,
  Search,
  Mail,
  Contact,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Package
} from "lucide-react"
import { ModeToggle } from "@/components/ui/themeToggle"
import { User as PrismaUser } from "@prisma/client"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview and analytics",
    category: "main",
    role: ["ADMIN"]
  },
  {
    title: "Clients",
    href: "/admin/clients",
    icon: Users,
    description: "Manage client accounts",
    category: "main",
    role: ["ADMIN"]
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
    description: "Review payment submissions",
    category: "finance",
    role: ["ADMIN"]
  },
  {
    title: "Invoices",
    href: "/admin/invoices",
    icon: FileText,
    description: "Manage invoices",
    category: "finance",
    role: ["ADMIN"]
  },
  {
    title: "Client Deliveries",
    href: "/admin/deliveries",
    icon: Package,
    description: "Upload project deliverables",
    category: "main",
    role: ["ADMIN", "DEVELOPER"]
  },
  {
    title: "Case Studies",
    href: "/admin/case-studies",
    icon: FileText,
    description: "Manage case studies",
    category: "content",
    role: ["ADMIN", "MARKETING"]
  },
  {
    title: "Blogs",
    href: "/admin/blogs",
    icon: FileText,
    description: "Content management",
    category: "content",
    role: ["ADMIN", "MARKETING"]
  },
  {
    title: "Contact Us",
    href: "/admin/contact-us",
    icon: MessageSquare,
    description: "Customer messages",
    category: "leads",
    role: ["ADMIN"]
  },
  {
    title: "Get Started",
    href: "/admin/get-started",
    icon: MessageSquare,
    description: "Customer messages",
    category: "leads",
    role: ["ADMIN"]

  },
  {
    title: "Talk to Us",
    href: "/admin/talk-to-us",
    icon: MessageSquare,
    description: "Customer messages",
    category: "leads",
    role: ["ADMIN"]
  },
  {
    title: "Let's Talk",
    href: "/admin/lets-talk",
    icon: Mail,
    description: "Newsletter subscriptions",
    category: "leads",
    role: ["ADMIN"]
  },
  {
    title: "Contact Page",
    href: "/admin/contact-page",
    icon: Contact,
    description: "General contact inquiries",
    category: "leads",
    role: ["ADMIN"]
  },
  {
    title: "Estimator Requests",
    href: "/admin/estimators",
    icon: Calculator,
    description: "Project estimates",
    category: "leads",
    role: ["ADMIN"]
  },
  {
    title: "Scheduled Calls",
    href: "/admin/scheduled-calls",
    icon: Calendar,
    description: "Manage scheduled calls",
    category: "leads",
    role: ["ADMIN"]
  },
  {
    title: "Manage Resources",
    href: "/admin/resources",
    icon: FileText,
    description: "Manage resources",
    category: "main",
    role: ["ADMIN", "DEVELOPER"]
  }
]

const categories = {
  main: { title: "Main", items: navItems.filter(item => item.category === "main") },
  finance: { title: "Finance", items: navItems.filter(item => item.category === "finance") },
  leads: { title: "Lead Management", items: navItems.filter(item => item.category === "leads") },
  content: { title: "Content", items: navItems.filter(item => item.category === "content") },
}

interface AdminSidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  user: PrismaUser
  logout: () => void
}

export function AdminSidebar({ isCollapsed, setIsCollapsed, user, logout }: AdminSidebarProps) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!mounted) {
    return null
  }

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 flex flex-col shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <motion.div 
              className="relative w-8 h-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/admin">
                <Image src="/logo.png" alt="Tech Morphers" fill className="object-contain" />
              </Link>
            </motion.div>
            <Link href="/admin" className="flex items-center">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Portal
              </span>
            </Link>
          </div>
        )}
        
        {isCollapsed && (
          <div className="flex justify-center w-full">
            <motion.div 
              className="relative w-8 h-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/admin">
                <Image src="/logo.png" alt="Tech Morphers" fill className="object-contain" />
              </Link>
            </motion.div>
          </div>
        )}

        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6">
          {Object.entries(categories).map(([key, category]) => (
            <div key={key}>
              {!isCollapsed && (
                <div className="px-4 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {category.title}
                  </h3>
                </div>
              )}
              
              <div className="space-y-1">
                {category.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  const isAllowed = item.role.includes(user?.role)
                  if (!isAllowed) return null
                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        className={`relative mx-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                          isActive
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        title={isCollapsed ? item.title : undefined}
                      >
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{item.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {item.description}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg -z-10"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Settings & Profile */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
        <Link href="/admin/settings">
          <motion.div
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </motion.div>
        </Link>

        <motion.button
          onClick={handleLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </motion.button>
      </div>
    </motion.aside>
  )
}

// Top bar component for mobile and additional controls
interface AdminTopBarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  user: PrismaUser
  logout: () => void
}

export function AdminTopBar({ isCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, user, logout }: AdminTopBarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!mounted) {
    return null
  }

  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="fixed top-0 right-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-800/20"
      style={{ left: isCollapsed ? 80 : 280 }}
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Search className="w-4 h-4" />
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.role}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
                >
                  <Link
                    href="/admin/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

// Mobile sidebar overlay
interface AdminMobileSidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function AdminMobileSidebar({ isOpen, setIsOpen }: AdminMobileSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, setIsOpen])

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="relative w-8 h-8"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/admin">
                    <Image src="/logo.png" alt="Tech Morphers" fill className="object-contain" />
                  </Link>
                </motion.div>
                <Link href="/admin" className="flex items-center">
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Admin Portal
                  </span>
                </Link>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-6">
                {Object.entries(categories).map(([key, category]) => (
                  <div key={key}>
                    <div className="px-4 mb-2">
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {category.title}
                      </h3>
                    </div>
                    
                    <div className="space-y-1">
                      {category.items.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        
                        return (
                          <Link key={item.href} href={item.href}>
                            <motion.div
                              className={`relative mx-2 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3">
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium">{item.title}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.description}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* Settings & Profile */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
              <Link href="/admin/settings">
                <motion.div
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Settings className="w-5 h-5 flex-shrink-0" />
                  <span>Settings</span>
                </motion.div>
              </Link>

              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 