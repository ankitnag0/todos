"use client"

import * as React from "react"
import { useTheme } from "next-themes"

// Check if the active element is an input field
export const isInputFocused = () => {
  const activeElement = document.activeElement
  return (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement ||
    activeElement?.hasAttribute("contenteditable")
  )
}

// Custom hook for handling keyboard shortcuts
export function useKeyboardShortcuts({
  selectedTaskIndex,
  todos,
  setSelectedTaskIndex,
  handleToggle,
  handleDelete,
  setIsAddModalOpen,
}: {
  selectedTaskIndex: number
  todos: any[]
  setSelectedTaskIndex: React.Dispatch<React.SetStateAction<number>>
  handleToggle: (id: string) => void
  handleDelete: (id: string) => void
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modifier keys are pressed
      if (e.metaKey || e.ctrlKey || e.altKey) return

      // Ignore if focused on an input field
      if (isInputFocused()) return

      // Prevent default behavior for keys we're using
      if (["j", "k", " ", "Spacebar", "d", "n", "o", "O"].includes(e.key)) {
        e.preventDefault()
      }

      // Navigation keys
      if (e.key === "j") {
        // Move down (next task)
        setSelectedTaskIndex((prev) => Math.min(prev + 1, todos.length - 1))
      } else if (e.key === "k") {
        // Move up (previous task)
        setSelectedTaskIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === " " || e.key === "Spacebar") {
        // Toggle the selected task
        handleToggle(todos[selectedTaskIndex].id)
      } else if (e.key === "d") {
        // Delete the selected task
        handleDelete(todos[selectedTaskIndex].id)
      } else if (e.key === "n") {
        // Open add task modal
        setIsAddModalOpen(true)
      } else if (e.key === "o" || e.key === "O") {
        // Toggle dark mode
        setTheme(theme === "dark" ? "light" : "dark")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    selectedTaskIndex,
    todos,
    setSelectedTaskIndex,
    handleToggle,
    handleDelete,
    setIsAddModalOpen,
    theme,
    setTheme,
  ])
}