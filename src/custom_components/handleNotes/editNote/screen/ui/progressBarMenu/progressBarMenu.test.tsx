import { act, render, screen } from "@testing-library/react";
import ProgressBarCategoryMenu from "./progressBarMenu";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("ProgressBarCategoryMenu", () => {
  const mockHandleProgressBarClick = jest.fn();
  const mockGetCategoryProgress = jest.fn().mockReturnValue(50);
  const categoriesList = ["Category 1", "Category 2", "Category 3"];
  const activeTooltip = "Category 1";
  const highlightedId = "Category 2";

  beforeEach(() => {});

  it("renders categories and allows interaction", () => {
    render(
      <ProgressBarCategoryMenu
        categoriesList={categoriesList}
        getCategoryProgress={mockGetCategoryProgress}
        handleProgressBarClick={mockHandleProgressBarClick}
        activeTooltip={activeTooltip}
        highlightedId={highlightedId}
      />
    );
    expect(screen.getByText("Progress per Category"));
  });

  it("should change arrow Icon to Up/Down when it is clicked", async () => {
    const mockHandleProgressBarClick = jest.fn();
    const categories = ["Category 1", "Category 2"];

    render(
      <ProgressBarCategoryMenu
        categoriesList={categories}
        getCategoryProgress={() => 0}
        handleProgressBarClick={mockHandleProgressBarClick}
        activeTooltip={null}
        highlightedId={null}
      />
    );
    expect(screen.getByTestId("progressBarArrowIcon")).toHaveClass(
      "progressBarArrowIconDown"
    );
    act(() => {
      userEvent.click(screen.getByText("Progress per Category"));
    });
    expect(screen.getByTestId("progressBarArrowIcon")).toHaveClass(
      "progressBarArrowIconUp"
    );
    act(() => {
      userEvent.click(screen.getByText("Progress per Category"));
    });
    expect(screen.getByTestId("progressBarArrowIcon")).toHaveClass(
      "progressBarArrowIconDown"
    );
  });

  it("shows the category list by click", async () => {
    const mockHandleProgressBarClick = jest.fn();
    const categories = ["Category 1", "Category 2"];

    render(
      <ProgressBarCategoryMenu
        categoriesList={categories}
        getCategoryProgress={() => 0}
        handleProgressBarClick={mockHandleProgressBarClick}
        activeTooltip={null}
        highlightedId={null}
      />
    );
    act(() => {
      userEvent.click(screen.getByText("Progress per Category"));
    });

    const progressBars = document.querySelectorAll(
      ".progressBarContainerStyle"
    );
    userEvent.click(progressBars[0]);

    expect(mockHandleProgressBarClick).toHaveBeenCalledWith(categories[0]);
  });
});
