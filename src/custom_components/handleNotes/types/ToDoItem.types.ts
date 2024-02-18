import { Priority } from '../editToDoElement/priorityIndicator/priority.enum';

export interface ToDoItem {
    toDoPriority: Priority;
    toDoTitle: string;
    toDoText: string;
    toDoEndDate: Date;
    toDoDone: Boolean;
  }