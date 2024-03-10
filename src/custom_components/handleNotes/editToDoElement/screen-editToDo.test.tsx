import { render, screen, fireEvent } from "@testing-library/react";
import View_EditTodo from "./screen-editToDo";
import { Priority } from "../../enums/priority.enum";

describe("View_EditTodo Component", () => {
  const mockUpdateToDoItem = jest.fn();

  beforeEach(() => {
    mockUpdateToDoItem.mockClear();
  });

  const testProps = {
    title: "Test Title",
    desc: "Test Description",
    endDate: new Date(),
    selectedPriority: Priority.High,
    translatedPrio: "High",
    categorie: "",
    categoriesList: [],
    updateToDoItem: mockUpdateToDoItem
  };

  it("renders the component correctly", () => {
    render(<View_EditTodo {...testProps} />);

    expect(screen.getByTestId("noteTitleTest")).toHaveValue("Test Title");
    expect(screen.getByTestId("noteTextTest")).toHaveValue("Test Description");
  });

  it("calls updateToDoItem when title is changed", () => {
    render(<View_EditTodo {...testProps} />);
    const titleInput = screen.getByTestId("noteTitleTest");
    fireEvent.change(titleInput, { target: { value: "New Title" } });
    expect(mockUpdateToDoItem).toHaveBeenCalledWith("toDoTitle", "New Title");
  });

  it("calls updateToDoItem when description is changed", () => {
    render(<View_EditTodo {...testProps} />);
    const descInput = screen.getByTestId("noteTextTest");
    fireEvent.change(descInput, { target: { value: "New Description" } });
    expect(mockUpdateToDoItem).toHaveBeenCalledWith("toDoText", "New Description");
  });
});