import Container_EditTodo from "./container-editToDo";
import { BrowserRouter as Router } from "react-router-dom";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import React from "react";

import { useNavigate, useParams } from "react-router-dom";
import ToDoListService from "../../services/toDoListHandler/toDoListHandler";
import { ToDoList } from "../../types/ToDoList.types";
import { ToDoItem } from "../../types/ToDoItem.types";
import { Priority as PriorityEnum } from "../../../modules/ui/editToDo/priorityIndicator/priority.enum";

jest.mock("../../services/toDoListHandler/toDoListHandler", () => ({
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
      <Container_EditTodo encryptionKey="testKey" />
    </Router>
  );

describe("Container_EditTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(useParams)
      .mockReturnValue({ noteId: "testNoteId", toDoItemId: "testToDoItemId" });
  });

  it("renders without errors", () => {
    renderContainerEditToDo();
  });

  it("renders the View_EditTodo component", () => {
    renderContainerEditToDo();
    expect(screen.getByTestId("noteTitleTest")).toBeInTheDocument();
  });

  it("should call navigate when save click", async () => {
    const mockNavigate = jest.fn();
    jest.mocked(useNavigate).mockImplementation(() => mockNavigate);

    await act(async () => {
      renderContainerEditToDo();
    });
    expect(screen.getByTestId("noteTitleTest")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByTestId("floating-btn"));
    });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(useParams)
      .mockReturnValue({ noteId: "testNoteId", toDoItemId: "testToDoItemId" });
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

    //The first time the component is called up, the retrieved data is also saved directly because of the onChange
    await waitFor(() => {
      expect(mockSaveToDoList).toHaveBeenCalled();
    });

    const descInput = screen.getByTestId("noteTextTest");
    fireEvent.change(descInput, { target: { value: "New Description" } });
    expect(mockSaveToDoList).toHaveBeenCalledTimes(2);
  });
});
