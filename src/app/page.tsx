"use client"

import * as React from "react"
import { TodoList } from "@/components/ui/todo-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { AddTaskModal } from "@/components/add-task-modal"
import { ModeToggle } from "@/components/mode-toggle"
import { HelpModal } from "@/components/help-modal"
import { EditTaskModal } from "@/components/edit-task-modal"
import { RenameModal } from "@/components/rename-modal"
import { AddTodoButton } from "@/components/add-todo-button"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Todo, TodoList as TodoListType } from "@/types/todo"

export default function Home() {
  // Load todo lists from localStorage or use default
  const [todoLists, setTodoLists] = React.useState<TodoListType[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentListIndex, setCurrentListIndex] = React.useState(0)
  const [isTodosLoaded, setIsTodosLoaded] = React.useState(false)
  const [selectedTaskIndex, setSelectedTaskIndex] = React.useState(0)
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isRenameModalOpen, setIsRenameModalOpen] = React.useState(false)
  const [isClient, setIsClient] = React.useState(false)

  // Function to create a new todo list
  const createNewList = React.useCallback(() => {
    setTodoLists(prev => {
      const newList: TodoListType = {
        id: Date.now().toString(),
        name: `List ${prev.length + 1}`,
        todos: []
      }
      const updatedLists = [...prev, newList];
      // Set the current list to the newly created list
      setCurrentListIndex(updatedLists.length - 1)
      // Reset selected task index for the new list
      setSelectedTaskIndex(0)
      return updatedLists
    })
  }, [setTodoLists, setCurrentListIndex, setSelectedTaskIndex])

  // Get current list
  const currentList = todoLists[currentListIndex] || { id: "1", name: "Todos", todos: [] }

  // Load todo lists from localStorage on client mount
  React.useEffect(() => {
    setIsClient(true)

    const savedTodoLists = localStorage.getItem('todoLists')
    if (savedTodoLists) {
      const parsedLists = JSON.parse(savedTodoLists)
      setTodoLists(parsedLists)
      // Also update the selected index if needed
      if (parsedLists.length > 0 && parsedLists[currentListIndex] && selectedTaskIndex >= parsedLists[currentListIndex].todos.length) {
        setSelectedTaskIndex(Math.max(0, parsedLists[currentListIndex].todos.length - 1))
      }
    } else {
      // If no saved lists, create a default list
      const defaultList: TodoListType = {
        id: "1",
        name: "Todos",
        todos: [
          {
            id: "1",
            title: "Use j/k to move up and down",
            completed: false,
          },
          {
            id: "2",
            title: "Press Space to check/uncheck tasks",
            completed: false,
          },
          {
            id: "3",
            title: "Press n to create new tasks",
            completed: false,
          },
          {
            id: "4",
            title: "Press d to delete selected tasks",
            completed: false,
          },
          {
            id: "5",
            title: "Press ? for help and all shortcuts",
            completed: false,
          },
        ]
      }
      setTodoLists([defaultList])
    }
    setIsTodosLoaded(true)
  }, [])

  // Save todo lists to localStorage whenever they change
  React.useEffect(() => {
    if (isClient) {
      localStorage.setItem('todoLists', JSON.stringify(todoLists))
    }
  }, [todoLists, isClient])

  const remainingTasks = currentList.todos.filter(todo => !todo.completed).length

  // Use our custom keyboard shortcuts hook
  useKeyboardShortcuts({
    selectedTaskIndex,
    todos: currentList.todos,
    setTodosAction: (newTodos) => {
      const updatedLists = [...todoLists];
      updatedLists[currentListIndex] = {
        ...currentList,
        todos: Array.isArray(newTodos) ? newTodos : newTodos(currentList.todos)
      };
      setTodoLists(updatedLists);
    },
    setSelectedTaskIndexAction: setSelectedTaskIndex,
    setIsAddModalOpenAction: setIsAddModalOpen,
    setIsHelpModalOpenAction: setIsHelpModalOpen,
    setIsEditModalOpenAction: setIsEditModalOpen,
    setIsRenameModalOpenAction: setIsRenameModalOpen,
    onCreateNewListAction: createNewList,
    currentListIndex,
    totalLists: todoLists.length,
    setCurrentListIndexAction: setCurrentListIndex,
    isHelpModalOpen,
  })

  // Show loading state until todos are loaded
  if (!isTodosLoaded) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center" tabIndex={-1}>
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="p-6 pb-4 relative">
              <div className="absolute top-4 right-4">
                <ModeToggle />
              </div>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-2xl mb-1 text-left">
                    <div className="h-7 bg-muted rounded w-52"></div>
                  </CardTitle>
                  <CardDescription className="text-left text-sm">
                    <span className="h-5 bg-muted rounded w-36 inline-block"></span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <div className="px-6 pt-0">
              <div className="border-b border-border/50"></div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 bg-muted rounded-lg"></div>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <div className="h-9 rounded-md bg-muted"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center" tabIndex={-1}>
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="p-6 pb-4 relative">
            <div className="absolute top-4 right-4">
              <ModeToggle />
            </div>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl mb-1 text-left truncate">
                  {currentList.name}
                </CardTitle>
                <CardDescription className="text-left text-sm">
                  {isClient ? `${remainingTasks} ${remainingTasks === 1 ? 'task' : 'tasks'} remaining` : "Loading..."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <div className="px-6 pt-0">
            <div className="border-b border-border/50"></div>
          </div>
          <CardContent className="p-6">
            <TodoList
              todos={currentList.todos}
              onToggleTodo={(id) => {
                const updatedLists = [...todoLists]
                updatedLists[currentListIndex] = {
                  ...currentList,
                  todos: currentList.todos.map(todo =>
                    todo.id === id ? { ...todo, completed: !todo.completed } : todo
                  )
                }
                setTodoLists(updatedLists)
              }}
              onDelete={(id) => {
                const deletedTodoIndex = currentList.todos.findIndex(todo => todo.id === id)
                const updatedLists = [...todoLists]
                updatedLists[currentListIndex] = {
                  ...currentList,
                  todos: currentList.todos.filter(todo => todo.id !== id)
                }
                setTodoLists(updatedLists)
                // Adjust selected index if necessary
                if (currentList.todos.length > 1) {
                  if (deletedTodoIndex === selectedTaskIndex && selectedTaskIndex === currentList.todos.length - 1) {
                    // If we deleted the last item and it was selected, select the new last item
                    setSelectedTaskIndex(Math.max(0, currentList.todos.length - 2))
                  } else if (deletedTodoIndex < selectedTaskIndex) {
                    // If we deleted an item before the selected item, adjust the index
                    setSelectedTaskIndex(Math.max(0, selectedTaskIndex - 1))
                  }
                } else {
                  // If we deleted the last/only item, reset to 0
                  setSelectedTaskIndex(0)
                }
              }}
              selectedTaskIndex={selectedTaskIndex}
              className="space-y-4"
            />
            <div className="mt-6 flex justify-center">
              <AddTodoButton onClick={() => setIsAddModalOpen(true)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(title) => {
          const newTask = {
            id: Date.now().toString(),
            title,
            completed: false,
          }
          const updatedLists = [...todoLists]
          updatedLists[currentListIndex] = {
            ...currentList,
            todos: [...currentList.todos, newTask]
          }
          setTodoLists(updatedLists)
          // Select the newly added task
          setSelectedTaskIndex(currentList.todos.length)
          setIsAddModalOpen(false)
        }}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialTitle={currentList.todos[selectedTaskIndex]?.title || ""}
        onSave={(title) => {
          const updatedLists = [...todoLists]
          updatedLists[currentListIndex] = {
            ...currentList,
            todos: currentList.todos.map((todo, index) =>
              index === selectedTaskIndex ? { ...todo, title } : todo
            )
          }
          setTodoLists(updatedLists)
          setIsEditModalOpen(false)
        }}
      />

      <RenameModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        initialName={currentList.name}
        onSave={(name) => {
          const updatedLists = [...todoLists]
          updatedLists[currentListIndex] = {
            ...currentList,
            name
          }
          setTodoLists(updatedLists)
          setIsRenameModalOpen(false)
        }}
      />
    </div>
  )
}
