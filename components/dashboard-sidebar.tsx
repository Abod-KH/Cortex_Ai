"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, MessageSquare, Settings, LogOut, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

/**
 * Dashboard sidebar component that provides navigation for the dashboard
 * Includes responsive behavior for mobile (drawer) and desktop (fixed sidebar)
 */
export function DashboardSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Routes for the sidebar navigation
  const routes = [
    {
      icon: MessageSquare,
      href: "/dashboard",
      label: "Chats",
      color: "text-violet-500",
    },
    {
      icon: Settings,
      href: "/dashboard/settings",
      label: "Settings",
      color: "text-gray-500",
    },
  ]

  // Handle logout action
  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Mobile sidebar toggle button
  const MobileToggle = () => {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-3 left-3 z-50"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
    )
  }

  // Sidebar content - shared between mobile and desktop
  const SidebarContent = () => {
    return (
      <div className="space-y-4 py-4 flex flex-col h-full bg-background">
        <div className="px-3 py-2 flex-1">
          <Link href="/" className="flex items-center pl-3 mb-14">
            <div className="font-bold text-xl">
              <span className="text-primary">Cortex</span> AI
            </div>
          </Link>
          <div className="space-y-1">
            <Button asChild variant="default" size="sm" className="w-full justify-start mb-6">
              <Link href="/dashboard/new">
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </Link>
            </Button>
            <div className="space-y-1">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  asChild
                  variant={
                    pathname === route.href || (route.href === "/dashboard" && pathname?.startsWith("/dashboard/chat"))
                      ? "secondary"
                      : "ghost"
                  }
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => isMobile && setIsMobileOpen(false)}
                >
                  <Link href={route.href}>
                    <route.icon className={cn("mr-2 h-4 w-4", route.color)} />
                    {route.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    )
  }

  // Return different sidebar implementations based on screen size
  return (
    <>
      <MobileToggle />

      {/* Mobile Sidebar (Drawer) */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-40 border-r">
        <SidebarContent />
      </div>
    </>
  )
}
