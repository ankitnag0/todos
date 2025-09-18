"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

interface EditTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (title: string) => void
  initialTitle: string
}

export function EditTaskModal({ isOpen, onClose, onSave, initialTitle }: EditTaskModalProps) {
  const [title, setTitle] = React.useState(initialTitle)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSave(title.trim())
      setTitle("")
    }
  }

  // Reset title when initialTitle changes
  React.useEffect(() => {
    setTitle(initialTitle)
  }, [initialTitle])

  // Focus the input when the modal opens
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure the element is rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus()
        // Select all text for easier editing
        inputRef.current?.select()
      }, 10)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle escape key to close the modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  // Handle Enter key to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && title.trim()) {
      handleSubmit(e as any)
      onClose()
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg border p-4 w-full max-w-sm shadow-lg">
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Edit task..."
          className="mb-0"
        />
      </div>
    </div>
  )
}