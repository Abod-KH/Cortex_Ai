"use client"

import type React from "react"
import { GoogleOAuthProvider as GoogleProvider } from "@react-oauth/google"
import { AuthProvider } from "@/context/auth-context"

export function GoogleOAuthProvider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID || ""

  if (!clientId) {
    console.error("Missing NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID")
    return <>{children}</>
  }

  return (
    <GoogleProvider clientId={clientId}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleProvider>
  )
}
