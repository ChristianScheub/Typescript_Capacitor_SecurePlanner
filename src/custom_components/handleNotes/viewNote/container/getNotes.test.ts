import { sortNotes, filterNotes } from "./getNotes";
import { ToDoListWithKey } from "../../../types/ToDoListKey.types";
import { ToDoList } from "../../../types/ToDoList.types";
import { Priority } from "../../../enums/priority.enum";

describe("sortNotes Function", () => {
  const notes: ToDoListWithKey[] = [
    {
      key: "c",
      toDoList: {
        title: "List C",
        content: "",
        toDoItem: [],
        date: new Date(),
      },
    },
    {
      key: "a",
      toDoList: {
        title: "List A",
        content: "",
        toDoItem: [],
        date: new Date(),
      },
    },
    {
      key: "b",
      toDoList: {
        title: "List B",
        content: "",
        toDoItem: [],
        date: new Date(),
      },
    },
  ];

  it("should sort the notes by key in ascending order", () => {
    const sortedNotes = sortNotes(notes);
    expect(sortedNotes[0].key).toBe("a");
    expect(sortedNotes[1].key).toBe("b");
    expect(sortedNotes[2].key).toBe("c");
  });

  it("should handle an empty array without throwing", () => {
    const sortedNotes = sortNotes([]);
    expect(sortedNotes).toEqual([]);
  });

  it("should correctly handle an array where all keys are the same", () => {
    const sameKeyNotes: ToDoListWithKey[] = [
      {
        key: "a",
        toDoList: {
          title: "List A",
          content: "",
          toDoItem: [],
          date: new Date(),
        },
      },
      {
        key: "a",
        toDoList: {
          title: "List B",
          content: "",
          toDoItem: [],
          date: new Date(),
        },
      },
      {
        key: "a",
        toDoList: {
          title: "List C",
          content: "",
          toDoItem: [],
          date: new Date(),
        },
      },
    ];
    const sortedNotes = sortNotes(sameKeyNotes);
    expect(sortedNotes[0].toDoList.title).toBe("List A");
    expect(sortedNotes[1].toDoList.title).toBe("List B");
    expect(sortedNotes[2].toDoList.title).toBe("List C");
  });

  it("should not modify the original array", () => {
    const originalNotes = [...notes];
    sortNotes(notes);
    expect(notes).toEqual(originalNotes);
  });
});

describe("filterNotes Function", () => {
  const mockNotes: [ToDoList, string][] = [
    [
      {
        title: "Einkaufen",
        content: "Milch und Brot kaufen",
        toDoItem: [
          {
            toDoTitle: "Milch",
            toDoText: "Vollmilch",
            toDoPriority: Priority.High,
            toDoEndDate: new Date(),
            toDoDone: false,
            toDoCategorie: "",
          },
        ],
        date: new Date(),
      },
      "1",
    ],
    [
      {
        title: "Training",
        content: "Lauftraining am Montag",
        toDoItem: [
          {
            toDoTitle: "Laufen",
            toDoText: "5km joggen",
            toDoPriority: Priority.High,
            toDoEndDate: new Date(),
            toDoDone: false,
            toDoCategorie: "",
          },
        ],
        date: new Date(),
      },
      "2",
    ],
  ];

  describe('filterToDos', () => {
    const testCases = [
      { query: "Einkaufen", expectedLength: 1, expectedKey: "1" },
      { query: "Lauftraining", expectedLength: 1, expectedKey: "2" },
      { query: "Milch", expectedLength: 1, expectedKey: "1" },
      { query: "Schwimmen", expectedLength: 0, expectedKey: null },
    ];
  
    test.each(testCases)(
      "should filter notes correctly for query '$query'",
      ({ query, expectedLength, expectedKey }) => {
        const filteredNotes = filterNotes(mockNotes, query);
        expect(filteredNotes.length).toBe(expectedLength);
        if (expectedLength > 0) {
          expect(filteredNotes[0].key).toBe(expectedKey);
        } else {
          expect(filteredNotes).toEqual([]);
        }
      }
    );
  });
  
});