import { ToDoList } from "../../../types/ToDoList.types";
import { Priority } from "../../../enums/priority.enum";

export const sortToDoList = (toDoList: ToDoList): ToDoList => {

  return {
    ...toDoList,
    toDoItem: [...toDoList.toDoItem].sort((a, b) => {
      if (a.toDoDone && !b.toDoDone) {
        return 1; // Verschiebe erledigte To-Dos nach hinten
      } else if (!a.toDoDone && b.toDoDone) {
        return -1; // Verschiebe nicht-erledigte To-Dos nach vorne
      } else if (
        !a.toDoDone &&
        !b.toDoDone &&
        a.toDoPriority === Priority.Highest &&
        b.toDoPriority !== Priority.Highest
      ) {
        return -1; // Nicht erledigte To-Dos mit höchster Priorität nach vorne
      } else if (
        !a.toDoDone &&
        !b.toDoDone &&
        b.toDoPriority === Priority.Highest &&
        a.toDoPriority !== Priority.Highest
      ) {
        return 1; // Nicht erledigte To-Dos mit höchster Priorität nach vorne
      } else if (a.toDoDone && b.toDoDone) {
        // Sortiere erledigte To-Dos nach dem Enddatum (neuestes zuerst)
        return (
          new Date(b.toDoEndDate).getTime() -
          new Date(a.toDoEndDate).getTime()
        );
      } else {
        // Sortiere nach dem Enddatum
        return (
          new Date(a.toDoEndDate).getTime() -
          new Date(b.toDoEndDate).getTime()
        );
      }
    }),
  };
};