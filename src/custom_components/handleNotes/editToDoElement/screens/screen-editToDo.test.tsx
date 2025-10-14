import { render, screen, fireEvent } from "@testing-library/react";
import ViewEditTodo from "./screen-editToDo";
import { Priority } from "../../../enums/priority.enum";

describe("ViewEditTodo Component", () => {
  const mockUpdateToDoItem = vi.fn();

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
    render(<ViewEditTodo {...testProps} />);

    expect(screen.getByTestId("noteTitleTest")).toHaveValue("Test Title");
    expect(screen.getByTestId("noteTextTest")).toHaveValue("Test Description");
  });

  it("calls updateToDoItem when title is changed", () => {
    render(<ViewEditTodo {...testProps} />);
    const titleInput = screen.getByTestId("noteTitleTest");
    fireEvent.change(titleInput, { target: { value: "New Title" } });
    expect(mockUpdateToDoItem).toHaveBeenCalledWith("toDoTitle", "New Title");
  });

  it("calls updateToDoItem when description is changed", () => {
    render(<ViewEditTodo {...testProps} />);
    const descInput = screen.getByTestId("noteTextTest");
    fireEvent.change(descInput, { target: { value: "New Description" } });
    expect(mockUpdateToDoItem).toHaveBeenCalledWith("toDoText", "New Description");
  });
});