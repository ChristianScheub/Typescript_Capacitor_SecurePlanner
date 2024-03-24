
import { ToDoList } from "../../../types/ToDoList.types";
import { Priority } from "../../../enums/priority.enum";
import {
  filterToDoListByNextXDays,
  filterToDoListByPriority,
  filterToDoListByCategory,
} from "./toDoListFilter";

describe("toDoListFilter", () => {
  const toDoItemsData = [
    { title: "1", endDate: "2024-01-02", categorie: "Work", done: false, priority: Priority.Middle },
    { title: "2", endDate: "2024-01-03", categorie: "Home", done: true, priority: Priority.Highest },
    { title: "3", endDate: "2024-01-03", categorie: "Work", done: false, priority: Priority.Middle },
    { title: "4", endDate: "2024-03-30", categorie: "", done: false, priority: Priority.Highest },
  ];
  
  const mockToDoList: ToDoList = {
    title: "testTitle",
    date: new Date(),
    content: "Helloooo",
    toDoItem: toDoItemsData.map(({ title, endDate, categorie, done, priority }) => ({
      toDoTitle: title,
      toDoText: "",
      toDoDone: done,
      toDoPriority: priority,
      toDoEndDate: new Date(endDate),
      toDoCategorie: categorie,
    })),
  };
  

  const mockEmptyToDoList: ToDoList = {
    title: "testTitle",
    date: new Date(),
    content: "Helloooo",
    toDoItem: [],
  };
  test("filterToDoListByNextXDays empty list", () => {
    const result = filterToDoListByNextXDays(mockEmptyToDoList, 60);
    expect(result.toDoItem.length).toBe(0);
  });

  test("filterToDoListByNextXDays", () => {
    const result = filterToDoListByNextXDays(mockToDoList, 60);
    expect(result.toDoItem.length).toBe(1);
  });

  test("filterToDoListByNextXDays no match", () => {
    const result = filterToDoListByNextXDays(mockToDoList, -10);
    expect(result.toDoItem.length).toBe(0);
  });

  test("filterToDoListByPriority", () => {
    const result = filterToDoListByPriority(mockToDoList, [
        Priority.High,
        Priority.Highest,
      ]);
    expect(result.toDoItem.length).toBe(2);
  });

  test("filterToDoListByPriority no match", () => {
    const result = filterToDoListByPriority(mockToDoList, [
        Priority.Low
      ]);
    expect(result.toDoItem.length).toBe(0);
  });

  test("filterToDoListByCategory", () => {
    const result = filterToDoListByCategory(mockToDoList, "Work");
    expect(result.toDoItem.length).toBe(2);
  });

  test("filterToDoListByCategory no match", () => {
    const result = filterToDoListByCategory(mockToDoList, "Hello");
    expect(result.toDoItem.length).toBe(0);
  });
});
