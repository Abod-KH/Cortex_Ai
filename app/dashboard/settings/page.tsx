"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"

/**
 * Settings page component that displays user account information
 * Allows users to manage their account settings and log out
 */
export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [isLoading, user, router])

  // Handle logout action
  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Show loading spinner while authentication is in progress
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="h-full">
      <DashboardHeader />
      <DashboardSidebar />
      <main className="md:pl-64 pt-16 h-full">
        <div className="p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold mb-6">Settings</h1>

          <div className="grid gap-6 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Preferences settings will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
