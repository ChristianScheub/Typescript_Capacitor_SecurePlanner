import { ToDoList } from "../../types/ToDoList.types";
import { Priority } from "../../../modules/ui/editToDo/priorityIndicator/priority.enum";

export interface IToDoListService {
  loadAllToDoLists: (
    encryptionKey: string
  ) => Promise<Array<[ToDoList, string]> | null>;
  loadToDoList: (
    noteId: string,
    encryptionKey: string
  ) => Promise<ToDoList | null>;
  saveToDoList: (
    note: ToDoList,
    encryptionKey: string,
    noteId?: string
  ) => Promise<void>;
  sortToDoList: (toDoList: ToDoList) => ToDoList;
  filterToDoListByNextXDays: (toDoList: ToDoList,numOfDays: number) => ToDoList;
  filterToDoListByPriority: (toDoList: ToDoList, priorities: Priority[]) => ToDoList;
  filterToDoListByCategory: (toDoList: ToDoList, category: string) => ToDoList;
}
