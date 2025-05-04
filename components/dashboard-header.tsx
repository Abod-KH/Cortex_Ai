"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

/**
 * Dashboard header component that displays the app logo and user menu
 * Provides navigation and logout functionality
 */
export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  // Handle sign out action
  const handleSignOut = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="fixed top-0 w-full z-40 flex justify-between items-center py-2 px-4 h-16 border-b bg-background">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <div className="w-10 md:w-16 flex justify-center">{/* This space is for the sidebar toggle button */}</div>
        <Link href="/">
          <div className="font-bold text-xl cursor-pointer">
            <span className="text-primary">Cortex</span> AI
          </div>
        </Link>
      </div>

      {/* Right side - User menu */}
      <div className="flex items-center gap-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.picture || "/placeholder.svg"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
