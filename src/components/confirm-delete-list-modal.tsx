"use client"

import * as React from "react"

interface ConfirmDeleteListModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  listName?: string
}

export function ConfirmDeleteListModal({ isOpen, onClose, onConfirm, listName }: ConfirmDeleteListModalProps) {
  const [shouldRender, setShouldRender] = React.useState(isOpen)

  React.useEffect(() => {
    if (isOpen) setShouldRender(true)
  }, [isOpen])

  // Keyboard handling: Enter confirms, Escape cancels
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "Enter") {
        e.preventDefault()
        onConfirm()
        onClose()
      } else if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, onConfirm])

  if (!shouldRender) return null
  if (!isOpen) return <div className="hidden" />

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg border p-6 w-full max-w-sm shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Delete this list?</h2>
          <p className="text-sm text-muted-foreground">
            {`Are you sure you want to delete${listName ? ` "${listName}"` : " this list"}? This action cannot be undone.`}
          </p>
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              className="h-9 px-3 rounded-md border bg-transparent text-foreground hover:bg-muted"
              onClick={onClose}
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 px-3 rounded-md bg-destructive text-destructive-foreground hover:opacity-90"
              onClick={() => { onConfirm(); onClose() }}
              aria-label="Confirm delete"
              autoFocus
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
