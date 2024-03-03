import { ToDoList } from "../../../types/ToDoList.types";

export const getCategories = (toDoList: ToDoList) => {
    const categoriesSet = new Set<string>();
    toDoList.toDoItem.forEach((item) => {
      if (item.toDoCategorie && item.toDoCategorie.trim() !== "") {
        categoriesSet.add(item.toDoCategorie);
      }
    });
  
    return (Array.from(categoriesSet));
  };