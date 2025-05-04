"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useGoogleLogin, googleLogout, type TokenResponse } from "@react-oauth/google"

type User = {
  id: string
  name: string
  email: string
  picture: string
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
  login: () => Promise<User | void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const createUser = useMutation(api.users.createUser)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("cortex_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("cortex_user")
      }
    }
    setIsLoading(false)
  }, [])

  const fetchUserInfo = useCallback(
    async (accessToken: string) => {
      try {
        const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user info")
        }

        const userInfo = await response.json()

        // Create a user object from Google user info
        const googleUser = {
          id: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
        }

        // Create or update the user in the database
        await createUser({
          userId: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
          imageUrl: googleUser.picture,
        })

        setUser(googleUser)
        localStorage.setItem("cortex_user", JSON.stringify(googleUser))
        return googleUser
      } catch (error) {
        console.error("Error fetching user info:", error)
        throw error
      }
    },
    [createUser],
  )

  const googleLoginFn = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      try {
        await fetchUserInfo(tokenResponse.access_token)
      } catch (error) {
        console.error("Login failed:", error)
      }
    },
    onError: (errorResponse) => {
      console.error("Login failed:", errorResponse)
    },
  })

  const login = async (): Promise<User | void> => {
    try {
      googleLoginFn()
      return user
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = () => {
    googleLogout()
    setUser(null)
    localStorage.removeItem("cortex_user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
