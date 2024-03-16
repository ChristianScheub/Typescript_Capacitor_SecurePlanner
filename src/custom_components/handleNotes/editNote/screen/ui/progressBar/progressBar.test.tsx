import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProgressBar from "./progressBar";

describe("ProgressBar Component", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  const testProps = {
    title: "Test Progress",
    infoText: "Info about the progress",
    active: false,
    onClick: jest.fn(),
  };

  it("displays the correct title and progress", () => {
    render(<ProgressBar {...testProps} progress={50} />);

    expect(screen.getByText(/Test Progress: 50%/i)).toBeInTheDocument();
  });

  it("responds to click events", () => {
    render(
      <ProgressBar
        title="Test Progress"
        progress={10}
        infoText="Info about the progress"
        active={false}
        onClick={mockOnClick}
      />
    );
    fireEvent.click(screen.getByText(/Test Progress: 10%/i));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("shows tooltip when active", () => {
    render(
      <ProgressBar
        title="Test Progress"
        progress={50}
        infoText="Info about the progress"
        active={true}
        onClick={mockOnClick}
      />
    );
    expect(screen.getByText(/Info about the progress/i)).toBeInTheDocument();
  });

  it("hides tooltip when not active", () => {
    render(<ProgressBar {...testProps} progress={80} />);
    expect(
      screen.queryByText(/Info about the progress/i)
    ).not.toBeInTheDocument();
  });

  it.each([
    { progress: 80, expectedColor: "#27ae60" }, // Grün für Fortschritte über 75%
    { progress: 65, expectedColor: "#27ae60" }, // Grün für Fortschritte von 65% bis 75%
    { progress: 40, expectedColor: "#e58e26" }, // Orange für Fortschritte von 40% bis unter 65%
    { progress: 10, expectedColor: "#e58e26" }, // Orange für Fortschritte unter 40%
  ])(
    "renders the correct color $expectedColor for progress $progress",
    ({ progress, expectedColor }) => {
      const { getByText } = render(
        <ProgressBar {...testProps} progress={progress} />
      );

      const progressBar = getByText(
        `${testProps.title}: ${progress}%`
      ).nextSibling;
      expect(progressBar).toHaveStyle(`backgroundColor: ${expectedColor}`);
    }
  );
});
