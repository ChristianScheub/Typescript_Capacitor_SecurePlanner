import ContainerEditTodo from "./container-editToDo";
import { BrowserRouter as Router } from "react-router-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import React from "react";
import ToDoListService from "../../../services/toDoListHandler/toDoListHandler";
import { ToDoList } from "../../../types/ToDoList.types";

jest.mock("../../../services/toDoListHandler/toDoListHandler", () => ({
  loadToDoList: jest.fn(),
  saveToDoList: jest.fn() as jest.Mock<
    Promise<void>,
    [ToDoList, string, string?]
  >,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

const renderContainerEditToDo = () =>
  render(
    <Router>
      <ContainerEditTodo
        encryptionKey="testKey"
        noteId="testNoteId"
        toDoItemId={3}
      />
    </Router>
  );

describe("ContainerEditTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without errors", () => {
    renderContainerEditToDo();
  });

  it("renders the ViewEditTodo component", () => {
    renderContainerEditToDo();
    expect(screen.getByTestId("noteTitleTest")).toBeInTheDocument();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.fn().mockReturnValue({ noteId: "testNoteId", toDoItemId: 3 });
  });

  it("should load and decrypt note on mount", async () => {
    const mockLoadToDoList = jest.spyOn(ToDoListService, "loadToDoList");
    jest
      .spyOn(React, "useEffect")
      .mockImplementationOnce((callback) => callback());

    renderContainerEditToDo();

    expect(mockLoadToDoList).toHaveBeenCalledWith(
      expect.any(String),
      "testKey"
    );
  });

  it("should save to-do item on change", async () => {
    const mockSaveToDoList = jest.spyOn(ToDoListService, "saveToDoList");
    jest
      .spyOn(React, "useEffect")
      .mockImplementationOnce((callback) => callback());

    renderContainerEditToDo();
    await waitFor(() => {
      expect(screen.getByTestId("noteTextTest")).toBeInTheDocument();
    });
    const descInput = screen.getByTestId("noteTextTest");

    fireEvent.change(descInput, { target: { value: "New Description" } });

    await waitFor(() => {
      expect(mockSaveToDoList).toHaveBeenCalledTimes(1);
    });
  });
});
