import { render, screen, fireEvent } from "@testing-library/react";
import View_EditTodo from "./screen-editToDo";
import { Priority } from "../../../modules/ui/editToDo/priorityIndicator/priority.enum";

describe("View_EditTodo Component", () => {
  const mockUpdateToDoItem = jest.fn();
  const mockOnHandleSave = jest.fn();

  beforeEach(() => {
    mockUpdateToDoItem.mockClear();
    mockOnHandleSave.mockClear();
  });

  const testProps = {
    title: "Test Title",
    desc: "Test Description",
    endDate: new Date(),
    selectedPriority: Priority.High,
    translatedPrio: "High",
    updateToDoItem: mockUpdateToDoItem,
    onHandleSave: mockOnHandleSave,
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

  it("calls onHandleSave when save button is clicked", () => {
    render(<View_EditTodo {...testProps} />);
    const saveButton = screen.getByTestId("floating-btn");
    fireEvent.click(saveButton);
    expect(mockOnHandleSave).toHaveBeenCalledTimes(1);
  });
});