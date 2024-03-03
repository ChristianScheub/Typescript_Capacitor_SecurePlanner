import { Priority } from "../../modules/ui/editToDo/priorityIndicator/priority.enum";

export interface ToDoItem {
  toDoId?: number;
  toDoPriority: Priority;
  toDoTitle: string;
  toDoText: string;
  toDoEndDate: Date;
  toDoDone: Boolean;
  toDoCategorie: string;
}
