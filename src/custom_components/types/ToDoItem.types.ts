import { Priority } from '../../modules/ui/editToDo/priorityIndicator/priority.enum';

export interface ToDoItem {
    toDoPriority: Priority;
    toDoTitle: string;
    toDoText: string;
    toDoEndDate: Date;
    toDoDone: Boolean;
    toDoCategorie: string
  }