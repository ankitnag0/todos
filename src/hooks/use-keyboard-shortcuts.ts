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
  setTodos,
  setSelectedTaskIndex,
  setIsAddModalOpen,
}: {
  selectedTaskIndex: number
  todos: any[]
  setTodos: React.Dispatch<React.SetStateAction<any[]>>
  setSelectedTaskIndex: React.Dispatch<React.SetStateAction<number>>
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modifier keys are pressed (except Shift for our special cases)
      if (e.metaKey || e.ctrlKey || e.altKey) return

      // Ignore if focused on an input field
      if (isInputFocused()) return

      // Prevent default behavior for keys we're using
      if (["j", "k", " ", "Spacebar", "d", "n", "o", "O", "x", "X"].includes(e.key)) {
        e.preventDefault()
      }

      // Navigation keys
      if (e.key === "j" && !e.shiftKey) {
        // Move down (next task)
        setSelectedTaskIndex((prev) => Math.min(prev + 1, todos.length - 1))
      } else if (e.key === "k" && !e.shiftKey) {
        // Move up (previous task)
        setSelectedTaskIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === " " || e.key === "Spacebar") {
        // Toggle the selected task
        setTodos((prevTodos) =>
          prevTodos.map((todo, index) =>
            index === selectedTaskIndex
              ? { ...todo, completed: !todo.completed }
              : todo
          )
        )
      } else if (e.key === "d") {
        // Delete the selected task
        setTodos((prevTodos) => {
          const newTodos = prevTodos.filter((_, index) => index !== selectedTaskIndex)
          // Adjust selected index if necessary
          if (newTodos.length > 0 && selectedTaskIndex >= newTodos.length) {
            setSelectedTaskIndex(newTodos.length - 1)
          } else if (newTodos.length === 0) {
            setSelectedTaskIndex(0)
          }
          return newTodos
        })
      } else if (e.key === "n") {
        // Open add task modal
        setIsAddModalOpen(true)
      } else if (e.key === "o" || e.key === "O") {
        // Toggle dark mode
        setTheme(theme === "dark" ? "light" : "dark")
      } else if (e.key === "x" || e.key === "X") {
        // Delete all completed tasks
        setTodos((prevTodos) => {
          const newTodos = prevTodos.filter((todo) => !todo.completed)
          // Adjust selected index if necessary
          if (newTodos.length > 0 && selectedTaskIndex >= newTodos.length) {
            setSelectedTaskIndex(newTodos.length - 1)
          } else if (newTodos.length === 0) {
            setSelectedTaskIndex(0)
          }
          return newTodos
        })
      } else if (e.key === "J" || (e.key === "j" && e.shiftKey)) {
        // Move selected task down
        if (selectedTaskIndex < todos.length - 1) {
          setTodos((prevTodos) => {
            const newTodos = [...prevTodos]
            const temp = newTodos[selectedTaskIndex]
            newTodos[selectedTaskIndex] = newTodos[selectedTaskIndex + 1]
            newTodos[selectedTaskIndex + 1] = temp
            setSelectedTaskIndex(selectedTaskIndex + 1)
            return newTodos
          })
        }
      } else if (e.key === "K" || (e.key === "k" && e.shiftKey)) {
        // Move selected task up
        if (selectedTaskIndex > 0) {
          setTodos((prevTodos) => {
            const newTodos = [...prevTodos]
            const temp = newTodos[selectedTaskIndex]
            newTodos[selectedTaskIndex] = newTodos[selectedTaskIndex - 1]
            newTodos[selectedTaskIndex - 1] = temp
            setSelectedTaskIndex(selectedTaskIndex - 1)
            return newTodos
          })
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    selectedTaskIndex,
    todos,
    setTodos,
    setSelectedTaskIndex,
    setIsAddModalOpen,
    theme,
    setTheme,
  ])
}