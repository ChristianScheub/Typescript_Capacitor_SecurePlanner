import { ToDoItem } from './ToDoItem.types'; 

export interface ToDoList {
  title: string;
  date: Date;
  content: string;
  toDoItem: ToDoItem[];
}