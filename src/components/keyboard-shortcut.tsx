"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function KeyboardShortcut() {
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the 'o' key is pressed
      if (e.key === "o" || e.key === "O") {
        e.preventDefault()
        // Toggle between dark and light mode
        setTheme(theme === "dark" ? "light" : "dark")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [theme, setTheme])

  return null
}