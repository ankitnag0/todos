"use client"

import * as React from "react"
import { TodoItem } from "@/components/ui/todo-item"

interface Todo {
  id: string
  title: string
  completed: boolean
}

interface TodoListProps extends React.HTMLAttributes<HTMLUListElement> {
  todos: Todo[]
  onToggleTodo?: (id: string) => void
  onDelete?: (id: string) => void
  selectedTaskIndex?: number
}

const TodoList = React.forwardRef<HTMLUListElement, TodoListProps>(
  ({ className, todos, onToggleTodo, onDelete, selectedTaskIndex = 0, ...props }, ref) => {
    // Calculate the visible window of 5 todos centered around the selected item
    const [visibleStartIndex, setVisibleStartIndex] = React.useState(0)

    // Update the visible window when selection or todos change
    React.useEffect(() => {
      // Keep the selected item in view by adjusting the window
      if (selectedTaskIndex < visibleStartIndex) {
        setVisibleStartIndex(selectedTaskIndex)
      } else if (selectedTaskIndex >= visibleStartIndex + 5) {
        setVisibleStartIndex(Math.max(0, selectedTaskIndex - 4))
      }
      // When todos are deleted, adjust the window to try to show 5 items if possible
      else if (todos.length < visibleStartIndex + 5 && visibleStartIndex > 0) {
        // Move the window back to try to show 5 items
        const newStartIndex = Math.max(0, todos.length - 5)
        setVisibleStartIndex(newStartIndex)
      }
    }, [selectedTaskIndex, visibleStartIndex, todos.length])

    // Get the visible todos (5 at a time)
    const visibleTodos = todos.slice(visibleStartIndex, visibleStartIndex + 5)

    return (
      <ul ref={ref} className={className} {...props}>
        {visibleTodos.map((todo, index) => {
          const actualIndex = visibleStartIndex + index
          return (
            <TodoItem
  key={todo.id}
  title={todo.title}
  completed={todo.completed}
  onToggle={() => onToggleTodo?.(todo.id)}
  onDelete={() => onDelete?.(todo.id)}
  isSelected={actualIndex === selectedTaskIndex}
/>
          )
        })}
      </ul>
    )
  }
)

TodoList.displayName = "TodoList"

export { TodoList }