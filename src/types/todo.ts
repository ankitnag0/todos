export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoList {
  id: string;
  name: string;
  todos: Todo[];
}