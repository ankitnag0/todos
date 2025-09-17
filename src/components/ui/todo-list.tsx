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
  onToggle?: (id: string) => void
  onDelete?: (id: string) => void
  selectedTaskIndex?: number
}

const TodoList = React.forwardRef<HTMLUListElement, TodoListProps>(
  ({ className, todos, onToggle, onDelete, selectedTaskIndex = 0, ...props }, ref) => {
    return (
      <ul ref={ref} className={className} {...props}>
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            title={todo.title}
            completed={todo.completed}
            onToggle={() => onToggle?.(todo.id)}
            onDelete={() => onDelete?.(todo.id)}
            isSelected={index === selectedTaskIndex}
          />
        ))}
      </ul>
    )
  }
)

TodoList.displayName = "TodoList"

export { TodoList }