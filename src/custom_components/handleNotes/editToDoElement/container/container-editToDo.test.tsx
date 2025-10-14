import ContainerEditTodo from "./container-editToDo";
import { BrowserRouter as Router } from "react-router-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import React from "react";
import ToDoListService from "../../../services/toDoListHandler/toDoListHandler";
import { ToDoList } from "../../../types/ToDoList.types";

vi.mock("../../../services/toDoListHandler/toDoListHandler", () => ({
  loadToDoList: vi.fn(),
  saveToDoList: vi.fn() as MockInstance<
    Promise<void>,
    [ToDoList, string, string?]
  >,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("react-router-dom", () => ({
  ...await vi.importActual("react-router-dom"),
  useNavigate: vi.fn(),
  useParams: vi.fn(),
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
    vi.clearAllMocks();
  });

  it("renders without errors", () => {
    renderContainerEditToDo();
  });

  it("renders the ViewEditTodo component", () => {
    renderContainerEditToDo();
    expect(screen.getByTestId("noteTitleTest")).toBeInTheDocument();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.fn().mockReturnValue({ noteId: "testNoteId", toDoItemId: 3 });
  });

  it("should load and decrypt note on mount", async () => {
    const mockLoadToDoList = vi.spyOn(ToDoListService, "loadToDoList");
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
    const mockSaveToDoList = vi.spyOn(ToDoListService, "saveToDoList");
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
