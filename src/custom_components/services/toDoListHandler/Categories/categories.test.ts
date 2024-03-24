import { Priority } from "../../../enums/priority.enum";
import { ToDoItem } from "../../../types/ToDoItem.types";
import { getCategories } from "./categories";

describe("getCategories", () => {
  const defaultToDoItem: Omit<ToDoItem, "toDoTitle" | "toDoEndDate"> = {
    toDoText: "",
    toDoDone: false,
    toDoPriority: Priority.Middle,
    toDoCategorie: "",
  };

  const toDoItemsData: Array<
    Partial<ToDoItem> & Pick<ToDoItem, "toDoTitle" | "toDoEndDate">
  > = [
    {
      toDoTitle: "1",
      toDoEndDate: new Date("2024-01-02"),
      toDoCategorie: "Work",
    },
    {
      toDoTitle: "2",
      toDoDone: true,
      toDoPriority: Priority.Highest,
      toDoEndDate: new Date("2024-01-03"),
      toDoCategorie: "Home",
    },
    {
      toDoTitle: "3",
      toDoEndDate: new Date("2024-01-03"),
      toDoCategorie: "Work",
    },
    {
      toDoTitle: "4",
      toDoPriority: Priority.Highest,
      toDoEndDate: new Date("2024-03-30"),
    },
  ];

  const mockToDoList = {
    title: "testTitle",
    date: new Date(),
    content: "Helloooo",
    toDoItem: toDoItemsData.map((item) => ({ ...defaultToDoItem, ...item })),
  };

  test("get Categories count empty list", () => {
    const result = getCategories(mockToDoList);
    expect(result.length).toBe(2);
  });
});
