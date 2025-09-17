"use client"

import * as React from "react"
import { TodoList } from "@/components/ui/todo-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AddTaskModal } from "@/components/add-task-modal";
import { ModeToggle } from "@/components/mode-toggle";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { getCycledTodoListName } from "@/lib/todo-list-names";

export default function Home() {
  // Hard-coded todos data
  const [todos, setTodos] = React.useState([
    {
      id: "1",
      title: "Learn Next.js 15",
      completed: true,
    },
    {
      id: "2",
      title: "Build a todo app with shadcn/ui",
      completed: true,
    },
    {
      id: "3",
      title: "Deploy to Vercel",
      completed: false,
    },
    {
      id: "4",
      title: "Add animations and transitions",
      completed: false,
    },
    {
      id: "5",
      title: "Write documentation",
      completed: false,
    },
    {
      id: "6",
      title: "Add unit tests",
      completed: false,
    },
    {
      id: "7",
      title: "Optimize performance",
      completed: false,
    },
    {
      id: "8",
      title: "Add dark mode",
      completed: true,
    },
    {
      id: "9",
      title: "Implement keyboard shortcuts",
      completed: true,
    },
    {
      id: "10",
      title: "Add virtual scrolling",
      completed: false,
    },
  ]);
  
  const [selectedTaskIndex, setSelectedTaskIndex] = React.useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [todoListName, setTodoListName] = React.useState<string | null>(null);
  const [isClient, setIsClient] = React.useState(false);

  // Initialize and update the todo list name based on visit count
  React.useEffect(() => {
    setIsClient(true);
    
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
  }, []);

  const remainingTasks = todos.filter(todo => !todo.completed).length;
  
  // Use our custom keyboard shortcuts hook
  useKeyboardShortcuts({
    selectedTaskIndex,
    todos,
    setTodos,
    setSelectedTaskIndex,
    setIsAddModalOpen,
  });

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center" tabIndex={-1}>
      <ModeToggle />
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl min-h-[2rem]">
              {isClient && todoListName ? todoListName : <span className="invisible">Placeholder</span>}
            </CardTitle>
            <CardDescription>
              {remainingTasks} {remainingTasks === 1 ? 'task' : 'tasks'} remaining
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TodoList 
              todos={todos} 
              onToggle={(id) => setTodos(todos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
              ))}
              onDelete={(id) => setTodos(todos.filter(todo => todo.id !== id))}
              selectedTaskIndex={selectedTaskIndex}
              className="space-y-3"
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
    </div>
  );
}
