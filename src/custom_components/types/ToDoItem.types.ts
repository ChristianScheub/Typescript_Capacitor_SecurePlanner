import { Priority } from "../enums/priority.enum";

export interface ToDoItem {
  toDoId?: number;
  toDoPriority: Priority;
  toDoTitle: string;
  toDoText: string;
  toDoEndDate: Date;
  toDoDone: boolean;
  toDoCategorie: string;
}
