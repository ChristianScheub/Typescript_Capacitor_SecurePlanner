import { ToDoItem } from "../../types/ToDoItem.types";

export interface ProgressToDoListService {
  isToday: (dateInput: Date | string) => Boolean;
  isNextNDays: (dateInput: Date | string, days: number) => Boolean;
  calculateProgress: (
    toDoItems: ToDoItem[],
    predicate: (item: ToDoItem) => Boolean,
    totalPredicate?: (item: ToDoItem) => Boolean
  ) => number;
}

const progressToDoListService: ProgressToDoListService = {
  isToday: (dateInput: Date | string): Boolean => {
    const dateToDo = new Date(dateInput);
    const dateToDoWithoutTime = new Date(
      dateToDo.getFullYear(),
      dateToDo.getMonth(),
      dateToDo.getDate()
    );
    const today = new Date();
    const todayWithoutTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    return todayWithoutTime === dateToDoWithoutTime;
  },

  isNextNDays: (dateInput: Date | string, days: number): Boolean => {
    const dateToDo = new Date(dateInput);
    const today = new Date();
    const nextNDays = new Date();
    nextNDays.setDate(new Date().getDate() + days);
    const dateOfToDo = new Date(
      dateToDo.getFullYear(),
      dateToDo.getMonth(),
      dateToDo.getDate()
    );
    const dateOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const nextNDaysWithoutTime = new Date(
      nextNDays.getFullYear(),
      nextNDays.getMonth(),
      nextNDays.getDate()
    );
    return dateOfToDo <= nextNDaysWithoutTime && dateOfToDo >= dateOfToday;
  },

  calculateProgress: (
    toDoItems: ToDoItem[],
    predicate: (item: ToDoItem) => Boolean,
    totalPredicate?: (item: ToDoItem) => Boolean
  ): number => {
    const useTotalPredicate = totalPredicate || (() => true);
    const relevantItems = toDoItems.filter(useTotalPredicate);
    const doneItems = relevantItems.filter(predicate);

    const totalItemsLength = relevantItems.length;
    const totalDoneItems = doneItems.length;

    return totalItemsLength > 0
      ? Math.round((totalDoneItems / totalItemsLength) * 1000) / 10
      : 0;
  },
};

export default progressToDoListService;
