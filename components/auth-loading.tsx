"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { Spinner } from "@/components/spinner"

export function AuthLoading({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return children
}
