import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { GoogleOAuthProvider } from "@/components/google-oauth-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Cortex AI",
  description: "AI-powered code generation and app building platform",
    generator: 'v0.dev'
}

/**
 * Root layout component that wraps the entire application
 * Provides theme, authentication, and database context
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <ConvexClientProvider>
            <GoogleOAuthProvider>{children}</GoogleOAuthProvider>
          </ConvexClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
