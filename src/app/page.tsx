"use client"

import * as React from "react"
import { TodoList } from "@/components/ui/todo-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AddTaskModal } from "@/components/add-task-modal";
import { ModeToggle } from "@/components/mode-toggle";
import { HelpModal } from "@/components/help-modal";
import { EditTaskModal } from "@/components/edit-task-modal";
import { AddTodoButton } from "@/components/add-todo-button";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { getCycledTodoListName } from "@/lib/todo-list-names";

export default function Home() {
  // Load todos from localStorage or use default todos
  const [todos, setTodos] = React.useState<any[]>([]);
  const [isTodosLoaded, setIsTodosLoaded] = React.useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = React.useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [todoListName, setTodoListName] = React.useState<string | null>(null);
  const [isClient, setIsClient] = React.useState(false);

  // Load todos from localStorage on client mount
  React.useEffect(() => {
    setIsClient(true);
    
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      setTodos(parsedTodos);
      // Also update the selected index if needed
      if (parsedTodos.length > 0 && selectedTaskIndex >= parsedTodos.length) {
        setSelectedTaskIndex(Math.max(0, parsedTodos.length - 1));
      }
    } else {
      // If no saved todos, use the default list as a guide
      setTodos([
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
      ]);
    }
    setIsTodosLoaded(true);
  }, []);

  // Save todos to localStorage whenever they change
  React.useEffect(() => {
    if (isClient && isTodosLoaded) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isClient, isTodosLoaded]);

  // Initialize and update the todo list name based on visit count
  React.useEffect(() => {
    if (!isClient) return;
    
    // Get visit count from localStorage
    const storedVisitCount = localStorage.getItem("todoVisitCount");
    const newVisitCount = storedVisitCount ? parseInt(storedVisitCount, 10) + 1 : 0;
    
    // Get the new name for this visit
    const newName = getCycledTodoListName(newVisitCount);
    
    // Save updated visit count
    localStorage.setItem("todoVisitCount", newVisitCount.toString());
    
    // Save the current name for next visit
    localStorage.setItem("currentTodoListName", newName);
    
    // Set the todo list name for this visit
    setTodoListName(newName);
  }, [isClient]);

  const remainingTasks = todos.filter(todo => !todo.completed).length;
  
  // Use our custom keyboard shortcuts hook
  useKeyboardShortcuts({
    selectedTaskIndex,
    todos,
    setTodosAction: setTodos,
    setSelectedTaskIndexAction: setSelectedTaskIndex,
    setIsAddModalOpenAction: setIsAddModalOpen,
    setIsHelpModalOpenAction: setIsHelpModalOpen,
    setIsEditModalOpenAction: setIsEditModalOpen,
    isHelpModalOpen,
  });

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
    );
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
                  {isClient && todoListName ? todoListName : <span className="invisible">Placeholder</span>}
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
              todos={todos} 
              onToggle={(id) => setTodos(todos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
              ))}
              onDelete={(id) => {
                const deletedTodoIndex = todos.findIndex(todo => todo.id === id);
                setTodos(todos.filter(todo => todo.id !== id));
                // Adjust selected index if necessary
                if (todos.length > 1) {
                  if (deletedTodoIndex === selectedTaskIndex && selectedTaskIndex === todos.length - 1) {
                    // If we deleted the last item and it was selected, select the new last item
                    setSelectedTaskIndex(Math.max(0, todos.length - 2));
                  } else if (deletedTodoIndex < selectedTaskIndex) {
                    // If we deleted an item before the selected item, adjust the index
                    setSelectedTaskIndex(Math.max(0, selectedTaskIndex - 1));
                  }
                } else {
                  // If we deleted the last/only item, reset to 0
                  setSelectedTaskIndex(0);
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
          };
          setTodos([...todos, newTask]);
          // Select the newly added task
          setSelectedTaskIndex(todos.length);
          setIsAddModalOpen(false);
        }}
      />
      
      <HelpModal 
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
      
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialTitle={todos[selectedTaskIndex]?.title || ""}
        onSave={(title) => {
          setTodos(todos.map((todo, index) => 
            index === selectedTaskIndex ? { ...todo, title } : todo
          ));
          setIsEditModalOpen(false);
        }}
      />
    </div>
  );
}
