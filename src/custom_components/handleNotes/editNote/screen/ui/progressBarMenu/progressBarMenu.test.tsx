import { render, screen } from "@testing-library/react";
import { act } from 'react';
import ProgressBarCategoryMenu from "./progressBarMenu";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("ProgressBarCategoryMenu", () => {
  const mockHandleProgressBarClick = vi.fn();
  const mockGetCategoryProgress = vi.fn().mockReturnValue(50);
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
    const mockHandleProgressBarClick = vi.fn();
    const categories = ["Category 1", "Category 2"];
    const user = userEvent.setup();

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
    await act(async () => {
      await user.click(screen.getByText("Progress per Category"));
    });
    expect(screen.getByTestId("progressBarArrowIcon")).toHaveClass(
      "progressBarArrowIconUp"
    );
    await act(async () => {
      await user.click(screen.getByText("Progress per Category"));
    });
    expect(screen.getByTestId("progressBarArrowIcon")).toHaveClass(
      "progressBarArrowIconDown"
    );
  });

  it("shows the category list by click", async () => {
    const mockHandleProgressBarClick = vi.fn();
    const categories = ["Category 1", "Category 2"];
    const user = userEvent.setup();

    render(
      <ProgressBarCategoryMenu
        categoriesList={categories}
        getCategoryProgress={() => 0}
        handleProgressBarClick={mockHandleProgressBarClick}
        activeTooltip={null}
        highlightedId={null}
      />
    );
    await act(async () => {
      await user.click(screen.getByText("Progress per Category"));
    });

    const progressBars = document.querySelectorAll(
      ".progressBarContainerStyle"
    );
    await act(async () => {
      await user.click(progressBars[0]);
    });

    expect(mockHandleProgressBarClick).toHaveBeenCalledWith(categories[0]);
  });
});
