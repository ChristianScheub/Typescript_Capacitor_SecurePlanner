import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import DatePickerComponent from "./dataPicker";

describe("DatePickerComponent", () => {
  it("should render correctly with given date", async () => {
    const mockOnDateChange = jest.fn();
    const selectedDate = new Date("2023-01-01");
    const { container } = render(
      <DatePickerComponent
        selectedDate={selectedDate}
        onDateChange={mockOnDateChange}
      />
    );
    const formattedDate = selectedDate.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    expect(container).toHaveTextContent(formattedDate);
  });
});