import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PrioritySlider from "./priorityIndicator";
import { Priority } from "../../../../enums/priority.enum";

describe("PrioritySlider Component", () => {
  const mockOnPriorityChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("initializes slider value based on selectedPriority", () => {
    render(
      <PrioritySlider
        selectedPriority={Priority.High}
        onPriorityChange={mockOnPriorityChange}
      />
    );
    expect(screen.getByRole("slider")).toHaveValue("50");
  });

  test("calls onPriorityChange with correct value when slider changes", () => {
    render(
      <PrioritySlider
        selectedPriority={Priority.Low}
        onPriorityChange={mockOnPriorityChange}
      />
    );
    fireEvent.change(screen.getByRole("slider"), { target: { value: "70" } });
    expect(mockOnPriorityChange).toHaveBeenCalledWith(
      "toDoPriority",
      Priority.Highest
    );
  });

  test("updates slider value when selectedPriority prop changes", () => {
    const { rerender } = render(
      <PrioritySlider
        selectedPriority={Priority.Low}
        onPriorityChange={mockOnPriorityChange}
      />
    );
    rerender(
      <PrioritySlider
        selectedPriority={Priority.Middle}
        onPriorityChange={mockOnPriorityChange}
      />
    );
    expect(screen.getByRole("slider")).toHaveValue("30");
  });

  test("calls onPriorityChange with correct value when slider changes to a valid priority value", () => {
    render(
      <PrioritySlider
        selectedPriority={Priority.Low}
        onPriorityChange={mockOnPriorityChange}
      />
    );
    fireEvent.change(screen.getByRole("slider"), { target: { value: "70" } });
    expect(mockOnPriorityChange).toHaveBeenCalledWith(
      "toDoPriority",
      Priority.Highest
    );
  });

  test("does not call onPriorityChange for invalid slider values not mapped to priorities", () => {
    render(
      <PrioritySlider
        selectedPriority={Priority.Low}
        onPriorityChange={mockOnPriorityChange}
      />
    );
    fireEvent.change(screen.getByRole("slider"), { target: { value: "999" } });
    expect(mockOnPriorityChange).not.toHaveBeenCalled();
  });
});
