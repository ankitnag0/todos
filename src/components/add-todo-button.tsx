"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

interface AddTodoButtonProps {
  onClick: () => void
}

export function AddTodoButton({ onClick }: AddTodoButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      aria-label="Add todo"
      className="w-full border border-border"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Todo
    </Button>
  )
}