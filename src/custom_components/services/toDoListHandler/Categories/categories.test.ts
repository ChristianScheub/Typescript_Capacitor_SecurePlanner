import { Priority } from "../../../enums/priority.enum";
import { ToDoList } from "../../../types/ToDoList.types";
import { getCategories } from "./categories";

describe("getCategories", () => {
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
      },
    ],
  };

  test("get Categories count empty list", () => {
    const result = getCategories(mockToDoList);
    expect(result.length).toBe(2);
  });
});