"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Spinner } from "@/components/spinner"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  prompt?: string
}

export function SignInModal({ isOpen, onClose, prompt = "" }: SignInModalProps) {
  const { login } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await login()

      // After successful login, redirect to new chat with prompt
      if (prompt) {
        router.push(`/dashboard/new?prompt=${encodeURIComponent(prompt.trim())}`)
      } else {
        router.push("/dashboard")
      }

      onClose()
    } catch (error) {
      console.error("Login failed:", error)
      setError("Failed to sign in with Google. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Continue With CortexAI</DialogTitle>
          <DialogDescription className="text-center pt-2">
            To use CortexAI you must log into an existing account or create one.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          <Button
            className="w-full max-w-xs flex items-center justify-center gap-2"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner className="mr-2" />
            ) : (
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
            )}
            {isLoading ? "Signing in..." : "Sign In With Google"}
          </Button>

          {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}

          <p className="text-xs text-muted-foreground mt-6">
            By using CortexAI, you agree to the collection of usage data for analytics.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
