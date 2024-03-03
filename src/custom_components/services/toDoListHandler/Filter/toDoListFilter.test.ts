
import { ToDoList } from "../../../types/ToDoList.types";
import { Priority } from "../../../../modules/ui/editToDo/priorityIndicator/priority.enum";
import {
  filterToDoListByNextXDays,
  filterToDoListByPriority,
  filterToDoListByCategory,
} from "./toDoListFilter";

describe("toDoListFilter", () => {
  const mockToDoList: ToDoList = {
    title: "testTitle",
    date: new Date(),
    content: "Helloooo",
    toDoItem: [
      {
        toDoTitle: "1",
        toDoText: "",
        toDoDone: false,
        toDoPriority: Priority.Middle,
        toDoEndDate: new Date("2024-01-02"),
        toDoCategorie: "Work",
      },
      {
        toDoTitle: "2",
        toDoText: "",
        toDoDone: true,
        toDoPriority: Priority.Highest,
        toDoEndDate: new Date("2024-01-03"),
        toDoCategorie: "Home",
      },
      {
        toDoTitle: "3",
        toDoText: "",
        toDoDone: false,
        toDoPriority: Priority.Middle,
        toDoEndDate: new Date("2024-01-03"),
        toDoCategorie: "Work",
      },
      {
        toDoTitle: "4",
        toDoText: "",
        toDoDone: false,
        toDoPriority: Priority.Highest,
        toDoEndDate: new Date("2024-03-30"),
        toDoCategorie: "",
      }
    ],
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
