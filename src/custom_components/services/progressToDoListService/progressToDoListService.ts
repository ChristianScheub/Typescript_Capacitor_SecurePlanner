import { ToDoItem } from "../../types/ToDoItem.types";

export interface ProgressToDoListService {
  calculateProgressForNextNDays: (items: ToDoItem[], days: number) => number;
  isNextNDays: (dateInput: Date | string, days: number) => boolean;
  calculateProgress: (
    toDoItems: ToDoItem[],
    predicate: (item: ToDoItem) => Boolean,
    totalPredicate?: (item: ToDoItem) => Boolean
  ) => number;
}

const progressToDoListService: ProgressToDoListService = {
  isNextNDays: (dateInput: Date | string, days: number): boolean => {
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

  calculateProgressForNextNDays: (items: ToDoItem[], days: number): number => {
    const isNextNDaysPredicate = (item: ToDoItem): boolean => {
      return (
        item.toDoDone &&
        progressToDoListService.isNextNDays(item.toDoEndDate, days)
      );
    };
    const isNextNDaysPredicateTotal = (item: ToDoItem): boolean => {
      return progressToDoListService.isNextNDays(item.toDoEndDate, days);
    };
    return progressToDoListService.calculateProgress(
      items,
      isNextNDaysPredicate,
      isNextNDaysPredicateTotal
    );
  },

  calculateProgress: (
    toDoItems: ToDoItem[],
    predicate: (item: ToDoItem) => Boolean,
    totalPredicate?: (item: ToDoItem) => Boolean
  ): number => {
    if (!Array.isArray(toDoItems)) {
      return 100;
    }
    const useTotalPredicate = totalPredicate || (() => true);
    const relevantItems = toDoItems.filter(useTotalPredicate);
    const doneItems = relevantItems.filter(predicate);

    const totalItemsLength = relevantItems.length;
    const totalDoneItems = doneItems.length;
    return totalItemsLength > 0
      ? Math.round((totalDoneItems / totalItemsLength) * 1000) / 10
      : 100;
  },
};

export default progressToDoListService;