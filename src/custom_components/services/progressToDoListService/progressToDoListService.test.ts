import { Priority } from "../../enums/priority.enum";
import { ToDoItem } from "../../types/ToDoItem.types";
import progressToDoListService from "./progressToDoListService";

describe("isNextNDays", () => {
  it.each([
    { dateInput: new Date(), days: 1, expected: true },
    { dateInput: new Date(), days: 0, expected: true },
    {
      dateInput: new Date(Date.now() + 24 * 60 * 60 * 1000),
      days: 1,
      expected: true,
    },
    {
      dateInput: new Date(Date.now() - 24 * 60 * 60 * 1000),
      days: 1,
      expected: false,
    },
    {
      dateInput: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      days: 1,
      expected: false,
    },
  ])(
    "returns $expected for dateInput: $dateInput and days: $days",
    ({ dateInput, days, expected }) => {
      expect(progressToDoListService.isNextNDays(dateInput, days)).toBe(
        expected
      );
    }
  );
});

describe("calculateProgressForNextNDays", () => {
  it("calculates progress correctly", () => {
    const items: ToDoItem[] = [
        {
          toDoTitle: "Done",
          toDoText: "",
          toDoDone: true,
          toDoEndDate: new Date(),
          toDoPriority: Priority.High,
          toDoCategorie: "",
        },
        {
          toDoTitle: "Not Done",
          toDoText: "",
          toDoDone: false,
          toDoEndDate: new Date(),
          toDoPriority: Priority.Low,
          toDoCategorie: "",
        },
      ];

    const days = 1;
    const progress = progressToDoListService.calculateProgressForNextNDays(
      items,
      days
    );
    expect(progress).toBe(50);
  });
});

describe("calculateProgress", () => {

    const items: ToDoItem[] = [
        {
          toDoTitle: "Done",
          toDoText: "",
          toDoDone: true,
          toDoEndDate: new Date(),
          toDoPriority: Priority.High,
          toDoCategorie: "",
        },
        {
          toDoTitle: "Not Done",
          toDoText: "",
          toDoDone: false,
          toDoEndDate: new Date(),
          toDoPriority: Priority.Low,
          toDoCategorie: "",
        },
      ];

  it("returns 100 if no items are provided", () => {
    const progress = progressToDoListService.calculateProgress(
      [],
      (item) => item.toDoDone
    );
    expect(progress).toBe(100);
  });

  it("calculates progress based on predicates", () => {
    const predicate = (item: ToDoItem) => item.toDoDone;
    const totalPredicate = () => true;
    const progress = progressToDoListService.calculateProgress(
      items,
      predicate,
      totalPredicate
    );
    expect(progress).toBe(50);
  });

  it("returns 100 if no items match the totalPredicate", () => {
    const predicate = (item: ToDoItem) => item.toDoDone;
    const totalPredicate = (item: ToDoItem) =>
      item.toDoDone && new Date(item.toDoEndDate) > new Date();
    const progress = progressToDoListService.calculateProgress(
      items,
      predicate,
      totalPredicate
    );
    expect(progress).toBe(100);
  });
});
