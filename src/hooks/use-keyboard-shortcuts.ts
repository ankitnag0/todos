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
  setTodosAction,
  setSelectedTaskIndexAction,
  setIsAddModalOpenAction,
  setIsHelpModalOpenAction,
  setIsEditModalOpenAction,
  isHelpModalOpen,
}: {
  selectedTaskIndex: number
  todos: any[]
  setTodosAction: React.Dispatch<React.SetStateAction<any[]>>
  setSelectedTaskIndexAction: React.Dispatch<React.SetStateAction<number>>
  setIsAddModalOpenAction: React.Dispatch<React.SetStateAction<boolean>>
  setIsHelpModalOpenAction: React.Dispatch<React.SetStateAction<boolean>>
  setIsEditModalOpenAction?: React.Dispatch<React.SetStateAction<boolean>>
  isHelpModalOpen: boolean
}) {
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modifier keys are pressed (except Shift for our special cases)
      if (e.metaKey || e.ctrlKey || e.altKey) return

      // Ignore if focused on an input field
      if (isInputFocused()) return

      // Prevent default behavior for keys we're using (except ? when help modal is open)
      if ([ "j", "k", " ", "Spacebar", "d", "n", "o", "O", "x", "X", "u", "U", "e", "E"].includes(e.key) || 
          (e.key === "?" && !isHelpModalOpen)) {
        e.preventDefault()
      }

      // Navigation keys
      if (e.key === "j" && !e.shiftKey) {
        // Move down (next task)
        setSelectedTaskIndexAction((prev) => Math.min(prev + 1, todos.length - 1))
      } else if (e.key === "k" && !e.shiftKey) {
        // Move up (previous task)
        setSelectedTaskIndexAction((prev) => Math.max(prev - 1, 0))
      } else if (e.key === " " || e.key === "Spacebar") {
        // Toggle the selected task
        setTodosAction((prevTodos) =>
          prevTodos.map((todo, index) =>
            index === selectedTaskIndex
              ? { ...todo, completed: !todo.completed }
              : todo
          )
        )
      } else if (e.key === "d") {
        // Delete the selected task
        const deletedTodo = todos[selectedTaskIndex];
        if (deletedTodo) {
          // Save deleted todo to localStorage for undo
          const deletedTodos = JSON.parse(localStorage.getItem('deletedTodos') || '[]');
          // Add the newly deleted todo to the beginning of the array
          deletedTodos.unshift({
            todo: deletedTodo,
            index: selectedTaskIndex
          });
          // Keep only the last 10 deleted todos
          const limitedDeletedTodos = deletedTodos.slice(0, 10);
          localStorage.setItem('deletedTodos', JSON.stringify(limitedDeletedTodos));
        }
        
        setTodosAction((prevTodos) => {
          const newTodos = prevTodos.filter((_, index) => index !== selectedTaskIndex)
          // Adjust selected index if necessary
          if (newTodos.length > 0 && selectedTaskIndex >= newTodos.length) {
            setSelectedTaskIndexAction(newTodos.length - 1)
          } else if (newTodos.length === 0) {
            setSelectedTaskIndexAction(0)
          } else if (selectedTaskIndex > newTodos.length - 1) {
            setSelectedTaskIndexAction(newTodos.length - 1)
          }
          return newTodos
        })
      } else if (e.key === "n") {
        // Open add task modal
        setIsAddModalOpenAction(true)
      } else if (e.key === "e" || e.key === "E") {
        // Open edit task modal if there's a selected task
        if (todos.length > 0 && selectedTaskIndex < todos.length) {
          setIsEditModalOpenAction?.(true)
        }
      } else if (e.key === "o" || e.key === "O") {
        // Toggle dark mode
        setTheme(theme === "dark" ? "light" : "dark")
      } else if (e.key === "?") {
        // Toggle help modal
        setIsHelpModalOpenAction(prev => !prev)
      } else if (e.key === "x" || e.key === "X") {
        // Delete all completed tasks
        const completedTodos = todos.filter((todo) => todo.completed);
        if (completedTodos.length > 0) {
          // Save deleted todos to localStorage for undo
          const deletedTodos = JSON.parse(localStorage.getItem('deletedTodos') || '[]');
          // Add the newly deleted todos with their original indices
          const todosWithIndices = completedTodos.map(todo => {
            const index = todos.findIndex(t => t.id === todo.id);
            return {
              todo: todo,
              index: index
            };
          });
          // Add to the beginning of the array
          deletedTodos.unshift(...todosWithIndices);
          // Keep only the last 10 deleted todos
          const limitedDeletedTodos = deletedTodos.slice(0, 10);
          localStorage.setItem('deletedTodos', JSON.stringify(limitedDeletedTodos));
        }
        
        setTodosAction((prevTodos) => {
          const newTodos = prevTodos.filter((todo) => !todo.completed)
          // Adjust selected index if necessary
          if (newTodos.length > 0 && selectedTaskIndex >= newTodos.length) {
            setSelectedTaskIndexAction(newTodos.length - 1)
          } else if (newTodos.length === 0) {
            setSelectedTaskIndexAction(0)
          }
          return newTodos
        })
      } else if (e.key === "u" || e.key === "U") {
        // Undo last delete
        const deletedTodosStr = localStorage.getItem('deletedTodos');
        if (deletedTodosStr) {
          const deletedTodos = JSON.parse(deletedTodosStr);
          if (deletedTodos.length > 0) {
            // Get the most recently deleted todo
            const lastDeleted = deletedTodos[0];
            
            // Remove the restored todo from deletedTodos and save back to localStorage
            const updatedDeletedTodos = deletedTodos.slice(1);
            localStorage.setItem('deletedTodos', JSON.stringify(updatedDeletedTodos));
            
            setTodosAction((prevTodos) => {
              // Insert the todo back at its original position or at the end if position is invalid
              const insertIndex = Math.min(lastDeleted.index, prevTodos.length);
              const newTodos = [...prevTodos];
              newTodos.splice(insertIndex, 0, lastDeleted.todo);
              setSelectedTaskIndexAction(insertIndex);
              return newTodos;
            });
          }
        }
      } else if (e.key === "J" || (e.key === "j" && e.shiftKey)) {
        // Move selected task down
        if (selectedTaskIndex < todos.length - 1) {
          setTodosAction((prevTodos) => {
            const newTodos = [...prevTodos]
            const temp = newTodos[selectedTaskIndex]
            newTodos[selectedTaskIndex] = newTodos[selectedTaskIndex + 1]
            newTodos[selectedTaskIndex + 1] = temp
            setSelectedTaskIndexAction(selectedTaskIndex + 1)
            return newTodos
          })
        }
      } else if (e.key === "K" || (e.key === "k" && e.shiftKey)) {
        // Move selected task up
        if (selectedTaskIndex > 0) {
          setTodosAction((prevTodos) => {
            const newTodos = [...prevTodos]
            const temp = newTodos[selectedTaskIndex]
            newTodos[selectedTaskIndex] = newTodos[selectedTaskIndex - 1]
            newTodos[selectedTaskIndex - 1] = temp
            setSelectedTaskIndexAction(selectedTaskIndex - 1)
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
    setTodosAction,
    setSelectedTaskIndexAction,
    setIsAddModalOpenAction,
    setIsHelpModalOpenAction,
    setIsEditModalOpenAction,
    isHelpModalOpen,
    theme,
    setTheme,
  ])
}