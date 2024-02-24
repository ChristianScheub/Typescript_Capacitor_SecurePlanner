import { useState } from "react";
import ToDoListService from "../../services/toDoListHandler/toDoListHandler";
import { ToDoList } from "../../types/ToDoList.types";
import {
  encryptAndStore,
  decryptFromStorage,
} from "../encryptionEngine/encryptionEngine";
import { Priority } from "../../../modules/ui/editToDo/priorityIndicator/priority.enum";

jest.mock("../encryptionEngine/encryptionEngine");

describe("loadAllToDoLists", () => {
  beforeEach(() => {
    localStorage.clear();
    (decryptFromStorage as jest.Mock).mockClear();
  });

  it("should load all to-do lists successfully", async () => {
    localStorage.setItem("note1", "encryptedData1");
    (decryptFromStorage as jest.Mock).mockImplementation(() =>
      Promise.resolve('{"title":"Test","content":"Content"}')
    );
    const result = await ToDoListService.loadAllToDoLists("dummyKey");
    expect(result).toHaveLength(1);
    expect(decryptFromStorage).toHaveBeenCalledTimes(1);
  });

  it("should handle errors gracefully", async () => {
    localStorage.setItem("note2", "encryptedData2");
    (decryptFromStorage as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error("Decryption failed"))
    );

    const result = await ToDoListService.loadAllToDoLists("dummyKey");
    expect(result).toEqual([]);
    expect(decryptFromStorage).toHaveBeenCalledTimes(1);
  });
});

const toDoList: ToDoList = {
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
    },
    {
      toDoTitle: "2",
      toDoText: "",
      toDoDone: true,
      toDoPriority: Priority.Highest,
      toDoEndDate: new Date("2024-01-03"),
    },
    {
      toDoTitle: "3",
      toDoText: "",
      toDoDone: false,
      toDoPriority: Priority.Middle,
      toDoEndDate: new Date("2024-01-03"),
    },
    {
      toDoTitle: "4",
      toDoText: "",
      toDoDone: false,
      toDoPriority: Priority.Highest,
      toDoEndDate: new Date("2024-02-03"),
    },
    {
      toDoTitle: "5",
      toDoText: "",
      toDoDone: false,
      toDoPriority: Priority.Low,
      toDoEndDate: new Date("2024-01-03"),
    },
    {
      toDoTitle: "6",
      toDoText: "",
      toDoDone: false,
      toDoPriority: Priority.Low,
      toDoEndDate: new Date("2024-02-03"),
    },
    {
      toDoTitle: "7",
      toDoText: "",
      toDoDone: false,
      toDoPriority: Priority.Low,
      toDoEndDate: new Date("2024-02-03"),
    },
    {
      toDoTitle: "8",
      toDoText: "",
      toDoDone: true,
      toDoPriority: Priority.Low,
      toDoEndDate: new Date("2024-02-03"),
    },
    {
      toDoTitle: "9",
      toDoText: "",
      toDoDone: false,
      toDoPriority: Priority.Low,
      toDoEndDate: new Date("2024-02-03"),
    },
  ],
};

describe("saveToDoList", () => {
  let mockedEncryptAndStore: jest.Mock;

  beforeEach(() => {
    localStorage.clear();
    (encryptAndStore as jest.Mock).mockClear();
    mockedEncryptAndStore = encryptAndStore as jest.Mock;
    mockedEncryptAndStore.mockClear();
  });

  it("saves a to-do list successfully", async () => {
    (encryptAndStore as jest.Mock).mockResolvedValue(undefined);

    await ToDoListService.saveToDoList(toDoList, "dummyKey", "todo_1");
    expect(encryptAndStore).toHaveBeenCalledWith(
      JSON.stringify(toDoList),
      "dummyKey",
      "todo_1"
    );
  });

  it("generates an ID if none is provided", async () => {
    (encryptAndStore as jest.Mock).mockResolvedValue(undefined);

    await ToDoListService.saveToDoList(toDoList, "dummyKey");
    expect(encryptAndStore).toHaveBeenCalled();
    const callArg = mockedEncryptAndStore.mock.calls[0][2];
    expect(callArg).not.toBeUndefined();
    expect(callArg).not.toBe("todo_1"); // Assuming 'todo_1' is a known ID, ensure a new one is generated
  });

  it("handles encryption failures gracefully", async () => {
    (encryptAndStore as jest.Mock).mockRejectedValue(
      new Error("Encryption failed")
    );

    await expect(
      ToDoListService.saveToDoList(toDoList, "dummyKey")
    ).resolves.toBeUndefined();
  });
});

describe("sortToDoList", () => {
  it("sorts to-do items based on completion and priority", () => {
    const sorted = ToDoListService.sortToDoList(toDoList);
    expect(sorted.toDoItem[0].toDoTitle).toBe("4");
    expect(sorted.toDoItem[1].toDoTitle).toBe("1");
    expect(sorted.toDoItem[2].toDoTitle).toBe("3");
    expect(sorted.toDoItem[3].toDoTitle).toBe("5");
    expect(sorted.toDoItem[7].toDoTitle).toBe("8"); //Done Elements at the end but sorted by date
    expect(sorted.toDoItem[8].toDoTitle).toBe("2"); //Done Elements at the end but sorted by date
  });
});
