import { render, fireEvent, screen, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import PrioritySlider from "./priorityIndicator";
import { Priority } from "../../../../../enums/priority.enum";

const mockOnPriorityChange = vi.fn();

interface RenderPrioritySliderProps {
  selectedPriority: Priority;
}

const renderPrioritySlider = ({ selectedPriority }: RenderPrioritySliderProps): RenderResult => {
  return render(
    <PrioritySlider
      selectedPriority={selectedPriority}
      onPriorityChange={mockOnPriorityChange}
    />
  );
};

describe("PrioritySlider Component", () => {
  

  beforeEach(() => {
    vi.clearAllMocks();
  });


  test("initializes slider value based on selectedPriority", () => {
    renderPrioritySlider({ selectedPriority: Priority.High });
    expect(screen.getByRole("slider")).toHaveValue("50");
  });

  test("calls onPriorityChange with correct value when slider changes", () => {
    renderPrioritySlider({ selectedPriority: Priority.Low });
    fireEvent.change(screen.getByRole("slider"), { target: { value: "70" } });
    expect(mockOnPriorityChange).toHaveBeenCalledWith(
      "toDoPriority",
      Priority.Highest
    );
  });

  test("updates slider value when selectedPriority prop changes", () => {
    const { rerender } = renderPrioritySlider({ selectedPriority: Priority.Low });
    rerender(
      <PrioritySlider
        selectedPriority={Priority.Middle}
        onPriorityChange={mockOnPriorityChange}
      />
    );
    expect(screen.getByRole("slider")).toHaveValue("30");
  });

  test("calls onPriorityChange with correct value when slider changes to a valid priority value", () => {
    renderPrioritySlider({ selectedPriority: Priority.Low });
    fireEvent.change(screen.getByRole("slider"), { target: { value: "70" } });
    expect(mockOnPriorityChange).toHaveBeenCalledWith(
      "toDoPriority",
      Priority.Highest
    );
  });

  test("does not call onPriorityChange for invalid slider values not mapped to priorities", () => {
    renderPrioritySlider({ selectedPriority: Priority.Low });
    fireEvent.change(screen.getByRole("slider"), { target: { value: "999" } });
    expect(mockOnPriorityChange).not.toHaveBeenCalled();
  });
});