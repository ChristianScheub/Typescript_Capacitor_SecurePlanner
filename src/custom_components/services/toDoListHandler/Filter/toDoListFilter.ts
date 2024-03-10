import { ToDoList } from "../../../types/ToDoList.types";
import { Priority } from "../../../enums/priority.enum";
import { getTodayWithoutHours } from "../../formatDate/formatDate";

export const filterToDoListByNextXDays = (
  toDoList: ToDoList,
  numOfDays: number
) => {
  const currentDate = getTodayWithoutHours();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + numOfDays);

  const filteredToDoItems = toDoList.toDoItem.filter((item) => {
    const itemEndDate = new Date(item.toDoEndDate);
    itemEndDate.setHours(0, 0, 0, 0);
    return itemEndDate >= currentDate && itemEndDate <= futureDate;
  });

  return {
    ...toDoList,
    toDoItem: filteredToDoItems,
  };
};

export const filterToDoListByPriority = (
  toDoList: ToDoList,
  priorities: Priority[]
) => {
  const filteredToDoItems = toDoList.toDoItem.filter((item) => {
    return priorities.includes(item.toDoPriority);
  });

  return {
    ...toDoList,
    toDoItem: filteredToDoItems,
  };
};

export const filterToDoListByCategory = (
  toDoList: ToDoList,
  category: string
) => {
  const filteredToDoItems = toDoList.toDoItem.filter((item) => {
    return item.toDoCategorie === category;
  });

  return {
    ...toDoList,
    toDoItem: filteredToDoItems,
  };
};
