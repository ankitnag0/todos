"use client"

import * as React from "react"
import { TodoList } from "@/components/ui/todo-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AddTaskModal } from "@/components/add-task-modal";
import { ModeToggle } from "@/components/mode-toggle";
import { HelpModal } from "@/components/help-modal";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { getCycledTodoListName } from "@/lib/todo-list-names";

export default function Home() {
  // Load todos from localStorage or use default todos
  const [todos, setTodos] = React.useState<any[]>([]);
  const [isTodosLoaded, setIsTodosLoaded] = React.useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = React.useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false);
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
          title: "Press Space to check/uncheck task",
          completed: false,
        },
        {
          id: "3",
          title: "n to create new tasks",
          completed: false,
        },
        {
          id: "4",
          title: "d to delete selected task",
          completed: false,
        },
        {
          id: "5",
          title: "? for help and all shortcuts",
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
    isHelpModalOpen,
  });

  // Show loading state until todos are loaded
  if (!isTodosLoaded) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center" tabIndex={-1}>
        <ModeToggle />
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center p-6">
              <CardTitle className="text-2xl h-9 flex items-center justify-center mb-2">
                <div className="h-7 bg-muted rounded w-52"></div>
              </CardTitle>
              <CardDescription className="h-6 flex items-center justify-center">
                <span className="h-5 bg-muted rounded w-36 inline-block"></span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 bg-muted rounded-lg"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center" tabIndex={-1}>
      <ModeToggle />
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center p-6">
            <CardTitle className="text-2xl h-9 flex items-center justify-center mb-2">
              {isClient && todoListName ? todoListName : <span className="invisible">Placeholder</span>}
            </CardTitle>
            <CardDescription className="h-6 flex items-center justify-center">
              {isClient ? `${remainingTasks} ${remainingTasks === 1 ? 'task' : 'tasks'} remaining` : "Loading..."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <TodoList 
              todos={todos} 
              onToggle={(id) => setTodos(todos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
              ))}
              onDelete={(id) => setTodos(todos.filter(todo => todo.id !== id))}
              selectedTaskIndex={selectedTaskIndex}
              className="space-y-4"
            />
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
    </div>
  );
}
