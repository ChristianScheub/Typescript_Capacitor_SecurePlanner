import { render, screen, fireEvent } from '@testing-library/react';
import ProgressBarScreen from './progressBarScreen';
import { ProgressBarProps } from '../progressBar/progressBar'; // Importieren Sie die richtigen Prop-Typen
import { ProgressBarCategoryMenuProps } from './progressBarMenu'; // Importieren Sie die richtigen Prop-Typen

import '@testing-library/jest-dom';

vi.mock("../progressBar/progressBar", () => ({
  default: (props: ProgressBarProps) => (
    <div data-testid="progress-bar" onClick={() => props.onClick()}>{props.title}</div>
  )
}));
  
vi.mock("./progressBarMenu", () => ({
  default: (props: ProgressBarCategoryMenuProps) => (
    <div data-testid="progress-bar-menu">{props.categoriesList.map((category: string) => (
      <div key={category} data-testid="category-item" onClick={() => props.handleProgressBarClick(category)}>{category}</div>
    ))}</div>
  )
}));

describe('ProgressBarScreen', () => {
  const mockHandleFilterList = vi.fn();
  const categoriesList = ['total', 'today', '7Days', 'Priority'];

  beforeEach(() => {
    render(
      <ProgressBarScreen
        progressOverall={80}
        progressToday={60}
        progressNext7Days={70}
        progressHighPriority={90}
        categoriesList={categoriesList}
        getCategoryProgress={() => 50}
        handleFilterList={mockHandleFilterList}
      />
    );
  });

  it('renders progress bars and categories menu', () => {
    expect(screen.getAllByTestId("progress-bar").length).toBe(4)
    expect(screen.getByTestId("progress-bar-menu")).toBeInTheDocument();
    categoriesList.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('handles progress bar clicks and filters correctly', () => {
    fireEvent.click(screen.getByText("total"));
    expect(mockHandleFilterList).toHaveBeenCalledWith("total");

    fireEvent.click(screen.getByText("today"));
    expect(mockHandleFilterList).toHaveBeenCalledWith("today");
  });

  it('highlights the active category in the categories menu', () => {
    fireEvent.click(screen.getByText("7Days"));
    expect(screen.getByTestId("progress-bar-menu")).toHaveTextContent("7Days");
  });
});
