import { act } from 'react';
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ViewNoteContainer from "../container/container-viewNote";

describe("ViewNote Component", () => {

  test("should display hint when no notes are available", async () => {
    localStorage.clear();

    await act(async () => {
      render(
        <Router>
          <ViewNoteContainer
            encryptionKey={"some-encryption-key"}
            searchQuery={""}
          />
        </Router>
      );
    });

    expect(
      screen.getByText("No ToDo lists available yet.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Click here to create a ToDo list!")
    ).toBeInTheDocument();
  });
});
