"use client"

import type * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: React.PropsWithChildren<ThemeProviderProps>) {
  return (
    <NextThemesProvider {...props} attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </NextThemesProvider>
  )
}
