"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

interface RenameModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => void
  initialName: string
}

export function RenameModal({ isOpen, onClose, onSave, initialName }: RenameModalProps) {
  const [name, setName] = React.useState(initialName)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSave(name.trim())
      setName("")
    }
  }

  // Reset name when initialName changes
  React.useEffect(() => {
    setName(initialName)
  }, [initialName])

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
    if (e.key === "Enter" && name.trim()) {
      handleSubmit(e as unknown as React.FormEvent);
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter new list name..."
          className="mb-0"
        />
      </div>
    </div>
  )
}