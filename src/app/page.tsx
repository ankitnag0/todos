"use client"

import * as React from "react"
import { TodoList } from "@/components/ui/todo-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AddTaskModal } from "@/components/add-task-modal";
import { ModeToggle } from "@/components/mode-toggle";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

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
  ]);
  
  const [selectedTaskIndex, setSelectedTaskIndex] = React.useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const handleToggle = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    // Adjust selected index if necessary
    if (todos.length > 1 && selectedTaskIndex >= todos.length - 1) {
      setSelectedTaskIndex(todos.length - 2);
    }
  };
  
  const handleAddTask = (title: string) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
    };
    setTodos([...todos, newTask]);
    // Select the newly added task
    setSelectedTaskIndex(todos.length);
  };

  const remainingTasks = todos.filter(todo => !todo.completed).length;
  
  // Use our custom keyboard shortcuts hook
  useKeyboardShortcuts({
    selectedTaskIndex,
    todos,
    setSelectedTaskIndex,
    handleToggle,
    handleDelete,
    setIsAddModalOpen,
  });

  return (
    <div className="min-h-screen bg-background p-8" tabIndex={-1}>
      <ModeToggle />
      <div className="max-w-md mx-auto pt-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">My Tasks</CardTitle>
            <CardDescription>
              {remainingTasks} {remainingTasks === 1 ? 'task' : 'tasks'} remaining
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TodoList 
              todos={todos} 
              onToggle={handleToggle}
              onDelete={handleDelete}
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
          handleAddTask(title);
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}
