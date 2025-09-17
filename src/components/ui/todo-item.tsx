"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface TodoItemProps extends React.HTMLAttributes<HTMLLIElement> {
  title: string
  completed?: boolean
  onToggle?: () => void
  onDelete?: () => void
  isSelected?: boolean
}

const TodoItem = React.forwardRef<HTMLLIElement, TodoItemProps>(
  ({ className, title, completed, onToggle, onDelete, isSelected, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm transition-colors animate-in fade-in-0 duration-300",
          completed && "opacity-75",
          isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
          className
        )}
        {...props}
      >
        <Checkbox
          checked={completed}
          onCheckedChange={onToggle}
          className={cn(
            "size-5 rounded-full border border-input",
            completed && "bg-primary border-primary"
          )}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        />
        <span
          className={cn(
            "flex-1 text-sm font-medium",
            completed && "line-through"
          )}
        >
          {title}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="size-8 text-muted-foreground hover:text-destructive"
          aria-label="Delete todo"
        >
          <Trash2 className="size-4" />
        </Button>
      </li>
    )
  }
)

TodoItem.displayName = "TodoItem"

export { TodoItem }