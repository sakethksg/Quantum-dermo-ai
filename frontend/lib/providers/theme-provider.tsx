"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: "dark" | "light"
  isTransitioning: boolean
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  actualTheme: "light",
  isTransitioning: false
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "quantumhealth-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [actualTheme, setActualTheme] = useState<"dark" | "light">("light")
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme

    if (storedTheme) {
      setTheme(storedTheme)
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "system") {
        updateActualTheme(theme, mediaQuery.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [storageKey, theme])

  const updateActualTheme = (themeValue: Theme, systemIsDark?: boolean) => {
    const root = window.document.documentElement
    let isDark: boolean

    if (themeValue === "system") {
      isDark = systemIsDark ?? window.matchMedia("(prefers-color-scheme: dark)").matches
    } else {
      isDark = themeValue === "dark"
    }

    setActualTheme(isDark ? "dark" : "light")
    
    root.classList.remove("light", "dark")
    root.classList.add(isDark ? "dark" : "light")
  }

  const handleSetTheme = (newTheme: Theme) => {
    setIsTransitioning(true)
    
    localStorage.setItem(storageKey, newTheme)
    setTheme(newTheme)
    updateActualTheme(newTheme)
    
    // Reset transition state after theme change completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 200)
  }

  useEffect(() => {
    updateActualTheme(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: handleSetTheme,
    actualTheme,
    isTransitioning
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}