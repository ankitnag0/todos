"use client"

import * as React from "react"

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [shouldRender, setShouldRender] = React.useState(isOpen)

  // Update the render state when isOpen changes
  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    }
  }, [isOpen])

  // Handle escape key to close the modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Handle 'q' key to close the modal (secret feature)
  React.useEffect(() => {
    const handleQKey = (e: KeyboardEvent) => {
      // Only close with 'q' when the help modal is open
      if (isOpen && e.key === "q") {
        e.preventDefault()
        onClose()
      }
    }

    document.addEventListener("keydown", handleQKey)
    return () => document.removeEventListener("keydown", handleQKey)
  }, [isOpen, onClose])

  const shortcuts = [
    { key: "j", description: "Navigate down" },
    { key: "k", description: "Navigate up" },
    { key: "n", description: "New task" },
    { key: "e", description: "Edit task" },
    { key: "Space", description: "Toggle task" },
    { key: "d", description: "Delete task" },
    { key: "x", description: "Delete completed" },
    { key: "u", description: "Undo delete" },
    { key: "Shift + J", description: "Move task down" },
    { key: "Shift + K", description: "Move task up" },
    { key: "o", description: "Toggle dark mode" },
    { key: "?", description: "Toggle help" },
    { key: "Shift + N", description: "New list" },
    { key: "r", description: "Rename list" },
    { key: "h", description: "Previous list" },
    { key: "l", description: "Next list" },
  ]

  // Only render the modal content if shouldRender is true
  if (!shouldRender) return null

  // When closing, keep the component mounted but hide it
  if (!isOpen) {
    return <div className="hidden"></div>
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg border p-6 w-full max-w-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-2 gap-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-1">
              <kbd className="px-2 py-1 text-xs rounded bg-muted font-mono mr-2 whitespace-nowrap">
                {shortcut.key}
              </kbd>
              <span className="text-sm text-muted-foreground truncate text-center">
                {shortcut.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
